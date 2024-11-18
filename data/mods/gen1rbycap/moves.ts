export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	sugarrush: {
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		shortDesc: "33% Chance to lower the foe's Special.",
		name: "Sugar Rush",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Play Rough", target);
		},
		secondary: {
			chance: 33,
			boosts: {
				spa: -1,
				spd: -1,
			},
		},
		target: "normal",
		type: "Poison",
		contestType: "Cute",
	},
	marblefist: {
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		shortDesc: "Usually moves first.",
		name: "Marble Fist",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Meteor Mash", target);
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	camouflage: {
		num: 293,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		shortDesc: "Hides on turn 1, strikes turn 2.",
		name: "Camouflage",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Leaf Blade", target);
		},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile('twoturnmove')) {
				attacker.removeVolatile('invulnerability');
				return;
			}
			this.add('-prepare', attacker, move.name);
			attacker.addVolatile('twoturnmove', defender);
			attacker.addVolatile('invulnerability', defender);
			return null;
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
		gen: 1,
	},
	icicle: {
		accuracy: 100,
		basePower: 70,
		category: "Special",
		shortDesc: "High critical hit ratio.",
		name: "Icicle",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, metronome: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Icicle Crash", target);
		},
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Cool",
	},
};
