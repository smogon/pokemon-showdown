'use strict';

exports.BattleFormatsData = {
	missingno: {
		isNonstandard: true,
		tier: "",
	},
	bulbasaur: {
		randomBattleMoves: ["sleeppowder", "gigadrain", "growth", "hiddenpowerfire", "hiddenpowerice", "sludgebomb", "swordsdance", "powerwhip", "leechseed", "synthesis"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves":["sweetscent", "growth", "solarbeam", "synthesis"]},
			{"generation": 3, "level": 10, "gender": "M", "moves":["tackle", "growl", "leechseed", "vinewhip"]},
		],
		tier: "LC",
	},
	ivysaur: {
		randomBattleMoves: ["sleeppowder", "gigadrain", "growth", "hiddenpowerfire", "hiddenpowerice", "sludgebomb", "swordsdance", "powerwhip", "leechseed", "synthesis"],
		tier: "NFE",
	},
	venusaur: {
		randomBattleMoves: ["sleeppowder", "gigadrain", "growth", "hiddenpowerfire", "hiddenpowerice", "sludgebomb", "swordsdance", "powerwhip", "leechseed", "synthesis", "earthquake"],
		tier: "BL",
	},
	charmander: {
		randomBattleMoves: ["flamethrower", "overheat", "dragonpulse", "hiddenpowergrass", "fireblast"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves":["scratch", "growl", "ember"]},
		],
		tier: "LC",
	},
	charmeleon: {
		randomBattleMoves: ["flamethrower", "overheat", "dragonpulse", "hiddenpowergrass", "fireblast"],
		tier: "NFE",
	},
	charizard: {
		randomBattleMoves: ["flamethrower", "fireblast", "substitute", "airslash", "dragonpulse", "hiddenpowergrass", "roost"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves":["wingattack", "slash", "dragonrage", "firespin"]},
		],
		tier: "BL",
	},
	squirtle: {
		randomBattleMoves: ["surf", "icebeam", "hydropump", "rapidspin", "scald", "aquajet", "toxic"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves":["tackle", "tailwhip", "bubble", "withdraw"]},
		],
		tier: "LC",
	},
	wartortle: {
		randomBattleMoves: ["surf", "icebeam", "hydropump", "rapidspin", "scald", "aquajet", "toxic"],
		tier: "NFE",
	},
	blastoise: {
		randomBattleMoves: ["surf", "icebeam", "hydropump", "rapidspin", "scald", "aquajet", "toxic", "dragontail"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves":["protect", "raindance", "skullbash", "hydropump"]},
		],
		tier: "UU",
	},
	caterpie: {
		randomBattleMoves: ["bugbite", "snore", "tackle", "electroweb"],
		tier: "LC",
	},
	metapod: {
		randomBattleMoves: ["irondefense", "bugbite", "tackle", "electroweb"],
		tier: "NFE",
	},
	butterfree: {
		randomBattleMoves: ["quiverdance", "roost", "bugbuzz", "airslash", "substitute", "sleeppowder", "gigadrain", "stunspore", "uturn"],
		eventPokemon: [
			{"generation": 3, "level": 30, "moves":["morningsun", "psychic", "sleeppowder", "aerialace"]},
		],
		tier: "NU",
	},
	weedle: {
		randomBattleMoves: ["bugbite", "stringshot", "poisonsting", "electroweb"],
		tier: "LC",
	},
	kakuna: {
		randomBattleMoves: ["electroweb", "bugbite", "irondefense", "poisonsting"],
		tier: "NFE",
	},
	beedrill: {
		randomBattleMoves: ["toxicspikes", "xscissor", "swordsdance", "uturn", "endeavor", "poisonjab", "drillrun", "nightslash", "brickbreak"],
		eventPokemon: [
			{"generation": 3, "level": 30, "moves":["batonpass", "sludgebomb", "twineedle", "swordsdance"]},
		],
		tier: "NU",
	},
	pidgey: {
		randomBattleMoves: ["roost", "bravebird", "heatwave", "hurricane", "return", "workup", "uturn"],
		tier: "LC",
	},
	pidgeotto: {
		randomBattleMoves: ["roost", "bravebird", "heatwave", "hurricane", "return", "workup", "uturn"],
		eventPokemon: [
			{"generation": 3, "level": 30, "moves":["refresh", "wingattack", "steelwing", "featherdance"]},
		],
		tier: "NFE",
	},
	pidgeot: {
		randomBattleMoves: ["roost", "bravebird", "pursuit", "heatwave", "return", "workup", "uturn"],
		tier: "NU",
	},
	rattata: {
		randomBattleMoves: ["facade", "flamewheel", "wildcharge", "suckerpunch", "uturn"],
		tier: "LC",
	},
	raticate: {
		randomBattleMoves: ["facade", "flamewheel", "wildcharge", "suckerpunch", "uturn"],
		eventPokemon: [
			{"generation": 3, "level": 34, "moves":["refresh", "superfang", "scaryface", "hyperfang"]},
		],
		tier: "NU",
	},
	spearow: {
		randomBattleMoves: ["return", "drillpeck", "doubleedge", "uturn", "quickattack", "pursuit"],
		eventPokemon: [
			{"generation": 3, "level": 22, "moves":["batonpass", "falseswipe", "leer", "aerialace"]},
		],
		tier: "LC",
	},
	fearow: {
		randomBattleMoves: ["return", "drillpeck", "doubleedge", "uturn", "quickattack", "pursuit", "drillrun", "roost"],
		tier: "UU",
	},
	ekans: {
		randomBattleMoves: ["coil", "gunkshot", "seedbomb", "glare", "suckerpunch", "aquatail", "crunch", "earthquake", "rest"],
		eventPokemon: [
			{"generation": 3, "level": 14, "abilities":["shedskin"], "moves":["leer", "wrap", "poisonsting", "bite"]},
			{"generation": 3, "level": 10, "gender": "M", "moves":["wrap", "leer", "poisonsting"]},
		],
		tier: "LC",
	},
	arbok: {
		randomBattleMoves: ["coil", "gunkshot", "seedbomb", "glare", "suckerpunch", "aquatail", "crunch", "earthquake", "rest"],
		eventPokemon: [
			{"generation": 3, "level": 33, "abilities":["intimidate", "shedskin"], "moves":["refresh", "sludgebomb", "glare", "bite"]},
		],
		tier: "UU",
	},
	pichu: {
		randomBattleMoves: ["fakeout", "volttackle", "encore", "irontail", "toxic", "thunderpunch"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["static"], "moves":["thundershock", "charm", "surf"]},
			{"generation": 3, "level": 5, "abilities":["static"], "moves":["thundershock", "charm", "wish"]},
			{"generation": 3, "level": 5, "abilities":["static"], "moves":["thundershock", "charm", "teeterdance"]},
			{"generation": 3, "level": 5, "abilities":["static"], "moves":["thundershock", "charm", "followme"]},
		],
		tier: "LC",
	},
	pikachu: {
		randomBattleMoves: ["thunderbolt", "volttackle", "grassknot", "hiddenpowerice", "brickbreak", "extremespeed", "encore", "substitute"],
		eventPokemon: [
			{"generation": 3, "level": 50, "abilities":["static"], "moves":["thunderbolt", "agility", "thunder", "lightscreen"]},
			{"generation": 3, "level": 10, "abilities":["static"], "moves":["thundershock", "growl", "tailwhip", "thunderwave"]},
			{"generation": 3, "level": 10, "abilities":["static"], "moves":["fly", "tailwhip", "growl", "thunderwave"]},
			{"generation": 3, "level": 5, "abilities":["static"], "moves":["surf", "growl", "tailwhip", "thunderwave"]},
			{"generation": 3, "level": 10, "abilities":["static"], "moves":["fly", "growl", "tailwhip", "thunderwave"]},
			{"generation": 3, "level": 10, "abilities":["static"], "moves":["thundershock", "growl", "thunderwave", "surf"]},
			{"generation": 3, "level": 70, "abilities":["static"], "moves":["thunderbolt", "thunder", "lightscreen", "fly"]},
			{"generation": 3, "level": 70, "abilities":["static"], "moves":["thunderbolt", "thunder", "lightscreen", "surf"]},
			{"generation": 3, "level": 70, "abilities":["static"], "moves":["thunderbolt", "thunder", "lightscreen", "agility"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["static"], "moves":["thundershock", "growl", "tailwhip", "thunderwave"]},
		],
		tier: "NFE",
	},
	raichu: {
		randomBattleMoves: ["nastyplot", "encore", "thunderbolt", "grassknot", "hiddenpowerice", "focusblast", "substitute", "extremespeed"],
		tier: "UU",
	},
	sandshrew: {
		randomBattleMoves: ["earthquake", "stoneedge", "swordsdance", "rapidspin", "nightslash", "xscissor", "stealthrock", "toxic"],
		eventPokemon: [
			{"generation": 3, "level": 12, "abilities":["sandveil"], "moves":["scratch", "defensecurl", "sandattack", "vitalthrow"]},
		],
		tier: "LC",
	},
	sandslash: {
		randomBattleMoves: ["earthquake", "stoneedge", "swordsdance", "rapidspin", "nightslash", "xscissor", "stealthrock", "toxic"],
		tier: "UU",
	},
	nidoranf: {
		randomBattleMoves: ["toxicspikes", "crunch", "poisonjab", "honeclaws", "doublekick"],
		tier: "LC",
	},
	nidorina: {
		randomBattleMoves: ["toxicspikes", "crunch", "poisonjab", "honeclaws", "doublekick", "icebeam"],
		tier: "NFE",
	},
	nidoqueen: {
		randomBattleMoves: ["toxicspikes", "stealthrock", "fireblast", "thunderbolt", "icebeam", "earthpower", "sludgewave", "dragontail", "focusblast"],
		tier: "UU",
	},
	nidoranm: {
		randomBattleMoves: ["suckerpunch", "poisonjab", "headsmash", "honeclaws"],
		tier: "LC",
	},
	nidorino: {
		randomBattleMoves: ["suckerpunch", "poisonjab", "headsmash", "honeclaws"],
		tier: "NFE",
	},
	nidoking: {
		randomBattleMoves: ["fireblast", "thunderbolt", "icebeam", "earthpower", "sludgewave", "focusblast"],
		tier: "UU",
	},
	cleffa: {
		randomBattleMoves: ["reflect", "thunderwave", "lightscreen", "toxic", "fireblast", "encore", "wish", "protect", "softboiled", "aromatherapy"],
		tier: "LC",
	},
	clefairy: {
		randomBattleMoves: ["healingwish", "reflect", "thunderwave", "lightscreen", "toxic", "fireblast", "encore", "wish", "protect", "softboiled", "aromatherapy", "stealthrock"],
		tier: "NFE",
	},
	clefable: {
		randomBattleMoves: ["fireblast", "thunderbolt", "icebeam", "seismictoss", "wish", "protect", "softboiled", "healingwish", "doubleedge", "facade", "meteormash", "aromatherapy", "bellydrum", "trick", "calmmind", "stealthrock", "grassknot", "cosmicpower", "storedpower"],
		tier: "UU",
	},
	vulpix: {
		randomBattleMoves: ["flamethrower", "fireblast", "willowisp", "solarbeam", "nastyplot", "substitute", "toxic", "hypnosis", "painsplit"],
		eventPokemon: [
			{"generation": 3, "level": 18, "abilities":["flashfire"], "moves":["tailwhip", "roar", "quickattack", "willowisp"]},
			{"generation": 3, "level": 18, "abilities":["flashfire"], "moves":["charm", "heatwave", "ember", "dig"]},
		],
		tier: "LC",
	},
	ninetales: {
		randomBattleMoves: ["flamethrower", "fireblast", "willowisp", "solarbeam", "nastyplot", "substitute", "toxic", "hypnosis", "painsplit"],
		tier: "UU",
	},
	igglybuff: {
		randomBattleMoves: ["wish", "thunderwave", "reflect", "lightscreen", "healbell", "seismictoss", "counter", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["cutecharm"], "moves":["sing", "charm", "defensecurl", "tickle"]},
		],
		tier: "LC",
	},
	jigglypuff: {
		randomBattleMoves: ["wish", "thunderwave", "reflect", "lightscreen", "healbell", "seismictoss", "counter", "stealthrock", "protect"],
		tier: "NFE",
	},
	wigglytuff: {
		randomBattleMoves: ["wish", "thunderwave", "reflect", "lightscreen", "healbell", "seismictoss", "counter", "stealthrock", "protect"],
		tier: "NU",
	},
	zubat: {
		randomBattleMoves: ["bravebird", "roost", "toxic", "taunt", "nastyplot", "gigadrain", "sludgebomb", "airslash", "uturn", "whirlwind", "acrobatics", "heatwave", "superfang"],
		tier: "LC",
	},
	golbat: {
		randomBattleMoves: ["bravebird", "roost", "toxic", "taunt", "nastyplot", "gigadrain", "sludgebomb", "airslash", "uturn", "whirlwind", "acrobatics", "heatwave", "superfang"],
		tier: "NFE",
	},
	crobat: {
		randomBattleMoves: ["bravebird", "roost", "toxic", "taunt", "nastyplot", "gigadrain", "sludgebomb", "airslash", "uturn", "whirlwind", "acrobatics", "heatwave", "superfang"],
		tier: "BL",
	},
	oddish: {
		randomBattleMoves: ["gigadrain", "sludgebomb", "synthesis", "sleeppowder", "stunspore", "toxic", "hiddenpowerfire", "leechseed"],
		eventPokemon: [
			{"generation": 3, "level": 26, "abilities":["chlorophyll"], "moves":["poisonpowder", "stunspore", "sleeppowder", "acid"]},
			{"generation": 3, "level": 5, "abilities":["chlorophyll"], "moves":["absorb", "leechseed"]},
		],
		tier: "LC",
	},
	gloom: {
		randomBattleMoves: ["gigadrain", "sludgebomb", "synthesis", "sleeppowder", "stunspore", "toxic", "hiddenpowerfire", "leechseed"],
		eventPokemon: [
			{"generation": 3, "level": 50, "abilities":["chlorophyll"], "moves":["sleeppowder", "acid", "moonlight", "petaldance"]},
		],
		tier: "NFE",
	},
	vileplume: {
		randomBattleMoves: ["gigadrain", "sludgebomb", "synthesis", "sleeppowder", "stunspore", "toxic", "hiddenpowerfire", "leechseed", "aromatherapy"],
		tier: "UU",
	},
	bellossom: {
		randomBattleMoves: ["gigadrain", "sludgebomb", "synthesis", "sleeppowder", "stunspore", "toxic", "hiddenpowerfire", "leechseed", "aromatherapy", "leafstorm"],
		tier: "UU",
	},
	paras: {
		randomBattleMoves: ["spore", "stunspore", "xscissor", "seedbomb", "synthesis", "leechseed", "aromatherapy"],
		eventPokemon: [
			{"generation": 3, "level": 28, "abilities":["effectspore"], "moves":["refresh", "spore", "slash", "falseswipe"]},
		],
		tier: "LC",
	},
	parasect: {
		randomBattleMoves: ["spore", "stunspore", "xscissor", "seedbomb", "synthesis", "leechseed", "aromatherapy"],
		tier: "NU",
	},
	venonat: {
		randomBattleMoves: ["sleeppowder", "morningsun", "toxicspikes", "sludgebomb", "signalbeam", "stunspore"],
		tier: "LC",
	},
	venomoth: {
		randomBattleMoves: ["sleeppowder", "roost", "toxicspikes", "quiverdance", "batonpass", "bugbuzz", "sludgebomb", "gigadrain", "substitute"],
		eventPokemon: [
			{"generation": 3, "level": 32, "abilities":["shielddust"], "moves":["refresh", "silverwind", "substitute", "psychic"]},
		],
		tier: "NU",
	},
	diglett: {
		randomBattleMoves: ["earthquake", "rockslide", "stealthrock", "suckerpunch", "reversal", "substitute"],
		tier: "LC",
	},
	dugtrio: {
		randomBattleMoves: ["earthquake", "stoneedge", "stealthrock", "suckerpunch", "reversal", "substitute"],
		eventPokemon: [
			{"generation": 3, "level": 40, "abilities":["sandveil", "arenatrap"], "moves":["charm", "earthquake", "sandstorm", "triattack"]},
		],
		tier: "OU",
	},
	meowth: {
		randomBattleMoves: ["fakeout", "uturn", "bite", "taunt", "return", "hypnosis", "waterpulse"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["pickup", "technician"], "moves":["scratch", "growl", "petaldance"]},
			{"generation": 3, "level": 5, "abilities":["pickup", "technician"], "moves":["scratch", "growl"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["pickup", "technician"], "moves":["scratch", "growl", "bite"]},
			{"generation": 3, "level": 22, "abilities":["pickup", "technician"], "moves":["sing", "slash", "payday", "bite"]},
		],
		tier: "LC",
	},
	persian: {
		randomBattleMoves: ["fakeout", "uturn", "bite", "taunt", "return", "hypnosis", "waterpulse", "switcheroo"],
		tier: "UU",
	},
	psyduck: {
		randomBattleMoves: ["hydropump", "surf", "icebeam", "hiddenpowergrass", "crosschop", "encore"],
		eventPokemon: [
			{"generation": 3, "level": 27, "abilities":["damp"], "moves":["tailwhip", "confusion", "disable"]},
			{"generation": 3, "level": 5, "abilities":["damp", "cloudnine"], "moves":["watersport", "scratch", "tailwhip", "mudsport"]},
		],
		tier: "LC",
	},
	golduck: {
		randomBattleMoves: ["hydropump", "surf", "icebeam", "hiddenpowergrass", "encore", "focusblast"],
		eventPokemon: [
			{"generation": 3, "level": 33, "abilities":["damp", "cloudnine"], "moves":["charm", "waterfall", "psychup", "brickbreak"]},
		],
		tier: "UU",
	},
	mankey: {
		randomBattleMoves: ["closecombat", "uturn", "icepunch", "rockslide", "punishment"],
		tier: "LC",
	},
	primeape: {
		randomBattleMoves: ["closecombat", "uturn", "icepunch", "stoneedge", "punishment", "encore"],
		eventPokemon: [
			{"generation": 3, "level": 34, "abilities":["vitalspirit"], "moves":["helpinghand", "crosschop", "focusenergy", "reversal"]},
		],
		tier: "UU",
	},
	growlithe: {
		randomBattleMoves: ["flareblitz", "wildcharge", "hiddenpowergrass", "hiddenpowerice", "closecombat", "morningsun", "willowisp", "toxic"],
		eventPokemon: [
			{"generation": 3, "level": 32, "abilities":["intimidate"], "moves":["leer", "odorsleuth", "takedown", "flamewheel"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["intimidate", "flashfire"], "moves":["bite", "roar", "ember"]},
			{"generation": 3, "level": 28, "abilities":["intimidate", "flashfire"], "moves":["charm", "flamethrower", "bite", "takedown"]},
		],
		tier: "LC",
	},
	arcanine: {
		randomBattleMoves: ["flareblitz", "wildcharge", "hiddenpowergrass", "hiddenpowerice", "extremespeed", "closecombat", "morningsun", "willowisp", "toxic"],
		tier: "BL",
	},
	poliwag: {
		randomBattleMoves: ["hydropump", "icebeam", "encore", "bellydrum", "hypnosis", "waterfall", "return"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["waterabsorb", "damp"], "moves":["bubble", "sweetkiss"]},
		],
		tier: "LC",
	},
	poliwhirl: {
		randomBattleMoves: ["hydropump", "icebeam", "encore", "bellydrum", "hypnosis", "waterfall", "return"],
		tier: "NFE",
	},
	poliwrath: {
		randomBattleMoves: ["substitute", "circlethrow", "focuspunch", "bulkup", "encore", "waterfall", "toxic", "rest", "sleeptalk", "icepunch"],
		eventPokemon: [
			{"generation": 3, "level": 42, "abilities":["damp", "waterabsorb"], "moves":["helpinghand", "hydropump", "raindance", "brickbreak"]},
		],
		tier: "UU",
	},
	politoed: {
		randomBattleMoves: ["scald", "hypnosis", "toxic", "encore", "perishsong", "protect", "icebeam", "focusblast", "surf", "hydropump", "hiddenpowergrass"],
		tier: "UU",
	},
	abra: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "hiddenpowerfighting", "shadowball", "encore", "substitute"],
		tier: "LC",
	},
	kadabra: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "hiddenpowerfighting", "shadowball", "encore", "substitute"],
		tier: "BL",
	},
	alakazam: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "focusblast", "shadowball", "encore", "substitute"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["synchronize", "innerfocus"], "moves":["futuresight", "calmmind", "psychic", "trick"]},
		],
		tier: "BL",
	},
	machop: {
		randomBattleMoves: ["dynamicpunch", "payback", "bulkup", "icepunch", "rockslide", "bulletpunch"],
		tier: "LC",
	},
	machoke: {
		randomBattleMoves: ["dynamicpunch", "payback", "bulkup", "icepunch", "rockslide", "bulletpunch"],
		eventPokemon: [
			{"generation": 3, "level": 38, "abilities":["guts"], "moves":["seismictoss", "foresight", "revenge", "vitalthrow"]},
		],
		tier: "NFE",
	},
	machamp: {
		randomBattleMoves: ["dynamicpunch", "payback", "bulkup", "icepunch", "stoneedge", "bulletpunch"],
		tier: "BL",
	},
	bellsprout: {
		randomBattleMoves: ["swordsdance", "sleeppowder", "sunnyday", "growth", "solarbeam", "gigadrain", "sludgebomb", "weatherball", "suckerpunch", "seedbomb"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["chlorophyll"], "moves":["vinewhip", "teeterdance"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["chlorophyll"], "moves":["vinewhip", "growth"]},
		],
		tier: "LC",
	},
	weepinbell: {
		randomBattleMoves: ["swordsdance", "sleeppowder", "sunnyday", "growth", "solarbeam", "gigadrain", "sludgebomb", "weatherball", "suckerpunch", "seedbomb"],
		eventPokemon: [
			{"generation": 3, "level": 32, "abilities":["chlorophyll"], "moves":["morningsun", "magicalleaf", "sludgebomb", "sweetscent"]},
		],
		tier: "NFE",
	},
	victreebel: {
		randomBattleMoves: ["swordsdance", "sleeppowder", "sunnyday", "growth", "solarbeam", "gigadrain", "sludgebomb", "weatherball", "suckerpunch", "powerwhip"],
		tier: "UU",
	},
	tentacool: {
		randomBattleMoves: ["toxicspikes", "rapidspin", "scald", "sludgebomb", "icebeam", "knockoff", "gigadrain", "toxic"],
		tier: "LC",
	},
	tentacruel: {
		randomBattleMoves: ["toxicspikes", "rapidspin", "scald", "sludgebomb", "icebeam", "knockoff", "gigadrain", "toxic"],
		tier: "UU",
	},
	geodude: {
		randomBattleMoves: ["stealthrock", "earthquake", "stoneedge", "suckerpunch", "hammerarm", "firepunch"],
		tier: "LC",
	},
	graveler: {
		randomBattleMoves: ["stealthrock", "earthquake", "stoneedge", "suckerpunch", "hammerarm", "firepunch"],
		tier: "NFE",
	},
	golem: {
		randomBattleMoves: ["stealthrock", "earthquake", "stoneedge", "suckerpunch", "hammerarm", "firepunch"],
		tier: "UU",
	},
	ponyta: {
		randomBattleMoves: ["flareblitz", "wildcharge", "morningsun", "hypnosis", "flamecharge"],
		tier: "LC",
	},
	rapidash: {
		randomBattleMoves: ["flareblitz", "wildcharge", "morningsun", "hypnosis", "flamecharge", "megahorn", "drillrun"],
		eventPokemon: [
			{"generation": 3, "level": 40, "abilities":["flashfire", "runaway"], "moves":["batonpass", "solarbeam", "sunnyday", "flamethrower"]},
		],
		tier: "UU",
	},
	slowpoke: {
		randomBattleMoves: ["scald", "aquatail", "zenheadbutt", "thunderwave", "toxic", "slackoff", "trickroom", "trick"],
		eventPokemon: [
			{"generation": 3, "level": 31, "abilities":["oblivious"], "moves":["watergun", "confusion", "disable", "headbutt"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["oblivious", "owntempo"], "moves":["curse", "yawn", "tackle", "growl"]},
		],
		tier: "LC",
	},
	slowbro: {
		randomBattleMoves: ["scald", "surf", "fireblast", "icebeam", "psychic", "grassknot", "calmmind", "thunderwave", "toxic", "slackoff", "trickroom", "trick"],
		tier: "BL",
	},
	slowking: {
		randomBattleMoves: ["scald", "surf", "fireblast", "icebeam", "psychic", "grassknot", "calmmind", "thunderwave", "toxic", "slackoff", "trickroom", "trick", "nastyplot"],
		tier: "UU",
	},
	magnemite: {
		randomBattleMoves: ["thunderbolt", "thunderwave", "magnetrise", "substitute", "flashcannon", "hiddenpowerice", "voltswitch"],
		tier: "LC",
	},
	magneton: {
		randomBattleMoves: ["thunderbolt", "thunderwave", "magnetrise", "substitute", "flashcannon", "hiddenpowerice", "voltswitch"],
		eventPokemon: [
			{"generation": 3, "level": 30, "abilities":["sturdy", "magnetpull"], "moves":["refresh", "doubleedge", "raindance", "thunder"]},
		],
		tier: "OU",
	},
	farfetchd: {
		randomBattleMoves: ["bravebird", "swordsdance", "return", "leafblade", "roost"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["keeneye", "innerfocus"], "moves":["yawn", "wish"]},
			{"generation": 3, "level": 36, "abilities":["keeneye", "innerfocus"], "moves":["batonpass", "slash", "swordsdance", "aerialace"]},
		],
		tier: "NU",
	},
	doduo: {
		randomBattleMoves: ["bravebird", "return", "doubleedge", "roost", "quickattack", "pursuit"],
		tier: "LC",
	},
	dodrio: {
		randomBattleMoves: ["bravebird", "return", "doubleedge", "roost", "quickattack", "pursuit"],
		eventPokemon: [
			{"generation": 3, "level": 34, "abilities":["earlybird", "runaway"], "moves":["batonpass", "drillpeck", "agility", "triattack"]},
		],
		tier: "BL",
	},
	seel: {
		randomBattleMoves: ["surf", "icebeam", "aquajet", "iceshard", "raindance", "protect", "rest", "toxic", "drillrun"],
		eventPokemon: [
			{"generation": 3, "level": 23, "abilities":["thickfat"], "moves":["helpinghand", "surf", "safeguard", "icebeam"]},
		],
		tier: "LC",
	},
	dewgong: {
		randomBattleMoves: ["surf", "icebeam", "aquajet", "iceshard", "raindance", "protect", "rest", "toxic", "drillrun"],
		tier: "NU",
	},
	grimer: {
		randomBattleMoves: ["curse", "gunkshot", "poisonjab", "shadowsneak", "payback", "brickbreak", "rest", "icepunch", "firepunch", "sleeptalk"],
		eventPokemon: [
			{"generation": 3, "level": 23, "abilities":["stench", "stickyhold"], "moves":["helpinghand", "sludgebomb", "shadowpunch", "minimize"]},
		],
		tier: "LC",
	},
	muk: {
		randomBattleMoves: ["curse", "gunkshot", "poisonjab", "shadowsneak", "payback", "brickbreak", "rest", "icepunch", "firepunch", "sleeptalk"],
		tier: "UU",
	},
	shellder: {
		randomBattleMoves: ["shellsmash", "hydropump", "razorshell", "rockblast", "iciclespear", "rapidspin"],
		eventPokemon: [
			{"generation": 3, "level": 24, "abilities":["shellarmor"], "moves":["withdraw", "iciclespear", "supersonic", "aurorabeam"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["shellarmor"], "moves":["tackle", "withdraw", "iciclespear"]},
			{"generation": 3, "level": 29, "abilities":["shellarmor"], "moves":["refresh", "takedown", "surf", "aurorabeam"]},
		],
		tier: "LC",
	},
	cloyster: {
		randomBattleMoves: ["shellsmash", "hydropump", "razorshell", "rockblast", "iciclespear", "iceshard", "rapidspin", "spikes", "toxicspikes"],
		tier: "OU",
	},
	gastly: {
		randomBattleMoves: ["shadowball", "sludgebomb", "hiddenpowerfighting", "thunderbolt", "substitute", "disable", "painsplit", "hypnosis", "gigadrain", "trick"],
		tier: "LC",
	},
	haunter: {
		randomBattleMoves: ["shadowball", "sludgebomb", "hiddenpowerfighting", "thunderbolt", "substitute", "disable", "painsplit", "hypnosis", "gigadrain", "trick"],
		eventPokemon: [
			{"generation": 3, "level": 23, "abilities":["levitate"], "moves":["spite", "curse", "nightshade", "confuseray"]},
		],
		tier: "NFE",
	},
	gengar: {
		randomBattleMoves: ["shadowball", "sludgebomb", "focusblast", "thunderbolt", "substitute", "disable", "painsplit", "hypnosis", "gigadrain", "trick"],
		tier: "OU",
	},
	onix: {
		randomBattleMoves: ["stealthrock", "earthquake", "stoneedge", "dragontail", "curse"],
		tier: "LC",
	},
	steelix: {
		randomBattleMoves: ["stealthrock", "earthquake", "ironhead", "curse", "dragontail", "roar", "toxic", "stoneedge", "icefang", "firefang"],
		tier: "BL",
	},
	drowzee: {
		randomBattleMoves: ["psychic", "seismictoss", "thunderwave", "wish", "protect", "healbell", "toxic", "nastyplot", "shadowball", "trickroom", "calmmind", "barrier"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["insomnia"], "moves":["bellydrum", "wish"]},
		],
		tier: "LC",
	},
	hypno: {
		randomBattleMoves: ["psychic", "seismictoss", "thunderwave", "wish", "protect", "healbell", "toxic", "nastyplot", "shadowball", "trickroom", "batonpass", "calmmind", "barrier", "bellydrum", "zenheadbutt", "firepunch"],
		eventPokemon: [
			{"generation": 3, "level": 34, "abilities":["insomnia"], "moves":["batonpass", "psychic", "meditate", "shadowball"]},
		],
		tier: "UU",
	},
	krabby: {
		randomBattleMoves: ["crabhammer", "return", "swordsdance", "agility", "rockslide", "substitute", "xscissor", "superpower"],
		tier: "LC",
	},
	kingler: {
		randomBattleMoves: ["crabhammer", "return", "swordsdance", "agility", "rockslide", "substitute", "xscissor", "superpower"],
		tier: "UU",
	},
	voltorb: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "taunt", "foulplay", "hiddenpowerice"],
		eventPokemon: [
			{"generation": 3, "level": 19, "abilities":["static", "soundproof"], "moves":["refresh", "mirrorcoat", "spark", "swift"]},
		],
		tier: "LC",
	},
	electrode: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "taunt", "foulplay", "hiddenpowerice"],
		tier: "UU",
	},
	exeggcute: {
		randomBattleMoves: ["substitute", "leechseed", "gigadrain", "psychic", "sleeppowder", "stunspore", "hiddenpowerfire", "synthesis"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["chlorophyll"], "moves":["sweetscent", "wish"]},
		],
		tier: "LC",
	},
	exeggutor: {
		randomBattleMoves: ["substitute", "leechseed", "gigadrain", "leafstorm", "psychic", "sleeppowder", "stunspore", "hiddenpowerfire", "synthesis"],
		eventPokemon: [
			{"generation": 3, "level": 46, "abilities":["chlorophyll"], "moves":["refresh", "psychic", "hypnosis", "ancientpower"]},
		],
		tier: "BL",
	},
	cubone: {
		randomBattleMoves: ["substitute", "bonemerang", "doubleedge", "stoneedge", "firepunch", "earthquake"],
		tier: "LC",
	},
	marowak: {
		randomBattleMoves: ["substitute", "bonemerang", "doubleedge", "stoneedge", "swordsdance", "firepunch", "earthquake"],
		eventPokemon: [
			{"generation": 3, "level": 44, "abilities":["lightningrod", "rockhead"], "moves":["sing", "earthquake", "swordsdance", "rockslide"]},
		],
		tier: "BL",
	},
	tyrogue: {
		randomBattleMoves: ["highjumpkick", "rapidspin", "fakeout", "bulletpunch", "machpunch", "toxic", "counter"],
		tier: "LC",
	},
	hitmonlee: {
		randomBattleMoves: ["highjumpkick", "suckerpunch", "stoneedge", "machpunch", "substitute", "fakeout", "closecombat", "earthquake", "blazekick"],
		eventPokemon: [
			{"generation": 3, "level": 38, "abilities":["limber"], "moves":["refresh", "highjumpkick", "mindreader", "megakick"]},
		],
		tier: "UU",
	},
	hitmonchan: {
		randomBattleMoves: ["bulkup", "drainpunch", "icepunch", "machpunch", "substitute", "closecombat", "stoneedge", "rapidspin"],
		eventPokemon: [
			{"generation": 3, "level": 38, "abilities":["keeneye"], "moves":["helpinghand", "skyuppercut", "mindreader", "megapunch"]},
		],
		tier: "UU",
	},
	hitmontop: {
		randomBattleMoves: ["fakeout", "suckerpunch", "machpunch", "bulkup", "rapidspin", "closecombat", "stoneedge", "toxic", "bulletpunch"],
		tier: "UU",
	},
	lickitung: {
		randomBattleMoves: ["wish", "protect", "dragontail", "curse", "bodyslam", "return", "powerwhip", "swordsdance", "earthquake", "toxic", "healbell"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["owntempo", "oblivious"], "moves":["healbell", "wish"]},
			{"generation": 3, "level": 38, "abilities":["owntempo", "oblivious"], "moves":["helpinghand", "doubleedge", "defensecurl", "rollout"]},
		],
		tier: "NU",
	},
	koffing: {
		randomBattleMoves: ["painsplit", "sludgebomb", "willowisp", "fireblast", "toxic", "clearsmog", "rest", "sleeptalk", "thunderbolt"],
		tier: "LC",
	},
	weezing: {
		randomBattleMoves: ["painsplit", "sludgebomb", "willowisp", "fireblast", "toxic", "clearsmog", "rest", "sleeptalk", "thunderbolt"],
		tier: "BL",
	},
	rhyhorn: {
		randomBattleMoves: ["stoneedge", "earthquake", "aquatail", "megahorn", "stealthrock", "rockblast"],
		tier: "LC",
	},
	rhydon: {
		randomBattleMoves: ["stoneedge", "earthquake", "aquatail", "megahorn", "stealthrock", "rockblast"],
		eventPokemon: [
			{"generation": 3, "level": 46, "abilities":["lightningrod", "rockhead"], "moves":["helpinghand", "megahorn", "scaryface", "earthquake"]},
		],
		tier: "BL",
	},
	chansey: {
		randomBattleMoves: ["wish", "softboiled", "protect", "toxic", "aromatherapy", "seismictoss", "counter", "thunderwave", "stealthrock"],
		eventPokemon: [
			{"generation": 3, "level": 5, "gender": "F", "abilities":["naturalcure", "serenegrace"], "moves":["sweetscent", "wish"]},
			{"generation": 3, "level": 10, "gender": "F", "abilities":["naturalcure", "serenegrace"], "moves":["pound", "growl", "tailwhip", "refresh"]},
			{"generation": 3, "level": 39, "gender": "F", "abilities":["naturalcure", "serenegrace"], "moves":["sweetkiss", "thunderbolt", "softboiled", "skillswap"]},
		],
		tier: "BL",
	},
	blissey: {
		randomBattleMoves: ["wish", "softboiled", "protect", "toxic", "aromatherapy", "seismictoss", "counter", "thunderwave", "stealthrock", "flamethrower", "icebeam"],
		tier: "OU",
	},
	tangela: {
		randomBattleMoves: ["gigadrain", "sleeppowder", "hiddenpowerrock", "hiddenpowerice", "leechseed", "knockoff", "leafstorm", "stunspore", "synthesis"],
		eventPokemon: [
			{"generation": 3, "level": 30, "abilities":["chlorophyll"], "moves":["morningsun", "solarbeam", "sunnyday", "ingrain"]},
		],
		tier: "UU",
	},
	kangaskhan: {
		randomBattleMoves: ["fakeout", "return", "hammerarm", "doubleedge", "suckerpunch", "earthquake", "substitute", "focuspunch", "circlethrow", "wish"],
		eventPokemon: [
			{"generation": 3, "level": 5, "gender": "F", "abilities":["earlybird", "scrappy"], "moves":["yawn", "wish"]},
			{"generation": 3, "level": 10, "gender": "F", "abilities":["earlybird", "scrappy"], "moves":["cometpunch", "leer", "bite"]},
			{"generation": 3, "level": 36, "gender": "F", "abilities":["earlybird", "scrappy"], "moves":["sing", "earthquake", "tailwhip", "dizzypunch"]},
		],
		tier: "UU",
	},
	horsea: {
		randomBattleMoves: ["hydropump", "icebeam", "substitute", "hiddenpowergrass", "raindance"],
		tier: "LC",
	},
	seadra: {
		randomBattleMoves: ["hydropump", "icebeam", "agility", "substitute", "hiddenpowergrass"],
		eventPokemon: [
			{"generation": 3, "level": 45, "abilities":["poisonpoint", "sniper"], "moves":["leer", "watergun", "twister", "agility"]},
		],
		tier: "NFE",
	},
	kingdra: {
		randomBattleMoves: ["hydropump", "icebeam", "dragondance", "substitute", "outrage", "dracometeor", "waterfall", "rest", "sleeptalk"],
		eventPokemon: [
			{"generation": 3, "level": 50, "abilities":["swiftswim", "sniper"], "moves":["leer", "watergun", "twister", "agility"]},
		],
		tier: "BL",
	},
	goldeen: {
		randomBattleMoves: ["raindance", "waterfall", "megahorn", "return", "drillrun"],
		tier: "LC",
	},
	seaking: {
		randomBattleMoves: ["raindance", "waterfall", "megahorn", "return", "drillrun"],
		tier: "NU",
	},
	staryu: {
		randomBattleMoves: ["surf", "thunderbolt", "icebeam", "rapidspin", "recover"],
		eventPokemon: [
			{"generation": 3, "level": 50, "abilities":["illuminate", "naturalcure"], "moves":["minimize", "lightscreen", "cosmicpower", "hydropump"]},
			{"generation": 3, "level": 18, "abilities":["illuminate"], "moves":["tackle", "watergun", "rapidspin", "recover"]},
		],
		tier: "LC",
	},
	starmie: {
		randomBattleMoves: ["surf", "thunderbolt", "icebeam", "rapidspin", "recover", "psychic", "trick"],
		eventPokemon: [
			{"generation": 3, "level": 41, "abilities":["naturalcure", "illuminate"], "moves":["refresh", "waterfall", "icebeam", "recover"]},
		],
		tier: "OU",
	},
	mrmime: {
		randomBattleMoves: ["substitute", "calmmind", "batonpass", "barrier", "psychic", "hiddenpowerfighting", "healingwish", "nastyplot", "shadowball", "thunderbolt", "encore"],
		eventPokemon: [
			{"generation": 3, "level": 42, "abilities":["soundproof"], "moves":["followme", "psychic", "encore", "thunderpunch"]},
		],
		tier: "UU",
	},
	scyther: {
		randomBattleMoves: ["swordsdance", "roost", "bugbite", "quickattack", "brickbreak", "aerialace", "batonpass", "uturn"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["swarm"], "moves":["quickattack", "leer", "focusenergy"]},
			{"generation": 3, "level": 40, "abilities":["swarm"], "moves":["morningsun", "razorwind", "silverwind", "slash"]},
		],
		tier: "UU",
	},
	scizor: {
		randomBattleMoves: ["swordsdance", "roost", "bulletpunch", "bugbite", "superpower", "uturn", "batonpass", "pursuit"],
		eventPokemon: [
			{"generation": 3, "level": 50, "gender": "M", "abilities":["swarm"], "moves":["furycutter", "metalclaw", "swordsdance", "slash"]},
		],
		tier: "BL",
	},
	smoochum: {
		randomBattleMoves: ["icebeam", "psychic", "hiddenpowerfighting", "trick", "shadowball", "grassknot"],
		tier: "LC",
	},
	jynx: {
		randomBattleMoves: ["icebeam", "psychic", "focusblast", "trick", "shadowball", "nastyplot", "lovelykiss", "substitute", "energyball"],
		tier: "BL",
	},
	elekid: {
		randomBattleMoves: ["thunderbolt", "crosschop", "voltswitch", "substitute", "hiddenpowerice", "psychic"],
		eventPokemon: [
			{"generation": 3, "level": 20, "abilities":["static"], "moves":["icepunch", "firepunch", "thunderpunch", "crosschop"]},
		],
		tier: "LC",
	},
	electabuzz: {
		randomBattleMoves: ["thunderbolt", "voltswitch", "substitute", "hiddenpowerice", "focusblast", "psychic"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["static"], "moves":["quickattack", "leer", "thunderpunch"]},
			{"generation": 3, "level": 43, "abilities":["static"], "moves":["followme", "crosschop", "thunderwave", "thunderbolt"]},
		],
		tier: "UU",
	},
	magby: {
		randomBattleMoves: ["flareblitz", "substitute", "fireblast", "hiddenpowergrass", "crosschop", "thunderpunch", "overheat"],
		tier: "LC",
	},
	magmar: {
		randomBattleMoves: ["flareblitz", "substitute", "fireblast", "hiddenpowergrass", "crosschop", "thunderpunch", "overheat", "focusblast"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["flamebody"], "moves":["leer", "smog", "firepunch", "leer"]},
			{"generation": 3, "level": 36, "abilities":["flamebody"], "moves":["followme", "fireblast", "crosschop", "thunderpunch"]},
		],
		tier: "UU",
	},
	pinsir: {
		randomBattleMoves: ["swordsdance", "xscissor", "earthquake", "closecombat", "stealthrock", "substitute", "stoneedge", "quickattack"],
		eventPokemon: [
			{"generation": 3, "level": 35, "abilities":["hypercutter"], "moves":["helpinghand", "guillotine", "falseswipe", "submission"]},
		],
		tier: "UU",
	},
	tauros: {
		randomBattleMoves: ["return", "earthquake", "zenheadbutt", "rockslide", "pursuit"],
		eventPokemon: [
			{"generation": 3, "level": 25, "gender": "M", "abilities":["intimidate"], "moves":["rage", "hornattack", "scaryface", "pursuit"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["intimidate"], "moves":["tackle", "tailwhip", "rage", "hornattack"]},
			{"generation": 3, "level": 46, "gender": "M", "abilities":["intimidate"], "moves":["refresh", "earthquake", "tailwhip", "bodyslam"]},
		],
		tier: "BL",
	},
	magikarp: {
		randomBattleMoves: ["bounce", "flail", "tackle", "splash"],
		tier: "LC",
	},
	gyarados: {
		randomBattleMoves: ["dragondance", "waterfall", "earthquake", "bounce", "rest", "sleeptalk", "dragontail", "stoneedge", "substitute", "thunderwave", "icefang"],
		tier: "OU",
	},
	lapras: {
		randomBattleMoves: ["icebeam", "thunderbolt", "healbell", "toxic", "surf", "dragondance", "substitute", "waterfall", "return", "avalanche", "rest", "sleeptalk", "curse", "iceshard", "drillrun"],
		eventPokemon: [
			{"generation": 3, "level": 44, "abilities":["waterabsorb", "shellarmor"], "moves":["hydropump", "raindance", "blizzard", "healbell"]},
		],
		tier: "BL",
	},
	ditto: {
		randomBattleMoves: ["transform"],
		tier: "NU",
	},
	eevee: {
		randomBattleMoves: ["quickattack", "return", "bite", "batonpass", "irontail", "yawn", "protect", "wish"],
		tier: "LC",
	},
	vaporeon: {
		randomBattleMoves: ["wish", "protect", "scald", "roar", "icebeam", "toxic", "batonpass", "substitute", "acidarmor", "hydropump", "hiddenpowergrass", "rest", "raindance"],
		tier: "BL",
	},
	jolteon: {
		randomBattleMoves: ["thunderbolt", "voltswitch", "hiddenpowergrass", "hiddenpowerice", "chargebeam", "batonpass", "substitute"],
		tier: "OU",
	},
	flareon: {
		randomBattleMoves: ["rest", "sleeptalk", "flamecharge", "facade"],
		tier: "UU",
	},
	espeon: {
		randomBattleMoves: ["psychic", "psyshock", "substitute", "wish", "shadowball", "hiddenpowerfighting", "calmmind", "morningsun", "storedpower", "batonpass"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves":["psybeam", "psychup", "psychic", "morningsun"]},
		],
		tier: "BL",
	},
	umbreon: {
		randomBattleMoves: ["curse", "payback", "moonlight", "wish", "protect", "healbell", "toxic", "batonpass"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves":["feintattack", "meanlook", "screech", "moonlight"]},
		],
		tier: "BL",
	},
	porygon: {
		randomBattleMoves: ["triattack", "icebeam", "recover", "toxic", "thunderwave", "discharge", "trick"],
		tier: "LC",
	},
	porygon2: {
		randomBattleMoves: ["triattack", "icebeam", "recover", "toxic", "thunderwave", "discharge", "trick"],
		tier: "OU",
	},
	omanyte: {
		randomBattleMoves: ["shellsmash", "surf", "icebeam", "earthpower", "hiddenpowerelectric", "spikes", "toxicspikes", "stealthrock", "hydropump"],
		tier: "LC",
	},
	omastar: {
		randomBattleMoves: ["shellsmash", "surf", "icebeam", "earthpower", "hiddenpowerelectric", "spikes", "toxicspikes", "stealthrock", "hydropump"],
		tier: "UU",
	},
	kabuto: {
		randomBattleMoves: ["aquajet", "rockslide", "rapidspin", "stealthrock", "honeclaws", "waterfall", "toxic"],
		tier: "LC",
	},
	kabutops: {
		randomBattleMoves: ["aquajet", "stoneedge", "rapidspin", "stealthrock", "swordsdance", "waterfall", "toxic", "superpower"],
		tier: "UU",
	},
	aerodactyl: {
		randomBattleMoves: ["stealthrock", "taunt", "stoneedge", "rockslide", "earthquake", "aquatail", "roost", "firefang"],
		tier: "OU",
	},
	snorlax: {
		randomBattleMoves: ["rest", "curse", "sleeptalk", "bodyslam", "earthquake", "return", "firepunch", "icepunch", "crunch", "selfdestruct", "pursuit", "whirlwind"],
		eventPokemon: [
			{"generation": 3, "level": 43, "abilities":["immunity", "thickfat"], "moves":["refresh", "fissure", "curse", "bodyslam"]},
		],
		tier: "OU",
	},
	articuno: {
		randomBattleMoves: ["icebeam", "roost", "roar", "healbell", "toxic", "substitute", "hurricane"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["agility", "mindreader", "icebeam", "reflect"]},
			{"generation": 3, "level": 50, "abilities":["pressure"], "moves":["icebeam", "healbell", "extrasensory", "haze"]},
		],
		tier: "BL",
	},
	zapdos: {
		randomBattleMoves: ["thunderbolt", "heatwave", "hiddenpowergrass", "hiddenpowerice", "roost", "toxic", "substitute", "batonpass", "agility", "discharge"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["agility", "detect", "drillpeck", "charge"]},
			{"generation": 3, "level": 50, "abilities":["pressure"], "moves":["thunderbolt", "extrasensory", "batonpass", "metalsound"]},
		],
		tier: "OU",
	},
	moltres: {
		randomBattleMoves: ["fireblast", "hiddenpowergrass", "airslash", "roost", "substitute", "toxic", "overheat", "uturn", "willowisp", "hurricane"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["agility", "endure", "flamethrower", "safeguard"]},
			{"generation": 3, "level": 50, "abilities":["pressure"], "moves":["extrasensory", "morningsun", "willowisp", "flamethrower"]},
		],
		tier: "BL",
	},
	dratini: {
		randomBattleMoves: ["dragondance", "outrage", "waterfall", "fireblast", "extremespeed", "dracometeor", "substitute", "aquatail"],
		tier: "LC",
	},
	dragonair: {
		randomBattleMoves: ["dragondance", "outrage", "waterfall", "fireblast", "extremespeed", "dracometeor", "substitute", "aquatail"],
		tier: "NFE",
	},
	dragonite: {
		randomBattleMoves: ["dragondance", "outrage", "firepunch", "extremespeed", "dragonclaw", "earthquake", "roost", "waterfall", "substitute", "thunderwave", "dragontail", "hurricane", "superpower", "dracometeor"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["innerfocus"], "moves":["agility", "safeguard", "wingattack", "outrage"]},
			{"generation": 3, "level": 55, "abilities":["innerfocus"], "moves":["healbell", "hyperbeam", "dragondance", "earthquake"]},
		],
		tier: "BL",
	},
	mewtwo: {
		randomBattleMoves: ["psystrike", "aurasphere", "fireblast", "icebeam", "calmmind", "substitute", "recover", "thunderbolt"],
		tier: "Uber",
	},
	mew: {
		randomBattleMoves: ["taunt", "willowisp", "roost", "psychic", "nastyplot", "aurasphere", "shadowball", "fireblast", "swordsdance", "superpower", "zenheadbutt", "calmmind", "batonpass", "rockpolish", "substitute", "toxic", "explosion", "icebeam", "thunderbolt", "earthquake", "uturn", "stealthrock", "transform"],
		eventPokemon: [
			{"generation": 3, "level": 30, "moves":["pound", "transform", "megapunch", "metronome"]},
			{"generation": 3, "level": 10, "moves":["pound", "transform"]},
		],
		eventOnly: true,
		tier: "Uber",
	},
	chikorita: {
		randomBattleMoves: ["reflect", "lightscreen", "safeguard", "aromatherapy", "grasswhistle", "leechseed", "toxic", "gigadrain", "synthesis"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves":["tackle", "growl", "razorleaf"]},
			{"generation": 3, "level": 5, "moves":["tackle", "growl", "ancientpower", "frenzyplant"]},
		],
		tier: "LC",
	},
	bayleef: {
		randomBattleMoves: ["reflect", "lightscreen", "safeguard", "aromatherapy", "grasswhistle", "leechseed", "toxic", "gigadrain", "synthesis"],
		tier: "NFE",
	},
	meganium: {
		randomBattleMoves: ["reflect", "lightscreen", "safeguard", "aromatherapy", "grasswhistle", "leechseed", "toxic", "gigadrain", "synthesis", "dragontail"],
		tier: "UU",
	},
	cyndaquil: {
		randomBattleMoves: ["eruption", "fireblast", "flamethrower", "hiddenpowergrass", "naturepower"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves":["tackle", "leer", "smokescreen"]},
			{"generation": 3, "level": 5, "moves":["tackle", "leer", "reversal", "blastburn"]},
		],
		tier: "LC",
	},
	quilava: {
		randomBattleMoves: ["eruption", "fireblast", "flamethrower", "hiddenpowergrass", "naturepower"],
		tier: "NFE",
	},
	typhlosion: {
		randomBattleMoves: ["eruption", "fireblast", "flamethrower", "hiddenpowergrass", "naturepower", "focusblast"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["blaze"], "moves":["quickattack", "flamewheel", "swift", "flamethrower"]},
		],
		tier: "BL",
	},
	totodile: {
		randomBattleMoves: ["aquajet", "waterfall", "crunch", "icepunch", "superpower", "dragondance", "swordsdance", "return"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["torrent"], "moves":["scratch", "leer", "rage"]},
			{"generation": 3, "level": 5, "moves":["scratch", "leer", "crunch", "hydrocannon"]},
		],
		tier: "LC",
	},
	croconaw: {
		randomBattleMoves: ["aquajet", "waterfall", "crunch", "icepunch", "superpower", "dragondance", "swordsdance", "return"],
		tier: "NFE",
	},
	feraligatr: {
		randomBattleMoves: ["aquajet", "waterfall", "crunch", "icepunch", "dragondance", "swordsdance", "return", "earthquake", "superpower"],
		tier: "UU",
	},
	sentret: {
		randomBattleMoves: ["superfang", "trick", "toxic", "uturn", "knockoff"],
		tier: "LC",
	},
	furret: {
		randomBattleMoves: ["return", "uturn", "suckerpunch", "trick", "icepunch", "firepunch", "thunderpunch"],
		tier: "NU",
	},
	hoothoot: {
		randomBattleMoves: ["reflect", "toxic", "roost", "lightscreen", "whirlwind", "nightshade", "magiccoat"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["insomnia", "keeneye"], "moves":["tackle", "growl", "foresight"]},
		],
		tier: "LC",
	},
	noctowl: {
		randomBattleMoves: ["roost", "whirlwind", "airslash", "nightshade", "toxic", "reflect", "lightscreen", "magiccoat"],
		tier: "NU",
	},
	ledyba: {
		randomBattleMoves: ["roost", "agility", "lightscreen", "encore", "reflect", "knockoff", "swordsdance", "batonpass", "toxic"],
		eventPokemon: [
			{"generation": 3, "level": 10, "abilities":["earlybird", "swarm"], "moves":["refresh", "psybeam", "aerialace", "supersonic"]},
		],
		tier: "LC",
	},
	ledian: {
		randomBattleMoves: ["roost", "agility", "lightscreen", "encore", "reflect", "knockoff", "swordsdance", "batonpass", "toxic"],
		tier: "NU",
	},
	spinarak: {
		randomBattleMoves: ["agility", "toxic", "xscissor", "toxicspikes", "poisonjab", "batonpass", "swordsdance"],
		eventPokemon: [
			{"generation": 3, "level": 14, "abilities":["insomnia", "swarm"], "moves":["refresh", "dig", "signalbeam", "nightshade"]},
		],
		tier: "LC",
	},
	ariados: {
		randomBattleMoves: ["agility", "toxic", "xscissor", "toxicspikes", "poisonjab", "batonpass", "swordsdance"],
		tier: "NU",
	},
	chinchou: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowergrass", "hydropump", "icebeam", "surf", "thunderwave", "scald", "discharge"],
		tier: "LC",
	},
	lanturn: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowergrass", "hydropump", "icebeam", "surf", "thunderwave", "scald", "discharge"],
		tier: "UU",
	},
	togepi: {
		randomBattleMoves: ["wish", "protect", "fireblast", "toxic", "thunderwave", "softboiled"],
		eventPokemon: [
			{"generation": 3, "level": 20, "gender": "F", "abilities":["serenegrace"], "moves":["metronome", "charm", "sweetkiss", "yawn"]},
			{"generation": 3, "level": 25, "abilities":["serenegrace", "hustle"], "moves":["triattack", "followme", "ancientpower", "helpinghand"]},
		],
		tier: "LC",
	},
	togetic: {
		randomBattleMoves: ["wish", "protect", "fireblast", "toxic", "thunderwave", "roost"],
		tier: "NU",
	},
	natu: {
		randomBattleMoves: ["thunderwave", "roost", "toxic", "reflect", "lightscreen", "uturn", "wish", "psychic", "nightshade"],
		eventPokemon: [
			{"generation": 3, "level": 22, "abilities":["synchronize", "earlybird"], "moves":["batonpass", "futuresight", "nightshade", "aerialace"]},
		],
		tier: "LC",
	},
	xatu: {
		randomBattleMoves: ["thunderwave", "toxic", "roost", "psychic", "nightshade", "uturn", "reflect", "lightscreen", "wish", "calmmind"],
		tier: "UU",
	},
	mareep: {
		randomBattleMoves: ["reflect", "lightscreen", "thunderbolt", "discharge", "thunderwave", "toxic", "hiddenpowerice", "cottonguard"],
		eventPokemon: [
			{"generation": 3, "level": 37, "gender": "F", "abilities":["static"], "moves":["thunder", "thundershock", "thunderwave", "cottonspore"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["static"], "moves":["tackle", "growl", "thundershock"]},
			{"generation": 3, "level": 17, "abilities":["static"], "moves":["healbell", "thundershock", "thunderwave", "bodyslam"]},
		],
		tier: "LC",
	},
	flaaffy: {
		randomBattleMoves: ["reflect", "lightscreen", "thunderbolt", "discharge", "thunderwave", "toxic", "hiddenpowerice", "cottonguard"],
		tier: "NFE",
	},
	ampharos: {
		randomBattleMoves: ["voltswitch", "focusblast", "hiddenpowerice", "hiddenpowergrass", "thunderbolt", "healbell"],
		tier: "UU",
	},
	azurill: {
		randomBattleMoves: ["scald", "return", "doubleedge", "encore", "toxic", "protect"],
		tier: "LC",
	},
	marill: {
		randomBattleMoves: ["waterfall", "return", "doubleedge", "encore", "toxic", "aquajet", "superpower", "icepunch", "protect"],
		tier: "NFE",
	},
	azumarill: {
		randomBattleMoves: ["waterfall", "aquajet", "return", "doubleedge", "icepunch", "superpower"],
		tier: "UU",
	},
	sudowoodo: {
		randomBattleMoves: ["hammerarm", "stoneedge", "earthquake", "suckerpunch", "woodhammer", "explosion", "stealthrock"],
		tier: "NU",
	},
	hoppip: {
		randomBattleMoves: ["encore", "sleeppowder", "uturn", "toxic", "leechseed", "substitute", "protect"],
		tier: "LC",
	},
	skiploom: {
		randomBattleMoves: ["encore", "sleeppowder", "uturn", "toxic", "leechseed", "substitute", "protect"],
		tier: "NFE",
	},
	jumpluff: {
		randomBattleMoves: ["encore", "sleeppowder", "uturn", "toxic", "leechseed", "substitute", "gigadrain", "acrobatics", "synthesis"],
		tier: "BL",
	},
	aipom: {
		randomBattleMoves: ["fakeout", "return", "brickbreak", "seedbomb", "shadowclaw", "uturn"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["runaway", "pickup"], "moves":["scratch", "tailwhip", "sandattack"]},
		],
		tier: "NU",
	},
	sunkern: {
		randomBattleMoves: ["sunnyday", "gigadrain", "solarbeam", "hiddenpowerfire", "toxic", "earthpower"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["chlorophyll", "solarpower"], "moves":["absorb", "growth"]},
		],
		tier: "LC",
	},
	sunflora: {
		randomBattleMoves: ["sunnyday", "leafstorm", "gigadrain", "solarbeam", "hiddenpowerfire", "earthpower"],
		tier: "NU",
	},
	yanma: {
		randomBattleMoves: ["bugbuzz", "airslash", "hiddenpowerground", "uturn", "protect", "gigadrain"],
		tier: "UU",
	},
	wooper: {
		randomBattleMoves: ["recover", "earthquake", "scald", "toxic", "stockpile", "yawn", "protect"],
		tier: "LC",
	},
	quagsire: {
		randomBattleMoves: ["recover", "earthquake", "waterfall", "scald", "toxic", "curse", "stoneedge", "stockpile", "yawn"],
		tier: "UU",
	},
	murkrow: {
		randomBattleMoves: ["substitute", "suckerpunch", "bravebird", "heatwave", "hiddenpowergrass", "roost", "darkpulse", "thunderwave"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["insomnia", "superluck"], "moves":["peck", "astonish"]},
		],
		tier: "NU",
	},
	misdreavus: {
		randomBattleMoves: ["nastyplot", "substitute", "calmmind", "willowisp", "shadowball", "thunderbolt", "hiddenpowerfighting"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["levitate"], "moves":["growl", "psywave", "spite"]},
		],
		tier: "UU",
	},
	unown: {
		randomBattleMoves: ["hiddenpowerpsychic"],
		tier: "NU",
	},
	wynaut: {
		randomBattleMoves: ["destinybond", "counter", "mirrorcoat", "encore"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["shadowtag"], "moves":["splash", "charm", "encore", "tickle"]},
		],
		tier: "Uber",
	},
	wobbuffet: {
		randomBattleMoves: ["destinybond", "counter", "mirrorcoat", "encore"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["shadowtag"], "moves":["counter", "mirrorcoat", "safeguard", "destinybond"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["shadowtag"], "moves":["counter", "mirrorcoat", "safeguard", "destinybond"]},
		],
		tier: "Uber",
	},
	girafarig: {
		randomBattleMoves: ["psychic", "thunderbolt", "calmmind", "batonpass", "agility", "hypervoice", "thunderwave"],
		tier: "NU",
	},
	pineco: {
		randomBattleMoves: ["rapidspin", "toxicspikes", "spikes", "bugbite", "stealthrock"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["sturdy"], "moves":["tackle", "protect", "selfdestruct"]},
			{"generation": 3, "level": 22, "abilities":["sturdy"], "moves":["refresh", "pinmissile", "spikes", "counter"]},
		],
		tier: "LC",
	},
	forretress: {
		randomBattleMoves: ["rapidspin", "toxicspikes", "spikes", "bugbite", "earthquake", "voltswitch", "stealthrock"],
		tier: "OU",
	},
	dunsparce: {
		randomBattleMoves: ["coil", "rockslide", "bite", "headbutt", "glare", "thunderwave", "bodyslam", "roost"],
		tier: "UU",
	},
	gligar: {
		randomBattleMoves: ["stealthrock", "toxic", "roost", "taunt", "swordsdance", "earthquake", "uturn", "stoneedge", "acrobatics"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["hypercutter", "sandveil"], "moves":["poisonsting", "sandattack"]},
		],
		tier: "UU",
	},
	snubbull: {
		randomBattleMoves: ["thunderwave", "return", "crunch", "closecombat"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["intimidate", "runaway"], "moves":["tackle", "scaryface", "tailwhip", "charm"]},
		],
		tier: "LC",
	},
	granbull: {
		randomBattleMoves: ["thunderwave", "return", "crunch", "closecombat", "healbell", "icepunch"],
		tier: "UU",
	},
	qwilfish: {
		randomBattleMoves: ["toxicspikes", "waterfall", "spikes", "swordsdance", "poisonjab", "painsplit", "thunderwave", "taunt", "destinybond"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["poisonpoint", "swiftswim"], "moves":["tackle", "poisonsting", "harden", "minimize"]},
		],
		tier: "UU",
	},
	shuckle: {
		randomBattleMoves: ["rollout", "acupressure", "powersplit", "rest"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["sturdy"], "moves":["constrict", "withdraw", "wrap"]},
			{"generation": 3, "level": 20, "abilities":["sturdy"], "moves":["substitute", "toxic", "sludgebomb", "encore"]},
		],
		tier: "UU",
	},
	heracross: {
		randomBattleMoves: ["closecombat", "megahorn", "stoneedge", "swordsdance", "facade"],
		tier: "OU",
	},
	sneasel: {
		randomBattleMoves: ["iceshard", "icepunch", "nightslash", "lowkick", "pursuit", "swordsdance"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["innerfocus", "keeneye"], "moves":["scratch", "leer", "taunt", "quickattack"]},
		],
		tier: "UU",
	},
	teddiursa: {
		randomBattleMoves: ["swordsdance", "protect", "facade", "closecombat", "firepunch", "crunch"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["pickup", "quickfeet"], "moves":["scratch", "leer", "lick"]},
			{"generation": 3, "level": 11, "abilities":["pickup"], "moves":["refresh", "metalclaw", "leer", "return"]},
		],
		tier: "LC",
	},
	ursaring: {
		randomBattleMoves: ["swordsdance", "protect", "facade", "closecombat", "firepunch", "crunch"],
		tier: "BL",
	},
	slugma: {
		randomBattleMoves: ["stockpile", "recover", "lavaplume", "willowisp", "toxic", "hiddenpowergrass"],
		tier: "LC",
	},
	magcargo: {
		randomBattleMoves: ["stockpile", "recover", "lavaplume", "willowisp", "toxic", "hiddenpowergrass", "hiddenpowerrock", "stealthrock", "shellsmash", "fireblast", "earthpower"],
		eventPokemon: [
			{"generation": 3, "level": 38, "abilities":["magmaarmor", "flamebody"], "moves":["refresh", "heatwave", "earthquake", "flamethrower"]},
		],
		tier: "NU",
	},
	swinub: {
		randomBattleMoves: ["earthquake", "iciclecrash", "iceshard", "stealthrock", "superpower", "endeavor"],
		eventPokemon: [
			{"generation": 3, "level": 22, "abilities":["oblivious"], "moves":["charm", "ancientpower", "mist", "mudshot"]},
		],
		tier: "LC",
	},
	piloswine: {
		randomBattleMoves: ["earthquake", "iciclecrash", "iceshard", "stealthrock", "superpower", "endeavor"],
		tier: "NU",
	},
	corsola: {
		randomBattleMoves: ["recover", "toxic", "powergem", "scald", "stealthrock"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["hustle", "naturalcure"], "moves":["tackle", "mudsport"]},
		],
		tier: "NU",
	},
	remoraid: {
		randomBattleMoves: ["waterspout", "hydropump", "fireblast", "hiddenpowerground", "icebeam", "seedbomb", "rockblast"],
		tier: "LC",
	},
	octillery: {
		randomBattleMoves: ["hydropump", "fireblast", "icebeam", "energyball", "rockblast", "thunderwave"],
		tier: "UU",
	},
	delibird: {
		randomBattleMoves: ["rapidspin", "iceshard", "icepunch", "aerialace"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["vitalspirit", "hustle"], "moves":["present"]},
		],
		tier: "NU",
	},
	mantine: {
		randomBattleMoves: ["raindance", "hydropump", "surf", "airslash", "icebeam", "rest", "sleeptalk", "toxic"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["swiftswim", "waterabsorb"], "moves":["tackle", "bubble", "supersonic"]},
		],
		tier: "UU",
	},
	skarmory: {
		randomBattleMoves: ["whirlwind", "bravebird", "roost", "spikes", "stealthrock"],
		tier: "OU",
	},
	houndour: {
		randomBattleMoves: ["pursuit", "suckerpunch", "fireblast", "darkpulse", "hiddenpowerfighting", "nastyplot"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["earlybird", "flashfire"], "moves":["leer", "ember", "howl"]},
			{"generation": 3, "level": 17, "abilities":["earlybird", "flashfire"], "moves":["charm", "feintattack", "ember", "roar"]},
		],
		tier: "LC",
	},
	houndoom: {
		randomBattleMoves: ["nastyplot", "pursuit", "darkpulse", "suckerpunch", "fireblast", "hiddenpowerfighting"],
		tier: "BL",
	},
	phanpy: {
		randomBattleMoves: ["stealthrock", "earthquake", "iceshard", "headsmash", "knockoff", "seedbomb", "superpower"],
		tier: "LC",
	},
	donphan: {
		randomBattleMoves: ["stealthrock", "rapidspin", "iceshard", "earthquake", "headsmash", "seedbomb", "superpower"],
		tier: "BL",
	},
	stantler: {
		randomBattleMoves: ["return", "megahorn", "jumpkick", "earthquake", "thunderwave", "suckerpunch"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["intimidate", "frisk"], "moves":["tackle", "leer"]},
		],
		tier: "UU",
	},
	smeargle: {
		randomBattleMoves: ["spore", "spikes", "stealthrock", "uturn", "destinybond", "whirlwind"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["owntempo", "technician"], "moves":["sketch"]},
		],
		tier: "BL",
	},
	miltank: {
		randomBattleMoves: ["milkdrink", "stealthrock", "bodyslam", "healbell", "curse", "earthquake"],
		tier: "BL",
	},
	raikou: {
		randomBattleMoves: ["thunderbolt", "hiddenpowerice", "aurasphere", "calmmind", "substitute"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["quickattack", "spark", "reflect", "crunch"]},
		],
		tier: "OU",
	},
	entei: {
		randomBattleMoves: ["extremespeed", "flareblitz", "ironhead", "flamecharge", "stoneedge"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["firespin", "stomp", "flamethrower", "swagger"]},
		],
		tier: "BL",
	},
	suicune: {
		randomBattleMoves: ["hydropump", "icebeam", "scald", "hiddenpowergrass", "hiddenpowerelectric", "rest", "sleeptalk", "roar", "calmmind"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["gust", "aurorabeam", "mist", "mirrorcoat"]},
		],
		tier: "OU",
	},
	larvitar: {
		randomBattleMoves: ["earthquake", "stoneedge", "rockpolish", "dragondance", "superpower"],
		eventPokemon: [
			{"generation": 3, "level": 20, "abilities":["guts"], "moves":["sandstorm", "dragondance", "bite", "outrage"]},
		],
		tier: "LC",
	},
	pupitar: {
		randomBattleMoves: ["earthquake", "stoneedge", "rockpolish", "dragondance", "superpower"],
		tier: "NFE",
	},
	tyranitar: {
		randomBattleMoves: ["crunch", "stoneedge", "pursuit", "superpower", "fireblast", "icebeam", "stealthrock", "aquatail", "dragondance"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["sandstream"], "moves":["thrash", "scaryface", "crunch", "earthquake"]},
		],
		tier: "OU",
	},
	lugia: {
		randomBattleMoves: ["toxic", "dragontail", "roost", "substitute", "whirlwind", "icebeam"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["swift", "raindance", "hydropump", "recover"]},
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["recover", "hydropump", "raindance", "swift"]},
			{"generation": 3, "level": 50, "abilities":["pressure"], "moves":["psychoboost", "earthquake", "hydropump", "featherdance"]},
		],
		eventOnly: true,
		tier: "Uber",
	},
	hooh: {
		randomBattleMoves: ["substitute", "sacredfire", "bravebird", "earthquake", "roost", "flamecharge"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["swift", "sunnyday", "fireblast", "recover"]},
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["recover", "fireblast", "sunnyday", "swift"]},
		],
		eventOnly: true,
		tier: "Uber",
	},
	celebi: {
		randomBattleMoves: ["nastyplot", "psychic", "gigadrain", "recover", "healbell", "batonpass", "stealthrock", "earthpower", "hiddenpowerfire", "hiddenpowerice", "calmmind"],
		eventPokemon: [
			{"generation": 3, "level": 10, "abilities":["naturalcure"], "moves":["confusion", "recover", "healbell", "safeguard"]},
			{"generation": 3, "level": 70, "abilities":["naturalcure"], "moves":["ancientpower", "futuresight", "batonpass", "perishsong"]},
			{"generation": 3, "level": 10, "abilities":["naturalcure"], "moves":["leechseed", "recover", "healbell", "safeguard"]},
			{"generation": 3, "level": 30, "abilities":["naturalcure"], "moves":["healbell", "safeguard", "ancientpower", "futuresight"]},
		],
		eventOnly: true,
		tier: "OU",
	},
	treecko: {
		randomBattleMoves: ["substitute", "leechseed", "gigadrain", "leafstorm", "hiddenpowerice", "hiddenpowerrock", "endeavor"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves":["pound", "leer", "absorb"]},
		],
		tier: "LC",
	},
	grovyle: {
		randomBattleMoves: ["substitute", "leechseed", "gigadrain", "leafstorm", "hiddenpowerice", "hiddenpowerrock", "endeavor"],
		tier: "NFE",
	},
	sceptile: {
		randomBattleMoves: ["substitute", "leechseed", "gigadrain", "leafstorm", "hiddenpowerice", "focusblast", "synthesis", "hiddenpowerrock"],
		tier: "BL",
	},
	torchic: {
		randomBattleMoves: ["fireblast", "protect", "batonpass", "substitute", "hiddenpowergrass"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["blaze"], "moves":["scratch", "growl", "focusenergy", "ember"]},
		],
		tier: "LC",
	},
	combusken: {
		randomBattleMoves: ["flareblitz", "skyuppercut", "protect", "swordsdance", "substitute", "batonpass"],
		tier: "NFE",
	},
	blaziken: {
		randomBattleMoves: ["flareblitz", "highjumpkick", "protect", "swordsdance", "substitute", "batonpass", "bravebird"],
		eventPokemon: [
			{"generation": 3, "level": 70, "abilities":["blaze"], "moves":["blazekick", "slash", "mirrormove", "skyuppercut"]},
		],
		tier: "BL",
	},
	mudkip: {
		randomBattleMoves: ["waterfall", "earthpower", "superpower", "icebeam"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["torrent"], "moves":["tackle", "growl", "mudslap", "watergun"]},
		],
		tier: "LC",
	},
	marshtomp: {
		randomBattleMoves: ["waterfall", "earthquake", "superpower", "icepunch", "rockslide", "stealthrock"],
		tier: "NFE",
	},
	swampert: {
		randomBattleMoves: ["waterfall", "earthquake", "icepunch", "stealthrock", "roar", "superpower", "stoneedge", "rest", "sleeptalk", "curse"],
		tier: "OU",
	},
	poochyena: {
		randomBattleMoves: ["superfang", "foulplay", "suckerpunch", "toxic"],
		eventPokemon: [
			{"generation": 3, "level": 10, "abilities":["runaway"], "moves":["healbell", "dig", "poisonfang", "howl"]},
		],
		tier: "LC",
	},
	mightyena: {
		randomBattleMoves: ["suckerpunch", "crunch", "icefang", "firefang", "howl"],
		tier: "NU",
	},
	zigzagoon: {
		randomBattleMoves: ["bellydrum", "extremespeed", "seedbomb", "substitute"],
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": true, "abilities":["pickup"], "moves":["tackle", "growl", "tailwhip"]},
			{"generation": 3, "level": 5, "abilities":["pickup"], "moves":["tackle", "growl", "extremespeed"]},
		],
		tier: "LC",
	},
	linoone: {
		randomBattleMoves: ["bellydrum", "extremespeed", "seedbomb", "substitute", "shadowclaw"],
		tier: "UU",
	},
	wurmple: {
		randomBattleMoves: ["bugbite", "poisonsting", "tackle", "electroweb"],
		tier: "LC",
	},
	silcoon: {
		randomBattleMoves: ["bugbite", "poisonsting", "tackle", "electroweb"],
		tier: "NFE",
	},
	beautifly: {
		randomBattleMoves: ["quiverdance", "bugbuzz", "psychic", "hiddenpowerfighting", "hiddenpowerrock", "substitute", "roost"],
		tier: "NU",
	},
	cascoon: {
		randomBattleMoves: ["bugbite", "poisonsting", "tackle", "electroweb"],
		tier: "NFE",
	},
	dustox: {
		randomBattleMoves: ["toxic", "roost", "whirlwind", "bugbuzz", "protect", "sludgebomb", "quiverdance"],
		tier: "NU",
	},
	lotad: {
		randomBattleMoves: ["gigadrain", "icebeam", "scald", "substitute", "leechseed"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["swiftswim", "raindish"], "moves":["astonish", "growl", "absorb"]},
		],
		tier: "LC",
	},
	lombre: {
		randomBattleMoves: ["gigadrain", "icebeam", "scald", "substitute", "leechseed"],
		tier: "NFE",
	},
	ludicolo: {
		randomBattleMoves: ["raindance", "hydropump", "surf", "gigadrain", "icebeam", "scald", "leechseed", "substitute", "toxic"],
		tier: "BL",
	},
	seedot: {
		randomBattleMoves: ["leechseed", "naturepower", "seedbomb", "explosion", "foulplay"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["chlorophyll", "earlybird"], "moves":["bide", "harden", "growth"]},
			{"generation": 3, "level": 17, "abilities":["chlorophyll", "earlybird"], "moves":["refresh", "gigadrain", "bulletseed", "secretpower"]},
		],
		tier: "LC",
	},
	nuzleaf: {
		randomBattleMoves: ["foulplay", "naturepower", "seedbomb", "explosion", "swordsdance"],
		tier: "NFE",
	},
	shiftry: {
		randomBattleMoves: ["hiddenpowerfire", "swordsdance", "seedbomb", "suckerpunch", "naturepower", "nastyplot", "gigadrain", "darkpulse"],
		tier: "UU",
	},
	taillow: {
		randomBattleMoves: ["bravebird", "facade", "quickattack", "uturn", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["guts"], "moves":["peck", "growl", "focusenergy", "featherdance"]},
		],
		tier: "LC",
	},
	swellow: {
		randomBattleMoves: ["bravebird", "facade", "quickattack", "uturn", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 43, "abilities":["guts"], "moves":["batonpass", "skyattack", "agility", "facade"]},
		],
		tier: "BL",
	},
	wingull: {
		randomBattleMoves: ["scald", "icebeam", "hiddenpowergrass", "uturn", "airslash", "hurricane"],
		tier: "LC",
	},
	pelipper: {
		randomBattleMoves: ["scald", "icebeam", "hiddenpowergrass", "uturn", "airslash", "hurricane", "toxic", "roost"],
		tier: "NU",
	},
	ralts: {
		randomBattleMoves: ["trickroom", "destinybond", "hypnosis", "willowisp"],
		eventPokemon: [
			{"generation": 3, "level": 5, "moves":["growl", "wish"]},
			{"generation": 3, "level": 5, "moves":["growl", "charm"]},
			{"generation": 3, "level": 20, "moves":["sing", "shockwave", "reflect", "confusion"]},
		],
		tier: "LC",
	},
	kirlia: {
		randomBattleMoves: ["trickroom", "destinybond", "hypnosis", "willowisp"],
		tier: "NFE",
	},
	gardevoir: {
		randomBattleMoves: ["psychic", "focusblast", "shadowball", "trick", "calmmind", "willowisp", "wish", "thunderbolt", "protect", "healingwish"],
		tier: "BL",
	},
	surskit: {
		randomBattleMoves: ["hydropump", "signalbeam", "hiddenpowerfire", "hiddenpowerfighting", "gigadrain"],
		eventPokemon: [
			{"generation": 3, "level": 5, "moves":["bubble", "mudsport"]},
			{"generation": 3, "level": 10, "gender": "M", "moves":["bubble", "quickattack"]},
		],
		tier: "LC",
	},
	masquerain: {
		randomBattleMoves: ["hydropump", "bugbuzz", "airslash", "quiverdance", "substitute", "batonpass", "roost"],
		tier: "NU",
	},
	shroomish: {
		randomBattleMoves: ["spore", "substitute", "leechseed", "gigadrain", "protect", "toxic", "stunspore"],
		eventPokemon: [
			{"generation": 3, "level": 15, "abilities":["effectspore"], "moves":["refresh", "falseswipe", "megadrain", "stunspore"]},
		],
		tier: "LC",
	},
	breloom: {
		randomBattleMoves: ["spore", "substitute", "leechseed", "focuspunch", "machpunch", "lowsweep", "bulletseed", "stoneedge", "swordsdance", "thunderpunch"],
		tier: "BL",
	},
	slakoth: {
		randomBattleMoves: ["return", "hammerarm", "firepunch", "suckerpunch", "gigaimpact", "retaliate", "toxic"],
		tier: "LC",
	},
	vigoroth: {
		randomBattleMoves: ["bulkup", "return", "earthquake", "firepunch", "suckerpunch", "slackoff"],
		tier: "NFE",
	},
	slaking: {
		randomBattleMoves: ["return", "earthquake", "pursuit", "firepunch", "suckerpunch", "doubleedge", "retaliate", "gigaimpact", "hammerarm"],
		tier: "BL",
	},
	nincada: {
		randomBattleMoves: ["xscissor", "toxic", "aerialace", "nightslash"],
		tier: "LC",
	},
	ninjask: {
		randomBattleMoves: ["batonpass", "swordsdance", "substitute", "protect", "xscissor"],
		tier: "BL",
	},
	shedinja: {
		randomBattleMoves: ["swordsdance", "willowisp", "xscissor", "shadowsneak", "suckerpunch"],
		eventPokemon: [
			{"generation": 3, "level": 50, "abilities":["wonderguard"], "moves":["spite", "confuseray", "shadowball", "grudge"]},
			{"generation": 3, "level": 20, "abilities":["wonderguard"], "moves":["doubleteam", "furycutter", "screech"]},
			{"generation": 3, "level": 25, "abilities":["wonderguard"], "moves":["swordsdance"]},
			{"generation": 3, "level": 31, "abilities":["wonderguard"], "moves":["slash"]},
			{"generation": 3, "level": 38, "abilities":["wonderguard"], "moves":["agility"]},
			{"generation": 3, "level": 45, "abilities":["wonderguard"], "moves":["batonpass"]},
		],
		tier: "UU",
	},
	whismur: {
		randomBattleMoves: ["hypervoice", "fireblast", "shadowball", "icebeam"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["soundproof"], "moves":["pound", "uproar", "teeterdance"]},
		],
		tier: "LC",
	},
	loudred: {
		randomBattleMoves: ["hypervoice", "fireblast", "shadowball", "icebeam"],
		tier: "NFE",
	},
	exploud: {
		randomBattleMoves: ["hypervoice", "overheat", "shadowball", "icebeam", "surf", "focusblast"],
		eventPokemon: [
			{"generation": 3, "level": 100, "abilities":["soundproof"], "moves":["roar", "rest", "sleeptalk", "hypervoice"]},
			{"generation": 3, "level": 50, "abilities":["soundproof"], "moves":["stomp", "screech", "hyperbeam", "roar"]},
		],
		tier: "UU",
	},
	makuhita: {
		randomBattleMoves: ["crosschop", "bulletpunch", "closecombat", "icepunch", "bulkup"],
		eventPokemon: [
			{"generation": 3, "level": 18, "abilities":["thickfat", "guts"], "moves":["refresh", "brickbreak", "armthrust", "rocktomb"]},
		],
		tier: "LC",
	},
	hariyama: {
		randomBattleMoves: ["crosschop", "bulletpunch", "closecombat", "icepunch", "stoneedge", "bulkup"],
		tier: "BL",
	},
	nosepass: {
		randomBattleMoves: ["stoneedge", "toxic", "stealthrock", "thunderwave"],
		eventPokemon: [
			{"generation": 3, "level": 26, "abilities":["sturdy", "magnetpull"], "moves":["helpinghand", "thunderbolt", "thunderwave", "rockslide"]},
		],
		tier: "NU",
	},
	skitty: {
		randomBattleMoves: ["return", "suckerpunch", "zenheadbutt", "thunderwave", "fakeout"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["cutecharm"], "moves":["tackle", "growl", "tailwhip", "payday"]},
			{"generation": 3, "level": 5, "abilities":["cutecharm"], "moves":["growl", "tackle", "tailwhip", "rollout"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["cutecharm", "normalize"], "moves":["growl", "tackle", "tailwhip", "attract"]},
		],
		tier: "LC",
	},
	delcatty: {
		randomBattleMoves: ["return", "suckerpunch", "zenheadbutt", "thunderwave", "fakeout", "wish"],
		eventPokemon: [
			{"generation": 3, "level": 18, "abilities":["cutecharm"], "moves":["sweetkiss", "secretpower", "attract", "shockwave"]},
		],
		tier: "NU",
	},
	sableye: {
		randomBattleMoves: ["recover", "willowisp", "taunt", "trick", "toxic", "nightshade", "seismictoss"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["keeneye"], "moves":["leer", "scratch", "foresight", "nightshade"]},
			{"generation": 3, "level": 33, "abilities":["keeneye"], "moves":["helpinghand", "shadowball", "feintattack", "recover"]},
		],
		tier: "UU",
	},
	mawile: {
		randomBattleMoves: ["swordsdance", "ironhead", "firefang", "crunch", "batonpass", "substitute"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["hypercutter", "intimidate"], "moves":["astonish", "faketears"]},
			{"generation": 3, "level": 22, "abilities":["hypercutter", "intimidate"], "moves":["sing", "falseswipe", "vicegrip", "irondefense"]},
		],
		tier: "NU",
	},
	aron: {
		randomBattleMoves: ["headsmash", "ironhead", "earthquake", "superpower", "stealthrock"],
		tier: "LC",
	},
	lairon: {
		randomBattleMoves: ["headsmash", "ironhead", "earthquake", "superpower", "stealthrock"],
		tier: "NFE",
	},
	aggron: {
		randomBattleMoves: ["rockpolish", "headsmash", "earthquake", "superpower", "heavyslam", "aquatail", "icepunch", "stealthrock", "thunderwave"],
		eventPokemon: [
			{"generation": 3, "level": 100, "abilities":["sturdy", "rockhead"], "moves":["irontail", "protect", "metalsound", "doubleedge"]},
			{"generation": 3, "level": 50, "abilities":["sturdy", "rockhead"], "moves":["takedown", "irontail", "protect", "metalsound"]},
		],
		tier: "UU",
	},
	meditite: {
		randomBattleMoves: ["highjumpkick", "psychocut", "icepunch", "thunderpunch", "trick", "fakeout", "bulletpunch", "drainpunch"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["purepower"], "moves":["bide", "meditate", "confusion"]},
			{"generation": 3, "level": 20, "abilities":["purepower"], "moves":["dynamicpunch", "confusion", "shadowball", "detect"]},
		],
		tier: "LC",
	},
	medicham: {
		randomBattleMoves: ["highjumpkick", "drainpunch", "psychocut", "icepunch", "thunderpunch", "trick", "fakeout", "bulletpunch"],
		tier: "BL",
	},
	electrike: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "overheat", "switcheroo", "flamethrower"],
		tier: "LC",
	},
	manectric: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "overheat", "switcheroo", "flamethrower"],
		eventPokemon: [
			{"generation": 3, "level": 44, "abilities":["static", "lightningrod"], "moves":["refresh", "thunder", "raindance", "bite"]},
		],
		tier: "UU",
	},
	plusle: {
		randomBattleMoves: ["nastyplot", "thunderbolt", "substitute", "batonpass", "hiddenpowerice"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["plus"], "moves":["growl", "thunderwave", "watersport"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["plus"], "moves":["growl", "thunderwave", "quickattack"]},
		],
		tier: "NU",
	},
	minun: {
		randomBattleMoves: ["nastyplot", "thunderbolt", "substitute", "batonpass", "hiddenpowerice"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["minus"], "moves":["growl", "thunderwave", "mudsport"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["minus"], "moves":["growl", "thunderwave", "quickattack"]},
		],
		tier: "NU",
	},
	volbeat: {
		randomBattleMoves: ["tailglow", "batonpass", "substitute", "bugbuzz", "thunderwave", "encore"],
		tier: "NU",
	},
	illumise: {
		randomBattleMoves: ["substitute", "batonpass", "wish", "bugbuzz", "encore", "thunderbolt"],
		tier: "NU",
	},
	roselia: {
		randomBattleMoves: ["spikes", "toxicspikes", "sleeppowder", "gigadrain", "stunspore", "rest"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["naturalcure", "poisonpoint"], "moves":["absorb", "growth", "poisonsting"]},
			{"generation": 3, "level": 22, "abilities":["naturalcure", "poisonpoint"], "moves":["sweetkiss", "magicalleaf", "leechseed", "grasswhistle"]},
		],
		tier: "NU",
	},
	gulpin: {
		randomBattleMoves: ["stockpile", "sludgebomb", "icebeam", "toxic", "painsplit", "yawn", "encore"],
		eventPokemon: [
			{"generation": 3, "level": 17, "abilities":["stickyhold", "liquidooze"], "moves":["sing", "shockwave", "sludge", "toxic"]},
		],
		tier: "LC",
	},
	swalot: {
		randomBattleMoves: ["stockpile", "sludgebomb", "icebeam", "toxic", "painsplit", "yawn", "encore", "earthquake"],
		tier: "NU",
	},
	carvanha: {
		randomBattleMoves: ["protect", "hydropump", "icebeam", "waterfall", "crunch", "hiddenpowergrass", "aquajet"],
		eventPokemon: [
			{"generation": 3, "level": 15, "abilities":["roughskin"], "moves":["refresh", "waterpulse", "bite", "scaryface"]},
		],
		tier: "LC",
	},
	sharpedo: {
		randomBattleMoves: ["protect", "hydropump", "icebeam", "crunch", "earthquake", "waterfall", "hiddenpowergrass", "aquajet"],
		tier: "UU",
	},
	wailmer: {
		randomBattleMoves: ["waterspout", "surf", "hydropump", "icebeam", "hiddenpowergrass", "hiddenpowerelectric"],
		tier: "LC",
	},
	wailord: {
		randomBattleMoves: ["waterspout", "surf", "hydropump", "icebeam", "hiddenpowergrass", "hiddenpowerelectric"],
		eventPokemon: [
			{"generation": 3, "level": 100, "abilities":["waterveil", "oblivious"], "moves":["rest", "waterspout", "amnesia", "hydropump"]},
			{"generation": 3, "level": 50, "abilities":["waterveil", "oblivious"], "moves":["waterpulse", "mist", "rest", "waterspout"]},
		],
		tier: "NU",
	},
	numel: {
		randomBattleMoves: ["curse", "earthquake", "rockslide", "fireblast", "flamecharge", "rest", "sleeptalk", "stockpile"],
		eventPokemon: [
			{"generation": 3, "level": 14, "abilities":["oblivious"], "moves":["charm", "takedown", "dig", "ember"]},
		],
		tier: "LC",
	},
	camerupt: {
		randomBattleMoves: ["rockpolish", "fireblast", "earthpower", "stoneedge", "lavaplume", "stealthrock", "earthquake"],
		tier: "UU",
	},
	torkoal: {
		randomBattleMoves: ["rapidspin", "stealthrock", "yawn", "lavaplume", "earthquake", "toxic", "willowisp"],
		tier: "NU",
	},
	spoink: {
		randomBattleMoves: ["psychic", "reflect", "lightscreen", "thunderwave", "trick", "healbell"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["owntempo"], "moves":["splash", "uproar"]},
		],
		tier: "LC",
	},
	grumpig: {
		randomBattleMoves: ["calmmind", "psychic", "focusblast", "shadowball", "thunderwave", "trick", "healbell"],
		tier: "UU",
	},
	spinda: {
		randomBattleMoves: ["wish", "protect", "return", "superpower", "suckerpunch"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["owntempo", "tangledfeet"], "moves":["tackle", "uproar", "sing"]},
		],
		tier: "NU",
	},
	trapinch: {
		randomBattleMoves: ["earthquake", "rockslide", "crunch", "quickattack", "superpower"],
		tier: "NU",
	},
	vibrava: {
		randomBattleMoves: ["substitute", "earthquake", "outrage", "roost", "uturn", "superpower"],
		tier: "NFE",
	},
	flygon: {
		randomBattleMoves: ["earthquake", "outrage", "dragonclaw", "uturn", "roost", "substitute", "stoneedge", "firepunch", "superpower"],
		eventPokemon: [
			{"generation": 3, "level": 45, "abilities":["levitate"], "moves":["sandtomb", "crunch", "dragonbreath", "screech"]},
		],
		tier: "OU",
	},
	cacnea: {
		randomBattleMoves: ["swordsdance", "spikes", "suckerpunch", "seedbomb", "drainpunch"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["sandveil"], "moves":["poisonsting", "leer", "absorb", "encore"]},
		],
		tier: "LC",
	},
	cacturne: {
		randomBattleMoves: ["swordsdance", "spikes", "suckerpunch", "seedbomb", "drainpunch"],
		eventPokemon: [
			{"generation": 3, "level": 45, "abilities":["sandveil"], "moves":["ingrain", "feintattack", "spikes", "needlearm"]},
		],
		tier: "UU",
	},
	swablu: {
		randomBattleMoves: ["roost", "toxic", "cottonguard", "return"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["naturalcure"], "moves":["peck", "growl", "falseswipe"]},
		],
		tier: "LC",
	},
	altaria: {
		randomBattleMoves: ["dragondance", "outrage", "dragonclaw", "earthquake", "roost", "fireblast"],
		eventPokemon: [
			{"generation": 3, "level": 45, "abilities":["naturalcure"], "moves":["takedown", "dragonbreath", "dragondance", "refresh"]},
			{"generation": 3, "level": 36, "abilities":["naturalcure"], "moves":["healbell", "dragonbreath", "solarbeam", "aerialace"]},
		],
		tier: "UU",
	},
	zangoose: {
		randomBattleMoves: ["swordsdance", "closecombat", "nightslash", "quickattack", "facade"],
		eventPokemon: [
			{"generation": 3, "level": 18, "abilities":["immunity"], "moves":["leer", "quickattack", "swordsdance", "furycutter"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["immunity"], "moves":["scratch", "leer", "quickattack", "swordsdance"]},
			{"generation": 3, "level": 28, "abilities":["immunity"], "moves":["refresh", "brickbreak", "counter", "crushclaw"]},
		],
		tier: "BL",
	},
	seviper: {
		randomBattleMoves: ["sludgebomb", "flamethrower", "gigadrain", "switcheroo", "earthquake", "suckerpunch", "aquatail"],
		eventPokemon: [
			{"generation": 3, "level": 18, "abilities":["shedskin"], "moves":["wrap", "lick", "bite", "poisontail"]},
			{"generation": 3, "level": 30, "abilities":["shedskin"], "moves":["poisontail", "screech", "glare", "crunch"]},
			{"generation": 3, "level": 10, "gender": "M", "abilities":["shedskin"], "moves":["wrap", "lick", "bite"]},
		],
		tier: "UU",
	},
	lunatone: {
		randomBattleMoves: ["psychic", "earthpower", "stealthrock", "rockpolish", "batonpass", "calmmind", "icebeam", "hiddenpowerrock", "moonlight"],
		eventPokemon: [
			{"generation": 3, "level": 10, "abilities":["levitate"], "moves":["tackle", "harden", "confusion"]},
			{"generation": 3, "level": 25, "abilities":["levitate"], "moves":["batonpass", "psychic", "raindance", "rocktomb"]},
		],
		tier: "UU",
	},
	solrock: {
		randomBattleMoves: ["stealthrock", "explosion", "stoneedge", "zenheadbutt", "earthquake", "batonpass", "willowisp", "rockpolish", "morningsun"],
		eventPokemon: [
			{"generation": 3, "level": 10, "abilities":["levitate"], "moves":["tackle", "harden", "confusion"]},
			{"generation": 3, "level": 41, "abilities":["levitate"], "moves":["batonpass", "psychic", "sunnyday", "cosmicpower"]},
		],
		tier: "UU",
	},
	barboach: {
		randomBattleMoves: ["dragondance", "waterfall", "earthquake", "return"],
		tier: "LC",
	},
	whiscash: {
		randomBattleMoves: ["dragondance", "waterfall", "earthquake", "stoneedge"],
		tier: "NU",
	},
	corphish: {
		randomBattleMoves: ["dragondance", "waterfall", "crunch", "superpower", "swordsdance"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["hypercutter", "shellarmor"], "moves":["bubble", "watersport"]},
		],
		tier: "LC",
	},
	crawdaunt: {
		randomBattleMoves: ["dragondance", "waterfall", "crunch", "superpower", "swordsdance"],
		eventPokemon: [
			{"generation": 3, "level": 100, "abilities":["hypercutter", "shellarmor"], "moves":["taunt", "crabhammer", "swordsdance", "guillotine"]},
			{"generation": 3, "level": 50, "abilities":["hypercutter", "shellarmor"], "moves":["knockoff", "taunt", "crabhammer", "swordsdance"]},
		],
		tier: "NU",
	},
	baltoy: {
		randomBattleMoves: ["stealthrock", "earthquake", "toxic", "psychic", "reflect", "lightscreen", "icebeam", "rapidspin"],
		eventPokemon: [
			{"generation": 3, "level": 17, "abilities":["levitate"], "moves":["refresh", "rocktomb", "mudslap", "psybeam"]},
		],
		tier: "LC",
	},
	claydol: {
		randomBattleMoves: ["stealthrock", "toxic", "psychic", "icebeam", "earthquake", "rapidspin", "reflect", "lightscreen"],
		tier: "OU",
	},
	lileep: {
		randomBattleMoves: ["stealthrock", "recover", "ancientpower", "hiddenpowerfire", "gigadrain", "stockpile"],
		tier: "LC",
	},
	cradily: {
		randomBattleMoves: ["stealthrock", "recover", "stockpile", "seedbomb", "rockslide", "earthquake", "curse", "swordsdance"],
		tier: "UU",
	},
	anorith: {
		randomBattleMoves: ["stealthrock", "brickbreak", "toxic", "xscissor", "rockslide", "swordsdance", "rockpolish"],
		tier: "LC",
	},
	armaldo: {
		randomBattleMoves: ["stealthrock", "stoneedge", "toxic", "xscissor", "swordsdance", "earthquake", "superpower"],
		tier: "BL",
	},
	feebas: {
		randomBattleMoves: ["protect", "confuseray", "hypnosis", "scald", "toxic"],
		tier: "LC",
	},
	milotic: {
		randomBattleMoves: ["recover", "scald", "hypnosis", "toxic", "icebeam", "dragontail", "rest", "sleeptalk", "hiddenpowergrass"],
		eventPokemon: [
			{"generation": 3, "level": 35, "abilities":["marvelscale"], "moves":["waterpulse", "twister", "recover", "raindance"]},
		],
		tier: "OU",
	},
	castform: {
		randomBattleMoves: ["sunnyday", "raindance", "fireblast", "hydropump", "thunder", "icebeam", "solarbeam"],
		tier: "NU",
	},
	castformsunny: {
		tier: "Illegal",
	},
	castformrainy: {
		tier: "Illegal",
	},
	castformsnowy: {
		tier: "Illegal",
	},
	kecleon: {
		randomBattleMoves: ["stealthrock", "recover", "return", "thunderwave", "suckerpunch"],
		tier: "NU",
	},
	shuppet: {
		randomBattleMoves: ["trickroom", "destinybond", "taunt", "shadowsneak", "willowisp"],
		eventPokemon: [
			{"generation": 3, "level": 45, "abilities":["insomnia", "frisk"], "moves":["spite", "willowisp", "feintattack", "shadowball"]},
		],
		tier: "LC",
	},
	banette: {
		randomBattleMoves: ["trickroom", "destinybond", "taunt", "shadowclaw", "willowisp"],
		eventPokemon: [
			{"generation": 3, "level": 37, "abilities":["insomnia"], "moves":["helpinghand", "feintattack", "shadowball", "curse"]},
		],
		tier: "UU",
	},
	duskull: {
		randomBattleMoves: ["willowisp", "shadowsneak", "icebeam", "painsplit", "substitute", "nightshade"],
		eventPokemon: [
			{"generation": 3, "level": 45, "abilities":["levitate"], "moves":["pursuit", "curse", "willowisp", "meanlook"]},
			{"generation": 3, "level": 19, "abilities":["levitate"], "moves":["helpinghand", "shadowball", "astonish", "confuseray"]},
		],
		tier: "LC",
	},
	dusclops: {
		randomBattleMoves: ["willowisp", "shadowsneak", "icebeam", "painsplit", "substitute", "seismictoss"],
		tier: "BL",
	},
	tropius: {
		randomBattleMoves: ["leechseed", "substitute", "airslash", "gigadrain", "earthquake", "hiddenpowerfire", "roost", "leafstorm"],
		tier: "NU",
	},
	chimecho: {
		randomBattleMoves: ["hypnosis", "toxic", "wish", "psychic", "thunderwave", "recover", "calmmind", "shadowball", "hiddenpowerfighting", "healingwish"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities":["levitate"], "moves":["wrap", "growl", "astonish"]},
		],
		tier: "NU",
	},
	absol: {
		randomBattleMoves: ["swordsdance", "suckerpunch", "nightslash", "psychocut", "superpower", "pursuit", "megahorn"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["pressure"], "moves":["scratch", "leer", "wish"]},
			{"generation": 3, "level": 5, "abilities":["pressure"], "moves":["scratch", "leer", "spite"]},
			{"generation": 3, "level": 35, "abilities":["pressure"], "moves":["razorwind", "bite", "swordsdance", "spite"]},
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["doubleteam", "slash", "futuresight", "perishsong"]},
		],
		tier: "UU",
	},
	snorunt: {
		randomBattleMoves: ["spikes", "icebeam", "hiddenpowerground", "iceshard", "crunch"],
		eventPokemon: [
			{"generation": 3, "level": 22, "abilities":["innerfocus"], "moves":["sing", "waterpulse", "bite", "icywind"]},
		],
		tier: "LC",
	},
	glalie: {
		randomBattleMoves: ["spikes", "icebeam", "iceshard", "crunch", "explosion", "earthquake"],
		tier: "NU",
	},
	spheal: {
		randomBattleMoves: ["substitute", "protect", "toxic", "surf", "icebeam"],
		eventPokemon: [
			{"generation": 3, "level": 17, "abilities":["thickfat"], "moves":["charm", "aurorabeam", "watergun", "mudslap"]},
		],
		tier: "LC",
	},
	sealeo: {
		randomBattleMoves: ["substitute", "protect", "toxic", "surf", "icebeam"],
		tier: "NFE",
	},
	walrein: {
		randomBattleMoves: ["substitute", "protect", "toxic", "surf", "icebeam", "roar"],
		tier: "UU",
	},
	clamperl: {
		randomBattleMoves: ["shellsmash", "icebeam", "surf", "hiddenpowergrass", "hiddenpowerelectric", "substitute"],
		tier: "LC",
	},
	huntail: {
		randomBattleMoves: ["shellsmash", "return", "hydropump", "batonpass", "suckerpunch"],
		tier: "NU",
	},
	gorebyss: {
		randomBattleMoves: ["shellsmash", "batonpass", "hydropump", "icebeam", "hiddenpowergrass", "substitute"],
		tier: "UU",
	},
	relicanth: {
		randomBattleMoves: ["headsmash", "waterfall", "earthquake", "doubleedge", "stealthrock"],
		tier: "NU",
	},
	luvdisc: {
		randomBattleMoves: ["surf", "icebeam", "toxic", "sweetkiss", "protect"],
		tier: "NU",
	},
	bagon: {
		randomBattleMoves: ["outrage", "dragondance", "firefang", "rockslide", "dragonclaw"],
		eventPokemon: [
			{"generation": 3, "level": 5, "moves":["rage", "bite", "wish"]},
			{"generation": 3, "level": 5, "moves":["rage", "bite", "irondefense"]},
		],
		tier: "LC",
	},
	shelgon: {
		randomBattleMoves: ["outrage", "brickbreak", "dragonclaw", "dragondance"],
		tier: "NFE",
	},
	salamence: {
		randomBattleMoves: ["outrage", "fireblast", "earthquake", "dracometeor", "roost", "dragondance", "dragonclaw"],
		eventPokemon: [
			{"generation": 3, "level": 50, "moves":["protect", "dragonbreath", "scaryface", "fly"]},
			{"generation": 3, "level": 50, "moves":["refresh", "dragonclaw", "dragondance", "aerialace"]},
		],
		tier: "OU",
	},
	beldum: {
		randomBattleMoves: ["ironhead", "zenheadbutt", "headbutt", "irondefense"],
		tier: "LC",
	},
	metang: {
		randomBattleMoves: ["stealthrock", "meteormash", "toxic", "earthquake", "bulletpunch"],
		eventPokemon: [
			{"generation": 3, "level": 30, "abilities":["clearbody"], "moves":["takedown", "confusion", "metalclaw", "refresh"]},
		],
		tier: "NFE",
	},
	metagross: {
		randomBattleMoves: ["meteormash", "earthquake", "agility", "stealthrock", "zenheadbutt", "bulletpunch", "trick"],
		tier: "OU",
	},
	regirock: {
		randomBattleMoves: ["stealthrock", "thunderwave", "stoneedge", "earthquake", "curse", "rest", "sleeptalk", "rockslide", "toxic"],
		eventPokemon: [
			{"generation": 3, "level": 40, "abilities":["clearbody"], "moves":["curse", "superpower", "ancientpower", "hyperbeam"]},
		],
		tier: "BL",
	},
	regice: {
		randomBattleMoves: ["thunderwave", "icebeam", "thunderbolt", "rest", "sleeptalk", "focusblast"],
		eventPokemon: [
			{"generation": 3, "level": 40, "abilities":["clearbody"], "moves":["curse", "superpower", "ancientpower", "hyperbeam"]},
		],
		tier: "OU",
	},
	registeel: {
		randomBattleMoves: ["stealthrock", "ironhead", "curse", "rest", "thunderwave", "toxic"],
		eventPokemon: [
			{"generation": 3, "level": 40, "abilities":["clearbody"], "moves":["curse", "superpower", "ancientpower", "hyperbeam"]},
		],
		tier: "BL",
	},
	latias: {
		randomBattleMoves: ["dragonpulse", "surf", "hiddenpowerfire", "roost", "calmmind", "wish", "healingwish"],
		eventPokemon: [
			{"generation": 3, "level": 50, "gender": "F", "abilities":["levitate"], "moves":["charm", "recover", "psychic", "mistball"]},
			{"generation": 3, "level": 70, "gender": "F", "abilities":["levitate"], "moves":["mistball", "psychic", "recover", "charm"]},
		],
		tier: "Uber",
	},
	latios: {
		randomBattleMoves: ["dracometeor", "dragonpulse", "surf", "hiddenpowerfire", "psyshock", "roost"],
		eventPokemon: [
			{"generation": 3, "level": 50, "gender": "M", "abilities":["levitate"], "moves":["dragondance", "recover", "psychic", "lusterpurge"]},
			{"generation": 3, "level": 70, "gender": "M", "abilities":["levitate"], "moves":["lusterpurge", "psychic", "recover", "dragondance"]},
		],
		tier: "Uber",
	},
	kyogre: {
		randomBattleMoves: ["waterspout", "surf", "thunder", "icebeam", "calmmind", "rest", "sleeptalk"],
		tier: "Uber",
	},
	groudon: {
		randomBattleMoves: ["earthquake", "dragontail", "stealthrock", "stoneedge", "swordsdance", "rockpolish", "thunderwave", "firepunch"],
		tier: "Uber",
	},
	rayquaza: {
		randomBattleMoves: ["outrage", "vcreate", "extremespeed", "dragondance", "swordsdance", "dracometeor", "dragonclaw"],
		tier: "Uber",
	},
	jirachi: {
		randomBattleMoves: ["ironhead", "firepunch", "thunderwave", "stealthrock", "wish", "uturn", "calmmind", "psychic", "thunder", "icepunch", "flashcannon"],
		eventPokemon: [
			{"generation": 3, "level": 5, "abilities":["serenegrace"], "moves":["wish", "confusion", "rest"]},
			{"generation": 3, "level": 30, "abilities":["serenegrace"], "moves":["helpinghand", "psychic", "refresh", "rest"]},
		],
		eventOnly: true,
		tier: "OU",
	},
	deoxys: {
		randomBattleMoves: ["psychoboost", "superpower", "extremespeed", "icebeam", "thunderbolt", "firepunch", "spikes", "stealthrock"],
		eventPokemon: [
			{"generation": 3, "level": 30, "abilities":["pressure"], "moves":["snatch", "psychic", "spikes", "knockoff"]},
			{"generation": 3, "level": 30, "abilities":["pressure"], "moves":["superpower", "psychic", "pursuit", "taunt"]},
			{"generation": 3, "level": 30, "abilities":["pressure"], "moves":["swift", "psychic", "pursuit", "knockoff"]},
			{"generation": 3, "level": 70, "abilities":["pressure"], "moves":["cosmicpower", "recover", "psychoboost", "hyperbeam"]},
		],
		eventOnly: true,
		tier: "Uber",
	},
	deoxysattack: {
		randomBattleMoves: ["psychoboost", "superpower", "extremespeed", "icebeam", "thunderbolt", "firepunch", "spikes", "stealthrock"],
		eventOnly: true,
		tier: "Uber",
	},
	deoxysdefense: {
		randomBattleMoves: ["spikes", "stealthrock", "recover", "taunt", "toxic", "agility", "seismictoss", "magiccoat"],
		eventOnly: true,
		tier: "Uber",
	},
	deoxysspeed: {
		randomBattleMoves: ["spikes", "stealthrock", "superpower", "icebeam", "psychoboost", "taunt", "lightscreen", "reflect", "magiccoat", "trick"],
		eventOnly: true,
		tier: "Uber",
	},
};
