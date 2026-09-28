export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	boosterenergy: {
		inherit: true,
		onUpdate(pokemon) {
			if (!this.effectState.started || pokemon.transformed) return;

			if (pokemon.hasAbility('protosynthesis') && !this.field.isWeather('sunnyday') && pokemon.useItem()) {
				pokemon.addVolatile('protosynthesis');
			}
			if (pokemon.hasAbility('quarkdrive') && !this.field.isTerrain('electricterrain') && pokemon.useItem()) {
				pokemon.addVolatile('quarkdrive');
			}
			if (pokemon.hasAbility('blossomboost') && !this.field.isTerrain('grassyterrain') && pokemon.useItem()) {
				pokemon.addVolatile('blossomboost');
			}
		},
	},
	jestersshadowcrystal: {
		name: "Jester's Shadow Crystal",
		onTakeItem: false,
		shortDesc: "If held by Jevil with Chaos Bomb, he can use Neo Chaos",
		zMove: "Neo Chaos",
		zMoveFrom: "Chaos Bomb",
		itemUser: ["Jevil"],
	},
	puppetsshadowcrystal: {
		name: "Puppet's Shadow Crystal",
		onTakeItem: false,
		shortDesc: "If held by Spamton with Make It Rain, he can use TRANSMIT KROMER",
		zMove: "TRANSMIT KROMER",
		zMoveFrom: "Make It Rain",
		itemUser: ["Spamton"],
	},
	knightsshadowcrystal: {
		name: "Knight's Shadow Crystal",
		onTakeItem: false,
		shortDesc: "If held by The Roaring Knight with Black Knife, they can use Bellowing Starburst Slice",
		zMove: "Bellowing Starburst Slice",
		zMoveFrom: "Black Knife",
		itemUser: ["Roaring Knight"],
	},
	cyanomegapetal: {
		name: "Cyan Omega Petal",
		onTakeItem: false,
		shortDesc: "If held by Aqua with Petal Dance, she can use Omega Patience.",
		zMove: "Omega Patience",
		zMoveFrom: "Petal Dance",
		itemUser: ["Aqua"],
	},
	violetomegapetal: {
		name: "Violet Omega Petal",
		onTakeItem: false,
		shortDesc: "If held by Seth with Petal Dance, they can use Omega Perseverance.",
		zMove: "Omega Perseverance",
		zMoveFrom: "Petal Dance",
		itemUser: ["Seth"],
	},
	amberomegapetal: {
		name: "Amber Omega Petal",
		onTakeItem: false,
		shortDesc: "If held by Orange with Petal Dance, she can use Omega Bravery.",
		zMove: "Omega Bravery",
		zMoveFrom: "Petal Dance",
		itemUser: ["Orange"],
	},
	verdantomegapetal: {
		name: "Verdant Omega Petal",
		onTakeItem: false,
		shortDesc: "If held by Green with Petal Dance, they can use Omega Kindness.",
		zMove: "Omega Kindness",
		zMoveFrom: "Petal Dance",
		itemUser: ["Green"],
	},
	azureomegapetal: {
		name: "Azure Omega Petal",
		onTakeItem: false,
		shortDesc: "If held by Blue with Petal Dance, he can use Omega Integrity.",
		zMove: "Omega Integrity",
		zMoveFrom: "Petal Dance",
		itemUser: ["Blue"],
	},
	goldenomegapetal: {
		name: "Golden Omega Petal",
		onTakeItem: false,
		shortDesc: "If held by Yellow with Petal Dance, he can use Omega Justice.",
		zMove: "Omega Justice",
		zMoveFrom: "Petal Dance",
		itemUser: ["Yellow"],
	},

	queenite: {
		name: "Queenite",
		megaStone: { "Queen-Delta": "Queen-Mega" },
		shortDesc: "If Held By Queen This Item Allows Her To: Mega Evolve In Battle.",
		itemUser: ["Queen-Delta"],
		fling: {
			basePower: 80,
		},
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
	},
	spamtonite: {
		name: "Spamtonite",
		megaStone: { "Spamton": "Spamton-Mega" },
		shortDesc: "If held by Spamton, this item allows him to Mega Evolve in battle.",
		itemUser: ["Spamton"],
		fling: {
			basePower: 97,
		},
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
	},
	gersonite: {
		name: "Gersonite",
		megaStone: { "Gerson": "Gerson-Mega" },
		shortDesc: "If held by Gerson, this item allows him to Mega Evolve in battle.",
		itemUser: ["Gerson"],
		fling: {
			basePower: 80,
		},
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
	},
	kaardite: {
		name: "Kaardite",
		megaStone: { "Rouxls Kaard": "Rouxls Kaard-Mega" },
		shortDesc: "If held by Rouxls Kaard, this item allows him to Mega Evolve in battle.",
		itemUser: ["Rouxls Kaard"],
		fling: {
			basePower: 80,
		},
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
	},
	undynite: {
		name: "Undynite",
		megaStone: { "Undyne": "Undyne-Mega" },
		shortDesc: "If held by Undyne, this item allows her to Mega Evolve in battle.",
		itemUser: ["Undyne"],
		fling: {
			basePower: 80,
		},
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
	},
	mettatonitex: {
		name: "Mettatonite X",
		megaStone: { "Mettaton": "Mettaton-Mega-X" },
		shortDesc: "If held by Mettaton, this item allows him to Mega Evolve into his X form in battle.",
		itemUser: ["Mettaton"],
		fling: {
			basePower: 80,
		},
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
	},
	mettatonitey: {
		name: "Mettatonite Y",
		megaStone: { "Mettaton": "Mettaton-Mega-Y" },
		shortDesc: "If held by Mettaton, this item allows him to Mega Evolve into his Y form in battle.",
		itemUser: ["Mettaton"],
		fling: {
			basePower: 80,
		},
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
	},
	floweyite: {
		name: "Floweyite",
		megaStone: { "Flowey": "Flowey-Mega" },
		shortDesc: "If held by Flowey, this item allows him to Mega Evolve in battle.",
		itemUser: ["Flowey"],
		fling: {
			basePower: 80,
		},
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
	},
	thornring: {
		name: "Thorn Ring",
		shortDesc: "Damages the holder for 1/8 of their HP every turn. Noelle: Special Attack 1.5x.",
		itemUser: ["Noelle"],
		fling: {
			basePower: 135,
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 8);
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.name === 'Noelle') {
				return this.chainModify(1.5);
			}
		},
	},
	soulcollective: {
		name: "Soul Collective",
		onTakeItem: false,
		shortDesc: "If held by Asriel, this item allows him to Ultra Burst and use the Z-Move Hyper Goner from the move Star Blazing.",
		zMove: "Hyper Goner",
		zMoveFrom: "Star Blazing",
		itemUser: ["Asriel-Hyperdeath"],
	},
};
