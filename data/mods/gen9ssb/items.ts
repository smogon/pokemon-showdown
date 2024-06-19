export const Items: {[k: string]: ModdedItemData} = {
	// Glint
	slag: {
		name: "Slag",
		spritenum: 34,
		gen: 9,
		desc: "Serves no purposes. Gets a bit slippery sometimes.",
		onTryMove(pokemon, target, move) {
			if (this.randomChance(1, 3)) {
				this.add('-message', `Oops! ${pokemon.name} slipped on the Slag!`);
				this.add('-message', `Why is he carrying slag?`);
				return null;
			}
		},
	},
	// Finger
	mattermirror: {
		name: "Matter Mirror",
		spritenum: 69,
		desc: "This Pokemon's Physical attacks become Special.",
		gen: 9,
		onModifyMove(move, pokemon) {
			if (move.category === 'Physical') {
				move.category = 'Special';
			}
		},
	},
	// Pablo
	sketchbook: {
		name: "Sketchbook",
		spritenum: 200,
		desc: "On switch-in, this Pokemon copies the stat changes of the opposing Pokemon.",
		gen: 9,
		onStart(target) {
			this.actions.useMove('Sketchbook', target);
		},
	},
	// Trey
	yoichisbow: {
		name: "Yoichi's Bow",
		spritenum: 429,
		onTakeItem: false,
		zMove: "Grand Delta",
		zMoveFrom: "Burst Delta",
		itemUser: ["Decidueye-Hisui"],
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return this.chainModify(1.3);
			}
		},
		desc: "Holder's Flying-type attacks have 1.3x power. If held by Decidueye-Hiseui with Burst Delta, it can use Grand Delta.",
		gen: 9,
	},
	// Aeri
	fleetingwinds: {
		name: "Fleeting Winds",
		onStart(source) {
			this.field.setTerrain('mistyterrain');
		},
		onFaint(pokemon) {
			this.add("-activate", pokemon, "item: Fleeting Winds");
			this.actions.useMove('Healing Wish', pokemon);
			pokemon.side.addSideCondition('tailwind', pokemon);
		},
		desc: "On switch-in, starts Misty Terrain. If this Pokemon would faint, starts Tailwind and uses Healing Wish.",
		shortDesc: "Switch-in: Misty Terrain; Faint; Tailwind + Healing Wish.",
		gen: 9,
	},
};
