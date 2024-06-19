import {ssbSets} from "./random-teams";
import {PSEUDO_WEATHERS, changeSet, getName} from "./scripts";
import {Teams} from '../../../sim/teams';

export const Moves: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		shortDesc: "", // short description, shows up in /dt
		desc: "", // long description
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

	// Finger
	megametronome: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mega Metronome",
		desc: "Uses three randomly selected moves.",
		pp: 8,
		priority: 0,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1},
		onHit(target, source, effect) {
			const moves = this.dex.moves.all().filter(move => (
				(![2, 4].includes(this.gen) || !source.moves.includes(move.id)) &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome']
			));
			for (let i = 0; i < 3; i++) {
				let randomMove = '';
				if (moves.length) {
					moves.sort((a, b) => a.num - b.num);
					randomMove = this.sample(moves).id;
				}
				if (!randomMove) return false;
				source.side.lastSelectedMove = this.toID(randomMove);
				this.actions.useMove(randomMove, target);
			}
		},
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	// Finger
	fearthefinger: {
		accuracy: true,
		basePower: 50,
		category: "Physical",
		name: "Fear the Finger",
		desc: "Increased power for each time this Pokemon has used Metronome since switching in. Breaks through protection.",
		shortDesc: "+40BP/time Metronome used. Breaks protection.",
		pp: 1,
		priority: 0,
		flags: {},
		breaksProtect: true,
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Searing Shot', target);
		},
		isZ: "mattermirror",
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	// Pablo
	plagiarize: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Replaces this move with target's last move. Lowers that move's PP to 0.",
		name: "Plagiarize",
		gen: 9,
		pp: 16,
		priority: 0,
		// Sketch
		onHit(target, source) {
			const move = target.lastMove;
			if (source.transformed || !move || source.moves.includes(move.id)) return false;
			if (move.isZ || move.isMax) return false;
			const index = source.moves.indexOf('plagiarize');
			if (index < 0) return false;
			const sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[index] = sketchedMove;
			source.baseMoveSlots[index] = sketchedMove;
			this.add('-activate', source, 'move: Plagiarize', move.name);
		},
		// PP Nullification
		onTryHit(target) {
			let move: Move | ActiveMove | null = target.lastMove;
			if (!move || move.isZ) return false;
			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
			const ppDeducted = target.deductPP(move.id, 64);
			if (!ppDeducted) return false;
			this.add("-activate", target, 'move: Plagiarize', move.name, ppDeducted);
		},
		flags: {},
		target: "normal",
		type: "Normal",
	},
	// Pablo
	sketchbook: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sketchbook",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {},
		onHit(target, source) {
			let i: BoostID;
			for (i in target.boosts) {
				source.boosts[i] = target.boosts[i];
			}
			this.add('-copyboost', source, target, '[from] move: Sketchbook');
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	// Trey
	burstdelta: {
		accuracy: true,
		basePower: 80,
		category: "Physical",
		desc: "User heals equal to 1/3 of damage dealt and lowers target's Defense by 1 stage but this move cannot be used twice in a row.",
		shortDesc: "Heal 1/3 damage and lower Defense by 1 stage but can't use twice in a row.",
		name: "Burst Delta",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {mirror: 1, protect: 1, cantusetwice: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Thousand Arrows', target);
		},
		drain: [1, 3],
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Flying",
	},
	// Trey
	granddelta: {
		accuracy: true,
		basePower: 110,
		category: "Physical",
		desc: "User heals equal to half of damage dealt and lowers target's Defense by 1 stage. This move hits again next turn for half damage.",
		shortDesc: "Heal 1/2 damage and lower Defense by 1 stage; hits again next turn for 0.5x damage.",
		name: "Grand Delta",
		gen: 9,
		pp: 1,
		priority: 0,
		isZ: "yoichisbow",
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Splintered Stormshards', target);
		},
		onTry(source, target) {
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 2,
				move: 'granddelta',
				moveData: {
					id: 'granddelta',
					name: 'Grand Delta',
					accuracy: true,
					basePower: 55,
					category: "Physical",
					priority: 0,
					flags: {},
					secondary: {
						chance: 100,
						boosts: {
							def: -1,
						},
					},
					drain: [1, 2],
					effectType: 'Move',
					type: 'Flying',
				},
			});
			this.add('-start', source, 'move: Grand Delta');
		},
		drain: [1, 2],
		flags: {},
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Flying",
	},
	// Trey
	dynamitearrow: {
		accuracy: true,
		basePower: 50,
		category: "Physical",
		desc: "This move will connect one turn later.",
		shortDesc: "Lands 1 turn after.",
		name: "Dynamite Arrow",
		gen: 9,
		pp: 40,
		priority: 0,
		flags: {mirror: 1, protect: 1, futuremove: 1},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Searing Shot', target);
		},
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				duration: 2,
				move: 'dynamitearrow',
				source: source,
				moveData: {
					id: 'dynamitearrow',
					name: "Dynamite Arrow",
					accuracy: true,
					basePower: 50,
					category: "Physical",
					priority: 0,
					flags: {futuremove: 1},
					effectType: 'Move',
					type: 'Fire',
				},
			});
			this.add('-start', source, 'move: Dynamite Arrow');
			return this.NOT_FAIL;
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Yukari Yakumo
	gap: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "User and target switch to a random ally.",
		name: "Gap",
		gen: 9,
		pp: 5,
		priority: -6,
		flags: {bypasssub: 1, noassist: 1, failcopycat: 1},
		forceSwitch: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dark Void', target);
		},
		onHit(target, source, move) {
			if (source.forceSwitchFlag) return;
			source.forceSwitchFlag = true;
		},
		target: "normal",
		type: "Psychic",
	},
};
