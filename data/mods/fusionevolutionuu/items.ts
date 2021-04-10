export const Items: {[itemid: string]: ModdedItemData} = {
	garchompite: {
		name: "Garchompite",
		spritenum: 589,
		megaStone: "Chomplim-Mega",
		megaEvolves: "Chomplim",
		itemUser: ["Chomplim"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 683,
		desc: "If held by a Chomplim, this item allows it to Mega Evolve in battle.",
	},
	audinite: {
		name: "Audinite",
		spritenum: 617,
		megaStone: "Silvino-Mega",
		megaEvolves: "Silvino",
		itemUser: ["Silvino"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 757,
		desc: "If held by a Silvino, this item allows it to Mega Evolve in battle.",
	},
	lopunnite: {
		name: "Lopunnite",
		spritenum: 626,
		megaStone: "Tapu Lop-Mega",
		megaEvolves: "Tapu Lop",
		itemUser: ["Tapu Lop"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 768,
		desc: "If held by a Tapu Lop, this item allows it to Mega Evolve in battle.",
	},
	redorb: {
		name: "Red Orb",
		spritenum: 390,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Groudon') {
				this.queue.insertChoice({choice: 'runPrimal', pokemon: pokemon});
			} else if (pokemon.isActive && pokemon.baseSpecies.name === 'Grousle') {
				this.queue.insertChoice({choice: 'runPrimal', pokemon: pokemon});
			}
		},
		onPrimal(pokemon) {
			if (pokemon.baseSpecies.name === 'Groudon') {
				pokemon.formeChange('Groudon-Primal', this.effect, true);
			} else if (pokemon.baseSpecies.name === 'Grousle') {
				pokemon.formeChange('Grousle-Primal', this.effect, true);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Groudon' || source.baseSpecies.baseSpecies === 'Grousle') return false;
			return true;
		},
		itemUser: ["Groudon", "Grousle"],
		num: 534,
		gen: 6,
		isNonstandard: "Past",
	},
	pidgeotite: {
		name: "Pidgeotite",
		spritenum: 622,
		megaStone: "Corveot-Mega",
		megaEvolves: "Corveot",
		itemUser: ["Corveot"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 762,
		desc: "If held by a Corveot, this item allows it to Mega Evolve in battle.",
	},
};
