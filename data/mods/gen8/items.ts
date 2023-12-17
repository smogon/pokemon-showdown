export const Items: {[k: string]: ModdedItemData} = {
	adamantcrystal: {
		inherit: true,
		isNonstandard: "Future",
	},
	berryjuice: {
		inherit: true,
		isNonstandard: null,
	},
	berrysweet: {
		inherit: true,
		isNonstandard: null,
	},
	bugmemory: {
		inherit: true,
		isNonstandard: null,
	},
	burndrive: {
		inherit: true,
		isNonstandard: null,
	},
	chilldrive: {
		inherit: true,
		isNonstandard: null,
	},
	cloversweet: {
		inherit: true,
		isNonstandard: null,
	},
	custapberry: {
		inherit: true,
		isNonstandard: null,
	},
	darkmemory: {
		inherit: true,
		isNonstandard: null,
	},
	deepseascale: {
		inherit: true,
		isNonstandard: null,
	},
	deepseatooth: {
		inherit: true,
		isNonstandard: null,
	},
	dousedrive: {
		inherit: true,
		isNonstandard: null,
	},
	dracoplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	dragonmemory: {
		inherit: true,
		isNonstandard: null,
	},
	dragonscale: {
		inherit: true,
		isNonstandard: null,
	},
	dreadplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	dubiousdisc: {
		inherit: true,
		isNonstandard: null,
	},
	earthplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	electirizer: {
		inherit: true,
		isNonstandard: null,
	},
	electricmemory: {
		inherit: true,
		isNonstandard: null,
	},
	enigmaberry: {
		inherit: true,
		isNonstandard: null,
	},
	fairymemory: {
		inherit: true,
		isNonstandard: null,
	},
	fightingmemory: {
		inherit: true,
		isNonstandard: null,
	},
	firememory: {
		inherit: true,
		isNonstandard: null,
	},
	fistplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	flameplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	flowersweet: {
		inherit: true,
		isNonstandard: null,
	},
	flyingmemory: {
		inherit: true,
		isNonstandard: null,
	},
	fossilizedbird: {
		inherit: true,
		isNonstandard: null,
	},
	fossilizeddino: {
		inherit: true,
		isNonstandard: null,
	},
	fossilizeddrake: {
		inherit: true,
		isNonstandard: null,
	},
	fossilizedfish: {
		inherit: true,
		isNonstandard: null,
	},
	fullincense: {
		inherit: true,
		isNonstandard: null,
	},
	galaricacuff: {
		inherit: true,
		isNonstandard: null,
	},
	galaricawreath: {
		inherit: true,
		isNonstandard: null,
	},
	ghostmemory: {
		inherit: true,
		isNonstandard: null,
	},
	grassmemory: {
		inherit: true,
		isNonstandard: null,
	},
	griseouscore: {
		inherit: true,
		isNonstandard: "Future",
	},
	griseousorb: {
		inherit: true,
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 487 || pokemon.baseSpecies.num === 487) {
				return false;
			}
			return true;
		},
		forcedForme: "Giratina-Origin",
		itemUser: ["Giratina-Origin"],
	},
	groundmemory: {
		inherit: true,
		isNonstandard: null,
	},
	icememory: {
		inherit: true,
		isNonstandard: null,
	},
	icicleplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	insectplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	ironplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	jabocaberry: {
		inherit: true,
		isNonstandard: null,
	},
	keeberry: {
		inherit: true,
		isNonstandard: null,
	},
	laxincense: {
		inherit: true,
		isNonstandard: null,
	},
	leek: {
		inherit: true,
		isNonstandard: null,
	},
	lovesweet: {
		inherit: true,
		isNonstandard: null,
	},
	lustrousglobe: {
		inherit: true,
		isNonstandard: "Future",
	},
	machobrace: {
		inherit: true,
		isNonstandard: null,
	},
	magmarizer: {
		inherit: true,
		isNonstandard: null,
	},
	marangaberry: {
		inherit: true,
		isNonstandard: null,
	},
	meadowplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	metalpowder: {
		inherit: true,
		isNonstandard: null,
	},
	micleberry: {
		inherit: true,
		isNonstandard: null,
	},
	mindplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	oddincense: {
		inherit: true,
		isNonstandard: null,
	},
	poisonmemory: {
		inherit: true,
		isNonstandard: null,
	},
	protector: {
		inherit: true,
		isNonstandard: null,
	},
	psychicmemory: {
		inherit: true,
		isNonstandard: null,
	},
	quickpowder: {
		inherit: true,
		isNonstandard: null,
	},
	razorfang: {
		inherit: true,
		isNonstandard: "Past",
	},
	ribbonsweet: {
		inherit: true,
		isNonstandard: null,
	},
	rockincense: {
		inherit: true,
		isNonstandard: null,
	},
	rockmemory: {
		inherit: true,
		isNonstandard: null,
	},
	roseincense: {
		inherit: true,
		isNonstandard: null,
	},
	rowapberry: {
		inherit: true,
		isNonstandard: null,
	},
	sachet: {
		inherit: true,
		isNonstandard: null,
	},
	safariball: {
		inherit: true,
		isNonstandard: null,
	},
	seaincense: {
		inherit: true,
		isNonstandard: null,
	},
	shockdrive: {
		inherit: true,
		isNonstandard: null,
	},
	skyplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	splashplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	spookyplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	sportball: {
		inherit: true,
		isNonstandard: null,
	},
	starsweet: {
		inherit: true,
		isNonstandard: null,
	},
	stoneplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	strawberrysweet: {
		inherit: true,
		isNonstandard: null,
	},
	steelmemory: {
		inherit: true,
		isNonstandard: null,
	},
	strangeball: {
		inherit: true,
		isNonstandard: "Future",
	},
	thickclub: {
		inherit: true,
		isNonstandard: null,
	},
	toxicplate: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr00: {
		inherit: true,
		isNonstandard: null,
	},
	tr01: {
		inherit: true,
		isNonstandard: null,
	},
	tr02: {
		inherit: true,
		isNonstandard: null,
	},
	tr03: {
		inherit: true,
		isNonstandard: null,
	},
	tr04: {
		inherit: true,
		isNonstandard: null,
	},
	tr05: {
		inherit: true,
		isNonstandard: null,
	},
	tr06: {
		inherit: true,
		isNonstandard: null,
	},
	tr07: {
		inherit: true,
		isNonstandard: null,
	},
	tr08: {
		inherit: true,
		isNonstandard: null,
	},
	tr09: {
		inherit: true,
		isNonstandard: null,
	},
	tr10: {
		inherit: true,
		isNonstandard: null,
	},
	tr11: {
		inherit: true,
		isNonstandard: null,
	},
	tr12: {
		inherit: true,
		isNonstandard: null,
	},
	tr13: {
		inherit: true,
		isNonstandard: null,
	},
	tr14: {
		inherit: true,
		isNonstandard: null,
	},
	tr15: {
		inherit: true,
		isNonstandard: null,
	},
	tr16: {
		inherit: true,
		isNonstandard: null,
	},
	tr17: {
		inherit: true,
		isNonstandard: null,
	},
	tr18: {
		inherit: true,
		isNonstandard: null,
	},
	tr19: {
		inherit: true,
		isNonstandard: null,
	},
	tr20: {
		inherit: true,
		isNonstandard: null,
	},
	tr21: {
		inherit: true,
		isNonstandard: null,
	},
	tr22: {
		inherit: true,
		isNonstandard: null,
	},
	tr23: {
		inherit: true,
		isNonstandard: null,
	},
	tr24: {
		inherit: true,
		isNonstandard: null,
	},
	tr25: {
		inherit: true,
		isNonstandard: null,
	},
	tr26: {
		inherit: true,
		isNonstandard: null,
	},
	tr27: {
		inherit: true,
		isNonstandard: null,
	},
	tr28: {
		inherit: true,
		isNonstandard: null,
	},
	tr29: {
		inherit: true,
		isNonstandard: null,
	},
	tr30: {
		inherit: true,
		isNonstandard: null,
	},
	tr31: {
		inherit: true,
		isNonstandard: null,
	},
	tr32: {
		inherit: true,
		isNonstandard: null,
	},
	tr33: {
		inherit: true,
		isNonstandard: null,
	},
	tr34: {
		inherit: true,
		isNonstandard: null,
	},
	tr35: {
		inherit: true,
		isNonstandard: null,
	},
	tr36: {
		inherit: true,
		isNonstandard: null,
	},
	tr37: {
		inherit: true,
		isNonstandard: null,
	},
	tr38: {
		inherit: true,
		isNonstandard: null,
	},
	tr39: {
		inherit: true,
		isNonstandard: null,
	},
	tr40: {
		inherit: true,
		isNonstandard: null,
	},
	tr41: {
		inherit: true,
		isNonstandard: null,
	},
	tr42: {
		inherit: true,
		isNonstandard: null,
	},
	tr43: {
		inherit: true,
		isNonstandard: null,
	},
	tr44: {
		inherit: true,
		isNonstandard: null,
	},
	tr45: {
		inherit: true,
		isNonstandard: null,
	},
	tr46: {
		inherit: true,
		isNonstandard: null,
	},
	tr47: {
		inherit: true,
		isNonstandard: null,
	},
	tr48: {
		inherit: true,
		isNonstandard: null,
	},
	tr49: {
		inherit: true,
		isNonstandard: null,
	},
	tr50: {
		inherit: true,
		isNonstandard: null,
	},
	tr51: {
		inherit: true,
		isNonstandard: null,
	},
	tr52: {
		inherit: true,
		isNonstandard: null,
	},
	tr53: {
		inherit: true,
		isNonstandard: null,
	},
	tr54: {
		inherit: true,
		isNonstandard: null,
	},
	tr55: {
		inherit: true,
		isNonstandard: null,
	},
	tr56: {
		inherit: true,
		isNonstandard: null,
	},
	tr57: {
		inherit: true,
		isNonstandard: null,
	},
	tr58: {
		inherit: true,
		isNonstandard: null,
	},
	tr59: {
		inherit: true,
		isNonstandard: null,
	},
	tr60: {
		inherit: true,
		isNonstandard: null,
	},
	tr61: {
		inherit: true,
		isNonstandard: null,
	},
	tr62: {
		inherit: true,
		isNonstandard: null,
	},
	tr63: {
		inherit: true,
		isNonstandard: null,
	},
	tr64: {
		inherit: true,
		isNonstandard: null,
	},
	tr65: {
		inherit: true,
		isNonstandard: null,
	},
	tr66: {
		inherit: true,
		isNonstandard: null,
	},
	tr67: {
		inherit: true,
		isNonstandard: null,
	},
	tr68: {
		inherit: true,
		isNonstandard: null,
	},
	tr69: {
		inherit: true,
		isNonstandard: null,
	},
	tr70: {
		inherit: true,
		isNonstandard: null,
	},
	tr71: {
		inherit: true,
		isNonstandard: null,
	},
	tr72: {
		inherit: true,
		isNonstandard: null,
	},
	tr73: {
		inherit: true,
		isNonstandard: null,
	},
	tr74: {
		inherit: true,
		isNonstandard: null,
	},
	tr75: {
		inherit: true,
		isNonstandard: null,
	},
	tr76: {
		inherit: true,
		isNonstandard: null,
	},
	tr77: {
		inherit: true,
		isNonstandard: null,
	},
	tr78: {
		inherit: true,
		isNonstandard: null,
	},
	tr79: {
		inherit: true,
		isNonstandard: null,
	},
	tr80: {
		inherit: true,
		isNonstandard: null,
	},
	tr81: {
		inherit: true,
		isNonstandard: null,
	},
	tr82: {
		inherit: true,
		isNonstandard: null,
	},
	tr83: {
		inherit: true,
		isNonstandard: null,
	},
	tr84: {
		inherit: true,
		isNonstandard: null,
	},
	tr85: {
		inherit: true,
		isNonstandard: null,
	},
	tr86: {
		inherit: true,
		isNonstandard: null,
	},
	tr87: {
		inherit: true,
		isNonstandard: null,
	},
	tr88: {
		inherit: true,
		isNonstandard: null,
	},
	tr89: {
		inherit: true,
		isNonstandard: null,
	},
	tr90: {
		inherit: true,
		isNonstandard: null,
	},
	tr91: {
		inherit: true,
		isNonstandard: null,
	},
	tr92: {
		inherit: true,
		isNonstandard: null,
	},
	tr93: {
		inherit: true,
		isNonstandard: null,
	},
	tr94: {
		inherit: true,
		isNonstandard: null,
	},
	tr95: {
		inherit: true,
		isNonstandard: null,
	},
	tr96: {
		inherit: true,
		isNonstandard: null,
	},
	tr97: {
		inherit: true,
		isNonstandard: null,
	},
	tr98: {
		inherit: true,
		isNonstandard: null,
	},
	tr99: {
		inherit: true,
		isNonstandard: null,
	},
	upgrade: {
		inherit: true,
		isNonstandard: null,
	},
	watermemory: {
		inherit: true,
		isNonstandard: null,
	},
	waveincense: {
		inherit: true,
		isNonstandard: null,
	},
	whippeddream: {
		inherit: true,
		isNonstandard: null,
	},
	zapplate: {
		inherit: true,
		isNonstandard: "Past",
	},
};
