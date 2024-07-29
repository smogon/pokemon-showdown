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
};
