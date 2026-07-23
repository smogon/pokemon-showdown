/**
 * Beta-only / repurposed moves from the Gold/Silver Spaceworld '97 demo.
 *
 * Every stat (type, base power, accuracy, PP) is transcribed from the demo's
 * move table (data/moves/moves.asm); effects follow the demo's move-effect
 * scripts (engine/battle/move_effects/*.asm and data/moves/effects.asm). These
 * are the beta-only move slots the beta dex distributes via level-up or TM/HM.
 *
 * The block between the AUTO-GENERATED markers below is (re)written by
 * tools/sw97-gen.js: stat-only `inherit` overrides that make the standard Gen 2
 * moves serve the demo's 1997 values (data files may not import, so the tool
 * splices them in here rather than into a shared module). Edit those in the
 * generator; edit the hand-written beta moves directly.
 */
export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// === AUTO-GENERATED standard-move overrides (tools/sw97-gen.js) — do not edit below ===
	karatechop: {
		inherit: true,
		type: "Normal",
	},
	scratch: {
		inherit: true,
		pp: 30,
	},
	whirlwind: {
		inherit: true,
		accuracy: 85,
	},
	sandattack: {
		inherit: true,
		type: "Normal",
	},
	doubleedge: {
		inherit: true,
		basePower: 100,
	},
	bite: {
		inherit: true,
		type: "Normal",
		category: "Physical",
	},
	blizzard: {
		inherit: true,
		accuracy: 90,
	},
	rockthrow: {
		inherit: true,
		accuracy: 65,
	},
	struggle: {
		inherit: true,
		pp: 0,
	},
	triplekick: {
		inherit: true,
		accuracy: 100,
	},
	mindreader: {
		inherit: true,
		pp: 10,
	},
	nightmare: {
		inherit: true,
		pp: 10,
	},
	flamewheel: {
		inherit: true,
		pp: 10,
	},
	snore: {
		inherit: true,
		pp: 10,
	},
	flail: {
		inherit: true,
		pp: 10,
	},
	conversion2: {
		inherit: true,
		pp: 15,
	},
	cottonspore: {
		inherit: true,
		accuracy: 100,
		pp: 10,
	},
	reversal: {
		inherit: true,
		pp: 10,
	},
	spite: {
		inherit: true,
		pp: 5,
	},
	powdersnow: {
		inherit: true,
		pp: 10,
	},
	machpunch: {
		inherit: true,
		pp: 15,
	},
	scaryface: {
		inherit: true,
		accuracy: 85,
		pp: 40,
	},
	faintattack: {
		inherit: true,
		pp: 10,
	},
	sweetkiss: {
		inherit: true,
		accuracy: 100,
	},
	mudslap: {
		inherit: true,
		type: "Normal",
	},
	octazooka: {
		inherit: true,
		accuracy: 100,
	},
	spikes: {
		inherit: true,
		type: "Normal",
		pp: 10,
	},
	foresight: {
		inherit: true,
		pp: 10,
	},
	perishsong: {
		inherit: true,
		pp: 10,
	},
	detect: {
		inherit: true,
		type: "Normal",
		pp: 10,
	},
	lockon: {
		inherit: true,
		pp: 10,
	},
	outrage: {
		inherit: true,
		pp: 10,
	},
	gigadrain: {
		inherit: true,
		pp: 10,
	},
	charm: {
		inherit: true,
		accuracy: 85,
		pp: 40,
	},
	falseswipe: {
		inherit: true,
		pp: 20,
	},
	swagger: {
		inherit: true,
		accuracy: 100,
		pp: 10,
	},
	furycutter: {
		inherit: true,
		accuracy: 100,
	},
	steelwing: {
		inherit: true,
		accuracy: 100,
		pp: 10,
	},
	attract: {
		inherit: true,
		pp: 10,
	},
	return: {
		inherit: true,
		pp: 10,
	},
	present: {
		inherit: true,
		accuracy: 100,
		pp: 10,
	},
	frustration: {
		inherit: true,
		pp: 10,
	},
	safeguard: {
		inherit: true,
		pp: 10,
	},
	painsplit: {
		inherit: true,
		pp: 5,
	},
	sacredfire: {
		inherit: true,
		basePower: 80,
		accuracy: 100,
		pp: 10,
	},
	magnitude: {
		inherit: true,
		pp: 10,
	},
	dynamicpunch: {
		inherit: true,
		accuracy: 100,
		pp: 10,
	},
	dragonbreath: {
		inherit: true,
		basePower: 40,
		pp: 10,
	},
	batonpass: {
		inherit: true,
		pp: 10,
	},
	encore: {
		inherit: true,
		pp: 10,
	},
	pursuit: {
		inherit: true,
		type: "Normal",
		category: "Physical",
		pp: 10,
	},
	rapidspin: {
		inherit: true,
		pp: 10,
	},
	irontail: {
		inherit: true,
		basePower: 60,
		accuracy: 100,
		pp: 10,
	},
	vitalthrow: {
		inherit: true,
		basePower: 50,
	},
	morningsun: {
		inherit: true,
		pp: 10,
	},
	synthesis: {
		inherit: true,
		pp: 10,
	},
	moonlight: {
		inherit: true,
		pp: 10,
	},
	twister: {
		inherit: true,
		basePower: 60,
		pp: 10,
	},
	raindance: {
		inherit: true,
		type: "Normal",
		pp: 10,
	},
	sunnyday: {
		inherit: true,
		type: "Normal",
		pp: 10,
	},
	whirlpool: {
		inherit: true,
		basePower: 30,
		accuracy: 100,
		pp: 10,
	},
	// === END AUTO-GENERATED standard-move overrides ===
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
	watersport: {
		// A Water-type EFFECT_NORMAL_HIT slot — nothing like the later Water Sport.
		// Water is a special type in Gen 2, so this is a special attack.
		num: 0, accuracy: 100, basePower: 30, category: "Special", pp: 10, priority: 0,
		flags: { protect: 1, mirror: 1 },
		name: "Water Sport", type: "Water", target: "normal",
	},
	bounce: {
		// A Water-type EFFECT_NORMAL_HIT slot with a placeholder 0 base power —
		// unrelated to the Flying-type Bounce introduced later.
		num: 0, accuracy: 100, basePower: 0, category: "Special", pp: 10, priority: 0,
		flags: { protect: 1, mirror: 1 },
		name: "Bounce", type: "Water", target: "normal",
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
		// EFFECT_NAIL_DOWN (data/moves/effects.asm `NailDown:` is a pure status
		// script — no checkhit/damagecalc, so the table's 40 BP is vestigial). It
		// always lays the Ghost curse regardless of the user's type. The engine
		// script calls GetQuarterMaxHP, so the user pays a QUARTER of its max HP.
		num: 0, accuracy: true, basePower: 0, category: "Status", pp: 10, priority: 0,
		flags: { protect: 1, mirror: 1 },
		volatileStatus: "curse",
		onHit(target, source) {
			this.directDamage(Math.floor(source.maxhp / 4), source, source);
		},
		name: "Nail Down", type: "Ghost", target: "normal",
	},
	bellchime: {
		// EFFECT_BELL_CHIME (engine/battle/move_effects/bell_chime.asm): the beta
		// version clears only the USER's status byte and its Nightmare substatus —
		// it is not yet the party-wide Heal Bell.
		num: 0, accuracy: true, basePower: 0, category: "Status", pp: 10, priority: 0,
		flags: { snatch: 1, sound: 1 },
		onHit(target) {
			if (!target.status && !target.volatiles['nightmare']) return false;
			this.add('-activate', target, 'move: Bell Chime');
			target.cureStatus();
			target.removeVolatile('nightmare');
		},
		name: "Bell Chime", type: "Normal", target: "self",
	},
	synchronize: {
		// EFFECT_CONVERSION (engine/battle/move_effects/conversion.asm): "Works as
		// in Gen 1: copies the opponent's types to the user." Not the Gen 2 Porygon
		// Conversion (which changes the user to one of its own moves' types).
		num: 0, accuracy: true, basePower: 0, category: "Status", pp: 10, priority: 0,
		flags: {},
		onHit(target, source) {
			const types = target.getTypes();
			if (!types.length || source.getTypes().join() === types.join()) return false;
			if (!source.setType(types)) return false;
			this.add('-start', source, 'typechange', types.join('/'));
		},
		name: "Synchronize", type: "Psychic", target: "normal",
	},
};
