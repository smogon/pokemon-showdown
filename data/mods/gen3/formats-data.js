'use strict';

/**@type {{[k: string]: ModdedTemplateFormatsData}} */
let BattleFormatsData = {
	bulbasaur: {
		inherit: true,
		tier: "LC",
	},
	ivysaur: {
		tier: "NFE",
	},
	venusaur: {
		randomBattleMoves: ["sleeppowder", "sludgebomb", "leechseed", "earthquake", "curse", "swordsdance", "synthesis", "hiddenpowerfire", "hiddenpowerice", "gigadrain"],
		tier: "UUBL",
	},
	charmander: {
		inherit: true,
		tier: "LC",
	},
	charmeleon: {
		tier: "NFE",
	},
	charizard: {
		inherit: true,
		randomBattleMoves: ["substitute", "hiddenpowergrass", "fireblast", "flamethrower", "earthquake", "bellydrum", "focuspunch", "dragondance", "aerialace"],
		tier: "UUBL",
	},
	squirtle: {
		inherit: true,
		tier: "LC",
	},
	wartortle: {
		tier: "NFE",
	},
	blastoise: {
		inherit: true,
		randomBattleMoves: ["surf", "icebeam", "earthquake", "rapidspin", "rest", "sleeptalk", "roar", "toxic", "counter", "mirrorcoat"],
		tier: "UU",
	},
	caterpie: {
		tier: "LC",
	},
	metapod: {
		tier: "NFE",
	},
	butterfree: {
		inherit: true,
		randomBattleMoves: ["sleeppowder", "stunspore", "morningsun", "substitute", "whirlwind", "psychic", "hiddenpowerfire", "gigadrain"],
		tier: "NU",
	},
	weedle: {
		tier: "LC",
	},
	kakuna: {
		tier: "NFE",
	},
	beedrill: {
		inherit: true,
		randomBattleMoves: ["sludgebomb", "hiddenpowerbug", "brickbreak", "doubleedge", "swordsdance", "substitute"],
		tier: "NU",
	},
	pidgey: {
		tier: "LC",
	},
	pidgeotto: {
		inherit: true,
		tier: "NFE",
	},
	pidgeot: {
		randomBattleMoves: ["aerialace", "return", "hiddenpowerground", "quickattack", "substitute", "toxic"],
		tier: "NU",
	},
	rattata: {
		tier: "LC",
	},
	raticate: {
		inherit: true,
		randomBattleMoves: ["return", "shadowball", "superfang", "endeavor", "substitute", "quickattack", "hiddenpowerfighting"],
		tier: "NU",
	},
	spearow: {
		inherit: true,
		tier: "LC",
	},
	fearow: {
		randomBattleMoves: ["return", "doubleedge", "quickattack", "drillpeck", "hiddenpowerground", "hiddenpowerfighting", "agility", "substitute", "batonpass"],
		tier: "UU",
	},
	ekans: {
		inherit: true,
		tier: "LC",
	},
	arbok: {
		inherit: true,
		randomBattleMoves: ["sludgebomb", "earthquake", "rockslide", "hiddenpowerfire", "rest", "sleeptalk"],
		tier: "NU",
	},
	pichu: {
		inherit: true,
		tier: "LC",
	},
	pikachu: {
		inherit: true,
		tier: "NU",
	},
	raichu: {
		randomBattleMoves: ["hiddenpowerice", "thunderbolt", "focuspunch", "substitute", "encore", "surf", "volttackle"],
		tier: "UU",
	},
	sandshrew: {
		inherit: true,
		tier: "LC",
	},
	sandslash: {
		randomBattleMoves: ["earthquake", "rapidspin", "swordsdance", "rockslide", "counter", "hiddenpowerbug", "toxic", "bodyslam"],
		tier: "UU",
	},
	nidoranf: {
		tier: "LC",
	},
	nidorina: {
		tier: "NFE",
	},
	nidoqueen: {
		randomBattleMoves: ["earthquake", "icebeam", "fireblast", "thunderbolt", "shadowball", "superpower", "sludgebomb"],
		tier: "UU",
	},
	nidoranm: {
		tier: "LC",
	},
	nidorino: {
		tier: "NFE",
	},
	nidoking: {
		randomBattleMoves: ["earthquake", "sludgebomb", "icebeam", "thunderbolt", "substitute", "megahorn", "focuspunch", "fireblast", "shadowball"],
		tier: "UU",
	},
	cleffa: {
		tier: "LC",
	},
	clefairy: {
		tier: "NFE",
	},
	clefable: {
		randomBattleMoves: ["thunderbolt", "icebeam", "flamethrower", "doubleedge", "return", "meteormash", "shadowball", "calmmind", "bellydrum", "softboiled", "wish", "protect", "encore"],
		tier: "UU",
	},
	vulpix: {
		inherit: true,
		tier: "LC",
	},
	ninetales: {
		randomBattleMoves: ["fireblast", "flamethrower", "hiddenpowergrass", "willowisp", "hypnosis", "substitute"],
		tier: "UU",
	},
	igglybuff: {
		inherit: true,
		tier: "LC",
	},
	jigglypuff: {
		tier: "NFE",
	},
	wigglytuff: {
		randomBattleMoves: ["wish", "protect", "toxic", "doubleedge", "icebeam", "thunderbolt", "fireblast"],
		tier: "NU",
	},
	zubat: {
		tier: "LC",
	},
	golbat: {
		tier: "NU",
	},
	crobat: {
		randomBattleMoves: ["sludgebomb", "aerialace", "hiddenpowerground", "hiddenpowerfighting", "shadowball", "gigadrain", "taunt"],
		tier: "UUBL",
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
		randomBattleMoves: ["sunnyday", "solarbeam", "synthesis", "sludgebomb", "gigadrain", "hiddenpowerfire", "leechseed", "toxic", "sleeppowder", "aromatherapy"],
		tier: "UU",
	},
	bellossom: {
		randomBattleMoves: ["sleeppowder", "stunspore", "leechseed", "moonlight", "gigadrain", "sludgebomb", "magicalleaf", "sunnyday", "solarbeam", "hiddenpowerfire"],
		tier: "NU",
	},
	paras: {
		inherit: true,
		tier: "LC",
	},
	parasect: {
		randomBattleMoves: ["swordsdance", "spore", "return", "hiddenpowerground", "sludgebomb", "aromatherapy", "gigadrain", "hiddenpowerbug"],
		tier: "NU",
	},
	venonat: {
		tier: "LC",
	},
	venomoth: {
		inherit: true,
		randomBattleMoves: ["signalbeam", "sludgebomb", "hiddenpowerground", "substitute", "batonpass", "sleeppowder"],
		tier: "NU",
	},
	diglett: {
		tier: "NU",
	},
	dugtrio: {
		inherit: true,
		randomBattleMoves: ["earthquake", "rockslide", "hiddenpowerbug", "aerialace", "substitute"],
		tier: "OU",
	},
	meowth: {
		inherit: true,
		tier: "LC",
	},
	persian: {
		randomBattleMoves: ["fakeout", "return", "shadowball", "hiddenpowerfighting", "thunderbolt", "hypnosis"],
		tier: "UU",
	},
	psyduck: {
		inherit: true,
		tier: "LC",
	},
	golduck: {
		inherit: true,
		randomBattleMoves: ["surf", "hydropump", "icebeam", "hiddenpowergrass", "calmmind", "hypnosis", "substitute"],
		tier: "UU",
	},
	mankey: {
		tier: "LC",
	},
	primeape: {
		inherit: true,
		randomBattleMoves: ["crosschop", "earthquake", "rockslide", "hiddenpowerghost", "bulkup", "substitute", "endure", "reversal"],
		tier: "UU",
	},
	growlithe: {
		inherit: true,
		tier: "LC",
	},
	arcanine: {
		randomBattleMoves: ["fireblast", "flamethrower", "extremespeed", "hiddenpowerground", "hiddenpowergrass", "rest", "sleeptalk", "toxic", "roar"],
		tier: "UUBL",
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
		randomBattleMoves: ["hydropump", "icebeam", "bulkup", "brickbreak", "toxic", "substitute", "hiddenpowerghost", "hypnosis"],
		tier: "UU",
	},
	politoed: {
		randomBattleMoves: ["hydropump", "surf", "icebeam", "hiddenpowergrass", "toxic", "hypnosis", "counter"],
		tier: "UU",
	},
	abra: {
		tier: "NU",
	},
	kadabra: {
		tier: "UUBL",
	},
	alakazam: {
		inherit: true,
		randomBattleMoves: ["firepunch", "icepunch", "thunderpunch", "psychic", "calmmind", "encore", "thunderwave", "substitute", "recover"],
		tier: "UUBL",
	},
	machop: {
		tier: "LC",
	},
	machoke: {
		tier: "NFE",
	},
	machamp: {
		inherit: true,
		randomBattleMoves: ["crosschop", "earthquake", "bulkup", "hiddenpowerghost", "rockslide", "rest", "sleeptalk"],
		tier: "UUBL",
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
		randomBattleMoves: ["sleeppowder", "sludgebomb", "synthesis", "sunnyday", "solarbeam", "gigadrain", "hiddenpowerfire", "hiddenpowerground", "swordsdance"],
		tier: "UU",
	},
	tentacool: {
		tier: "LC",
	},
	tentacruel: {
		randomBattleMoves: ["icebeam", "rapidspin", "hydropump", "gigadrain", "toxic", "haze"],
		tier: "UU",
	},
	geodude: {
		tier: "LC",
	},
	graveler: {
		tier: "NU",
	},
	golem: {
		randomBattleMoves: ["earthquake", "rockslide", "doubleedge", "explosion", "counter"],
		tier: "UU",
	},
	ponyta: {
		tier: "LC",
	},
	rapidash: {
		inherit: true,
		randomBattleMoves: ["fireblast", "agility", "substitute", "batonpass", "toxic", "hiddenpowergrass", "hypnosis", "sunnyday", "solarbeam"],
		tier: "UU",
	},
	slowpoke: {
		inherit: true,
		tier: "LC",
	},
	slowbro: {
		randomBattleMoves: ["calmmind", "thunderwave", "fireblast", "icebeam", "surf", "rest", "sleeptalk", "psychic"],
		tier: "UUBL",
	},
	slowking: {
		randomBattleMoves: ["surf", "psychic", "fireblast", "flamethrower", "icebeam", "calmmind", "thunderwave", "counter", "rest", "sleeptalk"],
		tier: "UU",
	},
	magnemite: {
		tier: "LC",
	},
	magneton: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "hiddenpowerice", "rest", "sleeptalk", "thunderwave", "toxic", "substitute"],
		tier: "OU",
	},
	farfetchd: {
		inherit: true,
		randomBattleMoves: ["swordsdance", "agility", "slash", "hiddenpowerground", "aerialace", "substitute", "flail", "batonpass", "knockoff"],
		tier: "NU",
	},
	doduo: {
		tier: "LC",
	},
	dodrio: {
		inherit: true,
		randomBattleMoves: ["doubleedge", "return", "drillpeck", "quickattack", "flail", "hiddenpowerground", "substitute", "endure", "batonpass"],
		tier: "UUBL",
	},
	seel: {
		inherit: true,
		tier: "LC",
	},
	dewgong: {
		randomBattleMoves: ["rest", "sleeptalk", "icebeam", "surf", "toxic", "hiddenpowerelectric", "encore"],
		tier: "NU",
	},
	grimer: {
		inherit: true,
		tier: "LC",
	},
	muk: {
		randomBattleMoves: ["sludgebomb", "hiddenpowerground", "curse", "fireblast", "rest", "sleeptalk", "substitute", "shadowpunch", "focuspunch", "explosion"],
		tier: "UU",
	},
	shellder: {
		inherit: true,
		tier: "LC",
	},
	cloyster: {
		randomBattleMoves: ["surf", "icebeam", "spikes", "rapidspin", "explosion", "toxic"],
		tier: "OU",
	},
	gastly: {
		tier: "LC",
	},
	haunter: {
		tier: "NU",
	},
	gengar: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "icepunch", "firepunch", "explosion", "willowisp", "destinybond", "taunt", "substitute", "hypnosis", "psychic", "shadowball"],
		tier: "OU",
	},
	onix: {
		tier: "LC",
	},
	steelix: {
		randomBattleMoves: ["earthquake", "hiddenpowerrock", "irontail", "roar", "toxic", "rest", "explosion", "doubleedge"],
		tier: "UUBL",
	},
	drowzee: {
		inherit: true,
		tier: "LC",
	},
	hypno: {
		inherit: true,
		randomBattleMoves: ["psychic", "hypnosis", "firepunch", "icepunch", "thunderpunch", "calmmind", "batonpass", "wish", "protect", "toxic"],
		tier: "UU",
	},
	krabby: {
		tier: "LC",
	},
	kingler: {
		randomBattleMoves: ["doubleedge", "return", "bodyslam", "hiddenpowerghost", "mudshot", "swordsdance", "endure", "flail", "surf"],
		tier: "NU",
	},
	voltorb: {
		inherit: true,
		tier: "LC",
	},
	electrode: {
		randomBattleMoves: ["thunderbolt", "hiddenpowergrass", "hiddenpowerice", "explosion", "toxic", "taunt", "thunderwave", "substitute"],
		tier: "UU",
	},
	exeggcute: {
		inherit: true,
		tier: "LC",
	},
	exeggutor: {
		inherit: true,
		randomBattleMoves: ["solarbeam", "gigadrain", "psychic", "hiddenpowerice", "hiddenpowerfire", "explosion", "sunnyday", "sleeppowder", "stunspore", "synthesis", "leechseed"],
		tier: "UUBL",
	},
	cubone: {
		tier: "LC",
	},
	marowak: {
		inherit: true,
		randomBattleMoves: ["earthquake", "bonemerang", "rockslide", "doubleedge", "swordsdance"],
		tier: "UUBL",
	},
	tyrogue: {
		tier: "LC",
	},
	hitmonlee: {
		inherit: true,
		randomBattleMoves: ["brickbreak", "highjumpkick", "rockslide", "earthquake", "machpunch", "focuspunch", "reversal", "substitute", "endure", "bulkup", "hiddenpowerghost"],
		tier: "UU",
	},
	hitmonchan: {
		inherit: true,
		randomBattleMoves: ["bulkup", "skyuppercut", "rapidspin", "machpunch", "hiddenpowerghost", "earthquake", "rockslide", "substitute", "focuspunch"],
		tier: "NU",
	},
	hitmontop: {
		randomBattleMoves: ["brickbreak", "highjumpkick", "rockslide", "earthquake", "machpunch", "endeavor", "substitute", "endure", "bulkup", "rapidspin", "counter", "hiddenpowerghost"],
		tier: "UU",
	},
	lickitung: {
		inherit: true,
		randomBattleMoves: ["wish", "protect", "healbell", "seismictoss", "bodyslam", "toxic"],
		tier: "NU",
	},
	koffing: {
		tier: "LC",
	},
	weezing: {
		randomBattleMoves: ["sludgebomb", "haze", "flamethrower", "explosion", "painsplit", "willowisp", "thunderbolt", "shadowball", "toxic"],
		tier: "UUBL",
	},
	rhyhorn: {
		tier: "LC",
	},
	rhydon: {
		inherit: true,
		randomBattleMoves: ["earthquake", "hiddenpowerrock", "megahorn", "doubleedge", "focuspunch", "substitute", "toxic"],
		tier: "UUBL",
	},
	chansey: {
		inherit: true,
		tier: "UUBL",
	},
	blissey: {
		randomBattleMoves: ["icebeam", "thunderbolt", "flamethrower", "seismictoss", "toxic", "thunderwave", "wish", "protect", "softboiled", "calmmind", "counter"],
		tier: "OU",
	},
	tangela: {
		inherit: true,
		randomBattleMoves: ["sunnyday", "solarbeam", "hiddenpowerfire", "sleeppowder", "gigadrain", "stunspore", "leechseed", "morningsun"],
		tier: "NU",
	},
	kangaskhan: {
		inherit: true,
		randomBattleMoves: ["fakeout", "bodyslam", "doubleedge", "earthquake", "rockslide", "brickbreak", "shadowball", "wish"],
		tier: "UU",
	},
	horsea: {
		tier: "LC",
	},
	seadra: {
		inherit: true,
		tier: "NU",
	},
	kingdra: {
		inherit: true,
		randomBattleMoves: ["hydropump", "surf", "icebeam", "hiddenpowergrass", "dragonbreath", "raindance", "rest", "sleeptalk"],
		tier: "UUBL",
	},
	goldeen: {
		tier: "LC",
	},
	seaking: {
		randomBattleMoves: ["hydropump", "icebeam", "hiddenpowergrass", "megahorn", "raindance"],
		tier: "NU",
	},
	staryu: {
		inherit: true,
		tier: "LC",
	},
	starmie: {
		inherit: true,
		randomBattleMoves: ["surf", "thunderbolt", "icebeam", "psychic", "rapidspin", "recover", "hydropump"],
		tier: "OU",
	},
	mrmime: {
		inherit: true,
		randomBattleMoves: ["substitute", "thunderbolt", "psychic", "firepunch", "icepunch", "hypnosis", "reflect", "calmmind", "encore", "batonpass"],
		tier: "UU",
	},
	scyther: {
		inherit: true,
		randomBattleMoves: ["swordsdance", "aerialace", "silverwind", "hiddenpowerground", "quickattack", "batonpass", "morningsun"],
		tier: "UU",
	},
	scizor: {
		inherit: true,
		randomBattleMoves: ["steelwing", "silverwind", "hiddenpowerrock", "morningsun", "swordsdance", "agility", "batonpass", "hiddenpowerground"],
		tier: "UUBL",
	},
	smoochum: {
		tier: "LC",
	},
	jynx: {
		randomBattleMoves: ["icebeam", "psychic", "hiddenpowerfire", "lovelykiss", "calmmind", "substitute"],
		tier: "UUBL",
	},
	elekid: {
		inherit: true,
		tier: "LC",
	},
	electabuzz: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "icepunch", "firepunch", "crosschop", "focuspunch", "substitute", "hiddenpowergrass"],
		tier: "UU",
	},
	magby: {
		tier: "NU",
	},
	magmar: {
		inherit: true,
		randomBattleMoves: ["crosschop", "fireblast", "psychic", "thunderpunch", "focuspunch", "substitute", "hiddenpowergrass"],
		tier: "UU",
	},
	pinsir: {
		inherit: true,
		randomBattleMoves: ["swordsdance", "hiddenpowerbug", "rockslide", "brickbreak", "return", "earthquake"],
		tier: "UU",
	},
	tauros: {
		inherit: true,
		randomBattleMoves: ["bodyslam", "doubleedge", "return", "earthquake", "hiddenpowerrock", "hiddenpowerghost", "irontail"],
		tier: "UUBL",
	},
	magikarp: {
		tier: "LC",
	},
	gyarados: {
		randomBattleMoves: ["hiddenpowerflying", "earthquake", "doubleedge", "hydropump", "substitute", "dragondance", "taunt"],
		tier: "OU",
	},
	lapras: {
		inherit: true,
		randomBattleMoves: ["rest", "sleeptalk", "icebeam", "hydropump", "thunderbolt", "healbell"],
		tier: "UUBL",
	},
	ditto: {
		randomBattleMoves: ["transform"],
		tier: "NU",
	},
	eevee: {
		tier: "LC",
	},
	vaporeon: {
		randomBattleMoves: ["hydropump", "surf", "icebeam", "wish", "toxic", "protect", "roar"],
		tier: "UUBL",
	},
	jolteon: {
		randomBattleMoves: ["thunderbolt", "hiddenpowerice", "substitute", "batonpass", "toxic", "wish"],
		tier: "OU",
	},
	flareon: {
		randomBattleMoves: ["return", "bodyslam", "quickattack", "shadowball", "fireblast", "hiddenpowergrass", "wish", "protect", "toxic"],
		tier: "NU",
	},
	espeon: {
		inherit: true,
		randomBattleMoves: ["psychic", "morningsun", "calmmind", "substitute", "wish", "protect", "batonpass", "reflect", "hiddenpowerfire"],
		tier: "UUBL",
	},
	umbreon: {
		inherit: true,
		randomBattleMoves: ["psychic", "meanlook", "charm", "curse", "substitute", "wish", "protect", "batonpass", "taunt", "toxic", "moonlight"],
		tier: "UUBL",
	},
	porygon: {
		tier: "LC",
	},
	porygon2: {
		randomBattleMoves: ["thunderbolt", "icebeam", "return", "shadowball", "recover", "toxic", "thunderwave"],
		tier: "OU",
	},
	omanyte: {
		tier: "LC",
	},
	omastar: {
		randomBattleMoves: ["raindance", "hydropump", "icebeam", "spikes", "surf", "hiddenpowergrass"],
		tier: "UU",
	},
	kabuto: {
		tier: "LC",
	},
	kabutops: {
		randomBattleMoves: ["return", "brickbreak", "rockslide", "swordsdance", "rapidspin", "hiddenpowerground", "surf"],
		tier: "UU",
	},
	aerodactyl: {
		randomBattleMoves: ["rockslide", "earthquake", "hiddenpowerflying", "doubleedge", "substitute", "taunt", "toxic"],
		tier: "OU",
	},
	snorlax: {
		inherit: true,
		randomBattleMoves: ["earthquake", "bodyslam", "shadowball", "return", "selfdestruct", "curse", "rest", "sleeptalk"],
		tier: "OU",
	},
	articuno: {
		inherit: true,
		randomBattleMoves: ["icebeam", "toxic", "roar", "reflect", "healbell", "rest", "sleeptalk", "haze", "hiddenpowerelectric", "substitute", "agility"],
		tier: "UUBL",
	},
	zapdos: {
		inherit: true,
		randomBattleMoves: ["agility", "batonpass", "thunderbolt", "hiddenpowerice", "toxic", "substitute", "thunderwave"],
		tier: "OU",
	},
	moltres: {
		inherit: true,
		randomBattleMoves: ["fireblast", "flamethrower", "hiddenpowergrass", "doubleedge", "morningsun", "toxic", "agility", "willowisp", "substitute"],
		tier: "OU",
	},
	dratini: {
		tier: "LC",
	},
	dragonair: {
		tier: "NFE",
	},
	dragonite: {
		inherit: true,
		randomBattleMoves: ["hiddenpowerflying", "earthquake", "dragondance", "fireblast", "flamethrower", "icebeam", "thunderbolt", "thunderwave", "healbell", "substitute", "focuspunch"],
		tier: "UUBL",
	},
	mewtwo: {
		inherit: true,
		randomBattleMoves: ["calmmind", "psychic", "icebeam", "thunderbolt", "flamethrower", "recover", "taunt", "selfdestruct"],
		tier: "Uber",
	},
	mew: {
		inherit: true,
		randomBattleMoves: ["softboiled", "calmmind", "psychic", "icebeam", "thunderbolt", "flamethrower", "hypnosis", "transform", "explosion"],
		tier: "Uber",
	},
	chikorita: {
		inherit: true,
		tier: "LC",
	},
	bayleef: {
		tier: "NFE",
	},
	meganium: {
		randomBattleMoves: ["razorleaf", "hiddenpowerfire", "hiddenpowerice", "counter", "synthesis", "leechseed", "toxic", "lightscreen"],
		tier: "UU",
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
		randomBattleMoves: ["fireblast", "flamethrower", "earthquake", "thunderpunch", "hiddenpowerice", "hiddenpowergrass", "substitute"],
		tier: "UUBL",
	},
	totodile: {
		inherit: true,
		tier: "LC",
	},
	croconaw: {
		tier: "NFE",
	},
	feraligatr: {
		randomBattleMoves: ["earthquake", "rockslide", "focuspunch", "substitute", "swordsdance", "hydropump"],
		tier: "UU",
	},
	sentret: {
		tier: "LC",
	},
	furret: {
		randomBattleMoves: ["return", "doubleedge", "shadowball", "brickbreak", "hiddenpowerground", "quickattack", "surf", "flamethrower", "trick"],
		tier: "NU",
	},
	hoothoot: {
		inherit: true,
		tier: "LC",
	},
	noctowl: {
		randomBattleMoves: ["psychic", "toxic", "whirlwind", "reflect", "hypnosis"],
		tier: "NU",
	},
	ledyba: {
		inherit: true,
		tier: "LC",
	},
	ledian: {
		randomBattleMoves: ["swordsdance", "substitute", "batonpass", "agility", "reflect", "silverwind"],
		tier: "NU",
	},
	spinarak: {
		inherit: true,
		tier: "LC",
	},
	ariados: {
		randomBattleMoves: ["nightshade", "sludgebomb", "signalbeam", "spiderweb", "batonpass", "substitute", "agility"],
		tier: "NU",
	},
	chinchou: {
		tier: "LC",
	},
	lanturn: {
		randomBattleMoves: ["surf", "hydropump", "thunderbolt", "icebeam", "thunderwave", "toxic", "rest", "sleeptalk"],
		tier: "UU",
	},
	togepi: {
		inherit: true,
		tier: "LC",
	},
	togetic: {
		randomBattleMoves: ["seismictoss", "toxic", "softboiled", "batonpass", "encore", "wish", "flamethrower", "bodyslam"],
		tier: "NU",
	},
	natu: {
		inherit: true,
		tier: "LC",
	},
	xatu: {
		randomBattleMoves: ["psychic", "hiddenpowerfire", "calmmind", "wish", "substitute", "batonpass", "reflect", "rest", "sleeptalk"],
		tier: "UU",
	},
	mareep: {
		inherit: true,
		tier: "LC",
	},
	flaaffy: {
		tier: "NFE",
	},
	ampharos: {
		randomBattleMoves: ["thunderbolt", "hiddenpowerice", "firepunch", "focuspunch", "substitute", "thunderwave", "healbell", "lightscreen"],
		tier: "UU",
	},
	azurill: {
		tier: "LC",
	},
	marill: {
		tier: "NFE",
	},
	azumarill: {
		randomBattleMoves: ["focuspunch", "bodyslam", "hydropump", "surf", "substitute", "encore", "return", "doubleedge", "hiddenpowerghost"],
		tier: "UU",
	},
	sudowoodo: {
		randomBattleMoves: ["rockslide", "earthquake", "explosion", "doubleedge", "brickbreak", "focuspunch", "rest", "sleeptalk"],
		tier: "NU",
	},
	hoppip: {
		tier: "LC",
	},
	skiploom: {
		tier: "NFE",
	},
	jumpluff: {
		randomBattleMoves: ["hiddenpowerflying", "leechseed", "encore", "sleeppowder", "synthesis", "toxic", "substitute"],
		tier: "UUBL",
	},
	aipom: {
		inherit: true,
		randomBattleMoves: ["taunt", "doubleedge", "shadowball", "batonpass", "focuspunch", "thunderwave", "substitute"],
		tier: "NU",
	},
	sunkern: {
		inherit: true,
		tier: "LC",
	},
	sunflora: {
		randomBattleMoves: ["synthesis", "growth", "gigadrain", "razorleaf", "hiddenpowerice", "leechseed", "hiddenpowerfire", "sunnyday", "solarbeam"],
		tier: "NU",
	},
	yanma: {
		randomBattleMoves: ["aerialace", "signalbeam", "hiddenpowerground", "hypnosis", "substitute", "reversal"],
		tier: "NU",
	},
	wooper: {
		tier: "LC",
	},
	quagsire: {
		randomBattleMoves: ["earthquake", "surf", "icebeam", "toxic", "rest", "hiddenpowerrock", "curse", "counter"],
		tier: "UU",
	},
	murkrow: {
		inherit: true,
		randomBattleMoves: ["drillpeck", "shadowball", "hiddenpowerfighting", "feintattack", "meanlook", "perishsong", "substitute", "protect", "doubleedge"],
		tier: "NU",
	},
	misdreavus: {
		inherit: true,
		randomBattleMoves: ["calmmind", "thunderbolt", "hiddenpowerice", "meanlook", "perishsong", "substitute", "protect"],
		tier: "UU",
	},
	unown: {
		randomBattleMoves: ["hiddenpowerpsychic"],
		tier: "NU",
	},
	wynaut: {
		inherit: true,
		tier: "Uber",
	},
	wobbuffet: {
		inherit: true,
		randomBattleMoves: ["counter", "mirrorcoat", "encore", "safeguard"],
		tier: "Uber",
	},
	girafarig: {
		randomBattleMoves: ["psychic", "thunderbolt", "calmmind", "agility", "substitute", "batonpass", "crunch", "wish", "reflect"],
		tier: "UU",
	},
	pineco: {
		inherit: true,
		tier: "LC",
	},
	forretress: {
		randomBattleMoves: ["hiddenpowerbug", "earthquake", "counter", "explosion", "rapidspin", "spikes", "toxic"],
		tier: "OU",
	},
	dunsparce: {
		randomBattleMoves: ["headbutt", "thunderwave", "rockslide", "shadowball", "curse", "rest", "sleeptalk", "bodyslam"],
		tier: "NU",
	},
	gligar: {
		inherit: true,
		randomBattleMoves: ["earthquake", "hiddenpowerflying", "rockslide", "irontail", "quickattack", "swordsdance", "substitute"],
		tier: "UU",
	},
	snubbull: {
		inherit: true,
		tier: "LC",
	},
	granbull: {
		randomBattleMoves: ["return", "doubleedge", "bodyslam", "earthquake", "shadowball", "focuspunch", "overheat", "bulkup", "substitute", "healbell", "thunderwave", "counter"],
		tier: "UU",
	},
	qwilfish: {
		inherit: true,
		randomBattleMoves: ["spikes", "surf", "hydropump", "sludgebomb", "selfdestruct", "destinybond", "swordsdance", "shadowball", "hiddenpowerground"],
		tier: "UU",
	},
	shuckle: {
		inherit: true,
		randomBattleMoves: ["toxic", "protect", "encore", "rest", "sleeptalk", "wrap"],
		tier: "NU",
	},
	heracross: {
		randomBattleMoves: ["megahorn", "brickbreak", "rockslide", "swordsdance", "substitute", "focuspunch", "endure", "reversal", "rest", "sleeptalk"],
		tier: "OU",
	},
	sneasel: {
		inherit: true,
		randomBattleMoves: ["brickbreak", "shadowball", "doubleedge", "return", "quickattack", "focuspunch", "substitute", "swordsdance", "fakeout", "icebeam"],
		tier: "UU",
	},
	teddiursa: {
		inherit: true,
		tier: "LC",
	},
	ursaring: {
		randomBattleMoves: ["return", "bodyslam", "earthquake", "focuspunch", "swordsdance", "hiddenpowerghost"],
		tier: "UUBL",
	},
	slugma: {
		tier: "LC",
	},
	magcargo: {
		inherit: true,
		randomBattleMoves: ["rest", "sleeptalk", "flamethrower", "hiddenpowergrass", "toxic"],
		tier: "NU",
	},
	swinub: {
		inherit: true,
		tier: "LC",
	},
	piloswine: {
		randomBattleMoves: ["earthquake", "rockslide", "toxic", "icebeam", "doubleedge", "rest", "sleeptalk"],
		tier: "NU",
	},
	corsola: {
		inherit: true,
		randomBattleMoves: ["calmmind", "recover", "surf", "toxic", "reflect", "icebeam"],
		tier: "NU",
	},
	remoraid: {
		tier: "LC",
	},
	octillery: {
		randomBattleMoves: ["icebeam", "rockblast", "surf", "hiddenpowergrass", "thunderwave", "flamethrower", "fireblast"],
		tier: "NU",
	},
	delibird: {
		inherit: true,
		randomBattleMoves: ["aerialace", "focuspunch", "icebeam", "quickattack", "hiddenpowerground", "rapidspin"],
		tier: "NU",
	},
	mantine: {
		inherit: true,
		randomBattleMoves: ["surf", "hydropump", "icebeam", "hiddenpowergrass", "toxic", "haze", "raindance", "rest", "sleeptalk"],
		tier: "UU",
	},
	skarmory: {
		randomBattleMoves: ["drillpeck", "whirlwind", "spikes", "toxic", "protect", "rest", "sleeptalk"],
		tier: "OU",
	},
	houndour: {
		inherit: true,
		tier: "LC",
	},
	houndoom: {
		randomBattleMoves: ["pursuit", "fireblast", "flamethrower", "willowisp", "crunch", "hiddenpowergrass"],
		tier: "UUBL",
	},
	phanpy: {
		tier: "LC",
	},
	donphan: {
		randomBattleMoves: ["earthquake", "rockslide", "bodyslam", "rapidspin", "counter", "toxic", "roar", "rest", "sleeptalk"],
		tier: "UUBL",
	},
	stantler: {
		inherit: true,
		randomBattleMoves: ["return", "earthquake", "doubleedge", "hypnosis", "shadowball", "thunderbolt"],
		tier: "UU",
	},
	smeargle: {
		inherit: true,
		randomBattleMoves: ["encore", "explosion", "spore", "spikes", "substitute", "perishsong", "spiderweb", "batonpass"],
		tier: "UUBL",
	},
	miltank: {
		randomBattleMoves: ["return", "bodyslam", "earthquake", "shadowball", "counter", "curse", "milkdrink", "healbell", "toxic", "thunderwave"],
		tier: "UUBL",
	},
	raikou: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "hiddenpowerice", "calmmind", "hiddenpowergrass", "crunch", "substitute", "roar", "rest", "sleeptalk"],
		tier: "UUBL",
	},
	entei: {
		inherit: true,
		randomBattleMoves: ["calmmind", "fireblast", "flamethrower", "hiddenpowergrass", "hiddenpowerice", "doubleedge", "return", "sunnyday", "solarbeam", "substitute"],
		tier: "UUBL",
	},
	suicune: {
		inherit: true,
		randomBattleMoves: ["hydropump", "surf", "icebeam", "hiddenpowergrass", "calmmind", "toxic", "roar", "substitute", "rest", "sleeptalk"],
		tier: "OU",
	},
	larvitar: {
		inherit: true,
		tier: "LC",
	},
	pupitar: {
		tier: "NU",
	},
	tyranitar: {
		inherit: true,
		randomBattleMoves: ["rockslide", "earthquake", "pursuit", "fireblast", "icebeam", "hiddenpowergrass", "dragondance", "substitute", "focuspunch", "crunch"],
		tier: "OU",
	},
	lugia: {
		inherit: true,
		randomBattleMoves: ["recover", "icebeam", "calmmind", "aeroblast", "earthquake", "toxic", "whirlwind", "reflect", "psychic", "thunderbolt"],
		tier: "Uber",
	},
	hooh: {
		inherit: true,
		randomBattleMoves: ["sacredfire", "hiddenpowerflying", "thunderbolt", "earthquake", "recover", "whirlwind", "reflect", "substitute", "calmmind", "toxic"],
		tier: "Uber",
	},
	celebi: {
		inherit: true,
		randomBattleMoves: ["psychic", "hiddenpowergrass", "recover", "calmmind", "batonpass", "reflect", "healbell", "toxic", "leechseed"],
		tier: "OU",
	},
	treecko: {
		inherit: true,
		tier: "LC",
	},
	grovyle: {
		tier: "NFE",
	},
	sceptile: {
		randomBattleMoves: ["leafblade", "dragonclaw", "hiddenpowerfire", "hiddenpowerice", "crunch", "thunderpunch", "leechseed", "substitute"],
		tier: "UUBL",
	},
	torchic: {
		inherit: true,
		tier: "LC",
	},
	combusken: {
		tier: "NFE",
	},
	blaziken: {
		inherit: true,
		randomBattleMoves: ["flamethrower", "fireblast", "brickbreak", "thunderpunch", "rockslide", "skyuppercut", "swordsdance", "hiddenpowergrass", "substitute", "focuspunch"],
		tier: "UUBL",
	},
	mudkip: {
		inherit: true,
		tier: "LC",
	},
	marshtomp: {
		tier: "NFE",
	},
	swampert: {
		randomBattleMoves: ["earthquake", "hydropump", "icebeam", "rockslide", "toxic", "protect", "surf", "rest", "sleeptalk", "curse"],
		tier: "OU",
	},
	poochyena: {
		inherit: true,
		tier: "LC",
	},
	mightyena: {
		randomBattleMoves: ["shadowball", "hiddenpowerfighting", "bodyslam", "irontail", "toxic", "healbell"],
		tier: "NU",
	},
	zigzagoon: {
		inherit: true,
		tier: "LC",
	},
	linoone: {
		randomBattleMoves: ["bellydrum", "extremespeed", "shadowball", "flail", "substitute", "hiddenpowerfighting"],
		tier: "UU",
	},
	wurmple: {
		tier: "LC",
	},
	silcoon: {
		tier: "NFE",
	},
	beautifly: {
		randomBattleMoves: ["toxic", "stunspore", "morningsun", "aerialace", "gigadrain", "silverwind", "hiddenpowerfire"],
		tier: "NU",
	},
	cascoon: {
		tier: "NFE",
	},
	dustox: {
		randomBattleMoves: ["sludgebomb", "hiddenpowerfire", "moonlight", "toxic", "lightscreen", "whirlwind"],
		tier: "NU",
	},
	lotad: {
		inherit: true,
		tier: "LC",
	},
	lombre: {
		tier: "NFE",
	},
	ludicolo: {
		randomBattleMoves: ["hydropump", "surf", "leechseed", "icebeam", "raindance", "thunderpunch", "gigadrain"],
		tier: "UUBL",
	},
	seedot: {
		inherit: true,
		tier: "LC",
	},
	nuzleaf: {
		tier: "NFE",
	},
	shiftry: {
		randomBattleMoves: ["feintattack", "brickbreak", "fakeout", "sunnyday", "solarbeam", "hiddenpowerfire", "hiddenpowerice", "synthesis", "explosion"],
		tier: "UU",
	},
	taillow: {
		inherit: true,
		tier: "LC",
	},
	swellow: {
		inherit: true,
		randomBattleMoves: ["doubleedge", "return", "aerialace", "hiddenpowerground", "hiddenpowerfighting", "quickattack", "steelwing"],
		tier: "UUBL",
	},
	wingull: {
		tier: "LC",
	},
	pelipper: {
		randomBattleMoves: ["rest", "sleeptalk", "surf", "icebeam", "hiddenpowerelectric", "toxic"],
		tier: "NU",
	},
	ralts: {
		inherit: true,
		tier: "LC",
	},
	kirlia: {
		tier: "NFE",
	},
	gardevoir: {
		randomBattleMoves: ["psychic", "thunderbolt", "firepunch", "icepunch", "calmmind", "memento", "taunt", "hypnosis", "willowisp", "destinybond", "substitute", "reflect", "wish", "protect"],
		tier: "UUBL",
	},
	surskit: {
		inherit: true,
		tier: "LC",
	},
	masquerain: {
		randomBattleMoves: ["doubleedge", "hydropump", "icebeam", "stunspore", "toxic", "substitute"],
		tier: "NU",
	},
	shroomish: {
		inherit: true,
		tier: "LC",
	},
	breloom: {
		randomBattleMoves: ["swordsdance", "hiddenpowerrock", "skyuppercut", "machpunch", "focuspunch", "substitute", "leechseed", "spore", "hiddenpowerghost"],
		tier: "UUBL",
	},
	slakoth: {
		tier: "LC",
	},
	vigoroth: {
		randomBattleMoves: ["return", "shadowball", "earthquake", "bulkup", "encore", "slackoff"],
		tier: "NU",
	},
	slaking: {
		randomBattleMoves: ["return", "doubleedge", "earthquake", "shadowball", "focuspunch", "fireblast"],
		tier: "UUBL",
	},
	nincada: {
		tier: "LC",
	},
	ninjask: {
		randomBattleMoves: ["silverwind", "aerialace", "hiddenpowerrock", "swordsdance", "substitute", "protect", "batonpass"],
		tier: "UUBL",
	},
	shedinja: {
		inherit: true,
		randomBattleMoves: ["shadowball", "silverwind", "hiddenpowerground", "hiddenpowerfighting", "hiddenpowerrock", "protect", "toxic", "agility", "batonpass"],
		tier: "NU",
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
		randomBattleMoves: ["doubleedge", "return", "bodyslam", "earthquake", "shadowball", "fireblast", "flamethrower", "substitute", "icebeam", "toxic"],
		tier: "UU",
	},
	makuhita: {
		inherit: true,
		tier: "LC",
	},
	hariyama: {
		randomBattleMoves: ["crosschop", "rockslide", "hiddenpowerghost", "substitute", "focuspunch", "fakeout", "bulkup", "whirlwind", "rest", "sleeptalk"],
		tier: "UUBL",
	},
	nosepass: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "firepunch", "earthquake", "explosion", "taunt", "thunderwave", "toxic"],
		tier: "NU",
	},
	skitty: {
		inherit: true,
		tier: "LC",
	},
	delcatty: {
		inherit: true,
		randomBattleMoves: ["calmmind", "batonpass", "thunderbolt", "icebeam", "substitute"],
		tier: "NU",
	},
	sableye: {
		inherit: true,
		randomBattleMoves: ["seismictoss", "shadowball", "knockoff", "toxic", "recover"],
		tier: "NU",
	},
	mawile: {
		inherit: true,
		randomBattleMoves: ["swordsdance", "batonpass", "substitute", "brickbreak", "hiddenpowersteel", "focuspunch", "toxic"],
		tier: "NU",
	},
	aron: {
		tier: "LC",
	},
	lairon: {
		tier: "NFE",
	},
	aggron: {
		inherit: true,
		randomBattleMoves: ["earthquake", "rockslide", "irontail", "focuspunch", "doubleedge", "substitute", "thunderwave", "counter"],
		tier: "UU",
	},
	meditite: {
		inherit: true,
		tier: "LC",
	},
	medicham: {
		randomBattleMoves: ["brickbreak", "highjumpkick", "fakeout", "rockslide", "focuspunch", "substitute", "shadowball", "recover"],
		tier: "UUBL",
	},
	electrike: {
		tier: "LC",
	},
	manectric: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "hiddenpowerice", "crunch", "hiddenpowergrass", "substitute", "thunderwave"],
		tier: "UU",
	},
	plusle: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "hiddenpowergrass", "encore", "batonpass", "agility", "substitute"],
		tier: "NU",
	},
	minun: {
		inherit: true,
		randomBattleMoves: ["thunderbolt", "hiddenpowergrass", "encore", "batonpass", "agility", "substitute"],
		tier: "NU",
	},
	volbeat: {
		randomBattleMoves: ["tailglow", "thunderbolt", "icepunch", "batonpass"],
		tier: "NU",
	},
	illumise: {
		randomBattleMoves: ["thunderbolt", "icepunch", "encore", "substitute", "batonpass", "wish"],
		tier: "NU",
	},
	roselia: {
		inherit: true,
		randomBattleMoves: ["hiddenpowerfire", "gigadrain", "aromatherapy", "leechseed", "synthesis", "spikes"],
		tier: "NU",
	},
	gulpin: {
		inherit: true,
		tier: "LC",
	},
	swalot: {
		randomBattleMoves: ["sludgebomb", "explosion", "firepunch", "gigadrain", "thunderpunch", "icebeam", "counter", "yawn"],
		tier: "NU",
	},
	carvanha: {
		inherit: true,
		tier: "LC",
	},
	sharpedo: {
		randomBattleMoves: ["earthquake", "hydropump", "crunch", "icebeam", "hiddenpowerelectric", "substitute"],
		tier: "UU",
	},
	wailmer: {
		tier: "LC",
	},
	wailord: {
		inherit: true,
		randomBattleMoves: ["rest", "sleeptalk", "bodyslam", "selfdestruct", "hydropump", "surf", "icebeam", "toxic", "hiddenpowergrass"],
		tier: "NU",
	},
	numel: {
		inherit: true,
		tier: "LC",
	},
	camerupt: {
		randomBattleMoves: ["fireblast", "earthquake", "rockslide", "explosion", "toxic", "rest", "sleeptalk", "roar"],
		tier: "UU",
	},
	torkoal: {
		randomBattleMoves: ["fireblast", "flamethrower", "hiddenpowergrass", "rockslide", "explosion", "yawn", "rest", "sleeptalk"],
		tier: "NU",
	},
	spoink: {
		inherit: true,
		tier: "LC",
	},
	grumpig: {
		randomBattleMoves: ["psychic", "firepunch", "icywind", "calmmind", "taunt", "substitute"],
		tier: "UU",
	},
	spinda: {
		inherit: true,
		randomBattleMoves: ["doubleedge", "return", "bodyslam", "shadowball", "focuspunch", "brickbreak", "seismictoss", "encore", "hypnosis", "teeterdance", "trick", "substitute", "batonpass"],
		tier: "NU",
	},
	trapinch: {
		tier: "LC",
	},
	vibrava: {
		tier: "NFE",
	},
	flygon: {
		inherit: true,
		randomBattleMoves: ["earthquake", "rockslide", "hiddenpowerflying", "fireblast", "dragonclaw", "toxic"],
		tier: "OU",
	},
	cacnea: {
		inherit: true,
		tier: "LC",
	},
	cacturne: {
		inherit: true,
		randomBattleMoves: ["spikes", "gigadrain", "feintattack", "thunderpunch", "substitute", "focuspunch", "hiddenpowerice"],
		tier: "NU",
	},
	swablu: {
		inherit: true,
		tier: "LC",
	},
	altaria: {
		inherit: true,
		randomBattleMoves: ["dragondance", "earthquake", "hiddenpowerflying", "fireblast", "dragonclaw", "rest", "toxic", "healbell", "haze"],
		tier: "UU",
	},
	zangoose: {
		inherit: true,
		randomBattleMoves: ["doubleedge", "return", "shadowball", "brickbreak", "quickattack", "focuspunch", "swordsdance"],
		tier: "UUBL",
	},
	seviper: {
		inherit: true,
		randomBattleMoves: ["sludgebomb", "flamethrower", "gigadrain", "earthquake", "crunch", "substitute"],
		tier: "NU",
	},
	lunatone: {
		inherit: true,
		randomBattleMoves: ["psychic", "icebeam", "explosion", "calmmind", "batonpass", "hypnosis"],
		tier: "UU",
	},
	solrock: {
		inherit: true,
		randomBattleMoves: ["rockslide", "earthquake", "shadowball", "bodyslam", "explosion", "overheat", "lightscreen"],
		tier: "UU",
	},
	barboach: {
		tier: "LC",
	},
	whiscash: {
		randomBattleMoves: ["earthquake", "rockslide", "surf", "icebeam", "hiddenpowerbug", "spark", "rest", "sleeptalk", "toxic"],
		tier: "NU",
	},
	corphish: {
		inherit: true,
		tier: "LC",
	},
	crawdaunt: {
		inherit: true,
		randomBattleMoves: ["surf", "icebeam", "crunch", "hiddenpowergrass", "brickbreak", "return"],
		tier: "NU",
	},
	baltoy: {
		inherit: true,
		tier: "LC",
	},
	claydol: {
		randomBattleMoves: ["earthquake", "icebeam", "psychic", "explosion", "rapidspin", "toxic"],
		tier: "OU",
	},
	lileep: {
		tier: "LC",
	},
	cradily: {
		randomBattleMoves: ["earthquake", "rockslide", "gigadrain", "hiddenpowerfire", "barrier", "amnesia", "mirrorcoat", "toxic", "recover"],
		tier: "UU",
	},
	anorith: {
		tier: "LC",
	},
	armaldo: {
		randomBattleMoves: ["rockslide", "earthquake", "hiddenpowerbug", "knockoff", "rapidspin", "swordsdance"],
		tier: "UUBL",
	},
	feebas: {
		tier: "LC",
	},
	milotic: {
		inherit: true,
		randomBattleMoves: ["surf", "icebeam", "mirrorcoat", "toxic", "hypnosis", "recover", "rest", "sleeptalk", "hiddenpowergrass"],
		tier: "OU",
	},
	castform: {
		inherit: true,
		randomBattleMoves: ["icebeam", "thunderbolt", "flamethrower", "substitute", "thunderwave"],
		tier: "NU",
	},
	castformsunny: {
		battleOnly: true,
		randomBattleMoves: ["sunnyday", "thunderbolt", "icebeam", "flamethrower", "solarbeam"],
	},
	castformrainy: {
		battleOnly: true,
		randomBattleMoves: ["raindance", "thunder", "weatherball", "icebeam"],
	},
	castformsnowy: {
		battleOnly: true,
		randomBattleMoves: ["hail", "thunderbolt", "flamethrower", "blizzard"],
	},
	kecleon: {
		randomBattleMoves: ["return", "shadowball", "brickbreak", "trick", "irontail", "thunderwave"],
		tier: "NU",
	},
	shuppet: {
		inherit: true,
		tier: "LC",
	},
	banette: {
		inherit: true,
		randomBattleMoves: ["shadowball", "hiddenpowerfighting", "knockoff", "willowisp", "thunderwave", "destinybond"],
		tier: "UU",
	},
	duskull: {
		inherit: true,
		tier: "LC",
	},
	dusclops: {
		randomBattleMoves: ["nightshade", "shadowball", "icebeam", "earthquake", "rest", "painsplit", "willowisp", "sleeptalk"],
		tier: "UUBL",
	},
	tropius: {
		randomBattleMoves: ["sunnyday", "solarbeam", "synthesis", "hiddenpowerfire", "swordsdance", "aerialace", "earthquake"],
		tier: "NU",
	},
	chimecho: {
		inherit: true,
		randomBattleMoves: ["psychic", "hiddenpowerfire", "healbell", "taunt", "toxic", "reflect", "calmmind", "hypnosis"],
		tier: "NU",
	},
	absol: {
		inherit: true,
		randomBattleMoves: ["swordsdance", "shadowball", "hiddenpowerfighting", "aerialace", "batonpass"],
		tier: "UU",
	},
	snorunt: {
		inherit: true,
		tier: "LC",
	},
	glalie: {
		randomBattleMoves: ["icebeam", "earthquake", "explosion", "toxic", "spikes"],
		tier: "NU",
	},
	spheal: {
		inherit: true,
		tier: "LC",
	},
	sealeo: {
		tier: "NFE",
	},
	walrein: {
		randomBattleMoves: ["icebeam", "surf", "earthquake", "hiddenpowergrass", "toxic", "rest", "sleeptalk", "encore", "roar", "yawn"],
		tier: "UU",
	},
	clamperl: {
		tier: "LC",
	},
	huntail: {
		randomBattleMoves: ["doubleedge", "surf", "hydropump", "icebeam", "crunch", "hiddenpowergrass", "raindance"],
		tier: "NU",
	},
	gorebyss: {
		randomBattleMoves: ["surf", "hydropump", "icebeam", "hiddenpowergrass", "raindance", "hiddenpowerelectric"],
		tier: "UU",
	},
	relicanth: {
		randomBattleMoves: ["rockslide", "earthquake", "doubleedge", "yawn", "rest", "sleeptalk"],
		tier: "NU",
	},
	luvdisc: {
		randomBattleMoves: ["surf", "icebeam", "sweetkiss", "toxic", "protect", "substitute"],
		tier: "NU",
	},
	bagon: {
		inherit: true,
		tier: "LC",
	},
	shelgon: {
		tier: "NU",
	},
	salamence: {
		inherit: true,
		randomBattleMoves: ["dragondance", "hiddenpowerflying", "earthquake", "brickbreak", "rockslide", "fireblast", "hydropump", "dragonclaw"],
		tier: "OU",
	},
	beldum: {
		tier: "LC",
	},
	metang: {
		inherit: true,
		tier: "NU",
	},
	metagross: {
		randomBattleMoves: ["meteormash", "earthquake", "rockslide", "shadowball", "explosion", "psychic", "icepunch", "agility", "rest", "sleeptalk"],
		tier: "OU",
	},
	regirock: {
		inherit: true,
		randomBattleMoves: ["rockslide", "earthquake", "explosion", "superpower", "thunderwave", "counter", "curse", "rest", "sleeptalk"],
		tier: "UUBL",
	},
	regice: {
		inherit: true,
		randomBattleMoves: ["icebeam", "thunderbolt", "hiddenpowerfire", "explosion", "rest", "sleeptalk", "thunderwave"],
		tier: "OU",
	},
	registeel: {
		inherit: true,
		randomBattleMoves: ["seismictoss", "protect", "counter", "rest", "sleeptalk", "toxic", "thunderwave"],
		tier: "UUBL",
	},
	latias: {
		inherit: true,
		randomBattleMoves: ["dragonclaw", "icebeam", "thunderbolt", "recover", "calmmind", "toxic", "reflect", "roar"],
		tier: "Uber",
	},
	latios: {
		inherit: true,
		randomBattleMoves: ["dragonclaw", "icebeam", "thunderbolt", "hiddenpowerfire", "recover", "calmmind", "psychic"],
		tier: "Uber",
	},
	kyogre: {
		inherit: true,
		randomBattleMoves: ["surf", "hydropump", "icebeam", "thunder", "waterspout", "sleeptalk", "calmmind", "rest"],
		tier: "Uber",
	},
	groudon: {
		inherit: true,
		randomBattleMoves: ["earthquake", "rockslide", "swordsdance", "overheat", "roar", "substitute"],
		tier: "Uber",
	},
	rayquaza: {
		inherit: true,
		randomBattleMoves: ["dragondance", "earthquake", "extremespeed", "rockslide", "hiddenpowerflying", "dragonclaw", "icebeam", "fireblast", "thunderbolt", "surf"],
		tier: "Uber",
	},
	jirachi: {
		inherit: true,
		randomBattleMoves: ["psychic", "thunderbolt", "firepunch", "icepunch", "calmmind", "bodyslam", "toxic", "reflect", "substitute", "wish", "protect"],
		tier: "OU",
	},
	deoxys: {
		inherit: true,
		randomBattleMoves: ["superpower", "shadowball", "psychoboost", "extremespeed", "firepunch", "thunderbolt", "icebeam", "spikes"],
		tier: "Uber",
	},
	deoxysattack: {
		inherit: true,
		randomBattleMoves: ["superpower", "shadowball", "extremespeed", "firepunch"],
		tier: "Uber",
	},
	deoxysdefense: {
		inherit: true,
		randomBattleMoves: ["recover", "spikes", "taunt", "toxic", "nightshade", "magiccoat", "knockoff"],
		tier: "Uber",
	},
	deoxysspeed: {
		inherit: true,
		randomBattleMoves: ["shadowball", "superpower", "icebeam", "thunderbolt", "firepunch", "psychic", "knockoff", "spikes", "taunt", "toxic", "recover", "calmmind", "reflect"],
		tier: "Uber",
	},
};

exports.BattleFormatsData = BattleFormatsData;
