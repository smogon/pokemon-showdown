export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	berrysweet: {
		inherit: true,
		 
	},
	cloversweet: {
		inherit: true,
		 
	},
	dragonscale: {
		inherit: true,
		 
	},
	dubiousdisc: {
		inherit: true,
		 
	},
	electirizer: {
		inherit: true,
		 
	},
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
	flowersweet: {
		inherit: true,
		 
	},
	lovesweet: {
		inherit: true,
		 
	},
	magmarizer: {
		inherit: true,
		 
	},
	metalalloy: {
		inherit: true,
		isNonstandard: "Future",
	},
	protector: {
		inherit: true,
		 
	},
	ribbonsweet: {
		inherit: true,
		 
	},
	souldew: {
		inherit: true,
		 
	},
	starsweet: {
		inherit: true,
		 
	},
	strawberrysweet: {
		inherit: true,
		 
	},
	upgrade: {
		inherit: true,
		 
	},
};
