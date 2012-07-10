exports.BattleMovedex = {
	"absorb": {
		num: 71,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
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
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
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
		name: "Acid Armor",
		pp: 40,
		isViable: true,
		priority: 0,
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
		desc: "Lowers the target's Special Defense by two stages.",
		shortDesc: "100% chance to lower the target's Sp. Def by 2.",
		id: "acidspray",
		name: "Acid Spray",
		pp: 20,
		isViable: true,
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
		desc: "Acrobat allows the user to hit any target that is not in their attack range in a triple battle. The power is also doubled if the user has no held item.",
		shortDesc: "Power doubles if the user has no held item.",
		id: "acrobatics",
		name: "Acrobatics",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"acupressure": {
		num: 367,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "One of the user's stats, including Accuracy or Evasion, is randomly selected and boosted by 2 stages. A stat which is already at max will not be selected. User can also select its partner in 2v2 battles to randomly boost one of its stats.",
		shortDesc: "Boosts a random stat of the user or an ally by 2.",
		id: "acupressure",
		name: "Acupressure",
		pp: 30,
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
		priority: 0,
		secondary: false,
		target: "ally",
		type: "Normal"
	},
	"aerialace": {
		num: 332,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		shortDesc: "Ignores Accuracy and Evasion modifiers.",
		id: "aerialace",
		name: "Aerial Ace",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"aeroblast": {
		num: 177,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "aeroblast",
		name: "Aeroblast",
		pp: 5,
		isViable: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"afteryou": {
		num: 495,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "After this move is used, the target will attack first, ignoring priority.",
		shortDesc: "The target makes its move right after the user.",
		id: "afteryou",
		name: "After You",
		pp: 15,
		priority: 0,
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
		name: "Agility",
		pp: 30,
		isViable: true,
		priority: 0,
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
		desc: "Has a high critical hit ratio.",
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
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch the target.",
		id: "airslash",
		name: "Air Slash",
		pp: 20,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Flying"
	},
	"allyswitch": {
		num: 502,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "User switches places with a random ally.",
		shortDesc: "Switches position with the ally on the far side.",
		id: "allyswitch",
		name: "Ally Switch",
		pp: 15,
		priority: 1,
		secondary: false,
		target: "normal",
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
		name: "Amnesia",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "Has a 10% chance to raise all of the user's stats by 1 stage.",
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
		desc: "Usually goes first.",
		shortDesc: "Usually goes first.",
		id: "aquajet",
		name: "Aqua Jet",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"aquaring": {
		num: 392,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user recovers 1/16 of its max HP per turn until it faints or switches out; this can be Baton Passed to another Pokemon.",
		shortDesc: "User recovers 1/16 max HP per turn.",
		id: "aquaring",
		name: "Aqua Ring",
		pp: 20,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "aquatail",
		name: "Aqua Tail",
		pp: 10,
		isContact: true,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"armthrust": {
		num: 292,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "armthrust",
		name: "Arm Thrust",
		pp: 20,
		isContact: true,
		priority: 0,
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
		desc: "Every Pokemon in the user's party is cured of status conditions. Lists every Pokemon that was healed, and what status condition was cured. ",
		shortDesc: "Cures the user's party of all status conditions.",
		id: "aromatherapy",
		name: "Aromatherapy",
		pp: 5,
		isViable: true,
		priority: 0,
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
		desc: "The user performs a random move from any of the Pokemon on its team. Assist cannot generate itself, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief or Trick.",
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
		desc: "Base power doubles if, since the beginning of the current turn, the target has taken residual damage from any factors such as recoil, Spikes, Stealth Rock or the effects of holding Life Orb.",
		shortDesc: "Power doubles if target was damaged this turn.",
		id: "assurance",
		name: "Assurance",
		pp: 10,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"astonish": {
		num: 310,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch the target.",
		id: "astonish",
		name: "Astonish",
		pp: 15,
		isContact: true,
		priority: 0,
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "attackorder",
		name: "Attack Order",
		pp: 15,
		isViable: true,
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
		desc: "Infatuates Pokemon of the opposite gender, even if they have a Substitute, causing a 50% chance for the target's attack to fail.",
		shortDesc: "A target of the opposite gender gets infatuated.",
		id: "attract",
		name: "Attract",
		pp: 15,
		isBounceable: true,
		priority: 0,
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
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		shortDesc: "Ignores Accuracy and Evasion modifiers.",
		id: "aurasphere",
		name: "Aura Sphere",
		pp: 20,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
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
		desc: "Raises the user's Speed by two stages.",
		shortDesc: "Boosts the user's Speed by 2 and halves weight.",
		id: "autotomize",
		name: "Autotomize",
		pp: 15,
		isViable: true,
		priority: 0,
		boosts: {
			spe: 2
		},
		volatileStatus: 'autotomize',
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'Autotomize');
			},
			onModifyPokemon: function(pokemon) {
				pokemon.weightkg /= 2;
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
		desc: "Base power is 60. Almost always goes last, even after another Pokemon's Focus Punch; this move's base power doubles if the user is damaged before its turn.",
		shortDesc: "Power doubles if user is damaged by the target.",
		id: "avalanche",
		name: "Avalanche",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: -4,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"barrage": {
		num: 140,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
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
		name: "Barrier",
		pp: 30,
		isViable: true,
		priority: 0,
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
		desc: "The user returns to its party, bypassing any trapping moves and Pursuit; it passes all stat modifiers (positive or negative, including from Charge and Stockpile), as well as confusion, Focus Energy/Lansat Berry boosts, Ingrain, Aqua Ring, Embargo, Gastro Acid, Power Trick, Magnet Rise, Stockpiles, Perish Song count, Mist, Leech Seed, Ghost Curses, Mind Reader, Lock-On, Block, Mean Look, Spider Web and Substitute to the replacement Pokemon.",
		shortDesc: "User switches, passing stat changes and more.",
		id: "batonpass",
		name: "Baton Pass",
		pp: 40,
		isViable: true,
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
		desc: "The user and every other healthy (i.e. not fainted nor inflicted with a status condition) Pokemon in your party each contribute a hit with base power determined by their base Attack stat.",
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
		desc: "The user maximizes its Attack but sacrifices 50% of its max HP.",
		shortDesc: "User loses 50% max HP. Maximizes Attack.",
		id: "bellydrum",
		name: "Belly Drum",
		pp: 10,
		isViable: true,
		priority: 0,
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
		desc: "Gives the user's held item to the target.",
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
		desc: "Usually goes first for the duration of the move. The user absorbs all damage for two turns and then, during the third turn, the user inflicts twice the absorbed damage on the last pokemon that hit it. This move ignores the target's type and even hits Ghost-type Pokemon.",
		shortDesc: "Waits 2 turns; deals double the damage taken.",
		id: "bide",
		name: "Bide",
		pp: 10,
		isContact: true,
		priority: 1,
		volatileStatus: 'bide',
		effect: {
			duration: 3,
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
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('bide');
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
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "bind",
		name: "Bind",
		pp: 20,
		isContact: true,
		priority: 0,
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
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch the target.",
		id: "bite",
		name: "Bite",
		pp: 25,
		isContact: true,
		priority: 0,
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
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
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
		desc: "Has a high critical hit ratio and a 10% chance to burn the target.",
		shortDesc: "High critical hit ratio. 10% chance to burn.",
		id: "blazekick",
		name: "Blaze Kick",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 10% chance to freeze the target. During Hail, this move will never miss under normal circumstances and has a 30% chance to hit through a target's Protect or Detect.",
		shortDesc: "10% chance to freeze the foe(s).",
		id: "blizzard",
		name: "Blizzard",
		pp: 5,
		isViable: true,
		priority: 0,
		onModifyMove: function(move) {
			if (this.weather === 'hail') move.accuracy = true;
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
		desc: "As long as the user remains in battle, the target cannot switch out unless it is holding Shed Shell or uses Baton Pass or U-Turn. The target will still be trapped if the user switches out by using Baton Pass.",
		shortDesc: "The target cannot switch out.",
		id: "block",
		name: "Block",
		pp: 5,
		isViable: true,
		isBounceable: true,
		priority: 0,
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
		desc: "Has a 20% chance to burn the target.",
		shortDesc: "20% chance to burn the target.",
		id: "blueflare",
		name: "Blue Flare",
		pp: 5,
		isViable: true,
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
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		id: "bodyslam",
		name: "Body Slam",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 20% chance to paralyze the target.",
		shortDesc: "20% chance to paralyze the target.",
		id: "boltstrike",
		name: "Bolt Strike",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 10% chance to make the target flinch.",
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
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
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
		desc: "Strikes twice; if the first hit breaks the target's Substitute, the real Pokemon will take damage from the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		id: "bonemerang",
		name: "Bonemerang",
		pp: 10,
		isViable: true,
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
		desc: "On the first turn, the user bounces into the air, becoming uncontrollable, and evades most attacks. Gust, Twister, Thunder and Sky Uppercut have normal accuracy against a mid-air Pokemon, with Gust and Twister also gaining doubled power. The user may also be hit in mid-air if it was previously targeted by Lock-On or Mind Reader or if it is attacked by a Pokemon with No Guard. On the second turn, the user descends and has a 30% chance to paralyze the target.",
		shortDesc: "Bounces turn 1. Hits turn 2. 30% paralyze.",
		id: "bounce",
		name: "Bounce",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('bounce')) return;
			pokemon.addVolatile('bounce');
			this.add('-prepare', pokemon, 'Bounce', target);
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('bounce');
			},
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
		target: "normal",
		type: "Flying"
	},
	"bravebird": {
		num: 413,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user receives 1/3 recoil damage.",
		shortDesc: "Has 1/3 recoil.",
		id: "bravebird",
		name: "Brave Bird",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		recoil: [1,3],
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"brickbreak": {
		num: 280,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Reflect and Light Screen are removed from the target's field even if the attack misses or the target is a Ghost-type.",
		shortDesc: "Destroys screens, unless the target is immune.",
		id: "brickbreak",
		name: "Brick Break",
		pp: 15,
		isViable: true,
		isContact: true,
		onTryHit: function(pokemon) {
			// will shatter screens through sub, before you hit
			if (pokemon.runImmunity('Fighting')) {
				pokemon.side.removeSideCondition('reflect');
				pokemon.side.removeSideCondition('lightscreen');
			}
		},
		priority: 0,
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
		desc: "Base power is 65, doubles if the target is at least 50% below full health.",
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
		desc: "Has a 10% chance to lower the target's Speed by 1 stage.",
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
		desc: "Has a 10% chance to lower the target's Speed by 1 stage.",
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
		desc: "The user eats the target's held berry and, if applicable, receives its benefits. Jaboca Berry will be removed without damaging the user, but Tanga Berry will still activate and reduce this move's power.",
		shortDesc: "User steals and eats the target's Berry.",
		id: "bugbite",
		name: "Bug Bite",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"bugbuzz": {
		num: 405,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def. by 1.",
		id: "bugbuzz",
		name: "Bug Buzz",
		pp: 10,
		isViable: true,
		isSoundBased: true,
		priority: 0,
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
		desc: "Raises the user's Attack and Defense by 1 stage each.",
		shortDesc: "Boosts the user's Attack and Defense by 1.",
		id: "bulkup",
		name: "Bulk Up",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "Has a 100% chance to lower the target's Speed by one level.",
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
		target: "normal",
		type: "Ground"
	},
	"bulletpunch": {
		num: 418,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Usually goes first.",
		shortDesc: "Usually goes first.",
		id: "bulletpunch",
		name: "Bullet Punch",
		pp: 30,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"bulletseed": {
		num: 331,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "bulletseed",
		name: "Bullet Seed",
		pp: 30,
		isViable: true,
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
		desc: "Raises the user's Special Attack and Special Defense by 1 stage each.",
		shortDesc: "Boosts the user's Sp. Atk and Sp. Def by 1.",
		id: "calmmind",
		name: "Calm Mind",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "The user's type changes according to the current terrain. It becomes Grass-type in tall grass and very tall grass (as well as in puddles), Water-type while surfing on any body of water, Rock-type while inside any caves or on any rocky terrain, Ground-type on beach sand, desert sand and dirt roads, Ice-type in snow, and Normal-type everywhere else. The user will always become Normal-type during Wi-Fi battles. ",
		shortDesc: "Changes user's type based on terrain. (Ground)",
		id: "camouflage",
		name: "Camouflage",
		pp: 20,
		priority: 0,
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
		desc: "Lowers the target's Special Attack by 2 stages if the target is the opposite gender of the user. Fails if either Pokemon is genderless.",
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
		target: "normal",
		type: "Normal"
	},
	"charge": {
		num: 268,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Doubles the power of the user's Electric attacks on the next turn and increases the user's Special Defense by 1 stage.",
		shortDesc: "Boosts next Electric move and user's Sp. Def by 1.",
		id: "charge",
		name: "Charge",
		pp: 20,
		priority: 0,
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
		desc: "Has a 70% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "70% chance to boost the user's Sp. Atk by 1.",
		id: "chargebeam",
		name: "Charge Beam",
		pp: 10,
		isViable: true,
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
		desc: "Lowers the target's Attack by 2 stages.",
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
		desc: "Has a 1%, 11% or 31% chance to confuse the target if its user is Chatot. The confusion rate increases directly with the volume of a sound recorded using the DS's microphone; Chatot's default cry has a 1% chance to confuse its target and is replaced by the player's recordings. This move cannot be randomly generated by moves such as Metronome and it cannot be copied with Sketch. If another Pokemon uses Transform to turn into Chatot, its Chatter cannot cause confusion.",
		shortDesc: "31% chance to confuse the target.",
		id: "chatter",
		name: "Chatter",
		pp: 20,
		isSoundBased: true,
		priority: 0,
		onModifyMove: function(move, pokemon) {
			if (pokemon.template.species !== 'Chatot') delete move.secondaries;
		},
		secondary: {
			chance: 31,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Flying"
	},
	"chipaway": {
		num: 498,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Ignores the target's stat modifiers.",
		shortDesc: "Ignores the target's stat modifiers.",
		id: "chipaway",
		name: "Chip Away",
		pp: 20,
		isContact: true,
		priority: 0,
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
		desc: "Forces the target to switch to a random Pokemon. Fails if target is behind a Substitute.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "circlethrow",
		name: "Circle Throw",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: -6,
		forceSwitch: true,
		target: "normal",
		type: "Fighting"
	},
	"clamp": {
		num: 128,
		accuracy: 85,
		basePower: 35,
		category: "Physical",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "clamp",
		name: "Clamp",
		pp: 10,
		isContact: true,
		priority: 0,
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
		desc: "Removes all of the target's stat changes.",
		shortDesc: "Eliminates the target's stat changes.",
		id: "clearsmog",
		name: "Clear Smog",
		pp: 15,
		isViable: true,
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
		desc: "Lowers the user's Defense and Special Defense by 1 stage.",
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
		id: "closecombat",
		name: "Close Combat",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Raises the user's Attack, Defense, and accuracy by one stage.",
		shortDesc: "Boosts user's Attack, Defense, and Accuracy by 1.",
		id: "coil",
		name: "Coil",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "cometpunch",
		name: "Comet Punch",
		pp: 15,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
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
		desc: "Confuses the target.",
		shortDesc: "Confuses the target.",
		id: "confuseray",
		name: "Confuse Ray",
		pp: 10,
		isViable: true,
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
		desc: "Has a 10% chance to confuse the target.",
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
		desc: "Has a 10% chance to lower the target's Speed by 1 stage.",
		shortDesc: "10% chance to lower the target's Speed by 1.",
		id: "constrict",
		name: "Constrict",
		pp: 35,
		isContact: true,
		priority: 0,
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
		desc: "The user's type changes to match the type of one of its four attacks. This move fails if the user cannot change its type under this condition.",
		shortDesc: "Changes user's type to match a known move.",
		id: "conversion",
		name: "Conversion",
		pp: 30,
		priority: 0,
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
		desc: "The user's type changes to one that resists the type of the last attack that hit the user. In double battles, this situation holds even when the user is last hit by an attack from its partner.",
		shortDesc: "Changes user's type to resist target's last move.",
		id: "conversion2",
		name: "Conversion 2",
		pp: 30,
		priority: 0,
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
		desc: "The user performs the battle's last successful move. This move could be from the current opponent, a previous opponent, a teammate or even another move from the user's own moveset. This move fails if no Pokemon has used a move yet. Copycat cannot copy itself.",
		shortDesc: "Uses the last move used in the battle.",
		id: "copycat",
		name: "Copycat",
		pp: 20,
		isViable: true,
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
		desc: "Raises the user's Defense and Special Defense by 1 stage each.",
		shortDesc: "Boosts the user's Defense and Sp. Def by 1.",
		id: "cosmicpower",
		name: "Cosmic Power",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "Raises the user's Defense by three stages.",
		shortDesc: "Boosts the user's Defense by 3.",
		id: "cottonguard",
		name: "Cotton Guard",
		pp: 10,
		isViable: true,
		priority: 0,
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
		desc: "Lowers the target's Speed by 2 stages.",
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
		desc: "Almost always goes last; if an opponent strikes with a Physical attack before the user's turn, the user retaliates for twice the damage it had endured. In double battles, this attack targets the last opponent to hit the user with a Physical attack and cannot hit the user's teammate.",
		shortDesc: "If hit by physical attack, returns double damage.",
		id: "counter",
		name: "Counter",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: -5,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"covet": {
		num: 343,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Steals the target's held item unless the user is already holding an item or the target has Sticky Hold or Multitype. Recycle cannot recover the stolen item.",
		shortDesc: "If the user has no item, it steals the target's.",
		id: "covet",
		name: "Covet",
		pp: 40,
		isContact: true,
		priority: 0,
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "crabhammer",
		name: "Crabhammer",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "crosschop",
		name: "Cross Chop",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a high critical hit ratio and a 10% chance to poison the target.",
		shortDesc: "High critical hit ratio. 10% chance to poison.",
		id: "crosspoison",
		name: "Cross Poison",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 20% chance to lower the target's Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Defense by 1.",
		id: "crunch",
		name: "Crunch",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 50% chance to lower the target's Defense by 1 stage.",
		shortDesc: "50% chance to lower the target's Defense by 1",
		id: "crushclaw",
		name: "Crush Claw",
		pp: 10,
		isContact: true,
		priority: 0,
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
		desc: "Base power decreases as the target's HP decreases.",
		shortDesc: "More power the more HP the target has left.",
		id: "crushgrip",
		name: "Crush Grip",
		pp: 5,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"curse": {
		num: 174,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "When used by a Ghost-type, the user sacrifices half of its max HP to sap the target by 1/4 of its max HP per turn. When used by anything else, the user's Speed is decreased by 1 stage and its Attack and Defense are increased by 1 stage.",
		shortDesc: "Curses if Ghost, else +1 Atk, +1 Def, -1 Spe.",
		id: "curse",
		name: "Curse",
		pp: 10,
		isViable: true,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "cut",
		name: "Cut",
		pp: 30,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"darkpulse": {
		num: 399,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to make the target flinch.",
		shortDesc: "20% chance to flinch the target.",
		id: "darkpulse",
		name: "Dark Pulse",
		pp: 15,
		isViable: true,
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
		desc: "Puts the target to sleep. In double battles, this move will put both opponents to sleep.",
		shortDesc: "Puts the foe(s) to sleep.",
		id: "darkvoid",
		name: "Dark Void",
		pp: 10,
		isViable: true,
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
		desc: "Raises the user's Defense and Special Defense by 1 stage each.",
		shortDesc: "Boosts the user's Defense and Sp. Def by 1.",
		id: "defendorder",
		name: "Defend Order",
		pp: 10,
		isViable: true,
		priority: 0,
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
		desc: "Raises the user's Defense by 1 stage; after one use of this move, the user's starting base power is doubled for every use of Rollout or Ice Ball.",
		shortDesc: "Boosts the user's Defense by 1.",
		id: "defensecurl",
		name: "Defense Curl",
		pp: 40,
		priority: 0,
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
		desc: "Lowers the target's Evasion by 1 stage and removes Reflect, Light Screen, Safeguard, Mist, Spikes, Stealth Rock and Toxic Spikes from the target's side of the field.",
		shortDesc: "Removes target's hazards, lowers Evasion by 1.",
		id: "defog",
		name: "Defog",
		pp: 15,
		isBounceable: true,
		priority: 0,
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
		desc: "Causes an opponent to faint if its next attack KOs the user.",
		shortDesc: "If an opponent knocks out the user, it also faints.",
		id: "destinybond",
		name: "Destiny Bond",
		pp: 5,
		isViable: true,
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
		desc: "Almost always goes first. The user is protected from all attacks for one turn, but the move's success rate halves with each consecutive use of Protect, Detect or Endure. If a Pokemon has No Guard, or used Lock-On or Mind Reader against the user during the previous turn, its attack has a [100 Varmove's normal accuracy]% chance to hit through Detect; OHKO moves do not benefit from this effect. Blizzard has a 30% to hit through this move during Hail, as does Thunder during Rain Dance.",
		shortDesc: "Prevents moves from affecting the user for a turn.",
		id: "detect",
		name: "Detect",
		pp: 5,
		isViable: true,
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
		desc: "On the first turn, the user digs underground, becoming uncontrollable, and evades all attacks. Earthquake and Magnitude can hit underground and gain doubled power. The user may also be hit underground if it was previously targeted by Lock-On or Mind Reader or if it is attacked by a Pokemon with No Guard. On the second turn, the user attacks.",
		shortDesc: "Digs underground turn 1, strikes turn 2.",
		id: "dig",
		name: "Dig",
		pp: 10,
		isContact: true,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('dig')) return;
			pokemon.addVolatile('dig');
			this.add('-prepare',pokemon,'Dig',target);
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('dig');
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
		desc: "The target cannot choose its last move for 4-7 turns. Disable only works on one move at a time and fails if the target has not yet used a move or if its move has run out of PP. The target does nothing if it is about to use a move that becomes disabled.",
		shortDesc: "For 4 turns, disables the target's last move used.",
		id: "disable",
		name: "Disable",
		pp: 20,
		isBounceable: true,
		priority: 0,
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
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze adjacent Pokemon.",
		id: "discharge",
		name: "Discharge",
		pp: 15,
		isViable: true,
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
		desc: "On the first turn, the user dives underwater, becoming uncontrollable, and evades all attacks except for Surf and Whirlpool, which have doubled power; the user may also be hit underwater if it was previously targeted by Lock-On or Mind Reader or if it is attacked by a Pokemon with No Guard. On the second turn, the user attacks.",
		shortDesc: "Dives underwater turn 1, strikes turn 2.",
		id: "dive",
		name: "Dive",
		pp: 10,
		isContact: true,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('dive')) return;
			pokemon.addVolatile('dive');
			this.add('-prepare', pokemon, 'Dive', target);
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('dive');
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
		desc: "Has a 20% chance to confuse the target.",
		shortDesc: "20% chance to confuse the target.",
		id: "dizzypunch",
		name: "Dizzy Punch",
		pp: 10,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
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
		desc: "This move, even if the user and/or the target switch out, will strike the active target at the end of the second turn after its use.	Only one instance of Doom Desire or Future Sight may be active at a time.",
		shortDesc: "Hits two turns after being used.",
		id: "doomdesire",
		name: "Doom Desire",
		pp: 5,
		isViable: true,
		priority: 0,
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
		desc: "The user receives 1/3 recoil damage.",
		shortDesc: "Has 1/3 recoil.",
		id: "doubleedge",
		name: "Double-Edge",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Strikes twice; if the first hit breaks the target's Substitute, the real Pokemon will take damage from the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		id: "doublehit",
		name: "Double Hit",
		pp: 10,
		isContact: true,
		priority: 0,
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
		desc: "Strikes twice; if the first hit breaks the target's Substitute, the real Pokemon will take damage from the second hit.",
		shortDesc: "Hits 2 times in one turn.",
		id: "doublekick",
		name: "Double Kick",
		pp: 30,
		isContact: true,
		priority: 0,
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
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "doubleslap",
		name: "DoubleSlap",
		pp: 10,
		isContact: true,
		priority: 0,
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
		desc: "Lowers the user's Special Attack by 2 stages after use.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "dracometeor",
		name: "Draco Meteor",
		pp: 5,
		isViable: true,
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
		desc: "Has a 30% chance to paralyze the target.",
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "dragonclaw",
		name: "Dragon Claw",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"dragondance": {
		num: 349,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Speed by 1 stage each.",
		shortDesc: "Boosts the user's Attack and Speed by 1.",
		id: "dragondance",
		name: "Dragon Dance",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "dragonpulse",
		name: "Dragon Pulse",
		pp: 10,
		isViable: true,
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
		desc: "Always deals 40 points of damage.",
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
		desc: "Has a 20% chance to make the target flinch.",
		shortDesc: "20% chance to flinch the target.",
		id: "dragonrush",
		name: "Dragon Rush",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Forces the target to switch to a random Pokemon. Fails if target is behind a Substitute.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "dragontail",
		name: "Dragon Tail",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: -6,
		forceSwitch: true,
		target: "normal",
		type: "Dragon"
	},
	"drainpunch": {
		num: 409,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "drainpunch",
		name: "Drain Punch",
		pp: 10,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
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
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target but only works on a sleeping target.",
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "drillpeck",
		name: "Drill Peck",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"drillrun": {
		num: 529,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "Has an increased chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "drillrun",
		name: "Drill Run",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Hits twice in one turn.",
		shortDesc: "Hits 2 times in one turn.",
		id: "dualchop",
		name: "Dual Chop",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Confuses the target.",
		shortDesc: "100% chance to confuse the target.",
		id: "dynamicpunch",
		name: "DynamicPunch",
		pp: 5,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
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
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def. by 1.",
		id: "earthpower",
		name: "Earth Power",
		pp: 10,
		isViable: true,
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
		desc: "Power doubles when performed against Pokemon using Dig.",
		shortDesc: "Hits adjacent Pokemon. Power doubles on Dig.",
		id: "earthquake",
		name: "Earthquake",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "adjacent",
		type: "Ground"
	},
	"echoedvoice": {
		num: 497,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Echo Voice deals damage, and the base power is increased when used consecutively. The base power increases by 40 with each use but reaches a maximum power at 200. In Double and Triple battles, the power increases if used consecutively by the user's teammates.",
		shortDesc: "Power increases when used consecutively.",
		id: "echoedvoice",
		name: "Echoed Voice",
		pp: 15,
		isSoundBased: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"eggbomb": {
		num: 121,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "eggbomb",
		name: "Egg Bomb",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"electroball": {
		num: 486,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var targetSpeed = target.stats.spe;
			var pokemonSpeed = pokemon.stats.spe;
			if (pokemonSpeed > targetSpeed * 4) {
				return 150;
			}
			if (pokemonSpeed > targetSpeed * 3) {
				return 120;
			}
			if (pokemonSpeed > targetSpeed * 2) {
				return 80;
			}
			return 60;
		},
		category: "Special",
		desc: "Inflicts more damage the faster the user is than target.",
		shortDesc: "More power the faster the user is than the target.",
		id: "electroball",
		name: "Electro Ball",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"electroweb": {
		num: 527,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Lowers the target's Speed by one level.",
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
		target: "normal",
		type: "Electric"
	},
	"embargo": {
		num: 373,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from using its held item for five turns. During in-game battles, trainers also cannot use any items from their bag on a Pokemon under the effects of Embargo.",
		shortDesc: "For 5 turns, the target can't use any items.",
		id: "embargo",
		name: "Embargo",
		pp: 15,
		isBounceable: true,
		priority: 0,
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
		desc: "Has a 10% chance to burn the target.",
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
		desc: "The target is forced to use its last attack for the next 3 turns. The effects of this move will end immediately if the target runs out of PP for the repeated attack. In double battles, a Pokemon who has received an Encore will target a random opponent with single-target attacks.",
		shortDesc: "The target repeats its last move for 3 turns.",
		id: "encore",
		name: "Encore",
		pp: 5,
		isViable: true,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'encore',
		effect: {
			duration: 3,
			onStart: function(target) {
				var noEncore = {encore:1,mimic:1,mirrormove:1,sketch:1,transform:1};
				var moveIndex = target.moves.indexOf(target.lastMove);
				if (!target.lastMove || noEncore[target.lastMove] || (target.moveset[moveIndex] && target.moveset[moveIndex].pp <= 0)) {
					// it failed
					this.add('-fail',target);
					delete target.volatiles['encore'];
					return;
				}
				this.effectData.move = target.lastMove;
				this.add('-start', target, 'Encore');
				if (this.willMove(target)) {
					this.changeDecision(target, {move:this.effectData.move});
				} else {
					this.effectData.duration++;
				}
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
			},
			onBeforeTurn: function(pokemon) {
				if (!this.effectData.move) {
					// ???
					return;
				}
				var decision = this.willMove(pokemon);
				if (decision) {
					this.changeDecision(pokemon, {move:this.effectData.move});
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
		basePower: false,
		damageCallback: function(pokemon,target) {
			if (target.hp > pokemon.hp) {
				return target.hp - pokemon.hp;
			}
			return false;
		},
		category: "Physical",
		desc: "Inflicts damage equal to the target's current HP - the user's current HP.",
		shortDesc: "Lowers the target's HP to the user's HP.",
		id: "endeavor",
		name: "Endeavor",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"endure": {
		num: 203,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes first. The user is left with at least 1 HP following any attacks for one turn, but the move's success rate halves with each consecutive use of Protect, Detect or Endure.",
		shortDesc: "The user survives the next hit with at least 1 HP.",
		id: "endure",
		name: "Endure",
		pp: 10,
		priority: 4,
		stallingMove: true, // decrease success of repeated use to 50%
		volatileStatus: 'endure',
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
		basePower: 80,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def. by 1.",
		id: "energyball",
		name: "Energy Ball",
		pp: 10,
		isViable: true,
		priority: 0,
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
		basePower: false,
		category: "Status",
		desc: "Copies the user's ability onto the target.",
		shortDesc: "The target's Ability changes to match the user's.",
		id: "entrainment",
		name: "Entrainment",
		pp: 15,
		isBounceable: true,
		priority: 0,
		onTryHit: function(target, source) {
			if (target === source) return false;
			var disallowedAbilities = {trace:1, forecast:1, multitype:1, flowergift:1, illusion:1, imposter:1, zenmode:1, wonderguard:1};
			if (target.ability === 'multitype' || target.ability === 'truant' || target.ability === source.ability || disallowedAbilities[source.ability]) return false;
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
		basePower: false,
		basePowerCallback: function(pokemon) {
			return parseInt(150*pokemon.hp/pokemon.maxhp);
		},
		category: "Special",
		desc: "Base power decreases as the user's HP decreases.",
		shortDesc: "Less power as user's HP decreases. Hits foe(s).",
		id: "eruption",
		name: "Eruption",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "foes",
		type: "Fire"
	},
	"explosion": {
		num: 153,
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		desc: "Causes the user to faint.",
		shortDesc: "Hits adjacent Pokemon. The user faints.",
		id: "explosion",
		name: "Explosion",
		pp: 5,
		priority: 0,
		selfdestruct: true,
		secondary: false,
		target: "adjacent",
		type: "Normal"
	},
	"extrasensory": {
		num: 326,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 10% chance to make the target flinch.",
		shortDesc: "10% chance to flinch the target.",
		id: "extrasensory",
		name: "Extrasensory",
		pp: 30,
		isViable: true,
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
		desc: "Usually goes first.",
		shortDesc: "Nearly always goes first.",
		id: "extremespeed",
		name: "ExtremeSpeed",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 2,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"facade": {
		num: 263,
		accuracy: 100,
		basePower: 70,
		basePowerCallback: function(pokemon) {
			if (pokemon.status) {
				return 140;
			}
			return 70;
		},
		category: "Physical",
		desc: "Power doubles if the user is inflicted with a status effect (burn, paralysis poison, or sleep).",
		shortDesc: "Power doubles when user is inflicted by a status.",
		id: "facade",
		name: "Facade",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"faintattack": {
		num: 185,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		shortDesc: "Ignores Accuracy and Evasion modifiers.",
		id: "faintattack",
		name: "Faint Attack",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"fakeout": {
		num: 252,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "If this is the user's first move after being sent or switched into battle, the target flinches; this move fails otherwise and against targets with Inner Focus.",
		shortDesc: "Hits first. First turn out only. The target flinches.",
		id: "fakeout",
		name: "Fake Out",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 3,
		onTryHit: function(target, pokemon) {
			if (pokemon.activeTurns > 1) {
				this.debug('It\'s not your first turn out.');
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
		desc: "Lowers the target's Special Defense by 2 stages.",
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
		desc: "Leaves the target with at least 1 HP.",
		shortDesc: "Always leaves the target with at least 1 HP.",
		id: "falseswipe",
		name: "False Swipe",
		pp: 40,
		isContact: true,
		noFaint: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"featherdance": {
		num: 297,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 2 stages.",
		shortDesc: "Lowers the target's Attack by 2.",
		id: "featherdance",
		name: "FeatherDance",
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
		desc: "Breaks through Protect, Detect, Quick Guard, and Wide Guard.",
		shortDesc: "Nullifies Detect, Protect, and Quick/Wide Guard.",
		id: "feint",
		name: "Feint",
		pp: 10,
		priority: 2,
		onHit: function(target, source) {
			if (target.removeVolatile('protect')) {
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
	"fierydance": {
		num: 552,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 50% chance to raise the user's Special Attack by one level.",
		shortDesc: "50% chance to boost the user's Sp. Atk by 1.",
		id: "fierydance",
		name: "Fiery Dance",
		pp: 10,
		isViable: true,
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
		basePower: false,
		damageCallback: function(pokemon) {
			return pokemon.hp;
		},
		category: "Special",
		desc: "Inflicts damage equal to the user's remaining HP. User faints.",
		shortDesc: "Does damage equal to the user's HP. User faints.",
		id: "finalgambit",
		name: "Final Gambit",
		pp: 5,
		isContact: true,
		priority: 0,
		selfdestruct: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"fireblast": {
		num: 126,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the target.",
		id: "fireblast",
		name: "Fire Blast",
		pp: 5,
		isViable: true,
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
		desc: "Has a 10% chance to burn the target. Has a 10% chance to make the target flinch. Both effects can occur from a single use.",
		shortDesc: "10% chance to burn. 10% chance to flinch.",
		id: "firefang",
		name: "Fire Fang",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		basePower: 50,
		category: "Special",
		desc: "If it is followed on the same turn by Grass Oath, it will cause all foes to take damage at the end of every turn for four turns. If it follows Water Oath on the same turn, it will double the probability of secondary effects taking place for four turns. This effect does not stack with Serene Grace.",
		shortDesc: "Use with Grass or Water Pledge for added effect.",
		id: "firepledge",
		name: "Fire Pledge",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"firepunch": {
		num: 7,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the target.",
		id: "firepunch",
		name: "Fire Punch",
		pp: 15,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
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
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or it uses U-Turn.",
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
		basePower: false,
		category: "Physical",
		desc: "The target faints; doesn't work on higher-leveled Pokemon.",
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
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var hpPercent = pokemon.hpPercent(pokemon.hp);
			if (hpPercent <= 5) {
				return 200;
			}
			if (hpPercent <= 10) {
				return 150;
			}
			if (hpPercent <= 20) {
				return 100;
			}
			if (hpPercent <= 35) {
				return 80;
			}
			if (hpPercent <= 70) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Base power increases as the user's HP decreases.",
		shortDesc: "More power the less HP the user has left.",
		id: "flail",
		name: "Flail",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"flameburst": {
		num: 481,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Deals 1/8 damage to pokemon next to the target.",
		shortDesc: "Damages Pokemon next to the target as well.",
		id: "flameburst",
		name: "Flame Burst",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"flamecharge": {
		num: 488,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Inflicts regular damage. Raises the user's Speed by one stage.",
		shortDesc: "100% chance to boost the user's Speed by 1.",
		id: "flamecharge",
		name: "Flame Charge",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 10% chance to burn the target; can be used while frozen, which both attacks the target normally and thaws the user.",
		shortDesc: "10% chance to burn the target. Thaws user.",
		id: "flamewheel",
		name: "Flame Wheel",
		pp: 25,
		isContact: true,
		thawsUser: true,
		priority: 0,
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
		basePower: 95,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the target.",
		id: "flamethrower",
		name: "Flamethrower",
		pp: 15,
		isViable: true,
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
		desc: "The user receives 1/3 recoil damage; has a 10% chance to burn the target.",
		shortDesc: "Has 1/3 recoil. 10% chance to burn. Thaws user.",
		id: "flareblitz",
		name: "Flare Blitz",
		pp: 15,
		isViable: true,
		isContact: true,
		thawsUser: true,
		priority: 0,
		recoil: [1,3],
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
		desc: "Lowers the target's Accuracy by 1 stage.",
		shortDesc: "Lowers the target's Accuracy by 1.",
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
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "flashcannon",
		name: "Flash Cannon",
		pp: 10,
		isViable: true,
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
		desc: "Confuses the target and raises its Special Attack by 1 stage.",
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
		basePower: false,
		category: "Physical",
		desc: "The user's held item is thrown at the target. Base power and additional effects vary depending on the thrown item. Note that the target will instantly benefit from the effects of thrown berries. The held item is gone for the rest of the battle unless Recycle is used; the item will return to the original holder after wireless battles but will be permanently lost if it is thrown during in-game battles.",
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
				if (item.isBerry) {
					move.onHit = function(foe) {
						this.singleEvent('Eat', item, null, foe, null, null);
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
	"fly": {
		num: 19,
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		desc: "On the first turn, the user flies into the air, becoming uncontrollable, and evades most attacks. Gust, Twister, Thunder and Sky Uppercut have normal accuracy against a mid-air Pokemon, with Gust and Twister also gaining doubled power. The user may also be hit in mid-air if it was previously targeted by Lock-On or Mind Reader or if it is attacked by a Pokemon with No Guard. On the second turn, the user attacks.",
		shortDesc: "Flies up on first turn, then strikes the next turn.",
		id: "fly",
		name: "Fly",
		pp: 15,
		isContact: true,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('fly')) return;
			pokemon.addVolatile('fly');
			this.add('-prepare',pokemon,'Fly',target);
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('fly');
			},
			onSourceModifyMove: function(move) {

				if (move.target === 'foeSide') return;
				// warning: does not work the same way as Bounce
				if (move.id === 'gust' || move.id === 'twister') {
					// should not normally be done in MovifyMove event,
					// but Gust and Twister have static base power, and
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
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"focusblast": {
		num: 411,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "focusblast",
		name: "Focus Blast",
		pp: 5,
		isViable: true,
		priority: 0,
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
		desc: "Raises the user's chance for a Critical Hit by two domains.",
		shortDesc: "Boosts the user's critical hit ratio by 2.",
		id: "focusenergy",
		name: "Focus Energy",
		pp: 30,
		priority: 0,
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
		desc: "At the beginning of the round, the user tightens its focus; the attack itself usually goes last and will fail if the user is attacked by any other Pokemon during the turn.",
		shortDesc: "Fails if the user takes damage before it hits.",
		id: "focuspunch",
		name: "Focus Punch",
		pp: 20,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: -3,
		beforeTurnCallback: function(pokemon) {
			pokemon.addVolatile('focuspunch');
		},
		beforeMoveCallback: function(pokemon) {
			if (!pokemon.removeVolatile('focuspunch')) {
				return false;
			}
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.damage && pokemon.lastAttackedBy.thisTurn) {
				this.add('cant', pokemon, 'flinch', 'Focus Punch');
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
		desc: "Almost always goes first. For the rest of the turn, all attacks from the opponent's team that target the user's team are redirected toward the user. In double battles, the user's teammate will not be protected from attacks that have more than one intended target.",
		shortDesc: "The foes' moves target the user on the turn used.",
		id: "followme",
		name: "Follow Me",
		pp: 20,
		priority: 3,
		secondary: false,
		target: "normal",
		type: "Normal"
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
		isContact: true,
		priority: 0,
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
		desc: "Until the target faints or switches, if the target has positive Evasion boosts, they are ignored. Ghost-type targets also lose their immunities against Normal-type and Fighting-type moves.",
		shortDesc: "Blocks Evasion mods. Fighting, Normal hit Ghost.",
		id: "foresight",
		name: "Foresight",
		pp: 40,
		isBounceable: true,
		priority: 0,
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
	"foulplay": {
		num: 492,
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		desc: "It uses the target's Attack stat to calculate damage.",
		shortDesc: "Uses target's Attack stat in damage calculation.",
		id: "foulplay",
		name: "Foul Play",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"freezeshock": {
		num: 553,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "Charges for a turn before attacking. Has a 30% chance to paralyze the target.",
		shortDesc: "Charges turn 1. Hits turn 2. 30% paralyze.",
		id: "freezeshock",
		name: "Freeze Shock",
		pp: 5,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('freezeshock')) return;
			this.add('-prepare', pokemon, 'Freeze Shock', target);
			pokemon.addVolatile('freezeshock');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('freezeshock');
			}
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
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
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
		basePower: 40,
		category: "Special",
		desc: "Always results in a critical hit.",
		shortDesc: "Always results in a critical hit.",
		id: "frostbreath",
		name: "Frost Breath",
		pp: 10,
		isViable: true,
		priority: 0,
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"frustration": {
		num: 218,
		accuracy: 100,
		basePower: false,
		category: "Physical",
		desc: "Power increases as user's happiness decreases; maximum 102 BP.",
		shortDesc: "Max 102 power at minimum Happiness.",
		id: "frustration",
		name: "Frustration",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"furyattack": {
		num: 31,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "furyattack",
		name: "Fury Attack",
		pp: 20,
		isContact: true,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"furycutter": {
		num: 210,
		accuracy: 95,
		basePower: 20,
		basePowerCallback: function(pokemon) {
			if (!pokemon.volatiles.furycutter) {
				pokemon.addVolatile('furycutter');
			}
			return 20 * pokemon.volatiles.furycutter.multiplier;
		},
		category: "Physical",
		desc: "The base power of this move doubles with each consecutive hit; however, power is capped at a maximum 160 BP and remains there for any subsequent uses. If this move misses, base power will be reset to 10 BP on the next turn. The user can also select other attacks without resetting this move's power; it will continue to double after each use until it either misses or reaches the 160 BP cap.",
		shortDesc: "Power doubles with each hit, up to 160.",
		id: "furycutter",
		name: "Fury Cutter",
		pp: 20,
		isContact: true,
		priority: 0,
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
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "furyswipes",
		name: "Fury Swipes",
		pp: 15,
		isContact: true,
		priority: 0,
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
		desc: "If the target knows Cross Flame, it will automatically use that move on the Cross Thunder user, which will increase the base power of Cross Thunder. However, the user will then be incapable of using any other move besides Cross Thunder, unless the user is switched out, the target is unable to use Cross Flame, or one of the two battlers faint.",
		shortDesc: "Power doubles if used after Fusion Flare.",
		id: "fusionbolt",
		name: "Fusion Bolt",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"fusionflare": {
		num: 558,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "If the target knows Cross Thunder, it will automatically use that move on the Cross Flame user, which will increase the base power of Cross Flame. However, the user will then be incapable of using any other move besides Cross Flame, unless the user is switched out, the target is unable to use Cross Thunder, or one of the two battlers faint.",
		shortDesc: "Power doubles if used after Fusion Bolt.",
		id: "fusionflare",
		name: "Fusion Flare",
		pp: 5,
		isViable: true,
		thawsUser: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"futuresight": {
		num: 248,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "This move, even if the user and/or the target switch out, will strike the active target at the end of the second turn after its use. Only one instance of Future Sight or Doom Desire may be active at a time.",
		shortDesc: "Hits two turns after being used.",
		id: "futuresight",
		name: "Future Sight",
		pp: 10,
		priority: 0,
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
					basePower: 100,
					category: "Special",
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
		desc: "Negates the target's ability as long as it remains in battle.",
		shortDesc: "Nullifies the target's Ability",
		id: "gastroacid",
		name: "Gastro Acid",
		pp: 10,
		isBounceable: true,
		priority: 0,
		onTryHit: function(pokemon) {
			if (pokemon.ability === 'multitype') {
				return false;
			}
		},
		onHit: function(pokemon) {
			if (pokemon.setAbility('')) {
				this.add('-endability', pokemon, pokemon.ability);
				return;
			}
			return false;
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
		desc: "Hits twice in one turn.",
		shortDesc: "Hits 2 times in one turn.",
		id: "geargrind",
		name: "Gear Grind",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		multihit: [2,2],
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"gigadrain": {
		num: 202,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "gigadrain",
		name: "Giga Drain",
		pp: 10,
		isViable: true,
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
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
		shortDesc: "User cannot move next turn.",
		id: "gigaimpact",
		name: "Giga Impact",
		pp: 5,
		isContact: true,
		priority: 0,
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
		desc: "Glaciate inflicts damage and lowers the target's Speed stat by one stage. Glaciate hits all opponents in double battles and all adjacent opponents in triple battles.",
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
		target: "normal",
		type: "Ice"
	},
	"glare": {
		num: 137,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes the target.",
		shortDesc: "Paralyzes the target.",
		id: "glare",
		name: "Glare",
		pp: 30,
		isViable: true,
		priority: 0,
		status: 'par',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"grassknot": {
		num: 447,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			if (target.weightkg > 200) {
				this.debug('120 bp');
				return 120;
			}
			if (target.weightkg > 100) {
				this.debug('100 bp');
				return 100;
			}
			if (target.weightkg > 50) {
				this.debug('80 bp');
				return 80;
			}
			if (target.weightkg > 25) {
				this.debug('60 bp');
				return 60;
			}
			if (target.weightkg > 10) {
				this.debug('40 bp');
				return 40;
			}
				this.debug('20 bp');
			return 20;
		},
		category: "Special",
		desc: "Base power increases as the target's weight increases.",
		shortDesc: "More power the heavier the target.",
		id: "grassknot",
		name: "Grass Knot",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"grasspledge": {
		num: 520,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "If it is followed on the same turn by Water Oath, it will decrease the speed of all foes by half for four turns. If it follows Fire Oath on the same turn, it will cause all foes to take damage at the end of every turn for four turns.",
		shortDesc: "Use with Fire or Water Pledge for added effect.",
		id: "grasspledge",
		name: "Grass Pledge",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"grasswhistle": {
		num: 320,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		shortDesc: "Puts the target to sleep.",
		id: "grasswhistle",
		name: "GrassWhistle",
		pp: 15,
		isSoundBased: true,
		priority: 0,
		status: 'slp',
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"gravity": {
		num: 356,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The immunities provided by Magnet Rise, Levitate and the Flying-type are negated for all active Pokemon for five turns; these Pokemon will be affected by Ground-type moves, Arena Trap, Spikes and Toxic Spikes. Pokemon in the middle of using Bounce or Fly when Gravity is activated will immediately return to the ground, and Bounce, Fly, Hi Jump Kick, Jump Kick and Splash cannot be used until Gravity wears off.",
		shortDesc: "For 5 turns, negates all Ground immunities.",
		id: "gravity",
		name: "Gravity",
		pp: 5,
		isViable: true,
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
			onModifyPokemon: function(pokemon) {
				pokemon.negateImmunity['Ground'] = true;
				pokemon.boosts.evasion -= 2;
				var disabledMoves = {bounce:1, fly:1, hijumpkick:1, jumpkick:1, magnetrise:1, skydrop:1, splash:1, telekinesis:1};
				for (var m in disabledMoves) {
					pokemon.disabledMoves[m] = true;
				}
				if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly') || pokemon.removeVolatile('skydrop')) {
					this.add("-message", pokemon.name+" couldn't stay airborne because of gravity! (placeholder)");
				}
			},
			onResidualOrder: 22,
			onEnd: function() {
				this.add('-message', 'Gravity returned to normal! (placeholder)');
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
		desc: "Lowers the target's Attack by 1 stage.",
		shortDesc: "Lowers the foe(s) Attack by 1.",
		id: "growl",
		name: "Growl",
		pp: 40,
		isSoundBased: true,
		priority: 0,
		boosts: {
			atk: -1
		},
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"growth": {
		num: 74,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Special Attack by 1 stage. If the weather is Sun, Growth raises Attack and SpAttk two stages each. ",
		shortDesc: "Boosts the user's Attack and Sp. Atk by 1.",
		id: "growth",
		name: "Growth",
		pp: 40,
		isViable: true,
		priority: 0,
		onModifyMove: function(move) {
			if (this.weather === 'sunnyday') move.boosts = {atk: 2, spa: 2};
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
		desc: "The target's next move is set to 0 PP if it directly KOs the user.",
		shortDesc: "If the user faints, the attack used loses all its PP.",
		id: "grudge",
		name: "Grudge",
		pp: 5,
		priority: 0,
		volatileStatus: 'grudge',
		effect: {
			onStart: function(pokemon) {
				this.add('-singleturn', pokemon, 'move: Grudge');
			},
			onFaint: function(target, source, effect) {
				this.debug('Grudge detected fainted pokemon');
				if (!source || !effect) return;
				if (effect.effectType === 'Move' && target.lastMove === 'grudge') {
					for (var i in source.moveset) {
						if (source.moveset[i].id === source.lastMove) {
							source.moveset[i].pp = 0;
							this.add('-activate', source, 'move: Grudge');
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
		basePower: false,
		category: "Status",
		desc: "Averages Defense and Special Defense with the target.",
		shortDesc: "Averages Defense and Sp. Def stats with target.",
		id: "guardsplit",
		name: "Guard Split",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"guardswap": {
		num: 385,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps Defense and Special Defense modifiers with its target.",
		shortDesc: "Swaps Defense and Sp. Def changes with target.",
		id: "guardswap",
		name: "Guard Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			var sourceBoosts = {};

			for (var i in {def:1,spd:1}) {
				targetBoosts[i] = target.baseBoosts[i];
				sourceBoosts[i] = source.baseBoosts[i];
			}

			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);

			this.add('-swapboost', target, source, 'def, spd', '[from] move: Guard Swap');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"guillotine": {
		num: 12,
		accuracy: 30,
		basePower: false,
		category: "Physical",
		desc: "The target faints; doesn't work on higher-leveled Pokemon.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "guillotine",
		name: "Guillotine",
		pp: 5,
		isContact: true,
		priority: 0,
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"gunkshot": {
		num: 441,
		accuracy: 70,
		basePower: 120,
		category: "Physical",
		desc: "Has a 30% chance to poison the target.",
		shortDesc: "30% chance to poison the target.",
		id: "gunkshot",
		name: "Gunk Shot",
		pp: 5,
		isViable: true,
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
		desc: "Power doubles if the target is in mid-air via Fly or Bounce.",
		shortDesc: "Power doubles during Fly, Bounce, and Sky Drop.",
		id: "gust",
		name: "Gust",
		pp: 35,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"gyroball": {
		num: 360,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var targetSpeed = target.stats.spe;
			var pokemonSpeed = pokemon.stats.spe;
			var power = (Math.floor(25 * targetSpeed / pokemonSpeed) || 1);
			if (power > 150) power = 150;
			this.debug(''+power+' bp');
			return power;
		},
		category: "Physical",
		desc: "Power is determined from the speeds of the user and the target; stat modifiers are taken into account. Max power, 150 BP, is achieved when the user is much slower than the target.",
		shortDesc: "More power the slower the user than the target.",
		id: "gyroball",
		name: "Gyro Ball",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"hail": {
		num: 258,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Cancels all other weather moves. For 5 turns: Blizzard never misses and has a 30% chance to hit through Protect and Detect, each active Pokemon, even when protected by a Substitute, loses 1/16 of its max HP unless it is an Ice-type, the power of Solarbeam is halved, and the healing power of Morning Sun, Synthesis and Moonlight is halved. The effects of Hail will last for eight turns if its user is holding Icy Rock.",
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
		desc: "Lowers the user's Speed by 1 stage.",
		shortDesc: "Lowers the user's Speed by 1.",
		id: "hammerarm",
		name: "Hammer Arm",
		pp: 10,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
		self: {
			boosts: {
				spe: -1
			}
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
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
		desc: "Eliminates any stat modifiers from all active Pokemon. The stat boosts from Choice Band, Choice Lens and Choice Scarf are not affected.",
		shortDesc: "Eliminates all stat changes.",
		id: "haze",
		name: "Haze",
		pp: 30,
		isViable: true,
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
		desc: "User receives 1/4 the damage it inflicts in recoil.",
		shortDesc: "Has 1/4 recoil.",
		id: "headcharge",
		name: "Head Charge",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "The user receives 1/2 recoil damage.",
		shortDesc: "Has 1/2 recoil.",
		id: "headsmash",
		name: "Head Smash",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch the target.",
		id: "headbutt",
		name: "Headbutt",
		pp: 15,
		isContact: true,
		priority: 0,
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
		desc: "Every Pokemon in the user's party is cured of status conditions. Allied Pokemon who have Soundproof are not affected.",
		shortDesc: "Cures the user's party of all status conditions.",
		id: "healbell",
		name: "Heal Bell",
		pp: 5,
		isViable: true,
		isSoundBased: true, // though it isn't affected by Soundproof
		priority: 0,
		onHitSide: function(side, source) {
			for (var i=0; i<side.pokemon.length; i++) {
				side.pokemon[i].status = '';
			}
			this.add('-cureteam', source, '[from] move: HealBell');
		},
		secondary: false,
		target: "allySide",
		type: "Normal"
	},
	"healblock": {
		num: 377,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For five turns, or until switching out, the target(s) will not be healed by Absorb, Aqua Ring, Drain Punch, Dream Eater, Giga Drain, Heal Order, Ingrain, Leech Life, Leech Seed, Mega Drain, Milk Drink, Moonlight, Morning Sun, Recover, Rest, Roost, Slack Off, Softboiled, Swallow, Synthesis or Wish, but any additional effects from these moves, such as damaging another target, will still occur. Healing caused from held items or Pain Split will not be prevented.",
		shortDesc: "For 5 turns, the foe(s) is prevented from healing.",
		id: "healblock",
		name: "Heal Block",
		pp: 15,
		isBounceable: true,
		priority: 0,
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
			onResidualOrder: 17,
			onEnd: function(pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal: false
		},
		secondary: false,
		target: "foes",
		type: "Psychic"
	},
	"healorder": {
		num: 456,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores 1/2 of the user's max HP.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "healorder",
		name: "Heal Order",
		pp: 10,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Bug"
	},
	"healpulse": {
		num: 505,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Restores half the target's max HP.",
		shortDesc: "Heals the target by 50% of its max HP.",
		id: "healpulse",
		name: "Heal Pulse",
		pp: 10,
		isBounceable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"healingwish": {
		num: 361,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user sacrifices itself so that its replacement will be cured of status conditions and have its HP fully restored upon entering the field. This move fails if the user is the only non-fainted Pokemon on its team.",
		shortDesc: "User faints. Replacement is fully healed.",
		id: "healingwish",
		name: "Healing Wish",
		pp: 10,
		isViable: true,
		priority: 0,
		onTryHit: function(pokemon) {
			if (pokemon.side.pokemonLeft <= 1) return false;
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
					this.add('-heal',target,target.getHealth(),'[from] move: Healing Wish');
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
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch the target.",
		id: "heartstamp",
		name: "Heart Stamp",
		pp: 25,
		isContact: true,
		priority: 0,
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
		desc: "The user swaps stat modifiers with the target.",
		shortDesc: "Swaps all stat changes with target.",
		id: "heartswap",
		name: "Heart Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			var sourceBoosts = {};

			for (var i in target.baseBoosts) {
				targetBoosts[i] = target.baseBoosts[i];
				sourceBoosts[i] = source.baseBoosts[i];
			}

			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);

			this.add('-swapboost', target, source, '[from] move: Heart Swap');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"heatcrash": {
		num: 535,
		accuracy: 100,
		basePower: false,
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
		desc: "Deals varying damage depending on the weight of both the user and the target. The heavier the user is in comparison to its target, the more damage will be inflicted. The base power varies as follows: 120 base power, if the target's weight is less than or equal to 1/5 (20%) of the user's weight. 100 base power, if the target's weight is greater than 1/5 (20%) of the user's weight and less than or equal to 1/4 (25%) of user's weight. 80 base power, if the target's weight is greater than 1/4 (25%) of the user's weight and less than or equal to 1/2 (50%) of user's weight. 60 base power, if the target's weight is greater than 1/3 (33.3%) of the user's weight and less than or equal to 1/2 of user's weight (50%). 40 base power, if the target's weight is greater than 1/2 (50%) of the user's weight.",
		shortDesc: "More power the heavier the user than the target.",
		id: "heatcrash",
		name: "Heat Crash",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"heatwave": {
		num: 257,
		accuracy: 90,
		basePower: 100,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		shortDesc: "10% chance to burn the foe(s).",
		id: "heatwave",
		name: "Heat Wave",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "foes",
		type: "Fire"
	},
	"heavyslam": {
		num: 484,
		accuracy: 100,
		basePower: false,
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
		desc: "Heavy Bomber deals varying damage depending on the weight of both the user and the target. The heavier the user is in comparison to its target, the more damage will be inflicted. The base power varies as follows: 120 base power, if the target's weight is less than or equal to 1/5 (20%) of the user's weight. 100 base power, if the target's weight is greater than 1/5 (20%) of the user's weight and less than or equal to 1/4 (25%) of user's weight. 80 base power, if the target's weight is greater than 1/4 (25%) of the user's weight and less than or equal to 1/2 (50%) of user's weight. 60 base power, if the target's weight is greater than 1/3 (33.3%) of the user's weight and less than or equal to 1/2 of user's weight (50%). 40 base power, if the target's weight is greater than 1/2 (50%) of the user's weight.",
		shortDesc: "More power the heavier the user than the target.",
		id: "heavyslam",
		name: "Heavy Slam",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"helpinghand": {
		num: 270,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Always goes first. In double battles, the power of the user's partner's attacks is increased by 1.5x for that turn; does nothing in single battles.",
		shortDesc: "Increases the power of an ally's move by 50%.",
		id: "helpinghand",
		name: "Helping Hand",
		pp: 20,
		priority: 5,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"hex": {
		num: 506,
		accuracy: 100,
		basePower: 50,
		basePowerCallback: function(pokemon, target) {
			if (target.status) return 100;
			return 50;
		},
		category: "Special",
		desc: "Inflicts more damage if the target has a major status ailment.",
		shortDesc: "Power doubles if the target has a status ailment.",
		id: "hex",
		name: "Hex",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"hijumpkick": {
		num: 136,
		accuracy: 90,
		basePower: 130,
		category: "Physical",
		desc: "If this attack misses the target, the user half of its max health in recoil damage.",
		shortDesc: "User is hurt by 50% of its max HP if it misses.",
		id: "hijumpkick",
		name: "Hi Jump Kick",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		onMoveFail: function(target, source, move) {
			//var damage = this.getDamage(source, target, move, true);
			//this.damage(damage/2, source);
			this.damage(source.maxhp/2, source);
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"hiddenpower": {
		num: 237,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			return pokemon.hpPower || 70;
		},
		category: "Special",
		desc: "Varies in power and type depending on the user's IVs; maximum 70 BP.",
		shortDesc: "Varies in power and type based on the user's IVs.",
		id: "hiddenpower",
		name: "Hidden Power",
		pp: 15,
		isViable: true,
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
		basePower: 70,
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
		basePower: 70,
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
		basePower: 70,
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
		basePower: 70,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Electric",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"hiddenpowerfighting": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Fighting",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"hiddenpowerfire": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Fire",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"hiddenpowerflying": {
		accuracy: 100,
		basePower: 70,
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
		basePower: 70,
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
		basePower: 70,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Grass",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"hiddenpowerground": {
		accuracy: 100,
		basePower: 70,
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
		basePower: 70,
		category: "Special",
		desc: "",
		shortDesc: "",
		id: "hiddenpower",
		name: "Hidden Power Ice",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"hiddenpowerpoison": {
		accuracy: 100,
		basePower: 70,
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
		basePower: 70,
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
		basePower: 70,
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
		basePower: 70,
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
		basePower: 70,
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
	"honeclaws": {
		num: 468,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Attack and Accuracy by one stage.",
		shortDesc: "Boosts the user's Attack and Accuracy by 1.",
		id: "honeclaws",
		name: "Hone Claws",
		pp: 15,
		isViable: true,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "hornattack",
		name: "Horn Attack",
		pp: 25,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"horndrill": {
		num: 32,
		accuracy: 30,
		basePower: false,
		category: "Physical",
		desc: "The target faints; doesn't work on higher-leveled Pokemon.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: "horndrill",
		name: "Horn Drill",
		pp: 5,
		isContact: true,
		priority: 0,
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
		desc: "Heals the user by half the damage inflicted.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "hornleech",
		name: "Horn Leech",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
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
		name: "Howl",
		pp: 40,
		isViable: true,
		priority: 0,
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
		basePower: 120,
		category: "Special",
		desc: "Has a 30% chance to confuse the target. Has 100% accuracy during rain.",
		shortDesc: "30% chance to confuse target. Can't miss in rain.",
		id: "hurricane",
		name: "Hurricane",
		pp: 10,
		isViable: true,
		priority: 0,
		onModifyMove: function(move) {
			if (this.weather === 'raindance') move.accuracy = true;
			else if (this.weather === 'sunnyday') move.accuracy = 50;
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Flying"
	},
	"hydrocannon": {
		num: 308,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
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
		basePower: 120,
		category: "Special",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "hydropump",
		name: "Hydro Pump",
		pp: 5,
		isViable: true,
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
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
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
		desc: "Has a 10% chance to make the target flinch.",
		shortDesc: "10% chance to flinch the target.",
		id: "hyperfang",
		name: "Hyper Fang",
		pp: 15,
		isContact: true,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect. Hits adjacent foes.",
		id: "hypervoice",
		name: "Hyper Voice",
		pp: 10,
		isViable: true,
		isSoundBased: true,
		priority: 0,
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"hypnosis": {
		num: 95,
		accuracy: 60,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		shortDesc: "Puts the target to sleep.",
		id: "hypnosis",
		name: "Hypnosis",
		pp: 20,
		isViable: true,
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
		desc: "The user attacks uncontrollably for five turns; this move's power doubles after each turn and also if Defense Curl was used beforehand. Its power resets after five turns have ended or if the attack misses.",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
		id: "iceball",
		name: "Ice Ball",
		pp: 20,
		isContact: true,
		priority: 0,
		effect: {
			duration: 2,
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
				var move = this.getMove(target.lastMove);
				if (move.id !== 'iceball') {
					// don't lock
					delete target.volatiles['iceball'];
				}
			},
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove("iceball");
			},
			onBeforeTurn: function(pokemon) {
				if (pokemon.lastMove === 'iceball') {
					this.debug('Forcing into Ice Ball');
					this.changeDecision(pokemon, {move: 'iceball'});
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
		basePower: 95,
		category: "Special",
		desc: "Has a 10% chance to freeze the target.",
		shortDesc: "10% chance to freeze the target.",
		id: "icebeam",
		name: "Ice Beam",
		pp: 10,
		isViable: true,
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
		desc: "Charges for a turn before attacking. Has a 30% chance to burn the target.",
		shortDesc: "Charges turn 1. Hits turn 2. 30% burn.",
		id: "iceburn",
		name: "Ice Burn",
		pp: 5,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('iceburn')) return;
			this.add('-prepare', pokemon, 'Ice Burn', target);
			pokemon.addVolatile('iceburn');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('iceburn');
			}
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
		desc: "Has a 10% chance to freeze the target. Has 10% chance to make the target flinch. Both effects can occur from a single use.",
		shortDesc: "10% chance to freeze. 10% chance to flinch.",
		id: "icefang",
		name: "Ice Fang",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 10% chance to freeze the target.",
		shortDesc: "10% chance to freeze the target.",
		id: "icepunch",
		name: "Ice Punch",
		pp: 15,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
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
		desc: "Usually goes first.",
		shortDesc: "Usually goes first.",
		id: "iceshard",
		name: "Ice Shard",
		pp: 30,
		isViable: true,
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
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch the target.",
		id: "iciclecrash",
		name: "Icicle Crash",
		pp: 10,
		isViable: true,
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
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "iciclespear",
		name: "Icicle Spear",
		pp: 30,
		isViable: true,
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
		desc: "Lowers the target's Speed by 1 stage.",
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
		target: "foes",
		type: "Ice"
	},
	"imprison": {
		num: 286,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the user faints or switches out, the opponent cannot select any moves that it has in common with the user. In double battles, this move affects both opponents.",
		shortDesc: "No foe can use any move known by the user.",
		id: "imprison",
		name: "Imprison",
		pp: 10,
		priority: 0,
		volatileStatus: 'imprison',
		effect: {
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
		basePower: 30,
		category: "Special",
		desc: "Inflicts damage and renders the target's Berry unusable. It also hits all opponents in double and all adjacent opponents in triple battles.",
		shortDesc: "Destroys the foe(s) Berry.",
		id: "incinerate",
		name: "Incinerate",
		pp: 15,
		priority: 0,
		onHit: function(pokemon, source) {
			var item = pokemon.getItem();
			if (item.isBerry && pokemon.takeItem(source)) {
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
		},
		secondary: false,
		target: "normal",
		type: "Fire"
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
		secondary: {
			chance: 100,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"ingrain": {
		num: 275,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user recovers 1/16 of its max HP after each turn, but it cannot be switched out or forced to switch out. If a Flying-type Pokemon or a Pokemon with Levitate comes under the effect of Ingrain, it will no longer have immunity from Ground-type attacks.",
		shortDesc: "User recovers 1/16 max HP per turn. Traps user.",
		id: "ingrain",
		name: "Ingrain",
		pp: 20,
		isViable: true,
		priority: 0,
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
			onDragOut: false
		},
		secondary: false,
		target: "self",
		type: "Grass"
	},
	"irondefense": {
		num: 334,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		shortDesc: "Boosts the user's Defense by 2.",
		id: "irondefense",
		name: "Iron Defense",
		pp: 15,
		isViable: true,
		priority: 0,
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
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch the target.",
		id: "ironhead",
		name: "Iron Head",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 30% chance to lower the target's Defense by 1 stage.",
		shortDesc: "30% chance to lower the target's Defense by 1.",
		id: "irontail",
		name: "Iron Tail",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "This move's type changes according to the user's held plate.",
		shortDesc: "Type varies based on the held Plate.",
		id: "judgment",
		name: "Judgment",
		pp: 10,
		isViable: true,
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
		desc: "If this attack misses the target, the user half of its max health in recoil damage.",
		shortDesc: "User is hurt by 50% of its max HP if it misses.",
		id: "jumpkick",
		name: "Jump Kick",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		onMoveFail: function(target, source, move) {
			//var damage = this.getDamage(source, target, move, true);
			//this.damage(damage/2, source);
			this.damage(source.maxhp/2, source);
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "karatechop",
		name: "Karate Chop",
		pp: 25,
		isContact: true,
		priority: 0,
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
		desc: "Lowers the target's Accuracy by 1 stage.",
		shortDesc: "Lowers the target's Accuracy by 1.",
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
	"knockoff": {
		num: 282,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Disables the target's held item unless it has Sticky Hold or Multitype. Items lost to this move cannot be recovered by using Recycle.",
		shortDesc: "Removes the target's held item.",
		id: "knockoff",
		name: "Knock Off",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		onHit: function(target, source) {
			item = target.takeItem(source);
			if (item) {
				this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] '+source);
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"lastresort": {
		num: 387,
		accuracy: 100,
		basePower: 140,
		category: "Physical",
		desc: "Fails until each other move in the user's moveset has been performed at least once; the user must also know at least one other move.",
		shortDesc: "Fails unless each known move has been used.",
		id: "lastresort",
		name: "Last Resort",
		pp: 5,
		isContact: true,
		priority: 0,
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
		desc: "Has a 30% chance to burn the target.",
		shortDesc: "30% chance to burn adjacent Pokemon.",
		id: "lavaplume",
		name: "Lava Plume",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'brn'
		},
		target: "adjacent",
		type: "Fire"
	},
	"leafblade": {
		num: 348,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "leafblade",
		name: "Leaf Blade",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"leafstorm": {
		num: 437,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages after use.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "leafstorm",
		name: "Leaf Storm",
		pp: 5,
		isViable: true,
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
		desc: "Has a 50% chance to lower the target's Accuracy by one level.",
		shortDesc: "50% chance to lower the target's Accuracy by 1.",
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
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "leechlife",
		name: "Leech Life",
		pp: 15,
		isContact: true,
		priority: 0,
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
		desc: "The user steals 1/8 of the target's max HP until the target is switched out, is KO'ed, or uses Rapid Spin; does not work against Grass-type Pokemon or Pokemon behind Substitutes.",
		shortDesc: "1/8 of target's HP is restored to user every turn.",
		id: "leechseed",
		name: "Leech Seed",
		pp: 10,
		isViable: true,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'leechseed',
		affectedByImmunities: true,
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
				this.add('-immune', target.id, '[msg]');
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
		desc: "Lowers the target's Defense by 1 stage.",
		shortDesc: "Lowers the foe(s) Defense by 1.",
		id: "leer",
		name: "Leer",
		pp: 30,
		priority: 0,
		boosts: {
			def: -1
		},
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"lick": {
		num: 122,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		id: "lick",
		name: "Lick",
		pp: 30,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Ghost"
	},
	"lightscreen": {
		num: 113,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "All Pokemon in the user's party receive 1/2 damage from Special attacks for 5 turns. Light Screen will be removed from the user's field if an opponent's Pokemon uses Brick Break. It will also last for eight turns if its user is holding Light Clay. In double battles, both Pokemon are shielded, but damage protection is reduced from 1/2 to 1/3.",
		shortDesc: "For 5 turns, allies' Sp. Def is 2x; 1.5x if not 1vs1.",
		id: "lightscreen",
		name: "Light Screen",
		pp: 30,
		isViable: true,
		priority: 0,
		sideCondition: 'lightscreen',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.item === 'lightclay') {
					return 8;
				}
				return 5;
			},
			onFoeBasePower: function(basePower, attacker, defender, move) {
				if (move.category === 'Special' && defender.side === this.effectData.target) {
					if (!move.crit && attacker.ability !== 'infiltrator') {
						this.debug('Light Screen weaken');
						return basePower/2;
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
		target: "allies",
		type: "Psychic"
	},
	"lockon": {
		num: 199,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move ensures that the user's next attack will hit against its current target. This effect can be Baton Passed to another Pokemon. Lock-On fails against Pokemon in the middle of using Protect, Detect, Dig, Fly, Bounce or Dive, as well as Pokemon behind a Substitute. If the target uses Protect or Detect during its next turn, the user's next move has a [100 Varmove's normal accuracy]% chance to hit through Protect or Detect. OHKO moves do not benefit from this trait.",
		shortDesc: "User's next move will not miss the target.",
		id: "lockon",
		name: "Lock-On",
		pp: 5,
		priority: 0,
		volatileStatus: 'lockon',
		effect: {
			duration: 2,
			onModifyMove: function(move) {
				move.accuracy = true;
				move.alwaysHit = true;
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"lovelykiss": {
		num: 142,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		shortDesc: "Puts the target to sleep.",
		id: "lovelykiss",
		name: "Lovely Kiss",
		pp: 10,
		isViable: true,
		priority: 0,
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"lowkick": {
		num: 67,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var targetWeight = target.weightkg;
			if (target.weightkg > 200) {
				return 120;
			}
			if (target.weightkg > 100) {
				return 100;
			}
			if (target.weightkg > 50) {
				return 80;
			}
			if (target.weightkg > 25) {
				return 60;
			}
			if (target.weightkg > 10) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Base power increases as the target's weight increases.",
		shortDesc: "More power the heavier the target.",
		id: "lowkick",
		name: "Low Kick",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"lowsweep": {
		num: 490,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Lowers the target's Speed by one level.",
		shortDesc: "100% chance to lower the target's Speed by 1.",
		id: "lowsweep",
		name: "Low Sweep",
		pp: 20,
		isContact: true,
		priority: 0,
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
		desc: "Critical hits are prevented against every Pokemon on the user's team, even if the user is switched out, for five turns.",
		shortDesc: "For 5 turns, shields user's party from critical hits.",
		id: "luckychant",
		name: "Lucky Chant",
		pp: 30,
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
		priority: 0,
		secondary: false,
		target: "allies",
		type: "Normal"
	},
	"lunardance": {
		num: 461,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user sacrifices itself so that its replacement will be cured of status conditions and have its HP and PP fully restored upon entering the field. This move fails if the user is the only non-fainted Pokemon on its team.",
		shortDesc: "User faints. Replacement is fully healed, with PP.",
		id: "lunardance",
		name: "Lunar Dance",
		pp: 10,
		isViable: true,
		priority: 0,
		onTryHit: function(pokemon) {
			if (pokemon.side.pokemonLeft <= 1) return false;
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
					this.add('-message',target.name+' became cloaked in mystical moonlight! (placeholder)');
					this.add('-heal',target,target.getHealth(),'[from] move: Lunar Dance','[silent]'); // remove [silent] once the message is implemented clientside
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
		desc: "Has a 50% chance to lower the target's Special Defense by 1 stage.",
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
		desc: "Usually goes first.",
		shortDesc: "Usually goes first.",
		id: "machpunch",
		name: "Mach Punch",
		pp: 30,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"magiccoat": {
		num: 277,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes first. Until the end of the turn, the user will reflect one disabling move back at its user (including teammates); these include status effect inducers, confusion inducers (including Flatter and Swagger), Attract, trapping moves that do not damage, Leech Seed, Worry Seed, Gastro Acid and negative stat modifiers (except Defog). In double battles, Magic Coat will only reflect the first applicable move performed against its user before wearing off.",
		shortDesc: "Bounces back certain non-damaging moves.",
		id: "magiccoat",
		name: "Magic Coat",
		pp: 15,
		isViable: true,
		priority: 4,
		volatileStatus: 'magiccoat',
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'move: Magic Coat');
			},
			onAllyTryFieldHit: function(target, source, move) {
				if (target === source) return;
				if (typeof move.isBounceable === 'undefined') {
					move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
				}
				if (move.target !== 'foeSide' && target !== this.effectData.target) {
					return;
				}
				if (move.hasBounced) {
					return;
				}
				if (move.isBounceable) {
					target.removeVolatile('MagicCoat');
					var newMove = this.getMoveCopy(move.id);
					newMove.hasBounced = true;
					this.add('-activate', target, 'move: Magic Coat', newMove, '[of] '+source);
					this.moveHit(source, target, newMove);
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
		basePower: false,
		category: "Status",
		desc: "Held items have no effect for the next five turns.",
		shortDesc: "For 5 turns, all held items have no effect.",
		id: "magicroom",
		name: "Magic Room",
		pp: 10,
		priority: -7,
		onFieldHit: function(target, source, effect) {
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
			onModifyPokemonPriority: -100,
			onModifyPokemon: function(pokemon) {
				pokemon.ignore['Item'] = true;
			},
			onResidualOrder: 25,
			onEnd: function() {
				this.add('-fieldend', 'move: Magic Room', '[of] '+this.effectData.source);
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"magicalleaf": {
		num: 345,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		shortDesc: "Ignores Accuracy and Evasion modifiers.",
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
		basePower: 120,
		category: "Special",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "magmastorm",
		name: "Magma Storm",
		pp: 5,
		isViable: true,
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
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		shortDesc: "Ignores Accuracy and Evasion modifiers.",
		id: "magnetbomb",
		name: "Magnet Bomb",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"magnetrise": {
		num: 393,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user receives immunity against Ground-type attacks for five turns.",
		shortDesc: "For 5 turns, the user is immune to Ground moves.",
		id: "magnetrise",
		name: "Magnet Rise",
		pp: 10,
		isViable: true,
		priority: 0,
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
		basePower: false,
		basePowerCallback: function(pokemon) {
			var i = this.random(100);
			if (i < 5) {
				this.add('-message', 'Magnitude 4! (placeholder)');
				return 10;
			} else if (i < 15) {
				this.add('-message', 'Magnitude 5! (placeholder)');
				return 30;
			} else if (i < 35) {
				this.add('-message', 'Magnitude 6! (placeholder)');
				return 50;
			} else if (i < 65) {
				this.add('-message', 'Magnitude 7! (placeholder)');
				return 70;
			} else if (i < 85) {
				this.add('-message', 'Magnitude 8! (placeholder)');
				return 90;
			} else if (i < 95) {
				this.add('-message', 'Magnitude 9! (placeholder)');
				return 110;
			} else {
				this.add('-message', 'Magnitude 10! (placeholder)');
				return 150;
			}
		},
		category: "Physical",
		desc: "Deals variable damage, between 10 base power and 130 base power, as well as double damage against Digging Pokemon.",
		shortDesc: "Hits adjacent Pokemon. Power varies; 2x on Dig.",
		id: "magnitude",
		name: "Magnitude",
		pp: 30,
		priority: 0,
		secondary: false,
		target: "adjacent",
		type: "Ground"
	},
	"mefirst": {
		num: 382,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move fails if it goes last; if the target selects a damaging move for its turn, the user copies the move and performs it with 1.5x power. In a double battle, a move copied by Me First that targets a single Pokemon will hit a random opponent; Me First cannot target the user's teammate.",
		shortDesc: "Copies a foe at 1.5x power. User must be faster.",
		id: "mefirst",
		name: "Me First",
		pp: 20,
		isViable: true,
		priority: 0,
		onHit: function(target, pokemon) {
			var decision = this.willMove(target);
			if (decision) {
				var move = this.getMove(decision.move);
				if (move.category !== 'Status') {
					pokemon.addVolatile('mefirst');
					this.useMove(move, pokemon);
					return;
				}
			}
			return false;
		},
		effect: {
			duration: 1,
			onBasePower: function(basePower) {
				return basePower * 1.5;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"meanlook": {
		num: 212,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "As long as the user remains in battle, the target cannot switch out unless it is holding Shed Shell or uses Baton Pass or U-Turn. The target will still be trapped if the user switches out by using Baton Pass.",
		shortDesc: "The target cannot switch out.",
		id: "meanlook",
		name: "Mean Look",
		pp: 5,
		isViable: true,
		isBounceable: true,
		priority: 0,
		onHit: function(target) {
			target.addVolatile('trapped');
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
		name: "Meditate",
		pp: 40,
		isViable: true,
		priority: 0,
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
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "megakick",
		name: "Mega Kick",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"megapunch": {
		num: 5,
		accuracy: 85,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "megapunch",
		name: "Mega Punch",
		pp: 20,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"megahorn": {
		num: 224,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "megahorn",
		name: "Megahorn",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"memento": {
		num: 262,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user sacrifices itself to lower the target's Attack and Special Attack by 2 stages each.",
		shortDesc: "Lowers target's Attack, Sp. Atk by 2. User faints.",
		id: "memento",
		name: "Memento",
		pp: 10,
		isViable: true,
		isBounceable: false,
		priority: 0,
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
		basePower: false,
		damageCallback: function(pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn) {
				return 1.5 * pokemon.lastAttackedBy.damage;
			}
			this.add('-fail', pokemon);
			return false;
		},
		category: "Physical",
		desc: "Fails unless the user goes last; if an opponent strikes with a Physical or a Special attack before the user's turn, the user retaliates for 1.5x the damage it had endured.",
		shortDesc: "The foe takes 1.5x the damage it did to the user.",
		id: "metalburst",
		name: "Metal Burst",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"metalclaw": {
		num: 232,
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		desc: "Has a 10% chance to raise the user's Attack by 1 stage.",
		shortDesc: "10% chance to boost the user's Attack by 1.",
		id: "metalclaw",
		name: "Metal Claw",
		pp: 35,
		isContact: true,
		priority: 0,
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
		desc: "Lowers the target's Special Defense by 2 stages.",
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
		accuracy: 85,
		basePower: 100,
		category: "Physical",
		desc: "Has a 20% chance to raise the user's Attack by 1 stage.",
		shortDesc: "20% chance to boost the user's Attack by 1.",
		id: "meteormash",
		name: "Meteor Mash",
		pp: 10,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
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
		desc: "The user performs a randomly selected move; almost any move in the game could be picked. Metronome cannot generate itself, Assist, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Trick or any move that the user already knows.",
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
					afteryou:1, assist:1, bestow:1, chatter:1, copycat:1, counter:1, covet:1, destinybond:1, detect:1, endure:1, feint:1, focuspunch:1, followme:1, freezeshock:1, helpinghand:1, iceburn:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, protect:1, quash:1, quickguard:1, ragepowder:1, relicsong:1, secretsword:1, sketch:1, sleeptalk:1, snatch:1, snarl:1, snore:1, struggle:1, switcheroo:1, technoblast:1, thief:1, transform:1, trick:1, "v-create":1, wideguard:1
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
		desc: "Restores 1/2 of the user's max HP.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "milkdrink",
		name: "Milk Drink",
		pp: 10,
		isViable: true,
		priority: 0,
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
		desc: "This move is temporarily replaced by the target's last move; the replacement move will have full PP and become part of the user's moveset until the user switches out or the battle ends. Mimic copies attacks even if they miss or the user has immunity toward their type; it cannot copy itself, Struggle, Transform, Sketch, Chatter or moves that the user already knows, and it will fail if the target has yet to use a move.",
		shortDesc: "The last move the target used replaces this one.",
		id: "mimic",
		name: "Mimic",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var disallowedMoves = {transform:1,struggle:1,sketch:1,mimic:1,chatter:1};
			if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1) return false;
			var moveslot = source.moves.indexOf('mimic');
			if (moveslot === -1) return false;
			var move = Tools.getMove(target.lastMove);
			source.moveset[moveslot] = {
				move: move.name,
				id: move.id,
				pp: (move.noPPBoosts ? move.pp : move.pp * 8/5),
				maxpp: (move.noPPBoosts ? move.pp : move.pp * 8/5),
				disabled: false,
				used: false
			};
			source.moves[moveslot] = toId(move.name);
			this.add('-message', source.name+' learned '+move.name+'! (placeholder)');
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
		desc: "This move ensures that the user's next attack will hit against its current target. This effect can be Baton Passed to another Pokemon. Mind Reader fails against Pokemon in the middle of using Protect, Detect, Dig, Fly, Bounce or Dive, as well as Pokemon behind a Substitute. If the target uses Protect or Detect during its next turn, the user's next move has a [100 Varmove's normal accuracy]% chance to hit through Protect or Detect. OHKO moves do not benefit from this trait.",
		shortDesc: "User's next move will not miss the target.",
		id: "mindreader",
		name: "Mind Reader",
		pp: 5,
		priority: 0,
		volatileStatus: 'lockon',
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"minimize": {
		num: 107,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Evasion by 2 stages; however, Stomp and Steamroller gain doubled power against Minimized Pokemon.",
		shortDesc: "Boosts the user's Evasion by 2.",
		id: "minimize",
		name: "Minimize",
		pp: 20,
		priority: 0,
		volatileStatus: 'minimize',
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
		desc: "Until the target faints or switches, if the target has positive Evasion boosts, they are ignored. Dark-type targets also lose their immunity against Psychic-type moves.",
		shortDesc: "Blocks Evasion mods. Psychic hits Dark.",
		id: "miracleeye",
		name: "Miracle Eye",
		pp: 40,
		isBounceable: true,
		priority: 0,
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
		basePower: false,
		damageCallback: function(pokemon) {
			if (pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && this.getMove(pokemon.lastAttackedBy.move).category === 'Special') {
				return 2 * pokemon.lastAttackedBy.damage;
			}
			this.add('-fail', pokemon);
			return false;
		},
		category: "Special",
		desc: "Almost always goes last; if an opponent strikes with a Special attack before the user's turn, the user retaliates for twice the damage it had endured. In double battles, this attack targets the last opponent to hit the user with a Special attack and cannot hit the user's teammate.",
		shortDesc: "If hit by special attack, returns double damage.",
		id: "mirrorcoat",
		name: "Mirror Coat",
		pp: 20,
		isViable: true,
		priority: -5,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"mirrormove": {
		num: 119,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user performs the last move executed by its target; if applicable, an attack's damage is calculated with the user's stats, level and type(s). This moves fails if the target has not yet used a move. Mirror Move cannot copy Encore, Struggle, global moves affecting all Pokemon on the field (such as Gravity, Hail, Rain Dance, Sandstorm and Sunny Day) moves that can bypass Protect (Acupressure, Doom Desire, Future Sight, Imprison, Perish Song, Psych Up, Role Play and Transform) and moves that do not have a specific target (such as Light Screen, Reflect, Safeguard, Spikes, Stealth Rock and Toxic Spikes).",
		shortDesc: "User uses the target's last used move against it.",
		id: "mirrormove",
		name: "Mirror Move",
		pp: 20,
		priority: 0,
		onTryHit: function(target) {
			var noMirrorMove = {acupressure:1, afteryou:1, aromatherapy:1, chatter:1, conversion2:1, counter:1, curse:1, doomdesire:1, feint:1, finalgambit:1, focuspunch:1, futuresight:1, gravity:1, guardsplit:1, hail:1, haze:1, healbell:1, healpulse:1, helpinghand:1, lightscreen:1, luckychant:1, mefirst:1, mimic:1, mirrorcoat:1, mirrormove:1, mist:1, mudsport:1, naturepower:1, perishsong:1, powersplit:1, psychup:1, quickguard:1, raindance:1, reflect:1, reflecttype:1, roleplay:1, safeguard:1, sandstorm:1, sketch:1, spikes:1, spitup:1, stealthrock:1, struggle:1, sunnyday:1, tailwind:1, toxicspikes:1, transform:1, watersport:1, wideguard:1};
			if (!target.lastMove || noMirrorMove[target.lastMove] || this.getMove(target.lastMove).target === 'self') {
				return false;
			}
		},
		onHit: function(target, source) {
			this.useMove(this.lastMove, source);
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
		desc: "Has a 30% chance to lower the target's Accuracy by 1 stage.",
		shortDesc: "30% chance to lower the target's Accuracy by 1.",
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
		desc: "Protects every Pokemon on the user's team from negative stat modifiers caused by other Pokemon (including teammates), but not by itself, for five turns. The team's Accuracy and Evasion stats are also protected. Moves that cause negative stat modifiers as a secondary effect, such as Psychic, still deal their regular damage.",
		shortDesc: "For 5 turns, protects user's party from stat drops.",
		id: "mist",
		name: "Mist",
		pp: 30,
		priority: 0,
		sideCondition: 'mist',
		effect: {
			duration: 5,
			onBoost: function(boost, target, source) {
				if (source && target === source) return;
				for (var i in boost) {
					if (boost[i] < 0) {
						delete boost[i];
						this.add('-message', target.name+' is protected by the mist! (placeholder)');
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
		target: "allies",
		type: "Ice"
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
		secondary: {
			chance: 50,
			boosts: {
				spa: -1
			}
		},
		target: "normal",
		type: "Psychic"
	},
	"moonlight": {
		num: 236,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores a fraction of the user's max HP depending on the weather: 2/3 during Sunny Day, 1/2 during regular weather and 1/4 during Rain Dance, Hail and Sandstorm.",
		shortDesc: "Heals the user by a weather-dependent amount.",
		id: "moonlight",
		name: "Moonlight",
		pp: 5,
		isViable: true,
		priority: 0,
		heal: [1,2],
		onModifyMove: function(move) {
			if (this.weather === 'sunnyday') move.heal = [2,3];
			else if (this.weather === 'raindance' || this.weather === 'sandstorm' || this.weather === 'hail') move.heal = [1,4];
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"morningsun": {
		num: 234,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores a fraction of the user's max HP depending on the weather: 2/3 during Sunny Day, 1/2 during regular weather and 1/4 during Rain Dance, Hail and Sandstorm.",
		shortDesc: "Heals the user by a weather-dependent amount.",
		id: "morningsun",
		name: "Morning Sun",
		pp: 5,
		isViable: true,
		priority: 0,
		heal: [1,2],
		onModifyMove: function(move) {
			if (this.weather === 'sunnyday') move.heal = [2,3];
			else if (this.weather === 'raindance' || this.weather === 'sandstorm' || this.weather === 'hail') move.heal = [1,4];
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
		desc: "Has a 100% chance to lower the target's Accuracy by 1 stage.",
		shortDesc: "100% chance to lower the target's Accuracy by 1.",
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
		desc: "Has a 30% chance to lower the target's Accuracy by 1 stage.",
		shortDesc: "30% chance to lower the target's Accuracy by 1.",
		id: "mudbomb",
		name: "Mud Bomb",
		pp: 10,
		priority: 0,
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
		desc: "Lowers the target's Speed by 1 stage.",
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
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "All Electric-type moves are weakened by two-thirds until the user switches out.",
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
			onAnyBasePower: function(basePower, user, target, move) {
				if (move.type === 'Electric') return basePower / 3;
			}
		},
		secondary: false,
		target: "all",
		type: "Ground"
	},
	"muddywater": {
		num: 330,
		accuracy: 85,
		basePower: 95,
		category: "Special",
		desc: "Lowers the target's Accuracy by 1 stage.",
		shortDesc: "30% chance to lower the foe(s) Accuracy by 1.",
		id: "muddywater",
		name: "Muddy Water",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1
			}
		},
		target: "foes",
		type: "Water"
	},
	"nastyplot": {
		num: 417,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack by 2 stages.",
		shortDesc: "Boosts the user's Sp. Atk by 2.",
		id: "nastyplot",
		name: "Nasty Plot",
		pp: 20,
		isViable: true,
		priority: 0,
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
		basePower: false,
		basePowerCallback: function(pokemon) {
			if (pokemon.volatiles['naturalgift']) return pokemon.volatiles['naturalgift'].basePower;
			return false;
		},
		category: "Physical",
		desc: "The user's berry is thrown at the target. This attack's base power and type vary depending on the thrown berry. The berry is gone for the rest of the battle unless Recycle is used; it will return to the original holder after wireless battles but will be permanently lost if it is thrown during in-game battles.",
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
		basePower: false,
		category: "Status",
		desc: "The user generates another move depending on the battle's current terrain. It generates Seed Bomb in any type of grass (as well as in puddles), Hydro Pump while surfing on top of water, Rock Slide on any rocky outdoor terrain and inside of caves, Earthquake on beach sand, desert sand and dirt paths (as well as Wifi), Blizzard in snow, and Tri Attack everywhere else. In Battle Revolution, the move generates Tri Attack at Courtyard, Main Street and Neon, Seed Bomb at Sunny Park and Waterfall, Hydro Pump at Gateway, Rock Slide at Crystal, Magma and Stargazer and Earthquake at Sunset.",
		shortDesc: "Attack changes based on terrain. (Earthquake)",
		id: "naturepower",
		name: "Nature Power",
		pp: 20,
		isViable: true,
		priority: 0,
		onHit: function(target) {
			this.useMove('earthquake', target);
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
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch the target.",
		id: "needlearm",
		name: "Needle Arm",
		pp: 15,
		isContact: true,
		priority: 0,
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
		desc: "Has a 40% chance to lower the target's Accuracy by one level.",
		shortDesc: "40% chance to lower the target's Accuracy by 1.",
		id: "nightdaze",
		name: "Night Daze",
		pp: 10,
		isViable: true,
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
		basePower: false,
		damage: 'level',
		category: "Special",
		desc: "Does damage equal to user's level.",
		shortDesc: "Does damage equal to the user's level.",
		id: "nightshade",
		name: "Night Shade",
		pp: 15,
		isViable: true,
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "nightslash",
		name: "Night Slash",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "This move only works on a sleeping target; as long as the target remains asleep and in battle, 1/4 of its max HP is sapped after each turn.",
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
	"octazooka": {
		num: 190,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Has a 50% chance to lower the target's Accuracy by 1 stage.",
		shortDesc: "50% chance to lower the target's Accuracy by 1.",
		id: "octazooka",
		name: "Octazooka",
		pp: 10,
		priority: 0,
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
		desc: "Until the target faints or switches, if the target has positive Evasion boosts, they are ignored. Ghost-type targets also lose their immunities against Normal-type and Fighting-type moves.",
		shortDesc: "Blocks Evasion mods. Fighting, Normal hit Ghost.",
		id: "odorsleuth",
		name: "Odor Sleuth",
		pp: 40,
		isBounceable: true,
		priority: 0,
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
		desc: "Has a 10% chance to raise all of the user's stats by 1 stage.",
		shortDesc: "10% chance to boost all of the user's stats by 1.",
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
		desc: "The user attacks uncontrollably for 2-3 turns and then gets confused.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "outrage",
		name: "Outrage",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		self: {
			volatileStatus: 'lockedmove'
		},
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"overheat": {
		num: 315,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages after use.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "overheat",
		name: "Overheat",
		pp: 5,
		isViable: true,
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
		desc: "Calculates the average of the user's current HP and the target's HP; the HP of both Pokemon is set to this average. Pokemon can be healed by Pain Split even under the effects of Heal Block.",
		shortDesc: "Shares HP of user and target equally.",
		id: "painsplit",
		name: "Pain Split",
		pp: 20,
		isViable: true,
		priority: 0,
		onHit: function(target, pokemon) {
			var averagehp = parseInt(target.hp + pokemon.hp) / 2;
			target.sethp(averagehp);
			pokemon.sethp(averagehp);
			this.add('-sethp', target, target.getHealth(), pokemon, pokemon.hpChange(), '[from] move: Pain Split');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"payday": {
		num: 6,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "The player picks up extra money after in-game battles; the money received is equal to: [user's level * 5 * number of times Pay Day is used]. The player does not lose money if the opponent uses Pay Day but the player wins the battle.",
		shortDesc: "Scatters coins.",
		id: "payday",
		name: "Pay Day",
		pp: 20,
		priority: 0,
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
		desc: "Base power is 50; power doubles if the target goes before the user.",
		shortDesc: "Power doubles if the user moves after the target.",
		id: "payback",
		name: "Payback",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"peck": {
		num: 64,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "peck",
		name: "Peck",
		pp: 35,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"perishsong": {
		num: 195,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "All active Pokemon will faint in 3 turns unless they are switched out.",
		shortDesc: "All active Pokemon will faint in 3 turns.",
		id: "perishsong",
		name: "Perish Song",
		pp: 5,
		isViable: true,
		isSoundBased: true,
		priority: 0,
		onHitField: function(target, source) {
			this.add('-fieldactivate', 'move: Perish Song');
			for (var i=0; i<this.sides.length; i++) {
				for (var j=0; j<this.sides[i].active.length; j++) {
					if (this.sides[i].active[j].runImmunity('sound')) this.sides[i].active[j].addVolatile('perishsong');
					else this.add('-message', this.sides[i].active[j].name+' is immune to Perish Song due to Soundproof, the graphics are incorrect (placeholder)');
				}
			}
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
	"petaldance": {
		num: 80,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "The user attacks uncontrollably for 2-3 turns and then gets confused.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "petaldance",
		name: "Petal Dance",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		self: {
			volatileStatus: 'lockedmove'
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"pinmissile": {
		num: 42,
		accuracy: 85,
		basePower: 14,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
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
	"pluck": {
		num: 365,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "The user eats the target's held berry and, if applicable, receives its benefits. Jaboca Berry will be removed without damaging the user, but Coba Berry will still activate and reduce this move's power.",
		shortDesc: "User steals and eats the target's Berry.",
		id: "pluck",
		name: "Pluck",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"poisonfang": {
		num: 305,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a 30% chance to inflict Toxic poison on the target.",
		shortDesc: "30% chance to badly poison the target.",
		id: "poisonfang",
		name: "Poison Fang",
		pp: 15,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'tox'
		},
		target: "normal",
		type: "Poison"
	},
	"poisongas": {
		num: 139,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		desc: "Poisons the target.",
		shortDesc: "Poisons the foe(s).",
		id: "poisongas",
		name: "Poison Gas",
		pp: 40,
		priority: 0,
		status: 'psn',
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"poisonjab": {
		num: 398,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 30% chance to poison the target.",
		shortDesc: "30% chance to poison the target.",
		id: "poisonjab",
		name: "Poison Jab",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Poisons the target.",
		shortDesc: "Poisons the target.",
		id: "poisonpowder",
		name: "PoisonPowder",
		pp: 35,
		priority: 0,
		status: 'psn',
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Poison"
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
		desc: "Has a high critical hit ratio and a 10% chance to poison the target.",
		shortDesc: "High critical hit ratio. 10% chance to poison.",
		id: "poisontail",
		name: "Poison Tail",
		pp: 25,
		isContact: true,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "pound",
		name: "Pound",
		pp: 35,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
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
		secondary: {
			chance: 10,
			status: 'frz'
		},
		target: "foes",
		type: "Ice"
	},
	"powergem": {
		num: 408,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Deals damage with no additional effect.",
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
		basePower: false,
		category: "Status",
		desc: "Averages Attack and Special Attack with the target.",
		shortDesc: "Averages Attack and Sp. Atk stats with target.",
		id: "powersplit",
		name: "Power Split",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"powerswap": {
		num: 384,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps Attack and Special Attack modifiers with its target.",
		shortDesc: "Swaps Attack and Sp. Atk changes with target.",
		id: "powerswap",
		name: "Power Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			var sourceBoosts = {};

			for (var i in {atk:1,spa:1}) {
				targetBoosts[i] = target.baseBoosts[i];
				sourceBoosts[i] = source.baseBoosts[i];
			}

			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);

			this.add('-swapboost', target, source, 'atk, spa', '[from] move: Power Swap');
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
		desc: "The user switches its Defense and Attack stats. Attack and Defense modifiers continue to affect their original stats only.",
		shortDesc: "Switches user's Attack and Defense stats.",
		id: "powertrick",
		name: "Power Trick",
		pp: 10,
		priority: 0,
		volatileStatus: 'powertrick',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'Power Trick');
			},
			onEnd: function(pokemon) {
				this.add('-end', pokemon, 'Power Trick');
			},
			onRestart: function(pokemon) {
				pokemon.removeVolatile('PowerTrick');
			},
			onModifyStatsPriority: -100,
			onModifyStats: function(stats) {
				var temp = stats.atk;
				stats.atk = stats.def;
				stats.def = temp;
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"powerwhip": {
		num: 438,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "powerwhip",
		name: "Power Whip",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Almost always goes first. The user is protected from all attacks for one turn, but the move's success rate halves with each consecutive use of Protect, Detect or Endure. If a Pokemon has No Guard, or used Lock-On or Mind Reader against the user during the previous turn, its attack has a [100 Varmove's normal accuracy]% chance to hit through Protect; OHKO moves do not benefit from this effect. Blizzard has a 30% to hit through this move during Hail, as does Thunder during Rain Dance.",
		shortDesc: "Prevents moves from affecting the user for a turn.",
		id: "protect",
		name: "Protect",
		pp: 10,
		isViable: true,
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
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 1,
			onTryHit: function(target, source, effect) {
				if (effect && (effect.id === 'feint' || effect.id === 'roleplay' || effect.id === 'conversion2')) {
					return;
				}
				if (effect && effect.id === 'curse' && !effect.volatileStatus) {
					// curse targeting self
					return;
				}
				this.add('-activate', target, 'Protect');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is removed
					if (source.volatiles['lockedmove'].duration === 1) {
						source.removeVolatile('lockedmove');
					} else {
						delete source.volatiles['lockedmove'];
					}
				}
				this.singleEvent('MoveFail', effect, null, target, source, effect);
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
		desc: "Has a 10% chance to confuse the target.",
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
		desc: "The user copies all six of the target's current stat modifiers.",
		shortDesc: "Copies the target's stat changes.",
		id: "psychup",
		name: "Psych Up",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};

			for (var i in target.baseBoosts) {
				targetBoosts[i] = target.baseBoosts[i];
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
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "psychic",
		name: "Psychic",
		pp: 10,
		isViable: true,
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
		desc: "Lowers the user's Special Attack by 2 stages after use.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "psychoboost",
		name: "Psycho Boost",
		pp: 5,
		isViable: true,
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "psychocut",
		name: "Psycho Cut",
		pp: 20,
		isViable: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"psychoshift": {
		num: 375,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "The user is cured of status effects by passing them to a healthy target.",
		shortDesc: "Transfers the user's status ailment to the target.",
		id: "psychoshift",
		name: "Psycho Shift",
		pp: 10,
		isViable: true,
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
		desc: "Inflicts damage based on the target's Defense, not Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
		id: "psyshock",
		name: "Psyshock",
		pp: 10,
		isViable: true,
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
		desc: "Inflicts damage based on the target's Defense, not Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
		id: "psystrike",
		name: "Psystrike",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"psywave": {
		num: 149,
		accuracy: 80,
		basePower: false,
		damageCallback: function(pokemon) {
			return (this.random(5,16) / 10) * pokemon.level;
		},
		category: "Special",
		desc: "Randomly inflicts set damage equal to .5x, .6x, .7x, .8x, .9x, 1.0x, 1.1x, 1.2x, 1.3x, 1.4x or 1.5x the user's level.",
		shortDesc: "Random damage equal to .5-1.5x user's level.",
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
		basePower: 60,
		basePowerCallback: function(pokemon, target) {
			return 60 + 20 * target.positiveBoosts();
		},
		category: "Physical",
		desc: "Does more damage to foes with stat boosts.",
		shortDesc: "+20 power for each of the target's stat boosts.",
		id: "punishment",
		name: "Punishment",
		pp: 5,
		isContact: true,
		priority: 0,
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
		desc: "If the target switches out on the current turn, this move strikes with doubled power before the switch. Baton Passers still escape safely. When a faster Pokemon uses Pursuit against a U-Turner, the U-Turner is hit for normal damage; when a slower Pokemon uses Pursuit against a U-Turner, the U-Turner makes its attack, then is hit by Pursuit for double power, and switches out.",
		shortDesc: "Power doubles if the target is switching out.",
		id: "pursuit",
		name: "Pursuit",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		beforeTurnCallback: function(pokemon, target) {
			target.side.addSideCondition('pursuit', pokemon);
			if (!target.side.sideConditions['pursuit'].sources) {
				target.side.sideConditions['pursuit'].sources = [];
			}
			target.side.sideConditions['pursuit'].sources.push(pokemon);
		},
		effect: {
			duration: 1,
			onSwitchOutPriority: 10,
			onSwitchOut: function(pokemon) {
				this.debug('Pursuit start');
				var sources = this.effectData.sources;
				this.add('-activate', pokemon, 'move: Pursuit');
				for (var i=0; i<sources.length; i++) {
					if (sources[i].movedThisTurn || sources[i].status === 'slp' || sources[i].status === 'frz' || sources[i].volatiles['truant']) {
						continue;
					}
					this.useMove('pursuit', sources[i], pokemon);
					sources[i].deductPP('pursuit');
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
		basePower: false,
		category: "Status",
		desc: "The target of Quash will act last in that turn, provided it has not yet acted.",
		shortDesc: "Forces the target to move last.",
		id: "quash",
		name: "Quash",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"quickattack": {
		num: 98,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Usually goes first.",
		shortDesc: "Usually goes first.",
		id: "quickattack",
		name: "Quick Attack",
		pp: 30,
		isViable: true,
		isContact: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"quickguard": {
		num: 501,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Prevents priority attacks from working.",
		shortDesc: "Protects allies from priority attacks for one turn.",
		id: "quickguard",
		name: "Quick Guard",
		pp: 15,
		priority: 3,
		sideCondition: 'quickguard',
		onTryHitSide: function(side, source) {
			if (!this.willAct()) {
				return false;
			}
			var counter = 1;
			if (source.volatiles['stall']) {
				counter = source.volatiles['stall'].counter || 1;
			}
			if (counter >= 256) {
				return (this.random()*4294967296 < 1); // 2^32 - special-cased because Battle.random(n) can't handle n > 2^16 - 1
			}
			this.debug("Success chance: "+Math.round(100/counter)+"%");
			return (this.random(counter) === 0);
		},
		onHitSide: function(side, source) {
			source.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('-singleturn', target, 'Quick Guard');
			},
			onTryHitPriority: 1,
			onTryHit: function(target, source, effect) {
				// Quick Guard only blocks moves with a natural positive priority
				// (e.g. it doesn't block 0 priority moves boosted by Prankster)
				if (effect && (effect.id === 'Feint' || this.getMove(effect.id).priority <= 0)) {
					return;
				}
				this.add('-activate', target, 'Quick Guard');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					source.volatiles['lockedmove'].duration = lockedmove.durationCallback();
				}
				this.singleEvent('MoveFail', effect, null, target, source, effect);
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
		basePower: false,
		category: "Status",
		desc: "Raises the user's Special Attack, Special Defense, and Speed by one stage.",
		shortDesc: "Boosts the user's Sp. Atk, Sp. Def, Speed by 1.",
		id: "quiverdance",
		name: "Quiver Dance",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "The user's Attack rises by 1 stage if attacked before its next move.",
		shortDesc: "Boosts the user's Attack by 1 if hit during use.",
		id: "rage",
		name: "Rage",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"ragepowder": {
		num: 476,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "All moves target the user.",
		shortDesc: "The foes' moves target the user on the turn used.",
		id: "ragepowder",
		name: "Rage Powder",
		pp: 20,
		priority: 3,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"raindance": {
		num: 240,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Cancels all other weather moves. For 5 turns: the power of Water attacks is increased by 50%, the power of Fire attacks is decreased by 50%, Thunder never misses and has a 30% chance to hit through Protect and Detect, the power of Solarbeam is halved, and the healing power of Morning Sun, Synthesis and Moonlight is decreased from 1/2 to 1/4 of the user's max HP. The effects of Rain Dance will last for eight turns if its user is holding Damp Rock.",
		shortDesc: "For 5 turns, heavy rain powers Water moves.",
		id: "raindance",
		name: "Rain Dance",
		pp: 5,
		isViable: true,
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
		desc: "Removes Spikes, Stealth Rock, Toxic Spikes and Leech Seed from the user's side of the field; also frees the user from Bind, Clamp, Fire Spin, Magma Storm, Sand Tomb, Whirlpool and Wrap. These effects do not occur if the move misses or is used against Ghost-type Pokemon.",
		shortDesc: "Frees user from hazards, partial trap, Leech Seed.",
		id: "rapidspin",
		name: "Rapid Spin",
		pp: 40,
		isViable: true,
		isContact: true,
		priority: 0,
		self: {
			onHit: function(pokemon) {
				if (pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] '+pokemon);
				}
				var sideConditions = {spikes:1, toxicspikes:1, stealthrock:1};
				for (var i in sideConditions) {
					if (pokemon.side.removeSideCondition(i)) this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Rapid Spin', '[of] '+pokemon);
				}
				if (pokemon.volatiles['partiallytrapped']) {
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio. Hits adjacent foes.",
		id: "razorleaf",
		name: "Razor Leaf",
		pp: 25,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "foes",
		type: "Grass"
	},
	"razorshell": {
		num: 534,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's Defense by one level.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "razorshell",
		name: "Razor Shell",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "The user prepares on turn one, becoming uncontrollable, and then attacks on turn two. Has a high critical hit ratio.",
		shortDesc: "Charges, then hits foe(s) turn 2. High crit ratio.",
		id: "razorwind",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('razorwind')) return;
			this.add('-prepare', pokemon, 'Razor Wind', target);
			pokemon.addVolatile('razorwind');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('razorwind');
			}
		},
		critRatio: 2,
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"recover": {
		num: 105,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores 1/2 of the user's max HP.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "recover",
		name: "Recover",
		pp: 10,
		isViable: true,
		priority: 0,
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
		desc: "The user's lost item is recovered. Items lost to Fling or Natural Gift will be recovered if the user of Recycle was the item's original holder; items lost to Trick, Switcheroo, Thief, Covet, Knock Off, Bug Bite, or Pluck cannot be recovered.",
		shortDesc: "Restores the item the user last used.",
		id: "recycle",
		name: "Recycle",
		pp: 10,
		priority: 0,
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
		desc: "All Pokemon in the user's party receive 1/2 damage from Physical attacks for 5 turns. Reflect will be removed from the user's field if an opponent's Pokemon uses Brick Break. It will also last for eight turns if its user is holding Light Clay. In double battles, both Pokemon are shielded, but damage protection is reduced from 1/2 to 1/3.",
		shortDesc: "For 5 turns, allies' Defense is 2x; 1.5x if not 1vs1.",
		id: "reflect",
		name: "Reflect",
		pp: 20,
		isViable: true,
		priority: 0,
		sideCondition: 'reflect',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.item === 'lightclay') {
					return 8;
				}
				return 5;
			},
			onFoeBasePower: function(basePower, attacker, defender, move) {
				if (move.category === 'Physical' && defender.side === this.effectData.target) {
					if (!move.crit && attacker.ability !== 'infiltrator') {
						this.debug('Reflect weaken');
						return basePower/2;
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
		target: "allies",
		type: "Psychic"
	},
	"reflecttype": {
		num: 513,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "User becomes the target's type.",
		shortDesc: "User becomes the same type as the target.",
		id: "reflecttype",
		name: "Reflect Type",
		pp: 15,
		priority: 0,
		onHit: function(target, source) {
			source.addVolatile("reflecttype", target);
		},
		effect: {
			onStart: function(target, source) {
				this.effectData.types = source.types;
				this.add("-message", target.name+"'s type changed to match "+source.name+"'s! (placeholder)");
				//this.add("-start", target, "Reflect Type", "[of] "+source);
			},
			onModifyPokemon: function(pokemon) {
				pokemon.types = this.effectData.types;
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
		desc: "The user recovers from burn, poison and paralysis.",
		shortDesc: "Removes status from the user.",
		id: "refresh",
		name: "Refresh",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "has a 10% chance of putting the target to sleep. Ancient Song hits all opponents in double battles and hits all adjacent opponents in triple battles. When used by Meloetta in battle, it will also cause it to change between its Voice and Step Formes.",
		shortDesc: "10% chance to sleep foe(s). Meloetta transforms.",
		id: "relicsong",
		name: "Relic Song",
		pp: 10,
		isViable: true,
		isSoundBased: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'slp'
		},
		onHit: function(target, pokemon) {
			if (pokemon.baseTemplate.species !== 'Meloetta' || pokemon.transformed) {
				return;
			}
			if (pokemon.template.speciesid==='meloettapirouette' && pokemon.transformInto('Meloetta')) {
				this.add('-formechange', pokemon, 'Meloetta');
			} else if (pokemon.transformInto('Meloetta-Pirouette')) {
				this.add('-formechange', pokemon, 'Meloetta-Pirouette');
			}
			// renderer takes care of this for us
			pokemon.transformed = false;
		},
		target: "normal",
		type: "Normal"
	},
	"rest": {
		num: 156,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is cured of status effects (not confusion), and recovers full HP, but falls asleep for 2 turns. Pokemon who have Early Bird will wake up one turn early.",
		shortDesc: "User sleeps 2 turns and restores HP and status.",
		id: "rest",
		name: "Rest",
		pp: 10,
		isViable: true,
		priority: 0,
		onHit: function(target) {
			if (target.hp >= target.maxhp) return false;
			if (!target.setStatus('slp')) return false;
			target.statusData.time = 3;
			target.statusData.startTime = 3;
			this.heal(target.maxhp) //Aeshetic only as the healing happens after you fall asleep in-game
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
		desc: "Power doubles if the user's teammate fainted last turn.",
		shortDesc: "Power doubles if an ally fainted last turn.",
		id: "retaliate",
		name: "Retaliate",
		pp: 5,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"return": {
		num: 216,
		accuracy: 100,
		basePower: false,
		category: "Physical",
		desc: "Power increases as user's happiness increases; maximum 102 BP.",
		shortDesc: "Max 102 power at maximum Happiness.",
		id: "return",
		name: "Return",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Almost always goes last, even after another Pokemon's Focus Punch; this move's base power doubles if the user is damaged before its turn.",
		shortDesc: "Power doubles if user is damaged by the target.",
		id: "revenge",
		name: "Revenge",
		pp: 10,
		isContact: true,
		priority: -4,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"reversal": {
		num: 179,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var hpPercent = pokemon.hpPercent(pokemon.hp);
			if (hpPercent <= 5) {
				return 200;
			}
			if (hpPercent <= 10) {
				return 150;
			}
			if (hpPercent <= 20) {
				return 100;
			}
			if (hpPercent <= 35) {
				return 80;
			}
			if (hpPercent <= 70) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Base power increases as the user's HP decreases.",
		shortDesc: "More power the less HP the user has left.",
		id: "reversal",
		name: "Reversal",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"roar": {
		num: 46,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes last; in trainer battles, the target is switched out for a random member of its team. Escapes from wild battles. Has no effect if the target has Suction Cups, Soundproof or used Ingrain.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "roar",
		name: "Roar",
		pp: 20,
		isViable: true,
		isSoundBased: true,
		priority: -6,
		forceSwitch: true,
		notSubBlocked: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"roaroftime": {
		num: 459,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
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
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "rockblast",
		name: "Rock Blast",
		pp: 10,
		isViable: true,
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
		desc: "Has a 20% chance to confuse the target.",
		shortDesc: "20% chance to confuse the target.",
		id: "rockclimb",
		name: "Rock Climb",
		pp: 20,
		isContact: true,
		priority: 0,
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
		name: "Rock Polish",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "Has a 30% chance to make the target flinch.",
		id: "rockslide",
		shortDesc: "30% chance to flinch the foe(s).",
		name: "Rock Slide",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "foes",
		type: "Rock"
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
		isContact: true,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
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
		accuracy: 80,
		basePower: 50,
		category: "Physical",
		desc: "Lowers the target's Speed by 1 stage.",
		shortDesc: "100% chance to lower the target's Speed by 1.",
		id: "rocktomb",
		name: "Rock Tomb",
		pp: 10,
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
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
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
		desc: "The user's own ability is overwritten with the target's ability; does nothing if the target's ability is Multitype or Wonder Guard.",
		shortDesc: "User replaces its Ability with the target's.",
		id: "roleplay",
		name: "Role Play",
		pp: 10,
		priority: 0,
		onTryHit: function(target, source) {
			if (target.ability === 'multitype' || target.ability === 'wonderguard' || target.ability === source.ability) {
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
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch the target.",
		id: "rollingkick",
		name: "Rolling Kick",
		pp: 15,
		isContact: true,
		priority: 0,
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
		desc: "The user attacks uncontrollably for five turns; this move's power doubles after each turn and also if Defense Curl was used beforehand. Its power resets after five turns have ended or if the attack misses.",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
		id: "rollout",
		name: "Rollout",
		pp: 20,
		isContact: true,
		priority: 0,
		effect: {
			duration: 2,
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
				var move = this.getMove(target.lastMove);
				if (move.id !== 'rollout') {
					// don't lock
					delete target.volatiles['rollout'];
				}
			},
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove("rollout");
			},
			onBeforeTurn: function(pokemon) {
				if (pokemon.lastMove === 'rollout') {
					this.debug('Forcing into Rollout');
					this.changeDecision(pokemon, {move: 'rollout'});
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
		desc: "The user recovers 1/2 of its max HP; if it is a Flying-type Pokemon, it also loses its Flying-type classification until the start of the next turn.",
		shortDesc: "Heals 50% HP. Removes Flying-type 'til turn ends.",
		id: "roost",
		name: "Roost",
		pp: 10,
		isViable: true,
		priority: 0,
		heal: [1,2],
		volatileStatus: 'roost',
		effect: {
			duration: 1,
			onModifyPokemonPriority: 100,
			onModifyPokemon: function(pokemon) {
				if (pokemon.hasType('Flying')) {
					// don't just delete the type; since
					// the types array may be a pointer to the
					// types array in the Pokedex.
					if (pokemon.types[0] === 'Flying') {
						pokemon.types = [pokemon.types[1] || 'Normal'];
					} else {
						pokemon.types = [pokemon.types[0]];
					}
				}
				//pokemon.negateImmunity['Ground'] = 1;
			}
		},
		secondary: false,
		target: "self",
		type: "Flying"
	},
	"round": {
		num: 496,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Canon will damage the entire opposing team in a double or triple battle if it hits. It will double in power if used consecutively by teammates and will be used by teammates directly after the fist user regardless of speed.",
		shortDesc: "Power doubles if an ally used Round this turn.",
		id: "round",
		name: "Round",
		pp: 15,
		isSoundBased: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"sacredfire": {
		num: 221,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "Has a 50% chance to burn the target; can be used while frozen, which both attacks the target normally and thaws the user.",
		shortDesc: "50% chance to burn the target. Thaws user.",
		id: "sacredfire",
		name: "Sacred Fire",
		pp: 5,
		isViable: true,
		thawsUser: true,
		priority: 0,
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
		desc: "The stat modifications of the target's Defense and Evasion are ignored when using this attack. However, Sacred Sword does not bypass Reflect.",
		shortDesc: "Ignores the target's stat modifiers.",
		id: "sacredsword",
		name: "Sacred Sword",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Protects the user's entire team from status conditions for five turns.",
		shortDesc: "For 5 turns, protects user's party from status.",
		id: "safeguard",
		name: "Safeguard",
		pp: 25,
		priority: 0,
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
				if (source && source !== target && source.ability !== 'infiltrator' || (effect && effect.id === 'toxicspikes')) {
					this.debug('interrupting setstatus');
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
		target: "allies",
		type: "Normal"
	},
	"sandattack": {
		num: 28,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Accuracy by 1 stage.",
		shortDesc: "Lowers the target's Accuracy by 1.",
		id: "sandattack",
		name: "Sand-Attack",
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
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
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
		desc: "Cancels all other weather moves. For 5 turns: the Special Defense of Rock-type Pokemon is boosted by 50%, each active Pokemon, even when protected by a Substitute, loses 1/16 of its max HP unless it has Sand Veil or is a Ground-, Rock-, or Steel-type, the power of Solarbeam is halved, and the healing power of Morning Sun, Synthesis and Moonlight is halved. The effects of Sandstorm will last for eight turns if its user is holding Smooth Rock.",
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
		desc: "Has a 30% chance to burn the target.",
		shortDesc: "30% chance to burn the target. Thaws user.",
		id: "scald",
		name: "Scald",
		pp: 15,
		isViable: true,
		thawsUser: true,
		priority: 0,
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
		desc: "Lowers the target's Speed by 2 stages.",
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "scratch",
		name: "Scratch",
		pp: 35,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
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
		isSoundBased: true,
		priority: 0,
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
		desc: "Has a 30% chance to burn the target.",
		shortDesc: "30% chance to burn adjacent Pokemon.",
		id: "searingshot",
		name: "Searing Shot",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"secretpower": {
		num: 290,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "This move has a 30% chance to inflict a side effect depending on the battle's current terrain. The target may be put to sleep in any type of grass (or in puddles), its Attack may be lowered by 1 stage while surfing on any body of water, its Speed may be lowered by 1 stage while on marshy terrain, its Accuracy may be lowered by 1 stage on beach sand, desert sand and dirt paths (and also in Wifi battles), it may flinch in caves or on rocky outdoor terrain, it may become frozen on snowy terrain and it may become paralyzed everywhere else.",
		shortDesc: "Effect varies with terrain. (30% Accuracy lower 1)",
		id: "secretpower",
		name: "Secret Power",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1
			}
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
		desc: "Inflicts damage based on the target's Defense, not Special Defense.",
		shortDesc: "Damages target based on Defense, not Sp. Def.",
		id: "secretsword",
		name: "Secret Sword",
		pp: 10,
		isViable: true,
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "seedbomb",
		name: "Seed Bomb",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"seedflare": {
		num: 465,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		desc: "Has a 40% chance to lower the target's Special Defense by 2 stages.",
		shortDesc: "40% chance to lower the target's Sp. Def by 2.",
		id: "seedflare",
		name: "Seed Flare",
		pp: 5,
		isViable: true,
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
		basePower: false,
		damage: 'level',
		category: "Physical",
		desc: "Does damage equal to user's level.",
		shortDesc: "Does damage equal to the user's level.",
		id: "seismictoss",
		name: "Seismic Toss",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"selfdestruct": {
		num: 120,
		accuracy: 100,
		basePower: 200,
		category: "Physical",
		desc: "Causes the user to faint.",
		shortDesc: "Hits adjacent Pokemon. The user faints.",
		id: "selfdestruct",
		name: "Selfdestruct",
		pp: 5,
		priority: 0,
		selfdestruct: true,
		secondary: false,
		target: "adjacent",
		type: "Normal"
	},
	"shadowball": {
		num: 247,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Sp. Def by 1.",
		id: "shadowball",
		name: "Shadow Ball",
		pp: 15,
		isViable: true,
		priority: 0,
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "shadowclaw",
		name: "Shadow Claw",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "The user disappears on the first turn, becoming uncontrollable and evading all attacks, and strikes on the second turn. This move is not stopped by Protect or Detect.",
		shortDesc: "Disappears turn 1. Hits turn 2. Breaks protection.",
		id: "shadowforce",
		name: "Shadow Force",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('shadowforce')) return;
			pokemon.addVolatile('shadowforce');
			this.add('-prepare', pokemon, 'Shadow Force', target);
			return true;
		},
		onTryHit: function(target) {
			if (target.volatiles['protect']) {
				target.removeVolatile('protect');
			}
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('shadowforce');
			},
			onSourceModifyMove: function(move) {
				if (move.target === 'foeSide') return;
				move.accuracy = 0;
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
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		shortDesc: "Ignores Accuracy and Evasion modifiers.",
		id: "shadowpunch",
		name: "Shadow Punch",
		pp: 20,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"shadowsneak": {
		num: 425,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Usually goes first.",
		shortDesc: "Usually goes first.",
		id: "shadowsneak",
		name: "Shadow Sneak",
		pp: 30,
		isViable: true,
		isContact: true,
		priority: 1,
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
		name: "Sharpen",
		pp: 30,
		isViable: true,
		priority: 0,
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
		basePower: false,
		category: "Special",
		desc: "The target faints; doesn't work on higher-leveled Pokemon.",
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
		basePower: false,
		category: "Status",
		desc: "Raises Attack, Special Attack and Speed by two stages. Decreases Defense and Special Defense by one stage.",
		shortDesc: "Boosts Atk, SpA, Spe by 2. Lowers Def, SpD by 1.",
		id: "shellsmash",
		name: "Shell Smash",
		pp: 15,
		isViable: true,
		priority: 0,
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
		basePower: false,
		category: "Status",
		desc: "Gear Change increases the user's Speed by two stages and the user's Attack by one stage.",
		shortDesc: "Boosts the user's Speed by 2 and Attack by 1.",
		id: "shiftgear",
		name: "Shift Gear",
		pp: 10,
		isViable: true,
		priority: 0,
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
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		shortDesc: "Ignores Accuracy and Evasion modifiers.",
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
		desc: "Has a 10% chance to confuse the target.",
		shortDesc: "10% chance to confuse the target.",
		id: "signalbeam",
		name: "Signal Beam",
		pp: 15,
		isViable: true,
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
		desc: "Has a 10% chance to raise all of the user's stats by 1 stage.",
		shortDesc: "10% chance to boost all of the user's stats by 1.",
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
		basePower: false,
		category: "Status",
		desc: "Changes the foe's ability to Simple.",
		shortDesc: "The target's Ability becomes Simple.",
		id: "simplebeam",
		name: "Simple Beam",
		pp: 15,
		isBounceable: true,
		priority: 0,
		onTryHit: function(pokemon) {
			if (pokemon.ability === 'multitype' || pokemon.ability === 'truant') {
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
		desc: "Puts the target to sleep.",
		shortDesc: "Puts the target to sleep.",
		id: "sing",
		name: "Sing",
		pp: 15,
		isSoundBased: true,
		priority: 0,
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
		desc: "The user permanently replaces Sketch with the last move used by the target. Sketch cannot copy itself, Chatter, Memento or Struggle. Transform and moves that generate other moves can be Sketched successfully, as can Explosion and Selfdestruct if a Pokemon with Damp is present. Healing Wish and Lunar Dance can be Sketched because they automatically fail when the user is the last Pokemon of its team. This move fails automatically when selected in wireless or Wi-Fi battles.",
		shortDesc: "Permanently copies the last move target used.",
		id: "sketch",
		name: "Sketch",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		onTryHit: false,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"skillswap": {
		num: 285,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user exchanges abilities with the target; does not work if Wonder Guard is the ability of either the user or the target.",
		shortDesc: "The user and the target trade Abilities.",
		id: "skillswap",
		name: "Skill Swap",
		pp: 10,
		priority: 0,
		onTryHit: function(target, source) {
			if (target.ability === 'wonderguard' || source.ability === 'wonderguard') {
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
			this.add('-message', source.name+' swapped Abilities with its target! (placeholder)'); // TODO
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"skullbash": {
		num: 130,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "The user prepares on turn one, raising its Defense by 1 stage and becoming uncontrollable, and then attacks on turn two.",
		shortDesc: "Boosts user's Defense by 1 on turn 1. Hits turn 2.",
		id: "skullbash",
		name: "Skull Bash",
		pp: 15,
		isContact: true,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('skullbash')) return;
			this.add('-message', pokemon.name+' tucked in its head! (placeholder)'); // TODO
			pokemon.addVolatile('skullbash');
			return true;
		},
		effect: {
			duration: 2,
			onStart: function(pokemon) {
				this.boost({def:1}, pokemon, pokemon, this.getMove('skullbash'));
			},
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('skullbash');
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
		desc: "The user prepares on turn one, becoming uncontrollable, and then attacks on turn two. Also has a 30% chance to make the target flinch.",
		shortDesc: "Charges, then hits turn 2. 30% flinch. High crit.",
		id: "skyattack",
		name: "Sky Attack",
		pp: 5,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('skyattack')) return;
			this.add('-prepare', pokemon, 'Sky Attack', target);
			pokemon.addVolatile('skyattack');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('skyattack');
			}
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Flying"
	},
	"skydrop": {
		num: 507,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "User and target become untargetable and uncontrollable on turn one. Deals damage on turn two.",
		shortDesc: "User and foe fly up turn 1. Damages on turn 2.",
		id: "skydrop",
		name: "Sky Drop",
		pp: 10,
		isContact: true,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('skydrop')) return;
			pokemon.addVolatile('skydrop');
			this.add('-prepare', pokemon, 'Sky Drop', target); // TODO
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('skydrop');
			},
			onSourceModifyPokemon: function(pokemon) {
				pokemon.lockMove('recharge');
			},
			onSourceBeforeMovePriority: 10,
			onSourceBeforeMove: false,
			onAnyModifyMove: function(move, attacker, defender) {
				if (defender !== this.effectData.target && defender !== this.effectData.source) {
					return;
				}
				if (move.id === 'gust' || move.id === 'twister') {
					// should not normally be done in MovifyMove event,
					// but Gust and Twister have static base power, and
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
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"skyuppercut": {
		num: 327,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Also hits targets in mid-air via Fly or Bounce.",
		shortDesc: "Can hit Pokemon using Bounce or Fly.",
		id: "skyuppercut",
		name: "Sky Uppercut",
		pp: 15,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"slackoff": {
		num: 303,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores 1/2 of the user's max HP.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "slackoff",
		name: "Slack Off",
		pp: 10,
		isViable: true,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "slam",
		name: "Slam",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"slash": {
		num: 163,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "slash",
		name: "Slash",
		pp: 20,
		isContact: true,
		priority: 0,
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
		desc: "Puts the target to sleep.",
		shortDesc: "Puts the target to sleep.",
		id: "sleeppowder",
		name: "Sleep Powder",
		pp: 15,
		isViable: true,
		priority: 0,
		status: 'slp',
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"sleeptalk": {
		num: 214,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Does nothing if the user is awake. If the user asleep, it randomly performs one of its attacks. Rest will fail if it is selected. Sleep Talk's generated attacks do not cost PP, but it cannot generate itself, Assist, Bide, Chatter, Copycat, Focus Punch, Me First, Metronome, Mimic, Mirror Move, Nature Power, Sketch, Uproar, or attacks with a charge-up turn like Fly or Skull Bash. (Moves with a recharge turn like Hyper Beam can be generated.)",
		shortDesc: "User must be asleep. Uses another known move.",
		id: "sleeptalk",
		name: "Sleep Talk",
		pp: 10,
		isViable: true,
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
		desc: "Has a 30% chance to poison the target.",
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
		desc: "Has a 30% chance to poison the target.",
		shortDesc: "30% chance to poison the target.",
		id: "sludgebomb",
		name: "Sludge Bomb",
		pp: 10,
		isViable: true,
		priority: 0,
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
		desc: "Has a 10% chance to poison the target.",
		shortDesc: "10% chance to poison adjacent Pokemon.",
		id: "sludgewave",
		name: "Sludge Wave",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'psn'
		},
		target: "normal",
		type: "Poison"
	},
	"smackdown": {
		num: 479,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Removes ground type immunity of foe.",
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
				if (pokemon.removeVolatile('telekinesis')) applies = true;
				if (pokemon.removeVolatile('magnetrise')) applies = true;
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					applies = true;
					pokemon.movedThisTurn = true;
				}
				if (!applies) return false;
				this.add('-message', pokemon.name+' fell straight down! (placeholder)');
			},
			onModifyPokemonPriority: 1,
			onModifyPokemon: function(pokemon) {
				pokemon.negateImmunity['Ground'] = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"smellingsalt": {
		num: 265,
		accuracy: 100,
		basePower: 60,
		basePowerCallback: function(pokemon, target) {
			if (target.status === 'par') return 120;
			return 60;
		},
		category: "Physical",
		desc: "If the target is paralyzed, power is doubled but the target will be cured.",
		shortDesc: "Power doubles if target is paralyzed, and cures it.",
		id: "smellingsalt",
		name: "SmellingSalt",
		pp: 10,
		isContact: true,
		priority: 0,
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
		basePower: 20,
		category: "Special",
		desc: "Has a 40% chance to poison the target.",
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
		desc: "Lowers the target's Accuracy by 1 stage.",
		shortDesc: "Lowers the target's Accuracy by 1.",
		id: "smokescreen",
		name: "SmokeScreen",
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
		desc: "Has a 100% chance to lower the target's Special Attack by one level.",
		shortDesc: "100% chance to lower the foe(s) Sp. Atk by 1.",
		id: "snarl",
		name: "Snarl",
		pp: 15,
		isSoundBased: true,
		priority: 0,
		secondary: {
			chance: 100,
			boosts: {
				spa: -1
			}
		},
		target: "normal",
		type: "Dark"
	},
	"snatch": {
		num: 289,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes first. Until the end of the turn, the user will steal a supporting move from another Pokemon (including teammates). In double battles, Snatch only steals the first applicable move performed by another Pokemon before wearing off.",
		shortDesc: "User steals certain support moves to use itself.",
		id: "snatch",
		name: "Snatch",
		pp: 10,
		priority: 4,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"snore": {
		num: 173,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 30% chance to make the target flinch; fails if user is awake.",
		shortDesc: "User must be asleep. 30% chance to flinch target.",
		id: "snore",
		name: "Snore",
		pp: 15,
		isSoundBased: true,
		priority: 0,
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
	"soak": {
		num: 487,
		accuracy: 100,
		basePower: false,
		category: "Status",
		desc: "Changes the target's type to water.",
		shortDesc: "Changes the target's type to Water.",
		id: "soak",
		name: "Soak",
		pp: 20,
		priority: 0,
		isBounceable: true,
		volatileStatus: 'soak',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'typechange', 'Water');
			},
			onModifyPokemon: function(pokemon) {
				pokemon.types = ['Water'];
			}
		},
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"softboiled": {
		num: 135,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores 1/2 of the user's max HP.",
		shortDesc: "Heals the user by 50% of its max HP.",
		id: "softboiled",
		name: "Softboiled",
		pp: 10,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"solarbeam": {
		num: 76,
		accuracy: 100,
		basePower: 120,
		basePowerCallback: function(pokemon, target) {
			if (this.weather === 'raindance' || this.weather === 'sandstorm' || this.weather === 'hail') {
				this.debug('weakened by weather');
				return 60;
			}
			return 120;
		},
		category: "Special",
		desc: "The user prepares on turn one, becoming uncontrollable, and then attacks on turn two. During Sunny Day, this move fires immediately; during Rain Dance, Sandstorm and Hail, this move has half power.",
		shortDesc: "Charges turn 1. Hits turn 2. No charge in sunlight.",
		id: "solarbeam",
		name: "SolarBeam",
		pp: 10,
		isViable: true,
		priority: 0,
		isTwoTurnMove: true,
		beforeMoveCallback: function(pokemon, target) {
			if (pokemon.removeVolatile('solarbeam')) return;
			this.add('-prepare', pokemon, 'SolarBeam', target);
			if (this.weather === 'sunnyday') return;
			pokemon.addVolatile('solarbeam');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('solarbeam');
			}
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"sonicboom": {
		num: 49,
		accuracy: 90,
		basePower: false,
		damage: 20,
		category: "Special",
		desc: "Always deals 20 points of damage.",
		shortDesc: "Always does 20 HP of damage.",
		id: "sonicboom",
		name: "SonicBoom",
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "spacialrend",
		name: "Spacial Rend",
		pp: 5,
		isViable: true,
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
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		id: "spark",
		name: "Spark",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "As long as the user remains in battle, the target cannot switch out unless it is holding Shed Shell or uses Baton Pass or U-Turn. The target will still be trapped if the user switches out by using Baton Pass.",
		shortDesc: "The target cannot switch out.",
		id: "spiderweb",
		name: "Spider Web",
		pp: 10,
		isViable: true,
		isBounceable: true,
		priority: 0,
		onHit: function(target) {
			target.addVolatile('trapped');
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
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
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
		desc: "Damages opponents, unless they are Flying-type or have Levitate, every time they are switched in; hits through Wonder Guard. Can be used up to three times: saps 1/8 of max HP with one layer, 3/16 of max HP with two layers and 1/4 of max HP for three layers.",
		shortDesc: "Hurts grounded foes on switch-in. Max 3 layers.",
		id: "spikes",
		name: "Spikes",
		pp: 20,
		isViable: true,
		isBounceable: true,
		priority: 0,
		sideCondition: 'spikes',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers < 3) {
					this.add('-sidestart', side, 'Spikes');
					this.effectData.layers++;
				}
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
		basePower: false,
		basePowerCallback: function(pokemon) {
			if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) return false;
			return pokemon.volatiles['stockpile'].layers * 100;
		},
		category: "Special",
		desc: "Power increases with user's Stockpile count; fails with zero Stockpiles.",
		shortDesc: "More power with more uses of Stockpile.",
		id: "spitup",
		name: "Spit Up",
		pp: 10,
		priority: 0,
		onTryHit: function(target, pokemon) {
			if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) return false;
		},
		onMoveFail: function(pokemon) {
			pokemon.removeVolatile('stockpile');
		},
		afterMoveCallback: function(pokemon) {
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
		desc: "The target's most recent move is reduced by 4 PP; this fails if the target has not yet performed a move, if the target's last move has run out of PP, or if the target can only use Struggle.",
		shortDesc: "Lowers the PP of the target's last move by 4.",
		id: "spite",
		name: "Spite",
		pp: 10,
		isBounceable: true,
		priority: 0,
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
		desc: "Doesn't do anything (but we still love it). Unfortunately, it also cannot be used during the effects of Gravity! :(",
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
		target: "normal",
		type: "Normal"
	},
	"spore": {
		num: 147,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		shortDesc: "Puts the target to sleep.",
		id: "spore",
		name: "Spore",
		pp: 15,
		isViable: true,
		priority: 0,
		status: 'slp',
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"stealthrock": {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Damages opponents every time they switch in until they use Rapid Spin. Saps a fraction of max HP determined by the effectiveness of Rock-type attacks against the opponent's type: 1/32 for 1/4x, 1/16 for 1/2x, 1/8 for 1x, 1/4 for 2x and 1/2 for 4x. For example, Stealth Rock saps 50% of an Ice/Flying Pokemon's max HP when it switches in.",
		shortDesc: "Hurts foes on switch-in. Factors Rock weakness.",
		id: "stealthrock",
		name: "Stealth Rock",
		pp: 20,
		isViable: true,
		isBounceable: true,
		priority: 0,
		sideCondition: 'stealthrock',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart',side,'move: Stealth Rock');
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
		desc: "Has a 10% chance to raise the user's Defense by 1 stage.",
		shortDesc: "10% chance to boost the user's Defense by 1.",
		id: "steelwing",
		name: "Steel Wing",
		pp: 25,
		isContact: true,
		priority: 0,
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
	"stockpile": {
		num: 254,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Can be used up to three times to power Spit Up or Swallow. Also raises the user's Defense and Special Defense by 1 stage each. Stockpiles and the defensive boosts are lost when these Swallow or Spit Up is used or the user switches out. However, the boosts can be Baton Passed.",
		shortDesc: "Boosts user's Defense, Sp. Def by 1. Max 3 uses.",
		id: "stockpile",
		name: "Stockpile",
		pp: 20,
		isViable: true,
		priority: 0,
		onTryHit: function(pokemon) {
			if (pokemon.volatiles['stockpile'] && pokemon.volatiles['stockpile'].layers >= 3) return false;
		},
		volatileStatus: 'stockpile',
		effect: {
			onStart: function(target) {
				this.effectData.layers = 1;
				this.add('-start',target,'stockpile'+this.effectData.layers);
				this.boost({def:1, spd:1});
			},
			onRestart: function(target) {
				if (this.effectData.layers < 3) {
					this.effectData.layers++;
					this.add('-start',target,'stockpile'+this.effectData.layers);
					this.boost({def:1, spd:1});
				}
			},
			onEnd: function(target) {
				var layers = this.effectData.layers * -1;
				this.effectData.layers = 0;
				this.boost({def:layers, spd:layers});
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
		basePowerCallback: function(pokemon, target) {
			if (target.volatiles['minimize']) return 130;
			return 65;
		},
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch; also gains doubled power against Minimized Pokemon.",
		shortDesc: "30% chance to flinch the target.",
		id: "stomp",
		name: "Stomp",
		pp: 20,
		isContact: true,
		priority: 0,
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
		desc: "Has a high critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		id: "stoneedge",
		name: "Stone Edge",
		pp: 5,
		isViable: true,
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
		desc: "Deals variable damage depending on the stat modifications of the user. When the user has no stat modifications, Stored Power's base power is 20. Its power increases by 20 for each stat boost the user has, and does not decrease in power due to stat drops below 0. It reaches a maximum power of 860, where all stats are maximized.",
		shortDesc: "+20 power for each of the user's stat boosts.",
		id: "storedpower",
		name: "Stored Power",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"stormthrow": {
		num: 480,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Always results in a critical hit.",
		shortDesc: "Always results in a critical hit.",
		id: "stormthrow",
		name: "Storm Throw",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"steamroller": {
		accuracy: 100,
		basePower: 65,
		basePowerCallback: function(pokemon, target) {
			if (target.volatiles['minimize']) return 130;
			return 65;
		},
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch; also gains doubled power against Minimized Pokemon.",
		shortDesc: "30% chance to flinch the target.",
		id: "steamroller",
		name: "Steamroller",
		pp: 20,
		isContact: true,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "strength",
		name: "Strength",
		pp: 15,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"stringshot": {
		num: 81,
		accuracy: 95,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Speed by 1 stage.",
		shortDesc: "Lowers the foe(s) Speed by 1.",
		id: "stringshot",
		name: "String Shot",
		pp: 40,
		priority: 0,
		boosts: {
			spe: -1
		},
		secondary: false,
		target: "foes",
		type: "Bug"
	},
	"struggle": {
		num: 165,
		accuracy: true,
		basePower: 50,
		category: "Physical",
		desc: "Used automatically when all of the user's other moves have run out of PP or are otherwise inaccessible. The user receives recoil damage equal to 1/4 of its max HP. Struggle is classified as a typeless move and will hit any Pokemon for normal damage.",
		shortDesc: "User loses 25% of its max HP as recoil.",
		id: "struggle",
		name: "Struggle",
		pp: 1,
		noPPBoosts: true,
		isContact: true,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			this.add('-message', pokemon.name+' has no moves left! (placeholder)');
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
		basePower: 30,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Special Attack by one level.",
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
		target: "normal",
		type: "Bug"
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
		isViable: true,
		priority: 0,
		status: 'par',
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"submission": {
		num: 66,
		accuracy: 80,
		basePower: 80,
		category: "Physical",
		desc: "The user receives 1/4 recoil damage.",
		shortDesc: "Has 1/4 recoil.",
		id: "submission",
		name: "Submission",
		pp: 25,
		isContact: true,
		priority: 0,
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
		desc: "The user takes one-fourth of its maximum HP to create a substitute; this move fails if the user does not have enough HP for this. Until the substitute is broken, it receives damage from all attacks made by other Pokemon and shields the user from status effects and stat modifiers caused by other Pokemon. The user is still affected by Tickle, Hail, Sandstorm and Attract from behind its Substitute. If a Substitute breaks from a hit during a multistrike move such as Fury Attack, the user takes damage from the remaining strikes.",
		shortDesc: "User takes 1/4 its max HP to put in a Substitute.",
		id: "substitute",
		name: "Substitute",
		pp: 10,
		isViable: true,
		priority: 0,
		volatileStatus: 'Substitute',
		onTryHit: function(target) {
			if (target.volatiles['substitute'] || target.maxhp === 1) { // Shedinja clause
				this.add('-fail', target, 'move: Substitute');
				return null;
			}
			if (target.hp <= target.maxhp/4) {
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
				this.effectData.hp = parseInt(target.maxhp/4);
			},
			onTryHit: function(target, source, move) {
				if (target === source) {
					this.debug('sub bypass: self hit');
					return;
				}
				if (move.category === 'Status') {
					var SubBlocked = {
						block:1, embargo:1, entrainment:1, gastroacid:1, healblock:1, healpulse:1, leechseed:1, lockon:1, meanlook:1, mindreader:1, nightmare:1, painsplit:1, psychoshift:1, simplebeam:1, skydrop:1, soak: 1, spiderweb:1, switcheroo:1, trick:1, worryseed:1, yawn:1
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
					this.runEvent('AfterSubDamage', target, source, move, damage);
					return 0; // hit
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
					this.runEvent('AfterSubDamage', target, source, move, damage);
					return 0; // hit
				}
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
		desc: "Almost always goes first, but fails if the target doesn't select a move that will damage the user. The move also fails if the target uses an attack with higher priority or if the target is faster and uses an attack with the same priority.",
		shortDesc: "Usually goes first. Fails if target is not attacking.",
		id: "suckerpunch",
		name: "Sucker Punch",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 1,
		onTryHit: function(target) {
			decision = this.willMove(target);
			if (!decision || decision.choice !== 'move' || decision.move.category === 'Status') {
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
		desc: "Cancels all other weather moves. For 5 turns: freezing is prevented, the power of Fire attacks is increased by 50%, the power of Water attacks is decreased by 50%, Solarbeam fires immediately, Thunder becomes 50% accurate, and the healing power of Morning Sun, Synthesis and Moonlight is increased from 1/2 to 2/3 of the user's max HP. The effects of Sunny Day will last for eight turns if its user is holding Heat Rock.",
		shortDesc: "For 5 turns, intense sunlight powers Fire moves.",
		id: "sunnyday",
		name: "Sunny Day",
		pp: 5,
		isViable: true,
		priority: 0,
		weather: 'sunnyday',
		secondary: false,
		target: "all",
		type: "Fire"
	},
	"superfang": {
		num: 162,
		accuracy: 90,
		basePower: false,
		damageCallback: function(pokemon, target) {
			return target.hp/2;
		},
		category: "Physical",
		desc: "This move halves the target's current HP.",
		shortDesc: "Does damage equal to 1/2 target's current HP.",
		id: "superfang",
		name: "Super Fang",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"superpower": {
		num: 276,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Lowers the user's Attack and Defense by 1 stage each after use.",
		shortDesc: "Lowers the user's Attack and Defense by 1.",
		id: "superpower",
		name: "Superpower",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Confuses the target.",
		shortDesc: "Confuses the target.",
		id: "supersonic",
		name: "Supersonic",
		pp: 20,
		isSoundBased: true,
		priority: 0,
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"surf": {
		num: 57,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Power doubles against a target who is in the middle of using Dive.",
		shortDesc: "Hits adjacent Pokemon. Power doubles on Dive.",
		id: "surf",
		name: "Surf",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "adjacent",
		type: "Water"
	},
	"swagger": {
		num: 207,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Confuses the target and raises its Attack by 2 stages.",
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
		desc: "This move only works if the user has at least one Stockpile. Restores 1/4 of user's max HP with one Stockpile, 1/2 of user's max HP with two Stockpiles and fully restores the user's HP with three Stockpiles.",
		shortDesc: "Heals the user based on uses of Stockpile.",
		id: "swallow",
		name: "Swallow",
		pp: 10,
		priority: 0,
		onTryHit: function(pokemon) {
			if (!pokemon.volatiles['stockpile'] || !pokemon.volatiles['stockpile'].layers) return false;
		},
		onHit: function(pokemon) {
			var healAmount = [4,2,1];
			this.heal(pokemon.maxhp / healAmount[pokemon.volatiles['stockpile'].layers]);
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
		desc: "Confuses the target.",
		shortDesc: "Confuses the target.",
		id: "sweetkiss",
		name: "Sweet Kiss",
		pp: 10,
		priority: 0,
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"sweetscent": {
		num: 230,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Evasion by 1 stage.",
		shortDesc: "Lowers the foe(s) Evasion by 1.",
		id: "sweetscent",
		name: "Sweet Scent",
		pp: 20,
		priority: 0,
		boosts: {
			evasion: -1
		},
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"swift": {
		num: 129,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		shortDesc: "Ignores Accuracy and Evasion modifiers of foes.",
		id: "swift",
		name: "Swift",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"switcheroo": {
		num: 415,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Exchanges items with the target unless it has Sticky Hold or Multitype. Items lost to this move cannot be recovered by using Recycle.",
		shortDesc: "User switches its held item with the target's.",
		id: "switcheroo",
		name: "Switcheroo",
		pp: 10,
		isViable: true,
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
		name: "Swords Dance",
		pp: 30,
		isViable: true,
		priority: 0,
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
		basePower: 70,
		category: "Special",
		desc: "Hits any Pokemon that shares a type with the user.",
		shortDesc: "Hits adjacent Pokemon sharing the user's type.",
		id: "synchronoise",
		name: "Synchronoise",
		pp: 15,
		priority: 0,
		onTryHit: function(target, source) {
			return target.hasType(source.types);
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"synthesis": {
		num: 235,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores a fraction of the user's max HP depending on the weather: 2/3 during Sunny Day, 1/2 during regular weather and 1/4 during Rain Dance, Hail and Sandstorm.",
		shortDesc: "Heals the user by a weather-dependent amount.",
		id: "synthesis",
		name: "Synthesis",
		pp: 5,
		isViable: true,
		priority: 0,
		heal: [1,2],
		onModifyMove: function(move) {
			if (this.weather === 'sunnyday') move.heal = [2,3];
			else if (this.weather === 'raindance' || this.weather === 'sandstorm' || this.weather === 'hail') move.heal = [1,4];
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
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "tackle",
		name: "Tackle",
		pp: 35,
		isContact: true,
		priority: 0,
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
		name: "Tail Glow",
		pp: 20,
		isViable: true,
		priority: 0,
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
		desc: "Hits 2-5 times in one turn.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "tailslap",
		name: "Tail Slap",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Lowers the target's Defense by 1 stage.",
		shortDesc: "Lowers the foe(s) Defense by 1.",
		id: "tailwhip",
		name: "Tail Whip",
		pp: 30,
		priority: 0,
		boosts: {
			def: -1
		},
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"tailwind": {
		num: 366,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Speed is doubled for every Pokemon on the user's team for 4 turns; the turn used to perform Tailwind is included in this total, as are any turns used to switch around Pokemon.",
		shortDesc: "For 4 turns, allies' Speed is doubled.",
		id: "tailwind",
		name: "Tailwind",
		pp: 30,
		isViable: true,
		priority: 0,
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
			onModifyStats: function(stats) {
				stats.spe *= 2;
			},
			onResidualOrder: 21,
			onResidualSubOrder: 4,
			onEnd: function(side) {
				this.add('-sideend', side, 'move: Tailwind');
			}
		},
		secondary: false,
		target: "allies",
		type: "Flying"
	},
	"takedown": {
		num: 36,
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		desc: "The user receives 1/4 recoil damage.",
		shortDesc: "Has 1/4 recoil.",
		id: "takedown",
		name: "Take Down",
		pp: 20,
		isContact: true,
		priority: 0,
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
		desc: "Prevents the target from using non-damaging moves for 3 turns. Assist, Copycat, Me First, Metronome, Mirror Move and Sleep Talk are prevented during this time, but Bide, Counter, Endeavor, Metal Burst and Mirror Coat are not prevented.",
		shortDesc: "For 3 turns, the target can't use status moves.",
		id: "taunt",
		name: "Taunt",
		pp: 20,
		isViable: true,
		isBounceable: true,
		priority: 0,
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
		basePower: 85,
		category: "Special",
		desc: "The type of Techno Blast depends on the type of Drive held by the user, being Normal-type if there is none held, and Electric, Fire, Ice or Water with the appropriate Drive.",
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
		desc: "Each active Pokemon, except the user, becomes confused.",
		shortDesc: "Confuses adjacent Pokemon.",
		id: "teeterdance",
		name: "Teeter Dance",
		pp: 20,
		isViable: true,
		isBounceable: false,
		priority: 0,
		volatileStatus: 'confusion',
		secondary: false,
		target: "adjacent",
		type: "Normal"
	},
	"telekinesis": {
		num: 477,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Makes the target immune to Ground-type moves and makes all moves hit the target regardless of accuracy and evasion. This does not include OHKO moves. It will fail if Gravity is in effect, and if Gravity is used while Telekinesis is in effect Gravity will supersede it.",
		shortDesc: "For 3 turns, target floats but moves can't miss it.",
		id: "telekinesis",
		name: "Telekinesis",
		pp: 15,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'telekinesis',
		effect: {
			duration: 3,
			onStart: function(target) {
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-message', target.name+' was hurled into the air! (placeholder)');
			},
			onSourceModifyMove: function(move) {
				move.accuracy = true;
			},
			onImmunity: function(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 16,
			onEnd: function(target) {
				this.add('-message', 'Telekinesis ended. (placeholder)');
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
		desc: "Escapes from wild battles; fails automatically in trainer and link battles.",
		shortDesc: "Flee from wild Pokemon battles.",
		id: "teleport",
		name: "Teleport",
		pp: 20,
		priority: 0,
		onTryHit: false,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"thief": {
		num: 168,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Steals the target's held item unless the user is already holding an item or the target has Sticky Hold or Multitype. A stolen item cannot be recovered by using Recycle.",
		shortDesc: "If the user has no item, it steals the target's.",
		id: "thief",
		name: "Thief",
		pp: 10,
		isContact: true,
		priority: 0,
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
		desc: "The user attacks uncontrollably for 2-3 turns and then gets confused.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "thrash",
		name: "Thrash",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		self: {
			volatileStatus: 'lockedmove'
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"thunder": {
		num: 87,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		desc: "Has a 30% chance to paralyze the target. It also has normal accuracy against mid-air Pokemon who have used Fly or Bounce. During Sunny Day, this move has 50% accuracy. During Rain Dance, this move will never miss under normal circumstances and has a 30% chance to hit through a target's Protect or Detect.",
		shortDesc: "30% chance to paralyze target. Can't miss in rain.",
		id: "thunder",
		name: "Thunder",
		pp: 10,
		isViable: true,
		priority: 0,
		onModifyMove: function(move) {
			if (this.weather === 'raindance') move.accuracy = true;
			else if (this.weather === 'sunnyday') move.accuracy = 50;
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
		desc: "Has a 10% chance to paralyze the target. Has 10% chance to make the target flinch. Both effects can occur from a single use.",
		shortDesc: "10% chance to paralyze. 10% chance to flinch.",
		id: "thunderfang",
		name: "Thunder Fang",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		id: "thunderpunch",
		name: "ThunderPunch",
		pp: 15,
		isViable: true,
		isContact: true,
		isPunchAttack: true,
		priority: 0,
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
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		id: "thundershock",
		name: "ThunderShock",
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
		desc: "Paralyzes the target. This move activates Motor Drive.",
		shortDesc: "Paralyzes the target.",
		id: "thunderwave",
		name: "Thunder Wave",
		pp: 20,
		isViable: true,
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
		basePower: 95,
		category: "Special",
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		id: "thunderbolt",
		name: "Thunderbolt",
		pp: 15,
		isViable: true,
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
		desc: "Lowers the target's Attack and Defense by 1 stage each.",
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
	"torment": {
		num: 259,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from using the same move for two turns in a row until the target is switched out. The target will use Struggle every other turn if it cannot attack without using the same move.",
		shortDesc: "Target can't use the same move twice in a row.",
		id: "torment",
		name: "Torment",
		pp: 15,
		isViable: true,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'torment',
		effect: {
			onStart: function(pokemon) {
				this.add('-start', pokemon, 'Torment');
			},
			onEnd: function(pokemon) {
				this.add('-end', pokemon, 'Torment');
			},
			onModifyPokemon: function(pokemon) {
				pokemon.disabledMoves[pokemon.lastMove] = true;
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
		desc: "The target is badly poisoned, with the damage caused by poison doubling after each turn. Toxic poisoning will remain with the Pokemon during the battle even after switching out.",
		shortDesc: "Badly poisons the target.",
		id: "toxic",
		name: "Toxic",
		pp: 10,
		isViable: true,
		priority: 0,
		status: 'tox',
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"toxicspikes": {
		num: 390,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Opponents will be poisoned as they enter the field until they use Rapid Spin. One layer inflicts regular poison while two layers inflict Toxic; switching in a non-Flying-type Poison Pokemon without Levitate will remove any layers. Flying-type and Levitate Pokemon are only affected if they switch in while Gravity is in effect, Iron Ball is their held item or they are receiving a Baton Passed Ingrain; Steel-type Pokemon and Pokemon who enter with Baton Passed Substitutes are not affected.",
		shortDesc: "Poisons grounded foes on switch-in. Max 2 layers.",
		id: "toxicspikes",
		name: "Toxic Spikes",
		pp: 20,
		isViable: true,
		isBounceable: true,
		priority: 0,
		sideCondition: 'toxicspikes',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers < 2) {
					this.add('-sidestart', side, 'move: Toxic Spikes');
					this.effectData.layers++;
				}
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
		desc: "The user morphs into a near-exact copy of the target. Stats, stat modifiers, type, moves, Hidden Power data and appearance are changed; the user's level and HP remain the same and each copied move receives only 5 PP. (If Transform is used by Ditto, the effects of Metal Powder and Quick Powder stop working after transformation.)",
		shortDesc: "Copies target's stats, moves, types, and Ability.",
		id: "transform",
		name: "Transform",
		pp: 10,
		priority: 0,
		onHit: function(target, pokemon) {
			if (!pokemon.transformInto(target)) {
				return false;
			}
			this.add('-transform', pokemon, target);
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
		desc: "Has a 20% chance to burn, paralyze or freeze the target.",
		shortDesc: "20% chance to paralyze or burn or freeze target.",
		id: "triattack",
		name: "Tri Attack",
		pp: 10,
		isViable: true,
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
		desc: "Exchanges items with the target unless it has Sticky Hold or Multitype. Items lost to this move cannot be recovered by using Recycle.",
		shortDesc: "User switches its held item with the target's.",
		id: "trick",
		name: "Trick",
		pp: 10,
		isViable: true,
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
	"trickroom": {
		num: 433,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Always goes last. Attacking order is reversed for all active Pokemon for five turns; the slowest Pokemon moves first and vice versa. Note that move order is still determined by the regular priority categories and the effects of Trick Room apply only when Pokemon have chosen moves with the same priority. Using Trick Room a second time reverses this effect. This effect is also ignored by Stall and held items that may affect the turn order: Full Incense, Lagging Tail and Quick Claw.",
		shortDesc: "For 5 turns, slower Pokemon move first.",
		id: "trickroom",
		name: "Trick Room",
		pp: 5,
		isViable: true,
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
			},
			onModifyPokemonPriority: -100,
			onModifyPokemon: function(pokemon) {
				// just for fun: Trick Room glitch
				if (pokemon.stats.spe <= 1809) {
					pokemon.stats.spe = -pokemon.stats.spe;
				}
				if (pokemon.unboostedStats.spe <= 1809) {
					pokemon.unboostedStats.spe = -pokemon.unboostedStats.spe;
				}
			},
			onResidualOrder: 23,
			onEnd: function() {
				this.add('-fieldend', 'move: Trick Room');
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
		desc: "Attacks three times in one turn, adding 10 BP for each kick. If a kick misses, the move ends instantly; if one of the kicks breaks a target's Substitute, the real Pokemon will take damage for the remaining kicks.",
		shortDesc: "Hits 3 times. Each hit can miss, but power rises.",
		id: "triplekick",
		name: "Triple Kick",
		pp: 10,
		isContact: true,
		priority: 0,
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
		basePower: false,
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
		desc: "This move's base power increases as its remaining PP decreases.",
		shortDesc: "More power the fewer PP this move has left.",
		id: "trumpcard",
		name: "Trump Card",
		pp: 5,
		noPPBoosts: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"twineedle": {
		num: 41,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Strikes twice; if the first hit breaks the target's Substitute, the real Pokemon will take damage from the second hit. Has a 20% chance to poison the target .",
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
		desc: "Has a 20% chance to make the target flinch; power doubles while the target is in mid-air via Fly or Bounce.",
		shortDesc: "20% chance to flinch the foe(s).",
		id: "twister",
		name: "Twister",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch'
		},
		target: "foes",
		type: "Dragon"
	},
	"uturn": {
		num: 369,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "The user switches out after use, even if it is currently trapped by another Pokemon. When a faster Pokemon uses Pursuit against a U-Turner, the U-Turner is hit for normal damage; when a slower Pokemon uses Pursuit against a U-Turner, the U-Turner makes its attack, then is hit by Pursuit for double power, and switches out.",
		shortDesc: "User switches out after damaging the target.",
		id: "uturn",
		name: "U-turn",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "The user causes an Uproar and attacks uncontrollably for 3 turns. During the effects of the Uproar, active Pokemon cannot fall asleep and sleeping Pokemon sent into battle will wake up.",
		shortDesc: "Lasts 3 turns. Active Pokemon cannot fall asleep.",
		id: "uproar",
		name: "Uproar",
		pp: 10,
		isSoundBased: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"vcreate": {
		num: 557,
		accuracy: 95,
		basePower: 180,
		category: "Physical",
		desc: "Lowers the user's Defense, Special Defense, and Speed by one stage.",
		shortDesc: "Lowers the user's Defense, Sp. Def, Speed by 1.",
		id: "vcreate",
		name: "V-create",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "Usually goes first.",
		shortDesc: "Usually goes first.",
		id: "vacuumwave",
		name: "Vacuum Wave",
		pp: 30,
		isViable: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"venoshock": {
		num: 474,
		accuracy: 100,
		basePower: 65,
		basePowerCallback: function(pokemon,target) {
			if (target.status === 'psn') {
				return 130;
			}
			return 65;
		},
		category: "Special",
		desc: "Inflicts double damage if the target is Poisoned.",
		shortDesc: "Power doubles if the target is poisoned.",
		id: "venoshock",
		name: "Venoshock",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"vicegrip": {
		num: 11,
		accuracy: 100,
		basePower: 55,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "vicegrip",
		name: "ViceGrip",
		pp: 30,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"vinewhip": {
		num: 22,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "vinewhip",
		name: "Vine Whip",
		pp: 15,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"vitalthrow": {
		num: 233,
		accuracy: true,
		basePower: 70,
		category: "Physical",
		desc: "This move usually goes last. It ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		shortDesc: "Ignores Accuracy and Evasion mods. Goes last.",
		id: "vitalthrow",
		name: "Vital Throw",
		pp: 10,
		isContact: true,
		priority: -1,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"voltswitch": {
		num: 521,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "User switches out after doing damage.",
		shortDesc: "User switches out after damaging the target.",
		id: "voltswitch",
		name: "Volt Switch",
		pp: 20,
		isViable: true,
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
		desc: "The user receives 1/3 recoil damage; has a 10% chance to paralyze the target.",
		shortDesc: "Has 1/3 recoil. 10% chance to paralyze target.",
		id: "volttackle",
		name: "Volt Tackle",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		recoil: [1,3],
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
		basePower: 60,
		basePowerCallback: function(pokemon, target) {
			if (target.status === 'slp') return 120;
			return 60;
		},
		category: "Physical",
		desc: "If the target is asleep, power is doubled but the target will awaken.",
		shortDesc: "Power doubles if target is asleep, and wakes it.",
		id: "wakeupslap",
		name: "Wake-Up Slap",
		pp: 10,
		isContact: true,
		priority: 0,
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
		desc: "Deals damage with no additional effect.",
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
		basePower: 50,
		category: "Special",
		desc: "If it is followed on the same turn by Fire Oath it will double the probability of secondary effects taking place for four turns. This effect does not stack with Serene Grace.	If it follows Grass Oath on the same turn, it will decrease the speed of all foes by half for four turns.",
		shortDesc: "Use with Grass or Fire Pledge for added effect.",
		id: "waterpledge",
		name: "Water Pledge",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
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
		secondary: {
			chance: 20,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Water"
	},
	"watersport": {
		num: 346,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "All Fire-type moves are weakened by two-thirds until the user switches out.",
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
			onAnyBasePower: function(basePower, user, target, move) {
				if (move.type === 'Fire') return basePower / 3;
			}
		},
		secondary: false,
		target: "all",
		type: "Water"
	},
	"waterspout": {
		num: 323,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon) {
			return parseInt(150*pokemon.hp/pokemon.maxhp);
		},
		category: "Special",
		desc: "Base power decreases as the user's HP decreases.",
		shortDesc: "Less power as user's HP decreases. Hits foe(s).",
		id: "waterspout",
		name: "Water Spout",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "foes",
		type: "Water"
	},
	"waterfall": {
		num: 127,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 20% chance to make the target flinch.",
		shortDesc: "20% chance to flinch the target.",
		id: "waterfall",
		name: "Waterfall",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch'
		},
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
		desc: "Base power is 50; Base power doubles and move's type changes during weather effects: becomes Fire-type during Sunny Day, Water-type during Rain Dance, Ice-type during Hail and Rock-type during Sandstorm.",
		shortDesc: "Power doubles and type varies in each weather.",
		id: "weatherball",
		name: "Weather Ball",
		pp: 10,
		isViable: true,
		priority: 0,
		onModifyMove: function(move) {
			switch (this.weather) {
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
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn. Base power also doubles when performed against a Pokemon in the middle of using Dive.",
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
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes last; in trainer battles, the target is switched out for a random member of its team. Escapes from wild battles. Has no effect if the target has Suction Cups or used Ingrain.",
		shortDesc: "Forces the target to switch to a random ally.",
		id: "whirlwind",
		name: "Whirlwind",
		pp: 20,
		isViable: true,
		priority: -6,
		forceSwitch: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"wideguard": {
		num: 469,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Protects the user and allies from multi-target attacks.",
		shortDesc: "Protects allies from multi-target hits for one turn.",
		id: "wideguard",
		name: "Wide Guard",
		pp: 10,
		priority: 3,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"wildcharge": {
		num: 528,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "User receives 1/4 the damage it inflicts in recoil.",
		shortDesc: "Has 1/4 recoil.",
		id: "wildcharge",
		name: "Wild Charge",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		recoil: [1,4],
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"willowisp": {
		num: 261,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Burns the target. This move activates Flash Fire.",
		shortDesc: "Burns the target.",
		id: "willowisp",
		name: "Will-O-Wisp",
		pp: 15,
		isViable: true,
		priority: 0,
		status: 'brn',
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"wingattack": {
		num: 17,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "wingattack",
		name: "Wing Attack",
		pp: 35,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"wish": {
		num: 273,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "At the end of the next turn, the active Pokemon from the user's team is healed by 1/2 of the user's HP; this can be any member of the user's team.",
		shortDesc: "Next turn, 50% of the user's max HP is restored.",
		id: "wish",
		name: "Wish",
		pp: 10,
		isViable: true,
		priority: 0,
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
					if (damage) this.add('-heal', target, target.hpChange(damage), '[from] move: Wish', '[wisher] '+source.name);
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
		basePower: false,
		category: "Status",
		desc: "Swaps the Defense and Special Defense of all Pokemon for the next five turns.",
		shortDesc: "For 5 turns, all Defense and Sp. Def stats switch.",
		id: "wonderroom",
		name: "Wonder Room",
		pp: 10,
		priority: -7,
		onFieldHit: function(target, source, effect) {
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
			onModifyStatsPriority: -100,
			onModifyStats: function(stats) {
				var tmp = stats.spd;
				stats.spd = stats.def;
				stats.def = tmp;
			},
			onResidualOrder: 24,
			onEnd: function() {
				this.add('-fieldend', 'move: Wonder Room');
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"woodhammer": {
		num: 452,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user receives 1/3 recoil damage.",
		shortDesc: "Has 1/3 recoil.",
		id: "woodhammer",
		name: "Wood Hammer",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		recoil: [1,3],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"workup": {
		num: 526,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Attack and Special Attack by one stage.",
		shortDesc: "Boosts the user's Attack and Sp. Atk by 1.",
		id: "workup",
		name: "Work Up",
		pp: 30,
		isViable: true,
		priority: 0,
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
		desc: "The target's ability, unless it has Multitype or Truant, is changed to Insomnia until it switches out.",
		shortDesc: "The target's Ability becomes Insomnia.",
		id: "worryseed",
		name: "Worry Seed",
		pp: 10,
		isBounceable: true,
		priority: 0,
		onTryHit: function(pokemon) {
			if (pokemon.ability === 'multitype' || pokemon.ability === 'truant') {
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
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"wrap": {
		num: 35,
		accuracy: 90,
		basePower: 15,
		category: "Physical",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "wrap",
		name: "Wrap",
		pp: 20,
		isContact: true,
		priority: 0,
		volatileStatus: 'partiallytrapped',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"wringout": {
		num: 378,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			return parseInt(120*target.hp/target.maxhp);
		},
		category: "Special",
		desc: "Base power decreases as the target's HP decreases.",
		shortDesc: "More power the more HP the target has left.",
		id: "wringout",
		name: "Wring Out",
		pp: 5,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"xscissor": {
		num: 404,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		shortDesc: "No additional effect.",
		id: "xscissor",
		name: "X-Scissor",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"yawn": {
		num: 281,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If the target stays in battle, it falls asleep at the end of the next turn.",
		shortDesc: "Puts the target to sleep after 1 turn.",
		id: "yawn",
		name: "Yawn",
		pp: 10,
		isViable: true,
		isBounceable: true,
		priority: 0,
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
		desc: "Paralyzes the target.",
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
		desc: "Has a 20% chance to make the target flinch.",
		shortDesc: "20% chance to flinch the target.",
		id: "zenheadbutt",
		name: "Zen Headbutt",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
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
		desc: "20% chance of lowering target's Attack.",
		shortDesc: "20% chance to lower the target's Attack by 1.",
		id: "paleowave",
		name: "Paleo Wave",
		pp: 15,
		isViable: true,
		isNonstandard: true,
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
		desc: "50% chance of lowering target's Defense.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "shadowstrike",
		name: "ShadowStrike",
		pp: 10,
		isViable: true,
		isContact: true,
		isNonstandard: true,
		priority: 0,
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
		desc: "Drains, confuses, makes it rain for 5 turns, gives the user Magic Coat and Aqua Ring, and decreases some of the foe's stats, but user must recharge afterwards.",
		shortDesc: "Does many things turn 1. Can't move turn 2.",
		id: "magikarpsrevenge",
		name: "Magikarp's Revenge",
		pp: 10,
		isViable: true,
		isContact: true,
		isNonstandard: true,
		priority: 0,
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
