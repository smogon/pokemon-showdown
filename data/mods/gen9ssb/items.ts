export const Items: {[k: string]: ModdedItemData} = {
	// Mima
	crescentstaff: {
		name: "Crescent Staff",
		spritenum: 698,
		onTakeItem: false,
		zMove: "Reincarnation",
		zMoveFrom: "Complete Darkness",
		itemUser: ["Mismagius"],
		desc: "If held by a Mismagius with Complete Darkness, it can use Reincarnation.",
		gen: 9,
	},
	// Gizmo
	inconspicuouscoin: {
		name: "Inconspicuous Coin",
		desc: "When the holder is hit by a damaging move: ~16% chance to do halved damage. When the holder uses a damaging move: 20% chance to do doubled damage. Chances roughly double for each charge this Pokemon has (~16%, ~33%, ~50% | 20%, 40%, 60%)",
		shortDesc: "See this entry with '/ssb Gizmo'!",
		gen: 9,
		onSourceModifyDamage(damage, source, target, move) {
			if (!target.abilityState.charges) target.abilityState.charges = 0;
			const chance = 6/(1+target.abilityState.charges);
			if (this.randomChance(1, chance)) {
				this.add('-message', `${target.name} defended itself with the Inconspicuous Coin!`);
				return this.chainModify(0.5);
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (!source.abilityState.charges || source.abilityState.charges === 0) return;
			const chance = 5/(1+source.abilityState.charges);
			if (this.randomChance(1, chance) && move.basePower <= 60) {
				this.add('-message', `${source.name} used the Inconspicuous Coin's charge to strengthen ${move.name}'s impact!`);
				return this.chainModify(2);
			}
		},
	},
	// Glint
	slag: {
		name: "Slag",
		spritenum: 34,
		gen: 9,
		desc: "Serves no purpose. Gets slippery sometimes.",
		onTryMove(pokemon, target, move) {
			if (this.randomChance(1, 5)) {
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
		desc: "On switch-in, this Pokemon copies the positive stat changes of the opposing Pokemon.",
		gen: 9,
		onStart(pokemon) {
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			const boosts: SparseBoostsTable = {};
			let i: BoostID;
			if (!target.boosts) return;
			for (i in target.boosts) {
				if (target.boosts[i] > 0) boosts[i] = target.boosts[i];
			}
			this.add("-activate", pokemon, "item: Sketchbook");
			this.add('-message', `${pokemon.name} sketched ${target.name}'s stat changes!`);
			this.boost(boosts, pokemon);
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
