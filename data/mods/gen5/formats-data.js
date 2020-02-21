'use strict';

/**@type {{[k: string]: ModdedTemplateFormatsData}} */
let BattleFormatsData = {
	bulbasaur: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "LC",
	},
	ivysaur: {
		maleOnlyHidden: true,
		tier: "NFE",
	},
	venusaur: {
		randomBattleMoves: ["earthquake", "gigadrain", "hiddenpowerfire", "hiddenpowerice", "leechseed", "powerwhip", "sleeppowder", "sludgebomb", "swordsdance", "synthesis"],
		maleOnlyHidden: true,
		tier: "OU",
		doublesTier: "DOU",
	},
	charmander: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "LC",
	},
	charmeleon: {
		maleOnlyHidden: true,
		tier: "NFE",
	},
	charizard: {
		inherit: true,
		randomBattleMoves: ["airslash", "dragonpulse", "fireblast", "hiddenpowergrass", "roost", "substitute"],
		maleOnlyHidden: true,
		tier: "NU",
		doublesTier: "DOU",
	},
	squirtle: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "LC",
	},
	wartortle: {
		maleOnlyHidden: true,
		tier: "NU",
		doublesTier: "NFE",
	},
	blastoise: {
		inherit: true,
		randomBattleMoves: ["dragontail", "icebeam", "protect", "rapidspin", "scald", "toxic"],
		maleOnlyHidden: true,
		tier: "UU",
		doublesTier: "DUU",
	},
	caterpie: {
		tier: "LC",
	},
	metapod: {
		tier: "NFE",
	},
	butterfree: {
		inherit: true,
		randomBattleMoves: ["bugbuzz", "hiddenpowerrock", "quiverdance", "roost", "sleeppowder", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	weedle: {
		tier: "LC",
	},
	kakuna: {
		tier: "NFE",
	},
	beedrill: {
		inherit: true,
		randomBattleMoves: ["agility", "batonpass", "endeavor", "swordsdance", "poisonjab", "toxicspikes", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pidgey: {
		tier: "LC",
	},
	pidgeotto: {
		inherit: true,
		tier: "NFE",
	},
	pidgeot: {
		inherit: true,
		randomBattleMoves: ["bravebird", "heatwave", "quickattack", "return", "roost", "uturn", "workup"],
		tier: "NU",
		doublesTier: "DUU",
	},
	rattata: {
		tier: "LC",
	},
	raticate: {
		inherit: true,
		randomBattleMoves: ["facade", "flamewheel", "suckerpunch", "swordsdance", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	spearow: {
		inherit: true,
		tier: "LC",
	},
	fearow: {
		randomBattleMoves: ["doubleedge", "drillpeck", "drillrun", "pursuit", "quickattack", "return", "roost", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	ekans: {
		inherit: true,
		tier: "LC",
	},
	arbok: {
		inherit: true,
		randomBattleMoves: ["aquatail", "coil", "earthquake", "glare", "gunkshot", "rest", "seedbomb", "suckerpunch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pichu: {
		inherit: true,
		tier: "LC",
	},
	pikachu: {
		inherit: true,
		randomBattleMoves: ["extremespeed", "grassknot", "focuspunch", "hiddenpowerice", "substitute", "thunderbolt"],
		tier: "NU",
		doublesTier: "NFE",
	},
	raichu: {
		randomBattleMoves: ["encore", "focusblast", "grassknot", "hiddenpowerice", "nastyplot", "thunderbolt", "voltswitch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	sandshrew: {
		inherit: true,
		tier: "LC",
	},
	sandslash: {
		randomBattleMoves: ["earthquake", "rapidspin", "stealthrock", "stoneedge", "swordsdance", "toxic", "xscissor"],
		tier: "RU",
		doublesTier: "DUU",
	},
	nidoranf: {
		tier: "LC",
	},
	nidorina: {
		tier: "NFE",
	},
	nidoqueen: {
		randomBattleMoves: ["earthpower", "fireblast", "focusblast", "icebeam", "sludgewave", "stealthrock", "toxicspikes"],
		tier: "UU",
		doublesTier: "DUU",
	},
	nidoranm: {
		tier: "LC",
	},
	nidorino: {
		tier: "NFE",
	},
	nidoking: {
		randomBattleMoves: ["earthpower", "fireblast", "focusblast", "icebeam", "sludgewave", "substitute"],
		tier: "UU",
		doublesTier: "DUU",
	},
	cleffa: {
		tier: "LC",
	},
	clefairy: {
		tier: "NFE",
	},
	clefable: {
		randomBattleMoves: ["calmmind", "doubleedge", "icebeam", "softboiled", "stealthrock", "thunderbolt"],
		tier: "RU",
		doublesTier: "DUU",
	},
	vulpix: {
		inherit: true,
		tier: "LC Uber",
	},
	ninetales: {
		inherit: true,
		randomBattleMoves: ["fireblast", "hypnosis", "nastyplot", "painsplit", "solarbeam", "substitute", "willowisp"],
		tier: "OU",
		doublesTier: "DOU",
	},
	igglybuff: {
		inherit: true,
		tier: "LC",
	},
	jigglypuff: {
		tier: "NFE",
	},
	wigglytuff: {
		randomBattleMoves: ["counter", "doubleedge", "fireblast", "healbell", "protect", "stealthrock", "toxic", "wish"],
		tier: "NU",
		doublesTier: "DUU",
	},
	zubat: {
		tier: "LC",
	},
	golbat: {
		tier: "NU",
		doublesTier: "NFE",
	},
	crobat: {
		inherit: true,
		randomBattleMoves: ["bravebird", "heatwave", "roost", "sludgebomb", "superfang", "taunt", "toxic", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
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
		randomBattleMoves: ["aromatherapy", "gigadrain", "hiddenpowerfire", "leechseed", "sleeppowder", "sludgebomb", "stunspore", "synthesis"],
		tier: "NU",
		doublesTier: "DUU",
	},
	bellossom: {
		randomBattleMoves: ["gigadrain", "hiddenpowerrock", "leafstorm", "leechseed", "sleeppowder", "stunspore", "synthesis"],
		tier: "NU",
		doublesTier: "DUU",
	},
	paras: {
		inherit: true,
		tier: "LC",
	},
	parasect: {
		randomBattleMoves: ["aromatherapy", "leechseed", "seedbomb", "spore", "stunspore", "synthesis", "xscissor"],
		tier: "NU",
		doublesTier: "DUU",
	},
	venonat: {
		tier: "LC",
	},
	venomoth: {
		inherit: true,
		randomBattleMoves: ["batonpass", "bugbuzz", "quiverdance", "roost", "sleeppowder", "sludgebomb", "substitute"],
		tier: "RUBL",
		doublesTier: "DUU",
	},
	diglett: {
		tier: "LC",
	},
	dugtrio: {
		inherit: true,
		randomBattleMoves: ["earthquake", "reversal", "stealthrock", "stoneedge", "substitute", "suckerpunch"],
		tier: "OU",
		doublesTier: "DUU",
	},
	meowth: {
		inherit: true,
		tier: "LC",
	},
	persian: {
		randomBattleMoves: ["bite", "fakeout", "hypnosis", "return", "switcheroo", "taunt", "uturn", "waterpulse"],
		tier: "NU",
		doublesTier: "DUU",
	},
	psyduck: {
		inherit: true,
		tier: "LC",
	},
	golduck: {
		inherit: true,
		randomBattleMoves: ["calmmind", "focusblast", "hiddenpowergrass", "hydropump", "icebeam", "surf"],
		tier: "NU",
		doublesTier: "DUU",
	},
	mankey: {
		tier: "LC",
	},
	primeape: {
		inherit: true,
		randomBattleMoves: ["closecombat", "encore", "icepunch", "punishment", "stoneedge", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	growlithe: {
		inherit: true,
		tier: "LC",
	},
	arcanine: {
		inherit: true,
		randomBattleMoves: ["closecombat", "extremespeed", "flareblitz", "hiddenpowergrass", "morningsun", "wildcharge", "willowisp"],
		tier: "UU",
		doublesTier: "DOU",
	},
	poliwag: {
		inherit: true,
		tier: "LC",
	},
	poliwhirl: {
		tier: "NFE",
	},
	poliwrath: {
		inherit: true,
		randomBattleMoves: ["bulkup", "circlethrow", "focuspunch", "rest", "sleeptalk", "substitute", "toxic", "waterfall"],
		tier: "RU",
		doublesTier: "DUU",
	},
	politoed: {
		inherit: true,
		randomBattleMoves: ["encore", "focusblast", "hiddenpowergrass", "hydropump", "hypnosis", "icebeam", "perishsong", "protect", "scald", "toxic"],
		tier: "OU",
		doublesTier: "DOU",
	},
	abra: {
		tier: "LC",
	},
	kadabra: {
		tier: "NU",
		doublesTier: "NFE",
	},
	alakazam: {
		inherit: true,
		randomBattleMoves: ["calmmind", "encore", "focusblast", "psychic", "psyshock", "shadowball", "substitute"],
		tier: "OU",
		doublesTier: "DUU",
	},
	machop: {
		tier: "LC",
	},
	machoke: {
		inherit: true,
		tier: "NU",
		doublesTier: "NFE",
	},
	machamp: {
		inherit: true,
		randomBattleMoves: ["bulletpunch", "bulkup", "dynamicpunch", "icepunch", "payback", "stoneedge", "substitute"],
		tier: "UU",
		doublesTier: "DUU",
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
		randomBattleMoves: ["growth", "powerwhip", "sleeppowder", "sludgebomb", "suckerpunch", "sunnyday", 'swordsdance', "weatherball"],
		tier: "NU",
		doublesTier: "DUU",
	},
	tentacool: {
		tier: "LC",
	},
	tentacruel: {
		randomBattleMoves: ["gigadrain", "icebeam", "protect", "rapidspin", "scald", "toxic", "toxicspikes"],
		tier: "OU",
		doublesTier: "DUU",
	},
	geodude: {
		tier: "LC",
	},
	graveler: {
		tier: "NFE",
	},
	golem: {
		randomBattleMoves: ["earthquake", "explosion", "rockblast", "stealthrock", "suckerpunch", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	ponyta: {
		tier: "LC",
	},
	rapidash: {
		inherit: true,
		randomBattleMoves: ["batonpass", "drillrun", "flareblitz", "hypnosis", "megahorn", "morningsun", "wildcharge"],
		tier: "NU",
		doublesTier: "DUU",
	},
	slowpoke: {
		inherit: true,
		tier: "LC",
	},
	slowbro: {
		randomBattleMoves: ["calmmind", "fireblast", "psyshock", "scald", "slackoff", "thunderwave", "toxic", "trick"],
		tier: "UU",
		doublesTier: "DUU",
	},
	slowking: {
		randomBattleMoves: ["fireblast", "grassknot", "icebeam", "psychic", "surf", "trick", "trickroom"],
		tier: "RU",
		doublesTier: "DUU",
	},
	magnemite: {
		tier: "LC",
	},
	magneton: {
		inherit: true,
		tier: "RU",
		doublesTier: "NFE",
	},
	magnezone: {
		randomBattleMoves: ["flashcannon", "hiddenpowerfire", "hiddenpowerice", "substitute", "thunderbolt", "voltswitch"],
		tier: "OU",
		doublesTier: "DUU",
	},
	farfetchd: {
		inherit: true,
		randomBattleMoves: ["bravebird", "leafblade", "return", "roost", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	doduo: {
		tier: "LC",
	},
	dodrio: {
		inherit: true,
		randomBattleMoves: ["bravebird", "pursuit", "quickattack", "return", "roost"],
		tier: "NU",
		doublesTier: "DUU",
	},
	seel: {
		inherit: true,
		tier: "LC",
	},
	dewgong: {
		randomBattleMoves: ["icebeam", "iceshard", "protect", "rest", "sleeptalk", "surf", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	grimer: {
		inherit: true,
		tier: "LC",
	},
	muk: {
		randomBattleMoves: ["brickbreak", "curse", "firepunch", "gunkshot", "icepunch", "poisonjab", "rest", "shadowsneak"],
		tier: "NU",
		doublesTier: "DUU",
	},
	shellder: {
		inherit: true,
		tier: "LC",
	},
	cloyster: {
		inherit: true,
		randomBattleMoves: ["hydropump", "iceshard", "iciclespear", "rapidspin", "rockblast", "shellsmash", "spikes", "toxicspikes"],
		tier: "OU",
		doublesTier: "DOU",
	},
	gastly: {
		tier: "LC",
	},
	haunter: {
		inherit: true,
		tier: "NU",
		doublesTier: "NFE",
	},
	gengar: {
		inherit: true,
		randomBattleMoves: ["disable", "focusblast", "painsplit", "shadowball", "sludgebomb", "substitute", "thunderbolt", "trick"],
		tier: "OU",
		doublesTier: "DOU",
	},
	onix: {
		tier: "LC",
	},
	steelix: {
		randomBattleMoves: ["curse", "earthquake", "gyroball", "roar", "stealthrock", "stoneedge", "toxic"],
		tier: "RU",
		doublesTier: "DUU",
	},
	drowzee: {
		inherit: true,
		tier: "LC",
	},
	hypno: {
		inherit: true,
		randomBattleMoves: ["foulplay", "protect", "psychic", "seismictoss", "thunderwave", "toxic", "wish"],
		tier: "NU",
		doublesTier: "DUU",
	},
	krabby: {
		tier: "LC",
	},
	kingler: {
		randomBattleMoves: ["agility", "crabhammer", "return", "substitute", "superpower", "swordsdance", "xscissor"],
		tier: "NU",
		doublesTier: "DUU",
	},
	voltorb: {
		inherit: true,
		tier: "LC",
	},
	electrode: {
		randomBattleMoves: ["foulplay", "hiddenpowergrass", "taunt", "thunderbolt", "voltswitch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	exeggcute: {
		inherit: true,
		tier: "LC",
	},
	exeggutor: {
		inherit: true,
		randomBattleMoves: ["gigadrain", "hiddenpowerfire", "leechseed", "protect", "psychic", "sleeppowder", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	cubone: {
		tier: "LC",
	},
	marowak: {
		inherit: true,
		randomBattleMoves: ["bonemerang", "doubleedge", "earthquake", "firepunch", "stealthrock", "stoneedge", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	tyrogue: {
		maleOnlyHidden: true,
		tier: "LC",
	},
	hitmonlee: {
		inherit: true,
		randomBattleMoves: ["blazekick", "closecombat", "fakeout", "highjumpkick", "machpunch", "substitute", "suckerpunch", "stoneedge"],
		maleOnlyHidden: true,
		tier: "RU",
		doublesTier: "DUU",
	},
	hitmonchan: {
		inherit: true,
		randomBattleMoves: ["bulkup", "closecombat", "drainpunch", "icepunch", "machpunch", "rapidspin", "stoneedge"],
		maleOnlyHidden: true,
		tier: "RU",
		doublesTier: "DUU",
	},
	hitmontop: {
		inherit: true,
		randomBattleMoves: ["closecombat", "machpunch", "rapidspin", "stoneedge", "suckerpunch", "toxic"],
		maleOnlyHidden: true,
		tier: "UU",
		doublesTier: "DOU",
	},
	lickitung: {
		inherit: true,
		tier: "LC",
	},
	lickilicky: {
		randomBattleMoves: ["bodyslam", "dragontail", "earthquake", "explosion", "healbell", "powerwhip", "protect", "swordsdance", "toxic", "wish"],
		tier: "NU",
		doublesTier: "DUU",
	},
	koffing: {
		tier: "LC",
	},
	weezing: {
		randomBattleMoves: ["fireblast", "haze", "painsplit", "sludgebomb", "thunderbolt", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	rhyhorn: {
		tier: "LC",
	},
	rhydon: {
		inherit: true,
		randomBattleMoves: ["earthquake", "megahorn", "rockblast", "stealthrock", "stoneedge"],
		tier: "RU",
		doublesTier: "NFE",
	},
	rhyperior: {
		randomBattleMoves: ["earthquake", "icepunch", "megahorn", "rockpolish", "stoneedge"],
		tier: "UU",
		doublesTier: "DUU",
	},
	happiny: {
		tier: "LC",
	},
	chansey: {
		inherit: true,
		randomBattleMoves: ["aromatherapy", "counter", "protect", "seismictoss", "softboiled", "stealthrock", "toxic", "wish"],
		tier: "UUBL",
		doublesTier: "NFE",
	},
	blissey: {
		inherit: true,
		randomBattleMoves: ["aromatherapy", "flamethrower", "protect", "seismictoss", "softboiled", "stealthrock", "thunderwave", "toxic", "wish"],
		tier: "OU",
		doublesTier: "DUU",
	},
	tangela: {
		inherit: true,
		tier: "NU",
		doublesTier: "LC Uber",
	},
	tangrowth: {
		inherit: true,
		randomBattleMoves: ["gigadrain", "hiddenpowerfire", "leechseed", "powerwhip", "rockslide", "sleeppowder", "synthesis"],
		tier: "RU",
		doublesTier: "DUU",
	},
	kangaskhan: {
		inherit: true,
		randomBattleMoves: ["doubleedge", "earthquake", "fakeout", "focuspunch", "return", "substitute", "suckerpunch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	horsea: {
		inherit: true,
		tier: "LC",
	},
	seadra: {
		inherit: true,
		tier: "NU",
		doublesTier: "NFE",
	},
	kingdra: {
		inherit: true,
		randomBattleMoves: ["dracometeor", "dragondance", "hiddenpowerelectric", "hydropump", "icebeam", "outrage", "raindance", "substitute", "waterfall"],
		tier: "UU",
		doublesTier: "DOU",
	},
	goldeen: {
		tier: "LC",
	},
	seaking: {
		randomBattleMoves: ["drillrun", "icebeam", "megahorn", "return", "waterfall"],
		tier: "NU",
		doublesTier: "DUU",
	},
	staryu: {
		inherit: true,
		tier: "LC",
	},
	starmie: {
		inherit: true,
		randomBattleMoves: ["hydropump", "icebeam", "psyshock", "rapidspin", "recover", "thunderbolt", "trick"],
		tier: "OU",
		doublesTier: "DUU",
	},
	mimejr: {
		tier: "LC",
	},
	mrmime: {
		inherit: true,
		randomBattleMoves: ["batonpass", "encore", "hiddenpowerfighting", "nastyplot", "psychic", "substitute", "thunderbolt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	scyther: {
		inherit: true,
		randomBattleMoves: ["aerialace", "batonpass", "brickbreak", "bugbite", "quickattack", "roost", "swordsdance", "uturn"],
		tier: "RU",
		doublesTier: "LC Uber",
	},
	scizor: {
		inherit: true,
		randomBattleMoves: ["bugbite", "bulletpunch", "pursuit", "roost", "superpower", "swordsdance", "uturn"],
		tier: "OU",
		doublesTier: "DOU",
	},
	smoochum: {
		tier: "LC",
	},
	jynx: {
		randomBattleMoves: ["focusblast", "icebeam", "lovelykiss", "nastyplot", "psyshock", "substitute", "trick"],
		tier: "NUBL",
		doublesTier: "DUU",
	},
	elekid: {
		inherit: true,
		tier: "LC",
	},
	electabuzz: {
		inherit: true,
		tier: "NU",
		doublesTier: "NFE",
	},
	electivire: {
		inherit: true,
		randomBattleMoves: ["earthquake", "flamethrower", "focuspunch", "icepunch", "substitute", "wildcharge"],
		tier: "RU",
		doublesTier: "DOU",
	},
	magby: {
		tier: "LC",
	},
	magmar: {
		inherit: true,
		tier: "NFE",
	},
	magmortar: {
		inherit: true,
		randomBattleMoves: ["fireblast", "focusblast", "hiddenpowergrass", "substitute", "thunderbolt"],
		tier: "RU",
		doublesTier: "DUU",
	},
	pinsir: {
		inherit: true,
		randomBattleMoves: ["closecombat", "earthquake", "quickattack", "stealthrock", "stoneedge", "swordsdance", "xscissor"],
		tier: "NU",
		doublesTier: "DUU",
	},
	tauros: {
		inherit: true,
		randomBattleMoves: ["doubleedge", "earthquake", "pursuit", "retaliate", "stoneedge"],
		tier: "NU",
		doublesTier: "DUU",
	},
	magikarp: {
		inherit: true,
		tier: "LC",
	},
	gyarados: {
		randomBattleMoves: ["bounce", "dragondance", "earthquake", "icefang", "stoneedge", "substitute", "waterfall"],
		tier: "OU",
		doublesTier: "DOU",
	},
	lapras: {
		inherit: true,
		randomBattleMoves: ["healbell", "hydropump", "icebeam", "substitute", "thunderbolt", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	ditto: {
		randomBattleMoves: ["transform"],
		tier: "NU",
		doublesTier: "DUU",
	},
	eevee: {
		inherit: true,
		tier: "LC",
	},
	vaporeon: {
		inherit: true,
		randomBattleMoves: ["wish", "protect", "scald", "roar", "icebeam", "toxic", "hydropump"],
		tier: "OU",
		doublesTier: "DOU",
	},
	jolteon: {
		inherit: true,
		randomBattleMoves: ["batonpass", "hiddenpowerice", "signalbeam", "substitute", "thunderbolt", "voltswitch"],
		tier: "OU",
		doublesTier: "DOU",
	},
	flareon: {
		inherit: true,
		randomBattleMoves: ["facade", "flamecharge", "rest", "sleeptalk"],
		tier: "NU",
		doublesTier: "DUU",
	},
	espeon: {
		inherit: true,
		randomBattleMoves: ["batonpass", "calmmind", "hiddenpowerfire", "morningsun", "psychic", "psyshock", "signalbeam"],
		tier: "OU",
		doublesTier: "DOU",
	},
	umbreon: {
		inherit: true,
		randomBattleMoves: ["foulplay", "protect", "toxic", "wish"],
		tier: "UU",
		doublesTier: "DUU",
	},
	leafeon: {
		inherit: true,
		randomBattleMoves: ["batonpass", "leafblade", "return", "substitute", "swordsdance", "xscissor"],
		tier: "NU",
		doublesTier: "DUU",
	},
	glaceon: {
		inherit: true,
		randomBattleMoves: ["hiddenpowerground", "icebeam", "protect", "shadowball", "wish"],
		tier: "NU",
		doublesTier: "DUU",
	},
	porygon: {
		inherit: true,
		tier: "LC",
	},
	porygon2: {
		randomBattleMoves: ["discharge", "icebeam", "recover", "toxic", "triattack"],
		tier: "UU",
		doublesTier: "NFE",
	},
	porygonz: {
		randomBattleMoves: ["agility", "darkpulse", "hiddenpowerfighting", "icebeam", "nastyplot", "thunderbolt", "triattack", "trick"],
		tier: "UU",
		doublesTier: "DUU",
	},
	omanyte: {
		inherit: true,
		tier: "LC",
	},
	omastar: {
		randomBattleMoves: ["hiddenpowergrass", "icebeam", "shellsmash", "spikes", "stealthrock", "surf"],
		tier: "RU",
		doublesTier: "DUU",
	},
	kabuto: {
		inherit: true,
		tier: "LC",
	},
	kabutops: {
		randomBattleMoves: ["aquajet", "rapidspin", "stealthrock", "stoneedge", "superpower", "swordsdance", "waterfall"],
		tier: "RU",
		doublesTier: "DUU",
	},
	aerodactyl: {
		inherit: true,
		randomBattleMoves: ["aquatail", "doubleedge", "earthquake", "roost", "stealthrock", "stoneedge", "taunt"],
		tier: "RU",
		doublesTier: "DUU",
	},
	munchlax: {
		inherit: true,
		tier: "NU",
		doublesTier: "LC",
	},
	snorlax: {
		inherit: true,
		randomBattleMoves: ["bodyslam", "crunch", "curse", "earthquake", "firepunch", "pursuit", "rest", "selfdestruct"],
		tier: "UU",
		doublesTier: "DUU",
	},
	articuno: {
		inherit: true,
		randomBattleMoves: ["hurricane", "icebeam", "roar", "roost", "substitute", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	zapdos: {
		inherit: true,
		randomBattleMoves: ["heatwave", "hiddenpowerice", "roost", "substitute", "thunderbolt", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	moltres: {
		inherit: true,
		randomBattleMoves: ["airslash", "fireblast", "hiddenpowergrass", "hurricane", "roost", "substitute", "toxic", "uturn", "willowisp"],
		tier: "RU",
		doublesTier: "DUU",
	},
	dratini: {
		tier: "LC",
	},
	dragonair: {
		randomBattleMoves: ["dragondance", "outrage", "rest", "sleeptalk", "waterfall"],
		tier: "NU",
		doublesTier: "NFE",
	},
	dragonite: {
		inherit: true,
		randomBattleMoves: ["dracometeor", "dragondance", "earthquake", "extremespeed", "firepunch", "hurricane", "outrage", "roost", "thunderwave"],
		tier: "OU",
		doublesTier: "DOU",
	},
	mewtwo: {
		inherit: true,
		randomBattleMoves: ["aurasphere", "calmmind", "fireblast", "icebeam", "psystrike", "recover", "taunt", "willowisp"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	mew: {
		inherit: true,
		randomBattleMoves: ["aurasphere", "batonpass", "fireblast", "nastyplot", "psychic", "rockpolish", "roost", "stealthrock", "taunt", "uturn", "willowisp"],
		tier: "UU",
		doublesTier: "DUU",
	},
	chikorita: {
		inherit: true,
		tier: "LC",
	},
	bayleef: {
		tier: "NFE",
	},
	meganium: {
		randomBattleMoves: ["aromatherapy", "dragontail", "gigadrain", "leechseed", "lightscreen", "reflect", "synthesis", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	cyndaquil: {
		inherit: true,
		tier: "LC",
	},
	quilava: {
		tier: "NFE",
	},
	typhlosion: {
		inherit: true,
		randomBattleMoves: ["eruption", "fireblast", "focusblast", "hiddenpowergrass", "hiddenpowerrock"],
		tier: "RU",
		doublesTier: "DUU",
	},
	totodile: {
		inherit: true,
		tier: "LC",
	},
	croconaw: {
		tier: "NFE",
	},
	feraligatr: {
		randomBattleMoves: ["aquajet", "dragondance", "earthquake", "icepunch", "superpower", "swordsdance", "waterfall"],
		tier: "RU",
		doublesTier: "DUU",
	},
	sentret: {
		tier: "LC",
	},
	furret: {
		randomBattleMoves: ["aquatail", "firepunch", "doubleedge", "shadowclaw", "trick", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	hoothoot: {
		inherit: true,
		tier: "LC",
	},
	noctowl: {
		randomBattleMoves: ["airslash", "magiccoat", "nightshade", "reflect", "roost", "toxic", "whirlwind"],
		tier: "NU",
		doublesTier: "DUU",
	},
	ledyba: {
		inherit: true,
		tier: "LC",
	},
	ledian: {
		randomBattleMoves: ["encore", "lightscreen", "reflect", "roost", "toxic", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	spinarak: {
		inherit: true,
		tier: "LC",
	},
	ariados: {
		randomBattleMoves: ["agility", "batonpass", "poisonjab", "toxicspikes", "xscissor"],
		tier: "NU",
		doublesTier: "DUU",
	},
	chinchou: {
		tier: "LC",
	},
	lanturn: {
		randomBattleMoves: ["healbell", "icebeam", "scald", "thunderbolt", "thunderwave", "voltswitch"],
		tier: "RU",
		doublesTier: "DUU",
	},
	togepi: {
		inherit: true,
		tier: "LC",
	},
	togetic: {
		tier: "NU",
		doublesTier: "NFE",
	},
	togekiss: {
		inherit: true,
		randomBattleMoves: ["airslash", "aurasphere", "batonpass", "nastyplot", "roost", "thunderwave"],
		tier: "UU",
		doublesTier: "DOU",
	},
	natu: {
		inherit: true,
		tier: "NU",
		doublesTier: "LC",
	},
	xatu: {
		randomBattleMoves: ["heatwave", "lightscreen", "psychic", "reflect", "roost", "thunderwave", "toxic", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	mareep: {
		inherit: true,
		tier: "LC",
	},
	flaaffy: {
		tier: "NFE",
	},
	ampharos: {
		randomBattleMoves: ["focusblast", "healbell", "hiddenpowerice", "hiddenpowergrass", "thunderbolt", "toxic", "voltswitch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	azurill: {
		tier: "LC",
	},
	marill: {
		tier: "NFE",
	},
	azumarill: {
		randomBattleMoves: ["aquajet", "doubleedge", "icepunch", "superpower", "waterfall"],
		tier: "UU",
		doublesTier: "DUU",
	},
	bonsly: {
		tier: "LC",
	},
	sudowoodo: {
		randomBattleMoves: ["earthquake", "stealthrock", "stoneedge", "suckerpunch", "toxic", "woodhammer"],
		tier: "NU",
		doublesTier: "DUU",
	},
	hoppip: {
		tier: "LC",
	},
	skiploom: {
		tier: "NFE",
	},
	jumpluff: {
		inherit: true,
		randomBattleMoves: ["acrobatics", "encore", "leechseed", "seedbomb", "sleeppowder", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	aipom: {
		inherit: true,
		tier: "LC",
	},
	ambipom: {
		randomBattleMoves: ["fakeout", "lowkick", "pursuit", "return", "switcheroo", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	sunkern: {
		inherit: true,
		tier: "LC",
	},
	sunflora: {
		randomBattleMoves: ["earthpower", "encore", "hiddenpowerrock", "solarbeam", "sunnyday"],
		tier: "NU",
		doublesTier: "DUU",
	},
	yanma: {
		tier: "LC Uber",
	},
	yanmega: {
		randomBattleMoves: ["airslash", "bugbuzz", "hiddenpowerground", "protect", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	wooper: {
		tier: "LC",
	},
	quagsire: {
		randomBattleMoves: ["curse", "earthquake", "encore", "recover", "scald", "toxic", "waterfall"],
		tier: "RU",
		doublesTier: "DUU",
	},
	murkrow: {
		inherit: true,
		tier: "NU",
		doublesTier: "LC Uber",
	},
	honchkrow: {
		randomBattleMoves: ["bravebird", "heatwave", "pursuit", "roost", "substitute", "suckerpunch", "superpower"],
		tier: "UU",
		doublesTier: "DUU",
	},
	misdreavus: {
		inherit: true,
		tier: "NU",
		doublesTier: "LC",
	},
	mismagius: {
		randomBattleMoves: ["hiddenpowerfighting", "nastyplot", "shadowball", "taunt", "thunderbolt"],
		tier: "UU",
		doublesTier: "DUU",
	},
	unown: {
		randomBattleMoves: ["hiddenpowerpsychic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	wynaut: {
		inherit: true,
		tier: "LC",
	},
	wobbuffet: {
		inherit: true,
		randomBattleMoves: ["counter", "destinybond", "encore", "mirrorcoat"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	girafarig: {
		randomBattleMoves: ["batonpass", "calmmind", "hypervoice", "psychic", "thunderbolt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pineco: {
		inherit: true,
		tier: "LC",
	},
	forretress: {
		randomBattleMoves: ["gyroball", "rapidspin", "spikes", "stealthrock", "toxic", "voltswitch"],
		tier: "OU",
		doublesTier: "DUU",
	},
	dunsparce: {
		randomBattleMoves: ["bite", "bodyslam", "coil", "glare", "headbutt", "rockslide", "roost"],
		tier: "NU",
		doublesTier: "DUU",
	},
	gligar: {
		inherit: true,
		randomBattleMoves: ["earthquake", "roost", "stealthrock", "taunt", "toxic", "uturn"],
		tier: "UU",
		doublesTier: "LC Uber",
	},
	gliscor: {
		randomBattleMoves: ["batonpass", "earthquake", "icefang", "protect", "substitute", "swordsdance", "taunt", "toxic"],
		tier: "OU",
		doublesTier: "DOU",
	},
	snubbull: {
		inherit: true,
		tier: "LC",
	},
	granbull: {
		randomBattleMoves: ["closecombat", "crunch", "healbell", "return", "thunderwave", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	qwilfish: {
		inherit: true,
		randomBattleMoves: ["destinybond", "haze", "painsplit", "poisonjab", "spikes", "taunt", "thunderwave", "waterfall"],
		tier: "RU",
		doublesTier: "DUU",
	},
	shuckle: {
		inherit: true,
		randomBattleMoves: ["acupressure", "powersplit", "rest", "rollout"],
		tier: "NU",
		doublesTier: "DUU",
	},
	heracross: {
		randomBattleMoves: ["closecombat", "facade", "earthquake", "megahorn", "stoneedge", "substitute"],
		tier: "UU",
		doublesTier: "DUU",
	},
	sneasel: {
		inherit: true,
		tier: "NU",
		doublesTier: "LC Uber",
	},
	weavile: {
		inherit: true,
		randomBattleMoves: ["iceshard", "lowkick", "nightslash", "pursuit", "swordsdance"],
		tier: "UU",
		doublesTier: "DOU",
	},
	teddiursa: {
		inherit: true,
		tier: "LC",
	},
	ursaring: {
		randomBattleMoves: ["closecombat", "crunch", "earthquake", "facade", "protect", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	slugma: {
		tier: "LC",
	},
	magcargo: {
		inherit: true,
		randomBattleMoves: ["hiddenpowerrock", "lavaplume", "recover", "shellsmash", "stealthrock", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	swinub: {
		inherit: true,
		tier: "LC",
	},
	piloswine: {
		tier: "NU",
		doublesTier: "NFE",
	},
	mamoswine: {
		inherit: true,
		randomBattleMoves: ["earthquake", "endeavor", "iceshard", "iciclecrash", "stealthrock", "superpower"],
		tier: "OU",
		doublesTier: "DOU",
	},
	corsola: {
		inherit: true,
		randomBattleMoves: ["powergem", "recover", "scald", "stealthrock", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	remoraid: {
		tier: "LC",
	},
	octillery: {
		inherit: true,
		randomBattleMoves: ["energyball", "fireblast", "hydropump", "icebeam", "thunderwave"],
		tier: "NU",
		doublesTier: "DUU",
	},
	delibird: {
		inherit: true,
		randomBattleMoves: ["aerialace", "icepunch", "iceshard", "rapidspin"],
		tier: "NU",
		doublesTier: "DUU",
	},
	mantyke: {
		tier: "LC",
	},
	mantine: {
		inherit: true,
		randomBattleMoves: ["airslash", "hydropump", "icebeam", "raindance", "rest", "scald", "sleeptalk"],
		tier: "NU",
		doublesTier: "DUU",
	},
	skarmory: {
		randomBattleMoves: ["bravebird", "roost", "spikes", "stealthrock", "whirlwind"],
		tier: "OU",
		doublesTier: "DUU",
	},
	houndour: {
		inherit: true,
		tier: "LC",
	},
	houndoom: {
		randomBattleMoves: ["darkpulse", "fireblast", "hiddenpowergrass", "nastyplot", "suckerpunch"],
		tier: "UU",
		doublesTier: "DUU",
	},
	phanpy: {
		tier: "LC",
	},
	donphan: {
		randomBattleMoves: ["earthquake", "headsmash", "iceshard", "rapidspin", "seedbomb", "stealthrock"],
		tier: "OU",
		doublesTier: "DUU",
	},
	stantler: {
		inherit: true,
		randomBattleMoves: ["doubleedge", "earthquake", "jumpkick", "megahorn", "suckerpunch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	smeargle: {
		inherit: true,
		randomBattleMoves: ["memento", "spikes", "spore", "stealthrock", "whirlwind"],
		tier: "RU",
		doublesTier: "DUU",
	},
	miltank: {
		randomBattleMoves: ["curse", "bodyslam", "earthquake", "healbell", "milkdrink", "stealthrock"],
		tier: "NU",
		doublesTier: "DUU",
	},
	raikou: {
		inherit: true,
		randomBattleMoves: ["calmmind", "extrasensory", "hiddenpowerice", "substitute", "thunderbolt", "voltswitch"],
		tier: "UU",
		doublesTier: "DUU",
	},
	entei: {
		inherit: true,
		randomBattleMoves: ["extremespeed", "flareblitz", "hiddenpowergrass", "ironhead", "stoneedge"],
		tier: "RU",
		doublesTier: "DUU",
	},
	suicune: {
		inherit: true,
		randomBattleMoves: ["calmmind", "hiddenpowerelectric", "hydropump", "icebeam", "rest", "roar", "scald", "sleeptalk"],
		tier: "UU",
		doublesTier: "DUU",
	},
	larvitar: {
		inherit: true,
		tier: "LC",
	},
	pupitar: {
		tier: "NFE",
	},
	tyranitar: {
		inherit: true,
		randomBattleMoves: ["crunch", "fireblast", "pursuit", "stealthrock", "stoneedge", "superpower"],
		tier: "OU",
		doublesTier: "DOU",
	},
	lugia: {
		inherit: true,
		randomBattleMoves: ["dragontail", "icebeam", "roost", "substitute", "toxic", "whirlwind"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	hooh: {
		inherit: true,
		randomBattleMoves: ["bravebird", "earthquake", "flamecharge", "roost", "sacredfire", "substitute"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	celebi: {
		inherit: true,
		randomBattleMoves: ["batonpass", "earthpower", "gigadrain", "hiddenpowerice", "leafstorm", "nastyplot", "psychic", "recover", "stealthrock", "uturn"],
		tier: "OU",
		doublesTier: "DUU",
	},
	treecko: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "LC",
	},
	grovyle: {
		maleOnlyHidden: true,
		tier: "NFE",
	},
	sceptile: {
		inherit: true,
		randomBattleMoves: ["acrobatics", "earthquake", "gigadrain", "hiddenpowerfire", "leafblade", "leechseed", "substitute", "swordsdance"],
		maleOnlyHidden: true,
		tier: "RU",
		doublesTier: "DUU",
	},
	torchic: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "LC",
	},
	combusken: {
		maleOnlyHidden: true,
		tier: "NU",
		doublesTier: "DUU",
	},
	blaziken: {
		inherit: true,
		randomBattleMoves: ["batonpass", "flareblitz", "highjumpkick", "protect", "stoneedge", "swordsdance"],
		maleOnlyHidden: true,
		tier: "Uber",
		doublesTier: "DOU",
	},
	mudkip: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "LC",
	},
	marshtomp: {
		maleOnlyHidden: true,
		tier: "NFE",
	},
	swampert: {
		inherit: true,
		randomBattleMoves: ["earthquake", "icepunch", "roar", "stealthrock", "superpower", "toxic", "waterfall"],
		maleOnlyHidden: true,
		tier: "UU",
		doublesTier: "DUU",
	},
	poochyena: {
		inherit: true,
		tier: "LC",
	},
	mightyena: {
		randomBattleMoves: ["crunch", "facade", "firefang", "howl", "suckerpunch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	zigzagoon: {
		inherit: true,
		tier: "LC",
	},
	linoone: {
		randomBattleMoves: ["bellydrum", "extremespeed", "seedbomb", "shadowclaw", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	wurmple: {
		tier: "LC",
	},
	silcoon: {
		tier: "NFE",
	},
	beautifly: {
		randomBattleMoves: ["bugbuzz", "hiddenpowerground", "psychic", "quiverdance", "roost", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	cascoon: {
		tier: "NFE",
	},
	dustox: {
		randomBattleMoves: ["bugbuzz", "quiverdance", "roost", "sludgebomb", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	lotad: {
		inherit: true,
		tier: "LC",
	},
	lombre: {
		tier: "NFE",
	},
	ludicolo: {
		inherit: true,
		randomBattleMoves: ["gigadrain", "hydropump", "icebeam", "raindance", "scald"],
		tier: "NU",
		doublesTier: "DOU",
	},
	seedot: {
		inherit: true,
		tier: "LC",
	},
	nuzleaf: {
		tier: "NFE",
	},
	shiftry: {
		randomBattleMoves: ["darkpulse", "hiddenpowerfire", "leafstorm", "naturepower", "seedbomb", "suckerpunch", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	taillow: {
		inherit: true,
		tier: "LC",
	},
	swellow: {
		inherit: true,
		randomBattleMoves: ["bravebird", "facade", "protect", "quickattack", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	wingull: {
		tier: "LC",
	},
	pelipper: {
		randomBattleMoves: ["hurricane", "icebeam", "roost", "scald", "tailwind", "toxic", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	ralts: {
		inherit: true,
		tier: "LC",
	},
	kirlia: {
		tier: "NFE",
	},
	gardevoir: {
		inherit: true,
		randomBattleMoves: ["calmmind", "focusblast", "painsplit", "psychic", "substitute", "thunderbolt", "trick", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	gallade: {
		randomBattleMoves: ["closecombat", "drainpunch", "nightslash", "psychocut", "substitute", "swordsdance", "trick"],
		tier: "RU",
		doublesTier: "DUU",
	},
	surskit: {
		inherit: true,
		tier: "LC",
	},
	masquerain: {
		randomBattleMoves: ["airslash", "batonpass", "bugbuzz", "quiverdance", "roost"],
		tier: "NU",
		doublesTier: "DUU",
	},
	shroomish: {
		inherit: true,
		tier: "LC",
	},
	breloom: {
		randomBattleMoves: ["bulletseed", "focuspunch", "leechseed", "lowsweep", "machpunch", "spore", "stoneedge", "substitute", "swordsdance"],
		tier: "OU",
		doublesTier: "DOU",
	},
	slakoth: {
		tier: "LC",
	},
	vigoroth: {
		randomBattleMoves: ["bulkup", "earthquake", "return", "slackoff", "taunt", "toxic"],
		tier: "NU",
		doublesTier: "NFE",
	},
	slaking: {
		inherit: true,
		randomBattleMoves: ["doubleedge", "earthquake", "nightslash", "pursuit", "retaliate"],
		tier: "NU",
		doublesTier: "DUU",
	},
	nincada: {
		tier: "LC",
	},
	ninjask: {
		randomBattleMoves: ["batonpass", "protect", "substitute", "swordsdance", "xscissor"],
		tier: "NU",
		doublesTier: "DUU",
	},
	shedinja: {
		inherit: true,
		randomBattleMoves: ["shadowclaw", "suckerpunch", "swordsdance", "willowisp", "xscissor"],
		tier: "NU",
		doublesTier: "DUU",
	},
	whismur: {
		inherit: true,
		tier: "LC",
	},
	loudred: {
		tier: "NFE",
	},
	exploud: {
		inherit: true,
		randomBattleMoves: ["fireblast", "focusblast", "hypervoice", "lowkick", "surf"],
		tier: "NU",
		doublesTier: "DUU",
	},
	makuhita: {
		inherit: true,
		tier: "LC",
	},
	hariyama: {
		randomBattleMoves: ["bulletpunch", "closecombat", "facade", "fakeout", "icepunch", "stoneedge"],
		tier: "RU",
		doublesTier: "DUU",
	},
	nosepass: {
		inherit: true,
		tier: "LC",
	},
	probopass: {
		randomBattleMoves: ["earthpower", "flashcannon", "powergem", "stealthrock", "toxic", "voltswitch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	skitty: {
		inherit: true,
		tier: "LC",
	},
	delcatty: {
		inherit: true,
		randomBattleMoves: ["batonpass", "calmmind", "hypervoice", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	sableye: {
		inherit: true,
		randomBattleMoves: ["foulplay", "nightshade", "recover", "taunt", "willowisp"],
		tier: "UU",
		doublesTier: "DOU",
	},
	mawile: {
		inherit: true,
		randomBattleMoves: ["batonpass", "firefang", "ironhead", "substitute", "suckerpunch", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	aron: {
		tier: "LC",
	},
	lairon: {
		tier: "NU",
		doublesTier: "NFE",
	},
	aggron: {
		inherit: true,
		randomBattleMoves: ["aquatail", "earthquake", "headsmash", "heavyslam", "rockpolish", "stealthrock", "thunderwave"],
		tier: "RU",
		doublesTier: "DUU",
	},
	meditite: {
		inherit: true,
		tier: "LC Uber",
	},
	medicham: {
		randomBattleMoves: ["bulletpunch", "highjumpkick", "icepunch", "psychocut", "thunderpunch", "trick"],
		tier: "RU",
		doublesTier: "DUU",
	},
	electrike: {
		tier: "LC",
	},
	manectric: {
		inherit: true,
		randomBattleMoves: ["flamethrower", "hiddenpowerice", "overheat", "switcheroo", "thunderbolt", "voltswitch"],
		tier: "RU",
		doublesTier: "DUU",
	},
	plusle: {
		inherit: true,
		randomBattleMoves: ["batonpass", "hiddenpowerice", "nastyplot", "thunderbolt", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	minun: {
		inherit: true,
		randomBattleMoves: ["batonpass", "encore", "nastyplot", "thunderbolt", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	volbeat: {
		randomBattleMoves: ["batonpass", "bugbuzz", "encore", "substitute", "tailglow", "thunderwave"],
		tier: "NU",
		doublesTier: "DUU",
	},
	illumise: {
		randomBattleMoves: ["batonpass", "bugbuzz", "encore", "substitute", "thunderwave", "wish"],
		tier: "NU",
		doublesTier: "DUU",
	},
	budew: {
		tier: "LC",
	},
	roselia: {
		inherit: true,
		tier: "NU",
		doublesTier: "NFE",
	},
	roserade: {
		randomBattleMoves: ["gigadrain", "hiddenpowerfire", "leafstorm", "sleeppowder", "sludgebomb", "spikes", "synthesis", "toxicspikes"],
		tier: "UU",
		doublesTier: "DUU",
	},
	gulpin: {
		inherit: true,
		tier: "LC",
	},
	swalot: {
		randomBattleMoves: ["earthquake", "encore", "painsplit", "protect", "sludgebomb", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	carvanha: {
		inherit: true,
		tier: "LC",
	},
	sharpedo: {
		randomBattleMoves: ["crunch", "earthquake", "icebeam", "protect", "waterfall", "zenheadbutt"],
		tier: "UU",
		doublesTier: "DUU",
	},
	wailmer: {
		tier: "LC",
	},
	wailord: {
		inherit: true,
		randomBattleMoves: ["hiddenpowergrass", "hydropump", "icebeam", "surf", "waterspout"],
		tier: "NU",
		doublesTier: "DUU",
	},
	numel: {
		inherit: true,
		tier: "LC",
	},
	camerupt: {
		randomBattleMoves: ["earthpower", "eruption", "hiddenpowergrass", "lavaplume", "roar", "stealthrock"],
		tier: "NU",
		doublesTier: "DUU",
	},
	torkoal: {
		randomBattleMoves: ["earthquake", "lavaplume", "protect", "rapidspin", "stealthrock", "toxic", "yawn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	spoink: {
		inherit: true,
		tier: "LC",
	},
	grumpig: {
		randomBattleMoves: ["focusblast", "healbell", "psychic", "shadowball", "thunderwave", "trick", "whirlwind"],
		tier: "NU",
		doublesTier: "DUU",
	},
	spinda: {
		inherit: true,
		randomBattleMoves: ["return", "suckerpunch", "superpower", "trickroom"],
		tier: "NU",
		doublesTier: "DUU",
	},
	trapinch: {
		inherit: true,
		tier: "LC",
	},
	vibrava: {
		tier: "NFE",
	},
	flygon: {
		inherit: true,
		randomBattleMoves: ["earthquake", "firepunch", "outrage", "roost", "stoneedge", "superpower", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	cacnea: {
		inherit: true,
		tier: "LC",
	},
	cacturne: {
		inherit: true,
		randomBattleMoves: ["drainpunch", "seedbomb", "spikes", "substitute", "suckerpunch", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	swablu: {
		inherit: true,
		tier: "LC",
	},
	altaria: {
		inherit: true,
		randomBattleMoves: ["dracometeor", "dragondance", "earthquake", "fireblast", "healbell", "outrage", "roost"],
		tier: "NU",
		doublesTier: "DUU",
	},
	zangoose: {
		inherit: true,
		randomBattleMoves: ["closecombat", "facade", "nightslash", "quickattack", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	seviper: {
		inherit: true,
		randomBattleMoves: ["earthquake", "flamethrower", "gigadrain", "sludgebomb", "suckerpunch", "switcheroo"],
		tier: "NU",
		doublesTier: "DUU",
	},
	lunatone: {
		inherit: true,
		randomBattleMoves: ["batonpass", "earthpower", "hiddenpowerrock", "moonlight", "psychic", "rockpolish", "stealthrock", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	solrock: {
		inherit: true,
		randomBattleMoves: ["explosion", "lightscreen", "morningsun", "reflect", "rockslide", "stealthrock", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	barboach: {
		tier: "LC",
	},
	whiscash: {
		inherit: true,
		randomBattleMoves: ["dragondance", "earthquake", "icebeam", "waterfall"],
		tier: "NU",
		doublesTier: "DUU",
	},
	corphish: {
		inherit: true,
		tier: "LC",
	},
	crawdaunt: {
		inherit: true,
		randomBattleMoves: ["crunch", "dragondance", "superpower", "taunt", "waterfall"],
		tier: "RU",
		doublesTier: "DUU",
	},
	baltoy: {
		inherit: true,
		tier: "LC",
	},
	claydol: {
		randomBattleMoves: ["earthquake", "icebeam", "protect", "rapidspin", "stealthrock", "toxic"],
		tier: "UU",
		doublesTier: "DUU",
	},
	lileep: {
		inherit: true,
		tier: "LC",
	},
	cradily: {
		randomBattleMoves: ["earthquake", "recover", "rockslide", "seedbomb", "stealthrock", "swordsdance", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	anorith: {
		inherit: true,
		tier: "LC",
	},
	armaldo: {
		randomBattleMoves: ["aquatail", "earthquake", "rapidspin", "rockblast", "stealthrock", "swordsdance", "xscissor"],
		tier: "NU",
		doublesTier: "DUU",
	},
	feebas: {
		inherit: true,
		tier: "LC",
	},
	milotic: {
		inherit: true,
		randomBattleMoves: ["dragontail", "haze", "icebeam", "recover", "scald", "toxic"],
		tier: "UU",
		doublesTier: "DUU",
	},
	castform: {
		tier: "NU",
		doublesTier: "DUU",
	},
	castformsunny: {
		randomBattleMoves: ["icebeam", "solarbeam", "sunnyday", "weatherball"],
		battleOnly: true,
	},
	castformrainy: {
		randomBattleMoves: ["icebeam", "raindance", "thunder", "weatherball"],
		battleOnly: true,
	},
	castformsnowy: {
		battleOnly: true,
	},
	kecleon: {
		randomBattleMoves: ["foulplay", "recover", "stealthrock", "thunderwave", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	shuppet: {
		inherit: true,
		tier: "LC",
	},
	banette: {
		inherit: true,
		randomBattleMoves: ["destinybond", "shadowclaw", "taunt", "trickroom", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	duskull: {
		inherit: true,
		tier: "LC",
	},
	dusclops: {
		randomBattleMoves: ["curse", "nightshade", "rest", "willowisp"],
		tier: "UU",
		doublesTier: "NFE",
	},
	dusknoir: {
		randomBattleMoves: ["earthquake", "icepunch", "painsplit", "shadowsneak", "willowisp", "trick"],
		tier: "RU",
		doublesTier: "DUU",
	},
	tropius: {
		inherit: true,
		randomBattleMoves: ["airslash", "leechseed", "protect", "roost", "substitute", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	chingling: {
		tier: "LC",
	},
	chimecho: {
		inherit: true,
		randomBattleMoves: ["calmmind", "healingwish", "psychic", "recover", "shadowball", "toxic", "yawn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	absol: {
		inherit: true,
		randomBattleMoves: ["fireblast", "nightslash", "psychocut", "pursuit", "suckerpunch", "superpower", "swordsdance"],
		tier: "RU",
		doublesTier: "DUU",
	},
	snorunt: {
		inherit: true,
		tier: "LC",
	},
	glalie: {
		randomBattleMoves: ["earthquake", "explosion", "icebeam", "spikes", "taunt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	froslass: {
		randomBattleMoves: ["destinybond", "icebeam", "shadowball", "spikes", "taunt", "thunderwave"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	spheal: {
		inherit: true,
		tier: "LC",
	},
	sealeo: {
		tier: "NFE",
	},
	walrein: {
		inherit: true,
		randomBattleMoves: ["encore", "icebeam", "protect", "roar", "surf", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	clamperl: {
		tier: "LC",
	},
	huntail: {
		randomBattleMoves: ["icebeam", "return", "shellsmash", "waterfall"],
		tier: "NU",
		doublesTier: "DUU",
	},
	gorebyss: {
		randomBattleMoves: ["hydropump", "icebeam", "shellsmash", "signalbeam", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	relicanth: {
		randomBattleMoves: ["doubleedge", "earthquake", "headsmash", "stealthrock", "waterfall"],
		tier: "NU",
		doublesTier: "DUU",
	},
	luvdisc: {
		randomBattleMoves: ["icebeam", "protect", "surf", "toxic", "sweetkiss"],
		tier: "NU",
		doublesTier: "DUU",
	},
	bagon: {
		inherit: true,
		tier: "LC",
	},
	shelgon: {
		tier: "NU",
		doublesTier: "NFE",
	},
	salamence: {
		inherit: true,
		randomBattleMoves: ["aquatail", "brickbreak", "dracometeor", "dragondance", "earthquake", "fireblast", "outrage", "roost"],
		tier: "OU",
		doublesTier: "DOU",
	},
	beldum: {
		tier: "LC",
	},
	metang: {
		inherit: true,
		tier: "NU",
		doublesTier: "NFE",
	},
	metagross: {
		inherit: true,
		randomBattleMoves: ["agility", "bulletpunch", "earthquake", "meteormash", "stealthrock", "zenheadbutt"],
		tier: "OU",
		doublesTier: "DOU",
	},
	regirock: {
		inherit: true,
		randomBattleMoves: ["drainpunch", "protect", "rockslide", "stealthrock", "thunderwave", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	regice: {
		inherit: true,
		randomBattleMoves: ["focusblast", "icebeam", "rockpolish", "rest", "sleeptalk", "thunderbolt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	registeel: {
		inherit: true,
		randomBattleMoves: ["ironhead", "curse", "protect", "rest", "sleeptalk", "stealthrock", "toxic"],
		tier: "UU",
		doublesTier: "DUU",
	},
	latias: {
		inherit: true,
		randomBattleMoves: ["calmmind", "dracometeor", "healingwish", "hiddenpowerfire", "psyshock", "roost", "surf"],
		tier: "OU",
		doublesTier: "DUU",
	},
	latios: {
		inherit: true,
		randomBattleMoves: ["dracometeor", "hiddenpowerfire", "psyshock", "roost", "surf", "trick"],
		tier: "OU",
		doublesTier: "DOU",
	},
	kyogre: {
		inherit: true,
		randomBattleMoves: ["calmmind", "icebeam", "rest", "sleeptalk", "surf", "thunder", "waterspout"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	groudon: {
		inherit: true,
		randomBattleMoves: ["dragonclaw", "earthquake", "firepunch", "stealthrock", "stoneedge", "swordsdance", "thunderwave"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	rayquaza: {
		inherit: true,
		randomBattleMoves: ["dracometeor", "dragondance", "earthquake", "extremespeed", "outrage", "swordsdance", "vcreate"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	jirachi: {
		inherit: true,
		randomBattleMoves: ["bodyslam", "calmmind", "firepunch", "icepunch", "ironhead", "psychic", "substitute", "thunder", "uturn", "wish"],
		tier: "OU",
		doublesTier: "DUber",
	},
	deoxys: {
		inherit: true,
		randomBattleMoves: ["firepunch", "icebeam", "lightscreen", "psychoboost", "reflect", "spikes", "stealthrock"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	deoxysattack: {
		randomBattleMoves: ["extremespeed", "hiddenpowerfire", "icebeam", "psychoboost", "superpower", "stealthrock"],
		eventOnly: true,
		tier: "Uber",
		doublesTier: "DUU",
	},
	deoxysdefense: {
		randomBattleMoves: ["magiccoat", "recover", "seismictoss", "spikes", "taunt", "toxic"],
		eventOnly: true,
		tier: "Uber",
		doublesTier: "DUU",
	},
	deoxysspeed: {
		randomBattleMoves: ["icebeam", "lightscreen", "magiccoat", "psychoboost", "reflect", "spikes", "stealthrock", "superpower", "taunt"],
		eventOnly: true,
		tier: "Uber",
		doublesTier: "DUU",
	},
	turtwig: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "LC",
	},
	grotle: {
		maleOnlyHidden: true,
		tier: "NFE",
	},
	torterra: {
		inherit: true,
		randomBattleMoves: ["earthquake", "rockpolish", "stealthrock", "stoneedge", "synthesis", "woodhammer"],
		maleOnlyHidden: true,
		tier: "NU",
		doublesTier: "DUU",
	},
	chimchar: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "LC",
	},
	monferno: {
		maleOnlyHidden: true,
		tier: "NU",
		doublesTier: "NFE",
	},
	infernape: {
		inherit: true,
		randomBattleMoves: ["closecombat", "flareblitz", "hiddenpowerice", "machpunch", "overheat", "swordsdance", "thunderpunch", "uturn"],
		maleOnlyHidden: true,
		tier: "OU",
		doublesTier: "DOU",
	},
	piplup: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "LC",
	},
	prinplup: {
		maleOnlyHidden: true,
		tier: "NFE",
	},
	empoleon: {
		inherit: true,
		randomBattleMoves: ["agility", "grassknot", "hydropump", "icebeam", "protect", "scald", "stealthrock", "toxic"],
		maleOnlyHidden: true,
		tier: "UU",
		doublesTier: "DUU",
	},
	starly: {
		inherit: true,
		tier: "LC",
	},
	staravia: {
		tier: "NFE",
	},
	staraptor: {
		randomBattleMoves: ["bravebird", "closecombat", "doubleedge", "quickattack", "roost", "uturn"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	bidoof: {
		inherit: true,
		tier: "LC",
	},
	bibarel: {
		randomBattleMoves: ["curse", "quickattack", "rest", "waterfall"],
		tier: "NU",
		doublesTier: "DUU",
	},
	kricketot: {
		tier: "LC",
	},
	kricketune: {
		randomBattleMoves: ["brickbreak", "bugbite", "nightslash", "return", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	shinx: {
		tier: "LC",
	},
	luxio: {
		tier: "NFE",
	},
	luxray: {
		randomBattleMoves: ["crunch", "facade", "icefang", "superpower", "voltswitch", "wildcharge"],
		tier: "NU",
		doublesTier: "DUU",
	},
	cranidos: {
		inherit: true,
		tier: "LC",
	},
	rampardos: {
		randomBattleMoves: ["crunch", "earthquake", "firepunch", "headsmash", "rockpolish", "rockslide", "superpower"],
		tier: "NU",
		doublesTier: "DUU",
	},
	shieldon: {
		inherit: true,
		tier: "LC",
	},
	bastiodon: {
		randomBattleMoves: ["metalburst", "protect", "roar", "rockblast", "stealthrock", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	burmy: {
		tier: "LC",
	},
	wormadam: {
		randomBattleMoves: ["gigadrain", "hiddenpowerrock", "leafstorm", "protect", "signalbeam", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	wormadamsandy: {
		randomBattleMoves: ["earthquake", "protect", "rockblast", "stealthrock", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	wormadamtrash: {
		randomBattleMoves: ["ironhead", "protect", "stealthrock", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	mothim: {
		randomBattleMoves: ["airslash", "bugbuzz", "hiddenpowerground", "quiverdance", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	combee: {
		tier: "LC",
	},
	vespiquen: {
		randomBattleMoves: ["attackorder", "protect", "roost", "substitute", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pachirisu: {
		randomBattleMoves: ["protect", "superfang", "thunderwave", "toxic", "voltswitch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	buizel: {
		tier: "LC",
	},
	floatzel: {
		randomBattleMoves: ["aquajet", "batonpass", "bulkup", "crunch", "icepunch", "switcheroo", "taunt", "waterfall"],
		tier: "NU",
		doublesTier: "DUU",
	},
	cherubi: {
		tier: "LC",
	},
	cherrim: {
		randomBattleMoves: ["energyball", "healingwish", "hiddenpowerrock", "naturepower"],
		tier: "NU",
		doublesTier: "DUU",
	},
	cherrimsunshine: {
		randomBattleMoves: ["naturepower", "solarbeam", "sunnyday", "weatherball"],
		battleOnly: true,
	},
	shellos: {
		tier: "LC",
	},
	gastrodon: {
		randomBattleMoves: ["clearsmog", "earthpower", "icebeam", "recover", "scald", "toxic"],
		tier: "OU",
		doublesTier: "DOU",
	},
	drifloon: {
		tier: "LC",
	},
	drifblim: {
		randomBattleMoves: ["acrobatics", "destinybond", "disable", "shadowball", "substitute", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	buneary: {
		tier: "LC",
	},
	lopunny: {
		randomBattleMoves: ["firepunch", "healingwish", "icepunch", "jumpkick", "return", "switcheroo", "thunderpunch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	glameow: {
		tier: "LC",
	},
	purugly: {
		randomBattleMoves: ["fakeout", "hypnosis", "return", "suckerpunch", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	stunky: {
		tier: "LC",
	},
	skuntank: {
		randomBattleMoves: ["crunch", "fireblast", "poisonjab", "pursuit", "suckerpunch", "taunt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	bronzor: {
		tier: "LC",
	},
	bronzong: {
		randomBattleMoves: ["earthquake", "hypnosis", "lightscreen", "psychic", "reflect", "stealthrock", "toxic"],
		tier: "UU",
		doublesTier: "DOU",
	},
	chatot: {
		inherit: true,
		randomBattleMoves: ["chatter", "heatwave", "hiddenpowerground", "hypervoice", "nastyplot", "substitute", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	spiritomb: {
		inherit: true,
		randomBattleMoves: ["calmmind", "darkpulse", "foulplay", "rest", "shadowsneak", "sleeptalk", "willowisp"],
		tier: "RU",
		doublesTier: "DUU",
	},
	gible: {
		tier: "LC",
	},
	gabite: {
		tier: "NU",
		doublesTier: "NFE",
	},
	garchomp: {
		inherit: true,
		randomBattleMoves: ["aquatail", "earthquake", "fireblast", "outrage", "stealthrock", "stoneedge", "swordsdance"],
		tier: "OU",
		doublesTier: "DOU",
	},
	riolu: {
		inherit: true,
		tier: "LC",
	},
	lucario: {
		inherit: true,
		randomBattleMoves: ["aurasphere", "closecombat", "crunch", "darkpulse", "extremespeed", "icepunch", "nastyplot", "swordsdance", "vacuumwave"],
		tier: "OU",
		doublesTier: "DOU",
	},
	hippopotas: {
		tier: "LC",
	},
	hippowdon: {
		randomBattleMoves: ["earthquake", "icefang", "slackoff", "stealthrock", "toxic", "whirlwind"],
		tier: "OU",
		doublesTier: "DUU",
	},
	skorupi: {
		tier: "LC",
	},
	drapion: {
		randomBattleMoves: ["aquatail", "crunch", "earthquake", "poisonjab", "pursuit", "swordsdance", "taunt", "toxicspikes", "whirlwind"],
		tier: "RU",
		doublesTier: "DUU",
	},
	croagunk: {
		inherit: true,
		tier: "LC",
	},
	toxicroak: {
		randomBattleMoves: ["drainpunch", "focuspunch", "icepunch", "substitute", "suckerpunch", "swordsdance"],
		tier: "OU",
		doublesTier: "DOU",
	},
	carnivine: {
		randomBattleMoves: ["leechseed", "powerwhip", "return", "sleeppowder", "substitute", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	finneon: {
		tier: "LC",
	},
	lumineon: {
		randomBattleMoves: ["icebeam", "protect", "toxic", "uturn", "waterfall"],
		tier: "NU",
		doublesTier: "DUU",
	},
	snover: {
		tier: "LC",
	},
	abomasnow: {
		randomBattleMoves: ["blizzard", "earthquake", "hiddenpowerfire", "iceshard", "leechseed", "woodhammer"],
		tier: "UU",
		doublesTier: "DOU",
	},
	rotom: {
		inherit: true,
		randomBattleMoves: ["hiddenpowerfighting", "hiddenpowerice", "shadowball", "substitute", "painsplit", "thunderbolt", "trick", "voltswitch", "willowisp"],
		tier: "RU",
		doublesTier: "DUU",
	},
	rotomheat: {
		randomBattleMoves: ["hiddenpowergrass", "overheat", "painsplit", "thunderbolt", "thunderwave", "trick", "voltswitch", "willowisp"],
		tier: "UU",
		doublesTier: "DUU",
	},
	rotomwash: {
		randomBattleMoves: ["hiddenpowerice", "hydropump", "painsplit", "thunderbolt", "thunderwave", "trick", "voltswitch", "willowisp"],
		tier: "OU",
		doublesTier: "DOU",
	},
	rotomfrost: {
		randomBattleMoves: ["blizzard", "hiddenpowerfire", "painsplit", "substitute", "thunderbolt", "trick", "voltswitch", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	rotomfan: {
		randomBattleMoves: ["airslash", "hiddenpowergrass", "painsplit", "substitute", "thunderbolt", "trick", "voltswitch", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	rotommow: {
		randomBattleMoves: ["hiddenpowerfire", "leafstorm", "painsplit", "thunderbolt", "thunderwave", "trick", "voltswitch", "willowisp"],
		tier: "RU",
		doublesTier: "DUU",
	},
	uxie: {
		inherit: true,
		randomBattleMoves: ["healbell", "lightscreen", "memento", "psychic", "reflect", "stealthrock", "thunderwave", "uturn", "yawn"],
		tier: "RU",
		doublesTier: "DUU",
	},
	mesprit: {
		inherit: true,
		randomBattleMoves: ["calmmind", "hiddenpowerfire", "icebeam", "psychic", "stealthrock", "thunderbolt", "trick", "uturn"],
		tier: "RU",
		doublesTier: "DUU",
	},
	azelf: {
		inherit: true,
		randomBattleMoves: ["fireblast", "grassknot", "nastyplot", "psychic", "stealthrock", "taunt", "thunderbolt", "trick", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	dialga: {
		inherit: true,
		randomBattleMoves: ["aurasphere", "bulkup", "dracometeor", "dragontail", "fireblast", "rest", "sleeptalk", "stealthrock", "thunderbolt"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	palkia: {
		inherit: true,
		randomBattleMoves: ["dracometeor", "dragontail", "fireblast", "hydropump", "spacialrend", "surf", "thunderbolt"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	heatran: {
		inherit: true,
		randomBattleMoves: ["earthpower", "fireblast", "flashcannon", "hiddenpowerice", "lavaplume", "protect", "roar", "substitute", "stealthrock", "toxic"],
		tier: "OU",
		doublesTier: "DOU",
	},
	regigigas: {
		inherit: true,
		randomBattleMoves: ["confuseray", "return", "rockslide", "substitute", "thunderwave"],
		tier: "NU",
		doublesTier: "DUU",
	},
	giratina: {
		inherit: true,
		randomBattleMoves: ["aurasphere", "calmmind", "dragontail", "dragonpulse", "rest", "sleeptalk", "willowisp"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	giratinaorigin: {
		randomBattleMoves: ["dracometeor", "dragontail", "earthquake", "hiddenpowerfire", "rest", "shadowsneak", "sleeptalk", "willowisp"],
		eventOnly: true,
		requiredItem: "Griseous Orb",
		tier: "Uber",
		doublesTier: "DUber",
	},
	cresselia: {
		inherit: true,
		randomBattleMoves: ["calmmind", "hiddenpowerfighting", "lightscreen", "lunardance", "moonlight", "psychic", "reflect", "thunderwave", "toxic"],
		tier: "RUBL",
		doublesTier: "DOU",
	},
	phione: {
		inherit: true,
		randomBattleMoves: ["icebeam", "raindance", "rest", "scald", "toxic", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	manaphy: {
		inherit: true,
		randomBattleMoves: ["grassknot", "icebeam", "surf", "tailglow"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	darkrai: {
		inherit: true,
		randomBattleMoves: ["darkpulse", "darkvoid", "focusblast", "nastyplot", "substitute", "trick"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	shaymin: {
		inherit: true,
		randomBattleMoves: ["earthpower", "hiddenpowerfire", "leechseed", "psychic", "seedflare", "rest", "substitute"],
		tier: "UU",
		doublesTier: "DUU",
	},
	shayminsky: {
		randomBattleMoves: ["airslash", "earthpower", "hiddenpowerfire", "hiddenpowerice", "leechseed", "seedflare", "substitute"],
		eventOnly: true,
		tier: "Uber",
		doublesTier: "DOU",
	},
	arceus: {
		inherit: true,
		randomBattleMoves: ["earthquake", "extremespeed", "recover", "shadowclaw", "swordsdance"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	arceusbug: {
		randomBattleMoves: ["earthquake", "recover", "stoneedge", "swordsdance", "xscissor"],
		eventOnly: true,
		requiredItem: "Insect Plate",
	},
	arceusdark: {
		randomBattleMoves: ["calmmind", "judgment", "recover", "refresh"],
		eventOnly: true,
		requiredItem: "Dread Plate",
	},
	arceusdragon: {
		randomBattleMoves: ["earthquake", "extremespeed", "outrage", "recover", "swordsdance"],
		eventOnly: true,
		requiredItem: "Draco Plate",
	},
	arceuselectric: {
		randomBattleMoves: ["calmmind", "icebeam", "judgment", "recover", "substitute"],
		eventOnly: true,
		requiredItem: "Zap Plate",
	},
	arceusfighting: {
		randomBattleMoves: ["calmmind", "darkpulse", "icebeam", "judgment", "recover", "toxic"],
		eventOnly: true,
		requiredItem: "Fist Plate",
	},
	arceusfire: {
		randomBattleMoves: ["calmmind", "fireblast", "flamethrower", "recover", "thunderbolt"],
		eventOnly: true,
		requiredItem: "Flame Plate",
	},
	arceusflying: {
		randomBattleMoves: ["calmmind", "focusblast", "judgment", "recover", "substitute"],
		eventOnly: true,
		requiredItem: "Sky Plate",
	},
	arceusghost: {
		randomBattleMoves: ["calmmind", "focusblast", "judgment", "recover", "roar", "willowisp"],
		eventOnly: true,
		requiredItem: "Spooky Plate",
	},
	arceusgrass: {
		randomBattleMoves: ["calmmind", "earthpower", "icebeam", "judgment", "recover", "stealthrock", "thunderwave"],
		eventOnly: true,
		requiredItem: "Meadow Plate",
	},
	arceusground: {
		randomBattleMoves: ["earthquake", "recover", "stoneedge", "swordsdance", "willowisp"],
		eventOnly: true,
		requiredItem: "Earth Plate",
	},
	arceusice: {
		randomBattleMoves: ["calmmind", "focusblast", "icebeam", "judgment", "recover", "thunderbolt"],
		eventOnly: true,
		requiredItem: "Icicle Plate",
	},
	arceuspoison: {
		randomBattleMoves: ["calmmind", "focusblast", "icebeam", "recover", "sludgebomb", "stealthrock", "willowisp"],
		eventOnly: true,
		requiredItem: "Toxic Plate",
	},
	arceuspsychic: {
		randomBattleMoves: ["calmmind", "focusblast", "icebeam", "psyshock", "recover", "willowisp"],
		eventOnly: true,
		requiredItem: "Mind Plate",
	},
	arceusrock: {
		randomBattleMoves: ["earthquake", "stoneedge", "swordsdance", "recover"],
		eventOnly: true,
		requiredItem: "Stone Plate",
	},
	arceussteel: {
		randomBattleMoves: ["calmmind", "icebeam", "judgment", "recover", "roar", "willowisp"],
		eventOnly: true,
		requiredItem: "Iron Plate",
	},
	arceuswater: {
		randomBattleMoves: ["calmmind", "fireblast", "icebeam", "judgment", "recover"],
		eventOnly: true,
		requiredItem: "Splash Plate",
	},
	victini: {
		inherit: true,
		randomBattleMoves: ["blueflare", "boltstrike", "focusblast", "thunderbolt", "trick", "uturn", "vcreate"],
		tier: "UU",
		doublesTier: "DOU",
	},
	snivy: {
		inherit: true,
		tier: "LC",
	},
	servine: {
		tier: "NFE",
	},
	serperior: {
		inherit: true,
		randomBattleMoves: ["calmmind", "dragonpulse", "gigadrain", "hiddenpowerfire", "leechseed", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	tepig: {
		tier: "LC",
	},
	pignite: {
		tier: "NFE",
	},
	emboar: {
		inherit: true,
		randomBattleMoves: ["earthquake", "fireblast", "flareblitz", "grassknot", "headsmash", "superpower", "wildcharge"],
		tier: "RU",
		doublesTier: "DUU",
	},
	oshawott: {
		tier: "LC",
	},
	dewott: {
		tier: "NFE",
	},
	samurott: {
		inherit: true,
		randomBattleMoves: ["aquajet", "grassknot", "icebeam", "megahorn", "superpower", "swordsdance", "waterfall"],
		tier: "NU",
		doublesTier: "DUU",
	},
	patrat: {
		tier: "LC",
	},
	watchog: {
		randomBattleMoves: ["batonpass", "hypnosis", "return", "substitute", "superfang", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	lillipup: {
		tier: "LC",
	},
	herdier: {
		tier: "NFE",
	},
	stoutland: {
		randomBattleMoves: ["crunch", "return", "superpower", "thunderwave", "wildcharge"],
		tier: "NU",
		doublesTier: "DUU",
	},
	purrloin: {
		inherit: true,
		tier: "LC",
	},
	liepard: {
		inherit: true,
		randomBattleMoves: ["foulplay", "substitute", "swagger", "thunderwave"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pansage: {
		inherit: true,
		tier: "LC",
	},
	simisage: {
		randomBattleMoves: ["focusblast", "gigadrain", "hiddenpowerrock", "leechseed", "nastyplot", "substitute", "superpower"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pansear: {
		inherit: true,
		tier: "LC",
	},
	simisear: {
		randomBattleMoves: ["fireblast", "focusblast", "grassknot", "hiddenpowerrock", "nastyplot", "substitute", "superpower"],
		tier: "NU",
		doublesTier: "DUU",
	},
	panpour: {
		inherit: true,
		tier: "LC",
	},
	simipour: {
		randomBattleMoves: ["focusblast", "hiddenpowergrass", "hydropump", "icebeam", "nastyplot", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	munna: {
		tier: "LC",
	},
	musharna: {
		inherit: true,
		randomBattleMoves: ["batonpass", "calmmind", "healbell", "hiddenpowerground", "moonlight", "psychic", "signalbeam", "toxic", "trickroom"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pidove: {
		inherit: true,
		tier: "LC",
	},
	tranquill: {
		tier: "NFE",
	},
	unfezant: {
		randomBattleMoves: ["hypnosis", "pluck", "return", "roost", "tailwind", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	blitzle: {
		tier: "LC",
	},
	zebstrika: {
		randomBattleMoves: ["hiddenpowergrass", "overheat", "thunderbolt", "voltswitch", "wildcharge"],
		tier: "NU",
		doublesTier: "DUU",
	},
	roggenrola: {
		tier: "LC",
	},
	boldore: {
		tier: "NFE",
	},
	gigalith: {
		randomBattleMoves: ["earthquake", "explosion", "rockblast", "stealthrock", "stoneedge", "superpower"],
		tier: "NU",
		doublesTier: "DUU",
	},
	woobat: {
		tier: "LC",
	},
	swoobat: {
		randomBattleMoves: ["airslash", "calmmind", "heatwave", "roost", "storedpower"],
		tier: "NU",
		doublesTier: "DUU",
	},
	drilbur: {
		tier: "LC",
	},
	excadrill: {
		randomBattleMoves: ["earthquake", "ironhead", "rapidspin", "rockslide", "swordsdance"],
		tier: "OU",
		doublesTier: "DOU",
	},
	audino: {
		inherit: true,
		randomBattleMoves: ["doubleedge", "healbell", "magiccoat", "protect", "toxic", "wish"],
		tier: "NU",
		doublesTier: "DUU",
	},
	timburr: {
		tier: "LC",
	},
	gurdurr: {
		tier: "NU",
		doublesTier: "NFE",
	},
	conkeldurr: {
		randomBattleMoves: ["bulkup", "drainpunch", "icepunch", "machpunch", "thunderpunch"],
		tier: "OU",
		doublesTier: "DOU",
	},
	tympole: {
		tier: "LC",
	},
	palpitoad: {
		tier: "NFE",
	},
	seismitoad: {
		randomBattleMoves: ["earthquake", "hydropump", "raindance", "sludgewave", "stealthrock", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	throh: {
		randomBattleMoves: ["bulkup", "circlethrow", "icepunch", "rest", "sleeptalk", "stormthrow", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	sawk: {
		randomBattleMoves: ["bulkup", "closecombat", "earthquake", "icepunch", "stoneedge"],
		tier: "NU",
		doublesTier: "DUU",
	},
	sewaddle: {
		tier: "LC",
	},
	swadloon: {
		tier: "NFE",
	},
	leavanny: {
		randomBattleMoves: ["batonpass", "leafblade", "swordsdance", "xscissor"],
		tier: "NU",
		doublesTier: "DUU",
	},
	venipede: {
		tier: "LC",
	},
	whirlipede: {
		tier: "NU",
		doublesTier: "NFE",
	},
	scolipede: {
		randomBattleMoves: ["aquatail", "batonpass", "earthquake", "megahorn", "rockslide", "spikes", "swordsdance"],
		tier: "NUBL",
		doublesTier: "DUU",
	},
	cottonee: {
		tier: "LC",
	},
	whimsicott: {
		inherit: true,
		randomBattleMoves: ["encore", "leechseed", "substitute", "stunspore", "taunt", "uturn"],
		tier: "RU",
		doublesTier: "DOU",
	},
	petilil: {
		tier: "LC",
	},
	lilligant: {
		randomBattleMoves: ["gigadrain", "hiddenpowerfire", "hiddenpowerrock", "petaldance", "quiverdance", "sleeppowder"],
		tier: "RU",
		doublesTier: "DUU",
	},
	basculin: {
		randomBattleMoves: ["aquajet", "crunch", "superpower", "waterfall", "zenheadbutt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	basculinbluestriped: {
		randomBattleMoves: ["aquajet", "crunch", "superpower", "waterfall", "zenheadbutt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	sandile: {
		tier: "LC",
	},
	krokorok: {
		tier: "NFE",
	},
	krookodile: {
		randomBattleMoves: ["bulkup", "crunch", "earthquake", "pursuit", "stoneedge", "superpower"],
		tier: "UU",
		doublesTier: "DUU",
	},
	darumaka: {
		tier: "LC",
	},
	darmanitan: {
		inherit: true,
		randomBattleMoves: ["earthquake", "flareblitz", "rockslide", "superpower", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	maractus: {
		randomBattleMoves: ["gigadrain", "hiddenpowerfire", "leechseed", "spikes", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	dwebble: {
		tier: "LC",
	},
	crustle: {
		randomBattleMoves: ["earthquake", "rockblast", "shellsmash", "spikes", "stealthrock", "stoneedge", "xscissor"],
		tier: "RU",
		doublesTier: "DUU",
	},
	scraggy: {
		inherit: true,
		tier: "LC Uber",
	},
	scrafty: {
		inherit: true,
		randomBattleMoves: ["crunch", "dragondance", "highjumpkick", "icepunch", "zenheadbutt"],
		tier: "UU",
		doublesTier: "DUU",
	},
	sigilyph: {
		randomBattleMoves: ["cosmicpower", "psychoshift", "roost", "storedpower"],
		tier: "RU",
		doublesTier: "DUU",
	},
	yamask: {
		tier: "LC",
	},
	cofagrigus: {
		randomBattleMoves: ["haze", "hiddenpowerfighting", "nastyplot", "painsplit", "shadowball", "trickroom", "willowisp"],
		tier: "UU",
		doublesTier: "DUU",
	},
	tirtouga: {
		inherit: true,
		tier: "LC",
	},
	carracosta: {
		randomBattleMoves: ["aquajet", "earthquake", "icebeam", "shellsmash", "stealthrock", "stoneedge", "waterfall"],
		tier: "NU",
		doublesTier: "DUU",
	},
	archen: {
		inherit: true,
		tier: "LC",
	},
	archeops: {
		randomBattleMoves: ["acrobatics", "earthquake", "headsmash", "pluck", "roost", "stoneedge", "uturn"],
		tier: "RU",
		doublesTier: "DUU",
	},
	trubbish: {
		tier: "LC",
	},
	garbodor: {
		randomBattleMoves: ["clearsmog", "explosion", "spikes", "toxicspikes"],
		tier: "NU",
		doublesTier: "DUU",
	},
	zorua: {
		tier: "LC",
	},
	zoroark: {
		inherit: true,
		randomBattleMoves: ["darkpulse", "flamethrower", "focusblast", "nastyplot", "suckerpunch", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	minccino: {
		tier: "LC",
	},
	cinccino: {
		randomBattleMoves: ["aquatail", "bulletseed", "return", "rockblast", "uturn", "wakeupslap"],
		tier: "RU",
		doublesTier: "DUU",
	},
	gothita: {
		tier: "LC",
	},
	gothorita: {
		inherit: true,
		maleOnlyHidden: true,
		tier: "NFE",
	},
	gothitelle: {
		randomBattleMoves: ["calmmind", "hiddenpowerfighting", "psyshock", "rest", "thunderbolt", "trick"],
		maleOnlyHidden: true,
		tier: "UUBL",
		doublesTier: "DUU",
	},
	solosis: {
		tier: "LC",
	},
	duosion: {
		tier: "NFE",
	},
	reuniclus: {
		randomBattleMoves: ["calmmind", "focusblast", "psychic", "recover", "shadowball", "trickroom"],
		tier: "OU",
		doublesTier: "DOU",
	},
	ducklett: {
		tier: "LC",
	},
	swanna: {
		randomBattleMoves: ["hurricane", "icebeam", "raindance", "roost", "surf"],
		tier: "NU",
		doublesTier: "DUU",
	},
	vanillite: {
		tier: "LC",
	},
	vanillish: {
		tier: "NFE",
	},
	vanilluxe: {
		randomBattleMoves: ["autotomize", "explosion", "flashcannon", "hiddenpowerground", "icebeam"],
		tier: "NU",
		doublesTier: "DUU",
	},
	deerling: {
		inherit: true,
		tier: "LC",
	},
	sawsbuck: {
		randomBattleMoves: ["batonpass", "doubleedge", "hornleech", "megahorn", "naturepower", "return", "substitute", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	emolga: {
		randomBattleMoves: ["agility", "airslash", "batonpass", "chargebeam", "roost", "substitute", "thunderbolt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	karrablast: {
		inherit: true,
		tier: "LC",
	},
	escavalier: {
		randomBattleMoves: ["ironhead", "megahorn", "pursuit", "return", "swordsdance"],
		tier: "RU",
		doublesTier: "DUU",
	},
	foongus: {
		tier: "LC",
	},
	amoonguss: {
		randomBattleMoves: ["clearsmog", "gigadrain", "hiddenpowerfire", "spore", "stunspore", "synthesis"],
		tier: "RU",
		doublesTier: "DOU",
	},
	frillish: {
		tier: "LC",
	},
	jellicent: {
		inherit: true,
		randomBattleMoves: ["icebeam", "recover", "scald", "shadowball", "toxic", "waterspout"],
		tier: "OU",
		doublesTier: "DOU",
	},
	alomomola: {
		randomBattleMoves: ["protect", "scald", "toxic", "waterfall", "wish"],
		tier: "NU",
		doublesTier: "DUU",
	},
	joltik: {
		tier: "LC",
	},
	galvantula: {
		randomBattleMoves: ["bugbuzz", "gigadrain", "hiddenpowerice", "thunder", "voltswitch"],
		tier: "RU",
		doublesTier: "DUU",
	},
	ferroseed: {
		tier: "RU",
		doublesTier: "LC",
	},
	ferrothorn: {
		randomBattleMoves: ["leechseed", "powerwhip", "protect", "spikes", "stealthrock", "thunderwave"],
		tier: "OU",
		doublesTier: "DOU",
	},
	klink: {
		tier: "LC",
	},
	klang: {
		tier: "NFE",
	},
	klinklang: {
		randomBattleMoves: ["geargrind", "return", "shiftgear", "wildcharge"],
		tier: "RU",
		doublesTier: "DUU",
	},
	tynamo: {
		tier: "LC",
	},
	eelektrik: {
		tier: "NFE",
	},
	eelektross: {
		randomBattleMoves: ["aquatail", "drainpunch", "flamethrower", "gigadrain", "hiddenpowerice", "superpower", "thunderbolt", "thunderpunch", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	elgyem: {
		tier: "LC",
	},
	beheeyem: {
		randomBattleMoves: ["hiddenpowerfighting", "psychic", "substitute", "thunderbolt", "trick", "trickroom"],
		tier: "NU",
		doublesTier: "DUU",
	},
	litwick: {
		tier: "LC",
	},
	lampent: {
		tier: "NU",
		doublesTier: "NFE",
	},
	chandelure: {
		inherit: true,
		randomBattleMoves: ["energyball", "fireblast", "hiddenpowerfighting", "hiddenpowerground", "painsplit", "shadowball", "substitute", "trick"],
		tier: "UUBL",
		doublesTier: "DOU",
	},
	axew: {
		inherit: true,
		tier: "LC",
	},
	fraxure: {
		tier: "NU",
		doublesTier: "NFE",
	},
	haxorus: {
		inherit: true,
		randomBattleMoves: ["aquatail", "dragondance", "earthquake", "outrage", "superpower", "swordsdance"],
		tier: "OU",
		doublesTier: "DUU",
	},
	cubchoo: {
		inherit: true,
		tier: "LC",
	},
	beartic: {
		randomBattleMoves: ["aquajet", "iciclecrash", "stoneedge", "superpower", "taunt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	cryogonal: {
		randomBattleMoves: ["hiddenpowerfire", "icebeam", "rapidspin", "recover", "reflect", "toxic"],
		tier: "RU",
		doublesTier: "DUU",
	},
	shelmet: {
		inherit: true,
		tier: "LC",
	},
	accelgor: {
		randomBattleMoves: ["bugbuzz", "encore", "focusblast", "gigadrain", "hiddenpowerrock", "spikes", "yawn"],
		tier: "RU",
		doublesTier: "DUU",
	},
	stunfisk: {
		randomBattleMoves: ["discharge", "earthpower", "rest", "scald", "sleeptalk", "stealthrock", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	mienfoo: {
		tier: "LC",
	},
	mienshao: {
		randomBattleMoves: ["batonpass", "highjumpkick", "stoneedge", "swordsdance", "substitute", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	druddigon: {
		inherit: true,
		randomBattleMoves: ["dragontail", "earthquake", "firepunch", "glare", "outrage", "substitute", "suckerpunch", "stealthrock"],
		tier: "RU",
		doublesTier: "DUU",
	},
	golett: {
		tier: "LC",
	},
	golurk: {
		inherit: true,
		randomBattleMoves: ["drainpunch", "earthquake", "icepunch", "rockpolish", "shadowpunch", "stealthrock"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pawniard: {
		tier: "LC",
	},
	bisharp: {
		randomBattleMoves: ["ironhead", "lowkick", "nightslash", "substitute", "suckerpunch", "swordsdance", "taunt"],
		tier: "UU",
		doublesTier: "DUU",
	},
	bouffalant: {
		randomBattleMoves: ["earthquake", "headcharge", "megahorn", "stoneedge", "substitute", "swordsdance"],
		tier: "RU",
		doublesTier: "DUU",
	},
	rufflet: {
		tier: "LC",
	},
	braviary: {
		inherit: true,
		randomBattleMoves: ["bravebird", "bulkup", "return", "roost", "superpower", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	vullaby: {
		tier: "LC",
	},
	mandibuzz: {
		inherit: true,
		randomBattleMoves: ["bravebird", "foulplay", "roost", "taunt", "toxic", "uturn", "whirlwind"],
		tier: "NU",
		doublesTier: "DUU",
	},
	heatmor: {
		randomBattleMoves: ["fireblast", "gigadrain", "suckerpunch", "superpower"],
		tier: "NU",
		doublesTier: "DUU",
	},
	durant: {
		randomBattleMoves: ["honeclaws", "ironhead", "rockslide", "superpower", "xscissor"],
		tier: "RU",
		doublesTier: "DUU",
	},
	deino: {
		inherit: true,
		tier: "LC",
	},
	zweilous: {
		tier: "NU",
		doublesTier: "NFE",
	},
	hydreigon: {
		inherit: true,
		randomBattleMoves: ["darkpulse", "dracometeor", "flamethrower", "focusblast", "roost", "substitute", "uturn"],
		tier: "OU",
		doublesTier: "DOU",
	},
	larvesta: {
		tier: "LC",
	},
	volcarona: {
		inherit: true,
		randomBattleMoves: ["bugbuzz", "fierydance", "fireblast", "gigadrain", "hiddenpowerground", "quiverdance", "roost"],
		tier: "OU",
		doublesTier: "DOU",
	},
	cobalion: {
		inherit: true,
		randomBattleMoves: ["closecombat", "hiddenpowerice", "ironhead", "stealthrock", "stoneedge", "swordsdance", "taunt", "thunderwave", "voltswitch"],
		tier: "UU",
		doublesTier: "DUU",
	},
	terrakion: {
		inherit: true,
		randomBattleMoves: ["closecombat", "quickattack", "stealthrock", "stoneedge", "swordsdance", "xscissor"],
		tier: "OU",
		doublesTier: "DOU",
	},
	virizion: {
		inherit: true,
		randomBattleMoves: ["calmmind", "closecombat", "focusblast", "gigadrain", "leafblade", "hiddenpowerice", "stoneedge", "swordsdance"],
		tier: "UU",
		doublesTier: "DUU",
	},
	tornadus: {
		inherit: true,
		randomBattleMoves: ["acrobatics", "bulkup", "focusblast", "heatwave", "hurricane", "superpower", "taunt", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	tornadustherian: {
		randomBattleMoves: ["focusblast", "heatwave", "hurricane", "superpower", "uturn"],
		eventOnly: true,
		tier: "Uber",
		doublesTier: "DUU",
	},
	thundurus: {
		inherit: true,
		randomBattleMoves: ["focusblast", "hiddenpowerice", "nastyplot", "thunderbolt", "thunderwave", "voltswitch"],
		tier: "Uber",
		doublesTier: "DOU",
	},
	thundurustherian: {
		randomBattleMoves: ["agility", "focusblast", "grassknot", "hiddenpowerice", "nastyplot", "thunderbolt"],
		eventOnly: true,
		tier: "OU",
		doublesTier: "DOU",
	},
	reshiram: {
		inherit: true,
		randomBattleMoves: ["blueflare", "dracometeor", "dragonpulse", "roost", "stoneedge", "tailwind"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	zekrom: {
		inherit: true,
		randomBattleMoves: ["boltstrike", "dracometeor", "focusblast", "honeclaws", "outrage", "roost", "substitute", "voltswitch"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	landorus: {
		inherit: true,
		randomBattleMoves: ["earthpower", "focusblast", "hiddenpowerice", "psychic", "rockpolish", "rockslide"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	landorustherian: {
		randomBattleMoves: ["earthquake", "hiddenpowerice", "rockpolish", "stealthrock", "stoneedge", "swordsdance", "superpower", "uturn"],
		eventOnly: true,
		tier: "OU",
		doublesTier: "DOU",
	},
	kyurem: {
		inherit: true,
		randomBattleMoves: ["dracometeor", "dragonpulse", "earthpower", "focusblast", "icebeam", "outrage", "roost", "substitute"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	kyuremblack: {
		inherit: true,
		randomBattleMoves: ["dragonclaw", "fusionbolt", "hiddenpowerfire", "icebeam", "roost", "substitute"],
		tier: "OU",
		doublesTier: "DOU",
	},
	kyuremwhite: {
		inherit: true,
		randomBattleMoves: ["dracometeor", "earthpower", "focusblast", "fusionflare", "icebeam", "roost", "substitute"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	keldeo: {
		inherit: true,
		randomBattleMoves: ["calmmind", "hiddenpowergrass", "hydropump", "icywind", "scald", "secretsword", "substitute"],
		tier: "OU",
		doublesTier: "DUU",
	},
	meloetta: {
		inherit: true,
		randomBattleMoves: ["calmmind", "focusblast", "psychic", "shadowball", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	meloettapirouette: {
		randomBattleMoves: ["closecombat", "hiddenpowerice", "psychic", "relicsong", "shadowball"],
		requiredMove: "Relic Song",
		battleOnly: true,
	},
	genesect: {
		inherit: true,
		randomBattleMoves: ["blazekick", "extremespeed", "flamethrower", "icebeam", "ironhead", "shiftgear", "thunderbolt", "uturn"],
		tier: "Uber",
		doublesTier: "DOU",
	},
	pokestarsmeargle: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarufo: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarufo2: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarbrycenman: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarmt: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarmt2: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestartransport: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestargiant: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestargiant2: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarhumanoid: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarmonster: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarf00: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarf002: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarspirit: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarblackdoor: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarwhitedoor: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarblackbelt: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestargiantpropo2: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pokestarufopropu2: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
};

exports.BattleFormatsData = BattleFormatsData;
