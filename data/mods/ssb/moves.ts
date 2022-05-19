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
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onModifyCritRatio(boosts, critRatio) {
			if (boosts['atk'] >= 2) return critRatio + Math.floor(boosts['atk'] / 2);
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Close Combat', target);
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
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
		basePower: 50,
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
		weather: 'sunnyday',
		status: 'brn',
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Extreme Evoboost', source);
			this.add('-anim', source, 'Flare Boost', target);
		},
		onHit(target) {
			this.actions.useMove('Magma Storm', target);
		},
		secondary: null,
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
		onHit(target, source, move) {
			this.add('-activate', source, 'move: Sacred Penance');
			let success = false;
			const allies = [...source.side.pokemon, ...source.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		onAfterMove(pokemon) {
			this.heal(pokemon.maxhp);
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
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
