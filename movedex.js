exports.BattleMovedex = {
	"Absorb": {
		num: 71,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
		id: "Absorb",
		name: "Absorb",
		pp: 25,
		priority: 0,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"Acid": {
		num: 51,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		id: "Acid",
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
	"AcidArmor": {
		num: 151,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		id: "AcidArmor",
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
	"AcidSpray": {
		num: 491,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Lowers the target's Special Defense by two stages.",
		id: "AcidSpray",
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
	"Acrobatics": {
		num: 512,
		accuracy: 100,
		basePower: 55,
		basePowerCallback: function(pokemon) {
			if (!pokemon.item || pokemon.item === 'FlyingGem')
			{
				this.debug("Power doubled for no item.");
				return 110;
			}
			return 55;
		},
		category: "Physical",
		desc: "Acrobat allows the user to hit any target that is not in their attack range in a triple battle. The power is also doubled if the user has no held item.",
		id: "Acrobatics",
		name: "Acrobatics",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "any",
		type: "Flying"
	},
	"Acupressure": {
		num: 367,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "One of the user's stats, including Accuracy or Evasion, is randomly selected and boosted by 2 stages. A stat which is already at max will not be selected. User can also select its partner in 2v2 battles to randomly boost one of its stats.",
		id: "Acupressure",
		name: "Acupressure",
		pp: 30,
		onHit: function(target) {
			var stats = [];
			for (var i in target.boosts)
			{
				if (target.boosts[i] < 6)
				{
					stats.push(i);
				}
			}
			if (stats.length)
			{
				var i = stats[parseInt(Math.random()*stats.length)];
				var boost = {};
				boost[i] = 2;
				this.boost(boost);
			}
			else
			{
				return false;
			}
		},
		priority: 0,
		secondary: false,
		target: "ally",
		type: "Normal"
	},
	"AerialAce": {
		num: 332,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		id: "AerialAce",
		name: "Aerial Ace",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"Aeroblast": {
		num: 177,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		desc: "Has a high critical hit ratio.",
		id: "Aeroblast",
		name: "Aeroblast",
		pp: 5,
		isViable: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"AfterYou": {
		num: 495,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "After this move is used, the next turn the target will attack first, ignoring priority.",
		id: "AfterYou",
		name: "After You",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Agility": {
		num: 97,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages.",
		id: "Agility",
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
	"AirCutter": {
		num: 314,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Has a high critical hit ratio.",
		id: "AirCutter",
		name: "Air Cutter",
		pp: 25,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "foes",
		type: "Flying"
	},
	"AirSlash": {
		num: 403,
		accuracy: 95,
		basePower: 75,
		category: "Special",
		desc: "Has a 30% chance to make the target flinch.",
		id: "AirSlash",
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
	"AllySwitch": {
		num: 502,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "User switches places with a random ally.",
		id: "AllySwitch",
		name: "Ally Switch",
		pp: 15,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Amnesia": {
		num: 133,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Defense by 2 stages.",
		id: "Amnesia",
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
	"AncientPower": {
		num: 246,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 10% chance to raise all of the user's stats by 1 stage.",
		id: "AncientPower",
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
	"AquaJet": {
		num: 453,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Usually goes first.",
		id: "AquaJet",
		name: "Aqua Jet",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"AquaRing": {
		num: 392,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user recovers 1/16 of its max HP per turn until it faints or switches out; this can be Baton Passed to another Pokemon.",
		id: "AquaRing",
		name: "Aqua Ring",
		pp: 20,
		priority: 0,
		volatileStatus: 'AquaRing',
		effect: {
			onStart: function(pokemon) {
				this.add('r-volatile '+pokemon.id+' aqua-ring');
			},
			onResidualPriority: 50-6,
			onResidual: function(pokemon) {
				this.heal(pokemon.maxhp/16);
			}
		},
		secondary: false,
		target: "self",
		type: "Water"
	},
	"AquaTail": {
		num: 401,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "AquaTail",
		name: "Aqua Tail",
		pp: 10,
		isContact: true,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"ArmThrust": {
		num: 292,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "ArmThrust",
		name: "Arm Thrust",
		pp: 20,
		isContact: true,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Aromatherapy": {
		num: 312,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Every Pokemon in the user's party is cured of status conditions. Lists every Pokemon that was healed, and what status condition was cured. ",
		id: "Aromatherapy",
		name: "Aromatherapy",
		pp: 5,
		isViable: true,
		priority: 0,
		onHit: function(side, source) {
			for (var i=0; i<side.pokemon.length; i++)
			{
				side.pokemon[i].status = '';
			}
			this.add('r-cure-all '+source.id+' Aromatherapy');
		},
		secondary: false,
		target: "allySide",
		type: "Grass"
	},
	"Assist": {
		num: 274,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user performs a random move from any of the Pokemon on its team. Assist cannot generate itself, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief or Trick.",
		id: "Assist",
		name: "Assist",
		pp: 20,
		priority: 0,
		onHit: function(target) {
			var moves = [];
			for (var j=0; j<target.side.pokemon.length; j++)
			{
				var pokemon = target.side.pokemon[j];
				for (var i=0; i<pokemon.moves.length; i++)
				{
					var move = pokemon.moves[i];
					var NoAssist = {
						Assist:1, Chatter:1, CircleThrow:1, Copycat:1, Counter:1, Covet:1, DestinyBond:1, Detect:1, DragonTail:1, Endure:1, Feint:1, FocusPunch:1, FollowMe:1, HelpingHand:1, MeFirst:1, Metronome:1, Mimic:1, MirrorCoat:1, MirrorMove:1, Protect:1, QuickGuard:1, Sketch:1, SleepTalk:1, Snatch:1, Struggle:1, Switcheroo:1, Thief:1, Trick:1, WideGuard:1
					};
					if (!NoAssist[move])
					{
						moves.push(move);
					}
				}
			}
			var move = '';
			if (moves.length) move = moves[parseInt(Math.random()*moves.length)];
			if (!move)
			{
				return false;
			}
			this.useMove(move, target);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Assurance": {
		num: 372,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Base power doubles if, since the beginning of the current turn, the target has taken residual damage from any factors such as recoil, Spikes, Stealth Rock or the effects of holding Life Orb.",
		id: "Assurance",
		name: "Assurance",
		pp: 10,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"Astonish": {
		num: 310,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "Astonish",
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
	"AttackOrder": {
		num: 454,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "AttackOrder",
		name: "Attack Order",
		pp: 15,
		isViable: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"Attract": {
		num: 213,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Infatuates Pokemon of the opposite gender, even if they have a Substitute, causing a 50% chance for the target's attack to fail.",
		id: "Attract",
		name: "Attract",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"AuraSphere": {
		num: 396,
		accuracy: true,
		basePower: 90,
		category: "Special",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		id: "AuraSphere",
		name: "Aura Sphere",
		pp: 20,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"AuroraBeam": {
		num: 62,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Attack by 1 stage.",
		id: "AuroraBeam",
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
	"Autotomize": {
		num: 475,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Speed by two stages.",
		id: "Autotomize",
		name: "Autotomize",
		pp: 15,
		isViable: true,
		priority: 3,
		volatileStatus: 'Autotomize',
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(pokemon) {
				this.add('message '+pokemon.name+' became nimble! (placeholder)');
			},
			onModifyPokemon: function(pokemon) {
				pokemon.weightkg /= 2;
			}
		},
		boosts: {
			spe: 2
		},
		secondary: false,
		target: "self",
		type: "Steel"
	},
	"Avalanche": {
		num: 419,
		accuracy: true,
		basePower: 60,
		basePowerCallback: function(pokemon, target) {
			if (!pokemon.lastHitBy || !pokemon.lastHitBy.thisTurn)
			{
				return 60;
			}
			var move = this.getMove(pokemon.lastHitBy.move);
			if (move.category === 'Status')
			{
				return 60;
			}
			this.debug('Boosted for getting hit by '+pokemon.lastHitBy.move);
			return 120;
		},
		category: "Physical",
		desc: "Base power is 60. Almost always goes last, even after another Pokemon's Focus Punch; this move's base power doubles if the user is damaged before its turn.",
		id: "Avalanche",
		name: "Avalanche",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: -4,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"Barrage": {
		num: 140,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "Barrage",
		name: "Barrage",
		pp: 20,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Barrier": {
		num: 112,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		id: "Barrier",
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
	"BatonPass": {
		num: 226,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user returns to its party, bypassing any trapping moves and Pursuit; it passes all stat modifiers (positive or negative, including from Charge and Stockpile), as well as confusion, Focus Energy/Lansat Berry boosts, Ingrain, Aqua Ring, Embargo, Gastro Acid, Power Trick, Magnet Rise, Stockpiles, Perish Song count, Mist, Leech Seed, Ghost Curses, Mind Reader, Lock-On, Block, Mean Look, Spider Web and Substitute to the replacement Pokemon.",
		id: "BatonPass",
		name: "Baton Pass",
		pp: 40,
		isViable: true,
		priority: 0,
		batonPass: true,
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"BeatUp": {
		num: 251,
		accuracy: true,
		basePower: false,
		category: "Physical",
		desc: "Each healthy (i.e. not fainted nor inflicted with a status condition) Pokemon in your party contributes a typeless 10 base power hit determined solely by their base Attack and Defense stats.",
		id: "BeatUp",
		name: "Beat Up",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"BellyDrum": {
		num: 187,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user maximizes its Attack but sacrifices 50% of its max HP.",
		id: "BellyDrum",
		name: "Belly Drum",
		pp: 10,
		isViable: true,
		priority: 0,
		onHit: function(target) {
			if (target.hp <= target.maxhp/2)
			{
				return false;
			}
			target.damage(target.maxhp/2);
			target.setBoost({atk: 6});
			this.add('r-belly-drum '+target.id);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Bestow": {
		num: 516,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Gives the user's held item to the target.",
		id: "Bestow",
		name: "Bestow",
		pp: 15,
		priority: 0,
		onHit: function(target, source) {
			if (target.item)
			{
				return false;
			}
			var yourItem = source.takeItem();
			if (!yourItem)
			{
				return false;
			}
			if (!target.setItem(yourItem))
			{
				return false;
			}
			this.add('r-trick-get '+target.id+' '+yourItem.id);
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Bide": {
		num: 117,
		accuracy: true,
		basePower: false,
		category: "Physical",
		desc: "Usually goes first for the duration of the move. The user absorbs all damage for two turns and then, during the third turn, the user inflicts twice the absorbed damage on the last pokemon that hit it. This move ignores the target's type and even hits Ghost-type Pokemon.",
		id: "Bide",
		name: "Bide",
		pp: 10,
		isContact: true,
		priority: 1,
		volatileStatus: 'Bide',
		effect: {
			duration: 3,
			onStart: function() {
				this.effectData.totalDamage = 0;
			},
			onDamage: function(damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source || source.side === target.side) return;
				this.effectData.totalDamage += damage;
				this.effectData.sourcePosition = source.position;
				this.effectData.sourceSide = source.side;
			},
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('Bide');
			},
			onAfterSetStatus: function(status, pokemon) {
				if (status.id === 'slp')
				{
					pokemon.removeVolatile('Bide');
				}
			},
			onBeforeMove: function(pokemon) {
				if (this.effectData.duration === 1)
				{
					if (!this.effectData.totalDamage)
					{
						this.add('r-failed '+pokemon.id);
						return false;
					}
					this.add('message Unleashed energy. (placeholder)');
					var target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					this.moveHit(target, pokemon, 'Bide', {damage: this.effectData.totalDamage*2});
					return false;
				}
				this.add('message Storing energy. (placeholder)');
				return false;
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Bind": {
		num: 20,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
		id: "Bind",
		name: "Bind",
		pp: 20,
		isContact: true,
		priority: 0,
		volatileStatus: 'partiallyTrapped',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Bite": {
		num: 44,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "Bite",
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
	"BlastBurn": {
		num: 307,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
		id: "BlastBurn",
		name: "Blast Burn",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustRecharge'
		},
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"BlazeKick": {
		num: 299,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Has a high critical hit ratio and a 10% chance to burn the target.",
		id: "BlazeKick",
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
	"Blizzard": {
		num: 59,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		desc: "Has a 10% chance to freeze the target. During Hail, this move will never miss under normal circumstances and has a 30% chance to hit through a target's Protect or Detect.",
		id: "Blizzard",
		name: "Blizzard",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'frz'
		},
		target: "foes",
		type: "Ice"
	},
	"Block": {
		num: 335,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "As long as the user remains in battle, the target cannot switch out unless it is holding Shed Shell or uses Baton Pass or U-Turn. The target will still be trapped if the user switches out by using Baton Pass.",
		id: "Block",
		name: "Block",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"BlueFlare": {
		num: 551,
		accuracy: 85,
		basePower: 130,
		category: "Special",
		desc: "Has a 20% chance to burn the target.",
		id: "BlueFlare",
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
	"BodySlam": {
		num: 34,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		id: "BodySlam",
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
	"BoltStrike": {
		num: 550,
		accuracy: 85,
		basePower: 130,
		category: "Physical",
		desc: "Has a 20% chance to paralyze the target.",
		id: "BoltStrike",
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
	"BoneClub": {
		num: 125,
		accuracy: 85,
		basePower: 65,
		category: "Physical",
		desc: "Has a 10% chance to make the target flinch.",
		id: "BoneClub",
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
	"BoneRush": {
		num: 198,
		accuracy: 80,
		basePower: 25,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "BoneRush",
		isViable: true,
		name: "Bone Rush",
		pp: 10,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"Bonemerang": {
		num: 155,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		desc: "Strikes twice; if the first hit breaks the target's Substitute, the real Pokemon will take damage from the second hit.",
		id: "Bonemerang",
		name: "Bonemerang",
		pp: 10,
		isViable: true,
		priority: 0,
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"Bounce": {
		num: 340,
		accuracy: 85,
		basePower: 85,
		category: "Physical",
		desc: "On the first turn, the user bounces into the air, becoming uncontrollable, and evades most attacks. Gust, Twister, Thunder and Sky Uppercut have normal accuracy against a mid-air Pokemon, with Gust and Twister also gaining doubled power. The user may also be hit in mid-air if it was previously targeted by Lock-On or Mind Reader or if it is attacked by a Pokemon with No Guard. On the second turn, the user descends and has a 30% chance to paralyze the target.",
		id: "Bounce",
		name: "Bounce",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('Bounce')) return;
			pokemon.addVolatile('Bounce');
			this.add('prepare-move '+pokemon.id+' Bounce');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('Bounce');
			},
			onSourceModifyMove: function(move) {
				
				// warning: does not work the same way as Fly
				
				if (move.target === 'foeSide') return;
				if (move.id === 'Gust' || move.id === 'Twister' || move.id === 'Thunder')
				{
					// should not normally be done in ModifyMove event,
					// but these moves have static base power, and
					// it's faster to do this  here than in
					// BasePower event
					move.basePower *= 2;
					return;
				}
				else if (move.id === 'Sky Uppercut')
				{
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
	"BraveBird": {
		num: 413,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user receives 1/3 recoil damage.",
		id: "BraveBird",
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
	"BrickBreak": {
		num: 280,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Reflect and Light Screen are removed from the target's field even if the attack misses or the target is a Ghost-type.",
		id: "BrickBreak",
		name: "Brick Break",
		pp: 15,
		isViable: true,
		isContact: true,
		self: {
			onHit: function(pokemon) {
				// will shatter screens through sub
				pokemon.side.foe.removeSideCondition('Reflect');
				pokemon.side.foe.removeSideCondition('LightScreen');
			}
		},
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Brine": {
		num: 362,
		accuracy: true,
		basePower: 65,
		basePowerCallback: function(pokemon, target) {
			if (target.hp * 2 < target.maxhp) return 130;
			return 65;
		},
		category: "Special",
		desc: "Base power is 65, doubles if the target is at least 50% below full health.",
		id: "Brine",
		name: "Brine",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"Bubble": {
		num: 145,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Speed by 1 stage.",
		id: "Bubble",
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
	"BubbleBeam": {
		num: 61,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Speed by 1 stage.",
		id: "BubbleBeam",
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
	"BugBite": {
		num: 450,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "The user eats the target's held berry and, if applicable, receives its benefits. Jaboca Berry will be removed without damaging the user, but Tanga Berry will still activate and reduce this move's power. The target can still recover its held berry by using Recycle.",
		id: "BugBite",
		name: "Bug Bite",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"BugBuzz": {
		num: 405,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		id: "BugBuzz",
		name: "Bug Buzz",
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
		type: "Bug"
	},
	"BulkUp": {
		num: 339,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Defense by 1 stage each.",
		id: "BulkUp",
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
	"Bulldoze": {
		num: 523,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 100% chance to lower the target's Speed by one level.",
		id: "Bulldoze",
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
	"BulletPunch": {
		num: 418,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Usually goes first.",
		id: "BulletPunch",
		name: "Bullet Punch",
		pp: 30,
		isViable: true,
		isContact: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"BulletSeed": {
		num: 331,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "BulletSeed",
		name: "Bullet Seed",
		pp: 30,
		isViable: true,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"CalmMind": {
		num: 347,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack and Special Defense by 1 stage each.",
		id: "CalmMind",
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
	"Camouflage": {
		num: 293,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user's type changes according to the current terrain. It becomes Grass-type in tall grass and very tall grass (as well as in puddles), Water-type while surfing on any body of water, Rock-type while inside any caves or on any rocky terrain, Ground-type on beach sand, desert sand and dirt roads, Ice-type in snow, and Normal-type everywhere else. The user will always become Normal-type during Wi-Fi battles. ",
		id: "Camouflage",
		name: "Camouflage",
		pp: 20,
		priority: 0,
		volatileStatus: 'Camouflage',
		effect: {
			onModifyPokemon: function(pokemon) {
				pokemon.types = ['Ground'];
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Captivate": {
		num: 445,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Attack by 2 stages if the target is the opposite gender of the user. Fails if either Pokemon is genderless.",
		id: "Captivate",
		name: "Captivate",
		pp: 20,
		priority: 0,
		boosts: {
			spa: -2
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Charge": {
		num: 268,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Doubles the power of the user's Electric attacks on the next turn and increases the user's Special Defense by 1 stage.",
		id: "Charge",
		name: "Charge",
		pp: 20,
		priority: 0,
		boosts: {
			spd: 1
		},
		secondary: false,
		target: "self",
		type: "Electric"
	},
	"ChargeBeam": {
		num: 451,
		accuracy: 90,
		basePower: 50,
		category: "Special",
		desc: "Has a 70% chance to raise the user's Special Attack by 1 stage.",
		id: "ChargeBeam",
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
	"Charm": {
		num: 204,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 2 stages.",
		id: "Charm",
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
	"Chatter": {
		num: 448,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 1%, 11% or 31% chance to confuse the target if its user is Chatot. The confusion rate increases directly with the volume of a sound recorded using the DS's microphone; Chatot's default cry has a 1% chance to confuse its target and is replaced by the player's recordings. This move cannot be randomly generated by moves such as Metronome and it cannot be copied with Sketch. If another Pokemon uses Transform to turn into Chatot, its Chatter cannot cause confusion.",
		id: "Chatter",
		name: "Chatter",
		pp: 20,
		priority: 0,
		onSecondaryHit: function(target, source) {
			if (source.template.species !== 'Chatot') return false;
		},
		secondary: {
			chance: 31,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Flying"
	},
	"ChipAway": {
		num: 498,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "",
		id: "ChipAway",
		name: "Chip Away",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"CircleThrow": {
		num: 509,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		desc: null,
		id: "CircleThrow",
		name: "Circle Throw",
		pp: 10,
		isViable: true,
		priority: -6,
		secondary: {
			chance: 100,
			forceSwitch: true
		},
		target: "normal",
		type: "Fighting"
	},
	"Clamp": {
		num: 128,
		accuracy: 85,
		basePower: 35,
		category: "Physical",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
		id: "Clamp",
		name: "Clamp",
		pp: 10,
		isContact: true,
		priority: 0,
		volatileStatus: 'partiallyTrapped',
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"ClearSmog": {
		num: 499,
		accuracy: true,
		basePower: 50,
		category: "Special",
		desc: "Removes all of the target's stat changes.",
		id: "ClearSmog",
		name: "Clear Smog",
		pp: 15,
		isViable: true,
		priority: 0,
		onHit: function(target) {
			target.clearBoosts();
			this.add('r-poke-haze '+target.id);
		},
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"CloseCombat": {
		num: 370,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Lowers the user's Defense and Special Defense by 1 stage.",
		id: "CloseCombat",
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
	"Coil": {
		num: 489,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Attack, Defense, and accuracy by one stage.",
		id: "Coil",
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
	"CometPunch": {
		num: 4,
		accuracy: 85,
		basePower: 18,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "CometPunch",
		name: "Comet Punch",
		pp: 15,
		isContact: true,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"ConfuseRay": {
		num: 109,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Confuses the target.",
		id: "ConfuseRay",
		name: "Confuse Ray",
		pp: 10,
		isViable: true,
		priority: 0,
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"Confusion": {
		num: 93,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Has a 10% chance to confuse the target.",
		id: "Confusion",
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
	"Constrict": {
		num: 132,
		accuracy: 100,
		basePower: 10,
		category: "Physical",
		desc: "Has a 10% chance to lower the target's Speed by 1 stage.",
		id: "Constrict",
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
	"Conversion": {
		num: 160,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user's type changes to match the type of one of its four attacks. This move fails if the user cannot change its type under this condition.",
		id: "Conversion",
		name: "Conversion",
		pp: 30,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Conversion2": {
		num: 176,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user's type changes to one that resists the type of the last attack that hit the user. In double battles, this situation holds even when the user is last hit by an attack from its partner.",
		id: "Conversion2",
		name: "Conversion 2",
		pp: 30,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Copycat": {
		num: 383,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user performs the battle's last successful move. This move could be from the current opponent, a previous opponent, a teammate or even another move from the user's own moveset. This move fails if no Pokemon has used a move yet. Copycat cannot copy itself.",
		id: "Copycat",
		name: "Copycat",
		pp: 20,
		isViable: true,
		priority: 0,
		onHit: function(pokemon) {
			if (!this.lastMove || this.lastMove === 'Copycat')
			{
				return false;
			}
			this.useMove(this.lastMove, pokemon);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"CosmicPower": {
		num: 322,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense and Special Defense by 1 stage each.",
		id: "CosmicPower",
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
	"CottonGuard": {
		num: 538,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Defense by three stages.",
		id: "CottonGuard",
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
	"CottonSpore": {
		num: 178,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Speed by 2 stages.",
		id: "CottonSpore",
		name: "Cotton Spore",
		pp: 40,
		priority: 0,
		boosts: {
			spe: -2
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"Counter": {
		num: 68,
		accuracy: true,
		basePower: false,
		damageCallback: function(pokemon) {
			if (pokemon.lastHitBy && pokemon.lastHitBy.thisTurn && this.getMove(pokemon.lastHitBy.move).category === 'Physical')
			{
				return 2 * pokemon.lastHitBy.damage;
			}
			this.add('r-failed '+pokemon.id);
			return false;
		},
		category: "Physical",
		desc: "Almost always goes last; if an opponent strikes with a Physical attack before the user's turn, the user retaliates for twice the damage it had endured. In double battles, this attack targets the last opponent to hit the user with a Physical attack and cannot hit the user's teammate.",
		id: "Counter",
		name: "Counter",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: -5,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Covet": {
		num: 343,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Steals the target's held item unless the user is already holding an item or the target has Sticky Hold or Multitype. Recycle cannot recover the stolen item.",
		id: "Covet",
		name: "Covet",
		pp: 40,
		isContact: true,
		priority: 0,
		onHit: function(target, source) {
			if (source.item)
			{
				return false;
			}
			var yourItem = target.takeItem();
			if (!yourItem)
			{
				return false;
			}
			if (!source.setItem(yourItem))
			{
				return false;
			}
			this.add('r-trick-get '+source.id+' '+yourItem.id);
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Crabhammer": {
		num: 152,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "Crabhammer",
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
	"CrossChop": {
		num: 238,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "CrossChop",
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
	"CrossPoison": {
		num: 440,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a high critical hit ratio and a 10% chance to poison the target.",
		id: "CrossPoison",
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
	"Crunch": {
		num: 242,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 20% chance to lower the target's Defense by 1 stage.",
		id: "Crunch",
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
	"CrushClaw": {
		num: 306,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's Defense by 1 stage.",
		id: "CrushClaw",
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
	"CrushGrip": {
		num: 462,
		accuracy: true,
		basePower: 1,
		basePowerCallback: function(pokemon, target) {
			return parseInt(120*target.hp/target.maxhp);
		},
		category: "Physical",
		desc: "Base power decreases as the target's HP decreases.",
		id: "CrushGrip",
		name: "Crush Grip",
		pp: 5,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Curse": {
		num: 174,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "When used by a Ghost-type, the user sacrifices half of its max HP to sap the target by 1/4 of its max HP per turn. When used by anything else, the user's Speed is decreased by 1 stage and its Attack and Defense are increased by 1 stage.",
		id: "Curse",
		name: "Curse",
		pp: 10,
		isViable: true,
		priority: 0,
		onHit: function(target, source) {
			if (source.hasType('Ghost'))
			{
				source.damage(source.maxhp/2);
				target.addVolatile('Curse');
			}
			else
			{
				this.boost({
					atk: 1,
					def: 1,
					spe: -1
				}, source);
			}
		},
		effect: {
			onStart: function(pokemon) {
				this.add('message Cursed! (placeholder)');
			},
			onResidualPriority: 50-10,
			onResidual: function(pokemon) {
				this.damage(pokemon.maxhp/4);
			}
		},
		secondary: false,
		target: "anyFoe",
		type: "Ghost"
	},
	"Cut": {
		num: 15,
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "Cut",
		name: "Cut",
		pp: 30,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"DarkPulse": {
		num: 399,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to make the target flinch.",
		id: "DarkPulse",
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
	"DarkVoid": {
		num: 464,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep. In double battles, this move will put both opponents to sleep.",
		id: "DarkVoid",
		name: "Dark Void",
		pp: 10,
		isViable: true,
		priority: 0,
		status: 'slp',
		secondary: false,
		target: "foes",
		type: "Dark"
	},
	"DefendOrder": {
		num: 455,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense and Special Defense by 1 stage each.",
		id: "DefendOrder",
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
	"DefenseCurl": {
		num: 111,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 1 stage; after one use of this move, the user's starting base power is doubled for every use of Rollout or Ice Ball.",
		id: "DefenseCurl",
		name: "Defense Curl",
		pp: 40,
		priority: 0,
		boosts: {
			def: 2
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Defog": {
		num: 432,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Evasion by 1 stage and removes Reflect, Light Screen, Safeguard, Mist, Spikes, Stealth Rock and Toxic Spikes from the target's side of the field.",
		id: "Defog",
		name: "Defog",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "all",
		type: "Flying"
	},
	"DestinyBond": {
		num: 194,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes an opponent to faint if its next attack KOs the user.",
		id: "DestinyBond",
		name: "Destiny Bond",
		pp: 5,
		isViable: true,
		priority: 0,
		volatileStatus: 'DestinyBond',
		effect: {
			onFaint: function(target, source, effect) {
				this.debug('Destiny Bond detected fainted pokemon');
				if (!source || !effect) return;
				this.debug('attacker: '+source.id+', bonded with: '+this.effectData.target.id+', lm: '+target.lastMove);
				if (effect.effectType === 'Move' && target.lastMove === 'DestinyBond')
				{
					source.faint();
				}
			},
			onBeforeMovePriority: -10,
			onBeforeMove: function(pokemon) {
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('DestinyBond');
			}
		},
		secondary: false,
		target: "self",
		type: "Ghost"
	},
	"Detect": {
		num: 197,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes first. The user is protected from all attacks for one turn, but the move's success rate halves with each consecutive use of Protect, Detect or Endure. If a Pokemon has No Guard, or used Lock-On or Mind Reader against the user during the previous turn, its attack has a [100 Varmove's normal accuracy]% chance to hit through Detect; OHKO moves do not benefit from this effect. Blizzard has a 30% to hit through this move during Hail, as does Thunder during Rain Dance.",
		id: "Detect",
		name: "Detect",
		pp: 5,
		isViable: true,
		priority: 3,
		stallingMove: true, // decrease success of repeated use to 50%
		volatileStatus: 'Protect',
		onHit: function(pokemon) {
			if (!this.willAct())
			{
				return false;
			}
			var counter = 0;
			if (pokemon.volatiles['stall'])
			{
				counter = pokemon.volatiles['stall'].counter || 0;
			}
			if (counter >= 8) counter = 32;
			if (counter > 0 && Math.random()*Math.pow(2, counter) > 1)
			{
				return false;
			}
			pokemon.addVolatile('stall');
		},
		secondary: false,
		target: "self",
		type: "Fighting"
	},
	"Dig": {
		num: 91,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "On the first turn, the user digs underground, becoming uncontrollable, and evades all attacks. Earthquake and Magnitude can hit underground and gain doubled power. The user may also be hit underground if it was previously targeted by Lock-On or Mind Reader or if it is attacked by a Pokemon with No Guard. On the second turn, the user attacks.",
		id: "Dig",
		name: "Dig",
		pp: 10,
		isContact: true,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('Dig')) return;
			pokemon.addVolatile('Dig');
			this.add('prepare-move '+pokemon.id+' Dig');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('Dig');
			},
			onSourceModifyMove: function(move) {
				if (move.target === 'foeSide') return;
				if (move.id === 'Earthquake')
				{
					// should not normally be done in ModifyMove event,
					// but EQ has static base power, and
					// it's faster to do this here than in
					// onFoeBasePower
					
					// TODO: Magnitude
					move.basePower *= 2;
					return;
				}
				else if (move.id === 'Magnitude' || move.id === 'Fissure')
				{
					return;
				}
				move.accuracy = 0;
			}
		},
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"Disable": {
		num: 50,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The target cannot choose its last move for 4-7 turns. Disable only works on one move at a time and fails if the target has not yet used a move or if its move has run out of PP. The target does nothing if it is about to use a move that becomes disabled.",
		id: "Disable",
		name: "Disable",
		pp: 20,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'Disable',
		effect: {
			duration: 4,
			onStart: function(pokemon) {
				if (!pokemon.lastMove)
				{
					this.debug('pokemon hasn\'t moved yet');
					return false;
				}
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++)
				{
					if (moves[i].id === pokemon.lastMove)
					{
						if (!moves[i].pp)
						{
							this.debug('Move out of PP');
							return false;
						}
						else
						{
							this.add('message Disable started. (placeholder)');
							this.effectData.move = pokemon.lastMove;
							return;
						}
					}
				}
				this.debug('Move doesn\'t exist ???');
				return false;
			},
			onEnd: function(pokemon) {
				this.add('message Disable ended. (placeholder)');
			},
			onModifyPokemon: function(pokemon) {
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++)
				{
					if (moves[i].id === this.effectData.move)
					{
						moves[i].disabled = true;
					}
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Discharge": {
		num: 435,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 30% chance to paralyze the target.",
		id: "Discharge",
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
	"Dive": {
		num: 291,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "On the first turn, the user dives underwater, becoming uncontrollable, and evades all attacks except for Surf and Whirlpool, which have doubled power; the user may also be hit underwater if it was previously targeted by Lock-On or Mind Reader or if it is attacked by a Pokemon with No Guard. On the second turn, the user attacks.",
		id: "Dive",
		name: "Dive",
		pp: 10,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"DizzyPunch": {
		num: 146,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a 20% chance to confuse the target.",
		id: "DizzyPunch",
		name: "Dizzy Punch",
		pp: 10,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 20,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Normal"
	},
	"DoomDesire": {
		num: 353,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "This move, even if the user and/or the target switch out, will strike the active target at the end of the second turn after its use.	Only one instance of Doom Desire or Future Sight may be active at a time.",
		id: "DoomDesire",
		name: "Doom Desire",
		pp: 5,
		isViable: true,
		priority: 0,
		onHit: function(target, source) {
			source.side.addSideCondition('futureMove');
			
			if (source.side.sideConditions['futureMove'].positions[source.position])
			{
				return false;
			}
			source.side.sideConditions['futureMove'].positions[source.position] = {
				duration: 3,
				move: 'DoomDesire',
				targetPosition: target.position,
				source: source,
				moveData: {
					basePower: 140,
					category: "Special",
					type: 'Steel'
				}
			};
			this.add('message Doom Desire started. (placeholder)');
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"Double-Edge": {
		num: 38,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user receives 1/3 recoil damage.",
		id: "Double-Edge",
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
	"DoubleHit": {
		num: 458,
		accuracy: 90,
		basePower: 35,
		category: "Physical",
		desc: "Strikes twice; if the first hit breaks the target's Substitute, the real Pokemon will take damage from the second hit.",
		id: "DoubleHit",
		name: "Double Hit",
		pp: 10,
		isContact: true,
		priority: 0,
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"DoubleKick": {
		num: 24,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		desc: "Strikes twice; if the first hit breaks the target's Substitute, the real Pokemon will take damage from the second hit.",
		id: "DoubleKick",
		name: "Double Kick",
		pp: 30,
		isContact: true,
		priority: 0,
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"DoubleSlap": {
		num: 3,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "DoubleSlap",
		name: "DoubleSlap",
		pp: 10,
		isContact: true,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"DoubleTeam": {
		num: 104,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Evasion by 1 stage.",
		id: "DoubleTeam",
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
	"DracoMeteor": {
		num: 434,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages after use.",
		id: "DracoMeteor",
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
	"DragonBreath": {
		num: 225,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 30% chance to paralyze the target.",
		id: "DragonBreath",
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
	"DragonClaw": {
		num: 337,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "DragonClaw",
		name: "Dragon Claw",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"DragonDance": {
		num: 349,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Speed by 1 stage each.",
		id: "DragonDance",
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
	"DragonPulse": {
		num: 406,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage with no additional effect.",
		id: "DragonPulse",
		name: "Dragon Pulse",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "any",
		type: "Dragon"
	},
	"DragonRage": {
		num: 82,
		accuracy: true,
		basePower: false,
		damage: 40,
		category: "Special",
		desc: "Always deals 40 points of damage.",
		id: "DragonRage",
		name: "Dragon Rage",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"DragonRush": {
		num: 407,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "Has a 20% chance to make the target flinch.",
		id: "DragonRush",
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
	"DragonTail": {
		num: 525,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		desc: null,
		id: "DragonTail",
		name: "Dragon Tail",
		pp: 10,
		isViable: true,
		priority: -6,
		secondary: {
			chance: 100,
			forceSwitch: true
		},
		target: "normal",
		type: "Dragon"
	},
	"DrainPunch": {
		num: 409,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
		id: "DrainPunch",
		name: "Drain Punch",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"DreamEater": {
		num: 138,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target but only works on a sleeping target.",
		id: "DreamEater",
		name: "Dream Eater",
		pp: 15,
		priority: 0,
		drain: [1,2],
		onHit: function(target) {
			if (target.status !== 'slp') return false;
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"DrillPeck": {
		num: 65,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "DrillPeck",
		name: "Drill Peck",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"DrillRun": {
		num: 529,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "Has an increased chance for a critical hit.",
		id: "DrillRun",
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
	"DualChop": {
		num: 530,
		accuracy: 90,
		basePower: 40,
		category: "Physical",
		desc: "Hits twice in one turn.",
		id: "DualChop",
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
	"DynamicPunch": {
		num: 223,
		accuracy: 50,
		basePower: 100,
		category: "Physical",
		desc: "Confuses the target.",
		id: "DynamicPunch",
		name: "DynamicPunch",
		pp: 5,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 100,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Fighting"
	},
	"EarthPower": {
		num: 414,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		id: "EarthPower",
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
	"Earthquake": {
		num: 89,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Power doubles when performed against Pokemon using Dig.",
		id: "Earthquake",
		name: "Earthquake",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "adjacent",
		type: "Ground"
	},
	"EchoedVoice": {
		num: 497,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Echo Voice deals damage, and the base power is increased when used consecutively. The base power increases by 40 with each use but reaches a maximum power at 200. In Double and Triple battles, the power increases if used consecutively by the user's teammates.",
		id: "EchoedVoice",
		name: "Echoed Voice",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"EggBomb": {
		num: 121,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "EggBomb",
		name: "Egg Bomb",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"ElectroBall": {
		num: 486,
		accuracy: true,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var targetSpeed = target.stats.spe;
			var pokemonSpeed = pokemon.stats.spe;
			if (pokemonSpeed > targetSpeed * 4)
			{
				return 150;
			}
			if (pokemonSpeed > targetSpeed * 3)
			{
				return 120;
			}
			if (pokemonSpeed > targetSpeed * 2)
			{
				return 80;
			}
			return 60;
		},
		category: "Special",
		desc: null,
		id: "ElectroBall",
		name: "Electro Ball",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"Electroweb": {
		num: 527,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Lowers the target's Speed by one level.",
		id: "Electroweb",
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
	"Embargo": {
		num: 373,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from using its held item for five turns. During in-game battles, trainers also cannot use any items from their bag on a Pokemon under the effects of Embargo.",
		id: "Embargo",
		name: "Embargo",
		pp: 15,
		priority: 0,
		volatileStatus: 'Embargo',
		effect: {
			duration: 5,
			onStart: function(pokemon) {
				this.add('message Embargo started. (placeholder)');
			},
			onEnd: function(pokemon) {
				this.add('message Embargo ended. (placeholder)');
			},
			onModifyPokemon: function(pokemon)
			{
				pokemon.ignore['Item'] = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"Ember": {
		num: 52,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		id: "Ember",
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
	"Encore": {
		num: 227,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The target is forced to use its last attack for the next 3 turns. The effects of this move will end immediately if the target runs out of PP for the repeated attack. In double battles, a Pokemon who has received an Encore will target a random opponent with single-target attacks.",
		id: "Encore",
		name: "Encore",
		pp: 5,
		isViable: true,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'Encore',
		effect: {
			onStart: function(target) {
				if (!target.lastMove)
				{
					// it failed
					this.add('r-failed '+target.id);
					delete target.volatiles['Encore'];
					return;
				}
				this.effectData.time = 3;
				this.effectData.move = target.lastMove;
				this.add('r-volatile '+target.id+' encore');
				var decision = this.willMove(target);
				if (decision)
				{
					this.effectData.time--;
					if (this.effectData.time <= 0)
					{
						this.effectData.duration = 1;
					}
					this.changeDecision(target, {move:this.effectData.move});
				}
			},
			onEnd: function(target) {
				this.add('r-volatile '+target.id+' encore end');
			},
			onModifyPokemon: function(pokemon) {
				if (!this.effectData.move || !pokemon.hasMove(this.effectData.move))
				{
					return;
				}
				for (var i=0; i<pokemon.moveset.length; i++)
				{
					if (pokemon.moveset[i].id !== this.effectData.move)
					{
						pokemon.moveset[i].disabled = true;
					}
				}
			},
			onBeforeTurn: function(pokemon) {
				if (!this.effectData.move)
				{
					// ???
					return;
				}
				var decision = this.willMove(pokemon);
				if (decision)
				{
					pokemon.volatiles['Encore'].time--;
					if (pokemon.volatiles['Encore'].time <= 0)
					{
						pokemon.volatiles['Encore'].duration = 1;
					}
					this.changeDecision(pokemon, {move:this.effectData.move});
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Endeavor": {
		num: 283,
		accuracy: true,
		basePower: false,
		damageCallback: function(pokemon,target) {
			if (target.hp > pokemon.hp)
			{
				return target.hp - pokemon.hp;
			}
			return false;
		},
		category: "Physical",
		desc: "Inflicts damage equal to the target's current HP - the user's current HP.",
		id: "Endeavor",
		name: "Endeavor",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Endure": {
		num: 203,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes first. The user is left with at least 1 HP following any attacks for one turn, but the move's success rate halves with each consecutive use of Protect, Detect or Endure.",
		id: "Endure",
		name: "Endure",
		pp: 10,
		priority: 3,
		stallingMove: true, // decrease success of repeated use to 50%
		volatileStatus: 'Endure',
		onHit: function(pokemon) {
			if (!this.willAct())
			{
				return false;
			}
			var counter = 0;
			if (pokemon.volatiles['stall'])
			{
				counter = pokemon.volatiles['stall'].counter || 0;
			}
			if (counter >= 8) counter = 32;
			if (counter > 0 && Math.random()*Math.pow(2, counter) > 1)
			{
				return false;
			}
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('r-turnstatus '+target.id+' endure');
			},
			onDamagePriority: -10,
			onDamage: function(damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && damage >= target.hp)
				{
					return target.hp-1;
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"EnergyBall": {
		num: 412,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		id: "EnergyBall",
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
	"Entrainment": {
		num: 494,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Copies the user's ability onto the target.",
		id: "Entrainment",
		name: "Entrainment",
		pp: 15,
		priority: 0,
		onHit: function(target, source) {
			if (target.ability === 'Multitype' || target.ability === 'Truant' || target.ability === 'ZenMode' || target.ability === source.ability)
			{
				return false;
			}
			if (target.setAbility(source.ability))
			{
				this.add('message '+target.name+' acquired '+source.ability+'! (placeholder)');
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Eruption": {
		num: 284,
		accuracy: true,
		basePower: false,
		basePowerCallback: function(pokemon) {
			return parseInt(150*pokemon.hp/pokemon.maxhp);
		},
		category: "Special",
		desc: "Base power decreases as the user's HP decreases.",
		id: "Eruption",
		name: "Eruption",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "foes",
		type: "Fire"
	},
	"Explosion": {
		num: 153,
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		desc: "Causes the user to faint.",
		id: "Explosion",
		name: "Explosion",
		pp: 5,
		priority: 0,
		selfdestruct: true,
		secondary: false,
		target: "adjacent",
		type: "Normal"
	},
	"Extrasensory": {
		num: 326,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 10% chance to make the target flinch.",
		id: "Extrasensory",
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
	"ExtremeSpeed": {
		num: 245,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Usually goes first.",
		id: "ExtremeSpeed",
		name: "ExtremeSpeed",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 2,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Facade": {
		num: 263,
		accuracy: true,
		basePower: 70,
		basePowerCallback: function(pokemon) {
			if (pokemon.status)
			{
				return 140;
			}
			return 70;
		},
		category: "Physical",
		desc: "Power doubles if the user is inflicted with a status effect (burn, paralysis poison, or sleep).",
		id: "Facade",
		name: "Facade",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"FaintAttack": {
		num: 185,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		id: "FaintAttack",
		name: "Faint Attack",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"FakeOut": {
		num: 252,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "If this is the user's first move after being sent or switched into battle, the target flinches; this move fails otherwise and against targets with Inner Focus.",
		id: "FakeOut",
		name: "Fake Out",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 3,
		onHit: function(target, pokemon) {
			if (pokemon.activeTurns > 1)
			{
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
	"FakeTears": {
		num: 313,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Defense by 2 stages.",
		id: "FakeTears",
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
	"FalseSwipe": {
		num: 206,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Leaves the target with at least 1 HP.",
		id: "FalseSwipe",
		name: "False Swipe",
		pp: 40,
		isContact: true,
		priority: 0,
		hitCallback: function(){ return 'noFaint'; },
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"FeatherDance": {
		num: 297,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 2 stages.",
		id: "FeatherDance",
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
	"Feint": {
		num: 364,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Is not blocked by Protect or Detect, but is blocked by Fast Guard.",
		id: "Feint",
		name: "Feint",
		pp: 10,
		priority: 2,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"FieryDance": {
		num: 552,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 50% chance to raise the user's Special Attack by one level.",
		id: "FieryDance",
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
	"FinalGambit": {
		num: 515,
		accuracy: true,
		basePower: false,
		damageCallback: function(pokemon) {
			return pokemon.hp;
		},
		category: "Special",
		desc: "Inflicts damage equal to the user's remaining HP. User faints.",
		id: "FinalGambit",
		name: "Final Gambit",
		pp: 5,
		isContact: true,
		priority: 0,
		selfdestruct: true,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"FireBlast": {
		num: 126,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		id: "FireBlast",
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
	"FireFang": {
		num: 424,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		desc: "Has a 10% chance to burn the target. Has a 10% chance to make the target flinch. Both effects can occur from a single use.",
		id: "FireFang",
		name: "Fire Fang",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"FirePledge": {
		num: 519,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "If it is followed on the same turn by Grass Oath, it will cause all foes to take damage at the end of every turn for four turns. If it follows Water Oath on the same turn, it will double the probability of secondary effects taking place for four turns. This effect does not stack with Serene Grace.",
		id: "FirePledge",
		name: "Fire Pledge",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"FirePunch": {
		num: 7,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 10% chance to burn the target.",
		id: "FirePunch",
		name: "Fire Punch",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"FireSpin": {
		num: 83,
		accuracy: 85,
		basePower: 35,
		category: "Special",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or it uses U-Turn.",
		id: "FireSpin",
		name: "Fire Spin",
		pp: 15,
		priority: 0,
		volatileStatus: 'partiallyTrapped',
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"Fissure": {
		num: 90,
		accuracy: true,
		basePower: false,
		category: "Physical",
		desc: "The target faints; doesn't work on higher-leveled Pokemon.",
		id: "Fissure",
		name: "Fissure",
		pp: 5,
		priority: 0,
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"Flail": {
		num: 175,
		accuracy: true,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var hpPercent = pokemon.hpPercent(pokemon.hp);
			if (hpPercent <= 5)
			{
				return 200;
			}
			if (hpPercent <= 10)
			{
				return 150;
			}
			if (hpPercent <= 20)
			{
				return 100;
			}
			if (hpPercent <= 35)
			{
				return 80;
			}
			if (hpPercent <= 70)
			{
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Base power increases as the user's HP decreases.",
		id: "Flail",
		name: "Flail",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"FlameBurst": {
		num: 481,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: null,
		id: "FlameBurst",
		name: "Flame Burst",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"FlameCharge": {
		num: 488,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Inflicts regular damage. Raises the user's Speed by one stage.",
		id: "FlameCharge",
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
	"FlameWheel": {
		num: 172,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 10% chance to burn the target; can be used while frozen, which both attacks the target normally and thaws the user.",
		id: "FlameWheel",
		name: "Flame Wheel",
		pp: 25,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"Flamethrower": {
		num: 53,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		id: "Flamethrower",
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
	"FlareBlitz": {
		num: 394,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user receives 1/3 recoil damage; has a 10% chance to burn the target.",
		id: "FlareBlitz",
		name: "Flare Blitz",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		recoil: [1,3],
		secondary: {
			chance: 10,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"Flash": {
		num: 148,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Accuracy by 1 stage.",
		id: "Flash",
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
	"FlashCannon": {
		num: 430,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		id: "FlashCannon",
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
	"Flatter": {
		num: 260,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Confuses the target and raises its Special Attack by 1 stage.",
		id: "Flatter",
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
	"Fling": {
		num: 374,
		accuracy: true,
		basePower: false,
		category: "Physical",
		desc: "The user's held item is thrown at the target. Base power and additional effects vary depending on the thrown item. Note that the target will instantly benefit from the effects of thrown berries. The held item is gone for the rest of the battle unless Recycle is used; the item will return to the original holder after wireless battles but will be permanently lost if it is thrown during in-game battles.",
		id: "Fling",
		name: "Fling",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"Fly": {
		num: 19,
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		desc: "On the first turn, the user flies into the air, becoming uncontrollable, and evades most attacks. Gust, Twister, Thunder and Sky Uppercut have normal accuracy against a mid-air Pokemon, with Gust and Twister also gaining doubled power. The user may also be hit in mid-air if it was previously targeted by Lock-On or Mind Reader or if it is attacked by a Pokemon with No Guard. On the second turn, the user attacks.",
		id: "Fly",
		name: "Fly",
		pp: 15,
		isContact: true,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('Fly')) return;
			pokemon.addVolatile('Fly');
			this.add('prepare-move '+pokemon.id+' Fly');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('Fly');
			},
			onSourceModifyMove: function(move) {
				
				if (move.target === 'foeSide') return;
				// warning: does not work the same way as Bounce
				if (move.id === 'Gust' || move.id === 'Twister')
				{
					// should not normally be done in MovifyMove event,
					// but Gust and Twister have static base power, and
					// it's faster to do this  here than in
					// BasePower event
					move.basePower *= 2;
					return;
				}
				else if (move.id === 'Sky Uppercut' || move.id === 'Thunder' || move.id === 'Hurricane' || move.id === 'Smack Down')
				{
					return;
				}
				move.accuracy = 0;
			}
		},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"FocusBlast": {
		num: 411,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		id: "FocusBlast",
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
	"FocusEnergy": {
		num: 116,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's chance for a Critical Hit by two domains.",
		id: "FocusEnergy",
		name: "Focus Energy",
		pp: 30,
		priority: 0,
		volatileStatus: 'FocusEnergy',
		effect: {
			onStart: function(pokemon) {
				this.add('message '+pokemon.name+' is getting pumped! (placeholder)');
			},
			onModifyMove: function(move) {
				move.critRatio += 2;
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"FocusPunch": {
		num: 264,
		accuracy: 100,
		basePower: 150,
		category: "Physical",
		desc: "At the beginning of the round, the user tightens its focus; the attack itself usually goes last and will fail if the user is attacked by any other Pokemon during the turn.",
		id: "FocusPunch",
		name: "Focus Punch",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: -3,
		beforeTurnCallback: function(pokemon) {
			pokemon.addVolatile('FocusPunch');
		},
		beforeMoveCallback: function(pokemon) {
			if (!pokemon.removeVolatile('FocusPunch'))
			{
				return false;
			}
			if (pokemon.lastHitBy && pokemon.lastHitBy.damage && pokemon.lastHitBy.thisTurn)
			{
				this.add('flinch '+pokemon.id);
				return true;
			}
		},
		effect: {
			duration: 1,
			onStart: function(pokemon) {
				this.add('r-turnstatus '+pokemon.id+' focusing');
			}
		},
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"FollowMe": {
		num: 266,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes first. For the rest of the turn, all attacks from the opponent's team that target the user's team are redirected toward the user. In double battles, the user's teammate will not be protected from attacks that have more than one intended target.",
		id: "FollowMe",
		name: "Follow Me",
		pp: 20,
		priority: 3,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"ForcePalm": {
		num: 395,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		id: "ForcePalm",
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
	"Foresight": {
		num: 193,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Until the target faints or switches, the user's Accuracy modifiers and the target's Evasion modifiers are ignored. Ghost-type targets also lose their immunities against Normal-type and Fighting-type moves.",
		id: "Foresight",
		name: "Foresight",
		pp: 40,
		priority: 0,
		volatileStatus: 'Foresight',
		effect: {
			onStart: function(pokemon) {
				this.add('message Foresight started. (placeholder)');
			},
			onModifyPokemon: function(pokemon) {
				if (pokemon.hasType('Ghost'))
				{
					pokemon.negateImmunity['Normal'] = true;
					pokemon.negateImmunity['Fighting'] = true;
				}
			},
			onSourceModifyMove: function(move) {
				move.ignoreAccuracy = true;
				move.ignoreEvasion = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"FoulPlay": {
		num: 492,
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		desc: "It uses the target's Attack stat to calculate damage.",
		id: "FoulPlay",
		name: "Foul Play",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"FreezeShock": {
		num: 553,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "Charges for a turn before attacking. Has a 30% chance to paralyze the target.",
		id: "FreezeShock",
		name: "Freeze Shock",
		pp: 5,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('FreezeShock')) return;
			this.add('prepare-move '+pokemon.id+' FreezeShock');
			pokemon.addVolatile('FreezeShock');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('FreezeShock');
			}
		},
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Ice"
	},
	"FrenzyPlant": {
		num: 338,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
		id: "FrenzyPlant",
		name: "Frenzy Plant",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustRecharge'
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"FrostBreath": {
		num: 524,
		accuracy: 90,
		basePower: 40,
		category: "Special",
		desc: "Always results in a critical hit.",
		id: "FrostBreath",
		name: "Frost Breath",
		pp: 10,
		isViable: true,
		priority: 0,
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"Frustration": {
		num: 218,
		accuracy: 100,
		basePower: false,
		category: "Physical",
		desc: "Power increases as user's happiness decreases; maximum 102 BP.",
		id: "Frustration",
		name: "Frustration",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"FuryAttack": {
		num: 31,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "FuryAttack",
		name: "Fury Attack",
		pp: 20,
		isContact: true,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"FuryCutter": {
		num: 210,
		accuracy: 95,
		basePower: 20,
		category: "Physical",
		desc: "The base power of this move doubles with each consecutive hit; however, power is capped at a maximum 160 BP and remains there for any subsequent uses. If this move misses, base power will be reset to 10 BP on the next turn. The user can also select other attacks without resetting this move's power; it will continue to double after each use until it either misses or reaches the 160 BP cap.",
		id: "FuryCutter",
		name: "Fury Cutter",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"FurySwipes": {
		num: 154,
		accuracy: 80,
		basePower: 18,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "FurySwipes",
		name: "Fury Swipes",
		pp: 15,
		isContact: true,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"FusionBolt": {
		num: 559,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "If the target knows Cross Flame, it will automatically use that move on the Cross Thunder user, which will increase the base power of Cross Thunder. However, the user will then be incapable of using any other move besides Cross Thunder, unless the user is switched out, the target is unable to use Cross Flame, or one of the two battlers faint.",
		id: "FusionBolt",
		name: "Fusion Bolt",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"FusionFlare": {
		num: 558,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "If the target knows Cross Thunder, it will automatically use that move on the Cross Flame user, which will increase the base power of Cross Flame. However, the user will then be incapable of using any other move besides Cross Flame, unless the user is switched out, the target is unable to use Cross Thunder, or one of the two battlers faint.",
		id: "FusionFlare",
		name: "Fusion Flare",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"FutureSight": {
		num: 248,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "This move, even if the user and/or the target switch out, will strike the active target at the end of the second turn after its use. Only one instance of Future Sight or Doom Desire may be active at a time.",
		id: "FutureSight",
		name: "Future Sight",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			source.side.addSideCondition('futureMove');
			
			if (source.side.sideConditions['futureMove'].positions[source.position])
			{
				return false;
			}
			source.side.sideConditions['futureMove'].positions[source.position] = {
				duration: 3,
				move: 'FutureSight',
				targetPosition: target.position,
				source: source,
				moveData: {
					basePower: 100,
					category: "Special",
					type: 'Psychic'
				}
			};
			this.add('message Future Sight started. (placeholder)');
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"GastroAcid": {
		num: 380,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Negates the target's ability as long as it remains in battle.",
		id: "GastroAcid",
		name: "Gastro Acid",
		pp: 10,
		priority: 0,
		onHit: function(pokemon) {
			if (pokemon.ability === 'Multitype')
			{
				return false;
			}
			if (pokemon.setAbility(''))
			{
				this.add('message Ability removed. (placeholder)');
			}
		},
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"GearGrind": {
		num: 544,
		accuracy: 85,
		basePower: 50,
		category: "Physical",
		desc: "Hits twice in one turn.",
		id: "GearGrind",
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
	"GigaDrain": {
		num: 202,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
		id: "GigaDrain",
		name: "Giga Drain",
		pp: 10,
		isViable: true,
		priority: 0,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"GigaImpact": {
		num: 416,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
		id: "GigaImpact",
		name: "Giga Impact",
		pp: 5,
		isContact: true,
		priority: 0,
		self: {
			volatileStatus: 'mustRecharge'
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Glaciate": {
		num: 549,
		accuracy: 95,
		basePower: 65,
		category: "Special",
		desc: "Frozen World inflicts damage and lowers the target's Speed stat by one stage. Frozen World hits all opponents in double battles and all adjacent opponents in triple battles.",
		id: "Glaciate",
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
	"Glare": {
		num: 137,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes the target.",
		id: "Glare",
		name: "Glare",
		pp: 30,
		isViable: true,
		priority: 0,
		status: 'par',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"GrassKnot": {
		num: 447,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			if (target.weightkg > 200)
			{
				this.debug('120 bp');
				return 120;
			}
			if (target.weightkg > 100)
			{
				this.debug('100 bp');
				return 100;
			}
			if (target.weightkg > 50)
			{
				this.debug('80 bp');
				return 80;
			}
			if (target.weightkg > 25)
			{
				this.debug('60 bp');
				return 60;
			}
			if (target.weightkg > 10)
			{
				this.debug('40 bp');
				return 40;
			}
				this.debug('20 bp');
			return 20;
		},
		category: "Special",
		desc: "Base power increases as the target's weight increases.",
		id: "GrassKnot",
		name: "Grass Knot",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"GrassPledge": {
		num: 520,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "If it is followed on the same turn by Water Oath, it will decrease the speed of all foes by half for four turns. If it follows Fire Oath on the same turn, it will cause all foes to take damage at the end of every turn for four turns.",
		id: "GrassPledge",
		name: "Grass Pledge",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"GrassWhistle": {
		num: 320,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		id: "GrassWhistle",
		name: "GrassWhistle",
		pp: 15,
		priority: 0,
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"Gravity": {
		num: 356,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The immunities provided by Magnet Rise, Levitate and the Flying-type are negated for all active Pokemon for five turns; these Pokemon will be affected by Ground-type moves, Arena Trap, Spikes and Toxic Spikes. Pokemon in the middle of using Bounce or Fly when Gravity is activated will immediately return to the ground, and Bounce, Fly, Hi Jump Kick, Jump Kick and Splash cannot be used until Gravity wears off.",
		id: "Gravity",
		name: "Gravity",
		pp: 5,
		isViable: true,
		priority: 0,
		pseudoWeather: 'Gravity',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'Persistent')
				{
					return 7;
				}
				return 5;
			},
			onStart: function(side, source) {
				this.add('r-pseudo-weather '+source.id+' Gravity');
			},
			onModifyPokemon: function(pokemon) {
				pokemon.negateImmunity['Ground'] = true;
				pokemon.boosts.evasion -= 2;
			},
			onEnd: function() {
				this.add('pseudo-weather-end Gravity');
			}
		},
		secondary: false,
		target: "all",
		type: "Psychic"
	},
	"Growl": {
		num: 45,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack by 1 stage.",
		id: "Growl",
		name: "Growl",
		pp: 40,
		priority: 0,
		boosts: {
			atk: -1
		},
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"Growth": {
		num: 74,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Special Attack by 1 stage. If the weather is Sun, Growth raises Attack and SpAttk two stages each. ",
		id: "Growth",
		name: "Growth",
		pp: 40,
		isViable: true,
		priority: 0,
		onHit: function(target) {
			if (this.weather === 'SunnyDay')
			{
				this.boost({atk:2, spa:2});
				return null;
			}
		},
		boosts: {
			atk: 1,
			spa: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Grudge": {
		num: 288,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The target's next move is set to 0 PP if it directly KOs the user.",
		id: "Grudge",
		name: "Grudge",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"GuardSplit": {
		num: 470,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Averages Defense and Special Defense with the target.",
		id: "GuardSplit",
		name: "Guard Split",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"GuardSwap": {
		num: 385,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps Defense and Special Defense modifiers with its target.",
		id: "GuardSwap",
		name: "Guard Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			var sourceBoosts = {};
			
			for (var i in {def:1,spd:1})
			{
				targetBoosts[i] = target.baseBoosts[i];
			}
			for (var i in {def:1,spd:1})
			{
				sourceBoosts[i] = source.baseBoosts[i];
			}
			
			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);
			
			this.add('message Defensive boosts swapped. (placeholder; graphics will be incorrect)');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Guillotine": {
		num: 12,
		accuracy: true,
		basePower: false,
		category: "Physical",
		desc: "The target faints; doesn't work on higher-leveled Pokemon.",
		id: "Guillotine",
		name: "Guillotine",
		pp: 5,
		isContact: true,
		priority: 0,
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"GunkShot": {
		num: 441,
		accuracy: 70,
		basePower: 120,
		category: "Physical",
		desc: "Has a 30% chance to poison the target.",
		id: "GunkShot",
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
	"Gust": {
		num: 16,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Power doubles if the target is in mid-air via Fly or Bounce.",
		id: "Gust",
		name: "Gust",
		pp: 35,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"GyroBall": {
		num: 360,
		accuracy: true,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var targetSpeed = target.stats.spe;
			var pokemonSpeed = pokemon.stats.spe;
			var power = 25 * targetSpeed / pokemonSpeed;
			if (power > 150) power = 150
			this.debug(''+power+' bp');
			return power;
		},
		category: "Physical",
		desc: "Power is determined from the speeds of the user and the target; stat modifiers are taken into account. Max power, 150 BP, is achieved when the user is much slower than the target.",
		id: "GyroBall",
		name: "Gyro Ball",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"Hail": {
		num: 258,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Cancels all other weather moves. For 5 turns: Blizzard never misses and has a 30% chance to hit through Protect and Detect, each active Pokemon, even when protected by a Substitute, loses 1/16 of its max HP unless it is an Ice-type, the power of Solarbeam is halved, and the healing power of Morning Sun, Synthesis and Moonlight is halved. The effects of Hail will last for eight turns if its user is holding Icy Rock.",
		id: "Hail",
		name: "Hail",
		pp: 10,
		priority: 0,
		weather: 'Hail',
		secondary: false,
		target: "all",
		type: "Ice"
	},
	"HammerArm": {
		num: 359,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		desc: "Lowers the user's Speed by 1 stage.",
		id: "HammerArm",
		name: "Hammer Arm",
		pp: 10,
		isViable: true,
		isContact: true,
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
	"Harden": {
		num: 106,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 1 stage.",
		id: "Harden",
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
	"Haze": {
		num: 114,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Eliminates any stat modifiers from all active Pokemon. The stat boosts from Choice Band, Choice Lens and Choice Scarf are not affected.",
		id: "Haze",
		name: "Haze",
		pp: 30,
		isViable: true,
		priority: 0,
		onHit: function() {
			this.add('r-haze');
			for (var i=0; i<this.sides.length; i++)
			{
				for (var j=0; j<this.sides[i].active.length; j++)
				{
					this.sides[i].active[j].clearBoosts();
				}
			}
		},
		secondary: false,
		target: "all",
		type: "Ice"
	},
	"HeadCharge": {
		num: 543,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "User receives 1/4 the damage it inflicts in recoil.",
		id: "HeadCharge",
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
	"HeadSmash": {
		num: 457,
		accuracy: 80,
		basePower: 150,
		category: "Physical",
		desc: "The user receives 1/2 recoil damage.",
		id: "HeadSmash",
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
	"Headbutt": {
		num: 29,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "Headbutt",
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
	"HealBell": {
		num: 215,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Every Pokemon in the user's party is cured of status conditions. Allied Pokemon who have Soundproof are not affected.",
		id: "HealBell",
		name: "Heal Bell",
		pp: 5,
		isViable: true,
		priority: 0,
		onHit: function(side, source) {
			for (var i=0; i<side.pokemon.length; i++)
			{
				side.pokemon[i].status = '';
			}
			this.add('r-cure-all '+source.id+' HealBell');
		},
		secondary: false,
		target: "allySide",
		type: "Normal"
	},
	"HealBlock": {
		num: 377,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "For five turns, or until switching out, the target(s) will not be healed by Absorb, Aqua Ring, Drain Punch, Dream Eater, Giga Drain, Heal Order, Ingrain, Leech Life, Leech Seed, Mega Drain, Milk Drink, Moonlight, Morning Sun, Recover, Rest, Roost, Slack Off, Softboiled, Swallow, Synthesis or Wish, but any additional effects from these moves, such as damaging another target, will still occur. Healing caused from held items or Pain Split will not be prevented.",
		id: "HealBlock",
		name: "Heal Block",
		pp: 15,
		priority: 0,
		volatileStatus: 'HealBlock',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'Persistent')
				{
					return 7;
				}
				return 5;
			},
			onStart: function(pokemon) {
				this.add('message Heal Block started. (placeholder)');
			},
			onEnd: function(pokemon) {
				this.add('message Heal Block ended. (placeholder)');
			},
			onHeal: false
		},
		secondary: false,
		target: "foes",
		type: "Psychic"
	},
	"HealOrder": {
		num: 456,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores 1/2 of the user's max HP.",
		id: "HealOrder",
		name: "Heal Order",
		pp: 10,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Bug"
	},
	"HealPulse": {
		num: 505,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Restores half the target's max HP.",
		id: "HealPulse",
		name: "Heal Pulse",
		pp: 10,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"HealingWish": {
		num: 361,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user sacrifices itself so that its replacement will be cured of status conditions and have its HP fully restored upon entering the field. This move fails if the user is the only non-fainted Pokemon on its team.",
		id: "HealingWish",
		name: "Healing Wish",
		pp: 10,
		isViable: true,
		priority: 0,
		selfdestruct: true,
		sideCondition: 'HealingWish',
		effect: {
			duration: 2,
			onStart: function(side) {
				this.debug('Healing Wish started on '+side.name);
			},
			onSwitchInPriority: 1,
			onSwitchIn: function(target) {
				if (target.position != this.effectData.sourcePosition)
				{
					return;
				}
				if (!target.fainted)
				{
					var source = this.effectData.source;
					var damage = target.heal(target.maxhp);
					target.setStatus('');
					this.add('residual '+target.id+' healing-wish '+source.id+' '+target.getHealth());
					this.add('r-heal '+target.id+' '+damage+' '+target.getHealth());
					target.side.removeSideCondition('HealingWish');
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"HeartStamp": {
		num: 531,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "HeartStamp",
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
	"HeartSwap": {
		num: 391,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps stat modifiers with the target.",
		id: "HeartSwap",
		name: "Heart Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			var sourceBoosts = {};
			
			for (var i in target.baseBoosts)
			{
				targetBoosts[i] = target.baseBoosts[i];
				sourceBoosts[i] = source.baseBoosts[i];
			}
			
			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);
			
			this.add('message Swapped. (placeholder; graphics will be incorrect)');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"HeatCrash": {
		num: 535,
		accuracy: true,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var targetWeight = target.weightkg;
			var pokemonWeight = pokemon.weightkg;
			if (pokemonWeight > targetWeight * 5)
			{
				return 120;
			}
			if (pokemonWeight > targetWeight * 4)
			{
				return 100;
			}
			if (pokemonWeight > targetWeight * 3)
			{
				return 80;
			}
			if (pokemonWeight > targetWeight * 2)
			{
				return 60;
			}
			return 40;
		},
		category: "Physical",
		desc: "Deals varying damage depending on the weight of both the user and the target. The heavier the user is in comparison to its target, the more damage will be inflicted. The base power varies as follows: 120 base power, if the target's weight is less than or equal to 1/5 (20%) of the user's weight. 100 base power, if the target's weight is greater than 1/5 (20%) of the user's weight and less than or equal to 1/4 (25%) of user's weight. 80 base power, if the target's weight is greater than 1/4 (25%) of the user's weight and less than or equal to 1/2 (50%) of user's weight. 60 base power, if the target's weight is greater than 1/3 (33.3%) of the user's weight and less than or equal to 1/2 of user's weight (50%). 40 base power, if the target's weight is greater than 1/2 (50%) of the user's weight.",
		id: "HeatCrash",
		name: "Heat Crash",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"HeatWave": {
		num: 257,
		accuracy: 90,
		basePower: 100,
		category: "Special",
		desc: "Has a 10% chance to burn the target.",
		id: "HeatWave",
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
	"HeavySlam": {
		num: 484,
		accuracy: true,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var targetWeight = target.weightkg;
			var pokemonWeight = pokemon.weightkg;
			if (pokemonWeight > targetWeight * 5)
			{
				return 120;
			}
			if (pokemonWeight > targetWeight * 4)
			{
				return 100;
			}
			if (pokemonWeight > targetWeight * 3)
			{
				return 80;
			}
			if (pokemonWeight > targetWeight * 2)
			{
				return 60;
			}
			return 40;
		},
		category: "Physical",
		desc: "Heavy Bomber deals varying damage depending on the weight of both the user and the target. The heavier the user is in comparison to its target, the more damage will be inflicted. The base power varies as follows: 120 base power, if the target's weight is less than or equal to 1/5 (20%) of the user's weight. 100 base power, if the target's weight is greater than 1/5 (20%) of the user's weight and less than or equal to 1/4 (25%) of user's weight. 80 base power, if the target's weight is greater than 1/4 (25%) of the user's weight and less than or equal to 1/2 (50%) of user's weight. 60 base power, if the target's weight is greater than 1/3 (33.3%) of the user's weight and less than or equal to 1/2 of user's weight (50%). 40 base power, if the target's weight is greater than 1/2 (50%) of the user's weight.",
		id: "HeavySlam",
		name: "Heavy Slam",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"HelpingHand": {
		num: 270,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Always goes first. In double battles, the power of the user's partner's attacks is increased by 1.5x for that turn; does nothing in single battles.",
		id: "HelpingHand",
		name: "Helping Hand",
		pp: 20,
		priority: 5,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Hex": {
		num: 506,
		accuracy: 100,
		basePower: 50,
		basePowerCallback: function(pokemon, target) {
			if (target.status) return 100;
			return 50;
		},
		category: "Special",
		desc: "Inflicts more damage if the target has a major status ailment.",
		id: "Hex",
		name: "Hex",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"HiJumpKick": {
		num: 136,
		accuracy: 90,
		basePower: 130,
		category: "Physical",
		desc: "If this attack misses the target, the user half of its max health in recoil damage.",
		id: "HiJumpKick",
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
	"HiddenPower": {
		num: 237,
		accuracy: true,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			return pokemon.hpPower || 70;
		},
		category: "Special",
		desc: "Varies in power and type depending on the user's IVs; maximum 70 BP.",
		id: "HiddenPower",
		name: "Hidden Power",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal",
		typeCallback: function(pokemon) {
			return pokemon.hpType || 'Dark';
		}
	},
	"HiddenPowerBug": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Bug",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"HiddenPowerDark": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Dark",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"HiddenPowerDragon": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Dragon",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"HiddenPowerElectric": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Electric",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"HiddenPowerFighting": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Fighting",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"HiddenPowerFire": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Fire",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"HiddenPowerFlying": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Flying",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"HiddenPowerGhost": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Ghost",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"HiddenPowerGrass": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Grass",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"HiddenPowerGround": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Ground",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"HiddenPowerIce": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Ice",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"HiddenPowerPoison": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Poison",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"HiddenPowerPsychic": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Psychic",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"HiddenPowerRock": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Rock",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"HiddenPowerSteel": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Steel",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"HiddenPowerWater": {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "",
		id: "HiddenPower",
		name: "Hidden Power Water",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"HoneClaws": {
		num: 468,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Attack and Accuracy by one stage.",
		id: "HoneClaws",
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
	"HornAttack": {
		num: 30,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "HornAttack",
		name: "Horn Attack",
		pp: 25,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"HornDrill": {
		num: 32,
		accuracy: true,
		basePower: false,
		category: "Physical",
		desc: "The target faints; doesn't work on higher-leveled Pokemon.",
		id: "HornDrill",
		name: "Horn Drill",
		pp: 5,
		isContact: true,
		priority: 0,
		ohko: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"HornLeech": {
		num: 532,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Heals the user by half the damage inflicted.",
		id: "HornLeech",
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
	"Howl": {
		num: 336,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage.",
		id: "Howl",
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
	"Hurricane": {
		num: 542,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		desc: "Has a 30% chance to confuse the target. Has 100% accuracy during rain.",
		id: "Hurricane",
		name: "Hurricane",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 30,
			volatileStatus: 'confusion'
		},
		target: "normal",
		type: "Flying"
	},
	"HydroCannon": {
		num: 308,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
		id: "HydroCannon",
		name: "Hydro Cannon",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustRecharge'
		},
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"HydroPump": {
		num: 56,
		accuracy: 80,
		basePower: 120,
		category: "Special",
		desc: "Deals damage with no additional effect.",
		id: "HydroPump",
		name: "Hydro Pump",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"HyperBeam": {
		num: 63,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
		id: "HyperBeam",
		name: "Hyper Beam",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustRecharge'
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"HyperFang": {
		num: 158,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		desc: "Has a 10% chance to make the target flinch.",
		id: "HyperFang",
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
	"HyperVoice": {
		num: 304,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Deals damage with no additional effect.",
		id: "HyperVoice",
		name: "Hyper Voice",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"Hypnosis": {
		num: 95,
		accuracy: 60,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		id: "Hypnosis",
		name: "Hypnosis",
		pp: 20,
		isViable: true,
		priority: 0,
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"IceBall": {
		num: 301,
		accuracy: 90,
		basePower: 30,
		category: "Physical",
		desc: "The user attacks uncontrollably for five turns; this move's power doubles after each turn and also if Defense Curl was used beforehand. Its power resets after five turns have ended or if the attack misses.",
		id: "IceBall",
		name: "Ice Ball",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"IceBeam": {
		num: 58,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 10% chance to freeze the target.",
		id: "IceBeam",
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
	"IceBurn": {
		num: 554,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Charges for a turn before attacking. Has a 30% chance to burn the target.",
		id: "IceBurn",
		name: "Ice Burn",
		pp: 5,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('IceBurn')) return;
			this.add('prepare-move '+pokemon.id+' IceBurn');
			pokemon.addVolatile('IceBurn');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('IceBurn');
			}
		},
		secondary: {
			chance: 30,
			status: 'brn'
		},
		target: "normal",
		type: "Ice"
	},
	"IceFang": {
		num: 423,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		desc: "Has a 10% chance to freeze the target. Has 10% chance to make the target flinch. Both effects can occur from a single use.",
		id: "IceFang",
		name: "Ice Fang",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'frz'
		},
		target: "normal",
		type: "Ice"
	},
	"IcePunch": {
		num: 8,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 10% chance to freeze the target.",
		id: "IcePunch",
		name: "Ice Punch",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'frz'
		},
		target: "normal",
		type: "Ice"
	},
	"IceShard": {
		num: 420,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Usually goes first.",
		id: "IceShard",
		name: "Ice Shard",
		pp: 30,
		isViable: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"IcicleCrash": {
		num: 556,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "IcicleCrash",
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
	"IcicleSpear": {
		num: 333,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "IcicleSpear",
		name: "Icicle Spear",
		pp: 30,
		isViable: true,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Ice"
	},
	"IcyWind": {
		num: 196,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Lowers the target's Speed by 1 stage.",
		id: "IcyWind",
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
	"Imprison": {
		num: 286,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Until the user faints or switches out, the opponent cannot select any moves that it has in common with the user. In double battles, this move affects both opponents.",
		id: "Imprison",
		name: "Imprison",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Incinerate": {
		num: 510,
		accuracy: 100,
		basePower: 30,
		category: "Special",
		desc: "Devastate inflicts damage and renders the target's Berry unusable. Berries that would activate in response to Devastate, such as the Occa Berry, will be destroyed before their effect takes place. It also hits all opponents in double and all adjacent opponents in triple battles.",
		id: "Incinerate",
		name: "Incinerate",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"Inferno": {
		num: 517,
		accuracy: 50,
		basePower: 100,
		category: "Special",
		desc: "Has a 100% chance to burn the target.",
		id: "Inferno",
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
	"Ingrain": {
		num: 275,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user recovers 1/16 of its max HP after each turn, but it cannot be switched out or forced to switch out. If a Flying-type Pokemon or a Pokemon with Levitate comes under the effect of Ingrain, it will no longer have immunity from Ground-type attacks.",
		id: "Ingrain",
		name: "Ingrain",
		pp: 20,
		isViable: true,
		priority: 0,
		volatileStatus: 'Ingrain',
		effect: {
			onStart: function(pokemon) {
				this.add('r-volatile '+pokemon.id+' ingrain');
			},
			onResidualPriority: 50-7,
			onResidual: function(pokemon) {
				this.heal(pokemon.maxhp/16);
			},
			onModifyPokemon: function(pokemon) {
				pokemon.trapped = true;
			},
			onDragOut: false
		},
		secondary: false,
		target: "self",
		type: "Grass"
	},
	"IronDefense": {
		num: 334,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 2 stages.",
		id: "IronDefense",
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
	"IronHead": {
		num: 442,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "IronHead",
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
	"IronTail": {
		num: 231,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		desc: "Has a 30% chance to lower the target's Defense by 1 stage.",
		id: "IronTail",
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
	"Judgment": {
		num: 449,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "This move's type changes according to the user's held plate.",
		id: "Judgment",
		name: "Judgment",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal",
		typeCallback: function(pokemon) {
			return this.runEvent('Plate', pokemon, null, 'Judgment', 'Normal');
		}
	},
	"JumpKick": {
		num: 26,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "If this attack misses the target, the user half of its max health in recoil damage.",
		id: "JumpKick",
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
	"KarateChop": {
		num: 2,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "KarateChop",
		name: "Karate Chop",
		pp: 25,
		isContact: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Kinesis": {
		num: 134,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Accuracy by 1 stage.",
		id: "Kinesis",
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
	"KnockOff": {
		num: 282,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Disables the target's held item unless it has Sticky Hold or Multitype. Items lost to this move cannot be recovered by using Recycle.",
		id: "KnockOff",
		name: "Knock Off",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		onHit: function(target) {
			item = target.takeItem();
			if (item)
			{
				this.add('message Knocked off '+item.name+'.  (placeholder)');
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"LastResort": {
		num: 387,
		accuracy: 100,
		basePower: 140,
		category: "Physical",
		desc: "Fails until each other move in the user's moveset has been performed at least once; the user must also know at least one other move.",
		id: "LastResort",
		name: "Last Resort",
		pp: 5,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"LavaPlume": {
		num: 436,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 30% chance to burn the target.",
		id: "LavaPlume",
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
	"LeafBlade": {
		num: 348,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "LeafBlade",
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
	"LeafStorm": {
		num: 437,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages after use.",
		id: "LeafStorm",
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
	"LeafTornado": {
		num: 536,
		accuracy: 90,
		basePower: 65,
		category: "Special",
		desc: "Has a 50% chance to lower the target's Accuracy by one level.",
		id: "LeafTornado",
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
	"LeechLife": {
		num: 141,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
		id: "LeechLife",
		name: "Leech Life",
		pp: 15,
		isContact: true,
		priority: 0,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"LeechSeed": {
		num: 73,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "The user steals 1/8 of the target's max HP until the target is switched out, is KO'ed, or uses Rapid Spin; does not work against Grass-type Pokemon or Pokemon behind Substitutes.",
		id: "LeechSeed",
		name: "Leech Seed",
		pp: 10,
		isViable: true,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'LeechSeed',
		effect: {
			onStart: function(target) {
				this.add('r-volatile '+target.id+' seed');
			},
			onResidualPriority: 50-8,
			onResidual: function(pokemon) {
				var target = pokemon.side.foe.active[pokemon.volatiles['LeechSeed'].sourcePosition];
				if (!target || target.fainted)
				{
					this.debug('Nothing to leech into');
					return;
				}
				var damage = this.damage(pokemon.maxhp/8);
				if (damage)
				{
					this.heal(damage, target);
					this.add('residual '+pokemon.id+' leech-seed ?? ??'+pokemon.getHealth()+target.getHealth());
				}
			}
		},
		onHit: function(target) {
			if (target.hasType('Grass'))
			{
				this.add('r-immune '+target.id);
				return null;
			}
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"Leer": {
		num: 43,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Defense by 1 stage.",
		id: "Leer",
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
	"Lick": {
		num: 122,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		id: "Lick",
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
	"LightScreen": {
		num: 113,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "All Pokemon in the user's party receive 1/2 damage from Special attacks for 5 turns. Light Screen will be removed from the user's field if an opponent's Pokemon uses Brick Break. It will also last for eight turns if its user is holding Light Clay. In double battles, both Pokemon are shielded, but damage protection is reduced from 1/2 to 1/3.",
		id: "LightScreen",
		name: "Light Screen",
		pp: 30,
		isViable: true,
		priority: 0,
		sideCondition: 'LightScreen',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.item === 'LightClay')
				{
					return 8;
				}
				return 5;
			},
			onFoeBasePower: function(basePower, attacker, defender, move) {
				if (move.category === 'Special' && defender.side === this.effectData.target && !move.crit)
				{
					this.debug('Light Screen weaken');
					return basePower/2;
				}
			},
			onStart: function(side) {
				this.add('r-side-condition '+side.id+' LightScreen');
			},
			onEnd: function(side) {
				this.add('r-side-condition '+side.id+' LightScreen end');
			}
		},
		secondary: false,
		target: "allies",
		type: "Psychic"
	},
	"Lock-On": {
		num: 199,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "This move ensures that the user's next attack will hit against its current target. This effect can be Baton Passed to another Pokemon. Lock-On fails against Pokemon in the middle of using Protect, Detect, Dig Fly, Bounce or Dive, as well as Pokemon behind a Substitute. If the target uses Protect or Detect during its next turn, the user's next move has a [100 Varmove's normal accuracy]% chance to hit through Protect or Detect. OHKO moves do not benefit from this trait.",
		id: "Lock-On",
		name: "Lock-On",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"LovelyKiss": {
		num: 142,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		id: "LovelyKiss",
		name: "Lovely Kiss",
		pp: 10,
		isViable: true,
		priority: 0,
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"LowKick": {
		num: 67,
		accuracy: true,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var targetWeight = target.weightkg;
			if (target.weightkg > 200)
			{
				return 120;
			}
			if (target.weightkg > 100)
			{
				return 100;
			}
			if (target.weightkg > 50)
			{
				return 80;
			}
			if (target.weightkg > 25)
			{
				return 60;
			}
			if (target.weightkg > 10)
			{
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Base power increases as the target's weight increases.",
		id: "LowKick",
		name: "Low Kick",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"LowSweep": {
		num: 490,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Lowers the target's Speed by one level.",
		id: "LowSweep",
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
	"LuckyChant": {
		num: 381,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Critical hits are prevented against every Pokemon on the user's team, even if the user is switched out, for five turns.",
		id: "LuckyChant",
		name: "Lucky Chant",
		pp: 30,
		sideCondition: 'LuckyChant',
		effect: {
			duration: 5,
			onStart: function(side) {
				this.add('message The Lucky Chant shielded '+side.name+'\'s team from critical hits!'); // "The Lucky Chant shielded [side.name]'s team from critical hits!"
			},
			onCriticalHit: false,
			onEnd: function(side) {
				this.add('message '+side.name+'\'s team\'s Lucky Chant wore off!'); // "[side.name]'s team's Lucky Chant wore off!"
			}
		},
		priority: 0,
		secondary: false,
		target: "allies",
		type: "Normal"
	},
	"LunarDance": {
		num: 461,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user sacrifices itself so that its replacement will be cured of status conditions and have its HP and PP fully restored upon entering the field. This move fails if the user is the only non-fainted Pokemon on its team.",
		id: "LunarDance",
		name: "Lunar Dance",
		pp: 10,
		isViable: true,
		priority: 0,
		selfdestruct: true,
		sideCondition: 'HealingWish',
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"LusterPurge": {
		num: 295,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Has a 50% chance to lower the target's Special Defense by 1 stage.",
		id: "LusterPurge",
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
	"MachPunch": {
		num: 183,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Usually goes first.",
		id: "MachPunch",
		name: "Mach Punch",
		pp: 30,
		isViable: true,
		isContact: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"MagicCoat": {
		num: 277,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes first. Until the end of the turn, the user will reflect one disabling move back at its user (including teammates); these include status effect inducers, confusion inducers (including Flatter and Swagger), Attract, trapping moves that do not damage, Leech Seed, Worry Seed, Gastro Acid and negative stat modifiers (except Defog). In double battles, Magic Coat will only reflect the first applicable move performed against its user before wearing off.",
		id: "MagicCoat",
		name: "Magic Coat",
		pp: 15,
		isViable: true,
		priority: 4,
		volatileStatus: 'MagicCoat',
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('r-turnstatus '+target.id+' magic-coat');
			},
			onAllyFieldHit: function(target, source, move) {
				if (target === source) return;
				if (typeof move.isBounceable === 'undefined')
				{
					move.isBounceable = !!(move.status || move.forceSwitch);
				}
				if (move.target !== 'foeSide' && target !== this.effectData.target)
				{
					return;
				}
				if (this.pseudoWeather['MagicBounce'])
				{
					return;
				}
				if (move.isBounceable)
				{
					target.removeVolatile('MagicCoat');
					this.addPseudoWeather('MagicBounce');
					this.add('r-bounce-back '+source.id+' MagicCoat '+move.id+' '+target.id);
					this.moveHit(source, target, move);
					return null;
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"MagicRoom": {
		num: 478,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: null,
		id: "MagicRoom",
		name: "Magic Room",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"MagicalLeaf": {
		num: 345,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		id: "MagicalLeaf",
		name: "Magical Leaf",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"MagmaStorm": {
		num: 463,
		accuracy: 75,
		basePower: 120,
		category: "Special",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
		id: "MagmaStorm",
		name: "Magma Storm",
		pp: 5,
		isViable: true,
		priority: 0,
		volatileStatus: 'partiallyTrapped',
		secondary: false,
		target: "normal",
		type: "Fire"
	},
	"MagnetBomb": {
		num: 443,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		id: "MagnetBomb",
		name: "Magnet Bomb",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"MagnetRise": {
		num: 393,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user receives immunity against Ground-type attacks for five turns.",
		id: "MagnetRise",
		name: "Magnet Rise",
		pp: 10,
		isViable: true,
		priority: 0,
		volatileStatus: 'MagnetRise',
		effect: {
			duration: 5,
			onStart: function(target) {
				this.add('message Magnet Rise started. (placeholder)');
			},
			onImmunity: function(type) {
				if (type === 'Ground') return false;
			},
			onEnd: function(target) {
				this.add('message Magnet Rise ended. (placeholder)');
			}
		},
		secondary: false,
		target: "self",
		type: "Electric"
	},
	"Magnitude": {
		num: 222,
		accuracy: true,
		basePower: false,
		category: "Physical",
		desc: "Deals variable damage, between 10 base power and 130 base power, as well as double damage against Digging Pokemon.",
		id: "Magnitude",
		name: "Magnitude",
		pp: 30,
		priority: 0,
		secondary: false,
		target: "adjacent",
		type: "Ground"
	},
	"MeFirst": {
		num: 382,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move fails if it goes last; if the target selects a damaging move for its turn, the user copies the move and performs it with 1.5x power. In a double battle, a move copied by Me First that targets a single Pokemon will hit a random opponent; Me First cannot target the user's teammate.",
		id: "MeFirst",
		name: "Me First",
		pp: 20,
		isViable: true,
		priority: 0,
		onHit: function(target, pokemon) {
			var decision = this.willMove(target);
			if (decision)
			{
				var move = this.getMove(decision.move);
				if (move.category !== 'Status')
				{
					pokemon.addVolatile('MeFirst');
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
	"MeanLook": {
		num: 212,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "As long as the user remains in battle, the target cannot switch out unless it is holding Shed Shell or uses Baton Pass or U-Turn. The target will still be trapped if the user switches out by using Baton Pass.",
		id: "MeanLook",
		name: "Mean Look",
		pp: 5,
		isViable: true,
		priority: 0,
		onHit: function(target, source) {
			source.addVolatile('trapping', target);
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Meditate": {
		num: 96,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage.",
		id: "Meditate",
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
	"MegaDrain": {
		num: 72,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Restores the user's HP by 1/2 of the damage inflicted on the target.",
		id: "MegaDrain",
		name: "Mega Drain",
		pp: 15,
		priority: 0,
		drain: [1,2],
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"MegaKick": {
		num: 25,
		accuracy: 75,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "MegaKick",
		name: "Mega Kick",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"MegaPunch": {
		num: 5,
		accuracy: 85,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "MegaPunch",
		name: "Mega Punch",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Megahorn": {
		num: 224,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "Megahorn",
		name: "Megahorn",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"Memento": {
		num: 262,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user sacrifices itself to lower the target's Attack and Special Attack by 2 stages each.",
		id: "Memento",
		name: "Memento",
		pp: 10,
		isViable: true,
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
	"MetalBurst": {
		num: 368,
		accuracy: true,
		basePower: false,
		damageCallback: function(pokemon) {
			if (pokemon.lastHitBy && pokemon.lastHitBy.thisTurn)
			{
				return 1.5 * pokemon.lastHitBy.damage;
			}
			this.add('r-failed '+pokemon.id);
			return false;
		},
		category: "Physical",
		desc: "Fails unless the user goes last; if an opponent strikes with a Physical or a Special attack before the user's turn, the user retaliates for 1.5x the damage it had endured.",
		id: "MetalBurst",
		name: "Metal Burst",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"MetalClaw": {
		num: 232,
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		desc: "Has a 10% chance to raise the user's Attack by 1 stage.",
		id: "MetalClaw",
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
	"MetalSound": {
		num: 319,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Defense by 2 stages.",
		id: "MetalSound",
		name: "Metal Sound",
		pp: 40,
		priority: 0,
		boosts: {
			spd: -2
		},
		secondary: false,
		target: "normal",
		type: "Steel"
	},
	"MeteorMash": {
		num: 309,
		accuracy: 85,
		basePower: 100,
		category: "Physical",
		desc: "Has a 20% chance to raise the user's Attack by 1 stage.",
		id: "MeteorMash",
		name: "Meteor Mash",
		pp: 10,
		isViable: true,
		isContact: true,
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
	"Metronome": {
		num: 118,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user performs a randomly selected move; almost any move in the game could be picked. Metronome cannot generate itself, Assist, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Trick or any move that the user already knows.",
		id: "Metronome",
		name: "Metronome",
		pp: 10,
		priority: 0,
		onHit: function(target) {
			var moves = [];
			for (var i in exports.BattleMovedex)
			{
				var move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				var NoMetronome = {
					Assist:1, Chatter:1, Copycat:1, Counter:1, Covet:1, DestinyBond:1, Detect:1, Endure:1, Feint:1, FocusPunch:1, FollowMe:1, HelpingHand:1, MeFirst:1, Metronome:1, Mimic:1, MirrorCoat:1, MirrorMove:1, Protect:1, QuickGuard:1, Sketch:1, SleepTalk:1, Snatch:1, Struggle:1, Switcheroo:1, Thief:1, Trick:1, WideGuard:1
				};
				if (!NoMetronome[move.id])
				{
					moves.push(move.id);
				}
			}
			var move = '';
			if (moves.length) move = moves[parseInt(Math.random()*moves.length)];
			if (!move)
			{
				return false;
			}
			this.useMove(move, target);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"MilkDrink": {
		num: 208,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores 1/2 of the user's max HP.",
		id: "MilkDrink",
		name: "Milk Drink",
		pp: 10,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Mimic": {
		num: 102,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "This move is temporarily replaced by the target's last move; the replacement move will have 5 PP and become part of the user's moveset until the user switches out or the battle ends. Mimic copies attacks even if they miss or the user has immunity toward their type; it cannot copy itself, Struggle, Transform, Sketch, Metronome or moves that the user already knows, and it will fail if the target has yet to use a move.",
		id: "Mimic",
		name: "Mimic",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"MindReader": {
		num: 170,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "This move ensures that the user's next attack will hit against its current target. This effect can be Baton Passed to another Pokemon. Mind Reader fails against Pokemon in the middle of using Protect, Detect, Dig Fly, Bounce or Dive, as well as Pokemon behind a Substitute. If the target uses Protect or Detect during its next turn, the user's next move has a [100 Varmove's normal accuracy]% chance to hit through Protect or Detect. OHKO moves do not benefit from this trait.",
		id: "MindReader",
		name: "Mind Reader",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Minimize": {
		num: 107,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Evasion by 2 stage; however, Stomp retains its normal accuracy and gains doubled power against Minimized Pokemon.",
		id: "Minimize",
		name: "Minimize",
		pp: 20,
		priority: 0,
		boosts: {
			evasion: 2
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"MiracleEye": {
		num: 357,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Until the target faints or switches, the user's Accuracy modifiers and the target's Evasion modifiers are ignored. Dark-type targets also lose their immunity against Psychic-type moves.",
		id: "MiracleEye",
		name: "Miracle Eye",
		pp: 40,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"MirrorCoat": {
		num: 243,
		accuracy: true,
		basePower: false,
		damageCallback: function(pokemon) {
			if (pokemon.lastHitBy && pokemon.lastHitBy.thisTurn && this.getMove(pokemon.lastHitBy.move).category === 'Special')
			{
				return 2 * pokemon.lastHitBy.damage;
			}
			this.add('r-failed '+pokemon.id);
			return false;
		},
		category: "Special",
		desc: "Almost always goes last; if an opponent strikes with a Special attack before the user's turn, the user retaliates for twice the damage it had endured. In double battles, this attack targets the last opponent to hit the user with a Special attack and cannot hit the user's teammate.",
		id: "MirrorCoat",
		name: "Mirror Coat",
		pp: 20,
		isViable: true,
		priority: -5,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"MirrorMove": {
		num: 119,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user performs the last move executed by its target; if applicable, an attack's damage is calculated with the user's stats, level and type(s). This moves fails if the target has not yet used a move. Mirror Move cannot copy Encore, Struggle, global moves affecting all Pokemon on the field (such as Gravity, Hail, Rain Dance, Sandstorm and Sunny Day) moves that can bypass Protect (Acupressure, Doom Desire, Future Sight, Imprison, Perish Song, Psych Up, Role Play and Transform) and moves that do not have a specific target (such as Light Screen, Reflect, Safeguard, Spikes, Stealth Rock and Toxic Spikes).",
		id: "MirrorMove",
		name: "Mirror Move",
		pp: 20,
		priority: 0,
		onHit: function(target, source) {
			if (!target.lastMove || target.lastMove === 'MirrorMove')
			{
				return false;
			}
			this.useMove(this.lastMove, source);
		},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"MirrorShot": {
		num: 429,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Has a 30% chance to lower the target's Accuracy by 1 stage.",
		id: "MirrorShot",
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
	"Mist": {
		num: 54,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Protects every Pokemon on the user's team from negative stat modifiers caused by other Pokemon (including teammates), but not by itself, for five turns. The team's Accuracy and Evasion stats are also protected. Moves that cause negative stat modifiers as a secondary effect, such as Psychic, still deal their regular damage.",
		id: "Mist",
		name: "Mist",
		pp: 30,
		priority: 0,
		secondary: false,
		target: "allies",
		type: "Ice"
	},
	"MistBall": {
		num: 296,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Has a 50% chance to lower the target's Special Attack by 1 stage.",
		id: "MistBall",
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
	"Moonlight": {
		num: 236,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores a fraction of the user's max HP depending on the weather: 2/3 during Sunny Day, 1/2 during regular weather and 1/4 during Rain Dance, Hail and Sandstorm.",
		id: "Moonlight",
		name: "Moonlight",
		pp: 5,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"MorningSun": {
		num: 234,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores a fraction of the user's max HP depending on the weather: 2/3 during Sunny Day, 1/2 during regular weather and 1/4 during Rain Dance, Hail and Sandstorm.",
		id: "MorningSun",
		name: "Morning Sun",
		pp: 5,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Mud-Slap": {
		num: 189,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Accuracy by 1 stage.",
		id: "Mud-Slap",
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
	"MudBomb": {
		num: 426,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Has a 30% chance to lower the target's Accuracy by 1 stage.",
		id: "MudBomb",
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
	"MudShot": {
		num: 341,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Lowers the target's Speed by 1 stage.",
		id: "MudShot",
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
	"MudSport": {
		num: 300,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "All Electric-type moves are 50% weaker until the user switches out.",
		id: "MudSport",
		name: "Mud Sport",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "all",
		type: "Ground"
	},
	"MuddyWater": {
		num: 330,
		accuracy: 85,
		basePower: 95,
		category: "Special",
		desc: "Lowers the target's Accuracy by 1 stage.",
		id: "MuddyWater",
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
	"NastyPlot": {
		num: 417,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack by 2 stages.",
		id: "NastyPlot",
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
	"NaturalGift": {
		num: 363,
		accuracy: 100,
		basePower: false,
		basePowerCallback: function(pokemon) {
			var item = pokemon.getItem();
			if (!item.id || !item.naturalGift)
			{
				return false;
			}
			pokemon.setItem('');
			return item.naturalGift.basePower;
		},
		category: "Physical",
		desc: "The user's berry is thrown at the target. This attack's base power and type vary depending on the thrown berry. The berry is gone for the rest of the battle unless Recycle is used; it will return to the original holder after wireless battles but will be permanently lost if it is thrown during in-game battles.",
		id: "NaturalGift",
		name: "Natural Gift",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal",
		typeCallback: function(pokemon) {
			var item = pokemon.getItem();
			if (!item.id || !item.naturalGift)
			{
				return 'Normal';
			}
			return item.naturalGift.type;
		}
	},
	"NaturePower": {
		num: 267,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "The user generates another move depending on the battle's current terrain. It generates Seed Bomb in any type of grass (as well as in puddles), Hydro Pump while surfing on top of water, Rock Slide on any rocky outdoor terrain and inside of caves, Earthquake on beach sand, desert sand and dirt paths (as well as Wifi), Blizzard in snow, and Tri Attack everywhere else. In Battle Revolution, the move generates Tri Attack at Courtyard, Main Street and Neon, Seed Bomb at Sunny Park and Waterfall, Hydro Pump at Gateway, Rock Slide at Crystal, Magma and Stargazer and Earthquake at Sunset.",
		id: "NaturePower",
		name: "Nature Power",
		pp: 20,
		isViable: true,
		priority: 0,
		onHit: function(target) {
			this.useMove('Earthquake', target);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"NaturePower(Wifi)": {
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "Earthquake.",
		id: "NaturePower(Wifi)",
		name: "Nature Power (Wifi)",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"NeedleArm": {
		num: 302,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "NeedleArm",
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
	"NightDaze": {
		num: 539,
		accuracy: 95,
		basePower: 85,
		category: "Special",
		desc: "Has a 40% chance to lower the target's Accuracy by one level.",
		id: "NightDaze",
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
	"NightShade": {
		num: 101,
		accuracy: true,
		basePower: false,
		damage: 'level',
		category: "Special",
		desc: "Does damage equal to user's level.",
		id: "NightShade",
		name: "Night Shade",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"NightSlash": {
		num: 400,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "NightSlash",
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
	"Nightmare": {
		num: 171,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "This move only works on a sleeping target; as long as the target remains asleep and in battle, 1/4 of its max HP is sapped after each turn.",
		id: "Nightmare",
		name: "Nightmare",
		pp: 15,
		priority: 0,
		effect: {
			onResidualPriority: 50-9,
		},
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"Octazooka": {
		num: 190,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		desc: "Has a 50% chance to lower the target's Accuracy by 1 stage.",
		id: "Octazooka",
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
	"OdorSleuth": {
		num: 316,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Until the target faints or switches, the user's Accuracy modifiers and the target's Evasion modifiers are ignored. Ghost-type targets also lose their immunities against Normal-type and Fighting-type moves.",
		id: "OdorSleuth",
		name: "Odor Sleuth",
		pp: 40,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"OminousWind": {
		num: 466,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 10% chance to raise all of the user's stats by 1 stage.",
		id: "OminousWind",
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
	"Outrage": {
		num: 200,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user attacks uncontrollably for 2-3 turns and then gets confused.",
		id: "Outrage",
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
	"Overheat": {
		num: 315,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages after use.",
		id: "Overheat",
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
	"PainSplit": {
		num: 220,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Calculates the average of the user's current HP and the target's HP; the HP of both Pokemon is set to this average. Pokemon can be healed by Pain Split even under the effects of Heal Block.",
		id: "PainSplit",
		name: "Pain Split",
		pp: 20,
		isViable: true,
		priority: 0,
		onHit: function(target, pokemon) {
			var averagehp = parseInt(target.hp + pokemon.hp) / 2;
			target.sethp(averagehp);
			pokemon.sethp(averagehp);
			this.add('r-pain-split '+target.id+' '+pokemon.id+' ?? ??'+target.getHealth()+pokemon.getHealth());
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"PayDay": {
		num: 6,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "The player picks up extra money after in-game battles; the money received is equal to: [user's level * 5 * number of times Pay Day is used]. The player does not lose money if the opponent uses Pay Day but the player wins the battle.",
		id: "PayDay",
		name: "Pay Day",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Payback": {
		num: 371,
		accuracy: true,
		basePower: 50,
		basePowerCallback: function(pokemon, target) {
			if (target.newlySwitched)
			{
				this.debug('Payback NOT boosted on a switch');
				return 50;
			}
			if (this.willMove(target))
			{
				this.debug('Payback NOT boosted');
				return 50;
			}
			this.debug('Payback damage boost');
			return 100;
		},
		category: "Physical",
		desc: "Base power is 50; power doubles if the target goes before the user.",
		id: "Payback",
		name: "Payback",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"Peck": {
		num: 64,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "Peck",
		name: "Peck",
		pp: 35,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"PerishSong": {
		num: 195,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "All active Pokemon will faint in 3 turns unless they are switched out.",
		id: "PerishSong",
		name: "Perish Song",
		pp: 5,
		isViable: true,
		priority: 0,
		onHit: function(target) {
			this.add('r-perish-song '+target.id);
			for (var i=0; i<this.sides.length; i++)
			{
				for (var j=0; j<this.sides[i].active.length; j++)
				{
					this.sides[i].active[j].addVolatile('PerishSong');
				}
			}
		},
		effect: {
			duration: 4,
			onEnd: function(target) {
				this.add('r-volatile '+target.id+' perish0');
				target.faint();
			},
			onResidual: function(pokemon) {
				var duration = pokemon.volatiles['PerishSong'].duration;
				this.add('r-volatile '+pokemon.id+' perish'+duration);
			}
		},
		secondary: false,
		target: "all",
		type: "Normal"
	},
	"PetalDance": {
		num: 80,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "The user attacks uncontrollably for 2-3 turns and then gets confused.",
		id: "PetalDance",
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
	"PinMissile": {
		num: 42,
		accuracy: 85,
		basePower: 14,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "PinMissile",
		name: "Pin Missile",
		pp: 20,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"Pluck": {
		num: 365,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "The user eats the target's held berry and, if applicable, receives its benefits. Jaboca Berry will be removed without damaging the user, but Coba Berry will still activate and reduce this move's power. The target can still recover its held berry by using Recycle.",
		id: "Pluck",
		name: "Pluck",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"PoisonFang": {
		num: 305,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a 30% chance to inflict Toxic poison on the target.",
		id: "PoisonFang",
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
	"PoisonGas": {
		num: 139,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Poisons the target.",
		id: "PoisonGas",
		name: "Poison Gas",
		pp: 40,
		priority: 0,
		status: 'psn',
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"PoisonJab": {
		num: 398,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 30% chance to poison the target.",
		id: "PoisonJab",
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
	"PoisonPowder": {
		num: 77,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Poisons the target.",
		id: "PoisonPowder",
		name: "PoisonPowder",
		pp: 35,
		priority: 0,
		status: 'psn',
		affectedByImmunities: true,
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"PoisonSting": {
		num: 40,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		desc: "Has a 30% chance to poison the target.",
		id: "PoisonSting",
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
	"PoisonTail": {
		num: 342,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a high critical hit ratio and a 10% chance to poison the target.",
		id: "PoisonTail",
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
	"Pound": {
		num: 1,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "Pound",
		name: "Pound",
		pp: 35,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"PowderSnow": {
		num: 181,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to freeze the target.",
		id: "PowderSnow",
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
	"PowerGem": {
		num: 408,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Deals damage with no additional effect.",
		id: "PowerGem",
		name: "Power Gem",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"PowerSplit": {
		num: 471,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Averages Attack and Special Attack with the target.",
		id: "PowerSplit",
		name: "Power Split",
		pp: 10,
		priority: -7,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"PowerSwap": {
		num: 384,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user swaps Attack and Special Attack modifiers with its target.",
		id: "PowerSwap",
		name: "Power Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			var sourceBoosts = {};
			
			for (var i in {atk:1,spa:1})
			{
				targetBoosts[i] = target.baseBoosts[i];
			}
			for (var i in {atk:1,spa:1})
			{
				sourceBoosts[i] = source.baseBoosts[i];
			}
			
			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);
			
			this.add('message Offensive boosts swapped. (placeholder; graphics will be incorrect)');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"PowerTrick": {
		num: 379,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user switches its Defense and Attack stats. Attack and Defense modifiers continue to affect their original stats only.",
		id: "PowerTrick",
		name: "Power Trick",
		pp: 10,
		priority: 0,
		volatileStatus: 'PowerTrick',
		effect: {
			onStart: function(pokemon) {
				this.add('message Attack and Defense swapped. (placeholder)');
			},
			onRestart: function(pokemon) {
				this.add('message Attack and Defense swapped. (placeholder)');
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
	"PowerWhip": {
		num: 438,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "PowerWhip",
		name: "Power Whip",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"Present": {
		num: 217,
		accuracy: true,
		basePower: false,
		basePowerCallback: function() {
			var rand = Math.random() * 8;
			if (rand < 1)
			{
				return 120;
			}
			else if (rand < 4)
			{
				return 80;
			}
			return 40;
		},
		category: "Physical",
		desc: "Randomly either attacks with a variable power, between 40 base power and 120 base power, or heals the target by 80 HP.",
		id: "Present",
		name: "Present",
		pp: 15,
		priority: 0,
		onHit: function(target, source) {
			if (Math.random() * 10 < 2)
			{
				this.heal(80, target);
				return null;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Protect": {
		num: 182,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes first. The user is protected from all attacks for one turn, but the move's success rate halves with each consecutive use of Protect, Detect or Endure. If a Pokemon has No Guard, or used Lock-On or Mind Reader against the user during the previous turn, its attack has a [100 Varmove's normal accuracy]% chance to hit through Protect; OHKO moves do not benefit from this effect. Blizzard has a 30% to hit through this move during Hail, as does Thunder during Rain Dance.",
		id: "Protect",
		name: "Protect",
		pp: 10,
		isViable: true,
		priority: 4,
		stallingMove: true, // decrease success of repeated use to 50%
		volatileStatus: 'Protect',
		onHit: function(pokemon) {
			if (!this.willAct())
			{
				return false;
			}
			var counter = 0;
			if (pokemon.volatiles['stall'])
			{
				counter = pokemon.volatiles['stall'].counter || 0;
			}
			if (counter >= 8) counter = 32;
			if (counter > 0 && Math.random()*Math.pow(2, counter) > 1)
			{
				return false;
			}
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('r-volatile '+target.id+' protect');
			},
			onHitPriority: 1,
			onHit: function(target, source, effect) {
				if (effect && (effect.id === 'Feint' || effect.id === 'RolePlay'))
				{
					return;
				}
				this.add('r-volatile '+target.id+' protect');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove)
				{
					// Outrage counter is removed
					if (source.volatiles['lockedmove'].duration === 1)
					{
						source.removeVolatile('lockedmove');
					}
					else
					{
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
	"Psybeam": {
		num: 60,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 10% chance to confuse the target.",
		id: "Psybeam",
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
	"PsychUp": {
		num: 244,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user copies all six of the target's current stat modifiers.",
		id: "PsychUp",
		name: "Psych Up",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetBoosts = {};
			
			for (var i in target.baseBoosts)
			{
				targetBoosts[i] = target.baseBoosts[i];
			}
			
			source.setBoost(targetBoosts);
			
			this.add('message Copied. (placeholder; graphics will be incorrect)');
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Psychic": {
		num: 94,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		id: "Psychic",
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
	"PsychoBoost": {
		num: 354,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages after use.",
		id: "PsychoBoost",
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
	"PsychoCut": {
		num: 427,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "PsychoCut",
		name: "Psycho Cut",
		pp: 20,
		isViable: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"PsychoShift": {
		num: 375,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "The user is cured of status effects by passing them to a healthy target.",
		id: "PsychoShift",
		name: "Psycho Shift",
		pp: 10,
		isViable: true,
		priority: 0,
		onHit: function(target, pokemon) {
			if (!pokemon.status || target.status || !target.setStatus(pokemon.status))
			{
				return false;
			}
			this.add('r-psycho-shift '+pokemon.id+' '+target.id);
			pokemon.setStatus('');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Psyshock": {
		num: 473,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "Inflicts damage based on the target's Defense, not Special Defense.",
		id: "Psyshock",
		name: "Psyshock",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Psystrike": {
		num: 540,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "Inflicts damage based on the target's Defense, not Special Defense.",
		id: "Psystrike",
		name: "Psystrike",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Psywave": {
		num: 149,
		accuracy: true,
		basePower: false,
		damageCallback: function(pokemon) {
			return parseInt((Math.random()*11 + 5) * pokemon.level / 10);
		},
		category: "Special",
		desc: "Randomly inflicts set damage equal to .5x, .6x, .7x, .8x, .9x, 1.0x, 1.1x, 1.2x, 1.3x, 1.4x or 1.5x the user's level.",
		id: "Psywave",
		name: "Psywave",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Punishment": {
		num: 386,
		accuracy: true,
		basePower: 60,
		basePowerCallback: function(pokemon, target) {
			return 60 + 20 * target.positiveBoosts();
		},
		category: "Physical",
		desc: null,
		id: "Punishment",
		name: "Punishment",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"Pursuit": {
		num: 228,
		accuracy: 100,
		basePower: 40,
		basePowerCallback: function(pokemon, target) {
			// you can't get here unless the pursuit succeeds
			if (target.beingCalledBack)
			{
				this.debug('Pursuit damage boost');
				return 80;
			}
			return 40;
		},
		category: "Physical",
		desc: "If the target switches out on the current turn, this move strikes with doubled power before the switch. Baton Passers still escape safely. When a faster Pokemon uses Pursuit against a U-Turner, the U-Turner is hit for normal damage; when a slower Pokemon uses Pursuit against a U-Turner, the U-Turner makes its attack, then is hit by Pursuit for double power, and switches out.",
		id: "Pursuit",
		name: "Pursuit",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		beforeTurnCallback: function(pokemon, target) {
			target.side.addSideCondition('Pursuit', pokemon);
			if (!target.side.sideConditions['Pursuit'].sources)
			{
				target.side.sideConditions['Pursuit'].sources = [];
			}
			target.side.sideConditions['Pursuit'].sources.push(pokemon);
		},
		effect: {
			duration: 1,
			onSwitchOut: function(pokemon) {
				this.debug('Pursuit start');
				var sources = this.effectData.sources;
				this.add('residual '+pokemon.id+' switch-out');
				for (var i=0; i<sources.length; i++)
				{
					if (sources[i].movedThisTurn || sources[i].status === 'slp' || sources[i].status === 'frz' || sources[i].volatiles['Truant'])
					{
						continue;
					}
					this.useMove('Pursuit', sources[i], pokemon);
					sources[i].deductPP('Pursuit');
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"Quash": {
		num: 511,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "The target of Quash will act last in that turn, provided it has not yet acted.",
		id: "Quash",
		name: "Quash",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"QuickAttack": {
		num: 98,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Usually goes first.",
		id: "QuickAttack",
		name: "Quick Attack",
		pp: 30,
		isViable: true,
		isContact: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"QuickGuard": {
		num: 501,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: null,
		id: "QuickGuard",
		name: "Quick Guard",
		pp: 15,
		priority: 3,
		sideCondition: 'QuickGuard',
		onHit: function(side, source) {
			if (!this.willAct())
			{
				return false;
			}
			var counter = 0;
			if (source.volatiles['stall'])
			{
				counter = source.volatiles['stall'].counter || 0;
			}
			if (counter >= 8) counter = 32;
			if (counter > 0 && Math.random()*Math.pow(2, counter) > 1)
			{
				return false;
			}
			source.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function(target) {
				this.add('r-volatile '+target.id+' protect');
			},
			onHitPriority: 1,
			onHit: function(target, source, effect) {
				if (effect && (effect.id === 'Feint' || effect.priority <= 0))
				{
					return;
				}
				this.add('r-volatile '+target.id+' protect');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove)
				{
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
	"QuiverDance": {
		num: 483,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Special Attack, Special Defense, and Speed by one stage.",
		id: "QuiverDance",
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
	"Rage": {
		num: 99,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "The user's Attack rises by 1 stage if attacked before its next move.",
		id: "Rage",
		name: "Rage",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"RagePowder": {
		num: 476,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: null,
		id: "RagePowder",
		name: "Rage Powder",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"RainDance": {
		num: 240,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Cancels all other weather moves. For 5 turns: the power of Water attacks is increased by 50%, the power of Fire attacks is decreased by 50%, Thunder never misses and has a 30% chance to hit through Protect and Detect, the power of Solarbeam is halved, and the healing power of Morning Sun, Synthesis and Moonlight is decreased from 1/2 to 1/4 of the user's max HP. The effects of Rain Dance will last for eight turns if its user is holding Damp Rock.",
		id: "RainDance",
		name: "Rain Dance",
		pp: 5,
		isViable: true,
		priority: 0,
		weather: 'RainDance',
		secondary: false,
		target: "all",
		type: "Water"
	},
	"RapidSpin": {
		num: 229,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Removes Spikes, Stealth Rock, Toxic Spikes and Leech Seed from the user's side of the field; also frees the user from Bind, Clamp, Fire Spin, Magma Storm, Sand Tomb, Whirlpool and Wrap. These effects do not occur if the move misses or is used against Ghost-type Pokemon.",
		id: "RapidSpin",
		name: "Rapid Spin",
		pp: 40,
		isViable: true,
		isContact: true,
		priority: 0,
		self: {
			onHit: function(pokemon) {
				if (pokemon.removeVolatile('LeechSeed'))
				{
					this.add('r-blow-away '+pokemon.id+' LeechSeed');
				}
				if (pokemon.side.removeSideCondition('Spikes'))
				{
					this.add('r-blow-away '+pokemon.id+' Spikes');
				}
				if (pokemon.side.removeSideCondition('ToxicSpikes'))
				{
					this.add('r-blow-away '+pokemon.id+' ToxicSpikes');
				}
				if (pokemon.side.removeSideCondition('StealthRock'))
				{
					this.add('r-blow-away '+pokemon.id+' StealthRock');
				}
				if (pokemon.volatiles['partiallyTrapped'])
				{
					this.add('r-blow-away '+pokemon.id+' '+pokemon.volatiles['partiallyTrapped'].sourceEffect.id);
					delete pokemon.volatiles['partiallyTrapped'];
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"RazorLeaf": {
		num: 75,
		accuracy: 95,
		basePower: 55,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "RazorLeaf",
		name: "Razor Leaf",
		pp: 25,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "foes",
		type: "Grass"
	},
	"RazorShell": {
		num: 534,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's Defense by one level.",
		id: "RazorShell",
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
	"RazorWind": {
		num: 13,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "The user prepares on turn one, becoming uncontrollable, and then attacks on turn two. Has a high critical hit ratio.",
		id: "RazorWind",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('RazorWind')) return;
			this.add('prepare-move '+pokemon.id+' RazorWind');
			pokemon.addVolatile('RazorWind');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('RazorWind');
			}
		},
		critRatio: 2,
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"Recover": {
		num: 105,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores 1/2 of the user's max HP.",
		id: "Recover",
		name: "Recover",
		pp: 10,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Recycle": {
		num: 278,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user's lost item is recovered. Items lost to Bug Bite, Fling, Natural Gift and Pluck will be recovered if the user of Recycle was the item's original holder; items lost to Trick, Switcheroo, Thief, Covet or Knock Off cannot be recovered.",
		id: "Recycle",
		name: "Recycle",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Reflect": {
		num: 115,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "All Pokemon in the user's party receive 1/2 damage from Physical attacks for 5 turns. Reflect will be removed from the user's field if an opponent's Pokemon uses Brick Break. It will also last for eight turns if its user is holding Light Clay. In double battles, both Pokemon are shielded, but damage protection is reduced from 1/2 to 1/3.",
		id: "Reflect",
		name: "Reflect",
		pp: 20,
		isViable: true,
		priority: 0,
		sideCondition: 'Reflect',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.item === 'LightClay')
				{
					return 8;
				}
				return 5;
			},
			onFoeBasePower: function(basePower, attacker, defender, move) {
				if (move.category === 'Physical' && defender.side === this.effectData.target && !move.crit)
				{
					this.debug('Reflect weaken');
					return basePower/2;
				}
			},
			onStart: function(side) {
				this.add('r-side-condition '+side.id+' Reflect');
			},
			onEnd: function(side) {
				this.add('r-side-condition '+side.id+' Reflect end');
			}
		},
		secondary: false,
		target: "allies",
		type: "Psychic"
	},
	"ReflectType": {
		num: 513,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "User becomes the target's type.",
		id: "ReflectType",
		name: "Reflect Type",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Refresh": {
		num: 287,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user recovers from burn, poison and paralysis.",
		id: "Refresh",
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
	"RelicSong": {
		num: 547,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "has a 10% chance of putting the target to sleep. Ancient Song hits all opponents in double battles and hits all adjacent opponents in triple battles. When used by Meloetta in battle, it will also cause it to change between its Voice and Step Formes.",
		id: "RelicSong",
		name: "Relic Song",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'slp'
		},
		onHit: function(target, pokemon) {
			if (pokemon.baseTemplate.species !== 'Meloetta')
			{
				return;
			}
			if (pokemon.template.species==='Meloetta-S' && pokemon.transformInto('Meloetta'))
			{
				//this.add('r-transform '+pokemon.id+' Meloetta');
			}
			else if (pokemon.transformInto('Meloetta-S'))
			{
				//this.add('r-transform '+pokemon.id+' Meloetta-S');
			}
			// renderer takes care of this for us
		},
		target: "normal",
		type: "Normal"
	},
	"Rest": {
		num: 156,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is cured of status effects (not confusion), and recovers full HP, but falls asleep for 2 turns. Pokemon who have Early Bird will wake up one turn early.",
		id: "Rest",
		name: "Rest",
		pp: 10,
		isViable: true,
		priority: 0,
		onHit: function(target) {
			if (target.hp >= target.maxhp || !target.setStatus('slp'))
			{
				return false;
			}
			target.statusData.time = 3;
			target.statusData.startTime = 3;
			target.heal(target.maxhp);
			this.add('r-rested '+target.id);
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"Retaliate": {
		num: 514,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: null,
		id: "Retaliate",
		name: "Retaliate",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Return": {
		num: 216,
		accuracy: 100,
		basePower: false,
		category: "Physical",
		desc: "Power increases as user's happiness increases; maximum 102 BP.",
		id: "Return",
		name: "Return",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Revenge": {
		num: 279,
		accuracy: 100,
		basePower: 60,
		basePowerCallback: function(pokemon, target) {
			if (pokemon.lastHitBy && pokemon.lastHitBy.thisTurn)
			{
				this.debug('Boosted for getting hit by '+pokemon.lastHitBy.move);
				return 120;
			}
			return 60;
		},
		category: "Physical",
		desc: "Almost always goes last, even after another Pokemon's Focus Punch; this move's base power doubles if the user is damaged before its turn.",
		id: "Revenge",
		name: "Revenge",
		pp: 10,
		isContact: true,
		priority: -4,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Reversal": {
		num: 179,
		accuracy: true,
		basePower: false,
		basePowerCallback: function(pokemon, target) {
			var hpPercent = pokemon.hpPercent(pokemon.hp);
			if (hpPercent <= 5)
			{
				return 200;
			}
			if (hpPercent <= 10)
			{
				return 150;
			}
			if (hpPercent <= 20)
			{
				return 100;
			}
			if (hpPercent <= 35)
			{
				return 80;
			}
			if (hpPercent <= 70)
			{
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Base power increases as the user's HP decreases.",
		id: "Reversal",
		name: "Reversal",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Roar": {
		num: 46,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes last; in trainer battles, the target is switched out for a random member of its team. Escapes from wild battles. Has no effect if the target has Suction Cups, Soundproof or used Ingrain.",
		id: "Roar",
		name: "Roar",
		pp: 20,
		isViable: true,
		priority: -6,
		forceSwitch: true,
		notSubBlocked: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"RoarofTime": {
		num: 459,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
		id: "RoarofTime",
		name: "Roar of Time",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustRecharge'
		},
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"RockBlast": {
		num: 350,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "RockBlast",
		name: "Rock Blast",
		pp: 10,
		isViable: true,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"RockClimb": {
		num: 431,
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		desc: "Has a 20% chance to confuse the target.",
		id: "RockClimb",
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
	"RockPolish": {
		num: 397,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Speed by 2 stages.",
		id: "RockPolish",
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
	"RockSlide": {
		num: 157,
		accuracy: 90,
		basePower: 75,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "RockSlide",
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
	"RockSmash": {
		num: 249,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's Defense by 1 stage.",
		id: "RockSmash",
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
	"RockThrow": {
		num: 88,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "RockThrow",
		name: "Rock Throw",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"RockTomb": {
		num: 317,
		accuracy: 80,
		basePower: 50,
		category: "Physical",
		desc: "Lowers the target's Speed by 1 stage.",
		id: "RockTomb",
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
	"RockWrecker": {
		num: 439,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		desc: "The user recharges during its next turn; as a result, until the end of the next turn, the user becomes uncontrollable.",
		id: "RockWrecker",
		name: "Rock Wrecker",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustRecharge'
		},
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"RolePlay": {
		num: 272,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user's own ability is overwritten with the target's ability; does nothing if the target's ability is Multitype or Wonder Guard.",
		id: "RolePlay",
		name: "Role Play",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			if (target.ability === 'Multitype' || target.ability === 'WonderGuard' || target.ability === source.ability)
			{
				return false;
			}
			if (source.setAbility(target.ability))
			{
				this.add('message '+source.name+' copied '+target.name+'\'s '+source.ability+'! (placeholder)');
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"RollingKick": {
		num: 27,
		accuracy: 85,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "RollingKick",
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
	"Rollout": {
		num: 205,
		accuracy: 90,
		basePower: 30,
		category: "Physical",
		desc: "The user attacks uncontrollably for five turns; this move's power doubles after each turn and also if Defense Curl was used beforehand. Its power resets after five turns have ended or if the attack misses.",
		id: "Rollout",
		name: "Rollout",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"Roost": {
		num: 355,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user recovers 1/2 of its max HP; if it is a Flying-type Pokemon, it also loses its Flying-type classification until the start of the next turn.",
		id: "Roost",
		name: "Roost",
		pp: 10,
		isViable: true,
		priority: 0,
		heal: [1,2],
		volatileStatus: 'Roost',
		effect: {
			duration: 1,
			onModifyPokemonPriority: 100,
			onModifyPokemon: function(pokemon) {
				if (pokemon.hasType('Flying'))
				{
					// don't just delete the type; since
					// the types array may be a pointer to the
					// types array in the Pokedex.
					if (pokemon.types[0] === 'Flying')
					{
						pokemon.types = [pokemon.types[1]];
					}
					else
					{
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
	"Round": {
		num: 496,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Canon will damage the entire opposing team in a double or triple battle if it hits. It will double in power if used consecutively by teammates and will be used by teammates directly after the fist user regardless of speed.",
		id: "Round",
		name: "Round",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"SacredFire": {
		num: 221,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "Has a 50% chance to burn the target; can be used while frozen, which both attacks the target normally and thaws the user.",
		id: "SacredFire",
		name: "Sacred Fire",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 50,
			status: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"SacredSword": {
		num: 533,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "The stat modifications of the target's Defense and Evasion are ignored when using this attack. However, Sacred Sword does not bypass Reflect.",
		id: "SacredSword",
		name: "Sacred Sword",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Safeguard": {
		num: 219,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Protects the user's entire team from status conditions for five turns.",
		id: "Safeguard",
		name: "Safeguard",
		pp: 25,
		priority: 0,
		sideCondition: 'Safeguard',
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'Persistent')
				{
					return 7;
				}
				return 5;
			},
			onSetStatus: function() {
				this.debug('interrupting setstatus');
				return false;
			},
			onStart: function(side) {
				this.add('r-side-condition '+side.id+' Safeguard');
			},
			onEnd: function(side) {
				this.add('r-side-condition '+side.id+' Safeguard end');
			}
		},
		secondary: false,
		target: "allies",
		type: "Normal"
	},
	"Sand-Attack": {
		num: 28,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Accuracy by 1 stage.",
		id: "Sand-Attack",
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
	"SandTomb": {
		num: 328,
		accuracy: 85,
		basePower: 35,
		category: "Physical",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
		id: "SandTomb",
		name: "Sand Tomb",
		pp: 15,
		priority: 0,
		volatileStatus: 'partiallyTrapped',
		secondary: false,
		target: "normal",
		type: "Ground"
	},
	"Sandstorm": {
		num: 201,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Cancels all other weather moves. For 5 turns: the Special Defense of Rock-type Pokemon is boosted by 50%, each active Pokemon, even when protected by a Substitute, loses 1/16 of its max HP unless it has Sand Veil or is a Ground-, Rock-, or Steel-type, the power of Solarbeam is halved, and the healing power of Morning Sun, Synthesis and Moonlight is halved. The effects of Sandstorm will last for eight turns if its user is holding Smooth Rock.",
		id: "Sandstorm",
		name: "Sandstorm",
		pp: 10,
		priority: 0,
		weather: 'Sandstorm',
		secondary: false,
		target: "all",
		type: "Rock"
	},
	"Scald": {
		num: 503,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 30% chance to burn the target.",
		id: "Scald",
		name: "Scald",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'brn'
		},
		target: "normal",
		type: "Water"
	},
	"ScaryFace": {
		num: 184,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Speed by 2 stages.",
		id: "ScaryFace",
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
	"Scratch": {
		num: 10,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "Scratch",
		name: "Scratch",
		pp: 35,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Screech": {
		num: 103,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Defense by 2 stages.",
		id: "Screech",
		name: "Screech",
		pp: 40,
		priority: 0,
		boosts: {
			def: -2
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"SearingShot": {
		num: 545,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Has a 30% chance to burn the target.",
		id: "SearingShot",
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
	"SecretPower": {
		num: 290,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "This move has a 30% chance to inflict a side effect depending on the battle's current terrain. The target may be put to sleep in any type of grass (or in puddles), its Attack may be lowered by 1 stage while surfing on any body of water, its Speed may be lowered by 1 stage while on marshy terrain, its Accuracy may be lowered by 1 stage on beach sand, desert sand and dirt paths (and also in Wifi battles), it may flinch in caves or on rocky outdoor terrain, it may become frozen on snowy terrain and it may become paralyzed everywhere else.",
		id: "SecretPower",
		name: "Secret Power",
		pp: 20,
		priority: 0,
		secondary: {
			chance: 30
		},
		target: "normal",
		type: "Normal"
	},
	"SecretSword": {
		num: 548,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		defensiveCategory: "Physical",
		desc: "Inflicts damage based on the target's Defense, not Special Defense.",
		id: "SecretSword",
		name: "Secret Sword",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"SeedBomb": {
		num: 402,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "SeedBomb",
		name: "Seed Bomb",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"SeedFlare": {
		num: 465,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		desc: "Has a 40% chance to lower the target's Special Defense by 2 stages.",
		id: "SeedFlare",
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
	"SeismicToss": {
		num: 69,
		accuracy: true,
		basePower: false,
		damage: 'level',
		category: "Physical",
		desc: "Does damage equal to user's level.",
		id: "SeismicToss",
		name: "Seismic Toss",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Selfdestruct": {
		num: 120,
		accuracy: 100,
		basePower: 200,
		category: "Physical",
		desc: "Causes the user to faint.",
		id: "Selfdestruct",
		name: "Selfdestruct",
		pp: 5,
		priority: 0,
		selfdestruct: true,
		secondary: false,
		target: "adjacent",
		type: "Normal"
	},
	"ShadowBall": {
		num: 247,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to lower the target's Special Defense by 1 stage.",
		id: "ShadowBall",
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
	"ShadowClaw": {
		num: 421,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "ShadowClaw",
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
	"ShadowForce": {
		num: 467,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user disappears on the first turn, becoming uncontrollable and evading all attacks, and strikes on the second turn. This move is not stopped by Protect or Detect.",
		id: "ShadowForce",
		name: "Shadow Force",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('ShadowForce')) return;
			pokemon.addVolatile('ShadowForce');
			this.add('prepare-move '+pokemon.id+' ShadowForce');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('ShadowForce');
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
	"ShadowPunch": {
		num: 325,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		id: "ShadowPunch",
		name: "Shadow Punch",
		pp: 20,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"ShadowSneak": {
		num: 425,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Usually goes first.",
		id: "ShadowSneak",
		name: "Shadow Sneak",
		pp: 30,
		isViable: true,
		isContact: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"Sharpen": {
		num: 159,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 1 stage.",
		id: "Sharpen",
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
	"SheerCold": {
		num: 329,
		accuracy: true,
		basePower: false,
		category: "Special",
		desc: "The target faints; doesn't work on higher-leveled Pokemon.",
		id: "SheerCold",
		name: "Sheer Cold",
		pp: 5,
		priority: 0,
		secondary: false,
		ohko: true,
		target: "normal",
		type: "Ice"
	},
	"ShellSmash": {
		num: 504,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises Attack, Special Attack and Speed by two stages. Decreases Defense and Special Defense by one stage.",
		id: "ShellSmash",
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
	"ShiftGear": {
		num: 508,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Gear Change increases the user's Speed by two stages and the user's Attack by one stage.",
		id: "ShiftGear",
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
	"ShockWave": {
		num: 351,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		id: "ShockWave",
		name: "Shock Wave",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"SignalBeam": {
		num: 324,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "Has a 10% chance to confuse the target.",
		id: "SignalBeam",
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
	"SilverWind": {
		num: 318,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 10% chance to raise all of the user's stats by 1 stage.",
		id: "SilverWind",
		name: "Silver Wind",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 10,
			boosts: {
				atk: 1,
				def: 1,
				spa: 1,
				spd: 1,
				spe: 1
			}
		},
		target: "normal",
		type: "Bug"
	},
	"SimpleBeam": {
		num: 493,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: null,
		id: "SimpleBeam",
		name: "Simple Beam",
		pp: 15,
		priority: 0,
		onHit: function(pokemon) {
			if (pokemon.ability === 'Multitype' || pokemon.ability === 'Truant')
			{
				return false;
			}
			if (pokemon.setAbility('Simple'))
			{
				this.add('message Ability changed to Simple. (placeholder)');
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Sing": {
		num: 47,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		id: "Sing",
		name: "Sing",
		pp: 15,
		priority: 0,
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Sketch": {
		num: 166,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user permanently replaces Sketch with the last move used by the target. Sketch cannot copy itself, Chatter, Memento or Struggle. Transform and moves that generate other moves can be Sketched successfully, as can Explosion and Selfdestruct if a Pokemon with Damp is present. Healing Wish and Lunar Dance can be Sketched because they automatically fail when the user is the last Pokemon of its team. This move fails automatically when selected in wireless or Wi-Fi battles.",
		id: "Sketch",
		name: "Sketch",
		pp: 1,
		priority: 0,
		onHit: false,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"SkillSwap": {
		num: 285,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user exchanges abilities with the target; does not work if Wonder Guard is the ability of either the user or the target.",
		id: "SkillSwap",
		name: "Skill Swap",
		pp: 10,
		priority: 0,
		onHit: function(target, source) {
			var targetAbility = target.ability;
			var sourceAbility = source.ability
			if (targetAbility === 'WonderGuard' || sourceAbility === 'WonderGuard')
			{
				return false;
			}
			if (!target.setAbility(sourceAbility) || !source.setAbility(targetAbility))
			{
				target.ability = targetAbility;
				source.ability = sourceAbility;
				return false;
			}
			this.add('message Skill Swapped. (placeholder)');
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"SkullBash": {
		num: 130,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "The user prepares on turn one, raising its Defense by 1 stage and becoming uncontrollable, and then attacks on turn two.",
		id: "SkullBash",
		name: "Skull Bash",
		pp: 15,
		isContact: true,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('SkullBash')) return;
			this.add('message '+pokemon.name+' lowered its head! (placeholder)');
			pokemon.addVolatile('SkullBash');
			this.boost({def:1});
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('SkullBash');
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"SkyAttack": {
		num: 143,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		desc: "The user prepares on turn one, becoming uncontrollable, and then attacks on turn two. Also has a 30% chance to make the target flinch.",
		id: "SkyAttack",
		name: "Sky Attack",
		pp: 5,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('SkyAttack')) return;
			this.add('prepare-move '+pokemon.id+' SkyAttack');
			pokemon.addVolatile('SkyAttack');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('SkyAttack');
			}
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Flying"
	},
	"SkyDrop": {
		num: 507,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: null,
		id: "SkyDrop",
		name: "Sky Drop",
		pp: 10,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('SkyDrop')) return;
			pokemon.addVolatile('SkyDrop');
			this.add('prepare-move '+pokemon.id+' SkyDrop');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('SkyDrop');
			},
			onSourceModifyPokemon: function(pokemon) {
				pokemon.lockMove('recharge');
			},
			onSourceBeforeMovePriority: 10,
			onSourceBeforeMove: false,
			onAnyModifyMove: function(move, attacker, defender) {
				if (defender !== this.effectData.target && defender !== this.effectData.source)
				{
					return;
				}
				if (move.id === 'Gust' || move.id === 'Twister')
				{
					// should not normally be done in MovifyMove event,
					// but Gust and Twister have static base power, and
					// it's faster to do this  here than in
					// BasePower event
					move.basePower *= 2;
					return;
				}
				else if (move.id === 'Sky Uppercut' || move.id === 'Thunder' || move.id === 'Hurricane' || move.id === 'Smack Down')
				{
					return;
				}
				move.accuracy = 0;
			}
		},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"SkyUppercut": {
		num: 327,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Also hits targets in mid-air via Fly or Bounce.",
		id: "SkyUppercut",
		name: "Sky Uppercut",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"SlackOff": {
		num: 303,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Restores 1/2 of the user's max HP.",
		id: "SlackOff",
		name: "Slack Off",
		pp: 10,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Slam": {
		num: 21,
		accuracy: 75,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "Slam",
		name: "Slam",
		pp: 20,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Slash": {
		num: 163,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "Slash",
		name: "Slash",
		pp: 20,
		isContact: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"SleepPowder": {
		num: 79,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		id: "SleepPowder",
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
	"SleepTalk": {
		num: 214,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Does nothing if the user is awake. If the user asleep, it randomly performs one of its attacks. Rest will fail if it is selected. Sleep Talk's generated attacks do not cost PP, but it cannot generate moves with 0 PP, itself, Assist, Bide, Chatter, Copycat, Disabled attacks, Focus Punch, Me First, Metronome, Mirror Move, Uproar, or attacks with a charge-up turn like Fly or Skull Bash. (Moves with a recharge turn like Hyper Beam can be generated.)",
		id: "SleepTalk",
		name: "Sleep Talk",
		pp: 10,
		isViable: true,
		priority: 0,
		sleepUsable: true,
		onHit: function(target) {
			if (target.status !== 'slp') return false;
			var moves = [];
			for (var i=0; i<target.moveset.length; i++)
			{
				var move = target.moveset[i].id;
				var NoSleepTalk = {
					Assist:1, Bide:1, Bounce:1, Chatter:1, Copycat:1, Dig:1, Dive:1, Fly:1, FocusPunch:1, MeFirst:1, Metronome:1, MirrorMove:1, ShadowForce:1, SkullBash:1, SkyAttack:1, SkyDrop:1, SleepTalk:1, SolarBeam:1, RazorWind:1, Uproar:1
				};
				if (move && !NoSleepTalk[move])
				{
					moves.push(move);
				}
			}
			var move = '';
			if (moves.length) move = moves[parseInt(Math.random()*moves.length)];
			if (!move)
			{
				return false;
			}
			this.useMove(move, target);
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Sludge": {
		num: 124,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		desc: "Has a 30% chance to poison the target.",
		id: "Sludge",
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
	"SludgeBomb": {
		num: 188,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 30% chance to poison the target.",
		id: "SludgeBomb",
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
	"SludgeWave": {
		num: 482,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 10% chance to poison the target.",
		id: "SludgeWave",
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
	"SmackDown": {
		num: 479,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: null,
		id: "SmackDown",
		name: "Smack Down",
		pp: 15,
		priority: 0,
		volatileStatus: 'SmackDown',
		effect: {
			onModifyPokemon: function(pokemon) {
				pokemon.negateImmunity['Ground'] = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"SmellingSalt": {
		num: 265,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "If the target is paralyzed, power is doubled but the target will be cured.",
		id: "SmellingSalt",
		name: "SmellingSalt",
		pp: 10,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Smog": {
		num: 123,
		accuracy: 70,
		basePower: 20,
		category: "Special",
		desc: "Has a 40% chance to poison the target.",
		id: "Smog",
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
	"SmokeScreen": {
		num: 108,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Accuracy by 1 stage.",
		id: "SmokeScreen",
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
	"Snarl": {
		num: 555,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Special Attack by one level.",
		id: "Snarl",
		name: "Snarl",
		pp: 15,
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
	"Snatch": {
		num: 289,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes first. Until the end of the turn, the user will steal a supporting move from another Pokemon (including teammates). In double battles, Snatch only steals the first applicable move performed by another Pokemon before wearing off.",
		id: "Snatch",
		name: "Snatch",
		pp: 10,
		priority: 4,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"Snore": {
		num: 173,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 30% chance to make the target flinch; fails if user is awake.",
		id: "Snore",
		name: "Snore",
		pp: 15,
		priority: 0,
		sleepUsable: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Normal"
	},
	"Soak": {
		num: 487,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Changes the target's type to water.",
		id: "Soak",
		name: "Soak",
		pp: 20,
		priority: 0,
		volatileStatus: 'Soak',
		effect: {
			onStart: function(pokemon) {
				this.add('message Type changed to Water. (placeholder)');
			},
			onModifyPokemon: function(pokemon) {
				pokemon.types = ['Water'];
			}
		},
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"Softboiled": {
		num: 135,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Restores 1/2 of the user's max HP.",
		id: "Softboiled",
		name: "Softboiled",
		pp: 10,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"SolarBeam": {
		num: 76,
		accuracy: 100,
		basePower: 120,
		basePowerCallback: function(pokemon, target) {
			if (this.weather === 'RainDance' || this.weather === 'Sandstorm' || this.weather === 'Hail')
			{
				this.debug('weakened by weather');
				return 60;
			}
			return 120;
		},
		category: "Special",
		desc: "The user prepares on turn one, becoming uncontrollable, and then attacks on turn two. During Sunny Day, this move fires immediately; during Rain Dance, Sandstorm and Hail, this move has half power.",
		id: "SolarBeam",
		name: "SolarBeam",
		pp: 10,
		isViable: true,
		priority: 0,
		beforeMoveCallback: function(pokemon) {
			if (pokemon.removeVolatile('SolarBeam')) return;
			this.add('prepare-move '+pokemon.id+' SolarBeam');
			if (this.weather === 'SunnyDay') return;
			pokemon.addVolatile('SolarBeam');
			return true;
		},
		effect: {
			duration: 2,
			onModifyPokemon: function(pokemon) {
				pokemon.lockMove('SolarBeam');
			}
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"SonicBoom": {
		num: 49,
		accuracy: true,
		basePower: false,
		damage: 20,
		category: "Special",
		desc: "Always deals 20 points of damage.",
		id: "SonicBoom",
		name: "SonicBoom",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"SpacialRend": {
		num: 460,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		desc: "Has a high critical hit ratio.",
		id: "SpacialRend",
		name: "Spacial Rend",
		pp: 5,
		isViable: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Dragon"
	},
	"Spark": {
		num: 209,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		id: "Spark",
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
	"SpiderWeb": {
		num: 169,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "As long as the user remains in battle, the target cannot switch out unless it is holding Shed Shell or uses Baton Pass or U-Turn. The target will still be trapped if the user switches out by using Baton Pass.",
		id: "SpiderWeb",
		name: "Spider Web",
		pp: 10,
		isViable: true,
		priority: 0,
		onHit: function(target, source) {
			source.addVolatile('trapping', target);
		},
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"SpikeCannon": {
		num: 131,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Attacks 2-5 times in one turn; if one of these attacks breaks a target's Substitute, the target will take damage for the rest of the hits. This move has a 3/8 chance to hit twice, a 3/8 chance to hit three times, a 1/8 chance to hit four times and a 1/8 chance to hit five times. If the user of this move has Skill Link, this move will always strike five times.",
		id: "SpikeCannon",
		name: "Spike Cannon",
		pp: 15,
		priority: 0,
		multihit: [2,5],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Spikes": {
		num: 191,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Damages opponents, unless they are Flying-type or have Levitate, every time they are switched in; hits through Wonder Guard. Can be used up to three times: saps 1/8 of max HP with one layer, 3/16 of max HP with two layers and 1/4 of max HP for three layers.",
		id: "Spikes",
		name: "Spikes",
		pp: 20,
		isViable: true,
		isBounceable: true,
		priority: 0,
		sideCondition: 'Spikes',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('r-side-condition '+side.id+' Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers < 3)
				{
					this.add('r-side-condition '+side.id+' Spikes');
					this.effectData.layers++;
				}
			},
			onSwitchIn: function(pokemon) {
				var side = pokemon.side;
				if (!pokemon.runImmunity('Ground')) return;
				var damage = this.damage((1+this.effectData.layers)*pokemon.maxhp/16);
			}
		},
		secondary: false,
		target: "foeSide",
		type: "Ground"
	},
	"SpitUp": {
		num: 255,
		accuracy: true,
		basePower: false,
		category: "Special",
		desc: "Power increases with user's Stockpile count; fails with zero Stockpiles.",
		id: "SpitUp",
		name: "Spit Up",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Spite": {
		num: 180,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The target's most recent move is reduced by 4 PP; this fails if the target has not yet performed a move, if the target's last move has run out of PP, or if the target can only use Struggle.",
		id: "Spite",
		name: "Spite",
		pp: 10,
		priority: 0,
		onHit: function(target) {
			if (target.deductPP(target.lastMove, 4))
			{
				this.add("message It reduced the PP of "+target.name+"'s "+target.lastMove+" by 4! (placeholder)");
				return;
			}
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"Splash": {
		num: 150,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Doesn't do anything (but we still love it). Unfortunately, it also cannot be used during the effects of Gravity! :(",
		id: "Splash",
		name: "Splash",
		pp: 40,
		priority: 0,
		onHit: function(target, source) {
			this.add('r-nothing-happened '+source.id);
			return null;
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Spore": {
		num: 147,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Puts the target to sleep.",
		id: "Spore",
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
	"StealthRock": {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Damages opponents every time they switch in until they use Rapid Spin. Saps a fraction of max HP determined by the effectiveness of Rock-type attacks against the opponent's type: 1/32 for 1/4x, 1/16 for 1/2x, 1/8 for 1x, 1/4 for 2x and 1/2 for 4x. For example, Stealth Rock saps 50% of an Ice/Flying Pokemon's max HP when it switches in.",
		id: "StealthRock",
		name: "Stealth Rock",
		pp: 20,
		isViable: true,
		isBounceable: true,
		priority: 0,
		sideCondition: 'StealthRock',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('r-side-condition '+side.id+' StealthRock');
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
	"SteelWing": {
		num: 211,
		accuracy: 90,
		basePower: 70,
		category: "Physical",
		desc: "Has a 10% chance to raise the user's Defense by 1 stage.",
		id: "SteelWing",
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
	"Stockpile": {
		num: 254,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Can be used up to three times to power Spit Up or Swallow. Also raises the user's Defense and Special Defense by 1 stage each. Stockpiles and the defensive boosts are lost when these Swallow or Spit Up is used or the user switches out. However, the boosts can be Baton Passed.",
		id: "Stockpile",
		name: "Stockpile",
		pp: 20,
		isViable: true,
		priority: 0,
		volatileStatus: 'Stockpile',
		effect: {
			onStart: function(target) {
				this.add('r-volatile '+target.id+' Stockpile');
				this.effectData.layers = 1;
				this.boost({def:1, spd:1});
			},
			onRestart: function(target) {
				if (this.effectData.layers < 3)
				{
					this.add('r-volatile '+target.id+' Stockpile');
					this.effectData.layers++;
					this.boost({def:1, spd:1});
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Stomp": {
		num: 23,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch; also retains its normal accuracy and gains doubled power against Minimized Pokemon.",
		id: "Stomp",
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
	"StoneEdge": {
		num: 444,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		desc: "Has a high critical hit ratio.",
		id: "StoneEdge",
		name: "Stone Edge",
		pp: 5,
		isViable: true,
		priority: 0,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"StoredPower": {
		num: 500,
		accuracy: true,
		basePower: 20,
		basePowerCallback: function(pokemon) {
			return 20 + 20 * pokemon.positiveBoosts();
		},
		category: "Special",
		desc: "Deals variable damage depending on the stat modifications of the user. When the user has no stat modifications, Assist Power's base power is 20. Its power increases by 20 for each stat boost the user has, and does not decrease in power due to stat drops below 0. It reaches a maximum power of 860, where all stats are maximized.",
		id: "StoredPower",
		name: "Stored Power",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"StormThrow": {
		num: 480,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Always results in a critical hit.",
		id: "StormThrow",
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
	"Steamroller": {
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		desc: "Has a 30% chance to make the target flinch.",
		id: "Steamroller",
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
	"Strength": {
		num: 70,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "Strength",
		name: "Strength",
		pp: 15,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"StringShot": {
		num: 81,
		accuracy: 95,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Speed by 1 stage.",
		id: "StringShot",
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
	"Struggle": {
		num: 165,
		accuracy: true,
		basePower: 50,
		category: "Physical",
		desc: "Used automatically when all of the user's other moves have run out of PP or are otherwise inaccessible. The user receives recoil damage equal to 1/4 of its max HP. Struggle is classified as a typeless move and will hit any Pokemon for normal damage.",
		id: "Struggle",
		name: "Struggle",
		pp: 1,
		isContact: true,
		priority: 0,
		self: {
			onHit: function(source) {
				this.damage(source.maxhp/4, source, 'recoil');
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		typeCallback: '???'
	},
	"StruggleBug": {
		num: 522,
		accuracy: 100,
		basePower: 30,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Special Attack by one level.",
		id: "StruggleBug",
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
	"StunSpore": {
		num: 78,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes the target.",
		id: "StunSpore",
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
	"Submission": {
		num: 66,
		accuracy: 80,
		basePower: 80,
		category: "Physical",
		desc: "The user receives 1/4 recoil damage.",
		id: "Submission",
		name: "Submission",
		pp: 25,
		isContact: true,
		priority: 0,
		recoil: [1,4],
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Substitute": {
		num: 164,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user takes one-fourth of its maximum HP to create a substitute; this move fails if the user does not have enough HP for this. Until the substitute is broken, it receives damage from all attacks made by other Pokemon and shields the user from status effects and stat modifiers caused by other Pokemon. The user is still affected by Tickle, Hail, Sandstorm and Attract from behind its Substitute. If a Substitute breaks from a hit during a multistrike move such as Fury Attack, the user takes damage from the remaining strikes.",
		id: "Substitute",
		name: "Substitute",
		pp: 10,
		isViable: true,
		priority: 0,
		volatileStatus: 'Substitute',
		onHit: function(target) {
			if (target.volatiles['Substitute'])
			{
				this.add('r-sub '+target.id+' already');
				return null;
			}
			if (target.hp <= target.maxhp/4)
			{
				this.add('message Not enough energy! (placeholder)');
				return null;
			}
			target.damage(target.maxhp/4);
		},
		effect: {
			onStart: function(target) {
				this.add('r-sub '+target.id+'');
				this.effectData.hp = parseInt(target.maxhp/4);
			},
			onHit: function(target, source, move) {
				if (target === source)
				{
					this.debug('sub bypass: self hit');
					return;
				}
				if (move.category === 'Status')
				{
					var SubBlocked = {
						Acupressure:1, Block:1, DreamEater:1, Embargo:1, Entrainment:1, Flatter:1, GastroAcid:1, Grudge:1, HealBlock:1, LeechSeed:1, 'Lock-On':1, MeanLook:1, Mimic:1, MindReader:1, Nightmare:1, PainSplit:1, PsychoShift:1, SpiderWeb:1, Sketch:1, Swagger:1, Switcheroo:1, Trick:1, WorrySeed:1, Yawn:1
					};
					if (move.status || move.boosts || move.volatileStatus === 'confusion')
					{
						this.add('r-sub-block '+target.id+' '+move.id);
						return null;
					}
					if (SubBlocked[move.id] || (move.id === 'Curse' && source.hasType('Ghost')))
					{
						this.add('r-sub-block '+target.id+' '+move.id);
						return null;
					}
				}
				var damage = this.getDamage(source, target, move);
				if (!damage)
				{
					return;
				}
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage)
				{
					return damage;
				}
				if (damage > target.volatiles['Substitute'].hp)
				{
					damage = target.volatiles['Substitute'].hp;
				}
				target.volatiles['Substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['Substitute'].hp <= 0)
				{
					target.removeVolatile('Substitute');
					this.runEvent('AfterSubDamage', target, source, move, damage);
					return 0; // hit
				}
				else
				{
					this.add('r-sub-damage '+target.id);
					this.runEvent('AfterSubDamage', target, source, move, damage);
					return 0; // hit
				}
			},
			onEnd: function(target) {
				this.add('r-sub-fade '+target.id);
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"SuckerPunch": {
		num: 389,
		accuracy: 100,
		basePower: 80,
		basePowerCallback: function(pokemon, target) {
			decision = this.willMove(target);
			if (decision && decision.choice === 'move' && decision.move.category !== 'Status')
			{
				return 80;
			}
			return false;
		},
		category: "Physical",
		desc: "Almost always goes first, but fails if the target doesn't select a move that will damage the user. The move also fails if the target uses an attack with higher priority or if the target is faster and uses an attack with the same priority.",
		id: "SuckerPunch",
		name: "Sucker Punch",
		pp: 5,
		isViable: true,
		isContact: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"SunnyDay": {
		num: 241,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Cancels all other weather moves. For 5 turns: freezing is prevented, the power of Fire attacks is increased by 50%, the power of Water attacks is decreased by 50%, Solarbeam fires immediately, Thunder becomes 50% accurate, and the healing power of Morning Sun, Synthesis and Moonlight is increased from 1/2 to 2/3 of the user's max HP. The effects of Sunny Day will last for eight turns if its user is holding Heat Rock.",
		id: "SunnyDay",
		name: "Sunny Day",
		pp: 5,
		isViable: true,
		priority: 0,
		weather: 'SunnyDay',
		secondary: false,
		target: "all",
		type: "Fire"
	},
	"SuperFang": {
		num: 162,
		accuracy: true,
		basePower: false,
		damageCallback: function(pokemon, target) {
			return target.hp/2;
		},
		category: "Physical",
		desc: "This move halves the target's current HP.",
		id: "SuperFang",
		name: "Super Fang",
		pp: 10,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Superpower": {
		num: 276,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Lowers the user's Attack and Defense by 1 stage each after use.",
		id: "Superpower",
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
	"Supersonic": {
		num: 48,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		desc: "Confuses the target.",
		id: "Supersonic",
		name: "Supersonic",
		pp: 20,
		priority: 0,
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Surf": {
		num: 57,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Power doubles against a target who is in the middle of using Dive.",
		id: "Surf",
		name: "Surf",
		pp: 15,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "adjacent",
		type: "Water"
	},
	"Swagger": {
		num: 207,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Confuses the target and raises its Attack by 2 stages.",
		id: "Swagger",
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
	"Swallow": {
		num: 256,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move only works if the user has at least one Stockpile. Restores 1/4 of user's max HP with one Stockpile, 1/2 of user's max HP with two Stockpiles and fully restores the user's HP with three Stockpiles.",
		id: "Swallow",
		name: "Swallow",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"SweetKiss": {
		num: 186,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Confuses the target.",
		id: "SweetKiss",
		name: "Sweet Kiss",
		pp: 10,
		priority: 0,
		volatileStatus: 'confusion',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"SweetScent": {
		num: 230,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Evasion by 1 stage.",
		id: "SweetScent",
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
	"Swift": {
		num: 129,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "Ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		id: "Swift",
		name: "Swift",
		pp: 20,
		priority: 0,
		secondary: false,
		target: "foes",
		type: "Normal"
	},
	"Switcheroo": {
		num: 415,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Exchanges items with the target unless it has Sticky Hold or Multitype. Items lost to this move cannot be recovered by using Recycle.",
		id: "Switcheroo",
		name: "Switcheroo",
		pp: 10,
		isViable: true,
		priority: 0,
		onHit: function(target, source) {
			var yourItem = target.takeItem();
			var myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem))
			{
				return false;
			}
			this.add('r-trick '+source.id+' '+target.id);
			if (myItem)
			{
				target.setItem(myItem);
				this.add('r-trick-get '+target.id+' '+myItem.id);
			}
			if (yourItem)
			{
				source.setItem(yourItem);
				this.add('r-trick-get '+source.id+' '+yourItem.id);
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"SwordsDance": {
		num: 14,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack by 2 stages.",
		id: "SwordsDance",
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
	"Synchronoise": {
		num: 485,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Hits any Pokémon that shares a type with the user.",
		id: "Synchronoise",
		name: "Synchronoise",
		pp: 15,
		priority: 0,
		onHit: function(target, source) {
			return target.hasType(source.types);
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Synthesis": {
		num: 235,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Restores a fraction of the user's max HP depending on the weather: 2/3 during Sunny Day, 1/2 during regular weather and 1/4 during Rain Dance, Hail and Sandstorm.",
		id: "Synthesis",
		name: "Synthesis",
		pp: 5,
		isViable: true,
		priority: 0,
		heal: [1,2],
		secondary: false,
		target: "self",
		type: "Grass"
	},
	"Tackle": {
		num: 33,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "Tackle",
		name: "Tackle",
		pp: 35,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"TailGlow": {
		num: 294,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack by 3 stages.",
		id: "TailGlow",
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
	"TailSlap": {
		num: 541,
		accuracy: 85,
		basePower: 25,
		category: "Physical",
		desc: "Hits 2-5 times in one turn.",
		id: "TailSlap",
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
	"TailWhip": {
		num: 39,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Defense by 1 stage.",
		id: "TailWhip",
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
	"Tailwind": {
		num: 366,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Speed is doubled for every Pokemon on the user's team for 4 turns; the turn used to perform Tailwind is included in this total, as are any turns used to switch around Pokemon.",
		id: "Tailwind",
		name: "Tailwind",
		pp: 30,
		isViable: true,
		priority: 0,
		sideCondition: 'Tailwind',
		effect: {
			duration: 4,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'Persistent')
				{
					return 6;
				}
				return 4;
			},
			onStart: function(side) {
				this.add('r-side-condition '+side.id+' Tailwind');
			},
			onModifyStats: function(stats) {
				stats.spe *= 2;
			},
			onEnd: function(side) {
				this.add('r-side-condition '+side.id+' Tailwind end');
			}
		},
		secondary: false,
		target: "allies",
		type: "Flying"
	},
	"TakeDown": {
		num: 36,
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		desc: "The user receives 1/4 recoil damage.",
		id: "TakeDown",
		name: "Take Down",
		pp: 20,
		isContact: true,
		priority: 0,
		recoil: [1,4],
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Taunt": {
		num: 269,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from using non-damaging moves for 3 turns. Assist, Copycat, Me First, Metronome, Mirror Move and Sleep Talk are prevented during this time, but Bide, Counter, Endeavor, Metal Burst and Mirror Coat are not prevented.",
		id: "Taunt",
		name: "Taunt",
		pp: 20,
		isViable: true,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'Taunt',
		effect: {
			onStart: function(target) {
				this.effectData.time = 3;
				this.add('r-volatile '+target.id+' taunt');
			},
			onEnd: function(target) {
				this.add('r-volatile '+target.id+' taunt end');
			},
			onModifyPokemon: function(pokemon) {
				var moves = pokemon.moveset;
				for (var i=0; i<moves.length; i++)
				{
					if (this.getMove(moves[i].move).category === 'Status')
					{
						moves[i].disabled = true;
					}
				}
			},
			onBeforeMove: function(attacker, defender, move) {
				attacker.volatiles['Taunt'].time--;
				if (attacker.volatiles['Taunt'].time <= 0)
				{
					attacker.volatiles['Taunt'].duration = 1;
				}
				if (move.category === 'Status')
				{
					this.add('cant-move '+attacker.id+' taunt '+move.id);
					return false;
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"TechnoBlast": {
		num: 546,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		desc: "The type of Techno Buster depends on the type of Cassette held by the user, being Normal-type if there is none held, and Electric, Fire, Ice or Water with the appropriate Cassette.",
		id: "TechnoBlast",
		name: "Techno Blast",
		pp: 5,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal",
		typeCallback: function(pokemon) {
			return this.runEvent('Drive', pokemon, null, 'TechnoBlast', 'Normal');
		}
	},
	"TeeterDance": {
		num: 298,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Each active Pokemon, except the user, becomes confused.",
		id: "TeeterDance",
		name: "Teeter Dance",
		pp: 20,
		isViable: true,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'confusion',
		secondary: false,
		target: "adjacent",
		type: "Normal"
	},
	"Telekinesis": {
		num: 477,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Makes the target immune to Ground-type moves and makes all moves hit the target regardless of accuracy and evasion. This does not include OHKO moves. It will fail if Gravity is in effect, and if Gravity is used while Telekinesis is in effect Gravity will supersede it.",
		id: "Telekinesis",
		name: "Telekinesis",
		pp: 15,
		priority: -7,
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Teleport": {
		num: 100,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Escapes from wild battles; fails automatically in trainer and link battles.",
		id: "Teleport",
		name: "Teleport",
		pp: 20,
		priority: 0,
		onHit: function() {
			return false;
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"Thief": {
		num: 168,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Steals the target's held item unless the user is already holding an item or the target has Sticky Hold or Multitype. A stolen item cannot be recovered by using Recycle.",
		id: "Thief",
		name: "Thief",
		pp: 10,
		isContact: true,
		priority: 0,
		onHit: function(target, source) {
			if (source.item)
			{
				return false;
			}
			var yourItem = target.takeItem();
			if (!yourItem)
			{
				return false;
			}
			if (!source.setItem(yourItem))
			{
				return false;
			}
			this.add('r-trick-get '+source.id+' '+yourItem.id);
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"Thrash": {
		num: 37,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user attacks uncontrollably for 2-3 turns and then gets confused.",
		id: "Thrash",
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
	"Thunder": {
		num: 87,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		desc: "Has a 30% chance to paralyze the target. It also has normal accuracy against mid-air Pokemon who have used Fly or Bounce. During Sunny Day, this move has 50% accuracy. During Rain Dance, this move will never miss under normal circumstances and has a 30% chance to hit through a target's Protect or Detect.",
		id: "Thunder",
		name: "Thunder",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 30,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"ThunderFang": {
		num: 422,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		desc: "Has a 10% chance to paralyze the target. Has 10% chance to make the target flinch. Both effects can occur from a single use.",
		id: "ThunderFang",
		name: "Thunder Fang",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"ThunderPunch": {
		num: 9,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 10% chance to paralyze the target.",
		id: "ThunderPunch",
		name: "ThunderPunch",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: {
			chance: 10,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	"ThunderShock": {
		num: 84,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to paralyze the target.",
		id: "ThunderShock",
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
	"ThunderWave": {
		num: 86,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes the target. This move activates Motor Drive.",
		id: "ThunderWave",
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
	"Thunderbolt": {
		num: 85,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 10% chance to paralyze the target.",
		id: "Thunderbolt",
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
	"Tickle": {
		num: 321,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Attack and Defense by 1 stage each.",
		id: "Tickle",
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
	"Torment": {
		num: 259,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from using the same move for two turns in a row until the target is switched out. The target will use Struggle every other turn if it cannot attack without using the same move.",
		id: "Torment",
		name: "Torment",
		pp: 15,
		isViable: true,
		isBounceable: true,
		priority: 0,
		effect: {
			duration: 3,
			onStart: function(target) {
				this.add('r-volatile '+target.id+' torment');
			},
			onEnd: function(pokemon) {
				this.add('r-volatile '+target.id+' torment end');
			},
			onModifyPokemon: function(pokemon) {
				pokemon.disabledMoves[pokemon.lastMove] = true;
			}
		},
		secondary: false,
		target: "normal",
		type: "Dark"
	},
	"Toxic": {
		num: 92,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "The target is badly poisoned, with the damage caused by poison doubling after each turn. Toxic poisoning will remain with the Pokemon during the battle even after switching out.",
		id: "Toxic",
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
	"ToxicSpikes": {
		num: 390,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Opponents will be poisoned as they enter the field until they use Rapid Spin. One layer inflicts regular poison while two layers inflict Toxic; switching in a non-Flying-type Poison Pokemon without Levitate will remove any layers. Flying-type and Levitate Pokemon are only affected if they switch in while Gravity is in effect, Iron Ball is their held item or they are receiving a Baton Passed Ingrain; Steel-type Pokemon and Pokemon who enter with Baton Passed Substitutes are not affected.",
		id: "ToxicSpikes",
		name: "Toxic Spikes",
		pp: 20,
		isViable: true,
		isBounceable: true,
		priority: 0,
		sideCondition: 'ToxicSpikes',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('r-side-condition '+side.id+' ToxicSpikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers < 2)
				{
					this.add('r-side-condition '+side.id+' ToxicSpikes');
					this.effectData.layers++;
				}
			},
			onSwitchIn: function(pokemon) {
				if (!pokemon.runImmunity('Ground')) return;
				if (!pokemon.runImmunity('Poison')) return;
				if (pokemon.volatiles['Substitute']) return;
				if (pokemon.hasType('Poison'))
				{
					this.add('r-absorb-spikes '+pokemon.id+' ToxicSpikes');
					pokemon.side.removeSideCondition('ToxicSpikes');
				}
				else if (this.effectData.layers >= 2)
				{
					pokemon.trySetStatus('tox');
				}
				else
				{
					pokemon.trySetStatus('psn');
				}
			}
		},
		secondary: false,
		target: "foeSide",
		type: "Poison"
	},
	"Transform": {
		num: 144,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user morphs into a near-exact copy of the target. Stats, stat modifiers, type, moves, Hidden Power data and appearance are changed; the user's level and HP remain the same and each copied move receives only 5 PP. (If Transform is used by Ditto, the effects of Metal Powder and Quick Powder stop working after transformation.)",
		id: "Transform",
		name: "Transform",
		pp: 10,
		priority: 0,
		onHit: function(target, pokemon) {
			if (!pokemon.transformInto(target))
			{
				return false;
			}
			this.add('r-transform '+pokemon.id+' '+target.id);
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"TriAttack": {
		num: 161,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to burn, paralyze or freeze the target.",
		id: "TriAttack",
		name: "Tri Attack",
		pp: 10,
		isViable: true,
		priority: 0,
		secondary: {
			chance: 20,
			onHit: function(target, source) {
				var result = parseInt(Math.random()*3);
				if (result===0)
				{
					target.trySetStatus('brn', source);
				}
				else if (result===1)
				{
					target.trySetStatus('par', source);
				}
				else
				{
					target.trySetStatus('frz', source);
				}
			}
		},
		target: "normal",
		type: "Normal"
	},
	"Trick": {
		num: 271,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Exchanges items with the target unless it has Sticky Hold or Multitype. Items lost to this move cannot be recovered by using Recycle.",
		id: "Trick",
		name: "Trick",
		pp: 10,
		isViable: true,
		priority: 0,
		onHit: function(target, source) {
			var yourItem = target.takeItem();
			var myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem))
			{
				return false;
			}
			this.add('r-trick '+source.id+' '+target.id);
			if (myItem)
			{
				target.setItem(myItem);
				this.add('r-trick-get '+target.id+' '+myItem.id);
			}
			if (yourItem)
			{
				source.setItem(yourItem);
				this.add('r-trick-get '+source.id+' '+yourItem.id);
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"TrickRoom": {
		num: 433,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Always goes last. Attacking order is reversed for all active Pokemon for five turns; the slowest Pokemon moves first and vice versa. Note that move order is still determined by the regular priority categories and the effects of Trick Room apply only when Pokemon have chosen moves with the same priority. Using Trick Room a second time reverses this effect. This effect is also ignored by Stall and held items that may affect the turn order: Full Incense, Lagging Tail and Quick Claw.",
		id: "TrickRoom",
		name: "Trick Room",
		pp: 5,
		isViable: true,
		priority: -7,
		onHit: function(target, source, effect) {
			if (this.pseudoWeather['TrickRoom'])
			{
				this.removePseudoWeather('TrickRoom', source, effect);
			}
			else
			{
				this.addPseudoWeather('TrickRoom', source, effect);
			}
		},
		effect: {
			duration: 5,
			durationCallback: function(target, source, effect) {
				if (source && source.ability === 'Persistent')
				{
					return 7;
				}
				return 5;
			},
			onStart: function(target, source) {
				this.add('r-pseudo-weather '+source.id+' TrickRoom');
			},
			onModifyStatsPriority: -100,
			onModifyStats: function(stats) {
				// :o
				stats.spe = -stats.spe;
			},
			onEnd: function() {
				this.add('pseudo-weather-end TrickRoom');
			}
		},
		secondary: false,
		target: "all",
		type: "Psychic"
	},
	"TripleKick": {
		num: 167,
		accuracy: 90,
		basePower: 10,
		category: "Physical",
		desc: "Attacks three times in one turn, adding 10 BP for each kick. If a kick misses, the move ends instantly; if one of the kicks breaks a target's Substitute, the real Pokemon will take damage for the remaining kicks.",
		id: "TripleKick",
		name: "Triple Kick",
		pp: 10,
		isContact: true,
		priority: 0,
		multihit: [3,3],
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"TrumpCard": {
		num: 376,
		accuracy: true,
		basePower: false,
		category: "Special",
		desc: "This move's base power increases as its remaining PP decreases.",
		id: "TrumpCard",
		name: "Trump Card",
		pp: 5,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Twineedle": {
		num: 41,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Strikes twice; if the first hit breaks the target's Substitute, the real Pokemon will take damage from the second hit. Has a 20% chance to poison the target .",
		id: "Twineedle",
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
	"Twister": {
		num: 239,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 20% chance to make the target flinch; power doubles while the target is in mid-air via Fly or Bounce.",
		id: "Twister",
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
	"U-turn": {
		num: 369,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "The user switches out after use, even if it is currently trapped by another Pokemon. When a faster Pokemon uses Pursuit against a U-Turner, the U-Turner is hit for normal damage; when a slower Pokemon uses Pursuit against a U-Turner, the U-Turner makes its attack, then is hit by Pursuit for double power, and switches out.",
		id: "U-turn",
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
	"Uproar": {
		num: 253,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "The user causes an Uproar and attacks uncontrollably for 3 turns. During the effects of the Uproar, active Pokemon cannot fall asleep and sleeping Pokemon sent into battle will wake up.",
		id: "Uproar",
		name: "Uproar",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"V-create": {
		num: 557,
		accuracy: 95,
		basePower: 180,
		category: "Physical",
		desc: "Lowers the user's Defense, Special Defense, and Speed by one stage.",
		id: "V-create",
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
	"VacuumWave": {
		num: 410,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Usually goes first.",
		id: "VacuumWave",
		name: "Vacuum Wave",
		pp: 30,
		isViable: true,
		priority: 1,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"Venoshock": {
		num: 474,
		accuracy: 100,
		basePower: 65,
		basePowerCallback: function(pokemon,target) {
			if (target.status === 'psn')
			{
				return 130;
			}
			return 65;
		},
		category: "Special",
		desc: "Inflicts double damage if the target is Poisoned.",
		id: "Venoshock",
		name: "Venoshock",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Poison"
	},
	"ViceGrip": {
		num: 11,
		accuracy: 100,
		basePower: 55,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "ViceGrip",
		name: "ViceGrip",
		pp: 30,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"VineWhip": {
		num: 22,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "VineWhip",
		name: "Vine Whip",
		pp: 15,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"VitalThrow": {
		num: 233,
		accuracy: true,
		basePower: 70,
		category: "Physical",
		desc: "This move usually goes last. It ignores Evasion and Accuracy modifiers and never misses except against Protect, Detect or a target in the middle of Dig, Fly, Dive or Bounce.",
		id: "VitalThrow",
		name: "Vital Throw",
		pp: 10,
		isContact: true,
		priority: -1,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"VoltSwitch": {
		num: 521,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: null,
		id: "VoltSwitch",
		name: "Volt Switch",
		pp: 20,
		isViable: true,
		priority: 0,
		selfSwitch: true,
		secondary: false,
		target: "normal",
		type: "Electric"
	},
	"VoltTackle": {
		num: 344,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user receives 1/3 recoil damage; has a 10% chance to paralyze the target.",
		id: "VoltTackle",
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
	"Wake-UpSlap": {
		num: 358,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "If the target is asleep, power is doubled but the target will awaken.",
		id: "Wake-UpSlap",
		name: "Wake-Up Slap",
		pp: 10,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Fighting"
	},
	"WaterGun": {
		num: 55,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Deals damage with no additional effect.",
		id: "WaterGun",
		name: "Water Gun",
		pp: 25,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"WaterPledge": {
		num: 518,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "If it is followed on the same turn by Fire Oath it will double the probability of secondary effects taking place for four turns. This effect does not stack with Serene Grace.	If it follows Grass Oath on the same turn, it will decrease the speed of all foes by half for four turns.",
		id: "WaterPledge",
		name: "Water Pledge",
		pp: 10,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"WaterPulse": {
		num: 352,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 20% chance to confuse the target.",
		id: "WaterPulse",
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
	"WaterSport": {
		num: 346,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "All Fire-type moves are 50% weaker until the user switches out.",
		id: "WaterSport",
		name: "Water Sport",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "all",
		type: "Water"
	},
	"WaterSpout": {
		num: 323,
		accuracy: true,
		basePower: false,
		basePowerCallback: function(pokemon) {
			return parseInt(150*pokemon.hp/pokemon.maxhp);
		},
		category: "Special",
		desc: "Base power decreases as the user's HP decreases.",
		id: "WaterSpout",
		name: "Water Spout",
		pp: 5,
		isViable: true,
		priority: 0,
		secondary: false,
		target: "foes",
		type: "Water"
	},
	"Waterfall": {
		num: 127,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 20% chance to make the target flinch.",
		id: "Waterfall",
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
	"WeatherBall": {
		num: 311,
		accuracy: true,
		basePower: 50,
		category: "Special",
		desc: "Base power is 50; Base power doubles and move's type changes during weather effects: becomes Fire-type during Sunny Day, Water-type during Rain Dance, Ice-type during Hail and Rock-type during Sandstorm.",
		id: "WeatherBall",
		name: "Weather Ball",
		pp: 10,
		isViable: true,
		priority: 0,
		// This move's weather effects are implemented in the
		// weather structure, not here.
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"Whirlpool": {
		num: 250,
		accuracy: 85,
		basePower: 35,
		category: "Special",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn. Base power also doubles when performed against a Pokemon in the middle of using Dive.",
		id: "Whirlpool",
		name: "Whirlpool",
		pp: 15,
		priority: 0,
		volatileStatus: 'partiallyTrapped',
		secondary: false,
		target: "normal",
		type: "Water"
	},
	"Whirlwind": {
		num: 18,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Almost always goes last; in trainer battles, the target is switched out for a random member of its team. Escapes from wild battles. Has no effect if the target has Suction Cups or used Ingrain.",
		id: "Whirlwind",
		name: "Whirlwind",
		pp: 20,
		isViable: true,
		priority: -6,
		forceSwitch: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"WideGuard": {
		num: 469,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: null,
		id: "WideGuard",
		name: "Wide Guard",
		pp: 10,
		priority: 3,
		secondary: false,
		target: "normal",
		type: "Rock"
	},
	"WildCharge": {
		num: 528,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "User receives 1/4 the damage it inflicts in recoil.",
		id: "WildCharge",
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
	"Will-O-Wisp": {
		num: 261,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		desc: "Burns the target. This move activates Flash Fire.",
		id: "Will-O-Wisp",
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
	"WingAttack": {
		num: 17,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "WingAttack",
		name: "Wing Attack",
		pp: 35,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	"Wish": {
		num: 273,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "At the end of the next turn, the active Pokemon from the user's team is healed by 1/2 of the user's HP; this can be any member of the user's team.",
		id: "Wish",
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
			onResidualPriority: 50-4,
			onEnd: function(side) {
				var target = side.active[this.effectData.sourcePosition];
				if (!target.fainted)
				{
					var source = this.effectData.source;
					var damage = this.effectData.hp;
					damage = target.heal(damage);
					this.add('residual '+target.id+' wish '+source.id+' '+target.hpPercent(damage)+target.getHealth());
				}
			}
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"Withdraw": {
		num: 110,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Defense by 1 stage.",
		id: "Withdraw",
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
	"WonderRoom": {
		num: 472,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: null,
		id: "WonderRoom",
		name: "Wonder Room",
		pp: 10,
		priority: 0,
		onHit: function(target, source, effect) {
			if (this.pseudoWeather['WonderRoom'])
			{
				this.removePseudoWeather('WonderRoom', source, effect);
			}
			else
			{
				this.addPseudoWeather('WonderRoom', source, effect);
			}
		},
		effect: {
			duration: 5,
			onStart: function(side, source) {
				this.add('r-pseudo-weather '+source.id+' WonderRoom');
			},
			onModifyStatsPriority: -100,
			onModifyStats: function(stats) {
				var tmp = stats.spd;
				stats.spd = stats.def;
				stats.def = tmp;
			},
			onEnd: function() {
				this.add('pseudo-weather-end WonderRoom');
			}
		},
		secondary: false,
		target: "normal",
		type: "Psychic"
	},
	"WoodHammer": {
		num: 452,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user receives 1/3 recoil damage.",
		id: "WoodHammer",
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
	"WorkUp": {
		num: 526,
		accuracy: true,
		basePower: false,
		category: "Status",
		desc: "Raises the user's Attack and Special Attack by one stage.",
		id: "WorkUp",
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
	"WorrySeed": {
		num: 388,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The target's ability, unless it has Multitype or Truant, is changed to Insomnia until it switches out.",
		id: "WorrySeed",
		name: "Worry Seed",
		pp: 10,
		priority: 0,
		onHit: function(pokemon) {
			if (pokemon.ability === 'Multitype' || pokemon.ability === 'Truant')
			{
				return false;
			}
			if (pokemon.setAbility('Insomnia'))
			{
				this.add('message Ability changed to Insomnia. (placeholder)');
				if (pokemon.status === 'slp')
				{
					pokemon.cureStatus();
				}
			}
		},
		secondary: false,
		target: "normal",
		type: "Grass"
	},
	"Wrap": {
		num: 35,
		accuracy: 90,
		basePower: 15,
		category: "Physical",
		desc: "Traps the target for 5-6 turns, causing damage equal to 1/16 of its max HP each turn; this trapped effect can be broken by Rapid Spin. The target can still switch out if it is holding Shed Shell or uses Baton Pass or U-Turn.",
		id: "Wrap",
		name: "Wrap",
		pp: 20,
		isContact: true,
		priority: 0,
		volatileStatus: 'partiallyTrapped',
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"WringOut": {
		num: 378,
		accuracy: true,
		basePower: 1,
		basePowerCallback: function(pokemon, target) {
			return parseInt(120*target.hp/target.maxhp);
		},
		category: "Special",
		desc: "Base power decreases as the target's HP decreases.",
		id: "WringOut",
		name: "Wring Out",
		pp: 5,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"X-Scissor": {
		num: 404,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage with no additional effect.",
		id: "X-Scissor",
		name: "X-Scissor",
		pp: 15,
		isViable: true,
		isContact: true,
		priority: 0,
		secondary: false,
		target: "normal",
		type: "Bug"
	},
	"Yawn": {
		num: 281,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "If the target stays in battle, it falls asleep at the end of the next turn.",
		id: "Yawn",
		name: "Yawn",
		pp: 10,
		isViable: true,
		isBounceable: true,
		priority: 0,
		volatileStatus: 'Yawn',
		onHit: function(target) {
			if (target.status)
			{
				return false;
			}
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onStart: function(target, source) {
				this.add('r-volatile '+target.id+' drowsy add '+source.id);
			},
			onEnd: function(target) {
				target.trySetStatus('slp');
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"ZapCannon": {
		num: 192,
		accuracy: 50,
		basePower: 120,
		category: "Special",
		desc: "Paralyzes the target.",
		id: "ZapCannon",
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
	"ZenHeadbutt": {
		num: 428,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		desc: "Has a 20% chance to make the target flinch.",
		id: "ZenHeadbutt",
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
	"PaleoWave": {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		desc: "20% chance of lowering target's Attack.",
		id: "PaleoWave",
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
	"ShadowStrike": {
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "50% chance of lowering target's Defense.",
		id: "ShadowStrike",
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
	"Magikarp'sRevenge": {
		accuracy: true,
		basePower: 120,
		category: "Physical",
		desc: "Drains, confuses, makes it rain for 5 turns, gives the user Magic Coat and Aqua Ring, and decreases some of the foe's stats, but user must recharge afterwards.",
		id: "Magikarp'sRevenge",
		name: "Magikarp's Revenge",
		pp: 10,
		isViable: true,
		isContact: true,
		isNonstandard: true,
		priority: 0,
		drain: [1,2],
		onHit: function(target, source) {
			if (source.template.name !== 'Magikarp')
			{
				this.add('message It didn\'t work since it wasn\'t used by a Magikarp!');
				return null;
			}
		},
		self: {
			onHit: function(target, source) {
				this.setWeather('RainDance');
				target.addVolatile('MagicCoat');
				target.addVolatile('AquaRing');
			},
			volatileStatus: 'mustRecharge'
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
