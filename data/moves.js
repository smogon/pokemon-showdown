/*

List of flags and their descriptions:

authentic: Ignores a target's substitute.
bite: Power is multiplied by 1.5 when used by a Pokemon with the Ability Strong Jaw.
bullet: Has no effect on Pokemon with the Ability Bulletproof.
charge: The user is unable to make a move between turns.
contact: Makes contact.
defrost: Thaws the user if executed successfully while the user is frozen.
distance: Can target a Pokemon positioned anywhere in a Triple Battle.
gravity: Prevented from being executed or selected during Gravity's effect.
heal: Prevented from being executed or selected during Heal Block's effect.
mirror: Can be copied by Mirror Move.
nonsky: Prevented from being executed or selected in a Sky Battle.
powder: Has no effect on Grass-type Pokemon, Pokemon with the Ability Overcoat, and Pokemon holding Safety Goggles.
protect: Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield.
pulse: Power is multiplied by 1.5 when used by a Pokemon with the Ability Mega Launcher.
punch: Power is multiplied by 1.2 when used by a Pokemon with the Ability Iron Fist.
recharge: If this move is successful, the user must recharge on the following turn and cannot make a move.
reflectable: Bounced back to the original user by Magic Coat or the Ability Magic Bounce.
snatch: Can be stolen from the original user and instead used by another Pokemon using Snatch.
sound: Has no effect on Pokemon with the Ability Soundproof.

*/

'use strict';

