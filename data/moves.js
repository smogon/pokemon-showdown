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
		target: "allAdjacentFoes",
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
		pp: 20,
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
		isBullet: true,
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
			if (!pokemon.item) {
				this.debug("Power doubled for no item");
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
		target: "adjacentAllyOrSelf",
		type: "Normal"
	},
	"aerialace": {
		num: 332,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target and does not check accuracy. Makes contact.",
		shortDesc: "This move does not check accuracy.",
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
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to take its turn immediately after the user this turn, no matter the priority of its selected move. Fails if the target would have moved next anyway, or if the target already moved this turn. This move ignores Protect and Detect. Ignores a target's Substitute.",
		shortDesc: "The target makes its move right after the user.",
		id: "afteryou",
		name: "After You",
		pp: 15,
		priority: 0,
		isNotProtectable: true,
		onHit: function(target) {
			if (target.side.active.length < 2) return false; // fails in singles
			var decision = this.willMove(target);
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
		basePower: 60,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio. Hits adjacent foes.",
		id: "aircutter",
		name: "Air Cutter",
		pp: 25,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "allAdjacentFoes",
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
		pp: 15,
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
		basePower: 0,
		category: "Status",
		desc: "The user swaps positions with its ally on the far side of the field. Fails if there is no Pokemon at that position, if the user is the only Pokemon on its side, or if the user is in the middle. Priority +1.",
		shortDesc: "Switches position with the ally on the far side.",
		id: "allyswitch",
		name: "Ally Switch",
		pp: 15,
		priority: 1,
		onTryHit: function(source) {
			if (source.side.active.length === 1) return false;
			if (source.side.active.length === 3 && source.position === 1) return false;
		},
		onHit: function(pokemon) {
			var newPosition = (pokemon.position === 0 ? pokemon.side.active.length - 1 : 0);
			if (!pokemon.side.active[newPosition]) return false;
			if (pokemon.side.active[newPosition].fainted) return false;
			this.swapPosition(pokemon, newPosition, 'move: Ally Switch');
		},
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
		shortDesc: "10% chance to boost all stats by 1 (not acc/eva).",
		id: "ancientpower",
		name: "Ancient Power",
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
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Makes contact.",
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
		onHit: function(pokemon, source) {
			var side = pokemon.side;
			for (var i=0; i<side.pokemon.length; i++) {
				side.pokemon[i].status = '';
			}
			this.add('-cureteam',source,'[from] move: Aromatherapy');
		},
		target: "allyTeam",
		type: "Grass"
	},
	"aromaticmist": {
		num: 597,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user raises the Special Defense stat of itself and ally Pokemon by 1.",
		shortDesc: "Raises user's and allies' Special Defense by 1.",
		id: "aromaticmist",
		name: "Aromatic Mist",
		pp: 20,
		priority: 0,
		onHit: function(pokemon) {
			for (var p in pokemon.side.active) {
				this.boost({spd: 1}, pokemon.side.active[p], pokemon.side.active[p], this.getMove("aromaticmist"));
			}
		},
		secondary: false,
		target: "self",
		type: "Fairy"
	},
	"assist": {
		num: 274,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "A random move among those known by the user's party members is selected for use. Does not select Assist, Belch, Bestow, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Transform, or Trick.",
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
						assist:1, belch:1, bestow:1, bounce:1, chatter:1, circlethrow:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, dig:1, dive:1, dragontail:1, endure:1, feint:1, fly:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, phantomforce:1, protect:1, ragepowder:1, roar:1, shadowforce:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, transform:1, trick:1, whirlwind:1
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
		basePower: 60,
		basePowerCallback: function(pokemon, target) {
			if (pokemon.volatiles.assurance && pokemon.volatiles.assurance.hurt) {
				this.debug('Boosted for being damaged this turn');
				return 120;
			}
			return 60;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power doubles if the target has already taken damage this turn, other than from Pain Split. Makes contact.",
		shortDesc: "Power doubles if target was damaged this turn.",
		id: "assurance",
		name: "Assurance",
		pp: 10,
		priority: 0,
		beforeTurnCallback: function(pokemon, target) {
			pokemon.addVolatile('assurance');
			pokemon.volatiles.assurance.position = target.position;
		},
		effect: {
			duration: 1,
			onFoeAfterDamage: function(damage, target) {
				if (target.position == this.effectData.position) {
					this.debug('damaged this turn');
					this.effectData.hurt = true;
				}
			}
		},
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
		volatileStatus: 'attract',
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(pokemon, source, effect) {
				if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
					this.debug('incompatible gender');
					return false;
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.id === 'cutecharm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] '+source);
				} else if (effect.id === 'destinyknot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] '+source);
				} else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onBeforeMove: function(pokemon, target, move) {
				if (this.effectData.source && !this.effectData.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on '+pokemon);
					pokemon.removeVolatile('attract');
					return;
				}
				this.add('-activate', pokemon, 'Attract', '[of] '+this.effectData.source);
				if (this.random(2) === 0) {
					this.add('cant', pokemon, 'Attract');
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
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target and does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "aurasphere",
		isViable: true,
		name: "Aura Sphere",
		pp: 20,
		priority: 0,
		isPulseMove: true,
		isBullet: true,
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
		basePower: 0,
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
					this.add('-start', pokemon, 'Autotomize');
				}
			},
			onRestart: function(pokemon)		 {
				if (pokemon.weightkg !== 0.1) {
					this.effectData.multiplier++;
					this.add('-start', pokemon, 'Autotomize');
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
		basePowerCallback: function(pokemon, target) {
			if (target.lastDamage > 0 && pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn) {
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
	"babydolleyes": {
		num: 608,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 1 stage. Priority +1.",
		shortDesc: "Lowers foe's Attack by 1. Priority +1.",
		id: "babydolleyes",
		name: "Baby-Doll Eyes",
		pp: 30,
		priority: 1,
		boosts: {
			atk: -1
		},
		secondary: false,
		target: "normal",
		type: "Fairy"
	},
	"barrage": {
		num: 140,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "barrage",
		name: "Barrage",
		pp: 20,
		priority: 0,
		isBullet: true,
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
		pp: 20,
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
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			pokemon.addVolatile('beatup');
			if (!pokemon.side.pokemon[pokemon.volatiles.beatup.index]) return null;
			return 5 + Math.floor(pokemon.side.pokemon[pokemon.volatiles.beatup.index].template.baseStats.atk / 10);
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits one time for the user and one time for each unfainted Pokemon without a major status problem in the user's party. The power of each hit is equal to 5+(X/10), where X is each participating Pokemon's base Attack; each hit is considered to come from the user.",
		shortDesc: "All healthy allies aid in damaging the target.",
		id: "beatup",
		name: "Beat Up",
		pp: 10,
		priority: 0,
		multihit: 6,
		effect: {
			duration: 1,
			onStart: function(pokemon) {
				this.effectData.index = 0;
				while (pokemon.side.pokemon[this.effectData.index] !== pokemon &&
					(!pokemon.side.pokemon[this.effectData.index] ||
					pokemon.side.pokemon[this.effectData.index].fainted ||
					pokemon.side.pokemon[this.effectData.index].status)) {
					this.effectData.index++;
				}
			},
			onRestart: function(pokemon) {
				do {
					this.effectData.index++;
					if (this.effectData.index >= 6) break;
				} while (!pokemon.side.pokemon[this.effectData.index] ||
						pokemon.side.pokemon[this.effectData.index].fainted ||
						pokemon.side.pokemon[this.effectData.index].status);
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"belch": {
		num: 562,
		accuracy: 90,
		basePower: 120,
		category: "Special",
		desc: "The user must eat a Berry to use this move.",
		shortDesc: "User must eat a Berry to use this move.",
		id: "belch",
		name: "Belch",
		pp: 10,
		priority: 0,
		onTryHit: function(target, pokemon) {
			if (!pokemon.ateBerry) {
				return false;
			}
		},
		secondary: false,
		target: "normal",
		type: "Poison"
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
		basePower: 0,
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
			this.add('-item', target, yourItem.name, '[from] move: Bestow', '[of] '+source);
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"bide": {
		num: 117,
		accuracy: true,
		basePower: 0,
		category: "Physical",
		desc: "The user spends two turns locked into this move and then, on the second turn after using this move, the user attacks the last Pokemon that hit it, inflicting double the damage in HP it lost during the two turns. If the last Pokemon that hit it is no longer on the field, the user attacks a random foe instead. If the user is prevented from moving during this move's use, the effect ends. This move does not check accuracy. Makes contact. Priority +1.",
		shortDesc: "Waits 2 turns; deals double the damage taken.",
		id: "bide",
		name: "Bide",
		pp: 10,
		priority: 1,
		isContact: true,
		volatileStatus: 'bide',
		affectedByImmunities: false,
		effect: {
			duration: 3,
			onLockMove: 'bide',
			onStart: function(pokemon) {
				this.effectData.totalDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onDamagePriority: -101,
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
						this.add('-end', pokemon, 'Bide');
						this.add('-fail', pokemon);
						return false;
					}
					this.add('-end', pokemon, 'Bide');
					var target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					if (!target.runImmunity('Normal')) {
						this.add('-immune', target, '[msg]');
						return false;
					}
					this.moveHit(target, pokemon, 'bide', {damage: this.effectData.totalDamage*2});
					return false;
				}
				this.add('-activate', pokemon, 'Bide');
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
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move. Makes contact.",
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
		isBiteAttack: true,
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
		basePower: 110,
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
		target: "allAdjacentFoes",
		type: "Ice"
	},
	"block": {
		num: 335,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents one adjacent target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "The target cannot switch out.",
		id: "block",
		isViable: true,
		name: "Block",
		pp: 5,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			if (!target.addVolatile('trapped')) {
				this.add('-fail', target);
			}
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
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
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
	"boomburst": {
		num: 586,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "Deals damage to all Pokemon within range, including any allies.",
		shortDesc: "Hits adjacent Pokemon, including allies.",
		id: "boomburst",
		name: "Boomburst",
		pp: 10,
		priority: 0,
		isSoundBased: true,
		secondary: false,
		target: "allAdjacent",
		type: "Normal"
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
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'bounce',
			onAccuracy: function(accuracy, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'helpinghand') {
					return;
				}
				return 0;
			},
			onSourceBasePower: function(basePower, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
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
		shortDesc: "Has 33% recoil.",
		id: "bravebird",
		isViable: true,
		name: "Brave Bird",
		pp: 15,
		priority: 0,
		isContact: true,
		recoil: [33,100],
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
		category: "Special",
		desc: "Deals damage to one adjacent target. Power doubles if the target has less than or equal to half of its maximum HP remaining.",
		shortDesc: "Power doubles if the target's HP is 50% or less.",
		id: "brine",
		name: "Brine",
		pp: 10,
		priority: 0,
		onBasePowerPriority: 4,
		onBasePower: function(basePower, pokemon, target) {
			if (target.hp * 2 < target.maxhp) {
				return this.chainModify(2);
			}
		},
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"bubble": {
		num: 145,
		accuracy: 100,
		basePower: 40,
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
		target: "allAdjacentFoes",
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
		name: "Bubble Beam",
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
				source.ateBerry = true;
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
		target: "allAdjacent",
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
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "bulletseed",
		isViable: true,
		name: "Bullet Seed",
		pp: 30,
		priority: 0,
		isBullet: true,
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
		desc: "The user's type changes based on the battle terrain: Electric in Electric Terrain, Grass in Grassy Terrain, Fairy in Misty Terrain, and Normal in plain terrain. Fails if the user's type cannot be changed or if the user is already purely that type.",
		shortDesc: "Changes user's type by terrain (default Normal).",
		id: "camouflage",
		name: "Camouflage",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		onHit: function(target) {
			var newType = 'Normal';
			if (this.isTerrain('electricterrain')) newType = 'Electric';
			else if (this.isTerrain('grassyterrain')) newType = 'Grass';
			else if (this.isTerrain('mistyterrain')) newType = 'Fairy';

			if (!target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
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
		target: "allAdjacentFoes",
		type: "Normal"
	},
	"celebrate": {
		num: -6,
		gen: 6,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "No in-game effect.",
		shortDesc: "No in-game effect.",
		id: "celebrate",
		name: "Celebrate",
		pp: 40,
		priority: 0,
		onTryHit: function(target, source) {
			this.add('-activate', target, 'move: Celebrate');
			return null;
		},
		secondary: false,
		target: "self",
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
			this.add('-activate', pokemon, 'move: Charge');
		},
		effect: {
			duration: 2,
			onRestart: function(pokemon) {
				this.effectData.duration = 2;
			},
			onBasePowerPriority: 3,
			onBasePower: function(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('charge boost');
					return this.chainModify(2);
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
		type: "Fairy"
	},
	"chatter": {
		num: 448,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target with a 100% chance to confuse it.",
		shortDesc: "100% chance to confuse the target.",
		id: "chatter",
		name: "Chatter",
		pp: 20,
		priority: 0,
		isSoundBased: true,
		onModifyMove: function(move, pokemon) {
			if (pokemon.template.species !== 'Chatot') delete move.secondaries;
		},
		secondary: {
			chance: 100,
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
		desc: "Deals damage to one adjacent target and ignores the target's stat stage changes, including evasion. Makes contact.",
		shortDesc: "Ignores the target's stat stage changes.",
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
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move. Makes contact.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "clamp",
		name: "Clamp",
		pp: 15,
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
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack, Defense, and accuracy by 1 stage.",
		shortDesc: "Boosts user's Attack, Defense, and accuracy by 1.",
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
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
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
	"confide": {
		num: 590,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Attack stat by 1.",
		shortDesc: "Lowers the target's Sp. Atk by 1.",
		id: "confide",
		name: "Confide",
		pp: 20,
		priority: 0,
		isNotProtectable: true,
		boosts: {
			spa: -1
		},
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
		onHit: function(target) {
			var possibleTypes = target.moveset.map(function(val){
				var move = this.getMove(val.id);
				if (move.id !== 'conversion' && !target.hasType(move.type)) {
					return move.type;
				}
			}, this).compact();
			if (!possibleTypes.length) {
				return false;
			}
			var type = possibleTypes[this.random(possibleTypes.length)];

			if (!target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
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
		desc: "The user's type changes to match a type that resists or is immune to the type of the last move used by one adjacent target, but not either of its current types. The determined type of the move is used rather than the original type. Fails if the user cannot change its type, or if this move would only be able to select one of the user's current types. This move ignores Protect and Detect. Ignores a target's Substitute.",
		shortDesc: "Changes user's type to resist target's last move.",
		id: "conversion2",
		name: "Conversion 2",
		pp: 30,
		priority: 0,
		isNotProtectable: true,
		onHit: function(target, source) {
			if (!target.lastMove) {
				return false;
			}
			var possibleTypes = [];
			var attackType = this.getMove(target.lastMove).type;
			for (var type in this.data.TypeChart) {
				if (source.hasType(type) || target.hasType(type)) continue;
				var typeCheck = this.data.TypeChart[type].damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(type);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			var type = possibleTypes[this.random(possibleTypes.length)];

			if (!source.setType(type)) return false;
			this.add('-start', source, 'typechange', type);
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
			var noCopycat = {assist:1, bestow:1, chatter:1, circlethrow:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, dragontail:1, endure:1, feint:1, focuspunch:1, followme:1, helpinghand:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, ragepowder:1, roar:1, sketch:1, sleeptalk:1, snatch:1, struggle:1, switcheroo:1, thief:1, transform:1, trick:1, whirlwind:1};
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
		basePower: 0,
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
		isPowder: true,
		boosts: {
			spe: -2
		},
		onTryHit: function(pokemon) {
			if (!pokemon.runImmunity('powder')) return false;
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"counter": {
		num: 68,
		accuracy: 100,
		basePower: 0,
		damageCallback: function(pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && this.getCategory(pokemon.lastAttackedBy.move) === 'Physical') {
				return 2 * pokemon.lastAttackedBy.damage;
			}
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
		target: "scripted",
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
		pp: 25,
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
		basePower: 100,
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
	"craftyshield": {
		num: 578,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Protects the user and allies from status moves. Priority +3.",
		shortDesc: "Protects allies from status moves this turn.",
		id: "craftyshield",
		isViable: true,
		name: "Crafty Shield",
		pp: 10,
		priority: 3,
		stallingMove: true, // Note: stallingMove is not used anywhere.
		volatileStatus: 'craftyshield',
		onTryHit: function(target, source, move) {
			return !!this.willAct() && this.runEvent('StallMove', target);
		},
		onHit: function(pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'Crafty Shield');
			},
			onTryHitPriority: 3,
			onTryHit: function(target, source, move) {
				if (move.breaksProtect) {
					target.removeVolatile('Crafty Shield');
					return;
				}
				if (move && (move.target === 'self' || move.category !== 'Status')) return;
				this.add('-activate', target, 'Crafty Shield');
				return null;
			}
		},
		secondary: false,
		target: "self",
		type: "Fairy"
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
		isBiteAttack: true,
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
		shortDesc: "50% chance to lower the target's Defense by 1.",
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
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			return Math.floor(Math.floor((120 * (100 * Math.floor(target.hp * 4096 / target.maxhp)) + 2048 - 1) / 4096) / 100) || 1;
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
		desc: "If the user is not a Ghost-type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Ghost-type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for one adjacent target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected. This move ignores Protect and Detect. Ignores a target's Substitute.",
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
				delete move.onHit;
				move.self = { boosts: {atk:1,def:1,spe:-1}};
				move.target = move.nonGhostTarget;
			}
		},
		onTryHit: function(target, source, move) {
			if (move.volatileStatus && target.volatiles.curse) return false;
		},
		onHit: function(target, source) {
			this.directDamage(source.maxhp/2, source, source);
		},
		effect: {
			onStart: function(pokemon, source) {
				this.add('-start', pokemon, 'Curse', '[of] '+source);
			},
			onResidualOrder: 10,
			onResidual: function(pokemon) {
				this.damage(pokemon.maxhp/4);
			}
		},
		secondary: false,
		target: "normal",
		nonGhostTarget: "self",
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
		isPulseMove: true,
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
		target: "allAdjacentFoes",
		type: "Dark"
	},
	"dazzlinggleam": {
		num: 605,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to all adjacent foes.",
		shortDesc: "No additional effect. Hits adjacent foes.",
		id: "dazzlinggleam",
		isViable: true,
		name: "Dazzling Gleam",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Fairy"
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
		desc: "Lowers one adjacent target's evasion by 1 stage. Whether or not the target's evasion was affected, the effects of Reflect, Light Screen, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the user's and the target's sides. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute, although a Substitute will still block the evasion lowering.",
		shortDesc: "Removes hazards from field. Lowers foe's evasion.",
		id: "defog",
		name: "Defog",
		pp: 15,
		priority: 0,
		isBounceable: true,
		onHit: function(target, source) {
			if (!target.volatiles['substitute']) this.boost({evasion:-1});
			var sideConditions = {reflect:1, lightscreen:1, safeguard:1, mist:1, spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1};
			for (var i in sideConditions) {
				if (target.side.removeSideCondition(i)) {
					this.add('-sideend', target.side, this.getEffect(i).name, '[from] move: Defog', '[of] '+target);
				}
			}
			for (var i in sideConditions) {
				if (i === 'reflect' || i === 'lightscreen') continue;
				if (source.side.removeSideCondition(i)) {
					this.add('-sideend', source.side, this.getEffect(i).name, '[from] move: Defog', '[of] '+source);
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
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
			onFaint: function(target, source, effect) {
				if (!source || !effect) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove && target.lastMove === 'destinybond') {
					this.add('-activate', target, 'Destiny Bond');
					source.faint();
				}
			},
			onBeforeMovePriority: 100,
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
		shortDesc: "Prevents moves from affecting the user this turn.",
		id: "detect",
		isViable: true,
		name: "Detect",
		pp: 5,
		priority: 4,
		stallingMove: true, // Note: stallingMove is not used anywhere.
		volatileStatus: 'protect',
		onTryHit: function(pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function(pokemon) {
			pokemon.addVolatile('stall');
		},
		secondary: false,
		target: "self",
		type: "Fighting"
	},
	"diamondstorm": {
		num: -1,
		gen: 6,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 50% chance to raise the user's Defense by 1 stage.",
		shortDesc: "50% chance to boost the user's Def by 1.",
		id: "diamondstorm",
		name: "Diamond Storm",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1
				}
			}
		},
		target: "normal",
		type: "Rock"
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
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
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
			onAccuracy: function(accuracy, target, source, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude' || move.id === 'helpinghand') {
					return;
				}
				return 0;
			},
			onSourceModifyDamage: function(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
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
	"disarmingvoice": {
		num: 574,
		accuracy: true,
		basePower: 40,
		category: "Special",
		desc: "This attack never misses.",
		shortDesc: "This attack never misses.",
		id: "disarmingvoice",
		name: "Disarming Voice",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fairy"
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
		target: "allAdjacent",
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
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
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
			onAccuracy: function(accuracy, target, source, move) {
				if (move.id === 'surf' || move.id === 'whirlpool' || move.id === 'helpinghand') {
					return;
				}
				return 0;
			},
			onSourceModifyDamage: function(damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
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
		isFutureMove: true,
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
		shortDesc: "Has 33% recoil.",
		id: "doubleedge",
		isViable: true,
		name: "Double-Edge",
		pp: 15,
		priority: 0,
		isContact: true,
		recoil: [33,100],
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
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Makes contact.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "doubleslap",
		name: "Double Slap",
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
		desc: "Raises the user's evasion by 1 stage.",
		shortDesc: "Boosts the user's evasion by 1.",
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
		basePower: 130,
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
		name: "Dragon Breath",
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
		basePower: 85,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target.",
		shortDesc: "No additional effect.",
		id: "dragonpulse",
		isViable: true,
		name: "Dragon Pulse",
		pp: 10,
		priority: 0,
		isPulseMove: true,
		secondary: false,
		target: "any",
		type: "Dragon"
	},
	"dragonrage": {
		num: 82,
		accuracy: 100,
		basePower: 0,
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
	"drainingkiss": {
		num: 577,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Deals damage to one adjacent target. The user recovers 75% of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. Makes contact.",
		shortDesc: "User recovers 75% of the damage dealt.",
		id: "drainingkiss",
		isViable: true,
		name: "Draining Kiss",
		pp: 10,
		priority: 0,
		isContact: true,
		drain: [3,4],
		secondary: false,
		target: "normal",
		type: "Fairy"
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
				this.add('-immune', target, '[msg]');
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
		desc: "Deals damage to one adjacent target and hits twice. If the first hit breaks the target's Substitute, it will take damage for the second hit. Makes contact.",
		shortDesc: "Hits 2 times in one turn.",
		id: "dualchop",
		isViable: true,
		name: "Dual Chop",
		pp: 15,
		priority: 0,
		isContact: true,
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"dynamicpunch": {
		num: 223,
		accuracy: 50,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 100% chance to confuse it. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "100% chance to confuse the target.",
		id: "dynamicpunch",
		name: "Dynamic Punch",
		pp: 5,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: {
			chance: 100,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Fighting"
	},
	"earthpower": {
		num: 414,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to lower its Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def. by 1.",
		id: "earthpower",
		isViable: true,
		name: "Earth Power",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 10,
			boosts: {
				spd: -1
			}
		},
		target: "normal",
		type: "Ground"
	},
	"earthquake": {
		num: 89,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to all adjacent Pokemon. Power doubles against Pokemon using Dig.",
		shortDesc: "Hits adjacent Pokemon. Power doubles on Dig.",
		id: "earthquake",
		isViable: true,
		name: "Earthquake",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "allAdjacent",
		type: "Ground"
	},
	"echoedvoice": {
		num: 497,
		accuracy: 100,
		basePower: 40,
		basePowerCallback: function() {
			if (this.pseudoWeather.echoedvoice) {
				return 40 * this.pseudoWeather.echoedvoice.multiplier;
			}
			return 40;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. For every consecutive turn that this move is used by at least one Pokemon, this move's power is multiplied by the number of turns to pass, but not more than 5. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "Power increases when used on consecutive turns.",
		id: "echoedvoice",
		name: "Echoed Voice",
		pp: 15,
		priority: 0,
		onTry: function() {
			this.addPseudoWeather('echoedvoice');
		},
		effect: {
			duration: 2,
			onStart: function() {
				this.effectData.multiplier = 1;
			},
			onRestart: function() {
				if (this.effectData.duration !== 2) {
					this.effectData.duration = 2;
					if (this.effectData.multiplier < 5) {
						this.effectData.multiplier++;
					}
				}
			}
		},
		isSoundBased: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"eerieimpulse": {
		num: 598,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Harshly lowers the target's Special Attack stat.",
		shortDesc: "Lowers the target's Sp. Atk by 2.",
		id: "eerieimpulse",
		name: "Eerie Impulse",
		pp: 15,
		priority: 0,
		boosts: {
			spa: -2
		},
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"eggbomb": {
		num: 121,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "No additional effect.",
		id: "eggbomb",
		name: "Egg Bomb",
		pp: 10,
		priority: 0,
		isBullet: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"electricterrain": {
		num: 604,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For five turns, Pokemon on the ground cannot fall asleep. Their Electric-type moves are powered up by 50%.",
		shortDesc: "If on ground, can't sleep + Electric moves stronger.",
		id: "electricterrain",
		name: "Electric Terrain",
		pp: 10,
		priority: 0,
		terrain: 'electricterrain',
		effect: {
			duration: 5,
			onSetStatus: function(status, target, source, effect) {
				if (status.id === 'slp' && target.runImmunity('Ground')) {
					this.debug('Interrupting sleep from Electric Terrain');
					return false;
				}
			},
			onBasePower: function(basePower, attacker, defender, move) {
				if (move.type === 'Electric' && attacker.runImmunity('Ground')) {
					this.debug('electric terrain boost');
					return this.chainModify(1.5);
				}
			},
			onStart: function() {
				this.add('-fieldstart', 'move: Electric Terrain');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function() {
				this.add('-fieldend', 'move: Electric Terrain');
			}
		},
		secondary: false,
		target: "all",
		type: "Electric"
	},
	"electrify": {
		num: 582,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If the target is electrified before it uses a move during that turn, the target's move becomes Electric type.",
		shortDesc: "Changes the target's move to Electric type.",
		id: "electrify",
		name: "Electrify",
		pp: 20,
		priority: 0,
		volatileStatus: 'electrify',
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn',target,'move: Electrify');
			},
			onModifyMove: function(move) {
				this.debug('Electrify making move type electric');
				move.type = 'Electric';
			}
		},
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"electroball": {
		num: 486,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			var ratio = (pokemon.getStat('spe') / target.getStat('spe'));
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
		desc: "Deals damage to one adjacent target. The power of this move depends on (user's current Speed / target's current Speed), rounded down. Power is equal to 150 if the result is 4 or more, 120 if 3, 80 if 2, 60 if 1, 40 if less than 1.",
		shortDesc: "More power the faster the user is than the target.",
		id: "electroball",
		isViable: true,
		name: "Electro Ball",
		pp: 10,
		priority: 0,
		isBullet: true,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"electroweb": {
		num: 527,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 100% chance to lower their Speed by 1 stage.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
		id: "electroweb",
		name: "Electroweb",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spe: -1
			}
		},
		target: "allAdjacentFoes",
		type: "Electric"
	},
	"embargo": {
		num: 373,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, one adjacent target cannot use its held item. Items thrown at the target with Fling will still activate for it. If the target uses Baton Pass, the replacement will remain unable to use items. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "For 5 turns, the target can't use any items.",
		id: "embargo",
		name: "Embargo",
		pp: 15,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'embargo',
		effect: {
			duration: 5,
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'Embargo');
			},
			onResidualOrder: 18,
			onEnd: function(pokemon) {
				this.add('-end', pokemon, 'Embargo');
			},
			onModifyPokemonPriority: 1,
			onModifyPokemon: function(pokemon) {
				pokemon.ignore['Item'] = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"ember": {
		num: 52,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to burn it.",
		shortDesc: "10% chance to burn the target.",
		id: "ember",
		name: "Ember",
		pp: 25,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"encore": {
		num: 227,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For 3 turns, one adjacent target is forced to repeat its last move used. If the affected move runs out of PP, the effect ends. Fails if the target is already under this effect, if it has not moved yet, if the move has 0PP, or if the move is Encore, Mimic, Mirror Move, Sketch, Struggle, or Transform. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute.",
		shortDesc: "The target repeats its last move for 3 turns.",
		id: "encore",
		isViable: true,
		name: "Encore",
		pp: 5,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'encore',
		effect: {
			duration: 3,
			onStart: function(target) {
				var noEncore = {encore:1, mimic:1, mirrormove:1, sketch:1, struggle:1, transform:1};
				var moveIndex = target.moves.indexOf(target.lastMove);
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
			onOverrideDecision: function(pokemon, target, move) {
				if (move.id !== this.effectData.move) return this.effectData.move;
			},
			onResidualOrder: 13,
			onResidual: function(target) {
				if (target.moves.indexOf(target.lastMove) >= 0 && target.moveset[target.moves.indexOf(target.lastMove)].pp <= 0) { // early termination if you run out of PP
					delete target.volatiles.encore;
					this.add('-end', target, 'Encore');
				}
			},
			onEnd: function(target) {
				this.add('-end', target, 'Encore');
			},
			onModifyPokemon: function(pokemon) {
				if (!this.effectData.move || !pokemon.hasMove(this.effectData.move)) {
					return;
				}
				for (var i=0; i<pokemon.moveset.length; i++) {
					if (pokemon.moveset[i].id !== this.effectData.move) {
						pokemon.moveset[i].disabled = true;
					}
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"endeavor": {
		num: 283,
		accuracy: 100,
		basePower: 0,
		damageCallback: function(pokemon,target) {
			if (target.hp > pokemon.hp) {
				return target.hp - pokemon.hp;
			}
			this.add('-immune', target, '[msg]');
			return false;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target equal to (target's current HP - user's current HP). Fails if the target's current HP is less than or equal to the user's current HP. Makes contact.",
		shortDesc: "Lowers the target's HP to the user's HP.",
		id: "endeavor",
		isViable: true,
		name: "Endeavor",
		pp: 5,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"endure": {
		num: 203,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user will survive attacks made by other Pokemon during this turn with at least 1HP. This attack has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used. X resets to 1 if this attack fails or if the user's last used move is not Detect, Endure, Protect, Quick Guard, or Wide Guard. If X is 256 or more, this move has a 1/(2^32) chance of being successful. Fails if the user moves last this turn. Priority +4.",
		shortDesc: "The user survives the next hit with at least 1 HP.",
		id: "endure",
		name: "Endure",
		pp: 10,
		priority: 4,
		stallingMove: true, // Note: stallingMove is not used anywhere.
		volatileStatus: 'endure',
		onTryHit: function(pokemon) {
			return this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function(pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn',target,'move: Endure');
			},
			onDamagePriority: -10,
			onDamage: function(damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && damage >= target.hp) {
					return target.hp-1;
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"energyball": {
		num: 412,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to lower its Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def. by 1.",
		id: "energyball",
		isViable: true,
		name: "Energy Ball",
		pp: 10,
		priority: 0,
		isBullet: true,
		secondary: {
			chance: 10,
			boosts: {
				spd: -1
			}
		},
		target: "normal",
		type: "Grass"
	},
	"entrainment": {
		num: 494,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target's Ability to become the same as the user's. Fails if the target's Ability is Multitype, Truant, or the same Ability as the user, or if the user's Ability is Flower Gift, Forecast, Illusion, Imposter, Multitype, Trace, or Zen Mode. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "The target's Ability changes to match the user's.",
		id: "entrainment",
		name: "Entrainment",
		pp: 15,
		priority: 0,
		isBounceable: true,
		onTryHit: function(target, source) {
			if (target === source) return false;
			var bannedTargetAbilities = {multitype:1, stancechange:1, truant:1};
			var bannedSourceAbilities = {flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, stancechange:1, trace:1, zenmode:1};
			if (bannedTargetAbilities[target.ability] || bannedSourceAbilities[source.ability] || target.ability === source.ability) {
				return false;
			}
		},
		onHit: function(target, source) {
			if (target.setAbility(source.ability)) {
				this.add('-ability', target, target.ability);
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"eruption": {
		num: 284,
		accuracy: 100,
		basePower: 150,
		basePowerCallback: function(pokemon) {
			return 150*pokemon.hp/pokemon.maxhp;
		},
		category: "Special",
		desc: "Deals damage to all adjacent foes. Power is equal to (user's current HP * 150 / user's maximum HP), rounded down, but not less than 1.",
		shortDesc: "Less power as user's HP decreases. Hits foe(s).",
		id: "eruption",
		isViable: true,
		name: "Eruption",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Fire"
	},
	"explosion": {
		num: 153,
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		desc: "The user faints and then damage is dealt to all adjacent Pokemon.",
		shortDesc: "Hits adjacent Pokemon. The user faints.",
		id: "explosion",
		name: "Explosion",
		pp: 5,
		priority: 0,
		selfdestruct: true,
		secondary: false,
		target: "allAdjacent",
		type: "Normal"
	},
	"extrasensory": {
		num: 326,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to flinch it.",
		shortDesc: "10% chance to flinch the target.",
		id: "extrasensory",
		isViable: true,
		name: "Extrasensory",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Psychic"
	},
	"extremespeed": {
		num: 245,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact. Priority +2.",
		shortDesc: "Nearly always goes first.",
		id: "extremespeed",
		isViable: true,
		name: "Extreme Speed",
		pp: 5,
		priority: 2,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"facade": {
		num: 263,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power doubles if the user is burned, paralyzed, or poisoned. Makes contact.",
		shortDesc: "Power doubles if user is burn/poison/paralyzed.",
		id: "facade",
		isViable: true,
		name: "Facade",
		pp: 20,
		priority: 0,
		isContact: true,
		onBasePowerPriority: 4,
		onBasePower: function(basePower, pokemon) {
			if (pokemon.status && pokemon.status !== 'slp') {
				return this.chainModify(2);
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"feintattack": {
		num: 185,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target and does not check accuracy. Makes contact.",
		shortDesc: "This move does not check accuracy.",
		id: "feintattack",
		name: "Feint Attack",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"fairylock": {
		num: 587,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Keeps all Pokemon from fleeing during the next turn.",
		shortDesc: "Prevents fleeing for one turn.",
		id: "fairylock",
		name: "Fairy Lock",
		pp: 10,
		priority: 0,
		pseudoWeather: 'fairylock',
		effect: {
			duration: 2,
			onStart: function(target) {
				this.add('-activate', target, 'move: Fairy Lock');
			},
			onModifyPokemon: function(pokemon) {
				pokemon.tryTrap();
			}
		},
		secondary: false,
		target: "all",
		type: "Fairy"
	},
	"fairywind": {
		num: 584,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "No additional effect.",
		id: "fairywind",
		name: "Fairy Wind",
		pp: 30,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fairy"
	},
	"fakeout": {
		num: 252,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 100% chance to flinch it. Fails unless it is the user's first turn on the field. Makes contact. Priority +3.",
		shortDesc: "Hits first. First turn out only. 100% flinch chance.",
		id: "fakeout",
		isViable: true,
		name: "Fake Out",
		pp: 10,
		priority: 3,
		isContact: true,
		onTryHit: function(target, pokemon) {
			if (pokemon.activeTurns > 1) {
				this.add('-message', '(Fake Out only works your first turn out.)');
				return false;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Normal"
	},
	"faketears": {
		num: 313,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Special Defense by 2 stages. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the target's Sp. Def by 2.",
		id: "faketears",
		name: "Fake Tears",
		pp: 20,
		priority: 0,
		boosts: {
			spd: -2
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"falseswipe": {
		num: 206,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target but leaves it with at least 1HP. Makes contact.",
		shortDesc: "Always leaves the target with at least 1 HP.",
		id: "falseswipe",
		name: "False Swipe",
		pp: 40,
		priority: 0,
		isContact: true,
		noFaint: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"featherdance": {
		num: 297,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Attack by 2 stages. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the target's Attack by 2.",
		id: "featherdance",
		name: "Feather Dance",
		pp: 15,
		priority: 0,
		boosts: {
			atk: -2
		},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"feint": {
		num: 364,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Deals damage to one adjacent target and breaks through Protect and Detect for this turn, allowing other Pokemon to attack the target normally. If the target is a foe, Quick Guard and Wide Guard are also broken for this turn and other Pokemon may attack the target normally. Priority +2.",
		shortDesc: "Nullifies Detect, Protect, and Quick/Wide Guard.",
		id: "feint",
		name: "Feint",
		pp: 10,
		priority: 2,
		breaksProtect: true,
		onHit: function(target, source) {
			if (target.removeVolatile('protect') || target.removeVolatile('kingsshield') || target.removeVolatile('spikyshield')) {
				this.add("-activate", target, "move: Feint");
			}
			if (target.side !== source.side) {
				target.side.removeSideCondition('quickguard');
				target.side.removeSideCondition('wideguard');
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"fellstinger": {
		num: 565,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "When the user knocks out a target with this move, the user's Attack stat rises sharply.",
		shortDesc: "Raises Attack by 2 if knocks out target.",
		id: "fellstinger",
		name: "Fell Stinger",
		pp: 25,
		priority: 0,
		onHit: function(target, pokemon) {
			pokemon.addVolatile('fellstinger');
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function(pokemon, target, move) {
				if (!target || target.fainted || target.hp <= 0) this.boost({atk:2}, pokemon, pokemon, move);
				pokemon.removeVolatile('fellstinger');
			}
		},
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"fierydance": {
		num: 552,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 50% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "50% chance to boost the user's Sp. Atk by 1.",
		id: "fierydance",
		isViable: true,
		name: "Fiery Dance",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 50,
			self: {
				boosts: {
					spa: 1
				}
			}
		},
		target: "normal",
		type: "Fire"
	},
	"finalgambit": {
		num: 515,
		accuracy: 100,
		basePower: 0,
		damageCallback: function(pokemon) {
			var damage = pokemon.hp;
			pokemon.hp = 0;
			return damage;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target equal to the user's current HP. If this move is successful, the user faints. Makes contact.",
		shortDesc: "Does damage equal to the user's HP. User faints.",
		id: "finalgambit",
		name: "Final Gambit",
		pp: 5,
		priority: 0,
		isContact: true,
		selfdestruct: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"fireblast": {
		num: 126,
		accuracy: 85,
		basePower: 110,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to burn it.",
		shortDesc: "10% chance to burn the target.",
		id: "fireblast",
		isViable: true,
		name: "Fire Blast",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"firefang": {
		num: 424,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to burn it and a 10% chance to flinch it. Makes contact.",
		shortDesc: "10% chance to burn. 10% chance to flinch.",
		id: "firefang",
		isViable: true,
		name: "Fire Fang",
		pp: 15,
		priority: 0,
		isContact: true,
		isBiteAttack: true,
		secondaries: [ {
				chance: 10,
				status: 'brn'
			}, {
				chance: 10,
				volatileStatus: 'flinch'
			}
		],
		target: "normal",
		type: "Fire"
	},
	"firepledge": {
		num: 519,
		accuracy: 100,
		basePower: 80,
		basePowerCallback: function(target, source, move) {
			if (move.sourceEffect in {grasspledge:1, waterpledge:1}) {
				this.add('-combine');
				return 150;
			}
			return 80;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. If one of the user's allies chose to use Grass Pledge or Water Pledge this turn and has not moved yet, they take their turn immediately after the user and the user's move does nothing. Power triples if this move is used by an ally that way, and a sea of fire appears on the target's side if the first move was Grass Pledge, or a rainbow appears on the user's side if the first move was Water Pledge.",
		shortDesc: "Use with Grass or Water Pledge for added effect.",
		id: "firepledge",
		name: "Fire Pledge",
		pp: 10,
		priority: 0,
		onTryHit: function(target, source, move) {
			for (var i=0; i<this.queue.length; i++) {
				var decision = this.queue[i];
				if (!decision.pokemon || !decision.move) continue;
				if (decision.pokemon.side === source.side && decision.move.id in {grasspledge:1, waterpledge:1}) {
					this.prioritizeQueue(decision);
					this.add('-waiting', source, decision.pokemon);
					return null;
				}
			}
		},
		onModifyMove: function(move) {
			if (move.sourceEffect === 'waterpledge') {
				move.type = 'Water';
				move.hasSTAB = true;
			}
			if (move.sourceEffect === 'grasspledge') {
				move.type = 'Fire';
				move.hasSTAB = true;
			}
		},
		onHit: function(target, source, move) {
			if (move.sourceEffect === 'grasspledge') {
				target.side.addSideCondition('firepledge');
			}
			if (move.sourceEffect === 'waterpledge') {
				source.side.addSideCondition('waterpledge');
			}
		},
		effect: {
			duration: 4,
			onStart: function(targetSide) {
				this.add('-sidestart', targetSide, 'Fire Pledge');
			},
			onEnd: function(targetSide) {
				this.add('-sideend', targetSide, 'Fire Pledge');
			},
			onResidual: function(side) {
				for (var i=0; i<side.active.length; i++) {
					var pokemon = side.active[i];
					if (pokemon && !pokemon.hasType('Fire')) {
						this.damage(pokemon.maxhp/8, pokemon);
					}
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"firepunch": {
		num: 7,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to burn it. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "10% chance to burn the target.",
		id: "firepunch",
		isViable: true,
		name: "Fire Punch",
		pp: 15,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"firespin": {
		num: 83,
		accuracy: 85,
		basePower: 35,
		category: "Special",
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "firespin",
		name: "Fire Spin",
		pp: 15,
		priority: 0,
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"fissure": {
		num: 90,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage to one adjacent target equal to the target's max HP. Ignores accuracy and evasion modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Ability Sturdy are immune.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "fissure",
		name: "Fissure",
		pp: 5,
		priority: 0,
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"flail": {
		num: 175,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			var ratio = pokemon.hp * 48 / pokemon.maxhp;
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
		desc: "Deals damage to one adjacent target based on the amount of HP the user has left. X is equal to (user's current HP * 48 / user's maximum HP), rounded down; the base power of this attack is 20 if X is 33 to 48, 40 if X is 17 to 32, 80 if X is 10 to 16, 100 if X is 5 to 9, 150 if X is 2 to 4, and 200 if X is 0 or 1. Makes contact.",
		shortDesc: "More power the less HP the user has left.",
		id: "flail",
		isViable: true,
		name: "Flail",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"flameburst": {
		num: 481,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Deals damage to one adjacent target. If this move is successful, each ally adjacent to the target loses 1/16 of its maximum HP, rounded down, unless it has the Ability Magic Guard.",
		shortDesc: "Damages Pokemon next to the target as well.",
		id: "flameburst",
		name: "Flame Burst",
		pp: 15,
		priority: 0,
		onHit: function(target, source) {
			var allyActive = target.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (var i=0; i<allyActive.length; i++) {
				if (allyActive[i] && this.isAdjacent(target, allyActive[i])) {
					this.damage(allyActive[i].maxhp/16, allyActive[i], source, 'flameburst');
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"flamecharge": {
		num: 488,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 100% chance to raise the user's Speed by 1 stage. Makes contact.",
		shortDesc: "100% chance to boost the user's Speed by 1.",
		id: "flamecharge",
		isViable: true,
		name: "Flame Charge",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1
				}
			}
		},
		target: "normal",
		type: "Fire"
	},
	"flamewheel": {
		num: 172,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to burn it. If the user is frozen, it will defrost before using this move. Makes contact.",
		shortDesc: "10% chance to burn the target. Thaws user.",
		id: "flamewheel",
		name: "Flame Wheel",
		pp: 25,
		priority: 0,
		isContact: true,
		thawsUser: true,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"flamethrower": {
		num: 53,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to burn it.",
		shortDesc: "10% chance to burn the target.",
		id: "flamethrower",
		isViable: true,
		name: "Flamethrower",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"flareblitz": {
		num: 394,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to burn it. If the target lost HP, the user takes recoil damage equal to 33% that HP, rounded half up, but not less than 1HP. If the user is frozen, it will defrost before using this move. Makes contact.",
		shortDesc: "Has 33% recoil. 10% chance to burn. Thaws user.",
		id: "flareblitz",
		isViable: true,
		name: "Flare Blitz",
		pp: 15,
		priority: 0,
		isContact: true,
		thawsUser: true,
		recoil: [33,100],
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"flash": {
		num: 148,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's accuracy by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. (Field: Can be used to light up dark caves.)",
		shortDesc: "Lowers the target's accuracy by 1.",
		id: "flash",
		name: "Flash",
		pp: 20,
		priority: 0,
		boosts: {
			accuracy: -1
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"flashcannon": {
		num: 430,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to lower its Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "flashcannon",
		isViable: true,
		name: "Flash Cannon",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 10,
			boosts: {
				spd: -1
			}
		},
		target: "normal",
		type: "Steel"
	},
	"flatter": {
		num: 260,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Raises one adjacent target's Special Attack by 1 stage and confuses it. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Boosts the target's Sp. Atk by 1 and confuses it.",
		id: "flatter",
		name: "Flatter",
		pp: 15,
		priority: 0,
		volatileStatus: 'confusion',
		boosts: {
			spa: 1
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"fling": {
		num: 374,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage to one adjacent target. The power of this move is based on the user's held item. The held item is lost and it activates for the target if applicable. If there is no target or the target avoids this move using Protect or Detect, the user's held item is still lost. Fails if the user has no held item, if the held item cannot be thrown, if the user is under the effect of Embargo or Magic Room, or if the user has the Ability Klutz.",
		shortDesc: "Flings the user's item at the target. Power varies.",
		id: "fling",
		name: "Fling",
		pp: 10,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.ignore['Item']) return;
			var item = pokemon.getItem();
			if (item.fling) {
				pokemon.addVolatile('fling');
				pokemon.setItem('');
			}
		},
		onTryHit: function(target, source, move) {
			if (!source.volatiles['fling']) return false;
			var item = this.getItem(source.volatiles['fling'].item);
			this.add("-enditem", source, item.name, '[from] move: Fling');
		},
		effect: {
			duration: 1,
			onStart: function(pokemon) {
				this.effectData.item = pokemon.item;
			},
			onModifyMovePriority: -1,
			onModifyMove: function(move) {
				var item = this.getItem(this.effectData.item);
				move.basePower = item.fling.basePower;
				if (item.isBerry && item.id !== 'enigmaberry') {
					move.onHit = function(foe) {
						this.singleEvent('Eat', item, null, foe, null, null);
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
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"flowershield": {
		num: 579,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user raises the Defense stat of all Grass-type Pokemon in battle.",
		shortDesc: "Raises Defense by 1 of Grass types in battle.",
		id: "flowershield",
		name: "Flower Shield",
		pp: 10,
		priority: 0,
		onHitField: function(target, source) {
			var targets = [];
			for (var i=0; i<this.sides.length; i++) {
				for (var j=0; j<this.sides[i].active.length; j++) {
					if (this.sides[i].active[j] && this.sides[i].active[j].hasType('Grass')) {
						// This move affects every Grass-type Pokemon in play.
						targets.push(this.sides[i].active[j]);
					}
				}
			}
			if (!targets.length) return false; // No targets; move fails
			for (var i=0; i<targets.length; i++) this.boost({def: 1}, targets[i], source, this.getMove('Flower Shield'));
		},
		secondary: false,
		target: "all",
		type: "Fairy"
	},
	"fly": {
		num: 19,
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target. This attack charges on the first turn and strikes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thunder, and Twister. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn. This move cannot be used while Gravity is in effect. Makes contact. (Field: Can be used to fly to a previously visited area.)",
		shortDesc: "Flies up on first turn, then strikes the next turn.",
		id: "fly",
		name: "Fly",
		pp: 15,
		priority: 0,
		isContact: true,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'fly',
			onAccuracy: function(accuracy, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'helpinghand') {
					return;
				}
				return 0;
			},
			onSourceBasePower: function(basePower, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			}
		},
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"flyingpress": {
		num: 560,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "Both Fighting-type and Flying-type simultaneously.",
		shortDesc: "Both Fighting-type and Flying-type simultaneously.",
		id: "flyingpress",
		name: "Flying Press",
		pp: 10,
		getEffectiveness: function(source, target, pokemon) {
			var type = source.type || source;
			return this.getEffectiveness(type, target) + this.getEffectiveness('Flying', target);
		},
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"focusblast": {
		num: 411,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to lower its Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "focusblast",
		isViable: true,
		name: "Focus Blast",
		pp: 5,
		priority: 0,
		isBullet: true,
		secondary: {
			chance: 10,
			boosts: {
				spd: -1
			}
		},
		target: "normal",
		type: "Fighting"
	},
	"focusenergy": {
		num: 116,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's chance for a critical hit by 2 stages. Baton Pass can be used to transfer this effect to an ally.",
		shortDesc: "Boosts the user's critical hit ratio by 2.",
		id: "focusenergy",
		name: "Focus Energy",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'focusenergy',
		effect: {
			onStart: function(pokemon) {
				this.add('-start',pokemon,'move: Focus Energy');
			},
			onModifyMove: function(move) {
				move.critRatio += 2;
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"focuspunch": {
		num: 264,
		accuracy: 100,
		basePower: 150,
		category: "Physical",
		desc: "Deals damage to one adjacent target. The user loses its focus and does nothing if it is hit by a damaging attack this turn before it can execute the move. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist. Priority -3.",
		shortDesc: "Fails if the user takes damage before it hits.",
		id: "focuspunch",
		isViable: true,
		name: "Focus Punch",
		pp: 20,
		priority: -3,
		isContact: true,
		isPunchAttack: true,
		beforeTurnCallback: function(pokemon) {
			pokemon.addVolatile('focuspunch');
		},
		beforeMoveCallback: function(pokemon) {
			if (!pokemon.removeVolatile('focuspunch')) {
				return false;
			}
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.damage && pokemon.lastAttackedBy.thisTurn) {
				this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
				return true;
			}
		},
		effect: {
			duration: 1,
			onStart: function(pokemon) {
				this.add('-singleturn', pokemon, 'move: Focus Punch');
			}
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"followme": {
		num: 266,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the end of the turn, all single-target attacks from the foe's team are redirected to the user if they are in range. Such attacks are redirected to the user before they can be reflected by Magic Coat or the Ability Magic Bounce, or drawn in by the Abilities Lightningrod or Storm Drain. Fails if it is not a double or triple battle. Priority +3.",
		shortDesc: "The foes' moves target the user on the turn used.",
		id: "followme",
		name: "Follow Me",
		pp: 20,
		priority: 2,
		volatileStatus: 'followme',
		effect: {
			duration: 1,
			onFoeRedirectTarget: function(target, source, source2, move) {
				if (this.validTarget(this.effectData.target, source, move.target)) {
					this.debug("Follow Me redirected target of move");
					return this.effectData.target;
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"forcepalm": {
		num: 395,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to paralyze it. Makes contact.",
		shortDesc: "30% chance to paralyze the target.",
		id: "forcepalm",
		name: "Force Palm",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Fighting"
	},
	"foresight": {
		num: 193,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to have its positive evasion stat stage set to 0 while it is active. Normal and Fighting-type attacks can hit the target if it is a Ghost-type. The effect ends when the target is no longer active. Fails if the target is already affected. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute.",
		shortDesc: "Blocks evasion mods. Fighting, Normal hit Ghost.",
		id: "foresight",
		name: "Foresight",
		pp: 40,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'foresight',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'Foresight');
			},
			onModifyPokemon: function(pokemon) {
				if (pokemon.hasType('Ghost')) {
					pokemon.negateImmunity['Normal'] = true;
					pokemon.negateImmunity['Fighting'] = true;
				}
			},
			onSourceModifyMove: function(move) {
				move.ignorePositiveEvasion = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"forestscurse": {
		num: 571,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Adds Grass to the target's type(s). If the target already has three types, the third is replaced.",
		shortDesc: "Adds Grass to the target's type(s).",
		id: "forestscurse",
		name: "Forest's Curse",
		pp: 20,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			if (target.hasType('Grass')) return false;
			if (!target.addType('Grass')) return false;
			this.add('-start', target, 'typechange', target.getTypes(true).join('/'), '[from] move: Forest\'s Curse');
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"foulplay": {
		num: 492,
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Damage is calculated using the target's Attack stat, including stat stage changes. Makes contact.",
		shortDesc: "Uses target's Attack stat in damage calculation.",
		id: "foulplay",
		isViable: true,
		name: "Foul Play",
		pp: 15,
		priority: 0,
		useTargetOffensive: true,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"freezedry": {
		num: 573,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to freeze it. Super-effective against Water-type Pokemon",
		shortDesc: "Super-effective against Water. 10% freeze chance.",
		id: "freezedry",
		name: "Freeze-Dry",
		pp: 20,
		priority: 0,
		getEffectiveness: function(source, target, pokemon) {
			var type = source.type || source;
			var totalTypeMod = 0;
			var types = target.getTypes && target.getTypes() || target.types;
			for (var i=0; i<types.length; i++) {
				if (!this.data.TypeChart[types[i]]) continue;
				if (types[i] === 'Water') {
					totalTypeMod++;
					continue;
				}
				var typeMod = this.data.TypeChart[types[i]].damageTaken[type];
				if (typeMod === 1) { // super-effective
					totalTypeMod++;
				}
				if (typeMod === 2) { // resist
					totalTypeMod--;
				}
			}
			return totalTypeMod;
		},
		secondary: {
			chance: 10,
			status: 'frz'
		},
		target: "normal",
		type: "Ice"
	},
	"freezeshock": {
		num: 553,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to paralyze it. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges turn 1. Hits turn 2. 30% paralyze.",
		id: "freezeshock",
		name: "Freeze Shock",
		pp: 5,
		priority: 0,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'freezeshock'
		},
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Ice"
	},
	"frenzyplant": {
		num: 338,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "Deals damage to one adjacent target. If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "frenzyplant",
		name: "Frenzy Plant",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustrecharge'
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"frostbreath": {
		num: 524,
		accuracy: 90,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent target. This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Abilities Battle Armor or Shell Armor.",
		shortDesc: "Always results in a critical hit.",
		id: "frostbreath",
		isViable: true,
		name: "Frost Breath",
		pp: 10,
		priority: 0,
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"frustration": {
		num: 218,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			return Math.floor(((255 - pokemon.happiness) * 10) / 25) || 1;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power is equal to the greater of ((255 - user's Happiness) * 2/5), rounded down, or 1. Makes contact.",
		shortDesc: "Max 102 power at minimum Happiness.",
		id: "frustration",
		isViable: true,
		name: "Frustration",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"furyattack": {
		num: 31,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Makes contact.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "furyattack",
		name: "Fury Attack",
		pp: 20,
		priority: 0,
		isContact: true,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"furycutter": {
		num: 210,
		accuracy: 95,
		basePower: 40,
		basePowerCallback: function(pokemon) {
			if (!pokemon.volatiles.furycutter) {
				pokemon.addVolatile('furycutter');
			}
			return 20 * pokemon.volatiles.furycutter.multiplier;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power doubles with each successful hit, up to a maximum of 160 power; resets to 20 power if the move misses or another move is used. Makes contact.",
		shortDesc: "Power doubles with each hit, up to 160.",
		id: "furycutter",
		name: "Fury Cutter",
		pp: 20,
		priority: 0,
		isContact: true,
		onHit: function(target, source) {
			source.addVolatile('furycutter');
		},
		effect: {
			duration: 2,
			onStart: function() {
				this.effectData.multiplier = 1;
			},
			onRestart: function() {
				if (this.effectData.multiplier < 8) {
					this.effectData.multiplier <<= 1;
				}
				this.effectData.duration = 2;
			}
		},
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"furyswipes": {
		num: 154,
		accuracy: 80,
		basePower: 18,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Makes contact.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "furyswipes",
		name: "Fury Swipes",
		pp: 15,
		priority: 0,
		isContact: true,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"fusionbolt": {
		num: 559,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If this move is successful, the next use of Fusion Flare by any Pokemon this turn will have its power doubled.",
		shortDesc: "Power doubles if used after Fusion Flare.",
		id: "fusionbolt",
		isViable: true,
		name: "Fusion Bolt",
		pp: 5,
		priority: 0,
		onBasePowerPriority: 4,
		onBasePower: function(basePower, pokemon) {
			var actives = pokemon.side.active;
			for (var i=0; i<actives.length; i++) {
				if (actives[i] && actives[i].moveThisTurn === 'fusionflare') {
					this.debug('double power');
					return this.chainModify(2);
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"fusionflare": {
		num: 558,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Deals damage to one adjacent target. If this move is successful, the next use of Fusion Bolt by any Pokemon this turn will have its power doubled. If the user is frozen, it will defrost before using this move.",
		shortDesc: "Power doubles if used after Fusion Bolt.",
		id: "fusionflare",
		isViable: true,
		name: "Fusion Flare",
		pp: 5,
		priority: 0,
		thawsUser: true,
		onBasePowerPriority: 4,
		onBasePower: function(basePower, pokemon) {
			var actives = pokemon.side.active;
			for (var i=0; i<actives.length; i++) {
				if (actives[i] && actives[i].moveThisTurn === 'fusionbolt') {
					this.debug('double power');
					return this.chainModify(2);
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"futuresight": {
		num: 248,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent target two turns after this move is used. At the end of that turn, the damage is dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move or Doom Desire is already in effect for the target's position. This move ignores Protect and Detect.",
		shortDesc: "Hits two turns after being used.",
		id: "futuresight",
		name: "Future Sight",
		pp: 10,
		priority: 0,
		isNotProtectable: true,
		affectedByImmunities: false,
		isFutureMove: true,
		onTryHit: function(target, source) {
			source.side.addSideCondition('futuremove');
			if (source.side.sideConditions['futuremove'].positions[source.position]) {
				return false;
			}
			source.side.sideConditions['futuremove'].positions[source.position] = {
				duration: 3,
				move: 'futuresight',
				targetPosition: target.position,
				source: source,
				moveData: {
					basePower: 120,
					category: "Special",
					affectedByImmunities: true,
					type: 'Psychic'
				}
			};
			this.add('-start', source, 'move: Future Sight');
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"gastroacid": {
		num: 380,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target's Ability to be rendered ineffective as long as it remains active. If the target uses Baton Pass, the replacement will remain under this effect. Fails if the target's Ability is Multitype or Stance Change. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Nullifies the target's Ability",
		id: "gastroacid",
		name: "Gastro Acid",
		pp: 10,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'gastroacid',
		onTryHit: function(pokemon) {
			var bannedAbilities = {multitype:1, stancechange:1};
			if (bannedAbilities[pokemon.ability]) {
				return false;
			}
		},
		effect: {
			onStart: function(pokemon) {
				this.add('-endability', pokemon, pokemon.ability);
			},
			onModifyPokemonPriority: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.ignore['Ability'] = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"geargrind": {
		num: 544,
		accuracy: 85,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits twice. If the first hit breaks the target's Substitute, it will take damage for the second hit. Makes contact.",
		shortDesc: "Hits 2 times in one turn.",
		id: "geargrind",
		isViable: true,
		name: "Gear Grind",
		pp: 15,
		priority: 0,
		isContact: true,
		multihit: [2,2],
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"geomancy": {
		num: 601,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user charges turn one, then sharply raise Special Attack, Special Defense, and Speed the next turn.",
		shortDesc: "Sharply raises SpAtk, SpDef, and Speed on turn 2.",
		id: "geomancy",
		name: "Geomancy",
		pp: 10,
		priority: 0,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			attacker.addVolatile(move.id, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				attacker.removeVolatile(move.id);
				return;
			}
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'geomancy'
		},
		boosts: {
			spa: 2,
			spd: 2,
			spe: 2
		},
		secondary: false,
		target: "self",
		type: "Fairy"
	},
	"gigadrain": {
		num: 202,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "Deals damage to one adjacent target. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "gigadrain",
		isViable: true,
		name: "Giga Drain",
		pp: 10,
		priority: 0,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"gigaimpact": {
		num: 416,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If this move is successful, the user must recharge on the following turn and cannot make a move. Makes contact.",
		shortDesc: "User cannot move next turn.",
		id: "gigaimpact",
		name: "Giga Impact",
		pp: 5,
		priority: 0,
		isContact: true,
		self: {
			volatileStatus: 'mustrecharge'
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"glaciate": {
		num: 549,
		accuracy: 95,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 100% chance to lower their Speed by 1 stage each.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
		id: "glaciate",
		name: "Glaciate",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spe: -1
			}
		},
		target: "allAdjacentFoes",
		type: "Ice"
	},
	"glare": {
		num: 137,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes one adjacent target. Ghost-types are not immune. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Paralyzes the target.",
		id: "glare",
		isViable: true,
		name: "Glare",
		pp: 30,
		priority: 0,
		status: 'par',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"grassknot": {
		num: 447,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			if (target.weightkg >= 200) {
				this.debug('120 bp');
				return 120;
			}
			if (target.weightkg >= 100) {
				this.debug('100 bp');
				return 100;
			}
			if (target.weightkg >= 50) {
				this.debug('80 bp');
				return 80;
			}
			if (target.weightkg >= 25) {
				this.debug('60 bp');
				return 60;
			}
			if (target.weightkg >= 10) {
				this.debug('40 bp');
				return 40;
			}
				this.debug('20 bp');
			return 20;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target based on that target's weight. Power is 20 if less than 10kg, 40 if less than 25kg, 60 if less than 50kg, 80 if less than 100kg, 100 if less than 200kg, and 120 if greater than or equal to 200kg. Makes contact.",
		shortDesc: "More power the heavier the target.",
		id: "grassknot",
		isViable: true,
		name: "Grass Knot",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"grasspledge": {
		num: 520,
		accuracy: 100,
		basePower: 80,
		basePowerCallback: function(target, source, move) {
			if (move.sourceEffect in {waterpledge:1, firepledge:1}) {
				this.add('-combine');
				return 150;
			}
			return 80;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. If one of the user's allies chose to use Fire Pledge or Water Pledge this turn and has not moved yet, they take their turn immediately after the user and the user's move does nothing. Power triples if this move is used by an ally that way, and a sea of fire appears on the target's side if the first move was Fire Pledge, or a swamp appears on the target's side if the first move was Water Pledge.",
		shortDesc: "Use with Fire or Water Pledge for added effect.",
		id: "grasspledge",
		name: "Grass Pledge",
		pp: 10,
		priority: 0,
		onTryHit: function(target, source, move) {
			for (var i=0; i<this.queue.length; i++) {
				var decision = this.queue[i];
				if (!decision.pokemon || !decision.move) continue;
				if (decision.pokemon.side === source.side && decision.move.id in {waterpledge:1, firepledge:1}) {
					this.prioritizeQueue(decision);
					this.add('-waiting', source, decision.pokemon);
					return null;
				}
			}
		},
		onModifyMove: function(move) {
			if (move.sourceEffect === 'waterpledge') {
				move.type = 'Grass';
				move.hasSTAB = true;
			}
			if (move.sourceEffect === 'firepledge') {
				move.type = 'Fire';
				move.hasSTAB = true;
			}
		},
		onHit: function(target, source, move) {
			if (move.sourceEffect === 'waterpledge') {
				target.side.addSideCondition('grasspledge');
			}
			if (move.sourceEffect === 'firepledge') {
				target.side.addSideCondition('firepledge');
			}
		},
		effect: {
			duration: 4,
			onStart: function(targetSide) {
				this.add('-sidestart', targetSide, 'Grass Pledge');
			},
			onEnd: function(targetSide) {
				this.add('-sideend', targetSide, 'Grass Pledge');
			},
			onModifySpe: function(speMod, pokemon) {
				return this.chain(speMod, 0.25);
			}
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"grasswhistle": {
		num: 320,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Puts one adjacent target to sleep. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "Puts the target to sleep.",
		id: "grasswhistle",
		name: "Grass Whistle",
		pp: 15,
		priority: 0,
		isSoundBased: true,
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"grassyterrain": {
		num: 580,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For five turns, Pokemon on the ground restore 1/16 of their HP each turn. Their Grass-type moves are powered up by 50%.",
		shortDesc: "If on ground, restore HP + Grass moves stronger.",
		id: "grassyterrain",
		name: "Grassy Terrain",
		pp: 10,
		priority: 0,
		terrain: 'grassyterrain',
		effect: {
			duration: 5,
			onBasePower: function(basePower, attacker, defender, move) {
				if (move.type === 'Grass' && attacker.runImmunity('Ground')) {
					this.debug('grassy terrain boost');
					return this.chainModify(1.5);
				}
			},
			onStart: function(target, source) {
				this.add('-fieldstart', 'move: Grassy Terrain');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 2,
			onResidual: function(battle) {
				this.debug('onResidual battle');
				for (var s in battle.sides) {
					for (var p in battle.sides[s].active) {
						if (battle.sides[s].active[p].runImmunity('Ground')) {
							this.debug('PokÃ©mon is grounded, healing through Grassy Terrain.');
							this.heal(battle.sides[s].active[p].maxhp / 16, battle.sides[s].active[p], battle.sides[s].active[p]);
						}
					}
				}
			},
			onEnd: function() {
				this.add('-fieldend', 'move: Grassy Terrain');
			}
		},
		secondary: false,
		target: "all",
		type: "Grass"
	},
	"gravity": {
		num: 356,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the evasion of all active Pokemon is 0.6x. At the time of use, Bounce, Fly, Magnet Rise, Sky Drop, and Telekinesis end immediately for all active Pokemon. During the effect, Bounce, Fly, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash, and Telekinesis are prevented from being used by all active Pokemon. Ground-type attacks, Spikes, Toxic Spikes, and the Ability Arena Trap can affect Flying-types or Pokemon with the Ability Levitate. Fails if this move is already in effect.",
		shortDesc: "For 5 turns, negates all Ground immunities.",
		id: "gravity",
		isViable: true,
		name: "Gravity",
		pp: 5,
		priority: 0,
		pseudoWeather: 'gravity',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'persistent') {
					return 7;
				}
				return 5;
			},
			onStart: function() {
				this.add('-fieldstart', 'move: Gravity');
			},
			onAccuracy: function(accuracy) {
				if (typeof accuracy !== 'number') return;
				return accuracy * 5/3;
			},
			onModifyPokemonPriority: 100,
			onModifyPokemon: function(pokemon) {
				pokemon.negateImmunity['Ground'] = true;
				var disabledMoves = {bounce:1, fly:1, highjumpkick:1, jumpkick:1, magnetrise:1, skydrop:1, splash:1, telekinesis:1};
				for (var m in disabledMoves) {
					pokemon.disabledMoves[m] = true;
				}
				var applies = false;
				if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly') || pokemon.removeVolatile('skydrop')) {
					applies = true;
					this.cancelMove(pokemon);
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
			},
			onBeforeMove: function(pokemon, target, move) {
				var disabledMoves = {bounce:1, fly:1, highjumpkick:1, jumpkick:1, magnetrise:1, skydrop:1, splash:1, telekinesis:1};
				if (disabledMoves[move.id]) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd: function() {
				this.add('-fieldend', 'move: Gravity');
			}
		},
		secondary: false,
		target: "all",
		type: "Psychic"
	},
	"growl": {
		num: 45,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers all adjacent foes' Attack by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "Lowers the foe(s) Attack by 1.",
		id: "growl",
		name: "Growl",
		pp: 40,
		priority: 0,
		isSoundBased: true,
		boosts: {
			atk: -1
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal"
	},
	"growth": {
		num: 74,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Special Attack by 1 stage. If the weather is Sunny Day, raises the user's Attack and Special Attack by 2 stages.",
		shortDesc: "Boosts the user's Attack and Sp. Atk by 1.",
		id: "growth",
		isViable: true,
		name: "Growth",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		onModifyMove: function(move) {
			if (this.isWeather('sunnyday')) move.boosts = {atk: 2, spa: 2};
		},
		boosts: {
			atk: 1,
			spa: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"grudge": {
		num: 288,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the user's next turn, if a foe's attack knocks the user out, that foe loses all remaining PP for that attack. Ignores a target's Substitute.",
		shortDesc: "If the user faints, the attack used loses all its PP.",
		id: "grudge",
		name: "Grudge",
		pp: 5,
		priority: 0,
		volatileStatus: 'grudge',
		effect: {
			onStart: function(pokemon) {
				this.add('-singlemove', pokemon, 'Grudge');
			},
			onFaint: function(target, source, effect) {
				this.debug('Grudge detected fainted pokemon');
				if (!source || !effect) return;
				if (effect.effectType === 'Move' && target.lastMove === 'grudge') {
					for (var i in source.moveset) {
						if (source.moveset[i].id === source.lastMove) {
							source.moveset[i].pp = 0;
							this.add('-activate', source, 'Grudge', this.getMove(source.lastMove).name);
						}
					}
				}
			},
			onBeforeMovePriority: -10,
			onBeforeMove: function(pokemon) {
				this.debug('removing Grudge before attack');
				pokemon.removeVolatile('grudge');
			}
		},
		secondary: false,
		target: "self",
		type: "Ghost"
	},
	"guardsplit": {
		num: 470,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and one adjacent target have their Defense and Special Defense stats set to be equal to the average of the user and the target's Defense and Special Defense stats, respectively, rounded down. Stat stage changes are unaffected.",
		shortDesc: "Averages Defense and Sp. Def stats with target.",
		id: "guardsplit",
		name: "Guard Split",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var newdef = Math.floor((target.stats.def + source.stats.def)/2);
			target.stats.def = newdef;
			source.stats.def = newdef;
			var newspd = Math.floor((target.stats.spd + source.stats.spd)/2);
			target.stats.spd = newspd;
			source.stats.spd = newspd;
			this.add('-activate', source, 'Guard Split', '[of] '+target);
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"guardswap": {
		num: 385,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps its Defense and Special Defense stat stage changes with one adjacent target. Ignores a target's Substitute.",
		shortDesc: "Swaps Defense and Sp. Def changes with target.",
		id: "guardswap",
		name: "Guard Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			var sourceBoosts = {};

			for (var i in {def:1,spd:1}) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);

			this.add('-swapboost', source, target, 'def, spd', '[from] move: Guard Swap');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"guillotine": {
		num: 12,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage to one adjacent target equal to the target's maximum HP. Ignores accuracy and evasion modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Ability Sturdy are immune. Makes contact.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "guillotine",
		name: "Guillotine",
		pp: 5,
		priority: 0,
		isContact: true,
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"gunkshot": {
		num: 441,
		accuracy: 80,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to poison it.",
		shortDesc: "30% chance to poison the target.",
		id: "gunkshot",
		isViable: true,
		name: "Gunk Shot",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'psn'
		},
		target: "normal",
		type: "Poison"
	},
	"gust": {
		num: 16,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target. Power doubles against Pokemon using Bounce, Fly, or Sky Drop.",
		shortDesc: "Power doubles during Fly, Bounce, and Sky Drop.",
		id: "gust",
		name: "Gust",
		pp: 35,
		priority: 0,
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"gyroball": {
		num: 360,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			var power = (Math.floor(25 * target.getStat('spe') / pokemon.getStat('spe')) || 1);
			if (power > 150) power = 150;
			this.debug(''+power+' bp');
			return power;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power is equal to (25 * target's current Speed / user's current Speed), rounded down, + 1, but not more than 150. Makes contact.",
		shortDesc: "More power the slower the user than the target.",
		id: "gyroball",
		isViable: true,
		name: "Gyro Ball",
		pp: 5,
		priority: 0,
		isContact: true,
		isBullet: true,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"hail": {
		num: 258,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Hail. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are an Ice-type, or have the Abilities Ice Body, Magic Guard, Overcoat, or Snow Cloak. Lasts for 8 turns if the user is holding Icy Rock. Fails if the current weather is Hail.",
		shortDesc: "For 5 turns, hail crashes down.",
		id: "hail",
		name: "Hail",
		pp: 10,
		priority: 0,
		weather: 'hail',
		secondary: false,
		target: "all",
		type: "Ice"
	},
	"hammerarm": {
		num: 359,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target and lowers the user's Speed by 1 stage. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "Lowers the user's Speed by 1.",
		id: "hammerarm",
		isViable: true,
		name: "Hammer Arm",
		pp: 10,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		self: {
			boosts: {
				spe: -1
			}
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"happyhour": {
		num: 603,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "No competitive effect. (Doubles the prize money received after battle.)",
		shortDesc: "No effect.",
		id: "happyhour",
		name: "Happy Hour",
		pp: 30,
		priority: 0,
		onTryHit: function(target, source) {
			this.add('-activate', target, 'move: Happy Hour');
			return null;
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"harden": {
		num: 106,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 1 stage.",
		shortDesc: "Boosts the user's Defense by 1.",
		id: "harden",
		name: "Harden",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		boosts: {
			def: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"haze": {
		num: 114,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Eliminates any stat stage changes from all active Pokemon.",
		shortDesc: "Eliminates all stat changes.",
		id: "haze",
		isViable: true,
		name: "Haze",
		pp: 30,
		priority: 0,
		onHitField: function() {
			this.add('-clearallboost');
			for (var i=0; i<this.sides.length; i++) {
				for (var j=0; j<this.sides[i].active.length; j++) {
					this.sides[i].active[j].clearBoosts();
				}
			}
		},
		secondary: false,
		target: "all",
		type: "Ice"
	},
	"headcharge": {
		num: 543,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If the target lost HP, the user takes recoil damage equal to 1/4 that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 1/4 recoil.",
		id: "headcharge",
		isViable: true,
		name: "Head Charge",
		pp: 15,
		priority: 0,
		isContact: true,
		recoil: [1,4],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"headsmash": {
		num: 457,
		accuracy: 80,
		basePower: 150,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If the target lost HP, the user takes recoil damage equal to 1/2 that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 1/2 recoil.",
		id: "headsmash",
		isViable: true,
		name: "Head Smash",
		pp: 5,
		priority: 0,
		isContact: true,
		recoil: [1,2],
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"headbutt": {
		num: 29,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Makes contact.",
		shortDesc: "30% chance to flinch the target.",
		id: "headbutt",
		name: "Headbutt",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Normal"
	},
	"healbell": {
		num: 215,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Every Pokemon in the user's party is cured of its major status problem. Although this move is sound-based, Pokemon with the Ability Soundproof are also cured.",
		shortDesc: "Cures the user's party of all status conditions.",
		id: "healbell",
		isViable: true,
		name: "Heal Bell",
		pp: 5,
		priority: 0,
		isSnatchable: true,
		isSoundBased: true, // though it isn't affected by Soundproof
		onHit: function(pokemon, source) {
			var side = pokemon.side;
			for (var i=0; i<side.pokemon.length; i++) {
				side.pokemon[i].status = '';
			}
			this.add('-cureteam', source, '[from] move: HealBell');
		},
		target: "allyTeam",
		type: "Normal"
	},
	"healblock": {
		num: 377,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, all adjacent foes are prevented from restoring any HP as long as they remain active. During the effect, direct healing moves are unusable, draining moves will not heal the user, and Abilities and items that grant healing will not heal the user. If an affected Pokemon uses Baton Pass, the replacement will remain unable to restore its HP. Pain Split and the Ability Regenerator are unaffected. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "For 5 turns, the foe(s) is prevented from healing.",
		id: "healblock",
		name: "Heal Block",
		pp: 15,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'healblock',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'persistent') {
					return 7;
				}
				return 5;
			},
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'move: Heal Block');
			},
			onModifyPokemon: function(pokemon) {
				var disabledMoves = {healingwish:1, lunardance:1, rest:1, swallow:1, wish:1};
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++) {
					if (disabledMoves[moves[i].id] || this.getMove(moves[i].id).heal) {
						pokemon.disabledMoves[moves[i].id] = true;
					}
				}
			},
			onBeforeMove: function(pokemon, target, move) {
				var disabledMoves = {healingwish:1, lunardance:1, rest:1, swallow:1, wish:1};
				if (disabledMoves[move.id] || move.heal) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 17,
			onEnd: function(pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal: false
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Psychic"
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
		isSnatchable: true,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Bug"
	},
	"healpulse": {
		num: 505,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent or non-adjacent target to gain 1/2 of its maximum HP, rounded half up. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Heals the target by 50% of its max HP.",
		id: "healpulse",
		name: "Heal Pulse",
		pp: 10,
		priority: 0,
		isBounceable: true,
		onHit: function(target, source) {
			if (source.ability === 'megalauncher') this.heal(this.modify(target.maxhp, 0.75));
			else this.heal(Math.ceil(target.maxhp * 0.5));
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
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
		isSnatchable: true,
		onTryHit: function(pokemon, target, move) {
			if (pokemon.side.pokemonLeft <= 1) {
				delete move.selfdestruct;
				return false;
			}
		},
		selfdestruct: true,
		sideCondition: 'healingwish',
		effect: {
			duration: 2,
			onStart: function(side) {
				this.debug('Healing Wish started on '+side.name);
			},
			onSwitchInPriority: 1,
			onSwitchIn: function(target) {
				if (target.position != this.effectData.sourcePosition) {
					return;
				}
				if (!target.fainted) {
					var source = this.effectData.source;
					var damage = target.heal(target.maxhp);
					target.setStatus('');
					this.add('-heal',target,target.getHealth,'[from] move: Healing Wish');
					target.side.removeSideCondition('healingwish');
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"heartstamp": {
		num: 531,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Makes contact.",
		shortDesc: "30% chance to flinch the target.",
		id: "heartstamp",
		name: "Heart Stamp",
		pp: 25,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Psychic"
	},
	"heartswap": {
		num: 391,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps all its stat stage changes with one adjacent target. Ignores a target's Substitute.",
		shortDesc: "Swaps all stat changes with target.",
		id: "heartswap",
		name: "Heart Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			var sourceBoosts = {};

			for (var i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);

			this.add('-swapboost', source, target, '[from] move: Heart Swap');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"heatcrash": {
		num: 535,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			var targetWeight = target.weightkg;
			var pokemonWeight = pokemon.weightkg;
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
		desc: "Deals damage to one adjacent target. The power of this move depends on (user's weight / target's weight), rounded down. Power is equal to 120 if the result is 5 or more, 100 if 4, 80 if 3, 60 if 2, and 40 if 1 or less. Makes contact.",
		shortDesc: "More power the heavier the user than the target.",
		id: "heatcrash",
		isViable: true,
		name: "Heat Crash",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"heatwave": {
		num: 257,
		accuracy: 90,
		basePower: 95,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 10% chance to burn each.",
		shortDesc: "10% chance to burn the foe(s).",
		id: "heatwave",
		isViable: true,
		name: "Heat Wave",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "allAdjacentFoes",
		type: "Fire"
	},
	"heavyslam": {
		num: 484,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			var targetWeight = target.weightkg;
			var pokemonWeight = pokemon.weightkg;
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
		desc: "Deals damage to one adjacent target. The power of this move depends on (user's weight / target's weight), rounded down. Power is equal to 120 if the result is 5 or more, 100 if 4, 80 if 3, 60 if 2, and 40 if 1 or less. Makes contact.",
		shortDesc: "More power the heavier the user than the target.",
		id: "heavyslam",
		isViable: true,
		name: "Heavy Slam",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"helpinghand": {
		num: 270,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent ally to have the power of its attack this turn boosted to 1.5x (this effect is stackable). Fails if there is no adjacent ally, but does not fail if the ally is using a two-turn move. This move ignores Protect and Detect. Ignores a target's Substitute. Priority +5.",
		shortDesc: "One adjacent ally's move power is 1.5x this turn.",
		id: "helpinghand",
		name: "Helping Hand",
		pp: 20,
		priority: 5,
		isNotProtectable: true,
		volatileStatus: 'helpinghand',
		onTryHit: function(target, source) {
			if (target === source) return false;
		},
		effect: {
			duration: 1,
			onStart: function(target, source) {
				this.add('-singleturn', target, 'Helping Hand', '[of] '+source);
			},
			onBasePowerPriority: 3,
			onBasePower: function(basePower) {
				this.debug('Boosting from Helping Hand');
				return this.chainModify(1.5);
			}
		},
		secondary: false,
		target: "adjacentAlly",
		type: "Normal"
	},
	"hex": {
		num: 506,
		accuracy: 100,
		basePower: 65,
		basePowerCallback: function(pokemon, target) {
			if (target.status) return 130;
			return 65;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. Power doubles if the target has a major status problem.",
		shortDesc: "Power doubles if the target has a status ailment.",
		id: "hex",
		name: "Hex",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"hiddenpower": {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent target. This move's type depends on the user's individual values (IVs). Type can be any but Normal.",
		shortDesc: "Varies in type based on the user's IVs.",
		id: "hiddenpower",
		isViable: true,
		name: "Hidden Power",
		pp: 15,
		priority: 0,
		onModifyMove: function(move, pokemon) {
			move.type = pokemon.hpType || 'Dark';
		},
		secondary: false,
		target: "normal",
		type: "Normal"
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
		secondary: false,
		target: "normal",
		type: "Bug"
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
		secondary: false,
		target: "normal",
		type: "Dark"
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
		secondary: false,
		target: "normal",
		type: "Dragon"
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
		secondary: false,
		target: "normal",
		type: "Electric"
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
		secondary: false,
		target: "normal",
		type: "Fighting"
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
		secondary: false,
		target: "normal",
		type: "Fire"
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
		secondary: false,
		target: "normal",
		type: "Flying"
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
		secondary: false,
		target: "normal",
		type: "Ghost"
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
		secondary: false,
		target: "normal",
		type: "Grass"
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
		secondary: false,
		target: "normal",
		type: "Ground"
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
		secondary: false,
		target: "normal",
		type: "Ice"
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
		secondary: false,
		target: "normal",
		type: "Poison"
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
		secondary: false,
		target: "normal",
		type: "Psychic"
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
		secondary: false,
		target: "normal",
		type: "Rock"
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
		secondary: false,
		target: "normal",
		type: "Steel"
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
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"highjumpkick": {
		num: 136,
		accuracy: 90,
		basePower: 130,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If this attack is not successful, the user loses half of its maximum HP, rounded down, as crash damage. Pokemon with the Ability Magic Guard are unaffected by crash damage. This move cannot be used while Gravity is in effect. Makes contact.",
		shortDesc: "User is hurt by 50% of its max HP if it misses.",
		id: "highjumpkick",
		isViable: true,
		name: "High Jump Kick",
		pp: 10,
		priority: 0,
		isContact: true,
		hasCustomRecoil: true,
		onMoveFail: function(target, source, move) {
			this.damage(source.maxhp/2, source, source, 'highjumpkick');
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"holdback": {
		gen: 6,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target but leaves it with at least 1HP. Makes contact.",
		shortDesc: "Always leaves the target with at least 1 HP.",
		id: "holdback",
		name: "Hold Back",
		pp: 40,
		priority: 0,
		isContact: true,
		noFaint: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"honeclaws": {
		num: 468,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and accuracy by 1 stage.",
		shortDesc: "Boosts the user's Attack and accuracy by 1.",
		id: "honeclaws",
		isViable: true,
		name: "Hone Claws",
		pp: 15,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1,
			accuracy: 1
		},
		secondary: false,
		target: "self",
		type: "Dark"
	},
	"hornattack": {
		num: 30,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "hornattack",
		name: "Horn Attack",
		pp: 25,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"horndrill": {
		num: 32,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage to one adjacent target equal to the target's maximum HP. Ignores accuracy and evasion modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Ability Sturdy are immune. Makes contact.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "horndrill",
		name: "Horn Drill",
		pp: 5,
		priority: 0,
		isContact: true,
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"hornleech": {
		num: 532,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Deals damage to one adjacent target. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. Makes contact.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "hornleech",
		isViable: true,
		name: "Horn Leech",
		pp: 10,
		priority: 0,
		isContact: true,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"howl": {
		num: 336,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage.",
		shortDesc: "Boosts the user's Attack by 1.",
		id: "howl",
		isViable: true,
		name: "Howl",
		pp: 40,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"hurricane": {
		num: 542,
		accuracy: 70,
		basePower: 110,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target with a 30% chance to confuse it. This move can hit a target using Bounce, Fly, or Sky Drop. If the weather is Rain Dance, this move cannot miss. If the weather is Sunny Day, this move's accuracy is 50%.",
		shortDesc: "30% chance to confuse target. Can't miss in rain.",
		id: "hurricane",
		isViable: true,
		name: "Hurricane",
		pp: 10,
		priority: 0,
		onModifyMove: function(move) {
			if (this.isWeather('raindance')) move.accuracy = true;
			else if (this.isWeather('sunnyday')) move.accuracy = 50;
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion'
		},
		target: "any",
		type: "Flying"
	},
	"hydrocannon": {
		num: 308,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "Deals damage to one adjacent target. If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "hydrocannon",
		name: "Hydro Cannon",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustrecharge'
		},
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"hydropump": {
		num: 56,
		accuracy: 80,
		basePower: 110,
		category: "Special",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "No additional effect.",
		id: "hydropump",
		isViable: true,
		name: "Hydro Pump",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"hyperbeam": {
		num: 63,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "Deals damage to one adjacent target. If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "hyperbeam",
		name: "Hyper Beam",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustrecharge'
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"hyperfang": {
		num: 158,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to flinch it. Makes contact.",
		shortDesc: "10% chance to flinch the target.",
		id: "hyperfang",
		name: "Hyper Fang",
		pp: 15,
		priority: 0,
		isContact: true,
		isBiteAttack: true,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Normal"
	},
	"hypervoice": {
		num: 304,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to all adjacent foes. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "No additional effect. Hits adjacent foes.",
		id: "hypervoice",
		isViable: true,
		name: "Hyper Voice",
		pp: 10,
		priority: 0,
		isSoundBased: true,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal"
	},
	"hypnosis": {
		num: 95,
		accuracy: 60,
		basePower: 0,
		category: "Status",
		desc: "Puts one adjacent target to sleep. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Puts the target to sleep.",
		id: "hypnosis",
		isViable: true,
		name: "Hypnosis",
		pp: 20,
		priority: 0,
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"iceball": {
		num: 301,
		accuracy: 90,
		basePower: 30,
		basePowerCallback: function(pokemon, target) {
			var bp = 30;
			var bpTable = [30, 60, 120, 240, 480];
			if (pokemon.volatiles.iceball && pokemon.volatiles.iceball.hitCount) {
				bp = (bpTable[pokemon.volatiles.iceball.hitCount] || 480);
			}
			pokemon.addVolatile('iceball');
			if (pokemon.volatiles.defensecurl) {
				bp *= 2;
			}
			this.debug("Ice Ball bp: "+bp);
			return bp;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. The user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. Power doubles with each successful hit of this move and doubles again if Defense Curl was used previously by the user. If this move is called by Sleep Talk, the move is used for one turn. Makes contact.",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
		id: "iceball",
		name: "Ice Ball",
		pp: 20,
		priority: 0,
		isContact: true,
		isBullet: true,
		effect: {
			duration: 2,
			onLockMove: 'iceball',
			onStart: function() {
				this.effectData.hitCount = 1;
			},
			onRestart: function() {
				this.effectData.hitCount++;
				if (this.effectData.hitCount < 5) {
					this.effectData.duration = 2;
				}
			},
			onResidual: function(target) {
				if (target.lastMove === 'struggle') {
					// don't lock
					delete target.volatiles['iceball'];
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"icebeam": {
		num: 58,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to freeze it.",
		shortDesc: "10% chance to freeze the target.",
		id: "icebeam",
		isViable: true,
		name: "Ice Beam",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'frz'
		},
		target: "normal",
		type: "Ice"
	},
	"iceburn": {
		num: 554,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to burn it. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges turn 1. Hits turn 2. 30% burn.",
		id: "iceburn",
		name: "Ice Burn",
		pp: 5,
		priority: 0,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'iceburn'
		},
		secondary: {
			chance: 30,
			status: 'brn'
		},
		target: "normal",
		type: "Ice"
	},
	"icefang": {
		num: 423,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to freeze it and a 10% chance to flinch it. Makes contact.",
		shortDesc: "10% chance to freeze. 10% chance to flinch.",
		id: "icefang",
		isViable: true,
		name: "Ice Fang",
		pp: 15,
		priority: 0,
		isContact: true,
		isBiteAttack: true,
		secondaries: [ {
				chance: 10,
				status: 'frz'
			}, {
				chance: 10,
				volatileStatus: 'flinch'
			}
		],
		target: "normal",
		type: "Ice"
	},
	"icepunch": {
		num: 8,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to freeze it. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "10% chance to freeze the target.",
		id: "icepunch",
		isViable: true,
		name: "Ice Punch",
		pp: 15,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: {
			chance: 10,
			status: 'frz'
		},
		target: "normal",
		type: "Ice"
	},
	"iceshard": {
		num: 420,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Priority +1.",
		shortDesc: "Usually goes first.",
		id: "iceshard",
		isViable: true,
		name: "Ice Shard",
		pp: 30,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"iciclecrash": {
		num: 556,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it.",
		shortDesc: "30% chance to flinch the target.",
		id: "iciclecrash",
		isViable: true,
		name: "Icicle Crash",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Ice"
	},
	"iciclespear": {
		num: 333,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "iciclespear",
		isViable: true,
		name: "Icicle Spear",
		pp: 30,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"icywind": {
		num: 196,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 100% chance to lower their Speed by 1 stage each.",
		shortDesc: "100% chance to lower the foe(s) Speed by 1.",
		id: "icywind",
		name: "Icy Wind",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spe: -1
			}
		},
		target: "allAdjacentFoes",
		type: "Ice"
	},
	"imprison": {
		num: 286,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user prevents all of its foes from using any moves that the user also knows as long as the user remains active. Ignores a target's Substitute.",
		shortDesc: "No foe can use any move known by the user.",
		id: "imprison",
		name: "Imprison",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'imprison',
		effect: {
			noCopy: true,
			onStart: function(target) {
				this.add('-start', target, 'move: Imprison');
			},
			onFoeModifyPokemon: function(pokemon) {
				var foeMoves = this.effectData.source.moveset;
				for (var f=0; f<foeMoves.length; f++) {
					pokemon.disabledMoves[foeMoves[f].id] = true;
				}
			},
			onFoeBeforeMove: function(attacker, defender, move) {
				if (attacker.disabledMoves[move.id]) {
					this.add('cant', attacker, 'move: Imprison', move);
					return false;
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"incinerate": {
		num: 510,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to all adjacent foes and destroys any Berry or Gem they may be holding.",
		shortDesc: "Destroys the foe(s) Berry/Gem.",
		id: "incinerate",
		name: "Incinerate",
		pp: 15,
		priority: 0,
		onHit: function(pokemon, source) {
			var item = pokemon.getItem();
			if ((item.isBerry || item.isGem) && pokemon.takeItem(source)) {
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Fire"
	},
	"inferno": {
		num: 517,
		accuracy: 50,
		basePower: 100,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 100% chance to burn it.",
		shortDesc: "100% chance to burn the target.",
		id: "inferno",
		name: "Inferno",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 100,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"infestation": {
		num: 611,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "infestation",
		isViable: true,
		name: "Infestation",
		pp: 20,
		priority: 0,
		isContact: true,
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"ingrain": {
		num: 275,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user has 1/16 of its maximum HP restored at the end of each turn, but it is prevented from switching out and other Pokemon cannot force the user to switch out. The user can still switch out if it uses Baton Pass, U-turn, or Volt Switch. If the user leaves the field using Baton Pass, the replacement will remain trapped and still receive the healing effect. During the effect, the user can be hit normally by Ground-type attacks and be affected by Spikes and Toxic Spikes, even if the user is a Flying-type or has the Ability Levitate.",
		shortDesc: "User recovers 1/16 max HP per turn. Traps user.",
		id: "ingrain",
		isViable: true,
		name: "Ingrain",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'ingrain',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'move: Ingrain');
			},
			onResidualOrder: 7,
			onResidual: function(pokemon) {
				this.heal(pokemon.maxhp/16);
			},
			onModifyPokemon: function(pokemon) {
				pokemon.negateImmunity['Ground'] = true;
				pokemon.trapped = true;
			},
			onDragOut: function(pokemon) {
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			}
		},
		secondary: false,
		target: "self",
		type: "Grass"
	},
	"iondeluge": {
		num: 569,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Changes Normal-type moves to Electric-type moves.",
		shortDesc: "Changes Normal moves to Electric type.",
		id: "iondeluge",
		name: "Ion Deluge",
		pp: 25,
		priority: 1,
		pseudoWeather: 'iondeluge',
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-fieldactivate', 'move: Ion Deluge');
			},
			onModifyMove: function(move) {
				if (move.type === 'Normal') {
					move.type = 'Electric';
					this.debug(move.name + "'s type changed to Electric");
				}
			}
		},
		secondary: false,
		target: "all",
		type: "Electric"
	},
	"irondefense": {
		num: 334,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		shortDesc: "Boosts the user's Defense by 2.",
		id: "irondefense",
		isViable: true,
		name: "Iron Defense",
		pp: 15,
		priority: 0,
		isSnatchable: true,
		boosts: {
			def: 2
		},
		secondary: false,
		target: "self",
		type: "Steel"
	},
	"ironhead": {
		num: 442,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Makes contact.",
		shortDesc: "30% chance to flinch the target.",
		id: "ironhead",
		isViable: true,
		name: "Iron Head",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Steel"
	},
	"irontail": {
		num: 231,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to lower its Defense by 1 stage. Makes contact.",
		shortDesc: "30% chance to lower the target's Defense by 1.",
		id: "irontail",
		isViable: true,
		name: "Iron Tail",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			boosts: {
				def: -1
			}
		},
		target: "normal",
		type: "Steel"
	},
	"judgment": {
		num: 449,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Deals damage to one adjacent target. This move's type depends on the user's held Plate.",
		shortDesc: "Type varies based on the held Plate.",
		id: "judgment",
		isViable: true,
		name: "Judgment",
		pp: 10,
		priority: 0,
		onModifyMove: function(move, pokemon) {
			move.type = this.runEvent('Plate', pokemon, null, 'judgment', 'Normal');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"jumpkick": {
		num: 26,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If this attack is not successful, the user loses half of its maximum HP, rounded down, as crash damage. Pokemon with the Ability Magic Guard are unaffected by crash damage. This move cannot be used while Gravity is in effect. Makes contact.",
		shortDesc: "User is hurt by 50% of its max HP if it misses.",
		id: "jumpkick",
		isViable: true,
		name: "Jump Kick",
		pp: 10,
		priority: 0,
		isContact: true,
		hasCustomRecoil: true,
		onMoveFail: function(target, source, move) {
			this.damage(source.maxhp/2, source, source, 'jumpkick');
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"karatechop": {
		num: 2,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio.",
		id: "karatechop",
		name: "Karate Chop",
		pp: 25,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"kinesis": {
		num: 134,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's accuracy by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the target's accuracy by 1.",
		id: "kinesis",
		name: "Kinesis",
		pp: 15,
		priority: 0,
		boosts: {
			accuracy: -1
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"kingsshield": {
		num: 588,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Protects the user from attacks. Contactors get their Attack lowered by 2 stages. Priority +4",
		shortDesc: "Protects user from attacks. Contactors get -Atk.",
		id: "kingsshield",
		isViable: true,
		name: "King's Shield",
		pp: 10,
		priority: 4,
		stallingMove: true, // Note: stallingMove is not used anywhere.
		volatileStatus: 'kingsshield',
		onTryHit: function(pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function(pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function(target, source, move) {
				if (move.breaksProtect) {
					target.removeVolatile('kingsshield');
					return;
				}
				if (move && (move.category === 'Status' || move.isNotProtectable)) return;
				this.add('-activate', target, 'Protect');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.isContact) {
					this.boost({atk:-2}, source, target, this.getMove("King's Shield"));
				}
				return null;
			}
		},
		secondary: false,
		target: "self",
		type: "Steel"
	},
	"knockoff": {
		num: 282,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target and causes it to drop its held item. Does 50% more damage if the target is holding an item. This move cannot force Pokemon with the Ability Sticky Hold to lose their held item, or force a Giratina, an Arceus, or a Genesect to lose their Griseous Orb, Plate, or Drive, respectively. It also cannot remove Mega Stones. Items lost to this move cannot be regained with Recycle. Makes contact.",
		shortDesc: "1.5x damage if foe holds an item. Removes item.",
		id: "knockoff",
		isViable: true,
		name: "Knock Off",
		pp: 25,
		priority: 0,
		isContact: true,
		onBasePowerPriority: 4,
		onBasePower: function(basePower, pokemon, target) {
			var item = target.getItem();
			var noKnockOff = ((item.onPlate && target.baseTemplate.baseSpecies === 'Arceus') || 
				(item.onDrive && target.baseTemplate.baseSpecies === 'Genesect') || (item.onTakeItem && item.onTakeItem(item, target) === false));
			if (item.id && !noKnockOff) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit: function(target, source) {
			if (source.hp) {
				var item = target.getItem();
				if (item.id === 'mail') {
					target.setItem('');
				} else {
					item = target.takeItem(source);
				}
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] '+source);
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"landswrath": {
		num: 616,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "No additional effect.",
		id: "landswrath",
		isViable: true,
		name: "Land's Wrath",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Ground"
	},
	"lastresort": {
		num: 387,
		accuracy: 100,
		basePower: 140,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Fails unless the user knows this move and at least one other move, and has used all the other moves it knows at least once each since it became active or Transformed. Makes contact.",
		shortDesc: "Fails unless each known move has been used.",
		id: "lastresort",
		name: "Last Resort",
		pp: 5,
		priority: 0,
		isContact: true,
		onTryHit: function(target, source) {
			if (source.moveset.length === 1) return false; // Last Resort fails unless the user knows at least 2 moves
			var hasLastResort = false; // User must actually have Last Resort for it to succeed
			for (var i in source.moveset) {
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
		type: "Normal"
	},
	"lavaplume": {
		num: 436,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to all adjacent Pokemon with a 30% chance to burn each.",
		shortDesc: "30% chance to burn adjacent Pokemon.",
		id: "lavaplume",
		isViable: true,
		name: "Lava Plume",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'brn'
		},
		target: "allAdjacent",
		type: "Fire"
	},
	"leafblade": {
		num: 348,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio.",
		id: "leafblade",
		isViable: true,
		name: "Leaf Blade",
		pp: 15,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"leafstorm": {
		num: 437,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		desc: "Deals damage to one adjacent target and lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "leafstorm",
		isViable: true,
		name: "Leaf Storm",
		pp: 5,
		priority: 0,
		self: {
			boosts: {
				spa: -2
			}
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"leaftornado": {
		num: 536,
		accuracy: 90,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 50% chance to lower its accuracy by 1 stage.",
		shortDesc: "50% chance to lower the target's accuracy by 1.",
		id: "leaftornado",
		name: "Leaf Tornado",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 50,
			boosts: {
				accuracy: -1
			}
		},
		target: "normal",
		type: "Grass"
	},
	"leechlife": {
		num: 141,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Deals damage to one adjacent target. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. Makes contact.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "leechlife",
		name: "Leech Life",
		pp: 15,
		priority: 0,
		isContact: true,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"leechseed": {
		num: 73,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "The Pokemon at the user's position steals 1/8 of one adjacent target's max HP, rounded down, at the end of each turn. If Big Root is held by the recipient, the HP recovered is 1.3x normal, rounded half down. If the target uses Baton Pass, the replacement will continue being leeched. If the target switches out or uses Rapid Spin, the effect ends. Grass-types are unaffected. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "1/8 of target's HP is restored to user every turn.",
		id: "leechseed",
		isViable: true,
		name: "Leech Seed",
		pp: 10,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'leechseed',
		effect: {
			onStart: function(target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onResidualOrder: 8,
			onResidual: function(pokemon) {
				var target = pokemon.side.foe.active[pokemon.volatiles['leechseed'].sourcePosition];
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				var damage = this.damage(pokemon.maxhp/8, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			}
		},
		onTryHit: function(target) {
			if (target.hasType('Grass')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"leer": {
		num: 43,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers all adjacent foes' Defense by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the foe(s) Defense by 1.",
		id: "leer",
		name: "Leer",
		pp: 30,
		priority: 0,
		boosts: {
			def: -1
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal"
	},
	"lick": {
		num: 122,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to paralyze it. Makes contact.",
		shortDesc: "30% chance to paralyze the target.",
		id: "lick",
		name: "Lick",
		pp: 30,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Ghost"
	},
	"lightofruin": {
		num: -6,
		gen: 6,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Deals damage to one adjacent target. If the target lost HP, the user takes recoil damage equal to 1/2 that HP, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 1/2 recoil.",
		id: "lightofruin",
		isViable: true,
		name: "Light of Ruin",
		pp: 5,
		priority: 0,
		recoil: [1,2],
		secondary: false,
		target: "normal",
		type: "Fairy"
	},
	"lightscreen": {
		num: 113,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members take 0.5x damage from special attacks, or 0.66x damage if in a double or triple battle. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break or Defog. Lasts for 8 turns if the user is holding Light Clay.",
		shortDesc: "For 5 turns, special damage to allies is halved.",
		id: "lightscreen",
		isViable: true,
		name: "Light Screen",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		sideCondition: 'lightscreen',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.item === 'lightclay') {
					return 8;
				}
				return 5;
			},
			onFoeModifyDamage: function(damage, source, target, move) {
				if (this.getCategory(move) === 'Special' && target.side === this.effectData.target) {
					if (!move.crit && !move.ignoreScreens) {
						this.debug('Light Screen weaken');
						if (source.side.active.length > 1) return this.chainModify(0.66);
						return this.chainModify(0.5);
					}
				}
			},
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Light Screen');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 1,
			onEnd: function(side) {
				this.add('-sideend', side, 'move: Light Screen');
			}
		},
		secondary: false,
		target: "allySide",
		type: "Psychic"
	},
	"lockon": {
		num: 199,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "On the following turn, one adjacent target cannot avoid the user's moves, even if the target is in the middle of a two-turn move. Fails if the user tries to use this move again during effect.",
		shortDesc: "User's next move will not miss the target.",
		id: "lockon",
		name: "Lock-On",
		pp: 5,
		priority: 0,
		volatileStatus: 'lockon',
		effect: {
			duration: 2,
			onFoeModifyMove: function(move, source, target) {
				if (source === this.effectData.source) {
					move.accuracy = true;
					move.alwaysHit = true;
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"lovelykiss": {
		num: 142,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Puts one adjacent target to sleep. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Puts the target to sleep.",
		id: "lovelykiss",
		isViable: true,
		name: "Lovely Kiss",
		pp: 10,
		priority: 0,
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"lowkick": {
		num: 67,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			var targetWeight = target.weightkg;
			if (target.weightkg >= 200) {
				return 120;
			}
			if (target.weightkg >= 100) {
				return 100;
			}
			if (target.weightkg >= 50) {
				return 80;
			}
			if (target.weightkg >= 25) {
				return 60;
			}
			if (target.weightkg >= 10) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target based on that target's weight. Power is 20 if less than 10kg, 40 if less than 25kg, 60 if less than 50kg, 80 if less than 100kg, 100 if less than 200kg, and 120 if greater than or equal to 200kg. Makes contact.",
		shortDesc: "More power the heavier the target.",
		id: "lowkick",
		isViable: true,
		name: "Low Kick",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"lowsweep": {
		num: 490,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 100% chance to lower its Speed by 1 stage. Makes contact.",
		shortDesc: "100% chance to lower the target's Speed by 1.",
		id: "lowsweep",
		name: "Low Sweep",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 100,
			boosts: {
				spe: -1
			}
		},
		target: "normal",
		type: "Fighting"
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
		isSnatchable: true,
		sideCondition: 'luckychant',
		effect: {
			duration: 5,
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Lucky Chant'); // "The Lucky Chant shielded [side.name]'s team from critical hits!"
			},
			onCriticalHit: false,
			onResidualOrder: 21,
			onResidualSubOrder: 5,
			onEnd: function(side) {
				this.add('-sideend', side, 'move: Lucky Chant'); // "[side.name]'s team's Lucky Chant wore off!"
			}
		},
		secondary: false,
		target: "allySide",
		type: "Normal"
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
		isSnatchable: true,
		onTryHit: function(pokemon, target, move) {
			if (pokemon.side.pokemonLeft <= 1) {
				delete move.selfdestruct;
				return false;
			}
		},
		selfdestruct: true,
		sideCondition: 'lunardance',
		effect: {
			duration: 2,
			onStart: function(side) {
				this.debug('Lunar Dance started on '+side.name);
			},
			onSwitchInPriority: 1,
			onSwitchIn: function(target) {
				if (target.position != this.effectData.sourcePosition) {
					return;
				}
				if (!target.fainted) {
					var source = this.effectData.source;
					var damage = target.heal(target.maxhp);
					target.setStatus('');
					for (var m in target.moveset) {
						target.moveset[m].pp = target.moveset[m].maxpp;
					}
					this.add('-heal',target,target.getHealth,'[from] move: Lunar Dance');
					target.side.removeSideCondition('lunardance');
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"lusterpurge": {
		num: 295,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 50% chance to lower its Special Defense by 1 stage.",
		shortDesc: "50% chance to lower the target's Sp. Def by 1.",
		id: "lusterpurge",
		name: "Luster Purge",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 50,
			boosts: {
				spd: -1
			}
		},
		target: "normal",
		type: "Psychic"
	},
	"machpunch": {
		num: 183,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist. Priority +1.",
		shortDesc: "Usually goes first.",
		id: "machpunch",
		isViable: true,
		name: "Mach Punch",
		pp: 30,
		priority: 1,
		isContact: true,
		isPunchAttack: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"magiccoat": {
		num: 277,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the end of the turn, the user is unaffected by certain non-damaging moves directed at it and will instead use such moves against the original user. Moves reflected in this way are unable to be reflected again by this or the Ability Magic Bounce's effect. Spikes, Stealth Rock, and Toxic Spikes can only be reflected once per side, by the leftmost Pokemon under this or the Ability Magic Bounce's effect. If the user has the Ability Soundproof, this move's effect happens before a sound-based move can be nullified. The Abilities Lightningrod and Storm Drain redirect their respective moves before this move takes effect. Priority +4.",
		shortDesc: "Bounces back certain non-damaging moves.",
		id: "magiccoat",
		isViable: true,
		name: "Magic Coat",
		pp: 15,
		priority: 4,
		volatileStatus: 'magiccoat',
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'move: Magic Coat');
			},
			onTryHitPriority: 2,
			onTryHit: function(target, source, move) {
				if (target === source) return;
				if (move.hasBounced) return;
				if (typeof move.isBounceable === 'undefined') {
					move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
				}
				if (move.isBounceable) {
					var newMove = this.getMoveCopy(move.id);
					newMove.hasBounced = true;
					this.useMove(newMove, target, source);
					return null;
				}
			},
			onAllyTryHitSide: function(target, source, move) {
				if (target.side === source.side) return;
				if (move.hasBounced) return;
				if (typeof move.isBounceable === 'undefined') {
					move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
				}
				if (move.isBounceable) {
					var newMove = this.getMoveCopy(move.id);
					newMove.hasBounced = true;
					this.useMove(newMove, target, source);
					return null;
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"magicroom": {
		num: 478,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the held items of all active Pokemon have no effect. During the effect, Fling and Natural Gift are prevented from being used by all active Pokemon. If this move is used during the effect, the effect ends.",
		shortDesc: "For 5 turns, all held items have no effect.",
		id: "magicroom",
		name: "Magic Room",
		pp: 10,
		priority: 0,
		onHitField: function(target, source, effect) {
			if (this.pseudoWeather['magicroom']) {
				this.removePseudoWeather('magicroom', source, effect, '[of] '+source);
			} else {
				this.addPseudoWeather('magicroom', source, effect, '[of] '+source);
			}
		},
		effect: {
			duration: 5,
			/*durationCallback: function(target, source, effect) {
				// Persistent isn't updated for BW moves
				if (source && source.ability === 'Persistent') {
					return 7;
				}
				return 5;
			},*/
			onStart: function(target, source) {
				this.add('-fieldstart', 'move: Magic Room', '[of] '+source);
			},
			onModifyPokemonPriority: 1,
			onModifyPokemon: function(pokemon) {
				pokemon.ignore['Item'] = true;
			},
			onResidualOrder: 25,
			onEnd: function() {
				this.add('-fieldend', 'move: Magic Room', '[of] '+this.effectData.source);
			}
		},
		secondary: false,
		target: "all",
		type: "Psychic"
	},
	"magicalleaf": {
		num: 345,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent target and does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "magicalleaf",
		name: "Magical Leaf",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"magmastorm": {
		num: 463,
		accuracy: 75,
		basePower: 100,
		category: "Special",
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "magmastorm",
		isViable: true,
		name: "Magma Storm",
		pp: 5,
		priority: 0,
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"magnetbomb": {
		num: 443,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target and does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "magnetbomb",
		name: "Magnet Bomb",
		pp: 20,
		priority: 0,
		isBullet: true,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"magneticflux": {
		num: 602,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the Defense and Sp. Def stats of ally PokÃ©mon with the Plus or Minus Ability.",
		shortDesc: "Raises defenses of ally Pokemon with Plus/Minus.",
		id: "magneticflux",
		name: "Magnetic Flux",
		pp: 20,
		priority: 0,
		onHitSide: function(side, source) {
			var targets = [];
			for (var p in side.active) {
				if (side.active[p].ability === 'plus' || side.active[p].ability === 'minus') {
					targets.push(side.active[p]);
				}
			}
			if (!targets.length) return false;
			for (var i=0;i<targets.length;i++) this.boost({spd: 1, def: 1}, targets[i], source, 'move: Magnetic Flux');
		},
		secondary: false,
		target: "allySide",
		type: "Electric"
	},
	"magnetrise": {
		num: 393,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, and the Ability Arena Trap as long as it remains active. If the user uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, and Iron Ball override this move if the user is under any of their effects. Fails if the user is already under this effect or the effects of Ingrain or Smack Down. This move cannot be used while Gravity is in effect.",
		shortDesc: "For 5 turns, the user is immune to Ground moves.",
		id: "magnetrise",
		isViable: true,
		name: "Magnet Rise",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'magnetrise',
		effect: {
			duration: 5,
			onStart: function(target) {
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-start', target, 'Magnet Rise');
			},
			onImmunity: function(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 15,
			onEnd: function(target) {
				this.add('-end', target, 'Magnet Rise');
			}
		},
		secondary: false,
		target: "self",
		type: "Electric"
	},
	"magnitude": {
		num: 222,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage to all adjacent Pokemon. The power of this move varies; 5% chances for 10 and 150 power, 10% chances for 30 and 110 power, 20% chances for 50 and 90 power, and 30% chance for 70 power. Power doubles against Pokemon using Dig.",
		shortDesc: "Hits adjacent Pokemon. Power varies; 2x on Dig.",
		id: "magnitude",
		name: "Magnitude",
		pp: 30,
		priority: 0,
		onModifyMove: function(move, pokemon) {
			var i = this.random(100);
			if (i < 5) {
				this.add('-activate', pokemon, 'move: Magnitude', 4);
				move.basePower = 10;
			} else if (i < 15) {
				this.add('-activate', pokemon, 'move: Magnitude', 5);
				move.basePower = 30;
			} else if (i < 35) {
				this.add('-activate', pokemon, 'move: Magnitude', 6);
				move.basePower = 50;
			} else if (i < 65) {
				this.add('-activate', pokemon, 'move: Magnitude', 7);
				move.basePower = 70;
			} else if (i < 85) {
				this.add('-activate', pokemon, 'move: Magnitude', 8);
				move.basePower = 90;
			} else if (i < 95) {
				this.add('-activate', pokemon, 'move: Magnitude', 9);
				move.basePower = 110;
			} else {
				this.add('-activate', pokemon, 'move: Magnitude', 10);
				move.basePower = 150;
			}
		},
		secondary: false,
		target: "allAdjacent",
		type: "Ground"
	},
	"matblock": {
		num: 561,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user protects itself and its allies from damaging moves. Only works first turn out.",
		shortDesc: "Protects from damaging moves. First turn out only.",
		id: "matblock",
		isViable: true,
		name: "Mat Block",
		pp: 10,
		priority: 0,
		stallingMove: true, // Note: stallingMove is not used anywhere.
		volatileStatus: 'matblock',
		onTryHitSide: function(side, source) {
			if (source.activeTurns > 1) {
				this.add('-message', '(Mat Block only works your first turn out.)');
				return false;
			}
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'Mat Block');
			},
			onTryHitPriority: 3,
			onAllyTryHit: function(target, source, move) {
				if (move.breaksProtect) {
					target.removeVolatile('Mat Block');
					return;
				}
				if (move && (move.target === 'self' || move.category === 'Status')) return;
				this.add('-activate', target, 'Mat Block', move.name);
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			}
		},
		secondary: false,
		target: "allySide",
		type: "Fighting"
	},
	"mefirst": {
		num: 382,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user selects one adjacent foe and uses the move it chose for use this turn against it, if possible, with 1.5x the power. The move must be a damaging move other than Chatter, Counter, Covet, Focus Punch, Me First, Metal Burst, Mirror Coat, Thief, or Struggle. Fails if the foe moves before the user. Ignores the foe's Substitute for the purpose of copying the move.",
		shortDesc: "Copies a foe at 1.5x power. User must be faster.",
		id: "mefirst",
		isViable: true,
		name: "Me First",
		pp: 20,
		priority: 0,
		onHit: function(target, pokemon) {
			var decision = this.willMove(target);
			if (decision) {
				var noMeFirst = {
					chatter:1, counter:1, covet:1, focuspunch:1, mefirst:1, metalburst:1, mirrorcoat:1, struggle:1, thief:1
				};
				var move = this.getMove(decision.move);
				if (move.category !== 'Status' && !noMeFirst[move]) {
					pokemon.addVolatile('mefirst');
					this.useMove(move, pokemon);
					return;
				}
			}
			return false;
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 4,
			onBasePower: function(basePower) {
				return this.chainModify(1.5);
			}
		},
		secondary: false,
		target: "adjacentFoe",
		type: "Normal"
	},
	"meanlook": {
		num: 212,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents one adjacent target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "The target cannot switch out.",
		id: "meanlook",
		isViable: true,
		name: "Mean Look",
		pp: 5,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			if (!target.addVolatile('trapped')) {
				this.add('-fail', target);
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"meditate": {
		num: 96,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage.",
		shortDesc: "Boosts the user's Attack by 1.",
		id: "meditate",
		isViable: true,
		name: "Meditate",
		pp: 40,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"megadrain": {
		num: 72,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to one adjacent target. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "megadrain",
		name: "Mega Drain",
		pp: 15,
		priority: 0,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"megakick": {
		num: 25,
		accuracy: 75,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "megakick",
		isViable: true,
		name: "Mega Kick",
		pp: 5,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"megapunch": {
		num: 5,
		accuracy: 85,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "No additional effect.",
		id: "megapunch",
		name: "Mega Punch",
		pp: 20,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"megahorn": {
		num: 224,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "megahorn",
		isViable: true,
		name: "Megahorn",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"memento": {
		num: 262,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Attack and Special Attack by 2 stages. The user faints unless this move misses or there is no target. Fails entirely if the target has a Substitute, but does not fail if the target's stats cannot be changed.",
		shortDesc: "Lowers target's Attack, Sp. Atk by 2. User faints.",
		id: "memento",
		isViable: true,
		name: "Memento",
		pp: 10,
		priority: 0,
		isBounceable: false,
		boosts: {
			atk: -2,
			spa: -2
		},
		selfdestruct: true,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"metalburst": {
		num: 368,
		accuracy: 100,
		basePower: 0,
		damageCallback: function(pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn) {
				return 1.5 * pokemon.lastAttackedBy.damage;
			}
			return false;
		},
		category: "Physical",
		desc: "Deals damage to the last foe to hit the user with an attack this turn. The damage is equal to 1.5x the HP lost by the user from that attack. If that foe's position is no longer in use, damage is done to a random foe in range. Only the last hit of a multi-hit attack is counted. Fails if the user moves first or if the user was not hit by a foe's attack this turn.",
		shortDesc: "If hit by an attack, returns 1.5x damage.",
		id: "metalburst",
		name: "Metal Burst",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "scripted",
		type: "Steel"
	},
	"metalclaw": {
		num: 232,
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to raise the user's Attack by 1 stage. Makes contact.",
		shortDesc: "10% chance to boost the user's Attack by 1.",
		id: "metalclaw",
		name: "Metal Claw",
		pp: 35,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1
				}
			}
		},
		target: "normal",
		type: "Steel"
	},
	"metalsound": {
		num: 319,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Special Defense by 2 stages. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "Lowers the target's Sp. Def by 2.",
		id: "metalsound",
		name: "Metal Sound",
		pp: 40,
		priority: 0,
		isSoundBased: true,
		boosts: {
			spd: -2
		},
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"meteormash": {
		num: 309,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 20% chance to raise the user's Attack by 1 stage. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "20% chance to boost the user's Attack by 1.",
		id: "meteormash",
		isViable: true,
		name: "Meteor Mash",
		pp: 10,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: {
			chance: 20,
			self: {
				boosts: {
					atk: 1
				}
			}
		},
		target: "normal",
		type: "Steel"
	},
	"metronome": {
		num: 118,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "A random move is selected for use, other than After You, Assist, Bestow, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Freeze Shock, Helping Hand, Ice Burn, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Quash, Quick Guard, Rage Powder, Relic Song, Secret Sword, Sketch, Sleep Talk, Snarl, Snatch, Snore, Struggle, Switcheroo, Techno Blast, Thief, Transform, Trick, V-create, or Wide Guard.",
		shortDesc: "Picks a random move.",
		id: "metronome",
		name: "Metronome",
		pp: 10,
		priority: 0,
		onHit: function(target) {
			var moves = [];
			for (var i in exports.BattleMovedex) {
				var move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				var noMetronome = {
					afteryou:1, assist:1, bestow:1, chatter:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, feint:1, focuspunch:1, followme:1, freezeshock:1, helpinghand:1, iceburn:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, quash:1, quickguard:1, ragepowder:1, relicsong:1, secretsword:1, sketch:1, sleeptalk:1, snatch:1, snarl:1, snore:1, struggle:1, switcheroo:1, technoblast:1, thief:1, transform:1, trick:1, vcreate:1, wideguard:1
				};
				if (!noMetronome[move.id]) {
					moves.push(move.id);
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
	"milkdrink": {
		num: 208,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up. (Field: Can be used to heal an ally by draining 1/5 of the user's maximum HP, rounded down, and restoring that amount to the selected ally. Fails if the user's HP would be reduced to less than 1.)",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "milkdrink",
		isViable: true,
		name: "Milk Drink",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"mimic": {
		num: 102,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move is replaced by the last move used by one adjacent target. The copied move has the maximum PP for that move. Fails if the target has not made a move, if the user has Transformed, or if the move is Chatter, Mimic, Sketch, Struggle, or Transform. Ignores a target's Substitute.",
		shortDesc: "The last move the target used replaces this one.",
		id: "mimic",
		name: "Mimic",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var disallowedMoves = {chatter:1, mimic:1, sketch:1, struggle:1, transform:1};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1) return false;
			var moveslot = source.moves.indexOf('mimic');
			if (moveslot === -1) return false;
			var move = Tools.getMove(target.lastMove);
			source.moveset[moveslot] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false
			};
			source.moves[moveslot] = toId(move.name);
			this.add('-start', source, 'Mimic', move.name);
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"mindreader": {
		num: 170,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "On the following turn, one adjacent target cannot avoid the user's moves, even if the target is in the middle of a two-turn move. Fails if the user tries to use this move again during effect.",
		shortDesc: "User's next move will not miss the target.",
		id: "mindreader",
		name: "Mind Reader",
		pp: 5,
		priority: 0,
		volatileStatus: 'lockon',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"minimize": {
		num: 107,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's evasion by 2 stages. After using this move, Stomp and Steamroller will have their power doubled if used against the user while it is active.",
		shortDesc: "Boosts the user's evasion by 2.",
		id: "minimize",
		name: "Minimize",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'minimize',
		effect: {
			noCopy: true,
			onSourceModifyDamage: function (damage, source, target, move) {
				if (move.id in {'stomp':1, 'steamroller':1, 'bodyslam':1, 'flyingpress':1, 'dragonrush':1, 'phantomforce':1}) {
					return this.chainModify(2);
				}
			},
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id in {'stomp':1, 'steamroller':1, 'bodyslam':1, 'flyingpress':1, 'dragonrush':1, 'phantomforce':1}) {
					return true;
				}
				return accuracy;
			}
		},
		boosts: {
			evasion: 2
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"miracleeye": {
		num: 357,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to have its positive evasion stat stage set to 0 while it is active. Psychic-type attacks can hit the target if it is a Dark-type. The effect ends when the target is no longer active. Fails if the target is already affected. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute.",
		shortDesc: "Blocks evasion mods. Psychic hits Dark.",
		id: "miracleeye",
		name: "Miracle Eye",
		pp: 40,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'miracleeye',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'Miracle Eye');
			},
			onModifyPokemon: function(pokemon) {
				if (pokemon.hasType('Dark')) pokemon.negateImmunity['Psychic'] = true;
			},
			onSourceModifyMove: function(move, source, target) {
				move.ignorePositiveEvasion = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"mirrorcoat": {
		num: 243,
		accuracy: 100,
		basePower: 0,
		damageCallback: function(pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && this.getCategory(pokemon.lastAttackedBy.move) === 'Special') {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			return false;
		},
		category: "Special",
		desc: "Deals damage to the last foe to hit the user with a special attack this turn. The damage is equal to twice the HP lost by the user from that attack. If that foe's position is no longer in use, damage is done to a random foe in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by a foe's special attack this turn. Priority -5.",
		shortDesc: "If hit by special attack, returns double damage.",
		id: "mirrorcoat",
		isViable: true,
		name: "Mirror Coat",
		pp: 20,
		priority: -5,
		secondary: false,
		target: "scripted",
		type: "Psychic"
	},
	"mirrormove": {
		num: 119,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user uses the last move used by a selected adjacent target. The copied move is used against that target, if possible. Fails if the target has not yet used a move, or the last move used was Acupressure, After You, Aromatherapy, Chatter, Conversion 2, Counter, Curse, Doom Desire, Feint, Final Gambit, Focus Punch, Future Sight, Gravity, Guard Split, Hail, Haze, Heal Bell, Heal Pulse, Helping Hand, Light Screen, Lucky Chant, Me First, Mimic, Mirror Coat, Mist, Mud Sport, Nature Power, Perish Song, Power Split, Psych Up, Quick Guard, Rain Dance, Reflect, Reflect Type, Role Play, Safeguard, Sandstorm, Sketch, Spikes, Spit Up, Stealth Rock, Struggle, Sunny Day, Tailwind, Toxic Spikes, Transform, Water Sport, Wide Guard, or any move that is self-targeting.",
		shortDesc: "User uses the target's last used move against it.",
		id: "mirrormove",
		name: "Mirror Move",
		pp: 20,
		priority: 0,
		isNotProtectable: true,
		onTryHit: function(target) {
			var noMirrorMove = {acupressure:1, afteryou:1, aromatherapy:1, chatter:1, conversion2:1, counter:1, curse:1, doomdesire:1, feint:1, finalgambit:1, focuspunch:1, futuresight:1, gravity:1, guardsplit:1, hail:1, haze:1, healbell:1, healpulse:1, helpinghand:1, lightscreen:1, luckychant:1, mefirst:1, mimic:1, mirrorcoat:1, mirrormove:1, mist:1, mudsport:1, naturepower:1, perishsong:1, powersplit:1, psychup:1, quickguard:1, raindance:1, reflect:1, reflecttype:1, roleplay:1, safeguard:1, sandstorm:1, sketch:1, spikes:1, spitup:1, stealthrock:1, struggle:1, sunnyday:1, tailwind:1, toxicspikes:1, transform:1, watersport:1, wideguard:1};
			if (!target.lastMove || noMirrorMove[target.lastMove] || this.getMove(target.lastMove).target === 'self') {
				return false;
			}
		},
		onHit: function(target, source) {
			this.useMove(target.lastMove, source);
		},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"mirrorshot": {
		num: 429,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to lower its accuracy by 1 stage.",
		shortDesc: "30% chance to lower the target's accuracy by 1.",
		id: "mirrorshot",
		name: "Mirror Shot",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1
			}
		},
		target: "normal",
		type: "Steel"
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
		isSnatchable: true,
		sideCondition: 'mist',
		effect: {
			duration: 5,
			onBoost: function(boost, target, source) {
				if (!source || target === source) return;
				for (var i in boost) {
					if (boost[i] < 0) {
						delete boost[i];
						this.add('-activate', target, 'Mist');
					}
				}
			},
			onStart: function(side) {
				this.add('-sidestart', side, 'Mist');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 3,
			onEnd: function(side) {
				this.add('-sideend', side, 'Mist');
			}
		},
		secondary: false,
		target: "allySide",
		type: "Ice"
	},
	"mistball": {
		num: 296,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 50% chance to lower its Special Attack by 1 stage.",
		shortDesc: "50% chance to lower the target's Sp. Atk by 1.",
		id: "mistball",
		name: "Mist Ball",
		pp: 5,
		priority: 0,
		isBullet: true,
		secondary: {
			chance: 50,
			boosts: {
				spa: -1
			}
		},
		target: "normal",
		type: "Psychic"
	},
	"mistyterrain": {
		num: 581,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For five turns, Grounded Pokemon cannot have major status problem inflicted on them by other Pokemon. Dragon-type moves used against them are weakened by 50%.",
		shortDesc: "Prevents status and weakens Dragon if grounded.",
		id: "mistyterrain",
		name: "Misty Terrain",
		pp: 10,
		priority: 0,
		terrain: 'mistyterrain',
		effect: {
			duration: 5,
			onSetStatus: function(status, target, source, effect) {
				if (!target.runImmunity('Ground')) return;
				if (source && source !== target || (effect && effect.id === 'toxicspikes')) {
					this.debug('misty terrain preventing status');
					return false;
				}
			},
			onTryHit: function(target, source, move) {
				if (!target.runImmunity('Ground')) return;
				if (move && move.id === 'yawn') {
					this.debug('misty terrain blocking yawn');
					return false;
				}
			},
			onBasePower: function(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.runImmunity('Ground')) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onStart: function(side) {
				this.add('-fieldstart', 'Misty Terrain');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function(side) {
				this.add('-fieldend', 'Misty Terrain');
			}
		},
		secondary: false,
		target: "all",
		type: "Fairy"
	},
	"moonblast": {
		num: 585,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to lower its Special Attack by 1 stage.",
		shortDesc: "30% chance to lower the target's Sp. Atk by 1.",
		id: "moonblast",
		isViable: true,
		name: "Moonblast",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 30,
			boosts: {
				spa: -1
			}
		},
		target: "normal",
		type: "Fairy"
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
		isSnatchable: true,
		onHit: function(pokemon) {
			if (this.isWeather('sunnyday')) this.heal(this.modify(pokemon.maxhp, 0.667));
			else if (this.isWeather(['raindance','sandstorm','hail'])) this.heal(this.modify(pokemon.maxhp, 0.25));
			else this.heal(this.modify(pokemon.maxhp, 0.5));
		},
		secondary: false,
		target: "self",
		type: "Fairy"
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
		isSnatchable: true,
		onHit: function(pokemon) {
			if (this.isWeather('sunnyday')) this.heal(this.modify(pokemon.maxhp, 0.667));
			else if (this.isWeather(['raindance','sandstorm','hail'])) this.heal(this.modify(pokemon.maxhp, 0.25));
			else this.heal(this.modify(pokemon.maxhp, 0.5));
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"mudslap": {
		num: 189,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 100% chance to lower its accuracy by 1 stage.",
		shortDesc: "100% chance to lower the target's accuracy by 1.",
		id: "mudslap",
		name: "Mud-Slap",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				accuracy: -1
			}
		},
		target: "normal",
		type: "Ground"
	},
	"mudbomb": {
		num: 426,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to lower its accuracy by 1 stage.",
		shortDesc: "30% chance to lower the target's accuracy by 1.",
		id: "mudbomb",
		name: "Mud Bomb",
		pp: 10,
		priority: 0,
		isBullet: true,
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1
			}
		},
		target: "normal",
		type: "Ground"
	},
	"mudshot": {
		num: 341,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 100% chance to lower its Speed by 1 stage.",
		shortDesc: "100% chance to lower the target's Speed by 1.",
		id: "mudshot",
		name: "Mud Shot",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spe: -1
			}
		},
		target: "normal",
		type: "Ground"
	},
	"mudsport": {
		num: 300,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the user is no longer active, all Electric-type attacks used by any active Pokemon have their power reduced to 0.33x. Fails if this move is already in effect; not stackable.",
		shortDesc: "Weakens Electric-type attacks to 1/3 their power.",
		id: "mudsport",
		name: "Mud Sport",
		pp: 15,
		priority: 0,
		volatileStatus: 'mudsport',
		onTryHitField: function(target, source) {
			if (source.volatiles['mudsport']) return false;
		},
		effect: {
			noCopy: true,
			onStart: function(pokemon) {
				this.add("-start", pokemon, 'Mud Sport');
			},
			onBasePowerPriority: 1,
			onAnyBasePower: function(basePower, user, target, move) {
				if (move.type === 'Electric') return this.chainModify([0x548, 0x1000]); // The Mud Sport modifier is slightly higher than the usual 0.33 modifier (0x547)
			}
		},
		secondary: false,
		target: "all",
		type: "Ground"
	},
	"muddywater": {
		num: 330,
		accuracy: 85,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 30% chance to lower their accuracy by 1 stage each.",
		shortDesc: "30% chance to lower the foe(s) accuracy by 1.",
		id: "muddywater",
		isViable: true,
		name: "Muddy Water",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1
			}
		},
		target: "allAdjacentFoes",
		type: "Water"
	},
	"mysticalfire": {
		num: 595,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target and lowers its Special Attack by 1 stage.",
		shortDesc: "Lowers the target's Special Attack by 1.",
		id: "mysticalfire",
		name: "Mystical Fire",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spa: -1
			}
		},
		target: "normal",
		type: "Fire"
	},
	"nastyplot": {
		num: 417,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack by 2 stages.",
		shortDesc: "Boosts the user's Sp. Atk by 2.",
		id: "nastyplot",
		isViable: true,
		name: "Nasty Plot",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spa: 2
		},
		secondary: false,
		target: "self",
		type: "Dark"
	},
	"naturalgift": {
		num: 363,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			if (pokemon.volatiles['naturalgift']) return pokemon.volatiles['naturalgift'].basePower;
			return false;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target if the user's held item is a Berry. The type and power of this move depend on the kind of Berry held, and the Berry is lost. Fails if the user is not holding a Berry, if the user has the Ability Klutz, or if Embargo or Magic Room is in effect for the user.",
		shortDesc: "Power and type depends on the user's Berry.",
		id: "naturalgift",
		name: "Natural Gift",
		pp: 15,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			var item = pokemon.getItem();
			if (item.id && item.naturalGift) {
				pokemon.addVolatile('naturalgift');
				pokemon.volatiles['naturalgift'].basePower = item.naturalGift.basePower;
				pokemon.volatiles['naturalgift'].type = item.naturalGift.type;
				pokemon.setItem('');
			}
		},
		onTryHit: function(target, source) {
			if (!source.volatiles['naturalgift']) return false;
		},
		onModifyMove: function(move, pokemon) {
			if (pokemon.volatiles['naturalgift']) move.type = pokemon.volatiles['naturalgift'].type;
		},
		onHit: function(target, source) {
			return !!source.volatiles['naturalgift'];
		},
		effect: {
			duration: 1
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"naturepower": {
		num: 267,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move calls another move for use depending on the battle terrain: Thunderbolt in Electric Terrain, Energy Ball in Grassy Terrain, Moonblast in Misty Terrain, and Tri Attack in plain terrain.",
		shortDesc: "Attack depends on terrain (default Tri Attack).",
		id: "naturepower",
		isViable: true,
		name: "Nature Power",
		pp: 20,
		priority: 0,
		onHit: function(target) {
			var moveToUse = 'triattack';
			if (this.isTerrain('electricterrain')) moveToUse = 'thunderbolt';
			else if (this.isTerrain('grassyterrain')) moveToUse = 'energyball';
			else if (this.isTerrain('mistyterrain')) moveToUse = 'moonblast';

			this.useMove(moveToUse, target);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"needlearm": {
		num: 302,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Makes contact.",
		shortDesc: "30% chance to flinch the target.",
		id: "needlearm",
		name: "Needle Arm",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Grass"
	},
	"nightdaze": {
		num: 539,
		accuracy: 95,
		basePower: 85,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 40% chance to lower its accuracy by 1 stage.",
		shortDesc: "40% chance to lower the target's accuracy by 1.",
		id: "nightdaze",
		isViable: true,
		name: "Night Daze",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 40,
			boosts: {
				accuracy: -1
			}
		},
		target: "normal",
		type: "Dark"
	},
	"nightshade": {
		num: 101,
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		category: "Special",
		desc: "Deals damage to one adjacent target equal to the user's level.",
		shortDesc: "Does damage equal to the user's level.",
		id: "nightshade",
		isViable: true,
		name: "Night Shade",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"nightslash": {
		num: 400,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio.",
		id: "nightslash",
		isViable: true,
		name: "Night Slash",
		pp: 15,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"nightmare": {
		num: 171,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to lose 1/4 of its maximum HP, rounded down, at the end of each turn as long as it is asleep. This move does not affect the target unless it is asleep. The effect ends when the target wakes up.",
		shortDesc: "A sleeping target is hurt by 1/4 max HP per turn.",
		id: "nightmare",
		name: "Nightmare",
		pp: 15,
		priority: 0,
		volatileStatus: 'nightmare',
		effect: {
			onResidualOrder: 9,
			onStart: function(pokemon) {
				if (pokemon.status !== 'slp') {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidualOrder: 9,
			onResidual: function(pokemon) {
				if (pokemon.status !== 'slp') {
					pokemon.removeVolatile('nightmare');
					return;
				}
				this.damage(pokemon.maxhp/4);
			}
		},
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"nobleroar": {
		num: 568,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack and Special Attack by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers target's Atk and SpAtk by 1.",
		id: "nobleroar",
		name: "Noble Roar",
		pp: 30,
		priority: 0,
		boosts: {
			atk: -1,
			spa: -1
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"nuzzle": {
		num: 609,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Deals damage and paralyzes the target.",
		shortDesc: "Deals damage and paralyzes the target.",
		id: "nuzzle",
		name: "Nuzzle",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 100,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"oblivionwing": {
		num: 613,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target. The user recovers 75% of the HP lost by the target, rounded up.",
		shortDesc: "User recovers 75% of the damage dealt.",
		id: "oblivionwing",
		isViable: true,
		name: "Oblivion Wing",
		pp: 10,
		priority: 0,
		drain: [3,4],
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"octazooka": {
		num: 190,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 50% chance to lower its accuracy by 1 stage.",
		shortDesc: "50% chance to lower the target's accuracy by 1.",
		id: "octazooka",
		name: "Octazooka",
		pp: 10,
		priority: 0,
		isBullet: true,
		secondary: {
			chance: 50,
			boosts: {
				accuracy: -1
			}
		},
		target: "normal",
		type: "Water"
	},
	"odorsleuth": {
		num: 316,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to have its positive evasion stat stage set to 0 while it is active. Normal and Fighting-type attacks can hit the target if it is a Ghost-type. The effect ends when the target is no longer active. Fails if the target is already affected. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute.",
		shortDesc: "Blocks evasion mods. Fighting, Normal hit Ghost.",
		id: "odorsleuth",
		name: "Odor Sleuth",
		pp: 40,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'foresight',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"ominouswind": {
		num: 466,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to raise the user's Attack, Defense, Speed, Special Attack, and Special Defense by 1 stage.",
		shortDesc: "10% chance to boost all stats by 1 (not acc/eva).",
		id: "ominouswind",
		name: "Ominous Wind",
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
		type: "Ghost"
	},
	"outrage": {
		num: 200,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent foe at random. The user spends two or three turns locked into this move and becomes confused after the last turn of the effect if it is not already. If the user is prevented from moving or the attack is not successful against the target on the first turn of the effect or the second turn of a three-turn effect, the effect ends without causing confusion. If this move is called by Sleep Talk, the move is used for one turn and does not confuse the user. Makes contact.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "outrage",
		isViable: true,
		name: "Outrage",
		pp: 10,
		priority: 0,
		isContact: true,
		self: {
			volatileStatus: 'lockedmove'
		},
		secondary: false,
		target: "randomNormal",
		type: "Dragon"
	},
	"overheat": {
		num: 315,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		desc: "Deals damage to one adjacent target and lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "overheat",
		isViable: true,
		name: "Overheat",
		pp: 5,
		priority: 0,
		self: {
			boosts: {
				spa: -2
			}
		},
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"painsplit": {
		num: 220,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and one adjacent target's HP become the average of their current HP, rounded down, but not more than the maximum HP of either one.",
		shortDesc: "Shares HP of user and target equally.",
		id: "painsplit",
		isViable: true,
		name: "Pain Split",
		pp: 20,
		priority: 0,
		onHit: function(target, pokemon) {
			var averagehp = Math.floor((target.hp + pokemon.hp) / 2) || 1;
			target.sethp(averagehp);
			pokemon.sethp(averagehp);
			this.add('-sethp', target, target.getHealth, pokemon, pokemon.getHealth, '[from] move: Pain Split');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"paraboliccharge": {
		num: 570,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Deals damage to all adjacent targets. The user recovers half of the HP lost by the target, rounded up.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "paraboliccharge",
		name: "Parabolic Charge",
		pp: 20,
		priority: 0,
		isViable: true,
		drain: [1,2],
		secondary: false,
		target: "allAdjacent",
		type: "Electric"
	},
	"partingshot": {
		num: 575,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers all adjacent foes' Attack and Special Attack by 1 stage, then the user switches out.",
		shortDesc: "Foe's Atk/SpA -1, then switch out.",
		id: "partingshot",
		name: "Parting Shot",
		pp: 20,
		priority: 0,
		isSoundBased: true,
		selfSwitch: true,
		boosts: {
			atk: -1,
			spa: -1
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"payday": {
		num: 6,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target. (In-game: Each time this move is successfully used in battle, an amount of money equal to five times the user's level is added to the total the player receives upon winning the battle.)",
		shortDesc: "Scatters coins.",
		id: "payday",
		name: "Pay Day",
		pp: 20,
		priority: 0,
		onHit: function() {
			this.add('-fieldactivate', 'move: Pay Day');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"payback": {
		num: 371,
		accuracy: 100,
		basePower: 50,
		basePowerCallback: function(pokemon, target) {
			if (target.newlySwitched) {
				this.debug('Payback NOT boosted on a switch');
				return 50;
			}
			if (this.willMove(target)) {
				this.debug('Payback NOT boosted');
				return 50;
			}
			this.debug('Payback damage boost');
			return 100;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power doubles if the target moves before the user; power is not doubled if the target switches out. Makes contact.",
		shortDesc: "Power doubles if the user moves after the target.",
		id: "payback",
		isViable: true,
		name: "Payback",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"peck": {
		num: 64,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "peck",
		name: "Peck",
		pp: 35,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"perishsong": {
		num: 195,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the user and all adjacent and non-adjacent Pokemon to receive a perish count of 4 if it doesn't already have a perish count. At the end of each turn including the turn used, the perish count of all active Pokemon lowers by 1 and Pokemon faint if the number reaches 0. The perish count is removed from Pokemon who switch out. If a Pokemon uses Baton Pass while it has a perish count, the replacement will gain the perish count and continue to count down. Pokemon with the Ability Soundproof are immune. Ignores a target's Substitute.",
		shortDesc: "All active Pokemon will faint in 3 turns.",
		id: "perishsong",
		isViable: true,
		name: "Perish Song",
		pp: 5,
		priority: 0,
		isSoundBased: true,
		onHitField: function(target, source) {
			var result = true;
			for (var i=0; i<this.sides.length; i++) {
				for (var j=0; j<this.sides[i].active.length; j++) {
					if (this.sides[i].active[j]) {
						if (!this.sides[i].active[j].volatiles['perishsong']) {
							result = false;
						}
						if (this.sides[i].active[j].ability !== 'soundproof') {
							this.sides[i].active[j].addVolatile('perishsong');
						} else {
							this.add('-immune', this.sides[i].active[j], '[msg]');
							this.add('-end', this.sides[i].active[j], 'Perish Song');
						}
					}
				}
			}
			if (result) return false;
			this.add('-fieldactivate', 'move: Perish Song');
		},
		effect: {
			duration: 4,
			onEnd: function(target) {
				this.add('-start',target,'perish0');
				target.faint();
			},
			onResidual: function(pokemon) {
				var duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start',pokemon,'perish'+duration);
			}
		},
		secondary: false,
		target: "all",
		type: "Normal"
	},
	"petalblizzard": {
		num: 572,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Hits all adjacent Pokemon.",
		shortDesc: "Hits all adjacent Pokemon.",
		id: "petalblizzard",
		name: "Petal Blizzard",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "allAdjacent",
		type: "Grass"
	},
	"petaldance": {
		num: 80,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent foe at random. The user spends two or three turns locked into this move and becomes confused after the last turn of the effect if it is not already. If the user is prevented from moving or the attack is not successful against the target on the first turn of the effect or the second turn of a three-turn effect, the effect ends without causing confusion. If this move is called by Sleep Talk, the move is used for one turn and does not confuse the user. Makes contact.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "petaldance",
		isViable: true,
		name: "Petal Dance",
		pp: 10,
		priority: 0,
		isContact: true,
		self: {
			volatileStatus: 'lockedmove'
		},
		secondary: false,
		target: "randomNormal",
		type: "Grass"
	},
	"phantomforce": {
		num: 566,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target and breaks through Protect and Detect for this turn, allowing other Pokemon to attack the target normally. This attack charges on the first turn and strikes on the second. On the first turn, the user avoids all attacks. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn. Makes contact.",
		shortDesc: "Disappears turn 1. Hits turn 2. Breaks protection.",
		id: "phantomforce",
		name: "Phantom Force",
		pp: 10,
		priority: 0,
		isContact: true,
		isTwoTurnMove: true,
		breaksProtect: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'phantomforce',
			onAccuracy: function(accuracy, target, source, move) {
				if (move.id === 'helpinghand') {
					return;
				}
				return 0;
			}
		},
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"pinmissile": {
		num: 42,
		accuracy: 95,
		basePower: 25,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "pinmissile",
		name: "Pin Missile",
		pp: 20,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"playnice": {
		num: 589,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 1 stage. Ignores Protect.",
		shortDesc: "Lowers target's Attack by 1. Ignores Protect.",
		id: "playnice",
		name: "Play Nice",
		pp: 20,
		priority: 0,
		isNotProtectable: true,
		boosts: {
			atk: -1
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"playrough": {
		num: 583,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "May lower the target's Attack stat by 1.",
		shortDesc: "May lower the target's Attack by 1.",
		id: "playrough",
		name: "Play Rough",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			boosts: {
				atk: -1
			}
		},
		target: "normal",
		type: "Fairy"
	},
	"pluck": {
		num: 365,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target. If this move is successful and the user has not fainted, it steals the target's held Berry if it is holding one and uses it immediately. Makes contact.",
		shortDesc: "User steals and eats the target's Berry.",
		id: "pluck",
		name: "Pluck",
		pp: 20,
		priority: 0,
		isContact: true,
		onHit: function(target, source) {
			var item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Pluck', '[of] '+source);
				this.singleEvent('Eat', item, null, source, null, null);
				source.ateBerry = true;
			}
		},
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"poisonfang": {
		num: 305,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to badly poison it. Makes contact.",
		shortDesc: "30% chance to badly poison the target.",
		id: "poisonfang",
		name: "Poison Fang",
		pp: 15,
		priority: 0,
		isContact: true,
		isBiteAttack: true,
		secondary: {
			chance: 30,
			status: 'tox'
		},
		target: "normal",
		type: "Poison"
	},
	"poisongas": {
		num: 139,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Poisons all adjacent foes. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Poisons the foe(s).",
		id: "poisongas",
		name: "Poison Gas",
		pp: 40,
		priority: 0,
		status: 'psn',
		secondary: false,
		target: "allAdjacentFoes",
		type: "Poison"
	},
	"poisonjab": {
		num: 398,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to poison it. Makes contact.",
		shortDesc: "30% chance to poison the target.",
		id: "poisonjab",
		isViable: true,
		name: "Poison Jab",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			status: 'psn'
		},
		target: "normal",
		type: "Poison"
	},
	"poisonpowder": {
		num: 77,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Poisons one adjacent target. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Poisons the target.",
		id: "poisonpowder",
		name: "Poison Powder",
		pp: 35,
		priority: 0,
		isPowder: true,
		onTryHit: function(pokemon) {
			if (!pokemon.runImmunity('powder')) return false;
		},
		status: 'psn',
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"poisonsting": {
		num: 40,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to poison it.",
		shortDesc: "30% chance to poison the target.",
		id: "poisonsting",
		name: "Poison Sting",
		pp: 35,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'psn'
		},
		target: "normal",
		type: "Poison"
	},
	"poisontail": {
		num: 342,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to poison it and a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio. 10% chance to poison.",
		id: "poisontail",
		name: "Poison Tail",
		pp: 25,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: {
			chance: 10,
			status: 'psn'
		},
		target: "normal",
		type: "Poison"
	},
	"pound": {
		num: 1,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "pound",
		name: "Pound",
		pp: 35,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"powder": {
		num: 600,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Covers the target in powder that explodes if the target uses a Fire-type move. +1 Priority.",
		shortDesc: "Foe takes damage when using Fire moves. +1 Priority.",
		id: "powder",
		name: "Powder",
		pp: 20,
		priority: 1,
		isPowder: true,
		onTryHit: function(pokemon) {
			if (!pokemon.runImmunity('powder')) return false;
		},
		isBounceable: true,
		volatileStatus: 'powder',
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-start', target, 'Powder');
			},
			onBeforeMove: function(pokemon, target, move) {
				var item = pokemon.getItem();
				if (move.type === 'Fire' || (move.name === 'Hidden Power' && pokemon.hpType === 'Fire') || (move.name === 'Weather Ball' && this.isWeather('sunnyday')) || (item.isBerry && move.name === 'Natural Gift' && item.naturalGift.type === 'Fire') || (move.name === 'Judgment' && item.name === 'Flame Plate')) {
					this.add('-activate', pokemon, 'Powder');
					this.directDamage(Math.floor(pokemon.maxhp / 4) + 1);
					return false;
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"powdersnow": {
		num: 181,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 10% chance to freeze each.",
		shortDesc: "10% chance to freeze the foe(s).",
		id: "powdersnow",
		name: "Powder Snow",
		pp: 25,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'frz'
		},
		target: "allAdjacentFoes",
		type: "Ice"
	},
	"powergem": {
		num: 408,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "No additional effect.",
		id: "powergem",
		name: "Power Gem",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"powersplit": {
		num: 471,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and one adjacent target have their Attack and Special Attack stats set to be equal to the average of the user and the target's Attack and Special Attack stats, respectively, rounded down. Stat stage changes are unaffected.",
		shortDesc: "Averages Attack and Sp. Atk stats with target.",
		id: "powersplit",
		name: "Power Split",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var newatk = Math.floor((target.stats.atk + source.stats.atk)/2);
			target.stats.atk = newatk;
			source.stats.atk = newatk;
			var newspa = Math.floor((target.stats.spa + source.stats.spa)/2);
			target.stats.spa = newspa;
			source.stats.spa = newspa;
			this.add('-activate', source, 'Power Split', '[of] '+target);
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"powerswap": {
		num: 384,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps its Attack and Special Attack stat stage changes with one adjacent target. Ignores a target's Substitute.",
		shortDesc: "Swaps Attack and Sp. Atk stat stages with target.",
		id: "powerswap",
		name: "Power Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			var sourceBoosts = {};

			for (var i in {atk:1,spa:1}) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);

			this.add('-swapboost', source, target, 'atk, spa', '[from] move: Power Swap');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"powertrick": {
		num: 379,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps its Attack and Defense stats; stat stage changes remain on their respective stats. This move can be used again to swap the stats back. If the user uses Baton Pass, the replacement will have its Attack and Defense stats swapped if the effect is active.",
		shortDesc: "Switches user's Attack and Defense stats.",
		id: "powertrick",
		name: "Power Trick",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'powertrick',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'Power Trick');
				var newatk = pokemon.stats.def;
				var newdef = pokemon.stats.atk;
				pokemon.stats.atk = newatk;
				pokemon.stats.def = newdef;
			},
			onCopy: function(pokemon) {
				this.add('-start', pokemon, 'Power Trick');
				var newatk = pokemon.stats.def;
				var newdef = pokemon.stats.atk;
				pokemon.stats.atk = newatk;
				pokemon.stats.def = newdef;
			},
			onEnd: function(pokemon) {
				this.add('-end', pokemon, 'Power Trick');
				var newatk = pokemon.stats.def;
				var newdef = pokemon.stats.atk;
				pokemon.stats.atk = newatk;
				pokemon.stats.def = newdef;
			},
			onRestart: function(pokemon) {
				pokemon.removeVolatile('Power Trick');
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"poweruppunch": {
		num: 612,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Hitting a target raises the Attack stat.",
		shortDesc: "Hitting a target raises Attack by 1",
		id: "poweruppunch",
		name: "Power-Up Punch",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 100,
			self: {
				boosts: {
					atk: 1
				}
			}
		},
		target: "normal",
		type: "Fighting"
	},
	"powerwhip": {
		num: 438,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "powerwhip",
		isViable: true,
		name: "Power Whip",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"present": {
		num: 217,
		accuracy: 90,
		basePower: 0,
		category: "Physical",
		desc: "Deals damage or heals one adjacent target. 40% chance for 40 power, 30% chance for 80 power, 10% chance for 120 power, and 20% chance to heal the target by 1/4 of its maximum HP, rounded down. This move must hit to be effective.",
		shortDesc: "40, 80, 120 power, or heals target by 1/4 max HP.",
		id: "present",
		name: "Present",
		pp: 15,
		priority: 0,
		onModifyMove: function(move, pokemon, target) {
			var rand = this.random(10);
			if (rand < 2) {
				move.heal = [1,4];
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
		type: "Normal"
	},
	"protect": {
		num: 182,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most attacks made by other Pokemon during this turn. This attack has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used. X resets to 1 if this attack fails or if the user's last used move is not Detect, Endure, Protect, Quick Guard, or Wide Guard. If X is 256 or more, this move has a 1/(2^32) chance of being successful. Fails if the user moves last this turn. Priority +4.",
		shortDesc: "Prevents moves from affecting the user this turn.",
		id: "protect",
		isViable: true,
		name: "Protect",
		pp: 10,
		priority: 4,
		stallingMove: true, // Note: stallingMove is not used anywhere.
		volatileStatus: 'protect',
		onTryHit: function(pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function(pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function(target, source, move) {
				if (move.breaksProtect) {
					target.removeVolatile('Protect');
					return;
				}
				if (move && (move.target === 'self' || move.isNotProtectable)) return;
				this.add('-activate', target, 'Protect');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"psybeam": {
		num: 60,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to confuse it.",
		shortDesc: "10% chance to confuse the target.",
		id: "psybeam",
		name: "Psybeam",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 10,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Psychic"
	},
	"psychup": {
		num: 244,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user copies all of one adjacent target's current stat stage changes. This move ignores Protect and Detect. Ignores a target's Substitute.",
		shortDesc: "Copies the target's current stat stages.",
		id: "psychup",
		name: "Psych Up",
		pp: 10,
		priority: 0,
		isNotProtectable: true,
		onHit: function(target, source) {
			var targetBoosts = {};
			for (var i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
			}
			source.setBoost(targetBoosts);
			this.add('-copyboost', source, target, '[from] move: Psych Up');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"psychic": {
		num: 94,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to lower its Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "psychic",
		isViable: true,
		name: "Psychic",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 10,
			boosts: {
				spd: -1
			}
		},
		target: "normal",
		type: "Psychic"
	},
	"psychoboost": {
		num: 354,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Deals damage to one adjacent target and lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "psychoboost",
		isViable: true,
		name: "Psycho Boost",
		pp: 5,
		priority: 0,
		self: {
			boosts: {
				spa: -2
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"psychocut": {
		num: 427,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "psychocut",
		isViable: true,
		name: "Psycho Cut",
		pp: 20,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"psychoshift": {
		num: 375,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user's major status problem is transferred to one adjacent target, and the user is cured. Fails if the target already has a major status problem.",
		shortDesc: "Transfers the user's status ailment to the target.",
		id: "psychoshift",
		isViable: true,
		name: "Psycho Shift",
		pp: 10,
		priority: 0,
		onHit: function(target, pokemon) {
			if (pokemon.status && !target.status && target.trySetStatus(pokemon.status)) {
				pokemon.cureStatus();
			} else {
				return false;
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"psyshock": {
		num: 473,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "Deals damage to one adjacent target based on its Defense instead of Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
		id: "psyshock",
		isViable: true,
		name: "Psyshock",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"psystrike": {
		num: 540,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "Deals damage to one adjacent target based on its Defense instead of Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
		id: "psystrike",
		isViable: true,
		name: "Psystrike",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"psywave": {
		num: 149,
		accuracy: 100,
		basePower: 0,
		damageCallback: function(pokemon) {
			return (this.random(50,151) * pokemon.level) / 100;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target equal to (user's level) * (X+50) / 100, where X is a random number from 0 to 100, rounded down, but not less than 1HP.",
		shortDesc: "Random damage equal to 0.5x-1.5x user's level.",
		id: "psywave",
		name: "Psywave",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"punishment": {
		num: 386,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			return 60 + 20 * target.positiveBoosts();
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power is equal to 60+(X*20), where X is the target's total stat stage changes that are greater than 0, but not more than 200 power. Makes contact.",
		shortDesc: "60 power+20 for each of the target's stat boosts.",
		id: "punishment",
		name: "Punishment",
		pp: 5,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"pursuit": {
		num: 228,
		accuracy: 100,
		basePower: 40,
		basePowerCallback: function(pokemon, target) {
			// you can't get here unless the pursuit succeeds
			if (target.beingCalledBack) {
				this.debug('Pursuit damage boost');
				return 80;
			}
			return 40;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. If an adjacent foe switches out this turn, this move hits that Pokemon before it leaves the field. If the user moves after a foe using U-turn or Volt Switch, but not Baton Pass, it will hit that foe before it leaves the field. Power doubles and no accuracy check is done if the user hits a foe switching out, and the user's turn is over; if a foe faints from this, the replacement Pokemon does not become active until the end of the turn. Makes contact.",
		shortDesc: "Power doubles if a foe is switching out.",
		id: "pursuit",
		isViable: true,
		name: "Pursuit",
		pp: 20,
		priority: 0,
		isContact: true,
		beforeTurnCallback: function(pokemon, target) {
			target.side.addSideCondition('pursuit', pokemon);
			if (!target.side.sideConditions['pursuit'].sources) {
				target.side.sideConditions['pursuit'].sources = [];
			}
			target.side.sideConditions['pursuit'].sources.push(pokemon);
		},
		onModifyMove: function(move, source, target) {
			if (target && target.beingCalledBack) move.accuracy = true;
		},
		onTryHit: function(target, pokemon) {
			target.side.removeSideCondition('pursuit');
		},
		effect: {
			duration: 1,
			onBeforeSwitchOut: function(pokemon) {
				this.debug('Pursuit start');
				var sources = this.effectData.sources;
				for (var i=0; i<sources.length; i++) {
					this.cancelMove(sources[i]);
					this.runMove('pursuit', sources[i], pokemon);
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"quash": {
		num: 511,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to take its turn after all other Pokemon this turn, no matter the priority of its selected move. Fails if the target already moved this turn.",
		shortDesc: "Forces the target to move last this turn.",
		id: "quash",
		name: "Quash",
		pp: 15,
		priority: 0,
		onHit: function(target) {
			if (target.side.active.length < 2) return false; // fails in singles
			var decision = this.willMove(target);
			if (decision) {
				this.cancelMove(target);
				for (var i=this.queue.length-1; i>=0; i--) {
					if (this.queue[i].choice === 'residual') {
						this.queue.splice(i,0,decision);
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
		type: "Dark"
	},
	"quickattack": {
		num: 98,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact. Priority +1.",
		shortDesc: "Usually goes first.",
		id: "quickattack",
		isViable: true,
		name: "Quick Attack",
		pp: 30,
		priority: 1,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"quickguard": {
		num: 501,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and its party members are protected from attacks with priority greater than 0 made by other Pokemon, including allies, during this turn. Fails if this move is already in effect for the user's side. Priority +3.",
		shortDesc: "Protects allies from priority attacks this turn.",
		id: "quickguard",
		name: "Quick Guard",
		pp: 15,
		priority: 3,
		isSnatchable: true,
		sideCondition: 'quickguard',
		onTryHitSide: function(side, source) {
			return this.willAct();
		},
		effect: {
			duration: 1,
			onStart: function(target, source) {
				this.add('-singleturn', source, 'Quick Guard');
			},
			onTryHitPriority: 4,
			onTryHit: function(target, source, effect) {
				// Quick Guard blocks moves with positive priority, even those given increased priority by Prankster or Gale Wings.
				// (e.g. it blocks 0 priority moves boosted by Prankster or Gale Wings)
				if (effect && (effect.id === 'feint' || effect.priority <= 0 || effect.target === 'self')) {
					return;
				}
				this.add('-activate', target, 'Quick Guard');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			}
		},
		secondary: false,
		target: "allySide",
		type: "Fighting"
	},
	"quiverdance": {
		num: 483,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "Boosts the user's Sp. Atk, Sp. Def, Speed by 1.",
		id: "quiverdance",
		isViable: true,
		name: "Quiver Dance",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spa: 1,
			spd: 1,
			spe: 1
		},
		secondary: false,
		target: "self",
		type: "Bug"
	},
	"rage": {
		num: 99,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Once this move is used, the user's Attack is raised by 1 stage every time it is hit by another Pokemon's attack as long as this move is chosen for use. Makes contact.",
		shortDesc: "Boosts the user's Attack by 1 if hit during use.",
		id: "rage",
		name: "Rage",
		pp: 20,
		priority: 0,
		isContact: true,
		self: {
			volatileStatus: 'rage'
		},
		effect: {
			onStart: function(pokemon) {
				this.add('-singlemove', pokemon, 'Rage');
			},
			onHit: function(target, source, move) {
				if (target !== source && move.category !== 'Status') {
					this.boost({atk:1});
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove: function(pokemon) {
				this.debug('removing Rage before attack');
				pokemon.removeVolatile('rage');
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"ragepowder": {
		num: 476,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the end of the turn, all single-target attacks from the foe's team are redirected to the user if they are in range. Such attacks are redirected to the user before they can be reflected by Magic Coat or the Ability Magic Bounce, or drawn in by the Abilities Lightningrod or Storm Drain. Fails if it is not a double or triple battle. Priority +3.",
		shortDesc: "The foes' moves target the user on the turn used.",
		id: "ragepowder",
		name: "Rage Powder",
		pp: 20,
		priority: 2,
		isPowder: true,
		volatileStatus: 'ragepowder',
		effect: {
			duration: 1,
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'move: Rage Powder');
			},
			onFoeRedirectTarget: function(target, source, source2, move) {
				if (source.runImmunity('powder') && this.validTarget(this.effectData.target, source, move.target)) {
					this.debug("Rage Powder redirected target of move");
					return this.effectData.target;
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Bug"
	},
	"raindance": {
		num: 240,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Rain Dance. The power of Water-type attacks is 1.5x and the power of Fire-type attacks is 0.5x during the effect. Lasts for 8 turns if the user is holding Damp Rock. Fails if the current weather is Rain Dance.",
		shortDesc: "For 5 turns, heavy rain powers Water moves.",
		id: "raindance",
		isViable: true,
		name: "Rain Dance",
		pp: 5,
		priority: 0,
		weather: 'RainDance',
		secondary: false,
		target: "all",
		type: "Water"
	},
	"rapidspin": {
		num: 229,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If this move is successful and the user has not fainted, the effects of Leech Seed and partial-trapping moves end for the user, and all hazards are removed from the user's side of the field.",
		shortDesc: "Frees user from hazards/partial trap/Leech Seed.",
		id: "rapidspin",
		isViable: true,
		name: "Rapid Spin",
		pp: 40,
		priority: 0,
		isContact: true,
		self: {
			onHit: function(pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] '+pokemon);
				}
				var sideConditions = {spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1};
				for (var i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Rapid Spin', '[of] '+pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					this.add('-remove', pokemon, pokemon.volatiles['partiallytrapped'].sourceEffect.name, '[from] move: Rapid Spin', '[of] '+pokemon, '[partiallytrapped]');
					delete pokemon.volatiles['partiallytrapped'];
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"razorleaf": {
		num: 75,
		accuracy: 95,
		basePower: 55,
		category: "Physical",
		desc: "Deals damage to all adjacent foes with a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio. Hits adjacent foes.",
		id: "razorleaf",
		name: "Razor Leaf",
		pp: 25,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Grass"
	},
	"razorshell": {
		num: 534,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 50% chance to lower its Defense by 1 stage. Makes contact.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "razorshell",
		isViable: true,
		name: "Razor Shell",
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
		type: "Water"
	},
	"razorwind": {
		num: 13,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a higher chance for a critical hit. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges, then hits foe(s) turn 2. High crit ratio.",
		id: "razorwind",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'razorwind'
		},
		critRatio: 2,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal"
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
		isSnatchable: true,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"recycle": {
		num: 278,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user regains the item it last used, if it is not holding an item. Fails if the user was not holding an item, if the item was a popped Air Balloon, or if the item was lost to Bug Bite, Covet, Incinerate, Knock Off, Pluck, or Thief. Items thrown with Fling can be regained.",
		shortDesc: "Restores the item the user last used.",
		id: "recycle",
		name: "Recycle",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		onHit: function(pokemon) {
			if (!pokemon.item && pokemon.lastItem) {
				pokemon.setItem(pokemon.lastItem);
				this.add("-item", pokemon, pokemon.item, '[from] move: Recycle');
			} else return false;
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"reflect": {
		num: 115,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members take 0.5x damage from physical attacks, or 0.66x damage if in a double or triple battle. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break or Defog. Brick Break removes the effect before damage is calculated. Lasts for 8 turns if the user is holding Light Clay.",
		shortDesc: "For 5 turns, physical damage to allies is halved.",
		id: "reflect",
		isViable: true,
		name: "Reflect",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		sideCondition: 'reflect',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.item === 'lightclay') {
					return 8;
				}
				return 5;
			},
			onFoeModifyDamage: function(damage, source, target, move) {
				if (this.getCategory(move) === 'Physical' && target.side === this.effectData.target) {
					if (!move.crit && !move.ignoreScreens) {
						this.debug('Reflect weaken');
						if (source.side.active.length > 1) return this.chainModify(0.66);
						return this.chainModify(0.5);
					}
				}
			},
			onStart: function(side) {
				this.add('-sidestart',side,'Reflect');
			},
			onResidualOrder: 21,
			onEnd: function(side) {
				this.add('-sideend',side,'Reflect');
			}
		},
		secondary: false,
		target: "allySide",
		type: "Psychic"
	},
	"reflecttype": {
		num: 513,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the user's types to become those of one adjacent target. Fails if the user is an Arceus. Ignores a target's Substitute.",
		shortDesc: "User becomes the same type as the target.",
		id: "reflecttype",
		name: "Reflect Type",
		pp: 15,
		priority: 0,
		onHit: function(target, source) {
			if (source.num === 493) return false;
			this.add('-start', source, 'typechange', target.getTypes(true).join('/'), '[from] move: Reflect Type', '[of] '+target);
			source.typesData = [];
			for (var i=0, l=target.typesData.length; i<l; i++) {
				if (target.typesData[i].suppressed) continue;
				source.typesData.push({
					type: target.typesData[i].type,
					suppressed: false,
					isAdded: target.typesData[i].isAdded
				});
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"refresh": {
		num: 287,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user cures its burn, poison, or paralysis.",
		shortDesc: "Removes status from the user.",
		id: "refresh",
		isViable: true,
		name: "Refresh",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		onHit: function(pokemon) {
			pokemon.cureStatus();
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"relicsong": {
		num: 547,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 10% chance to put each to sleep. If this move is successful on at least one foe and the user is a Meloetta, it changes to the Pirouette Forme if it is currently in Aria Forme, or changes to Aria Forme if it is currently in Pirouette Forme. The Pirouette Forme reverts to Aria Forme when Meloetta is not active. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "10% chance to sleep foe(s). Meloetta transforms.",
		id: "relicsong",
		isViable: true,
		name: "Relic Song",
		pp: 10,
		priority: 0,
		isSoundBased: true,
		secondary: {
			chance: 10,
			status: 'slp'
		},
		onHit: function(target, pokemon) {
			if (pokemon.baseTemplate.species === 'Meloetta' && !pokemon.transformed) {
				pokemon.addVolatile('relicsong');
			}
		},
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function(pokemon, target, move) {
				if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
					this.add('-formechange', pokemon, 'Meloetta');
				} else if (pokemon.formeChange('Meloetta-Pirouette')) {
					this.add('-formechange', pokemon, 'Meloetta-Pirouette');
				}
				pokemon.removeVolatile('relicsong');
			}
		},
		target: "allAdjacentFoes",
		type: "Normal"
	},
	"rest": {
		num: 156,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user falls asleep for the next two turns and restores all of its HP, curing itself of any major status problem in the process. Fails if the user has full HP, is already asleep, or if another effect is preventing sleep.",
		shortDesc: "User sleeps 2 turns and restores HP and status.",
		id: "rest",
		isViable: true,
		name: "Rest",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		onHit: function(target) {
			if (target.hp >= target.maxhp) return false;
			if (!target.setStatus('slp')) return false;
			target.statusData.time = 3;
			target.statusData.startTime = 3;
			this.heal(target.maxhp); //Aeshetic only as the healing happens after you fall asleep in-game
			this.add('-status', target, 'slp', '[from] move: Rest');
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"retaliate": {
		num: 514,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power doubles if one of the user's party members fainted last turn. Makes contact.",
		shortDesc: "Power doubles if an ally fainted last turn.",
		id: "retaliate",
		name: "Retaliate",
		pp: 5,
		priority: 0,
		isContact: true,
		onBasePowerPriority: 4,
		onBasePower: function(basePower, pokemon) {
			if (pokemon.side.faintedLastTurn) {
				this.debug('Boosted for a faint last turn');
				return this.chainModify(2);
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"return": {
		num: 216,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			return Math.floor((pokemon.happiness * 10) / 25) || 1;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power is equal to the greater of (user's Happiness * 2/5), rounded down, or 1. Makes contact.",
		shortDesc: "Max 102 power at maximum Happiness.",
		id: "return",
		isViable: true,
		name: "Return",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"revenge": {
		num: 279,
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
		id: "revenge",
		name: "Revenge",
		pp: 10,
		priority: -4,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"reversal": {
		num: 179,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			var ratio = pokemon.hp * 48 / pokemon.maxhp;
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
		desc: "Deals damage to one adjacent target based on the amount of HP the user has left. X is equal to (user's current HP * 48 / user's maximum HP), rounded down; the base power of this attack is 20 if X is 33 to 48, 40 if X is 17 to 32, 80 if X is 10 to 16, 100 if X is 5 to 9, 150 if X is 2 to 4, and 200 if X is 0 or 1. Makes contact.",
		shortDesc: "More power the less HP the user has left.",
		id: "reversal",
		isViable: true,
		name: "Reversal",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"roar": {
		num: 46,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to be forced to switch out and be replaced with a random unfainted ally. Fails if the target used Ingrain previously or has the Ability Suction Cups. Pokemon with the Ability Soundproof are immune. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute. Priority -6. (Wild battles: The battle ends as long as it is not a double battle and the user's level is not less than the opponent's level.)",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "roar",
		isViable: true,
		name: "Roar",
		pp: 20,
		priority: -6,
		isSoundBased: true,
		isNotProtectable: true,
		forceSwitch: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"roaroftime": {
		num: 459,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "Deals damage to one adjacent target. If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "roaroftime",
		name: "Roar of Time",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustrecharge'
		},
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"rockblast": {
		num: 350,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "rockblast",
		isViable: true,
		name: "Rock Blast",
		pp: 10,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"rockclimb": {
		num: 431,
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 20% chance to confuse it. Makes contact.",
		shortDesc: "20% chance to confuse the target.",
		id: "rockclimb",
		name: "Rock Climb",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 20,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Normal"
	},
	"rockpolish": {
		num: 397,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages.",
		shortDesc: "Boosts the user's Speed by 2.",
		id: "rockpolish",
		isViable: true,
		name: "Rock Polish",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spe: 2
		},
		secondary: false,
		target: "self",
		type: "Rock"
	},
	"rockslide": {
		num: 157,
		accuracy: 90,
		basePower: 75,
		category: "Physical",
		desc: "Deals damage to all adjacent foes with a 30% chance to flinch each.",
		shortDesc: "30% chance to flinch the foe(s).",
		id: "rockslide",
		isViable: true,
		name: "Rock Slide",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "allAdjacentFoes",
		type: "Rock"
	},
	"rocksmash": {
		num: 249,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 50% chance to lower its Defense by 1 stage. Makes contact.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "rocksmash",
		name: "Rock Smash",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 50,
			boosts: {
				def: -1
			}
		},
		target: "normal",
		type: "Fighting"
	},
	"rockthrow": {
		num: 88,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "No additional effect.",
		id: "rockthrow",
		name: "Rock Throw",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"rocktomb": {
		num: 317,
		accuracy: 95,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 100% chance to lower its Speed by 1 stage.",
		shortDesc: "100% chance to lower the target's Speed by 1.",
		id: "rocktomb",
		name: "Rock Tomb",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spe: -1
			}
		},
		target: "normal",
		type: "Rock"
	},
	"rockwrecker": {
		num: 439,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If this move is successful, the user must recharge on the following turn and cannot make a move.",
		shortDesc: "User cannot move next turn.",
		id: "rockwrecker",
		name: "Rock Wrecker",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustrecharge'
		},
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"roleplay": {
		num: 272,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user's Ability changes to match one adjacent target's Ability. Fails if the user's Ability is Multitype or already matches the target, or if the target's Ability is Flower Gift, Forecast, Illusion, Imposter, Multitype, Trace, Wonder Guard, or Zen Mode. This move ignores Protect and Detect. Ignores a target's Substitute.",
		shortDesc: "User replaces its Ability with the target's.",
		id: "roleplay",
		name: "Role Play",
		pp: 10,
		priority: 0,
		isNotProtectable: true,
		onTryHit: function(target, source) {
			var bannedAbilities = {flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, trace:1, wonderguard:1, zenmode:1};
			if (bannedAbilities[target.ability] || source.ability === 'multitype' || target.ability === source.ability) {
				return false;
			}
		},
		onHit: function(target, source) {
			if (source.setAbility(target.ability)) {
				this.add('-ability', source, source.ability, '[from] move: Role Play', '[of] '+target);
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"rollingkick": {
		num: 27,
		accuracy: 85,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Makes contact.",
		shortDesc: "30% chance to flinch the target.",
		id: "rollingkick",
		name: "Rolling Kick",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Fighting"
	},
	"rollout": {
		num: 205,
		accuracy: 90,
		basePower: 30,
		basePowerCallback: function(pokemon, target) {
			var bp = 30;
			var bpTable = [30, 60, 120, 240, 480];
			if (pokemon.volatiles.rollout && pokemon.volatiles.rollout.hitCount) {
				bp = (bpTable[pokemon.volatiles.rollout.hitCount] || 480);
			}
			pokemon.addVolatile('rollout');
			if (pokemon.volatiles.defensecurl) {
				bp *= 2;
			}
			this.debug("Rollout bp: "+bp);
			return bp;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. The user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. Power doubles with each successful hit of this move and doubles again if Defense Curl was used previously by the user. If this move is called by Sleep Talk, the move is used for one turn. Makes contact.",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
		id: "rollout",
		name: "Rollout",
		pp: 20,
		priority: 0,
		isContact: true,
		effect: {
			duration: 2,
			onLockMove: 'rollout',
			onStart: function() {
				this.effectData.hitCount = 1;
			},
			onRestart: function() {
				this.effectData.hitCount++;
				if (this.effectData.hitCount < 5) {
					this.effectData.duration = 2;
				}
			},
			onResidual: function(target) {
				if (target.lastMove === 'struggle') {
					// don't lock
					delete target.volatiles['rollout'];
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"roost": {
		num: 355,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up. Until the end of the turn, Flying-type users lose their Flying-type and pure Flying-type users become Normal-type. Does nothing if the user's HP is full.",
		shortDesc: "Heals 50% HP. Flying-type removed 'til turn ends.",
		id: "roost",
		isViable: true,
		name: "Roost",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		heal: [1,2],
		self: {
			volatileStatus: 'roost',
		},
		effect: {
			duration: 1,
			onStart: function(pokemon) {
				for (var i=0, l=pokemon.typesData.length; i<l; i++) {
					if (pokemon.typesData[i].type === 'Flying') {
						pokemon.typesData[i].suppressed = true;
						break;
					}
				}
			},
			onModifyPokemon: function(pokemon) {
				for (var i=0, l=pokemon.typesData.length; i<l; i++) {
					if (pokemon.typesData[i].type === 'Flying') {
						pokemon.typesData[i].suppressed = true;
						break;
					}
				}
			},
			onEnd: function(pokemon) {
				for (var i=0, l=pokemon.typesData.length; i<l; i++) {
					if (pokemon.typesData[i].type === 'Flying') {
						pokemon.typesData[i].suppressed = false;
						break;
					}
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Flying"
	},
	"rototiller": {
		num: 563,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the Attack and Sp. Atk stats of Grass-type Pokemon.",
		shortDesc: "Raises Attack and Sp. Atk of Grass Pokemon.",
		id: "rototiller",
		name: "Rototiller",
		pp: 10,
		priority: 0,
		onHitField: function(target, source) {
			var targets = [];
			for (var i=0; i<this.sides.length; i++) {
				for (var j=0; j<this.sides[i].active.length; j++) {
					if (this.sides[i].active[j] && this.sides[i].active[j].hasType('Grass')) {
						// This move affects every Grass-type Pokemon in play.
						targets.push(this.sides[i].active[j]);
					}
				}
			}
			if (!targets.length) return false; // No targets; move fails
			for (var i=0; i<targets.length; i++) this.boost({atk: 1, spa: 1}, targets[i], source, 'move: Rototiller');
		},
		secondary: false,
		target: "all",
		type: "Ground"
	},
	"round": {
		num: 496,
		accuracy: 100,
		basePower: 60,
		basePowerCallback: function(target, source, move) {
			if (move.sourceEffect === 'round') {
				return 120;
			}
			return 60;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. If there are other active Pokemon that chose this move for use this turn, those Pokemon take their turn immediately after the user, in Speed order, and this move's power is 120 for each other user. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "Power doubles if others used Round this turn.",
		id: "round",
		name: "Round",
		pp: 15,
		priority: 0,
		isSoundBased: true,
		onTryHit: function(target, source) {
			for (var i=0; i<this.queue.length; i++) {
				var decision = this.queue[i];
				if (!decision.pokemon || !decision.move) continue;
				if (decision.move.id === 'round') {
					this.prioritizeQueue(decision);
					return;
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"sacredfire": {
		num: 221,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 50% chance to burn it. If the user is frozen, it will defrost before using this move.",
		shortDesc: "50% chance to burn the target. Thaws user.",
		id: "sacredfire",
		isViable: true,
		name: "Sacred Fire",
		pp: 5,
		priority: 0,
		thawsUser: true,
		secondary: {
			chance: 50,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"sacredsword": {
		num: 533,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target and ignores the target's stat stage changes, including evasion. Makes contact.",
		shortDesc: "Ignores the target's stat stage changes.",
		id: "sacredsword",
		isViable: true,
		name: "Sacred Sword",
		pp: 15,
		priority: 0,
		isContact: true,
		ignoreEvasion: true,
		ignoreDefensive: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"safeguard": {
		num: 219,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members cannot have major status problems or confusion inflicted on them by other Pokemon. It is removed from the user's side if the user or an ally is successfully hit by Defog.",
		shortDesc: "For 5 turns, protects user's party from status.",
		id: "safeguard",
		name: "Safeguard",
		pp: 25,
		priority: 0,
		isSnatchable: true,
		sideCondition: 'safeguard',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'persistent') {
					return 7;
				}
				return 5;
			},
			onSetStatus: function(status, target, source, effect) {
				if (effect && (effect.id === 'toxicspikes' || source && source !== target && !effect.ignoreScreens)) {
					this.debug('interrupting setStatus');
					return false;
				}
			},
			onTryConfusion: function(target, source, effect) {
				if (source && source !== target && effect && !effect.ignoreScreens) {
					this.debug('interrupting addVolatile');
					return false;
				}
			},
			onTryHit: function(target, source, move) {
				if (move && move.id === 'yawn') {
					this.debug('blocking yawn');
					return false;
				}
			},
			onStart: function(side) {
				this.add('-sidestart', side, 'Safeguard');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function(side) {
				this.add('-sideend', side, 'Safeguard');
			}
		},
		secondary: false,
		target: "allySide",
		type: "Normal"
	},
	"sandattack": {
		num: 28,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's accuracy by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the target's accuracy by 1.",
		id: "sandattack",
		name: "Sand Attack",
		pp: 15,
		priority: 0,
		boosts: {
			accuracy: -1
		},
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"sandtomb": {
		num: 328,
		accuracy: 85,
		basePower: 35,
		category: "Physical",
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "sandtomb",
		name: "Sand Tomb",
		pp: 15,
		priority: 0,
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"sandstorm": {
		num: 201,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Sandstorm. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are a Ground, Rock, or Steel-type, or have the Abilities Magic Guard, Overcoat, Sand Force, Sand Rush, or Sand Veil. The Special Defense of Rock-types is 1.5x during the effect. Lasts for 8 turns if the user is holding Smooth Rock. Fails if the current weather is Sandstorm.",
		shortDesc: "For 5 turns, a sandstorm rages.",
		id: "sandstorm",
		name: "Sandstorm",
		pp: 10,
		priority: 0,
		weather: 'Sandstorm',
		secondary: false,
		target: "all",
		type: "Rock"
	},
	"scald": {
		num: 503,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to burn it. If the user is frozen, it thaws out just before attacking.",
		shortDesc: "30% chance to burn the target. Thaws user.",
		id: "scald",
		isViable: true,
		name: "Scald",
		pp: 15,
		priority: 0,
		thawsUser: true,
		secondary: {
			chance: 30,
			status: 'brn'
		},
		target: "normal",
		type: "Water"
	},
	"scaryface": {
		num: 184,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Speed by 2 stages. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the target's Speed by 2.",
		id: "scaryface",
		name: "Scary Face",
		pp: 10,
		priority: 0,
		boosts: {
			spe: -2
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"scratch": {
		num: 10,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "scratch",
		name: "Scratch",
		pp: 35,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"screech": {
		num: 103,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Defense by 2 stages. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "Lowers the target's Defense by 2.",
		id: "screech",
		name: "Screech",
		pp: 40,
		priority: 0,
		isSoundBased: true,
		boosts: {
			def: -2
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"searingshot": {
		num: 545,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Deals damage to all adjacent Pokemon with a 30% chance to burn each.",
		shortDesc: "30% chance to burn adjacent Pokemon.",
		id: "searingshot",
		isViable: true,
		name: "Searing Shot",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'brn'
		},
		target: "allAdjacent",
		type: "Fire"
	},
	"secretpower": {
		num: 290,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to cause a secondary effect on the target based on the battle terrain. Lowers accuracy by 1 stage in Wi-Fi battles. (In-game: Causes sleeping in grass, lowers Speed by 1 stage in puddles, lowers Attack by 1 stage on water, flinching in caves, lowers accuracy by 1 stage on rocky ground and sand, freezing on snow and ice, and causes paralysis everywhere else.) The secondary effect chance is not affected by the Ability Serene Grace.",
		shortDesc: "Effect varies with terrain. (30% accuracy lower 1)",
		id: "secretpower",
		name: "Secret Power",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 30,
			// TODO: Look into the effects on different terrain
			status: 'par'
		},
		target: "normal",
		type: "Normal"
	},
	"secretsword": {
		num: 548,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "Deals damage to one adjacent target based on its Defense instead of Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
		id: "secretsword",
		isViable: true,
		name: "Secret Sword",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"seedbomb": {
		num: 402,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "No additional effect.",
		id: "seedbomb",
		isViable: true,
		name: "Seed Bomb",
		pp: 15,
		priority: 0,
		isBullet: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"seedflare": {
		num: 465,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 40% chance to lower its Special Defense by 2 stages.",
		shortDesc: "40% chance to lower the target's Sp. Def by 2.",
		id: "seedflare",
		isViable: true,
		name: "Seed Flare",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 40,
			boosts: {
				spd: -2
			}
		},
		target: "normal",
		type: "Grass"
	},
	"seismictoss": {
		num: 69,
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		category: "Physical",
		desc: "Deals damage to one adjacent target equal to the user's level. Makes contact.",
		shortDesc: "Does damage equal to the user's level.",
		id: "seismictoss",
		isViable: true,
		name: "Seismic Toss",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"selfdestruct": {
		num: 120,
		accuracy: 100,
		basePower: 200,
		category: "Physical",
		desc: "The user faints and then damage is dealt to all adjacent Pokemon.",
		shortDesc: "Hits adjacent Pokemon. The user faints.",
		id: "selfdestruct",
		name: "Self-Destruct",
		pp: 5,
		priority: 0,
		selfdestruct: true,
		secondary: false,
		target: "allAdjacent",
		type: "Normal"
	},
	"shadowball": {
		num: 247,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 20% chance to lower its Special Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Sp. Def by 1.",
		id: "shadowball",
		isViable: true,
		name: "Shadow Ball",
		pp: 15,
		priority: 0,
		isBullet: true,
		secondary: {
			chance: 20,
			boosts: {
				spd: -1
			}
		},
		target: "normal",
		type: "Ghost"
	},
	"shadowclaw": {
		num: 421,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio.",
		id: "shadowclaw",
		isViable: true,
		name: "Shadow Claw",
		pp: 15,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"shadowforce": {
		num: 467,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target and breaks through Protect and Detect for this turn, allowing other Pokemon to attack the target normally. This attack charges on the first turn and strikes on the second. On the first turn, the user avoids all attacks. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn. Makes contact.",
		shortDesc: "Disappears turn 1. Hits turn 2. Breaks protection.",
		id: "shadowforce",
		isViable: true,
		name: "Shadow Force",
		pp: 5,
		priority: 0,
		isContact: true,
		isTwoTurnMove: true,
		breaksProtect: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'shadowforce',
			onAccuracy: function(accuracy, target, source, move) {
				if (move.id === 'helpinghand') {
					return;
				}
				return 0;
			}
		},
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"shadowpunch": {
		num: 325,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target and does not check accuracy. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "This move does not check accuracy.",
		id: "shadowpunch",
		isViable: true,
		name: "Shadow Punch",
		pp: 20,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"shadowsneak": {
		num: 425,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact. Priority +1.",
		shortDesc: "Usually goes first.",
		id: "shadowsneak",
		isViable: true,
		name: "Shadow Sneak",
		pp: 30,
		priority: 1,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"sharpen": {
		num: 159,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage.",
		shortDesc: "Boosts the user's Attack by 1.",
		id: "sharpen",
		isViable: true,
		name: "Sharpen",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"sheercold": {
		num: 329,
		accuracy: 30,
		basePower: 0,
		category: "Special",
		desc: "Deals damage to one adjacent target equal to the target's max HP. Ignores accuracy and evasion modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Ability Sturdy are immune.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "sheercold",
		name: "Sheer Cold",
		pp: 5,
		priority: 0,
		secondary: false,
		ohko: true,
		target: "normal",
		type: "Ice"
	},
	"shellsmash": {
		num: 504,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack, Special Attack, and Speed by 2 stages. Lowers the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Boosts Atk, SpA, Spe by 2. Lowers Def, SpD by 1.",
		id: "shellsmash",
		isViable: true,
		name: "Shell Smash",
		pp: 15,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 2,
			spa: 2,
			spe: 2,
			def: -1,
			spd: -1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"shiftgear": {
		num: 508,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage and its Speed by 2 stages.",
		shortDesc: "Boosts the user's Speed by 2 and Attack by 1.",
		id: "shiftgear",
		isViable: true,
		name: "Shift Gear",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1,
			spe: 2
		},
		secondary: false,
		target: "self",
		type: "Steel"
	},
	"shockwave": {
		num: 351,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent target and does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "shockwave",
		name: "Shock Wave",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"signalbeam": {
		num: 324,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to confuse it.",
		shortDesc: "10% chance to confuse the target.",
		id: "signalbeam",
		isViable: true,
		name: "Signal Beam",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 10,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Bug"
	},
	"silverwind": {
		num: 318,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to raise the user's Attack, Defense, Speed, Special Attack, and Special Defense by 1 stage.",
		shortDesc: "10% chance to boost all stats by 1 (not acc/eva).",
		id: "silverwind",
		name: "Silver Wind",
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
		type: "Bug"
	},
	"simplebeam": {
		num: 493,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target's Ability to become Simple. Fails if the target's Ability is Multitype, Simple, Stance Change, or Truant. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "The target's Ability becomes Simple.",
		id: "simplebeam",
		name: "Simple Beam",
		pp: 15,
		priority: 0,
		isBounceable: true,
		onTryHit: function(pokemon) {
			var bannedAbilities = {multitype:1, simple:1, stancechange:1, truant:1};
			if (bannedAbilities[pokemon.ability]) {
				return false;
			}
		},
		onHit: function(pokemon) {
			if (pokemon.setAbility('simple')) {
				this.add('-ability', pokemon, 'Simple', '[from] move: Simple Beam');
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"sing": {
		num: 47,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Puts one adjacent target to sleep. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "Puts the target to sleep.",
		id: "sing",
		name: "Sing",
		pp: 15,
		priority: 0,
		isSoundBased: true,
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"sketch": {
		num: 166,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move is permanently replaced by the last move used by one adjacent target. The copied move has the maximum PP for that move. Fails if the target has not made a move, if the user has Transformed, or if the move is Chatter, Sketch, Struggle, or any move the user knows. This move ignores Protect and Detect. Ignores a target's Substitute.",
		shortDesc: "Permanently copies the last move target used.",
		id: "sketch",
		name: "Sketch",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		isNotProtectable: true,
		onHit: function(target, source) {
			var disallowedMoves = {chatter:1, sketch:1, struggle:1};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1) return false;
			var moveslot = source.moves.indexOf('sketch');
			if (moveslot === -1) return false;
			var move = Tools.getMove(target.lastMove);
			var sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false
			};
			source.moveset[moveslot] = sketchedMove;
			source.baseMoveset[moveslot] = sketchedMove;
			source.moves[moveslot] = toId(move.name);
			this.add('-activate', source, 'move: Sketch', move.name);
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"skillswap": {
		num: 285,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user trades its Ability with one adjacent target. Fails if either the user or the target's Ability is Illusion, Multitype, Stance Change, or Wonder Guard, or if both have the same Ability. Ignores a target's Substitute.",
		shortDesc: "The user and the target trade Abilities.",
		id: "skillswap",
		name: "Skill Swap",
		pp: 10,
		priority: 0,
		onTryHit: function(target, source) {
			var bannedAbilities = {illusion:1, multitype:1, stancechange:1, wonderguard:1};
			if (bannedAbilities[target.ability] || bannedAbilities[source.ability]) {
				return false;
			}
		},
		onHit: function(target, source) {
			var targetAbility = target.ability;
			var sourceAbility = source.ability;
			if (!target.setAbility(sourceAbility) || !source.setAbility(targetAbility)) {
				target.ability = targetAbility;
				source.ability = sourceAbility;
				return false;
			}
			this.add('-activate', source, 'move: Skill Swap', this.getAbility(targetAbility), this.getAbility(sourceAbility), '[of] '+target);
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"skullbash": {
		num: 130,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		desc: "Deals damage to one adjacent target. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. Raises the user's Defense by 1 stage on the first turn. If the user is holding a Power Herb, the move completes in one turn. Makes contact.",
		shortDesc: "Boosts user's Defense by 1 on turn 1. Hits turn 2.",
		id: "skullbash",
		name: "Skull Bash",
		pp: 10,
		priority: 0,
		isContact: true,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			attacker.addVolatile(move.id, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				attacker.removeVolatile(move.id);
				return;
			}
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'skullbash',
			onStart: function(pokemon) {
				this.boost({def:1}, pokemon, pokemon, this.getMove('skullbash'));
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"skyattack": {
		num: 143,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target with a 30% chance to flinch it and a higher chance for a critical hit. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges, then hits turn 2. 30% flinch. High crit.",
		id: "skyattack",
		name: "Sky Attack",
		pp: 5,
		priority: 0,
		critRatio: 2,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		effect: {
			duration: 2,
			onLockMove: 'skyattack'
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "any",
		type: "Flying"
	},
	"skydrop": {
		num: 507,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target. This attack takes the target into the air with the user on the first turn and strikes on the second. On the first turn, the user and the target avoid all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thunder, and Twister. The user and the target cannot make a move between turns. This move has no effect on Flying-types. Fails on the first turn if the target is an ally or if the target has a Substitute. This move cannot be used while Gravity is in effect. Makes contact.",
		shortDesc: "User and foe fly up turn 1. Damages on turn 2.",
		id: "skydrop",
		name: "Sky Drop",
		pp: 10,
		priority: 0,
		isContact: true,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (defender.fainted) return false;
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			if (defender.volatiles['substitute'] || defender.side === attacker.side) {
				return false;
			}
			if (defender.weightkg >= 200) {
				this.add('message', defender.species + ' is too heavy. (placeholder)');
				return null;
			}
			if (defender.volatiles['protect']) {
				this.add('-activate', defender, 'Protect');
				return null;
			}
			if (defender.volatiles['bounce'] || defender.volatiles['dig'] || defender.volatiles['dive'] || defender.volatiles['fly'] || defender.volatiles['shadowforce']) {
				this.add('-miss', attacker, defender);
				return null;
			}
			this.add('-prepare', attacker, move.name, defender);
			attacker.addVolatile(move.id, defender);
			return null;
		},
		onTryHit: function(target) {
			if (target.hasType('Flying')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		effect: {
			duration: 2,
			onLockMove: 'skydrop',
			onDragOut: false,
			onSourceDragOut: false,
			onFoeModifyPokemon: function(defender) {
				if (defender !== this.effectData.source) return;
				defender.trapped = true;
			},
			onFoeBeforeMove: function(attacker, defender, move) {
				if (attacker === this.effectData.source) {
					this.debug('Sky drop nullifying.');
					this.add('-message', '(Sky Drop prevented a Pokemon from moving.)');
					return null;
				}
			},
			onAnyAccuracy: function(accuracy, target, source, move) {
				if (target !== this.effectData.target && target !== this.effectData.source) {
					return;
				}
				if (source === this.effectData.target && target === this.effectData.source) {
					return;
				}
				if (move.id === 'gust' || move.id === 'twister') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'helpinghand') {
					return;
				}
				return 0;
			},
			onAnyBasePower: function(basePower, target, source, move) {
				if (target !== this.effectData.target && target !== this.effectData.source) {
					return;
				}
				if (source === this.effectData.target && target === this.effectData.source) {
					return;
				}
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			}
		},
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"skyuppercut": {
		num: 327,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Deals damage to one adjacent target. This move can hit a target using Bounce, Fly, or Sky Drop. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "Can hit Pokemon using Bounce, Fly, or Sky Drop.",
		id: "skyuppercut",
		isViable: true,
		name: "Sky Uppercut",
		pp: 15,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
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
		isSnatchable: true,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"slam": {
		num: 21,
		accuracy: 75,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "slam",
		name: "Slam",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"slash": {
		num: 163,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit. Makes contact.",
		shortDesc: "High critical hit ratio.",
		id: "slash",
		name: "Slash",
		pp: 20,
		priority: 0,
		isContact: true,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"sleeppowder": {
		num: 79,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Puts one adjacent target to sleep. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Puts the target to sleep.",
		id: "sleeppowder",
		isViable: true,
		name: "Sleep Powder",
		pp: 15,
		priority: 0,
		isPowder: true,
		onTryHit: function(pokemon) {
			if (!pokemon.runImmunity('powder')) return false;
		},
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"sleeptalk": {
		num: 214,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "One of the user's known moves is selected for use at random. Fails if the user is not asleep. The selected move does not have PP deducted from it, and can currently have 0PP. This move cannot select Assist, Bide, Chatter, Copycat, Focus Punch, Me First, Metronome, Mimic, Mirror Move, Nature Power, Sketch, Sleep Talk, Struggle, Uproar, or any two-turn move.",
		shortDesc: "User must be asleep. Uses another known move.",
		id: "sleeptalk",
		isViable: true,
		name: "Sleep Talk",
		pp: 10,
		priority: 0,
		sleepUsable: true,
		onTryHit: function(pokemon) {
			if (pokemon.status !== 'slp') return false;
		},
		onHit: function(pokemon) {
			var moves = [];
			for (var i=0; i<pokemon.moveset.length; i++) {
				var move = pokemon.moveset[i].id;
				var NoSleepTalk = {
					assist:1, bide:1, chatter:1, copycat:1, focuspunch:1, mefirst:1, metronome:1, mimic:1, mirrormove:1, naturepower:1, sketch:1, sleeptalk:1, uproar:1
				};
				if (move && !(NoSleepTalk[move] || this.getMove(move).isTwoTurnMove)) {
					moves.push(move);
				}
			}
			var move = '';
			if (moves.length) move = moves[this.random(moves.length)];
			if (!move) {
				return false;
			}
			this.useMove(move, pokemon);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"sludge": {
		num: 124,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to poison it.",
		shortDesc: "30% chance to poison the target.",
		id: "sludge",
		name: "Sludge",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'psn'
		},
		target: "normal",
		type: "Poison"
	},
	"sludgebomb": {
		num: 188,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to poison it.",
		shortDesc: "30% chance to poison the target.",
		id: "sludgebomb",
		isViable: true,
		name: "Sludge Bomb",
		pp: 10,
		priority: 0,
		isBullet: true,
		secondary: {
			chance: 30,
			status: 'psn'
		},
		target: "normal",
		type: "Poison"
	},
	"sludgewave": {
		num: 482,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Deals damage to all adjacent Pokemon with a 10% chance to poison each.",
		shortDesc: "10% chance to poison adjacent Pokemon.",
		id: "sludgewave",
		isViable: true,
		name: "Sludge Wave",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'psn'
		},
		target: "allAdjacent",
		type: "Poison"
	},
	"smackdown": {
		num: 479,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target. This move can hit a target using Bounce, Fly, or Sky Drop. If this move hits a target under the effect of Bounce, Fly, Magnet Rise, or Telekinesis, the effect ends. If the target is a Flying-type that has not used Roost this turn or a Pokemon with the Ability Levitate, it loses its immunity to Ground-type attacks and the Ability Arena Trap as long as it remains active. During the effect, Magnet Rise fails for the target and Telekinesis fails against the target.",
		shortDesc: "Removes the target's Ground immunity.",
		id: "smackdown",
		name: "Smack Down",
		pp: 15,
		priority: 0,
		volatileStatus: 'smackdown',
		effect: {
			onStart: function(pokemon) {
				var applies = false;
				if ((pokemon.hasType('Flying') && !pokemon.volatiles['roost']) || pokemon.ability === 'levitate') applies = true;
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					applies = true;
					this.cancelMove(pokemon);
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
			onRestart: function(pokemon) {
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					this.cancelMove(pokemon);
					this.add('-start', pokemon, 'Smack Down');
				}
			},
			onModifyPokemonPriority: 100,
			onModifyPokemon: function(pokemon) {
				pokemon.negateImmunity['Ground'] = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"smellingsalts": {
		num: 265,
		accuracy: 100,
		basePower: 70,
		basePowerCallback: function(pokemon, target) {
			if (target.status === 'par') return 140;
			return 70;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power doubles if the target is paralyzed, and the target is cured of paralysis. Makes contact.",
		shortDesc: "Power doubles if target is paralyzed, and cures it.",
		id: "smellingsalts",
		name: "Smelling Salts",
		pp: 10,
		priority: 0,
		isContact: true,
		onHit: function(target) {
			if (target.status === 'par') target.cureStatus();
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"smog": {
		num: 123,
		accuracy: 70,
		basePower: 30,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 40% chance to poison it.",
		shortDesc: "40% chance to poison the target.",
		id: "smog",
		name: "Smog",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 40,
			status: 'psn'
		},
		target: "normal",
		type: "Poison"
	},
	"smokescreen": {
		num: 108,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's accuracy by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the target's accuracy by 1.",
		id: "smokescreen",
		name: "Smokescreen",
		pp: 20,
		priority: 0,
		boosts: {
			accuracy: -1
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"snarl": {
		num: 555,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 100% chance to lower their Special Attack by 1 stage each. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "100% chance to lower the foe(s) Sp. Atk by 1.",
		id: "snarl",
		name: "Snarl",
		pp: 15,
		priority: 0,
		isSoundBased: true,
		secondary: {
			chance: 100,
			boosts: {
				spa: -1
			}
		},
		target: "allAdjacentFoes",
		type: "Dark"
	},
	"snatch": {
		num: 289,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If another Pokemon uses one of the following moves this turn, the user steals that move to use itself. If multiple Pokemon use this move in the same turn, the applicable moves will be stolen in turn order; a move cannot be stolen multiple times. Aqua Ring, Aromatherapy, Autotomize, Belly Drum, Camouflage, Charge, Conversion, Cosmic Power, Cotton Guard, Heal Bell, Healing Wish, Imprison, Ingrain, Light Screen, Lucky Chant, Lunar Dance, Magnet Rise, Mist, Power Trick, Quick Guard, Recycle, Reflect, Refresh, Safeguard, Stockpile, Substitute, Swallow, Tailwind, Wide Guard, Wish, and any move that has a primary effect of raising the user's stats or healing the user. Ignores a target's Substitute. Priority +4.",
		shortDesc: "User steals certain support moves to use itself.",
		id: "snatch",
		name: "Snatch",
		pp: 10,
		priority: 4,
		volatileStatus: 'snatch',
		effect: {
			duration: 1,
			onStart: function(pokemon) {
				this.add('-singleturn', pokemon, 'Snatch');
			},
			onAnyTryMove: function(source, target, move) {
				if (move && move.isSnatchable && move.sourceEffect !== 'snatch') {
					var snatchUser = this.effectData.source;
					snatchUser.removeVolatile('snatch');
					this.add('-activate', snatchUser, 'Snatch', '[of] '+source);
					this.useMove(move.id, snatchUser);
					return null;
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Dark"
	},
	"snore": {
		num: 173,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Fails if the user is not asleep. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "User must be asleep. 30% chance to flinch target.",
		id: "snore",
		name: "Snore",
		pp: 15,
		priority: 0,
		isSoundBased: true,
		sleepUsable: true,
		onTryHit: function(target, source) {
			if (source.status !== 'slp') return false;
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Normal"
	},
	"spikyshield": {
		num: 596,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "In addition to protecting the user from attacks, this move also damages any attacker who makes direct contact by 1/8 of their maximum HP.",
		shortDesc: "Protects user. Damages contactors.",
		id: "spikyshield",
		isViable: true,
		name: "Spiky Shield",
		pp: 10,
		priority: 4,
		stallingMove: true, // Note: stallingMove is not used anywhere.
		volatileStatus: 'spikyshield',
		onTryHit: function(target, source, move) {
			return !!this.willAct() && this.runEvent('StallMove', target);
		},
		onHit: function(pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function(target, source, move) {
				if (move.breaksProtect) {
					target.removeVolatile('spikyshield');
					return;
				}
				if (move && (move.target === 'self' || move.id === 'suckerpunch')) return;
				this.add('-activate', target, 'move: Protect');
				if (move.isContact) {
					this.damage(source.maxhp/8, source, target);
				}
				return null;
			}
		},
		secondary: false,
		target: "self",
		type: "Grass"
	},
	"soak": {
		num: 487,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to become a Water-type. Fails if the target is an Arceus. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Changes the target's type to Water.",
		id: "soak",
		name: "Soak",
		pp: 20,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			if (!target.setType('Water')) return false;
			this.add('-start', target, 'typechange', 'Water');
		},
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"softboiled": {
		num: 135,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up. (Field: Can be used to heal an ally by draining 1/5 of the user's maximum HP, rounded down, and restoring that amount to the selected ally. Fails if the user's HP would be reduced to less than 1.)",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "softboiled",
		isViable: true,
		name: "Soft-Boiled",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"solarbeam": {
		num: 76,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent target. This attack charges on the first turn and strikes on the second. The user cannot make a move between turns. Power is halved if the weather is Hail, Rain Dance, or Sandstorm. If the user is holding a Power Herb or the weather is Sunny Day, the move completes in one turn.",
		shortDesc: "Charges turn 1. Hits turn 2. No charge in sunlight.",
		id: "solarbeam",
		isViable: true,
		name: "Solar Beam",
		pp: 10,
		priority: 0,
		isTwoTurnMove: true,
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (this.isWeather('sunnyday') || !this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		},
		onBasePowerPriority: 4,
		onBasePower: function(basePower, pokemon, target) {
			if (this.isWeather(['raindance','sandstorm','hail'])) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
		effect: {
			duration: 2,
			onLockMove: 'solarbeam'
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"sonicboom": {
		num: 49,
		accuracy: 90,
		basePower: 0,
		damage: 20,
		category: "Special",
		desc: "Deals damage to one adjacent target equal to 20HP.",
		shortDesc: "Always does 20 HP of damage.",
		id: "sonicboom",
		name: "Sonic Boom",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"spacialrend": {
		num: 460,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "spacialrend",
		isViable: true,
		name: "Spacial Rend",
		pp: 5,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"spark": {
		num: 209,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to paralyze it. Makes contact.",
		shortDesc: "30% chance to paralyze the target.",
		id: "spark",
		isViable: true,
		name: "Spark",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"spiderweb": {
		num: 169,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents one adjacent target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "The target cannot switch out.",
		id: "spiderweb",
		isViable: true,
		name: "Spider Web",
		pp: 10,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			if (!target.addVolatile('trapped')) {
				this.add('-fail', target);
			}
		},
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"spikecannon": {
		num: 131,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "spikecannon",
		name: "Spike Cannon",
		pp: 15,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"spikes": {
		num: 191,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in, unless it is a Flying-type or has the Ability Levitate. Can be used up to three times before failing. Foes lose 1/8 of their maximum HP with one layer, 1/6 of their maximum HP with two layers, and 1/4 of their maximum HP with three layers, all rounded down. Can be removed from the foe's side if any foe uses Rapid Spin or is hit by Defog. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Hurts grounded foes on switch-in. Max 3 layers.",
		id: "spikes",
		isViable: true,
		name: "Spikes",
		pp: 20,
		priority: 0,
		isBounceable: true,
		sideCondition: 'spikes',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers++;
			},
			onSwitchIn: function(pokemon) {
				var side = pokemon.side;
				if (!pokemon.runImmunity('Ground')) return;
				var damageAmounts = [0,3,4,6]; // 1/8, 1/6, 1/4
				var damage = this.damage(damageAmounts[this.effectData.layers]*pokemon.maxhp/24);
			}
		},
		secondary: false,
		target: "foeSide",
		type: "Ground"
	},
	"spitup": {
		num: 255,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) return false;
			return pokemon.volatiles['stockpile'].layers * 100;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. Power is equal to 100 times the user's Stockpile count. Fails if the user's Stockpile count is 0. Whether or not this move is successful, the user's Defense and Special Defense decrease by as many stages as Stockpile had increased them, and the user's Stockpile count resets to 0.",
		shortDesc: "More power with more uses of Stockpile.",
		id: "spitup",
		name: "Spit Up",
		pp: 10,
		priority: 0,
		onTry: function(pokemon) {
			if (!pokemon.volatiles['stockpile']) {
				return false;
			}
		},
		onAfterMove: function(pokemon) {
			pokemon.removeVolatile('stockpile');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"spite": {
		num: 180,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target's last used move to decrease by 4PP. Fails if the target has not made a move, if the move has 0PP, or if it no longer knows the move. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute.",
		shortDesc: "Lowers the PP of the target's last move by 4.",
		id: "spite",
		name: "Spite",
		pp: 10,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			if (target.deductPP(target.lastMove, 4)) {
				this.add("-activate", target, 'move: Spite', target.lastMove, 4);
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"splash": {
		num: 150,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Nothing happens... This move cannot be used while Gravity is in effect.",
		shortDesc: "Does nothing (but we still love it).",
		id: "splash",
		name: "Splash",
		pp: 40,
		priority: 0,
		onTryHit: function(target, source) {
			this.add('-nothing');
			return null;
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"spore": {
		num: 147,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Puts one adjacent target to sleep. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Puts the target to sleep.",
		id: "spore",
		isViable: true,
		name: "Spore",
		pp: 15,
		priority: 0,
		isPowder: true,
		onTryHit: function(pokemon) {
			if (!pokemon.runImmunity('powder')) return false;
		},
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"stealthrock": {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in. Can be used only once before failing. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Rock-type; 0.25x, 0.5x, neutral, 2x, or 4x, respectively. Can be removed from the foe's side if any foe uses Rapid Spin or is hit by Defog. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. (CAP: Pokemon with the Ability Mountaineer are immune.)",
		shortDesc: "Hurts foes on switch-in. Factors Rock weakness.",
		id: "stealthrock",
		isViable: true,
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		isBounceable: true,
		sideCondition: 'stealthrock',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn: function(pokemon) {
				var typeMod = this.getEffectiveness('Rock', pokemon);
				var factor = 8;
				if (typeMod == 1) factor = 4;
				if (typeMod >= 2) factor = 2;
				if (typeMod == -1) factor = 16;
				if (typeMod <= -2) factor = 32;
				var damage = this.damage(pokemon.maxhp/factor);
			}
		},
		secondary: false,
		target: "foeSide",
		type: "Rock"
	},
	"steelwing": {
		num: 211,
		accuracy: 90,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to raise the user's Defense by 1 stage. Makes contact.",
		shortDesc: "10% chance to boost the user's Defense by 1.",
		id: "steelwing",
		name: "Steel Wing",
		pp: 25,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 10,
			self: {
				boosts: {
					def: 1
				}
			}
		},
		target: "normal",
		type: "Steel"
	},
	"stickyweb": {
		num: 564,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the Speed stat of the opposing team's Pokemon upon switching into battle.",
		shortDesc: "Lowers Speed of opposing Pokemon switched in.",
		id: "stickyweb",
		isViable: true,
		name: "Sticky Web",
		pp: 20,
		priority: 0,
		isBounceable: true,
		sideCondition: 'stickyweb',
		effect: {
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn: function(pokemon) {
				if (!pokemon.runImmunity('Ground')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.getMove('stickyweb'));
			}
		},
		secondary: false,
		target: "foeSide",
		type: "Bug"
	},
	"stockpile": {
		num: 254,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense and Special Defense by 1 stage. The user's Stockpile count increases by 1. Fails if the user's Stockpile count is 3.",
		shortDesc: "Boosts user's Defense, Sp. Def by 1. Max 3 uses.",
		id: "stockpile",
		isViable: true,
		name: "Stockpile",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		onTryHit: function(pokemon) {
			if (pokemon.volatiles['stockpile'] && pokemon.volatiles['stockpile'].layers >= 3) return false;
		},
		volatileStatus: 'stockpile',
		effect: {
			onStart: function(target) {
				this.effectData.layers = 1;
				this.add('-start', target, 'stockpile'+this.effectData.layers);
				this.boost({def:1, spd:1}, target, target, this.getMove('stockpile'));
			},
			onRestart: function(target) {
				if (this.effectData.layers >= 3) return false;
				this.effectData.layers++;
				this.add('-start', target, 'stockpile'+this.effectData.layers);
				this.boost({def:1, spd:1}, target, target, this.getMove('stockpile'));
			},
			onEnd: function(target) {
				var layers = this.effectData.layers * -1;
				this.effectData.layers = 0;
				this.boost({def:layers, spd:layers}, target, target, this.getMove('stockpile'));
				this.add('-end', target, 'Stockpile');
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"stomp": {
		num: 23,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Damage doubles if Minimize was used previously by the target. Makes contact.",
		shortDesc: "30% chance to flinch the target.",
		id: "stomp",
		name: "Stomp",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Normal"
	},
	"stoneedge": {
		num: 444,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "stoneedge",
		isViable: true,
		name: "Stone Edge",
		pp: 5,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"storedpower": {
		num: 500,
		accuracy: 100,
		basePower: 20,
		basePowerCallback: function(pokemon) {
			return 20 + 20 * pokemon.positiveBoosts();
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. Power is equal to 20+(X*20), where X is the user's total stat stage changes that are greater than 0.",
		shortDesc: "+20 power for each of the user's stat boosts.",
		id: "storedpower",
		isViable: true,
		name: "Stored Power",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"stormthrow": {
		num: 480,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target. This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Abilities Battle Armor or Shell Armor. Makes contact.",
		shortDesc: "Always results in a critical hit.",
		id: "stormthrow",
		isViable: true,
		name: "Storm Throw",
		pp: 10,
		priority: 0,
		isContact: true,
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"steamroller": {
		num: 537,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 30% chance to flinch it. Damage doubles if Minimize was used previously by the target. Makes contact.",
		shortDesc: "30% chance to flinch the target.",
		id: "steamroller",
		name: "Steamroller",
		pp: 20,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Bug"
	},
	"strength": {
		num: 70,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact. (Field: Can be used to move boulders.)",
		shortDesc: "No additional effect.",
		id: "strength",
		name: "Strength",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"stringshot": {
		num: 81,
		accuracy: 95,
		basePower: 0,
		category: "Status",
		desc: "Lowers all adjacent foes' Speed by 2 stages. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the foe(s) Speed by 2.",
		id: "stringshot",
		name: "String Shot",
		pp: 40,
		priority: 0,
		boosts: {
			spe: -2
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Bug"
	},
	"struggle": {
		num: 165,
		accuracy: true,
		basePower: 50,
		category: "Physical",
		desc: "Deals typeless damage to one adjacent foe at random. If this move was successful, the user loses 1/4 of its maximum HP, rounded half up; the Ability Rock Head does not prevent this. This move can only be used if none of the user's known moves can be selected. Makes contact.",
		shortDesc: "User loses 25% of its max HP as recoil.",
		id: "struggle",
		name: "Struggle",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		isContact: true,
		beforeMoveCallback: function(pokemon) {
			this.add('-activate', pokemon, 'move: Struggle');
		},
		onModifyMove: function(move) {
			move.type = '???';
		},
		self: {
			onHit: function(source) {
				this.directDamage(source.maxhp/4, source, source, 'strugglerecoil');
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"strugglebug": {
		num: 522,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 100% chance to lower their Special Attack by 1 stage each.",
		shortDesc: "100% chance to lower the foe(s) Sp. Atk by 1.",
		id: "strugglebug",
		name: "Struggle Bug",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spa: -1
			}
		},
		target: "allAdjacentFoes",
		type: "Bug"
	},
	"stunspore": {
		num: 78,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes one adjacent target. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Paralyzes the target.",
		id: "stunspore",
		isViable: true,
		name: "Stun Spore",
		pp: 30,
		priority: 0,
		isPowder: true,
		onTryHit: function(pokemon) {
			if (!pokemon.runImmunity('powder')) return false;
		},
		status: 'par',
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"submission": {
		num: 66,
		accuracy: 80,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If the target lost HP, the user takes recoil damage equal to 1/4 that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 1/4 recoil.",
		id: "submission",
		name: "Submission",
		pp: 25,
		priority: 0,
		isContact: true,
		recoil: [1,4],
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"substitute": {
		num: 164,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in battle. The substitute is removed once enough damage is inflicted on it, or if the user switches out or faints. Baton Pass can be used to transfer the substitute to an ally, and the substitute will keep its remaining HP. Until the substitute is broken, it receives damage from all attacks made by other Pokemon and shields the user from status effects and stat stage changes caused by other Pokemon. The user still takes normal damage from weather and status effects while behind its substitute. If the substitute breaks during a multi-hit attack, the user will take damage from any remaining hits. This move fails if the user does not have enough HP remaining to create a substitute, or if it already has a substitute.",
		shortDesc: "User takes 1/4 its max HP to put in a Substitute.",
		id: "substitute",
		isViable: true,
		name: "Substitute",
		pp: 10,
		priority: 0,
		isSnatchable: true,
		volatileStatus: 'Substitute',
		onTryHit: function(target) {
			if (target.volatiles['substitute']) {
				this.add('-fail', target, 'move: Substitute');
				return null;
			}
			if (target.hp <= target.maxhp/4 || target.maxhp === 1) { // Shedinja clause
				this.add('-fail', target, 'move: Substitute', '[weak]');
				return null;
			}
		},
		onHit: function(target) {
			this.directDamage(target.maxhp/4);
		},
		effect: {
			onStart: function(target) {
				this.add('-start', target, 'Substitute');
				this.effectData.hp = Math.floor(target.maxhp/4);
				delete target.volatiles['partiallytrapped'];
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit: function(target, source, move) {
				if (target === source) {
					this.debug('sub bypass: self hit');
					return;
				}
				if (move.notSubBlocked || move.isSoundBased && this.gen >= 6) {
					return;
				}
				if (move.category === 'Status') {
					var SubBlocked = {
						block:1, embargo:1, entrainment:1, gastroacid:1, healblock:1, healpulse:1, leechseed:1, lockon:1, meanlook:1, mindreader:1, nightmare:1, painsplit:1, psychoshift:1, simplebeam:1, skydrop:1, soak: 1, spiderweb:1, switcheroo:1, topsyturvy:1, trick:1, worryseed:1, yawn:1
					};
					if (move.status || move.boosts || move.volatileStatus === 'confusion' || SubBlocked[move.id]) {
						return false;
					}
					return;
				}
				var damage = this.getDamage(source, target, move);
				if (!damage) {
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
					this.damage(Math.round(damage * move.recoil[0] / move.recoil[1]), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return 0; // hit
			},
			onEnd: function(target) {
				this.add('-end', target, 'Substitute');
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"suckerpunch": {
		num: 389,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Fails if the target did not select a damaging move for use this turn, or if the target moves before the user. Makes contact. Priority +1.",
		shortDesc: "Usually goes first. Fails if target is not attacking.",
		id: "suckerpunch",
		isViable: true,
		name: "Sucker Punch",
		pp: 5,
		priority: 1,
		isNotProtectable: true,
		isContact: true,
		onTryHit: function(target) {
			var decision = this.willMove(target);
			if (!decision || decision.choice !== 'move' || (decision.move.category === 'Status' && decision.move.id !== 'mefirst')) {
				return false;
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"sunnyday": {
		num: 241,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Sunny Day. The power of Fire-type attacks is 1.5x and the power of Water-type attacks is 0.5x during the effect. Lasts for 8 turns if the user is holding Heat Rock. Fails if the current weather is Sunny Day.",
		shortDesc: "For 5 turns, intense sunlight powers Fire moves.",
		id: "sunnyday",
		isViable: true,
		name: "Sunny Day",
		pp: 5,
		priority: 0,
		weather: 'sunnyday',
		secondary: false,
		target: "all",
		type: "Fire"
	},
	"superfang": {
		num: 162,
		accuracy: 90,
		basePower: 0,
		damageCallback: function(pokemon, target) {
			return target.hp/2;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target equal to half of its current HP, rounded down, but not less than 1HP. Makes contact.",
		shortDesc: "Does damage equal to 1/2 target's current HP.",
		id: "superfang",
		isViable: true,
		name: "Super Fang",
		pp: 10,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"superpower": {
		num: 276,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target and lowers the user's Attack and Defense by 1 stage. Makes contact.",
		shortDesc: "Lowers the user's Attack and Defense by 1.",
		id: "superpower",
		isViable: true,
		name: "Superpower",
		pp: 5,
		priority: 0,
		isContact: true,
		self: {
			boosts: {
				atk: -1,
				def: -1
			}
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"supersonic": {
		num: 48,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to become confused. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "Confuses the target.",
		id: "supersonic",
		name: "Supersonic",
		pp: 20,
		priority: 0,
		isSoundBased: true,
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"surf": {
		num: 57,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to all adjacent Pokemon. Power doubles against Pokemon using Dive. (Field: Can be used to surf on water.)",
		shortDesc: "Hits adjacent Pokemon. Power doubles on Dive.",
		id: "surf",
		isViable: true,
		name: "Surf",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "allAdjacent",
		type: "Water"
	},
	"swagger": {
		num: 207,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Raises one adjacent target's Attack by 2 stages and confuses it. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Boosts the target's Attack by 2 and confuses it.",
		id: "swagger",
		name: "Swagger",
		pp: 15,
		priority: 0,
		volatileStatus: 'confusion',
		boosts: {
			atk: 2
		},
		secondary: false,
		target: "normal",
		type: "Normal"
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
		isSnatchable: true,
		onTryHit: function(pokemon) {
			if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) return false;
		},
		onHit: function(pokemon) {
			var healAmount = [0.25,0.5,1];
			this.heal(this.modify(pokemon.maxhp, healAmount[(pokemon.volatiles['stockpile'].layers - 1)]));
			pokemon.removeVolatile('stockpile');
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"sweetkiss": {
		num: 186,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to become confused. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Confuses the target.",
		id: "sweetkiss",
		name: "Sweet Kiss",
		pp: 10,
		priority: 0,
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Fairy"
	},
	"sweetscent": {
		num: 230,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers all adjacent foes' evasion by 2 stages. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the foe(s) evasion by 2.",
		id: "sweetscent",
		name: "Sweet Scent",
		pp: 20,
		priority: 0,
		boosts: {
			evasion: -2
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal"
	},
	"swift": {
		num: 129,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to all adjacent foes and does not check accuracy.",
		shortDesc: "This move does not check accuracy. Hits foes.",
		id: "swift",
		name: "Swift",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal"
	},
	"switcheroo": {
		num: 415,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user trades its held item with one adjacent target. Fails if either the user or the target is holding a Mail, if neither is holding an item, or if the user is trying to give or take a Griseous Orb, a Plate, or a Drive to or from a Giratina, an Arceus, or a Genesect, respectively. Pokemon with the Ability Sticky Hold are immune.",
		shortDesc: "User switches its held item with the target's.",
		id: "switcheroo",
		isViable: true,
		name: "Switcheroo",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var yourItem = target.takeItem(source);
			var myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem;
				if (myItem) source.item = myItem;
				return false;
			}
			this.add('-activate', source, 'move: Trick', '[of] '+target);
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
		type: "Dark"
	},
	"swordsdance": {
		num: 14,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 2 stages.",
		shortDesc: "Boosts the user's Attack by 2.",
		id: "swordsdance",
		isViable: true,
		name: "Swords Dance",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 2
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"synchronoise": {
		num: 485,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to all adjacent Pokemon. This move has no effect on targets that do not share a type with the user.",
		shortDesc: "Hits adjacent Pokemon sharing the user's type.",
		id: "synchronoise",
		name: "Synchronoise",
		pp: 15,
		priority: 0,
		onTryHit: function(target, source) {
			return target.hasType(source.getTypes());
		},
		secondary: false,
		target: "allAdjacent",
		type: "Psychic"
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
		isSnatchable: true,
		onHit: function(pokemon) {
			if (this.isWeather('sunnyday')) this.heal(this.modify(pokemon.maxhp, 0.667));
			else if (this.isWeather(['raindance','sandstorm','hail'])) this.heal(this.modify(pokemon.maxhp, 0.25));
			else this.heal(this.modify(pokemon.maxhp, 0.5));
		},
		secondary: false,
		target: "self",
		type: "Grass"
	},
	"tackle": {
		num: 33,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "tackle",
		name: "Tackle",
		pp: 35,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"tailglow": {
		num: 294,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack by 3 stages.",
		shortDesc: "Boosts the user's Sp. Atk by 3.",
		id: "tailglow",
		isViable: true,
		name: "Tail Glow",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spa: 3
		},
		secondary: false,
		target: "self",
		type: "Bug"
	},
	"tailslap": {
		num: 541,
		accuracy: 85,
		basePower: 25,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Makes contact.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "tailslap",
		isViable: true,
		name: "Tail Slap",
		pp: 10,
		priority: 0,
		isContact: true,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"tailwhip": {
		num: 39,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers all adjacent foes' Defense by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the foe(s) Defense by 1.",
		id: "tailwhip",
		name: "Tail Whip",
		pp: 30,
		priority: 0,
		boosts: {
			def: -1
		},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Normal"
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
		isSnatchable: true,
		sideCondition: 'tailwind',
		effect: {
			duration: 4,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'persistent') {
					return 6;
				}
				return 4;
			},
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Tailwind');
			},
			onModifySpe: function(speMod, pokemon) {
				return this.chain(speMod, 2);
			},
			onResidualOrder: 21,
			onResidualSubOrder: 4,
			onEnd: function(side) {
				this.add('-sideend', side, 'move: Tailwind');
			}
		},
		secondary: false,
		target: "allySide",
		type: "Flying"
	},
	"takedown": {
		num: 36,
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If the target lost HP, the user takes recoil damage equal to 1/4 that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 1/4 recoil.",
		id: "takedown",
		name: "Take Down",
		pp: 20,
		priority: 0,
		isContact: true,
		recoil: [1,4],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"taunt": {
		num: 269,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Prevents one adjacent target from using non-damaging moves for its next three turns. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute.",
		shortDesc: "For 3 turns, the target can't use status moves.",
		id: "taunt",
		isViable: true,
		name: "Taunt",
		pp: 20,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'taunt',
		effect: {
			duration: 3,
			onStart: function(target) {
				if (!this.willMove(target)) {
					this.effectData.duration++;
				}
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 12,
			onEnd: function(target) {
				this.add('-end', target, 'move: Taunt');
			},
			onModifyPokemon: function(pokemon) {
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++) {
					if (this.getMove(moves[i].move).category === 'Status') {
						moves[i].disabled = true;
					}
				}
			},
			onBeforeMove: function(attacker, defender, move) {
				if (move.category === 'Status') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"technoblast": {
		num: 546,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent target. This move's type depends on the user's held Drive.",
		shortDesc: "Type varies based on the held Drive.",
		id: "technoblast",
		name: "Techno Blast",
		pp: 5,
		priority: 0,
		onModifyMove: function(move, pokemon) {
			move.type = this.runEvent('Drive', pokemon, null, 'technoblast', 'Normal');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"teeterdance": {
		num: 298,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes all adjacent Pokemon to become confused.",
		shortDesc: "Confuses adjacent Pokemon.",
		id: "teeterdance",
		isViable: true,
		name: "Teeter Dance",
		pp: 20,
		priority: 0,
		isBounceable: false,
		volatileStatus: 'confusion',
		secondary: false,
		target: "allAdjacent",
		type: "Normal"
	},
	"telekinesis": {
		num: 477,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 3 turns, one adjacent target cannot avoid any attacks made against it, other than OHKO moves, as long as it remains active. During the effect, the target is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, and the Ability Arena Trap as long as it remains active. If the target uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, and Iron Ball override this move if the target is under any of their effects. Fails if the target is already under this effect or the effects of Ingrain or Smack Down. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. This move cannot be used while Gravity is in effect.",
		shortDesc: "For 3 turns, target floats but moves can't miss it.",
		id: "telekinesis",
		name: "Telekinesis",
		pp: 15,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'telekinesis',
		effect: {
			duration: 3,
			onStart: function(target) {
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-start', target, 'Telekinesis');
			},
			onSourceModifyMove: function(move) {
				move.accuracy = true;
			},
			onImmunity: function(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 16,
			onEnd: function(target) {
				this.add('-end', target, 'Telekinesis');
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"teleport": {
		num: 100,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Fails when used. (Wild battles: The user flees the battle, unless it is a double battle. Field: Can be used to teleport to the last Pokemon Center visited.)",
		shortDesc: "Flee from wild Pokemon battles.",
		id: "teleport",
		name: "Teleport",
		pp: 20,
		priority: 0,
		onTryHit: false,
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"thief": {
		num: 168,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If the attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one. Makes contact.",
		shortDesc: "If the user has no item, it steals the target's.",
		id: "thief",
		name: "Thief",
		pp: 25,
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
			this.add('-item', source, yourItem, '[from] move: Thief', '[of] '+target);
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"thrash": {
		num: 37,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent foe at random. The user spends two or three turns locked into this move and becomes confused after the last turn of the effect if it is not already. If the user is prevented from moving or the attack is not successful against the target on the first turn of the effect or the second turn of a three-turn effect, the effect ends without causing confusion. If this move is called by Sleep Talk, the move is used for one turn and does not confuse the user. Makes contact.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "thrash",
		isViable: true,
		name: "Thrash",
		pp: 10,
		priority: 0,
		isContact: true,
		self: {
			volatileStatus: 'lockedmove'
		},
		secondary: false,
		target: "randomNormal",
		type: "Normal"
	},
	"thunder": {
		num: 87,
		accuracy: 70,
		basePower: 110,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 30% chance to paralyze it. This move can hit a target using Bounce, Fly, or Sky Drop. If the weather is Rain Dance, this move cannot miss. If the weather is Sunny Day, this move's accuracy is 50%.",
		shortDesc: "30% chance to paralyze target. Can't miss in rain.",
		id: "thunder",
		isViable: true,
		name: "Thunder",
		pp: 10,
		priority: 0,
		onModifyMove: function(move) {
			if (this.isWeather('raindance')) move.accuracy = true;
			else if (this.isWeather('sunnyday')) move.accuracy = 50;
		},
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"thunderfang": {
		num: 422,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to paralyze it and a 10% chance to flinch it. Makes contact.",
		shortDesc: "10% chance to paralyze. 10% chance to flinch.",
		id: "thunderfang",
		isViable: true,
		name: "Thunder Fang",
		pp: 15,
		priority: 0,
		isContact: true,
		isBiteAttack: true,
		secondaries: [ {
				chance: 10,
				status: 'par'
			}, {
				chance: 10,
				volatileStatus: 'flinch'
			}
		],
		target: "normal",
		type: "Electric"
	},
	"thunderpunch": {
		num: 9,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to paralyze it. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "10% chance to paralyze the target.",
		id: "thunderpunch",
		isViable: true,
		name: "Thunder Punch",
		pp: 15,
		priority: 0,
		isContact: true,
		isPunchAttack: true,
		secondary: {
			chance: 10,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"thundershock": {
		num: 84,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to paralyze it.",
		shortDesc: "10% chance to paralyze the target.",
		id: "thundershock",
		name: "Thunder Shock",
		pp: 30,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"thunderwave": {
		num: 86,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes one adjacent target. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Paralyzes the target.",
		id: "thunderwave",
		isViable: true,
		name: "Thunder Wave",
		pp: 20,
		priority: 0,
		status: 'par',
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"thunderbolt": {
		num: 85,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 10% chance to paralyze it.",
		shortDesc: "10% chance to paralyze the target.",
		id: "thunderbolt",
		isViable: true,
		name: "Thunderbolt",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"tickle": {
		num: 321,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers one adjacent target's Attack and Defense by 1 stage. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Lowers the target's Attack and Defense by 1.",
		id: "tickle",
		name: "Tickle",
		pp: 20,
		priority: 0,
		boosts: {
			atk: -1,
			def: -1
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"topsyturvy": {
		num: 576,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Inverts target's stat stages.",
		shortDesc: "Inverts target's stat stages.",
		id: "topsyturvy",
		name: "Topsy-Turvy",
		pp: 20,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			var targetBoosts = {};

			for (var i in target.boosts) {
				target.boosts[i] = -target.boosts[i];
			}

			target.setBoost(targetBoosts);

			this.add('-invertboost', target, '[from] move: Topsy-turvy');
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"torment": {
		num: 259,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Prevents one adjacent target from using the same move two turns in a row, starting next turn. This effect lasts until the target leaves the field. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute.",
		shortDesc: "Target can't select the same move twice in a row.",
		id: "torment",
		isViable: true,
		name: "Torment",
		pp: 15,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'torment',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'Torment');
			},
			onEnd: function(pokemon) {
				this.add('-end', pokemon, 'Torment');
			},
			onModifyPokemon: function(pokemon) {
				if (pokemon.lastMove !== 'struggle') pokemon.disabledMoves[pokemon.lastMove] = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"toxic": {
		num: 92,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Badly poisons one adjacent target. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Badly poisons the target.",
		id: "toxic",
		isViable: true,
		name: "Toxic",
		pp: 10,
		priority: 0,
		onModifyMove: function(move, pokemon) {
			if (pokemon.hasType('Poison')) {
				move.accuracy = true;
				move.alwaysHit = true;
			}
		},
		status: 'tox',
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"toxicspikes": {
		num: 390,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the foe's side of the field, poisoning each foe that switches in, unless it is a Flying-type or has the Ability Levitate. Can be used up to two times before failing. Foes become poisoned with one layer and badly poisoned with two layers. Can be removed from the foe's side if any foe uses Rapid Spin, is hit by Defog, or a grounded Poison-type switches in. Safeguard prevents the foe's party from being poisoned on switch-in, but Substitute does not. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Poisons grounded foes on switch-in. Max 2 layers.",
		id: "toxicspikes",
		isViable: true,
		name: "Toxic Spikes",
		pp: 20,
		priority: 0,
		isBounceable: true,
		sideCondition: 'toxicspikes',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers++;
			},
			onSwitchIn: function(pokemon) {
				if (!pokemon.runImmunity('Ground')) return;
				if (!pokemon.runImmunity('Poison')) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] '+pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (this.effectData.layers >= 2) {
					pokemon.trySetStatus('tox');
				} else {
					pokemon.trySetStatus('psn');
				}
			}
		},
		secondary: false,
		target: "foeSide",
		type: "Poison"
	},
	"transform": {
		num: 144,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user transforms into one adjacent target. The target's current stats, stat stages, types, moves, Ability, weight, gender, and sprite are copied. The user's level and HP remain the same and each copied move receives only 5PP, with a maximum of 5PP each. The user can no longer change formes if it would have the ability to do so. This move fails if the target has a Substitute, if either the user or the target has transformed previously, or if either is behind an Illusion. This move ignores Protect and Detect.",
		shortDesc: "Copies target's stats, moves, types, and Ability.",
		id: "transform",
		name: "Transform",
		pp: 10,
		priority: 0,
		isNotProtectable: true,
		onHit: function(target, pokemon) {
			if (!pokemon.transformInto(target, pokemon)) {
				return false;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"triattack": {
		num: 161,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 20% chance to either burn, freeze, or paralyze it.",
		shortDesc: "20% chance to paralyze or burn or freeze target.",
		id: "triattack",
		isViable: true,
		name: "Tri Attack",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 20,
			onHit: function(target, source) {
				var result = this.random(3);
				if (result===0) {
					target.trySetStatus('brn', source);
				} else if (result===1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('frz', source);
				}
			}
		},
		target: "normal",
		type: "Normal"
	},
	"trick": {
		num: 271,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user trades its held item with one adjacent target. Fails if either the user or the target is holding a Mail, if neither is holding an item, or if the user is trying to give or take a Griseous Orb, a Plate, or a Drive to or from a Giratina, an Arceus, or a Genesect, respectively. Pokemon with the Ability Sticky Hold are immune.",
		shortDesc: "User switches its held item with the target's.",
		id: "trick",
		isViable: true,
		name: "Trick",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var yourItem = target.takeItem(source);
			var myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem;
				if (myItem) source.item = myItem;
				return false;
			}
			this.add('-activate', source, 'move: Trick', '[of] '+target);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Trick');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Trick');
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"trickortreat": {
		num: 567,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Adds Ghost to the target's type(s). If the target already has three types, the third is replaced.",
		shortDesc: "Adds Ghost to the target's type(s).",
		id: "trickortreat",
		name: "Trick-or-Treat",
		pp: 20,
		priority: 0,
		isBounceable: true,
		onHit: function(target) {
			if (target.hasType('Ghost')) return false;
			if (!target.addType('Ghost')) return false;
			this.add('-start', target, 'typechange', target.getTypes(true).join('/'), '[from] move: Trick-or-Treat');
		},
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"trickroom": {
		num: 433,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, all active Pokemon with lower Speed will move before those with higher Speed, within their priority brackets. If this move is used during the effect, the effect ends. Priority -7.",
		shortDesc: "For 5 turns, slower Pokemon move first.",
		id: "trickroom",
		isViable: true,
		name: "Trick Room",
		pp: 5,
		priority: -7,
		onHitField: function(target, source, effect) {
			if (this.pseudoWeather['trickroom']) {
				this.removePseudoWeather('trickroom', source, effect, '[of] '+source);
			} else {
				this.addPseudoWeather('trickroom', source, effect, '[of] '+source);
			}
		},
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'persistent') {
					return 7;
				}
				return 5;
			},
			onStart: function(target, source) {
				this.add('-fieldstart', 'move: Trick Room', '[of] '+source);
				this.getStatCallback = function(stat, statName) {
					// If stat is speed and does not overflow (Trick Room Glitch) return negative speed.
					if (statName === 'spe' && stat <= 1809) return -stat;
					return stat;
				};
			},
			onResidualOrder: 23,
			onEnd: function() {
				this.add('-fieldend', 'move: Trick Room');
				this.getStatCallback = null;
			}
		},
		secondary: false,
		target: "all",
		type: "Psychic"
	},
	"triplekick": {
		num: 167,
		accuracy: 90,
		basePower: 10,
		basePowerCallback: function(pokemon) {
			pokemon.addVolatile('triplekick');
			return 10 * pokemon.volatiles['triplekick'].hit;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits three times. The base power increases to 20 for the second hit and 30 for the third. If any of the hits misses the target, the attack ends. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. Makes contact.",
		shortDesc: "Hits 3 times. Each hit can miss, but power rises.",
		id: "triplekick",
		name: "Triple Kick",
		pp: 10,
		priority: 0,
		isContact: true,
		multihit: [3,3],
		effect: {
			duration: 1,
			onStart: function() {
				this.effectData.hit = 1;
			},
			onRestart: function() {
				this.effectData.hit++;
			}
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"trumpcard": {
		num: 376,
		accuracy: true,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			var move = pokemon.getMoveData(pokemon.lastMove); // Account for calling Trump Card via other moves
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
		desc: "Deals damage to one adjacent target and does not check accuracy. The power of this move is based on the amount of PP remaining after normal PP reduction and the Ability Pressure resolve. 200 power for 0PP, 80 power for 1PP, 60 power for 2PP, 50 power for 3PP, and 40 power for 4 or more PP. Makes contact.",
		shortDesc: "More power the fewer PP this move has left.",
		id: "trumpcard",
		name: "Trump Card",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"twineedle": {
		num: 41,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits twice, with each hit having a 20% chance to poison it. If the first hit breaks the target's Substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times. Each hit has 20% chance to poison.",
		id: "twineedle",
		name: "Twineedle",
		pp: 20,
		priority: 0,
		multihit: [2,2],
		secondary: {
			chance: 20,
			status: 'psn'
		},
		target: "normal",
		type: "Bug"
	},
	"twister": {
		num: 239,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to all adjacent foes with a 20% chance to flinch each. Power doubles against Pokemon using Bounce, Fly, or Sky Drop.",
		shortDesc: "20% chance to flinch the foe(s).",
		id: "twister",
		name: "Twister",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch'
		},
		target: "allAdjacentFoes",
		type: "Dragon"
	},
	"uturn": {
		num: 369,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by another party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button. Makes contact.",
		shortDesc: "User switches out after damaging the target.",
		id: "uturn",
		isViable: true,
		name: "U-turn",
		pp: 20,
		priority: 0,
		isContact: true,
		selfSwitch: true,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"uproar": {
		num: 253,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage to one adjacent foe at random. The user spends three turns locked into this move. On the first of the three turns, all sleeping active Pokemon wake up. During the three turns, no active Pokemon can fall asleep by any means; Pokemon switched in during the effect do not wake up. If the user is prevented from moving or the attack is not successful against the target during one of the turns, the effect ends. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "Lasts 3 turns. Active Pokemon cannot fall asleep.",
		id: "uproar",
		name: "Uproar",
		pp: 10,
		priority: 0,
		isSoundBased: true,
		self: {
			volatileStatus: 'uproar'
		},
		onTryHit: function(target) {
			for (var i=0; i<target.side.active.length; i++) {
				var allyActive = target.side.active[i];
				if (allyActive && allyActive.status === 'slp') allyActive.cureStatus();
				var foeActive = target.side.foe.active[i];
				if (foeActive && foeActive.status === 'slp') foeActive.cureStatus();
			}
		},
		effect: {
			duration: 3,
			onResidual: function(target) {
				if (target.lastMove === 'struggle') {
					// don't lock
					delete target.volatiles['uproar'];
				}
			},
			onStart: function(target) {
				this.add('-start', target, 'Uproar');
			},
			onResidual: function(target) {
				this.add('-start', target, 'Uproar', '[upkeep]');
			},
			onEnd: function(target) {
				this.add('-end', target, 'Uproar');
			},
			onLockMove: 'uproar',
			onAnySetStatus: function(status, pokemon) {
				if (status.id === 'slp') {
					if (pokemon === this.effectData.target) {
						this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
					} else {
						this.add('-fail', pokemon, 'slp', '[from] Uproar');
					}
					return null;
				}
			},
			onAnyTryHit: function(target, source, move) {
				if (move && move.id === 'yawn') {
					return false;
				}
			}
		},
		secondary: false,
		target: "randomNormal",
		type: "Normal"
	},
	"vcreate": {
		num: 557,
		accuracy: 95,
		basePower: 180,
		category: "Physical",
		desc: "Deals damage to one adjacent target and lowers the user's Defense, Special Defense, and Speed by 1 stage. Makes contact.",
		shortDesc: "Lowers the user's Defense, Sp. Def, Speed by 1.",
		id: "vcreate",
		isViable: true,
		name: "V-create",
		pp: 5,
		priority: 0,
		isContact: true,
		self: {
			boosts: {
				def: -1,
				spd: -1,
				spe: -1
			}
		},
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"vacuumwave": {
		num: 410,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to one adjacent target. Priority +1.",
		shortDesc: "Usually goes first.",
		id: "vacuumwave",
		isViable: true,
		name: "Vacuum Wave",
		pp: 30,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"venomdrench": {
		num: 599,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the Attack, Special Attack, and Speed stats of a poisoned target.",
		shortDesc: "Lowers Attack, Sp. Atk, Speed of poisoned target.",
		id: "venomdrench",
		name: "Venom Drench",
		pp: 20,
		priority: 0,
		onHit: function(target, source, move) {
			if (target.status === 'psn' || target.status === 'tox') {
				return this.boost({atk:-1, spa:-1, spe:-1}, target, source, move);
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"venoshock": {
		num: 474,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Deals damage to one adjacent target. Power doubles if the target is poisoned.",
		shortDesc: "Power doubles if the target is poisoned.",
		id: "venoshock",
		name: "Venoshock",
		pp: 10,
		priority: 0,
		onBasePowerPriority: 4,
		onBasePower: function(basePower, pokemon, target) {
			if (target.status === 'psn' || target.status === 'tox') {
				return this.chainModify(2);
			}
		},
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"vicegrip": {
		num: 11,
		accuracy: 100,
		basePower: 55,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "vicegrip",
		name: "Vice Grip",
		pp: 30,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"vinewhip": {
		num: 22,
		accuracy: 100,
		basePower: 45,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "vinewhip",
		name: "Vine Whip",
		pp: 25,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"vitalthrow": {
		num: 233,
		accuracy: true,
		basePower: 70,
		category: "Physical",
		desc: "Deals damage to one adjacent target and does not check accuracy. Makes contact. Priority -1.",
		shortDesc: "This move does not check accuracy. Goes last.",
		id: "vitalthrow",
		name: "Vital Throw",
		pp: 10,
		priority: -1,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"voltswitch": {
		num: 521,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Deals damage to one adjacent target. If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by another party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button.",
		shortDesc: "User switches out after damaging the target.",
		id: "voltswitch",
		isViable: true,
		name: "Volt Switch",
		pp: 20,
		priority: 0,
		selfSwitch: true,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"volttackle": {
		num: 344,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 10% chance to paralyze it. If the target lost HP, the user takes recoil damage equal to 33% that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 33% recoil. 10% chance to paralyze target.",
		id: "volttackle",
		isViable: true,
		name: "Volt Tackle",
		pp: 15,
		priority: 0,
		isContact: true,
		recoil: [33,100],
		secondary: {
			chance: 10,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"wakeupslap": {
		num: 358,
		accuracy: 100,
		basePower: 70,
		basePowerCallback: function(pokemon, target) {
			if (target.status === 'slp') return 140;
			return 70;
		},
		category: "Physical",
		desc: "Deals damage to one adjacent target. Power doubles if the target is asleep, and the target wakes up. Makes contact.",
		shortDesc: "Power doubles if target is asleep, and wakes it.",
		id: "wakeupslap",
		name: "Wake-Up Slap",
		pp: 10,
		priority: 0,
		isContact: true,
		onHit: function(target) {
			if (target.status === 'slp') target.cureStatus();
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"watergun": {
		num: 55,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage to one adjacent target.",
		shortDesc: "No additional effect.",
		id: "watergun",
		name: "Water Gun",
		pp: 25,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"waterpledge": {
		num: 518,
		accuracy: 100,
		basePower: 80,
		basePowerCallback: function(target, source, move) {
			if (move.sourceEffect in {firepledge:1, grasspledge:1}) {
				this.add('-combine');
				return 150;
			}
			return 80;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. If one of the user's allies chose to use Fire Pledge or Grass Pledge this turn and has not moved yet, they take their turn immediately after the user and the user's move does nothing. Power triples if this move is used by an ally that way, and a rainbow appears on the user's side if the first move was Fire Pledge, or a swamp appears on the target's side if the first move was Grass Pledge.",
		shortDesc: "Use with Grass or Fire Pledge for added effect.",
		id: "waterpledge",
		name: "Water Pledge",
		pp: 10,
		priority: 0,
		onTryHit: function(target, source, move) {
			for (var i=0; i<this.queue.length; i++) {
				var decision = this.queue[i];
				if (!decision.pokemon || !decision.move) continue;
				if (decision.pokemon.side === source.side && decision.move.id in {firepledge:1, grasspledge:1}) {
					this.prioritizeQueue(decision);
					this.add('-waiting', source, decision.pokemon);
					return null;
				}
			}
		},
		onModifyMove: function(move) {
			if (move.sourceEffect === 'grasspledge') {
				move.type = 'Grass';
				move.hasSTAB = true;
			}
			if (move.sourceEffect === 'firepledge') {
				move.type = 'Water';
				move.hasSTAB = true;
			}
		},
		onHit: function(target, source, move) {
			if (move.sourceEffect === 'firepledge') {
				source.side.addSideCondition('waterpledge');
			}
			if (move.sourceEffect === 'grasspledge') {
				target.side.addSideCondition('grasspledge');
			}
		},
		effect: {
			duration: 4,
			onStart: function(targetSide) {
				this.add('-sidestart', targetSide, 'Water Pledge');
			},
			onEnd: function(targetSide) {
				this.add('-sideend', targetSide, 'Water Pledge');
			},
			onModifyMove: function(move) {
				if (move.secondaries) {
					this.debug('doubling secondary chance');
					for (var i=0; i<move.secondaries.length; i++) {
						move.secondaries[i].chance *= 2;
					}
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"waterpulse": {
		num: 352,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Deals damage to one adjacent or non-adjacent target with a 10% chance to confuse it.",
		shortDesc: "20% chance to confuse the target.",
		id: "waterpulse",
		name: "Water Pulse",
		pp: 20,
		priority: 0,
		isPulseMove: true,
		secondary: {
			chance: 20,
			volatileStatus: 'confusion'
		},
		target: "any",
		type: "Water"
	},
	"watersport": {
		num: 346,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the user is no longer active, all Fire-type attacks used by any active Pokemon have their power reduced to 0.33x. Fails if this move is already in effect; not stackable.",
		shortDesc: "Weakens Fire-type attacks to 1/3 their power.",
		id: "watersport",
		name: "Water Sport",
		pp: 15,
		priority: 0,
		volatileStatus: 'watersport',
		onTryHitField: function(target, source) {
			if (source.volatiles['watersport']) return false;
		},
		effect: {
			noCopy: true,
			onStart: function(pokemon) {
				this.add("-start", pokemon, 'move: Water Sport');
			},
			onBasePowerPriority: 1,
			onAnyBasePower: function(basePower, user, target, move) {
				if (move.type === 'Fire') return this.chainModify([0x548, 0x1000]); // The Water Sport modifier is slightly higher than the usual 0.33 modifier (0x547)
			}
		},
		secondary: false,
		target: "all",
		type: "Water"
	},
	"waterspout": {
		num: 323,
		accuracy: 100,
		basePower: 150,
		basePowerCallback: function(pokemon) {
			return 150*pokemon.hp/pokemon.maxhp;
		},
		category: "Special",
		desc: "Deals damage to all adjacent foes. Power is equal to (user's current HP * 150 / user's maximum HP), rounded down, but not less than 1.",
		shortDesc: "Less power as user's HP decreases. Hits foe(s).",
		id: "waterspout",
		isViable: true,
		name: "Water Spout",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "allAdjacentFoes",
		type: "Water"
	},
	"waterfall": {
		num: 127,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 20% chance to flinch it. Makes contact. (Field: Can be used to climb a waterfall.)",
		shortDesc: "20% chance to flinch the target.",
		id: "waterfall",
		isViable: true,
		name: "Waterfall",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Water"
	},
	"watershuriken": {
		num: 594,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's Substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times. Almost always goes first.",
		shortDesc: "Hits 2-5 times in one turn. Priority +1.",
		id: "watershuriken",
		name: "Water Shuriken",
		pp: 20,
		priority: 1,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"weatherball": {
		num: 311,
		accuracy: 100,
		basePower: 50,
		basePowerCallback: function() {
			if (this.weather) return 100;
			return 50;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. Power doubles during weather effects and this move's type changes to match; Ice-type during Hail, Water-type during Rain Dance, Rock-type during Sandstorm, and Fire-type during Sunny Day.",
		shortDesc: "Power doubles and type varies in each weather.",
		id: "weatherball",
		isViable: true,
		name: "Weather Ball",
		pp: 10,
		priority: 0,
		isBullet: true,
		onModifyMove: function(move) {
			switch (this.effectiveWeather()) {
			case 'sunnyday':
				move.type = 'Fire';
				break;
			case 'raindance':
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
		type: "Normal"
	},
	"whirlpool": {
		num: 250,
		accuracy: 85,
		basePower: 35,
		category: "Special",
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Power doubles if the target is using Dive. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "whirlpool",
		name: "Whirlpool",
		pp: 15,
		priority: 0,
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"whirlwind": {
		num: 18,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to be forced to switch out and be replaced with a random unfainted ally. Fails if the target used Ingrain previously or has the Ability Suction Cups. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. Ignores a target's Substitute. Priority -6. (Wild battles: The battle ends as long as it is not a double battle and the user's level is not less than the opponent's level.)",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "whirlwind",
		isViable: true,
		name: "Whirlwind",
		pp: 20,
		priority: -6,
		isNotProtectable: true,
		forceSwitch: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"wideguard": {
		num: 469,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn that target all adjacent foes or all adjacent Pokemon. Fails if this move is already in effect for the user's side. Priority +3.",
		shortDesc: "Protects allies from multi-target hits this turn.",
		id: "wideguard",
		name: "Wide Guard",
		pp: 10,
		priority: 3,
		isSnatchable: true,
		sideCondition: 'wideguard',
		onTryHitSide: function(side, source) {
			return this.willAct();
		},
		effect: {
			duration: 1,
			onStart: function(target, source) {
				this.add('-singleturn', source, 'Wide Guard');
			},
			onTryHitPriority: 4,
			onTryHit: function(target, source, effect) {
				// Wide Guard blocks damaging spread moves
				if (effect && (effect.category === 'Status' || (effect.target !== 'allAdjacent' && effect.target !== 'allAdjacentFoes'))) {
					return;
				}
				this.add('-activate', target, 'Wide Guard');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			}
		},
		secondary: false,
		target: "allySide",
		type: "Rock"
	},
	"wildcharge": {
		num: 528,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If the target lost HP, the user takes recoil damage equal to 1/4 that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 1/4 recoil.",
		id: "wildcharge",
		isViable: true,
		name: "Wild Charge",
		pp: 15,
		priority: 0,
		isContact: true,
		recoil: [1,4],
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"willowisp": {
		num: 261,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Burns one adjacent target. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Burns the target.",
		id: "willowisp",
		isViable: true,
		name: "Will-O-Wisp",
		pp: 15,
		priority: 0,
		status: 'brn',
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"wingattack": {
		num: 17,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "wingattack",
		name: "Wing Attack",
		pp: 35,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "any",
		type: "Flying"
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
		isSnatchable: true,
		sideCondition: 'Wish',
		effect: {
			duration: 2,
			onStart: function(side, source) {
				this.effectData.hp = source.maxhp/2;
			},
			onResidualOrder: 4,
			onEnd: function(side) {
				var target = side.active[this.effectData.sourcePosition];
				if (!target.fainted) {
					var source = this.effectData.source;
					var damage = this.heal(this.effectData.hp, target, target);
					if (damage) this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] '+source.name);
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"withdraw": {
		num: 110,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 1 stage.",
		shortDesc: "Boosts the user's Defense by 1.",
		id: "withdraw",
		name: "Withdraw",
		pp: 40,
		priority: 0,
		isSnatchable: true,
		boosts: {
			def: 1
		},
		secondary: false,
		target: "self",
		type: "Water"
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
		onHitField: function(target, source, effect) {
			if (this.pseudoWeather['wonderroom']) {
				this.removePseudoWeather('wonderroom', source, effect, '[of] '+source);
			} else {
				this.addPseudoWeather('wonderroom', source, effect, '[of] '+source);
			}
		},
		effect: {
			duration: 5,
			onStart: function(side, source) {
				this.add('-fieldstart', 'move: WonderRoom', '[of] '+source);
			},
			onModifyMovePriority: -100,
			onModifyMove: function(move) {
				move.defensiveCategory = ((move.defensiveCategory || this.getCategory(move)) === 'Physical' ? 'Special' : 'Physical');
				this.debug('Defensive Category: ' + move.defensiveCategory);
			},
			onResidualOrder: 24,
			onEnd: function() {
				this.add('-fieldend', 'move: Wonder Room');
			}
		},
		secondary: false,
		target: "all",
		type: "Psychic"
	},
	"woodhammer": {
		num: 452,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target. If the target lost HP, the user takes recoil damage equal to 33% that HP, rounded half up, but not less than 1HP. Makes contact.",
		shortDesc: "Has 33% recoil.",
		id: "woodhammer",
		isViable: true,
		name: "Wood Hammer",
		pp: 15,
		priority: 0,
		isContact: true,
		recoil: [33,100],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"workup": {
		num: 526,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Special Attack by 1 stage.",
		shortDesc: "Boosts the user's Attack and Sp. Atk by 1.",
		id: "workup",
		isViable: true,
		name: "Work Up",
		pp: 30,
		priority: 0,
		isSnatchable: true,
		boosts: {
			atk: 1,
			spa: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"worryseed": {
		num: 388,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target's Ability to become Insomnia. Fails if the target's Ability is Insomnia, Multitype, Stance Change or Truant. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "The target's Ability becomes Insomnia.",
		id: "worryseed",
		name: "Worry Seed",
		pp: 10,
		priority: 0,
		isBounceable: true,
		onTryHit: function(pokemon) {
			var bannedAbilities = {insomnia:1, multitype:1, stancechange:1, truant:1};
			if (bannedAbilities[pokemon.ability]) {
				return false;
			}
		},
		onHit: function(pokemon) {
			if (pokemon.setAbility('insomnia')) {
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
		type: "Grass"
	},
	"wrap": {
		num: 35,
		accuracy: 90,
		basePower: 15,
		category: "Physical",
		desc: "Deals damage to one adjacent target and prevents it from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin. This effect is not stackable or reset by using this or another partial-trapping move. Makes contact.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "wrap",
		name: "Wrap",
		pp: 20,
		priority: 0,
		isContact: true,
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"wringout": {
		num: 378,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon, target) {
			return Math.floor(Math.floor((120 * (100 * Math.floor(target.hp * 4096 / target.maxhp)) + 2048 - 1) / 4096) / 100) || 1;
		},
		category: "Special",
		desc: "Deals damage to one adjacent target. Power is equal to 120 * (target's current HP / target's maximum HP), rounded half down, but not less than 1. Makes contact.",
		shortDesc: "More power the more HP the target has left.",
		id: "wringout",
		name: "Wring Out",
		pp: 5,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"xscissor": {
		num: 404,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Makes contact.",
		shortDesc: "No additional effect.",
		id: "xscissor",
		isViable: true,
		name: "X-Scissor",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"yawn": {
		num: 281,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes one adjacent target to fall asleep at the end of the next turn. If the target is still on the field and does not have a major status problem at that time, it falls asleep, and this effect cannot be prevented by Safeguard or Substitute. Fails if the target cannot fall asleep or if it already has a major status problem. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves.",
		shortDesc: "Puts the target to sleep after 1 turn.",
		id: "yawn",
		isViable: true,
		name: "Yawn",
		pp: 10,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'yawn',
		onTryHit: function(target) {
			if (target.status || !target.runImmunity('slp')) {
				return false;
			}
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onStart: function(target, source) {
				this.add('-start', target, 'move: Yawn', '[of] '+source);
			},
			onEnd: function(target) {
				target.trySetStatus('slp');
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"zapcannon": {
		num: 192,
		accuracy: 50,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 100% chance to paralyze it.",
		shortDesc: "100% chance to paralyze the target.",
		id: "zapcannon",
		name: "Zap Cannon",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 100,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"zenheadbutt": {
		num: 428,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 20% chance to flinch it. Makes contact.",
		shortDesc: "20% chance to flinch the target.",
		id: "zenheadbutt",
		isViable: true,
		name: "Zen Headbutt",
		pp: 15,
		priority: 0,
		isContact: true,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Psychic"
	},
	"paleowave": {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 20% chance to lower its Attack by 1 stage.",
		shortDesc: "20% chance to lower the target's Attack by 1.",
		id: "paleowave",
		isNonstandard: true,
		isViable: true,
		name: "Paleo Wave",
		pp: 15,
		priority: 0,
		secondary: {
			chance: 20,
			boosts: {
				atk: -1
			}
		},
		target: "normal",
		type: "Rock"
	},
	"shadowstrike": {
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 50% chance to lower its Defense by 1 stage. Makes contact.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "shadowstrike",
		isNonstandard: true,
		isViable: true,
		name: "Shadow Strike",
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
		type: "Ghost"
	},
	"magikarpsrevenge": {
		accuracy: true,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 100% chance to confuse it and lower its Defense and Special Attack by 1 stage. The user recovers half of the HP lost by the target, rounded up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. If this move is successful, the weather changes to Rain Dance for 5 turns unless Rain Dance is already in effect, the user gains the effects of Aqua Ring and Magic Coat, and the user must recharge on the following turn and cannot make a move. Makes contact.",
		shortDesc: "Does many things turn 1. Can't move turn 2.",
		id: "magikarpsrevenge",
		isNonstandard: true,
		isViable: true,
		name: "Magikarp's Revenge",
		pp: 10,
		priority: 0,
		isContact: true,
		drain: [1,2],
		onTryHit: function(target, source) {
			if (source.template.name !== 'Magikarp') {
				this.add('-message', 'It didn\'t work since it wasn\'t used by a Magikarp!'); // TODO?
				return null;
			}
		},
		self: {
			onHit: function(source) {
				this.setWeather('raindance');
				source.addVolatile('magiccoat');
				source.addVolatile('aquaring');
			},
			volatileStatus: 'mustrecharge'
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
			boosts: {
				def: -1,
				spa: -1
			}
		},
		target: "normal",
		type: "Water"
	}
};
