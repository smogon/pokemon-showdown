export const Items: {[k: string]: ModdedItemData} = {
	eviolite: {
		inherit: true,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.nfe || pokemon.baseSpecies.id === 'dipplin') {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.nfe || pokemon.baseSpecies.id === 'dipplin') {
				return this.chainModify(1.5);
			}
		},
	},
};
