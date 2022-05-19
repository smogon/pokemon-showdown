export const Items: {[k: string]: ModdedItemData} = {
	// Brookeee
	ramen: {
		name: "Ramen",
		spritenum: 22,
		fling: {
			basePower: 10,
		},
		onUpdate(pokemon) {
			pokemon.eatItem();
		},
		onEat(pokemon) {
			this.boost({spe: 1});
			pokemon.addVolatile('focusenergy');
		},
		gen: 8,
		desc: "Raises Speed by 1 stage and critical hit ratio by 2 stages. Single use.",
	},

	// Horrific17
	horrifiumz: {
		name: "Horrifium Z",
		spritenum: 632,
		onTakeItem: false,
		zMove: "Final Trick",
		zMoveFrom: "Meteor Charge",
		itemUser: ["Arcanine"],
		gen: 8,
		desc: "If held by an Arcanine with Meteor Charge, it can use Final Trick.",
	},

	// Mayie
	lunchbox: {
		spritenum: 242,
		fling: {
			basePower: 10,
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
		},
		gen: 8,
		desc: "At the end of every turn, holder restores 1/16 of its max HP.",
	},

	// flufi
	heroicmedallion: {
		name: "Heroic Medallion",
		spritenum: 251,
		fling: {
			basePower: 80,
			status: 'par',
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.flags['contact']) {
				return this.chainModify(2);
			}
		},
		gen: 8,
		desc: "Holder's contact moves have 3x power.",
	},
};
