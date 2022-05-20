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

	// El Capitan
	assaulthelmet: {
		name: "Assault Helmet",
		fling: {
			basePower: 100,
		},
		onCriticalHit: false,
		gen: 8,
		desc: "Holder cannot be struck by a critical hit.",
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
};
