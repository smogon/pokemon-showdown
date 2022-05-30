import {getName} from './conditions';
import {changeSet, changeMoves} from "./abilities";
import {ssbSets} from "./random-teams";

export const Moves: {[k: string]: ModdedMoveData} = {
	// A Resident No-Life
	risingsurge: {
		accuracy: true,
		basePower: 30,
		basePowerCallback(pokemon, target, move) {
			return move.basePower + 30 * pokemon.positiveBoosts();
		},
		category: "Physical",
		desc: "+30 power for each of the user's stat boosts.",
		shortDesc: "+30 BP for each of user's boosts.",
		name: "Rising Surge",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {contact: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Play Rough', target);
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	
	// Brookeee
	masochism: {
		accuracy: true,
		basePower: 80,
		category: "Physical",
		desc: "This move is more likely to become a critical hit the higher the user's Attack stage is.",
		shortDesc: "Crit rate increases in proportion to user's Attack stage.",
		name: "Masochism",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {contact: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Close Combat', target);
		},
		onModifyCritRatio(boosts, critRatio) {
			if (boosts['atk'] >= 1) return critRatio + boosts['atk'];
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},

	// El Capitan
	tenaciousrush: {
		accuracy: true,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const ratio = pokemon.hp * 48 / pokemon.maxhp;
			if (ratio < 2) {
				return 200;
			}
			if (ratio < 5) {
				return 150;
			}
			if (ratio < 10) {
				return 120;
			}
			if (ratio < 17) {
				return 100;
			}
			if (ratio < 33) {
				return 80;
			}
			return 60;
		},
		category: "Physical",
		desc: "This move has more base power the less HP the user has left; damages Fairy.",
		shortDesc: "More BP the less HP the user has left; damages Fairy.",
		name: "Tenacious Rush",
		gen: 8,
		pp: 5,
		priority: 0,
		flags: {contact: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Draco Meteor', source);
			this.add('-anim', source, 'Dragon Rush', target);
		},
		onModifyMove(move, pokemon) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Dragon'] = true;
			}
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
	},
	
	// Finger
	megametronome: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mega Metronome",
		desc: "Picks and uses 3 random consecutive moves.",
		shortDesc: "Uses 3 random moves.",
		pp: 10,
		priority: 0,
		flags: {},
		noMetronome: [
			"After You", "Assist", "Aura Wheel", "Baneful Bunker", "Beak Blast", "Belch", "Bestow", "Celebrate", "Clangorous Soul", "Copycat", "Counter", "Covet", "Crafty Shield", "Decorate", "Destiny Bond", "Detect", "Endure", "Eternabeam", "False Surrender", "Feint", "Focus Punch", "Follow Me", "Freeze Shock", "Helping Hand", "Hold Hands", "Hyperspace Fury", "Hyperspace Hole", "Ice Burn", "Instruct", "King's Shield", "Light of Ruin", "Mat Block", "Me First", "Metronome", "Mimic", "Mirror Coat", "Mirror Move", "Obstruct", "Overdrive", "Photon Geyser", "Plasma Fists", "Precipice Blades", "Protect", "Pyro Ball", "Quash", "Quick Guard", "Rage Powder", "Relic Song", "Secret Sword", "Shell Trap", "Sketch", "Sleep Talk", "Snap Trap", "Snarl", "Snatch", "Snore", "Spectral Thief", "Spiky Shield", "Spirit Break", "Spotlight", "Struggle", "Switcheroo", "Transform", "Wide Guard",
		],
		onHit(target, source, effect) {
			const moves = this.dex.moves.all().filter(move => (
				(![2, 4].includes(this.gen) || !source.moves.includes(move.id)) &&
				!move.realMove && !move.isZ && !move.isMax &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				!effect.noMetronome!.includes(move.name)
			));
			let randomMove = '';
			let randomMove2 = '';
			let randomMove3 = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
				randomMove2 = this.sample(moves).id;
				randomMove3 = this.sample(moves).id;
			}
			if (!randomMove || !randomMove2 || !randomMove3) return false;
			this.actions.useMove(randomMove, target);
			this.actions.useMove(randomMove2, target);
			this.actions.useMove(randomMove3, target);
		},
		secondary: null,
		target: "self",
		type: "Fairy",
		contestType: "Cool",
	},
	
	// flufi
	cranberrycutter: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "This move will critically hit; confuses the target.",
		shortDesc: "Critical; confuse.",
		name: "Cranberry Cutter",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {contact: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Topsy Turvy', target);
			this.add('-anim', source, 'Psychic', target);
			this.add('-anim', source, 'Sky Drop', target);
		},
		critRatio: 5,
		volatileStatus: 'confusion',
		secondary: null,
		target: "Normal",
		type: "Psychic",
	},

	// Genwunner
	psychicbind: {
		accuracy: 75,
		basePower: 40,
		category: "Special",
		desc: "Traps the target for 4-5 turns; 100% chance to flinch.",
		shortDesc: "Partially traps target; 100% flinch.",
		name: "Psychic Bind",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Psychic', target);
		},
		volatileStatus: 'partiallytrapped',
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Psychic",
	},

	// Horrific17
	meteorcharge: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Causes intense sunlight for 5 turns; has 33% recoil.",
		shortDesc: "Sunlight; 33% recoil.",
		name: "Meteor Charge",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {contact: 1, defrost: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Flare Blitz', target);
		},
		weather: 'sunnyday',
		recoil: [33, 100],
		secondary: null,
		target: "normal",
		type: "Fire",
	},

	// Horrific17
	finaltrick: {
		accuracy: true,
		basePower: 150,
		category: "Physical",
		desc: "Causes Desolate Land permanently; burns and traps target for 4-5 turns.",
		shortDesc: "Desolate Land; burns and partially traps target.",
		name: "Final Trick",
		gen: 8,
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Extreme Evoboost', source);
			this.add('-anim', source, 'Flare Boost', target);
		},
		isZ: "horrifiumz",
		status: 'brn',
		self: {
			onHit(source) {
				this.field.setWeather('desolateland');
			},
		},
		secondary: {
    		volatileStatus: 'partiallytrapped',
		},
		target: "normal",
		type: "Fire",
	},
	
	// Kaiser Dragon
	ultima: {
		accuracy: true,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			return move.basePower + 5 * pokemon.positiveBoosts();
		},
		category: "Special",
		desc: "This move's type is the same as user's; boosts Special Attack and Speed by 1 stage; +5 power for each boost.",
		shortDesc: "Same type as user's; boosts SpA and Spe by 1; +5 BP per boost.",
		name: "Ultima",
		gen: 8,
		pp: 40,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Explosion', target);
		},
		onModifyType(move, pokemon, target) {
			move.type = pokemon.types[0];
		},
		self: {
			boosts: {
				spa: 1,
				spe: 1,
			},
		},
		secondary: null,
		target: "normal",
		type: "???"
	},

	// LandoriumZ
	crossdance: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "This move confuses the user.",
		shortDesc: "Confuses user.",
		name: "Cross Dance",
		pp: 15,
		priority: 0,
		flags: {contact: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Cross Poison', target);
		},
		self: {
			volatileStatus: 'confusion',
		},
		secondary: null,
		target: "normal",
		type: "Poison",
	},

	// Mayie
	sacredpenance: {
		accuracy: true,
		basePower: 120,
		category: "Special",
		desc: "User fully restores HP; cures the user's party of all status conditions; badly poisons the target.",
		shortDesc: "+100% HP; cures party's status; badly poisons.",
		name: "Sacred Penance",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {heal: 1},
		status: 'tox',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Oblivion Wing', target);
		},
		onAfterMove(pokemon) {
			this.heal(pokemon.maxhp);
		},
		self: {
			onHit(pokemon, source, move) {
				this.add('-activate', source, 'move: Sacred Penance');
				for (const ally of source.side.pokemon) {
					ally.cureStatus();
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},

	// Mink the Putrid
	madtoxin: {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Mad Toxin",
		desc: "Very badly poisons the target; ignores typing and protection.",
		shortDesc: "Very badly poisons regardless of typing or protection.",
		pp: 10,
		priority: 0,
		flags: {bypasssub: 1, snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Agility', source);
			this.add('-anim', source, 'Gunk Shot', target);
		},
		status: 'badtox',
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},

	// Mirāju
	illusiveenergy: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Illusive Energy",
		desc: "The user's Special Attack becomes double the user's current HP the moment this move was used.",
		shortDesc: "User's SpA = 2x current HP.",
		pp: 5,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hypnosis', source);
		},
		volatileStatus: 'illusiveenergy',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Illusive Energy');
				const newspa = pokemon.hp * 2;
				pokemon.storedStats.spa = newspa;
			},
			onCopy(pokemon) {
				const newspa = pokemon.hp * 2;
				pokemon.storedStats.spa = newspa;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Illusive Energy');
				const newspa = pokemon.hp * 2;
				pokemon.storedStats.spa = newspa;
			},
			onRestart(pokemon) {
				pokemon.removeVolatile('Illusive Energy');
			},
		},
		secondary: null,
		target: "self",
		type: "Ghost",
		contestType: "Clever",
	},

	// Omega
	wavecannon: {
		accuracy: true,
		basePower: 0,
		category: "Special",
		desc: "Deals 1/3 of the target's max HP; prevents the target from healing.",
		shortDesc: "Deals 1/3 HP; prevents healing.",
		name: "Wave Cannon",
		gen: 8,
		pp: 5,
		priority: 0,
		flags: {bypasssub: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hyper Beam', target);
		},
		onHit(target) {
			this.directDamage(Math.ceil(target.maxhp / 3));
		},
		volatileStatus: 'healblock',
		ignoreAbility: true,
		secondary: null,
		target: "normal",
		type: "Steel",
	},

	// Rusty
	screamofthefallen: {
		accuracy: true,
		basePower: 0,
		category: "Special",
		name: "Scream of the Fallen",
		desc: "Randomly ranges from 40 to 80 power. Power is doubled if foe is asleep, and wakes them. Lowers Speed, Attack, and Special Attack by 1.",
		shortDesc: "40-80 BP; x2 power if asleep, wakes foe; -1 Spe/Atk/SpA.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hex', source);
			this.add('-anim', source, 'Boomburst', target);
		},
		onModifyMove(move, pokemon, target) {
			const rand = this.random(15);
			if (rand < 2) {
				move.basePower = 40;
			} else if (rand < 6) {
				move.basePower = 50;
			} else if (rand < 9) {
				move.basePower = 60;
			} else if (rand < 12) {
				move.basePower = 70;
			} else {
				move.basePower = 80;
			}
		},
		onBasePower(basePower, source, target, move) {
			if (target.status === 'slp') {
				return this.chainModify(2);
			}
		},
		onHit(target) {
			if (target.status === 'slp') target.cureStatus();
		},
		boosts: {
			spe: -1,
			atk: -1,
			spa: -1,
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	
	// Satori
	terrifyinghypnotism: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "This move flinches and Mind Readers the target, then becomes one of six signature moves depending on the target's type.",
		shortDesc: "Flinches and Mind Readers; new sig depending on type.",
		name: "Terrifying Hypnotism",
		gen: 8,
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {bypasssub: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hypnosis', target);
			this.add('-anim', source, 'Mind Reader', target);
		},
		onHit(target, source) {
			let move = 'Flare Blitz';
			/*
			if (target.types[0] === "Normal" || target.types[0] === "Rock" || target.types[0] === "Steel") {
				move = "Mt. Togakushi Toss";
			}
			else if (target.types[0] === "Fighting" || target.types[0] === "Bug" || target.types[0] === "Grass") {
				move = "Torii Whorl-Wind";
			}
			else if (target.types[0] === "Flying" || target.types[0] === "Electric" || target.types[0] === "Ice") {
				move = "Straw Doll Kamikaze";
			}
			else if (target.types[0] === "Poison" || target.types[0] === "Ground" || target.types[0] === "Fire") {
				move = "Trauma in the Glimmering Depths";
			}
			else if (target.types[0] === "Water" || target.types[0] === "Dragon" || target.types[0] === "Dark") {
				move = "Philosopher's Stone";
			}
			else {
				move = "Border of Wave and Particle";
			}
			*/
			const newMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[3] = newMove;
			source.baseMoveSlots[3] = newMove;
			this.add('-activate', source, 'move: Terrifying Hypnotism', move.name);
		},
		volatileStatus: 'flinch',
		ignoreAbility: true,
		secondary: {
			chance: 100,
			volatileStatus: 'lockon',
		},
		target: "normal",
		type: "Normal",
	},
	
	// Satori
	mttogakushitoss: {
		accuracy: 80,
		basePower: 120,
		category: "Special",
		desc: "This move raises the user's critical hit ratio by 2.",
		shortDesc: "Raises critical hit ratio by 2.",
		name: "Mt. Togakushi Toss",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Focus Blast', target);
		},
		self: {
			volatileStatus: 'focusenergy',
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
	
	// Satori
	toriiwhorlwind: {
		accuracy: 80,
		basePower: 120,
		category: "Special",
		desc: "This move doubles the user's allies' speed for 4 turns.",
		shortDesc: "2x speed for allies for 4 turns.",
		name: "Torii Whorl-Wind",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hurricane', target);
		},
		self: {
			sideCondition: 'tailwind',
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},
	
	// Satori
	strawdollkamikaze: {
		accuracy: 80,
		basePower: 120,
		category: "Special",
		desc: "This move burns the target.",
		shortDesc: "Burns target.",
		name: "Straw Doll Kamikaze",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Explosion', target);
		},
		status: 'brn',
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	
	// Satori
	traumaintheglimmeringdepths: {
		accuracy: 80,
		basePower: 120,
		category: "Special",
		desc: "This move traps the target.",
		shortDesc: "Traps target.",
		name: "Trauma in the Glimmering Depths",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Whirlpool', target);
		},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Water",
	},
	
	// Satori
	philosophersstone: {
		accuracy: 80,
		basePower: 120,
		category: "Special",
		desc: "This move sets up Misty Terrain.",
		shortDesc: "Sets up Misty Terrain.",
		name: "Philosopher's Stone",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Moonblast', target);
		},
		terrain: 'psychicterrain',
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	
	// Satori
	borderofwaveandparticle: {
		accuracy: 80,
		basePower: 120,
		category: "Special",
		desc: "This move curses the target.",
		shortDesc: "Curses target.",
		name: "Border of Wave and Particle",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Shadow Ball', target);
		},
		volatileStatus: 'curse',
		secondary: null,
		target: "normal",
		type: "Ghost",
	},

	// SunDraco
	einsol: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "This Pokemon attacks for 2-3 turns and is then confused afterwards.",
		shortDesc: "Lasts 2-3 turns; confuses user afterwards.",
		name: "Ein Sol",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {contact: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Outrage', target);
		},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove(pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		secondary: null,
		target: "randomNormal",
		type: "Normal",
	},
	
	// Tonberry
	karma: {
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "This move additionally hits the target once for each fainted ally of the user's.",
		shortDesc: "Extra hit per fainted ally.",
		name: "Karma",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {contact: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Shadow Punch', target);
		},
		onModifyMove(move, pokemon) {
			move.multihit = 7 - pokemon.side.pokemonLeft;
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	
	// Yuuka Kazami
	teradrain: {
		accuracy: true,
		basePower: 100,
		category: "Special",
		desc: "Recovers damage dealt; causes Grassy Terrain and Leech Seed; gives the target Magnet Rise; cures status ailments.",
		shortDesc: "Recovers damage; Grassy Terrain & Leech Seed; gives target Magnet Rise; cures status.",
		name: "Tera Drain",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {defrost: 1, heal: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Giga Drain', target);
		},
		self: {
			onHit(pokemon) {
				pokemon.cureStatus();
			},
		},
		volatileStatus: 'leechseed',
		terrain: 'grassyterrain',
		drain: 1,
		secondary: {
			chance: 100,
			volatileStatus: 'magnetrise',
		},
		target: "normal",
		type: "Grass",
	},
};
