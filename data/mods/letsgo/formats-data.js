'use strict';

/**@type {{[k: string]: ModdedTemplateFormatsData}} */
let BattleFormatsData = {
	bulbasaur: {
		inherit: true,
		eventPokemon: [
			{"generation": 7, "level": 12, "shiny": 1, "ivs": {hp: 31, atk: 25, def: 30, spa: 25, spd: 30, spe: 25}, "moves": ["leechseed", "vinewhip", "growl", "tackle"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	ivysaur: {
		inherit: true,
		tier: "NFE",
	},
	venusaur: {
		inherit: true,
		randomBattleMoves: [],
		tier: "OU",
		doublesTier: "DOU",
	},
	venusaurmega: {
		inherit: true,
		randomBattleMoves: ["leechseed", "sludgebomb", "megadrain", "sleeppowder", "earthquake"],
		tier: "OU",
		doublesTier: "DOU",
	},
	charmander: {
		inherit: true,
		eventPokemon: [
			{"generation": 7, "level": 14, "shiny": 1, "ivs": {hp: 25, atk: 30, def: 25, spa: 30, spd: 25, spe: 31}, "moves": ["ember", "smokescreen", "growl", "scratch"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	charmeleon: {
		inherit: true,
		tier: "NFE",
	},
	charizard: {
		inherit: true,
		randomBattleMoves: [],
		tier: "OU",
		doublesTier: "DOU",
	},
	charizardmegax: {
		inherit: true,
		randomBattleMoves: ["roost", "flareblitz", "outrage", "earthquake", "willowisp"],
		tier: "OU",
		doublesTier: "DOU",
	},
	charizardmegay: {
		inherit: true,
		randomBattleMoves: ["airslash", "roost", "dragonpulse", "flamethrower", "fireblast"],
		tier: "OU",
		doublesTier: "DOU",
	},
	squirtle: {
		inherit: true,
		eventPokemon: [
			{"generation": 7, "level": 16, "shiny": 1, "ivs": {hp: 25, atk: 25, def: 30, spa: 31, spd: 30, spe: 25}, "moves": ["withdraw", "bubble", "tailwhip", "tackle"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	wartortle: {
		inherit: true,
		tier: "NFE",
	},
	blastoise: {
		inherit: true,
		randomBattleMoves: [],
		tier: "UU",
		doublesTier: "DOU",
	},
	blastoisemega: {
		inherit: true,
		randomBattleMoves: ["icebeam", "scald", "darkpulse", "toxic", "hydropump"],
		tier: "UU",
		doublesTier: "DOU",
	},
	caterpie: {
		inherit: true,
		tier: "LC",
	},
	metapod: {
		inherit: true,
		tier: "NFE",
	},
	butterfree: {
		inherit: true,
		randomBattleMoves: ["bugbuzz", "quiverdance", "airslash", "sleeppowder"],
		tier: "UU",
		doublesTier: "DOU",
	},
	weedle: {
		inherit: true,
		tier: "LC",
	},
	kakuna: {
		inherit: true,
		tier: "NFE",
	},
	beedrill: {
		inherit: true,
		randomBattleMoves: [],
		tier: "UU",
		doublesTier: "DOU",
	},
	beedrillmega: {
		inherit: true,
		randomBattleMoves: ["drillrun", "poisonjab", "uturn", "xscissor", "brickbreak"],
		tier: "UU",
		doublesTier: "DOU",
	},
	pidgey: {
		inherit: true,
		tier: "LC",
	},
	pidgeotto: {
		inherit: true,
		tier: "NFE",
	},
	pidgeot: {
		inherit: true,
		randomBattleMoves: [],
		tier: "UU",
		doublesTier: "DOU",
	},
	pidgeotmega: {
		inherit: true,
		randomBattleMoves: ["airslash", "heatwave", "roost", "uturn", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	rattata: {
		inherit: true,
		tier: "LC",
	},
	rattataalola: {
		inherit: true,
		tier: "LC",
	},
	raticate: {
		inherit: true,
		randomBattleMoves: ["swordsdance", "doubleedge", "suckerpunch", "crunch", "irontail"],
		tier: "UU",
		doublesTier: "DOU",
	},
	raticatealola: {
		inherit: true,
		randomBattleMoves: ["suckerpunch", "crunch", "swordsdance", "uturn", "doubleedge"],
		tier: "UU",
		doublesTier: "DOU",
	},
	spearow: {
		inherit: true,
		tier: "LC",
	},
	fearow: {
		inherit: true,
		randomBattleMoves: ["drillpeck", "drillrun", "quickattack", "uturn", "roost"],
		tier: "UU",
		doublesTier: "DOU",
	},
	ekans: {
		inherit: true,
		tier: "LC",
	},
	arbok: {
		inherit: true,
		randomBattleMoves: ["poisonjab", "earthquake", "glare", "suckerpunch", "crunch"],
		tier: "UU",
		doublesTier: "DOU",
	},
	pikachu: {
		inherit: true,
		tier: "LC",
	},
	pikachustarter: {
		inherit: true,
		randomBattleMoves: ["zippyzap", "splishysplash", "thunderbolt", "calmmind", "substitute"],
		isNonstandard: null,
		tier: "UU",
		doublesTier: "DOU",
	},
	raichu: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "fakeout", "brickbreak", "irontail", "substitute"],
		tier: "UU",
		doublesTier: "DOU",
	},
	raichualola: {
		inherit: true,
		randomBattleMoves: ["psychic", "thunderbolt", "calmmind", "encore", "substitute"],
		tier: "UU",
		doublesTier: "DOU",
	},
	sandshrew: {
		inherit: true,
		tier: "LC",
	},
	sandshrewalola: {
		inherit: true,
		tier: "LC",
	},
	sandslash: {
		inherit: true,
		randomBattleMoves: ["earthquake", "rockslide", "stealthrock", "swordsdance", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	sandslashalola: {
		inherit: true,
		randomBattleMoves: ["earthquake", "iceshard", "icepunch", "swordsdance", "stealthrock", "irontail"],
		tier: "UU",
		doublesTier: "DOU",
	},
	nidoranf: {
		inherit: true,
		tier: "LC",
	},
	nidorina: {
		inherit: true,
		tier: "NFE",
	},
	nidoqueen: {
		inherit: true,
		randomBattleMoves: ["earthquake", "stealthrock", "icebeam", "poisonjab", "dragontail"],
		tier: "OU",
		doublesTier: "DOU",
	},
	nidoranm: {
		inherit: true,
		tier: "LC",
	},
	nidorino: {
		inherit: true,
		tier: "NFE",
	},
	nidoking: {
		inherit: true,
		randomBattleMoves: ["earthquake", "poisonjab", "stealthrock", "icepunch", "megahorn"],
		tier: "OU",
		doublesTier: "DOU",
	},
	clefairy: {
		inherit: true,
		tier: "LC",
	},
	clefable: {
		inherit: true,
		randomBattleMoves: ["moonblast", "calmmind", "flamethrower", "stealthrock", "thunderwave", "icebeam"],
		tier: "UU",
		doublesTier: "DOU",
	},
	vulpix: {
		inherit: true,
		tier: "LC",
	},
	vulpixalola: {
		inherit: true,
		tier: "LC",
	},
	ninetales: {
		inherit: true,
		randomBattleMoves: ["flamethrower", "darkpulse", "nastyplot", "willowisp", "fireblast"],
		tier: "UU",
		doublesTier: "DOU",
	},
	ninetalesalola: {
		inherit: true,
		randomBattleMoves: ["dazzlinggleam", "icebeam", "nastyplot", "darkpulse", "substitute"],
		tier: "UU",
		doublesTier: "DOU",
	},
	jigglypuff: {
		inherit: true,
		tier: "LC",
	},
	wigglytuff: {
		inherit: true,
		randomBattleMoves: ["dazzlinggleam", "fireblast", "stealthrock", "icebeam", "bodyslam"],
		tier: "UU",
		doublesTier: "DOU",
	},
	zubat: {
		inherit: true,
		tier: "LC",
	},
	golbat: {
		inherit: true,
		randomBattleMoves: ["toxic", "roost", "taunt", "sludgebomb", "whirlwind", "airslash", "uturn"],
		tier: "UU",
		doublesTier: "DOU",
	},
	oddish: {
		inherit: true,
		tier: "LC",
	},
	gloom: {
		inherit: true,
		tier: "NFE",
	},
	vileplume: {
		inherit: true,
		randomBattleMoves: ["sludgebomb", "moonblast", "sleeppowder", "megadrain", "stunspore"],
		tier: "UU",
		doublesTier: "DOU",
	},
	paras: {
		inherit: true,
		tier: "LC",
	},
	parasect: {
		inherit: true,
		randomBattleMoves: ["leechlife", "spore", "leechseed", "substitute", "brickbreak"],
		tier: "UU",
		doublesTier: "DOU",
	},
	venonat: {
		inherit: true,
		tier: "LC",
	},
	venomoth: {
		inherit: true,
		randomBattleMoves: ["quiverdance", "bugbuzz", "sleeppowder", "sludgebomb", "psychic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	diglett: {
		inherit: true,
		tier: "LC",
	},
	diglettalola: {
		inherit: true,
		tier: "LC",
	},
	dugtrio: {
		inherit: true,
		randomBattleMoves: ["earthquake", "rockslide", "suckerpunch", "stealthrock", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	dugtrioalola: {
		inherit: true,
		randomBattleMoves: ["earthquake", "suckerpunch", "stealthrock", "rockslide", "toxic"],
		tier: "OU",
		doublesTier: "DOU",
	},
	meowth: {
		inherit: true,
		tier: "LC",
	},
	meowthalola: {
		inherit: true,
		tier: "LC",
	},
	persian: {
		inherit: true,
		randomBattleMoves: ["fakeout", "uturn", "taunt", "headbutt", "playrough"],
		eventPokemon: [
			{"generation": 7, "level": 16, "shiny": 1, "ivs": {hp: 30, atk: 30, def: 25, spa: 25, spd: 25, spe: 31}, "moves": ["feint", "payday", "taunt", "fakeout"], "pokeball": "pokeball"},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	persianalola: {
		inherit: true,
		randomBattleMoves: ["darkpulse", "thunderbolt", "uturn", "taunt", "nastyplot"],
		tier: "UU",
		doublesTier: "DOU",
	},
	psyduck: {
		inherit: true,
		tier: "LC",
	},
	golduck: {
		inherit: true,
		randomBattleMoves: ["icebeam", "psychic", "hydropump", "scald", "calmmind"],
		tier: "UU",
		doublesTier: "DOU",
	},
	mankey: {
		inherit: true,
		tier: "LC",
	},
	primeape: {
		inherit: true,
		randomBattleMoves: ["uturn", "brickbreak", "earthquake", "bulkup", "rockslide"],
		tier: "UU",
		doublesTier: "DOU",
	},
	growlithe: {
		inherit: true,
		tier: "LC",
	},
	arcanine: {
		inherit: true,
		randomBattleMoves: ["flareblitz", "willowisp", "crunch", "playrough", "superpower"],
		eventPokemon: [
			{"generation": 7, "level": 16, "shiny": 1, "ivs": {hp: 25, atk: 30, def: 25, spa: 30, spd: 25, spe: 31}, "moves": ["roar", "leer", "ember", "doubleedge"], "pokeball": "pokeball"},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	poliwag: {
		inherit: true,
		tier: "LC",
	},
	poliwhirl: {
		inherit: true,
		tier: "NFE",
	},
	poliwrath: {
		inherit: true,
		randomBattleMoves: ["waterfall", "bulkup", "superpower", "icepunch", "brickbreak", "earthquake"],
		tier: "OU",
		doublesTier: "DOU",
	},
	abra: {
		inherit: true,
		tier: "LC",
	},
	kadabra: {
		inherit: true,
		tier: "NFE",
	},
	alakazam: {
		inherit: true,
		randomBattleMoves: [],
		tier: "OU",
		doublesTier: "DOU",
	},
	alakazammega: {
		inherit: true,
		randomBattleMoves: ["psychic", "shadowball", "calmmind", "dazzlinggleam", "recover"],
		tier: "OU",
		doublesTier: "DOU",
	},
	machop: {
		inherit: true,
		tier: "LC",
	},
	machoke: {
		inherit: true,
		tier: "NFE",
	},
	machamp: {
		inherit: true,
		randomBattleMoves: ["superpower", "earthquake", "icepunch", "bulkup", "rockslide", "brickbreak"],
		tier: "UU",
		doublesTier: "DOU",
	},
	bellsprout: {
		inherit: true,
		tier: "LC",
	},
	weepinbell: {
		inherit: true,
		tier: "NFE",
	},
	victreebel: {
		inherit: true,
		randomBattleMoves: ["powerwhip", "suckerpunch", "poisonjab", "swordsdance", "sleeppowder"],
		tier: "UU",
		doublesTier: "DOU",
	},
	tentacool: {
		inherit: true,
		tier: "LC",
	},
	tentacruel: {
		inherit: true,
		randomBattleMoves: ["sludgebomb", "scald", "icebeam", "haze"],
		tier: "UU",
		doublesTier: "DOU",
	},
	geodude: {
		inherit: true,
		tier: "LC",
	},
	geodudealola: {
		inherit: true,
		tier: "LC",
	},
	graveler: {
		inherit: true,
		tier: "NFE",
	},
	graveleralola: {
		inherit: true,
		tier: "NFE",
	},
	golem: {
		inherit: true,
		randomBattleMoves: ["earthquake", "rockslide", "stealthrock", "explosion", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	golemalola: {
		inherit: true,
		randomBattleMoves: ["thunderpunch", "rockslide", "earthquake", "stealthrock", "explosion"],
		tier: "UU",
		doublesTier: "DOU",
	},
	ponyta: {
		inherit: true,
		tier: "LC",
	},
	rapidash: {
		inherit: true,
		randomBattleMoves: ["flareblitz", "drillrun", "megahorn", "willowisp", "irontail"],
		tier: "UU",
		doublesTier: "DOU",
	},
	slowpoke: {
		inherit: true,
		tier: "LC",
	},
	slowbro: {
		inherit: true,
		randomBattleMoves: [],
		tier: "UU",
		doublesTier: "DOU",
	},
	slowbromega: {
		inherit: true,
		randomBattleMoves: ["scald", "psychic", "calmmind", "icebeam", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	magnemite: {
		inherit: true,
		tier: "LC",
	},
	magneton: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "flashcannon", "thunderwave", "lightscreen", "reflect"],
		tier: "UU",
		doublesTier: "DOU",
	},
	farfetchd: {
		inherit: true,
		randomBattleMoves: ["swordsdance", "quickattack", "fly", "razorleaf", "poisonjab"],
		tier: "UU",
		doublesTier: "DOU",
	},
	doduo: {
		inherit: true,
		tier: "LC",
	},
	dodrio: {
		inherit: true,
		randomBattleMoves: ["drillpeck", "jumpkick", "swordsdance", "quickattack", "roost"],
		tier: "UU",
		doublesTier: "DOU",
	},
	seel: {
		inherit: true,
		tier: "LC",
	},
	dewgong: {
		inherit: true,
		randomBattleMoves: ["icebeam", "aquajet", "iceshard", "surf", "megahorn"],
		tier: "UU",
		doublesTier: "DOU",
	},
	grimer: {
		inherit: true,
		tier: "LC",
	},
	grimeralola: {
		inherit: true,
		tier: "LC",
	},
	muk: {
		inherit: true,
		randomBattleMoves: ["poisonjab", "firepunch", "brickbreak", "toxic", "protect"],
		tier: "UU",
		doublesTier: "DOU",
	},
	mukalola: {
		inherit: true,
		randomBattleMoves: ["crunch", "poisonjab", "toxic", "firepunch", "megadrain"],
		tier: "OU",
		doublesTier: "DOU",
	},
	shellder: {
		inherit: true,
		tier: "LC",
	},
	cloyster: {
		inherit: true,
		randomBattleMoves: ["shellsmash", "icebeam", "hydropump", "surf", "iceshard"],
		tier: "OU",
		doublesTier: "DOU",
	},
	gastly: {
		inherit: true,
		tier: "LC",
	},
	haunter: {
		inherit: true,
		tier: "NFE",
	},
	gengar: {
		inherit: true,
		randomBattleMoves: [],
		tier: "OU",
		doublesTier: "DOU",
	},
	gengarmega: {
		inherit: true,
		randomBattleMoves: ["shadowball", "sludgebomb", "thunderbolt", "willowisp", "substitute", "dazzlinggleam"],
		tier: "OU",
		doublesTier: "DOU",
	},
	onix: {
		inherit: true,
		randomBattleMoves: ["stealthrock", "rockslide", "earthquake", "toxic", "dragontail"],
		tier: "UU",
		doublesTier: "DOU",
	},
	drowzee: {
		inherit: true,
		tier: "LC",
	},
	hypno: {
		inherit: true,
		randomBattleMoves: ["psychic", "calmmind", "dazzlinggleam", "shadowball", "thunderwave"],
		tier: "UU",
		doublesTier: "DOU",
	},
	krabby: {
		inherit: true,
		tier: "LC",
	},
	kingler: {
		inherit: true,
		randomBattleMoves: ["crabhammer", "agility", "rockslide", "xscissor", "superpower"],
		tier: "UU",
		doublesTier: "DOU",
	},
	voltorb: {
		inherit: true,
		eventPokemon: [
			{"generation": 7, "level": 42, "shiny": 1, "perfectIVs": 3, "moves": ["mirrorcoat", "thunderbolt", "swift", "selfdestruct"]},
		],
		tier: "LC",
	},
	electrode: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "taunt", "thunderwave", "explosion", "reflect", "lightscreen"],
		eventPokemon: [
			{"generation": 7, "level": 42, "shiny": 1, "perfectIVs": 3, "moves": ["thunderbolt", "screech", "selfdestruct", "swift"]},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	exeggcute: {
		inherit: true,
		tier: "LC",
	},
	exeggutor: {
		inherit: true,
		randomBattleMoves: ["psychic", "megadrain", "sleeppowder", "leechseed", "sludgebomb"],
		tier: "UU",
		doublesTier: "DOU",
	},
	exeggutoralola: {
		inherit: true,
		randomBattleMoves: ["megadrain", "dragonpulse", "flamethrower", "stunspore", "earthquake"],
		tier: "OU",
		doublesTier: "DOU",
	},
	cubone: {
		inherit: true,
		tier: "LC",
	},
	marowak: {
		inherit: true,
		randomBattleMoves: ["earthquake", "stealthrock", "swordsdance", "bonemerang", "rockslide", "doubleedge"],
		tier: "UU",
		doublesTier: "DOU",
	},
	marowakalola: {
		inherit: true,
		randomBattleMoves: ["earthquake", "flareblitz", "willowisp", "bonemerang", "swordsdance", "stealthrock", "rockslide"],
		tier: "UU",
		doublesTier: "DOU",
	},
	hitmonlee: {
		inherit: true,
		randomBattleMoves: ["highjumpkick", "earthquake", "bulkup", "rockslide", "poisonjab"],
		eventPokemon: [
			{"generation": 7, "level": 30, "shiny": 1, "ivs": {hp: 25, atk: 30, def: 25, spa: 25, spd: 30, spe: 31}, "moves": ["jumpkick", "facade", "brickbreak", "feint"], "pokeball": "pokeball"},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	hitmonchan: {
		inherit: true,
		randomBattleMoves: ["icepunch", "thunderpunch", "brickbreak", "firepunch", "earthquake", "bulkup"],
		eventPokemon: [
			{"generation": 7, "level": 30, "shiny": 1, "ivs": {hp: 25, atk: 31, def: 30, spa: 25, spd: 30, spe: 25}, "moves": ["firepunch", "icepunch", "thunderpunch", "dizzypunch"], "pokeball": "pokeball"},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	lickitung: {
		inherit: true,
		randomBattleMoves: ["facade", "fireblast", "icebeam", "shadowball", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	koffing: {
		inherit: true,
		tier: "LC",
	},
	weezing: {
		inherit: true,
		randomBattleMoves: ["willowisp", "sludgebomb", "toxic", "flamethrower", "fireblast", "explosion"],
		tier: "UU",
		doublesTier: "DOU",
	},
	rhyhorn: {
		inherit: true,
		tier: "LC",
	},
	rhydon: {
		inherit: true,
		randomBattleMoves: ["earthquake", "rockslide", "stealthrock", "toxic", "megahorn"],
		tier: "OU",
		doublesTier: "DOU",
	},
	chansey: {
		inherit: true,
		randomBattleMoves: ["softboiled", "seismictoss", "toxic", "stealthrock", "teleport"],
		eventPokemon: [
			{"generation": 7, "level": 1, "gender": "F", "nature": "Mild", "moves": ["celebrate", "pound"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	tangela: {
		inherit: true,
		randomBattleMoves: ["leechseed", "megadrain", "sleeppowder", "protect", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	kangaskhan: {
		inherit: true,
		randomBattleMoves: [],
		tier: "UU",
		doublesTier: "DOU",
	},
	kangaskhanmega: {
		inherit: true,
		randomBattleMoves: ["fakeout", "earthquake", "suckerpunch", "facade", "brickbreak"],
		tier: "UU",
		doublesTier: "DOU",
	},
	horsea: {
		inherit: true,
		tier: "LC",
	},
	seadra: {
		inherit: true,
		randomBattleMoves: ["icebeam", "scald", "dragonpulse", "agility", "toxic", "hydropump"],
		tier: "UU",
		doublesTier: "DOU",
	},
	goldeen: {
		inherit: true,
		tier: "LC",
	},
	seaking: {
		inherit: true,
		randomBattleMoves: ["scald", "poisonjab", "megahorn", "drillrun", "icebeam"],
		tier: "UU",
		doublesTier: "DOU",
	},
	staryu: {
		inherit: true,
		tier: "LC",
	},
	starmie: {
		inherit: true,
		randomBattleMoves: ["psychic", "thunderbolt", "icebeam", "recover", "scald", "hydropump"],
		tier: "OU",
		doublesTier: "DOU",
	},
	mrmime: {
		inherit: true,
		randomBattleMoves: ["psychic", "dazzlinggleam", "calmmind", "shadowball", "encore"],
		tier: "UU",
		doublesTier: "DOU",
	},
	scyther: {
		inherit: true,
		randomBattleMoves: ["swordsdance", "xscissor", "wingattack", "brickbreak", "uturn"],
		tier: "UU",
		doublesTier: "DOU",
	},
	jynx: {
		inherit: true,
		randomBattleMoves: ["icebeam", "psychic", "lovelykiss", "calmmind", "shadowball"],
		tier: "UU",
		doublesTier: "DOU",
	},
	electabuzz: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "icepunch", "psychic", "thunderwave", "brickbreak"],
		tier: "UU",
		doublesTier: "DOU",
	},
	magmar: {
		inherit: true,
		randomBattleMoves: ["psychic", "flamethrower", "fireblast", "willowisp", "clearsmog", "thunderpunch"],
		tier: "UU",
		doublesTier: "DOU",
	},
	pinsir: {
		inherit: true,
		randomBattleMoves: [],
		tier: "UU",
		doublesTier: "DOU",
	},
	pinsirmega: {
		inherit: true,
		randomBattleMoves: ["xscissor", "earthquake", "swordsdance", "rockslide", "superpower"],
		tier: "UU",
		doublesTier: "DOU",
	},
	tauros: {
		inherit: true,
		randomBattleMoves: ["earthquake", "doubleedge", "rockslide", "fireblast", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	magikarp: {
		inherit: true,
		eventPokemon: [
			{"generation": 7, "level": 5, "shiny": 1, "ivs": {hp: 30, atk: 31, def: 25, spa: 25, spd: 25, spe: 31}, "moves": ["splash"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	gyarados: {
		inherit: true,
		randomBattleMoves: [],
		tier: "OU",
		doublesTier: "DOU",
	},
	gyaradosmega: {
		inherit: true,
		randomBattleMoves: ["waterfall", "crunch", "earthquake", "thunderwave", "substitute"],
		tier: "OU",
		doublesTier: "DOU",
	},
	lapras: {
		inherit: true,
		randomBattleMoves: ["icebeam", "thunderbolt", "surf", "hydropump", "toxic"],
		eventPokemon: [
			{"generation": 7, "level": 34, "shiny": 1, "ivs": {hp: 31, atk: 25, def: 25, spa: 30, spd: 30, spe: 25}, "moves": ["bodyslam", "confuseray", "iceshard", "mist"], "pokeball": "pokeball"},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	ditto: {
		inherit: true,
		randomBattleMoves: ["transform"],
		tier: "UU",
		doublesTier: "DOU",
	},
	eevee: {
		inherit: true,
		tier: "LC",
	},
	eeveestarter: {
		inherit: true,
		randomBattleMoves: ["sparklyswirl", "sizzlyslide", "sappyseed", "protect", "buzzybuzz", "bouncybubble"],
		isNonstandard: null,
		tier: "OU",
		doublesTier: "DOU",
	},
	vaporeon: {
		inherit: true,
		randomBattleMoves: ["scald", "toxic", "icebeam", "protect", "rest"],
		tier: "UU",
		doublesTier: "DOU",
	},
	jolteon: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "shadowball", "thunderwave", "toxic", "substitute"],
		tier: "UU",
		doublesTier: "DOU",
	},
	flareon: {
		inherit: true,
		randomBattleMoves: ["flareblitz", "superpower", "quickattack", "toxic", "irontail"],
		tier: "UU",
		doublesTier: "DOU",
	},
	porygon: {
		inherit: true,
		randomBattleMoves: ["triattack", "recover", "icebeam", "toxic", "psychic"],
		eventPokemon: [
			{"generation": 7, "level": 34, "shiny": 1, "ivs": {hp: 25, atk: 25, def: 30, spa: 31, spd: 30, spe: 25}, "moves": ["conversion", "thunderwave", "triattack", "barrier"], "pokeball": "pokeball"},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	omanyte: {
		inherit: true,
		eventPokemon: [
			{"generation": 7, "level": 44, "shiny": 1, "perfectIVs": 3, "moves": ["hydropump", "rockslide", "protect", "rockthrow"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	omastar: {
		inherit: true,
		randomBattleMoves: ["shellsmash", "icebeam", "hydropump", "scald", "rockslide"],
		tier: "UU",
		doublesTier: "DOU",
	},
	kabuto: {
		inherit: true,
		eventPokemon: [
			{"generation": 7, "level": 44, "shiny": 1, "perfectIVs": 3, "moves": ["rockslide", "sandattack", "rockthrow", "aquajet"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	kabutops: {
		inherit: true,
		randomBattleMoves: ["aquajet", "swordsdance", "rockslide", "waterfall", "superpower", "stealthrock"],
		tier: "UU",
		doublesTier: "DOU",
	},
	aerodactyl: {
		inherit: true,
		randomBattleMoves: [],
		eventPokemon: [
			{"generation": 7, "level": 44, "shiny": 1, "perfectIVs": 3, "moves": ["rockslide", "crunch", "rockthrow", "agility"], "pokeball": "pokeball"},
		],
		tier: "OU",
		doublesTier: "DOU",
	},
	aerodactylmega: {
		inherit: true,
		randomBattleMoves: ["rockslide", "earthquake", "stealthrock", "taunt", "crunch", "roost"],
		tier: "OU",
		doublesTier: "DOU",
	},
	snorlax: {
		inherit: true,
		randomBattleMoves: ["earthquake", "bodyslam", "rest", "crunch", "toxic"],
		eventPokemon: [
			{"generation": 7, "level": 34, "shiny": 1, "perfectIVs": 3, "moves": ["rest", "headbutt", "lick", "yawn"]},
			{"generation": 7, "level": 34, "shiny": 1, "perfectIVs": 3, "moves": ["rest", "headbutt", "lick", "yawn"]},
		],
		tier: "OU",
		doublesTier: "DOU",
	},
	articuno: {
		inherit: true,
		randomBattleMoves: ["icebeam", "roost", "toxic", "uturn", "substitute"],
		eventPokemon: [
			{"generation": 7, "level": 50, "shiny": 1, "perfectIVs": 3, "moves": ["reflect", "agility", "icebeam", "mirrorcoat"]},
		],
		eventOnly: false,
		tier: "UU",
		doublesTier: "DOU",
	},
	zapdos: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "roost", "uturn", "toxic", "drillpeck"],
		eventPokemon: [
			{"generation": 7, "level": 50, "shiny": 1, "perfectIVs": 3, "moves": ["lightscreen", "agility", "thunderbolt", "drillpeck"]},
		],
		eventOnly: false,
		tier: "OU",
		doublesTier: "DOU",
	},
	moltres: {
		inherit: true,
		randomBattleMoves: ["roost", "airslash", "flamethrower", "fireblast", "willowisp", "uturn"],
		eventPokemon: [
			{"generation": 7, "level": 50, "shiny": 1, "perfectIVs": 3, "moves": ["heatwave", "agility", "flamethrower", "airslash"]},
		],
		eventOnly: false,
		tier: "UU",
		doublesTier: "DOU",
	},
	dratini: {
		inherit: true,
		tier: "LC",
	},
	dragonair: {
		inherit: true,
		tier: "NFE",
	},
	dragonite: {
		inherit: true,
		randomBattleMoves: ["outrage", "earthquake", "agility", "roost", "fireblast"],
		tier: "OU",
		doublesTier: "DOU",
	},
	mewtwo: {
		inherit: true,
		randomBattleMoves: [],
		eventPokemon: [
			{"generation": 7, "level": 70, "shiny": 1, "perfectIVs": 3, "moves": ["psychic", "recover", "amnesia", "swift"]},
		],
		tier: "Uber",
		doublesTier: "DUber",
	},
	mewtwomegax: {
		inherit: true,
		randomBattleMoves: ["bulkup", "substitute", "brickbreak", "earthquake", "icepunch"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	mewtwomegay: {
		inherit: true,
		randomBattleMoves: ["calmmind", "psychic", "fireblast", "icebeam", "shadowball", "recover"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	mew: {
		inherit: true,
		randomBattleMoves: ["roost", "psychic", "willowisp", "flamethrower", "stealthrock", "nastyplot"],
		eventPokemon: [
			{"generation": 7, "level": 1, "perfectIVs": 3, "moves": ["pound"], "pokeball": "pokeball"},
		],
		tier: "OU",
		doublesTier: "DOU",
	},
	meltan: {
		inherit: true,
		randomBattleMoves: ["flashcannon", "thunderbolt", "toxic", "protect"],
		isNonstandard: null,
		tier: "UU",
		doublesTier: "DOU",
	},
	melmetal: {
		inherit: true,
		randomBattleMoves: ["doubleironbash", "earthquake", "rockslide", "icepunch", "thunderwave"],
		isNonstandard: null,
		tier: "OU",
		doublesTier: "DOU",
	},
};

exports.BattleFormatsData = BattleFormatsData;