exports.BattleMovedex = {
	"absorb": {
		num: 71,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "absorb",
		name: "Absorb",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"acid": {
		num: 51,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the foe(s) Sp. Def by 1.",
		id: "acid",
		name: "Acid",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Poison",
		contestType: "Clever",
	},
	"acidarmor": {
		num: 151,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		shortDesc: "Raises the user's Defense by 2.",
		id: "acidarmor",
		name: "Acid Armor",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: 2,
		},
		secondary: false,
		target: "self",
		type: "Poison",
		contestType: "Tough",
	},
	"acidspray": {
		num: 491,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Special Defense by 2 stages.",
		shortDesc: "100% chance to lower the target's Sp. Def by 2.",
		id: "acidspray",
		isViable: true,
		name: "Acid Spray",
		pp: 20,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spd: -2,
			},
		},
		target: "normal",
		type: "Poison",
		contestType: "Beautiful",
	},
	"acrobatics": {
		num: 512,
		accuracy: 100,
		basePower: 55,
		basePowerCallback: function (pokemon, target, move) {
			if (!pokemon.item) {
				this.debug("Power doubled for no item");
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		desc: "Power doubles if the user has no held item.",
		shortDesc: "Power doubles if the user has no held item.",
		id: "acrobatics",
		isViable: true,
		name: "Acrobatics",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"acupressure": {
		num: 367,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises a random stat by 2 stages as long as the stat is not already at stage 6. The user can choose to use this move on itself or an adjacent ally. Fails if no stat stage can be raised or if used on an ally with a substitute.",
		shortDesc: "Raises a random stat of the user or an ally by 2.",
		id: "acupressure",
		name: "Acupressure",
		pp: 30,
		priority: 0,
		flags: {},
		onHit: function (target) {
			let stats = [];
			for (let stat in target.boosts) {
				if (target.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				let randomStat = stats[this.random(stats.length)];
				let boost = {};
				boost[randomStat] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
		secondary: false,
		target: "adjacentAllyOrSelf",
		type: "Normal",
		contestType: "Tough",
	},
	"aerialace": {
		num: 332,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "aerialace",
		isViable: true,
		name: "Aerial Ace",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"aeroblast": {
		num: 177,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "aeroblast",
		isViable: true,
		name: "Aeroblast",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1},
		critRatio: 2,
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"afteryou": {
		num: 495,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The target makes its move immediately after the user this turn, no matter the priority of its selected move. Fails if the target would have moved next anyway, or if the target already moved this turn.",
		shortDesc: "The target makes its move right after the user.",
		id: "afteryou",
		name: "After You",
		pp: 15,
		priority: 0,
		flags: {authentic: 1},
		onHit: function (target) {
			if (target.side.active.length < 2) return false; // fails in singles
			let decision = this.willMove(target);
			if (decision) {
				this.cancelMove(target);
				this.queue.unshift(decision);
				this.add('-activate', target, 'move: After You');
			} else {
				return false;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"agility": {
		num: 97,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages.",
		shortDesc: "Raises the user's Speed by 2.",
		id: "agility",
		isViable: true,
		name: "Agility",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spe: 2,
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Cool",
	},
	"aircutter": {
		num: 314,
		accuracy: 95,
		basePower: 60,
		category: "Special",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio. Hits adjacent foes.",
		id: "aircutter",
		name: "Air Cutter",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Flying",
		contestType: "Cool",
	},
	"airslash": {
		num: 403,
		accuracy: 95,
		basePower: 75,
		category: "Special",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "airslash",
		isViable: true,
		name: "Air Slash",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"allyswitch": {
		num: 502,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps positions with its ally on the opposite side of the field. Fails if there is no Pokemon at that position, if the user is the only Pokemon on its side, or if the user is in the middle.",
		shortDesc: "Switches position with the ally on the far side.",
		id: "allyswitch",
		name: "Ally Switch",
		pp: 15,
		priority: 1,
		flags: {},
		onTryHit: function (source) {
			if (source.side.active.length === 1) return false;
			if (source.side.active.length === 3 && source.position === 1) return false;
		},
		onHit: function (pokemon) {
			let newPosition = (pokemon.position === 0 ? pokemon.side.active.length - 1 : 0);
			if (!pokemon.side.active[newPosition]) return false;
			if (pokemon.side.active[newPosition].fainted) return false;
			this.swapPosition(pokemon, newPosition, '[from] move: Ally Switch');
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Clever",
	},
	"amnesia": {
		num: 133,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Defense by 2 stages.",
		shortDesc: "Raises the user's Sp. Def by 2.",
		id: "amnesia",
		name: "Amnesia",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spd: 2,
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Cute",
	},
	"ancientpower": {
		num: 246,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 10% chance to raise the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "10% chance to raise all stats by 1 (not acc/eva).",
		id: "ancientpower",
		isViable: true,
		name: "Ancient Power",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
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
		type: "Rock",
		contestType: "Tough",
	},
	"aquajet": {
		num: 453,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "aquajet",
		isViable: true,
		name: "Aqua Jet",
		pp: 20,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	"aquaring": {
		num: 392,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user has 1/16 of its maximum HP, rounded down, restored at the end of each turn while it remains active. If the user uses Baton Pass, the replacement will receive the healing effect.",
		shortDesc: "User recovers 1/16 max HP per turn.",
		id: "aquaring",
		name: "Aqua Ring",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		volatileStatus: 'aquaring',
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 6,
			onResidual: function (pokemon) {
				this.heal(pokemon.maxhp / 16);
			},
		},
		secondary: false,
		target: "self",
		type: "Water",
		contestType: "Beautiful",
	},
	"aquatail": {
		num: 401,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "aquatail",
		isViable: true,
		name: "Aqua Tail",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	"armthrust": {
		num: 292,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "armthrust",
		name: "Arm Thrust",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"aromatherapy": {
		num: 312,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Every Pokemon in the user's party is cured of its major status condition. Active Pokemon with the Ability Sap Sipper are not cured, unless they are the user.",
		shortDesc: "Cures the user's party of all status conditions.",
		id: "aromatherapy",
		isViable: true,
		name: "Aromatherapy",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, distance: 1},
		onHit: function (pokemon, source, move) {
			this.add('-cureteam', source, '[from] move: Aromatherapy');
			let side = pokemon.side;
			for (let i = 0; i < side.pokemon.length; i++) {
				if (side.pokemon[i] !== source && ((side.pokemon[i].hasAbility('sapsipper')) ||
						(side.pokemon[i].volatiles['substitute'] && !move.infiltrates))) {
					continue;
				}
				if (side.pokemon[i].status && side.pokemon[i].hp) {
					this.add('-curestatus', side.pokemon[i], side.pokemon[i].status);
					side.pokemon[i].status = '';
				}
			}
		},
		target: "allyTeam",
		type: "Grass",
		contestType: "Clever",
	},
	"aromaticmist": {
		num: 597,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the target's Special Defense by 1 stage. Fails if there is no ally adjacent to the user.",
		shortDesc: "Raises an ally's Sp. Def by 1.",
		id: "aromaticmist",
		name: "Aromatic Mist",
		pp: 20,
		priority: 0,
		flags: {authentic: 1},
		boosts: {
			spd: 1,
		},
		secondary: false,
		target: "adjacentAlly",
		type: "Fairy",
		contestType: "Beautiful",
	},
	"assist": {
		num: 274,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "A random move among those known by the user's party members is selected for use. Does not select Assist, Belch, Bestow, Bounce, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dig, Dive, Dragon Tail, Endure, Feint, Fly, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Phantom Force, Protect, Rage Powder, Roar, Shadow Force, Sketch, Sky Drop, Sleep Talk, Snatch, Spiky Shield, Struggle, Switcheroo, Thief, Transform, Trick, or Whirlwind.",
		shortDesc: "Uses a random move known by a team member.",
		id: "assist",
		name: "Assist",
		pp: 20,
		priority: 0,
		flags: {},
		onHit: function (target) {
			let moves = [];
			for (let j = 0; j < target.side.pokemon.length; j++) {
				let pokemon = target.side.pokemon[j];
				if (pokemon === target) continue;
				for (let i = 0; i < pokemon.moveset.length; i++) {
					let move = pokemon.moveset[i].id;
					let noAssist = {
						assist:1, belch:1, bestow:1, bounce:1, chatter:1, circlethrow:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, dig:1, dive:1, dragontail:1, endure:1, feint:1, fly:1, focuspunch:1, followme:1, helpinghand:1, kingsshield:1, matblock:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, phantomforce:1, protect:1, ragepowder:1, roar:1, shadowforce:1, sketch:1, skydrop:1, sleeptalk:1, snatch:1, spikyshield:1, struggle:1, switcheroo:1, thief:1, transform:1, trick:1, whirlwind:1,
					};
					if (!noAssist[move]) {
						moves.push(move);
					}
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = moves[this.random(moves.length)];
			if (!randomMove) {
				return false;
			}
			this.useMove(randomMove, target);
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"assurance": {
		num: 372,
		accuracy: 100,
		basePower: 60,
		basePowerCallback: function (pokemon, target, move) {
			if (pokemon.volatiles.assurance && pokemon.volatiles.assurance.hurt) {
				this.debug('Boosted for being damaged this turn');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		desc: "Power doubles if the target has already taken damage this turn, other than direct damage from Belly Drum, confusion, Curse, or Pain Split.",
		shortDesc: "Power doubles if target was damaged this turn.",
		id: "assurance",
		name: "Assurance",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		beforeTurnCallback: function (pokemon, target) {
			pokemon.addVolatile('assurance');
			pokemon.volatiles.assurance.position = target.position;
		},
		effect: {
			duration: 1,
			onFoeAfterDamage: function (damage, target) {
				if (target.position === this.effectData.position) {
					this.debug('damaged this turn');
					this.effectData.hurt = true;
				}
			},
			onFoeSwitchOut: function (pokemon) {
				if (pokemon.position === this.effectData.position) {
					this.effectData.hurt = false;
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"astonish": {
		num: 310,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "astonish",
		name: "Astonish",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ghost",
		contestType: "Cute",
	},
	"attackorder": {
		num: 454,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "attackorder",
		isViable: true,
		name: "Attack Order",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	"attract": {
		num: 213,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to become infatuated, making it unable to attack 50% of the time. Fails if both the user and the target are the same gender, if either is genderless, or if the target is already infatuated. The effect ends when either the user or the target is no longer active. Pokemon with the Ability Oblivious or protected by the Ability Aroma Veil are immune.",
		shortDesc: "A target of the opposite gender gets infatuated.",
		id: "attract",
		name: "Attract",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'attract',
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (pokemon, source, effect) {
				if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
					this.debug('incompatible gender');
					return false;
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.id === 'cutecharm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
				} else if (effect.id === 'destinyknot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
				} else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onUpdate: function (pokemon) {
				if (this.effectData.source && !this.effectData.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on ' + pokemon);
					pokemon.removeVolatile('attract');
				}
			},
			onBeforeMovePriority: 2,
			onBeforeMove: function (pokemon, target, move) {
				this.add('-activate', pokemon, 'Attract', '[of] ' + this.effectData.source);
				if (this.random(2) === 0) {
					this.add('cant', pokemon, 'Attract');
					return false;
				}
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Attract', '[silent]');
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"aurasphere": {
		num: 396,
		accuracy: true,
		basePower: 80,
		category: "Special",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "aurasphere",
		isViable: true,
		name: "Aura Sphere",
		pp: 20,
		priority: 0,
		flags: {bullet: 1, protect: 1, pulse: 1, mirror: 1, distance: 1},
		secondary: false,
		target: "any",
		type: "Fighting",
		contestType: "Beautiful",
	},
	"aurorabeam": {
		num: 62,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Attack by 1 stage.",
		shortDesc: "10% chance to lower the foe's Attack by 1.",
		id: "aurorabeam",
		name: "Aurora Beam",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"autotomize": {
		num: 475,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages. If the user's Speed was changed, the user's weight is reduced by 100kg as long as it remains active. This effect is stackable but cannot reduce the user's weight to less than 0.1kg.",
		shortDesc: "Raises the user's Speed by 2; user loses 100 kg.",
		id: "autotomize",
		isViable: true,
		name: "Autotomize",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
		onTryHit: function (pokemon) {
			let hasContrary = pokemon.hasAbility('contrary');
			if ((!hasContrary && pokemon.boosts.spe === 6) || (hasContrary && pokemon.boosts.spe === -6)) {
				return false;
			}
		},
		boosts: {
			spe: 2,
		},
		volatileStatus: 'autotomize',
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (pokemon) {
				if (pokemon.template.weightkg > 0.1) {
					this.effectData.multiplier = 1;
					this.add('-start', pokemon, 'Autotomize');
				}
			},
			onRestart: function (pokemon) {
				if (pokemon.template.weightkg - (this.effectData.multiplier * 100) > 0.1) {
					this.effectData.multiplier++;
					this.add('-start', pokemon, 'Autotomize');
				}
			},
			onModifyWeightPriority: 1,
			onModifyWeight: function (weight, pokemon) {
				if (this.effectData.multiplier) {
					weight -= this.effectData.multiplier * 100;
					if (weight < 0.1) weight = 0.1;
					return weight;
				}
			},
		},
		secondary: false,
		target: "self",
		type: "Steel",
		contestType: "Beautiful",
	},
	"avalanche": {
		num: 419,
		accuracy: 100,
		basePower: 60,
		basePowerCallback: function (pokemon, target, move) {
			if (target.lastDamage > 0 && pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && pokemon.lastAttackedBy.pokemon === target) {
				this.debug('Boosted for getting hit by ' + pokemon.lastAttackedBy.move);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		desc: "Power doubles if the user was hit by the target this turn.",
		shortDesc: "Power doubles if user is damaged by the target.",
		id: "avalanche",
		isViable: true,
		name: "Avalanche",
		pp: 10,
		priority: -4,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"babydolleyes": {
		num: 608,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 1 stage.",
		shortDesc: "Lowers the target's Attack by 1.",
		id: "babydolleyes",
		name: "Baby-Doll Eyes",
		pp: 30,
		priority: 1,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			atk: -1,
		},
		secondary: false,
		target: "normal",
		type: "Fairy",
		contestType: "Cute",
	},
	"barrage": {
		num: 140,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "barrage",
		name: "Barrage",
		pp: 20,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"barrier": {
		num: 112,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		shortDesc: "Raises the user's Defense by 2.",
		id: "barrier",
		name: "Barrier",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: 2,
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Cool",
	},
	"batonpass": {
		num: 226,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is replaced with another Pokemon in its party. The selected Pokemon has the user's stat stage changes, confusion, and certain move effects transferred to it.",
		shortDesc: "User switches, passing stat changes and more.",
		id: "batonpass",
		isViable: true,
		name: "Baton Pass",
		pp: 40,
		priority: 0,
		flags: {},
		selfSwitch: 'copyvolatile',
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"beatup": {
		num: 251,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			pokemon.addVolatile('beatup');
			if (!pokemon.side.pokemon[pokemon.volatiles.beatup.index]) return null;
			return 5 + Math.floor(pokemon.side.pokemon[pokemon.volatiles.beatup.index].template.baseStats.atk / 10);
		},
		category: "Physical",
		desc: "Hits one time for the user and one time for each unfainted Pokemon without a major status condition in the user's party. The power of each hit is equal to 5+(X/10), where X is each participating Pokemon's base Attack; each hit is considered to come from the user.",
		shortDesc: "All healthy allies aid in damaging the target.",
		id: "beatup",
		name: "Beat Up",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: 6,
		effect: {
			duration: 1,
			onStart: function (pokemon) {
				this.effectData.index = 0;
				while (pokemon.side.pokemon[this.effectData.index] !== pokemon &&
					(!pokemon.side.pokemon[this.effectData.index] ||
					pokemon.side.pokemon[this.effectData.index].fainted ||
					pokemon.side.pokemon[this.effectData.index].status)) {
					this.effectData.index++;
				}
			},
			onRestart: function (pokemon) {
				do {
					this.effectData.index++;
					if (this.effectData.index >= 6) break;
				} while (!pokemon.side.pokemon[this.effectData.index] || pokemon.side.pokemon[this.effectData.index].fainted || pokemon.side.pokemon[this.effectData.index].status);
			},
		},
		onAfterMove: function (pokemon) {
			pokemon.removeVolatile('beatup');
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"belch": {
		num: 562,
		accuracy: 90,
		basePower: 120,
		category: "Special",
		desc: "This move cannot be selected until the user eats a Berry, either by eating one that was held, stealing and eating one off another Pokemon with Bug Bite or Pluck, or eating one that was thrown at it with Fling. Once the condition is met, this move can be selected and used for the rest of the battle even if the user gains or uses another item or switches out. Consuming a Berry with Natural Gift does not count for the purposes of eating one.",
		shortDesc: "Cannot be selected until the user eats a Berry.",
		id: "belch",
		name: "Belch",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		// Move disabling implemented in Battle#nextTurn in battle-engine.js
		secondary: false,
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	"bellydrum": {
		num: 187,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 12 stages in exchange for the user losing 1/2 of its maximum HP, rounded down. Fails if the user would faint or if its Attack stat stage is 6.",
		shortDesc: "User loses 50% max HP. Maximizes Attack.",
		id: "bellydrum",
		name: "Belly Drum",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		onHit: function (target) {
			if (target.hp <= target.maxhp / 2 || target.boosts.atk >= 6 || target.maxhp === 1) { // Shedinja clause
				return false;
			}
			this.directDamage(target.maxhp / 2);
			this.boost({atk: 12}, target);
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"bestow": {
		num: 516,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The target receives the user's held item. Fails if the user has no item or is holding a Mail, if the target is already holding an item, if the user is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, a Pokemon that can Mega Evolve holding the Mega Stone for its species, or if the target is one of those Pokemon and the user is holding the respective item.",
		shortDesc: "User passes its held item to the target.",
		id: "bestow",
		name: "Bestow",
		pp: 15,
		priority: 0,
		flags: {mirror: 1, authentic: 1},
		onHit: function (target, source) {
			if (target.item) {
				return false;
			}
			let yourItem = source.takeItem();
			if (!yourItem || (yourItem.onTakeItem && yourItem.onTakeItem(yourItem, target) === false)) {
				return false;
			}
			if (!target.setItem(yourItem)) {
				source.item = yourItem.id;
				return false;
			}
			this.add('-item', target, yourItem.name, '[from] move: Bestow', '[of] ' + source);
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"bide": {
		num: 117,
		accuracy: true,
		basePower: 0,
		category: "Physical",
		desc: "The user spends two turns locked into this move and then, on the second turn after using this move, the user attacks the last Pokemon that hit it, inflicting double the damage in HP it lost during the two turns. If the last Pokemon that hit it is no longer on the field, the user attacks a random foe instead. If the user is prevented from moving during this move's use, the effect ends. This move does not check accuracy.",
		shortDesc: "Waits 2 turns; deals double the damage taken.",
		id: "bide",
		name: "Bide",
		pp: 10,
		priority: 1,
		flags: {contact: 1, protect: 1},
		volatileStatus: 'bide',
		ignoreImmunity: true,
		effect: {
			duration: 3,
			onLockMove: 'bide',
			onStart: function (pokemon) {
				this.effectData.totalDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onDamagePriority: -101,
			onDamage: function (damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source || source.side === target.side) return;
				this.effectData.totalDamage += damage;
				this.effectData.sourcePosition = source.position;
				this.effectData.sourceSide = source.side;
			},
			onAfterSetStatus: function (status, pokemon) {
				if (status.id === 'slp') {
					pokemon.removeVolatile('bide');
				}
			},
			onBeforeMove: function (pokemon) {
				if (this.effectData.duration === 1) {
					this.add('-end', pokemon, 'Bide');
					if (!this.effectData.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					let target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					if (!target) {
						this.add('-fail', pokemon);
						return false;
					}
					if (!target.runImmunity('Normal')) {
						this.add('-immune', target, '[msg]');
						return false;
					}
					this.moveHit(target, pokemon, 'bide', {damage: this.effectData.totalDamage * 2});
					return false;
				}
				this.add('-activate', pokemon, 'Bide');
				return false;
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	"bind": {
		num: 20,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "bind",
		name: "Bind",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"bite": {
		num: 44,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "bite",
		name: "Bite",
		pp: 25,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	"blastburn": {
		num: 307,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "blastburn",
		name: "Blast Burn",
		pp: 5,
		priority: 0,
		flags: {recharge: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"blazekick": {
		num: 299,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Has a 10% chance to burn the target and a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio. 10% chance to burn.",
		id: "blazekick",
		isViable: true,
		name: "Blaze Kick",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	"blizzard": {
		num: 59,
		accuracy: 70,
		basePower: 110,
		category: "Special",
		desc: "Has a 10% chance to freeze the target. If the weather is Hail, this move does not check accuracy.",
		shortDesc: "10% chance to freeze the foe(s).",
		id: "blizzard",
		isViable: true,
		name: "Blizzard",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move) {
			if (this.isWeather('hail')) move.accuracy = true;
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	"block": {
		num: 335,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.",
		shortDesc: "The target cannot switch out.",
		id: "block",
		name: "Block",
		pp: 5,
		priority: 0,
		flags: {reflectable: 1, mirror: 1},
		onHit: function (target, source, move) {
			if (!target.addVolatile('trapped', source, move, 'trapper')) {
				this.add('-fail', target);
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"blueflare": {
		num: 551,
		accuracy: 85,
		basePower: 130,
		category: "Special",
		desc: "Has a 20% chance to burn the target.",
		shortDesc: "20% chance to burn the target.",
		id: "blueflare",
		isViable: true,
		name: "Blue Flare",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"bodyslam": {
		num: 34,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "30% chance to paralyze the target.",
		id: "bodyslam",
		isViable: true,
		name: "Body Slam",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"boltstrike": {
		num: 550,
		accuracy: 85,
		basePower: 130,
		category: "Physical",
		desc: "Has a 20% chance to paralyze the target.",
		shortDesc: "20% chance to paralyze the target.",
		id: "boltstrike",
		isViable: true,
		name: "Bolt Strike",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Beautiful",
	},
	"boneclub": {
		num: 125,
		accuracy: 85,
		basePower: 65,
		category: "Physical",
		desc: "Has a 10% chance to flinch the target.",
		shortDesc: "10% chance to flinch the target.",
		id: "boneclub",
		name: "Bone Club",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	"bonerush": {
		num: 198,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "bonerush",
		name: "Bone Rush",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	"bonemerang": {
		num: 155,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		id: "bonemerang",
		isViable: true,
		name: "Bonemerang",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	"boomburst": {
		num: 586,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent Pokemon.",
		id: "boomburst",
		isViable: true,
		name: "Boomburst",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		secondary: false,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Tough",
	},
	"bounce": {
		num: 340,
		accuracy: 85,
		basePower: 85,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder, and Twister. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Bounces turn 1. Hits turn 2. 30% paralyze.",
		id: "bounce",
		name: "Bounce",
		pp: 5,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		effect: {
			duration: 2,
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'thousandarrows' || move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onSourceBasePower: function (basePower, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			},
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "any",
		type: "Flying",
		contestType: "Cute",
	},
	"bravebird": {
		num: 413,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil.",
		id: "bravebird",
		isViable: true,
		name: "Brave Bird",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		recoil: [33, 100],
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"brickbreak": {
		num: 280,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "If this attack does not miss, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated.",
		shortDesc: "Destroys screens, unless the target is immune.",
		id: "brickbreak",
		isViable: true,
		name: "Brick Break",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit: function (pokemon) {
			// will shatter screens through sub, before you hit
			if (pokemon.runImmunity('Fighting')) {
				pokemon.side.removeSideCondition('reflect');
				pokemon.side.removeSideCondition('lightscreen');
			}
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"brine": {
		num: 362,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Power doubles if the target has less than or equal to half of its maximum HP remaining.",
		shortDesc: "Power doubles if the target's HP is 50% or less.",
		id: "brine",
		name: "Brine",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon, target) {
			if (target.hp * 2 < target.maxhp) {
				return this.chainModify(2);
			}
		},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	"bubble": {
		num: 145,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Speed by 1 stage.",
		shortDesc: "10% chance to lower the foe(s) Speed by 1.",
		id: "bubble",
		name: "Bubble",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Cute",
	},
	"bubblebeam": {
		num: 61,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Speed by 1 stage.",
		shortDesc: "10% chance to lower the target's Speed by 1.",
		id: "bubblebeam",
		name: "Bubble Beam",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	"bugbite": {
		num: 450,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, it steals the target's held Berry if it is holding one and eats it immediately. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
		shortDesc: "User steals and eats the target's Berry.",
		id: "bugbite",
		name: "Bug Bite",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit: function (target, source) {
			let item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Bug Bite', '[of] ' + source);
				this.singleEvent('Eat', item, null, source, null, null);
				this.runEvent('EatItem', source, null, null, item);
				source.ateBerry = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	"bugbuzz": {
		num: 405,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def. by 1.",
		id: "bugbuzz",
		isViable: true,
		name: "Bug Buzz",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Bug",
		contestType: "Beautiful",
	},
	"bulkup": {
		num: 339,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Defense by 1 stage.",
		shortDesc: "Raises the user's Attack and Defense by 1.",
		id: "bulkup",
		isViable: true,
		name: "Bulk Up",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
			def: 1,
		},
		secondary: false,
		target: "self",
		type: "Fighting",
		contestType: "Cool",
	},
	"bulldoze": {
		num: 523,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower adjacent Pkmn Speed by 1.",
		id: "bulldoze",
		name: "Bulldoze",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacent",
		type: "Ground",
		contestType: "Tough",
	},
	"bulletpunch": {
		num: 418,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "bulletpunch",
		isViable: true,
		name: "Bullet Punch",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: false,
		target: "normal",
		type: "Steel",
		contestType: "Tough",
	},
	"bulletseed": {
		num: 331,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "bulletseed",
		isViable: true,
		name: "Bullet Seed",
		pp: 30,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	"calmmind": {
		num: 347,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack and Special Defense by 1 stage.",
		shortDesc: "Raises the user's Sp. Atk and Sp. Def by 1.",
		id: "calmmind",
		isViable: true,
		name: "Calm Mind",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spa: 1,
			spd: 1,
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Clever",
	},
	"camouflage": {
		num: 293,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user's type changes based on the battle terrain. Normal type on the regular Wi-Fi terrain, Electric type during Electric Terrain, Fairy type during Misty Terrain, and Grass type during Grassy Terrain. Fails if the user's type cannot be changed or if the user is already purely that type.",
		shortDesc: "Changes user's type by terrain (default Normal).",
		id: "camouflage",
		name: "Camouflage",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		onHit: function (target) {
			let newType = 'Normal';
			if (this.isTerrain('electricterrain')) {
				newType = 'Electric';
			} else if (this.isTerrain('grassyterrain')) {
				newType = 'Grass';
			} else if (this.isTerrain('mistyterrain')) {
				newType = 'Fairy';
			}

			if (!target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Clever",
	},
	"captivate": {
		num: 445,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Attack by 2 stages. The target is unaffected if both the user and the target are the same gender, or if either is genderless. Pokemon with the Ability Oblivious are immune.",
		shortDesc: "Lowers the foe(s) Sp. Atk by 2 if opposite gender.",
		id: "captivate",
		name: "Captivate",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onTryHit: function (pokemon, source) {
			if ((pokemon.gender === 'M' && source.gender === 'F') || (pokemon.gender === 'F' && source.gender === 'M')) {
				return;
			}
			return false;
		},
		boosts: {
			spa: -2,
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cute",
	},
	"celebrate": {
		num: 606,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "It is your birthday.",
		shortDesc: "No competitive use. Or any use.",
		id: "celebrate",
		name: "Celebrate",
		pp: 40,
		priority: 0,
		flags: {},
		onTryHit: function (target, source) {
			this.add('-activate', target, 'move: Celebrate');
			return null;
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"charge": {
		num: 268,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Defense by 1 stage. If the user uses an Electric-type attack on the next turn, its power will be doubled.",
		shortDesc: "Boosts next Electric move and user's Sp. Def by 1.",
		id: "charge",
		name: "Charge",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		volatileStatus: 'charge',
		onHit: function (pokemon) {
			this.add('-activate', pokemon, 'move: Charge');
		},
		effect: {
			duration: 2,
			onRestart: function (pokemon) {
				this.effectData.duration = 2;
			},
			onBasePowerPriority: 3,
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('charge boost');
					return this.chainModify(2);
				}
			},
		},
		boosts: {
			spd: 1,
		},
		secondary: false,
		target: "self",
		type: "Electric",
		contestType: "Clever",
	},
	"chargebeam": {
		num: 451,
		accuracy: 90,
		basePower: 50,
		category: "Special",
		desc: "Has a 70% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "70% chance to raise the user's Sp. Atk by 1.",
		id: "chargebeam",
		name: "Charge Beam",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 70,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Electric",
		contestType: "Beautiful",
	},
	"charm": {
		num: 204,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 2 stages.",
		shortDesc: "Lowers the target's Attack by 2.",
		id: "charm",
		name: "Charm",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			atk: -2,
		},
		secondary: false,
		target: "normal",
		type: "Fairy",
		contestType: "Cute",
	},
	"chatter": {
		num: 448,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 100% chance to confuse the target.",
		shortDesc: "100% chance to confuse the target.",
		id: "chatter",
		isViable: true,
		name: "Chatter",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, distance: 1, authentic: 1},
		noSketch: true,
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Flying",
		contestType: "Cute",
	},
	"chipaway": {
		num: 498,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Ignores the target's stat stage changes, including evasiveness.",
		shortDesc: "Ignores the target's stat stage changes.",
		id: "chipaway",
		name: "Chip Away",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		ignoreDefensive: true,
		ignoreEvasion: true,
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"circlethrow": {
		num: 509,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		desc: "If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Ability Suction Cups, or this move hit a substitute.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "circlethrow",
		isViable: true,
		name: "Circle Throw",
		pp: 10,
		priority: -6,
		flags: {contact: 1, protect: 1, mirror: 1},
		forceSwitch: true,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"clamp": {
		num: 128,
		accuracy: 85,
		basePower: 35,
		category: "Physical",
		desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "clamp",
		name: "Clamp",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	"clearsmog": {
		num: 499,
		accuracy: true,
		basePower: 50,
		category: "Special",
		desc: "Resets all of the target's stat stages to 0.",
		shortDesc: "Eliminates the target's stat changes.",
		id: "clearsmog",
		isViable: true,
		name: "Clear Smog",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit: function (target) {
			target.clearBoosts();
			this.add('-clearboost', target);
		},
		secondary: false,
		target: "normal",
		type: "Poison",
		contestType: "Beautiful",
	},
	"closecombat": {
		num: 370,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Lowers the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
		id: "closecombat",
		isViable: true,
		name: "Close Combat",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"coil": {
		num: 489,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack, Defense, and accuracy by 1 stage.",
		shortDesc: "Raises user's Attack, Defense, and accuracy by 1.",
		id: "coil",
		isViable: true,
		name: "Coil",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
			def: 1,
			accuracy: 1,
		},
		secondary: false,
		target: "self",
		type: "Poison",
		contestType: "Tough",
	},
	"cometpunch": {
		num: 4,
		accuracy: 85,
		basePower: 18,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "cometpunch",
		name: "Comet Punch",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"confide": {
		num: 590,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Attack by 1 stage.",
		shortDesc: "Lowers the target's Sp. Atk by 1.",
		id: "confide",
		name: "Confide",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		boosts: {
			spa: -1,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"confuseray": {
		num: 109,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to become confused.",
		shortDesc: "Confuses the target.",
		id: "confuseray",
		name: "Confuse Ray",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	"confusion": {
		num: 93,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Has a 10% chance to confuse the target.",
		shortDesc: "10% chance to confuse the target.",
		id: "confusion",
		name: "Confusion",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"constrict": {
		num: 132,
		accuracy: 100,
		basePower: 10,
		category: "Physical",
		desc: "Has a 10% chance to lower the target's Speed by 1 stage.",
		shortDesc: "10% chance to lower the target's Speed by 1.",
		id: "constrict",
		name: "Constrict",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"conversion": {
		num: 160,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user's type changes to match the original type of the move in its first move slot. Fails if the user cannot change its type, or if the type is one of the user's current types.",
		shortDesc: "Changes user's type to match its first move.",
		id: "conversion",
		name: "Conversion",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		onHit: function (target) {
			let type = this.getMove(target.moveset[0].id).type;
			if (target.hasType(type) || !target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Beautiful",
	},
	"conversion2": {
		num: 176,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user's type changes to match a type that resists or is immune to the type of the last move used by the target, but not either of its current types. The determined type of the move is used rather than the original type. Fails if the target has not made a move, if the user cannot change its type, or if this move would only be able to select one of the user's current types.",
		shortDesc: "Changes user's type to resist target's last move.",
		id: "conversion2",
		name: "Conversion 2",
		pp: 30,
		priority: 0,
		flags: {authentic: 1},
		onHit: function (target, source) {
			if (!target.lastMove) {
				return false;
			}
			let possibleTypes = [];
			let attackType = this.getMove(target.lastMove).type;
			for (let type in this.data.TypeChart) {
				if (source.hasType(type) || target.hasType(type)) continue;
				let typeCheck = this.data.TypeChart[type].damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(type);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			let randomType = possibleTypes[this.random(possibleTypes.length)];

			if (!source.setType(randomType)) return false;
			this.add('-start', source, 'typechange', randomType);
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"copycat": {
		num: 383,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user uses the last move used by any Pokemon, including itself. Fails if no move has been used, or if the last move used was Assist, Belch, Bestow, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Roar, Sketch, Sleep Talk, Snatch, Spiky Shield, Struggle, Switcheroo, Thief, Transform, Trick, or Whirlwind.",
		shortDesc: "Uses the last move used in the battle.",
		id: "copycat",
		name: "Copycat",
		pp: 20,
		priority: 0,
		flags: {},
		onHit: function (pokemon) {
			let noCopycat = {assist:1, bestow:1, chatter:1, circlethrow:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, dragontail:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, ragepowder:1, roar:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, transform:1, trick:1, whirlwind:1};
			if (!this.lastMove || noCopycat[this.lastMove]) {
				return false;
			}
			this.useMove(this.lastMove, pokemon);
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"cosmicpower": {
		num: 322,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Raises the user's Defense and Sp. Def by 1.",
		id: "cosmicpower",
		name: "Cosmic Power",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: 1,
			spd: 1,
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"cottonguard": {
		num: 538,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 3 stages.",
		shortDesc: "Raises the user's Defense by 3.",
		id: "cottonguard",
		isViable: true,
		name: "Cotton Guard",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: 3,
		},
		secondary: false,
		target: "self",
		type: "Grass",
		contestType: "Cute",
	},
	"cottonspore": {
		num: 178,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Speed by 2 stages.",
		shortDesc: "Lowers the target's Speed by 2.",
		id: "cottonspore",
		name: "Cotton Spore",
		pp: 40,
		priority: 0,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			spe: -2,
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Grass",
		contestType: "Beautiful",
	},
	"counter": {
		num: 68,
		accuracy: 100,
		basePower: 0,
		damageCallback: function (pokemon) {
			if (!pokemon.volatiles['counter']) return 0;
			return pokemon.volatiles['counter'].damage || 1;
		},
		category: "Physical",
		desc: "Deals damage to the last foe to hit the user with a physical attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals damage with a Base Power of 1 instead. If that foe's position is no longer in use, the damage is done to a random foe in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by a foe's physical attack this turn.",
		shortDesc: "If hit by physical attack, returns double damage.",
		id: "counter",
		name: "Counter",
		pp: 20,
		priority: -5,
		flags: {contact: 1, protect: 1},
		beforeTurnCallback: function (pokemon) {
			pokemon.addVolatile('counter');
		},
		onTryHit: function (target, source, move) {
			if (!source.volatiles['counter']) return false;
			if (source.volatiles['counter'].position === null) return false;
		},
		effect: {
			duration: 1,
			noCopy: true,
			onStart: function (target, source, source2, move) {
				this.effectData.position = null;
				this.effectData.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget: function (target, source, source2) {
				if (source !== this.effectData.target) return;
				return source.side.foe.active[this.effectData.position];
			},
			onDamagePriority: -101,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && source.side !== target.side && this.getCategory(effect.id) === 'Physical') {
					this.effectData.position = source.position;
					this.effectData.damage = 2 * damage;
				}
			},
		},
		secondary: false,
		target: "scripted",
		type: "Fighting",
		contestType: "Tough",
	},
	"covet": {
		num: 343,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "If this attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one. The target's item is not stolen if it is a Mail, or if the target is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, or a Pokemon that can Mega Evolve holding the Mega Stone for its species. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
		shortDesc: "If the user has no item, it steals the target's.",
		id: "covet",
		name: "Covet",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit: function (target, source) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			let yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Covet', '[of] ' + target);
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"crabhammer": {
		num: 152,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "crabhammer",
		isViable: true,
		name: "Crabhammer",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	"craftyshield": {
		num: 578,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and its party members are protected from non-damaging attacks made by other Pokemon, including allies, during this turn. Fails if the user moves last this turn or if this move is already in effect for the user's side.",
		shortDesc: "Protects allies from Status moves this turn.",
		id: "craftyshield",
		name: "Crafty Shield",
		pp: 10,
		priority: 3,
		flags: {},
		sideCondition: 'craftyshield',
		onTryHitSide: function (side, source) {
			return !!this.willAct();
		},
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Crafty Shield');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (move && (move.target === 'self' || move.category !== 'Status')) return;
				this.add('-activate', target, 'Crafty Shield');
				return null;
			},
		},
		secondary: false,
		target: "allySide",
		type: "Fairy",
		contestType: "Clever",
	},
	"crosschop": {
		num: 238,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "crosschop",
		isViable: true,
		name: "Cross Chop",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"crosspoison": {
		num: 440,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a 10% chance to poison the target and a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio. 10% chance to poison.",
		id: "crosspoison",
		name: "Cross Poison",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'psn',
		},
		critRatio: 2,
		target: "normal",
		type: "Poison",
		contestType: "Cool",
	},
	"crunch": {
		num: 242,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 20% chance to lower the target's Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Defense by 1.",
		id: "crunch",
		isViable: true,
		name: "Crunch",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	"crushclaw": {
		num: 306,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's Defense by 1 stage.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "crushclaw",
		name: "Crush Claw",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"crushgrip": {
		num: 462,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			return Math.floor(Math.floor((120 * (100 * Math.floor(target.hp * 4096 / target.maxhp)) + 2048 - 1) / 4096) / 100) || 1;
		},
		category: "Physical",
		desc: "Power is equal to 120 * (target's current HP / target's maximum HP), rounded half down, but not less than 1.",
		shortDesc: "More power the more HP the target has left.",
		id: "crushgrip",
		name: "Crush Grip",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"curse": {
		num: 174,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If the user is not a Ghost type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Ghost type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected.",
		shortDesc: "Curses if Ghost, else +1 Atk, +1 Def, -1 Spe.",
		id: "curse",
		name: "Curse",
		pp: 10,
		priority: 0,
		flags: {authentic: 1},
		volatileStatus: 'curse',
		onModifyMove: function (move, source, target) {
			if (!source.hasType('Ghost')) {
				move.target = move.nonGhostTarget;
			}
		},
		onTryHit: function (target, source, move) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = {boosts: {spe:-1, atk:1, def:1}};
			} else if (move.volatileStatus && target.volatiles.curse) {
				return false;
			}
		},
		onHit: function (target, source) {
			this.directDamage(source.maxhp / 2, source, source);
		},
		effect: {
			onStart: function (pokemon, source) {
				this.add('-start', pokemon, 'Curse', '[of] ' + source);
			},
			onResidualOrder: 10,
			onResidual: function (pokemon) {
				this.damage(pokemon.maxhp / 4);
			},
		},
		secondary: false,
		target: "normal",
		nonGhostTarget: "self",
		type: "Ghost",
		contestType: "Tough",
	},
	"cut": {
		num: 15,
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "cut",
		name: "Cut",
		pp: 30,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"darkpulse": {
		num: 399,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to flinch the target.",
		shortDesc: "20% chance to flinch the target.",
		id: "darkpulse",
		isViable: true,
		name: "Dark Pulse",
		pp: 15,
		priority: 0,
		flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Dark",
		contestType: "Cool",
	},
	"darkvoid": {
		num: 464,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to fall asleep.",
		shortDesc: "Puts the foe(s) to sleep.",
		id: "darkvoid",
		isViable: true,
		name: "Dark Void",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'slp',
		secondary: false,
		target: "allAdjacentFoes",
		type: "Dark",
		contestType: "Clever",
	},
	"dazzlinggleam": {
		num: 605,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent foes.",
		id: "dazzlinggleam",
		isViable: true,
		name: "Dazzling Gleam",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Fairy",
		contestType: "Beautiful",
	},
	"defendorder": {
		num: 455,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Raises the user's Defense and Sp. Def by 1.",
		id: "defendorder",
		isViable: true,
		name: "Defend Order",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: 1,
			spd: 1,
		},
		secondary: false,
		target: "self",
		type: "Bug",
		contestType: "Clever",
	},
	"defensecurl": {
		num: 111,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 1 stage. As long as the user remains active, the power of the user's Ice Ball and Rollout will be doubled (this effect is not stackable).",
		shortDesc: "Raises the user's Defense by 1.",
		id: "defensecurl",
		name: "Defense Curl",
		pp: 40,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: 1,
		},
		volatileStatus: 'defensecurl',
		effect: {
			noCopy: true,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"defog": {
		num: 432,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's evasiveness by 1 stage. If this move is successful and whether or not the target's evasiveness was affected, the effects of Reflect, Light Screen, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the target's side, and the effects of Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the user's side. Ignores a target's substitute, although a substitute will still block the lowering of evasiveness.",
		shortDesc: "Removes hazards from field. Lowers foe's evasion.",
		id: "defog",
		isViable: true,
		name: "Defog",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		onHit: function (target, source, move) {
			if (!target.volatiles['substitute'] || move.infiltrates) this.boost({evasion:-1});
			let removeTarget = {reflect:1, lightscreen:1, safeguard:1, mist:1, spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1};
			let removeAll = {spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1};
			for (let targetCondition in removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll[targetCondition]) continue;
					this.add('-sideend', target.side, this.getEffect(targetCondition).name, '[from] move: Defog', '[of] ' + target);
				}
			}
			for (let sideCondition in removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.getEffect(sideCondition).name, '[from] move: Defog', '[of] ' + source);
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Flying",
		contestType: "Cool",
	},
	"destinybond": {
		num: 194,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the user's next turn, if a foe's attack knocks the user out, that foe faints as well, unless the attack was Doom Desire or Future Sight.",
		shortDesc: "If an opponent knocks out the user, it also faints.",
		id: "destinybond",
		isViable: true,
		name: "Destiny Bond",
		pp: 5,
		priority: 0,
		flags: {authentic: 1},
		volatileStatus: 'destinybond',
		effect: {
			onStart: function (pokemon) {
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
			onFaint: function (target, source, effect) {
				if (!source || !effect) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove) {
					this.add('-activate', target, 'Destiny Bond');
					source.faint();
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove: function (pokemon) {
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			},
			onBeforeSwitchOutPriority: 1,
			onBeforeSwitchOut: function (pokemon) {
				pokemon.removeVolatile('destinybond');
			},
		},
		secondary: false,
		target: "self",
		type: "Ghost",
		contestType: "Clever",
	},
	"detect": {
		num: 197,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		shortDesc: "Prevents moves from affecting the user this turn.",
		id: "detect",
		isViable: true,
		name: "Detect",
		pp: 5,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit: function (pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		secondary: false,
		target: "self",
		type: "Fighting",
		contestType: "Cool",
	},
	"diamondstorm": {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "Has a 50% chance to raise the user's Defense by 1 stage.",
		shortDesc: "50% chance to raise user's Def by 1 for each hit.",
		id: "diamondstorm",
		isViable: true,
		name: "Diamond Storm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "allAdjacentFoes",
		type: "Rock",
		contestType: "Beautiful",
	},
	"dig": {
		num: 91,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Earthquake and Magnitude but takes double damage from them, and is also unaffected by weather. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Digs underground turn 1, strikes turn 2.",
		id: "dig",
		name: "Dig",
		pp: 10,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		effect: {
			duration: 2,
			onImmunity: function (type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude' || move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onSourceModifyDamage: function (damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	"disable": {
		num: 50,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For 4 turns, the target's last move used becomes disabled. Fails if one of the target's moves is already disabled, if the target has not made a move, or if the target no longer knows the move.",
		shortDesc: "For 4 turns, disables the target's last move used.",
		id: "disable",
		isViable: true,
		name: "Disable",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'disable',
		effect: {
			duration: 4,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (pokemon) {
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				if (!pokemon.lastMove) {
					this.debug('pokemon hasn\'t moved yet');
					return false;
				}
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (moves[i].id === pokemon.lastMove) {
						if (!moves[i].pp) {
							this.debug('Move out of PP');
							return false;
						} else {
							this.add('-start', pokemon, 'Disable', moves[i].move);
							this.effectData.move = pokemon.lastMove;
							return;
						}
					}
				}
				this.debug('Move doesn\'t exist ???');
				return false;
			},
			onResidualOrder: 14,
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Disable');
			},
			onBeforeMovePriority: 7,
			onBeforeMove: function (attacker, defender, move) {
				if (move.id === this.effectData.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove: function (pokemon) {
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (moves[i].id === this.effectData.move) {
						pokemon.disableMove(moves[i].id);
					}
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"disarmingvoice": {
		num: 574,
		accuracy: true,
		basePower: 40,
		category: "Special",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy. Hits foes.",
		id: "disarmingvoice",
		name: "Disarming Voice",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Fairy",
		contestType: "Cute",
	},
	"discharge": {
		num: 435,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze adjacent Pokemon.",
		id: "discharge",
		isViable: true,
		name: "Discharge",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "allAdjacent",
		type: "Electric",
		contestType: "Beautiful",
	},
	"dive": {
		num: 291,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Surf and Whirlpool but takes double damage from them, and is also unaffected by weather. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Dives underwater turn 1, strikes turn 2.",
		id: "dive",
		name: "Dive",
		pp: 10,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		effect: {
			duration: 2,
			onImmunity: function (type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'surf' || move.id === 'whirlpool' || move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onSourceModifyDamage: function (damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	"dizzypunch": {
		num: 146,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a 20% chance to confuse the target.",
		shortDesc: "20% chance to confuse the target.",
		id: "dizzypunch",
		name: "Dizzy Punch",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"doomdesire": {
		num: 353,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Future Sight is already in effect for the target's position.",
		shortDesc: "Hits two turns after being used.",
		id: "doomdesire",
		name: "Doom Desire",
		pp: 5,
		priority: 0,
		flags: {},
		isFutureMove: true,
		onTry: function (source, target) {
			target.side.addSideCondition('futuremove');
			if (target.side.sideConditions['futuremove'].positions[target.position]) {
				return false;
			}
			target.side.sideConditions['futuremove'].positions[target.position] = {
				duration: 3,
				move: 'doomdesire',
				source: source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 100,
					basePower: 140,
					category: "Special",
					flags: {},
					effectType: 'Move',
					isFutureMove: true,
					type: 'Steel',
				},
			};
			this.add('-start', source, 'Doom Desire');
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Steel",
		contestType: "Beautiful",
	},
	"doubleedge": {
		num: 38,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil.",
		id: "doubleedge",
		isViable: true,
		name: "Double-Edge",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [33, 100],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"doublehit": {
		num: 458,
		accuracy: 90,
		basePower: 35,
		category: "Physical",
		desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		id: "doublehit",
		name: "Double Hit",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"doublekick": {
		num: 24,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		id: "doublekick",
		name: "Double Kick",
		pp: 30,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"doubleslap": {
		num: 3,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "doubleslap",
		name: "Double Slap",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"doubleteam": {
		num: 104,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's evasiveness by 1 stage.",
		shortDesc: "Raises the user's evasiveness by 1.",
		id: "doubleteam",
		name: "Double Team",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			evasion: 1,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cool",
	},
	"dracometeor": {
		num: 434,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "dracometeor",
		isViable: true,
		name: "Draco Meteor",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: false,
		target: "normal",
		type: "Dragon",
		contestType: "Beautiful",
	},
	"dragonascent": {
		num: 620,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Lowers the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
		id: "dragonascent",
		isViable: true,
		name: "Dragon Ascent",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		target: "any",
		type: "Flying",
		contestType: "Beautiful",
	},
	"dragonbreath": {
		num: 225,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		id: "dragonbreath",
		name: "Dragon Breath",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Dragon",
		contestType: "Cool",
	},
	"dragonclaw": {
		num: 337,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "dragonclaw",
		isViable: true,
		name: "Dragon Claw",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Dragon",
		contestType: "Cool",
	},
	"dragondance": {
		num: 349,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Speed by 1 stage.",
		shortDesc: "Raises the user's Attack and Speed by 1.",
		id: "dragondance",
		isViable: true,
		name: "Dragon Dance",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
			spe: 1,
		},
		secondary: false,
		target: "self",
		type: "Dragon",
		contestType: "Cool",
	},
	"dragonpulse": {
		num: 406,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "dragonpulse",
		isViable: true,
		name: "Dragon Pulse",
		pp: 10,
		priority: 0,
		flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
		secondary: false,
		target: "any",
		type: "Dragon",
		contestType: "Beautiful",
	},
	"dragonrage": {
		num: 82,
		accuracy: 100,
		basePower: 0,
		damage: 40,
		category: "Special",
		desc: "Deals 40 HP of damage to the target.",
		shortDesc: "Always does 40 HP of damage.",
		id: "dragonrage",
		name: "Dragon Rage",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Dragon",
		contestType: "Cool",
	},
	"dragonrush": {
		num: 407,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "Has a 20% chance to flinch the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "20% chance to flinch the target.",
		id: "dragonrush",
		name: "Dragon Rush",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Dragon",
		contestType: "Tough",
	},
	"dragontail": {
		num: 525,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		desc: "If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Ability Suction Cups, or this move hit a substitute.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "dragontail",
		isViable: true,
		name: "Dragon Tail",
		pp: 10,
		priority: -6,
		flags: {contact: 1, protect: 1, mirror: 1},
		forceSwitch: true,
		target: "normal",
		type: "Dragon",
		contestType: "Tough",
	},
	"drainingkiss": {
		num: 577,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "The user recovers 3/4 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 75% of the damage dealt.",
		id: "drainingkiss",
		name: "Draining Kiss",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		drain: [3, 4],
		secondary: false,
		target: "normal",
		type: "Fairy",
		contestType: "Cute",
	},
	"drainpunch": {
		num: 409,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "drainpunch",
		isViable: true,
		name: "Drain Punch",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1, heal: 1},
		drain: [1, 2],
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"dreameater": {
		num: 138,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "The target is unaffected by this move unless it is asleep. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User gains 1/2 HP inflicted. Sleeping target only.",
		id: "dreameater",
		name: "Dream Eater",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		onTryHit: function (target) {
			if (target.status !== 'slp') {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"drillpeck": {
		num: 65,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "drillpeck",
		isViable: true,
		name: "Drill Peck",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"drillrun": {
		num: 529,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "drillrun",
		isViable: true,
		name: "Drill Run",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	"dualchop": {
		num: 530,
		accuracy: 90,
		basePower: 40,
		category: "Physical",
		desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		id: "dualchop",
		name: "Dual Chop",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Dragon",
		contestType: "Tough",
	},
	"dynamicpunch": {
		num: 223,
		accuracy: 50,
		basePower: 100,
		category: "Physical",
		desc: "Has a 100% chance to confuse the target.",
		shortDesc: "100% chance to confuse the target.",
		id: "dynamicpunch",
		name: "Dynamic Punch",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"earthpower": {
		num: 414,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def. by 1.",
		id: "earthpower",
		isViable: true,
		name: "Earth Power",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Beautiful",
	},
	"earthquake": {
		num: 89,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Damage doubles if the target is using Dig.",
		shortDesc: "Hits adjacent Pokemon. Power doubles on Dig.",
		id: "earthquake",
		isViable: true,
		name: "Earthquake",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "allAdjacent",
		type: "Ground",
		contestType: "Tough",
	},
	"echoedvoice": {
		num: 497,
		accuracy: 100,
		basePower: 40,
		basePowerCallback: function () {
			if (this.pseudoWeather.echoedvoice) {
				return 40 * this.pseudoWeather.echoedvoice.multiplier;
			}
			return 40;
		},
		category: "Special",
		desc: "For every consecutive turn that this move is used by at least one Pokemon, this move's power is multiplied by the number of turns to pass, but not more than 5.",
		shortDesc: "Power increases when used on consecutive turns.",
		id: "echoedvoice",
		name: "Echoed Voice",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onTry: function () {
			this.addPseudoWeather('echoedvoice');
		},
		effect: {
			duration: 2,
			onStart: function () {
				this.effectData.multiplier = 1;
			},
			onRestart: function () {
				if (this.effectData.duration !== 2) {
					this.effectData.duration = 2;
					if (this.effectData.multiplier < 5) {
						this.effectData.multiplier++;
					}
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"eerieimpulse": {
		num: 598,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Attack by 2 stages.",
		shortDesc: "Lowers the target's Sp. Atk by 2.",
		id: "eerieimpulse",
		name: "Eerie Impulse",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			spa: -2,
		},
		secondary: false,
		target: "normal",
		type: "Electric",
		contestType: "Clever",
	},
	"eggbomb": {
		num: 121,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "eggbomb",
		name: "Egg Bomb",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"electricterrain": {
		num: 604,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the terrain becomes Electric Terrain. During the effect, the power of Electric-type attacks made by grounded Pokemon is multiplied by 1.5 and grounded Pokemon cannot fall asleep; Pokemon already asleep do not wake up. Camouflage transforms the user into an Electric type, Nature Power becomes Thunderbolt, and Secret Power has a 30% chance to cause paralysis. Fails if the current terrain is Electric Terrain.",
		shortDesc: "5 turns. Grounded: +Electric power, can't sleep.",
		id: "electricterrain",
		name: "Electric Terrain",
		pp: 10,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'electricterrain',
		effect: {
			duration: 5,
			onSetStatus: function (status, target, source, effect) {
				if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
					this.debug('Interrupting sleep from Electric Terrain');
					return false;
				}
			},
			onTryHit: function (target, source, move) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (move && move.id === 'yawn') {
					return false;
				}
			},
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('electric terrain boost');
					return this.chainModify(1.5);
				}
			},
			onStart: function (battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Electric Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function () {
				this.add('-fieldend', 'move: Electric Terrain');
			},
		},
		secondary: false,
		target: "all",
		type: "Electric",
		contestType: "Clever",
	},
	"electrify": {
		num: 582,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the target's move to become Electric type this turn. Fails if the target already moved this turn.",
		shortDesc: "Changes the target's move to Electric this turn.",
		id: "electrify",
		name: "Electrify",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'electrify',
		onTryHit: function (target) {
			if (!this.willMove(target) && target.activeTurns) return false;
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'move: Electrify');
			},
			onModifyMovePriority: -2,
			onModifyMove: function (move) {
				this.debug('Electrify making move type electric');
				move.type = 'Electric';
			},
		},
		secondary: false,
		target: "normal",
		type: "Electric",
		contestType: "Clever",
	},
	"electroball": {
		num: 486,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let ratio = (pokemon.getStat('spe') / target.getStat('spe'));
			this.debug([40, 60, 80, 120, 150][(Math.floor(ratio) > 4 ? 4 : Math.floor(ratio))] + ' bp');
			if (ratio >= 4) {
				return 150;
			}
			if (ratio >= 3) {
				return 120;
			}
			if (ratio >= 2) {
				return 80;
			}
			if (ratio >= 1) {
				return 60;
			}
			return 40;
		},
		category: "Special",
		desc: "The power of this move depends on (user's current Speed / target's current Speed), rounded down. Power is equal to 150 if the result is 4 or more, 120 if 3, 80 if 2, 60 if 1, 40 if less than 1.",
		shortDesc: "More power the faster the user is than the target.",
		id: "electroball",
		name: "Electro Ball",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"electroweb": {
		num: 527,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
		id: "electroweb",
		name: "Electroweb",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Electric",
		contestType: "Beautiful",
	},
	"embargo": {
		num: 373,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the target's held item has no effect. An item's effect of causing forme changes is unaffected, but any other effects from such items are negated. During the effect, Fling and Natural Gift are prevented from being used by the target. Items thrown at the target with Fling will still activate for it. If the target uses Baton Pass, the replacement will remain unable to use items.",
		shortDesc: "For 5 turns, the target can't use any items.",
		id: "embargo",
		name: "Embargo",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		volatileStatus: 'embargo',
		effect: {
			duration: 5,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Embargo');
			},
			// Item suppression implemented in BattlePokemon.ignoringItem() within battle-engine.js
			onResidualOrder: 18,
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Embargo');
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"ember": {
		num: 52,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the target.",
		id: "ember",
		name: "Ember",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Cute",
	},
	"encore": {
		num: 227,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For 3 turns, the target is forced to repeat its last move used. If the affected move runs out of PP, the effect ends. Fails if the target is already under this effect, if it has not made a move, if the move has 0 PP, or if the move is Encore, Mimic, Mirror Move, Sketch, Struggle, or Transform.",
		shortDesc: "The target repeats its last move for 3 turns.",
		id: "encore",
		isViable: true,
		name: "Encore",
		pp: 5,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'encore',
		effect: {
			duration: 3,
			onStart: function (target) {
				let noEncore = {encore:1, mimic:1, mirrormove:1, sketch:1, struggle:1, transform:1};
				let moveIndex = target.moves.indexOf(target.lastMove);
				if (!target.lastMove || noEncore[target.lastMove] || (target.moveset[moveIndex] && target.moveset[moveIndex].pp <= 0)) {
					// it failed
					delete target.volatiles['encore'];
					return false;
				}
				this.effectData.move = target.lastMove;
				this.add('-start', target, 'Encore');
				if (!this.willMove(target)) {
					this.effectData.duration++;
				}
			},
			onOverrideDecision: function (pokemon, target, move) {
				if (move.id !== this.effectData.move) return this.effectData.move;
			},
			onResidualOrder: 13,
			onResidual: function (target) {
				if (target.moves.indexOf(target.lastMove) >= 0 && target.moveset[target.moves.indexOf(target.lastMove)].pp <= 0) { // early termination if you run out of PP
					delete target.volatiles.encore;
					this.add('-end', target, 'Encore');
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove: function (pokemon) {
				if (!this.effectData.move || !pokemon.hasMove(this.effectData.move)) {
					return;
				}
				for (let i = 0; i < pokemon.moveset.length; i++) {
					if (pokemon.moveset[i].id !== this.effectData.move) {
						pokemon.disableMove(pokemon.moveset[i].id);
					}
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"endeavor": {
		num: 283,
		accuracy: 100,
		basePower: 0,
		damageCallback: function (pokemon, target) {
			return target.hp - pokemon.hp;
		},
		category: "Physical",
		desc: "Deals damage to the target equal to (target's current HP - user's current HP). The target is unaffected if its current HP is less than or equal to the user's current HP.",
		shortDesc: "Lowers the target's HP to the user's HP.",
		id: "endeavor",
		name: "Endeavor",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTry: function (pokemon, target) {
			if (pokemon.hp >= target.hp) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"endure": {
		num: 203,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user will survive attacks made by other Pokemon during this turn with at least 1 HP. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		shortDesc: "The user survives the next hit with at least 1 HP.",
		id: "endure",
		name: "Endure",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'endure',
		onTryHit: function (pokemon) {
			return this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'move: Endure');
			},
			onDamagePriority: -10,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && damage >= target.hp) {
					this.add('-activate', target, 'move: Endure');
					return target.hp - 1;
				}
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	"energyball": {
		num: 412,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def. by 1.",
		id: "energyball",
		isViable: true,
		name: "Energy Ball",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	"entrainment": {
		num: 494,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target's Ability to become the same as the user's. Fails if the target's Ability is Multitype, Stance Change, Truant, or the same Ability as the user, or if the user's Ability is Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, or Zen Mode.",
		shortDesc: "The target's Ability changes to match the user's.",
		id: "entrainment",
		name: "Entrainment",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onTryHit: function (target, source) {
			if (target === source) return false;
			let bannedTargetAbilities = {multitype:1, stancechange:1, truant:1};
			let bannedSourceAbilities = {flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, stancechange:1, trace:1, zenmode:1};
			if (bannedTargetAbilities[target.ability] || bannedSourceAbilities[source.ability] || target.ability === source.ability) {
				return false;
			}
		},
		onHit: function (target, source) {
			let oldAbility = target.setAbility(source.ability);
			if (oldAbility) {
				this.add('-ability', target, this.getAbility(target.ability).name, '[from] move: Entrainment');
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"eruption": {
		num: 284,
		accuracy: 100,
		basePower: 150,
		basePowerCallback: function (pokemon, target, move) {
			return move.basePower * pokemon.hp / pokemon.maxhp;
		},
		category: "Special",
		desc: "Power is equal to (user's current HP * 150 / user's maximum HP), rounded down, but not less than 1.",
		shortDesc: "Less power as user's HP decreases. Hits foe(s).",
		id: "eruption",
		isViable: true,
		name: "Eruption",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Beautiful",
	},
	"explosion": {
		num: 153,
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		desc: "The user faints after using this move, even if this move fails for having no target. This move is prevented from executing if any active Pokemon has the Ability Damp.",
		shortDesc: "Hits adjacent Pokemon. The user faints.",
		id: "explosion",
		isViable: true,
		name: "Explosion",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		selfdestruct: true,
		secondary: false,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Beautiful",
	},
	"extrasensory": {
		num: 326,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 10% chance to flinch the target.",
		shortDesc: "10% chance to flinch the target.",
		id: "extrasensory",
		isViable: true,
		name: "Extrasensory",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	"extremespeed": {
		num: 245,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Nearly always goes first.",
		id: "extremespeed",
		isViable: true,
		name: "Extreme Speed",
		pp: 5,
		priority: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"facade": {
		num: 263,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Power doubles if the user is burned, paralyzed, or poisoned. The physical damage halving effect from the user's burn is ignored.",
		shortDesc: "Power doubles if user is burn/poison/paralyzed.",
		id: "facade",
		isViable: true,
		name: "Facade",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon) {
			if (pokemon.status && pokemon.status !== 'slp') {
				return this.chainModify(2);
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"feintattack": {
		num: 185,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "feintattack",
		name: "Feint Attack",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"fairylock": {
		num: 587,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents all active Pokemon from switching next turn. A Pokemon can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. Fails if this move was used successfully last turn.",
		shortDesc: "Prevents all Pokemon from switching next turn.",
		id: "fairylock",
		name: "Fairy Lock",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, authentic: 1},
		pseudoWeather: 'fairylock',
		effect: {
			duration: 2,
			onStart: function (target) {
				this.add('-activate', target, 'move: Fairy Lock');
			},
			onTrapPokemon: function (pokemon) {
				pokemon.tryTrap();
			},
		},
		secondary: false,
		target: "all",
		type: "Fairy",
		contestType: "Clever",
	},
	"fairywind": {
		num: 584,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "fairywind",
		name: "Fairy Wind",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	},
	"fakeout": {
		num: 252,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Has a 100% chance to flinch the target. Fails unless it is the user's first turn on the field.",
		shortDesc: "Hits first. First turn out only. 100% flinch chance.",
		id: "fakeout",
		isViable: true,
		name: "Fake Out",
		pp: 10,
		priority: 3,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTry: function (pokemon, target) {
			if (pokemon.activeTurns > 1) {
				this.add('-fail', pokemon);
				this.add('-hint', "Fake Out only works on your first turn out.");
				return null;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"faketears": {
		num: 313,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Defense by 2 stages.",
		shortDesc: "Lowers the target's Sp. Def by 2.",
		id: "faketears",
		name: "Fake Tears",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			spd: -2,
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Cute",
	},
	"falseswipe": {
		num: 206,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Leaves the target with at least 1 HP.",
		shortDesc: "Always leaves the target with at least 1 HP.",
		id: "falseswipe",
		name: "False Swipe",
		pp: 40,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		noFaint: true,
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"featherdance": {
		num: 297,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 2 stages.",
		shortDesc: "Lowers the target's Attack by 2.",
		id: "featherdance",
		name: "Feather Dance",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			atk: -2,
		},
		secondary: false,
		target: "normal",
		type: "Flying",
		contestType: "Beautiful",
	},
	"feint": {
		num: 364,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
		shortDesc: "Nullifies Detect, Protect, and Quick/Wide Guard.",
		id: "feint",
		name: "Feint",
		pp: 10,
		priority: 2,
		flags: {mirror: 1},
		breaksProtect: true,
		// Breaking protection implemented in scripts.js
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"fellstinger": {
		num: 565,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Raises the user's Attack by 2 stages if this move knocks out the target.",
		shortDesc: "Raises user's Attack by 2 if this KOes the target.",
		id: "fellstinger",
		name: "Fell Stinger",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit: function (target, pokemon) {
			pokemon.addVolatile('fellstinger');
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function (pokemon, target, move) {
				if (!target || target.fainted || target.hp <= 0) this.boost({atk:2}, pokemon, pokemon, move);
				pokemon.removeVolatile('fellstinger');
			},
		},
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	"fierydance": {
		num: 552,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 50% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "50% chance to raise the user's Sp. Atk by 1.",
		id: "fierydance",
		isViable: true,
		name: "Fiery Dance",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
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
	"finalgambit": {
		num: 515,
		accuracy: 100,
		basePower: 0,
		damageCallback: function (pokemon) {
			let damage = pokemon.hp;
			pokemon.faint();
			return damage;
		},
		category: "Special",
		desc: "Deals damage to the target equal to the user's current HP. If this move is successful, the user faints.",
		shortDesc: "Does damage equal to the user's HP. User faints.",
		id: "finalgambit",
		isViable: true,
		name: "Final Gambit",
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		selfdestruct: true,
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"fireblast": {
		num: 126,
		accuracy: 85,
		basePower: 110,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the target.",
		id: "fireblast",
		isViable: true,
		name: "Fire Blast",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"firefang": {
		num: 424,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		desc: "Has a 10% chance to burn the target and a 10% chance to flinch it.",
		shortDesc: "10% chance to burn. 10% chance to flinch.",
		id: "firefang",
		isViable: true,
		name: "Fire Fang",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondaries: [
			{
				chance: 10,
				status: 'brn',
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	"firepledge": {
		num: 519,
		accuracy: 100,
		basePower: 80,
		basePowerCallback: function (target, source, move) {
			if (move.sourceEffect in {grasspledge:1, waterpledge:1}) {
				this.add('-combine');
				return 150;
			}
			return 80;
		},
		category: "Special",
		desc: "If one of the user's allies chose to use Grass Pledge or Water Pledge this turn and has not moved yet, it takes its turn immediately after the user and the user's move does nothing. If combined with Grass Pledge, the ally uses Fire Pledge with 150 Base Power and a sea of fire appears on the target's side for 4 turns, which causes damage to non-Fire types equal to 1/8 of their maximum HP, rounded down, at the end of each turn during effect. If combined with Water Pledge, the ally uses Water Pledge with 150 Base Power and a rainbow appears on the user's side for 4 turns, which doubles secondary effect chances but does not stack with the Ability Serene Grace. When used as a combined move, this move gains STAB no matter what the user's type is. This move does not consume the user's Fire Gem.",
		shortDesc: "Use with Grass or Water Pledge for added effect.",
		id: "firepledge",
		name: "Fire Pledge",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		onPrepareHit: function (target, source, move) {
			for (let i = 0; i < this.queue.length; i++) {
				let decision = this.queue[i];
				if (!decision.move || !decision.pokemon || !decision.pokemon.isActive || decision.pokemon.fainted) continue;
				if (decision.pokemon.side === source.side && decision.move.id in {grasspledge:1, waterpledge:1}) {
					this.prioritizeQueue(decision);
					this.add('-waiting', source, decision.pokemon);
					return null;
				}
			}
		},
		onModifyMove: function (move) {
			if (move.sourceEffect === 'waterpledge') {
				move.type = 'Water';
				move.hasSTAB = true;
			}
			if (move.sourceEffect === 'grasspledge') {
				move.type = 'Fire';
				move.hasSTAB = true;
			}
		},
		onHit: function (target, source, move) {
			if (move.sourceEffect === 'grasspledge') {
				target.side.addSideCondition('firepledge');
			}
			if (move.sourceEffect === 'waterpledge') {
				source.side.addSideCondition('waterpledge');
			}
		},
		effect: {
			duration: 4,
			onStart: function (targetSide) {
				this.add('-sidestart', targetSide, 'Fire Pledge');
			},
			onEnd: function (targetSide) {
				this.add('-sideend', targetSide, 'Fire Pledge');
			},
			onResidual: function (side) {
				for (let i = 0; i < side.active.length; i++) {
					let pokemon = side.active[i];
					if (pokemon && !pokemon.hasType('Fire')) {
						this.damage(pokemon.maxhp / 8, pokemon);
					}
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"firepunch": {
		num: 7,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the target.",
		id: "firepunch",
		isViable: true,
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
	"firespin": {
		num: 83,
		accuracy: 85,
		basePower: 35,
		category: "Special",
		desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "firespin",
		name: "Fire Spin",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"fissure": {
		num: 90,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Ability Sturdy are immune.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "fissure",
		name: "Fissure",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	"flail": {
		num: 175,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let ratio = pokemon.hp * 48 / pokemon.maxhp;
			if (ratio < 2) {
				return 200;
			}
			if (ratio < 5) {
				return 150;
			}
			if (ratio < 10) {
				return 100;
			}
			if (ratio < 17) {
				return 80;
			}
			if (ratio < 33) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Deals damage to the target based on the amount of HP the user has left. X is equal to (user's current HP * 48 / user's maximum HP), rounded down; the base power of this attack is 20 if X is 33 to 48, 40 if X is 17 to 32, 80 if X is 10 to 16, 100 if X is 5 to 9, 150 if X is 2 to 4, and 200 if X is 0 or 1.",
		shortDesc: "More power the less HP the user has left.",
		id: "flail",
		name: "Flail",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"flameburst": {
		num: 481,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "If this move is successful, each ally adjacent to the target loses 1/16 of its maximum HP, rounded down, unless it has the Ability Magic Guard.",
		shortDesc: "Damages Pokemon next to the target as well.",
		id: "flameburst",
		name: "Flame Burst",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit: function (target, source) {
			let allyActive = target.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && this.isAdjacent(target, allyActive[i])) {
					this.damage(allyActive[i].maxhp / 16, allyActive[i], source, 'flameburst');
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"flamecharge": {
		num: 488,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a 100% chance to raise the user's Speed by 1 stage.",
		shortDesc: "100% chance to raise the user's Speed by 1.",
		id: "flamecharge",
		isViable: true,
		name: "Flame Charge",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	"flamewheel": {
		num: 172,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the target. Thaws user.",
		id: "flamewheel",
		name: "Flame Wheel",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"flamethrower": {
		num: 53,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the target.",
		id: "flamethrower",
		isViable: true,
		name: "Flamethrower",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"flareblitz": {
		num: 394,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Has a 10% chance to burn the target. If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil. 10% chance to burn. Thaws user.",
		id: "flareblitz",
		isViable: true,
		name: "Flare Blitz",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
		recoil: [33, 100],
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	"flash": {
		num: 148,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's accuracy by 1 stage.",
		shortDesc: "Lowers the target's accuracy by 1.",
		id: "flash",
		name: "Flash",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			accuracy: -1,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"flashcannon": {
		num: 430,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "flashcannon",
		isViable: true,
		name: "Flash Cannon",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Beautiful",
	},
	"flatter": {
		num: 260,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Raises the target's Special Attack by 1 stage and confuses it.",
		shortDesc: "Raises the target's Sp. Atk by 1 and confuses it.",
		id: "flatter",
		name: "Flatter",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		volatileStatus: 'confusion',
		boosts: {
			spa: 1,
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"fling": {
		num: 374,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		desc: "The power of this move is based on the user's held item. The held item is lost and it activates for the target if applicable. If there is no target or the target avoids this move by protecting itself, the user's held item is still lost. The user can regain a thrown item with Recycle or the Ability Harvest. Fails if the user has no held item, if the held item cannot be thrown, if the user is under the effect of Embargo or Magic Room, or if the user has the Ability Klutz.",
		shortDesc: "Flings the user's item at the target. Power varies.",
		id: "fling",
		name: "Fling",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		beforeMoveCallback: function (pokemon) {
			if (pokemon.ignoringItem()) return;
			let item = pokemon.getItem();
			let noFling = item.onTakeItem && item.onTakeItem(item, pokemon) === false;
			if (item.fling && !noFling) {
				pokemon.addVolatile('fling');
				pokemon.setItem('');
				this.runEvent('AfterUseItem', pokemon, null, null, item);
			}
		},
		onPrepareHit: function (target, source, move) {
			if (!source.volatiles['fling']) return false;
			let item = this.getItem(source.volatiles['fling'].item);
			this.add("-enditem", source, item.name, '[from] move: Fling');
		},
		onAfterMove: function (pokemon) {
			pokemon.removeVolatile('fling');
		},
		effect: {
			duration: 1,
			onStart: function (pokemon) {
				this.effectData.item = pokemon.item;
			},
			onModifyMovePriority: -3,
			onModifyMove: function (move) {
				let item = this.getItem(this.effectData.item);
				move.basePower = item.fling.basePower;
				if (item.isBerry && item.id !== 'enigmaberry') {
					move.onHit = function (foe) {
						this.singleEvent('Eat', item, null, foe, null, null);
						this.runEvent('EatItem', foe, null, null, item);
						foe.ateBerry = true;
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
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Cute",
	},
	"flowershield": {
		num: 579,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the Defense of all Grass-type Pokemon on the field by 1 stage.",
		shortDesc: "Raises Defense by 1 of all active Grass types.",
		id: "flowershield",
		name: "Flower Shield",
		pp: 10,
		priority: 0,
		flags: {distance: 1},
		onHitField: function (target, source) {
			let targets = [];
			for (let sideSlot = 0; sideSlot < this.sides.length; sideSlot++) {
				let sideActive = this.sides[sideSlot].active;
				for (let activeSlot = 0; activeSlot < sideActive.length; activeSlot++) {
					if (sideActive[activeSlot] && sideActive[activeSlot].isActive && sideActive[activeSlot].hasType('Grass')) {
						// This move affects every Grass-type Pokemon in play.
						targets.push(sideActive[activeSlot]);
					}
				}
			}
			if (!targets.length) return false; // No targets; move fails
			for (let i = 0; i < targets.length; i++) {
				this.boost({def: 1}, targets[i], source, this.getMove('Flower Shield'));
			}
		},
		secondary: false,
		target: "all",
		type: "Fairy",
		contestType: "Beautiful",
	},
	"fly": {
		num: 19,
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		desc: "This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder, and Twister. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Flies up on first turn, then strikes the next turn.",
		id: "fly",
		name: "Fly",
		pp: 15,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		effect: {
			duration: 2,
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'thousandarrows' || move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onSourceModifyDamage: function (damage, source, target, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			},
		},
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Clever",
	},
	"flyingpress": {
		num: 560,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "This move combines Flying in its type effectiveness against the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "Combines Flying in its type effectiveness.",
		id: "flyingpress",
		name: "Flying Press",
		pp: 10,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, nonsky: 1},
		onEffectiveness: function (typeMod, type, move) {
			return typeMod + this.getEffectiveness('Flying', type);
		},
		priority: 0,
		secondary: false,
		target: "any",
		type: "Fighting",
		contestType: "Tough",
	},
	"focusblast": {
		num: 411,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "focusblast",
		isViable: true,
		name: "Focus Blast",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
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
	"focusenergy": {
		num: 116,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's chance for a critical hit by 2 stages. Fails if the user already has the effect. Baton Pass can be used to transfer this effect to an ally.",
		shortDesc: "Raises the user's critical hit ratio by 2.",
		id: "focusenergy",
		name: "Focus Energy",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		volatileStatus: 'focusenergy',
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'move: Focus Energy');
			},
			onModifyCritRatio: function (critRatio) {
				return critRatio + 2;
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cool",
	},
	"focuspunch": {
		num: 264,
		accuracy: 100,
		basePower: 150,
		category: "Physical",
		desc: "The user loses its focus and does nothing if it is hit by a damaging attack this turn before it can execute the move.",
		shortDesc: "Fails if the user takes damage before it hits.",
		id: "focuspunch",
		name: "Focus Punch",
		pp: 20,
		priority: -3,
		flags: {contact: 1, protect: 1, punch: 1},
		beforeTurnCallback: function (pokemon) {
			pokemon.addVolatile('focuspunch');
		},
		beforeMoveCallback: function (pokemon) {
			if (pokemon.volatiles['focuspunch'] && pokemon.volatiles['focuspunch'].lostFocus) {
				this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
				return true;
			}
		},
		effect: {
			duration: 1,
			onStart: function (pokemon) {
				this.add('-singleturn', pokemon, 'move: Focus Punch');
			},
			onHit: function (pokemon, source, move) {
				if (move.category !== 'Status') {
					pokemon.volatiles['focuspunch'].lostFocus = true;
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"followme": {
		num: 266,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the end of the turn, all single-target attacks from the foe's team are redirected to the user if they are in range. Such attacks are redirected to the user before they can be reflected by Magic Coat or the Ability Magic Bounce, or drawn in by the Abilities Lightning Rod or Storm Drain. Fails if it is not a Double or Triple Battle.",
		shortDesc: "The foes' moves target the user on the turn used.",
		id: "followme",
		name: "Follow Me",
		pp: 20,
		priority: 2,
		flags: {},
		volatileStatus: 'followme',
		onTryHit: function (target) {
			if (target.side.active.length < 2) return false;
		},
		effect: {
			duration: 1,
			onStart: function (pokemon) {
				this.add('-singleturn', pokemon, 'move: Follow Me');
			},
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget: function (target, source, source2, move) {
				if (this.validTarget(this.effectData.target, source, move.target)) {
					this.debug("Follow Me redirected target of move");
					return this.effectData.target;
				}
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"forcepalm": {
		num: 395,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		id: "forcepalm",
		name: "Force Palm",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"foresight": {
		num: 193,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to have its positive evasiveness stat stage ignored while it is active. Normal- and Fighting-type attacks can hit the target if it is a Ghost type. The effect ends when the target is no longer active. Fails if the target is already affected, or affected by Miracle Eye or Odor Sleuth.",
		shortDesc: "Fighting, Normal hit Ghost. Evasiveness ignored.",
		id: "foresight",
		name: "Foresight",
		pp: 40,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'foresight',
		onTryHit: function (target) {
			if (target.volatiles['miracleeye']) return false;
		},
		effect: {
			noCopy: true,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Foresight');
			},
			onNegateImmunity: function (pokemon, type) {
				if (pokemon.hasType('Ghost') && type in {'Normal': 1, 'Fighting': 1}) return false;
			},
			onModifyBoost: function (boosts) {
				if (boosts.evasion && boosts.evasion > 0) {
					boosts.evasion = 0;
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"forestscurse": {
		num: 571,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the Grass type to be added to the target, effectively making it have two or three types. Fails if the target is already a Grass type. If Trick-or-Treat adds a type to the target, it replaces the type added by this move and vice versa.",
		shortDesc: "Adds Grass to the target's type(s).",
		id: "forestscurse",
		name: "Forest's Curse",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onHit: function (target) {
			if (target.hasType('Grass')) return false;
			if (!target.addType('Grass')) return false;
			this.add('-start', target, 'typeadd', 'Grass', '[from] move: Forest\'s Curse');
		},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"foulplay": {
		num: 492,
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		desc: "Damage is calculated using the target's Attack stat, including stat stage changes. The user's Ability, item, and burn are used as normal.",
		shortDesc: "Uses target's Attack stat in damage calculation.",
		id: "foulplay",
		isViable: true,
		name: "Foul Play",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		useTargetOffensive: true,
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"freezedry": {
		num: 573,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Has a 10% chance to freeze the target. This move's type effectiveness against Water is changed to be super effective no matter what this move's type is.",
		shortDesc: "10% chance to freeze. Super effective on Water.",
		id: "freezedry",
		isViable: true,
		name: "Freeze-Dry",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness: function (typeMod, type) {
			if (type === 'Water') return 1;
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"freezeshock": {
		num: 553,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges turn 1. Hits turn 2. 30% paralyze.",
		id: "freezeshock",
		name: "Freeze Shock",
		pp: 5,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"frenzyplant": {
		num: 338,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "frenzyplant",
		name: "Frenzy Plant",
		pp: 5,
		priority: 0,
		flags: {recharge: 1, protect: 1, mirror: 1, nonsky: 1},
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	"frostbreath": {
		num: 524,
		accuracy: 90,
		basePower: 60,
		category: "Special",
		desc: "This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Abilities Battle Armor or Shell Armor.",
		shortDesc: "Always results in a critical hit.",
		id: "frostbreath",
		name: "Frost Breath",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"frustration": {
		num: 218,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon) {
			return Math.floor(((255 - pokemon.happiness) * 10) / 25) || 1;
		},
		category: "Physical",
		desc: "Power is equal to the greater of ((255 - user's Happiness) * 2/5), rounded down, or 1.",
		shortDesc: "Max 102 power at minimum Happiness.",
		id: "frustration",
		isViable: true,
		name: "Frustration",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"furyattack": {
		num: 31,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "furyattack",
		name: "Fury Attack",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"furycutter": {
		num: 210,
		accuracy: 95,
		basePower: 40,
		basePowerCallback: function (pokemon, target, move) {
			if (!pokemon.volatiles.furycutter) {
				pokemon.addVolatile('furycutter');
			}
			return this.clampIntRange(move.basePower * pokemon.volatiles.furycutter.multiplier, 1, 160);
		},
		category: "Physical",
		desc: "Power doubles with each successful hit, up to a maximum of 160 power; resets to 40 power if the move misses or another move is used.",
		shortDesc: "Power doubles with each hit, up to 160.",
		id: "furycutter",
		name: "Fury Cutter",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit: function (target, source) {
			source.addVolatile('furycutter');
		},
		effect: {
			duration: 2,
			onStart: function () {
				this.effectData.multiplier = 1;
			},
			onRestart: function () {
				if (this.effectData.multiplier < 4) {
					this.effectData.multiplier <<= 1;
				}
				this.effectData.duration = 2;
			},
		},
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	"furyswipes": {
		num: 154,
		accuracy: 80,
		basePower: 18,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "furyswipes",
		name: "Fury Swipes",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"fusionbolt": {
		num: 559,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Power doubles if the last move used by any Pokemon this turn was Fusion Flare.",
		shortDesc: "Power doubles if used after Fusion Flare.",
		id: "fusionbolt",
		isViable: true,
		name: "Fusion Bolt",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon) {
			let actives = pokemon.side.active;
			for (let i = 0; i < actives.length; i++) {
				if (actives[i] && actives[i].moveThisTurn === 'fusionflare') {
					this.debug('double power');
					return this.chainModify(2);
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"fusionflare": {
		num: 558,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Power doubles if the last move used by any Pokemon this turn was Fusion Bolt.",
		shortDesc: "Power doubles if used after Fusion Bolt.",
		id: "fusionflare",
		isViable: true,
		name: "Fusion Flare",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon) {
			let actives = pokemon.side.active;
			for (let i = 0; i < actives.length; i++) {
				if (actives[i] && actives[i].moveThisTurn === 'fusionbolt') {
					this.debug('double power');
					return this.chainModify(2);
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"futuresight": {
		num: 248,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Doom Desire is already in effect for the target's position.",
		shortDesc: "Hits two turns after being used.",
		id: "futuresight",
		name: "Future Sight",
		pp: 10,
		priority: 0,
		flags: {},
		ignoreImmunity: true,
		isFutureMove: true,
		onTry: function (source, target) {
			target.side.addSideCondition('futuremove');
			if (target.side.sideConditions['futuremove'].positions[target.position]) {
				return false;
			}
			target.side.sideConditions['futuremove'].positions[target.position] = {
				duration: 3,
				move: 'futuresight',
				source: source,
				moveData: {
					id: 'futuresight',
					name: "Future Sight",
					accuracy: 100,
					basePower: 120,
					category: "Special",
					flags: {},
					ignoreImmunity: false,
					effectType: 'Move',
					isFutureMove: true,
					type: 'Psychic',
				},
			};
			this.add('-start', source, 'move: Future Sight');
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"gastroacid": {
		num: 380,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target's Ability to be rendered ineffective as long as it remains active. If the target uses Baton Pass, the replacement will remain under this effect. Fails if the target's Ability is Multitype or Stance Change.",
		shortDesc: "Nullifies the target's Ability.",
		id: "gastroacid",
		name: "Gastro Acid",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		volatileStatus: 'gastroacid',
		onTryHit: function (pokemon) {
			let bannedAbilities = {multitype:1, stancechange:1};
			if (bannedAbilities[pokemon.ability]) {
				return false;
			}
		},
		effect: {
			// Ability suppression implemented in BattlePokemon.ignoringAbility() within battle-engine.js
			onStart: function (pokemon) {
				this.add('-endability', pokemon);
				this.singleEvent('End', this.getAbility(pokemon.ability), pokemon.abilityData, pokemon, pokemon, 'gastroacid');
			},
		},
		secondary: false,
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	"geargrind": {
		num: 544,
		accuracy: 85,
		basePower: 50,
		category: "Physical",
		desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		id: "geargrind",
		isViable: true,
		name: "Gear Grind",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Steel",
		contestType: "Clever",
	},
	"geomancy": {
		num: 601,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack, Special Defense, and Speed by 2 stages. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges, then raises SpA, SpD, Spe by 2 turn 2.",
		id: "geomancy",
		isViable: true,
		name: "Geomancy",
		pp: 10,
		priority: 0,
		flags: {charge: 1, nonsky: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				attacker.removeVolatile(move.id);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		boosts: {
			spa: 2,
			spd: 2,
			spe: 2,
		},
		secondary: false,
		target: "self",
		type: "Fairy",
		contestType: "Beautiful",
	},
	"gigadrain": {
		num: 202,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "gigadrain",
		isViable: true,
		name: "Giga Drain",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"gigaimpact": {
		num: 416,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		desc: "If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "gigaimpact",
		name: "Giga Impact",
		pp: 5,
		priority: 0,
		flags: {contact: 1, recharge: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"glaciate": {
		num: 549,
		accuracy: 95,
		basePower: 65,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
		id: "glaciate",
		name: "Glaciate",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	"glare": {
		num: 137,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes the target.",
		shortDesc: "Paralyzes the target.",
		id: "glare",
		isViable: true,
		name: "Glare",
		pp: 30,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'par',
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"grassknot": {
		num: 447,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
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
		desc: "Deals damage to the target based on its weight. Power is 20 if less than 10kg, 40 if less than 25kg, 60 if less than 50kg, 80 if less than 100kg, 100 if less than 200kg, and 120 if greater than or equal to 200kg.",
		shortDesc: "More power the heavier the target.",
		id: "grassknot",
		isViable: true,
		name: "Grass Knot",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Cute",
	},
	"grasspledge": {
		num: 520,
		accuracy: 100,
		basePower: 80,
		basePowerCallback: function (target, source, move) {
			if (move.sourceEffect in {waterpledge:1, firepledge:1}) {
				this.add('-combine');
				return 150;
			}
			return 80;
		},
		category: "Special",
		desc: "If one of the user's allies chose to use Fire Pledge or Water Pledge this turn and has not moved yet, it takes its turn immediately after the user and the user's move does nothing. If combined with Fire Pledge, the ally uses Fire Pledge with 150 Base Power and a sea of fire appears on the target's side for 4 turns, which causes damage to non-Fire types equal to 1/8 of their maximum HP, rounded down, at the end of each turn during effect. If combined with Water Pledge, the ally uses Grass Pledge with 150 Base Power and a swamp appears on the target's side for 4 turns, which quarters the Speed of each Pokemon on that side. When used as a combined move, this move gains STAB no matter what the user's type is. This move does not consume the user's Grass Gem.",
		shortDesc: "Use with Fire or Water Pledge for added effect.",
		id: "grasspledge",
		name: "Grass Pledge",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		onPrepareHit: function (target, source, move) {
			for (let i = 0; i < this.queue.length; i++) {
				let decision = this.queue[i];
				if (!decision.move || !decision.pokemon || !decision.pokemon.isActive || decision.pokemon.fainted) continue;
				if (decision.pokemon.side === source.side && decision.move.id in {waterpledge:1, firepledge:1}) {
					this.prioritizeQueue(decision);
					this.add('-waiting', source, decision.pokemon);
					return null;
				}
			}
		},
		onModifyMove: function (move) {
			if (move.sourceEffect === 'waterpledge') {
				move.type = 'Grass';
				move.hasSTAB = true;
			}
			if (move.sourceEffect === 'firepledge') {
				move.type = 'Fire';
				move.hasSTAB = true;
			}
		},
		onHit: function (target, source, move) {
			if (move.sourceEffect === 'waterpledge') {
				target.side.addSideCondition('grasspledge');
			}
			if (move.sourceEffect === 'firepledge') {
				target.side.addSideCondition('firepledge');
			}
		},
		effect: {
			duration: 4,
			onStart: function (targetSide) {
				this.add('-sidestart', targetSide, 'Grass Pledge');
			},
			onEnd: function (targetSide) {
				this.add('-sideend', targetSide, 'Grass Pledge');
			},
			onModifySpe: function (spe, pokemon) {
				return this.chainModify(0.25);
			},
		},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	"grasswhistle": {
		num: 320,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to fall asleep.",
		shortDesc: "Puts the target to sleep.",
		id: "grasswhistle",
		name: "Grass Whistle",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"grassyterrain": {
		num: 580,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the terrain becomes Grassy Terrain. During the effect, the power of Grass-type attacks used by grounded Pokemon is multiplied by 1.5, the power of Bulldoze, Earthquake, and Magnitude used against grounded Pokemon is multiplied by 0.5, and grounded Pokemon have 1/16 of their maximum HP, rounded down, restored at the end of each turn, including the last turn. Camouflage transforms the user into a Grass type, Nature Power becomes Energy Ball, and Secret Power has a 30% chance to cause sleep. Fails if the current terrain is Grassy Terrain.",
		shortDesc: "5 turns. Grounded: +Grass power,+1/16 max HP.",
		id: "grassyterrain",
		name: "Grassy Terrain",
		pp: 10,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'grassyterrain',
		effect: {
			duration: 5,
			onBasePower: function (basePower, attacker, defender, move) {
				let weakenedMoves = {'earthquake':1, 'bulldoze':1, 'magnitude':1};
				if (move.id in weakenedMoves) {
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if (move.type === 'Grass' && attacker.isGrounded()) {
					this.debug('grassy terrain boost');
					return this.chainModify(1.5);
				}
			},
			onStart: function (battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Grassy Terrain');
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 2,
			onResidual: function (battle) {
				this.debug('onResidual battle');
				let pokemon;
				for (let s in battle.sides) {
					for (let p in battle.sides[s].active) {
						pokemon = battle.sides[s].active[p];
						if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
							this.debug('Pokemon is grounded, healing through Grassy Terrain.');
							this.heal(pokemon.maxhp / 16, pokemon, pokemon);
						}
					}
				}
			},
			onEnd: function () {
				this.add('-fieldend', 'move: Grassy Terrain');
			},
		},
		secondary: false,
		target: "all",
		type: "Grass",
		contestType: "Beautiful",
	},
	"gravity": {
		num: 356,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the evasiveness of all active Pokemon is multiplied by 0.6. At the time of use, Bounce, Fly, Magnet Rise, Sky Drop, and Telekinesis end immediately for all active Pokemon. During the effect, Bounce, Fly, Flying Press, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash, and Telekinesis are prevented from being used by all active Pokemon. Ground-type attacks, Spikes, Toxic Spikes, Sticky Web, and the Ability Arena Trap can affect Flying types or Pokemon with the Ability Levitate. Fails if this move is already in effect.",
		shortDesc: "For 5 turns, negates all Ground immunities.",
		id: "gravity",
		name: "Gravity",
		pp: 5,
		priority: 0,
		flags: {nonsky: 1},
		pseudoWeather: 'gravity',
		effect: {
			duration: 5,
			durationCallback: function (source, effect) {
				if (source && source.hasAbility('persistent')) {
					return 7;
				}
				return 5;
			},
			onStart: function () {
				this.add('-fieldstart', 'move: Gravity');
				const allActivePokemon = this.sides[0].active.concat(this.sides[1].active);
				for (let pokemon of allActivePokemon) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.cancelMove(pokemon);

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
					if (applies) this.add('-activate', pokemon, 'Gravity');
				}
			},
			onModifyAccuracy: function (accuracy) {
				if (typeof accuracy !== 'number') return;
				return accuracy * 5 / 3;
			},
			onDisableMove: function (pokemon) {
				for (let i = 0; i < pokemon.moveset.length; i++) {
					if (this.getMove(pokemon.moveset[i].id).flags['gravity']) {
						pokemon.disableMove(pokemon.moveset[i].id);
					}
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove: function (pokemon, target, move) {
				if (move.flags['gravity']) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd: function () {
				this.add('-fieldend', 'move: Gravity');
			},
		},
		secondary: false,
		target: "all",
		type: "Psychic",
		contestType: "Clever",
	},
	"growl": {
		num: 45,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 1 stage.",
		shortDesc: "Lowers the foe(s) Attack by 1.",
		id: "growl",
		name: "Growl",
		pp: 40,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		boosts: {
			atk: -1,
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cute",
	},
	"growth": {
		num: 74,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Special Attack by 1 stage. If the weather is Sunny Day, raises the user's Attack and Special Attack by 2 stages.",
		shortDesc: "Raises user's Attack and Sp. Atk by 1; 2 in Sun.",
		id: "growth",
		name: "Growth",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		onModifyMove: function (move) {
			if (this.isWeather(['sunnyday', 'desolateland'])) move.boosts = {atk: 2, spa: 2};
		},
		boosts: {
			atk: 1,
			spa: 1,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Beautiful",
	},
	"grudge": {
		num: 288,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the user's next turn, if a foe's attack knocks the user out, that foe loses all remaining PP for that attack.",
		shortDesc: "If the user faints, the attack used loses all its PP.",
		id: "grudge",
		name: "Grudge",
		pp: 5,
		priority: 0,
		flags: {authentic: 1},
		volatileStatus: 'grudge',
		effect: {
			onStart: function (pokemon) {
				this.add('-singlemove', pokemon, 'Grudge');
			},
			onFaint: function (target, source, effect) {
				if (!source || !effect) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove) {
					for (let i in source.moveset) {
						if (source.moveset[i].id === source.lastMove) {
							source.moveset[i].pp = 0;
							this.add('-activate', source, 'Grudge', this.getMove(source.lastMove).name);
						}
					}
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove: function (pokemon) {
				this.debug('removing Grudge before attack');
				pokemon.removeVolatile('grudge');
			},
		},
		secondary: false,
		target: "self",
		type: "Ghost",
		contestType: "Tough",
	},
	"guardsplit": {
		num: 470,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and the target have their Defense and Special Defense stats set to be equal to the average of the user and the target's Defense and Special Defense stats, respectively, rounded down. Stat stage changes are unaffected.",
		shortDesc: "Averages Defense and Sp. Def stats with target.",
		id: "guardsplit",
		name: "Guard Split",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onHit: function (target, source) {
			let newdef = Math.floor((target.stats.def + source.stats.def) / 2);
			target.stats.def = newdef;
			source.stats.def = newdef;
			let newspd = Math.floor((target.stats.spd + source.stats.spd) / 2);
			target.stats.spd = newspd;
			source.stats.spd = newspd;
			this.add('-activate', source, 'Guard Split', '[of] ' + target);
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"guardswap": {
		num: 385,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps its Defense and Special Defense stat stage changes with the target.",
		shortDesc: "Swaps Defense and Sp. Def changes with target.",
		id: "guardswap",
		name: "Guard Swap",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
		onHit: function (target, source) {
			let targetBoosts = {};
			let sourceBoosts = {};

			for (let i in {def:1, spd:1}) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);

			this.add('-swapboost', source, target, 'def, spd', '[from] move: Guard Swap');
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"guillotine": {
		num: 12,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Ability Sturdy are immune.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "guillotine",
		name: "Guillotine",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"gunkshot": {
		num: 441,
		accuracy: 80,
		basePower: 120,
		category: "Physical",
		desc: "Has a 30% chance to poison the target.",
		shortDesc: "30% chance to poison the target.",
		id: "gunkshot",
		isViable: true,
		name: "Gunk Shot",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	"gust": {
		num: 16,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Damage doubles if the target is using Bounce, Fly, or Sky Drop.",
		shortDesc: "Power doubles during Fly, Bounce, and Sky Drop.",
		id: "gust",
		name: "Gust",
		pp: 35,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1},
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Clever",
	},
	"gyroball": {
		num: 360,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let power = (Math.floor(25 * target.getStat('spe') / pokemon.getStat('spe')) || 1);
			if (power > 150) power = 150;
			this.debug('' + power + ' bp');
			return power;
		},
		category: "Physical",
		desc: "Power is equal to (25 * target's current Speed / user's current Speed), rounded down, + 1, but not more than 150.",
		shortDesc: "More power the slower the user than the target.",
		id: "gyroball",
		isViable: true,
		name: "Gyro Ball",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	"hail": {
		num: 258,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Hail. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are an Ice type, or have the Abilities Ice Body, Magic Guard, Overcoat, or Snow Cloak. Lasts for 8 turns if the user is holding Icy Rock. Fails if the current weather is Hail.",
		shortDesc: "For 5 turns, hail crashes down.",
		id: "hail",
		name: "Hail",
		pp: 10,
		priority: 0,
		flags: {},
		weather: 'hail',
		secondary: false,
		target: "all",
		type: "Ice",
		contestType: "Beautiful",
	},
	"hammerarm": {
		num: 359,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		desc: "Lowers the user's Speed by 1 stage.",
		shortDesc: "Lowers the user's Speed by 1.",
		id: "hammerarm",
		isViable: true,
		name: "Hammer Arm",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		self: {
			boosts: {
				spe: -1,
			},
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"happyhour": {
		num: 603,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Money falls from the sky.",
		shortDesc: "No competitive use.",
		id: "happyhour",
		name: "Happy Hour",
		pp: 30,
		priority: 0,
		flags: {},
		onTryHit: function (target, source) {
			this.add('-activate', target, 'move: Happy Hour');
			return null;
		},
		secondary: false,
		target: "allySide",
		type: "Normal",
		contestType: "Cute",
	},
	"harden": {
		num: 106,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 1 stage.",
		shortDesc: "Raises the user's Defense by 1.",
		id: "harden",
		name: "Harden",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: 1,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	"haze": {
		num: 114,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Resets the stat stages of all active Pokemon to 0.",
		shortDesc: "Eliminates all stat changes.",
		id: "haze",
		isViable: true,
		name: "Haze",
		pp: 30,
		priority: 0,
		flags: {authentic: 1},
		onHitField: function () {
			this.add('-clearallboost');
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					if (this.sides[i].active[j] && this.sides[i].active[j].isActive) this.sides[i].active[j].clearBoosts();
				}
			}
		},
		secondary: false,
		target: "all",
		type: "Ice",
		contestType: "Beautiful",
	},
	"headcharge": {
		num: 543,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 1/4 recoil.",
		id: "headcharge",
		isViable: true,
		name: "Head Charge",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [1, 4],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"headsmash": {
		num: 457,
		accuracy: 80,
		basePower: 150,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 1/2 recoil.",
		id: "headsmash",
		isViable: true,
		name: "Head Smash",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [1, 2],
		secondary: false,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	"headbutt": {
		num: 29,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "headbutt",
		name: "Headbutt",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"healbell": {
		num: 215,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Every Pokemon in the user's party is cured of its major status condition. Active Pokemon with the Ability Soundproof are not cured.",
		shortDesc: "Cures the user's party of all status conditions.",
		id: "healbell",
		isViable: true,
		name: "Heal Bell",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, sound: 1, distance: 1, authentic: 1},
		onHit: function (pokemon, source) {
			this.add('-cureteam', source, '[from] move: Heal Bell');
			let side = pokemon.side;
			for (let i = 0; i < side.pokemon.length; i++) {
				if (side.pokemon[i].hasAbility('soundproof')) continue;
				if (side.pokemon[i].status && side.pokemon[i].hp) {
					this.add('-curestatus', side.pokemon[i], side.pokemon[i].status);
					side.pokemon[i].status = '';
				}
			}
		},
		target: "allyTeam",
		type: "Normal",
		contestType: "Beautiful",
	},
	"healblock": {
		num: 377,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the target is prevented from restoring any HP as long as it remains active. During the effect, healing and draining moves are unusable, and Abilities and items that grant healing will not heal the user. If an affected Pokemon uses Baton Pass, the replacement will remain unable to restore its HP. Pain Split and the Ability Regenerator are unaffected.",
		shortDesc: "For 5 turns, the foe(s) is prevented from healing.",
		id: "healblock",
		name: "Heal Block",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		volatileStatus: 'healblock',
		effect: {
			duration: 5,
			durationCallback: function (target, source, effect) {
				if (source && source.hasAbility('persistent')) {
					return 7;
				}
				return 5;
			},
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'move: Heal Block');
			},
			onDisableMove: function (pokemon) {
				for (let i = 0; i < pokemon.moveset.length; i++) {
					if (this.getMove(pokemon.moveset[i].id).flags['heal']) {
						pokemon.disableMove(pokemon.moveset[i].id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove: function (pokemon, target, move) {
				if (move.flags['heal']) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 17,
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal: false,
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Psychic",
		contestType: "Clever",
	},
	"healorder": {
		num: 456,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "healorder",
		isViable: true,
		name: "Heal Order",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		secondary: false,
		target: "self",
		type: "Bug",
		contestType: "Clever",
	},
	"healpulse": {
		num: 505,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The target restores 1/2 of its maximum HP, rounded half up. If the user has the Ability Mega Launcher, the target instead restores 3/4 of its maximum HP, rounded half down.",
		shortDesc: "Heals the target by 50% of its max HP.",
		id: "healpulse",
		name: "Heal Pulse",
		pp: 10,
		priority: 0,
		flags: {protect: 1, pulse: 1, reflectable: 1, distance: 1, heal: 1},
		onHit: function (target, source) {
			if (source.hasAbility('megalauncher')) {
				this.heal(this.modify(target.maxhp, 0.75));
			} else {
				this.heal(Math.ceil(target.maxhp * 0.5));
			}
		},
		secondary: false,
		target: "any",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"healingwish": {
		num: 361,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user faints and the Pokemon brought out to replace it has its HP fully restored along with having any major status condition cured. Fails if the user is the last unfainted Pokemon in its party.",
		shortDesc: "User faints. Replacement is fully healed.",
		id: "healingwish",
		isViable: true,
		name: "Healing Wish",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onTryHit: function (pokemon, target, move) {
			if (!this.canSwitch(pokemon.side)) {
				delete move.selfdestruct;
				return false;
			}
		},
		selfdestruct: true,
		sideCondition: 'healingwish',
		effect: {
			duration: 2,
			onStart: function (side, source) {
				this.debug('Healing Wish started on ' + side.name);
				this.effectData.positions = [];
				for (let i = 0; i < side.active.length; i++) {
					this.effectData.positions[i] = false;
				}
				this.effectData.positions[source.position] = true;
			},
			onRestart: function (side, source) {
				this.effectData.positions[source.position] = true;
			},
			onSwitchInPriority: 1,
			onSwitchIn: function (target) {
				if (!this.effectData.positions[target.position]) {
					return;
				}
				if (!target.fainted) {
					target.heal(target.maxhp);
					target.setStatus('');
					this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
					this.effectData.positions[target.position] = false;
				}
				if (!this.effectData.positions.some(affected => affected === true)) {
					target.side.removeSideCondition('healingwish');
				}
			},
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"heartstamp": {
		num: 531,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "heartstamp",
		name: "Heart Stamp",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Cute",
	},
	"heartswap": {
		num: 391,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps all its stat stage changes with the target.",
		shortDesc: "Swaps all stat changes with target.",
		id: "heartswap",
		name: "Heart Swap",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
		onHit: function (target, source) {
			let targetBoosts = {};
			let sourceBoosts = {};

			for (let i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);

			this.add('-swapboost', source, target, '[from] move: Heart Swap');
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"heatcrash": {
		num: 535,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
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
		desc: "The power of this move depends on (user's weight / target's weight), rounded down. Power is equal to 120 if the result is 5 or more, 100 if 4, 80 if 3, 60 if 2, and 40 if 1 or less. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "More power the heavier the user than the target.",
		id: "heatcrash",
		name: "Heat Crash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	"heatwave": {
		num: 257,
		accuracy: 90,
		basePower: 95,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the foe(s).",
		id: "heatwave",
		isViable: true,
		name: "Heat Wave",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Beautiful",
	},
	"heavyslam": {
		num: 484,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
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
		desc: "The power of this move depends on (user's weight / target's weight), rounded down. Power is equal to 120 if the result is 5 or more, 100 if 4, 80 if 3, 60 if 2, and 40 if 1 or less.",
		shortDesc: "More power the heavier the user than the target.",
		id: "heavyslam",
		isViable: true,
		name: "Heavy Slam",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "normal",
		type: "Steel",
		contestType: "Tough",
	},
	"helpinghand": {
		num: 270,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The power of the target's attack this turn is multiplied by 1.5 (this effect is stackable). Fails if there is no ally adjacent to the user, but does not fail if the ally is using a two-turn move.",
		shortDesc: "One adjacent ally's move power is 1.5x this turn.",
		id: "helpinghand",
		name: "Helping Hand",
		pp: 20,
		priority: 5,
		flags: {authentic: 1},
		volatileStatus: 'helpinghand',
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.effectData.multiplier = 1.5;
				this.add('-singleturn', target, 'Helping Hand', '[of] ' + source);
			},
			onRestart: function (target, source) {
				this.effectData.multiplier *= 1.5;
				this.add('-singleturn', target, 'Helping Hand', '[of] ' + source);
			},
			onBasePowerPriority: 3,
			onBasePower: function (basePower) {
				this.debug('Boosting from Helping Hand: ' + this.effectData.multiplier);
				return this.chainModify(this.effectData.multiplier);
			},
		},
		secondary: false,
		target: "adjacentAlly",
		type: "Normal",
		contestType: "Clever",
	},
	"hex": {
		num: 506,
		accuracy: 100,
		basePower: 65,
		basePowerCallback: function (pokemon, target, move) {
			if (target.status) return move.basePower * 2;
			return move.basePower;
		},
		category: "Special",
		desc: "Power doubles if the target has a major status condition.",
		shortDesc: "Power doubles if the target has a status ailment.",
		id: "hex",
		isViable: true,
		name: "Hex",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	"hiddenpower": {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "This move's type depends on the user's individual values (IVs), and can be any type but Fairy and Normal.",
		shortDesc: "Varies in type based on the user's IVs.",
		id: "hiddenpower",
		name: "Hidden Power",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move, pokemon) {
			move.type = pokemon.hpType || 'Dark';
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"hiddenpowerbug": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Bug",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	"hiddenpowerdark": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Dark",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"hiddenpowerdragon": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Dragon",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Dragon",
		contestType: "Clever",
	},
	"hiddenpowerelectric": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		isViable: true,
		name: "Hidden Power Electric",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Electric",
		contestType: "Clever",
	},
	"hiddenpowerfighting": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		isViable: true,
		name: "Hidden Power Fighting",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Clever",
	},
	"hiddenpowerfire": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		isViable: true,
		name: "Hidden Power Fire",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Clever",
	},
	"hiddenpowerflying": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Flying",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Flying",
		contestType: "Clever",
	},
	"hiddenpowerghost": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Ghost",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	"hiddenpowergrass": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		isViable: true,
		name: "Hidden Power Grass",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"hiddenpowerground": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Ground",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ground",
		contestType: "Clever",
	},
	"hiddenpowerice": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		isViable: true,
		name: "Hidden Power Ice",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ice",
		contestType: "Clever",
	},
	"hiddenpowerpoison": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Poison",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	"hiddenpowerpsychic": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Psychic",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"hiddenpowerrock": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Rock",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Rock",
		contestType: "Clever",
	},
	"hiddenpowersteel": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Steel",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Steel",
		contestType: "Clever",
	},
	"hiddenpowerwater": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Water",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Clever",
	},
	"highjumpkick": {
		num: 136,
		accuracy: 90,
		basePower: 130,
		category: "Physical",
		desc: "If this attack is not successful, the user loses half of its maximum HP, rounded down, as crash damage. Pokemon with the Ability Magic Guard are unaffected by crash damage.",
		shortDesc: "User is hurt by 50% of its max HP if it misses.",
		id: "highjumpkick",
		isViable: true,
		name: "High Jump Kick",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		hasCustomRecoil: true,
		onMoveFail: function (target, source, move) {
			this.damage(source.maxhp / 2, source, source, 'highjumpkick');
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"holdback": {
		num: 610,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Leaves the target with at least 1 HP.",
		shortDesc: "Always leaves the target with at least 1 HP.",
		id: "holdback",
		name: "Hold Back",
		pp: 40,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		noFaint: true,
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"holdhands": {
		num: 615,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Nothing happens... Fails if there is no ally adjacent to the user.",
		shortDesc: "No competitive use. Or any use.",
		id: "holdhands",
		name: "Hold Hands",
		pp: 40,
		priority: 0,
		flags: {authentic: 1},
		onTryHit: function (target, source) {
			return null;
		},
		secondary: false,
		target: "adjacentAlly",
		type: "Normal",
		contestType: "Cute",
	},
	"honeclaws": {
		num: 468,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and accuracy by 1 stage.",
		shortDesc: "Raises the user's Attack and accuracy by 1.",
		id: "honeclaws",
		isViable: true,
		name: "Hone Claws",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
			accuracy: 1,
		},
		secondary: false,
		target: "self",
		type: "Dark",
		contestType: "Cute",
	},
	"hornattack": {
		num: 30,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "hornattack",
		name: "Horn Attack",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"horndrill": {
		num: 32,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Ability Sturdy are immune.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "horndrill",
		name: "Horn Drill",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"hornleech": {
		num: 532,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "hornleech",
		isViable: true,
		name: "Horn Leech",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Tough",
	},
	"howl": {
		num: 336,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage.",
		shortDesc: "Raises the user's Attack by 1.",
		id: "howl",
		name: "Howl",
		pp: 40,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cool",
	},
	"hurricane": {
		num: 542,
		accuracy: 70,
		basePower: 110,
		category: "Special",
		desc: "Has a 30% chance to confuse the target. This move can hit a target using Bounce, Fly, or Sky Drop. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.",
		shortDesc: "30% chance to confuse target. Can't miss in rain.",
		id: "hurricane",
		isViable: true,
		name: "Hurricane",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1},
		onModifyMove: function (move) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				move.accuracy = true;
			} else if (this.isWeather(['sunnyday', 'desolateland'])) {
				move.accuracy = 50;
			}
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Flying",
		contestType: "Tough",
	},
	"hydrocannon": {
		num: 308,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "hydrocannon",
		name: "Hydro Cannon",
		pp: 5,
		priority: 0,
		flags: {recharge: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	"hydropump": {
		num: 56,
		accuracy: 80,
		basePower: 110,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "hydropump",
		isViable: true,
		name: "Hydro Pump",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	"hyperbeam": {
		num: 63,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "hyperbeam",
		name: "Hyper Beam",
		pp: 5,
		priority: 0,
		flags: {recharge: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"hyperfang": {
		num: 158,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		desc: "Has a 10% chance to flinch the target.",
		shortDesc: "10% chance to flinch the target.",
		id: "hyperfang",
		name: "Hyper Fang",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"hyperspacefury": {
		num: 621,
		accuracy: true,
		basePower: 100,
		category: "Physical",
		desc: "Lowers the user's Defense by 1 stage. This move cannot be used successfully unless the user's current form, while considering Transform, is Hoopa Unbound. If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
		shortDesc: "Hoopa-U: Lowers user's Def by 1; breaks protection.",
		id: "hyperspacefury",
		isViable: true,
		name: "Hyperspace Fury",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, authentic: 1},
		breaksProtect: true,
		onTry: function (pokemon) {
			if (pokemon.template.species === 'Hoopa-Unbound') {
				return;
			}
			this.add('-hint', "Only a Pokemon whose form is Hoopa Unbound can use this move.");
			if (pokemon.template.species === 'Hoopa') {
				this.add('-fail', pokemon, 'move: Hyperspace Fury', '[forme]');
				return null;
			}
			this.add('-fail', pokemon, 'move: Hyperspace Fury');
			return null;
		},
		self: {
			boosts: {
				def: -1,
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	"hyperspacehole": {
		num: 593,
		accuracy: true,
		basePower: 80,
		category: "Special",
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
		shortDesc: "Breaks the target's protection for this turn.",
		id: "hyperspacehole",
		name: "Hyperspace Hole",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, authentic: 1},
		breaksProtect: true,
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"hypervoice": {
		num: 304,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent foes.",
		id: "hypervoice",
		isViable: true,
		name: "Hyper Voice",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
	},
	"hypnosis": {
		num: 95,
		accuracy: 60,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to fall asleep.",
		shortDesc: "Puts the target to sleep.",
		id: "hypnosis",
		name: "Hypnosis",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"iceball": {
		num: 301,
		accuracy: 90,
		basePower: 30,
		basePowerCallback: function (pokemon, target, move) {
			let bp = move.basePower;
			if (pokemon.volatiles.iceball && pokemon.volatiles.iceball.hitCount) {
				bp *= Math.pow(2, pokemon.volatiles.iceball.hitCount);
			}
			pokemon.addVolatile('iceball');
			if (pokemon.volatiles.defensecurl) {
				bp *= 2;
			}
			this.debug("Ice Ball bp: " + bp);
			return bp;
		},
		category: "Physical",
		desc: "If this move is successful, the user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. Power doubles with each successful hit of this move and doubles again if Defense Curl was used previously by the user. If this move is called by Sleep Talk, the move is used for one turn.",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
		id: "iceball",
		name: "Ice Ball",
		pp: 20,
		priority: 0,
		flags: {bullet: 1, contact: 1, protect: 1, mirror: 1},
		effect: {
			duration: 2,
			onLockMove: 'iceball',
			onStart: function () {
				this.effectData.hitCount = 1;
			},
			onRestart: function () {
				this.effectData.hitCount++;
				if (this.effectData.hitCount < 5) {
					this.effectData.duration = 2;
				}
			},
			onResidual: function (target) {
				if (target.lastMove === 'struggle') {
					// don't lock
					delete target.volatiles['iceball'];
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"icebeam": {
		num: 58,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to freeze the target.",
		shortDesc: "10% chance to freeze the target.",
		id: "icebeam",
		isViable: true,
		name: "Ice Beam",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"iceburn": {
		num: 554,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Has a 30% chance to burn the target. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges turn 1. Hits turn 2. 30% burn.",
		id: "iceburn",
		name: "Ice Burn",
		pp: 5,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"icefang": {
		num: 423,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		desc: "Has a 10% chance to freeze the target and a 10% chance to flinch it.",
		shortDesc: "10% chance to freeze. 10% chance to flinch.",
		id: "icefang",
		isViable: true,
		name: "Ice Fang",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondaries: [
			{
				chance: 10,
				status: 'frz',
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
		target: "normal",
		type: "Ice",
		contestType: "Cool",
	},
	"icepunch": {
		num: 8,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 10% chance to freeze the target.",
		shortDesc: "10% chance to freeze the target.",
		id: "icepunch",
		isViable: true,
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
	"iceshard": {
		num: 420,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "iceshard",
		isViable: true,
		name: "Ice Shard",
		pp: 30,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"iciclecrash": {
		num: 556,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "iciclecrash",
		isViable: true,
		name: "Icicle Crash",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"iciclespear": {
		num: 333,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "iciclespear",
		isViable: true,
		name: "Icicle Spear",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"icywind": {
		num: 196,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
		id: "icywind",
		name: "Icy Wind",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	"imprison": {
		num: 286,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user prevents all of its foes from using any moves that the user also knows as long as the user remains active.",
		shortDesc: "No foe can use any move known by the user.",
		id: "imprison",
		name: "Imprison",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, authentic: 1},
		volatileStatus: 'imprison',
		effect: {
			noCopy: true,
			onStart: function (target) {
				this.add('-start', target, 'move: Imprison');
			},
			onFoeDisableMove: function (pokemon) {
				let foeMoves = this.effectData.source.moveset;
				for (let f = 0; f < foeMoves.length; f++) {
					if (foeMoves[f].id === 'struggle') continue;
					pokemon.disableMove(foeMoves[f].id, 'hidden');
				}
				pokemon.maybeDisabled = true;
			},
			onFoeBeforeMovePriority: 4,
			onFoeBeforeMove: function (attacker, defender, move) {
				if (move.id !== 'struggle' && this.effectData.source.hasMove(move.id)) {
					this.add('cant', attacker, 'move: Imprison', move);
					return false;
				}
			},
		},
		secondary: false,
		pressureTarget: "foeSide",
		target: "self",
		type: "Psychic",
		contestType: "Clever",
	},
	"incinerate": {
		num: 510,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "The target loses its held item if it is a Berry or a Gem. This move cannot cause Pokemon with the Ability Sticky Hold to lose their held item. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
		shortDesc: "Destroys the foe(s) Berry/Gem.",
		id: "incinerate",
		name: "Incinerate",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit: function (pokemon, source) {
			let item = pokemon.getItem();
			if ((item.isBerry || item.isGem) && pokemon.takeItem(source)) {
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Tough",
	},
	"inferno": {
		num: 517,
		accuracy: 50,
		basePower: 100,
		category: "Special",
		desc: "Has a 100% chance to burn the target.",
		shortDesc: "100% chance to burn the target.",
		id: "inferno",
		name: "Inferno",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"infestation": {
		num: 611,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "infestation",
		name: "Infestation",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	"ingrain": {
		num: 275,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user has 1/16 of its maximum HP restored at the end of each turn, but it is prevented from switching out and other Pokemon cannot force the user to switch out. The user can still switch out if it uses Baton Pass, Parting Shot, U-turn, or Volt Switch. If the user leaves the field using Baton Pass, the replacement will remain trapped and still receive the healing effect. During the effect, the user can be hit normally by Ground-type attacks and be affected by Spikes, Toxic Spikes, and Sticky Web, even if the user is a Flying type or has the Ability Levitate.",
		shortDesc: "User recovers 1/16 max HP per turn. Traps user.",
		id: "ingrain",
		name: "Ingrain",
		pp: 20,
		priority: 0,
		flags: {snatch: 1, nonsky: 1},
		volatileStatus: 'ingrain',
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'move: Ingrain');
			},
			onResidualOrder: 7,
			onResidual: function (pokemon) {
				this.heal(pokemon.maxhp / 16);
			},
			onTrapPokemon: function (pokemon) {
				pokemon.tryTrap();
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onDragOut: function (pokemon) {
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
		secondary: false,
		target: "self",
		type: "Grass",
		contestType: "Clever",
	},
	"iondeluge": {
		num: 569,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes Normal-type moves to become Electric type this turn.",
		shortDesc: "Normal moves become Electric type this turn.",
		id: "iondeluge",
		name: "Ion Deluge",
		pp: 25,
		priority: 1,
		flags: {},
		pseudoWeather: 'iondeluge',
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-fieldactivate', 'move: Ion Deluge');
			},
			onModifyMovePriority: -2,
			onModifyMove: function (move) {
				if (move.type === 'Normal') {
					move.type = 'Electric';
					this.debug(move.name + "'s type changed to Electric");
				}
			},
		},
		secondary: false,
		target: "all",
		type: "Electric",
		contestType: "Beautiful",
	},
	"irondefense": {
		num: 334,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		shortDesc: "Raises the user's Defense by 2.",
		id: "irondefense",
		name: "Iron Defense",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: 2,
		},
		secondary: false,
		target: "self",
		type: "Steel",
		contestType: "Tough",
	},
	"ironhead": {
		num: 442,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "ironhead",
		isViable: true,
		name: "Iron Head",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Steel",
		contestType: "Tough",
	},
	"irontail": {
		num: 231,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "Has a 30% chance to lower the target's Defense by 1 stage.",
		shortDesc: "30% chance to lower the target's Defense by 1.",
		id: "irontail",
		name: "Iron Tail",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	"judgment": {
		num: 449,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "This move's type depends on the user's held Plate.",
		shortDesc: "Type varies based on the held Plate.",
		id: "judgment",
		isViable: true,
		name: "Judgment",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move, pokemon) {
			move.type = this.runEvent('Plate', pokemon, null, 'judgment', 'Normal');
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"jumpkick": {
		num: 26,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "If this attack is not successful, the user loses half of its maximum HP, rounded down, as crash damage. Pokemon with the Ability Magic Guard are unaffected by crash damage.",
		shortDesc: "User is hurt by 50% of its max HP if it misses.",
		id: "jumpkick",
		isViable: true,
		name: "Jump Kick",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
		hasCustomRecoil: true,
		onMoveFail: function (target, source, move) {
			this.damage(source.maxhp / 2, source, source, 'jumpkick');
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"karatechop": {
		num: 2,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "karatechop",
		name: "Karate Chop",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"kinesis": {
		num: 134,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's accuracy by 1 stage.",
		shortDesc: "Lowers the target's accuracy by 1.",
		id: "kinesis",
		name: "Kinesis",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			accuracy: -1,
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"kingsshield": {
		num: 588,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user have their Attack lowered by 2 stages. Non-damaging moves go through this protection. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		shortDesc: "Protects from attacks. Contact: lowers Atk by 2.",
		id: "kingsshield",
		isViable: true,
		name: "King's Shield",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'kingsshield',
		onTryHit: function (pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact']) {
					this.boost({atk:-2}, source, target, this.getMove("King's Shield"));
				}
				return null;
			},
		},
		secondary: false,
		target: "self",
		type: "Steel",
		contestType: "Cool",
	},
	"knockoff": {
		num: 282,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "If the target is holding an item that can be removed from it, ignoring the Ability Sticky Hold, this move's power is multiplied by 1.5. If the user has not fainted, the target loses its held item. This move cannot cause Pokemon with the Ability Sticky Hold to lose their held item, cause Pokemon that can Mega Evolve to lose the Mega Stone for their species, or cause a Kyogre, a Groudon, a Giratina, an Arceus, or a Genesect to lose their Blue Orb, Red Orb, Griseous Orb, Plate, or Drive, respectively. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
		shortDesc: "1.5x damage if foe holds an item. Removes item.",
		id: "knockoff",
		isViable: true,
		name: "Knock Off",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon, target) {
			let item = target.getItem();
			let noKnockOff = item.onTakeItem && item.onTakeItem(item, target) === false;
			if (item.id && !noKnockOff) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit: function (target, source) {
			if (source.hp) {
				let item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"landswrath": {
		num: 616,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent foes.",
		id: "landswrath",
		name: "Land's Wrath",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Ground",
		contestType: "Beautiful",
	},
	"lastresort": {
		num: 387,
		accuracy: 100,
		basePower: 140,
		category: "Physical",
		desc: "This move fails unless the user knows this move and at least one other move, and has used all the other moves it knows at least once each since it became active or Transformed.",
		shortDesc: "Fails unless each known move has been used.",
		id: "lastresort",
		name: "Last Resort",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit: function (target, source) {
			if (source.moveset.length === 1) return false; // Last Resort fails unless the user knows at least 2 moves
			let hasLastResort = false; // User must actually have Last Resort for it to succeed
			for (let i in source.moveset) {
				if (source.moveset[i].id === 'lastresort') {
					hasLastResort = true;
					continue;
				}
				if (!source.moveset[i].used) return false;
			}
			return hasLastResort;
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"lavaplume": {
		num: 436,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 30% chance to burn the target.",
		shortDesc: "30% chance to burn adjacent Pokemon.",
		id: "lavaplume",
		isViable: true,
		name: "Lava Plume",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "allAdjacent",
		type: "Fire",
		contestType: "Tough",
	},
	"leafblade": {
		num: 348,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "leafblade",
		isViable: true,
		name: "Leaf Blade",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	"leafstorm": {
		num: 437,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "leafstorm",
		isViable: true,
		name: "Leaf Storm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	"leaftornado": {
		num: 536,
		accuracy: 90,
		basePower: 65,
		category: "Special",
		desc: "Has a 50% chance to lower the target's accuracy by 1 stage.",
		shortDesc: "50% chance to lower the target's accuracy by 1.",
		id: "leaftornado",
		name: "Leaf Tornado",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	"leechlife": {
		num: 141,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "leechlife",
		name: "Leech Life",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	"leechseed": {
		num: 73,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "The Pokemon at the user's position steals 1/8 of the target's maximum HP, rounded down, at the end of each turn. If Big Root is held by the recipient, the HP recovered is 1.3x normal, rounded half down. If the target uses Baton Pass, the replacement will continue being leeched. If the target switches out or uses Rapid Spin, the effect ends. Grass-type Pokemon are immune to this move on use, but not its effect.",
		shortDesc: "1/8 of target's HP is restored to user every turn.",
		id: "leechseed",
		isViable: true,
		name: "Leech Seed",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		volatileStatus: 'leechseed',
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onResidualOrder: 8,
			onResidual: function (pokemon) {
				let target = this.effectData.source.side.active[pokemon.volatiles['leechseed'].sourcePosition];
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				let damage = this.damage(pokemon.maxhp / 8, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			},
		},
		onTryHit: function (target) {
			if (target.hasType('Grass')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"leer": {
		num: 43,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Defense by 1 stage.",
		shortDesc: "Lowers the foe(s) Defense by 1.",
		id: "leer",
		name: "Leer",
		pp: 30,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			def: -1,
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
	},
	"lick": {
		num: 122,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		id: "lick",
		name: "Lick",
		pp: 30,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Ghost",
		contestType: "Cute",
	},
	"lightofruin": {
		num: 617,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 1/2 recoil.",
		id: "lightofruin",
		isViable: true,
		name: "Light of Ruin",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		isUnreleased: true,
		recoil: [1, 2],
		secondary: false,
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	},
	"lightscreen": {
		num: 113,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members take 0.5x damage from special attacks, or 0.66x damage if in a Double or Triple Battle. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break or Defog. Lasts for 8 turns if the user is holding Light Clay.",
		shortDesc: "For 5 turns, special damage to allies is halved.",
		id: "lightscreen",
		isViable: true,
		name: "Light Screen",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		sideCondition: 'lightscreen',
		effect: {
			duration: 5,
			durationCallback: function (target, source, effect) {
				if (source && source.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage: function (damage, source, target, move) {
				if (target !== source && target.side === this.effectData.target && this.getCategory(move) === 'Special') {
					if (!move.crit && !move.infiltrates) {
						this.debug('Light Screen weaken');
						if (target.side.active.length > 1) return this.chainModify([0xA8F, 0x1000]);
						return this.chainModify(0.5);
					}
				}
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Light Screen');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 1,
			onEnd: function (side) {
				this.add('-sideend', side, 'move: Light Screen');
			},
		},
		secondary: false,
		target: "allySide",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"lockon": {
		num: 199,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "On the following turn, the target cannot avoid the user's moves, even if the target is in the middle of a two-turn move. Fails if the user used this move successfully last turn and that target is still active.",
		shortDesc: "User's next move will not miss the target.",
		id: "lockon",
		name: "Lock-On",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit: function (target, source) {
			if (source.volatiles['lockon']) return false;
		},
		onHit: function (target, source) {
			source.addVolatile('lockon', target);
			this.add('-activate', source, 'move: Lock-On', '[of] ' + target);
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onSourceAccuracy: function (accuracy, target, source, move) {
				if (move && source === this.effectData.target && target === this.effectData.source) return true;
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"lovelykiss": {
		num: 142,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to fall asleep.",
		shortDesc: "Puts the target to sleep.",
		id: "lovelykiss",
		isViable: true,
		name: "Lovely Kiss",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"lowkick": {
		num: 67,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let targetWeight = target.getWeight();
			if (targetWeight >= 200) {
				return 120;
			}
			if (targetWeight >= 100) {
				return 100;
			}
			if (targetWeight >= 50) {
				return 80;
			}
			if (targetWeight >= 25) {
				return 60;
			}
			if (targetWeight >= 10) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Deals damage to the target based on its weight. Power is 20 if less than 10kg, 40 if less than 25kg, 60 if less than 50kg, 80 if less than 100kg, 100 if less than 200kg, and 120 if greater than or equal to 200kg.",
		shortDesc: "More power the heavier the target.",
		id: "lowkick",
		isViable: true,
		name: "Low Kick",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"lowsweep": {
		num: 490,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the target's Speed by 1.",
		id: "lowsweep",
		name: "Low Sweep",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Clever",
	},
	"luckychant": {
		num: 381,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members cannot be struck by a critical hit. Fails if this move is already in effect for the user's side.",
		shortDesc: "For 5 turns, shields user's party from critical hits.",
		id: "luckychant",
		name: "Lucky Chant",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		sideCondition: 'luckychant',
		effect: {
			duration: 5,
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Lucky Chant'); // "The Lucky Chant shielded [side.name]'s team from critical hits!"
			},
			onCriticalHit: false,
			onResidualOrder: 21,
			onResidualSubOrder: 5,
			onEnd: function (side) {
				this.add('-sideend', side, 'move: Lucky Chant'); // "[side.name]'s team's Lucky Chant wore off!"
			},
		},
		secondary: false,
		target: "allySide",
		type: "Normal",
		contestType: "Cute",
	},
	"lunardance": {
		num: 461,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user faints and the Pokemon brought out to replace it has its HP and PP fully restored along with having any major status condition cured. Fails if the user is the last unfainted Pokemon in its party.",
		shortDesc: "User faints. Replacement is fully healed, with PP.",
		id: "lunardance",
		isViable: true,
		name: "Lunar Dance",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onTryHit: function (pokemon, target, move) {
			if (!this.canSwitch(pokemon.side)) {
				delete move.selfdestruct;
				return false;
			}
		},
		selfdestruct: true,
		sideCondition: 'lunardance',
		effect: {
			duration: 2,
			onStart: function (side, source) {
				this.debug('Lunar Dance started on ' + side.name);
				this.effectData.positions = [];
				for (let i = 0; i < side.active.length; i++) {
					this.effectData.positions[i] = false;
				}
				this.effectData.positions[source.position] = true;
			},
			onRestart: function (side, source) {
				this.effectData.positions[source.position] = true;
			},
			onSwitchInPriority: 1,
			onSwitchIn: function (target) {
				if (target.position !== this.effectData.sourcePosition) {
					return;
				}
				if (!target.fainted) {
					target.heal(target.maxhp);
					target.setStatus('');
					for (let m in target.moveset) {
						target.moveset[m].pp = target.moveset[m].maxpp;
					}
					this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
					this.effectData.positions[target.position] = false;
				}
				if (!this.effectData.positions.some(affected => affected === true)) {
					target.side.removeSideCondition('lunardance');
				}
			},
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"lusterpurge": {
		num: 295,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Has a 50% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "50% chance to lower the target's Sp. Def by 1.",
		id: "lusterpurge",
		name: "Luster Purge",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"machpunch": {
		num: 183,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "machpunch",
		isViable: true,
		name: "Mach Punch",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"magiccoat": {
		num: 277,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the end of the turn, the user is unaffected by certain non-damaging moves directed at it and will instead use such moves against the original user. Moves reflected in this way are unable to be reflected again by this or the Ability Magic Bounce's effect. Spikes, Stealth Rock, Sticky Web, and Toxic Spikes can only be reflected once per side, by the leftmost Pokemon under this or the Ability Magic Bounce's effect. If the user has the Ability Soundproof, this move's effect happens before a sound-based move can be nullified. The Abilities Lightning Rod and Storm Drain redirect their respective moves before this move takes effect.",
		shortDesc: "Bounces back certain non-damaging moves.",
		id: "magiccoat",
		isViable: true,
		name: "Magic Coat",
		pp: 15,
		priority: 4,
		flags: {},
		volatileStatus: 'magiccoat',
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'move: Magic Coat');
			},
			onTryHitPriority: 2,
			onTryHit: function (target, source, move) {
				if (target === source || move.hasBounced || !move.flags['reflectable']) {
					return;
				}
				let newMove = this.getMoveCopy(move.id);
				newMove.hasBounced = true;
				this.useMove(newMove, target, source);
				return null;
			},
			onAllyTryHitSide: function (target, source, move) {
				if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
					return;
				}
				let newMove = this.getMoveCopy(move.id);
				newMove.hasBounced = true;
				this.useMove(newMove, this.effectData.target, source);
				return null;
			},
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"magicroom": {
		num: 478,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the held items of all active Pokemon have no effect. An item's effect of causing forme changes is unaffected, but any other effects from such items are negated. During the effect, Fling and Natural Gift are prevented from being used by all active Pokemon. If this move is used during the effect, the effect ends.",
		shortDesc: "For 5 turns, all held items have no effect.",
		id: "magicroom",
		name: "Magic Room",
		pp: 10,
		priority: 0,
		flags: {mirror: 1},
		onHitField: function (target, source, effect) {
			if (this.pseudoWeather['magicroom']) {
				this.removePseudoWeather('magicroom', source, effect, '[of] ' + source);
			} else {
				this.addPseudoWeather('magicroom', source, effect, '[of] ' + source);
			}
		},
		effect: {
			duration: 5,
			/*durationCallback: function (source, effect) {
				// Persistent isn't updated for BW moves
				if (source && source.hasAbility('Persistent')) {
					return 7;
				}
				return 5;
			},*/
			onStart: function (target, source) {
				this.add('-fieldstart', 'move: Magic Room', '[of] ' + source);
			},
			// Item suppression implemented in BattlePokemon.ignoringItem() within battle-engine.js
			onResidualOrder: 25,
			onEnd: function () {
				this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectData.source);
			},
		},
		secondary: false,
		target: "all",
		type: "Psychic",
		contestType: "Clever",
	},
	"magicalleaf": {
		num: 345,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "magicalleaf",
		name: "Magical Leaf",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	"magmastorm": {
		num: 463,
		accuracy: 75,
		basePower: 100,
		category: "Special",
		desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "magmastorm",
		name: "Magma Storm",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	"magnetbomb": {
		num: 443,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "magnetbomb",
		name: "Magnet Bomb",
		pp: 20,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	"magneticflux": {
		num: 602,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the Defense and Special Defense of Pokemon on the user's side with the Abilities Plus or Minus by 1 stage.",
		shortDesc: "Raises Def, Sp. Def of allies with Plus/Minus by 1.",
		id: "magneticflux",
		name: "Magnetic Flux",
		pp: 20,
		priority: 0,
		flags: {snatch: 1, distance: 1, authentic: 1},
		onHitSide: function (side, source) {
			let targets = [];
			for (let p in side.active) {
				if (side.active[p].hasAbility(['plus', 'minus'])) {
					targets.push(side.active[p]);
				}
			}
			if (!targets.length) return false;
			for (let i = 0; i < targets.length; i++) this.boost({def: 1, spd: 1}, targets[i], source, 'move: Magnetic Flux');
		},
		secondary: false,
		target: "allySide",
		type: "Electric",
		contestType: "Clever",
	},
	"magnetrise": {
		num: 393,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Ability Arena Trap as long as it remains active. If the user uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this move if the user is under any of their effects. Fails if the user is already under this effect or the effects of Ingrain, Smack Down, or Thousand Arrows.",
		shortDesc: "For 5 turns, the user is immune to Ground moves.",
		id: "magnetrise",
		name: "Magnet Rise",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, gravity: 1},
		volatileStatus: 'magnetrise',
		effect: {
			duration: 5,
			onStart: function (target) {
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-start', target, 'Magnet Rise');
			},
			onImmunity: function (type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 15,
			onEnd: function (target) {
				this.add('-end', target, 'Magnet Rise');
			},
		},
		secondary: false,
		target: "self",
		type: "Electric",
		contestType: "Clever",
	},
	"magnitude": {
		num: 222,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		desc: "The power of this move varies; 5% chances for 10 and 150 power, 10% chances for 30 and 110 power, 20% chances for 50 and 90 power, and 30% chance for 70 power. Damage doubles if the target is using Dig.",
		shortDesc: "Hits adjacent Pokemon. Power varies; 2x on Dig.",
		id: "magnitude",
		name: "Magnitude",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		onModifyMove: function (move, pokemon) {
			let i = this.random(100);
			if (i < 5) {
				move.magnitude = 4;
				move.basePower = 10;
			} else if (i < 15) {
				move.magnitude = 5;
				move.basePower = 30;
			} else if (i < 35) {
				move.magnitude = 6;
				move.basePower = 50;
			} else if (i < 65) {
				move.magnitude = 7;
				move.basePower = 70;
			} else if (i < 85) {
				move.magnitude = 8;
				move.basePower = 90;
			} else if (i < 95) {
				move.magnitude = 9;
				move.basePower = 110;
			} else {
				move.magnitude = 10;
				move.basePower = 150;
			}
		},
		onUseMoveMessage: function (pokemon, target, move) {
			this.add('-activate', pokemon, 'move: Magnitude', move.magnitude);
		},
		secondary: false,
		target: "allAdjacent",
		type: "Ground",
		contestType: "Tough",
	},
	"matblock": {
		num: 561,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn. Fails unless it is the user's first turn on the field, if the user moves last this turn, or if this move is already in effect for the user's side.",
		shortDesc: "Protects allies from attacks. First turn out only.",
		id: "matblock",
		name: "Mat Block",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, nonsky: 1},
		stallingMove: true,
		sideCondition: 'matblock',
		onTryHitSide: function (side, source) {
			if (source.activeTurns > 1) {
				this.add('-hint', "Mat Block only works on your first turn out.");
				return false;
			}
		},
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Mat Block');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect']) return;
				if (move && (move.target === 'self' || move.category === 'Status')) return;
				this.add('-activate', target, 'Mat Block', move.name);
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
		secondary: false,
		target: "allySide",
		type: "Fighting",
		contestType: "Cool",
	},
	"mefirst": {
		num: 382,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user uses the move the target chose for use this turn against it, if possible, with its power multiplied by 1.5. The move must be a damaging move other than Chatter, Counter, Covet, Focus Punch, Me First, Metal Burst, Mirror Coat, Thief, or Struggle. Fails if the target moves before the user. Ignores the target's substitute for the purpose of copying the move.",
		shortDesc: "Copies a foe at 1.5x power. User must be faster.",
		id: "mefirst",
		name: "Me First",
		pp: 20,
		priority: 0,
		flags: {protect: 1, authentic: 1},
		onTryHit: function (target, pokemon) {
			let decision = this.willMove(target);
			if (decision) {
				let noMeFirst = {
					chatter:1, counter:1, covet:1, focuspunch:1, mefirst:1, metalburst:1, mirrorcoat:1, struggle:1, thief:1,
				};
				let move = this.getMoveCopy(decision.move.id);
				if (move.category !== 'Status' && !noMeFirst[move]) {
					pokemon.addVolatile('mefirst');
					this.useMove(move, pokemon, target);
					return null;
				}
			}
			return false;
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 4,
			onBasePower: function (basePower) {
				return this.chainModify(1.5);
			},
		},
		secondary: false,
		target: "adjacentFoe",
		type: "Normal",
		contestType: "Clever",
	},
	"meanlook": {
		num: 212,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.",
		shortDesc: "The target cannot switch out.",
		id: "meanlook",
		name: "Mean Look",
		pp: 5,
		priority: 0,
		flags: {reflectable: 1, mirror: 1},
		onHit: function (target, source, move) {
			if (!target.addVolatile('trapped', source, move, 'trapper')) {
				this.add('-fail', target);
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"meditate": {
		num: 96,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage.",
		shortDesc: "Raises the user's Attack by 1.",
		id: "meditate",
		name: "Meditate",
		pp: 40,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"megadrain": {
		num: 72,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "megadrain",
		name: "Mega Drain",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"megakick": {
		num: 25,
		accuracy: 75,
		basePower: 120,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "megakick",
		name: "Mega Kick",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"megapunch": {
		num: 5,
		accuracy: 85,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "megapunch",
		name: "Mega Punch",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"megahorn": {
		num: 224,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "megahorn",
		isViable: true,
		name: "Megahorn",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	"memento": {
		num: 262,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack and Special Attack by 2 stages. The user faints unless this move misses or there is no target. Fails entirely if this move hits a substitute, but does not fail if the target's stats cannot be changed.",
		shortDesc: "Lowers target's Attack, Sp. Atk by 2. User faints.",
		id: "memento",
		isViable: true,
		name: "Memento",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		boosts: {
			atk: -2,
			spa: -2,
		},
		selfdestruct: true,
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	"metalburst": {
		num: 368,
		accuracy: 100,
		basePower: 0,
		damageCallback: function (pokemon) {
			if (!pokemon.volatiles['metalburst']) return 0;
			return pokemon.volatiles['metalburst'].damage || 1;
		},
		category: "Physical",
		desc: "Deals damage to the last foe to hit the user with an attack this turn equal to 1.5 times the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals damage with a Base Power of 1 instead. If that foe's position is no longer in use, the damage is done to a random foe in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by a foe's attack this turn.",
		shortDesc: "If hit by an attack, returns 1.5x damage.",
		id: "metalburst",
		name: "Metal Burst",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		beforeTurnCallback: function (pokemon) {
			pokemon.addVolatile('metalburst');
		},
		onTryHit: function (target, source, move) {
			if (!source.volatiles['metalburst']) return false;
			if (source.volatiles['metalburst'].position === null) return false;
		},
		effect: {
			duration: 1,
			noCopy: true,
			onStart: function (target, source, source2, move) {
				this.effectData.position = null;
				this.effectData.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget: function (target, source, source2) {
				if (source !== this.effectData.target) return;
				return source.side.foe.active[this.effectData.position];
			},
			onDamagePriority: -101,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && source.side !== target.side) {
					this.effectData.position = source.position;
					this.effectData.damage = 1.5 * damage;
				}
			},
		},
		secondary: false,
		target: "scripted",
		type: "Steel",
		contestType: "Cool",
	},
	"metalclaw": {
		num: 232,
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		desc: "Has a 10% chance to raise the user's Attack by 1 stage.",
		shortDesc: "10% chance to raise the user's Attack by 1.",
		id: "metalclaw",
		name: "Metal Claw",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	"metalsound": {
		num: 319,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Defense by 2 stages.",
		shortDesc: "Lowers the target's Sp. Def by 2.",
		id: "metalsound",
		name: "Metal Sound",
		pp: 40,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		boosts: {
			spd: -2,
		},
		secondary: false,
		target: "normal",
		type: "Steel",
		contestType: "Clever",
	},
	"meteormash": {
		num: 309,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "Has a 20% chance to raise the user's Attack by 1 stage.",
		shortDesc: "20% chance to raise the user's Attack by 1.",
		id: "meteormash",
		isViable: true,
		name: "Meteor Mash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 20,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	"metronome": {
		num: 118,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "A random move is selected for use, other than After You, Assist, Belch, Bestow, Celebrate, Chatter, Copycat, Counter, Covet, Crafty Shield, Destiny Bond, Detect, Diamond Storm, Endure, Feint, Focus Punch, Follow Me, Freeze Shock, Happy Hour, Helping Hand, Hold Hands, Hyperspace Hole, Ice Burn, King's Shield, Light of Ruin, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Quash, Quick Guard, Rage Powder, Relic Song, Secret Sword, Sketch, Sleep Talk, Snarl, Snatch, Snore, Spiky Shield, Steam Eruption, Struggle, Switcheroo, Techno Blast, Thief, Thousand Arrows, Thousand Waves, Transform, Trick, V-create, or Wide Guard.",
		shortDesc: "Picks a random move.",
		id: "metronome",
		name: "Metronome",
		pp: 10,
		priority: 0,
		flags: {},
		onHit: function (target) {
			let moves = [];
			for (let i in exports.BattleMovedex) {
				let move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				let noMetronome = {
					afteryou:1, assist:1, belch:1, bestow:1, celebrate:1, chatter:1, copycat:1, counter:1, covet:1, craftyshield:1, destinybond:1, detect:1, diamondstorm:1, dragonascent:1, endure:1, feint:1, focuspunch:1, followme:1, freezeshock:1, happyhour:1, helpinghand:1, holdhands:1, hyperspacefury:1, hyperspacehole:1, iceburn:1, kingsshield:1, lightofruin:1, matblock:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, originpulse:1, precipiceblades:1, protect:1, quash:1, quickguard:1, ragepowder:1, relicsong:1, secretsword:1, sketch:1, sleeptalk:1, snarl:1, snatch:1, snore:1, spikyshield:1, steameruption:1, struggle:1, switcheroo:1, technoblast:1, thief:1, thousandarrows:1, thousandwaves:1, transform:1, trick:1, vcreate:1, wideguard:1,
				};
				if (!noMetronome[move.id]) {
					moves.push(move);
				}
			}
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = moves[this.random(moves.length)].id;
			}
			if (!randomMove) {
				return false;
			}
			this.useMove(randomMove, target);
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"milkdrink": {
		num: 208,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "milkdrink",
		isViable: true,
		name: "Milk Drink",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"mimic": {
		num: 102,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move is replaced by the last move used by the target. The copied move has the maximum PP for that move. Fails if the target has not made a move, if the user has Transformed, or if the move is Chatter, Mimic, Sketch, Struggle, or Transform.",
		shortDesc: "The last move the target used replaces this one.",
		id: "mimic",
		name: "Mimic",
		pp: 10,
		priority: 0,
		flags: {protect: 1, authentic: 1},
		onHit: function (target, source) {
			let disallowedMoves = {chatter:1, mimic:1, sketch:1, struggle:1, transform:1};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) >= 0) return false;
			let moveslot = source.moves.indexOf('mimic');
			if (moveslot < 0) return false;
			let move = Tools.getMove(target.lastMove);
			source.moveset[moveslot] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			source.moves[moveslot] = toId(move.name);
			this.add('-start', source, 'Mimic', move.name);
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"mindreader": {
		num: 170,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "On the following turn, the target cannot avoid the user's moves, even if the target is in the middle of a two-turn move. Fails if the user used this move successfully last turn and that target is still active.",
		shortDesc: "User's next move will not miss the target.",
		id: "mindreader",
		name: "Mind Reader",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit: function (target, source) {
			if (source.volatiles['lockon']) return false;
		},
		onHit: function (target, source) {
			source.addVolatile('lockon', target);
			this.add('-activate', source, 'move: Mind Reader', '[of] ' + target);
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"minimize": {
		num: 107,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's evasiveness by 2 stages. Whether or not the user's evasiveness was changed, Body Slam, Dragon Rush, Flying Press, Heat Crash, Phantom Force, Shadow Force, Steamroller, and Stomp will not check accuracy and have their damage doubled if used against the user while it is active.",
		shortDesc: "Raises the user's evasiveness by 2.",
		id: "minimize",
		name: "Minimize",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		volatileStatus: 'minimize',
		effect: {
			noCopy: true,
			onSourceModifyDamage: function (damage, source, target, move) {
				if (move.id in {'stomp':1, 'steamroller':1, 'bodyslam':1, 'flyingpress':1, 'dragonrush':1, 'phantomforce':1, 'heatcrash':1, 'shadowforce':1}) {
					return this.chainModify(2);
				}
			},
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id in {'stomp':1, 'steamroller':1, 'bodyslam':1, 'flyingpress':1, 'dragonrush':1, 'phantomforce':1, 'heatcrash':1, 'shadowforce':1}) {
					return true;
				}
				return accuracy;
			},
		},
		boosts: {
			evasion: 2,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"miracleeye": {
		num: 357,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to have its positive evasiveness stat stage ignored while it is active. Psychic-type attacks can hit the target if it is a Dark type. The effect ends when the target is no longer active. Fails if the target is already affected, or affected by Foresight or Odor Sleuth.",
		shortDesc: "Psychic hits Dark. Evasiveness ignored.",
		id: "miracleeye",
		name: "Miracle Eye",
		pp: 40,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'miracleeye',
		onTryHit: function (target) {
			if (target.volatiles['foresight']) return false;
		},
		effect: {
			noCopy: true,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Miracle Eye');
			},
			onNegateImmunity: function (pokemon, type) {
				if (pokemon.hasType('Dark') && type === 'Psychic') return false;
			},
			onModifyBoost: function (boosts) {
				if (boosts.evasion && boosts.evasion > 0) {
					boosts.evasion = 0;
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"mirrorcoat": {
		num: 243,
		accuracy: 100,
		basePower: 0,
		damageCallback: function (pokemon) {
			if (!pokemon.volatiles['mirrorcoat']) return 0;
			return pokemon.volatiles['mirrorcoat'].damage || 1;
		},
		category: "Special",
		desc: "Deals damage to the last foe to hit the user with a special attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals damage with a Base Power of 1 instead. If that foe's position is no longer in use, the damage is done to a random foe in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by a foe's special attack this turn.",
		shortDesc: "If hit by special attack, returns double damage.",
		id: "mirrorcoat",
		name: "Mirror Coat",
		pp: 20,
		priority: -5,
		flags: {protect: 1},
		beforeTurnCallback: function (pokemon) {
			pokemon.addVolatile('mirrorcoat');
		},
		onTryHit: function (target, source, move) {
			if (!source.volatiles['mirrorcoat']) return false;
			if (source.volatiles['mirrorcoat'].position === null) return false;
		},
		effect: {
			duration: 1,
			noCopy: true,
			onStart: function (target, source, source2, move) {
				this.effectData.position = null;
				this.effectData.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget: function (target, source, source2) {
				if (source !== this.effectData.target) return;
				return source.side.foe.active[this.effectData.position];
			},
			onDamagePriority: -101,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && source.side !== target.side && this.getCategory(effect.id) === 'Special') {
					this.effectData.position = source.position;
					this.effectData.damage = 2 * damage;
				}
			},
		},
		secondary: false,
		target: "scripted",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"mirrormove": {
		num: 119,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user uses the last move used by the target. The copied move is used against that target, if possible. Fails if the target has not made a move, or the last move used was Acupressure, After You, Aromatherapy, Aromatic Mist, Belch, Conversion 2, Counter, Crafty Shield, Curse, Doom Desire, Electric Terrain, Final Gambit, Flower Shield, Focus Punch, Future Sight, Grassy Terrain, Gravity, Guard Split, Hail, Happy Hour, Haze, Heal Bell, Heal Pulse, Helping Hand, Hold Hands, Ion Deluge, Light Screen, Lucky Chant, Magnetic Flux, Mat Block, Me First, Mimic, Mirror Coat, Mirror Move, Mist, Misty Terrain, Mud Sport, Nature Power, Perish Song, Power Split, Psych Up, Quick Guard, Rain Dance, Reflect, Reflect Type, Role Play, Rototiller, Safeguard, Sandstorm, Sketch, Spikes, Spit Up, Stealth Rock, Sticky Web, Struggle, Sunny Day, Tailwind, Toxic Spikes, Transform, Water Sport, Wide Guard, or any move that is self-targeting.",
		shortDesc: "User uses the target's last used move against it.",
		id: "mirrormove",
		name: "Mirror Move",
		pp: 20,
		priority: 0,
		flags: {},
		onTryHit: function (target, pokemon) {
			if (!target.lastMove || !this.getMove(target.lastMove).flags['mirror']) {
				return false;
			}
			this.useMove(target.lastMove, pokemon, target);
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Flying",
		contestType: "Clever",
	},
	"mirrorshot": {
		num: 429,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Has a 30% chance to lower the target's accuracy by 1 stage.",
		shortDesc: "30% chance to lower the target's accuracy by 1.",
		id: "mirrorshot",
		name: "Mirror Shot",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Beautiful",
	},
	"mist": {
		num: 54,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members are protected from having their stats lowered by other Pokemon.",
		shortDesc: "For 5 turns, protects user's party from stat drops.",
		id: "mist",
		name: "Mist",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		sideCondition: 'mist',
		effect: {
			duration: 5,
			onBoost: function (boost, target, source, effect) {
				if (source && target !== source && (!effect.infiltrates || target.side === source.side)) {
					let showMsg = false;
					for (let i in boost) {
						if (boost[i] < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !effect.secondaries) this.add('-activate', target, 'Mist');
				}
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Mist');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 3,
			onEnd: function (side) {
				this.add('-sideend', side, 'Mist');
			},
		},
		secondary: false,
		target: "allySide",
		type: "Ice",
		contestType: "Beautiful",
	},
	"mistball": {
		num: 296,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Has a 50% chance to lower the target's Special Attack by 1 stage.",
		shortDesc: "50% chance to lower the target's Sp. Atk by 1.",
		id: "mistball",
		name: "Mist Ball",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"mistyterrain": {
		num: 581,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the terrain becomes Misty Terrain. During the effect, the power of Dragon-type attacks used against grounded Pokemon is multiplied by 0.5 and grounded Pokemon cannot be inflicted with a major status condition. Camouflage transforms the user into a Fairy type, Nature Power becomes Moonblast, and Secret Power has a 30% chance to lower Special Attack by 1 stage. Fails if the current terrain is Misty Terrain.",
		shortDesc: "5 turns. Can't status,-Dragon power vs grounded.",
		id: "mistyterrain",
		name: "Misty Terrain",
		pp: 10,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'mistyterrain',
		effect: {
			duration: 5,
			onSetStatus: function (status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				this.debug('misty terrain preventing status');
				return false;
			},
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onStart: function (battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Misty Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function (side) {
				this.add('-fieldend', 'Misty Terrain');
			},
		},
		secondary: false,
		target: "all",
		type: "Fairy",
		contestType: "Beautiful",
	},
	"moonblast": {
		num: 585,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 30% chance to lower the target's Special Attack by 1 stage.",
		shortDesc: "30% chance to lower the target's Sp. Atk by 1.",
		id: "moonblast",
		isViable: true,
		name: "Moonblast",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	},
	"moonlight": {
		num: 236,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP if no weather conditions are in effect, 2/3 of its maximum HP if the weather is Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Rain Dance, or Sandstorm, all rounded half down.",
		shortDesc: "Heals the user by a weather-dependent amount.",
		id: "moonlight",
		isViable: true,
		name: "Moonlight",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onHit: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(this.modify(pokemon.maxhp, 0.667));
			} else if (this.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(this.modify(pokemon.maxhp, 0.25));
			} else {
				this.heal(this.modify(pokemon.maxhp, 0.5));
			}
		},
		secondary: false,
		target: "self",
		type: "Fairy",
		contestType: "Beautiful",
	},
	"morningsun": {
		num: 234,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP if no weather conditions are in effect, 2/3 of its maximum HP if the weather is Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Rain Dance, or Sandstorm, all rounded half down.",
		shortDesc: "Heals the user by a weather-dependent amount.",
		id: "morningsun",
		isViable: true,
		name: "Morning Sun",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onHit: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(this.modify(pokemon.maxhp, 0.667));
			} else if (this.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(this.modify(pokemon.maxhp, 0.25));
			} else {
				this.heal(this.modify(pokemon.maxhp, 0.5));
			}
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Beautiful",
	},
	"mudslap": {
		num: 189,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Has a 100% chance to lower the target's accuracy by 1 stage.",
		shortDesc: "100% chance to lower the target's accuracy by 1.",
		id: "mudslap",
		name: "Mud-Slap",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Cute",
	},
	"mudbomb": {
		num: 426,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Has a 30% chance to lower the target's accuracy by 1 stage.",
		shortDesc: "30% chance to lower the target's accuracy by 1.",
		id: "mudbomb",
		name: "Mud Bomb",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Cute",
	},
	"mudshot": {
		num: 341,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the target's Speed by 1.",
		id: "mudshot",
		name: "Mud Shot",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	"mudsport": {
		num: 300,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, all Electric-type attacks used by any active Pokemon have their power reduced to 0.33x. Fails if this move is already in effect.",
		shortDesc: "For 5 turns, Electric-type attacks have 1/3 power.",
		id: "mudsport",
		name: "Mud Sport",
		pp: 15,
		priority: 0,
		flags: {nonsky: 1},
		onHitField: function (target, source, effect) {
			if (this.pseudoWeather['mudsport']) {
				return false;
			} else {
				this.addPseudoWeather('mudsport', source, effect, '[of] ' + source);
			}
		},
		effect: {
			duration: 5,
			onStart: function (side, source) {
				this.add('-fieldstart', 'move: Mud Sport', '[of] ' + source);
			},
			onBasePowerPriority: 1,
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('mud sport weaken');
					return this.chainModify([0x548, 0x1000]);
				}
			},
			onResidualOrder: 21,
			onEnd: function () {
				this.add('-fieldend', 'move: Mud Sport');
			},
		},
		secondary: false,
		target: "all",
		type: "Ground",
		contestType: "Cute",
	},
	"muddywater": {
		num: 330,
		accuracy: 85,
		basePower: 90,
		category: "Special",
		desc: "Has a 30% chance to lower the target's accuracy by 1 stage.",
		shortDesc: "30% chance to lower the foe(s) accuracy by 1.",
		id: "muddywater",
		name: "Muddy Water",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Tough",
	},
	"mysticalfire": {
		num: 595,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Special Attack by 1 stage.",
		shortDesc: "100% chance to lower the target's Sp. Atk by 1.",
		id: "mysticalfire",
		name: "Mystical Fire",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"nastyplot": {
		num: 417,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack by 2 stages.",
		shortDesc: "Raises the user's Sp. Atk by 2.",
		id: "nastyplot",
		isViable: true,
		name: "Nasty Plot",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spa: 2,
		},
		secondary: false,
		target: "self",
		type: "Dark",
		contestType: "Clever",
	},
	"naturalgift": {
		num: 363,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon) {
			if (pokemon.volatiles['naturalgift']) return pokemon.volatiles['naturalgift'].basePower;
			return false;
		},
		category: "Physical",
		desc: "The type and power of this move depend on the user's held Berry, and the Berry is lost. Fails if the user is not holding a Berry, if the user has the Ability Klutz, or if Embargo or Magic Room is in effect for the user.",
		shortDesc: "Power and type depends on the user's Berry.",
		id: "naturalgift",
		name: "Natural Gift",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		beforeMoveCallback: function (pokemon) {
			if (pokemon.ignoringItem()) return;
			let item = pokemon.getItem();
			if (item.id && item.naturalGift) {
				pokemon.addVolatile('naturalgift');
				pokemon.volatiles['naturalgift'].basePower = item.naturalGift.basePower;
				pokemon.volatiles['naturalgift'].type = item.naturalGift.type;
				pokemon.setItem('');
				this.runEvent('AfterUseItem', pokemon, null, null, item);
			}
		},
		onPrepareHit: function (target, source) {
			if (!source.volatiles['naturalgift']) return false;
		},
		onModifyMove: function (move, pokemon) {
			if (pokemon.volatiles['naturalgift']) move.type = pokemon.volatiles['naturalgift'].type;
		},
		onHit: function (target, source) {
			return !!source.volatiles['naturalgift'];
		},
		effect: {
			duration: 1,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"naturepower": {
		num: 267,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move calls another move for use based on the battle terrain. Tri Attack on the regular Wi-Fi terrain, Thunderbolt during Electric Terrain, Moonblast during Misty Terrain, and Energy Ball during Grassy Terrain.",
		shortDesc: "Attack depends on terrain (default Tri Attack).",
		id: "naturepower",
		name: "Nature Power",
		pp: 20,
		priority: 0,
		flags: {},
		onTryHit: function (target, pokemon) {
			let move = 'triattack';
			if (this.isTerrain('electricterrain')) {
				move = 'thunderbolt';
			} else if (this.isTerrain('grassyterrain')) {
				move = 'energyball';
			} else if (this.isTerrain('mistyterrain')) {
				move = 'moonblast';
			}
			this.useMove(move, pokemon, target);
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"needlearm": {
		num: 302,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "needlearm",
		name: "Needle Arm",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"nightdaze": {
		num: 539,
		accuracy: 95,
		basePower: 85,
		category: "Special",
		desc: "Has a 40% chance to lower the target's accuracy by 1 stage.",
		shortDesc: "40% chance to lower the target's accuracy by 1.",
		id: "nightdaze",
		name: "Night Daze",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 40,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	"nightshade": {
		num: 101,
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		category: "Special",
		desc: "Deals damage to the target equal to the user's level.",
		shortDesc: "Does damage equal to the user's level.",
		id: "nightshade",
		isViable: true,
		name: "Night Shade",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	"nightslash": {
		num: 400,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "nightslash",
		isViable: true,
		name: "Night Slash",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	"nightmare": {
		num: 171,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to lose 1/4 of its maximum HP, rounded down, at the end of each turn as long as it is asleep. This move does not affect the target unless it is asleep. The effect ends when the target wakes up, even if it falls asleep again in the same turn.",
		shortDesc: "A sleeping target is hurt by 1/4 max HP per turn.",
		id: "nightmare",
		name: "Nightmare",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'nightmare',
		effect: {
			noCopy: true,
			onStart: function (pokemon) {
				if (pokemon.status !== 'slp') {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidualOrder: 9,
			onResidual: function (pokemon) {
				this.damage(pokemon.maxhp / 4);
			},
			onUpdate: function (pokemon) {
				if (pokemon.status !== 'slp') {
					pokemon.removeVolatile('nightmare');
					this.add('-end', pokemon, 'Nightmare', '[silent]');
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	"nobleroar": {
		num: 568,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack and Special Attack by 1 stage.",
		shortDesc: "Lowers the target's Attack and Sp. Atk by 1.",
		id: "nobleroar",
		name: "Noble Roar",
		pp: 30,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		boosts: {
			atk: -1,
			spa: -1,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"nuzzle": {
		num: 609,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Has a 100% chance to paralyze the target.",
		shortDesc: "100% chance to paralyze the target.",
		id: "nuzzle",
		isViable: true,
		name: "Nuzzle",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cute",
	},
	"oblivionwing": {
		num: 613,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "The user recovers 3/4 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 75% of the damage dealt.",
		id: "oblivionwing",
		isViable: true,
		name: "Oblivion Wing",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1, heal: 1},
		drain: [3, 4],
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"octazooka": {
		num: 190,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Has a 50% chance to lower the target's accuracy by 1 stage.",
		shortDesc: "50% chance to lower the target's accuracy by 1.",
		id: "octazooka",
		name: "Octazooka",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	"odorsleuth": {
		num: 316,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to have its positive evasiveness stat stage ignored while it is active. Normal- and Fighting-type attacks can hit the target if it is a Ghost type. The effect ends when the target is no longer active. Fails if the target is already affected, or affected by Foresight or Miracle Eye.",
		shortDesc: "Fighting, Normal hit Ghost. Evasiveness ignored.",
		id: "odorsleuth",
		name: "Odor Sleuth",
		pp: 40,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'foresight',
		onTryHit: function (target) {
			if (target.volatiles['miracleeye']) return false;
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"ominouswind": {
		num: 466,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 10% chance to raise the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "10% chance to raise all stats by 1 (not acc/eva).",
		id: "ominouswind",
		name: "Ominous Wind",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
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
		type: "Ghost",
		contestType: "Beautiful",
	},
	"originpulse": {
		num: 618,
		accuracy: 85,
		basePower: 110,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent foes.",
		id: "originpulse",
		isViable: true,
		name: "Origin Pulse",
		pp: 10,
		priority: 0,
		flags: {protect: 1, pulse: 1, mirror: 1},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Beautiful",
	},
	"outrage": {
		num: 200,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent foe at random. The user spends two or three turns locked into this move and becomes confused after the last turn of the effect if it is not already. If the user is prevented from moving or the attack is not successful against the target on the first turn of the effect or the second turn of a three-turn effect, the effect ends without causing confusion. If this move is called by Sleep Talk, the move is used for one turn and does not confuse the user.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "outrage",
		isViable: true,
		name: "Outrage",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove: function (pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		secondary: false,
		target: "randomNormal",
		type: "Dragon",
		contestType: "Cool",
	},
	"overheat": {
		num: 315,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "overheat",
		isViable: true,
		name: "Overheat",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"painsplit": {
		num: 220,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and the target's HP become the average of their current HP, rounded down, but not more than the maximum HP of either one.",
		shortDesc: "Shares HP of user and target equally.",
		id: "painsplit",
		isViable: true,
		name: "Pain Split",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit: function (target, pokemon) {
			let averagehp = Math.floor((target.hp + pokemon.hp) / 2) || 1;
			target.sethp(averagehp);
			pokemon.sethp(averagehp);
			this.add('-sethp', target, target.getHealth, pokemon, pokemon.getHealth, '[from] move: Pain Split');
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"paraboliccharge": {
		num: 570,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "paraboliccharge",
		name: "Parabolic Charge",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: false,
		target: "allAdjacent",
		type: "Electric",
		contestType: "Clever",
	},
	"partingshot": {
		num: 575,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack and Special Attack by 1 stage. If this move is successful, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.",
		shortDesc: "Lowers target's Atk, Sp. Atk by 1. User switches.",
		id: "partingshot",
		isViable: true,
		name: "Parting Shot",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		selfSwitch: true,
		boosts: {
			atk: -1,
			spa: -1,
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	"payday": {
		num: 6,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Scatters coins.",
		id: "payday",
		name: "Pay Day",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit: function () {
			this.add('-fieldactivate', 'move: Pay Day');
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"payback": {
		num: 371,
		accuracy: 100,
		basePower: 50,
		basePowerCallback: function (pokemon, target, move) {
			if (target.newlySwitched || this.willMove(target)) {
				this.debug('Payback NOT boosted');
				return move.basePower;
			}
			this.debug('Payback damage boost');
			return move.basePower * 2;
		},
		category: "Physical",
		desc: "Power doubles if the target moves before the user; power is not doubled if the target switches out.",
		shortDesc: "Power doubles if the user moves after the target.",
		id: "payback",
		name: "Payback",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	"peck": {
		num: 64,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "peck",
		name: "Peck",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"perishsong": {
		num: 195,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Each active Pokemon receives a perish count of 4 if it doesn't already have a perish count. At the end of each turn including the turn used, the perish count of all active Pokemon lowers by 1 and Pokemon faint if the number reaches 0. The perish count is removed from Pokemon that switch out. If a Pokemon uses Baton Pass while it has a perish count, the replacement will gain the perish count and continue to count down.",
		shortDesc: "All active Pokemon will faint in 3 turns.",
		id: "perishsong",
		isViable: true,
		name: "Perish Song",
		pp: 5,
		priority: 0,
		flags: {sound: 1, distance: 1, authentic: 1},
		onHitField: function (target, source) {
			let result = false;
			let message = false;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					if (this.sides[i].active[j] && this.sides[i].active[j].isActive) {
						if (this.sides[i].active[j].hasAbility('soundproof')) {
							this.add('-immune', this.sides[i].active[j], '[msg]', '[from] ability: Soundproof');
							result = true;
						} else if (!this.sides[i].active[j].volatiles['perishsong']) {
							this.sides[i].active[j].addVolatile('perishsong');
							this.add('-start', this.sides[i].active[j], 'perish3', '[silent]');
							result = true;
							message = true;
						}
					}
				}
			}
			if (!result) return false;
			if (message) this.add('-fieldactivate', 'move: Perish Song');
		},
		effect: {
			duration: 4,
			onEnd: function (target) {
				this.add('-start', target, 'perish0');
				target.faint();
			},
			onResidual: function (pokemon) {
				let duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start', pokemon, 'perish' + duration);
			},
		},
		secondary: false,
		target: "all",
		type: "Normal",
		contestType: "Beautiful",
	},
	"petalblizzard": {
		num: 572,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent Pokemon.",
		id: "petalblizzard",
		isViable: true,
		name: "Petal Blizzard",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "allAdjacent",
		type: "Grass",
		contestType: "Beautiful",
	},
	"petaldance": {
		num: 80,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent foe at random. The user spends two or three turns locked into this move and becomes confused after the last turn of the effect if it is not already. If the user is prevented from moving or the attack is not successful against the target on the first turn of the effect or the second turn of a three-turn effect, the effect ends without causing confusion. If this move is called by Sleep Talk, the move is used for one turn and does not confuse the user.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "petaldance",
		isViable: true,
		name: "Petal Dance",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove: function (pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		secondary: false,
		target: "randomNormal",
		type: "Grass",
		contestType: "Beautiful",
	},
	"phantomforce": {
		num: 566,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "Disappears turn 1. Hits turn 2. Breaks protection.",
		id: "phantomforce",
		name: "Phantom Force",
		pp: 10,
		priority: 0,
		flags: {contact: 1, charge: 1, mirror: 1},
		breaksProtect: true,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		effect: {
			duration: 2,
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
		},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	"pinmissile": {
		num: 42,
		accuracy: 95,
		basePower: 25,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "pinmissile",
		name: "Pin Missile",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	"playnice": {
		num: 589,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 1 stage.",
		shortDesc: "Lowers the target's Attack by 1.",
		id: "playnice",
		name: "Play Nice",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, mirror: 1, authentic: 1},
		boosts: {
			atk: -1,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"playrough": {
		num: 583,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "Has a 10% chance to lower the target's Attack by 1 stage.",
		shortDesc: "10% chance to lower the target's Attack by 1.",
		id: "playrough",
		isViable: true,
		name: "Play Rough",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Fairy",
		contestType: "Cute",
	},
	"pluck": {
		num: 365,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, it steals the target's held Berry if it is holding one and eats it immediately. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
		shortDesc: "User steals and eats the target's Berry.",
		id: "pluck",
		name: "Pluck",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		onHit: function (target, source) {
			let item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Pluck', '[of] ' + source);
				this.singleEvent('Eat', item, null, source, null, null);
				this.runEvent('EatItem', source, null, null, item);
				source.ateBerry = true;
			}
		},
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Cute",
	},
	"poisonfang": {
		num: 305,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a 50% chance to badly poison the target.",
		shortDesc: "50% chance to badly poison the target.",
		id: "poisonfang",
		name: "Poison Fang",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			status: 'tox',
		},
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	"poisongas": {
		num: 139,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Poisons the target.",
		shortDesc: "Poisons the foe(s).",
		id: "poisongas",
		name: "Poison Gas",
		pp: 40,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'psn',
		secondary: false,
		target: "allAdjacentFoes",
		type: "Poison",
		contestType: "Clever",
	},
	"poisonjab": {
		num: 398,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 30% chance to poison the target.",
		shortDesc: "30% chance to poison the target.",
		id: "poisonjab",
		isViable: true,
		name: "Poison Jab",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	"poisonpowder": {
		num: 77,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Poisons the target.",
		shortDesc: "Poisons the target.",
		id: "poisonpowder",
		name: "Poison Powder",
		pp: 35,
		priority: 0,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
		status: 'psn',
		secondary: false,
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	"poisonsting": {
		num: 40,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		desc: "Has a 30% chance to poison the target.",
		shortDesc: "30% chance to poison the target.",
		id: "poisonsting",
		name: "Poison Sting",
		pp: 35,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	"poisontail": {
		num: 342,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a 10% chance to poison the target and a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio. 10% chance to poison.",
		id: "poisontail",
		name: "Poison Tail",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: {
			chance: 10,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	"pound": {
		num: 1,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "pound",
		name: "Pound",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"powder": {
		num: 600,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "If the target uses a Fire-type move this turn, it is prevented from executing and the target loses 1/4 of its maximum HP, rounded half up.",
		shortDesc: "If using a Fire move, target loses 1/4 max HP.",
		id: "powder",
		name: "Powder",
		pp: 20,
		priority: 1,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'powder',
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Powder');
			},
			onTryMove: function (pokemon, target, move) {
				if (move.type === 'Fire') {
					this.add('-activate', pokemon, 'Powder');
					this.damage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1));
					return false;
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	"powdersnow": {
		num: 181,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to freeze the target.",
		shortDesc: "10% chance to freeze the foe(s).",
		id: "powdersnow",
		name: "Powder Snow",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	"powergem": {
		num: 408,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "powergem",
		isViable: true,
		name: "Power Gem",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Rock",
		contestType: "Beautiful",
	},
	"powersplit": {
		num: 471,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and the target have their Attack and Special Attack stats set to be equal to the average of the user and the target's Attack and Special Attack stats, respectively, rounded down. Stat stage changes are unaffected.",
		shortDesc: "Averages Attack and Sp. Atk stats with target.",
		id: "powersplit",
		name: "Power Split",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onHit: function (target, source) {
			let newatk = Math.floor((target.stats.atk + source.stats.atk) / 2);
			target.stats.atk = newatk;
			source.stats.atk = newatk;
			let newspa = Math.floor((target.stats.spa + source.stats.spa) / 2);
			target.stats.spa = newspa;
			source.stats.spa = newspa;
			this.add('-activate', source, 'Power Split', '[of] ' + target);
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"powerswap": {
		num: 384,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps its Attack and Special Attack stat stage changes with the target.",
		shortDesc: "Swaps Attack and Sp. Atk stat stages with target.",
		id: "powerswap",
		name: "Power Swap",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
		onHit: function (target, source) {
			let targetBoosts = {};
			let sourceBoosts = {};

			for (let i in {atk:1, spa:1}) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);

			this.add('-swapboost', source, target, 'atk, spa', '[from] move: Power Swap');
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"powertrick": {
		num: 379,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps its Attack and Defense stats; stat stage changes remain on their respective stats. This move can be used again to swap the stats back. If the user uses Baton Pass, the replacement will have its Attack and Defense stats swapped if the effect is active. If the user has its stats recalculated by changing forme while its stats are swapped, this effect is ignored but is still active for the purposes of Baton Pass.",
		shortDesc: "Switches user's Attack and Defense stats.",
		id: "powertrick",
		name: "Power Trick",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		volatileStatus: 'powertrick',
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Power Trick');
				let newatk = pokemon.stats.def;
				let newdef = pokemon.stats.atk;
				pokemon.stats.atk = newatk;
				pokemon.stats.def = newdef;
			},
			onCopy: function (pokemon) {
				let newatk = pokemon.stats.def;
				let newdef = pokemon.stats.atk;
				pokemon.stats.atk = newatk;
				pokemon.stats.def = newdef;
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Power Trick');
				let newatk = pokemon.stats.def;
				let newdef = pokemon.stats.atk;
				pokemon.stats.atk = newatk;
				pokemon.stats.def = newdef;
			},
			onRestart: function (pokemon) {
				pokemon.removeVolatile('Power Trick');
			},
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Clever",
	},
	"poweruppunch": {
		num: 612,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Has a 100% chance to raise the user's Attack by 1 stage.",
		shortDesc: "100% chance to raise the user's Attack by 1.",
		id: "poweruppunch",
		isViable: true,
		name: "Power-Up Punch",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"powerwhip": {
		num: 438,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "powerwhip",
		isViable: true,
		name: "Power Whip",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Tough",
	},
	"precipiceblades": {
		num: 619,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent Pokemon.",
		id: "precipiceblades",
		isViable: true,
		name: "Precipice Blades",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		target: "allAdjacentFoes",
		type: "Ground",
		contestType: "Cool",
	},
	"present": {
		num: 217,
		accuracy: 90,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage or heals the target. 40% chance for 40 power, 30% chance for 80 power, 10% chance for 120 power, and 20% chance to heal the target by 1/4 of its maximum HP, rounded down. This move must hit to be effective.",
		shortDesc: "40, 80, 120 power, or heals target by 1/4 max HP.",
		id: "present",
		name: "Present",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move, pokemon, target) {
			let rand = this.random(10);
			if (rand < 2) {
				move.heal = [1, 4];
			} else if (rand < 6) {
				move.basePower = 40;
			} else if (rand < 9) {
				move.basePower = 80;
			} else {
				move.basePower = 120;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"protect": {
		num: 182,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		shortDesc: "Prevents moves from affecting the user this turn.",
		id: "protect",
		isViable: true,
		name: "Protect",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit: function (pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"psybeam": {
		num: 60,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 10% chance to confuse the target.",
		shortDesc: "10% chance to confuse the target.",
		id: "psybeam",
		name: "Psybeam",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"psychup": {
		num: 244,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user copies all of the target's current stat stage changes.",
		shortDesc: "Copies the target's current stat stages.",
		id: "psychup",
		name: "Psych Up",
		pp: 10,
		priority: 0,
		flags: {authentic: 1},
		onHit: function (target, source) {
			for (let i in target.boosts) {
				source.boosts[i] = target.boosts[i];
			}
			this.add('-copyboost', source, target, '[from] move: Psych Up');
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"psychic": {
		num: 94,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "psychic",
		isViable: true,
		name: "Psychic",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"psychoboost": {
		num: 354,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "psychoboost",
		isViable: true,
		name: "Psycho Boost",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"psychocut": {
		num: 427,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "psychocut",
		isViable: true,
		name: "Psycho Cut",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	"psychoshift": {
		num: 375,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user's major status condition is transferred to the target, and the user is then cured. Fails if the target already has a major status condition.",
		shortDesc: "Transfers the user's status ailment to the target.",
		id: "psychoshift",
		name: "Psycho Shift",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit: function (target, pokemon) {
			if (pokemon.status && !target.status && target.trySetStatus(pokemon.status)) {
				pokemon.cureStatus();
			} else {
				return false;
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"psyshock": {
		num: 473,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "Deals damage to the target based on its Defense instead of Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
		id: "psyshock",
		isViable: true,
		name: "Psyshock",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Beautiful",
	},
	"psystrike": {
		num: 540,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "Deals damage to the target based on its Defense instead of Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
		id: "psystrike",
		isViable: true,
		name: "Psystrike",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	"psywave": {
		num: 149,
		accuracy: 100,
		basePower: 0,
		damageCallback: function (pokemon) {
			return (this.random(50, 151) * pokemon.level) / 100;
		},
		category: "Special",
		desc: "Deals damage to the target equal to (user's level) * (X+50) / 100, where X is a random number from 0 to 100, rounded down, but not less than 1 HP.",
		shortDesc: "Random damage equal to 0.5x-1.5x user's level.",
		id: "psywave",
		name: "Psywave",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"punishment": {
		num: 386,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let power = 60 + 20 * target.positiveBoosts();
			if (power > 200) power = 200;
			return power;
		},
		category: "Physical",
		desc: "Power is equal to 60+(X*20), where X is the target's total stat stage changes that are greater than 0, but not more than 200 power.",
		shortDesc: "60 power +20 for each of the target's stat boosts.",
		id: "punishment",
		name: "Punishment",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	"pursuit": {
		num: 228,
		accuracy: 100,
		basePower: 40,
		basePowerCallback: function (pokemon, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack) {
				this.debug('Pursuit damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		desc: "If an adjacent foe switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original target. If the user moves after a foe using Parting Shot, U-turn, or Volt Switch, but not Baton Pass, it will hit that foe before it leaves the field. Power doubles and no accuracy check is done if the user hits a foe switching out, and the user's turn is over; if a foe faints from this, the replacement Pokemon does not become active until the end of the turn.",
		shortDesc: "Power doubles if a foe is switching out.",
		id: "pursuit",
		isViable: true,
		name: "Pursuit",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		beforeTurnCallback: function (pokemon, target) {
			target.side.addSideCondition('pursuit', pokemon);
			if (!target.side.sideConditions['pursuit'].sources) {
				target.side.sideConditions['pursuit'].sources = [];
			}
			target.side.sideConditions['pursuit'].sources.push(pokemon);
		},
		onModifyMove: function (move, source, target) {
			if (target && target.beingCalledBack) move.accuracy = true;
		},
		onTryHit: function (target, pokemon) {
			target.side.removeSideCondition('pursuit');
		},
		effect: {
			duration: 1,
			onBeforeSwitchOut: function (pokemon) {
				this.debug('Pursuit start');
				let sources = this.effectData.sources;
				this.add('-activate', pokemon, 'move: Pursuit');
				for (let i = 0; i < sources.length; i++) {
					if (sources[i].moveThisTurn || sources[i].fainted) continue;
					this.cancelMove(sources[i]);
					// Run through each decision in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (sources[i].canMegaEvo) {
						for (let j = 0; j < this.queue.length; j++) {
							if (this.queue[j].pokemon === sources[i] && this.queue[j].choice === 'megaEvo') {
								this.runMegaEvo(sources[i]);
								break;
							}
						}
					}
					this.runMove('pursuit', sources[i], pokemon);
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"quash": {
		num: 511,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to take its turn after all other Pokemon this turn, no matter the priority of its selected move. Fails if the target already moved this turn.",
		shortDesc: "Forces the target to move last this turn.",
		id: "quash",
		name: "Quash",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit: function (target) {
			if (target.side.active.length < 2) return false; // fails in singles
			let decision = this.willMove(target);
			if (decision) {
				decision.priority = -7.1;
				this.cancelMove(target);
				for (let i = this.queue.length - 1; i >= 0; i--) {
					if (this.queue[i].choice === 'residual') {
						this.queue.splice(i, 0, decision);
						break;
					}
				}
				this.add('-activate', target, 'move: Quash');
			} else {
				return false;
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"quickattack": {
		num: 98,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "quickattack",
		isViable: true,
		name: "Quick Attack",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"quickguard": {
		num: 501,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and its party members are protected from attacks with original or altered priority greater than 0 made by other Pokemon, including allies, during this turn. This move modifies the same 1/X chance of being successful used by other protection moves, where X starts at 1 and triples each time this move is successfully used, but does not use the chance to check for failure. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn or if this move is already in effect for the user's side.",
		shortDesc: "Protects allies from priority attacks this turn.",
		id: "quickguard",
		name: "Quick Guard",
		pp: 15,
		priority: 3,
		flags: {snatch: 1},
		sideCondition: 'quickguard',
		onTryHitSide: function (side, source) {
			return this.willAct();
		},
		onHitSide: function (side, source) {
			source.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Quick Guard');
			},
			onTryHitPriority: 4,
			onTryHit: function (target, source, effect) {
				// Quick Guard blocks moves with positive priority, even those given increased priority by Prankster or Gale Wings.
				// (e.g. it blocks 0 priority moves boosted by Prankster or Gale Wings)
				if (effect && (effect.id === 'feint' || effect.priority <= 0 || effect.target === 'self')) {
					return;
				}
				this.add('-activate', target, 'Quick Guard');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
		secondary: false,
		target: "allySide",
		type: "Fighting",
		contestType: "Cool",
	},
	"quiverdance": {
		num: 483,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "Raises the user's Sp. Atk, Sp. Def, Speed by 1.",
		id: "quiverdance",
		isViable: true,
		name: "Quiver Dance",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spa: 1,
			spd: 1,
			spe: 1,
		},
		secondary: false,
		target: "self",
		type: "Bug",
		contestType: "Beautiful",
	},
	"rage": {
		num: 99,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Once this move is successfuly used, the user's Attack is raised by 1 stage every time it is hit by another Pokemon's attack as long as this move is chosen for use.",
		shortDesc: "Raises the user's Attack by 1 if hit during use.",
		id: "rage",
		name: "Rage",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'rage',
		},
		effect: {
			onStart: function (pokemon) {
				this.add('-singlemove', pokemon, 'Rage');
			},
			onHit: function (target, source, move) {
				if (target !== source && move.category !== 'Status') {
					this.boost({atk:1});
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove: function (pokemon) {
				this.debug('removing Rage before attack');
				pokemon.removeVolatile('rage');
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"ragepowder": {
		num: 476,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the end of the turn, all single-target attacks from the foe's team are redirected to the user if they are in range. Such attacks are redirected to the user before they can be reflected by Magic Coat or the Ability Magic Bounce, or drawn in by the Abilities Lightning Rod or Storm Drain. Fails if it is not a Double or Triple Battle.",
		shortDesc: "The foes' moves target the user on the turn used.",
		id: "ragepowder",
		name: "Rage Powder",
		pp: 20,
		priority: 2,
		flags: {powder: 1},
		volatileStatus: 'ragepowder',
		onTryHit: function (target) {
			if (target.side.active.length < 2) return false;
		},
		effect: {
			duration: 1,
			onStart: function (pokemon) {
				this.add('-singleturn', pokemon, 'move: Rage Powder');
			},
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget: function (target, source, source2, move) {
				if (source.runStatusImmunity('powder') && this.validTarget(this.effectData.target, source, move.target)) {
					this.debug("Rage Powder redirected target of move");
					return this.effectData.target;
				}
			},
		},
		secondary: false,
		target: "self",
		type: "Bug",
		contestType: "Clever",
	},
	"raindance": {
		num: 240,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Rain Dance. The damage of Water-type attacks is multiplied by 1.5 and the damage of Fire-type attacks is multiplied by 0.5 during the effect. Lasts for 8 turns if the user is holding Damp Rock. Fails if the current weather is Rain Dance.",
		shortDesc: "For 5 turns, heavy rain powers Water moves.",
		id: "raindance",
		name: "Rain Dance",
		pp: 5,
		priority: 0,
		flags: {},
		weather: 'RainDance',
		secondary: false,
		target: "all",
		type: "Water",
		contestType: "Beautiful",
	},
	"rapidspin": {
		num: 229,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, the effects of Leech Seed and partial-trapping moves end for the user, and all hazards are removed from the user's side of the field.",
		shortDesc: "Frees user from hazards/partial trap/Leech Seed.",
		id: "rapidspin",
		isViable: true,
		name: "Rapid Spin",
		pp: 40,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				let sideConditions = {spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1};
				for (let i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"razorleaf": {
		num: 75,
		accuracy: 95,
		basePower: 55,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio. Hits adjacent foes.",
		id: "razorleaf",
		name: "Razor Leaf",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Grass",
		contestType: "Cool",
	},
	"razorshell": {
		num: 534,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's Defense by 1 stage.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "razorshell",
		isViable: true,
		name: "Razor Shell",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	"razorwind": {
		num: 13,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a higher chance for a critical hit. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges, then hits foe(s) turn 2. High crit ratio.",
		id: "razorwind",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.volatiles['twoturnmove']) {
				if (attacker.volatiles['twoturnmove'].duration === 2) return null;
				attacker.removeVolatile(move.id);
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				if (move.spreadHit) {
					attacker.addVolatile('twoturnmove', defender);
					attacker.volatiles['twoturnmove'].duration = 1;
				}
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		critRatio: 2,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
	},
	"recover": {
		num: 105,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "recover",
		isViable: true,
		name: "Recover",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Clever",
	},
	"recycle": {
		num: 278,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user regains the item it last used, if it is not holding an item. Fails if the user was not holding an item, if the item was a popped Air Balloon, if the item was picked up by a Pokemon with the Ability Pickup, or if the item was lost to Bug Bite, Covet, Incinerate, Knock Off, Pluck, or Thief. Items thrown with Fling can be regained.",
		shortDesc: "Restores the item the user last used.",
		id: "recycle",
		name: "Recycle",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		onHit: function (pokemon) {
			if (pokemon.item || !pokemon.lastItem) return false;
			pokemon.setItem(pokemon.lastItem);
			this.add('-item', pokemon, pokemon.getItem(), '[from] move: Recycle');
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Clever",
	},
	"reflect": {
		num: 115,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members take 0.5x damage from physical attacks, or 0.66x damage if in a Double or Triple Battle. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break or Defog. Brick Break removes the effect before damage is calculated. Lasts for 8 turns if the user is holding Light Clay.",
		shortDesc: "For 5 turns, physical damage to allies is halved.",
		id: "reflect",
		isViable: true,
		name: "Reflect",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		sideCondition: 'reflect',
		effect: {
			duration: 5,
			durationCallback: function (target, source, effect) {
				if (source && source.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage: function (damage, source, target, move) {
				if (target !== source && target.side === this.effectData.target && this.getCategory(move) === 'Physical') {
					if (!move.crit && !move.infiltrates) {
						this.debug('Reflect weaken');
						if (target.side.active.length > 1) return this.chainModify([0xA8F, 0x1000]);
						return this.chainModify(0.5);
					}
				}
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Reflect');
			},
			onResidualOrder: 21,
			onEnd: function (side) {
				this.add('-sideend', side, 'Reflect');
			},
		},
		secondary: false,
		target: "allySide",
		type: "Psychic",
		contestType: "Clever",
	},
	"reflecttype": {
		num: 513,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the user's types to become the same as the current types of the target. Fails if the user is an Arceus.",
		shortDesc: "User becomes the same type as the target.",
		id: "reflecttype",
		name: "Reflect Type",
		pp: 15,
		priority: 0,
		flags: {protect: 1, authentic: 1},
		onHit: function (target, source) {
			if (source.template && source.template.num === 493) return false;
			this.add('-start', source, 'typechange', '[from] move: Reflect Type', '[of] ' + target);
			source.types = target.getTypes(true);
			source.addedType = target.addedType;
			source.knownType = target.side === source.side && target.knownType;
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"refresh": {
		num: 287,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user cures its burn, poison, or paralysis.",
		shortDesc: "User cures its burn, poison, or paralysis.",
		id: "refresh",
		name: "Refresh",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		onHit: function (pokemon) {
			if (pokemon.status in {'': 1, 'slp': 1, 'frz': 1}) return false;
			pokemon.cureStatus();
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"relicsong": {
		num: 547,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "Has a 10% chance to cause the target to fall asleep. If this move is successful on at least one target and the user is a Meloetta, it changes to Pirouette Forme if it is currently in Aria Forme, or changes to Aria Forme if it is currently in Pirouette Forme. This forme change does not happen if the Meloetta has the Ability Sheer Force. The Pirouette Forme reverts to Aria Forme when Meloetta is not active.",
		shortDesc: "10% chance to sleep foe(s). Meloetta transforms.",
		id: "relicsong",
		isViable: true,
		name: "Relic Song",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		secondary: {
			chance: 10,
			status: 'slp',
		},
		onHit: function (target, pokemon) {
			if (pokemon.baseTemplate.species === 'Meloetta' && !pokemon.transformed) {
				pokemon.addVolatile('relicsong');
			}
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function (pokemon, target, move) {
				if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
					this.add('-formechange', pokemon, 'Meloetta', '[msg]');
				} else if (pokemon.formeChange('Meloetta-Pirouette')) {
					this.add('-formechange', pokemon, 'Meloetta-Pirouette', '[msg]');
				}
				pokemon.removeVolatile('relicsong');
			},
		},
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Beautiful",
	},
	"rest": {
		num: 156,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user falls asleep for the next two turns and restores all of its HP, curing itself of any major status condition in the process. Fails if the user has full HP, is already asleep, or if another effect is preventing sleep.",
		shortDesc: "User sleeps 2 turns and restores HP and status.",
		id: "rest",
		isViable: true,
		name: "Rest",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onHit: function (target) {
			if (target.hp >= target.maxhp) return false;
			if (!target.setStatus('slp')) return false;
			target.statusData.time = 3;
			target.statusData.startTime = 3;
			this.heal(target.maxhp); //Aeshetic only as the healing happens after you fall asleep in-game
			this.add('-status', target, 'slp', '[from] move: Rest');
		},
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Cute",
	},
	"retaliate": {
		num: 514,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Power doubles if one of the user's party members fainted last turn.",
		shortDesc: "Power doubles if an ally fainted last turn.",
		id: "retaliate",
		name: "Retaliate",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon) {
			if (pokemon.side.faintedLastTurn) {
				this.debug('Boosted for a faint last turn');
				return this.chainModify(2);
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"return": {
		num: 216,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon) {
			return Math.floor((pokemon.happiness * 10) / 25) || 1;
		},
		category: "Physical",
		desc: "Power is equal to the greater of (user's Happiness * 2/5), rounded down, or 1.",
		shortDesc: "Max 102 power at maximum Happiness.",
		id: "return",
		isViable: true,
		name: "Return",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"revenge": {
		num: 279,
		accuracy: 100,
		basePower: 60,
		basePowerCallback: function (pokemon, target, move) {
			if (target.lastDamage > 0 && pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && pokemon.lastAttackedBy.pokemon === target) {
				this.debug('Boosted for getting hit by ' + pokemon.lastAttackedBy.move);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		desc: "Power doubles if the user was hit by the target this turn.",
		shortDesc: "Power doubles if user is damaged by the target.",
		id: "revenge",
		name: "Revenge",
		pp: 10,
		priority: -4,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"reversal": {
		num: 179,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let ratio = pokemon.hp * 48 / pokemon.maxhp;
			if (ratio < 2) {
				return 200;
			}
			if (ratio < 5) {
				return 150;
			}
			if (ratio < 10) {
				return 100;
			}
			if (ratio < 17) {
				return 80;
			}
			if (ratio < 33) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Deals damage to the target based on the amount of HP the user has left. X is equal to (user's current HP * 48 / user's maximum HP), rounded down; the base power of this attack is 20 if X is 33 to 48, 40 if X is 17 to 32, 80 if X is 10 to 16, 100 if X is 5 to 9, 150 if X is 2 to 4, and 200 if X is 0 or 1.",
		shortDesc: "More power the less HP the user has left.",
		id: "reversal",
		name: "Reversal",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"roar": {
		num: 46,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The target is forced to switch out and be replaced with a random unfainted ally. Fails if the target used Ingrain previously or has the Ability Suction Cups.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "roar",
		isViable: true,
		name: "Roar",
		pp: 20,
		priority: -6,
		flags: {reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		forceSwitch: true,
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"roaroftime": {
		num: 459,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "roaroftime",
		name: "Roar of Time",
		pp: 5,
		priority: 0,
		flags: {recharge: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: false,
		target: "normal",
		type: "Dragon",
		contestType: "Beautiful",
	},
	"rockblast": {
		num: 350,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "rockblast",
		isViable: true,
		name: "Rock Blast",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	"rockclimb": {
		num: 431,
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		desc: "Has a 20% chance to confuse the target.",
		shortDesc: "20% chance to confuse the target.",
		id: "rockclimb",
		name: "Rock Climb",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"rockpolish": {
		num: 397,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages.",
		shortDesc: "Raises the user's Speed by 2.",
		id: "rockpolish",
		isViable: true,
		name: "Rock Polish",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spe: 2,
		},
		secondary: false,
		target: "self",
		type: "Rock",
		contestType: "Tough",
	},
	"rockslide": {
		num: 157,
		accuracy: 90,
		basePower: 75,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the foe(s).",
		id: "rockslide",
		isViable: true,
		name: "Rock Slide",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "allAdjacentFoes",
		type: "Rock",
		contestType: "Tough",
	},
	"rocksmash": {
		num: 249,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's Defense by 1 stage.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "rocksmash",
		name: "Rock Smash",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"rockthrow": {
		num: 88,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "rockthrow",
		name: "Rock Throw",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	"rocktomb": {
		num: 317,
		accuracy: 95,
		basePower: 60,
		category: "Physical",
		desc: "Has a 100% chance to lower the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the target's Speed by 1.",
		id: "rocktomb",
		name: "Rock Tomb",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Clever",
	},
	"rockwrecker": {
		num: 439,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		desc: "If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "rockwrecker",
		name: "Rock Wrecker",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, recharge: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: false,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	"roleplay": {
		num: 272,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user's Ability changes to match the target's Ability. Fails if the user's Ability is Multitype, Stance Change, or already matches the target, or if the target's Ability is Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, Wonder Guard, or Zen Mode.",
		shortDesc: "User replaces its Ability with the target's.",
		id: "roleplay",
		name: "Role Play",
		pp: 10,
		priority: 0,
		flags: {authentic: 1},
		onTryHit: function (target, source) {
			let bannedAbilities = {flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, trace:1, wonderguard:1, zenmode:1};
			if (bannedAbilities[target.ability] || source.ability === 'multitype' || target.ability === source.ability) {
				return false;
			}
		},
		onHit: function (target, source) {
			let oldAbility = source.setAbility(target.ability);
			if (oldAbility) {
				this.add('-ability', source, this.getAbility(source.ability).name, '[from] move: Role Play', '[of] ' + target);
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Cute",
	},
	"rollingkick": {
		num: 27,
		accuracy: 85,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "rollingkick",
		name: "Rolling Kick",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"rollout": {
		num: 205,
		accuracy: 90,
		basePower: 30,
		basePowerCallback: function (pokemon, target, move) {
			let bp = move.basePower;
			if (pokemon.volatiles.rollout && pokemon.volatiles.rollout.hitCount) {
				bp *= Math.pow(2, pokemon.volatiles.rollout.hitCount);
			}
			pokemon.addVolatile('rollout');
			if (pokemon.volatiles.defensecurl) {
				bp *= 2;
			}
			this.debug("Rollout bp: " + bp);
			return bp;
		},
		category: "Physical",
		desc: "If this move is successful, the user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. Power doubles with each successful hit of this move and doubles again if Defense Curl was used previously by the user. If this move is called by Sleep Talk, the move is used for one turn.",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
		id: "rollout",
		name: "Rollout",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		effect: {
			duration: 2,
			onLockMove: 'rollout',
			onStart: function () {
				this.effectData.hitCount = 1;
			},
			onRestart: function () {
				this.effectData.hitCount++;
				if (this.effectData.hitCount < 5) {
					this.effectData.duration = 2;
				}
			},
			onResidual: function (target) {
				if (target.lastMove === 'struggle') {
					// don't lock
					delete target.volatiles['rollout'];
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Rock",
		contestType: "Cute",
	},
	"roost": {
		num: 355,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up. Until the end of the turn, Flying-type users lose their Flying type and pure Flying-type users become Normal type. Does nothing if the user's HP is full.",
		shortDesc: "Heals 50% HP. Flying-type removed 'til turn ends.",
		id: "roost",
		isViable: true,
		name: "Roost",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		self: {
			volatileStatus: 'roost',
		},
		effect: {
			duration: 1,
			// implemented in BattlePokemon#getTypes
		},
		secondary: false,
		target: "self",
		type: "Flying",
		contestType: "Clever",
	},
	"rototiller": {
		num: 563,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the Attack and Special Attack of all grounded Grass-type Pokemon on the field by 1 stage.",
		shortDesc: "Raises Atk, Sp. Atk of grounded Grass types by 1.",
		id: "rototiller",
		name: "Rototiller",
		pp: 10,
		priority: 0,
		flags: {distance: 1, nonsky: 1},
		onHitField: function (target, source) {
			let targets = [];
			let anyAirborne = false;
			for (let sideSlot = 0; sideSlot < this.sides.length; sideSlot++) {
				let sideActive = this.sides[sideSlot].active;
				for (let activeSlot = 0; activeSlot < sideActive.length; activeSlot++) {
					if (!sideActive[activeSlot] || !sideActive[activeSlot].isActive) continue;
					if (!sideActive[activeSlot].runImmunity('Ground')) {
						this.add('-immune', sideActive[activeSlot], '[msg]');
						anyAirborne = true;
						continue;
					}
					if (sideActive[activeSlot].hasType('Grass')) {
						// This move affects every grounded Grass-type Pokemon in play.
						targets.push(sideActive[activeSlot]);
					}
				}
			}
			if (!targets.length && !anyAirborne) return false; // Fails when there are no grounded Grass types or airborne Pokemon
			for (let i = 0; i < targets.length; i++) this.boost({atk: 1, spa: 1}, targets[i], source);
		},
		secondary: false,
		target: "all",
		type: "Ground",
		contestType: "Tough",
	},
	"round": {
		num: 496,
		accuracy: 100,
		basePower: 60,
		basePowerCallback: function (target, source, move) {
			if (move.sourceEffect === 'round') {
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Special",
		desc: "If there are other active Pokemon that chose this move for use this turn, those Pokemon take their turn immediately after the user, in Speed order, and this move's power is 120 for each other user.",
		shortDesc: "Power doubles if others used Round this turn.",
		id: "round",
		name: "Round",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onTry: function () {
			for (let i = 0; i < this.queue.length; i++) {
				let decision = this.queue[i];
				if (!decision.pokemon || !decision.move) continue;
				if (decision.move.id === 'round') {
					this.prioritizeQueue(decision);
					return;
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"sacredfire": {
		num: 221,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "Has a 50% chance to burn the target.",
		shortDesc: "50% chance to burn the target. Thaws user.",
		id: "sacredfire",
		isViable: true,
		name: "Sacred Fire",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		secondary: {
			chance: 50,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"sacredsword": {
		num: 533,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Ignores the target's stat stage changes, including evasiveness.",
		shortDesc: "Ignores the target's stat stage changes.",
		id: "sacredsword",
		isViable: true,
		name: "Sacred Sword",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		ignoreEvasion: true,
		ignoreDefensive: true,
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"safeguard": {
		num: 219,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members cannot have major status conditions or confusion inflicted on them by other Pokemon. It is removed from the user's side if the user or an ally is successfully hit by Defog.",
		shortDesc: "For 5 turns, protects user's party from status.",
		id: "safeguard",
		name: "Safeguard",
		pp: 25,
		priority: 0,
		flags: {snatch: 1},
		sideCondition: 'safeguard',
		effect: {
			duration: 5,
			durationCallback: function (target, source, effect) {
				if (source && source.hasAbility('persistent')) {
					return 7;
				}
				return 5;
			},
			onSetStatus: function (status, target, source, effect) {
				if (source && target !== source && effect && (!effect.infiltrates || target.side === source.side)) {
					this.debug('interrupting setStatus');
					return false;
				}
			},
			onTryConfusion: function (target, source, effect) {
				if (source && target !== source && effect && (!effect.infiltrates || target.side === source.side)) {
					this.debug('interrupting addVolatile');
					return false;
				}
			},
			onTryHit: function (target, source, move) {
				if (move && move.id === 'yawn' && target !== source && (!move.infiltrates || target.side === source.side)) {
					this.debug('blocking yawn');
					return false;
				}
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Safeguard');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function (side) {
				this.add('-sideend', side, 'Safeguard');
			},
		},
		secondary: false,
		target: "allySide",
		type: "Normal",
		contestType: "Beautiful",
	},
	"sandattack": {
		num: 28,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's accuracy by 1 stage.",
		shortDesc: "Lowers the target's accuracy by 1.",
		id: "sandattack",
		name: "Sand Attack",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			accuracy: -1,
		},
		secondary: false,
		target: "normal",
		type: "Ground",
		contestType: "Cute",
	},
	"sandtomb": {
		num: 328,
		accuracy: 85,
		basePower: 35,
		category: "Physical",
		desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "sandtomb",
		name: "Sand Tomb",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Ground",
		contestType: "Clever",
	},
	"sandstorm": {
		num: 201,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Sandstorm. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are a Ground, Rock, or Steel type, or have the Abilities Magic Guard, Overcoat, Sand Force, Sand Rush, or Sand Veil. The Special Defense of Rock-type Pokemon is multiplied by 1.5 when taking damage from a special attack during the effect. Lasts for 8 turns if the user is holding Smooth Rock. Fails if the current weather is Sandstorm.",
		shortDesc: "For 5 turns, a sandstorm rages.",
		id: "sandstorm",
		name: "Sandstorm",
		pp: 10,
		priority: 0,
		flags: {},
		weather: 'Sandstorm',
		secondary: false,
		target: "all",
		type: "Rock",
		contestType: "Tough",
	},
	"scald": {
		num: 503,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 30% chance to burn the target. The target thaws out if it is frozen.",
		shortDesc: "30% chance to burn the target. Thaws user.",
		id: "scald",
		isViable: true,
		name: "Scald",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		thawsTarget: true,
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	"scaryface": {
		num: 184,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Speed by 2 stages.",
		shortDesc: "Lowers the target's Speed by 2.",
		id: "scaryface",
		name: "Scary Face",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			spe: -2,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"scratch": {
		num: 10,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "scratch",
		name: "Scratch",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"screech": {
		num: 103,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Defense by 2 stages.",
		shortDesc: "Lowers the target's Defense by 2.",
		id: "screech",
		name: "Screech",
		pp: 40,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		boosts: {
			def: -2,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"searingshot": {
		num: 545,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Has a 30% chance to burn the target.",
		shortDesc: "30% chance to burn adjacent Pokemon.",
		id: "searingshot",
		name: "Searing Shot",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "allAdjacent",
		type: "Fire",
		contestType: "Cool",
	},
	"secretpower": {
		num: 290,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a 30% chance to cause a secondary effect on the target based on the battle terrain. Causes paralysis on the regular Wi-Fi terrain, causes paralysis during Electric Terrain, lowers Special Attack by 1 stage during Misty Terrain, and causes sleep during Grassy Terrain. The secondary effect chance is not affected by the Ability Serene Grace.",
		shortDesc: "Effect varies with terrain. (30% paralysis chance)",
		id: "secretpower",
		name: "Secret Power",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move, pokemon) {
			if (this.isTerrain('')) return;
			move.secondaries = [];
			if (this.isTerrain('electricterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'par',
				});
			} else if (this.isTerrain('grassyterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'slp',
				});
			} else if (this.isTerrain('mistyterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spa: -1,
					},
				});
			}
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"secretsword": {
		num: 548,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "Deals damage to the target based on its Defense instead of Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
		id: "secretsword",
		isViable: true,
		name: "Secret Sword",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Beautiful",
	},
	"seedbomb": {
		num: 402,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "seedbomb",
		isViable: true,
		name: "Seed Bomb",
		pp: 15,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Tough",
	},
	"seedflare": {
		num: 465,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		desc: "Has a 40% chance to lower the target's Special Defense by 2 stages.",
		shortDesc: "40% chance to lower the target's Sp. Def by 2.",
		id: "seedflare",
		isViable: true,
		name: "Seed Flare",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 40,
			boosts: {
				spd: -2,
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	"seismictoss": {
		num: 69,
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		category: "Physical",
		desc: "Deals damage to the target equal to the user's level.",
		shortDesc: "Does damage equal to the user's level.",
		id: "seismictoss",
		isViable: true,
		name: "Seismic Toss",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"selfdestruct": {
		num: 120,
		accuracy: 100,
		basePower: 200,
		category: "Physical",
		desc: "The user faints after using this move, even if this move fails for having no target. This move is prevented from executing if any active Pokemon has the Ability Damp.",
		shortDesc: "Hits adjacent Pokemon. The user faints.",
		id: "selfdestruct",
		name: "Self-Destruct",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		selfdestruct: true,
		secondary: false,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Beautiful",
	},
	"shadowball": {
		num: 247,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Sp. Def by 1.",
		id: "shadowball",
		isViable: true,
		name: "Shadow Ball",
		pp: 15,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	"shadowclaw": {
		num: 421,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "shadowclaw",
		isViable: true,
		name: "Shadow Claw",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	"shadowforce": {
		num: 467,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "Disappears turn 1. Hits turn 2. Breaks protection.",
		id: "shadowforce",
		isViable: true,
		name: "Shadow Force",
		pp: 5,
		priority: 0,
		flags: {contact: 1, charge: 1, mirror: 1},
		breaksProtect: true,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		effect: {
			duration: 2,
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
		},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	"shadowpunch": {
		num: 325,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "shadowpunch",
		isViable: true,
		name: "Shadow Punch",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	"shadowsneak": {
		num: 425,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "shadowsneak",
		isViable: true,
		name: "Shadow Sneak",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	"sharpen": {
		num: 159,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage.",
		shortDesc: "Raises the user's Attack by 1.",
		id: "sharpen",
		name: "Sharpen",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"sheercold": {
		num: 329,
		accuracy: 30,
		basePower: 0,
		category: "Special",
		desc: "Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Ability Sturdy are immune.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "sheercold",
		name: "Sheer Cold",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		ohko: true,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	"shellsmash": {
		num: 504,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the user's Defense and Special Defense by 1 stage. Raises the user's Attack, Special Attack, and Speed by 2 stages.",
		shortDesc: "Lowers Def, SpD by 1; raises Atk, SpA, Spe by 2.",
		id: "shellsmash",
		isViable: true,
		name: "Shell Smash",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: -1,
			spd: -1,
			atk: 2,
			spa: 2,
			spe: 2,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	"shiftgear": {
		num: 508,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages and its Attack by 1 stage.",
		shortDesc: "Raises the user's Speed by 2 and Attack by 1.",
		id: "shiftgear",
		isViable: true,
		name: "Shift Gear",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spe: 2,
			atk: 1,
		},
		secondary: false,
		target: "self",
		type: "Steel",
		contestType: "Clever",
	},
	"shockwave": {
		num: 351,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "shockwave",
		name: "Shock Wave",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"signalbeam": {
		num: 324,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "Has a 10% chance to confuse the target.",
		shortDesc: "10% chance to confuse the target.",
		id: "signalbeam",
		isViable: true,
		name: "Signal Beam",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Bug",
		contestType: "Beautiful",
	},
	"silverwind": {
		num: 318,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 10% chance to raise the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "10% chance to raise all stats by 1 (not acc/eva).",
		id: "silverwind",
		name: "Silver Wind",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
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
		type: "Bug",
		contestType: "Beautiful",
	},
	"simplebeam": {
		num: 493,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target's Ability to become Simple. Fails if the target's Ability is Multitype, Simple, Stance Change, or Truant.",
		shortDesc: "The target's Ability becomes Simple.",
		id: "simplebeam",
		name: "Simple Beam",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onTryHit: function (pokemon) {
			let bannedAbilities = {multitype:1, simple:1, stancechange:1, truant:1};
			if (bannedAbilities[pokemon.ability]) {
				return false;
			}
		},
		onHit: function (pokemon) {
			let oldAbility = pokemon.setAbility('simple');
			if (oldAbility) {
				this.add('-endability', pokemon, oldAbility, '[from] move: Simple Beam');
				this.add('-ability', pokemon, 'Simple', '[from] move: Simple Beam');
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"sing": {
		num: 47,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to fall asleep.",
		shortDesc: "Puts the target to sleep.",
		id: "sing",
		name: "Sing",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"sketch": {
		num: 166,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move is permanently replaced by the last move used by the target. The copied move has the maximum PP for that move. Fails if the target has not made a move, if the user has Transformed, or if the move is Chatter, Sketch, Struggle, or any move the user knows.",
		shortDesc: "Permanently copies the last move target used.",
		id: "sketch",
		name: "Sketch",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {authentic: 1},
		onHit: function (target, source) {
			let disallowedMoves = {chatter:1, sketch:1, struggle:1};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) >= 0) return false;
			let moveslot = source.moves.indexOf('sketch');
			if (moveslot < 0) return false;
			let move = Tools.getMove(target.lastMove);
			let sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
			};
			source.moveset[moveslot] = sketchedMove;
			source.baseMoveset[moveslot] = sketchedMove;
			source.moves[moveslot] = toId(move.name);
			this.add('-activate', source, 'move: Sketch', move.name);
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"skillswap": {
		num: 285,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps its Ability with the target's Ability. Fails if either the user or the target's Ability is Illusion, Multitype, Stance Change, or Wonder Guard, but does not fail if both have the same Ability.",
		shortDesc: "The user and the target trade Abilities.",
		id: "skillswap",
		name: "Skill Swap",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
		onTryHit: function (target, source) {
			let bannedAbilities = {illusion:1, multitype:1, stancechange:1, wonderguard:1};
			if (bannedAbilities[target.ability] || bannedAbilities[source.ability]) {
				return false;
			}
		},
		onHit: function (target, source, move) {
			let targetAbility = this.getAbility(target.ability);
			let sourceAbility = this.getAbility(source.ability);
			this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, '[of] ' + target);
			source.battle.singleEvent('End', sourceAbility, source.abilityData, source);
			target.battle.singleEvent('End', targetAbility, target.abilityData, target);
			if (targetAbility.id !== sourceAbility.id) {
				source.ability = targetAbility.id;
				target.ability = sourceAbility.id;
				source.abilityData = {id: source.ability.id, target: source};
				target.abilityData = {id: target.ability.id, target: target};
			}
			source.battle.singleEvent('Start', targetAbility, source.abilityData, source);
			target.battle.singleEvent('Start', sourceAbility, target.abilityData, target);
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"skullbash": {
		num: 130,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		desc: "This attack charges on the first turn and executes on the second. Raises the user's Defense by 1 stage on the first turn. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Raises user's Defense by 1 on turn 1. Hits turn 2.",
		id: "skullbash",
		name: "Skull Bash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			this.boost({def:1}, attacker, attacker, this.getMove('skullbash'));
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				attacker.removeVolatile(move.id);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"skyattack": {
		num: 143,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target and a higher chance for a critical hit. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges, then hits turn 2. 30% flinch. High crit.",
		id: "skyattack",
		name: "Sky Attack",
		pp: 5,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1, distance: 1},
		critRatio: 2,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"skydrop": {
		num: 507,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "This attack takes the target into the air with the user on the first turn and executes on the second. Pokemon weighing 200kg or more cannot be lifted. On the first turn, the user and the target avoid all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder, and Twister. The user and the target cannot make a move between turns, but the target can select a move to use. This move cannot damage Flying-type Pokemon. Fails on the first turn if the target is an ally or if the target has a substitute.",
		shortDesc: "User and foe fly up turn 1. Damages on turn 2.",
		id: "skydrop",
		name: "Sky Drop",
		pp: 10,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1},
		onModifyMove: function (move, source) {
			if (!source.volatiles['skydrop']) {
				move.accuracy = true;
			}
		},
		onMoveFail: function (target, source) {
			if (source.volatiles['twoturnmove'] && source.volatiles['twoturnmove'].duration === 1) {
				source.removeVolatile('skydrop');
				source.removeVolatile('twoturnmove');
				this.add('-end', target, 'Sky Drop', '[interrupt]');
			}
		},
		onTryHit: function (target, source, move) {
			if (target.fainted) return false;
			if (source.removeVolatile(move.id)) {
				if (target !== source.volatiles['twoturnmove'].source) return false;

				if (target.hasType('Flying')) {
					this.add('-immune', target, '[msg]');
					this.add('-end', target, 'Sky Drop');
					return null;
				}
			} else {
				if (target.volatiles['substitute'] || target.side === source.side) {
					return false;
				}
				if (target.getWeight() >= 200) {
					this.add('-fail', target, 'move: Sky Drop', '[heavy]');
					return null;
				}

				this.add('-prepare', source, move.name, target);
				source.addVolatile('twoturnmove', target);
				return null;
			}
		},
		onHit: function (target, source) {
			this.add('-end', target, 'Sky Drop');
		},
		effect: {
			duration: 2,
			onStart: function () {
				this.effectData.source.removeVolatile('followme');
				this.effectData.source.removeVolatile('ragepowder');
			},
			onAnyDragOut: function (pokemon) {
				if (pokemon === this.effectData.target || pokemon === this.effectData.source) return false;
			},
			onFoeTrapPokemonPriority: -15,
			onFoeTrapPokemon: function (defender) {
				if (defender !== this.effectData.source) return;
				defender.trapped = true;
			},
			onFoeBeforeMovePriority: 12,
			onFoeBeforeMove: function (attacker, defender, move) {
				if (attacker === this.effectData.source) {
					this.debug('Sky drop nullifying.');
					return null;
				}
			},
			onRedirectTargetPriority: 99,
			onRedirectTarget: function (target, source, source2) {
				if (source !== this.effectData.target) return;
				if (this.effectData.source.fainted) return;
				return this.effectData.source;
			},
			onAnyAccuracy: function (accuracy, target, source, move) {
				if (target !== this.effectData.target && target !== this.effectData.source) {
					return;
				}
				if (source === this.effectData.target && target === this.effectData.source) {
					return;
				}
				if (move.id === 'gust' || move.id === 'twister') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'thousandarrows' || move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onAnyBasePower: function (basePower, target, source, move) {
				if (target !== this.effectData.target && target !== this.effectData.source) {
					return;
				}
				if (source === this.effectData.target && target === this.effectData.source) {
					return;
				}
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			},
			onFaint: function (target) {
				if (target.volatiles['skydrop'] && target.volatiles['twoturnmove'].source) {
					this.add('-end', target.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
				}
			},
		},
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Tough",
	},
	"skyuppercut": {
		num: 327,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "This move can hit a target using Bounce, Fly, or Sky Drop.",
		shortDesc: "Can hit Pokemon using Bounce, Fly, or Sky Drop.",
		id: "skyuppercut",
		name: "Sky Uppercut",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"slackoff": {
		num: 303,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "slackoff",
		isViable: true,
		name: "Slack Off",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"slam": {
		num: 21,
		accuracy: 75,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "slam",
		name: "Slam",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"slash": {
		num: 163,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "slash",
		name: "Slash",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"sleeppowder": {
		num: 79,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to fall asleep.",
		shortDesc: "Puts the target to sleep.",
		id: "sleeppowder",
		isViable: true,
		name: "Sleep Powder",
		pp: 15,
		priority: 0,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"sleeptalk": {
		num: 214,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "One of the user's known moves, besides this move, is selected for use at random. Fails if the user is not asleep. The selected move does not have PP deducted from it, and can currently have 0 PP. This move cannot select Assist, Belch, Bide, Chatter, Copycat, Focus Punch, Hold Hands, Me First, Metronome, Mimic, Mirror Move, Nature Power, Sketch, Sleep Talk, Struggle, Uproar, or any two-turn move.",
		shortDesc: "User must be asleep. Uses another known move.",
		id: "sleeptalk",
		isViable: true,
		name: "Sleep Talk",
		pp: 10,
		priority: 0,
		flags: {},
		sleepUsable: true,
		onTryHit: function (pokemon) {
			if (pokemon.status !== 'slp') return false;
		},
		onHit: function (pokemon) {
			let moves = [];
			for (let i = 0; i < pokemon.moveset.length; i++) {
				let move = pokemon.moveset[i].id;
				let NoSleepTalk = {
					assist:1, belch:1, bide:1, chatter:1, copycat:1, focuspunch:1, mefirst:1, metronome:1, mimic:1, mirrormove:1, naturepower:1, sketch:1, sleeptalk:1, uproar:1,
				};
				if (move && !(NoSleepTalk[move] || this.getMove(move).flags['charge'])) {
					moves.push(move);
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = moves[this.random(moves.length)];
			if (!randomMove) {
				return false;
			}
			this.useMove(randomMove, pokemon);
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"sludge": {
		num: 124,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 30% chance to poison the target.",
		shortDesc: "30% chance to poison the target.",
		id: "sludge",
		name: "Sludge",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	"sludgebomb": {
		num: 188,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 30% chance to poison the target.",
		shortDesc: "30% chance to poison the target.",
		id: "sludgebomb",
		isViable: true,
		name: "Sludge Bomb",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	"sludgewave": {
		num: 482,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 10% chance to poison the target.",
		shortDesc: "10% chance to poison adjacent Pokemon.",
		id: "sludgewave",
		isViable: true,
		name: "Sludge Wave",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'psn',
		},
		target: "allAdjacent",
		type: "Poison",
		contestType: "Tough",
	},
	"smackdown": {
		num: 479,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "This move can hit a target using Bounce, Fly, or Sky Drop. If this move hits a target under the effect of Bounce, Fly, Magnet Rise, or Telekinesis, the effect ends. If the target is a Flying type that has not used Roost this turn or a Pokemon with the Ability Levitate, it loses its immunity to Ground-type attacks and the Ability Arena Trap as long as it remains active. During the effect, Magnet Rise fails for the target and Telekinesis fails against the target.",
		shortDesc: "Removes the target's Ground immunity.",
		id: "smackdown",
		name: "Smack Down",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		volatileStatus: 'smackdown',
		effect: {
			noCopy: true,
			onStart: function (pokemon) {
				let applies = false;
				if (pokemon.hasType('Flying') || pokemon.hasAbility('levitate')) applies = true;
				if (pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] || this.getPseudoWeather('gravity')) applies = false;
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					applies = true;
					this.cancelMove(pokemon);
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
			onRestart: function (pokemon) {
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					this.cancelMove(pokemon);
					this.add('-start', pokemon, 'Smack Down');
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
		},
		secondary: false,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	"smellingsalts": {
		num: 265,
		accuracy: 100,
		basePower: 70,
		basePowerCallback: function (pokemon, target, move) {
			if (target.status === 'par') return move.basePower * 2;
			return move.basePower;
		},
		category: "Physical",
		desc: "Power doubles if the target is paralyzed. If the user has not fainted, the target is cured of paralysis.",
		shortDesc: "Power doubles if target is paralyzed, and cures it.",
		id: "smellingsalts",
		name: "Smelling Salts",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit: function (target) {
			if (target.status === 'par') target.cureStatus();
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"smog": {
		num: 123,
		accuracy: 70,
		basePower: 30,
		category: "Special",
		desc: "Has a 40% chance to poison the target.",
		shortDesc: "40% chance to poison the target.",
		id: "smog",
		name: "Smog",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 40,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	"smokescreen": {
		num: 108,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's accuracy by 1 stage.",
		shortDesc: "Lowers the target's accuracy by 1.",
		id: "smokescreen",
		name: "Smokescreen",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			accuracy: -1,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"snarl": {
		num: 555,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Special Attack by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Sp. Atk by 1.",
		id: "snarl",
		name: "Snarl",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Dark",
		contestType: "Tough",
	},
	"snatch": {
		num: 289,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If another Pokemon uses one of the following moves this turn, the user steals that move to use itself. If multiple Pokemon use this move in the same turn, the applicable moves will be stolen in turn order; a move cannot be stolen multiple times. Aqua Ring, Aromatherapy, Autotomize, Belly Drum, Camouflage, Charge, Conversion, Cosmic Power, Cotton Guard, Heal Bell, Healing Wish, Imprison, Ingrain, Light Screen, Lucky Chant, Lunar Dance, Magnet Rise, Mist, Power Trick, Quick Guard, Recycle, Reflect, Refresh, Safeguard, Stockpile, Substitute, Swallow, Tailwind, Wide Guard, Wish, and any move that has a primary effect of raising the user's stats or healing the user.",
		shortDesc: "User steals certain support moves to use itself.",
		id: "snatch",
		name: "Snatch",
		pp: 10,
		priority: 4,
		flags: {authentic: 1},
		volatileStatus: 'snatch',
		effect: {
			duration: 1,
			onStart: function (pokemon) {
				this.add('-singleturn', pokemon, 'Snatch');
			},
			onAnyTryMove: function (source, target, move) {
				if (move && move.flags['snatch'] && move.sourceEffect !== 'snatch') {
					let snatchUser = this.effectData.source;
					snatchUser.removeVolatile('snatch');
					this.add('-activate', snatchUser, 'Snatch', '[of] ' + source);
					this.useMove(move.id, snatchUser);
					return null;
				}
			},
		},
		secondary: false,
		pressureTarget: "foeSide",
		target: "self",
		type: "Dark",
		contestType: "Clever",
	},
	"snore": {
		num: 173,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Has a 30% chance to flinch the target. Fails if the user is not asleep.",
		shortDesc: "User must be asleep. 30% chance to flinch target.",
		id: "snore",
		name: "Snore",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		sleepUsable: true,
		onTryHit: function (target, source) {
			if (source.status !== 'slp') return false;
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"spikyshield": {
		num: 596,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user lose 1/8 of their maximum HP, rounded down. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		shortDesc: "Protects from moves. Contact: loses 1/8 max HP.",
		id: "spikyshield",
		isViable: true,
		name: "Spiky Shield",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'spikyshield',
		onTryHit: function (target, source, move) {
			return !!this.willAct() && this.runEvent('StallMove', target);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact']) {
					this.damage(source.maxhp / 8, source, target);
				}
				return null;
			},
		},
		secondary: false,
		target: "self",
		type: "Grass",
		contestType: "Tough",
	},
	"soak": {
		num: 487,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to become a Water type. Fails if the target is an Arceus.",
		shortDesc: "Changes the target's type to Water.",
		id: "soak",
		name: "Soak",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onHit: function (target) {
			if (!target.setType('Water')) return false;
			this.add('-start', target, 'typechange', 'Water');
		},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Cute",
	},
	"softboiled": {
		num: 135,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "softboiled",
		isViable: true,
		name: "Soft-Boiled",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"solarbeam": {
		num: 76,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "This attack charges on the first turn and executes on the second. Power is halved if the weather is Hail, Rain Dance, or Sandstorm. If the user is holding a Power Herb or the weather is Sunny Day, the move completes in one turn.",
		shortDesc: "Charges turn 1. Hits turn 2. No charge in sunlight.",
		id: "solarbeam",
		name: "Solar Beam",
		pp: 10,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (this.isWeather(['sunnyday', 'desolateland']) || !this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon, target) {
			if (this.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	"sonicboom": {
		num: 49,
		accuracy: 90,
		basePower: 0,
		damage: 20,
		category: "Special",
		desc: "Deals 20 HP of damage to the target.",
		shortDesc: "Always does 20 HP of damage.",
		id: "sonicboom",
		name: "Sonic Boom",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"spacialrend": {
		num: 460,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "spacialrend",
		isViable: true,
		name: "Spacial Rend",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Dragon",
		contestType: "Beautiful",
	},
	"spark": {
		num: 209,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		id: "spark",
		name: "Spark",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"spiderweb": {
		num: 169,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.",
		shortDesc: "The target cannot switch out.",
		id: "spiderweb",
		name: "Spider Web",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onHit: function (target, source, move) {
			if (!target.addVolatile('trapped', source, move, 'trapper')) {
				this.add('-fail', target);
			}
		},
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	"spikecannon": {
		num: 131,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "spikecannon",
		name: "Spike Cannon",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"spikes": {
		num: 191,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in, unless it is a Flying-type Pokemon or has the Ability Levitate. Can be used up to three times before failing. Foes lose 1/8 of their maximum HP with one layer, 1/6 of their maximum HP with two layers, and 1/4 of their maximum HP with three layers, all rounded down. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, or is hit by Defog.",
		shortDesc: "Hurts grounded foes on switch-in. Max 3 layers.",
		id: "spikes",
		isViable: true,
		name: "Spikes",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, nonsky: 1},
		sideCondition: 'spikes',
		effect: {
			// this is a side condition
			onStart: function (side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function (side) {
				if (this.effectData.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers++;
			},
			onSwitchIn: function (pokemon) {
				if (!pokemon.isGrounded()) return;
				let damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectData.layers] * pokemon.maxhp / 24);
			},
		},
		secondary: false,
		target: "foeSide",
		type: "Ground",
		contestType: "Clever",
	},
	"spitup": {
		num: 255,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon) {
			if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) return false;
			return pokemon.volatiles['stockpile'].layers * 100;
		},
		category: "Special",
		desc: "Power is equal to 100 times the user's Stockpile count. Fails if the user's Stockpile count is 0. Whether or not this move is successful, the user's Defense and Special Defense decrease by as many stages as Stockpile had increased them, and the user's Stockpile count resets to 0.",
		shortDesc: "More power with more uses of Stockpile.",
		id: "spitup",
		name: "Spit Up",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onTry: function (pokemon) {
			if (!pokemon.volatiles['stockpile']) {
				return false;
			}
		},
		onAfterMove: function (pokemon) {
			pokemon.removeVolatile('stockpile');
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"spite": {
		num: 180,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target's last move used to lose 4 PP. Fails if the target has not made a move, if the move has 0 PP, or if it no longer knows the move.",
		shortDesc: "Lowers the PP of the target's last move by 4.",
		id: "spite",
		name: "Spite",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		onHit: function (target) {
			if (target.deductPP(target.lastMove, 4)) {
				this.add("-activate", target, 'move: Spite', this.getMove(target.lastMove).name, 4);
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Tough",
	},
	"splash": {
		num: 150,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Nothing happens...",
		shortDesc: "Does nothing (but we still love it).",
		id: "splash",
		name: "Splash",
		pp: 40,
		priority: 0,
		flags: {gravity: 1},
		onTryHit: function (target, source) {
			this.add('-nothing');
			return null;
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"spore": {
		num: 147,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to fall asleep.",
		shortDesc: "Puts the target to sleep.",
		id: "spore",
		isViable: true,
		name: "Spore",
		pp: 15,
		priority: 0,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	"stealthrock": {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in. Can be used only once before failing. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Rock type; 0.25x, 0.5x, neutral, 2x, or 4x, respectively. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, or is hit by Defog.",
		shortDesc: "Hurts foes on switch-in. Factors Rock weakness.",
		id: "stealthrock",
		isViable: true,
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1},
		sideCondition: 'stealthrock',
		effect: {
			// this is a side condition
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn: function (pokemon) {
				let typeMod = this.clampIntRange(pokemon.runEffectiveness('Rock'), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
		secondary: false,
		target: "foeSide",
		type: "Rock",
		contestType: "Cool",
	},
	"steameruption": {
		num: 592,
		accuracy: 95,
		basePower: 110,
		category: "Special",
		desc: "Has a 30% chance to burn the target. The target thaws out if it is frozen.",
		shortDesc: "30% chance to burn the target.",
		id: "steameruption",
		isViable: true,
		name: "Steam Eruption",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		thawsTarget: true,
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	"steelwing": {
		num: 211,
		accuracy: 90,
		basePower: 70,
		category: "Physical",
		desc: "Has a 10% chance to raise the user's Defense by 1 stage.",
		shortDesc: "10% chance to raise the user's Defense by 1.",
		id: "steelwing",
		name: "Steel Wing",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	"stickyweb": {
		num: 564,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the foe's side of the field, lowering the Speed by 1 stage of each foe that switches in, unless it is a Flying-type Pokemon or has the Ability Levitate. Can be used only once before failing. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, or is hit by Defog.",
		shortDesc: "Lowers Speed of grounded foes by 1 on switch-in.",
		id: "stickyweb",
		isViable: true,
		name: "Sticky Web",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1},
		sideCondition: 'stickyweb',
		effect: {
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn: function (pokemon) {
				if (!pokemon.isGrounded()) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.getMove('stickyweb'));
			},
		},
		secondary: false,
		target: "foeSide",
		type: "Bug",
		contestType: "Tough",
	},
	"stockpile": {
		num: 254,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense and Special Defense by 1 stage. The user's Stockpile count increases by 1. Fails if the user's Stockpile count is 3.",
		shortDesc: "Raises user's Defense, Sp. Def by 1. Max 3 uses.",
		id: "stockpile",
		name: "Stockpile",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		onTryHit: function (pokemon) {
			if (pokemon.volatiles['stockpile'] && pokemon.volatiles['stockpile'].layers >= 3) return false;
		},
		volatileStatus: 'stockpile',
		effect: {
			noCopy: true,
			onStart: function (target) {
				this.effectData.layers = 1;
				this.add('-start', target, 'stockpile' + this.effectData.layers);
				this.boost({def:1, spd:1}, target, target, this.getMove('stockpile'));
			},
			onRestart: function (target) {
				if (this.effectData.layers >= 3) return false;
				this.effectData.layers++;
				this.add('-start', target, 'stockpile' + this.effectData.layers);
				this.boost({def:1, spd:1}, target, target, this.getMove('stockpile'));
			},
			onEnd: function (target) {
				let layers = this.effectData.layers * -1;
				this.effectData.layers = 0;
				this.boost({def:layers, spd:layers}, target, target, this.getMove('stockpile'));
				this.add('-end', target, 'Stockpile');
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	"stomp": {
		num: 23,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "30% chance to flinch the target.",
		id: "stomp",
		name: "Stomp",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"stoneedge": {
		num: 444,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "stoneedge",
		isViable: true,
		name: "Stone Edge",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	"storedpower": {
		num: 500,
		accuracy: 100,
		basePower: 20,
		basePowerCallback: function (pokemon, target, move) {
			return move.basePower + 20 * pokemon.positiveBoosts();
		},
		category: "Special",
		desc: "Power is equal to 20+(X*20), where X is the user's total stat stage changes that are greater than 0.",
		shortDesc: " + 20 power for each of the user's stat boosts.",
		id: "storedpower",
		name: "Stored Power",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"stormthrow": {
		num: 480,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Abilities Battle Armor or Shell Armor.",
		shortDesc: "Always results in a critical hit.",
		id: "stormthrow",
		isViable: true,
		name: "Storm Throw",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"steamroller": {
		num: 537,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "30% chance to flinch the target.",
		id: "steamroller",
		name: "Steamroller",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Bug",
		contestType: "Tough",
	},
	"strength": {
		num: 70,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "strength",
		name: "Strength",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"stringshot": {
		num: 81,
		accuracy: 95,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Speed by 2 stages.",
		shortDesc: "Lowers the foe(s) Speed by 2.",
		id: "stringshot",
		name: "String Shot",
		pp: 40,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			spe: -2,
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Bug",
		contestType: "Clever",
	},
	"struggle": {
		num: 165,
		accuracy: true,
		basePower: 50,
		category: "Physical",
		desc: "Deals typeless damage to one adjacent foe at random. If this move was successful, the user loses 1/4 of its maximum HP, rounded half up; the Ability Rock Head does not prevent this. This move can only be used if none of the user's known moves can be selected.",
		shortDesc: "User loses 25% of its max HP as recoil.",
		id: "struggle",
		name: "Struggle",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {contact: 1, protect: 1},
		noSketch: true,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Struggle');
		},
		self: {
			onHit: function (source) {
				this.directDamage(source.maxhp / 4, source, source, {id: 'strugglerecoil'});
			},
		},
		secondary: false,
		target: "randomNormal",
		type: "Normal",
		contestType: "Tough",
	},
	"strugglebug": {
		num: 522,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Special Attack by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Sp. Atk by 1.",
		id: "strugglebug",
		name: "Struggle Bug",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Bug",
		contestType: "Cute",
	},
	"stunspore": {
		num: 78,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes the target.",
		shortDesc: "Paralyzes the target.",
		id: "stunspore",
		name: "Stun Spore",
		pp: 30,
		priority: 0,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
		status: 'par',
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"submission": {
		num: 66,
		accuracy: 80,
		basePower: 80,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 1/4 recoil.",
		id: "submission",
		name: "Submission",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [1, 4],
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"substitute": {
		num: 164,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in battle. The substitute is removed once enough damage is inflicted on it, or if the user switches out or faints. Baton Pass can be used to transfer the substitute to an ally, and the substitute will keep its remaining HP. Until the substitute is broken, it receives damage from all attacks made by other Pokemon and shields the user from status effects and stat stage changes caused by other Pokemon. Sound-based moves and Pokemon with the Ability Infiltrator ignore substitutes. The user still takes normal damage from weather and status effects while behind its substitute. If the substitute breaks during a multi-hit attack, the user will take damage from any remaining hits. If a substitute is created while the user is partially trapped, the partial-trapping effect ends immediately. This move fails if the user does not have enough HP remaining to create a substitute, or if it already has a substitute.",
		shortDesc: "User takes 1/4 its max HP to put in a Substitute.",
		id: "substitute",
		isViable: true,
		name: "Substitute",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, nonsky: 1},
		volatileStatus: 'Substitute',
		onTryHit: function (target) {
			if (target.volatiles['substitute']) {
				this.add('-fail', target, 'move: Substitute');
				return null;
			}
			if (target.hp <= target.maxhp / 4 || target.maxhp === 1) { // Shedinja clause
				this.add('-fail', target, 'move: Substitute', '[weak]');
				return null;
			}
		},
		onHit: function (target) {
			this.directDamage(target.maxhp / 4);
		},
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'Substitute');
				this.effectData.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit: function (target, source, move) {
				if (target === source || move.flags['authentic'] || move.infiltrates) {
					return;
				}
				let damage = this.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', target);
					return null;
				}
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) {
					return damage;
				}
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				if (move.recoil) {
					this.damage(this.calcRecoilDamage(damage, move), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return 0; // hit
			},
			onEnd: function (target) {
				this.add('-end', target, 'Substitute');
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"suckerpunch": {
		num: 389,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Fails if the target did not select a physical attack, special attack, or Me First for use this turn, or if the target moves before the user.",
		shortDesc: "Usually goes first. Fails if target is not attacking.",
		id: "suckerpunch",
		isViable: true,
		name: "Sucker Punch",
		pp: 5,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTry: function (source, target) {
			let decision = this.willMove(target);
			if (!decision || decision.choice !== 'move' || (decision.move.category === 'Status' && decision.move.id !== 'mefirst') || target.volatiles.mustrecharge) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return null;
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"sunnyday": {
		num: 241,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Sunny Day. The damage of Fire-type attacks is multiplied by 1.5 and the damage of Water-type attacks is multiplied by 0.5 during the effect. Lasts for 8 turns if the user is holding Heat Rock. Fails if the current weather is Sunny Day.",
		shortDesc: "For 5 turns, intense sunlight powers Fire moves.",
		id: "sunnyday",
		name: "Sunny Day",
		pp: 5,
		priority: 0,
		flags: {},
		weather: 'sunnyday',
		secondary: false,
		target: "all",
		type: "Fire",
		contestType: "Beautiful",
	},
	"superfang": {
		num: 162,
		accuracy: 90,
		basePower: 0,
		damageCallback: function (pokemon, target) {
			return this.clampIntRange(Math.floor(target.hp / 2), 1);
		},
		category: "Physical",
		desc: "Deals damage to the target equal to half of its current HP, rounded down, but not less than 1 HP.",
		shortDesc: "Does damage equal to 1/2 target's current HP.",
		id: "superfang",
		isViable: true,
		name: "Super Fang",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"superpower": {
		num: 276,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Lowers the user's Attack and Defense by 1 stage.",
		shortDesc: "Lowers the user's Attack and Defense by 1.",
		id: "superpower",
		isViable: true,
		name: "Superpower",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			boosts: {
				atk: -1,
				def: -1,
			},
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"supersonic": {
		num: 48,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to become confused.",
		shortDesc: "Confuses the target.",
		id: "supersonic",
		name: "Supersonic",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"surf": {
		num: 57,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Damage doubles if the target is using Dive.",
		shortDesc: "Hits adjacent Pokemon. Power doubles on Dive.",
		id: "surf",
		isViable: true,
		name: "Surf",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "allAdjacent",
		type: "Water",
		contestType: "Beautiful",
	},
	"swagger": {
		num: 207,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Raises the target's Attack by 2 stages and confuses it.",
		shortDesc: "Raises the target's Attack by 2 and confuses it.",
		id: "swagger",
		name: "Swagger",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		volatileStatus: 'confusion',
		boosts: {
			atk: 2,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"swallow": {
		num: 256,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores its HP based on its Stockpile count. Restores 1/4 of its maximum HP if it's 1, 1/2 of its maximum HP if it's 2, both rounded half down, and all of its HP if it's 3. Fails if the user's Stockpile count is 0. The user's Defense and Special Defense decrease by as many stages as Stockpile had increased them, and the user's Stockpile count resets to 0.",
		shortDesc: "Heals the user based on uses of Stockpile.",
		id: "swallow",
		name: "Swallow",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onTryHit: function (pokemon) {
			if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) return false;
		},
		onHit: function (pokemon) {
			let healAmount = [0.25, 0.5, 1];
			this.heal(this.modify(pokemon.maxhp, healAmount[(pokemon.volatiles['stockpile'].layers - 1)]));
			pokemon.removeVolatile('stockpile');
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	"sweetkiss": {
		num: 186,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to become confused.",
		shortDesc: "Confuses the target.",
		id: "sweetkiss",
		name: "Sweet Kiss",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Fairy",
		contestType: "Cute",
	},
	"sweetscent": {
		num: 230,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's evasiveness by 2 stages.",
		shortDesc: "Lowers the foe(s) evasion by 2.",
		id: "sweetscent",
		name: "Sweet Scent",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			evasion: -2,
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cute",
	},
	"swift": {
		num: 129,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy. Hits foes.",
		id: "swift",
		name: "Swift",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
	},
	"switcheroo": {
		num: 415,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user swaps its held item with the target's held item. Fails if either the user or the target is holding a Mail, if neither is holding an item, if the user is trying to give or take a Mega Stone to or from the species that can Mega Evolve with it, or if the user is trying to give or take a Blue Orb, a Red Orb, a Griseous Orb, a Plate, or a Drive to or from a Kyogre, a Groudon, a Giratina, an Arceus, or a Genesect, respectively. Pokemon with the Ability Sticky Hold are immune.",
		shortDesc: "User switches its held item with the target's.",
		id: "switcheroo",
		isViable: true,
		name: "Switcheroo",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit: function (target) {
			if (target.hasAbility('stickyhold')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		onHit: function (target, source) {
			let yourItem = target.takeItem(source);
			let myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem) ||
					(myItem.onTakeItem && myItem.onTakeItem(myItem, target) === false)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', '[of] ' + target);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] Trick');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] Trick');
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"swordsdance": {
		num: 14,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 2 stages.",
		shortDesc: "Raises the user's Attack by 2.",
		id: "swordsdance",
		isViable: true,
		name: "Swords Dance",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 2,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Beautiful",
	},
	"synchronoise": {
		num: 485,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "The target is immune if it does not share a type with the user.",
		shortDesc: "Hits adjacent Pokemon sharing the user's type.",
		id: "synchronoise",
		name: "Synchronoise",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit: function (target, source) {
			return target.hasType(source.getTypes());
		},
		secondary: false,
		target: "allAdjacent",
		type: "Psychic",
		contestType: "Clever",
	},
	"synthesis": {
		num: 235,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP if no weather conditions are in effect, 2/3 of its maximum HP if the weather is Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Rain Dance, or Sandstorm, all rounded half down.",
		shortDesc: "Heals the user by a weather-dependent amount.",
		id: "synthesis",
		isViable: true,
		name: "Synthesis",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onHit: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				this.heal(this.modify(pokemon.maxhp, 0.667));
			} else if (this.isWeather(['raindance', 'primordialsea', 'sandstorm', 'hail'])) {
				this.heal(this.modify(pokemon.maxhp, 0.25));
			} else {
				this.heal(this.modify(pokemon.maxhp, 0.5));
			}
		},
		secondary: false,
		target: "self",
		type: "Grass",
		contestType: "Clever",
	},
	"tackle": {
		num: 33,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "tackle",
		name: "Tackle",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"tailglow": {
		num: 294,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack by 3 stages.",
		shortDesc: "Raises the user's Sp. Atk by 3.",
		id: "tailglow",
		isViable: true,
		name: "Tail Glow",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spa: 3,
		},
		secondary: false,
		target: "self",
		type: "Bug",
		contestType: "Beautiful",
	},
	"tailslap": {
		num: 541,
		accuracy: 85,
		basePower: 25,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "tailslap",
		isViable: true,
		name: "Tail Slap",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"tailwhip": {
		num: 39,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Defense by 1 stage.",
		shortDesc: "Lowers the foe(s) Defense by 1.",
		id: "tailwhip",
		name: "Tail Whip",
		pp: 30,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			def: -1,
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cute",
	},
	"tailwind": {
		num: 366,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 4 turns, the user and its party members have their Speed doubled. Fails if this move is already in effect for the user's side.",
		shortDesc: "For 4 turns, allies' Speed is doubled.",
		id: "tailwind",
		isViable: true,
		name: "Tailwind",
		pp: 15,
		priority: 0,
		flags: {snatch: 1},
		sideCondition: 'tailwind',
		effect: {
			duration: 4,
			durationCallback: function (target, source, effect) {
				if (source && source.hasAbility('persistent')) {
					return 6;
				}
				return 4;
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Tailwind');
			},
			onModifySpe: function (spe, pokemon) {
				return this.chainModify(2);
			},
			onResidualOrder: 21,
			onResidualSubOrder: 4,
			onEnd: function (side) {
				this.add('-sideend', side, 'move: Tailwind');
			},
		},
		secondary: false,
		target: "allySide",
		type: "Flying",
		contestType: "Cool",
	},
	"takedown": {
		num: 36,
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 1/4 recoil.",
		id: "takedown",
		name: "Take Down",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [1, 4],
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"taunt": {
		num: 269,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from using non-damaging moves for its next three turns. Pokemon with the Ability Oblivious or protected by the Ability Aroma Veil are immune.",
		shortDesc: "For 3 turns, the target can't use status moves.",
		id: "taunt",
		isViable: true,
		name: "Taunt",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'taunt',
		effect: {
			duration: 3,
			onStart: function (target) {
				if (target.activeTurns && !this.willMove(target)) {
					this.effectData.duration++;
				}
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 12,
			onEnd: function (target) {
				this.add('-end', target, 'move: Taunt');
			},
			onDisableMove: function (pokemon) {
				let moves = pokemon.moveset;
				for (let i = 0; i < moves.length; i++) {
					if (this.getMove(moves[i].move).category === 'Status') {
						pokemon.disableMove(moves[i].id);
					}
				}
			},
			onBeforeMovePriority: 5,
			onBeforeMove: function (attacker, defender, move) {
				if (move.category === 'Status') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"technoblast": {
		num: 546,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "This move's type depends on the user's held Drive.",
		shortDesc: "Type varies based on the held Drive.",
		id: "technoblast",
		isViable: true,
		name: "Techno Blast",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move, pokemon) {
			move.type = this.runEvent('Drive', pokemon, null, 'technoblast', 'Normal');
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"teeterdance": {
		num: 298,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to become confused.",
		shortDesc: "Confuses adjacent Pokemon.",
		id: "teeterdance",
		name: "Teeter Dance",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'confusion',
		secondary: false,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Cute",
	},
	"telekinesis": {
		num: 477,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 3 turns, the target cannot avoid any attacks made against it, other than OHKO moves, as long as it remains active. During the effect, the target is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Ability Arena Trap as long as it remains active. If the target uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this move if the target is under any of their effects. Fails if the target is already under this effect or the effects of Ingrain, Smack Down, or Thousand Arrows.",
		shortDesc: "For 3 turns, target floats but moves can't miss it.",
		id: "telekinesis",
		name: "Telekinesis",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, gravity: 1},
		volatileStatus: 'telekinesis',
		effect: {
			duration: 3,
			onStart: function (target) {
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-start', target, 'Telekinesis');
			},
			onAccuracyPriority: -1,
			onAccuracy: function (accuracy, target, source, move) {
				if (move && !move.ohko) return true;
			},
			onImmunity: function (type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 16,
			onEnd: function (target) {
				this.add('-end', target, 'Telekinesis');
			},
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"teleport": {
		num: 100,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Fails when used.",
		shortDesc: "Flee from wild Pokemon battles.",
		id: "teleport",
		name: "Teleport",
		pp: 20,
		priority: 0,
		flags: {},
		onTryHit: false,
		secondary: false,
		target: "self",
		type: "Psychic",
		contestType: "Cool",
	},
	"thief": {
		num: 168,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "If this attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one. The target's item is not stolen if it is a Mail, or if the target is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, or a Pokemon that can Mega Evolve holding the Mega Stone for its species. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
		shortDesc: "If the user has no item, it steals the target's.",
		id: "thief",
		name: "Thief",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit: function (target, source) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			let yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Thief', '[of] ' + target);
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	"thousandarrows": {
		num: 614,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "This move can hit airborne Pokemon, which includes Flying-type Pokemon, Pokemon with the Ability Levitate, Pokemon holding an Air Balloon, and Pokemon under the effect of Magnet Rise or Telekinesis. If the target is a Flying type and is not already grounded, this move deals neutral damage regardless of its other type(s). This move can hit a target using Bounce, Fly, or Sky Drop. If this move hits a target under the effect of Bounce, Fly, Magnet Rise, or Telekinesis, the effect ends. If the target is a Flying type that has not used Roost this turn or a Pokemon with the Ability Levitate, it loses its immunity to Ground-type attacks and the Ability Arena Trap as long as it remains active. During the effect, Magnet Rise fails for the target and Telekinesis fails against the target.",
		shortDesc: "Grounds adjacent foes. First hit neutral on Flying.",
		id: "thousandarrows",
		isViable: true,
		name: "Thousand Arrows",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		isUnreleased: true,
		onEffectiveness: function (typeMod, type, move) {
			if (move.type !== 'Ground') return;
			let target = this.activeTarget;
			if (!target) return; // avoid crashing when called from a chat plugin
			// ignore effectiveness if the target is Flying type and immune to Ground
			if (!target.runImmunity('Ground')) {
				if (target.hasType('Flying')) return 0;
			}
		},
		volatileStatus: 'smackdown',
		ignoreImmunity: {'Ground': true},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Ground",
		contestType: "Beautiful",
	},
	"thousandwaves": {
		num: 615,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Prevents the target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.",
		shortDesc: "Hits adjacent foes. Prevents them from switching.",
		id: "thousandwaves",
		name: "Thousand Waves",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		isUnreleased: true,
		onHit: function (target, source, move) {
			if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Ground",
		contestType: "Tough",
	},
	"thrash": {
		num: 37,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent foe at random. The user spends two or three turns locked into this move and becomes confused after the last turn of the effect if it is not already. If the user is prevented from moving or the attack is not successful against the target on the first turn of the effect or the second turn of a three-turn effect, the effect ends without causing confusion. If this move is called by Sleep Talk, the move is used for one turn and does not confuse the user.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "thrash",
		name: "Thrash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove: function (pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		secondary: false,
		target: "randomNormal",
		type: "Normal",
		contestType: "Tough",
	},
	"thunder": {
		num: 87,
		accuracy: 70,
		basePower: 110,
		category: "Special",
		desc: "Has a 30% chance to paralyze the target. This move can hit a target using Bounce, Fly, or Sky Drop. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.",
		shortDesc: "30% chance to paralyze target. Can't miss in rain.",
		id: "thunder",
		isViable: true,
		name: "Thunder",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				move.accuracy = true;
			} else if (this.isWeather(['sunnyday', 'desolateland'])) {
				move.accuracy = 50;
			}
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"thunderfang": {
		num: 422,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		desc: "Has a 10% chance to paralyze the target and a 10% chance to flinch it.",
		shortDesc: "10% chance to paralyze. 10% chance to flinch.",
		id: "thunderfang",
		name: "Thunder Fang",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		secondaries: [
			{
				chance: 10,
				status: 'par',
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"thunderpunch": {
		num: 9,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		id: "thunderpunch",
		isViable: true,
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
	"thundershock": {
		num: 84,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		id: "thundershock",
		name: "Thunder Shock",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"thunderwave": {
		num: 86,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes the target.",
		shortDesc: "Paralyzes the target.",
		id: "thunderwave",
		isViable: true,
		name: "Thunder Wave",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'par',
		ignoreImmunity: false,
		secondary: false,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"thunderbolt": {
		num: 85,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		id: "thunderbolt",
		isViable: true,
		name: "Thunderbolt",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"tickle": {
		num: 321,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack and Defense by 1 stage.",
		shortDesc: "Lowers the target's Attack and Defense by 1.",
		id: "tickle",
		name: "Tickle",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		boosts: {
			atk: -1,
			def: -1,
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"topsyturvy": {
		num: 576,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The target's positive stat stages become negative and vice versa. Fails if all of the target's stat stages are 0.",
		shortDesc: "Inverts the target's stat stages.",
		id: "topsyturvy",
		name: "Topsy-Turvy",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onHit: function (target) {
			let success = false;
			for (let i in target.boosts) {
				if (target.boosts[i] === 0) continue;
				target.boosts[i] = -target.boosts[i];
				success = true;
			}
			if (!success) return false;
			this.add('-invertboost', target, '[from] move: Topsy-Turvy');
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	"torment": {
		num: 259,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from selecting the same move for use two turns in a row. This effect lasts until the target leaves the field.",
		shortDesc: "Target can't select the same move twice in a row.",
		id: "torment",
		name: "Torment",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'torment',
		effect: {
			noCopy: true,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Torment');
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Torment');
			},
			onDisableMove: function (pokemon) {
				if (pokemon.lastMove !== 'struggle') pokemon.disableMove(pokemon.lastMove);
			},
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	"toxic": {
		num: 92,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Badly poisons the target. If a Poison-type Pokemon uses this move, the target cannot avoid the attack, even if the target is in the middle of a two-turn move.",
		shortDesc: "Badly poisons the target.",
		id: "toxic",
		isViable: true,
		name: "Toxic",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		// No Guard-like effect for Poison-type users implemented in BattleScripts#tryMoveHit
		status: 'tox',
		secondary: false,
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	"toxicspikes": {
		num: 390,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the foe's side of the field, poisoning each foe that switches in, unless it is a Flying-type Pokemon or has the Ability Levitate. Can be used up to two times before failing. Foes become poisoned with one layer and badly poisoned with two layers. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, is hit by Defog, or a grounded Poison-type Pokemon switches in. Safeguard prevents the foe's party from being poisoned on switch-in, but a substitute does not.",
		shortDesc: "Poisons grounded foes on switch-in. Max 2 layers.",
		id: "toxicspikes",
		isViable: true,
		name: "Toxic Spikes",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, nonsky: 1},
		sideCondition: 'toxicspikes',
		effect: {
			// this is a side condition
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function (side) {
				if (this.effectData.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers++;
			},
			onSwitchIn: function (pokemon) {
				if (!pokemon.isGrounded()) return;
				if (!pokemon.runImmunity('Poison')) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (this.effectData.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
		secondary: false,
		target: "foeSide",
		type: "Poison",
		contestType: "Clever",
	},
	"transform": {
		num: 144,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user transforms into the target. The target's current stats, stat stages, types, moves, Ability, weight, gender, and sprite are copied. The user's level and HP remain the same and each copied move receives only 5 PP, with a maximum of 5 PP each. The user can no longer change formes if it would have the ability to do so. This move fails if the target has a substitute, if either the user or the target is already transformed, or if either is behind an Illusion.",
		shortDesc: "Copies target's stats, moves, types, and Ability.",
		id: "transform",
		name: "Transform",
		pp: 10,
		priority: 0,
		flags: {},
		onHit: function (target, pokemon) {
			if (!pokemon.transformInto(target, pokemon)) {
				return false;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"triattack": {
		num: 161,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to either burn, freeze, or paralyze the target.",
		shortDesc: "20% chance to paralyze or burn or freeze target.",
		id: "triattack",
		isViable: true,
		name: "Tri Attack",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			onHit: function (target, source) {
				let result = this.random(3);
				if (result === 0) {
					target.trySetStatus('brn', source);
				} else if (result === 1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('frz', source);
				}
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"trick": {
		num: 271,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user swaps its held item with the target's held item. Fails if either the user or the target is holding a Mail, if neither is holding an item, if the user is trying to give or take a Mega Stone to or from the species that can Mega Evolve with it, or if the user is trying to give or take a Blue Orb, a Red Orb, a Griseous Orb, a Plate, or a Drive to or from a Kyogre, a Groudon, a Giratina, an Arceus, or a Genesect, respectively. Pokemon with the Ability Sticky Hold are immune.",
		shortDesc: "User switches its held item with the target's.",
		id: "trick",
		isViable: true,
		name: "Trick",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryHit: function (target) {
			if (target.hasAbility('stickyhold')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		onHit: function (target, source) {
			let yourItem = target.takeItem(source);
			let myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem) ||
					(myItem.onTakeItem && myItem.onTakeItem(myItem, target) === false)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', '[of] ' + target);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Trick');
			} else {
				this.add('-enditem', target, yourItem, '[silent]');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Trick');
			} else {
				this.add('-enditem', source, myItem, '[silent]');
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"trickortreat": {
		num: 567,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the Ghost type to be added to the target, effectively making it have two or three types. Fails if the target is already a Ghost type. If Forest's Curse adds a type to the target, it replaces the type added by this move and vice versa.",
		shortDesc: "Adds Ghost to the target's type(s).",
		id: "trickortreat",
		name: "Trick-or-Treat",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onHit: function (target) {
			if (target.hasType('Ghost')) return false;
			if (!target.addType('Ghost')) return false;
			this.add('-start', target, 'typeadd', 'Ghost', '[from] move: Trick-or-Treat');

			if (target.side.active.length === 2 && target.position === 1) {
				// Curse Glitch
				const decision = this.willMove(target);
				if (decision && decision.move.id === 'curse') {
					decision.targetLoc = -1;
					decision.targetSide = target.side;
					decision.targetPosition = 0;
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Ghost",
		contestType: "Cute",
	},
	"trickroom": {
		num: 433,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, all active Pokemon with lower Speed will move before those with higher Speed, within their priority brackets. If this move is used during the effect, the effect ends.",
		shortDesc: "For 5 turns, slower Pokemon move first.",
		id: "trickroom",
		name: "Trick Room",
		pp: 5,
		priority: -7,
		flags: {mirror: 1},
		onHitField: function (target, source, effect) {
			if (this.pseudoWeather['trickroom']) {
				this.removePseudoWeather('trickroom', source, effect, '[of] ' + source);
			} else {
				this.addPseudoWeather('trickroom', source, effect, '[of] ' + source);
			}
		},
		effect: {
			duration: 5,
			durationCallback: function (source, effect) {
				if (source && source.hasAbility('persistent')) {
					return 7;
				}
				return 5;
			},
			onStart: function (target, source) {
				this.add('-fieldstart', 'move: Trick Room', '[of] ' + source);
			},
			// Speed modification is changed in BattlePokemon.getDecisionSpeed() in battle-engine.js
			onResidualOrder: 23,
			onEnd: function () {
				this.add('-fieldend', 'move: Trick Room');
			},
		},
		secondary: false,
		target: "all",
		type: "Psychic",
		contestType: "Clever",
	},
	"triplekick": {
		num: 167,
		accuracy: 90,
		basePower: 10,
		basePowerCallback: function (pokemon) {
			pokemon.addVolatile('triplekick');
			return 10 * pokemon.volatiles['triplekick'].hit;
		},
		category: "Physical",
		desc: "Hits three times. Power increases to 20 for the second hit and 30 for the third. This move checks accuracy for each hit, and the attack ends if the target avoids any of the hits. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit three times.",
		shortDesc: "Hits 3 times. Each hit can miss, but power rises.",
		id: "triplekick",
		name: "Triple Kick",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 3,
		multiaccuracy: true,
		effect: {
			duration: 1,
			onStart: function () {
				this.effectData.hit = 1;
			},
			onRestart: function () {
				this.effectData.hit++;
			},
		},
		onAfterMove: function (pokemon) {
			pokemon.removeVolatile('triplekick');
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"trumpcard": {
		num: 376,
		accuracy: true,
		basePower: 0,
		basePowerCallback: function (pokemon) {
			let move = pokemon.getMoveData(pokemon.lastMove); // Account for calling Trump Card via other moves
			switch (move.pp) {
			case 0:
				return 200;
			case 1:
				return 80;
			case 2:
				return 60;
			case 3:
				return 50;
			default:
				return 40;
			}
		},
		category: "Special",
		desc: "This move does not check accuracy. The power of this move is based on the amount of PP remaining after normal PP reduction and the Ability Pressure resolve. 200 power for 0 PP, 80 power for 1 PP, 60 power for 2 PP, 50 power for 3 PP, and 40 power for 4 or more PP.",
		shortDesc: "More power the fewer PP this move has left.",
		id: "trumpcard",
		name: "Trump Card",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	"twineedle": {
		num: 41,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Hits twice, with each hit having a 20% chance to poison the target. If the first hit breaks the target's substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times. Each hit has 20% chance to poison.",
		id: "twineedle",
		name: "Twineedle",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: [2, 2],
		secondary: {
			chance: 20,
			status: 'psn',
		},
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	"twister": {
		num: 239,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 20% chance to flinch the target. Damage doubles if the target is using Bounce, Fly, or Sky Drop.",
		shortDesc: "20% chance to flinch the foe(s).",
		id: "twister",
		name: "Twister",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "allAdjacentFoes",
		type: "Dragon",
		contestType: "Cool",
	},
	"uturn": {
		num: 369,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button.",
		shortDesc: "User switches out after damaging the target.",
		id: "uturn",
		isViable: true,
		name: "U-turn",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		selfSwitch: true,
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	"uproar": {
		num: 253,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent foe at random. The user spends three turns locked into this move. On the first of the three turns, all sleeping active Pokemon wake up. During the three turns, no active Pokemon can fall asleep by any means; Pokemon switched in during the effect do not wake up. If the user is prevented from moving or the attack is not successful against the target during one of the turns, the effect ends.",
		shortDesc: "Lasts 3 turns. Active Pokemon cannot fall asleep.",
		id: "uproar",
		name: "Uproar",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		self: {
			volatileStatus: 'uproar',
		},
		onTryHit: function (target) {
			for (let i = 0; i < target.side.active.length; i++) {
				let allyActive = target.side.active[i];
				if (allyActive && allyActive.status === 'slp') allyActive.cureStatus();
				let foeActive = target.side.foe.active[i];
				if (foeActive && foeActive.status === 'slp') foeActive.cureStatus();
			}
		},
		effect: {
			duration: 3,
			onStart: function (target) {
				this.add('-start', target, 'Uproar');
			},
			onResidual: function (target) {
				if (target.lastMove === 'struggle') {
					// don't lock
					delete target.volatiles['uproar'];
				}
				this.add('-start', target, 'Uproar', '[upkeep]');
			},
			onEnd: function (target) {
				this.add('-end', target, 'Uproar');
			},
			onLockMove: 'uproar',
			onAnySetStatus: function (status, pokemon) {
				if (status.id === 'slp') {
					if (pokemon === this.effectData.target) {
						this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
					} else {
						this.add('-fail', pokemon, 'slp', '[from] Uproar');
					}
					return null;
				}
			},
			onAnyTryHit: function (target, source, move) {
				if (move && move.id === 'yawn') {
					return false;
				}
			},
		},
		secondary: false,
		target: "randomNormal",
		type: "Normal",
		contestType: "Cute",
	},
	"vcreate": {
		num: 557,
		accuracy: 95,
		basePower: 180,
		category: "Physical",
		desc: "Lowers the user's Speed, Defense, and Special Defense by 1 stage.",
		shortDesc: "Lowers the user's Defense, Sp. Def, Speed by 1.",
		id: "vcreate",
		isViable: true,
		name: "V-create",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			boosts: {
				spe: -1,
				def: -1,
				spd: -1,
			},
		},
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	"vacuumwave": {
		num: 410,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "vacuumwave",
		name: "Vacuum Wave",
		pp: 30,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"venomdrench": {
		num: 599,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack, Special Attack, and Speed by 1 stage if the target is poisoned. Fails if the target is not poisoned.",
		shortDesc: "Lowers Atk, Sp. Atk, Speed of poisoned foes by 1.",
		id: "venomdrench",
		name: "Venom Drench",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onHit: function (target, source, move) {
			if (target.status === 'psn' || target.status === 'tox') {
				return this.boost({atk:-1, spa:-1, spe:-1}, target, source, move);
			}
			return false;
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Poison",
		contestType: "Clever",
	},
	"venoshock": {
		num: 474,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Power doubles if the target is poisoned.",
		shortDesc: "Power doubles if the target is poisoned.",
		id: "venoshock",
		name: "Venoshock",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon, target) {
			if (target.status === 'psn' || target.status === 'tox') {
				return this.chainModify(2);
			}
		},
		secondary: false,
		target: "normal",
		type: "Poison",
		contestType: "Beautiful",
	},
	"vicegrip": {
		num: 11,
		accuracy: 100,
		basePower: 55,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "vicegrip",
		name: "Vice Grip",
		pp: 30,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"vinewhip": {
		num: 22,
		accuracy: 100,
		basePower: 45,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "vinewhip",
		name: "Vine Whip",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	"vitalthrow": {
		num: 233,
		accuracy: true,
		basePower: 70,
		category: "Physical",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy. Goes last.",
		id: "vitalthrow",
		name: "Vital Throw",
		pp: 10,
		priority: -1,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	"voltswitch": {
		num: 521,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button.",
		shortDesc: "User switches out after damaging the target.",
		id: "voltswitch",
		isViable: true,
		name: "Volt Switch",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		selfSwitch: true,
		secondary: false,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"volttackle": {
		num: 344,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Has a 10% chance to paralyze the target. If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil. 10% chance to paralyze target.",
		id: "volttackle",
		isViable: true,
		name: "Volt Tackle",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [33, 100],
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"wakeupslap": {
		num: 358,
		accuracy: 100,
		basePower: 70,
		basePowerCallback: function (pokemon, target, move) {
			if (target.status === 'slp') return move.basePower * 2;
			return move.basePower;
		},
		category: "Physical",
		desc: "Power doubles if the target is asleep. If the user has not fainted, the target wakes up.",
		shortDesc: "Power doubles if target is asleep, and wakes it.",
		id: "wakeupslap",
		name: "Wake-Up Slap",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit: function (target) {
			if (target.status === 'slp') target.cureStatus();
		},
		secondary: false,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	"watergun": {
		num: 55,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "watergun",
		name: "Water Gun",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Cute",
	},
	"waterpledge": {
		num: 518,
		accuracy: 100,
		basePower: 80,
		basePowerCallback: function (target, source, move) {
			if (move.sourceEffect in {firepledge:1, grasspledge:1}) {
				this.add('-combine');
				return 150;
			}
			return 80;
		},
		category: "Special",
		desc: "If one of the user's allies chose to use Fire Pledge or Grass Pledge this turn and has not moved yet, it takes its turn immediately after the user and the user's move does nothing. If combined with Fire Pledge, the ally uses Water Pledge with 150 Base Power and a rainbow appears on the user's side for 4 turns, which doubles secondary effect chances but does not stack with the Ability Serene Grace. If combined with Grass Pledge, the ally uses Grass Pledge with 150 Base Power and a swamp appears on the target's side for 4 turns, which quarters the Speed of each Pokemon on that side. When used as a combined move, this move gains STAB no matter what the user's type is. This move does not consume the user's Water Gem, and cannot be redirected by the Ability Storm Drain.",
		shortDesc: "Use with Grass or Fire Pledge for added effect.",
		id: "waterpledge",
		name: "Water Pledge",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		onPrepareHit: function (target, source, move) {
			for (let i = 0; i < this.queue.length; i++) {
				let decision = this.queue[i];
				if (!decision.move || !decision.pokemon || !decision.pokemon.isActive || decision.pokemon.fainted) continue;
				if (decision.pokemon.side === source.side && decision.move.id in {firepledge:1, grasspledge:1}) {
					this.prioritizeQueue(decision);
					this.add('-waiting', source, decision.pokemon);
					return null;
				}
			}
		},
		onModifyMove: function (move) {
			if (move.sourceEffect === 'grasspledge') {
				move.type = 'Grass';
				move.hasSTAB = true;
			}
			if (move.sourceEffect === 'firepledge') {
				move.type = 'Water';
				move.hasSTAB = true;
			}
		},
		onHit: function (target, source, move) {
			if (move.sourceEffect === 'firepledge') {
				source.side.addSideCondition('waterpledge');
			}
			if (move.sourceEffect === 'grasspledge') {
				target.side.addSideCondition('grasspledge');
			}
		},
		effect: {
			duration: 4,
			onStart: function (targetSide) {
				this.add('-sidestart', targetSide, 'Water Pledge');
			},
			onEnd: function (targetSide) {
				this.add('-sideend', targetSide, 'Water Pledge');
			},
			onModifyMove: function (move) {
				if (move.secondaries && move.id !== 'secretpower') {
					this.debug('doubling secondary chance');
					for (let i = 0; i < move.secondaries.length; i++) {
						move.secondaries[i].chance *= 2;
					}
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	"waterpulse": {
		num: 352,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 20% chance to confuse the target.",
		shortDesc: "20% chance to confuse the target.",
		id: "waterpulse",
		name: "Water Pulse",
		pp: 20,
		priority: 0,
		flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Water",
		contestType: "Beautiful",
	},
	"watersport": {
		num: 346,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, all Fire-type attacks used by any active Pokemon have their power reduced to 0.33x. Fails if this move is already in effect.",
		shortDesc: "For 5 turns, Fire-type attacks have 1/3 power.",
		id: "watersport",
		name: "Water Sport",
		pp: 15,
		priority: 0,
		flags: {nonsky: 1},
		onHitField: function (target, source, effect) {
			if (this.pseudoWeather['watersport']) {
				return false;
			} else {
				this.addPseudoWeather('watersport', source, effect, '[of] ' + source);
			}
		},
		effect: {
			duration: 5,
			onStart: function (side, source) {
				this.add('-fieldstart', 'move: Water Sport', '[of] ' + source);
			},
			onBasePowerPriority: 1,
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('water sport weaken');
					return this.chainModify([0x548, 0x1000]);
				}
			},
			onResidualOrder: 21,
			onEnd: function () {
				this.add('-fieldend', 'move: Water Sport');
			},
		},
		secondary: false,
		target: "all",
		type: "Water",
		contestType: "Cute",
	},
	"waterspout": {
		num: 323,
		accuracy: 100,
		basePower: 150,
		basePowerCallback: function (pokemon, target, move) {
			return move.basePower * pokemon.hp / pokemon.maxhp;
		},
		category: "Special",
		desc: "Power is equal to (user's current HP * 150 / user's maximum HP), rounded down, but not less than 1.",
		shortDesc: "Less power as user's HP decreases. Hits foe(s).",
		id: "waterspout",
		isViable: true,
		name: "Water Spout",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Beautiful",
	},
	"waterfall": {
		num: 127,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 20% chance to flinch the target.",
		shortDesc: "20% chance to flinch the target.",
		id: "waterfall",
		isViable: true,
		name: "Waterfall",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	"watershuriken": {
		num: 594,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "watershuriken",
		name: "Water Shuriken",
		pp: 20,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	"weatherball": {
		num: 311,
		accuracy: 100,
		basePower: 50,
		basePowerCallback: function (pokemon, target, move) {
			if (this.weather) return move.basePower * 2;
			return move.basePower;
		},
		category: "Special",
		desc: "Power doubles during weather effects and this move's type changes to match; Ice type during Hail, Water type during Rain Dance, Rock type during Sandstorm, and Fire type during Sunny Day.",
		shortDesc: "Power doubles and type varies in each weather.",
		id: "weatherball",
		name: "Weather Ball",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		onModifyMove: function (move) {
			switch (this.effectiveWeather()) {
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
				move.type = 'Ice';
				break;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	"whirlpool": {
		num: 250,
		accuracy: 85,
		basePower: 35,
		category: "Special",
		desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "whirlpool",
		name: "Whirlpool",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	"whirlwind": {
		num: 18,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The target is forced to switch out and be replaced with a random unfainted ally. Fails if the target used Ingrain previously or has the Ability Suction Cups.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "whirlwind",
		isViable: true,
		name: "Whirlwind",
		pp: 20,
		priority: -6,
		flags: {reflectable: 1, mirror: 1, authentic: 1},
		forceSwitch: true,
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	"wideguard": {
		num: 469,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn that target all adjacent foes or all adjacent Pokemon. This move modifies the same 1/X chance of being successful used by other protection moves, where X starts at 1 and triples each time this move is successfully used, but does not use the chance to check for failure. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn or if this move is already in effect for the user's side.",
		shortDesc: "Protects allies from multi-target hits this turn.",
		id: "wideguard",
		name: "Wide Guard",
		pp: 10,
		priority: 3,
		flags: {snatch: 1},
		sideCondition: 'wideguard',
		onTryHitSide: function (side, source) {
			return this.willAct();
		},
		onHitSide: function (side, source) {
			source.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Wide Guard');
			},
			onTryHitPriority: 4,
			onTryHit: function (target, source, effect) {
				// Wide Guard blocks damaging spread moves
				if (effect && (effect.category === 'Status' || (effect.target !== 'allAdjacent' && effect.target !== 'allAdjacentFoes'))) {
					return;
				}
				this.add('-activate', target, 'Wide Guard');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
		secondary: false,
		target: "allySide",
		type: "Rock",
		contestType: "Tough",
	},
	"wildcharge": {
		num: 528,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 1/4 recoil.",
		id: "wildcharge",
		isViable: true,
		name: "Wild Charge",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [1, 4],
		secondary: false,
		target: "normal",
		type: "Electric",
		contestType: "Tough",
	},
	"willowisp": {
		num: 261,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Burns the target.",
		shortDesc: "Burns the target.",
		id: "willowisp",
		isViable: true,
		name: "Will-O-Wisp",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'brn',
		secondary: false,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	"wingattack": {
		num: 17,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "wingattack",
		name: "Wing Attack",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		secondary: false,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	"wish": {
		num: 273,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "At the end of the next turn, the Pokemon at the user's position has 1/2 of the user's maximum HP restored to it, rounded half up. Fails if this move is already in effect for the user's position.",
		shortDesc: "Next turn, 50% of the user's max HP is restored.",
		id: "wish",
		isViable: true,
		name: "Wish",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		sideCondition: 'Wish',
		effect: {
			duration: 2,
			onStart: function (side, source) {
				this.effectData.hp = source.maxhp / 2;
			},
			onResidualOrder: 4,
			onEnd: function (side) {
				let target = side.active[this.effectData.sourcePosition];
				if (target && !target.fainted) {
					let source = this.effectData.source;
					let damage = this.heal(this.effectData.hp, target, target);
					if (damage) this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + source.name);
				}
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	"withdraw": {
		num: 110,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 1 stage.",
		shortDesc: "Raises the user's Defense by 1.",
		id: "withdraw",
		name: "Withdraw",
		pp: 40,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			def: 1,
		},
		secondary: false,
		target: "self",
		type: "Water",
		contestType: "Cute",
	},
	"wonderroom": {
		num: 472,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, all active Pokemon have their Defense and Special Defense stats swapped. Stat stage changes are unaffected. If this move is used during the effect, the effect ends.",
		shortDesc: "For 5 turns, all Defense and Sp. Def stats switch.",
		id: "wonderroom",
		name: "Wonder Room",
		pp: 10,
		priority: 0,
		flags: {mirror: 1},
		onHitField: function (target, source, effect) {
			if (this.pseudoWeather['wonderroom']) {
				this.removePseudoWeather('wonderroom', source, effect, '[of] ' + source);
			} else {
				this.addPseudoWeather('wonderroom', source, effect, '[of] ' + source);
			}
		},
		effect: {
			duration: 5,
			onStart: function (side, source) {
				this.add('-fieldstart', 'move: WonderRoom', '[of] ' + source);
			},
			onModifyMovePriority: -100,
			onModifyMove: function (move) {
				move.defensiveCategory = ((move.defensiveCategory || this.getCategory(move)) === 'Physical' ? 'Special' : 'Physical');
				this.debug('Defensive Category: ' + move.defensiveCategory);
			},
			onResidualOrder: 24,
			onEnd: function () {
				this.add('-fieldend', 'move: Wonder Room');
			},
		},
		secondary: false,
		target: "all",
		type: "Psychic",
		contestType: "Clever",
	},
	"woodhammer": {
		num: 452,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil.",
		id: "woodhammer",
		isViable: true,
		name: "Wood Hammer",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [33, 100],
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Tough",
	},
	"workup": {
		num: 526,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Special Attack by 1 stage.",
		shortDesc: "Raises the user's Attack and Sp. Atk by 1.",
		id: "workup",
		name: "Work Up",
		pp: 30,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
			spa: 1,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	"worryseed": {
		num: 388,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target's Ability to become Insomnia. Fails if the target's Ability is Insomnia, Multitype, Stance Change, or Truant.",
		shortDesc: "The target's Ability becomes Insomnia.",
		id: "worryseed",
		name: "Worry Seed",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onTryHit: function (pokemon) {
			let bannedAbilities = {insomnia:1, multitype:1, stancechange:1, truant:1};
			if (bannedAbilities[pokemon.ability]) {
				return false;
			}
		},
		onHit: function (pokemon) {
			let oldAbility = pokemon.setAbility('insomnia');
			if (oldAbility) {
				this.add('-endability', pokemon, oldAbility, '[from] move: Worry Seed');
				this.add('-ability', pokemon, 'Insomnia', '[from] move: Worry Seed');
				if (pokemon.status === 'slp') {
					pokemon.cureStatus();
				}
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	"wrap": {
		num: 35,
		accuracy: 90,
		basePower: 15,
		category: "Physical",
		desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "wrap",
		name: "Wrap",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"wringout": {
		num: 378,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			return Math.floor(Math.floor((120 * (100 * Math.floor(target.hp * 4096 / target.maxhp)) + 2048 - 1) / 4096) / 100) || 1;
		},
		category: "Special",
		desc: "Power is equal to 120 * (target's current HP / target's maximum HP), rounded half down, but not less than 1.",
		shortDesc: "More power the more HP the target has left.",
		id: "wringout",
		name: "Wring Out",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	"xscissor": {
		num: 404,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "xscissor",
		isViable: true,
		name: "X-Scissor",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	"yawn": {
		num: 281,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to fall asleep at the end of the next turn. Fails when used if the target cannot fall asleep or if it already has a major status condition. At the end of the next turn, if the target is still on the field, does not have a major status condition, and can fall asleep, it falls asleep. If the target becomes affected, this effect cannot be prevented by Safeguard or a substitute, or by falling asleep and waking up during the effect.",
		shortDesc: "Puts the target to sleep after 1 turn.",
		id: "yawn",
		name: "Yawn",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		volatileStatus: 'yawn',
		onTryHit: function (target) {
			if (target.status || !target.runStatusImmunity('slp')) {
				return false;
			}
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onStart: function (target, source) {
				this.add('-start', target, 'move: Yawn', '[of] ' + source);
			},
			onEnd: function (target) {
				this.add('-end', target, 'move: Yawn', '[silent]');
				target.trySetStatus('slp');
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	"zapcannon": {
		num: 192,
		accuracy: 50,
		basePower: 120,
		category: "Special",
		desc: "Has a 100% chance to paralyze the target.",
		shortDesc: "100% chance to paralyze the target.",
		id: "zapcannon",
		name: "Zap Cannon",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	"zenheadbutt": {
		num: 428,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		desc: "Has a 20% chance to flinch the target.",
		shortDesc: "20% chance to flinch the target.",
		id: "zenheadbutt",
		isViable: true,
		name: "Zen Headbutt",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	"paleowave": {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		desc: "Has a 20% chance to lower the target's Attack by 1 stage.",
		shortDesc: "20% chance to lower the target's Attack by 1.",
		id: "paleowave",
		isNonstandard: true,
		isViable: true,
		name: "Paleo Wave",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Beautiful",
	},
	"shadowstrike": {
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's Defense by 1 stage.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "shadowstrike",
		isNonstandard: true,
		isViable: true,
		name: "Shadow Strike",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	"magikarpsrevenge": {
		accuracy: true,
		basePower: 120,
		category: "Physical",
		desc: "Has a 100% chance to confuse the target and lower its Defense and Special Attack by 1 stage. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. If this move is successful, the weather changes to rain unless it is already in effect, and the user gains the effects of Aqua Ring and Magic Coat.",
		shortDesc: "Does many things turn 1. Can't move turn 2.",
		id: "magikarpsrevenge",
		isNonstandard: true,
		name: "Magikarp's Revenge",
		pp: 10,
		priority: 0,
		flags: {contact: 1, recharge: 1, protect: 1, mirror: 1},
		noSketch: true,
		drain: [1, 2],
		onTry: function (pokemon) {
			if (pokemon.template.name !== 'Magikarp') {
				this.add('-fail', pokemon, 'move: Magikarp\'s Revenge');
				return null;
			}
		},
		self: {
			onHit: function (source) {
				this.setWeather('raindance');
				source.addVolatile('magiccoat');
				source.addVolatile('aquaring');
			},
			volatileStatus: 'mustrecharge',
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
			boosts: {
				def: -1,
				spa: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Cute",
	},
};
