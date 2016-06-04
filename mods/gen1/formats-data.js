'use strict';

exports.BattleFormatsData = {
	bulbasaur: {
		randomBattleMoves: ["razorleaf", "sleeppowder", "swordsdance", "bodyslam", "toxic", "leechseed"],
		tier: "LC",
	},
	ivysaur: {
		randomBattleMoves: ["razorleaf", "sleeppowder", "swordsdance", "bodyslam", "toxic", "leechseed"],
		tier: "NFE",
	},
	venusaur: {
		randomBattleMoves: ["razorleaf", "sleeppowder", "swordsdance", "bodyslam", "toxic", "leechseed"],
		tier: "UU",
	},
	charmander: {
		randomBattleMoves: ["fireblast", "bodyslam", "swordsdance", "submission", "substitute", "slash", "seismictoss"],
		tier: "LC",
	},
	charmeleon: {
		randomBattleMoves: ["fireblast", "bodyslam", "swordsdance", "submission", "substitute", "slash", "seismictoss"],
		tier: "NFE",
	},
	charizard: {
		randomBattleMoves: ["fireblast", "earthquake", "bodyslam", "swordsdance", "hyperbeam"],
		tier: "UU",
	},
	squirtle: {
		randomBattleMoves: ["surf", "blizzard", "bodyslam", "mimic"],
		tier: "LC",
	},
	wartortle: {
		randomBattleMoves: ["surf", "blizzard", "bodyslam", "mimic", "hydropump", "rest"],
		tier: "UU",
	},
	blastoise: {
		randomBattleMoves: ["surf", "blizzard", "bodyslam", "mimic", "hydropump", "rest", "earthquake", "hyperbeam"],
		tier: "UU",
	},
	caterpie: {
		randomBattleMoves:["stringshot", "tackle"],
		tier: "LC",
	},
	metapod: {
		randomBattleMoves:["stringshot", "tackle", "harden"],
		tier: "NFE",
	},
	butterfree: {
		randomBattleMoves: ["psychic", "megadrain", "sleeppowder", "stunspore"],
		tier: "UU",
	},
	weedle: {
		randomBattleMoves: ["poisonsting", "stringshot"],
		tier: "LC",
	},
	kakuna: {
		randomBattleMoves: ["poisonsting", "stringshot", "harden"],
		tier: "NFE",
	},
	beedrill: {
		randomBattleMoves: ["twineedle", "hyperbeam", "swordsdance", "agility"],
		tier: "UU",
	},
	pidgey: {
		randomBattleMoves: ["agility", "mimic", "mirrormove", "skyattack", "rest", "reflect", "sandattack"],
		essentialMove: "doubleedge",
		tier: "LC",
	},
	pidgeotto: {
		randomBattleMoves: ["agility", "mimic", "mirrormove", "skyattack", "rest", "reflect"],
		essentialMove: "doubleedge",
		tier: "NFE",
	},
	pidgeot: {
		randomBattleMoves: ["hyperbeam", "agility", "mimic", "mirrormove", "skyattack", "rest", "reflect"],
		essentialMove: "doubleedge",
		tier: "UU",
	},
	rattata: {
		randomBattleMoves: ["bodyslam", "blizzard", "bubblebeam", "thunderbolt"],
		essentialMove: "superfang",
		tier: "LC",
	},
	raticate: {
		randomBattleMoves: ["bodyslam", "hyperbeam", "blizzard", "bubblebeam"],
		essentialMove: "superfang",
		tier: "UU",
	},
	spearow: {
		randomBattleMoves: ["drillpeck", "doubleedge", "mirrormove", "agility"],
		tier: "LC",
	},
	fearow: {
		randomBattleMoves: ["drillpeck", "doubleedge", "hyperbeam", "mirrormove"],
		eventPokemon: [
			{"generation": 1, "level": 20, "moves":["growl", "leer", "furyattack", "payday"]},
		],
		tier: "UU",
	},
	ekans: {
		randomBattleMoves: ["glare", "earthquake", "bodyslam", "rockslide"],
		tier: "LC",
	},
	arbok: {
		randomBattleMoves: ["earthquake", "glare", "hyperbeam", "bodyslam", "rockslide"],
		tier: "UU",
	},
	pikachu: {
		randomBattleMoves: ["thunderbolt", "thunderwave", "surf", "bodyslam", "agility", "thunder"],
		eventPokemon: [
			{"generation": 1, "level": 5, "moves":["surf"]},
			{"generation": 1, "level": 5, "moves":["fly"]},
			{"generation": 1, "level": 5, "moves":["thundershock", "growl", "surf"]},
		],
		tier: "LC",
	},
	raichu: {
		randomBattleMoves: ["thunderbolt", "thunderwave", "bodyslam", "agility", "hyperbeam", "thunder"],
		essentialMove: "surf",
		tier: "UU",
	},
	sandshrew: {
		randomBattleMoves: ["swordsdance", "bodyslam", "rockslide", "substitute"],
		essentialMove: "earthquake",
		tier: "LC",
	},
	sandslash: {
		randomBattleMoves: ["swordsdance", "hyperbeam", "bodyslam", "rockslide", "substitute"],
		essentialMove: "earthquake",
		tier: "UU",
	},
	nidoranf: {
		randomBattleMoves: ["bodyslam", "doubleedge", "leer", "rest", "substitute"],
		tier: "LC",
	},
	nidorina: {
		randomBattleMoves: ["bodyslam", "blizzard", "thunder", "thunderbolt", "bubblebeam", "doubleedge", "leer", "rest", "substitute"],
		tier: "NFE",
	},
	nidoqueen: {
		randomBattleMoves: ["blizzard", "thunder", "thunderbolt", "bodyslam"],
		essentialMove: "earthquake",
		tier: "UU",
	},
	nidoranm: {
		randomBattleMoves: ["bodyslam", "doubleedge", "leer", "rest", "substitute"],
		tier: "LC",
	},
	nidorino: {
		randomBattleMoves: ["bodyslam", "blizzard", "thunder", "thunderbolt", "bubblebeam", "doubleedge", "leer", "rest", "substitute"],
		tier: "NFE",
	},
	nidoking: {
		randomBattleMoves: ["blizzard", "thunder", "thunderbolt", "bodyslam"],
		essentialMove: "earthquake",
		tier: "UU",
	},
	clefairy: {
		randomBattleMoves: ["blizzard", "bodyslam", "thunderwave", "thunderbolt", "counter", "sing", "thunder", "metronome"],
		tier: "LC",
	},
	clefable: {
		randomBattleMoves: ["blizzard", "icebeam", "bodyslam", "hyperbeam", "thunderwave", "thunderbolt", "counter", "sing", "thunder"],
		tier: "UU",
	},
	vulpix: {
		randomBattleMoves: ["bodyslam", "confuseray", "reflect", "toxic"],
		essentialMove: "fireblast",
		tier: "LC",
	},
	ninetales: {
		randomBattleMoves: ["bodyslam", "confuseray", "doubleedge", "hyperbeam", "reflect", "toxic"],
		essentialMove: "fireblast",
		tier: "UU",
	},
	jigglypuff: {
		randomBattleMoves: ["thunderwave", "bodyslam", "doubleedge", "bubblebeam", "sing", "disable", "defensecurl"],
		tier: "LC",
	},
	wigglytuff: {
		randomBattleMoves: ["thunderwave", "bodyslam", "doubleedge", "hyperbeam", "blizzard", "bubblebeam", "sing"],
		tier: "UU",
	},
	zubat: {
		randomBattleMoves: ["screech", "confuseray", "doubleedge", "supersonic", "megadrain", "leechlife", "toxic"],
		tier: "LC",
	},
	golbat: {
		randomBattleMoves: ["screech", "confuseray", "doubleedge", "hyperbeam", "megadrain"],
		tier: "UU",
	},
	oddish: {
		randomBattleMoves: ["sleeppowder", "swordsdance", "doubleedge", "megadrain", "toxic"],
		tier: "LC",
	},
	gloom: {
		randomBattleMoves: ["sleeppowder", "swordsdance", "doubleedge", "megadrain"],
		tier: "NFE",
	},
	vileplume: {
		randomBattleMoves: ["sleeppowder", "swordsdance", "bodyslam", "megadrain"],
		tier: "UU",
	},
	paras: {
		randomBattleMoves: ["stunspore", "swordsdance", "spore", "slash", "megadrain", "doubleedge", "growth", "toxic"],
		essentialMove: "bodyslam",
		tier: "LC",
	},
	parasect: {
		randomBattleMoves: ["stunspore", "swordsdance", "spore", "slash", "megadrain", "doubleedge", "growth", "hyperbeam", "toxic"],
		essentialMove: "bodyslam",
		tier: "UU",
	},
	venonat: {
		randomBattleMoves: ["psychic", "megadrain", "sleeppowder", "stunspore", "toxic"],
		tier: "LC",
	},
	venomoth: {
		randomBattleMoves: ["psychic", "megadrain", "sleeppowder", "stunspore"],
		tier: "UU",
	},
	diglett: {
		randomBattleMoves: ["slash", "sandattack", "mimic", "substitute"],
		essentialMove: "earthquake",
		tier: "LC",
	},
	dugtrio: {
		randomBattleMoves: ["slash", "sandattack", "mimic", "substitute"],
		essentialMove: "earthquake",
		tier: "UU",
	},
	meowth: {
		randomBattleMoves: ["bubblebeam", "bodyslam", "screech", "thunderbolt", "payday"],
		essentialMove: "slash",
		tier: "LC",
	},
	persian: {
		randomBattleMoves: ["bubblebeam", "hyperbeam", "bodyslam", "screech", "thunderbolt"],
		essentialMove: "slash",
		tier: "UU",
	},
	psyduck: {
		randomBattleMoves: ["blizzard", "icebeam", "surf", "bodyslam", "rest"],
		essentialMove: "amnesia",
		eventPokemon: [
			{"generation": 1, "level": 15, "moves":["scratch", "amnesia"]},
		],
		tier: "LC",
	},
	golduck: {
		randomBattleMoves: ["blizzard", "icebeam", "surf", "bodyslam", "rest"],
		essentialMove: "amnesia",
		tier: "UU",
	},
	mankey: {
		randomBattleMoves: ["submission", "rockslide", "bodyslam", "megakick"],
		tier: "LC",
	},
	primeape: {
		randomBattleMoves: ["submission", "rockslide", "bodyslam", "hyperbeam", "megakick"],
		tier: "UU",
	},
	growlithe: {
		randomBattleMoves: ["fireblast", "bodyslam", "mimic", "reflect"],
		tier: "LC",
	},
	arcanine: {
		randomBattleMoves: ["fireblast", "bodyslam", "hyperbeam", "mimic", "reflect"],
		tier: "UU",
	},
	poliwag: {
		randomBattleMoves: ["blizzard", "hypnosis", "surf", "psychic"],
		essentialMove: "amnesia",
		tier: "LC",
	},
	poliwhirl: {
		randomBattleMoves: ["blizzard", "hypnosis", "surf", "psychic"],
		essentialMove: "amnesia",
		tier: "NFE",
	},
	poliwrath: {
		randomBattleMoves: ["blizzard", "hypnosis", "surf", "submission"],
		essentialMove: "amnesia",
		tier: "UU",
	},
	abra: {
		randomBattleMoves: ["psychic", "thunderwave", "reflect", "seismictoss"],
		tier: "LC",
	},
	kadabra: {
		randomBattleMoves: ["recover", "thunderwave", "reflect", "seismictoss"],
		essentialMove: "psychic",
		tier: "UU",
	},
	alakazam: {
		randomBattleMoves: ["recover", "thunderwave", "reflect", "seismictoss"],
		essentialMove: "psychic",
		tier: "OU",
	},
	machop: {
		randomBattleMoves: ["bodyslam", "earthquake", "submission", "counter", "doubleedge", "leer", "megakick", "rockslide"],
		tier: "LC",
	},
	machoke: {
		randomBattleMoves: ["bodyslam", "earthquake", "submission", "counter", "doubleedge", "leer", "megakick", "rockslide"],
		tier: "NFE",
	},
	machamp: {
		randomBattleMoves: ["bodyslam", "earthquake", "hyperbeam", "submission", "rockslide"],
		tier: "UU",
	},
	bellsprout: {
		randomBattleMoves: ["razorleaf", "swordsdance", "bodyslam", "toxic", "stunspore"],
		essentialMove: "sleeppowder",
		tier: "LC",
	},
	weepinbell: {
		randomBattleMoves: ["sleeppowder", "swordsdance", "bodyslam", "toxic", "stunspore"],
		essentialMove: "razorleaf",
		tier: "NFE",
	},
	victreebel: {
		randomBattleMoves: ["sleeppowder", "swordsdance", "bodyslam", "hyperbeam", "stunspore"],
		essentialMove: "razorleaf",
		tier: "UU",
	},
	tentacool: {
		randomBattleMoves: ["swordsdance", "doubleedge", "blizzard", "hydropump", "mimic", "barrier"],
		tier: "LC",
	},
	tentacruel: {
		randomBattleMoves: ["swordsdance", "blizzard", "hyperbeam", "hydropump", "surf"],
		tier: "UU",
	},
	geodude: {
		randomBattleMoves: ["bodyslam", "earthquake", "rockslide", "explosion"],
		tier: "LC",
	},
	graveler: {
		randomBattleMoves: ["bodyslam", "earthquake", "rockslide", "explosion"],
		tier: "UU",
	},
	golem: {
		randomBattleMoves: ["explosion", "bodyslam", "earthquake", "rockslide"],
		tier: "OU",
	},
	ponyta: {
		randomBattleMoves: ["fireblast", "agility", "bodyslam", "growl", "reflect", "substitute", "toxic"],
		tier: "LC",
	},
	rapidash: {
		randomBattleMoves: ["agility", "bodyslam", "growl", "hyperbeam", "reflect", "substitute", "toxic"],
		essentialMove: "fireblast",
		eventPokemon: [
			{"generation": 1, "level": 40, "moves":["ember", "firespin", "stomp", "payday"]},
		],
		tier: "UU",
	},
	slowpoke: {
		randomBattleMoves: ["amnesia", "surf", "thunderwave", "rest"],
		tier: "LC",
	},
	slowbro: {
		randomBattleMoves: ["amnesia", "surf", "thunderwave", "rest"],
		tier: "OU",
	},
	magnemite: {
		randomBattleMoves: ["thunderwave", "thunder", "thunderbolt", "mimic", "doubleedge"],
		tier: "LC",
	},
	magneton: {
		randomBattleMoves: ["thunderwave", "mimic", "doubleedge", "hyperbeam"],
		essentialMove: "thunderbolt",
		tier: "UU",
	},
	farfetchd: {
		randomBattleMoves: ["sandattack", "substitute", "swordsdance", "bodyslam", "toxic"],
		essentialMove: "slash",
		tier: "UU",
	},
	doduo: {
		randomBattleMoves: ["drillpeck", "bodyslam", "mimic", "doubleedge", "agility", "growl", "reflect"],
		tier: "LC",
	},
	dodrio: {
		randomBattleMoves: ["drillpeck", "bodyslam", "hyperbeam", "mimic"],
		tier: "UU",
	},
	seel: {
		randomBattleMoves: ["surf", "blizzard", "bodyslam", "mimic"],
		tier: "LC",
	},
	dewgong: {
		randomBattleMoves: ["surf", "blizzard", "bodyslam", "mimic"],
		tier: "UU",
	},
	grimer: {
		randomBattleMoves: ["sludge", "bodyslam", "megadrain", "screech"],
		essentialMove: "explosion",
		tier: "LC",
	},
	muk: {
		randomBattleMoves: ["sludge", "bodyslam", "megadrain", "screech"],
		essentialMove: "explosion",
		tier: "UU",
	},
	shellder: {
		randomBattleMoves: ["surf", "blizzard", "icebeam", "explosion", "withdraw", "toxic", "supersonic"],
		tier: "LC",
	},
	cloyster: {
		randomBattleMoves: ["surf", "blizzard", "icebeam", "hyperbeam", "explosion", "toxic"],
		tier: "OU",
	},
	gastly: {
		randomBattleMoves: ["explosion", "thunderbolt", "megadrain", "psychic", "confuseray"],
		essentialMove: "hypnosis",
		tier: "LC",
	},
	haunter: {
		randomBattleMoves: ["explosion", "thunderbolt", "megadrain", "psychic", "confuseray"],
		essentialMove: "hypnosis",
		tier: "NFE",
	},
	gengar: {
		randomBattleMoves: ["explosion", "thunderbolt", "megadrain", "psychic"],
		essentialMove: "hypnosis",
		tier: "OU",
	},
	onix: {
		randomBattleMoves: ["earthquake", "explosion", "rockslide", "toxic"],
		tier: "UU",
	},
	drowzee: {
		randomBattleMoves: ["hypnosis", "psychic", "thunderwave", "counter", "rest"],
		tier: "LC",
	},
	hypno: {
		randomBattleMoves: ["hypnosis", "thunderwave", "counter", "rest"],
		essentialMove: "psychic",
		tier: "UU",
	},
	krabby: {
		randomBattleMoves: ["bodyslam", "crabhammer", "swordsdance", "blizzard"],
		tier: "LC",
	},
	kingler: {
		randomBattleMoves: ["bodyslam", "hyperbeam", "swordsdance", "blizzard"],
		essentialMove: "crabhammer",
		tier: "UU",
	},
	voltorb: {
		randomBattleMoves: ["thunder", "thunderbolt", "thunderwave", "screech", "flash", "reflect"],
		essentialMove: "explosion",
		tier: "LC",
	},
	electrode: {
		randomBattleMoves: ["thunder", "thunderbolt", "thunderwave", "screech", "flash", "reflect"],
		essentialMove: "explosion",
		tier: "UU",
	},
	exeggcute: {
		randomBattleMoves: ["sleeppowder", "explosion", "eggbomb", "megadrain", "stunspore"],
		essentialMove: "psychic",
		tier: "LC",
	},
	exeggutor: {
		randomBattleMoves: ["psychic", "explosion", "eggbomb", "hyperbeam", "megadrain", "stunspore"],
		essentialMove: "sleeppowder",
		tier: "OU",
	},
	cubone: {
		randomBattleMoves: ["earthquake", "blizzard", "bodyslam", "seismictoss"],
		tier: "LC",
	},
	marowak: {
		randomBattleMoves: ["earthquake", "blizzard", "bodyslam", "seismictoss"],
		tier: "UU",
	},
	hitmonlee: {
		randomBattleMoves: ["bodyslam", "counter", "highjumpkick", "mimic", "seismictoss", "substitute"],
		tier: "UU",
	},
	hitmonchan: {
		randomBattleMoves: ["bodyslam", "submission", "seismictoss", "counter"],
		tier: "UU",
	},
	lickitung: {
		randomBattleMoves: ["swordsdance", "earthquake", "hyperbeam", "bodyslam"],
		tier: "UU",
	},
	koffing: {
		randomBattleMoves: ["sludge", "thunder", "thunderbolt", "fireblast"],
		essentialMove: "explosion",
		tier: "LC",
	},
	weezing: {
		randomBattleMoves: ["sludge", "thunder", "thunderbolt", "fireblast"],
		essentialMove: "explosion",
		tier: "UU",
	},
	rhyhorn: {
		randomBattleMoves: ["earthquake", "rockslide", "substitute", "bodyslam"],
		tier: "LC",
	},
	rhydon: {
		randomBattleMoves: ["earthquake", "rockslide", "substitute", "bodyslam"],
		tier: "OU",
	},
	chansey: {
		randomBattleMoves: ["icebeam", "counter", "thunderwave", "thunderbolt", "reflect"],
		essentialMove: "softboiled",
		tier: "OU",
	},
	tangela: {
		randomBattleMoves: ["sleeppowder", "hyperbeam", "stunspore", "megadrain", "growth", "swordsdance", "bodyslam"],
		tier: "UU",
	},
	kangaskhan: {
		randomBattleMoves: ["bodyslam", "hyperbeam", "counter", "earthquake", "surf"],
		tier: "UU",
	},
	horsea: {
		randomBattleMoves: ["smokescreen", "hydropump", "surf", "blizzard", "mimic"],
		tier: "LC",
	},
	seadra: {
		randomBattleMoves: ["smokescreen", "hydropump", "surf", "blizzard", "mimic"],
		tier: "UU",
	},
	goldeen: {
		randomBattleMoves: ["surf", "blizzard", "agility", "doubleedge", "toxic", "supersonic"],
		tier: "LC",
	},
	seaking: {
		randomBattleMoves: ["surf", "blizzard", "hyperbeam", "doubleedge"],
		tier: "UU",
	},
	staryu: {
		randomBattleMoves: ["blizzard", "thunderbolt", "thunderwave", "surf"],
		essentialMove: "recover",
		tier: "LC",
	},
	starmie: {
		randomBattleMoves: ["blizzard", "thunderbolt", "thunderwave", "surf"],
		essentialMove: "recover",
		tier: "OU",
	},
	mrmime: {
		randomBattleMoves: ["psychic", "thunderwave", "thunderbolt", "seismictoss"],
		tier: "UU",
	},
	scyther: {
		randomBattleMoves: ["slash", "swordsdance", "agility", "hyperbeam"],
		tier: "UU",
	},
	jynx: {
		randomBattleMoves: ["lovelykiss", "blizzard", "psychic", "mimic"],
		tier: "OU",
	},
	electabuzz: {
		randomBattleMoves: ["thunderbolt", "thunderwave", "psychic", "seismictoss"],
		tier: "UU",
	},
	magmar: {
		randomBattleMoves: ["confuseray", "fireblast", "bodyslam", "hyperbeam", "mimic"],
		tier: "UU",
	},
	pinsir: {
		randomBattleMoves: ["swordsdance", "hyperbeam", "bodyslam", "submission"],
		tier: "UU",
	},
	tauros: {
		randomBattleMoves: ["bodyslam", "hyperbeam", "earthquake", "blizzard"],
		tier: "OU",
	},
	magikarp: {
		randomBattleMoves: ["splash", "dragonrage"],
		eventPokemon: [
			{"generation": 1, "level": 5, "moves":["dragonrage"]},
		],
		tier: "LC",
	},
	gyarados: {
		randomBattleMoves: ["blizzard", "surf", "thunderbolt", "bodyslam", "hyperbeam"],
		tier: "UU",
	},
	lapras: {
		randomBattleMoves: ["confuseray", "blizzard", "icebeam", "rest", "thunderbolt", "bodyslam"],
		tier: "OU",
	},
	ditto: {
		randomBattleMoves: ["transform"],
		tier: "UU",
	},
	eevee: {
		randomBattleMoves: ["doubleedge", "growl", "mimic", "reflect", "sandattack", "tailwhip", "toxic"],
		essentialMove: "bodyslam",
		tier: "LC",
	},
	vaporeon: {
		randomBattleMoves: ["rest", "hydropump", "surf", "blizzard", "bodyslam", "mimic"],
		tier: "UU",
	},
	jolteon: {
		randomBattleMoves: ["thunderwave", "pinmissile", "bodyslam", "doublekick", "sandattack"],
		essentialMove: "thunderbolt",
		tier: "OU",
	},
	flareon: {
		randomBattleMoves: ["fireblast", "bodyslam", "hyperbeam", "quickattack"],
		tier: "UU",
	},
	porygon: {
		randomBattleMoves: ["thunderwave", "thunderbolt", "blizzard", "icebeam", "doubleedge", "hyperbeam", "sharpen", "psychic", "agility", "triattack"],
		essentialMove: "recover",
		tier: "UU",
	},
	omanyte: {
		randomBattleMoves: ["hydropump", "surf", "mimic", "rest", "seismictoss"],
		essentialMove: "blizzard",
		tier: "LC",
	},
	omastar: {
		randomBattleMoves: ["hydropump", "surf", "mimic", "rest", "seismictoss"],
		essentialMove: "blizzard",
		tier: "UU",
	},
	kabuto: {
		randomBattleMoves: ["swordsdance", "bodyslam", "surf", "toxic", "harden", "slash"],
		tier: "LC",
	},
	kabutops: {
		randomBattleMoves: ["swordsdance", "bodyslam", "surf", "hyperbeam"],
		tier: "UU",
	},
	aerodactyl: {
		randomBattleMoves: ["skyattack", "reflect", "doubleedge", "hyperbeam"],
		tier: "UU",
	},
	snorlax: {
		randomBattleMoves: ["blizzard", "icebeam", "bodyslam", "thunderbolt", "rest", "selfdestruct", "hyperbeam", "surf", "earthquake"],
		essentialMove: "amnesia",
		tier: "OU",
	},
	articuno: {
		randomBattleMoves: ["blizzard", "rest", "reflect", "icebeam", "mimic"],
		tier: "UU",
	},
	zapdos: {
		randomBattleMoves: ["thunderbolt", "drillpeck", "thunderwave", "agility"],
		tier: "OU",
	},
	moltres: {
		randomBattleMoves: ["agility", "hyperbeam", "reflect", "skyattack", "substitute", "toxic"],
		essentialMove: "fireblast",
		tier: "UU",
	},
	dratini: {
		randomBattleMoves: ["agility", "hyperbeam", "blizzard", "surf", "bodyslam", "icebeam", "substitute", "thunder", "thunderwave", "thunderbolt"],
		tier: "LC",
	},
	dragonair: {
		randomBattleMoves: ["agility", "hyperbeam", "blizzard", "surf", "bodyslam", "icebeam", "substitute", "thunder", "thunderwave", "thunderbolt"],
		tier: "NFE",
	},
	dragonite: {
		randomBattleMoves: ["agility", "hyperbeam", "blizzard", "surf", "bodyslam", "icebeam", "substitute", "thunder", "thunderwave", "thunderbolt"],
		tier: "UU",
	},
	mewtwo: {
		randomBattleMoves: ["recover", "blizzard", "thunderbolt", "amnesia", "icebeam", "rest", "barrier", "thunderwave", "bodyslam", "hyperbeam"],
		essentialMove: "psychic",
		tier: "Uber",
	},
	mew: {
		randomBattleMoves: ["thunderwave", "horndrill", "fissure", "softboiled", "thunderbolt", "blizzard", "psychic", "swordsdance", "earthquake", "hyperbeam", "swift", "explosion"],
		eventPokemon: [
			{"generation": 1, "level": 5, "moves":["pound"]},
		],
		eventOnly: true,
		tier: "Uber",
	},
};
