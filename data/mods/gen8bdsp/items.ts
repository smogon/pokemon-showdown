export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	absorbbulb: {
		inherit: true,

	},
	adrenalineorb: {
		inherit: true,

	},
	airballoon: {
		inherit: true,

	},
	assaultvest: {
		inherit: true,

	},
	beastball: {
		inherit: true,

	},
	berrysweet: {
		inherit: true,

	},
	bignugget: {
		inherit: true,

	},
	bindingband: {
		inherit: true,

	},
	blukberry: {
		inherit: true,
		isNonstandard: null,
	},
	blunderpolicy: {
		inherit: true,

	},
	bugmemory: {
		inherit: true,

	},
	burndrive: {
		inherit: true,

	},
	cellbattery: {
		inherit: true,

	},
	chilldrive: {
		inherit: true,

	},
	chippedpot: {
		inherit: true,

	},
	cloversweet: {
		inherit: true,

	},
	coverfossil: {
		inherit: true,

	},
	crackedpot: {
		inherit: true,

	},
	darkmemory: {
		inherit: true,

	},
	dousedrive: {
		inherit: true,

	},
	dracoplate: {
		inherit: true,
		isNonstandard: null,
	},
	dragonmemory: {
		inherit: true,

	},
	dreadplate: {
		inherit: true,
		isNonstandard: null,
	},
	dreamball: {
		inherit: true,

	},
	earthplate: {
		inherit: true,
		isNonstandard: null,
	},
	ejectbutton: {
		inherit: true,
		isNonstandard: "Unobtainable",
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && target.hp && move && move.category !== 'Status' && !move.flags['futuremove']) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.beingCalledBack || target.isSkyDropped()) return;
				for (const pokemon of this.getAllActive()) {
					if (pokemon.switchFlag === true) return;
				}
				// TODO: Confirm mechanics
				this.add("-activate", target, "item: Eject Button");
				target.switchFlag = true;
				source.switchFlag = false;
			}
		},
	},
	ejectpack: {
		inherit: true,

	},
	electricmemory: {
		inherit: true,

	},
	electricseed: {
		inherit: true,

	},
	eviolite: {
		inherit: true,
		isNonstandard: "Unobtainable",
		// TODO: Figure out calculation
	},
	fairymemory: {
		inherit: true,

	},
	fightingmemory: {
		inherit: true,

	},
	firememory: {
		inherit: true,

	},
	fistplate: {
		inherit: true,
		isNonstandard: null,
	},
	flameplate: {
		inherit: true,
		isNonstandard: null,
	},
	floatstone: {
		inherit: true,

	},
	flowersweet: {
		inherit: true,

	},
	flyingmemory: {
		inherit: true,

	},
	fossilizedbird: {
		inherit: true,

	},
	fossilizeddino: {
		inherit: true,

	},
	fossilizeddrake: {
		inherit: true,

	},
	fossilizedfish: {
		inherit: true,

	},
	galaricacuff: {
		inherit: true,

	},
	galaricawreath: {
		inherit: true,

	},
	ghostmemory: {
		inherit: true,

	},
	grassmemory: {
		inherit: true,

	},
	grassyseed: {
		inherit: true,

	},
	groundmemory: {
		inherit: true,

	},
	heavydutyboots: {
		inherit: true,

	},
	icememory: {
		inherit: true,

	},
	icestone: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	icicleplate: {
		inherit: true,
		isNonstandard: null,
	},
	insectplate: {
		inherit: true,
		isNonstandard: null,
	},
	ironplate: {
		inherit: true,
		isNonstandard: null,
	},
	jawfossil: {
		inherit: true,

	},
	keeberry: {
		inherit: true,

	},
	lovesweet: {
		inherit: true,

	},
	luckypunch: {
		inherit: true,
		isNonstandard: null,
	},
	luminousmoss: {
		inherit: true,

	},
	marangaberry: {
		inherit: true,

	},
	meadowplate: {
		inherit: true,
		isNonstandard: null,
	},
	mindplate: {
		inherit: true,
		isNonstandard: null,
	},
	mistyseed: {
		inherit: true,

	},
	nanabberry: {
		inherit: true,
		isNonstandard: null,
	},
	normalgem: {
		inherit: true,

	},
	pinapberry: {
		inherit: true,
		isNonstandard: null,
	},
	plumefossil: {
		inherit: true,

	},
	poisonmemory: {
		inherit: true,

	},
	protectivepads: {
		inherit: true,

	},
	psychicmemory: {
		inherit: true,

	},
	psychicseed: {
		inherit: true,

	},
	razorfang: {
		inherit: true,
		isNonstandard: null,
	},
	razzberry: {
		inherit: true,
		isNonstandard: null,
	},
	redcard: {
		inherit: true,

	},
	ribbonsweet: {
		inherit: true,

	},
	ringtarget: {
		inherit: true,

	},
	rockmemory: {
		inherit: true,

	},
	rockyhelmet: {
		inherit: true,

	},
	roomservice: {
		inherit: true,

	},
	rustedshield: {
		inherit: true,

	},
	rustedsword: {
		inherit: true,

	},
	sachet: {
		inherit: true,

	},
	safariball: {
		inherit: true,

	},
	safetygoggles: {
		inherit: true,

	},
	sailfossil: {
		inherit: true,

	},
	shockdrive: {
		inherit: true,

	},
	skyplate: {
		inherit: true,
		isNonstandard: null,
	},
	snowball: {
		inherit: true,

	},
	splashplate: {
		inherit: true,
		isNonstandard: null,
	},
	spookyplate: {
		inherit: true,
		isNonstandard: null,
	},
	starsweet: {
		inherit: true,

	},
	steelmemory: {
		inherit: true,

	},
	stoneplate: {
		inherit: true,
		isNonstandard: null,
	},
	strangeball: {
		inherit: true,
		isNonstandard: null,
	},
	strawberrysweet: {
		inherit: true,

	},
	sweetapple: {
		inherit: true,

	},
	tartapple: {
		inherit: true,

	},
	terrainextender: {
		inherit: true,

	},
	throatspray: {
		inherit: true,

	},
	toxicplate: {
		inherit: true,
		isNonstandard: null,
	},
	tr00: {
		inherit: true,

	},
	tr01: {
		inherit: true,

	},
	tr02: {
		inherit: true,

	},
	tr03: {
		inherit: true,

	},
	tr04: {
		inherit: true,

	},
	tr05: {
		inherit: true,

	},
	tr06: {
		inherit: true,

	},
	tr07: {
		inherit: true,

	},
	tr08: {
		inherit: true,

	},
	tr09: {
		inherit: true,

	},
	tr10: {
		inherit: true,

	},
	tr11: {
		inherit: true,

	},
	tr12: {
		inherit: true,

	},
	tr13: {
		inherit: true,

	},
	tr14: {
		inherit: true,

	},
	tr15: {
		inherit: true,

	},
	tr16: {
		inherit: true,

	},
	tr17: {
		inherit: true,

	},
	tr18: {
		inherit: true,

	},
	tr19: {
		inherit: true,

	},
	tr20: {
		inherit: true,

	},
	tr21: {
		inherit: true,

	},
	tr22: {
		inherit: true,

	},
	tr23: {
		inherit: true,

	},
	tr24: {
		inherit: true,

	},
	tr25: {
		inherit: true,

	},
	tr26: {
		inherit: true,

	},
	tr27: {
		inherit: true,

	},
	tr28: {
		inherit: true,

	},
	tr29: {
		inherit: true,

	},
	tr30: {
		inherit: true,

	},
	tr31: {
		inherit: true,

	},
	tr32: {
		inherit: true,

	},
	tr33: {
		inherit: true,

	},
	tr34: {
		inherit: true,

	},
	tr35: {
		inherit: true,

	},
	tr36: {
		inherit: true,

	},
	tr37: {
		inherit: true,

	},
	tr38: {
		inherit: true,

	},
	tr39: {
		inherit: true,

	},
	tr40: {
		inherit: true,

	},
	tr41: {
		inherit: true,

	},
	tr42: {
		inherit: true,

	},
	tr43: {
		inherit: true,

	},
	tr44: {
		inherit: true,

	},
	tr45: {
		inherit: true,

	},
	tr46: {
		inherit: true,

	},
	tr47: {
		inherit: true,

	},
	tr48: {
		inherit: true,

	},
	tr49: {
		inherit: true,

	},
	tr50: {
		inherit: true,

	},
	tr51: {
		inherit: true,

	},
	tr52: {
		inherit: true,

	},
	tr53: {
		inherit: true,

	},
	tr54: {
		inherit: true,

	},
	tr55: {
		inherit: true,

	},
	tr56: {
		inherit: true,

	},
	tr57: {
		inherit: true,

	},
	tr58: {
		inherit: true,

	},
	tr59: {
		inherit: true,

	},
	tr60: {
		inherit: true,

	},
	tr61: {
		inherit: true,

	},
	tr62: {
		inherit: true,

	},
	tr63: {
		inherit: true,

	},
	tr64: {
		inherit: true,

	},
	tr65: {
		inherit: true,

	},
	tr66: {
		inherit: true,

	},
	tr67: {
		inherit: true,

	},
	tr68: {
		inherit: true,

	},
	tr69: {
		inherit: true,

	},
	tr70: {
		inherit: true,

	},
	tr71: {
		inherit: true,

	},
	tr72: {
		inherit: true,

	},
	tr73: {
		inherit: true,

	},
	tr74: {
		inherit: true,

	},
	tr75: {
		inherit: true,

	},
	tr76: {
		inherit: true,

	},
	tr77: {
		inherit: true,

	},
	tr78: {
		inherit: true,

	},
	tr79: {
		inherit: true,

	},
	tr80: {
		inherit: true,

	},
	tr81: {
		inherit: true,

	},
	tr82: {
		inherit: true,

	},
	tr83: {
		inherit: true,

	},
	tr84: {
		inherit: true,

	},
	tr85: {
		inherit: true,

	},
	tr86: {
		inherit: true,

	},
	tr87: {
		inherit: true,

	},
	tr88: {
		inherit: true,

	},
	tr89: {
		inherit: true,

	},
	tr90: {
		inherit: true,

	},
	tr91: {
		inherit: true,

	},
	tr92: {
		inherit: true,

	},
	tr93: {
		inherit: true,

	},
	tr94: {
		inherit: true,

	},
	tr95: {
		inherit: true,

	},
	tr96: {
		inherit: true,

	},
	tr97: {
		inherit: true,

	},
	tr98: {
		inherit: true,

	},
	tr99: {
		inherit: true,

	},
	utilityumbrella: {
		inherit: true,

	},
	watermemory: {
		inherit: true,

	},
	weaknesspolicy: {
		inherit: true,

	},
	wepearberry: {
		inherit: true,
		isNonstandard: null,
	},
	whippeddream: {
		inherit: true,

	},
	zapplate: {
		inherit: true,
		isNonstandard: null,
	},
};
