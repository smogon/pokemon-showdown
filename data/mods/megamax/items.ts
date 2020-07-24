export const Items: {[k: string]: ModdedItemData} = {
	venusauritez: {
		name: "Venusaurite Z",
		spritenum: 608,
		megaStone: "Venusaur-Gmax",
		megaEvolves: "Venusaur",
		itemUser: ["Venusaur"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Venusaur, this item allows it to Mega Evolve in battle.",
	},
	charizarditez: {
		name: "Charizardite Z",
		spritenum: 586,
		megaStone: "Charizard-Gmax",
		megaEvolves: "Charizard",
		itemUser: ["Charizard"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Charizard, this item allows it to Mega Evolve in battle.",
	},
	blastoisinitez: {
		name: "Blastoisinite Z",
		spritenum: 583,
		megaStone: "Blastoise-Gmax",
		megaEvolves: "Blastoise",
		itemUser: ["Blastoise"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Blastoise, this item allows it to Mega Evolve in battle.",
	},
	butterfrite: {
		name: "Butterfrite",
		spritenum: 583,
		megaStone: "Butterfree-Gmax",
		megaEvolves: "Butterfree",
		itemUser: ["Butterfree"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Butterfree, this item allows it to Mega Evolve in battle.",
	},
	pikachuite: {
		name: "Pikachuite",
		spritenum: 583,
		megaStone: "Pikachu-Gmax",
		megaEvolves: "Pikachu",
		itemUser: ["Pikachu"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Pikachu, this item allows it to Mega Evolve in battle.",
	},
	meowthite: {
		name: "Meowthite",
		spritenum: 583,
		megaStone: "Meowth-Gmax",
		megaEvolves: "Meowth",
		itemUser: ["Meowth"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Meowth, this item allows it to Mega Evolve in battle.",
	},
	machampite: {
		name: "Machampite",
		spritenum: 583,
		megaStone: "Machamp-Gmax",
		megaEvolves: "Machamp",
		itemUser: ["Machamp"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Machamp, this item allows it to Mega Evolve in battle.",
	},
	gengaritex: {
		name: "Gengarite X",
		spritenum: 583,
		megaStone: "Gengar-Gmax",
		megaEvolves: "Gengar",
		itemUser: ["Gengar"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Gengar, this item allows it to Mega Evolve in battle.",
	},
	kinglerite: {
		name: "Kinglerite",
		spritenum: 583,
		megaStone: "Kingler-Gmax",
		megaEvolves: "Kingler",
		itemUser: ["Kingler"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Kingler, this item allows it to Mega Evolve in battle.",
	},
	laprasite: {
		name: "Laprasite",
		spritenum: 583,
		megaStone: "Lapras-Gmax",
		megaEvolves: "Lapras",
		itemUser: ["Lapras"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Lapras, this item allows it to Mega Evolve in battle.",
	},
	eevite: {
		name: "Eevite",
		spritenum: 583,
		megaStone: "Eevee-Gmax",
		megaEvolves: "Eevee",
		itemUser: ["Eevee"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Eevee, this item allows it to Mega Evolve in battle.",
	},
	snorlaxnite: {
		name: "Snorlaxnite",
		spritenum: 583,
		megaStone: "Snorlax-Gmax",
		megaEvolves: "Snorlax",
		itemUser: ["Snorlax"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Snorlax, this item allows it to Mega Evolve in battle.",
	},
	garbodite: {
		name: "Garbodite",
		spritenum: 583,
		megaStone: "Garbodor-Gmax",
		megaEvolves: "Garbodor",
		itemUser: ["Garbodor"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Garbodor, this item allows it to Mega Evolve in battle.",
	},
	melmetalite: {
		name: "Melmetalite",
		spritenum: 583,
		megaStone: "Melmetal-Gmax",
		megaEvolves: "Melmetal",
		itemUser: ["Melmetal"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Melmetal, this item allows it to Mega Evolve in battle.",
	},
	rillaboominite: {
		name: "Rillaboominite",
		spritenum: 583,
		megaStone: "Rillaboom-Gmax",
		megaEvolves: "Rillaboom",
		itemUser: ["Rillaboom"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Rillaboom, this item allows it to Mega Evolve in battle.",
	},
	cinderite: {
		name: "Cinderite",
		spritenum: 583,
		megaStone: "Cinderace-Gmax",
		megaEvolves: "Cinderace",
		itemUser: ["Cinderace"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Cinderace, this item allows it to Mega Evolve in battle.",
	},
	inteleonite: {
		name: "Inteleonite",
		spritenum: 583,
		megaStone: "Inteleon-Gmax",
		megaEvolves: "Inteleon",
		itemUser: ["Inteleon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Inteleon, this item allows it to Mega Evolve in battle.",
	},
	corviknite: {
		name: "Corviknite",
		spritenum: 583,
		megaStone: "Corviknight-Gmax",
		megaEvolves: "Corviknight",
		itemUser: ["Corviknight"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Corviknight, this item allows it to Mega Evolve in battle.",
	},
	orbite: {
		name: "Orbite",
		spritenum: 583,
		megaStone: "Orbeetle-Gmax",
		megaEvolves: "Orbeetle",
		itemUser: ["Orbeetle"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Orbeetle, this item allows it to Mega Evolve in battle.",
	},
	drednite: {
		name: "Drednite",
		spritenum: 583,
		megaStone: "Drednaw-Gmax",
		megaEvolves: "Drednaw",
		itemUser: ["Drednaw"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Drednaw, this item allows it to Mega Evolve in battle.",
	},
	coalossalite: {
		name: "Coalossalite",
		spritenum: 583,
		megaStone: "Coalossal-Gmax",
		megaEvolves: "Coalossal",
		itemUser: ["Coalossal"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Coalossal, this item allows it to Mega Evolve in battle.",
	},
	flappnite: {
		name: "Flappnite",
		spritenum: 583,
		megaStone: "Flapple-Gmax",
		megaEvolves: "Flapple",
		itemUser: ["Flapple"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Flapple, this item allows it to Mega Evolve in battle.",
	},
	appletunite: {
		name: "Appletunite",
		spritenum: 583,
		megaStone: "Appletun-Gmax",
		megaEvolves: "Appletun",
		itemUser: ["Appletun"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Appletun, this item allows it to Mega Evolve in battle.",
	},
	sandaconite: {
		name: "Sandaconite",
		spritenum: 583,
		megaStone: "Sandaconda-Gmax",
		megaEvolves: "Sandaconda",
		itemUser: ["Sandaconda"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Sandaconda, this item allows it to Mega Evolve in battle.",
	},
	toxtricitite: {
		name: "Toxtricitite",
		spritenum: 583,
		megaStone: "Toxtricity-Gmax",
		megaEvolves: "Toxtricity",
		itemUser: ["Toxtricity"],
		onTakeItem(item, source) {
			if (source.baseSpecies.name.includes('Toxtricity')) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Toxtricity, this item allows it to Mega Evolve in battle.",
	},
	centiskorchite: {
		name: "Centiskorchite",
		spritenum: 583,
		megaStone: "Centiskorch-Gmax",
		megaEvolves: "Centiskorch",
		itemUser: ["Centiskorch"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Centiskorch, this item allows it to Mega Evolve in battle.",
	},
	hatterenite: {
		name: "Hatterenite",
		spritenum: 583,
		megaStone: "Hatterene-Gmax",
		megaEvolves: "Hatterene",
		itemUser: ["Hatterene"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Hatterene, this item allows it to Mega Evolve in battle.",
	},
	grimmsnarlite: {
		name: "Grimmsnarlite",
		spritenum: 583,
		megaStone: "Grimmsnarl-Gmax",
		megaEvolves: "Grimmsnarl",
		itemUser: ["Grimmsnarl"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Grimmsnarl, this item allows it to Mega Evolve in battle.",
	},
	alcremite: {
		name: "Alcremite",
		spritenum: 583,
		megaStone: "Alcremie-Gmax",
		megaEvolves: "Alcremie",
		itemUser: ["Alcremie"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Alcremie, this item allows it to Mega Evolve in battle.",
	},
	copperajite: {
		name: "Copperajite",
		spritenum: 583,
		megaStone: "Copperajah-Gmax",
		megaEvolves: "Copperajah",
		itemUser: ["Copperajah"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Copperajah, this item allows it to Mega Evolve in battle.",
	},
	duraludite: {
		name: "Duraludite",
		spritenum: 583,
		megaStone: "Duraludon-Gmax",
		megaEvolves: "Duraludon",
		itemUser: ["Duraludon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Duraludon, this item allows it to Mega Evolve in battle.",
	},
	urshifusite: {
		name: "Urshifusite",
		spritenum: 583,
		megaStone: "Urshifu-Gmax",
		megaEvolves: "Urshifu",
		itemUser: ["Urshifu"],
		onTakeItem(item, source) {
			if (source.baseSpecies.name.includes('Urshifu')) return false;
			return true;
		},
		num: 10000,
		gen: 8,
		desc: "If held by a Urshifu, this item allows it to Mega Evolve in battle.",
	},
};
