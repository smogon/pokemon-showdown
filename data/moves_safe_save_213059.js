exports.BattleMovedex = {
	"absorb": {
		num: 71,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Deals damage to one adjacent target. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "absorb",
		name: "Absorb",
		pp: 25,
		priority: 0,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"acid": {
		num: 51,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 10% chance to lower their Special Defense by 1 stage each.",
		shortDesc: "10% chance to lower the foe(s) Sp. Def by 1.",
		id: "acid",
		name: "Acid",
		pp: 30,
		priority: 0,
		secondary: {
			chance: 10,
			boosts: {
				spd: -1
			}
		},
		target: "foes",
		type: "Poison"
	},
	"acidarmor": {
		num: 151,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		shortDesc: "Boosts the user's Defense by 2.",
		id: "acidarmor",
		isViable: true,
		name: "Acid Armor",
		pp: 40,
		priority: 0,
		isSnatchable: true,
		boosts: {
			def: 2
		},
		secondary: false,
		target: "self",
		type: "Poison"
	},
	"acidspray": {
		num: 491,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 100% chance to lower its Special Defense by 2 stages.",
		shortDesc: "100% chance to lower the target's Sp. Def by 2.",
		id: "acidspray",
		isViable: true,
		name: "Acid Spray",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spd: -2
			}
		},
		target: "normal",
		type: "Poison"
	},
	"acrobatics": {
		num: 512,
		accuracy: 100,
		basePower: 55,
		basePowerCallback: function(pokemon) {
			if (!pokemon.item || pokemon.item === 'flyinggem') {
				this.debug("Power doubled for no item.");
				return 110;
			}
			return 55;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target. Power doubles if the user has no held item. Makes contact.",
		shortDesc: "Power doubles if the user has no held item.",
		id: "acrobatics",
		isViable: true,
		name: "Acrobatics",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"acupressure": {
		num: 367,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises a random stat by 2 stages as long as the stat is not already at stage 6. The user can choose to use this move on itself or an adjacent ally. Fails if no stat stage can be raised or if used on an ally with a Substitute. This move ignores Protect and Detect.",
		shortDesc: "Boosts a random stat of the user or an ally by 2.",
		id: "acupressure",
		name: "Acupressure",
		pp: 30,
		priority: 0,
		isNotProtectable: true,
		onHit: function(target) {
			var stats = [];
			for (var i in target.boosts) {
				if (target.boosts[i] < 6) {
					stats.push(i);
				}
			}
			if (stats.length) {
				var i = stats[this.random(stats.length)];
				var boost = {};
				boost[i] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
		secondary: false,
		target: "ally",
		type: "Normal"
	},
	"aerialace": {
		num: 332,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target and ignores Accuracy and Evasion modifiers. Makes contact.",
		shortDesc: "Ignores Accuracy and Evasion modifiers.",
		id: "aerialace",
		isViable: true,
		name: "Aerial Ace",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"aeroblast": {
		num: 177,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target with a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "aeroblast",
		isViable: true,
		name: "Aeroblast",
		pp: 5,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"afteryou": {
		num: 495,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Causes one adjacent target to take its turn immediately after the user this turn, no matter the priority of its selected move. Fails if the target would have moved next anyway, or if the target already moved this turn. Ignores a target's Substitute.",
		shortDesc: "The target makes its move right after the user.",
		id: "afteryou",
		name: "After You",
		pp: 15,
		priority: 0,
		isNotProtectable: true,
		onTryHit: false, // After You will always fail when used in a single battle
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"agility": {
		num: 97,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages.",
		shortDesc: "Boosts the user's Speed by 2.",
		id: "agility",
		isViable: true,
		name: "Agility",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spe: 2
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"aircutter": {
		num: 314,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio. Hits adjacent foes.",
		id: "aircutter",
		name: "Air Cutter",
		pp: 25,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "foes",
		type: "Flying"
	},
	"airslash": {
		num: 403,
		accuracy: 95,
		basePower: 75,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target with a 30% chance to flinch it.",
		shortDesc: "30% chance to flinch the target.",
		id: "airslash",
		isViable: true,
		name: "Air Slash",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "any",
		type: "Flying"
	},
	"allyswitch": {
		num: 502,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "The user swaps positions with its ally on the far side of the field. Fails if there is no Pokemon at that position, if the user is the only Pokemon on its side, or if the user is in the middle. Priority +1.",
		shortDesc: "Switches position with the ally on the far side.",
		id: "allyswitch",
		name: "Ally Switch",
		pp: 15,
		priority: 1,
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"amnesia": {
		num: 133,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Defense by 2 stages.",
		shortDesc: "Boosts the user's Sp. Def by 2.",
		id: "amnesia",
		isViable: true,
		name: "Amnesia",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spd: 2
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"ancientpower": {
		num: 246,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to raise the user's Attack, Defense, Speed, Special Attack, and Special Defense by 1 stage.",
		shortDesc: "10% chance to boost all of the user's stats by 1.",
		id: "ancientpower",
		name: "AncientPower",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1
				}
			}
		},
		target: "normal",
		type: "Rock"
	},
	"aquajet": {
		num: 453,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact. Priority +1.",
		shortDesc: "Usually goes first.",
		id: "aquajet",
		isViable: true,
		name: "Aqua Jet",
		pp: 20,
		priority: 1,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"aquaring": {
		num: 392,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user has 1/16 of its maximum HP restored at the end of each turn while it remains active. If the user uses Baton Pass, the replacement will still receive the healing effect.",
		shortDesc: "User recovers 1/16 max HP per turn.",
		id: "aquaring",
		name: "Aqua Ring",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'aquaring',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 6,
			onResidual: function(pokemon) {
				this.heal(pokemon.maxhp/16);
			}
		},
		secondary: false,
		target: "self",
		type: "Water"
	},
	"aquatail": {
		num: 401,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "aquatail",
		isViable: true,
		name: "Aqua Tail",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"armthrust": {
		num: 292,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 35% chance to hit two or three times, and a 15% chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Makes contact.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "armthrust",
		name: "Arm Thrust",
		pp: 20,
		priority: 0,
		isContact: true,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"aromatherapy": {
		num: 312,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Every Pokemon in the user's party is cured of its major status problem.",
		shortDesc: "Cures the user's party of all status conditions.",
		id: "aromatherapy",
		isViable: true,
		name: "Aromatherapy",
		pp: 5,
		priority: 0,
		isSnatchable: true,
		onHitSide: function(side, source) {
			for (var i=0; i<side.pokemon.length; i++) {
				side.pokemon[i].status = '';
			}
			this.add('-cureteam',source,'[from] move: Aromatherapy');
		},
		secondary: false,
		target: "allySide",
		type: "Grass"
	},
	"assist": {
		num: 274,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "A random move among those known by the user's party members is selected for use. Does not select Assist, Bestow, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Transform, or Trick.",
		shortDesc: "Uses a random move known by a team member.",
		id: "assist",
		name: "Assist",
		pp: 20,
		priority: 0,
		onHit: function(target) {
			var moves = [];
			for (var j=0; j<target.side.pokemon.length; j++) {
				var pokemon = target.side.pokemon[j];
				if (pokemon === target) continue;
				for (var i=0; i<pokemon.moves.length; i++) {
					var move = pokemon.moves[i];
					var noAssist = {
						assist:1, bestow:1, chatter:1, circlethrow:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, dragontail:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, ragepowder:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, transform:1, trick:1
					};
					if (move && !noAssist[move]) {
						moves.push(move);
					}
				}
			}
			var move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) {
				return false;
			}
			this.useMove(move, target);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"assurance": {
		num: 372,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power doubles if the target has already taken damage this turn, other than from Pain Split. Makes contact.",
		shortDesc: "Power doubles if target was damaged this turn.",
		id: "assurance",
		name: "Assurance",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"astonish": {
		num: 310,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Makes contact.",
		shortDesc: "30% chance to flinch the target.",
		id: "astonish",
		name: "Astonish",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Ghost"
	},
	"attackorder": {
		num: 454,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "attackorder",
		isViable: true,
		name: "Attack Order",
		pp: 15,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"attract": {
		num: 213,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to become infatuated, making it unable to attack 50% of the time. Fails if both the user and the target are the same gender, if either is genderless, or if the target is already infatuated. The effect ends when either the user or the target is no longer active. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute. Pokemon with the Ability Oblivious are immune.",
		shortDesc: "A target of the opposite gender gets infatuated.",
		id: "attract",
		name: "Attract",
		pp: 15,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			if (target.addVolatile('attract')) this.add("-start", target, "Attract");
			else return false;
		},
		effect: {
			onStart: function(pokemon, source) {
				return ((pokemon.gender === 'M' && source.gender === 'F') || (pokemon.gender === 'F' && source.gender === 'M'));
			},
			onBeforeMove: function(pokemon, target, move) {
				if (this.effectData.source && !this.effectData.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on '+pokemon);
					pokemon.removeVolatile('attract');
					return;
				}
				if (this.random(2) === 0) {
					this.add('cant', pokemon, 'Attract', move);
					return false;
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"aurasphere": {
		num: 396,
		accuracy: true,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target and ignores Accuracy and Evasion modifiers.",
		shortDesc: "Ignores Accuracy and Evasion modifiers.",
		id: "aurasphere",
		isViable: true,
		name: "Aura Sphere",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "any",
		type: "Fighting"
	},
	"aurorabeam": {
		num: 62,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to lower its Attack by 1 stage.",
		shortDesc: "10% chance to lower the foe's Attack by 1.",
		id: "aurorabeam",
		name: "Aurora Beam",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 10,
			boosts: {
				atk: -1
			}
		},
		target: "normal",
		type: "Ice"
	},
	"autotomize": {
		num: 475,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages. If the user's Speed was changed, the user's weight is reduced by 100kg as long as it remains active. This effect is stackable but cannot reduce the user's weight to less than 0.1kg.",
		shortDesc: "Boosts the user's Speed by 2; user loses 100kg.",
		id: "autotomize",
		isViable: true,
		name: "Autotomize",
		pp: 15,
		priority: 0,
		isSnatchable: true,
		onTryHit: function(pokemon) {
			if ((pokemon.ability !== 'contrary' && pokemon.boosts.spe === 6) || (pokemon.ability === 'contrary' && pokemon.boosts.spe === -6)) {
				return false;
			}
		},
		boosts: {
			spe: 2
		},
		volatileStatus: 'autotomize',
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(pokemon) {
				if (pokemon.weightkg !== 0.1) {
					this.effectData.multiplier = 1;
					this.add('-message', pokemon.name+' became nimble! (placeholder)');
				}
			},
			onRestart: function(pokemon) {
				if (pokemon.weightkg !== 0.1) {
					this.effectData.multiplier++;
					this.add('-message', pokemon.name+' became nimble! (placeholder)');
				}
			},
			onModifyPokemon: function(pokemon) {
				if (this.effectData.multiplier) {
					pokemon.weightkg -= this.effectData.multiplier*100;
					if (pokemon.weightkg < 0.1) pokemon.weightkg = 0.1;
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Steel"
	},
	"avalanche": {
		num: 419,
		accuracy: 100,
		basePower: 60,
		basePowerCallback: function(pokemon, source) {
			if (source.lastDamage > 0 && pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn) {
				this.debug('Boosted for getting hit by '+pokemon.lastAttackedBy.move);
				return 120;
			}
			return 60;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power doubles if the user was hit by that target this turn. Makes contact. Priority -4.",
		shortDesc: "Power doubles if user is damaged by the target.",
		id: "avalanche",
		isViable: true,
		name: "Avalanche",
		pp: 10,
		priority: -4,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"barrage": {
		num: 140,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 35% chance to hit two or three times, and a 15% chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "barrage",
		name: "Barrage",
		pp: 20,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"barrier": {
		num: 112,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		shortDesc: "Boosts the user's Defense by 2.",
		id: "barrier",
		isViable: true,
		name: "Barrier",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		boosts: {
			def: 2
		},
		secondary: false,
		target: "self",
		type: "Psychic"
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
		selfSwitch: 'copyvolatile',
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"beatup": {
		num: 251,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			pokemon.addVolatile('beatup');
			return 5 + Math.floor(pokemon.side.pokemon[pokemon.volatiles.beatup.index].baseStats.atk / 10);
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits one time for the user and one time for each unfainted Pokemon without a major status problem in the user's party. The power of each hit is equal to 5+(X/10), where X is each participating Pokemon's base Attack; each hit is considered to come from the user.",
		shortDesc: "All healthy allies aid in damaging the target.",
		id: "beatup",
		name: "Beat Up",
		pp: 10,
		priority: 0,
		onModifyMove: function(move, pokemon) {
			var validpokemon = 1;
			for (var p in pokemon.side.pokemon) {
				if (pokemon.side.pokemon[p] === pokemon) continue;
				if (pokemon.side.pokemon[p] && !pokemon.side.pokemon[p].fainted && !pokemon.side.pokemon[p].status) validpokemon++;
			}
			move.multihit = validpokemon;
		},
		effect: {
			duration: 1,
			onStart: function(pokemon) {
				this.effectData.index = 0;
			},
			onRestart: function(pokemon) {
				do {
					this.effectData.index++;
					if (this.effectData.index >= 6) break;
				} while (!pokemon.side.pokemon[this.effectData.index] ||
						pokemon.side.pokemon[this.effectData.index].fainted ||
						pokemon.side.pokemon[this.effectData.index].status)
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"bellydrum": {
		num: 187,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack to stage 6 in exchange for the user losing 1/2 of its maximum HP, rounded down. Fails if the user would faint or if its Attack stage is already 6.",
		shortDesc: "User loses 50% max HP. Maximizes Attack.",
		id: "bellydrum",
		isViable: true,
		name: "Belly Drum",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		onHit: function(target) {
			if (target.hp <= target.maxhp/2 || target.boosts.atk >= 6 || target.maxhp === 1) { // Shedinja clause
				return false;
			}
			this.directDamage(target.maxhp/2);
			target.setBoost({atk: 6});
			this.add('-setboost', target, 'atk', '6', '[from] move: Belly Drum');
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"bestow": {
		num: 516,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Causes one adjacent target to receive the user's held item. Fails if the target is already holding an item or if the user is holding a Mail.",
		shortDesc: "User passes its held item to the target.",
		id: "bestow",
		name: "Bestow",
		pp: 15,
		priority: 0,
		onHit: function(target, source) {
			if (target.item) {
				return false;
			}
			var yourItem = source.takeItem();
			if (!yourItem) {
				return false;
			}
			if (!target.setItem(yourItem)) {
				source.item = yourItem;
				return false;
			}
			this.add('-item',target,yourItem.name,'[from] move: Bestow');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"bide": {
		num: 117,
		accuracy: true,
		basePower: false,
		category: "Physical",
		desc: "The user spends two turns locked into this move and then, on the second turn after using this move, the user attacks the last Pokemon that hit it, inflicting double the damage in HP it lost during the two turns. If the last Pokemon that hit it is no longer on the field, the user attacks a random foe instead. If the user is prevented from moving during this move's use, the effect ends. This move ignores Accuracy and Evasion modifiers and can hit Ghost-types. Makes contact. Priority +1.",
		shortDesc: "Waits 2 turns; deals double the damage taken.",
		id: "bide",
		name: "Bide",
		pp: 10,
		priority: 1,
		isContact: true,
		volatileStatus: 'bide',
		effect: {
			duration: 3,
			onLockMove: 'bide',
			onStart: function(pokemon) {
				this.effectData.totalDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onDamage: function(damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source || source.side === target.side) return;
				this.effectData.totalDamage += damage;
				this.effectData.sourcePosition = source.position;
				this.effectData.sourceSide = source.side;
			},
			onAfterSetStatus: function(status, pokemon) {
				if (status.id === 'slp') {
					pokemon.removeVolatile('bide');
				}
			},
			onBeforeMove: function(pokemon) {
				if (this.effectData.duration === 1) {
					if (!this.effectData.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					this.add('-end', pokemon, 'Bide');
					var target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					this.moveHit(target, pokemon, 'bide', {damage: this.effectData.totalDamage*2});
					return false;
				}
				this.add('-message', pokemon.name+' is storing energy! (placeholder)');
				return false;
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"bind": {
		num: 20,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; always five turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-Turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move. Makes contact.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "bind",
		name: "Bind",
		pp: 20,
		priority: 0,
		isContact: true,
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"bite": {
		num: 44,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Makes contact.",
		shortDesc: "30% chance to flinch the target.",
		id: "bite",
		name: "Bite",
		pp: 25,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Dark"
	},
	"blastburn": {
		num: 307,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "Deals damage to one adjacent target. If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "blastburn",
		name: "Blast Burn",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustrecharge'
		},
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"blazekick": {
		num: 299,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to burn it and a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio. 10% chance to burn.",
		id: "blazekick",
		isViable: true,
		name: "Blaze Kick",
		pp: 10,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"blizzard": {
		num: 59,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 10% chance to freeze each. If the weather is Hail, this move cannot miss.",
		shortDesc: "10% chance to freeze the foe(s).",
		id: "blizzard",
		isViable: true,
		name: "Blizzard",
		pp: 5,
		priority: 0,
		onModifyMove: function(move) {
			if (this.isWeather('hail')) move.accuracy = true;
		},
		secondary: {
			chance: 10,
			status: 'frz'
		},
		target: "foes",
		type: "Ice"
	},
	"block": {
		num: 335,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents one adjacent target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-Turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "The target cannot switch out.",
		id: "block",
		isViable: true,
		name: "Block",
		pp: 5,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			target.addVolatile('trapped');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"blueflare": {
		num: 551,
		accuracy: 85,
		basePower: 130,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 20% chance to burn it.",
		shortDesc: "20% chance to burn the target.",
		id: "blueflare",
		isViable: true,
		name: "Blue Flare",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 20,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"bodyslam": {
		num: 34,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to paralyze it. Makes contact.",
		shortDesc: "30% chance to paralyze the target.",
		id: "bodyslam",
		isViable: true,
		name: "Body Slam",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Normal"
	},
	"boltstrike": {
		num: 550,
		accuracy: 85,
		basePower: 130,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 20% chance to paralyze it. Makes contact.",
		shortDesc: "20% chance to paralyze the target.",
		id: "boltstrike",
		isViable: true,
		name: "Bolt Strike",
		pp: 5,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 20,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"boneclub": {
		num: 125,
		accuracy: 85,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to flinch it.",
		shortDesc: "10% chance to flinch the target.",
		id: "boneclub",
		name: "Bone Club",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Ground"
	},
	"bonerush": {
		num: 198,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 35% chance to hit two or three times, and a 15% chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "bonerush",
		isViable: true,
		name: "Bone Rush",
		pp: 10,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"bonemerang": {
		num: 155,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits twice. If the first hit breaks the target's Substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		id: "bonemerang",
		isViable: true,
		name: "Bonemerang",
		pp: 10,
		priority: 0,
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"bounce": {
		num: 340,
		accuracy: 85,
		basePower: 85,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target with a 30% chance to paralyze it. This attack charges on the first turn and strikes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thunder, and Twister. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn. This move cannot be used while Gravity is in effect. Makes contact.",
		shortDesc: "Bounces turn 1. Hits turn 2. 30% paralyze.",
		id: "bounce",
		isViable: true,
		name: "Bounce",
		pp: 5,
		priority: 0,
		isContact: true,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'bounce',
			onSourceModifyMove: function(move) {

				// warning: does not work the same way as Fly

				if (move.target === 'foeSide') return;
				if (move.id === 'gust' || move.id === 'twister') {
					// should not normally be done in ModifyMove event,
					// but these moves have static base power, and
					// it's faster to do this  here than in
					// BasePower event
					move.basePower *= 2;
					return;
				} else if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown') {
					return;
				}
				move.accuracy = 0;
			}
		},
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "any",
		type: "Flying"
	},
	"bravebird": {
		num: 413,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target. If the target lost HP, the user takes recoil damage equal to 33% that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 1/3 recoil.",
		id: "bravebird",
		isViable: true,
		name: "Brave Bird",
		pp: 15,
		priority: 0,
		isContact: true,
		recoil: [1,3],
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"brickbreak": {
		num: 280,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If this attack does not miss, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated. Makes contact.",
		shortDesc: "Destroys screens, unless the target is immune.",
		id: "brickbreak",
		isViable: true,
		name: "Brick Break",
		pp: 15,
		priority: 0,
		isContact: true,
		onTryHit: function(pokemon) {
			// will shatter screens through sub, before you hit
			if (pokemon.runImmunity('Fighting')) {
				pokemon.side.removeSideCondition('reflect');
				pokemon.side.removeSideCondition('lightscreen');
			}
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"brine": {
		num: 362,
		accuracy: 100,
		basePower: 65,
		basePowerCallback: function(pokemon, target) {
			if (target.hp * 2 < target.maxhp) return 130;
			return 65;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. Power doubles if the target has less than or equal to half of its maximum HP remaining.",
		shortDesc: "Power doubles if the target's HP is 50% or less.",
		id: "brine",
		name: "Brine",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"bubble": {
		num: 145,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 10% chance to lower their Speed by 1 stage each.",
		shortDesc: "10% chance to lower the foe(s) Speed by 1.",
		id: "bubble",
		name: "Bubble",
		pp: 30,
		priority: 0,
		secondary: {
			chance: 10,
			boosts: {
				spe: -1
			}
		},
		target: "foes",
		type: "Water"
	},
	"bubblebeam": {
		num: 61,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to lower its Speed by 1 stage.",
		shortDesc: "10% chance to lower the target's Speed by 1.",
		id: "bubblebeam",
		name: "BubbleBeam",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 10,
			boosts: {
				spe: -1
			}
		},
		target: "normal",
		type: "Water"
	},
	"bugbite": {
		num: 450,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If this move is successful and the user has not fainted, it steals the target's held Berry if it is holding one and uses it immediately. Makes contact.",
		shortDesc: "User steals and eats the target's Berry.",
		id: "bugbite",
		name: "Bug Bite",
		pp: 20,
		priority: 0,
		isContact: true,
		onHit: function(target, source) {
			var item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Bug Bite', '[of] '+source);
				this.singleEvent('Eat', item, null, source, null, null);
			}
		},
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"bugbuzz": {
		num: 405,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to lower its Special Defense by 1 stage. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "10% chance to lower the target's Sp. Def. by 1.",
		id: "bugbuzz",
		isViable: true,
		name: "Bug Buzz",
		pp: 10,
		priority: 0,
		isSoundBased: true,
		secondary: {
			chance: 10,
			boosts: {
				spd: -1
			}
		},
		target: "normal",
		type: "Bug"
	},
	"bulkup": {
		num: 339,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Defense by 1 stage.",
		shortDesc: "Boosts the user's Attack and Defense by 1.",
		id: "bulkup",
		isViable: true,
		name: "Bulk Up",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1,
			def: 1
		},
		secondary: false,
		target: "self",
		type: "Fighting"
	},
	"bulldoze": {
		num: 523,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to all adjacent Pokemon with a 100% chance to lower their Speed by 1 stage each.",
		shortDesc: "100% chance to lower adjacent Pkmn Speed by 1.",
		id: "bulldoze",
		name: "Bulldoze",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spe: -1
			}
		},
		target: "adjacent",
		type: "Ground"
	},
	"bulletpunch": {
		num: 418,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist. Priority +1.",
		shortDesc: "Usually goes first.",
		id: "bulletpunch",
		isViable: true,
		name: "Bullet Punch",
		pp: 30,
		priority: 1,
		isContact: true,
		isPunchAttack: true,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"bulletseed": {
		num: 331,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 35% chance to hit two or three times, and a 15% chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "bulletseed",
		isViable: true,
		name: "Bullet Seed",
		pp: 30,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"calmmind": {
		num: 347,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack and Special Defense by 1 stage.",
		shortDesc: "Boosts the user's Sp. Atk and Sp. Def by 1.",
		id: "calmmind",
		isViable: true,
		name: "Calm Mind",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spa: 1,
			spd: 1
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"camouflage": {
		num: 293,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user's type changes based on the battle terrain. Ground-type in Wi-Fi battles. (In-game: Ground-type in puddles, rocky ground, and sand, Water-type on water, Rock-type in caves, Ice-type on snow and ice, and Normal-type everywhere else.) Fails if the user's type cannot be changed or if the user is already purely that type.",
		shortDesc: "Changes user's type based on terrain. (Ground)",
		id: "camouflage",
		name: "Camouflage",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'camouflage',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'typechange', 'Ground');
			},
			onModifyPokemon: function(pokemon) {
				pokemon.types = ['Ground'];
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"captivate": {
		num: 445,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers all adjacent foes' Special Attack by 2 stages. A target is unaffected if both the user and the target are the same gender, or if either is genderless. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Pokemon with the Ability Oblivious are immune.",
		shortDesc: "Lowers the foe(s) Sp. Atk by 2 if opposite gender.",
		id: "captivate",
		name: "Captivate",
		pp: 20,
		priority: 0,
		onTryHit: function(pokemon, source) {
			if ((pokemon.gender === 'M' && source.gender === 'F') || (pokemon.gender === 'F' && source.gender === 'M')) {
				return;
			}
			return false;
		},
		boosts: {
			spa: -2
		},
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"charge": {
		num: 268,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Defense by 1 stage. If the user chooses to use an Electric-type attack on the next turn, its power will be doubled.",
		shortDesc: "Boosts next Electric move and user's Sp. Def by 1.",
		id: "charge",
		name: "Charge",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'charge',
		onHit: function(pokemon) {
			this.add('-message', pokemon.name+' began charging power! (placeholder)');
		},
		effect: {
			duration: 2,
			onRestart: function(pokemon) {
				this.effectData.duration = 2;
			},
			onBasePower: function(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('charge boost');
					return basePower * 2;
				}
			}
		},
		boosts: {
			spd: 1
		},
		secondary: false,
		target: "self",
		type: "Electric"
	},
	"chargebeam": {
		num: 451,
		accuracy: 90,
		basePower: 50,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 70% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "70% chance to boost the user's Sp. Atk by 1.",
		id: "chargebeam",
		isViable: true,
		name: "Charge Beam",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 70,
			self: {
				boosts: {
					spa: 1
				}
			}
		},
		target: "normal",
		type: "Electric"
	},
	"charm": {
		num: 204,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Attack by 2 stages. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the target's Attack by 2.",
		id: "charm",
		name: "Charm",
		pp: 20,
		priority: 0,
		boosts: {
			atk: -2
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"chatter": {
		num: 448,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target. This move has an X% chance to confuse the target, where X is 0 unless the user is a Chatot that hasn't Transformed. If the user is a Chatot, X is 0 or 10 depending on the volume of Chatot's recorded cry, if any; 0 for a low volume or no recording, 10 for a medium to high volume recording. Pokemon with the Ability Soundproof are immune. (Field: Can be used to record a sound to replace Chatot's cry. The cry is reset if Chatot is deposited in a PC.)",
		shortDesc: "10% chance to confuse the target.",
		id: "chatter",
		name: "Chatter",
		pp: 20,
		priority: 0,
		isSoundBased: true,
		onModifyMove: function(move, pokemon) {
			if (pokemon.template.species !== 'Chatot') delete move.secondaries;
		},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion'
		},
		target: "any",
		type: "Flying"
	},
	"chipaway": {
		num: 498,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target and ignores the target's defensive stat stage changes, including Accuracy and Evasion modifiers. Makes contact.",
		shortDesc: "Ignores the target's stat modifiers.",
		id: "chipaway",
		name: "Chip Away",
		pp: 20,
		priority: 0,
		isContact: true,
		ignoreDefensive: true,
		ignoreEvasion: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"circlethrow": {
		num: 509,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Ability Suction Cups, or has a Substitute. Makes contact. Priority -6. (Wild battles: The battle ends as long as it is not a double battle and the user's level is not less than the opponent's level.)",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "circlethrow",
		isViable: true,
		name: "Circle Throw",
		pp: 10,
		priority: -6,
		isContact: true,
		forceSwitch: true,
		target: "normal",
		type: "Fighting"
	},
	"clamp": {
		num: 128,
		accuracy: 85,
		basePower: 35,
		category: "Physical",
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; always five turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-Turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move. Makes contact.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "clamp",
		name: "Clamp",
		pp: 10,
		priority: 0,
		isContact: true,
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"clearsmog": {
		num: 499,
		accuracy: true,
		basePower: 50,
		category: "Special",
		desc: "Deals damage to one adjacent target and eliminates all of its stat stage changes.",
		shortDesc: "Eliminates the target's stat changes.",
		id: "clearsmog",
		isViable: true,
		name: "Clear Smog",
		pp: 15,
		priority: 0,
		onHit: function(target) {
			target.clearBoosts();
			this.add('-clearboost',target);
		},
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"closecombat": {
		num: 370,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target and lowers the user's Defense and Special Defense by 1 stage. Makes contact.",
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
		id: "closecombat",
		isViable: true,
		name: "Close Combat",
		pp: 5,
		priority: 0,
		isContact: true,
		self: {
			boosts: {
				def: -1,
				spd: -1
			}
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"coil": {
		num: 489,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Attack, Defense, and Accuracy by 1 stage.",
		shortDesc: "Boosts user's Attack, Defense, and Accuracy by 1.",
		id: "coil",
		isViable: true,
		name: "Coil",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1,
			def: 1,
			accuracy: 1
		},
		secondary: false,
		target: "self",
		type: "Poison"
	},
	"cometpunch": {
		num: 4,
		accuracy: 85,
		basePower: 18,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 35% chance to hit two or three times, and a 15% chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "cometpunch",
		name: "Comet Punch",
		pp: 15,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"confuseray": {
		num: 109,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to become confused. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Confuses the target.",
		id: "confuseray",
		isViable: true,
		name: "Confuse Ray",
		pp: 10,
		priority: 0,
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"confusion": {
		num: 93,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to confuse it.",
		shortDesc: "10% chance to confuse the target.",
		id: "confusion",
		name: "Confusion",
		pp: 25,
		priority: 0,
		secondary: {
			chance: 10,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Psychic"
	},
	"constrict": {
		num: 132,
		accuracy: 100,
		basePower: 10,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to lower its Speed by 1 stage. Makes contact.",
		shortDesc: "10% chance to lower the target's Speed by 1.",
		id: "constrict",
		name: "Constrict",
		pp: 35,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 10,
			boosts: {
				spe: -1
			}
		},
		target: "normal",
		type: "Normal"
	},
	"conversion": {
		num: 160,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user's type changes to match the original type of one of its four moves besides this move, at random, but not either of its current types. Fails if the user cannot change its type, or if this move would only be able to select one of the user's current types.",
		shortDesc: "Changes user's type to match a known move.",
		id: "conversion",
		name: "Conversion",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'conversion',
		effect: {
			onStart: function(pokemon) {
				var possibleTypes = pokemon.moveset.map(function(val){
					var move = this.getMove(val.id);
					if (move.id !== 'conversion' && !pokemon.hasType(move.type)) {
						return move.type;
					}
				}, this).compact();
				if (!possibleTypes.length) {
					this.add('-fail', pokemon);
					return false;
				}
				this.effectData.type = possibleTypes[this.random(possibleTypes.length)];
				this.add('-start', pokemon, 'typechange', this.effectData.type);
			},
			onRestart: function(pokemon) {
				var possibleTypes = pokemon.moveset.map(function(val){
					var move = this.getMove(val.id);
					if (move.id !== 'conversion' && !pokemon.hasType(move.type)) {
						return move.type;
					}
				}, this).compact();
				if (!possibleTypes.length) {
					this.add('-fail', pokemon);
					return false;
				}
				this.effectData.type = possibleTypes[this.random(possibleTypes.length)];
				this.add('-start', pokemon, 'typechange', this.effectData.type);
			},
			onModifyPokemon: function(pokemon) {
				pokemon.types = [this.effectData.type];
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"conversion2": {
		num: 176,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user's type changes to match a type that resists or is immune to the type of the last move used by one adjacent target, but not either of its current types. The determined type of the move is used rather than the original type. Fails if the user cannot change its type, or if this move would only be able to select one of the user's current types. Ignores a target's Substitute.",
		shortDesc: "Changes user's type to resist target's last move.",
		id: "conversion2",
		name: "Conversion 2",
		pp: 30,
		priority: 0,
		isNotProtectable: true,
		onTryHit: function(target, source) {
			source.addVolatile("conversion2", target);
		},
		effect: {
			onStart: function(pokemon, target, move) {
				if (!target.lastMove) {
					this.add('-fail', pokemon);
					return false;
				}
				var possibleTypes = [];
				var attackType = this.getMove(target.lastMove).type;
				for (var type in this.data.TypeChart) {
					if (pokemon.hasType(type) || target.hasType(type)) continue;
					var typeCheck = this.data.TypeChart[type].damageTaken[attackType];
					if (typeCheck === 2 || typeCheck === 3) {
						possibleTypes.push(type);
					}
				}
				if (!possibleTypes.length) {
					this.add('-fail', pokemon);
					return false;
				}
				this.effectData.type = possibleTypes[this.random(possibleTypes.length)];
				this.add('-start', pokemon, 'typechange', this.effectData.type);
			},
			onRestart: function(pokemon, target, move) {
				if (!target.lastMove) {
					this.add('-fail', pokemon);
					return false;
				}
				var possibleTypes = [];
				var attackType = this.getMove(target.lastMove).type;
				for (var type in this.data.TypeChart) {
					if (pokemon.hasType(type) || target.hasType(type)) continue;
					var typeCheck = this.data.TypeChart[type].damageTaken[attackType];
					if (typeCheck === 2 || typeCheck === 3) {
						possibleTypes.push(type);
					}
				}
				if (!possibleTypes.length) {
					this.add('-fail', pokemon);
					return false;
				}
				this.effectData.type = possibleTypes[this.random(possibleTypes.length)];
				this.add('-start', pokemon, 'typechange', this.effectData.type);
			},
			onModifyPokemon: function(pokemon) {
				pokemon.types = [this.effectData.type];
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"copycat": {
		num: 383,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user uses the last move used by any Pokemon, including itself. Fails if no move has been used, or if the last move used was Assist, Bestow, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Transform, or Trick.",
		shortDesc: "Uses the last move used in the battle.",
		id: "copycat",
		isViable: true,
		name: "Copycat",
		pp: 20,
		priority: 0,
		onHit: function(pokemon) {
			var noCopycat = {assist:1, bestow:1, chatter:1, circlethrow:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, dragontail:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, ragepowder:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, transform:1, trick:1};
			if (!this.lastMove || noCopycat[this.lastMove]) {
				return false;
			}
			this.useMove(this.lastMove, pokemon);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"cosmicpower": {
		num: 322,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Boosts the user's Defense and Sp. Def by 1.",
		id: "cosmicpower",
		isViable: true,
		name: "Cosmic Power",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			def: 1,
			spd: 1
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"cottonguard": {
		num: 538,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Defense by 3 stages.",
		shortDesc: "Boosts the user's Defense by 3.",
		id: "cottonguard",
		isViable: true,
		name: "Cotton Guard",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		boosts: {
			def: 3
		},
		secondary: false,
		target: "self",
		type: "Grass"
	},
	"cottonspore": {
		num: 178,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Speed by 2 stages. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the target's Speed by 2.",
		id: "cottonspore",
		name: "Cotton Spore",
		pp: 40,
		priority: 0,
		boosts: {
			spe: -2
		},
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"counter": {
		num: 68,
		accuracy: 100,
		basePower: false,
		damageCallback: function(pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && this.getMove(pokemon.lastAttackedBy.move).category === 'Physical') {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			this.add('-fail',pokemon.id);
			return false;
		},
		category: "Physical",
		desc: "Deals damage to the last foe to hit the user with a physical attack this turn. The damage is equal to twice the HP lost by the user from that attack. If that foe's position is no longer in use, damage is done to a random foe in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by a foe's physical attack this turn. Makes contact. Priority -5.",
		shortDesc: "If hit by physical attack, returns double damage.",
		id: "counter",
		isViable: true,
		name: "Counter",
		pp: 20,
		priority: -5,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"covet": {
		num: 343,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If the attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one. Makes contact.",
		shortDesc: "If the user has no item, it steals the target's.",
		id: "covet",
		name: "Covet",
		pp: 40,
		priority: 0,
		isContact: true,
		onHit: function(target, source) {
			if (source.item) {
				return;
			}
			var yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Covet', '[of] '+target);
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"crabhammer": {
		num: 152,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio.",
		id: "crabhammer",
		isViable: true,
		name: "Crabhammer",
		pp: 10,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"crosschop": {
		num: 238,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio.",
		id: "crosschop",
		isViable: true,
		name: "Cross Chop",
		pp: 5,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"crosspoison": {
		num: 440,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to poison it and a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio. 10% chance to poison.",
		id: "crosspoison",
		isViable: true,
		name: "Cross Poison",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 10,
			status: 'psn'
		},
		critRatio: 2,
		target: "normal",
		type: "Poison"
	},
	"crunch": {
		num: 242,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 20% chance to lower its Defense by 1 stage. Makes contact.",
		shortDesc: "20% chance to lower the target's Defense by 1.",
		id: "crunch",
		isViable: true,
		name: "Crunch",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 20,
			boosts: {
				def: -1
			}
		},
		target: "normal",
		type: "Dark"
	},
	"crushclaw": {
		num: 306,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 50% chance to lower its Defense by 1 stage. Makes contact.",
		shortDesc: "50% chance to lower the target's Defense by 1",
		id: "crushclaw",
		name: "Crush Claw",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 50,
			boosts: {
				def: -1
			}
		},
		target: "normal",
		type: "Normal"
	},
	"crushgrip": {
		num: 462,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			return parseInt(120*target.hp/target.maxhp);
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power is equal to 120 * (target's current HP / target's maximum HP), rounded half down, but not less than 1. Makes contact.",
		shortDesc: "More power the more HP the target has left.",
		id: "crushgrip",
		name: "Crush Grip",
		pp: 5,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"curse": {
		num: 174,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If the user is not a Ghost-type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Ghost-type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for one adjacent target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected. Ignores a target's Substitute.",
		shortDesc: "Curses if Ghost, else +1 Atk, +1 Def, -1 Spe.",
		id: "curse",
		isViable: true,
		name: "Curse",
		pp: 10,
		priority: 0,
		isNotProtectable: true,
		volatileStatus: 'curse',
		onModifyMove: function(move, source, target) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				move.self = { boosts: {atk:1,def:1,spe:-1}};
				move.target = "self";
			}
		},
		effect: {
			onStart: function(pokemon, source) {
				this.add('-start', pokemon, 'Curse', '[of] '+source);
				this.directDamage(source.maxhp/2, source, source);
			},
			onResidualOrder: 10,
			onResidual: function(pokemon) {
				this.damage(pokemon.maxhp/4);
			}
		},
		secondary: false,
		target: "anyFoe",
		type: "Ghost"
	},
	"cut": {
		num: 15,
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact. (Field: Can be used to cut down thin trees.)",
		shortDesc: "No additional effect.",
		id: "cut",
		name: "Cut",
		pp: 30,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"darkpulse": {
		num: 399,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target with a 20% chance to flinch it.",
		shortDesc: "20% chance to flinch the target.",
		id: "darkpulse",
		isViable: true,
		name: "Dark Pulse",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch'
		},
		target: "any",
		type: "Dark"
	},
	"darkvoid": {
		num: 464,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		desc: "Puts all adjacent foes to sleep. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Puts the foe(s) to sleep.",
		id: "darkvoid",
		isViable: true,
		name: "Dark Void",
		pp: 10,
		priority: 0,
		status: 'slp',
		secondary: false,
		target: "foes",
		type: "Dark"
	},
	"defendorder": {
		num: 455,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Boosts the user's Defense and Sp. Def by 1.",
		id: "defendorder",
		isViable: true,
		name: "Defend Order",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		boosts: {
			def: 1,
			spd: 1
		},
		secondary: false,
		target: "self",
		type: "Bug"
	},
	"defensecurl": {
		num: 111,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 1 stage. As long as the user remains active, the power of the user's Ice Ball and Rollout will be doubled (this effect is not stackable).",
		shortDesc: "Boosts the user's Defense by 1.",
		id: "defensecurl",
		name: "Defense Curl",
		pp: 40,
		priority: 0,
		isSnatchable: true,
		boosts: {
			def: 1
		},
		volatileStatus: 'DefenseCurl',
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"defog": {
		num: 432,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Evasion by 1 stage. Whether or not the target's Evasion was affected, the effects of Reflect, Light Screen, Safeguard, Mist, Spikes, Toxic Spikes, and Stealth Rock end for the target's side. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute, although a Substitute will still block the Evasion lowering.",
		shortDesc: "Removes target's hazards, lowers Evasion by 1.",
		id: "defog",
		name: "Defog",
		pp: 15,
		priority: 0,
		isBounceable: true,
		onHit: function(pokemon) {
			if (!pokemon.volatiles['substitute']) this.boost({evasion:-1});
			var sideConditions = {reflect:1, lightscreen:1, safeguard:1, mist:1, spikes:1, toxicspikes:1, stealthrock:1};
					for (var i in sideConditions) {
						if (pokemon.side.removeSideCondition(i)) {
							this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Defog', '[of] '+pokemon);
						}
					}
		},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"destinybond": {
		num: 194,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the user's next turn, if a foe's attack knocks the user out, that foe faints as well, unless the attack was Doom Desire or Future Sight. Ignores a target's Substitute.",
		shortDesc: "If an opponent knocks out the user, it also faints.",
		id: "destinybond",
		isViable: true,
		name: "Destiny Bond",
		pp: 5,
		priority: 0,
		volatileStatus: 'destinybond',
		effect: {
			onStart: function(pokemon) {
				this.add('-message', pokemon.name+' is trying to take its foe down with it! (placeholder)');
			},
			onFaint: function(target, source, effect) {
				if (!source || !effect) return;
				if (effect.effectType === 'Move' && target.lastMove === 'destinybond') {
					this.add('-message', target.name+' took its attacker down with it! (placeholder)');
					source.faint();
				}
			},
			onBeforeMovePriority: -10,
			onBeforeMove: function(pokemon) {
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			}
		},
		secondary: false,
		target: "self",
		type: "Ghost"
	},
	"detect": {
		num: 197,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most attacks made by other Pokemon during this turn. This attack has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used. X resets to 1 if this attack fails or if the user's last used move is not Detect, Endure, Protect, Quick Guard, or Wide Guard. If X is 256 or more, this move has a 1/(2^32) chance of being successful. Fails if the user moves last this turn. Priority +4.",
		shortDesc: "Prevents moves from affecting the user for a turn.",
		id: "detect",
		isViable: true,
		name: "Detect",
		pp: 5,
		priority: 4,
		stallingMove: true, // decrease success of repeated use to 50%
		volatileStatus: 'protect',
		onTryHit: function(pokemon) {
			if (!this.willAct()) {
				return false;
			}
			var counter = 1;
			if (pokemon.volatiles['stall']) {
				counter = pokemon.volatiles['stall'].counter || 1;
			}
			if (counter >= 256) {
				return (this.random()*4294967296 < 1); // 2^32 - special-cased because Battle.random(n) can't handle n > 2^16 - 1
			}
			this.debug("Success chance: "+Math.round(100/counter)+"%");
			return (this.random(counter) === 0);
		},
		onHit: function(pokemon) {
			pokemon.addVolatile('stall');
		},
		secondary: false,
		target: "self",
		type: "Fighting"
	},
	"dig": {
		num: 91,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. This attack charges on the first turn and strikes on the second. On the first turn, the user avoids all attacks other than Earthquake and Magnitude but takes double damage from them, and is also unaffected by Hail and Sandstorm damage. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn. Makes contact. (Field: Can be used to escape a cave quickly.)",
		shortDesc: "Digs underground turn 1, strikes turn 2.",
		id: "dig",
		name: "Dig",
		pp: 10,
		priority: 0,
		isContact: true,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'dig',
			onImmunity: function(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onSourceModifyMove: function(move) {
				if (move.target === 'foeSide') return;
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					// should not normally be done in ModifyMove event,
					// but it's faster to do this here than in
					// onFoeBasePower
					if (!move.basePowerModifier) move.basePowerModifier = 1;
					move.basePowerModifier *= 2;
					return;
				} else if (move.id === 'fissure') {
					return;
				}
				move.accuracy = 0;
			}
		},
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"disable": {
		num: 50,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For 4 turns, one adjacent target's last move used becomes disabled. Fails if one of the target's moves is already disabled, if the target has not moved, or if the target no longer knows the move. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute.",
		shortDesc: "For 4 turns, disables the target's last move used.",
		id: "disable",
		name: "Disable",
		pp: 20,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'disable',
		effect: {
			duration: 4,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(pokemon) {
				if (!this.willMove(pokemon)) {
					this.effectData.duration++;
				}
				if (!pokemon.lastMove) {
					this.debug('pokemon hasn\'t moved yet');
					return false;
				}
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++) {
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
			onEnd: function(pokemon) {
				this.add('-end', pokemon, 'Disable');
			},
			onBeforeMove: function(attacker, defender, move) {
				if (move.id === this.effectData.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onModifyPokemon: function(pokemon) {
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++) {
					if (moves[i].id === this.effectData.move) {
						moves[i].disabled = true;
					}
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"discharge": {
		num: 435,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to all adjacent Pokemon with a 30% chance to paralyze each.",
		shortDesc: "30% chance to paralyze adjacent Pokemon.",
		id: "discharge",
		isViable: true,
		name: "Discharge",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "adjacent",
		type: "Electric"
	},
	"dive": {
		num: 291,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. This attack charges on the first turn and strikes on the second. On the first turn, the user avoids all attacks other than Surf and Whirlpool but takes double damage from them, and is also unaffected by Hail and Sandstorm damage. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn. Makes contact. (Field: Can be used to dive underwater.)",
		shortDesc: "Dives underwater turn 1, strikes turn 2.",
		id: "dive",
		name: "Dive",
		pp: 10,
		priority: 0,
		isContact: true,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'dive',
			onImmunity: function(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onSourceModifyMove: function(move) {
				if (move.target === 'foeSide') return;
				if (move.id === 'surf' || move.id === 'whirlpool') {
					// should not normally be done in ModifyMove event,
					// but Surf and Whirlpool have static base power, and
					// it's faster to do this here than in
					// onFoeBasePower
					move.basePower *= 2;
					return;
				}
				move.accuracy = 0;
			}
		},
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"dizzypunch": {
		num: 146,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 20% chance to confuse it. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "20% chance to confuse the target.",
		id: "dizzypunch",
		name: "Dizzy Punch",
		pp: 10,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: {
			chance: 20,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Normal"
	},
	"doomdesire": {
		num: 353,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "Deals damage to one adjacent target two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Future Sight is already in effect for the target's position. This move ignores Protect and Detect.",
		shortDesc: "Hits two turns after being used.",
		id: "doomdesire",
		isViable: true,
		name: "Doom Desire",
		pp: 5,
		priority: 0,
		isNotProtectable: true,
		onTryHit: function(target, source) {
			source.side.addSideCondition('futuremove');
			if (source.side.sideConditions['futuremove'].positions[source.position]) {
				return false;
			}
			source.side.sideConditions['futuremove'].positions[source.position] = {
				duration: 3,
				move: 'doomdesire',
				targetPosition: target.position,
				source: source,
				moveData: {
					basePower: 140,
					category: "Special",
					type: 'Steel'
				}
			};
			this.add('-start', source, 'Doom Desire');
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"doubleedge": {
		num: 38,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If the target lost HP, the user takes recoil damage equal to 33% that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 1/3 recoil.",
		id: "doubleedge",
		isViable: true,
		name: "Double-Edge",
		pp: 15,
		priority: 0,
		isContact: true,
		recoil: [1,3],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"doublehit": {
		num: 458,
		accuracy: 90,
		basePower: 35,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits twice. If the first hit breaks the target's Substitute, it will take damage for the second hit. Makes contact.",
		shortDesc: "Hits 2 times in one turn.",
		id: "doublehit",
		name: "Double Hit",
		pp: 10,
		priority: 0,
		isContact: true,
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"doublekick": {
		num: 24,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits twice. If the first hit breaks the target's Substitute, it will take damage for the second hit. Makes contact.",
		shortDesc: "Hits 2 times in one turn.",
		id: "doublekick",
		name: "Double Kick",
		pp: 30,
		priority: 0,
		isContact: true,
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"doubleslap": {
		num: 3,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 35% chance to hit two or three times, and a 15% chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Makes contact.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "doubleslap",
		name: "DoubleSlap",
		pp: 10,
		priority: 0,
		isContact: true,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"doubleteam": {
		num: 104,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Evasion by 1 stage.",
		shortDesc: "Boosts the user's Evasion by 1.",
		id: "doubleteam",
		name: "Double Team",
		pp: 15,
		priority: 0,
		isSnatchable: true,
		boosts: {
			evasion: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"dracometeor": {
		num: 434,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Deals damage to one adjacent target and lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "dracometeor",
		isViable: true,
		name: "Draco Meteor",
		pp: 5,
		priority: 0,
		self: {
			boosts: {
				spa: -2
			}
		},
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"dragonbreath": {
		num: 225,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to paralyze it.",
		shortDesc: "30% chance to paralyze the target.",
		id: "dragonbreath",
		name: "DragonBreath",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Dragon"
	},
	"dragonclaw": {
		num: 337,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "dragonclaw",
		isViable: true,
		name: "Dragon Claw",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"dragondance": {
		num: 349,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Speed by 1 stage.",
		shortDesc: "Boosts the user's Attack and Speed by 1.",
		id: "dragondance",
		isViable: true,
		name: "Dragon Dance",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1,
			spe: 1
		},
		secondary: false,
		target: "self",
		type: "Dragon"
	},
	"dragonpulse": {
		num: 406,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target.",
		shortDesc: "No additional effect.",
		id: "dragonpulse",
		isViable: true,
		name: "Dragon Pulse",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "any",
		type: "Dragon"
	},
	"dragonrage": {
		num: 82,
		accuracy: 100,
		basePower: false,
		damage: 40,
		category: "Special",
		desc: "Deals damage to one adjacent target equal to 40HP.",
		shortDesc: "Always does 40 HP of damage.",
		id: "dragonrage",
		name: "Dragon Rage",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"dragonrush": {
		num: 407,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 20% chance to flinch it. Makes contact.",
		shortDesc: "20% chance to flinch the target.",
		id: "dragonrush",
		isViable: true,
		name: "Dragon Rush",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Dragon"
	},
	"dragontail": {
		num: 525,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Ability Suction Cups, or has a Substitute. Makes contact. Priority -6. (Wild battles: The battle ends as long as it is not a double battle and the user's level is not less than the opponent's level.)",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "dragontail",
		isViable: true,
		name: "Dragon Tail",
		pp: 10,
		priority: -6,
		isContact: true,
		forceSwitch: true,
		target: "normal",
		type: "Dragon"
	},
	"drainpunch": {
		num: 409,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Deals damage to one adjacent target. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "drainpunch",
		isViable: true,
		name: "Drain Punch",
		pp: 10,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"dreameater": {
		num: 138,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Deals damage to one adjacent target, if it is asleep. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User gains 1/2 HP inflicted. Sleeping target only.",
		id: "dreameater",
		name: "Dream Eater",
		pp: 15,
		priority: 0,
		drain: [1,2],
		onTryHit: function(target) {
			if (target.status !== 'slp') {
				this.add('-immune', target.id, '[msg]');
				return null;
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"drillpeck": {
		num: 65,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "drillpeck",
		isViable: true,
		name: "Drill Peck",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"drillrun": {
		num: 529,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio.",
		id: "drillrun",
		isViable: true,
		name: "Drill Run",
		pp: 10,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"dualchop": {
		num: 530,
		accuracy: 90,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits twice. If the first hit breaks the target's Substitute, it will take damage for th