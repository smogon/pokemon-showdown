'use strict';

/** @type {{[k: string]: ModdedItemData}} */
let BattleItems = {
	"eviolite": {
		inherit: true,
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (typeof pokemon.baseTemplate.evos === 'undefined') return;
			if (pokemon.baseTemplate.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (typeof pokemon.baseTemplate.evos === 'undefined') return;
			if (pokemon.baseTemplate.nfe) {
				return this.chainModify(1.5);
			}
		},
	},
	"heracronite": {
		id: "heracronite",
		name: "Heracronite",
		spritenum: 590,
		desc: "Does nothing.",
	},
};

exports.BattleItems = BattleItems;
