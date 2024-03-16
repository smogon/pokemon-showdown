export const Items: {[k: string]: ModdedItemData} = {
	berrysweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	cloversweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	dragonscale: {
		inherit: true,
		isNonstandard: "Past",
	},
	dubiousdisc: {
		inherit: true,
		isNonstandard: "Past",
	},
	electirizer: {
		inherit: true,
		isNonstandard: "Past",
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
		isNonstandard: "Past",
	},
	lovesweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	magmarizer: {
		inherit: true,
		isNonstandard: "Past",
	},
	metalalloy: {
		inherit: true,
		isNonstandard: "Future",
	},
	protector: {
		inherit: true,
		isNonstandard: "Past",
	},
	ribbonsweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	souldew: {
		inherit: true,
		isNonstandard: "Past",
	},
	starsweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	strawberrysweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	upgrade: {
		inherit: true,
		isNonstandard: "Past",
	},
};
