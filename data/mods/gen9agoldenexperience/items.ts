export const Items: {[itemid: string]: ModdedItemData} = {
	// ZA mega stones
	barbaracite: {
		inherit: true,
		isNonstandard: null,
	},
	chandelurite: {
		inherit: true,
		isNonstandard: null,
	},
	chesnaughtite: {
		inherit: true,
		isNonstandard: null,
	},
	clefablite: {
		inherit: true,
		isNonstandard: null,
	},
	delphoxite: {
		inherit: true,
		isNonstandard: null,
	},
	dragalgite: {
		inherit: true,
		isNonstandard: null,
	},
	dragoninite: {
		inherit: true,
		isNonstandard: null,
	},
	drampanite: {
		inherit: true,
		isNonstandard: null,
	},
	eelektrossite: {
		inherit: true,
		isNonstandard: null,
	},
	emboarite: {
		inherit: true,
		isNonstandard: null,
	},
	excadrite: {
		inherit: true,
		isNonstandard: null,
	},
	falinksite: {
		inherit: true,
		isNonstandard: null,
	},
	feraligite: {
		inherit: true,
		isNonstandard: null,
	},
	floettite: {
		inherit: true,
		isNonstandard: null,
	},
	froslassite: {
		inherit: true,
		isNonstandard: null,
	},
	greninjite: {
		inherit: true,
		isNonstandard: null,
	},
	hawluchanite: {
		inherit: true,
		isNonstandard: null,
	},
	malamarite: {
		inherit: true,
		isNonstandard: null,
	},
	meganiumite: {
		inherit: true,
		isNonstandard: null,
	},
	pyroarite: {
		inherit: true,
		isNonstandard: null,
	},
	scolipite: {
		inherit: true,
		isNonstandard: null,
	},
	scraftinite: {
		inherit: true,
		isNonstandard: null,
	},
	skarmorite: {
		inherit: true,
		isNonstandard: null,
	},
	starminite: {
		inherit: true,
		isNonstandard: null,
	},
	victreebelite: {
		inherit: true,
		isNonstandard: null,
	},
	zygardite: {
		inherit: true,
		isNonstandard: null,
	},
	// end of ZA mega stones
    paraorb: {
		name: "Para Orb",
		spritenum: 515,
		fling: {
			basePower: 30,
			status: 'par',
		},
		onResidualOrder: 26,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			pokemon.trySetStatus('par', pokemon);
		},
		desc: "At the end of each turn, tries to paralyze the holder.",
		shortDesc: "Tries to para the holder.",
		num: -1,
		gen: 4,
		isNonstandard: null,
	},
	frozenorb: {
		name: "Frozen Orb",
		spritenum: 515,
		fling: {
			basePower: 30,
			status: 'frz',
		},
		onResidualOrder: 26,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			pokemon.trySetStatus('frz', pokemon);
		},
		desc: "At the end of each turn, tries to freeze the holder.",
		shortDesc: "Tries to freeze the holder.",
		num: -2,
		gen: 4,
		isNonstandard: null,
	},
	nullifyorb: {
		name: "Nullify Orb",
		shortDesc: "Nullify the holder's ability.",
		fling: {
			basePower: 30,
		},
		onStart(pokemon) {
			if (pokemon.getAbility().flags['cantsuppress']) return;
			pokemon.addVolatile('gastroacid');
		},
		num: -3,
		gen: 9,
		isNonstandard: null,
	},

	//mega stones
	venusauritey: {
		name: "Venusaurite Y",
		spritenum: 608,
		megaStone: "Venusaur-Mega-Y",
		megaEvolves: "Venusaur",
		itemUser: ["Venusaur"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -4,
		gen: 9,
		desc: "If held by a Venusaur, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	blastoisinitex: {
		name: "Blastoisinite X",
		spritenum: 583,
		megaStone: "Blastoise-Mega-X",
		megaEvolves: "Blastoise",
		itemUser: ["Blastoise"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -5,
		gen: 9,
		desc: "If held by a Blastoise, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	butterfrite: {
		name: "Butterfrite",
		spritenum: 578,
		megaStone: "Butterfree-Mega",
		megaEvolves: "Butterfree",
		itemUser: ["Butterfree"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -6,
		gen: 9,
		desc: "If held by a Butterfree, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	wigglytite: {
		name: "Wigglytite",
		spritenum: 578,
		megaStone: "Wigglytuff-Mega",
		megaEvolves: "Wigglytuff",
		itemUser: ["Wigglytuff"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -7,
		gen: 9,
		desc: "If held by a Wigglytuff, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	machampite: {
		name: "Machampite",
		spritenum: 578,
		megaStone: "Machamp-Mega",
		megaEvolves: "Machamp",
		itemUser: ["Machamp"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -8,
		gen: 9,
		desc: "If held by a Machamp, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	typhlosionite: {
		name: "Typhlosionite",
		spritenum: 578,
		megaStone: "Typhlosion-Mega",
		megaEvolves: "Typhlosion",
		itemUser: ["Typhlosion", "Typhlosion-Hisui"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -9,
		gen: 9,
		desc: "If held by a Typhlosion or a Typhlosion-Hisui, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	noctowlite: {
		name: "Noctowlite",
		spritenum: 578,
		megaStone: "Noctowl-Mega",
		megaEvolves: "Noctowl",
		itemUser: ["Noctowl"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -10,
		gen: 9,
		desc: "If held by a Noctowl, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	crobatite: {
		name: "Crobatite",
		spritenum: 578,
		megaStone: "Crobat-Mega",
		megaEvolves: "Crobat",
		itemUser: ["Crobat"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -11,
		gen: 9,
		desc: "If held by a Crobat, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	flygonite: {
		name: "Flygonite",
		spritenum: 578,
		megaStone: "Flygon-Mega",
		megaEvolves: "Flygon",
		itemUser: ["Flygon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -12,
		gen: 9,
		desc: "If held by a Flygon, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	cacturnite: {
		name: "Cacturnite",
		spritenum: 578,
		megaStone: "Cacturne-Mega",
		megaEvolves: "Cacturne",
		itemUser: ["Cacturne"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -13,
		gen: 9,
		desc: "If held by a Cacturne, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	whiscashite: {
		name: "Whiscashite",
		spritenum: 578,
		megaStone: "Whiscash-Mega",
		megaEvolves: "Whiscash",
		itemUser: ["Whiscash"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -14,
		gen: 9,
		desc: "If held by a Whiscash, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	castformite: {
		name: "Castformite",
		spritenum: 578,
		megaStone: "Castform-Mega",
		megaEvolves: "Castform",
		itemUser: ["Castform"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -15,
		gen: 9,
		desc: "If held by a Castform, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	yanmeganite: {
		name: "Yanmeganite",
		spritenum: 578,
		megaStone: "Yanmega-Mega",
		megaEvolves: "Yanmega",
		itemUser: ["Yanmega"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -16,
		gen: 9,
		desc: "If held by a Yanmega, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	krookodite: {
		name: "Krookodite",
		spritenum: 578,
		megaStone: "Krookodile-Mega",
		megaEvolves: "Krookodile",
		itemUser: ["Krookodile"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -17,
		gen: 9,
		desc: "If held by a Krookodile, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	crustlite: {
		name: "Crustlite",
		spritenum: 578,
		megaStone: "Crustle-Mega",
		megaEvolves: "Crustle",
		itemUser: ["Crustle"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -18,
		gen: 9,
		desc: "If held by a Crustle, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	zoroarkite: {
		name: "Zoroarkite",
		spritenum: 578,
		megaStone: "Zoroark-Mega",
		megaEvolves: "Zoroark",
		itemUser: ["Zoroark"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -19,
		gen: 9,
		desc: "If held by a Zoroark, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	ribombinite: {
		name: "Ribombinite",
		spritenum: 578,
		megaStone: "Ribombee-Mega",
		megaEvolves: "Ribombee",
		itemUser: ["Ribombee"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -20,
		gen: 9,
		desc: "If held by a Ribombee, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	salazzlite: {
		name: "Salazzlite",
		spritenum: 578,
		megaStone: "Salazzle-Mega",
		megaEvolves: "Salazzle",
		itemUser: ["Salazzle"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -21,
		gen: 9,
		desc: "If held by a Salazzle, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	golisopodite: {
		name: "Golisopodite",
		spritenum: 578,
		megaStone: "Golisopod-Mega",
		megaEvolves: "Golisopod",
		itemUser: ["Golisopod"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -22,
		gen: 9,
		desc: "If held by a Golisopod, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	dhelmite: {
		name: "Dhelmite",
		spritenum: 578,
		megaStone: "Dhelmise-Mega",
		megaEvolves: "Dhelmise",
		itemUser: ["Dhelmise"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -23,
		gen: 9,
		desc: "If held by a Dhelmise, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	cramorantite: {
		name: "Cramorantite",
		megaStone: "Cramorant-Mega",
		megaEvolves: "Cramorant",
		itemUser: ["Cramorant"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -24,
		gen: 9,
		desc: "If held by a Cramorant, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	toxtricitite: {
		name: "Toxtricitite",
		spritenum: 578,
		megaStone: "Toxtricity-Mega",
		megaEvolves: "Toxtricity",
		itemUser: ["Toxtricity", "Toxtricity-Low-Key"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -25,
		gen: 9,
		desc: "If held by a Toxtricity, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	centiskorchitex: {
		name: "Centiskorchite X",
		spritenum: 578,
		megaStone: "Centiskorch-Mega-X",
		megaEvolves: "Centiskorch",
		itemUser: ["Centiskorch"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -26,
		gen: 9,
		desc: "If held by a Centiskorch, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	centiskorchitey: {
		name: "Centiskorchite Y",
		spritenum: 578,
		megaStone: "Centiskorch-Mega-Y",
		megaEvolves: "Centiskorch",
		itemUser: ["Centiskorch"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -27,
		gen: 9,
		desc: "If held by a Centiskorch, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	kleavorite: { 
		name: "Kleavorite",
		spritenum: 578,
		megaStone: "Kleavor-Mega",
		megaEvolves: "Kleavor",
		itemUser: ["Kleavor"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -28,
		gen: 9,
		desc: "If held by a Kleavor, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	meowscaradite: {
		name: "Meowscaradite",
		megaStone: "Meowscarada-Mega",
		megaEvolves: "Meowscarada",
		itemUser: ["Meowscarada"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -29,
		gen: 9,
		desc: "If held by a Meowscarada, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	skeledite: { 
		name: "Skeledite",
		spritenum: 578,
		megaStone: "Skeledirge-Mega",
		megaEvolves: "Skeledirge",
		itemUser: ["Skeledirge"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -30,
		gen: 9,
		desc: "If held by a Skeledirge, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	quaquavite: {
		name: "Quaquavite",
		megaStone: "Quaquaval-Mega",
		megaEvolves: "Quaquaval",
		itemUser: ["Quaquaval"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -31,
		gen: 9,
		desc: "If held by a Quaquaval, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	rabscanite: { 
		name: "Rabscanite",
		spritenum: 578,
		megaStone: "Rabsca-Mega",
		megaEvolves: "Rabsca",
		itemUser: ["Rabsca"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -32,
		gen: 9,
		desc: "If held by a Rabsca, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	brambleghite: {
		name: "Brambleghite",
		spritenum: 578,
		megaStone: "Brambleghast-Mega",
		megaEvolves: "Brambleghast",
		itemUser: ["Brambleghast"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -33,
		gen: 9,
		desc: "If held by a Brambleghast, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	baskironite: {
		name: "Baskironite",
		spritenum: 578,
		megaStone: "Baskiron-Mega",
		megaEvolves: "Baskiron",
		itemUser: ["Baskiron"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -34,
		gen: 9,
		desc: "If held by a Baskiron, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	terreptilite: {
		name: "Terreptilite",
		spritenum: 578,
		megaStone: "Terreptile-Mega",
		megaEvolves: "Terreptile",
		itemUser: ["Terreptile"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -35,
		gen: 9,
		desc: "If held by a Terreptile, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	rocksterite: {
		name: "Rocksterite",
		spritenum: 578,
		megaStone: "Rockster-Mega",
		megaEvolves: "Rockster",
		itemUser: ["Rockster"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -36,
		gen: 9,
		desc: "If held by a Rockster, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	infarmatemite: {
		name: "Infarmatemite",
		spritenum: 578,
		megaStone: "Infarmatem-Mega",
		megaEvolves: "Infarmatem",
		itemUser: ["Infarmatem"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -37,
		gen: 9,
		desc: "If held by a Infarmatem, this item allows it to Mega Evolve in battle.",
		isNonstandard: null,
	},
	slowbronite: {
		inherit: true,
		itemUser: ["Slowbro", "Slowbro-Galar"],
		desc: "If held by a Slowbro or a Slowbro-Galar, this item allows it to Mega Evolve in battle.",
	},
	scizorite: {
		inherit: true,
		itemUser: ["Scizor", "Scizor-Galar"],
		desc: "If held by a Scizor or a Scizor-Galar, this item allows it to Mega Evolve in battle.",
	},

	chakraseed: {
		name: "Chakra Seed",
		shortDesc: "If the terrain is Chakra Terrain, raises holder's Defense by 1 stage. Single use.",
		spritenum: 664,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('chakraterrain')) {
				pokemon.useItem();
			}
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('chakraterrain')) {
				pokemon.useItem();
			}
		},
		boosts: {
			def: 1,
		},
		num: -38,
		gen: 9,
		isNonstandard: null,
	},
	honey: {
		name: "Honey",
		fling: {
			basePower: 30,
		},
		num: -39,
		gen: 9,
    	shortDesc: "Pokemon with the ability Honey Gather or Sweet Veil heal 12.5% when holding this item. Heals status.",
		onAfterSetStatus(status, pokemon) {
			pokemon.eatItem();
		},
		onUpdate(pokemon) {
			if (pokemon.status || pokemon.volatiles['confusion']) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			pokemon.cureStatus();
			pokemon.removeVolatile('confusion');
		},
		isNonstandard: null,
	},
	indecisiveorb: {
		name: "Indecisive Orb",
		fling: {
			basePower: 30,
		},
		onDisableMove: function(pokemon) {
			if (pokemon.lastMove && pokemon.lastMove.id !== 'struggle') pokemon.disableMove(pokemon.lastMove.id);
		},
		onModifyDamage(damage, source, target, move) {
			return this.chainModify(1.3);
		},
		desc: "Holder's move have 1.3x BP, but it can't use the same move twice in a row.",
		num: -40,
		gen: 9,
		isNonstandard: null,
	},
	deepseascale: {
		inherit: true,
		name: "Deep Sea Scale",
		shortDesc: "If held by a Clamperl or a Gorebyss, its Sp. Atk is x1.5.",
		onModifySpAPriority: 2,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.name === 'Clamperl' || pokemon.baseSpecies.name === 'Gorebyss') {
				return this.chainModify(1.5);
			}
		},
		itemUser: ["Clamperl", "Gorebyss"],
	},
	deepseatooth: {
		inherit: true,
		name: "Deep Sea Tooth",
		shortDesc: "If held by a Clamperl or a Huntail, its Atk is x1.5.",
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.name === 'Clamperl' || pokemon.baseSpecies.name === 'Huntail') {
				return this.chainModify(1.5);
			}
		},
		itemUser: ["Clamperl", "Huntail"],
	},
	awakeningeye: {
		name: "Awakening Eye",
		shortDesc: "If held by a Meowstic, its Sp. Atk and its Sp. Def are x1.5.",
		// spritenum: 699,
		onModifySpAPriority: 2,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.name === 'Meowstic' || pokemon.baseSpecies.name === 'Meowstic-F') {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.name === 'Meowstic' || pokemon.baseSpecies.name === 'Meowstic-F') {
				return this.chainModify(1.5);
			}
		},
		itemUser: ["Meowstic", "Meowstic-F"],
		num: -41,
		gen: 9,
		isNonstandard: null,
	},
	identitycard: { 
		name: "Identity Card",
		shortDesc: "Holder's typing cannot be changed by any move.",
		// Edited in scripts.ts
		num: -42,
		gen: 9,
		isNonstandard: null,
	},
	bananapeel: {
		name: "Banana Peel",
		onStart(pokemon) {
			if (pokemon.baseSpecies.name === 'Tropius' || pokemon.baseSpecies.name === 'Sautropius') {
				pokemon.useItem();
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect && (effect.id === 'stealthrock' || effect.id === 'spikes' || effect.id === 'toxicspikes' || effect.id === 'stickyweb')) {
				return false;
			}
		},
		boosts: {
			atk: 1,
		},
		desc: "If holder is Tropius or Sautropius, raises holder's Attack by 1 stage, and on switch-in, this Pokemon avoids all hazards. Single use.",
		itemUser: ["Tropius", "Sautropius"],
		num: -43,
		gen: 9,
		isNonstandard: null,
	},
	relicsheet: {
		name: "Relic Sheet",
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Meloetta') {
				pokemon.formeChange('Meloetta-Pirouette');
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Meloetta') return false;
			return true;
		},
		itemUser: ["Meloetta", "Meloetta-Pirouette"],
		num: -44,
		gen: 9,
		desc: "If held by Meloetta: Pirouette form on entry.",
		isNonstandard: null,
	},
	lightball: {
		inherit: true,
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
				return this.chainModify(2);
			}
			if (pokemon.baseSpecies.baseSpecies === 'Raichu' || pokemon.baseSpecies.baseSpecies === 'Raichu-Alola' || pokemon.baseSpecies.baseSpecies === 'Plusle' || pokemon.baseSpecies.baseSpecies === 'Togedemaru' || pokemon.baseSpecies.baseSpecies === 'Morpeko' || pokemon.baseSpecies.baseSpecies === 'Morpeko-Hangry' || pokemon.baseSpecies.baseSpecies === 'Pawmot') {
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Minun' || pokemon.baseSpecies.baseSpecies === 'Pachirisu' || pokemon.baseSpecies.baseSpecies === 'Togedemaru') {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
				return this.chainModify(2);
			}
			if (pokemon.baseSpecies.baseSpecies === 'Raichu' || pokemon.baseSpecies.baseSpecies === 'Raichu-Alola' || pokemon.baseSpecies.baseSpecies === 'Plusle' || pokemon.baseSpecies.baseSpecies === 'Dedenne') {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 1,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Minun' || pokemon.baseSpecies.baseSpecies === 'Emolga' || pokemon.baseSpecies.baseSpecies === 'Pawmot') {
				return this.chainModify(1.5);
			}
		},
		onModifySpePriority: 1,
		onModifySpe(spe, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Pachirisu' || pokemon.baseSpecies.baseSpecies === 'Emolga' || pokemon.baseSpecies.baseSpecies === 'Dedenne' || pokemon.baseSpecies.baseSpecies === 'Morpeko' || pokemon.baseSpecies.baseSpecies === 'Morpeko-Hangry') {
				return this.chainModify(1.5);
			}
		},
		itemUser: ["Pikachu", "Pikachu-Cosplay", "Pikachu-Rock-Star", "Pikachu-Belle", "Pikachu-Pop-Star", "Pikachu-PhD", "Pikachu-Libre", "Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner", "Pikachu-Starter", "Pikachu-World",
			"Pichu", "Plusle", "Minun", "Pachirisu", "Emolga", "Dedenne", "Togedemaru", "Raichu", "Raichu-Alola", "Morpeko", "Morpeko-Hangry", "Pawmi", "Pawmo", "Pawmot"
		],
		shortDesc: "If held by a Pikachu, or a Pikaclone, stats are boosted depending on the user.",
	},
	leek: {
		inherit: true,
		onModifyCritRatio(critRatio, user) {
			if (["farfetchd", "sirfetchd"].includes(this.toID(user.baseSpecies.baseSpecies))) {
				return 5;
			}
		},
		shortDesc: "If held by a Farfetch’d or Sirfetch’d, its moves will always crit.",
		desc: "If held by a Farfetch’d or Sirfetch’d, its moves will always crit.",
	},
	anticamulet: {
		name: "Antic Amulet",
		num: -45,
		gen: 9,
		shortDesc: "Sigilyph: all abilities active at once, cannot have its abilities changed.",
		onStart(target) {
			if (target.baseSpecies.baseSpecies != 'Sigilyph') return;
			this.add('-item', target, 'Antic Amulet');
			target.m.innates = Object.keys(target.species.abilities)
					.map(key => this.toID(target.species.abilities[key as "0" | "1" | "H" | "S"]))
					.filter(ability => ability !== target.ability);
			if (target.m.innates) {
				for (const innate of target.m.innates) {
					if (target.hasAbility(innate)) continue;
					target.addVolatile("ability:" + innate, target);
				}
			}
		},
		onSetAbility(ability, target, source, effect) {
			if (target.baseSpecies.baseSpecies != 'Sigilyph') return;
			if (effect && effect.effectType === 'Ability' && effect.name !== 'Trace') {
				this.add('-ability', source, effect);
			}
			this.add('-block', target, 'item: Antic Amulet');
			return null;
		},
		itemUser: ["Sigilyph"],
		onTakeItem(item, source) {
			if (item.itemUser == source.baseSpecies.baseSpecies) return false;
			return true;
		},
		isNonstandard: null,
	},
	helixfossil: {
		inherit: true,
		shortDesc: "Can be revived into Omanyte. Omastar-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Omastar-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Omastar') return false;
			return true;
		},
		forcedForme: "Omastar-Revived",
		itemUser: ["Omastar-Revived"],
	},
	domefossil: {
		inherit: true,
		shortDesc: "Can be revived into Kabuto. Kabutops-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Kabutops-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Kabutops') return false;
			return true;
		},
		forcedForme: "Kabutops-Revived",
		itemUser: ["Kabutops-Revived"],
	},
	rootfossil: {
		inherit: true,
		shortDesc: "Can be revived into Lileep. Cradily-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Cradily-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Cradily') return false;
			return true;
		},
		forcedForme: "Cradily-Revived",
		itemUser: ["Cradily-Revived"],
	},
	clawfossil: {
		inherit: true,
		shortDesc: "Can be revived into Anorith. Armaldo-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Armaldo-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Armaldo') return false;
			return true;
		},
		forcedForme: "Armaldo-Revived",
		itemUser: ["Armaldo-Revived"],
	},
	skullfossil: {
		inherit: true,
		shortDesc: "Can be revived into Cranidos. Rampardos-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Rampardos-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Rampardos') return false;
			return true;
		},
		forcedForme: "Rampardos-Revived",
		itemUser: ["Rampardos-Revived"],
	},
	armorfossil: {
		inherit: true,
		shortDesc: "Can be revived into Shieldon. Bastiodon-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Bastiodon-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Bastiodon') return false;
			return true;
		},
		forcedForme: "Bastiodon-Revived",
		itemUser: ["Bastiodon-Revived"],
	},
	coverfossil: {
		inherit: true,
		shortDesc: "Can be revived into Tirtouga. Carracosta-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Carracosta-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Carracosta') return false;
			return true;
		},
		forcedForme: "Carracosta-Revived",
		itemUser: ["Carracosta-Revived"],
	},
	plumefossil: {
		inherit: true,
		shortDesc: "Can be revived into Archen. Archeops-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Archeops-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Archeops') return false;
			return true;
		},
		forcedForme: "Archeops-Revived",
		itemUser: ["Archeops-Revived"],
	},
	jawfossil: {
		inherit: true,
		shortDesc: "Can be revived into Tyrunt. Tyrantrum-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Tyrantrum-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Tyrantrum') return false;
			return true;
		},
		forcedForme: "Tyrantrum-Revived",
		itemUser: ["Tyrantrum-Revived"],
	},
	sailfossil: {
		inherit: true,
		shortDesc: "Can be revived into Amaura. Aurorus-Revived: 1.2x power attacks.",
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Aurorus-Revived')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Aurorus') return false;
			return true;
		},
		forcedForme: "Aurorus-Revived",
		itemUser: ["Aurorus-Revived"],
	},
	// everlasting winter
	safetygoggles: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'everlastingwinter' || type === 'powder') return false;
		},
	},

	// Silvally Memories section
	bugmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	dragonmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	electricmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	fightingmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	firememory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	flyingmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	ghostmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	grassmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	groundmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	icememory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	poisonmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	psychicmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	rockmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	steelmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	watermemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	fairymemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
	darkmemory: {
		inherit: true,
		shortDesc: "No longer needed to transform.",
	},
}