/**
 * Beta-only / repurposed moves from the Gold/Silver Spaceworld '97 demo.
 *
 * Every stat (type, base power, accuracy, PP) is transcribed from the demo's
 * move table (data/moves/moves.asm); effects follow the demo's move-effect
 * scripts (engine/battle/move_effects/*.asm). These 14 moves are the ones the
 * beta dex actually distributes via level-up or TM/HM.
 */
export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// --- plain damaging beta moves (gen-2 category is fixed by type) ---
	crosscutter: {
		num: 0, accuracy: 100, basePower: 50, category: "Physical", pp: 10, priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		name: "Cross Cutter", type: "Bug",
		shortDesc: "Beta move; became the Fighting-type Cross Chop.",
		target: "normal",
	},
	rockhead: {
		num: 0, accuracy: 100, basePower: 90, category: "Physical", pp: 10, priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		name: "Rock Head", type: "Rock", target: "normal",
	},
	strongarm: {
		num: 0, accuracy: 100, basePower: 30, category: "Physical", pp: 10, priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		name: "Strong Arm", type: "Steel", target: "normal",
	},
	uproot: {
		num: 0, accuracy: 100, basePower: 30, category: "Physical", pp: 10, priority: 0,
		flags: { protect: 1, mirror: 1 },
		name: "Uproot", type: "Normal", target: "normal",
	},
	windride: {
		num: 0, accuracy: 100, basePower: 40, category: "Physical", pp: 10, priority: 0,
		flags: { protect: 1, mirror: 1 },
		name: "Wind Ride", type: "Flying", target: "normal",
	},
	bonelock: {
		num: 0, accuracy: 100, basePower: 25, category: "Physical", pp: 10, priority: 0,
		flags: { protect: 1, mirror: 1 },
		name: "Bone Lock", type: "Ground", target: "normal",
	},
	coinhurl: {
		// EFFECT_COIN_HURL is Pay Day: the scattered coins have no in-battle effect.
		num: 0, accuracy: 100, basePower: 40, category: "Physical", pp: 10, priority: 0,
		flags: { protect: 1, mirror: 1 },
		name: "Coin Hurl", type: "Normal", target: "normal",
	},
	// --- stat-drop status beta moves ---
	tempt: {
		// EFFECT_EVASION_DOWN — became Sweet Scent.
		num: 0, accuracy: 100, basePower: 0, category: "Status", pp: 10, priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		boosts: { evasion: -1 },
		name: "Tempt", type: "Normal", target: "normal",
	},
	brightmoss: {
		// EFFECT_ACCURACY_DOWN.
		num: 0, accuracy: 100, basePower: 0, category: "Status", pp: 10, priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		boosts: { accuracy: -1 },
		name: "Bright Moss", type: "Grass", target: "normal",
	},
	megaphone: {
		// EFFECT_SP_ATK_DOWN.
		num: 0, accuracy: 85, basePower: 0, category: "Status", pp: 40, priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1 },
		boosts: { spa: -1 },
		name: "Megaphone", type: "Normal", target: "normal",
	},
	// --- status beta moves with scripted effects ---
	stalker: {
		// EFFECT_CONFUSE.
		num: 0, accuracy: 100, basePower: 0, category: "Status", pp: 10, priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		volatileStatus: "confusion",
		name: "Stalker", type: "Psychic", target: "normal",
	},
	naildown: {
		// EFFECT_NAIL_DOWN: "cut HP and put a curse on the opponent" — the beta
		// name for the slot that became Curse. Always the Ghost-curse effect,
		// regardless of the user's type.
		num: 0, accuracy: true, basePower: 0, category: "Status", pp: 10, priority: 0,
		flags: { protect: 1, mirror: 1 },
		volatileStatus: "curse",
		onHit(target, source) {
			// Beta Curse: the user pays HP to lay the curse (always the Ghost effect).
			this.directDamage(source.maxhp / 2, source, source);
		},
		name: "Nail Down", type: "Ghost", target: "normal",
	},
	bellchime: {
		// EFFECT_BELL_CHIME: became Heal Bell — cures status of the user's party.
		num: 0, accuracy: true, basePower: 0, category: "Status", pp: 10, priority: 0,
		flags: { snatch: 1, sound: 1 },
		onHit(target, source) {
			this.add('-activate', source, 'move: Bell Chime');
			let success = false;
			for (const ally of source.side.pokemon) {
				if (ally.status) { ally.cureStatus(); success = true; }
			}
			return success;
		},
		name: "Bell Chime", type: "Normal", target: "self",
	},
	synchronize: {
		// EFFECT_CONVERSION: user changes type to one of its move's types.
		num: 0, accuracy: true, basePower: 0, category: "Status", pp: 10, priority: 0,
		flags: { snatch: 1 },
		onHit(target) {
			const types = target.moveSlots
				.map(ms => this.dex.moves.get(ms.id).type)
				.filter(t => t && !target.hasType(t));
			if (!types.length) return false;
			const type = this.sample(types);
			if (!target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
		name: "Synchronize", type: "Psychic", target: "self",
	},
};
