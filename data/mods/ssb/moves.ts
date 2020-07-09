import {getName} from './statuses';

export const BattleMovedex: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Move Name",
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMovePriority: 100,
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
	// Please keep sets organized alphabetically based on staff member name!
	// Adri
	skystriker: {
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field. Raises the user's Speed by 1 stage.",
		shortDesc: "Free user from hazards/bind/Leech Seed; +1 Spe.",
		name: "Skystriker",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Aerial Ace', target);
		},
		onAfterHit(target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Skystriker', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Skystriker', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Skystriker', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		self: {
			boosts: {
				spe: 1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},

	// Aeonic
	lookingcool: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up Stealth Rock on the opposing side of the field and boosts the user's Attack by 2 stages. Can only be used once per the user's time on the field.",
		shortDesc: "1 use per switchin. +2 Atk + Stealth Rock.",
		name: "Looking Cool",
		pp: 5,
		priority: 0,
		flags: {},
		volatileStatus: 'lookingcool',
		onTryMovePriority: 100,
		onTryMove(target) {
			if (target.volatiles['lookingcool']) return false;
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			const foe = source.side.foe.active[0];
			this.add('-anim', source, 'Smokescreen', source);
			this.add('-anim', source, 'Stealth Rock', foe);
		},
		onHit(target, source, move) {
			const foe = source.side.foe;
			if (!foe.getSideCondition('stealthrock')) {
				foe.addSideCondition('stealthrock');
			}
		},
		boosts: {
			atk: 2,
		},
		secondary: null,
		target: "self",
		type: "Dark",
	},

	// Aethernum
	lilypadoverflow: {
		accuracy: 100,
		basePower: 60,
		basePowerCallback(source, target, move) {
			if (!source.volatiles['raindrop'] || !source.volatiles['raindrop'].layers) return move.basePower;
			return move.basePower + (source.volatiles['raindrop'].layers * 20);
		},
		category: "Special",
		desc: "Power is equal to 60 + (Number of Raindrops collected * 20). Whether or not this move is successful, the user's Defense and Special Defense decrease by as many stages as Raindrop had increased them, and the user's Raindrop count resets to 0.",
		shortDesc: "More power with more collected Raindrops.",
		name: "Lilypad Overflow",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Water Spout', target);
			this.add('-anim', source, 'Max Geyser', target);
		},
		onAfterMove(pokemon) {
			if (pokemon.volatiles['raindrop']) pokemon.removeVolatile('raindrop');
		},
		secondary: null,
		target: "normal",
		type: "Water",
	},

	// Alpha
	blisteringiceage: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "On switch-in, the weather becomes extremely heavy hailstorm lasts for 3 turns that prevents damaging Steel-type moves from executing, causes Ice-type moves to be 50% stronger, causes all non-Ice-type Pokemon on the opposing side to take 1/8 damage from hail, and causes all moves to have a 10% chance to freeze. This weather bypasses Magic Guard and Overcoat. This weather remains in effect until the 3 turns are up, or the weather is changed by Delta Stream, Desolate Land, Primordial Sea, or Snowstorm.",
		shortDesc: "3 Turns. Heavy Hailstorm. Steel fail. 1.5x Ice.",
		name: "Blistering Ice Age",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hail', target);
			this.add('-anim', target, 'Subzero Slammer', target);
			this.add('-anim', source, 'Subzero Slammer', source);
		},
		secondary: null,
		weather: 'heavyhailstorm',
		target: "all",
		type: "Ice",
	},

	// Arsenal
	vorpalwings: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Raises the users speed by 1 stage.",
		shortDesc: "Raises the users speed by 1 stage.",
		name: "Vorpal Wings",
		pp: 32,
		priority: 0,
		flags: {protect: 1, contact: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
	},

	// awa
	awa: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Sets up Sandstorm.",
		shortDesc: "Sets up Sandstorm.",
		name: "awa!",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Let\'s Snuggle Forever', target);
		},
		weather: 'sandstorm',
		secondary: null,
		target: "normal",
		type: "Rock",
	},

	// Beowulf
	buzzinspection: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Gains the ability Compound Eyes and then switches out",
		shortDesc: "Gains Compound Eyes and switches",
		name: "Buzz Inspection",
		pp: 10,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Night Shade', source);
		},
		onHit(pokemon) {
			pokemon.baseAbility = 'compoundeyes' as ID;
			pokemon.setAbility('compoundeyes');
			this.add('-ability', pokemon, pokemon.getAbility().name, '[from] move: Buzz Inspection');
		},
		selfSwitch: true,
		secondary: null,
		target: "self",
		type: "Bug",
	},

	// Cake
	kevin: {
		accuracy: 100,
		basePower: 111,
		category: "Physical",
		desc: "This move combines the user's current typing in its type effectiveness against the target.",
		shortDesc: "Combines current types in its type effectiveness.",
		name: "Kevin",
		pp: 10,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Brave Bird', target);
		},
		onModifyType(move, pokemon, target) {
			move.type = pokemon.types[0];
		},
		onTryImmunityPriority: -2,
		onTryImmunity(target, pokemon) {
			if (pokemon.types[1]) {
				if (!target.runImmunity(pokemon.types[1])) return false;
			}
			return true;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			const pokemon = target.side.foe.active[0];
			if (pokemon.types[1]) {
				return typeMod + this.dex.getEffectiveness(pokemon.types[1], type);
			}
			return typeMod;
		},
		priority: 0,
		secondary: null,
		target: "normal",
		type: "Bird",
	},

	// cant say
	neverlucky: {
		accuracy: 85,
		basePower: 110,
		category: "Special",
		desc: "Doubles base power if statused. Has a 10% chance to boost every stat 1 stage. High Crit Ratio.",
		shortDesc: "Doubles base power if statused. Has a 10% chance to boost every stat 1 stage. High Crit Ratio.",
		name: "Never Lucky",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Overheat', target);
		},
		onBasePower(basePower, pokemon) {
			if (pokemon.status && pokemon.status !== 'slp') {
				return this.chainModify(2);
			}
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
		critRatio: 2,
		target: "normal",
		type: "Fire",
	},

	// Chloe
	vsni: {
		accuracy: 55,
		basePower: 100,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		name: "Víðsýni",
		pp: 5,
		priority: 1,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Seed Flare', target);
		},
		target: "normal",
		type: "Grass",
	},

	// c.kilgannon
	deathwing: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Lowers the target's Attack by 1 stage. The user restores its HP equal to the target's Attack stat calculated with its stat stage before this move was used. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. Fails if the target's Attack stat stage is -6.",
		shortDesc: "User heals HP=target's Atk stat. Lowers Atk by 1.",
		name: "Death Wing",
		pp: 10,
		priority: 0,
		flags: {protect: 1, heal: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Supersonic Skystrike', target);
		},
		onHit(target, source) {
			if (target.boosts.atk === -6) return false;
			const atk = target.getStat('atk', false, true);
			const success = this.boost({atk: -1}, target, source, null, false, true);
			return !!(this.heal(atk, source, target) || success);
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},

	// Darth
	archangelsrequiem: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "This move type is always the user's secondary typing. If this move is successful, both the target and the user ar forced out, and the user's replacement gets 1/3 of its maximum health restored.",
		shortDesc: "Type=2nd type,both mons switch,replacement: heal.",
		name: "Archangel's Requiem",
		pp: 10,
		priority: -5,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Roost', source);
			this.add('-anim', source, 'Whirlwind', target);
			this.add('-anim', source, 'Whirlwind', source);
		},
		onModifyType(move, pokemon) {
			const type = pokemon.types[1] ? pokemon.types[1] : pokemon.types[0];
			move.type = type;
		},
		onHit(target, source, move) {
			if (source && source !== target && target.hp) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag) return;
				if (source.switchFlag === true) return;
				target.switchFlag = true;
			}
		},
		effect: {
			onSwap(target) {
				if (!target.fainted && target.hp < target.maxhp) {
					this.add(`c|${getName('Darth')}|Take my place, serve the Angel of Stall!`);
					target.heal(target.maxhp);
					this.add('-heal', target, 33, '[from] move: Archangel\'s Requiem');
				}
			},
		},
		selfSwitch: true,
		target: "normal",
		type: "Normal",
	},

	// drampa's grandpa
	getoffmylawn: {
		accuracy: 100,
		basePower: 78,
		category: "Special",
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		shortDesc: "User switches out after damaging the target.",
		name: "GET OFF MY LAWN!",
		pp: 10,
		priority: -6,
		flags: {protect: 1, sound: 1, authentic: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Boomburst', target);
		},
		onHit() {
			this.add(`c|${getName('drampa\'s grandpa')}|GET OFF MY LAWN!!!`);
		},
		secondary: null,
		selfSwitch: true,
		target: "normal",
		type: "Normal",
	},

	// dream
	lockandkey: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack and Special Defense stats by 1 stage and prevents the target from switching out.",
		shortDesc: "Raises user's SpA and SpD by 1 Prevents foe from switching.",
		name: "Lock and Key",
		pp: 10,
		priority: 0,
		flags: {},
		onHit(target, source, move) {
			if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
		},
		self: {
			boosts: {
				spa: 1,
				spd: 1,
			},
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Steel",
	},

	// Elgino
	navisgrace: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "This move is super effective on Steel- and Poison-type Pokemon.",
		shortDesc: "Super effective on Steel and Poison types.",
		name: "Navi's Grace",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		secondary: null,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dazzling Gleam', target);
			this.add('-anim', source, 'Earth Power', target);
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Poison' || type === 'Steel') return 1;
		},
		target: 'normal',
		type: 'Fairy',
	},

	// Emeri
	forcedlanding: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up. For 5 turns, the evasiveness of all active Pokemon is multiplied by 0.6. At the time of use, Bounce, Fly, Magnet Rise, Sky Drop, and Telekinesis end immediately for all active Pokemon. During the effect, Bounce, Fly, Flying Press, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash, and Telekinesis are prevented from being used by all active Pokemon. Ground-type attacks, Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability can affect Flying types or Pokemon with the Levitate Ability. Fails if this move is already in effect.",
		shortDesc: "Restore 50% HP + set Gravity.",
		name: "Forced Landing",
		pp: 10,
		priority: 0,
		flags: {heal: 1},
		heal: [1, 2],
		pseudoWeather: 'gravity',
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Roost', source);
			this.add('-anim', source, 'Gravity', source);
		},
		secondary: null,
		target: "self",
		type: "Flying",
	},


	// fart
	soupstealing7starstrikeredux: {
		accuracy: 100,
		basePower: 40,
		basePowerCallback() {
			if (this.field.pseudoWeather.soupstealing7starstrikeredux) {
				return 40 * this.field.pseudoWeather.soupstealing7starstrikeredux.multiplier;
			}
			return 40;
		},
		category: "Physical",
		desc: "This move is either a Water, Fire, or Grass type move. The selected type is added to the user of this move. For every consecutive turn that this move is used by at least one Pokemon, this move's power is multiplied by the number of turns to pass, but not more than 5.",
		shortDesc: "Changes user/move type to fire, water, or grass. Power increases when repeated.",
		name: "Soup-Stealing 7-Star Strike: Redux",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTry() {
			this.field.addPseudoWeather('soupstealing7starstrikeredux');
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Conversion", source);
		},
		onModifyMove(move, pokemon) {
			const types = ['Fire', 'Water', 'Grass'];
			const randomType = this.sample(types);
			move.type = randomType;
			pokemon.addType(randomType);
			this.add('-start', pokemon, 'typeadd', randomType);
		},
		onHit(target, source) {
			this.add('-anim', source, 'Spectral Thief', target);
			if (this.randomChance(1, 2)) {
				this.add(`c|${getName('fart')}|I hl on soup`);
			} else {
				this.add(`c|${getName('fart')}|I walk with purpose. bring me soup.`);
			}
		},
		effect: {
			duration: 2,
			onStart() {
				this.effectData.multiplier = 1;
			},
			onRestart() {
				if (this.effectData.duration !== 2) {
					this.effectData.duration = 2;
					if (this.effectData.multiplier < 5) {
						this.effectData.multiplier++;
					}
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},

	// Flare
	krisenbon: {
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		desc: "Almost always goes first. Deals double damage if resisted.",
		shortDesc: "Almost always goes first. Deals double damage if resisted.",
		name: "Kōri Senbon",
		pp: 3,
		noPPBoosts: true,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Ice Shard', target);
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Ice",
	},

	// frostyicelad
	frostywave: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "This move and its effects ignore the Abilities of other Pokemon.",
		shortDesc: "Ignores abilities. Hits adjacent opponents.",
		name: "Frosty Wave",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		ignoreAbility: true,
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Boomburst', target);
			this.add('-anim', source, 'Blizzard', target);
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Ice",
	},

	// GXS
	datacorruption: {
		accuracy: 90,
		basePower: 110,
		category: "Special",
		desc: "Has a 30% chance to randomly lower one of the target's stats by 1 stage.",
		shortDesc: "30% chance to randomly lower a foe's stat.",
		name: "Data Corruption",
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		secondary: {
			chance: 30,
			onHit(target) {
				const stats: BoostName[] = [];
				let stat: BoostName;
				for (stat in target.boosts) {
					if (stat === 'evasion' || stat === 'accuracy') continue;
					if (target.boosts[stat] > -6) {
						stats.push(stat);
					}
				}
				if (stats.length) {
					const randomStat = this.sample(stats);
					const boost: SparseBoostsTable = {};
					boost[randomStat] = -1;
					this.boost(boost);
				} else {
					return false;
				}
			},
		},
		target: "normal",
		type: "Normal",
	},

	// Instruct
	hypergoner: {
		accuracy: 85,
		basePower: 130,
		category: "Physical",
		desc: "Always Super Effective. Will leave opponent on 1 HP.",
		shortDesc: "Always Super Effective. Will leave opponent on 1 HP.",
		name: "Hyper Goner",
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Prismatic Laser', target);
		},
		onEffectiveness(typeMod, target, type) {
			return 1;
		},
		noFaint: true,
		secondary: null,
		target: "normal",
		type: "???",
	},

	// Jett x_x
	thehuntison: {
		accuracy: 100,
		basePower: 55,
		basePowerCallback(pokemon, target, move) {
			// You can't get here unless the pursuit effect succeeds
			if (target.beingCalledBack) {
				this.debug('Thehuntison damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		desc: "If an opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original target. If the user moves after an opponent using Parting Shot, U-turn, or Volt Switch, but not Baton Pass, it will hit that opponent before it leaves the field. Power doubles and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over; if an opponent faints from this, the replacement Pokemon does not become active until the end of the turn. Raises the user's Attack by 2 stages if this move KOes the target.",
		shortDesc: "Foe: 2x power when switching. +2 Atk if KO.",
		name: "The Hunt is On!",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Sucker Punch', target);
			this.add('-anim', source, 'Pursuit', target);
		},
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side === pokemon.side) continue;
				side.addSideCondition('thehuntison', pokemon);
				const data = side.getSideConditionData('thehuntison');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack) move.accuracy = true;
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('thehuntison');
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) {
				this.boost({atk: 2}, pokemon, pokemon, move);
				this.add(`c|${getName('Jett xx')}|Gotcha!`);
			}
		},
		effect: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Thehuntison start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectData.sources) {
					if (!this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: The Hunt is On!');
						alreadyAdded = true;
					}
					this.runMove('thehuntison', source, this.getTargetLoc(pokemon, source));
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
	},

	// Kaiju Bunny
	cozycuddle: {
		accuracy: 95,
		basePower: 0,
		category: "Status",
		desc: "Traps the target and lowers its Attack and Defense by two stages.",
		shortDesc: "Target: trapped, Atk and Def lowered by 2.",
		name: "Cozy Cuddle",
		pp: 20,
		priority: 0,
		flags: {},
		volatileStatus: 'cozycuddle',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTryHit(target, source, move) {
			if (target.volatiles['cozycuddle']) return false;
			if (target.volatiles['trapped']) {
				delete move.volatileStatus;
			}
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Flatter', target);
			this.add('-anim', source, 'Let\'s Snuggle Forever', target);
		},
		onHit(target, source, move) {
			this.boost({atk: -2, def: -2}, target, target);
		},
		effect: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Cozy Cuddle', '[of]' + source.name);
			},
			onTrapPokemon(pokemon) {
				if (this.effectData.source?.isActive) pokemon.tryTrap();
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},

	// KingSwordYT
	clashofpangoros: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "If this move is successful, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user restores 1/8 of its maximum HP, rounded half up. Target can't use status moves its next 3 turns. Lowers the target's Attack by 1 stages.",
		shortDesc: "Deals damage, heals 1/8, taunts, lowers Atk, and switches out.",
		name: "Clash of Pangoros",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Black Hole Eclipse', target);
		},
		onAfterHit(target, source) {
			if (source.hp) {
				this.heal(source.maxhp / 2, source);
			}
		},
		onHit(target, pokemon, move) {
			this.boost({atk: -1}, target, target, move);
			target.addVolatile('taunt', pokemon);
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Dark",
	},

	// Jho
	genrechange: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If the user is a Toxtricity, it changes into its Low-Key forme and Nasty Plot and Overdrive change to Aura Sphere and Boomburst, respectively. If the user is a Toxtricity in its Low-Key forme, it changes into its Amped forme and Aura Sphere and Boomburst turn into Nasty Plot and Overdrive, respectively. Raises the user's Speed by 1 stage.",
		shortDesc: "Toxtricity: +1 Speed. Changes forme.",
		name: "Genre Change",
		pp: 5,
		priority: 0,
		flags: {sound: 1},
		onTryMove(pokemon, target, move) {
			this.attrLastMove('[still]');
			if (pokemon.species.baseSpecies === 'Toxtricity') {
				return;
			}
			this.add('-fail', pokemon, 'move: Genre Change');
			this.hint("Only a Pokemon whose form is Toxtricity or Toxtricity-Low-Key can use this move.");
			return null;
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Screech', source);
			// The transform animation is done via `formeChange`
		},
		onHit(pokemon) {
			if (pokemon.species.forme === 'Low-Key') {
				pokemon.formeChange(`toxtricity`, this.effect);
				pokemon.moveSlots = pokemon.moveSlots.map(slot => {
					const newMoves: {[k: string]: string} = {
						boomburst: 'overdrive',
						aurasphere: 'nastyplot',
					};
					if (slot.id in newMoves) {
						const move = this.dex.getMove(newMoves[slot.id]);
						const newSlot = {
							id: move.id,
							move: move.name,
							// Luckily, both slots have the same number of PP
							pp: slot.pp,
							maxpp: move.pp * 8 / 5,
							disabled: slot.disabled,
							used: false,
						};
						return newSlot;
					}
					return slot;
				});
			} else {
				pokemon.formeChange(`toxtricitylowkey`, this.effect);
				pokemon.setAbility('venomize');
				pokemon.moveSlots = pokemon.moveSlots.map(slot => {
					const newMoves: {[k: string]: string} = {
						overdrive: 'boomburst',
						nastyplot: 'aurasphere',
					};
					if (slot.id in newMoves) {
						const move = this.dex.getMove(newMoves[slot.id]);
						const newSlot = {
							id: move.id,
							move: move.name,
							// Luckily, both slots have the same number of PP
							pp: slot.pp,
							maxpp: move.pp * 8 / 5,
							disabled: slot.disabled,
							used: false,
						};
						return newSlot;
					}
					return slot;
				});
			}
		},
		boosts: {
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},

	// Jordy
	archeopssrage: {
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		desc: "Upon damaging the target, the user gains +1 Speed.",
		shortDesc: "+1 Speed upon hit.",
		name: "Archeops's Rage",
		pp: 5,
		flags: {protect: 1},
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Sunsteel Strike', target);
		},
		type: "Flying",
		self: {
			boosts: {
				spe: 1,
			},
		},
		secondary: null,
		target: "normal",
	},

	// Kris
	alphabetsoup: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user changes into a random Pokemon with a first name letter that matches the forme Unown is currently in (A -> Alakazam, etc) that has base stats that would benefit from Unown's EV/IV/Nature spread and moves. Using it while in a forme that is not Unown will make it revert back to the Unown forme it transformed in (If an Unown transforms into Alakazam, it'll transform back to Unown-A when used again). Light of Ruin becomes Strange Steam, Psystrike becomes Psyshock, Secret Sword becomes Aura Sphere, Mind Blown becomes Flamethrower, and Seed Flare becomes Apple Acid while in a non-Unown forme.",
		shortDesc: "Transform into Unown. Unown: Transform into mon.",
		name: "Alphabet Soup",
		pp: 20,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'All-Out Pummeling', source);
			this.add('-anim', source, 'Perish Song', source);
			this.add('-anim', source, 'Roar of Time', source);
		},
		onHit(target) {
			if (!target) return;
			if (target.species.id.includes('unown')) {
				const monList = Object.keys(this.dex.data.Pokedex).filter(speciesid => {
					const species = this.dex.getSpecies(speciesid);
					if (species.isGigantamax) return false;
					if (species.id.startsWith('unown')) return false;
					if (species.isNonstandard === 'Unobtainable') return false;
					if (['Arceus', 'Silvally'].includes(species.baseSpecies) && species.types[0] !== 'Normal') return false;
					if (species.baseStats.spa < 80) return false;
					if (species.baseStats.spe < 80) return false;
					const unownLetter = target.species.id.charAt(5) || 'a';
					if (!species.id.startsWith(unownLetter.trim().toLowerCase())) return false;
					return true;
				});
				target.formeChange(this.sample(monList), this.effect, true);
				target.setAbility('Protean');
				target.moveSlots = target.moveSlots.map(slot => {
					const newMoves: {[k: string]: string} = {
						lightofruin: 'strangesteam',
						psystrike: 'psyshock',
						secretsword: 'aurasphere',
						mindblown: 'flamethrower',
						seedflare: 'appleacid',
					};
					if (slot.id in newMoves) {
						const newMove = this.dex.getMove(newMoves[slot.id]);
						const newSlot = {
							id: newMove.id,
							move: newMove.name,
							pp: newMove.pp * 8 / 5,
							maxpp: newMove.pp * 8 / 5,
							disabled: slot.disabled,
							used: false,
						};
						return newSlot;
					}
					return slot;
				});
			} else {
				let transformingLetter = target.species.id[0];
				if (transformingLetter === 'a') transformingLetter = '';
				target.formeChange(`unown${transformingLetter}`, this.effect, true);
				target.moveSlots = target.moveSlots.map(slot => {
					const newMoves: {[k: string]: string} = {
						strangesteam: 'lightofruin',
						psyshock: 'psystrike',
						aurasphere: 'secretsword',
						flamethrower: 'mindblown',
						appleacid: 'seedflare',
					};
					if (slot.id in newMoves) {
						const newMove = this.dex.getMove(newMoves[slot.id]);
						const newSlot = {
							id: newMove.id,
							move: newMove.name,
							pp: newMove.pp * 8 / 5,
							maxpp: newMove.pp * 8 / 5,
							disabled: slot.disabled,
							used: false,
						};
						return newSlot;
					}
					return slot;
				});
			}
		},
		secondary: null,
		target: "self",
		type: "Bird",
	},

	// Majorbowman
	corrosivecloud: {
		accuracy: true,
		basePower: 90,
		category: "Special",
		desc: "Has a 30% chance to burn the target. This move's type effectiveness against Steel is changed to be super effective no matter what this move's type is.",
		shortDesc: "30% chance to burn. Super effective on Steel.",
		name: "Corrosive Cloud",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Poison Gas', target);
			this.add('-anim', source, 'Fire Spin', target);
		},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Steel') return 1;
		},
		ignoreImmunity: {'Poison': true},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Poison",
	},

	// Mitsuki
	terraforming: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "Upon use, this move sets up Stealth Rock on the target's side of the field, as well as setting up Grassy Terrain.",
		shortDesc: "Sets up Grassy Terrain and Stealth Rock.",
		name: "Terraforming",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Rock Slide', target);
			this.add('-anim', source, 'Ingrain', target);
			this.add('-anim', source, 'Stealth Rock', target);
		},
		terrain: 'grassyterrain',
		sideCondition: 'stealthrock',
		secondary: null,
		target: "normal",
		type: "Rock",
	},

	// n10siT
	"unbind": {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "",
		shortDesc: "",
		name: "Unbind",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hyperspace Hole', source);
			this.add('-anim', source, 'Hyperspace Fury', source);
		},
		onHit(target, pokemon, move) {
			if (pokemon.baseSpecies.baseSpecies === 'Hoopa') {
				const forme = pokemon.species.forme === 'Unbound' ? '' : '-Unbound';
				pokemon.formeChange(`Hoopa${forme}`, this.effect, false, '[msg]');
				this.boost({spe: 1}, pokemon, pokemon, move);
			}
		},
		onModifyType(move, pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Hoopa') return;
			move.type = pokemon.species.name === 'Hoopa-Unbound' ? 'Dark' : 'Psychic';
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},

	// OM~!
	mechomnism: {
		accuracy: 95,
		basePower: 90,
		category: "Special",
		desc: "Heals 33% of damage dealt. 15% chance to raise Special Attack by 1 stage.",
		shortDesc: "Heals 33% of damage dealt. 15% chance to raise SpA by 1.",
		name: "MechOMnism",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 3],
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Mirror Shot', target);
			this.add('-anim', source, 'Refresh', source);
		},
		onHit() {
			this.add(`c|${getName('OM~!')}|Alley Oop`);
		},
		secondary: {
			chance: 15,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
	},

	// Overneat
	healingyou: {
		accuracy: 100,
		basePower: 117,
		category: "Physical",
		desc: "Heals foe 50% and eliminates any status problem but it lowers Defense and Special Defense stat by 1 stage, then proceeds to attack the foe.",
		shortDesc: "Heals foe and gets rid of their status but the foe's Def and SpD by 1, attacks the foe.",
		name: "Healing you?",
		pp: 5,
		priority: 0,
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Heal Pulse', target);
			this.heal(Math.ceil(target.baseMaxhp * 0.5));
			target.cureStatus();
			this.boost({def: -1, spd: -1}, target);
			this.add('-anim', source, 'Close Combat', target);
		},
		flags: {mirror: 1, protect: 1},
		secondary: null,
		target: "normal",
		type: "Dark",
	},

	// Paradise
	"rapidturn": {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Removes hazards then user switches out after dealing damage",
		shortDesc: "Removes hazards then switches out",
		name: "Rapid Turn",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Rapid Spin', target);
			this.add('-anim', source, 'U-turn', target);
		},
		onAfterHit(target, pokemon) {
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Turn', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Turn', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Normal",
	},

	// Perish Song
	sinistergaze: {
		accuracy: 90,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		category: "Special",
		desc: "Power doubles if the target has a major status condition. This move has a 40% chance to randomly burn, paralyze, or poison the target after each use if the target is not already inflicted with a status move.",
		shortDesc: "40% chance BRN/PAR/PSN. 2x power if foe status.",
		name: "Sinister Gaze",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Mean Look', target);
			this.add('-anim', source, 'Black Hole Eclipse', target);
		},
		secondary: {
			chance: 40,
			onHit(target, source) {
				const result = this.random(3);
				if (result === 0) {
					target.trySetStatus('brn', source);
				} else if (result === 1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('psn', source);
				}
			},
		},
		target: "normal",
		type: "Ghost",
	},

	// phiwings99
	ghostof1v1past: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Imprisons and traps the target, and then transforms into them.",
		shortDesc: "Imprison + Mean Look + Transform.",
		name: "Ghost of 1v1 Past",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Imprison', source);
			this.add('-anim', source, 'Mean Look', target);
			this.add('-anim', source, 'Transform', target);
		},
		onHit(target, pokemon, move) {
			target.addVolatile('trapped', pokemon, move, 'trapper');
			pokemon.addVolatile('imprison', pokemon, move);
			if (!pokemon.transformInto(target)) {
				return false;
			}
		},
		isZ: "boatiumz",
		secondary: null,
		target: "normal",
		type: "Ghost",
	},

	// PiraTe Princess
	dungeonsdragons: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from switching out and adds Dragon to the target's type. Has a 5% chance to either confuse the user or guarantee that the next attack is a critical hit, 15% chance to raise the user's Attack, Defense, Special Attack, Special Defense, or Speed by 1 stage, and a 15% chance to raise user's Special Attack and Speed by 1 stage.",
		shortDesc: "Target: can't switch,+Dragon. Does other things.",
		name: "Dungeons & Dragons",
		pp: 10,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Imprison', target);
			this.add('-anim', source, 'Trick-or-Treat', target);
			this.add('-anim', source, 'Shell Smash', source);
		},
		onHit(target, source, move) {
			this.add(`c|${getName('PiraTe Princess')}|did someone say d&d?`);
			target.addVolatile('trapped', source, move, 'trapper');
			if (!target.hasType('Dragon') && target.addType('Dragon')) {
				this.add('-start', target, 'typeadd', 'Dragon', '[from] move: Dungeons & Dragons');
			}
			const result = this.random(21);
			if (result === 20) {
				source.addVolatile('laserfocus');
			} else if (result >= 2 && result <= 16) {
				const boost: SparseBoostsTable = {};
				const stats: BoostName[] = ['atk', 'def', 'spa', 'spd', 'spe'];
				boost[stats[this.random(5)]] = 1;
				this.boost(boost, source);
			} else if (result >= 17 && result <= 19) {
				this.boost({spa: 1, spe: 1}, source);
			} else {
				source.addVolatile('confusion');
			}
		},
		target: "normal",
		type: "Dragon",
	},

	// quadrophenic
	extremeways: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		desc: "Super effective against pokemon that are supereffective against it. 20% chance do a random effect depending on user's type.",
		shortDesc: "20% chance to a different effect depending on type.",
		name: "Extreme Ways",
		pp: 10,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Spite', target);
		},
		onEffectiveness(typeMod, target, type) {
			if (!target) return;
			const source = target.side.foe.active[0];
			for (const foeType of target.types) {
				if (this.dex.getImmunity(foeType, source) && this.dex.getEffectiveness(foeType, source) > 0) {
					return 1;
				}
			}
		},
		secondary: {
			chance: 20,
			onHit(target, source) {
				switch (toID(source.types[0])) {
				case 'normal':
					const typeList = Object.keys(this.dex.data.TypeChart);
					const newType = this.sample(typeList);
					source.types = [newType];
					this.add('-start', source, 'typechange', newType);
					break;
				case 'fire':
					target.trySetStatus('brn', source);
					break;
				case 'water':
					source.addVolatile('aquaring', source);
					break;
				case 'grass':
					if (target.hasType('Grass')) break;
					target.addVolatile('leechseed', source);
					break;
				case 'electric':
					target.trySetStatus('par', source);
					break;
				case 'bug':
					target.side.addSideCondition('stickyweb');
					break;
				case 'ice':
					target.trySetStatus('frz', source);
					break;
				case 'poison':
					target.trySetStatus('tox', source);
					break;
				case 'dark':
					target.addVolatile('taunt', source);
					break;
				case 'ghost':
					target.trySetStatus('slp', source);
					break;
				case 'psychic':
					this.field.setTerrain('psychicterrain');
					break;
				case 'flying':
					source.side.addSideCondition('tailwind', source);
					break;
				case 'dragon':
					target.forceSwitchFlag = true;
					break;
				case 'steel':
					target.side.addSideCondition('gmaxsteelsurge');
					break;
				case 'rock':
					target.side.addSideCondition('stealthrock');
					break;
				case 'ground':
					target.side.addSideCondition('spikes');
					break;
				case 'fairy':
					this.field.setTerrain('mistyterrain');
					break;
				case 'fighting':
					source.addVolatile('focusenergy', source);
					break;
				}
			},
		},
		target: "normal",
		type: "???",
	},

	// Rabia
	psychodrive: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 30% chance to boost the user's Speed by 1 stage.",
		shortDesc: "30% chance to boost the user's Spe by 1.",
		name: "Psycho Drive",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Genesis Supernova', target);
		},
		secondary: {
			chance: 30,
			self: {
				boosts: {spe: 1},
			},
		},
		target: "normal",
		type: "Psychic",
	},

	// Ransei
	ripsei: {
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			const damage = pokemon.hp;
			return damage;
		},
		category: "Special",
		desc: "Deals damage to the target equal to the user's current HP. If this move is successful, the user faints.",
		shortDesc: "Does damage equal to the user's HP. User faints.",
		name: "ripsei",
		pp: 5,
		priority: 1,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Final Gambit', target);
		},
		onAfterMove(pokemon, target, move) {
			if (pokemon.moveThisTurnResult === true) {
				pokemon.faint();
			}
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},

	// Robb576
	integeroverflow: {
		accuracy: true,
		basePower: 200,
		category: "Special",
		desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. This move and its effects ignore the Abilities of other Pokemon.",
		shortDesc: "Physical if user's Atk > Sp. Atk. Ignores Abilities.",
		name: "Integer Overflow",
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Light That Burns The Sky', target);
		},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		ignoreAbility: true,
		isZ: "modium6z",
		secondary: null,
		target: "normal",
		type: "Psychic",
	},

	mode5offensive: {
		accuracy: true,
		basePower: 30,
		category: "Special",
		desc: "This move hits three times. Every hit has a 20% chance to drop the target's SpD by 1 stage.", // long description
		shortDesc: "Hits three times. Every hit has a 20% chance to drop the target's SpD by 1 stage.",
		name: "Mode [5: Offensive]",
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Focus Blast', target);
			this.add('-anim', source, 'Zap Cannon', target);
		},
		secondary: {
			chance: 20,
			boosts: {
				spd: -1,
			},
		},
		multihit: 3,
		target: "normal",
		type: "Fighting",
	},

	mode7defensive: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "This move cures the user's party of all status conditions, and then forces the target to switch to a random ally.",
		shortDesc: "Cures the user's party of all status conditions; and then forces the target to switch to a random ally.",
		name: "Mode [7: Defensive]",
		pp: 15,
		priority: 0, // should be -6, waiting on QC
		flags: {sound: 1, distance: 1, authentic: 1},
		forceSwitch: true,
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Heal Bell', source);
			this.add('-anim', source, 'Roar', source);
		},
		onHit(pokemon, source) {
			this.add('-activate', source, 'move: Mode [7: Defensive]');
			const side = pokemon.side;
			let success = false;
			for (const ally of side.pokemon) {
				if (ally.hasAbility('soundproof')) continue;
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		target: "normal",
		type: "Normal",
	},

	// Segmr
	disconnect: {
		accuracy: 100,
		basePower: 150,
		category: "Special",
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move, Doom Desire, or Future Sight is already in effect for the target's position. Switches the user out.",
		shortDesc: "Hits 2 turns after use. User switches out.",
		name: "Disconnect",
		pp: 5,
		priority: 0,
		flags: {},
		isFutureMove: true,
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Doom Desire', target);
		},
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) {
				source.switchFlag = 'disconnect' as ID;
			} else {
				Object.assign(target.side.slotConditions[target.position]['futuremove'], {
					move: 'disconnect',
					source: source,
					moveData: {
						id: 'disconnect',
						name: "Disconnect",
						accuracy: 100,
						basePower: 150,
						category: "Special",
						priority: 0,
						flags: {},
						effectType: 'Move',
						isFutureMove: true,
						type: 'Fairy',
					},
				});
				this.add('-start', source, 'Disconnect');
				this.add(`c|%Segmr|Lemme show you this`);
				source.switchFlag = 'disconnect' as ID;
				return null;
			}
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},

	// Sunny
	oneforallfullcowl100: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "User takes 40% recoil damage.",
		shortDesc: "Has 40% recoil.",
		name: "One For All: Full Cowl - 100%",
		pp: 30,
		priority: 0,
		flags: {contact: 1, protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'All Out Pummeling', target);
		},
		recoil: [4, 10],
		target: "normal",
		type: "Dragon",
	},

	// Teclis
	ten: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up. Raises the user's Special Attack by 1 stage.",
		shortDesc: "Heals user by 50% and raises Sp. Atk 1 stage.",
		name: "Ten",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		onTryMove(target) {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Calm Mind', source);
			this.add('-anim', source, 'Recover', source);
		},
		boosts: {
			spa: 1,
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},

	// Tenshi
	stonykibbles: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "For 5 turns, the weather becomes Sandstorm. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are a Ground, Rock, or Steel type, or have the Magic Guard, Overcoat, Sand Force, Sand Rush, or Sand Veil Abilities. During the effect, the Special Defense of Rock-type Pokemon is multiplied by 1.5 when taking damage from a special attack. Lasts for 8 turns if the user is holding Smooth Rock. Fails if the current weather is Sandstorm.",
		shortDesc: "For 5 turns, a sandstorm rages.",
		name: "Stony Kibbles",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Rock Slide', target);
			this.add('-anim', source, 'Crunch', target);
			this.add('-anim', source, 'Sandstorm', target);
		},
		weather: 'Sandstorm',
		target: "normal",
		type: "Normal",
	},

	// tiki
	rightoncue: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "25% chance of setting up a layer of spikes. 25% chance of using Heal Bell. 25% chance of using Leech Seed. 25% chance of using Tailwind. 25% chance of using Octolock.",
		shortDesc: "5 independent chances of rolling different effects.",
		name: "Right. On. Cue!",
		pp: 10,
		priority: 0,
		flags: {},
		onHit(target, source) {
			let effects = 0;
			if (this.randomChance(1, 4)) {
				this.useMove('Spikes', source, target);
				effects++;
			}
			if (this.randomChance(1, 4)) {
				this.useMove('Heal Bell', source);
				effects++;
			}
			if (this.randomChance(1, 4)) {
				this.useMove('Leech Seed', source, target);
				effects++;
			}
			if (this.randomChance(1, 4)) {
				this.useMove('Tailwind', source, target);
				effects++;
			}
			if (this.randomChance(1, 4)) {
				this.useMove('Octolock', source);
				effects++;
			}
			if (effects <= 0) {
				this.add(`c|${getName('tiki')}|truly a dumpster fire`);
			} else if (effects >= 3) {
				this.add(`c|${getName('tiki')}|whos ${source.side.foe.name}?`);
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},

	// yuki
	classchange: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If the user is a cosplay Pikachu forme, it randomly changes forme and effect.",
		shortDesc: "Pikachu: Random forme and effect.",
		name: "Class Change",
		pp: 6,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(foe, source, move) {
			let animation: string;
			const formes = ['Cleric', 'Ninja', 'Dancer', 'Songstress', 'Jester'];
			source.m.yukiCosplayForme = this.sample(formes);
			switch (source.m.yukiCosplayForme) {
			case 'Cleric':
				animation = 'Strength Sap';
				break;
			case 'Ninja':
				animation = 'Confuse Ray';
				break;
			case 'Dancer':
				animation = 'Feather Dance';
				break;
			case 'Songstress':
				animation = 'Sing';
				break;
			case 'Jester':
				animation = 'Charm';
				break;
			default:
				animation = 'Tackle';
				break;
			}
			this.add('-anim', source, animation, foe);
		},
		onHit(target, source) {
			if (source.baseSpecies.baseSpecies !== 'Pikachu') return;
			let classChangeIndex = source.moveSlots.map(x => x.id).indexOf('classchange' as ID);
			if (classChangeIndex < 0) classChangeIndex = 1;
			const getMoveSlot = (k: string, curMovePP?: number) => {
				const move = this.dex.getMove(k);
				return {
					id: move.id,
					move: move.name,
					pp: curMovePP || move.pp * 8 / 5,
					maxpp: move.pp * 8 / 5,
					disabled: false,
					used: false,
				};
			};
			switch (source.m.yukiCosplayForme) {
			case 'Cleric':
				if (target.boosts.atk === -6) return false;
				const atk = target.getStat('atk', false, true);
				const success = this.boost({atk: -1}, target, source, null, false, true);
				source.formeChange('pikachuphd', this.effect, true);
				source.moveSlots = [
					getMoveSlot('paraboliccharge'),
					getMoveSlot('wish'),
					getMoveSlot('batonpass'),
					getMoveSlot('classchange', source.moveSlots[classChangeIndex].pp),
				];
				this.add('-message', 'yuki patches up her wounds!');
				return !!(this.heal(atk, source, target) || success);
			case 'Ninja':
				target.addVolatile('confusion');
				source.formeChange('pikachulibre', this.effect, true);
				source.moveSlots = [
					getMoveSlot('watershuriken'),
					getMoveSlot('acrobatics'),
					getMoveSlot('toxic'),
					getMoveSlot('classchange', source.moveSlots[classChangeIndex].pp),
				];
				this.add('-message', `yuki's fast movements confuse ${target.name}!`);
				return;
			case 'Dancer':
				this.boost({atk: -2}, target, source, this.effect, false, true);
				source.formeChange('pikachupopstar', this.effect, true);
				source.moveSlots = [
					getMoveSlot('fierydance'),
					getMoveSlot('revelationdance'),
					getMoveSlot('lunardance'),
					getMoveSlot('classchange', source.moveSlots[classChangeIndex].pp),
				];
				this.add('-message', `yuki dazzles ${target.name} with her moves!`);
				return;
			case 'Songstress':
				target.trySetStatus('slp');
				source.formeChange('pikachurockstar', this.effect, true);
				source.moveSlots = [
					getMoveSlot('hypervoice'),
					getMoveSlot('overdrive'),
					getMoveSlot('sing'),
					getMoveSlot('classchange', source.moveSlots[classChangeIndex].pp),
				];
				this.add('-message', `yuki sang an entrancing melody!`);
				return;
			case 'Jester':
				this.boost({atk: -2}, target, source, this.effect, false, true);
				source.formeChange('pikachubelle', this.effect, true);
				source.moveSlots = [
					getMoveSlot('present'),
					getMoveSlot('metronome'),
					getMoveSlot('teeterdance'),
					getMoveSlot('classchange', source.moveSlots[classChangeIndex].pp),
				];
				this.add('-message', `yuki tries her best to impress ${target.name}!`);
				return;
			default:
				return;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},

	// Zalm
	ingredientforaging: {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Heals 50% if foe is holding an item. Removes item and enables Belch.",
		shortDesc: "If foe has item: Heal 50% and remove it.",
		name: "Ingredient Foraging",
		pp: 10,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] stealeat', '[move] Ingredient Foraging', '[of] ' + source);
					this.heal(source.maxhp / 2, source);
					this.add(`c|${getName('Zalm')}|Yum`);
					source.ateBerry = true;
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Bug",
	},

	// Zodiax
	bigstormcoming: {
		accuracy: 100,
		basePower: 0,
		category: "Special",
		desc: "Uses Hurricane, Thunder, Blizzard, and Weather Ball at 30% power.",
		shortDesc: "30% power: Hurricane, Thunder, Blizzard, Weather Ball.",
		name: "Big Storm Coming",
		pp: 10,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTry(pokemon, target) {
			pokemon.m.bigstormcoming = true;
			this.useMove("Hurricane", pokemon);
			this.useMove("Thunder", pokemon);
			this.useMove("Blizzard", pokemon);
			this.useMove("Weather Ball", pokemon);
			pokemon.m.bigstormcoming = false;
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},
	// These moves need modified to support Snowstorm (Perish Song's ability)
	auroraveil: {
		inherit: true,
		desc: "For 5 turns, the user and its party members take 0.5x damage from physical and special attacks, or 0.66x damage if in a Double Battle; does not reduce damage further with Reflect or Light Screen. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Brick Break and Psychic Fangs remove the effect before damage is calculated. Lasts for 8 turns if the user is holding Light Clay. Fails unless the weather is Heavy Hailstorm, Hail, or Snowstorm.",
		shortDesc: "For 5 turns, damage to allies is halved. Hail-like weather only.",
		onTryHitSide() {
			if (!this.field.isWeather(['heavyhailstorm', 'hail', 'snowstorm'])) return false;
		},
	},
	blizzard: {
		inherit: true,
		desc: "Has a 10% chance to freeze the target. If the weather is Heavy Hailstorm, Hail, or Snowstorm, this move does not check accuracy.",
		shortDesc: "10% freeze foe(s). Can't miss in Hail-like weather.",
		onModifyMove(move) {
			if (this.field.isWeather(['heavyhailstorm', 'hail', 'snowstorm'])) move.accuracy = true;
		},
	},
	dig: {
		inherit: true,
		effect: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (['sandstorm', 'heavyhailstorm', 'hail', 'snowstorm'].includes(type)) return false;
			},
			onInvulnerability(target, source, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
	},
	dive: {
		inherit: true,
		effect: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (['sandstorm', 'heavyhailstorm', 'hail', 'snowstorm'].includes(type)) return false;
			},
			onInvulnerability(target, source, move) {
				if (['surf', 'whirlpool'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
		},
	},
	moonlight: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Heavy Hailstorm, Hail, Primordial Sea, Rain Dance, Sandstorm, or Snowstorm, all rounded half down.",
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'heavyhailstorm':
			case 'hail':
			case 'snowstorm':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	morningsun: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Heavy Hailstorm, Hail, Primordial Sea, Rain Dance, Sandstorm, or Snowstorm, all rounded half down.",
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'heavyhailstorm':
			case 'hail':
			case 'snowstorm':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	solarbeam: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. Power is halved if the weather is Heavy Hailstorm, Hail, Snowstorm, Primordial Sea, Rain Dance, or Sandstorm and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.",
		onBasePower(basePower, pokemon, target) {
			const weathers = ['raindance', 'primordialsea', 'sandstorm', 'heavyhailstorm', 'hail', 'snowstorm'];
			if (weathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. Power is halved if the weather is Heavy Hailstorm, Hail, Snowstorm, Primordial Sea, Rain Dance, or Sandstorm and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.",
		onBasePower(basePower, pokemon, target) {
			const weathers = ['raindance', 'primordialsea', 'sandstorm', 'heavyhailstorm', 'hail', 'snowstorm'];
			if (weathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	synthesis: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Heavy Hailstorm, Hail, Primordial Sea, Rain Dance, Sandstorm, or Snowstorm, all rounded half down.",
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'heavyhailstorm':
			case 'hail':
			case 'snowstorm':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	weatherball: {
		inherit: true,
		desc: "Power doubles if a weather condition other than Delta Stream is active, and this move's type changes to match. Ice type during Heavy Hailstorm, Hail, and Snowstorm, Water type during Primordial Sea or Rain Dance, Rock type during Sandstorm, and Fire type during Desolate Land or Sunny Day. If the user is holding Utility Umbrella and uses Weather Ball during Primordial Sea, Rain Dance, Desolate Land, or Sunny Day, the move is still Normal-type and does not have a base power boost.",
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
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
			case 'heavyhailstorm':
			case 'hail':
			case 'snowstorm':
				move.type = 'Ice';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'heavyhailstorm':
			case 'hail':
			case 'snowstorm':
				move.basePower *= 2;
				break;
			}
		},
	},
	// Modified move descriptions for support of Segmr's move
	doomdesire: {
		inherit: true,
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move, Disconnect, or Future Sight is already in effect for the target's position.",
	},
	futuresight: {
		inherit: true,
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move, Doom Desire, or Disconnect is already in effect for the target's position.",
	},
};
