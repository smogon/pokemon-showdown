/**
 * Fakemon signature moves - the yellow entries of the dex PDF.
 *
 * These are the moves each evolution line is guaranteed to learn, and every one
 * of them is implemented as real battle mechanics. Where the source gives no
 * numbers (most entries only describe an effect), power/accuracy/PP were chosen
 * to match the effect's strength; those choices are listed in
 * IMPLEMENTATION_NOTES.md.
 */

import { FOOD_ITEMS } from './items';

/** The custom game's food items, plus anything else edible. */
function isFakemonFoodItem(item: Item) {
	return FOOD_ITEMS.includes(item.id as never) || !!item.isBerry;
}

export const SignatureMoves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	abyssalburial: {
		num: 2001,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Abyssal Burial",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: { boosts: { spa: -2 } },
		target: 'normal',
		type: "Water",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
	},
	acrobaticpounce: {
		num: 2002,
		accuracy: 100,
		basePower: 55,
		category: "Physical",
		name: "Acrobatic Pounce",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source) {
			if (!source.item) return basePower * 2;
		},
		target: 'normal',
		type: "Electric",
		shortDesc: "Power doubles if the user has no held item.",
	},
	anchordrop: {
		num: 2003,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Anchor Drop",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onHit(target, source) {
			// The user lands: it is treated as grounded until it switches out.
			source.addVolatile('smackdown');
		},
		target: 'normal',
		type: "Rock",
		shortDesc: "Rock damage; the user becomes grounded until it switches out.",
	},
	anothercup: {
		num: 2004,
		accuracy: 100,
		basePower: 55,
		category: "Special",
		name: "Another Cup",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower, source, target) {
			const hitByWater = target.attackedBy.some(entry => entry.thisTurn &&
				this.dex.moves.get(entry.move).type === 'Water');
			if (hitByWater) return basePower * 2;
		},
		target: 'normal',
		type: "Fairy",
		shortDesc: "Power doubles if the target was hit by a Water move this turn.",
	},
	antennapulse: {
		num: 2005,
		accuracy: true,
		basePower: 70,
		category: "Special",
		name: "Antenna Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		onModifyPriority(priority, source, target, move) {
			if (target && target.runEffectiveness(move) > 0) return priority + 1;
		},
		target: 'normal',
		type: "Steel",
		shortDesc: "Always hits. +1 priority when super effective.",
	},
	apexsever: {
		num: 2006,
		accuracy: 95,
		basePower: 110,
		category: "Physical",
		name: "Apex Sever",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, slicing: 1 },
		self: { boosts: { def: -1, spd: -1 } },
		target: 'normal',
		type: "Bug",
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
	},
	athenasgaze: {
		num: 2007,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Athenas Gaze",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		volatileStatus: 'athenasgaze',
		condition: {
			duration: 4,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Athenas Gaze');
				this.boost({ accuracy: 2 }, pokemon, pokemon);
				pokemon.addVolatile('focusenergy');
			},
			onModifyCritRatio(critRatio) {
				return critRatio + 1;
			},
			onEnd(pokemon) {
				// The boosts "normalise" again after three turns.
				this.boost({ accuracy: -2 }, pokemon, pokemon);
				pokemon.removeVolatile('focusenergy');
				this.add('-end', pokemon, 'move: Athenas Gaze');
			},
		},
		target: 'self',
		type: "Grass",
		shortDesc: "+2 Accuracy and crit ratio; wears off after 3 turns.",
	},
	baitingspirit: {
		num: 2008,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Baiting Spirit",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		volatileStatus: 'baitingspirit',
		condition: {
			duration: 4,
			onStart(pokemon) {
				const best = pokemon.moveSlots
					.filter(slot => this.dex.moves.get(slot.id).category !== 'Status')
					.sort((a, b) => this.dex.moves.get(b.id).basePower -
						this.dex.moves.get(a.id).basePower)[0];
				if (!best) {
					pokemon.removeVolatile('baitingspirit');
					return false;
				}
				this.effectState.move = best.id;
				this.add('-start', pokemon, 'move: Baiting Spirit', best.move);
			},
			onDisableMove(pokemon) {
				for (const slot of pokemon.moveSlots) {
					if (slot.id !== this.effectState.move) pokemon.disableMove(slot.id);
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Baiting Spirit');
			},
		},
		target: 'normal',
		type: "Ghost",
		shortDesc: "Locks the target into its strongest attack for 3 turns.",
	},
	baloonbounce: {
		num: 2009,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Baloon Bounce",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source, target) {
			// The lighter the target, the harder it is thrown: 1/4x .. 4x.
			const ratio = source.getWeight() / Math.max(1, target.getWeight());
			return basePower * Math.max(0.25, Math.min(4, ratio));
		},
		target: 'normal',
		type: "Flying",
		shortDesc: "More damage the lighter the target is (1/4x to 4x).",
	},
	barbedcounter: {
		num: 2010,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Barbed Counter",
		pp: 10,
		priority: 3,
		flags: { protect: 1, mirror: 1 },
		onTry(source) {
			if (source.lastMove?.id === 'barbedcounter' && source.moveLastTurnResult) {
				this.add('-fail', source);
				return null;
			}
		},
		onModifyType(move, pokemon) {
			move.type = pokemon.types[0];
		},
		onHit(target, source) {
			source.addVolatile('barbedcounter');
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Barbed Counter');
			},
			// The user cannot be knocked out during the turn it braces.
			onDamagePriority: -20,
			onDamage(damage, target, source, effect) {
				if (effect?.effectType === 'Move' && damage >= target.hp) return target.hp - 1;
			},
			onDamagingHit(damage, target, source, move) {
				if (move.category !== 'Physical' || !source.hp) return;
				const counter = this.dex.getActiveMove('barbedcounterhit');
				counter.type = target.types[0];
				counter.damage = damage * 2;
				this.actions.useMove(counter, target, { target: source });
			},
		},
		target: 'self',
		type: "Normal",
		shortDesc: "+3 priority brace: survives on 1 HP and counters physical hits for 2x.",
	},
	barbedcounterhit: {
		num: 2011,
		accuracy: true,
		basePower: 0,
		category: "Physical",
		name: "Barbed Counter Strike",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: { protect: 1 },
		isNonstandard: 'Custom',
		damageCallback(pokemon, target) {
			return (this.activeMove)?.damage as number || 0;
		},
		target: 'normal',
		type: "Normal",
		shortDesc: "The retaliation half of Barbed Counter.",
	},
	barrierbreak: {
		num: 2012,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Barrierbreak",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower, source, target) {
			// The target's Sp. Def stage is treated as -|stage|, so a +N target
			// takes as much damage as a -N one would.
			const stage = target.boosts.spd;
			if (stage <= 0) return;
			return basePower * ((2 + stage) * (2 + stage)) / 4;
		},
		target: 'normal',
		type: "Psychic",
		shortDesc: "Treats the target's Sp. Def stage as negative.",
	},
	berryburst: {
		num: 2013,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Berry Burst",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bullet: 1 },
		onHit(target, source, move) {
			if (target.status === 'tox') {
				target.addVolatile('confusion', source, move);
			} else if (target.status === 'psn') {
				target.setStatus('tox', source, move, true);
			}
		},
		target: 'normal',
		type: "Poison",
		shortDesc: "Badly poisons poisoned foes; confuses badly poisoned foes.",
	},
	bittertears: {
		num: 2014,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Bitter Tears",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondaries: [
			{ chance: 100, boosts: { atk: -1 } },
			{ chance: 100, status: 'psn' },
		],
		target: 'normal',
		type: "Poison",
		shortDesc: "Lowers the target's Attack by 1 and poisons it.",
	},
	bogslam: {
		num: 2015,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Bog Slam",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source, target) {
			if (source.getStat('def') > target.getStat('def')) {
				return Math.floor(basePower * 1.5);
			}
		},
		target: 'normal',
		type: "Ground",
		shortDesc: "50% more damage if the user's Defense beats the target's.",
	},
	boilingsplash: {
		num: 2016,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Boiling Splash",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1 },
		onEffectiveness(typeMod, target, type) {
			// Boiling water scalds anything a fire would: Bug, Grass, Steel, Ice.
			if (['Bug', 'Grass', 'Steel', 'Ice'].includes(type)) return 1;
		},
		secondary: { chance: 20, status: 'brn' },
		target: 'normal',
		type: "Water",
		shortDesc: "Water move that is also super effective on Bug/Grass/Steel/Ice.",
	},
	bonewhip: {
		num: 2017,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Bone Whip",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Ghost') return 1;
		},
		ignoreImmunity: { Ground: true },
		target: 'normal',
		type: "Ground",
		shortDesc: "Ground move that is super effective on Ghost types.",
	},
	bramblegown: {
		num: 2018,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Bramble Gown",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		boosts: { def: 1, spd: 1 },
		volatileStatus: 'bramblegown',
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Bramble Gown');
			},
			onDamagingHit(damage, target, source, move) {
				if (move.flags['contact'] && source.hp) {
					this.damage(source.baseMaxhp / 8, source, target,
						this.effect);
				}
			},
		},
		target: 'self',
		type: "Grass",
		shortDesc: "+1 Def/Sp. Def; contact attackers this turn lose 1/8 max HP.",
	},
	brickshelter: {
		num: 2019,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Brick Shelter",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'brickshelter',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Brick Shelter');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'move: Brick Shelter');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove && source.volatiles['lockedmove'].duration === 2) {
					delete source.volatiles['lockedmove'];
				}
				this.boost(move.category === 'Special' ? { spa: -1 } : { atk: -1 }, source, target,
					this.effect);
				return this.NOT_FAIL;
			},
		},
		target: 'self',
		type: "Rock",
		shortDesc: "Protects and lowers the blocked attacker's offensive stat by 1.",
	},
	bulboverload: {
		num: 2020,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Bulb Overload",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: { chance: 30, status: 'par' },
		target: 'normal',
		type: "Steel",
		shortDesc: "30% chance to paralyse.",
	},
	bytepunch: {
		num: 2021,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Bytepunch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		target: 'normal',
		type: "Electric",
		shortDesc: "No additional effect.",
	},
	celestialthunderbolt: {
		num: 2022,
		accuracy: 85,
		basePower: 95,
		category: "Special",
		name: "Celestial Thunderbolt",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onModifyMove(move, source) {
			if (['raindance', 'primordialsea'].includes(source.effectiveWeather())) {
				move.accuracy = true;
			}
		},
		secondary: { chance: 10, status: 'par' },
		target: 'normal',
		type: "Electric",
		shortDesc: "Cannot miss in rain. 10% chance to paralyse.",
	},
	cementpour: {
		num: 2023,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Cement Pour",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		boosts: { spe: -2 },
		volatileStatus: 'smackdown',
		target: 'normal',
		type: "Rock",
		shortDesc: "-2 Speed and grounds the target.",
	},
	chainreaction: {
		num: 2024,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Chain Reaction",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		multihit: [2, 3],
		onModifyMove(move) {
			// Each hit in the chain doubles the previous one.
			(move as any).chainHit = 0;
		},
		onBasePower(basePower, source, target, move) {
			const hit = (move as any).chainHit || 0;
			(move as any).chainHit = hit + 1;
			return basePower * 2 ** hit;
		},
		target: 'normal',
		type: "Dark",
		shortDesc: "Hits 2-3 times; each hit doubles the previous one's power.",
	},
	claritygeyser: {
		num: 2025,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Clarity Geyser",
		pp: 10,
		priority: 1,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower, source, target) {
			if (['psn', 'tox'].includes(target.status)) return basePower * 2;
		},
		target: 'normal',
		type: "Water",
		shortDesc: "+1 priority; power doubles against a poisoned target.",
	},
	clearvitriolic: {
		num: 2026,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Clear Vitriolic",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onAfterHit(target, source) {
			const hazards = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb',
				'livewire', 'fakemonbleedhazard'];
			for (const id of hazards) {
				if (source.side.removeSideCondition(id)) {
					this.add('-sideend', source.side, this.dex.conditions.get(id).name,
						'[from] move: Clear Vitriolic', `[of] ${source}`);
				}
			}
		},
		target: 'normal',
		type: "Poison",
		shortDesc: "Clears entry hazards on the user's side.",
	},
	clearweatherburst: {
		num: 2027,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Clear Weather Burst",
		pp: 15,
		priority: 0,
		flags: { snatch: 1 },
		boosts: { spe: 1 },
		onHit(target, source) {
			for (const ally of source.adjacentAllies()) {
				this.boost({ spe: 1 }, ally, source);
			}
		},
		target: 'self',
		type: "Flying",
		shortDesc: "Raises the user's and its ally's Speed by 1.",
	},
	cocoonspin: {
		num: 2028,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Cocoon Spin",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		self: { boosts: { def: -1 } },
		secondary: { chance: 30, boosts: { def: -1 } },
		target: 'normal',
		type: "Bug",
		shortDesc: "30% chance to lower the target's Defense; lowers the user's Defense.",
	},
	cocorefresh: {
		num: 2029,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Coco Refresh",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		heal: [1, 2],
		onHit(target, source) {
			if (!['sunnyday', 'desolateland'].includes(source.effectiveWeather())) return;
			for (const ally of source.adjacentAllies()) {
				this.heal(ally.baseMaxhp / 4, ally, source);
			}
		},
		target: 'self',
		type: "Grass",
		shortDesc: "Heals the user 50%; in sun also heals its ally 25%.",
	},
	codebreaker: {
		num: 2030,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Codebreaker",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		volatileStatus: 'codebreaker',
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Codebreaker');
			},
			onDisableMove(pokemon) {
				for (const slot of pokemon.moveSlots) {
					if (this.dex.moves.get(slot.id).stallingMove) pokemon.disableMove(slot.id);
				}
			},
			onBeforeMove(pokemon, target, move) {
				if (move.stallingMove) {
					this.add('cant', pokemon, 'move: Codebreaker', move);
					return false;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Codebreaker');
			},
		},
		target: 'normal',
		type: "Steel",
		shortDesc: "The target cannot use protecting moves for 5 turns.",
	},
	coldflamebeam: {
		num: 2031,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Cold Flamebeam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: { chance: 30, status: 'frz' },
		target: 'normal',
		type: "Fire",
		shortDesc: "Fire-type move with a 30% chance to freeze.",
	},
	condordive: {
		num: 2032,
		accuracy: 95,
		basePower: 130,
		category: "Physical",
		name: "Condor Dive",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onAfterMove(source) {
			// Costs 25% max HP, but never faints the user.
			const cost = Math.min(Math.floor(source.baseMaxhp / 4), source.hp - 1);
			if (cost > 0) this.damage(cost, source, source, this.effect);
		},
		target: 'normal',
		type: "Flying",
		shortDesc: "The user loses 25% max HP but cannot faint from it.",
	},
	conecrash: {
		num: 2033,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Cone Crash",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bullet: 1 },
		secondary: { chance: 20, volatileStatus: 'flinch' },
		target: 'allAdjacentFoes',
		type: "Grass",
		shortDesc: "Hits both foes; 20% chance to flinch.",
	},
	cookiecrunch: {
		num: 2034,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Cookie Crunch",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, bite: 1, heal: 1 },
		drain: [1, 2],
		target: 'normal',
		type: "Fairy",
		shortDesc: "Heals the user by 50% of the damage dealt.",
	},
	copycatstrike: {
		num: 2035,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Copycat Strike",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onModifyType(move, pokemon, target) {
			if (target?.lastMove && !target.lastMove.isZ) move.type = target.lastMove.type;
		},
		target: 'normal',
		type: "Normal",
		shortDesc: "Takes the type of the target's last used move.",
	},
	cottonwind: {
		num: 2036,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Cotton Wind",
		pp: 10,
		priority: 0,
		flags: {},
		sideCondition: 'cottonfield',
		target: 'allySide',
		type: "Grass",
		shortDesc: "Its side cannot flinch and takes 25% less from super effective hits.",
	},
	counterboneswipe: {
		num: 2037,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Counter Bone Swipe",
		pp: 5,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			if (!action || action.move.category === 'Status' || target.volatiles['mustrecharge']) {
				this.add('-fail', source);
				this.attrLastMove('[still]');
				return null;
			}
		},
		target: 'normal',
		type: "Ground",
		shortDesc: "Only works if the target is about to attack; strikes first.",
	},
	cranecatapult: {
		num: 2038,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Crane Catapult",
		pp: 10,
		priority: -6,
		flags: { contact: 1, protect: 1, mirror: 1 },
		forceSwitch: true,
		target: 'normal',
		type: "Steel",
		shortDesc: "Deals damage and forces the target out.",
	},
	creamsplash: {
		num: 2039,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Cream Splash",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		target: 'allAdjacentFoes',
		type: "Grass",
		shortDesc: "Hits both opposing Pokemon.",
	},
	crustalram: {
		num: 2040,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		name: "Crustal Ram",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		basePowerCallback(pokemon, target) {
			const ratio = pokemon.getWeight() / Math.max(1, target.getWeight());
			if (ratio >= 5) return 120;
			if (ratio >= 4) return 100;
			if (ratio >= 3) return 80;
			if (ratio >= 2) return 60;
			return 40;
		},
		target: 'normal',
		type: "Rock",
		shortDesc: "Stronger the heavier the user is compared to the target.",
	},
	crystalmelody: {
		num: 2041,
		accuracy: true,
		basePower: 30,
		category: "Special",
		name: "Crystal Melody",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		self: { boosts: { def: 1, spd: 1 } },
		onAfterMove(source) {
			// The melody rings out over everyone, the user included.
			this.damage(Math.floor(source.baseMaxhp / 16), source, source,
				this.effect);
		},
		target: 'allAdjacent',
		type: "Rock",
		shortDesc: "+1 Def/Sp. Def; low damage to everything, including the user.",
	},
	crystalspike: {
		num: 2042,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Crystal Spike",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		ignoreImmunity: { Ground: true },
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		target: 'normal',
		type: "Ground",
		shortDesc: "Hits Pokemon that would be immune to Ground moves.",
	},
	ddosswarm: {
		num: 2043,
		accuracy: 95,
		basePower: 20,
		category: "Special",
		name: "DDOS Swarm",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		multihit: [2, 5],
		secondary: { chance: 100, boosts: { spd: -1 } },
		target: 'normal',
		type: "Steel",
		shortDesc: "Hits 2-5 times; each hit lowers the target's Sp. Def by 1.",
	},
	deepforestambush: {
		num: 2044,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Deep Forest Ambush",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source, target) {
			if (this.queue.willMove(target)) return Math.floor(basePower * 1.3);
		},
		target: 'normal',
		type: "Ghost",
		shortDesc: "30% more damage if the user moves before the target.",
	},
	desertlariat: {
		num: 2045,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Desert Lariat",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		ignoreDefensive: true,
		ignoreEvasion: true,
		target: 'normal',
		type: "Grass",
		shortDesc: "Ignores the target's Defense and Evasion boosts.",
	},
	desertprowl: {
		num: 2046,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Desert Prowl",
		pp: 15,
		priority: 0,
		flags: { snatch: 1 },
		onHit(target, source) {
			const boosts: SparseBoostsTable = { atk: 1, accuracy: 1 };
			if (source.effectiveWeather() === 'sandstorm') boosts.evasion = 1;
			this.boost(boosts, source, source);
		},
		target: 'self',
		type: "Ground",
		shortDesc: "+1 Attack and Accuracy; also +1 Evasion in a sandstorm.",
	},
	dinner41: {
		num: 2047,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dinner-4-1",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		volatileStatus: 'dinner41',
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.effectState.layers = 1;
				this.add('-start', pokemon, 'move: Dinner-4-1');
			},
			onRestart(pokemon) {
				this.effectState.layers++;
				this.effectState.duration = 5;
				this.add('-start', pokemon, 'move: Dinner-4-1', '[silent]');
			},
			onResidualOrder: 5,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp * this.effectState.layers / 10, pokemon);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Dinner-4-1');
			},
		},
		target: 'self',
		type: "Fairy",
		shortDesc: "Heals 10% max HP each turn for 5 turns. Stacks.",
	},
	doublespin: {
		num: 2048,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Double-Spin",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		multihit: 2,
		target: 'normal',
		type: "Fairy",
		shortDesc: "Hits twice.",
	},
	dragonvortex: {
		num: 2049,
		accuracy: 100,
		basePower: 130,
		category: "Special",
		name: "Dragon Vortex",
		pp: 5,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) return;
			this.add('-prepare', attacker, move.name);
			this.boost({ spe: 1, def: 1 }, attacker, attacker, move);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) return;
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		target: 'allAdjacentFoes',
		type: "Dragon",
		shortDesc: "Charges with +1 Speed/Defense, then hits both foes hard.",
	},
	dreadlock: {
		num: 2050,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Dread Lock",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		boosts: { spa: -1 },
		onHit(target, source, move) {
			target.addVolatile('trapped', source, move, 'trapper');
		},
		target: 'normal',
		type: "Dark",
		shortDesc: "-1 Sp. Atk and the target cannot switch out.",
	},
	driedthorns: {
		num: 2051,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Dried Thorns",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		volatileStatus: 'driedthorns',
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Dried Thorns');
			},
			onResidualOrder: 9,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 8, pokemon, null,
					this.effect);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Dried Thorns');
			},
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "Damages the target over 5 turns.",
	},
	driftroll: {
		num: 2052,
		accuracy: 95,
		basePower: 120,
		category: "Physical",
		name: "Driftroll",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		target: 'normal',
		type: "Normal",
		shortDesc: "No additional effect.",
	},
	echoblast: {
		num: 2053,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Echo Blast",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		basePowerCallback(pokemon, target, move) {
			const chain = pokemon.volatiles['echoblast']?.chain || 0;
			return Math.min(300, move.basePower * (chain + 1));
		},
		onAfterMove(source) {
			source.addVolatile('echoblast');
		},
		condition: {
			noCopy: true,
			onStart() {
				this.effectState.chain = 1;
			},
			onRestart() {
				this.effectState.chain++;
			},
			// The chain breaks as soon as a non-sound move is used.
			onAfterMove(pokemon, target, move) {
				if (!move.flags['sound']) pokemon.removeVolatile('echoblast');
			},
		},
		target: 'normal',
		type: "Dark",
		shortDesc: "Sound move; power multiplies with consecutive sound moves (max 300).",
	},
	eggsplosion: {
		num: 2054,
		accuracy: 100,
		basePower: 140,
		category: "Physical",
		name: "Eggsplosion",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, bullet: 1 },
		onAfterMove(source) {
			this.damage(Math.floor(source.baseMaxhp / 2), source, source,
				this.effect);
		},
		target: 'normal',
		type: "Normal",
		shortDesc: "The user loses 50% of its max HP.",
	},
	electicgnaw: {
		num: 2055,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Electic Gnaw",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, bite: 1 },
		onAfterHit(target, source) {
			const item = target.getItem();
			if (!isFakemonFoodItem(item)) return;
			if (target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] move: Electic Gnaw',
					`[of] ${source}`);
			}
		},
		target: 'normal',
		type: "Normal",
		shortDesc: "Consumes the target's food item.",
	},
	evaporate: {
		num: 2056,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Evaporate",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		target: 'allAdjacentFoes',
		type: "Dark",
		shortDesc: "Hits both opposing Pokemon.",
	},
	faemirror: {
		num: 2057,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Fae Mirror",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryHit(target, source) {
			const last = target.lastMove;
			if (!last || last.category === 'Status' || last.id === 'faemirror') {
				this.add('-fail', source);
				return null;
			}
			const copy = this.dex.getActiveMove(last.id);
			copy.type = 'Fairy';
			this.actions.useMove(copy, source, { target });
			return null;
		},
		target: 'normal',
		type: "Fairy",
		shortDesc: "Uses the target's last move back at it as a Fairy-type move.",
	},
	fakefluff: {
		num: 2058,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Fake Fluff",
		pp: 5,
		priority: 0,
		flags: { snatch: 1 },
		boosts: { def: -2, spd: -2 },
		volatileStatus: 'destinybond',
		target: 'self',
		type: "Ghost",
		shortDesc: "-2 Def/Sp. Def; KOes whatever knocks the user out this turn.",
	},
	feathercoat: {
		num: 2059,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Feather Coat",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'feathercoat',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Feather Coat');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'move: Feather Coat');
				// The blocked move's own secondaries rebound onto its user.
				for (const secondary of move.secondaries || []) {
					if (!this.randomChance(secondary.chance || 100, 100)) continue;
					if (secondary.status) source.trySetStatus(secondary.status, target, move);
					if (secondary.volatileStatus) {
						source.addVolatile(secondary.volatileStatus, target, move);
					}
					if (secondary.boosts) this.boost(secondary.boosts, source, target, move);
				}
				return this.NOT_FAIL;
			},
		},
		target: 'self',
		type: "Fairy",
		shortDesc: "Protects; the blocked move's secondary effects hit its user instead.",
	},
	feedbackscreech: {
		num: 2060,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Feedback Screech",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		onModifyMove(move) {
			const roomUp = ['trickroom', 'magicroom', 'wonderroom', 'hauntedroom', 'glitchedroom']
				.some(id => this.field.getPseudoWeather(id));
			if (roomUp) move.target = 'allAdjacentFoes';
		},
		secondary: { chance: 30, volatileStatus: 'flinch' },
		target: 'normal',
		type: "Dark",
		shortDesc: "30% flinch. Hits all foes while a room effect is active.",
	},
	fiendishbargain: {
		num: 2061,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Fiendish Bargain",
		pp: 5,
		priority: 0,
		flags: { snatch: 1 },
		onTry(source) {
			if (source.hp * 2 <= source.maxhp) {
				this.add('-fail', source, 'heal');
				return null;
			}
		},
		onHit(target, source) {
			this.directDamage(Math.floor(source.baseMaxhp / 2), source, source);
			this.boost({ spe: 2, spa: 2 }, source, source);
		},
		target: 'self',
		type: "Fire",
		shortDesc: "Costs 50% max HP for +2 Speed and +2 Sp. Atk.",
	},
	flamesting: {
		num: 2062,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Flamesting",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: { chance: 100, status: 'brn' },
		target: 'normal',
		type: "Fire",
		shortDesc: "Always burns the target.",
	},
	flattening: {
		num: 2063,
		accuracy: 70,
		basePower: 85,
		category: "Physical",
		name: "Flattening",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onModifyMove(move, source, target) {
			if (target && source.getStat('spe') > target.getStat('spe')) move.accuracy = 100;
		},
		secondary: { chance: 100, boosts: { spe: -1 } },
		target: 'normal',
		type: "Grass",
		shortDesc: "100% accurate if the user is faster, else 70%. Lowers Speed by 1.",
	},
	flutterstrike: {
		num: 2064,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Flutter Strike",
		pp: 15,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.types[1]) move.type = pokemon.types[1];
		},
		target: 'normal',
		type: "Bug",
		shortDesc: "+1 priority; uses the user's secondary type.",
	},
	focalbeam: {
		num: 2065,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Focal Beam",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit(target, source) {
			// Only sharpens if it is not already sharpened.
			if (source.volatiles['focusenergy']) return;
			this.boost({ accuracy: 1 }, source, source);
			source.addVolatile('focusenergy');
		},
		target: 'normal',
		type: "Steel",
		shortDesc: "Low damage; +1 Accuracy and crit ratio if not already boosted.",
	},
	fortressbash: {
		num: 2066,
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Fortress Bash",
		pp: 10,
		priority: -1,
		flags: { contact: 1, protect: 1, mirror: 1 },
		overrideOffensiveStat: 'def',
		target: 'normal',
		type: "Rock",
		shortDesc: "-1 priority; uses the user's Defense in place of Attack.",
	},
	foundationsmash: {
		num: 2067,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Foundation Smash",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryHit(target, source) {
			for (const id of ['reflect', 'lightscreen', 'auroraveil']) {
				if (target.side.removeSideCondition(id)) {
					this.add('-sideend', target.side, this.dex.conditions.get(id).name,
						'[from] move: Foundation Smash');
				}
			}
		},
		target: 'normal',
		type: "Rock",
		shortDesc: "Removes Reflect, Light Screen and Aurora Veil.",
	},
	fullmoon: {
		num: 2068,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Full Moon",
		pp: 5,
		priority: 0,
		flags: {},
		weather: 'fullmoon',
		target: 'all',
		type: "Ghost",
		shortDesc: "Sets Full Moon for 5 turns.",
	},
	fullmoonbeam: {
		num: 2069,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Full Moon Beam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit(target, source, move) {
			this.field.setWeather('fullmoon', source, move);
		},
		target: 'normal',
		type: "Ghost",
		shortDesc: "Deals damage and sets Full Moon for 5 turns.",
	},
	furiousaxeslash: {
		num: 2070,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		name: "Furious Axe Slash",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, slicing: 1 },
		willCrit: true,
		secondary: { chance: 30, volatileStatus: 'flinch' },
		target: 'normal',
		type: "Fighting",
		shortDesc: "Always a critical hit. 30% chance to flinch.",
	},
	furiouscrownbeam: {
		num: 2071,
		accuracy: 95,
		basePower: 80,
		category: "Special",
		name: "Furious Crown Beam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		willCrit: true,
		secondary: { chance: 30, volatileStatus: 'flinch' },
		target: 'normal',
		type: "Fairy",
		shortDesc: "Always a critical hit. 30% chance to flinch.",
	},
	furiousfang: {
		num: 2072,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Furious Fang",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, bite: 1 },
		onModifyType(move, pokemon) {
			move.type = pokemon.gender === 'F' ? 'Fairy' : 'Fighting';
		},
		secondary: { chance: 30, volatileStatus: 'flinch' },
		target: 'normal',
		type: "Fighting",
		shortDesc: "Fairy-type if the user is female, Fighting if male. 30% flinch.",
	},
	furniturehaunt: {
		num: 2073,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Furniture Haunt",
		pp: 5,
		priority: 0,
		flags: {},
		pseudoWeather: 'hauntedroom',
		target: 'all',
		type: "Ghost",
		shortDesc: "For 5 turns, every non-Ghost Pokemon also counts as Ghost-type.",
	},
	gasveil: {
		num: 2074,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Gasveil",
		pp: 10,
		priority: 0,
		flags: {},
		sideCondition: 'gasveil',
		target: 'foeSide',
		type: "Poison",
		shortDesc: "For 5 turns, the foes take double damage from Fire moves.",
	},
	ghostbash: {
		num: 2075,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Ghost Bash",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		// "Pretends the user's speed is 2x" - it moves in the fast half of the
		// bracket, which the engine models as a priority tie-break bonus.
		onModifyPriority(priority, source, target, move) {
			if (target && source.getStat('spe') * 2 > target.getStat('spe') &&
				source.getStat('spe') <= target.getStat('spe')) {
				return priority + 1;
			}
		},
		target: 'normal',
		type: "Ghost",
		shortDesc: "Acts as if the user's Speed were doubled.",
	},
	gigavoltpunch: {
		num: 2076,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Gigavolt Punch",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		self: { status: 'par' },
		target: 'normal',
		type: "Electric",
		shortDesc: "Paralyses the user.",
	},
	glitchmatrix: {
		num: 2077,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Glitch Matrix",
		pp: 5,
		priority: 0,
		flags: {},
		pseudoWeather: 'glitchedroom',
		target: 'all',
		type: "Steel",
		shortDesc: "For 5 turns, all type immunities are lifted.",
	},
	gravityforce: {
		num: 2078,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Gravity Force",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		volatileStatus: 'smackdown',
		target: 'normal',
		type: "Rock",
		shortDesc: "Grounds the target for the rest of the battle.",
	},
	gravityspore: {
		num: 2079,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Gravity Spore",
		pp: 5,
		priority: 0,
		flags: { powder: 1 },
		pseudoWeather: 'gravity',
		target: 'all',
		type: "Grass",
		shortDesc: "Every Pokemon is grounded for 5 turns.",
	},
	groundeddrain: {
		num: 2080,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Grounded Drain",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		heal: [1, 2],
		onHit(target, source) {
			source.addVolatile('smackdown');
			source.addVolatile('groundeddrain');
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Grounded Drain');
			},
			onTryHit(target, source, move) {
				if (move.type === 'Electric' && target !== source) {
					this.add('-immune', target, '[from] move: Grounded Drain');
					return null;
				}
			},
		},
		target: 'self',
		type: "Grass",
		shortDesc: "Heals 50%; the user becomes grounded and immune to Electric.",
	},
	guillotinegust: {
		num: 2081,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Guillotine Gust",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, slicing: 1 },
		critRatio: 3,
		target: 'normal',
		type: "Bug",
		shortDesc: "Very high critical hit ratio.",
	},
	harvesthopper: {
		num: 2082,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Harvest Hopper",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, heal: 1 },
		drain: [1, 2],
		target: 'normal',
		type: "Grass",
		shortDesc: "Heals the user by 50% of the damage dealt.",
	},
	heavenlysmite: {
		num: 2083,
		accuracy: 85,
		basePower: 150,
		category: "Physical",
		name: "Heavenly Smite",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onMoveFail(target, source, move) {
			// Being blocked by Protect does not count as a miss.
			if (target.volatiles['protect'] || target.volatiles['brickshelter'] ||
				target.volatiles['feathercoat'] || target.volatiles['sonicshielding']) return;
			this.add('-message', `${source.name} fell from the heavens!`);
			source.faint();
		},
		target: 'normal',
		type: "Fighting",
		shortDesc: "The user faints if this move misses (being blocked does not count).",
	},
	heavytrumpet: {
		num: 2084,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Heavy Trumpet",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		onAfterHit(target, source, move) {
			const damage = move.totalDamage;
			if (typeof damage !== 'number' || !target.hp) return;
			const percent = Math.floor(damage * 100 / target.maxhp);
			if (this.randomChance(Math.min(100, percent), 100)) {
				target.addVolatile('flinch', source, move);
			}
		},
		target: 'normal',
		type: "Ground",
		shortDesc: "Flinch chance equals the percentage of max HP it took off.",
	},
	heliumburst: {
		num: 2085,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Helium Burst",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: { status: 'brn' },
		secondary: { chance: 100, status: 'brn' },
		target: 'normal',
		type: "Flying",
		shortDesc: "Burns both the target and the user.",
	},
	infernalmeltdown: {
		num: 2086,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Infernal Meltdown",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower, source, target, move) {
			if (target.runEffectiveness(move) > 0) return basePower * 2;
		},
		target: 'normal',
		type: "Fire",
		shortDesc: "Deals double damage when super effective.",
	},
	inflatablefortress: {
		num: 2087,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Inflatable Fortress",
		pp: 15,
		priority: 0,
		flags: { snatch: 1 },
		boosts: { def: 1, spd: 1 },
		target: 'self',
		type: "Flying",
		shortDesc: "Raises the user's Defense and Sp. Def by 1.",
	},
	ionizingblast: {
		num: 2088,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Ionizing Blast",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower, source) {
			if (['raindance', 'primordialsea'].includes(source.effectiveWeather())) {
				return basePower * 2;
			}
		},
		onAfterMove() {
			if (this.field.isWeather('raindance')) this.field.clearWeather();
		},
		target: 'normal',
		type: "Electric",
		shortDesc: "Double damage in rain, then clears the rain.",
	},
	livewire: {
		num: 2089,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Live Wire",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1 },
		sideCondition: 'livewire',
		target: 'foeSide',
		type: "Electric",
		shortDesc: "Hazard: paralyses grounded, non-Flying Pokemon switching in.",
	},
	loamimpact: {
		num: 2090,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Loam Impact",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source, target) {
			if (target.volatiles['dig']) return basePower * 2;
		},
		onModifyMove(move) {
			(move as any).hitsUnderground = true;
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "Hits Pokemon underground for double damage.",
	},
	magmagulp: {
		num: 2091,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Magma Gulp",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Rock') return 1;
		},
		secondary: { chance: 10, status: 'brn' },
		target: 'normal',
		type: "Fire",
		shortDesc: "Super effective on Rock types.",
	},
	magneticcharge: {
		num: 2092,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Magnetic Charge",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		onHit(target, source) {
			this.boost({ atk: 1, spa: 1 }, source, source);
			for (const pokemon of this.getAllActive()) {
				if (pokemon === source || !pokemon.hp) continue;
				if (pokemon.hasType('Electric') || pokemon.hasType('Steel')) {
					this.damage(pokemon.baseMaxhp / 8, pokemon, source,
						this.effect);
				}
			}
		},
		target: 'self',
		type: "Steel",
		shortDesc: "+1 Atk/Sp. Atk; damages every other Electric and Steel Pokemon.",
	},
	mahoganymindcrash: {
		num: 2093,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Mahogany Mind Crash",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		overrideDefensiveStat: 'spa',
		target: 'normal',
		type: "Psychic",
		shortDesc: "Uses the target's Sp. Atk in place of its Sp. Def.",
	},
	maligantstalk: {
		num: 2094,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Maligant Stalk",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		critRatio: 2,
		onHit(target, source, move) {
			if (target.getMoveHitData(move).crit) target.trySetStatus('tox', source, move);
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "High crit ratio; badly poisons on a critical hit.",
	},
	mambranepulse: {
		num: 2095,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Mambrane Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		target: 'allAdjacentFoes',
		type: "Electric",
		shortDesc: "Hits both opposing Pokemon.",
	},
	mantisdance: {
		num: 2096,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mantis Dance",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, dance: 1 },
		boosts: { atk: 1, spe: 1 },
		target: 'self',
		type: "Bug",
		shortDesc: "Raises the user's Attack and Speed by 1.",
	},
	masterpiececurse: {
		num: 2097,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		name: "Masterpiece Curse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		status: 'psn',
		onHit(target, source) {
			let best: StatIDExceptHP = 'atk';
			let stat: StatIDExceptHP;
			for (stat in target.storedStats) {
				if (target.storedStats[stat] > target.storedStats[best]) best = stat;
			}
			this.boost({ [best]: -1 }, target, source);
		},
		target: 'normal',
		type: "Poison",
		shortDesc: "Poisons the target and lowers its highest stat (excluding HP) by 1.",
	},
	meltdown: {
		num: 2098,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Meltdown",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: { def: -1, spd: -1 } },
		target: 'normal',
		type: "Ice",
		shortDesc: "Lowers the target's Defense and Sp. Def by 1.",
	},
	mentaloverdrive: {
		num: 2099,
		accuracy: 100,
		basePower: 130,
		category: "Special",
		name: "Mental Overdrive",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: { boosts: { spd: -2 } },
		target: 'normal',
		type: "Psychic",
		shortDesc: "Lowers the user's Sp. Def by 2.",
	},
	metamorphicgale: {
		num: 2100,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Metamorphic Gale",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, wind: 1 },
		secondary: {
			chance: 30,
			self: {
				onHit(source) {
					const stats = (['atk', 'def', 'spa', 'spd', 'spe'] as StatIDExceptHP[])
						.filter(stat => source.boosts[stat] < 6);
					const stat = source.battle.sample(stats);
					if (stat) source.battle.boost({ [stat]: 1 }, source, source);
				},
			},
		},
		target: 'normal',
		type: "Bug",
		shortDesc: "30% chance to raise a random stat of the user by 1.",
	},
	meteordive: {
		num: 2101,
		accuracy: 95,
		basePower: 120,
		category: "Physical",
		name: "Meteor Dive",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		recoil: [33, 100],
		target: 'normal',
		type: "Rock",
		shortDesc: "The user takes 33% of the damage dealt as recoil.",
	},
	mindfulstrike: {
		num: 2102,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Mindful Strike",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source) {
			if (source.m.lastTurnStatusMove) return basePower * 2;
		},
		onAfterMove(source) {
			source.m.lastTurnStatusMove = false;
		},
		target: 'normal',
		type: "Water",
		shortDesc: "Power doubles if the user used a status move last turn.",
	},
	moonlightbuoyancy: {
		num: 2103,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Moonlight Buoyancy",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		onHit(target, source) {
			const strong = this.field.isTerrain('mistyterrain') ||
				this.field.isWeather('fullmoon');
			this.boost({ spe: strong ? 2 : 1, evasion: strong ? 2 : 1 }, source, source);
		},
		target: 'self',
		type: "Water",
		shortDesc: "+1 Speed/Evasion; +2 instead in Misty Terrain or under Full Moon.",
	},
	moonlightpounce: {
		num: 2104,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Moonlight Pounce",
		pp: 15,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source) {
			if (source.effectiveWeather() === 'fullmoon') return Math.floor(basePower * 1.5);
		},
		target: 'normal',
		type: "Ghost",
		shortDesc: "+1 priority; 50% more damage under Full Moon.",
	},
	myceliumuplift: {
		num: 2105,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mycelium Uplift",
		pp: 15,
		priority: 0,
		flags: { snatch: 1 },
		boosts: { evasion: 1, spa: 1 },
		target: 'self',
		type: "Grass",
		shortDesc: "Raises the user's Evasion and Sp. Atk by 1.",
	},
	nectardash: {
		num: 2106,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Nectar Dash",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onModifyPriority(priority, source) {
			if (isFakemonFoodItem(source.getItem())) return priority + 2;
		},
		onPrepareHit(source) {
			const item = source.getItem();
			if (!isFakemonFoodItem(item)) return;
			source.eatItem(true);
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "Consumes the user's food item to gain +2 priority.",
	},
	needlejab: {
		num: 2107,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Needle Jab",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		volatileStatus: 'needlejab',
		onModifyMove(move, source) {
			// Retaliates the instant the user is struck.
			source.addVolatile('needlejabready');
		},
		condition: {},
		target: 'normal',
		type: "Grass",
		shortDesc: "Strikes back immediately when the user is hit this turn.",
	},
	needlejabready: {
		num: 2108,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Needle Jab Ready",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		isNonstandard: 'Custom',
		condition: {
			duration: 1,
			onDamagingHit(damage, target, source, move) {
				if (!source.hp || target.volatiles['needlejabused']) return;
				target.addVolatile('needlejabused');
				const jab = this.dex.getActiveMove('needlejab');
				jab.volatileStatus = undefined;
				this.actions.useMove(jab, target, { target: source });
			},
		},
		target: 'self',
		type: "Grass",
		shortDesc: "Internal marker for Needle Jab.",
	},
	needlemissle: {
		num: 2109,
		accuracy: 95,
		basePower: 25,
		category: "Physical",
		name: "Needle Missle",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		multihit: [2, 5],
		critRatio: 2,
		target: 'normal',
		type: "Grass",
		shortDesc: "Hits 2-5 times with a high critical hit ratio.",
	},
	needleroll: {
		num: 2110,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Needle Roll",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onModifyType(move, pokemon) {
			move.type = pokemon.types[0];
		},
		onModifyMove(move, pokemon) {
			// The status it inflicts follows the user's own type.
			const status = pokemon.hasType('Poison') ? 'tox' :
				pokemon.hasType('Electric') ? 'par' : null;
			if (status) move.secondaries = [{ chance: 30, status }];
		},
		target: 'normal',
		type: "Normal",
		shortDesc: "Uses the user's type; 30% chance of that type's status condition.",
	},
	nightpulse: {
		num: 2111,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Night Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		target: 'normal',
		type: "Dark",
		shortDesc: "A strong sound move with no additional effect.",
	},
	nutlauncher: {
		num: 2112,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Nut Launcher",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bullet: 1 },
		multihit: [2, 5],
		onTryHit(target, source, move) {
			if (!target.isAlly(source) || target === source) return;
			// Fired at an ally it feeds them instead of hurting them.
			const healed = this.actions.getDamage(source, target, move);
			if (typeof healed === 'number') this.heal(Math.floor(healed / 2), target, source, move);
			return null;
		},
		target: 'any',
		type: "Grass",
		shortDesc: "Hits 2-5 times; heals an ally for half the damage instead.",
	},
	oakcarving: {
		num: 2113,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Oak Carving",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, nonsky: 1 },
		volatileStatus: 'substitute',
		onTryHit(source) {
			if (source.volatiles['substitute']) {
				this.add('-fail', source, 'move: Oak Carving');
				return null;
			}
			if (source.hp <= source.maxhp / 4 || source.maxhp === 1) {
				this.add('-fail', source, 'move: Oak Carving', '[weak]');
				return null;
			}
		},
		onHit(target) {
			this.directDamage(target.maxhp / 4);
			// A Splinter Bark carving keeps setting rocks when struck.
			if (target.hasAbility('spinterbark')) target.addVolatile('oakcarving');
		},
		condition: {
			onDamagingHit(damage, target, source, move) {
				if (!target.volatiles['substitute'] || move.category !== 'Physical') return;
				for (const side of target.side.foeSidesWithConditions()) {
					side.addSideCondition('stealthrock', target);
				}
			},
		},
		target: 'self',
		type: "Grass",
		shortDesc: "Costs 25% max HP for a Substitute that keeps Spinter Bark active.",
	},
	outofthecloset: {
		num: 2114,
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		name: "Out of the Closet",
		pp: 5,
		priority: 0,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1 },
		overrideOffensiveStat: 'spd',
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) return;
			// In a Haunted Room the whole two-turn sequence happens at once.
			if (this.field.getPseudoWeather('hauntedroom')) {
				this.boost({ spd: 1 }, attacker, attacker, move);
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({ spd: 1 }, attacker, attacker, move);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) return;
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		target: 'normal',
		type: "Ghost",
		shortDesc: "Charges (+1 Sp. Def), then attacks using Sp. Def. Instant in Haunted Room.",
	},
	overbake: {
		num: 2115,
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		name: "Overbake",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		recoil: [50, 100],
		self: { boosts: { def: 1 } },
		target: 'normal',
		type: "Fire",
		shortDesc: "50% recoil, but raises the user's Defense by 1.",
	},
	payloadpouch: {
		num: 2116,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		name: "Payload Pouch",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bullet: 1 },
		multihit: [2, 5],
		recoil: [30, 100],
		onModifyMove(move, source) {
			// A full pouch always empties completely - and is then spent.
			if (source.item) move.multihit = 5;
		},
		onAfterMove(source, target, move) {
			if (move.hit < 5 || !source.item) return;
			const item = source.getItem();
			if (isFakemonFoodItem(item)) {
				source.eatItem(true);
			} else if (source.takeItem()) {
				this.add('-enditem', source, item.name, '[from] move: Payload Pouch');
			}
		},
		target: 'normal',
		type: "Normal",
		shortDesc: "Hits 2-5 times (always 5 with an item, which is then used up). 30% recoil.",
	},
	phantomslash: {
		num: 2117,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Phantom Slash",
		pp: 10,
		priority: 2,
		flags: { contact: 1, protect: 1, mirror: 1, slicing: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			if (!action || action.move.category !== 'Status') {
				this.add('-fail', source);
				this.attrLastMove('[still]');
				return null;
			}
		},
		target: 'normal',
		type: "Bug",
		shortDesc: "+2 priority, but only works if the target is using a status move.",
	},
	pitchblackcrush: {
		num: 2118,
		accuracy: 95,
		basePower: 140,
		category: "Physical",
		name: "Pitch-Black Crush",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		self: { boosts: { atk: -1, spe: -1 } },
		target: 'normal',
		type: "Dark",
		shortDesc: "Lowers the user's Attack and Speed by 1.",
	},
	pompompuff: {
		num: 2119,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Pompom Puff",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onModifyMove(move, source, target) {
			if (target && target.isAlly(source) && target !== source) {
				move.category = 'Special';
			}
		},
		onTryHit(target, source, move) {
			if (!target.isAlly(source) || target === source) return;
			const healed = this.actions.getDamage(source, target, move);
			if (typeof healed === 'number') this.heal(healed, target, source, move);
			return null;
		},
		secondary: { chance: 100, boosts: { spe: -1 } },
		target: 'any',
		type: "Grass",
		shortDesc: "Foe: physical, -1 Speed. Ally: heals them for the damage it would deal.",
	},
	psycapburst: {
		num: 2120,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Psy-Cap Burst",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		ignoreDefensive: true,
		target: 'normal',
		type: "Psychic",
		shortDesc: "Ignores the target's Sp. Def stat changes.",
	},
	puffbomb: {
		num: 2121,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Puffbomb",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bullet: 1 },
		target: 'allAdjacent',
		type: "Grass",
		shortDesc: "Hits every other Pokemon on the field.",
	},
	punchkickcombo: {
		num: 2122,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		name: "Punch Kick Combo",
		pp: 15,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		multihit: 2,
		target: 'normal',
		type: "Fighting",
		shortDesc: "+1 priority; hits twice.",
	},
	puppetshow: {
		num: 2123,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Puppet Show",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onTryHit(target, source) {
			const last = source.m.previousAttack as string | undefined;
			if (!last) {
				this.add('-fail', source);
				return null;
			}
			const copy = this.dex.getActiveMove(last);
			copy.type = 'Psychic';
			this.actions.useMove(copy, source, { target });
			return null;
		},
		target: 'normal',
		type: "Psychic",
		shortDesc: "Repeats the user's previous attack as a Psychic-type move.",
	},
	quakepunch: {
		num: 2124,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Quake Punch",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		ignoreImmunity: { Ground: true },
		target: 'normal',
		type: "Ground",
		shortDesc: "Hits Pokemon that are immune to Ground moves.",
	},
	resintrap: {
		num: 2125,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Resin Trap",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		boosts: { spe: -2 },
		onHit(target, source, move) {
			target.addVolatile('trapped', source, move, 'trapper');
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "-2 Speed and the target cannot switch out or flee.",
	},
	rolereset: {
		num: 2126,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Role Reset",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1 },
		onHit(target, source) {
			const given = source.getAbility();
			const original = source.m.startingAbility as string || source.baseAbility;
			if (target.getAbility().flags['cantsuppress'] || given.flags['noentrain']) return false;
			target.setAbility(given, source);
			this.add('-ability', target, given.name, '[from] move: Role Reset');
			source.setAbility(original, source, null, true);
			source.baseAbility = this.toID(original);
			this.add('-ability', source, this.dex.abilities.get(original).name,
				'[from] move: Role Reset');
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "Gives its ability to the target and restores its own starting one.",
	},
	rolladice: {
		num: 2127,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		name: "Rolladice",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		damageCallback(pokemon) {
			return this.random(1, 7) * 20;
		},
		target: 'normal',
		type: "Psychic",
		shortDesc: "Deals a random 1-6 times 20 HP of fixed damage.",
	},
	roostingwall: {
		num: 2128,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Roosting Wall",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		heal: [1, 2],
		onHit(target) {
			target.addVolatile('roostingwall');
		},
		condition: {
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Roosting Wall');
				this.effectState.typeWas = pokemon.types;
				pokemon.setType(pokemon.types.filter(t => t !== 'Flying').length ?
					pokemon.types.filter(t => t !== 'Flying') : ['Normal']);
			},
			onAfterMove(pokemon, target, move) {
				if (move.category !== 'Status') pokemon.removeVolatile('roostingwall');
			},
			onEnd(pokemon) {
				pokemon.setType(this.effectState.typeWas as string[]);
				this.add('-end', pokemon, 'move: Roosting Wall');
			},
		},
		target: 'self',
		type: "Flying",
		shortDesc: "Heals 50%; loses its Flying type until it attacks again.",
	},
	rootambush: {
		num: 2129,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Root Ambush",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onModifyPriority(priority, source) {
			if (source.hp === source.maxhp) return priority + 1;
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "+1 priority while the user is at full HP.",
	},
	rootsnap: {
		num: 2130,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Root Snap",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: { chance: 30, boosts: { spe: -1 } },
		target: 'normal',
		type: "Grass",
		shortDesc: "30% chance to lower the target's Speed by 1.",
	},
	rumble: {
		num: 2131,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Rumble",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source) {
			// Undo the burn's halving of physical damage.
			if (source.status === 'brn') return basePower * 2;
		},
		target: 'normal',
		type: "Fighting",
		shortDesc: "Its damage is not reduced by burn.",
	},
	scenttrack: {
		num: 2132,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Scent Track",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		volatileStatus: 'scenttrack',
		condition: {
			duration: 4,
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Scent Track');
				this.effectState.source = source;
			},
			onAccuracy(accuracy, target, source) {
				if (source === this.effectState.source) return true;
				return accuracy;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Scent Track');
			},
		},
		target: 'normal',
		type: "Ground",
		shortDesc: "The user's moves cannot miss this target for 3 turns.",
	},
	scorchingsprint: {
		num: 2133,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Scorching Sprint",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		selfSwitch: true,
		onModifyPriority(priority, source) {
			// "Heated up" is the Cinder Boost charge.
			if (source.volatiles['cinderboost']) return priority + 1;
		},
		target: 'normal',
		type: "Fire",
		shortDesc: "The user switches out; +1 priority while heated up.",
	},
	seismichum: {
		num: 2134,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Seismic Hum",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: { chance: 20, volatileStatus: 'flinch' },
		target: 'allAdjacent',
		type: "Steel",
		shortDesc: "Hits every other Pokemon; 20% chance to flinch.",
	},
	sharedsuffering: {
		num: 2135,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Shared Suffering",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		onHit(target, source) {
			if (!source.status) {
				this.add('-fail', source);
				return false;
			}
			target.trySetStatus(source.status, source);
			for (const volatile of ['confusion', 'leechseed', 'fakemonbleed']) {
				if (source.volatiles[volatile]) target.addVolatile(volatile, source);
			}
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "Passes the user's status condition to the target.",
	},
	shelltoss: {
		num: 2136,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Shell Toss",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: { def: -1 } },
		target: 'normal',
		type: "Dragon",
		shortDesc: "Lowers the target's Defense by 1.",
	},
	shieldbash: {
		num: 2137,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Shield Bash",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		self: { boosts: { def: 1 } },
		target: 'normal',
		type: "Fire",
		shortDesc: "Raises the user's Defense by 1.",
	},
	shockwavejump: {
		num: 2138,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Shockwave Jump",
		pp: 5,
		priority: 0,
		flags: { contact: 1, charge: 1, mirror: 1 },
		breaksProtect: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) return;
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) return;
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		target: 'normal',
		type: "Ground",
		shortDesc: "Charges, then crashes down. Ignores protection moves.",
	},
	shortcircuit: {
		num: 2139,
		accuracy: 100,
		basePower: 55,
		category: "Special",
		name: "Short Circuit",
		pp: 15,
		priority: 1,
		flags: { protect: 1, mirror: 1 },
		volatileStatus: 'disable',
		target: 'normal',
		type: "Electric",
		shortDesc: "+1 priority; disables the target's last used move.",
	},
	slowattack: {
		num: 2140,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		name: "Slow Attack",
		pp: 10,
		priority: -3,
		flags: { contact: 1, protect: 1, mirror: 1 },
		basePowerCallback(pokemon, target, move) {
			// One multiplier for every Pokemon that already moved this turn.
			const acted = this.getAllActive().filter(p => p !== pokemon && p.moveThisTurn).length;
			return move.basePower * (acted + 1);
		},
		target: 'normal',
		type: "Fighting",
		shortDesc: "-3 priority; power multiplies by how many Pokemon moved first.",
	},
	slumberwing: {
		num: 2141,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Slumber Wing",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		sleepUsable: true,
		onAfterMove(source) {
			if (source.status === 'slp') source.cureStatus();
		},
		target: 'normal',
		type: "Flying",
		shortDesc: "Usable while asleep and wakes the user up.",
	},
	sneakattack: {
		num: 2142,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Sneak Attack",
		pp: 15,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: { chance: 100, boosts: { accuracy: -1 } },
		target: 'normal',
		type: "Fighting",
		shortDesc: "+1 priority; lowers the target's accuracy by 1.",
	},
	sonicdischarge: {
		num: 2143,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		name: "Sonic Discharge",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		self: { boosts: { spa: -2 } },
		target: 'normal',
		type: "Electric",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
	},
	sonicshielding: {
		num: 2144,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sonic Shielding",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'sonicshielding',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Sonic Shielding');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) return;
				this.add('-activate', target, 'move: Sonic Shielding');
				if (move.category === 'Special') this.boost({ spd: 1 }, target, target);
				return this.NOT_FAIL;
			},
		},
		target: 'self',
		type: "Rock",
		shortDesc: "Protects; +1 Sp. Def if it blocks a special move.",
	},
	sourscratch: {
		num: 2145,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Sour Scratch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onHit(target, source) {
			const stat = target.getStat('def', false, true) >= target.getStat('spd', false, true) ?
				'def' : 'spd';
			this.boost({ [stat]: -1 }, target, source);
		},
		target: 'normal',
		type: "Electric",
		shortDesc: "Lowers the target's higher defensive stat by 1.",
	},
	spectraltide: {
		num: 2146,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Spectral Tide",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1 },
		onModifyMove(move, source) {
			if (source.hp * 2 <= source.maxhp) move.drain = [1, 2];
		},
		target: 'normal',
		type: "Water",
		shortDesc: "Drains 50% of the damage dealt while the user is below half HP.",
	},
	spereramp: {
		num: 2147,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Spere Ramp",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, bullet: 1 },
		target: 'normal',
		type: "Ground",
		shortDesc: "A bullet move with no additional effect.",
	},
	spiceoverload: {
		num: 2148,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Spice Overload",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondaries: [
			{ chance: 100, boosts: { spd: -1, accuracy: -1 } },
			{ chance: 20, volatileStatus: 'flinch' },
		],
		target: 'normal',
		type: "Fire",
		shortDesc: "-1 Sp. Def and accuracy; 20% chance to flinch.",
	},
	splatterdash: {
		num: 2149,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Splatter Dash",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		multihit: 2,
		critRatio: 2,
		target: 'normal',
		type: "Poison",
		shortDesc: "Hits twice with a high critical hit ratio.",
	},
	sporeenvy: {
		num: 2150,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		name: "Spore Envy",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, powder: 1 },
		onHit(target, source) {
			// Steals any boosts the target picked up earlier this turn.
			const stolen = target.m.boostsThisTurn as SparseBoostsTable | undefined;
			if (stolen && Object.keys(stolen).length) {
				const drop: SparseBoostsTable = {};
				let i: BoostID;
				for (i in stolen) {
					drop[i] = -stolen[i]!;
				}
				this.boost(drop, target, source);
				this.boost(stolen, source, source);
				this.add('-message', `${source.name} stole ${target.name}'s boosts!`);
			}
			this.boost({ atk: 1 }, source, source);
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "+1 Attack; steals stat boosts the target gained earlier this turn.",
	},
	sporemilk: {
		num: 2151,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Spore Milk",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, powder: 1 },
		selfSwitch: true,
		sideCondition: 'sporemilk',
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Spore Milk');
			},
			onSwitchIn(pokemon) {
				this.heal(pokemon.maxhp / 4, pokemon);
				this.boost({ def: 1 }, pokemon, pokemon);
				pokemon.side.removeSideCondition('sporemilk');
			},
		},
		target: 'self',
		type: "Grass",
		shortDesc: "Switches out; the replacement heals 25% and gains +1 Defense.",
	},
	sprinkleshower: {
		num: 2152,
		accuracy: 95,
		basePower: 25,
		category: "Special",
		name: "Sprinkle Shower",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		multihit: [2, 5],
		target: 'normal',
		type: "Ice",
		shortDesc: "Hits 2-5 times.",
	},
	stemdrop: {
		num: 2153,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		name: "Stem Drop",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		basePowerCallback(pokemon, target) {
			const ratio = pokemon.getWeight() / Math.max(1, target.getWeight());
			if (ratio >= 5) return 120;
			if (ratio >= 4) return 100;
			if (ratio >= 3) return 80;
			if (ratio >= 2) return 60;
			return 40;
		},
		recoil: [30, 100],
		target: 'normal',
		type: "Grass",
		shortDesc: "Weight-based damage with 30% recoil.",
	},
	stirfry: {
		num: 2154,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Stir Fry",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower, source) {
			if (source.boosts.spe >= 1) return basePower * 2;
		},
		target: 'normal',
		type: "Fire",
		shortDesc: "Power doubles if the user's Speed is boosted.",
	},
	stonebeak: {
		num: 2155,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Stonebeak",
		pp: 20,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1 },
		target: 'normal',
		type: "Rock",
		shortDesc: "+1 priority.",
	},
	stonesnap: {
		num: 2156,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Stone Snap",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, bite: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch' },
		target: 'normal',
		type: "Rock",
		shortDesc: "30% chance to flinch.",
	},
	strategicdives: {
		num: 2157,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Strategic Dives",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		selfSwitch: true,
		target: 'normal',
		type: "Flying",
		shortDesc: "The user switches out after attacking.",
	},
	sugarcrush: {
		num: 2158,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		name: "Sugarcrush",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		multihit: [2, 5],
		onBasePower(basePower, source, target, move) {
			const hit = (move as any).sugarHit || 0;
			(move as any).sugarHit = hit + 1;
			return basePower + 15 * hit;
		},
		target: 'normal',
		type: "Grass",
		shortDesc: "Hits 2-5 times; each hit is stronger than the last.",
	},
	sweetclap: {
		num: 2159,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Sweet Clap",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		multihit: 2,
		secondary: { chance: 10, volatileStatus: 'flinch' },
		target: 'normal',
		type: "Fairy",
		shortDesc: "Hits twice; each hit has a 10% chance to flinch.",
	},
	sweetglaze: {
		num: 2160,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Sweet Glaze",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1 },
		onHit(target, source) {
			const ability = source.getAbility();
			if (target.getAbility().flags['cantsuppress'] || ability.flags['noentrain']) {
				return false;
			}
			target.setAbility(ability, source);
			this.add('-ability', target, ability.name, '[from] move: Sweet Glaze');
		},
		target: 'normal',
		type: "Psychic",
		shortDesc: "Replaces the target's ability with the user's.",
	},
	tailcanon: {
		num: 2161,
		accuracy: 95,
		basePower: 120,
		category: "Physical",
		name: "Tailcanon",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		target: 'normal',
		type: "Normal",
		shortDesc: "No additional effect.",
	},
	teaparty: {
		num: 2162,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Teaparty",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		onHit(target, source) {
			for (const ally of source.alliesAndSelf()) {
				this.heal(Math.floor(ally.getStat('atk') / 4), ally, source,
					this.effect);
			}
		},
		target: 'self',
		type: "Fairy",
		shortDesc: "Heals the user and its ally by 25% of their Attack stat.",
	},
	thermalascent: {
		num: 2163,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Thermal Ascent",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		heal: [1, 3],
		boosts: { spe: 1 },
		target: 'self',
		type: "Flying",
		shortDesc: "+1 Speed and heals 1/3 of the user's max HP.",
	},
	timewrap: {
		num: 2164,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Timewrap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		volatileStatus: 'timewrap',
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Timewrap');
			},
			onModifySpe(spe, pokemon) {
				return Math.max(1, 200 - pokemon.storedStats.spe);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Timewrap');
			},
		},
		target: 'normal',
		type: "Psychic",
		shortDesc: "For 5 turns the target's Speed becomes 200 minus its Speed.",
	},
	triplespin: {
		num: 2165,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		name: "Triple-Spin",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		multihit: 3,
		target: 'normal',
		type: "Fairy",
		shortDesc: "Hits three times.",
	},
	typehack: {
		num: 2166,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Type:Hack",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onEffectiveness(typeMod, target, type) {
			// Always resolves as super effective, whatever the target is.
			return 1;
		},
		ignoreImmunity: true,
		target: 'normal',
		type: "Electric",
		shortDesc: "Always super effective.",
	},
	volcaniceruption: {
		num: 2167,
		accuracy: 95,
		basePower: 120,
		category: "Special",
		name: "Volcanic Eruption",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		target: 'normal',
		type: "Fire",
		shortDesc: "No additional effect.",
	},
	volcanicshellspam: {
		num: 2168,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Volcanic Shell Spam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		overrideOffensiveStat: 'def',
		target: 'normal',
		type: "Fire",
		shortDesc: "Uses the user's Defense in place of its Attack.",
	},
	voltlick: {
		num: 2169,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Volt Lick",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		critRatio: 2,
		onHit(target, source, move) {
			if (target.getMoveHitData(move).crit) target.trySetStatus('par', source, move);
		},
		target: 'normal',
		type: "Electric",
		shortDesc: "High crit ratio; paralyses on a critical hit.",
	},
	wadrobechange: {
		num: 2170,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Wadrobe Change",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		selfSwitch: true,
		onHit(target, source) {
			source.side.addSideCondition('wadrobechange', source);
			const state = source.side.sideConditions['wadrobechange'];
			if (state) {
				state.def = source.boosts.def;
				state.spd = source.boosts.spd;
			}
		},
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Wadrobe Change');
			},
			onSwitchIn(pokemon) {
				const boosts: SparseBoostsTable = {
					def: this.effectState.def as number || 0,
					spd: (this.effectState.spd as number || 0) + 1,
				};
				this.boost(boosts, pokemon, pokemon, this.effect);
				pokemon.side.removeSideCondition('wadrobechange');
			},
		},
		target: 'self',
		type: "Ghost",
		shortDesc: "Switches out, passing its Def/Sp. Def changes plus +1 Sp. Def.",
	},
	wallbreaker: {
		num: 2171,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Wall Breaker",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		ignoreOffensive: true,
		onBasePower(basePower, source, target) {
			// Fed by the target's Defense boosts instead of the user's Attack ones.
			const stage = Math.max(0, target.boosts.def);
			return Math.floor(basePower * (1 + 0.5 * stage));
		},
		target: 'normal',
		type: "Normal",
		shortDesc: "Ignores the user's Attack boosts; stronger the more Defense the target has.",
	},
	woodbarktackle: {
		num: 2172,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Woodbark Tackle",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: { chance: 30, volatileStatus: 'flinch' },
		target: 'normal',
		type: "Grass",
		shortDesc: "30% chance to flinch.",
	},
	zestysomersault: {
		num: 2173,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Zesty Somersault",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		selfSwitch: true,
		target: 'normal',
		type: "Electric",
		shortDesc: "The user switches out after attacking.",
	},
};
