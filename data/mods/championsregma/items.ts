export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	barbaracite: {
		inherit: true,
		isNonstandard: "Future",
	},
	bigroot: {
		inherit: true,
		isNonstandard: "Past",
	},
	blazikenite: {
		inherit: true,
		isNonstandard: "Past",
	},
	damprock: {
		inherit: true,
		isNonstandard: "Past",
	},
	dragalgite: {
		inherit: true,
		isNonstandard: "Future",
	},
	eelektrossite: {
		inherit: true,
		isNonstandard: "Future",
	},
	expertbelt: {
		inherit: true,
		isNonstandard: "Past",
	},
	falinksite: {
		inherit: true,
		isNonstandard: "Future",
	},
	heatrock: {
		inherit: true,
		isNonstandard: "Past",
	},
	icyrock: {
		inherit: true,
		isNonstandard: "Past",
	},
	ironball: {
		inherit: true,
		isNonstandard: "Past",
	},
	lifeorb: {
		inherit: true,
		isNonstandard: "Past",
	},
	lightclay: {
		inherit: true,
		isNonstandard: "Past",
	},
	malamarite: {
		inherit: true,
		isNonstandard: "Future",
	},
	mawilite: {
		inherit: true,
		isNonstandard: "Past",
	},
	metagrossite: {
		inherit: true,
		isNonstandard: "Past",
	},
	metronome: {
		inherit: true,
		isNonstandard: "Past",
	},
	muscleband: {
		inherit: true,
		isNonstandard: "Past",
	},
	pyroarite: {
		inherit: true,
		isNonstandard: "Future",
	},
	raichunitex: {
		inherit: true,
		isNonstandard: "Future",
	},
	raichunitey: {
		inherit: true,
		isNonstandard: "Future",
	},
	sceptilite: {
		inherit: true,
		isNonstandard: "Past",
	},
	scolipite: {
		inherit: true,
		isNonstandard: "Future",
	},
	scraftinite: {
		inherit: true,
		isNonstandard: "Future",
	},
	shedshell: {
		inherit: true,
		isNonstandard: "Past",
	},
	smoothrock: {
		inherit: true,
		isNonstandard: "Past",
	},
	staraptite: {
		inherit: true,
		isNonstandard: "Future",
	},
	swampertite: {
		inherit: true,
		isNonstandard: "Past",
	},
	whiteherb: {
		inherit: true,
		onAnyAfterMove() {
			// Desync: proceed from Parting Shot's point of view
			this.queue.insertChoice({
				choice: 'event',
				event: 'WhiteHerb',
				order: 99, // before switches
				pokemon: this.effectState.target,
			});
		},
		onWhiteHerb(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target);
		},
	},
	wiseglasses: {
		inherit: true,
		isNonstandard: "Past",
	},
	widelens: {
		inherit: true,
		isNonstandard: "Past",
	},
	zoomlens: {
		inherit: true,
		isNonstandard: "Past",
	},
};
