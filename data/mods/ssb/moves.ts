import {getName} from './conditions';
import {changeSet, changeMoves} from "./abilities";
import {ssbSets} from "./random-teams";

export const Moves: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
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
	// Please keep sets organized alphabetically based on staff member name!
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
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Close Combat', target);
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},

	// El Capitan
	tenaciousrush: {
		accuracy: true,
		basePower: 0,
		category: "Physical",
		desc: "More power the less HP the user has left. Super effective on Fairy.",
		shortDesc: "Power increases with lower HP. S.E vs. Fairy.",
		name: "Tenacious Rush",
		gen: 8,
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Draco Meteor', source);
			this.add('-anim', source, 'Dragon Rush', target);
		},
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
	
	// flufi
	cranberrycutter: {
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		desc: "High critical hit ratio. 20% chance to confuse target.",
		shortDesc: "High crit ratio; 20% chance to confuse.",
		name: "Cranberry Cutter",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Topsy Turvy', target);
			this.add('-anim', source, 'Psychic', target);
			this.add('-anim', source, 'Sky Drop', target);
		},
		critRatio: 2,
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "Normal",
		type: "Psychic",
	},

	// Genwunner
	psychicbind: {
		accuracy: 70,
		basePower: 20,
		category: "Special",
		desc: "Traps the opponent for 4-5 turns; 100% chance to flinch.",
		shortDesc: "Traps foe for 4-5 turns; 100% flinch.",
		name: "Psychic Bind",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
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
		flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		weather: 'sunnyday',
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Flare Blitz', target);
			this.add(`c| Horrific17|Pick a God and pray!`);
		},
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
		desc: "Causes intense sunlight for 5 turns; burns and traps target for 4-5 turns.",
		shortDesc: "Sunlight; burns and traps target.",
		name: "Final Trick",
		gen: 8,
		pp: 1,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		isZ: "horrifiumz",
		status: 'brn',
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Extreme Evoboost', source);
			this.add('-anim', source, 'Flare Boost', target);
		},
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

	// LandoriumZ
	crossdance: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "User is confused after use.",
		shortDesc: "Confuses user.",
		name: "Cross Dance",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
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
		onTryMove() {
			this.attrLastMove('[still]');
		},
		status: 'tox',
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
	
	// Minimind
	megametronome: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mega Metronome",
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
		type: "Normal",
		contestType: "Cool",
	},

	// Omega
	wavecannon: {
		accuracy: true,
		basePower: 0,
		category: "Special",
		desc: "Deals 1/3 of max HP; prevents healing.",
		shortDesc: "Deals 1/3 mHP; prevents healing.",
		name: "Wave Cannon",
		gen: 8,
		pp: 15,
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
		flags: {contact: 1, protect: 1, mirror: 1},
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
};
