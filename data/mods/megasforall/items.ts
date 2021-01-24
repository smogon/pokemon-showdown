export const Items: {[itemid: string]: ModdedItemData} = {
	dragonitite: {
		name: "Dragonitite",
		spritenum: 586,
		megaStone: "Dragonite-Mega",
		megaEvolves: "Dragonite",
		itemUser: ["Dragonite"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1001,
		gen: 8,
		desc: "If held by a Dragonite, this item allows it to Mega Evolve in battle.",
	},
	hydreigonite: {
		name: "Hydreigonite",
		spritenum: 585,
		megaStone: "Hydreigon-Mega",
		megaEvolves: "Hydreigon",
		itemUser: ["Hydreigon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1002,
		gen: 8,
		desc: "If held by a Hydreigon, this item allows it to Mega Evolve in battle.",
	},
	goodranite: {
		name: "Goodranite",
		spritenum: 577,
		megaStone: "Goodra-Mega",
		megaEvolves: "Goodra",
		itemUser: ["Goodra"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1003,
		gen: 8,
		desc: "If held by a Goodra, this item allows it to Mega Evolve in battle.",
	},
	kommonite: {
		name: "Kommonite",
		spritenum: 580,
		megaStone: "Kommo-o-Mega",
		megaEvolves: "Kommo-o",
		itemUser: ["Kommo-o"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1004,
		gen: 8,
		desc: "If held by a Kommo-o, this item allows it to Mega Evolve in battle.",
	},
	dragapultite: {
		name: "Dragapultite",
		spritenum: 600,
		megaStone: "Dragapult-Mega",
		megaEvolves: "Dragapult",
		itemUser: ["Dragapult"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1005,
		gen: 8,
		desc: "If held by a Dragapult, this item allows it to Mega Evolve in battle.",
	},
	corviknite: {
		name: "Corviknite",
		spritenum: 578,
		megaStone: "Corviknight-Mega",
		megaEvolves: "Corviknight",
		itemUser: ["Corviknight"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1006,
		gen: 8,
		desc: "If held by a Corviknight, this item allows it to Mega Evolve in battle.",
	},
	orbeetlite: {
		name: "Orbeetlite",
		spritenum: 584,
		megaStone: "Orbeetle-Mega",
		megaEvolves: "Orbeetle",
		itemUser: ["Orbeetle"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1007,
		gen: 8,
		desc: "If held by an Orbeetle, this item allows it to Mega Evolve in battle.",
	},
	thievulite: {
		name: "Thievulite",
		spritenum: 591,
		megaStone: "Thievul-Mega",
		megaEvolves: "Thievul",
		itemUser: ["Thievul"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1008,
		gen: 8,
		desc: "If held by a Thievul, this item allows it to Mega Evolve in battle.",
	},
	toucannonite: {
		name: "Toucannonite",
		spritenum: 625,
		megaStone: "Toucannon-Mega",
		megaEvolves: "Toucannon",
		itemUser: ["Toucannon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1009,
		gen: 8,
		desc: "If held by a Toucannon, this item allows it to Mega Evolve in battle.",
	},
	gumshoosite: {
		name: "Gumshoosite",
		spritenum: 622,
		megaStone: "Gumshoos-Mega",
		megaEvolves: "Gumshoos",
		itemUser: ["Gumshoos"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1010,
		gen: 8,
		desc: "If held by a Gumshoos, this item allows it to Mega Evolve in battle.",
	},
	lycanite: {
		name: "Lycanite",
		spritenum: 602,
		megaStone: "Lycanroc-Mega",
		megaEvolves: "Lycanroc",
		itemUser: ["Lycanroc"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1011,
		gen: 8,
		desc: "If held by a Lycanroc, this item allows it to Mega Evolve in battle.",
	},
	electricseed: {
		name: "Electric Seed",
		spritenum: 664,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('electricterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		onAnyTerrainStart() {
			const pokemon = this.effectData.target;
			if (this.field.isTerrain('electricterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		boosts: {
			def: 1,
		},
		num: 881,
		gen: 7,
		desc: "If the terrain is Electric Terrain, raises holder's Defense by 1 stage. Single use.",
	},
	psychicseed: {
		name: "Psychic Seed",
		spritenum: 665,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('psychicterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		onAnyTerrainStart() {
			const pokemon = this.effectData.target;
			if (this.field.isTerrain('psychicterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		boosts: {
			spd: 1,
		},
		num: 882,
		gen: 7,
		desc: "If the terrain is Psychic Terrain, raises holder's Sp. Def by 1 stage. Single use.",
	},
	mistyseed: {
		name: "Misty Seed",
		spritenum: 666,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('mistyterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		onAnyTerrainStart() {
			const pokemon = this.effectData.target;
			if (this.field.isTerrain('mistyterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		boosts: {
			spd: 1,
		},
		num: 883,
		gen: 7,
		desc: "If the terrain is Misty Terrain, raises holder's Sp. Def by 1 stage. Single use.",
	},
	grassyseed: {
		name: "Grassy Seed",
		spritenum: 667,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('grassyterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		onAnyTerrainStart() {
			const pokemon = this.effectData.target;
			if (this.field.isTerrain('grassyterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		boosts: {
			def: 1,
		},
		num: 884,
		gen: 7,
		desc: "If the terrain is Grassy Terrain, raises holder's Defense by 1 stage. Single use.",
	},
	vikavoltite: {
		name: "Vikavoltite",
		spritenum: 607,
		megaStone: "Vikavolt-Mega",
		megaEvolves: "Vikavolt",
		itemUser: ["Vikavolt"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1012,
		gen: 8,
		desc: "If held by a Vikavolt, this item allows it to Mega Evolve in battle.",
	},
	raichunite: {
		name: "Raichunite",
		spritenum: 628,
		megaStone: "Raichu-Mega",
		megaEvolves: "Raichu",
		itemUser: ["Raichu"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1013,
		gen: 8,
		desc: "If held by a Raichu, this item allows it to Mega Evolve in battle.",
	},
	clefabite: {
		name: "Clefabite",
		spritenum: 617,
		megaStone: "Clefable-Mega",
		megaEvolves: "Clefable",
		itemUser: ["Clefable"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1014,
		gen: 8,
		desc: "If held by a Clefable, this item allows it to Mega Evolve in battle.",
	},
	rillaboomite: {
		name: "Rillaboomite",
		spritenum: 613,
		megaStone: "Rillaboom-Mega",
		megaEvolves: "Rillaboom",
		itemUser: ["Rillaboom"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1015,
		gen: 8,
		desc: "If held by a Rillaboom, this item allows it to Mega Evolve in battle.",
	},
	cinderite: {
		name: "Cinderite",
		spritenum: 590,
		megaStone: "Cinderace-Mega",
		megaEvolves: "Cinderace",
		itemUser: ["Cinderace"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1016,
		gen: 8,
		desc: "If held by a Cinderace, this item allows it to Mega Evolve in battle.",
	},
	inteleonite: {
		name: "Inteleonite",
		spritenum: 608,
		megaStone: "Inteleon-Mega",
		megaEvolves: "Inteleon",
		itemUser: ["Inteleon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1017,
		gen: 8,
		desc: "If held by an Inteleon, this item allows it to Mega Evolve in battle.",
	},
	klinklite: {
		name: "Klinklite",
		spritenum: 578,
		megaStone: "Klinklang-Mega",
		megaEvolves: "Klinklang",
		itemUser: ["Klinklang"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1018,
		gen: 8,
		desc: "If held by a Klinklang, this item allows it to Mega Evolve in battle.",
	},
	vanillite: {
		name: "Vanillite",
		spritenum: 578,
		megaStone: "Vanilluxe-Mega",
		megaEvolves: "Vanilluxe",
		itemUser: ["Vanilluxe"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1019,
		gen: 8,
		desc: "If held by a Vanilluxe, this item allows it to Mega Evolve in battle.",
	},
	garbodorite: {
		name: "Garbodorite",
		spritenum: 578,
		megaStone: "Garbodor-Mega",
		megaEvolves: "Garbodor",
		itemUser: ["Garbodor"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1020,
		gen: 8,
		desc: "If held by a Garbodor, this item allows it to Mega Evolve in battle.",
	},
	vaporeonite: {
		name: "Vaporeonite",
		spritenum: 578,
		megaStone: "Vaporeon-Mega",
		megaEvolves: "Vaporeon",
		itemUser: ["Vaporeon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1021,
		gen: 8,
		desc: "If held by a Vaporeon, this item allows it to Mega Evolve in battle.",
	},
	jolteonite: {
		name: "Jolteonite",
		spritenum: 578,
		megaStone: "Jolteon-Mega",
		megaEvolves: "Jolteon",
		itemUser: ["Jolteon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1022,
		gen: 8,
		desc: "If held by a Jolteon, this item allows it to Mega Evolve in battle.",
	},
	flareonite: {
		name: "Flareonite",
		spritenum: 578,
		megaStone: "Flareon-Mega",
		megaEvolves: "Flareon",
		itemUser: ["Flareon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1023,
		gen: 8,
		desc: "If held by a Flareon, this item allows it to Mega Evolve in battle.",
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
		num: -1024,
		gen: 8,
		desc: "If held by a Butterfree, this item allows it to Mega Evolve in battle.",
	},
	slowkinite: {
		name: "Slowkinite",
		spritenum: 578,
		megaStone: "Slowking-Mega",
		megaEvolves: "Slowking",
		itemUser: ["Slowking"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1025,
		gen: 8,
		desc: "If held by a Slowking, this item allows it to Mega Evolve in battle.",
	},
	froslassite: {
		name: "Froslassite",
		spritenum: 578,
		megaStone: "Froslass-Mega",
		megaEvolves: "Froslass",
		itemUser: ["Froslass"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1026,
		gen: 8,
		desc: "If held by a Froslass, this item allows it to Mega Evolve in battle.",
	},
	conkeldite: {
		name: "Conkeldite",
		spritenum: 578,
		megaStone: "Conkeldurr-Mega",
		megaEvolves: "Conkeldurr",
		itemUser: ["Conkeldurr"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1027,
		gen: 8,
		desc: "If held by a Conkeldurr, this item allows it to Mega Evolve in battle.",
	},
	gothitite: {
		name: "Gothitite",
		spritenum: 578,
		megaStone: "Gothitelle-Mega",
		megaEvolves: "Gothitelle",
		itemUser: ["Gothitelle"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1028,
		gen: 8,
		desc: "If held by a Gothitelle, this item allows it to Mega Evolve in battle.",
	},
	chandelite: {
		name: "Chandelite",
		spritenum: 578,
		megaStone: "Chandelure-Mega",
		megaEvolves: "Chandelure",
		itemUser: ["Chandelure"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1029,
		gen: 8,
		desc: "If held by a Chandelure, this item allows it to Mega Evolve in battle.",
	},
	bisharpite: {
		name: "Bisharpite",
		spritenum: 578,
		megaStone: "Bisharp-Mega",
		megaEvolves: "Bisharp",
		itemUser: ["Bisharp"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1030,
		gen: 8,
		desc: "If held by a Bisharp, this item allows it to Mega Evolve in battle.",
	},
	gigalite: {
		name: "Gigalite",
		spritenum: 578,
		megaStone: "Gigalith-Mega",
		megaEvolves: "Gigalith",
		itemUser: ["Gigalith"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1031,
		gen: 8,
		desc: "If held by a Gigalith, this item allows it to Mega Evolve in battle.",
	},
	reunite: {
		name: "Reunite",
		spritenum: 578,
		megaStone: "Reuniclus-Mega",
		megaEvolves: "Reuniclus",
		itemUser: ["Reuniclus"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1032,
		gen: 8,
		desc: "If held by a Reuniclus, this item allows it to Mega Evolve in battle.",
	},
	boltundite: {
		name: "Boltundite",
		spritenum: 578,
		megaStone: "Boltund-Mega",
		megaEvolves: "Boltund",
		itemUser: ["Boltund"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1033,
		gen: 8,
		desc: "If held by a Boltund, this item allows it to Mega Evolve in battle.",
	},
	luxrite: {
		name: "Luxrite",
		spritenum: 578,
		megaStone: "Luxray-Mega",
		megaEvolves: "Luxray",
		itemUser: ["Luxray"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1034,
		gen: 8,
		desc: "If held by a Luxray, this item allows it to Mega Evolve in battle.",
	},
	archeonite: {
		name: "Archeonite",
		spritenum: 578,
		megaStone: "Archeops-Mega",
		megaEvolves: "Archeops",
		itemUser: ["Archeops"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1035,
		gen: 8,
		desc: "If held by an Archeops, this item allows it to Mega Evolve in battle.",
	},
	talonflite: {
		name: "Talonflite",
		spritenum: 578,
		megaStone: "Talonflame-Mega",
		megaEvolves: "Talonflame",
		itemUser: ["Talonflame"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1036,
		gen: 8,
		desc: "If held by a Talonflame, this item allows it to Mega Evolve in battle.",
	},
	staraptorite: {
		name: "Staraptorite",
		spritenum: 578,
		megaStone: "Staraptor-Mega",
		megaEvolves: "Staraptor",
		itemUser: ["Staraptor"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1037,
		gen: 8,
		desc: "If held by a Staraptor, this item allows it to Mega Evolve in battle.",
	},
	bibarelite: {
		name: "Bibarelite",
		spritenum: 578,
		megaStone: "Bibarel-Mega",
		megaEvolves: "Bibarel",
		itemUser: ["Bibarel"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1038,
		gen: 8,
		desc: "If held by a Bibarel, this item allows it to Mega Evolve in battle.",
	},
	kricketite: {
		name: "Kricketite",
		spritenum: 578,
		megaStone: "Kricketune-Mega",
		megaEvolves: "Kricketune",
		itemUser: ["Kricketune"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1039,
		gen: 8,
		desc: "If held by a Kricketune, this item allows it to Mega Evolve in battle.",
	},
	mismaginite: {
		name: "Mismaginite",
		spritenum: 578,
		megaStone: "Mismagius-Mega",
		megaEvolves: "Mismagius",
		itemUser: ["Mismagius"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1040,
		gen: 8,
		desc: "If held by a Mismagius, this item allows it to Mega Evolve in battle.",
	},
	honchkronite: {
		name: "Honchkronite",
		spritenum: 578,
		megaStone: "Honchkrow-Mega",
		megaEvolves: "Honchkrow",
		itemUser: ["Honchkrow"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1041,
		gen: 8,
		desc: "If held by a Honchkrow, this item allows it to Mega Evolve in battle.",
	},
	oddkeystone: {
		name: "Odd Keystone",
		spritenum: 578,
		megaStone: "Spiritomb-Mega",
		megaEvolves: "Spiritomb",
		itemUser: ["Spiritomb"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1042,
		gen: 8,
		desc: "If held by a Spiritomb, this item allows it to Mega Evolve in battle.",
	},
	ariadosite: {
		name: "Ariadosite",
		spritenum: 578,
		megaStone: "Ariados-Mega",
		megaEvolves: "Ariados",
		itemUser: ["Ariados"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1043,
		gen: 8,
		desc: "If held by an Ariados, this item allows it to Mega Evolve in battle.",
	},
	gourgeite: {
		name: "Gourgeite",
		spritenum: 578,
		megaStone: "Gourgeist-Mega",
		megaEvolves: "Gourgeist",
		itemUser: ["Gourgeist"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1044,
		gen: 8,
		desc: "If held by a Gourgeist, this item allows it to Mega Evolve in battle. The effect is different depending on the base form's size!",
	},
	mimikyunite: {
		name: "Mimikyunite",
		spritenum: 578,
		megaStone: "Mimikyu-Mega",
		megaEvolves: "Mimikyu",
		itemUser: ["Mimikyu"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1045,
		gen: 8,
		desc: "If held by a Mimikyu, this item allows it to Mega Evolve in battle. The effect is different depending on the base form's Disguise!",
	},
	nidoqueenite: {
		name: "Nidoqueenite",
		spritenum: 578,
		megaStone: "Nidoqueen-Mega",
		megaEvolves: "Nidoqueen",
		itemUser: ["Nidoqueen"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1046,
		gen: 8,
		desc: "If held by a Nidoqueen, this item allows it to Mega Evolve in battle.",
	},
	walreinite: {
		name: "Walreinite",
		spritenum: 578,
		megaStone: "Walrein-Mega",
		megaEvolves: "Walrein",
		itemUser: ["Walrein"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1047,
		gen: 8,
		desc: "If held by a Walrein, this item allows it to Mega Evolve in battle.",
	},
	aurorite: {
		name: "Aurorite",
		spritenum: 578,
		megaStone: "Aurorus-Mega",
		megaEvolves: "Aurorus",
		itemUser: ["Aurorus"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1048,
		gen: 8,
		desc: "If held by an Aurorus, this item allows it to Mega Evolve in battle.",
	},
	nidokinite: {
		name: "Nidokinite",
		spritenum: 578,
		megaStone: "Nidoking-Mega",
		megaEvolves: "Nidoking",
		itemUser: ["Nidoking"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1049,
		gen: 8,
		desc: "If held by a Nidoking, this item allows it to Mega Evolve in battle.",
	},
	tyranite: {
		name: "Tyranite",
		spritenum: 578,
		megaStone: "Tyrantrum-Mega",
		megaEvolves: "Tyrantrum",
		itemUser: ["Tyrantrum"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1050,
		gen: 8,
		desc: "If held by a Tyrantrum, this item allows it to Mega Evolve in battle.",
	},
	trevenite: {
		name: "Trevenite",
		spritenum: 578,
		megaStone: "Trevenant-Mega",
		megaEvolves: "Trevenant",
		itemUser: ["Trevenant"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1051,
		gen: 8,
		desc: "If held by a Trevenant, this item allows it to Mega Evolve in battle.",
	},
	eelektrossite: {
		name: "Eelektrossite",
		spritenum: 578,
		megaStone: "Eelektross-Mega",
		megaEvolves: "Eelektross",
		itemUser: ["Eelektross"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1052,
		gen: 8,
		desc: "If held by an Eelektross, this item allows it to Mega Evolve in battle.",
	},
	dragalgite: {
		name: "Dragalgite",
		spritenum: 578,
		megaStone: "Dragalge-Mega",
		megaEvolves: "Dragalge",
		itemUser: ["Dragalge"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1053,
		gen: 8,
		desc: "If held by a Dragalge, this item allows it to Mega Evolve in battle.",
	},
	acidicseed: {
		name: "Acidic Seed",
		spritenum: 666,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('acidicterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		onAnyTerrainStart() {
			const pokemon = this.effectData.target;
			if (this.field.isTerrain('acidicterrain')) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents Seed use');
						return;
					}
				}
				pokemon.useItem();
			}
		},
		boosts: {
			spd: 1,
		},
		num: -1054,
		gen: 8,
		desc: "If the terrain is Acidic Terrain, raises holder's Sp. Def by 1 stage. Single use.",
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
		num: -1055,
		gen: 8,
		desc: "If held by a Dhelmise, this item allows it to Mega Evolve in battle.",
	},
	meganiumite: {
		name: "Meganiumite",
		spritenum: 578,
		megaStone: "Meganium-Mega",
		megaEvolves: "Meganium",
		itemUser: ["Meganium"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1056,
		gen: 8,
		desc: "If held by a Meganium, this item allows it to Mega Evolve in battle.",
	},
	typhlosionite: {
		name: "Typhlosionite",
		spritenum: 578,
		megaStone: "Typhlosion-Mega",
		megaEvolves: "Typhlosion",
		itemUser: ["Typhlosion"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1057,
		gen: 8,
		desc: "If held by a Typhlosion, this item allows it to Mega Evolve in battle.",
	},
	feraligatrite: {
		name: "Feraligatrite",
		spritenum: 578,
		megaStone: "Feraligatr-Mega",
		megaEvolves: "Feraligatr",
		itemUser: ["Feraligatr"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1058,
		gen: 8,
		desc: "If held by a Feraligatr, this item allows it to Mega Evolve in battle.",
	},
	reginite: {
		name: "Reginite",
		spritenum: 578,
		megaStone: "Regirock-Mega",
		megaEvolves: "Regirock",
		itemUser: ["Regirock"],
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Regirock') return false;
			if (source.baseSpecies.baseSpecies === 'Regice') return false;
			if (source.baseSpecies.baseSpecies === 'Registeel') return false;
			return true;
		},
		num: -1059,
		gen: 8,
		desc: "If held by a Regirock, Regice or Registeel, this item allows it to Mega Evolve in battle.",
	},
	magcargonite: {
		name: "Magcargonite",
		spritenum: 578,
		megaStone: "Magcargo-Mega",
		megaEvolves: "Magcargo",
		itemUser: ["Magcargo"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1060,
		gen: 8,
		desc: "If held by a Magcargo, this item allows it to Mega Evolve in battle.",
	},
	bastiodite: {
		name: "Bastiodite",
		spritenum: 578,
		megaStone: "Bastiodon-Mega",
		megaEvolves: "Bastiodon",
		itemUser: ["Bastiodon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1061,
		gen: 8,
		desc: "If held by a Bastiodon, this item allows it to Mega Evolve in battle.",
	},
	leavannite: {
		name: "Leavannite",
		spritenum: 578,
		megaStone: "Leavanny-Mega",
		megaEvolves: "Leavanny",
		itemUser: ["Leavanny"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1062,
		gen: 8,
		desc: "If held by a Leavanny, this item allows it to Mega Evolve in battle.",
	},
	parasite: {
		name: "Parasite",
		spritenum: 578,
		megaStone: "Parasect-Mega",
		megaEvolves: "Parasect",
		itemUser: ["Parasect"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1063,
		gen: 8,
		desc: "If held by a Parasect, this item allows it to Mega Evolve in battle.",
	},
	samurite: {
		name: "Samurite",
		spritenum: 578,
		megaStone: "Samurott-Mega",
		megaEvolves: "Samurott",
		itemUser: ["Samurott"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1064,
		gen: 8,
		desc: "If held by a Samurott, this item allows it to Mega Evolve in battle.",
	},
	meowsticite: {
		name: "Meowsticite",
		spritenum: 578,
		megaStone: "Meowstic-Mega",
		megaEvolves: "Meowstic",
		itemUser: ["Meowstic"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1065,
		gen: 8,
		desc: "If held by a Meowstic, this item allows it to Mega Evolve in battle.",
	},
	starminite: {
		name: "Starminite",
		spritenum: 578,
		megaStone: "Starmie-Mega",
		megaEvolves: "Starmie",
		itemUser: ["Starmie"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1066,
		gen: 8,
		desc: "If held by a Starmie, this item allows it to Mega Evolve in battle.",
	},
	delibirdite: {
		name: "Delibirdite",
		spritenum: 578,
		megaStone: "Delibird-Mega",
		megaEvolves: "Delibird",
		itemUser: ["Delibird"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1067,
		gen: 8,
		desc: "If held by a Delibird, this item allows it to Mega Evolve in battle.",
	},
	airballoon: {
		name: "Air Balloon",
		spritenum: 6,
		fling: {
			basePower: 10,
		},
		onStart(target) {
			if (!target.ignoringItem() && !this.field.getPseudoWeather('gravity')) {
				this.add('-item', target, 'Air Balloon');
			}
		},
		// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		onDamagingHit(damage, target, source, move) {
			this.add('-enditem', target, 'Air Balloon');
			target.item = '';
			(target as any).lostItemForDelibird = this.dex.getItem('airballoon');
			target.itemData = {id: '', target};
			this.runEvent('AfterUseItem', target, null, null, this.dex.getItem('airballoon'));
		},
		onAfterSubDamage(damage, target, source, effect) {
			this.debug('effect: ' + effect.id);
			if (effect.effectType === 'Move') {
				this.add('-enditem', target, 'Air Balloon');
				target.item = '';
				target.itemData = {id: '', target};
				this.runEvent('AfterUseItem', target, null, null, this.dex.getItem('airballoon'));
			}
		},
		num: 541,
		gen: 5,
	},
	sawsbuckite: {
		name: "Sawsbuckite",
		spritenum: 578,
		megaStone: "Sawsbuck-Mega",
		megaEvolves: "Sawsbuck",
		itemUser: ["Sawsbuck"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			if (source.baseSpecies.baseSpecies === 'Delibird') return false;
			return true;
		},
		num: -1068,
		gen: 8,
		desc: "If held by a Sawsbuck or a Delibird, this item allows it to Mega Evolve in battle.",
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
		num: -1069,
		gen: 8,
		desc: "If held by a Flygon, this item allows it to Mega Evolve in battle.",
	},
	drapionite: {
		name: "Drapionite",
		spritenum: 578,
		megaStone: "Drapion-Mega",
		megaEvolves: "Drapion",
		itemUser: ["Drapion"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1070,
		gen: 8,
		desc: "If held by a Drapion, this item allows it to Mega Evolve in battle.",
	},
	lurantisite: {
		name: "Lurantisite",
		spritenum: 578,
		megaStone: "Lurantis-Mega",
		megaEvolves: "Lurantis",
		itemUser: ["Lurantis"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1071,
		gen: 8,
		desc: "If held by a Lurantis, this item allows it to Mega Evolve in battle.",
	},
	exploudite: {
		name: "Exploudite",
		spritenum: 578,
		megaStone: "Exploud-Mega",
		megaEvolves: "Exploud",
		itemUser: ["Exploud"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1072,
		gen: 8,
		desc: "If held by an Exploud, this item allows it to Mega Evolve in battle.",
	},
	noivernite: {
		name: "Noivernite",
		spritenum: 578,
		megaStone: "Noivern-Mega",
		megaEvolves: "Noivern",
		itemUser: ["Noivern"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1073,
		gen: 8,
		desc: "If held by a Noivern, this item allows it to Mega Evolve in battle.",
	},
	toxtricitite: {
		name: "Toxtricitite",
		spritenum: 578,
		megaStone: "Toxtricity-Mega",
		megaEvolves: "Toxtricity",
		itemUser: ["Toxtricity"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1074,
		gen: 8,
		desc: "If held by a Toxtricity, this item allows it to Mega Evolve in battle.",
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
		num: -1075,
		gen: 8,
		desc: "If held by a Cacturne, this item allows it to Mega Evolve in battle.",
	},
	hawluchanite: {
		name: "Hawluchanite",
		spritenum: 578,
		megaStone: "Hawlucha-Mega",
		megaEvolves: "Hawlucha",
		itemUser: ["Hawlucha"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1076,
		gen: 8,
		desc: "If held by a Hawlucha, this item allows it to Mega Evolve in battle.",
	},
	araquanite: {
		name: "Araquanite",
		spritenum: 578,
		megaStone: "Araquanid-Mega",
		megaEvolves: "Araquanid",
		itemUser: ["Araquanid"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1077,
		gen: 8,
		desc: "If held by an Araquanid, this item allows it to Mega Evolve in battle.",
	},
};
