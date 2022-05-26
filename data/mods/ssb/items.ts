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
	
	// Satori
	thirdeye: {
		name: "Third Eye",
		spritenum: 574,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) {
			if (move.category === 'Special') {
				return this.chainModify(1.2);
			}
		},
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('thirdeye - decreasing accuracy');
			return this.chainModify(0.9);
		},
		gen: 8,
		desc: "Boosts the user's Special Attack by 1.2x and evasiveness by 1.1x.",
	},
};
