'use strict';

exports.BattleMovedex = {
	allyswitch: {
		inherit: true,
		desc: "The user swaps positions with its ally on the opposite side of the field. Fails if there is no Pokemon at that position, if the user is the only Pokemon on its side, or if the user is in the middle.",
		shortDesc: "Switches position with the ally on the far side.",
		priority: 1,
	},
	brickbreak: {
		inherit: true,
		desc: "If this attack does not miss, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated.",
	},
	darkvoid: {
		inherit: true,
		accuracy: 80,
	},
	diamondstorm: {
		inherit: true,
		desc: "Has a 50% chance to raise the user's Defense by 1 stage.",
		shortDesc: "50% chance to raise user's Def by 1 for each hit.",
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
	},
	fellstinger: {
		inherit: true,
		basePower: 30,
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function (pokemon, target, move) {
				if (!target || target.fainted || target.hp <= 0) this.boost({atk:2}, pokemon, pokemon, move);
				pokemon.removeVolatile('fellstinger');
			},
		},
	},
	flyingpress: {
		inherit: true,
		basePower: 80,
	},
	leechlife: {
		inherit: true,
		basePower: 20,
		pp: 15,
	},
	mysticalfire: {
		inherit: true,
		basePower: 65,
	},
	paraboliccharge: {
		inherit: true,
		basePower: 50,
	},
	suckerpunch: {
		inherit: true,
		basePower: 80,
	},
	swagger: {
		inherit: true,
		accuracy: 90,
	},
	tackle: {
		inherit: true,
		basePower: 50,
	},
	thunderwave: {
		inherit: true,
		accuracy: 100,
	},
	watershuriken: {
		inherit: true,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
	},
};
