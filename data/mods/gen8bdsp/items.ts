export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	absorbbulb: {
		inherit: true,
		isNonstandard: "Past",
	},
	adrenalineorb: {
		inherit: true,
		isNonstandard: "Past",
	},
	airballoon: {
		inherit: true,
		isNonstandard: "Past",
	},
	assaultvest: {
		inherit: true,
		isNonstandard: "Past",
	},
	beastball: {
		inherit: true,
		isNonstandard: "Past",
	},
	berrysweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	bignugget: {
		inherit: true,
		isNonstandard: "Past",
	},
	bindingband: {
		inherit: true,
		isNonstandard: "Past",
	},
	blukberry: {
		inherit: true,
		isNonstandard: null,
	},
	blunderpolicy: {
		inherit: true,
		isNonstandard: "Past",
	},
	bugmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	burndrive: {
		inherit: true,
		isNonstandard: "Past",
	},
	cellbattery: {
		inherit: true,
		isNonstandard: "Past",
	},
	chilldrive: {
		inherit: true,
		isNonstandard: "Past",
	},
	chippedpot: {
		inherit: true,
		isNonstandard: "Past",
	},
	cloversweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	coverfossil: {
		inherit: true,
		isNonstandard: "Past",
	},
	crackedpot: {
		inherit: true,
		isNonstandard: "Past",
	},
	darkmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	dousedrive: {
		inherit: true,
		isNonstandard: "Past",
	},
	dracoplate: {
		inherit: true,
		isNonstandard: null,
	},
	dragonmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	dreadplate: {
		inherit: true,
		isNonstandard: null,
	},
	dreamball: {
		inherit: true,
		isNonstandard: "Past",
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
		isNonstandard: "Past",
	},
	electricmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	electricseed: {
		inherit: true,
		isNonstandard: "Past",
	},
	eviolite: {
		inherit: true,
		isNonstandard: "Unobtainable",
		// TODO: Figure out calculation
	},
	fairymemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	fightingmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	firememory: {
		inherit: true,
		isNonstandard: "Past",
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
		isNonstandard: "Past",
	},
	flowersweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	flyingmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	fossilizedbird: {
		inherit: true,
		isNonstandard: "Past",
	},
	fossilizeddino: {
		inherit: true,
		isNonstandard: "Past",
	},
	fossilizeddrake: {
		inherit: true,
		isNonstandard: "Past",
	},
	fossilizedfish: {
		inherit: true,
		isNonstandard: "Past",
	},
	galaricacuff: {
		inherit: true,
		isNonstandard: "Past",
	},
	galaricawreath: {
		inherit: true,
		isNonstandard: "Past",
	},
	ghostmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	grassmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	grassyseed: {
		inherit: true,
		isNonstandard: "Past",
	},
	groundmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	heavydutyboots: {
		inherit: true,
		isNonstandard: "Past",
	},
	icememory: {
		inherit: true,
		isNonstandard: "Past",
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
		isNonstandard: "Past",
	},
	keeberry: {
		inherit: true,
		isNonstandard: "Past",
	},
	lovesweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	luckypunch: {
		inherit: true,
		isNonstandard: null,
	},
	luminousmoss: {
		inherit: true,
		isNonstandard: "Past",
	},
	marangaberry: {
		inherit: true,
		isNonstandard: "Past",
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
		isNonstandard: "Past",
	},
	nanabberry: {
		inherit: true,
		isNonstandard: null,
	},
	normalgem: {
		inherit: true,
		isNonstandard: "Past",
	},
	pinapberry: {
		inherit: true,
		isNonstandard: null,
	},
	plumefossil: {
		inherit: true,
		isNonstandard: "Past",
	},
	poisonmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	protectivepads: {
		inherit: true,
		isNonstandard: "Past",
	},
	psychicmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	psychicseed: {
		inherit: true,
		isNonstandard: "Past",
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
		isNonstandard: "Past",
	},
	ribbonsweet: {
		inherit: true,
		isNonstandard: "Past",
	},
	ringtarget: {
		inherit: true,
		isNonstandard: "Past",
	},
	rockmemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	rockyhelmet: {
		inherit: true,
		isNonstandard: "Past",
	},
	roomservice: {
		inherit: true,
		isNonstandard: "Past",
	},
	rustedshield: {
		inherit: true,
		isNonstandard: "Past",
	},
	rustedsword: {
		inherit: true,
		isNonstandard: "Past",
	},
	sachet: {
		inherit: true,
		isNonstandard: "Past",
	},
	safariball: {
		inherit: true,
		isNonstandard: "Past",
	},
	safetygoggles: {
		inherit: true,
		isNonstandard: "Past",
	},
	sailfossil: {
		inherit: true,
		isNonstandard: "Past",
	},
	shockdrive: {
		inherit: true,
		isNonstandard: "Past",
	},
	skyplate: {
		inherit: true,
		isNonstandard: null,
	},
	snowball: {
		inherit: true,
		isNonstandard: "Past",
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
		isNonstandard: "Past",
	},
	steelmemory: {
		inherit: true,
		isNonstandard: "Past",
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
		isNonstandard: "Past",
	},
	sweetapple: {
		inherit: true,
		isNonstandard: "Past",
	},
	tartapple: {
		inherit: true,
		isNonstandard: "Past",
	},
	terrainextender: {
		inherit: true,
		isNonstandard: "Past",
	},
	throatspray: {
		inherit: true,
		isNonstandard: "Past",
	},
	toxicplate: {
		inherit: true,
		isNonstandard: null,
	},
	tr00: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr01: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr02: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr03: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr04: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr05: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr06: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr07: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr08: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr09: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr10: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr11: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr12: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr13: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr14: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr15: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr16: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr17: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr18: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr19: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr20: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr21: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr22: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr23: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr24: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr25: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr26: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr27: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr28: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr29: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr30: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr31: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr32: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr33: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr34: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr35: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr36: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr37: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr38: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr39: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr40: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr41: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr42: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr43: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr44: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr45: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr46: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr47: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr48: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr49: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr50: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr51: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr52: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr53: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr54: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr55: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr56: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr57: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr58: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr59: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr60: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr61: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr62: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr63: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr64: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr65: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr66: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr67: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr68: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr69: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr70: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr71: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr72: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr73: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr74: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr75: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr76: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr77: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr78: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr79: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr80: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr81: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr82: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr83: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr84: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr85: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr86: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr87: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr88: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr89: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr90: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr91: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr92: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr93: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr94: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr95: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr96: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr97: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr98: {
		inherit: true,
		isNonstandard: "Past",
	},
	tr99: {
		inherit: true,
		isNonstandard: "Past",
	},
	utilityumbrella: {
		inherit: true,
		isNonstandard: "Past",
	},
	watermemory: {
		inherit: true,
		isNonstandard: "Past",
	},
	weaknesspolicy: {
		inherit: true,
		isNonstandard: "Past",
	},
	wepearberry: {
		inherit: true,
		isNonstandard: null,
	},
	whippeddream: {
		inherit: true,
		isNonstandard: "Past",
	},
	zapplate: {
		inherit: true,
		isNonstandard: null,
	},
};
