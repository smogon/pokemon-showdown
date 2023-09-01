export const Items: {[itemid: string]: ModdedItemData} = {
	bugmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	darkmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	dragonmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	electricmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	fightingmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	firememory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	flyingmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	ghostmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	grassmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	groundmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	icememory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	poisonmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	psychicmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	rockmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	steelmemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	watermemory: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	expertbelt: {
		name: "Expert Belt",
		spritenum: 132,
		fling: {
			basePower: 10,
		},
		onModifyDamage(damage, source, target, move) {
			if (move && target.getMoveHitData(move).typeMod > 0) {
				return this.chainModify([4915, 4096]);
			}
		},
		isNonstandard: null,
		num: 268,
		gen: 3,
	},
	thickclub: {
		name: "Thick Club",
		spritenum: 491,
		fling: {
			basePower: 90,
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Cubone' || pokemon.baseSpecies.baseSpecies === 'Marowak') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Marowak", "Cubone", "Marowak-Alola"],
		num: 258,
		gen: 2,
	},
	stick: {
		name: "Stick",
		fling: {
			basePower: 60,
		},
		spritenum: 475,
		onModifyCritRatio(critRatio, user) {
			if (["farfetchd", "sirfetchd"].includes(this.toID(user.baseSpecies.baseSpecies))) {
				return critRatio + 2;
			}
		},
		itemUser: ["Farfetch\u2019d", "Farfetch\u2019d-Galar", "Sirfetch\u2019d"],
		num: 259,
		gen: 2,
	},
	occaberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	passhoberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	wacanberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	rindoberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	yacheberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	chopleberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	kebiaberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	shucaberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	cobaberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	payapaberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	tangaberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	chartiberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	kasibberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	habanberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	colburberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	babiriberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	chilanberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
	custapberry: {
		inherit: true,
		isNonstandard: null,
		gen: 3,
	},
};
