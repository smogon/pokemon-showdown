'use strict';

/**@type {{[k: string]: ModdedTemplateFormatsData}} */
let BattleFormatsData = {
	bulbasaur: {
		tier: "LC",
	},
	ivysaur: {
		tier: "NFE",
	},
	venusaur: {
		randomBattleMoves: ["sleeppowder", "leafstorm", "sludgebomb", "substitute", "leechseed"],
		randomDoubleBattleMoves: ["sleeppowder", "gigadrain", "hiddenpowerfire", "hiddenpowerice", "sludgebomb", "powerwhip", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	venusaurmega: {
		randomBattleMoves: ["gigadrain", "sludgebomb", "hiddenpowerfire", "synthesis", "leechseed", "earthquake"],
		randomDoubleBattleMoves: ["sleeppowder", "gigadrain", "hiddenpowerfire", "hiddenpowerice", "sludgebomb", "powerwhip", "protect"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	charmander: {
		tier: "LC",
	},
	charmeleon: {
		tier: "NFE",
	},
	charizard: {
		randomBattleMoves: ["holdhands", "fireblast", "airslash", "earthquake", "roost"],
		randomDoubleBattleMoves: ["heatwave", "fireblast", "airslash", "overheat", "dragonpulse", "roost", "tailwind", "protect"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	charizardmegax: {
		randomBattleMoves: ["dragondance", "flareblitz", "dragonclaw", "earthquake", "roost", "willowisp"],
		randomDoubleBattleMoves: ["dragondance", "flareblitz", "dragonclaw", "earthquake", "rockslide", "roost", "substitute"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	charizardmegay: {
		randomBattleMoves: ["fireblast", "airslash", "roost", "solarbeam", "focusblast", "dragonpulse"],
		randomDoubleBattleMoves: ["heatwave", "fireblast", "airslash", "roost", "solarbeam", "focusblast", "protect"],
		tier: "OU",
		doublesTier: "DOU",
	},
	squirtle: {
		tier: "LC",
	},
	wartortle: {
		tier: "NFE",
	},
	blastoise: {
		randomBattleMoves: ["icebeam", "rapidspin", "scald", "toxic", "dragontail", "roar"],
		randomDoubleBattleMoves: ["muddywater", "icebeam", "hydropump", "fakeout", "scald", "followme", "icywind", "protect", "waterspout"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	blastoisemega: {
		randomBattleMoves: ["icebeam", "hydropump", "rapidspin", "scald", "dragontail", "darkpulse", "aurasphere"],
		randomDoubleBattleMoves: ["muddywater", "icebeam", "hydropump", "fakeout", "scald", "darkpulse", "aurasphere", "followme", "icywind", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	caterpie: {
		tier: "LC",
	},
	metapod: {
		tier: "NFE",
	},
	butterfree: {
		randomBattleMoves: ["sleeppowder", "quiverdance", "bugbuzz", "airslash", "energyball"],
		randomDoubleBattleMoves: ["quiverdance", "bugbuzz", "sleeppowder", "airslash", "shadowball", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	weedle: {
		tier: "LC",
	},
	kakuna: {
		tier: "NFE",
	},
	beedrill: {
		randomBattleMoves: ["toxicspikes", "tailwind", "uturn", "endeavor", "poisonjab", "knockoff"],
		randomDoubleBattleMoves: ["xscissor", "uturn", "poisonjab", "drillrun", "brickbreak", "knockoff", "protect", "stringshot"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	beedrillmega: {
		randomBattleMoves: ["xscissor", "swordsdance", "uturn", "poisonjab", "drillrun", "knockoff"],
		randomDoubleBattleMoves: ["xscissor", "uturn", "substitute", "poisonjab", "drillrun", "knockoff", "protect"],
		tier: "UU",
		doublesTier: "DUU",
	},
	pidgey: {
		tier: "LC",
	},
	pidgeotto: {
		tier: "NFE",
	},
	pidgeot: {
		randomBattleMoves: ["roost", "bravebird", "heatwave", "return", "uturn", "defog"],
		randomDoubleBattleMoves: ["bravebird", "heatwave", "return", "doubleedge", "uturn", "tailwind", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pidgeotmega: {
		randomBattleMoves: ["roost", "heatwave", "uturn", "hurricane", "defog"],
		randomDoubleBattleMoves: ["tailwind", "heatwave", "uturn", "hurricane", "protect"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	rattata: {
		tier: "LC",
	},
	rattataalola: {
		tier: "LC",
	},
	raticate: {
		randomBattleMoves: ["protect", "facade", "stompingtantrum", "suckerpunch", "uturn", "swordsdance"],
		randomDoubleBattleMoves: ["facade", "stompingtantrum", "suckerpunch", "uturn", "crunch", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	raticatealola: {
		randomBattleMoves: ["swordsdance", "return", "suckerpunch", "knockoff", "doubleedge"],
		randomDoubleBattleMoves: ["doubleedge", "suckerpunch", "protect", "crunch", "uturn"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	raticatealolatotem: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	spearow: {
		tier: "LC",
	},
	fearow: {
		randomBattleMoves: ["return", "drillpeck", "doubleedge", "uturn", "pursuit", "drillrun"],
		randomDoubleBattleMoves: ["return", "drillpeck", "doubleedge", "uturn", "quickattack", "drillrun", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	ekans: {
		tier: "LC",
	},
	arbok: {
		randomBattleMoves: ["coil", "gunkshot", "suckerpunch", "aquatail", "earthquake", "rest"],
		randomDoubleBattleMoves: ["gunkshot", "suckerpunch", "aquatail", "crunch", "earthquake", "rest", "rockslide", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pichu: {
		tier: "LC",
	},
	pikachu: {
		randomBattleMoves: ["volttackle", "voltswitch", "grassknot", "hiddenpowerice", "knockoff", "irontail"],
		randomDoubleBattleMoves: ["fakeout", "thunderbolt", "volttackle", "voltswitch", "grassknot", "hiddenpowerice", "brickbreak", "extremespeed", "encore", "substitute", "knockoff", "protect", "discharge"],
		tier: "NFE",
	},
	pikachuoriginal: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pikachuhoenn: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pikachusinnoh: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pikachuunova: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pikachukalos: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pikachualola: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pikachupartner: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	raichu: {
		randomBattleMoves: ["nastyplot", "encore", "thunderbolt", "grassknot", "hiddenpowerice", "focusblast", "voltswitch"],
		randomDoubleBattleMoves: ["fakeout", "encore", "thunderbolt", "grassknot", "hiddenpowerice", "focusblast", "voltswitch", "protect"],
		tier: "(PU)",
		doublesTier: "DUU",
	},
	raichualola: {
		randomBattleMoves: ["nastyplot", "thunderbolt", "psyshock", "focusblast", "voltswitch", "surf"],
		randomDoubleBattleMoves: ["thunderbolt", "fakeout", "encore", "psychic", "protect", "voltswitch"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	sandshrew: {
		tier: "LC",
	},
	sandshrewalola: {
		tier: "LC",
	},
	sandslash: {
		randomBattleMoves: ["earthquake", "swordsdance", "rapidspin", "toxic", "stealthrock", "knockoff"],
		randomDoubleBattleMoves: ["earthquake", "rockslide", "stoneedge", "swordsdance", "xscissor", "knockoff", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	sandslashalola: {
		randomBattleMoves: ["swordsdance", "iciclecrash", "ironhead", "earthquake", "rapidspin", "stealthrock", "knockoff"],
		randomDoubleBattleMoves: ["protect", "swordsdance", "iciclecrash", "ironhead", "earthquake", "rockslide"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	nidoranf: {
		tier: "LC",
	},
	nidorina: {
		tier: "NFE",
	},
	nidoqueen: {
		randomBattleMoves: ["toxicspikes", "stealthrock", "fireblast", "icebeam", "earthpower", "sludgewave"],
		randomDoubleBattleMoves: ["protect", "fireblast", "icebeam", "earthpower", "sludgebomb", "thunderbolt"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	nidoranm: {
		tier: "LC",
	},
	nidorino: {
		tier: "NFE",
	},
	nidoking: {
		randomBattleMoves: ["substitute", "fireblast", "icebeam", "earthpower", "sludgewave", "superpower"],
		randomDoubleBattleMoves: ["protect", "fireblast", "thunderbolt", "icebeam", "earthpower", "sludgebomb", "focusblast"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	cleffa: {
		tier: "LC",
	},
	clefairy: {
		tier: "PU",
		doublesTier: "NFE",
	},
	clefable: {
		randomBattleMoves: ["calmmind", "softboiled", "fireblast", "moonblast", "stealthrock", "thunderwave"],
		randomDoubleBattleMoves: ["reflect", "thunderwave", "lightscreen", "safeguard", "fireblast", "followme", "protect", "moonblast", "dazzlinggleam", "softboiled"],
		tier: "OU",
		doublesTier: "DUU",
	},
	vulpix: {
		tier: "LC Uber",
	},
	vulpixalola: {
		tier: "LC",
	},
	ninetales: {
		randomBattleMoves: ["fireblast", "willowisp", "solarbeam", "nastyplot", "substitute", "psyshock"],
		randomDoubleBattleMoves: ["heatwave", "fireblast", "willowisp", "solarbeam", "substitute", "protect"],
		tier: "RU",
		doublesTier: "DUU",
	},
	ninetalesalola: {
		randomBattleMoves: ["nastyplot", "blizzard", "moonblast", "substitute", "hiddenpowerfire", "freezedry", "auroraveil"],
		randomDoubleBattleMoves: ["blizzard", "moonblast", "protect", "hiddenpowerfire", "freezedry", "auroraveil", "encore"],
		tier: "UUBL",
		doublesTier: "DOU",
	},
	igglybuff: {
		tier: "LC",
	},
	jigglypuff: {
		tier: "NFE",
	},
	wigglytuff: {
		randomBattleMoves: ["reflect", "lightscreen", "healbell", "stealthrock", "fireblast", "dazzlinggleam"],
		randomDoubleBattleMoves: ["thunderwave", "reflect", "lightscreen", "protect", "dazzlinggleam", "fireblast", "icebeam", "hypervoice"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	zubat: {
		tier: "LC",
	},
	golbat: {
		tier: "NU",
		doublesTier: "NFE",
	},
	crobat: {
		randomBattleMoves: ["bravebird", "roost", "toxic", "taunt", "defog", "uturn", "superfang"],
		randomDoubleBattleMoves: ["bravebird", "taunt", "tailwind", "crosspoison", "uturn", "protect", "superfang"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	oddish: {
		tier: "LC",
	},
	gloom: {
		tier: "NFE",
	},
	vileplume: {
		randomBattleMoves: ["gigadrain", "sludgebomb", "sleeppowder", "hiddenpowerfire", "aromatherapy", "strengthsap"],
		randomDoubleBattleMoves: ["gigadrain", "sludgebomb", "sleeppowder", "stunspore", "protect", "hiddenpowerfire", "moonblast"],
		tier: "NUBL",
		doublesTier: "(DUU)",
	},
	bellossom: {
		randomBattleMoves: ["gigadrain", "sleeppowder", "hiddenpowerfire", "hiddenpowerrock", "quiverdance", "moonblast"],
		randomDoubleBattleMoves: ["gigadrain", "sludgebomb", "sleeppowder", "stunspore", "protect", "hiddenpowerfire", "moonblast", "sunnyday", "solarbeam"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	paras: {
		tier: "LC",
	},
	parasect: {
		randomBattleMoves: ["spore", "substitute", "leechlife", "seedbomb", "leechseed", "knockoff"],
		randomDoubleBattleMoves: ["spore", "stunspore", "leechlife", "seedbomb", "ragepowder", "leechseed", "protect", "knockoff", "wideguard"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	venonat: {
		tier: "LC",
	},
	venomoth: {
		randomBattleMoves: ["sleeppowder", "quiverdance", "bugbuzz", "sludgebomb", "substitute"],
		randomDoubleBattleMoves: ["sleeppowder", "roost", "ragepowder", "quiverdance", "protect", "bugbuzz", "sludgebomb", "gigadrain", "substitute", "psychic"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	diglett: {
		tier: "LC",
	},
	diglettalola: {
		tier: "LC",
	},
	dugtrio: {
		randomBattleMoves: ["earthquake", "stoneedge", "stealthrock", "suckerpunch", "reversal", "substitute", "memento"],
		randomDoubleBattleMoves: ["earthquake", "rockslide", "protect", "suckerpunch", "stoneedge"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	dugtrioalola: {
		randomBattleMoves: ["earthquake", "ironhead", "substitute", "toxic", "stoneedge", "suckerpunch", "stealthrock"],
		randomDoubleBattleMoves: ["earthquake", "ironhead", "protect", "rockslide", "stoneedge", "suckerpunch"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	meowth: {
		tier: "LC",
	},
	meowthalola: {
		tier: "LC",
	},
	persian: {
		randomBattleMoves: ["fakeout", "uturn", "taunt", "return", "knockoff"],
		randomDoubleBattleMoves: ["fakeout", "uturn", "knockoff", "taunt", "return", "hypnosis", "feint", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	persianalola: {
		randomBattleMoves: ["nastyplot", "darkpulse", "powergem", "hypnosis", "hiddenpowerfighting"],
		randomDoubleBattleMoves: ["fakeout", "foulplay", "darkpulse", "powergem", "snarl", "hiddenpowerfighting", "partingshot", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	psyduck: {
		tier: "LC",
	},
	golduck: {
		randomBattleMoves: ["hydropump", "scald", "icebeam", "psyshock", "encore", "calmmind", "substitute"],
		randomDoubleBattleMoves: ["hydropump", "scald", "icebeam", "hiddenpowergrass", "focusblast", "encore", "psychic", "icywind", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	mankey: {
		tier: "LC",
	},
	primeape: {
		randomBattleMoves: ["closecombat", "uturn", "icepunch", "stoneedge", "encore", "earthquake", "gunkshot"],
		randomDoubleBattleMoves: ["closecombat", "uturn", "icepunch", "rockslide", "punishment", "earthquake", "poisonjab", "protect", "taunt", "stoneedge"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	growlithe: {
		tier: "LC",
	},
	arcanine: {
		randomBattleMoves: ["flareblitz", "wildcharge", "extremespeed", "closecombat", "morningsun", "willowisp", "toxic", "crunch", "roar"],
		randomDoubleBattleMoves: ["flareblitz", "wildcharge", "closecombat", "willowisp", "snarl", "protect", "extremespeed"],
		tier: "RU",
		doublesTier: "DUU",
	},
	poliwag: {
		tier: "LC",
	},
	poliwhirl: {
		tier: "NFE",
	},
	poliwrath: {
		randomBattleMoves: ["hydropump", "focusblast", "icepunch", "rest", "sleeptalk", "scald", "circlethrow", "raindance"],
		randomDoubleBattleMoves: ["bellydrum", "encore", "waterfall", "protect", "icepunch", "earthquake", "brickbreak", "rockslide"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	politoed: {
		randomBattleMoves: ["scald", "toxic", "encore", "perishsong", "protect", "hypnosis", "rest"],
		randomDoubleBattleMoves: ["scald", "hypnosis", "icywind", "encore", "helpinghand", "protect", "icebeam", "focusblast", "hydropump", "hiddenpowergrass"],
		tier: "(PU)",
		doublesTier: "DOU",
	},
	abra: {
		tier: "LC",
	},
	kadabra: {
		tier: "NFE",
	},
	alakazam: {
		randomBattleMoves: ["psyshock", "psychic", "focusblast", "shadowball", "hiddenpowerice", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["protect", "psychic", "psyshock", "focusblast", "shadowball", "encore", "substitute", "dazzlinggleam"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	alakazammega: {
		randomBattleMoves: ["calmmind", "psyshock", "focusblast", "shadowball", "encore", "substitute"],
		randomDoubleBattleMoves: ["protect", "psychic", "psyshock", "focusblast", "shadowball", "encore", "substitute", "dazzlinggleam"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	machop: {
		tier: "LC",
	},
	machoke: {
		tier: "NFE",
	},
	machamp: {
		randomBattleMoves: ["dynamicpunch", "icepunch", "stoneedge", "bulletpunch", "knockoff", "substitute"],
		randomDoubleBattleMoves: ["dynamicpunch", "protect", "icepunch", "stoneedge", "rockslide", "bulletpunch", "knockoff", "wideguard"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	bellsprout: {
		tier: "LC",
	},
	weepinbell: {
		tier: "NFE",
	},
	victreebel: {
		randomBattleMoves: ["sleeppowder", "sludgebomb", "gigadrain", "hiddenpowerfire", "suckerpunch", "swordsdance", "powerwhip", "knockoff"],
		randomDoubleBattleMoves: ["sleeppowder", "sunnyday", "growth", "solarbeam", "sludgebomb", "weatherball", "suckerpunch", "powerwhip", "knockoff", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	tentacool: {
		tier: "LC",
	},
	tentacruel: {
		randomBattleMoves: ["toxicspikes", "rapidspin", "scald", "sludgebomb", "acidspray", "knockoff"],
		randomDoubleBattleMoves: ["muddywater", "scald", "sludgebomb", "acidspray", "icebeam", "knockoff", "gigadrain", "protect", "dazzlinggleam"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	geodude: {
		tier: "LC",
	},
	geodudealola: {
		tier: "LC",
	},
	graveler: {
		tier: "NFE",
	},
	graveleralola: {
		tier: "NFE",
	},
	golem: {
		randomBattleMoves: ["stealthrock", "earthquake", "explosion", "suckerpunch", "toxic", "rockblast"],
		randomDoubleBattleMoves: ["rockslide", "earthquake", "stoneedge", "suckerpunch", "hammerarm", "firepunch", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	golemalola: {
		randomBattleMoves: ["stealthrock", "stoneedge", "return", "thunderpunch", "earthquake", "toxic"],
		randomDoubleBattleMoves: ["doubleedge", "stoneedge", "rockslide", "earthquake", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	ponyta: {
		tier: "LC",
	},
	rapidash: {
		randomBattleMoves: ["flareblitz", "wildcharge", "morningsun", "highhorsepower", "willowisp"],
		randomDoubleBattleMoves: ["flareblitz", "wildcharge", "protect", "hypnosis", "flamecharge", "megahorn", "drillrun", "willowisp"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	slowpoke: {
		tier: "LC",
	},
	slowbro: {
		randomBattleMoves: ["scald", "toxic", "thunderwave", "psyshock", "fireblast", "icebeam", "slackoff"],
		randomDoubleBattleMoves: ["scald", "fireblast", "icebeam", "psychic", "grassknot", "thunderwave", "slackoff", "trickroom", "protect", "psyshock"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	slowbromega: {
		randomBattleMoves: ["calmmind", "scald", "psyshock", "slackoff", "fireblast", "icebeam"],
		randomDoubleBattleMoves: ["scald", "fireblast", "icebeam", "psychic", "thunderwave", "slackoff", "trickroom", "protect", "psyshock"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	slowking: {
		randomBattleMoves: ["scald", "fireblast", "icebeam", "psychic", "grassknot", "thunderwave", "toxic", "slackoff", "trickroom", "nastyplot", "dragontail", "psyshock"],
		randomDoubleBattleMoves: ["scald", "fireblast", "icebeam", "psychic", "grassknot", "thunderwave", "slackoff", "trickroom", "protect", "psyshock"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	magnemite: {
		tier: "LC",
	},
	magneton: {
		tier: "UU",
		doublesTier: "NFE",
	},
	magnezone: {
		randomBattleMoves: ["thunderbolt", "substitute", "flashcannon", "hiddenpowerfire", "voltswitch"],
		randomDoubleBattleMoves: ["thunderbolt", "substitute", "flashcannon", "hiddenpowerice", "voltswitch", "protect", "electroweb", "discharge", "hiddenpowerfire"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	farfetchd: {
		randomBattleMoves: ["bravebird", "swordsdance", "return", "leafblade", "roost", "knockoff"],
		randomDoubleBattleMoves: ["bravebird", "swordsdance", "return", "leafblade", "protect", "knockoff"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	doduo: {
		tier: "LC",
	},
	dodrio: {
		randomBattleMoves: ["bravebird", "return", "swordsdance", "roost", "quickattack", "knockoff", "jumpkick"],
		randomDoubleBattleMoves: ["bravebird", "return", "doubleedge", "quickattack", "knockoff", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	seel: {
		tier: "LC",
	},
	dewgong: {
		randomBattleMoves: ["surf", "icebeam", "perishsong", "encore", "toxic", "protect"],
		randomDoubleBattleMoves: ["surf", "icebeam", "protect", "perishsong", "fakeout", "encore", "toxic"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	grimer: {
		tier: "LC",
	},
	grimeralola: {
		tier: "LC",
	},
	muk: {
		randomBattleMoves: ["curse", "gunkshot", "poisonjab", "shadowsneak", "icepunch", "firepunch", "memento"],
		randomDoubleBattleMoves: ["gunkshot", "poisonjab", "shadowsneak", "protect", "icepunch", "firepunch", "brickbreak"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	mukalola: {
		randomBattleMoves: ["curse", "gunkshot", "knockoff", "poisonjab", "shadowsneak", "pursuit", "icepunch", "firepunch"],
		randomDoubleBattleMoves: ["gunkshot", "knockoff", "stoneedge", "snarl", "protect", "poisonjab", "shadowsneak"],
		tier: "UU",
		doublesTier: "DUU",
	},
	shellder: {
		tier: "LC",
	},
	cloyster: {
		randomBattleMoves: ["shellsmash", "iciclespear", "hydropump", "rockblast", "iceshard", "spikes", "rapidspin"],
		randomDoubleBattleMoves: ["shellsmash", "hydropump", "liquidation", "rockblast", "iciclespear", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	gastly: {
		tier: "LC",
	},
	haunter: {
		tier: "PU",
		doublesTier: "NFE",
	},
	gengar: {
		randomBattleMoves: ["shadowball", "sludgewave", "focusblast", "substitute", "disable", "painsplit", "willowisp"],
		randomDoubleBattleMoves: ["shadowball", "sludgebomb", "focusblast", "substitute", "disable", "taunt", "hypnosis", "willowisp", "dazzlinggleam", "protect"],
		tier: "UU",
		doublesTier: "DUU",
	},
	gengarmega: {
		randomBattleMoves: ["shadowball", "sludgewave", "focusblast", "taunt", "destinybond", "disable", "perishsong", "protect"],
		randomDoubleBattleMoves: ["shadowball", "sludgebomb", "focusblast", "substitute", "disable", "taunt", "hypnosis", "willowisp", "dazzlinggleam", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	onix: {
		tier: "LC",
	},
	steelix: {
		randomBattleMoves: ["stealthrock", "earthquake", "ironhead", "roar", "toxic", "rockslide"],
		randomDoubleBattleMoves: ["stealthrock", "earthquake", "ironhead", "rockslide", "protect", "explosion", "wideguard"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	steelixmega: {
		randomBattleMoves: ["stealthrock", "earthquake", "heavyslam", "roar", "toxic", "dragontail"],
		randomDoubleBattleMoves: ["stealthrock", "earthquake", "heavyslam", "rockslide", "protect", "explosion"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	drowzee: {
		tier: "LC",
	},
	hypno: {
		randomBattleMoves: ["psychic", "seismictoss", "foulplay", "wish", "protect", "thunderwave", "toxic"],
		randomDoubleBattleMoves: ["psychic", "seismictoss", "thunderwave", "wish", "protect", "hypnosis", "trickroom", "dazzlinggleam", "foulplay"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	krabby: {
		tier: "LC",
	},
	kingler: {
		randomBattleMoves: ["liquidation", "xscissor", "rockslide", "swordsdance", "agility", "superpower", "knockoff"],
		randomDoubleBattleMoves: ["liquidation", "xscissor", "rockslide", "substitute", "superpower", "knockoff", "protect", "wideguard"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	voltorb: {
		tier: "LC",
	},
	electrode: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "taunt", "foulplay", "hiddenpowergrass", "signalbeam"],
		randomDoubleBattleMoves: ["voltswitch", "discharge", "taunt", "foulplay", "hiddenpowerice", "protect", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	exeggcute: {
		tier: "LC",
	},
	exeggutor: {
		randomBattleMoves: ["substitute", "leechseed", "gigadrain", "psychic", "sleeppowder", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["substitute", "leechseed", "gigadrain", "psychic", "sleeppowder", "hiddenpowerfire", "protect", "trickroom", "psyshock"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	exeggutoralola: {
		randomBattleMoves: ["dracometeor", "leafstorm", "flamethrower", "gigadrain", "trickroom"],
		randomDoubleBattleMoves: ["dracometeor", "leafstorm", "protect", "flamethrower", "trickroom", "woodhammer", "dragonhammer"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	cubone: {
		tier: "LC",
	},
	marowak: {
		randomBattleMoves: ["bonemerang", "earthquake", "knockoff", "doubleedge", "stoneedge", "stealthrock", "substitute"],
		randomDoubleBattleMoves: ["substitute", "bonemerang", "doubleedge", "rockslide", "firepunch", "earthquake", "protect", "swordsdance"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	marowakalola: {
		randomBattleMoves: ["flamecharge", "shadowbone", "bonemerang", "willowisp", "stoneedge", "flareblitz", "substitute"],
		randomDoubleBattleMoves: ["shadowbone", "bonemerang", "willowisp", "stoneedge", "flareblitz", "protect"],
		tier: "RU",
		doublesTier: "DUU",
	},
	marowakalolatotem: {
		tier: "RU",
		doublesTier: "DUU",
	},
	tyrogue: {
		tier: "LC",
	},
	hitmonlee: {
		randomBattleMoves: ["highjumpkick", "knockoff", "stoneedge", "rapidspin", "machpunch", "poisonjab", "fakeout"],
		randomDoubleBattleMoves: ["knockoff", "rockslide", "machpunch", "fakeout", "highjumpkick", "earthquake", "blazekick", "wideguard", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	hitmonchan: {
		randomBattleMoves: ["bulkup", "drainpunch", "icepunch", "firepunch", "machpunch", "rapidspin"],
		randomDoubleBattleMoves: ["fakeout", "drainpunch", "icepunch", "firepunch", "machpunch", "earthquake", "rockslide", "protect", "thunderpunch"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	hitmontop: {
		randomBattleMoves: ["suckerpunch", "stoneedge", "rapidspin", "closecombat", "toxic"],
		randomDoubleBattleMoves: ["fakeout", "feint", "suckerpunch", "closecombat", "helpinghand", "machpunch", "wideguard"],
		tier: "NU",
		doublesTier: "DUU",
	},
	lickitung: {
		tier: "LC",
	},
	lickilicky: {
		randomBattleMoves: ["wish", "protect", "bodyslam", "knockoff", "dragontail", "healbell", "swordsdance", "explosion", "earthquake", "powerwhip"],
		randomDoubleBattleMoves: ["wish", "protect", "dragontail", "knockoff", "bodyslam", "rockslide", "powerwhip", "earthquake", "explosion"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	koffing: {
		tier: "LC",
	},
	weezing: {
		randomBattleMoves: ["painsplit", "sludgebomb", "willowisp", "fireblast", "protect", "toxicspikes"],
		randomDoubleBattleMoves: ["protect", "sludgebomb", "willowisp", "fireblast", "toxic", "painsplit", "thunderbolt", "explosion"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	rhyhorn: {
		tier: "LC",
	},
	rhydon: {
		tier: "NU",
		doublesTier: "NFE",
	},
	rhyperior: {
		randomBattleMoves: ["stoneedge", "earthquake", "icepunch", "megahorn", "stealthrock", "rockblast", "rockpolish", "dragontail"],
		randomDoubleBattleMoves: ["stoneedge", "earthquake", "hammerarm", "megahorn", "stealthrock", "rockslide", "icepunch", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	happiny: {
		tier: "LC",
	},
	chansey: {
		randomBattleMoves: ["softboiled", "healbell", "stealthrock", "thunderwave", "toxic", "seismictoss", "wish"],
		randomDoubleBattleMoves: ["aromatherapy", "toxic", "thunderwave", "helpinghand", "softboiled", "lightscreen", "seismictoss", "protect", "wish"],
		tier: "OU",
		doublesTier: "NFE",
	},
	blissey: {
		randomBattleMoves: ["toxic", "flamethrower", "seismictoss", "softboiled", "healbell", "protect", "thunderwave", "stealthrock"],
		randomDoubleBattleMoves: ["wish", "softboiled", "protect", "toxic", "aromatherapy", "seismictoss", "helpinghand", "thunderwave", "flamethrower", "icebeam"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	tangela: {
		tier: "PU",
		doublesTier: "LC Uber",
	},
	tangrowth: {
		randomBattleMoves: ["gigadrain", "leafstorm", "knockoff", "earthquake", "hiddenpowerfire", "rockslide", "sleeppowder", "synthesis"],
		randomDoubleBattleMoves: ["gigadrain", "sleeppowder", "hiddenpowerice", "leechseed", "knockoff", "ragepowder", "focusblast", "protect", "powerwhip", "earthquake"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	kangaskhan: {
		randomBattleMoves: ["return", "suckerpunch", "earthquake", "drainpunch", "crunch", "fakeout"],
		randomDoubleBattleMoves: ["fakeout", "return", "suckerpunch", "earthquake", "doubleedge", "drainpunch", "crunch", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	kangaskhanmega: {
		randomBattleMoves: ["fakeout", "seismictoss", "bodyslam", "suckerpunch", "crunch"],
		randomDoubleBattleMoves: ["fakeout", "return", "suckerpunch", "earthquake", "doubleedge", "poweruppunch", "drainpunch", "crunch", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	horsea: {
		tier: "LC",
	},
	seadra: {
		tier: "NFE",
	},
	kingdra: {
		randomBattleMoves: ["raindance", "hydropump", "dracometeor", "icebeam", "waterfall"],
		randomDoubleBattleMoves: ["hydropump", "icebeam", "raindance", "dracometeor", "dragonpulse", "muddywater", "protect"],
		tier: "NUBL",
		doublesTier: "DOU",
	},
	goldeen: {
		tier: "LC",
	},
	seaking: {
		randomBattleMoves: ["waterfall", "megahorn", "knockoff", "drillrun", "scald", "icebeam"],
		randomDoubleBattleMoves: ["waterfall", "surf", "megahorn", "knockoff", "drillrun", "icebeam", "icywind", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	staryu: {
		tier: "LC",
	},
	starmie: {
		randomBattleMoves: ["thunderbolt", "icebeam", "rapidspin", "recover", "psyshock", "scald", "hydropump"],
		randomDoubleBattleMoves: ["surf", "thunderbolt", "icebeam", "protect", "recover", "psychic", "psyshock", "scald", "hydropump"],
		tier: "UU",
		doublesTier: "DUU",
	},
	mimejr: {
		tier: "LC",
	},
	mrmime: {
		randomBattleMoves: ["nastyplot", "psyshock", "dazzlinggleam", "shadowball", "focusblast", "healingwish", "encore"],
		randomDoubleBattleMoves: ["fakeout", "thunderwave", "hiddenpowerfighting", "psychic", "thunderbolt", "encore", "icywind", "protect", "wideguard", "dazzlinggleam", "followme"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	scyther: {
		randomBattleMoves: ["swordsdance", "roost", "bugbite", "quickattack", "brickbreak", "aerialace", "uturn", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "protect", "bugbite", "quickattack", "brickbreak", "aerialace", "feint", "uturn", "knockoff"],
		tier: "PU",
		doublesTier: "LC Uber",
	},
	scizor: {
		randomBattleMoves: ["swordsdance", "bulletpunch", "bugbite", "superpower", "uturn", "pursuit", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "roost", "bulletpunch", "bugbite", "superpower", "uturn", "protect", "feint", "knockoff"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	scizormega: {
		randomBattleMoves: ["swordsdance", "roost", "bulletpunch", "bugbite", "superpower", "uturn", "defog", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "roost", "bulletpunch", "bugbite", "superpower", "uturn", "protect", "feint", "knockoff"],
		tier: "OU",
		doublesTier: "DUU",
	},
	smoochum: {
		tier: "LC",
	},
	jynx: {
		randomBattleMoves: ["icebeam", "psychic", "focusblast", "trick", "nastyplot", "lovelykiss", "substitute", "psyshock"],
		randomDoubleBattleMoves: ["icebeam", "psychic", "hiddenpowerfighting", "shadowball", "protect", "lovelykiss", "substitute", "psyshock"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	elekid: {
		tier: "LC",
	},
	electabuzz: {
		tier: "NFE",
	},
	electivire: {
		randomBattleMoves: ["wildcharge", "crosschop", "icepunch", "flamethrower", "earthquake", "voltswitch"],
		randomDoubleBattleMoves: ["wildcharge", "crosschop", "icepunch", "substitute", "flamethrower", "earthquake", "protect", "followme"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	magby: {
		tier: "LC",
	},
	magmar: {
		tier: "NFE",
	},
	magmortar: {
		randomBattleMoves: ["fireblast", "focusblast", "hiddenpowergrass", "hiddenpowerice", "thunderbolt", "earthquake", "substitute"],
		randomDoubleBattleMoves: ["fireblast", "taunt", "focusblast", "hiddenpowergrass", "hiddenpowerice", "thunderbolt", "heatwave", "willowisp", "protect", "followme"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	pinsir: {
		randomBattleMoves: ["earthquake", "xscissor", "closecombat", "stoneedge", "stealthrock", "knockoff"],
		randomDoubleBattleMoves: ["protect", "swordsdance", "xscissor", "earthquake", "closecombat", "substitute", "rockslide"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pinsirmega: {
		randomBattleMoves: ["swordsdance", "earthquake", "closecombat", "quickattack", "return"],
		randomDoubleBattleMoves: ["feint", "protect", "swordsdance", "earthquake", "closecombat", "substitute", "quickattack", "return", "rockslide"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	tauros: {
		randomBattleMoves: ["bodyslam", "earthquake", "zenheadbutt", "rockslide", "doubleedge"],
		randomDoubleBattleMoves: ["return", "earthquake", "zenheadbutt", "rockslide", "stoneedge", "protect", "doubleedge"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	magikarp: {
		tier: "LC",
	},
	gyarados: {
		randomBattleMoves: ["dragondance", "waterfall", "earthquake", "bounce", "dragontail", "stoneedge", "substitute"],
		randomDoubleBattleMoves: ["dragondance", "waterfall", "earthquake", "bounce", "taunt", "protect", "thunderwave", "stoneedge", "substitute", "icefang"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	gyaradosmega: {
		randomBattleMoves: ["dragondance", "waterfall", "earthquake", "substitute", "icefang", "crunch"],
		randomDoubleBattleMoves: ["dragondance", "waterfall", "earthquake", "bounce", "taunt", "protect", "thunderwave", "stoneedge", "substitute", "icefang", "crunch"],
		tier: "OU",
		doublesTier: "DUU",
	},
	lapras: {
		randomBattleMoves: ["icebeam", "thunderbolt", "healbell", "toxic", "hydropump", "substitute"],
		randomDoubleBattleMoves: ["icebeam", "thunderbolt", "hydropump", "surf", "substitute", "protect", "iceshard", "icywind"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	ditto: {
		randomBattleMoves: ["transform"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	eevee: {
		tier: "LC",
	},
	vaporeon: {
		randomBattleMoves: ["wish", "protect", "scald", "roar", "icebeam", "healbell"],
		randomDoubleBattleMoves: ["helpinghand", "wish", "protect", "scald", "muddywater", "icebeam", "toxic", "hydropump"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	jolteon: {
		randomBattleMoves: ["thunderbolt", "voltswitch", "hiddenpowerice", "shadowball", "signalbeam"],
		randomDoubleBattleMoves: ["thunderbolt", "voltswitch", "hiddenpowergrass", "hiddenpowerice", "helpinghand", "protect", "substitute", "signalbeam"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	flareon: {
		randomBattleMoves: ["flamecharge", "facade", "flareblitz", "superpower", "quickattack"],
		randomDoubleBattleMoves: ["flamecharge", "facade", "flareblitz", "superpower", "wish", "protect", "helpinghand"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	espeon: {
		randomBattleMoves: ["psychic", "psyshock", "substitute", "shadowball", "calmmind", "morningsun", "dazzlinggleam"],
		randomDoubleBattleMoves: ["psychic", "psyshock", "substitute", "wish", "shadowball", "hiddenpowerfighting", "helpinghand", "protect", "dazzlinggleam"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	umbreon: {
		randomBattleMoves: ["wish", "protect", "healbell", "toxic", "foulplay"],
		randomDoubleBattleMoves: ["moonlight", "wish", "protect", "healbell", "snarl", "foulplay", "helpinghand"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	leafeon: {
		randomBattleMoves: ["swordsdance", "leafblade", "healbell", "xscissor", "synthesis", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "leafblade", "substitute", "xscissor", "protect", "helpinghand", "knockoff"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	glaceon: {
		randomBattleMoves: ["icebeam", "hiddenpowerground", "shadowball", "healbell", "wish", "protect", "toxic"],
		randomDoubleBattleMoves: ["icebeam", "hiddenpowerground", "shadowball", "wish", "protect", "healbell", "helpinghand"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	porygon: {
		tier: "LC Uber",
	},
	porygon2: {
		randomBattleMoves: ["triattack", "icebeam", "discharge", "recover", "toxic"],
		randomDoubleBattleMoves: ["triattack", "icebeam", "discharge", "shadowball", "thunderbolt", "protect", "recover"],
		tier: "RU",
		doublesTier: "DOU",
	},
	porygonz: {
		randomBattleMoves: ["triattack", "shadowball", "icebeam", "thunderbolt", "trick", "nastyplot"],
		randomDoubleBattleMoves: ["protect", "triattack", "darkpulse", "hiddenpowerfighting", "icebeam", "thunderbolt", "agility", "trick", "nastyplot"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	omanyte: {
		tier: "LC",
	},
	omastar: {
		randomBattleMoves: ["shellsmash", "scald", "icebeam", "earthpower", "spikes", "stealthrock", "hydropump"],
		randomDoubleBattleMoves: ["shellsmash", "muddywater", "icebeam", "earthpower", "hiddenpowerelectric", "protect", "hydropump"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	kabuto: {
		tier: "LC",
	},
	kabutops: {
		randomBattleMoves: ["aquajet", "stoneedge", "rapidspin", "swordsdance", "liquidation", "knockoff"],
		randomDoubleBattleMoves: ["aquajet", "stoneedge", "protect", "rockslide", "swordsdance", "liquidation", "superpower", "knockoff"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	aerodactyl: {
		randomBattleMoves: ["stealthrock", "taunt", "defog", "roost", "stoneedge", "earthquake", "doubleedge", "pursuit"],
		randomDoubleBattleMoves: ["wideguard", "taunt", "stoneedge", "rockslide", "earthquake", "aquatail", "protect", "icefang", "skydrop", "tailwind"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	aerodactylmega: {
		randomBattleMoves: ["honeclaws", "stoneedge", "aerialace", "aquatail", "earthquake", "firefang", "roost"],
		randomDoubleBattleMoves: ["wideguard", "taunt", "stoneedge", "rockslide", "earthquake", "ironhead", "aerialace", "protect", "icefang", "skydrop", "tailwind"],
		tier: "UU",
		doublesTier: "DUU",
	},
	munchlax: {
		tier: "LC",
	},
	snorlax: {
		randomBattleMoves: ["rest", "curse", "sleeptalk", "bodyslam", "earthquake", "return", "firepunch", "crunch", "pursuit", "whirlwind"],
		randomDoubleBattleMoves: ["curse", "protect", "bodyslam", "earthquake", "return", "firepunch", "icepunch", "crunch", "selfdestruct"],
		tier: "RU",
		doublesTier: "DUber",
	},
	articuno: {
		randomBattleMoves: ["icebeam", "roost", "freezedry", "toxic", "substitute", "hurricane"],
		randomDoubleBattleMoves: ["freezedry", "roost", "protect", "substitute", "hurricane", "tailwind"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	zapdos: {
		randomBattleMoves: ["thunderbolt", "heatwave", "hiddenpowerice", "roost", "toxic", "uturn", "defog"],
		randomDoubleBattleMoves: ["thunderbolt", "heatwave", "hiddenpowergrass", "hiddenpowerice", "tailwind", "protect", "discharge"],
		tier: "OU",
		doublesTier: "DOU",
	},
	moltres: {
		randomBattleMoves: ["fireblast", "roost", "substitute", "toxic", "willowisp", "hurricane"],
		randomDoubleBattleMoves: ["fireblast", "airslash", "roost", "substitute", "protect", "uturn", "willowisp", "hurricane", "heatwave", "tailwind"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	dratini: {
		tier: "LC",
	},
	dragonair: {
		tier: "NFE",
	},
	dragonite: {
		randomBattleMoves: ["dragondance", "outrage", "fly", "firepunch", "extremespeed", "earthquake", "roost"],
		randomDoubleBattleMoves: ["dragondance", "firepunch", "extremespeed", "dragonclaw", "earthquake", "roost", "substitute", "superpower", "dracometeor", "protect", "skydrop"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	mewtwo: {
		randomBattleMoves: ["psystrike", "aurasphere", "fireblast", "icebeam", "calmmind", "recover"],
		randomDoubleBattleMoves: ["psystrike", "aurasphere", "fireblast", "icebeam", "calmmind", "substitute", "recover", "thunderbolt", "willowisp", "taunt", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	mewtwomegax: {
		randomBattleMoves: ["bulkup", "drainpunch", "zenheadbutt", "stoneedge", "taunt", "icebeam"],
		randomDoubleBattleMoves: ["bulkup", "drainpunch", "earthquake", "taunt", "stoneedge", "zenheadbutt", "icebeam"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	mewtwomegay: {
		randomBattleMoves: ["psystrike", "aurasphere", "shadowball", "fireblast", "icebeam", "calmmind", "recover", "willowisp", "taunt"],
		randomDoubleBattleMoves: ["psystrike", "aurasphere", "shadowball", "fireblast", "icebeam", "calmmind", "recover", "willowisp", "taunt"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	mew: {
		randomBattleMoves: ["defog", "roost", "willowisp", "knockoff", "taunt", "icebeam", "earthpower", "aurasphere", "stealthrock", "nastyplot", "psyshock"],
		randomDoubleBattleMoves: ["taunt", "willowisp", "transform", "roost", "psyshock", "nastyplot", "aurasphere", "fireblast", "icebeam", "thunderbolt", "protect", "fakeout", "helpinghand", "tailwind"],
		tier: "UU",
		doublesTier: "DOU",
	},
	chikorita: {
		tier: "LC",
	},
	bayleef: {
		tier: "NFE",
	},
	meganium: {
		randomBattleMoves: ["reflect", "lightscreen", "aromatherapy", "leechseed", "toxic", "gigadrain", "synthesis", "dragontail"],
		randomDoubleBattleMoves: ["reflect", "lightscreen", "leechseed", "leafstorm", "gigadrain", "synthesis", "dragontail", "healpulse", "toxic", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	cyndaquil: {
		tier: "LC",
	},
	quilava: {
		tier: "NFE",
	},
	typhlosion: {
		randomBattleMoves: ["eruption", "fireblast", "hiddenpowergrass", "extrasensory", "focusblast"],
		randomDoubleBattleMoves: ["eruption", "fireblast", "hiddenpowergrass", "extrasensory", "focusblast", "heatwave", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	totodile: {
		tier: "LC",
	},
	croconaw: {
		tier: "NFE",
	},
	feraligatr: {
		randomBattleMoves: ["aquajet", "liquidation", "crunch", "icepunch", "dragondance", "swordsdance", "earthquake"],
		randomDoubleBattleMoves: ["aquajet", "liquidation", "crunch", "icepunch", "dragondance", "swordsdance", "earthquake", "protect"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	sentret: {
		tier: "LC",
	},
	furret: {
		randomBattleMoves: ["uturn", "trick", "aquatail", "firepunch", "knockoff", "doubleedge"],
		randomDoubleBattleMoves: ["uturn", "suckerpunch", "icepunch", "firepunch", "knockoff", "doubleedge", "superfang", "followme", "helpinghand", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	hoothoot: {
		tier: "LC",
	},
	noctowl: {
		randomBattleMoves: ["roost", "whirlwind", "nightshade", "toxic", "defog", "hurricane", "heatwave"],
		randomDoubleBattleMoves: ["roost", "tailwind", "airslash", "hypervoice", "heatwave", "protect", "hypnosis"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	ledyba: {
		tier: "LC",
	},
	ledian: {
		randomBattleMoves: ["roost", "lightscreen", "encore", "reflect", "knockoff", "toxic", "uturn"],
		randomDoubleBattleMoves: ["protect", "lightscreen", "encore", "reflect", "knockoff", "bugbuzz", "uturn", "tailwind"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	spinarak: {
		tier: "LC",
	},
	ariados: {
		randomBattleMoves: ["megahorn", "toxicspikes", "poisonjab", "suckerpunch", "stickyweb"],
		randomDoubleBattleMoves: ["protect", "megahorn", "stringshot", "poisonjab", "stickyweb", "ragepowder"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	chinchou: {
		tier: "LC",
	},
	lanturn: {
		randomBattleMoves: ["voltswitch", "hiddenpowergrass", "hydropump", "icebeam", "thunderwave", "scald", "thunderbolt", "healbell", "toxic"],
		randomDoubleBattleMoves: ["thunderbolt", "hiddenpowergrass", "hydropump", "icebeam", "thunderwave", "scald", "discharge", "protect", "surf"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	togepi: {
		tier: "LC",
	},
	togetic: {
		tier: "NFE",
	},
	togekiss: {
		randomBattleMoves: ["roost", "thunderwave", "nastyplot", "airslash", "aurasphere", "healbell", "defog"],
		randomDoubleBattleMoves: ["roost", "thunderwave", "nastyplot", "airslash", "followme", "dazzlinggleam", "tailwind", "protect"],
		tier: "UU",
		doublesTier: "DUU",
	},
	natu: {
		tier: "LC",
	},
	xatu: {
		randomBattleMoves: ["thunderwave", "toxic", "roost", "psychic", "uturn", "reflect", "calmmind", "heatwave"],
		randomDoubleBattleMoves: ["thunderwave", "tailwind", "roost", "psychic", "uturn", "reflect", "lightscreen", "grassknot", "heatwave", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	mareep: {
		tier: "LC",
	},
	flaaffy: {
		tier: "NFE",
	},
	ampharos: {
		randomBattleMoves: ["voltswitch", "reflect", "lightscreen", "focusblast", "thunderbolt", "toxic", "healbell", "hiddenpowerice"],
		randomDoubleBattleMoves: ["focusblast", "hiddenpowerice", "hiddenpowergrass", "thunderbolt", "discharge", "dragonpulse", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	ampharosmega: {
		randomBattleMoves: ["voltswitch", "focusblast", "agility", "thunderbolt", "healbell", "dragonpulse"],
		randomDoubleBattleMoves: ["focusblast", "hiddenpowerice", "hiddenpowergrass", "thunderbolt", "discharge", "dragonpulse", "protect"],
		tier: "RU",
		doublesTier: "DUU",
	},
	azurill: {
		tier: "LC",
	},
	marill: {
		tier: "NFE",
	},
	azumarill: {
		randomBattleMoves: ["liquidation", "aquajet", "playrough", "superpower", "bellydrum", "knockoff"],
		randomDoubleBattleMoves: ["waterfall", "aquajet", "playrough", "superpower", "bellydrum", "knockoff", "protect"],
		tier: "OU",
		doublesTier: "DUU",
	},
	bonsly: {
		tier: "LC",
	},
	sudowoodo: {
		randomBattleMoves: ["headsmash", "earthquake", "suckerpunch", "woodhammer", "toxic", "stealthrock"],
		randomDoubleBattleMoves: ["headsmash", "earthquake", "suckerpunch", "woodhammer", "explosion", "stealthrock", "rockslide", "helpinghand", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	hoppip: {
		tier: "LC",
	},
	skiploom: {
		tier: "NFE",
	},
	jumpluff: {
		randomBattleMoves: ["swordsdance", "sleeppowder", "uturn", "encore", "toxic", "acrobatics", "leechseed", "seedbomb", "substitute", "strengthsap"],
		randomDoubleBattleMoves: ["encore", "sleeppowder", "uturn", "helpinghand", "leechseed", "gigadrain", "ragepowder", "protect", "strengthsap"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	aipom: {
		tier: "LC Uber",
	},
	ambipom: {
		randomBattleMoves: ["fakeout", "return", "knockoff", "uturn", "switcheroo", "seedbomb", "lowkick"],
		randomDoubleBattleMoves: ["fakeout", "return", "knockoff", "uturn", "doublehit", "icepunch", "lowkick", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	sunkern: {
		tier: "LC",
	},
	sunflora: {
		randomBattleMoves: ["sunnyday", "gigadrain", "solarbeam", "hiddenpowerfire", "earthpower"],
		randomDoubleBattleMoves: ["sunnyday", "gigadrain", "solarbeam", "hiddenpowerfire", "hiddenpowerice", "earthpower", "protect", "encore"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	yanma: {
		tier: "LC Uber",
	},
	yanmega: {
		randomBattleMoves: ["bugbuzz", "airslash", "uturn", "protect", "gigadrain"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	wooper: {
		tier: "LC",
	},
	quagsire: {
		randomBattleMoves: ["recover", "earthquake", "scald", "toxic", "encore", "icebeam"],
		randomDoubleBattleMoves: ["icywind", "earthquake", "waterfall", "scald", "rockslide", "curse", "yawn", "icepunch", "protect"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	murkrow: {
		tier: "LC Uber",
	},
	honchkrow: {
		randomBattleMoves: ["superpower", "suckerpunch", "bravebird", "roost", "heatwave", "pursuit"],
		randomDoubleBattleMoves: ["superpower", "suckerpunch", "bravebird", "roost", "heatwave", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	misdreavus: {
		tier: "LC Uber",
	},
	mismagius: {
		randomBattleMoves: ["nastyplot", "substitute", "willowisp", "shadowball", "thunderbolt", "dazzlinggleam", "taunt", "painsplit", "destinybond"],
		randomDoubleBattleMoves: ["nastyplot", "substitute", "willowisp", "shadowball", "thunderbolt", "dazzlinggleam", "taunt", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	unown: {
		randomBattleMoves: ["hiddenpowerpsychic"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	wynaut: {
		tier: "LC",
	},
	wobbuffet: {
		randomBattleMoves: ["counter", "mirrorcoat", "encore", "destinybond", "safeguard"],
		randomDoubleBattleMoves: ["counter", "mirrorcoat", "encore", "destinybond", "safeguard"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	girafarig: {
		randomBattleMoves: ["psychic", "psyshock", "thunderbolt", "nastyplot", "substitute", "hypervoice"],
		randomDoubleBattleMoves: ["psychic", "psyshock", "thunderbolt", "nastyplot", "protect", "agility", "hypervoice"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pineco: {
		tier: "LC",
	},
	forretress: {
		randomBattleMoves: ["rapidspin", "toxic", "spikes", "voltswitch", "stealthrock", "gyroball"],
		randomDoubleBattleMoves: ["rockslide", "drillrun", "toxic", "voltswitch", "stealthrock", "gyroball", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	dunsparce: {
		randomBattleMoves: ["bodyslam", "rockslide", "bite", "coil", "glare", "headbutt", "roost"],
		randomDoubleBattleMoves: ["coil", "rockslide", "bite", "headbutt", "glare", "bodyslam", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	gligar: {
		randomBattleMoves: ["stealthrock", "toxic", "roost", "defog", "earthquake", "uturn", "knockoff"],
		tier: "UU",
		doublesTier: "LC Uber",
	},
	gliscor: {
		randomBattleMoves: ["roost", "taunt", "earthquake", "protect", "toxic", "stealthrock", "knockoff", "uturn"],
		randomDoubleBattleMoves: ["tailwind", "substitute", "taunt", "earthquake", "protect", "stoneedge", "knockoff"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	snubbull: {
		tier: "LC",
	},
	granbull: {
		randomBattleMoves: ["thunderwave", "playrough", "crunch", "earthquake", "healbell"],
		randomDoubleBattleMoves: ["thunderwave", "playrough", "crunch", "earthquake", "snarl", "rockslide", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	qwilfish: {
		randomBattleMoves: ["toxicspikes", "liquidation", "spikes", "painsplit", "thunderwave", "taunt", "destinybond"],
		randomDoubleBattleMoves: ["poisonjab", "liquidation", "swordsdance", "protect", "thunderwave", "taunt", "destinybond"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	shuckle: {
		randomBattleMoves: ["toxic", "encore", "stealthrock", "knockoff", "stickyweb", "infestation"],
		randomDoubleBattleMoves: ["encore", "stealthrock", "knockoff", "stickyweb", "guardsplit", "powersplit", "toxic", "helpinghand"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	heracross: {
		randomBattleMoves: ["closecombat", "megahorn", "stoneedge", "swordsdance", "knockoff", "earthquake"],
		randomDoubleBattleMoves: ["closecombat", "megahorn", "stoneedge", "swordsdance", "knockoff", "earthquake", "protect"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	heracrossmega: {
		randomBattleMoves: ["closecombat", "pinmissile", "rockblast", "swordsdance", "bulletseed", "substitute"],
		randomDoubleBattleMoves: ["closecombat", "pinmissile", "rockblast", "swordsdance", "bulletseed", "knockoff", "earthquake", "protect"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	sneasel: {
		tier: "NU",
		doublesTier: "LC Uber",
	},
	weavile: {
		randomBattleMoves: ["iceshard", "iciclecrash", "knockoff", "pursuit", "swordsdance", "lowkick"],
		randomDoubleBattleMoves: ["iceshard", "iciclecrash", "knockoff", "fakeout", "swordsdance", "lowkick", "taunt", "protect", "feint"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	teddiursa: {
		tier: "LC",
	},
	ursaring: {
		randomBattleMoves: ["swordsdance", "facade", "closecombat", "crunch", "protect"],
		randomDoubleBattleMoves: ["swordsdance", "facade", "closecombat", "earthquake", "crunch", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	slugma: {
		tier: "LC",
	},
	magcargo: {
		randomBattleMoves: ["recover", "lavaplume", "toxic", "hiddenpowergrass", "stealthrock", "fireblast", "earthpower", "shellsmash", "ancientpower"],
		randomDoubleBattleMoves: ["protect", "heatwave", "willowisp", "shellsmash", "hiddenpowergrass", "ancientpower", "stealthrock", "fireblast", "earthpower"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	swinub: {
		tier: "LC",
	},
	piloswine: {
		tier: "NU",
		doublesTier: "NFE",
	},
	mamoswine: {
		randomBattleMoves: ["iceshard", "earthquake", "endeavor", "iciclecrash", "stealthrock", "superpower", "knockoff"],
		randomDoubleBattleMoves: ["iceshard", "earthquake", "rockslide", "iciclecrash", "protect", "superpower", "knockoff"],
		tier: "UU",
		doublesTier: "DUU",
	},
	corsola: {
		randomBattleMoves: ["recover", "toxic", "powergem", "scald", "stealthrock"],
		randomDoubleBattleMoves: ["protect", "icywind", "powergem", "scald", "stealthrock", "earthpower", "icebeam"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	remoraid: {
		tier: "LC",
	},
	octillery: {
		randomBattleMoves: ["hydropump", "fireblast", "icebeam", "energyball", "rockblast", "gunkshot", "scald"],
		randomDoubleBattleMoves: ["hydropump", "surf", "fireblast", "icebeam", "energyball", "chargebeam", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	delibird: {
		randomBattleMoves: ["spikes", "rapidspin", "icywind", "freezedry", "destinybond"],
		randomDoubleBattleMoves: ["fakeout", "iceshard", "icepunch", "aerialace", "brickbreak", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	mantyke: {
		tier: "LC",
	},
	mantine: {
		randomBattleMoves: ["scald", "airslash", "roost", "toxic", "defog"],
		randomDoubleBattleMoves: ["raindance", "scald", "airslash", "icebeam", "tailwind", "wideguard", "helpinghand", "protect", "surf"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	skarmory: {
		randomBattleMoves: ["whirlwind", "bravebird", "roost", "spikes", "stealthrock", "defog"],
		randomDoubleBattleMoves: ["skydrop", "bravebird", "tailwind", "taunt", "feint", "protect", "ironhead"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	houndour: {
		tier: "LC",
	},
	houndoom: {
		randomBattleMoves: ["nastyplot", "darkpulse", "suckerpunch", "fireblast", "hiddenpowergrass"],
		randomDoubleBattleMoves: ["nastyplot", "darkpulse", "suckerpunch", "heatwave", "hiddenpowerfighting", "protect"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	houndoommega: {
		randomBattleMoves: ["nastyplot", "darkpulse", "taunt", "fireblast", "hiddenpowergrass"],
		randomDoubleBattleMoves: ["nastyplot", "darkpulse", "taunt", "heatwave", "hiddenpowergrass", "protect"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	phanpy: {
		tier: "LC",
	},
	donphan: {
		randomBattleMoves: ["stealthrock", "rapidspin", "iceshard", "earthquake", "knockoff", "stoneedge"],
		randomDoubleBattleMoves: ["stealthrock", "knockoff", "iceshard", "earthquake", "rockslide", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	stantler: {
		randomBattleMoves: ["doubleedge", "megahorn", "jumpkick", "earthquake", "suckerpunch"],
		randomDoubleBattleMoves: ["return", "megahorn", "jumpkick", "earthquake", "suckerpunch", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	smeargle: {
		randomBattleMoves: ["spore", "stealthrock", "destinybond", "whirlwind", "stickyweb"],
		randomDoubleBattleMoves: ["spore", "fakeout", "wideguard", "helpinghand", "followme", "tailwind", "kingsshield", "transform"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	miltank: {
		randomBattleMoves: ["milkdrink", "stealthrock", "bodyslam", "healbell", "curse", "earthquake", "toxic"],
		randomDoubleBattleMoves: ["protect", "helpinghand", "bodyslam", "milkdrink", "curse", "earthquake", "thunderwave"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	raikou: {
		randomBattleMoves: ["thunderbolt", "hiddenpowerice", "aurasphere", "calmmind", "substitute", "voltswitch", "extrasensory"],
		randomDoubleBattleMoves: ["thunderbolt", "hiddenpowerice", "extrasensory", "calmmind", "substitute", "snarl", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	entei: {
		randomBattleMoves: ["extremespeed", "flareblitz", "stompingtantrum", "stoneedge", "sacredfire"],
		randomDoubleBattleMoves: ["extremespeed", "flareblitz", "ironhead", "bulldoze", "stoneedge", "sacredfire", "protect"],
		tier: "RUBL",
		doublesTier: "DUU",
	},
	suicune: {
		randomBattleMoves: ["hydropump", "icebeam", "scald", "hiddenpowergrass", "rest", "sleeptalk", "calmmind"],
		randomDoubleBattleMoves: ["hydropump", "icebeam", "scald", "hiddenpowergrass", "snarl", "tailwind", "protect", "calmmind"],
		tier: "UU",
		doublesTier: "DOU",
	},
	larvitar: {
		tier: "LC",
	},
	pupitar: {
		tier: "NFE",
	},
	tyranitar: {
		randomBattleMoves: ["crunch", "stoneedge", "pursuit", "earthquake", "fireblast", "icebeam", "stealthrock"],
		randomDoubleBattleMoves: ["crunch", "stoneedge", "rockslide", "earthquake", "firepunch", "icepunch", "stealthrock", "protect"],
		tier: "OU",
		doublesTier: "DOU",
	},
	tyranitarmega: {
		randomBattleMoves: ["crunch", "stoneedge", "earthquake", "icepunch", "dragondance"],
		randomDoubleBattleMoves: ["crunch", "stoneedge", "earthquake", "icepunch", "dragondance", "rockslide", "protect"],
		tier: "OU",
		doublesTier: "DOU",
	},
	lugia: {
		randomBattleMoves: ["toxic", "roost", "substitute", "whirlwind", "aeroblast", "earthquake"],
		randomDoubleBattleMoves: ["aeroblast", "roost", "substitute", "tailwind", "icebeam", "psychic", "calmmind", "skydrop", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	hooh: {
		randomBattleMoves: ["substitute", "sacredfire", "bravebird", "earthquake", "roost", "toxic", "flamecharge"],
		randomDoubleBattleMoves: ["substitute", "sacredfire", "bravebird", "earthquake", "roost", "toxic", "tailwind", "skydrop", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	celebi: {
		randomBattleMoves: ["nastyplot", "psychic", "gigadrain", "recover", "earthpower", "hiddenpowerfire", "leafstorm", "uturn", "thunderwave"],
		randomDoubleBattleMoves: ["protect", "psychic", "gigadrain", "leechseed", "recover", "earthpower", "hiddenpowerfire", "nastyplot", "leafstorm", "uturn", "thunderwave"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	treecko: {
		tier: "LC",
	},
	grovyle: {
		tier: "NFE",
	},
	sceptile: {
		randomBattleMoves: ["gigadrain", "leafstorm", "hiddenpowerice", "focusblast", "hiddenpowerflying"],
		randomDoubleBattleMoves: ["gigadrain", "leafstorm", "hiddenpowerice", "focusblast", "hiddenpowerfire", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	sceptilemega: {
		randomBattleMoves: ["substitute", "gigadrain", "dragonpulse", "focusblast", "swordsdance", "outrage", "leafblade", "earthquake", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["substitute", "gigadrain", "leafstorm", "hiddenpowerice", "focusblast", "dragonpulse", "hiddenpowerfire", "protect"],
		tier: "RU",
		doublesTier: "DUU",
	},
	torchic: {
		tier: "LC",
	},
	combusken: {
		tier: "NFE",
	},
	blaziken: {
		randomBattleMoves: ["fireblast", "highjumpkick", "protect", "knockoff", "hiddenpowerice"],
		tier: "Uber",
		doublesTier: "(DUU)",
	},
	blazikenmega: {
		randomBattleMoves: ["flareblitz", "highjumpkick", "protect", "swordsdance", "stoneedge", "knockoff"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	mudkip: {
		tier: "LC",
	},
	marshtomp: {
		tier: "NFE",
	},
	swampert: {
		randomBattleMoves: ["stealthrock", "earthquake", "scald", "icebeam", "roar", "toxic", "protect"],
		randomDoubleBattleMoves: ["waterfall", "earthquake", "icebeam", "stealthrock", "wideguard", "scald", "rockslide", "muddywater", "protect", "icywind"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	swampertmega: {
		randomBattleMoves: ["raindance", "waterfall", "earthquake", "icepunch", "superpower"],
		randomDoubleBattleMoves: ["waterfall", "earthquake", "raindance", "icepunch", "superpower", "protect"],
		tier: "OU",
		doublesTier: "DOU",
	},
	poochyena: {
		tier: "LC",
	},
	mightyena: {
		randomBattleMoves: ["crunch", "suckerpunch", "playrough", "firefang", "irontail"],
		randomDoubleBattleMoves: ["suckerpunch", "crunch", "playrough", "firefang", "taunt", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	zigzagoon: {
		tier: "LC",
	},
	linoone: {
		randomBattleMoves: ["bellydrum", "extremespeed", "stompingtantrum", "shadowclaw"],
		randomDoubleBattleMoves: ["bellydrum", "extremespeed", "stompingtantrum", "protect", "shadowclaw"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	wurmple: {
		tier: "LC",
	},
	silcoon: {
		tier: "NFE",
	},
	beautifly: {
		randomBattleMoves: ["quiverdance", "bugbuzz", "psychic", "energyball", "hiddenpowerfighting"],
		randomDoubleBattleMoves: ["quiverdance", "bugbuzz", "gigadrain", "hiddenpowerrock", "aircutter", "tailwind", "stringshot", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	cascoon: {
		tier: "NFE",
	},
	dustox: {
		randomBattleMoves: ["roost", "defog", "bugbuzz", "sludgebomb", "quiverdance", "uturn"],
		randomDoubleBattleMoves: ["tailwind", "stringshot", "strugglebug", "bugbuzz", "protect", "sludgebomb", "quiverdance", "shadowball"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	lotad: {
		tier: "LC",
	},
	lombre: {
		tier: "NFE",
	},
	ludicolo: {
		randomBattleMoves: ["raindance", "hydropump", "scald", "gigadrain", "icebeam", "focusblast"],
		randomDoubleBattleMoves: ["raindance", "hydropump", "surf", "gigadrain", "icebeam", "fakeout", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	seedot: {
		tier: "LC",
	},
	nuzleaf: {
		tier: "NFE",
	},
	shiftry: {
		randomBattleMoves: ["leafstorm", "swordsdance", "leafblade", "suckerpunch", "defog", "lowkick", "knockoff"],
		randomDoubleBattleMoves: ["leafstorm", "swordsdance", "leafblade", "suckerpunch", "knockoff", "lowkick", "fakeout", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	taillow: {
		tier: "LC",
	},
	swellow: {
		randomBattleMoves: ["protect", "facade", "bravebird", "uturn", "quickattack"],
		randomDoubleBattleMoves: ["bravebird", "facade", "quickattack", "uturn", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	wingull: {
		tier: "LC Uber",
	},
	pelipper: {
		randomBattleMoves: ["scald", "hurricane", "hydropump", "uturn", "roost", "defog", "knockoff"],
		randomDoubleBattleMoves: ["scald", "surf", "hurricane", "wideguard", "protect", "tailwind", "knockoff"],
		tier: "OU",
		doublesTier: "DOU",
	},
	ralts: {
		tier: "LC",
	},
	kirlia: {
		tier: "NFE",
	},
	gardevoir: {
		randomBattleMoves: ["psychic", "thunderbolt", "focusblast", "shadowball", "moonblast", "calmmind", "substitute", "willowisp"],
		randomDoubleBattleMoves: ["psyshock", "focusblast", "shadowball", "moonblast", "taunt", "willowisp", "thunderbolt", "trickroom", "helpinghand", "protect", "dazzlinggleam"],
		tier: "RU",
		doublesTier: "DUU",
	},
	gardevoirmega: {
		randomBattleMoves: ["calmmind", "hypervoice", "psyshock", "focusblast", "substitute", "taunt", "willowisp"],
		randomDoubleBattleMoves: ["psyshock", "focusblast", "shadowball", "calmmind", "thunderbolt", "hypervoice", "protect"],
		tier: "UUBL",
		doublesTier: "DOU",
	},
	gallade: {
		randomBattleMoves: ["bulkup", "drainpunch", "icepunch", "shadowsneak", "closecombat", "zenheadbutt", "knockoff", "trick"],
		randomDoubleBattleMoves: ["closecombat", "trick", "stoneedge", "shadowsneak", "drainpunch", "icepunch", "zenheadbutt", "knockoff", "trickroom", "protect", "helpinghand"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	gallademega: {
		randomBattleMoves: ["swordsdance", "closecombat", "drainpunch", "knockoff", "zenheadbutt", "substitute"],
		randomDoubleBattleMoves: ["closecombat", "stoneedge", "drainpunch", "icepunch", "zenheadbutt", "swordsdance", "knockoff", "protect"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	surskit: {
		tier: "LC",
	},
	masquerain: {
		randomBattleMoves: ["quiverdance", "bugbuzz", "airslash", "hydropump", "stickyweb"],
		randomDoubleBattleMoves: ["hydropump", "bugbuzz", "airslash", "quiverdance", "tailwind", "roost", "strugglebug", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	shroomish: {
		tier: "LC",
	},
	breloom: {
		randomBattleMoves: ["spore", "machpunch", "bulletseed", "rocktomb", "swordsdance"],
		randomDoubleBattleMoves: ["spore", "helpinghand", "machpunch", "bulletseed", "rocktomb", "protect", "drainpunch"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	slakoth: {
		tier: "LC",
	},
	vigoroth: {
		tier: "NFE",
	},
	slaking: {
		randomBattleMoves: ["earthquake", "pursuit", "nightslash", "retaliate", "gigaimpact", "firepunch"],
		randomDoubleBattleMoves: ["earthquake", "nightslash", "doubleedge", "retaliate", "hammerarm", "rockslide"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	nincada: {
		tier: "LC",
	},
	ninjask: {
		randomBattleMoves: ["swordsdance", "aerialace", "nightslash", "dig", "leechlife", "uturn"],
		randomDoubleBattleMoves: ["batonpass", "swordsdance", "substitute", "protect", "leechlife", "aerialace"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	shedinja: {
		randomBattleMoves: ["swordsdance", "willowisp", "xscissor", "shadowsneak", "shadowclaw"],
		randomDoubleBattleMoves: ["swordsdance", "willowisp", "xscissor", "shadowsneak", "shadowclaw", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	whismur: {
		tier: "LC",
	},
	loudred: {
		tier: "NFE",
	},
	exploud: {
		randomBattleMoves: ["boomburst", "fireblast", "icebeam", "surf", "focusblast"],
		randomDoubleBattleMoves: ["boomburst", "fireblast", "icebeam", "surf", "focusblast", "protect", "hypervoice"],
		tier: "NUBL",
		doublesTier: "(DUU)",
	},
	makuhita: {
		tier: "LC",
	},
	hariyama: {
		randomBattleMoves: ["bulletpunch", "closecombat", "icepunch", "stoneedge", "bulkup", "knockoff"],
		randomDoubleBattleMoves: ["bulletpunch", "closecombat", "icepunch", "stoneedge", "fakeout", "knockoff", "helpinghand", "wideguard", "protect"],
		tier: "NU",
		doublesTier: "DUU",
	},
	nosepass: {
		tier: "LC",
	},
	probopass: {
		randomBattleMoves: ["stealthrock", "thunderwave", "toxic", "flashcannon", "voltswitch", "earthpower"],
		randomDoubleBattleMoves: ["stealthrock", "thunderwave", "helpinghand", "earthpower", "powergem", "wideguard", "protect", "flashcannon"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	skitty: {
		tier: "LC",
	},
	delcatty: {
		randomBattleMoves: ["doubleedge", "suckerpunch", "wildcharge", "fakeout", "thunderwave", "healbell"],
		randomDoubleBattleMoves: ["doubleedge", "suckerpunch", "playrough", "wildcharge", "fakeout", "thunderwave", "protect", "helpinghand"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	sableye: {
		randomBattleMoves: ["recover", "willowisp", "taunt", "toxic", "knockoff", "foulplay"],
		randomDoubleBattleMoves: ["recover", "willowisp", "taunt", "fakeout", "knockoff", "foulplay", "helpinghand", "snarl", "protect"],
		tier: "PU",
		doublesTier: "DUU",
	},
	sableyemega: {
		randomBattleMoves: ["recover", "willowisp", "darkpulse", "calmmind", "shadowball"],
		randomDoubleBattleMoves: ["fakeout", "knockoff", "darkpulse", "shadowball", "willowisp", "protect"],
		tier: "OU",
		doublesTier: "DUU",
	},
	mawile: {
		randomBattleMoves: ["swordsdance", "ironhead", "stealthrock", "playrough", "suckerpunch", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "ironhead", "firefang", "substitute", "playrough", "suckerpunch", "knockoff", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	mawilemega: {
		randomBattleMoves: ["swordsdance", "ironhead", "firefang", "substitute", "playrough", "suckerpunch", "knockoff", "focuspunch"],
		randomDoubleBattleMoves: ["swordsdance", "ironhead", "firefang", "substitute", "playrough", "suckerpunch", "knockoff", "protect"],
		tier: "OU",
		doublesTier: "DUU",
	},
	aron: {
		tier: "LC",
	},
	lairon: {
		tier: "NFE",
	},
	aggron: {
		randomBattleMoves: ["autotomize", "headsmash", "earthquake", "lowkick", "heavyslam", "aquatail", "stealthrock"],
		randomDoubleBattleMoves: ["rockslide", "headsmash", "earthquake", "lowkick", "heavyslam", "aquatail", "stealthrock", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	aggronmega: {
		randomBattleMoves: ["earthquake", "heavyslam", "rockslide", "stealthrock", "thunderwave", "roar", "toxic"],
		randomDoubleBattleMoves: ["rockslide", "earthquake", "lowkick", "heavyslam", "aquatail", "protect"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	meditite: {
		tier: "LC Uber",
	},
	medicham: {
		randomBattleMoves: ["highjumpkick", "drainpunch", "zenheadbutt", "icepunch", "bulletpunch"],
		randomDoubleBattleMoves: ["highjumpkick", "drainpunch", "zenheadbutt", "icepunch", "bulletpunch", "protect", "fakeout"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	medichammega: {
		randomBattleMoves: ["highjumpkick", "zenheadbutt", "thunderpunch", "icepunch", "fakeout"],
		randomDoubleBattleMoves: ["highjumpkick", "drainpunch", "zenheadbutt", "icepunch", "bulletpunch", "protect", "fakeout"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	electrike: {
		tier: "LC",
	},
	manectric: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "hiddenpowergrass", "overheat", "flamethrower"],
		randomDoubleBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "hiddenpowergrass", "overheat", "flamethrower", "snarl", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	manectricmega: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "hiddenpowergrass", "overheat"],
		randomDoubleBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "hiddenpowergrass", "overheat", "flamethrower", "snarl", "protect"],
		tier: "UU",
		doublesTier: "DOU",
	},
	plusle: {
		randomBattleMoves: ["nastyplot", "thunderbolt", "substitute", "hiddenpowerice", "encore"],
		randomDoubleBattleMoves: ["nastyplot", "thunderbolt", "substitute", "protect", "hiddenpowerice", "encore", "helpinghand"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	minun: {
		randomBattleMoves: ["nastyplot", "thunderbolt", "substitute", "hiddenpowerice", "encore"],
		randomDoubleBattleMoves: ["nastyplot", "thunderbolt", "substitute", "protect", "hiddenpowerice", "encore", "helpinghand"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	volbeat: {
		randomBattleMoves: ["uturn", "roost", "thunderwave", "encore", "tailwind", "defog"],
		randomDoubleBattleMoves: ["stringshot", "strugglebug", "helpinghand", "thunderwave", "encore", "tailwind", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	illumise: {
		randomBattleMoves: ["uturn", "roost", "bugbuzz", "thunderwave", "encore", "wish", "defog"],
		randomDoubleBattleMoves: ["protect", "helpinghand", "bugbuzz", "encore", "thunderbolt", "tailwind", "uturn"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	budew: {
		tier: "LC",
	},
	roselia: {
		tier: "PU",
		doublesTier: "NFE",
	},
	roserade: {
		randomBattleMoves: ["sludgebomb", "gigadrain", "sleeppowder", "leafstorm", "spikes", "toxicspikes", "synthesis", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["sludgebomb", "gigadrain", "sleeppowder", "leafstorm", "protect", "hiddenpowerfire"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	gulpin: {
		tier: "LC",
	},
	swalot: {
		randomBattleMoves: ["sludgebomb", "icebeam", "toxic", "yawn", "encore", "painsplit", "earthquake"],
		randomDoubleBattleMoves: ["sludgebomb", "icebeam", "protect", "yawn", "encore", "gunkshot", "earthquake"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	carvanha: {
		tier: "LC",
	},
	sharpedo: {
		randomBattleMoves: ["protect", "icebeam", "crunch", "earthquake", "waterfall"],
		randomDoubleBattleMoves: ["protect", "icebeam", "crunch", "earthquake", "liquidation"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	sharpedomega: {
		randomBattleMoves: ["protect", "crunch", "waterfall", "icefang", "psychicfangs", "destinybond"],
		randomDoubleBattleMoves: ["protect", "icefang", "crunch", "liquidation", "psychicfangs"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	wailmer: {
		tier: "LC",
	},
	wailord: {
		randomBattleMoves: ["waterspout", "hydropump", "icebeam", "hiddenpowergrass", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["waterspout", "hydropump", "icebeam", "hiddenpowergrass", "hiddenpowerfire", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	numel: {
		tier: "LC",
	},
	camerupt: {
		randomBattleMoves: ["rockpolish", "fireblast", "earthpower", "lavaplume", "stealthrock", "hiddenpowergrass", "roar", "stoneedge"],
		randomDoubleBattleMoves: ["rockpolish", "fireblast", "earthpower", "heatwave", "eruption", "hiddenpowergrass", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	cameruptmega: {
		randomBattleMoves: ["stealthrock", "fireblast", "earthpower", "ancientpower", "willowisp", "toxic"],
		randomDoubleBattleMoves: ["fireblast", "earthpower", "heatwave", "eruption", "rockslide", "protect"],
		tier: "NUBL",
		doublesTier: "DOU",
	},
	torkoal: {
		randomBattleMoves: ["shellsmash", "fireblast", "earthpower", "solarbeam", "stealthrock", "rapidspin", "yawn", "lavaplume"],
		randomDoubleBattleMoves: ["protect", "heatwave", "earthpower", "willowisp", "shellsmash", "fireblast", "solarbeam"],
		tier: "(PU)",
		doublesTier: "DUU",
	},
	spoink: {
		tier: "LC",
	},
	grumpig: {
		randomBattleMoves: ["psychic", "thunderwave", "healbell", "whirlwind", "toxic", "focusblast", "reflect", "lightscreen"],
		randomDoubleBattleMoves: ["psychic", "psyshock", "thunderwave", "trickroom", "taunt", "protect", "focusblast", "reflect", "lightscreen"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	spinda: {
		randomBattleMoves: ["return", "superpower", "rockslide", "encore"],
		randomDoubleBattleMoves: ["doubleedge", "return", "superpower", "suckerpunch", "trickroom", "fakeout", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	trapinch: {
		tier: "LC Uber",
	},
	vibrava: {
		tier: "NFE",
	},
	flygon: {
		randomBattleMoves: ["earthquake", "outrage", "uturn", "roost", "defog", "firepunch", "dragondance"],
		randomDoubleBattleMoves: ["earthquake", "protect", "dragonclaw", "uturn", "rockslide", "firepunch", "fireblast", "tailwind", "dragondance"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	cacnea: {
		tier: "LC",
	},
	cacturne: {
		randomBattleMoves: ["swordsdance", "spikes", "suckerpunch", "seedbomb", "drainpunch", "substitute", "darkpulse", "focusblast", "gigadrain"],
		randomDoubleBattleMoves: ["swordsdance", "spikyshield", "suckerpunch", "seedbomb", "drainpunch", "substitute"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	swablu: {
		tier: "LC",
	},
	altaria: {
		randomBattleMoves: ["dracometeor", "fireblast", "earthquake", "roost", "toxic", "defog"],
		randomDoubleBattleMoves: ["dragondance", "dracometeor", "protect", "dragonclaw", "earthquake", "fireblast", "tailwind"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	altariamega: {
		randomBattleMoves: ["dragondance", "return", "hypervoice", "healbell", "earthquake", "roost", "fireblast"],
		randomDoubleBattleMoves: ["dragondance", "return", "doubleedge", "dragonclaw", "earthquake", "protect", "fireblast"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	zangoose: {
		randomBattleMoves: ["swordsdance", "closecombat", "knockoff", "quickattack", "facade"],
		randomDoubleBattleMoves: ["protect", "closecombat", "knockoff", "quickattack", "facade"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	seviper: {
		randomBattleMoves: ["flamethrower", "sludgewave", "gigadrain", "darkpulse", "switcheroo", "swordsdance", "earthquake", "poisonjab", "suckerpunch"],
		randomDoubleBattleMoves: ["flamethrower", "gigadrain", "earthquake", "suckerpunch", "aquatail", "protect", "glare", "poisonjab", "sludgebomb"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	lunatone: {
		randomBattleMoves: ["psychic", "earthpower", "stealthrock", "rockpolish", "calmmind", "icebeam", "powergem", "moonlight", "toxic"],
		randomDoubleBattleMoves: ["psychic", "earthpower", "rockpolish", "calmmind", "helpinghand", "icebeam", "powergem", "moonlight", "trickroom", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	solrock: {
		randomBattleMoves: ["stealthrock", "explosion", "rockslide", "reflect", "lightscreen", "willowisp", "morningsun"],
		randomDoubleBattleMoves: ["protect", "helpinghand", "stoneedge", "zenheadbutt", "willowisp", "trickroom", "rockslide"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	barboach: {
		tier: "LC",
	},
	whiscash: {
		randomBattleMoves: ["dragondance", "waterfall", "earthquake", "stoneedge", "zenheadbutt"],
		randomDoubleBattleMoves: ["dragondance", "waterfall", "earthquake", "stoneedge", "zenheadbutt", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	corphish: {
		tier: "LC",
	},
	crawdaunt: {
		randomBattleMoves: ["dragondance", "crabhammer", "superpower", "swordsdance", "knockoff", "aquajet"],
		randomDoubleBattleMoves: ["dragondance", "liquidation", "crunch", "superpower", "swordsdance", "knockoff", "aquajet", "protect"],
		tier: "UU",
		doublesTier: "DUU",
	},
	baltoy: {
		tier: "LC",
	},
	claydol: {
		randomBattleMoves: ["stealthrock", "toxic", "psychic", "icebeam", "earthquake", "rapidspin"],
		randomDoubleBattleMoves: ["earthpower", "trickroom", "psychic", "icebeam", "earthquake", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	lileep: {
		tier: "LC",
	},
	cradily: {
		randomBattleMoves: ["stealthrock", "recover", "gigadrain", "toxic", "seedbomb", "rockslide", "curse"],
		randomDoubleBattleMoves: ["protect", "recover", "seedbomb", "rockslide", "earthquake", "curse", "swordsdance"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	anorith: {
		tier: "LC",
	},
	armaldo: {
		randomBattleMoves: ["stealthrock", "stoneedge", "toxic", "xscissor", "knockoff", "rapidspin", "earthquake"],
		randomDoubleBattleMoves: ["rockslide", "stoneedge", "stringshot", "xscissor", "swordsdance", "knockoff", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	feebas: {
		tier: "LC",
	},
	milotic: {
		randomBattleMoves: ["recover", "scald", "toxic", "icebeam", "dragontail", "rest", "sleeptalk"],
		randomDoubleBattleMoves: ["recover", "scald", "hydropump", "icebeam", "dragontail", "hypnosis", "protect", "hiddenpowergrass"],
		tier: "RU",
		doublesTier: "DOU",
	},
	castform: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	castformsunny: {
		randomBattleMoves: ["sunnyday", "fireblast", "solarbeam", "icebeam"],
	},
	castformrainy: {
		randomBattleMoves: ["raindance", "hydropump", "thunder", "hurricane"],
	},
	castformsnowy: {
		randomBattleMoves: ["hail", "blizzard", "thunderbolt", "fireblast"],
	},
	kecleon: {
		randomBattleMoves: ["fakeout", "knockoff", "drainpunch", "suckerpunch", "shadowsneak", "stealthrock", "recover"],
		randomDoubleBattleMoves: ["knockoff", "fakeout", "trickroom", "recover", "drainpunch", "suckerpunch", "shadowsneak", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	shuppet: {
		tier: "LC",
	},
	banette: {
		randomBattleMoves: ["destinybond", "taunt", "shadowclaw", "suckerpunch", "willowisp", "shadowsneak", "knockoff"],
		randomDoubleBattleMoves: ["shadowclaw", "suckerpunch", "willowisp", "shadowsneak", "knockoff", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	banettemega: {
		randomBattleMoves: ["destinybond", "taunt", "shadowclaw", "suckerpunch", "willowisp", "knockoff"],
		randomDoubleBattleMoves: ["destinybond", "taunt", "shadowclaw", "suckerpunch", "willowisp", "knockoff", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	duskull: {
		tier: "LC",
	},
	dusclops: {
		tier: "NFE",
	},
	dusknoir: {
		randomBattleMoves: ["willowisp", "shadowsneak", "icepunch", "painsplit", "substitute", "earthquake", "focuspunch"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "icepunch", "painsplit", "protect", "earthquake", "helpinghand", "trickroom"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	tropius: {
		randomBattleMoves: ["leechseed", "substitute", "airslash", "gigadrain", "toxic", "protect"],
		randomDoubleBattleMoves: ["leechseed", "protect", "airslash", "gigadrain", "earthquake", "hiddenpowerfire", "tailwind", "sunnyday", "roost"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	chingling: {
		tier: "LC",
	},
	chimecho: {
		randomBattleMoves: ["psychic", "yawn", "recover", "calmmind", "shadowball", "healingwish", "healbell", "taunt"],
		randomDoubleBattleMoves: ["protect", "psychic", "thunderwave", "recover", "shadowball", "dazzlinggleam", "trickroom", "helpinghand", "taunt"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	absol: {
		randomBattleMoves: ["swordsdance", "suckerpunch", "knockoff", "superpower", "pursuit", "playrough"],
		randomDoubleBattleMoves: ["swordsdance", "suckerpunch", "knockoff", "fireblast", "superpower", "protect", "playrough"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	absolmega: {
		randomBattleMoves: ["swordsdance", "suckerpunch", "knockoff", "fireblast", "superpower", "pursuit", "playrough", "icebeam"],
		randomDoubleBattleMoves: ["swordsdance", "suckerpunch", "knockoff", "fireblast", "superpower", "protect", "playrough"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	snorunt: {
		tier: "LC",
	},
	glalie: {
		randomBattleMoves: ["spikes", "icebeam", "iceshard", "taunt", "earthquake", "explosion", "superfang"],
		randomDoubleBattleMoves: ["icebeam", "iceshard", "taunt", "earthquake", "freezedry", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	glaliemega: {
		randomBattleMoves: ["freezedry", "iceshard", "earthquake", "explosion", "return", "spikes"],
		randomDoubleBattleMoves: ["crunch", "iceshard", "freezedry", "earthquake", "explosion", "protect", "return"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	froslass: {
		randomBattleMoves: ["icebeam", "spikes", "destinybond", "shadowball", "taunt", "thunderwave"],
		randomDoubleBattleMoves: ["icebeam", "protect", "destinybond", "shadowball", "taunt", "thunderwave"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	spheal: {
		tier: "LC",
	},
	sealeo: {
		tier: "NFE",
	},
	walrein: {
		randomBattleMoves: ["superfang", "protect", "toxic", "surf", "icebeam", "roar"],
		randomDoubleBattleMoves: ["protect", "icywind", "surf", "icebeam", "superfang", "roar"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	clamperl: {
		tier: "LC",
	},
	huntail: {
		randomBattleMoves: ["shellsmash", "waterfall", "icebeam", "suckerpunch"],
		randomDoubleBattleMoves: ["shellsmash", "waterfall", "icefang", "batonpass", "suckerpunch", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	gorebyss: {
		randomBattleMoves: ["shellsmash", "hydropump", "icebeam", "hiddenpowergrass", "substitute"],
		randomDoubleBattleMoves: ["shellsmash", "batonpass", "surf", "icebeam", "hiddenpowergrass", "substitute", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	relicanth: {
		randomBattleMoves: ["headsmash", "waterfall", "earthquake", "doubleedge", "stealthrock", "toxic"],
		randomDoubleBattleMoves: ["headsmash", "waterfall", "earthquake", "doubleedge", "rockslide", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	luvdisc: {
		randomBattleMoves: ["icebeam", "toxic", "sweetkiss", "protect", "scald"],
		randomDoubleBattleMoves: ["icebeam", "toxic", "sweetkiss", "protect", "scald", "icywind", "healpulse"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	bagon: {
		tier: "LC",
	},
	shelgon: {
		tier: "NFE",
	},
	salamence: {
		randomBattleMoves: ["outrage", "fireblast", "earthquake", "dracometeor", "dragondance", "fly", "roost"],
		randomDoubleBattleMoves: ["protect", "fireblast", "earthquake", "dracometeor", "tailwind", "dragondance", "dragonclaw", "hydropump", "rockslide"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	salamencemega: {
		randomBattleMoves: ["doubleedge", "return", "fireblast", "earthquake", "dracometeor", "roost", "dragondance"],
		randomDoubleBattleMoves: ["doubleedge", "return", "fireblast", "earthquake", "dracometeor", "protect", "dragondance", "dragonclaw"],
		tier: "Uber",
		doublesTier: "DOU",
	},
	beldum: {
		tier: "LC",
	},
	metang: {
		tier: "NFE",
	},
	metagross: {
		randomBattleMoves: ["meteormash", "earthquake", "agility", "stealthrock", "zenheadbutt", "bulletpunch", "thunderpunch", "explosion", "icepunch"],
		randomDoubleBattleMoves: ["meteormash", "earthquake", "protect", "zenheadbutt", "bulletpunch", "thunderpunch", "explosion", "icepunch", "hammerarm"],
		tier: "RU",
		doublesTier: "DUU",
	},
	metagrossmega: {
		randomBattleMoves: ["meteormash", "earthquake", "agility", "zenheadbutt", "hammerarm", "icepunch"],
		randomDoubleBattleMoves: ["meteormash", "earthquake", "protect", "zenheadbutt", "thunderpunch", "icepunch"],
		tier: "Uber",
		doublesTier: "DOU",
	},
	regirock: {
		randomBattleMoves: ["stealthrock", "thunderwave", "stoneedge", "drainpunch", "curse", "rest", "rockslide", "toxic"],
		randomDoubleBattleMoves: ["stealthrock", "thunderwave", "stoneedge", "drainpunch", "curse", "rockslide", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	regice: {
		randomBattleMoves: ["thunderwave", "icebeam", "thunderbolt", "rest", "sleeptalk", "focusblast", "rockpolish"],
		randomDoubleBattleMoves: ["thunderwave", "icebeam", "thunderbolt", "icywind", "protect", "focusblast", "rockpolish"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	registeel: {
		randomBattleMoves: ["stealthrock", "toxic", "curse", "ironhead", "rest", "sleeptalk"],
		randomDoubleBattleMoves: ["stealthrock", "ironhead", "curse", "rest", "thunderwave", "protect", "seismictoss"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	latias: {
		randomBattleMoves: ["dracometeor", "psyshock", "hiddenpowerfire", "roost", "thunderbolt", "healingwish", "defog"],
		randomDoubleBattleMoves: ["dragonpulse", "psychic", "tailwind", "helpinghand", "healpulse", "lightscreen", "reflect", "protect"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	latiasmega: {
		randomBattleMoves: ["calmmind", "dragonpulse", "surf", "dracometeor", "roost", "hiddenpowerfire", "substitute", "psyshock"],
		randomDoubleBattleMoves: ["dragonpulse", "psychic", "tailwind", "helpinghand", "healpulse", "lightscreen", "reflect", "protect"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	latios: {
		randomBattleMoves: ["dracometeor", "hiddenpowerfire", "surf", "thunderbolt", "psyshock", "roost", "trick", "defog"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "surf", "thunderbolt", "psyshock", "substitute", "trick", "tailwind", "protect", "hiddenpowerfire"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	latiosmega: {
		randomBattleMoves: ["calmmind", "dracometeor", "hiddenpowerfire", "psyshock", "roost", "defog"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "surf", "thunderbolt", "psyshock", "substitute", "tailwind", "protect", "hiddenpowerfire"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	kyogre: {
		randomBattleMoves: ["waterspout", "originpulse", "scald", "thunder", "icebeam"],
		randomDoubleBattleMoves: ["waterspout", "muddywater", "originpulse", "thunder", "icebeam", "calmmind", "rest", "sleeptalk", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	kyogreprimal: {
		randomBattleMoves: ["calmmind", "originpulse", "scald", "thunder", "icebeam", "toxic", "rest", "sleeptalk"],
		randomDoubleBattleMoves: ["waterspout", "originpulse", "muddywater", "thunder", "icebeam", "calmmind", "rest", "sleeptalk", "protect"],
	},
	groudon: {
		randomBattleMoves: ["earthquake", "stealthrock", "lavaplume", "stoneedge", "roar", "toxic", "thunderwave", "dragonclaw", "firepunch"],
		randomDoubleBattleMoves: ["precipiceblades", "rockslide", "protect", "stoneedge", "swordsdance", "rockpolish", "dragonclaw", "firepunch"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	groudonprimal: {
		randomBattleMoves: ["stealthrock", "precipiceblades", "lavaplume", "stoneedge", "dragontail", "rockpolish", "swordsdance", "firepunch"],
		randomDoubleBattleMoves: ["precipiceblades", "lavaplume", "rockslide", "stoneedge", "swordsdance", "overheat", "rockpolish", "firepunch", "protect"],
	},
	rayquaza: {
		randomBattleMoves: ["outrage", "vcreate", "extremespeed", "dragondance", "earthquake", "dracometeor", "dragonclaw"],
		randomDoubleBattleMoves: ["tailwind", "vcreate", "extremespeed", "dragondance", "earthquake", "dracometeor", "dragonclaw", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	rayquazamega: {
		// randomBattleMoves: ["vcreate", "extremespeed", "swordsdance", "earthquake", "dragonascent", "dragonclaw", "dragondance"],
		randomDoubleBattleMoves: ["vcreate", "extremespeed", "swordsdance", "earthquake", "dragonascent", "dragonclaw", "dragondance", "protect"],
		tier: "AG",
		doublesTier: "DUber",
	},
	jirachi: {
		randomBattleMoves: ["ironhead", "uturn", "firepunch", "icepunch", "stealthrock", "bodyslam", "toxic", "wish", "substitute"],
		randomDoubleBattleMoves: ["bodyslam", "ironhead", "icywind", "thunderwave", "helpinghand", "trickroom", "uturn", "followme", "zenheadbutt", "protect"],
		tier: "OU",
		doublesTier: "DUber",
	},
	deoxys: {
		randomBattleMoves: ["psychoboost", "stealthrock", "spikes", "firepunch", "superpower", "extremespeed", "knockoff", "taunt"],
		randomDoubleBattleMoves: ["psychoboost", "superpower", "extremespeed", "icebeam", "thunderbolt", "firepunch", "protect", "knockoff", "psyshock"],
		tier: "Uber",
		doublesTier: "(DUU)",
	},
	deoxysattack: {
		randomBattleMoves: ["psychoboost", "superpower", "icebeam", "knockoff", "extremespeed", "firepunch", "stealthrock"],
		randomDoubleBattleMoves: ["psychoboost", "superpower", "extremespeed", "icebeam", "thunderbolt", "firepunch", "protect", "knockoff"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	deoxysdefense: {
		randomBattleMoves: ["spikes", "stealthrock", "recover", "taunt", "toxic", "seismictoss", "knockoff"],
		randomDoubleBattleMoves: ["protect", "stealthrock", "recover", "taunt", "reflect", "seismictoss", "lightscreen", "trickroom", "psychic"],
		tier: "Uber",
		doublesTier: "(DUU)",
	},
	deoxysspeed: {
		randomBattleMoves: ["spikes", "stealthrock", "superpower", "psychoboost", "taunt", "magiccoat", "knockoff"],
		randomDoubleBattleMoves: ["superpower", "icebeam", "psychoboost", "taunt", "lightscreen", "reflect", "protect", "knockoff"],
		tier: "Uber",
		doublesTier: "(DUU)",
	},
	turtwig: {
		tier: "LC",
	},
	grotle: {
		tier: "NFE",
	},
	torterra: {
		randomBattleMoves: ["stealthrock", "earthquake", "woodhammer", "stoneedge", "synthesis", "rockpolish"],
		randomDoubleBattleMoves: ["protect", "earthquake", "woodhammer", "stoneedge", "rockslide", "wideguard", "rockpolish"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	chimchar: {
		tier: "LC",
	},
	monferno: {
		tier: "NFE",
	},
	infernape: {
		randomBattleMoves: ["stealthrock", "uturn", "closecombat", "flareblitz", "stoneedge", "machpunch", "nastyplot", "fireblast", "focusblast", "vacuumwave", "grassknot"],
		randomDoubleBattleMoves: ["fakeout", "heatwave", "closecombat", "uturn", "grassknot", "stoneedge", "machpunch", "feint", "taunt", "flareblitz", "thunderpunch", "protect"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	piplup: {
		tier: "LC",
	},
	prinplup: {
		tier: "NFE",
	},
	empoleon: {
		randomBattleMoves: ["hydropump", "flashcannon", "grassknot", "defog", "icebeam", "scald", "toxic", "roar", "stealthrock"],
		randomDoubleBattleMoves: ["icywind", "scald", "surf", "icebeam", "hiddenpowerelectric", "protect", "grassknot", "flashcannon"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	starly: {
		tier: "LC",
	},
	staravia: {
		tier: "NFE",
	},
	staraptor: {
		randomBattleMoves: ["bravebird", "closecombat", "uturn", "quickattack", "doubleedge"],
		randomDoubleBattleMoves: ["bravebird", "closecombat", "uturn", "quickattack", "doubleedge", "tailwind", "protect"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	bidoof: {
		tier: "LC",
	},
	bibarel: {
		randomBattleMoves: ["return", "liquidation", "swordsdance", "quickattack", "aquajet"],
		randomDoubleBattleMoves: ["return", "liquidation", "curse", "aquajet", "quickattack", "protect", "rest"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	kricketot: {
		tier: "LC",
	},
	kricketune: {
		randomBattleMoves: ["leechlife", "endeavor", "taunt", "toxic", "stickyweb", "knockoff"],
		randomDoubleBattleMoves: ["leechlife", "protect", "taunt", "stickyweb", "knockoff"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	shinx: {
		tier: "LC",
	},
	luxio: {
		tier: "NFE",
	},
	luxray: {
		randomBattleMoves: ["wildcharge", "icefang", "voltswitch", "crunch", "superpower", "facade"],
		randomDoubleBattleMoves: ["wildcharge", "icefang", "voltswitch", "crunch", "superpower", "facade", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	cranidos: {
		tier: "LC",
	},
	rampardos: {
		randomBattleMoves: ["headsmash", "earthquake", "rockpolish", "crunch", "rockslide", "firepunch"],
		randomDoubleBattleMoves: ["headsmash", "earthquake", "zenheadbutt", "rockslide", "crunch", "stoneedge", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	shieldon: {
		tier: "LC",
	},
	bastiodon: {
		randomBattleMoves: ["stealthrock", "rockblast", "metalburst", "protect", "toxic", "roar"],
		randomDoubleBattleMoves: ["stealthrock", "stoneedge", "metalburst", "protect", "wideguard", "guardsplit"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	burmy: {
		tier: "LC",
	},
	wormadam: {
		randomBattleMoves: ["gigadrain", "bugbuzz", "quiverdance", "hiddenpowerrock", "leafstorm"],
		randomDoubleBattleMoves: ["leafstorm", "gigadrain", "bugbuzz", "hiddenpowerice", "hiddenpowerrock", "stringshot", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	wormadamsandy: {
		randomBattleMoves: ["earthquake", "toxic", "protect", "stealthrock"],
		randomDoubleBattleMoves: ["earthquake", "suckerpunch", "rockblast", "protect", "stringshot"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	wormadamtrash: {
		randomBattleMoves: ["stealthrock", "toxic", "gyroball", "protect"],
		randomDoubleBattleMoves: ["strugglebug", "stringshot", "gyroball", "bugbuzz", "flashcannon", "suckerpunch", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	mothim: {
		randomBattleMoves: ["quiverdance", "bugbuzz", "airslash", "energyball", "uturn"],
		randomDoubleBattleMoves: ["quiverdance", "bugbuzz", "airslash", "gigadrain", "roost", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	combee: {
		tier: "LC",
	},
	vespiquen: {
		randomBattleMoves: ["toxic", "protect", "roost", "infestation", "uturn"],
		randomDoubleBattleMoves: ["tailwind", "healorder", "stringshot", "attackorder", "strugglebug", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pachirisu: {
		randomBattleMoves: ["nuzzle", "thunderbolt", "superfang", "toxic", "uturn"],
		randomDoubleBattleMoves: ["nuzzle", "thunderbolt", "superfang", "followme", "uturn", "helpinghand", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	buizel: {
		tier: "LC",
	},
	floatzel: {
		randomBattleMoves: ["bulkup", "liquidation", "icepunch", "substitute", "taunt", "aquajet", "brickbreak"],
		randomDoubleBattleMoves: ["liquidation", "aquajet", "switcheroo", "raindance", "protect", "icepunch", "crunch", "taunt"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	cherubi: {
		tier: "LC",
	},
	cherrim: {
		randomBattleMoves: ["energyball", "dazzlinggleam", "hiddenpowerfire", "synthesis", "healingwish"],
		randomDoubleBattleMoves: ["sunnyday", "solarbeam", "weatherball", "gigadrain", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	cherrimsunshine: {
		randomBattleMoves: ["sunnyday", "solarbeam", "gigadrain", "weatherball", "hiddenpowerice"],
		randomDoubleBattleMoves: ["sunnyday", "solarbeam", "gigadrain", "weatherball", "protect"],
	},
	shellos: {
		tier: "LC",
	},
	gastrodon: {
		randomBattleMoves: ["earthquake", "icebeam", "scald", "toxic", "recover", "clearsmog"],
		randomDoubleBattleMoves: ["earthpower", "icebeam", "scald", "muddywater", "recover", "icywind", "protect"],
		tier: "PU",
		doublesTier: "DOU",
	},
	drifloon: {
		tier: "LC Uber",
	},
	drifblim: {
		randomBattleMoves: ["acrobatics", "willowisp", "substitute", "destinybond", "shadowball", "hex"],
		randomDoubleBattleMoves: ["shadowball", "substitute", "hypnosis", "hiddenpowerfighting", "thunderbolt", "destinybond", "willowisp", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	buneary: {
		tier: "LC",
	},
	lopunny: {
		randomBattleMoves: ["return", "switcheroo", "highjumpkick", "icepunch", "healingwish"],
		randomDoubleBattleMoves: ["return", "switcheroo", "highjumpkick", "firepunch", "icepunch", "fakeout", "protect", "encore"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	lopunnymega: {
		randomBattleMoves: ["return", "highjumpkick", "substitute", "fakeout", "icepunch"],
		randomDoubleBattleMoves: ["return", "highjumpkick", "protect", "fakeout", "icepunch", "encore"],
		tier: "OU",
		doublesTier: "DUU",
	},
	glameow: {
		tier: "LC",
	},
	purugly: {
		randomBattleMoves: ["fakeout", "uturn", "suckerpunch", "quickattack", "return", "knockoff"],
		randomDoubleBattleMoves: ["fakeout", "uturn", "suckerpunch", "quickattack", "return", "knockoff", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	stunky: {
		tier: "LC",
	},
	skuntank: {
		randomBattleMoves: ["pursuit", "suckerpunch", "crunch", "fireblast", "taunt", "poisonjab", "defog"],
		randomDoubleBattleMoves: ["protect", "suckerpunch", "crunch", "fireblast", "taunt", "poisonjab", "playrough", "snarl"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	bronzor: {
		tier: "LC",
	},
	bronzong: {
		randomBattleMoves: ["stealthrock", "earthquake", "toxic", "reflect", "lightscreen", "trickroom", "explosion", "gyroball"],
		randomDoubleBattleMoves: ["earthquake", "protect", "reflect", "lightscreen", "trickroom", "explosion", "gyroball"],
		tier: "RU",
		doublesTier: "DUU",
	},
	chatot: {
		randomBattleMoves: ["nastyplot", "boomburst", "heatwave", "hiddenpowerground", "substitute", "chatter", "uturn"],
		randomDoubleBattleMoves: ["nastyplot", "heatwave", "encore", "substitute", "chatter", "uturn", "protect", "hypervoice", "boomburst"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	spiritomb: {
		randomBattleMoves: ["willowisp", "pursuit", "shadowsneak", "calmmind", "darkpulse", "rest", "sleeptalk", "psychic"],
		randomDoubleBattleMoves: ["shadowsneak", "icywind", "willowisp", "snarl", "darkpulse", "protect", "foulplay", "painsplit"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	gible: {
		tier: "LC",
	},
	gabite: {
		tier: "NFE",
	},
	garchomp: {
		randomBattleMoves: ["outrage", "dragonclaw", "earthquake", "stoneedge", "fireblast", "swordsdance", "stealthrock", "firefang"],
		randomDoubleBattleMoves: ["substitute", "dragonclaw", "earthquake", "stoneedge", "rockslide", "swordsdance", "protect", "firefang"],
		tier: "OU",
		doublesTier: "DOU",
	},
	garchompmega: {
		randomBattleMoves: ["outrage", "dracometeor", "earthquake", "stoneedge", "fireblast", "swordsdance"],
		randomDoubleBattleMoves: ["substitute", "dragonclaw", "earthquake", "stoneedge", "rockslide", "swordsdance", "protect", "fireblast"],
		tier: "(OU)",
		doublesTier: "(DOU)",
	},
	riolu: {
		tier: "LC",
	},
	lucario: {
		randomBattleMoves: ["swordsdance", "closecombat", "crunch", "extremespeed", "icepunch", "meteormash", "nastyplot", "aurasphere", "darkpulse", "vacuumwave", "flashcannon"],
		randomDoubleBattleMoves: ["followme", "closecombat", "crunch", "extremespeed", "icepunch", "bulletpunch", "aurasphere", "darkpulse", "vacuumwave", "flashcannon", "protect"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	lucariomega: {
		randomBattleMoves: ["swordsdance", "closecombat", "crunch", "icepunch", "bulletpunch", "meteormash", "nastyplot", "aurasphere", "darkpulse", "flashcannon"],
		randomDoubleBattleMoves: ["followme", "closecombat", "crunch", "extremespeed", "icepunch", "bulletpunch", "meteormash", "aurasphere", "darkpulse", "vacuumwave", "flashcannon", "protect"],
		tier: "Uber",
		doublesTier: "(DUU)",
	},
	hippopotas: {
		tier: "LC",
	},
	hippowdon: {
		randomBattleMoves: ["earthquake", "slackoff", "whirlwind", "stealthrock", "toxic", "stoneedge"],
		randomDoubleBattleMoves: ["earthquake", "slackoff", "rockslide", "stealthrock", "protect", "stoneedge", "whirlwind"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	skorupi: {
		tier: "LC",
	},
	drapion: {
		randomBattleMoves: ["knockoff", "taunt", "toxicspikes", "poisonjab", "whirlwind", "swordsdance", "aquatail", "earthquake"],
		randomDoubleBattleMoves: ["snarl", "taunt", "protect", "earthquake", "aquatail", "swordsdance", "poisonjab", "knockoff"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	croagunk: {
		tier: "LC",
	},
	toxicroak: {
		randomBattleMoves: ["swordsdance", "gunkshot", "drainpunch", "suckerpunch", "icepunch", "substitute"],
		randomDoubleBattleMoves: ["suckerpunch", "drainpunch", "substitute", "swordsdance", "knockoff", "icepunch", "gunkshot", "fakeout", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	carnivine: {
		randomBattleMoves: ["swordsdance", "powerwhip", "return", "sleeppowder", "substitute", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "powerwhip", "return", "sleeppowder", "substitute", "leechseed", "knockoff", "ragepowder", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	finneon: {
		tier: "LC",
	},
	lumineon: {
		randomBattleMoves: ["scald", "icebeam", "uturn", "toxic", "defog"],
		randomDoubleBattleMoves: ["surf", "uturn", "icebeam", "toxic", "raindance", "tailwind", "scald", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	snover: {
		tier: "LC",
	},
	abomasnow: {
		randomBattleMoves: ["woodhammer", "iceshard", "blizzard", "gigadrain", "leechseed", "substitute", "focuspunch", "earthquake"],
		randomDoubleBattleMoves: ["blizzard", "iceshard", "gigadrain", "protect", "focusblast", "woodhammer", "earthquake"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	abomasnowmega: {
		randomBattleMoves: ["blizzard", "gigadrain", "woodhammer", "earthquake", "iceshard", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["blizzard", "iceshard", "gigadrain", "protect", "focusblast", "woodhammer", "earthquake"],
		tier: "NU",
		doublesTier: "DUU",
	},
	rotom: {
		randomBattleMoves: ["thunderbolt", "voltswitch", "shadowball", "substitute", "painsplit", "hiddenpowerice", "trick", "willowisp"],
		randomDoubleBattleMoves: ["thunderbolt", "voltswitch", "shadowball", "substitute", "painsplit", "hiddenpowerice", "trick", "willowisp", "electroweb", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	rotomheat: {
		randomBattleMoves: ["overheat", "thunderbolt", "voltswitch", "hiddenpowerice", "painsplit", "willowisp"],
		randomDoubleBattleMoves: ["overheat", "thunderbolt", "voltswitch", "substitute", "painsplit", "hiddenpowerice", "willowisp", "electroweb", "protect"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	rotomwash: {
		randomBattleMoves: ["hydropump", "thunderbolt", "voltswitch", "painsplit", "defog", "willowisp", "trick"],
		randomDoubleBattleMoves: ["hydropump", "thunderbolt", "voltswitch", "substitute", "painsplit", "hiddenpowerice", "willowisp", "trick", "electroweb", "protect", "hiddenpowergrass"],
		tier: "OU",
		doublesTier: "DUU",
	},
	rotomfrost: {
		randomBattleMoves: ["blizzard", "thunderbolt", "voltswitch", "painsplit", "willowisp", "trick"],
		randomDoubleBattleMoves: ["blizzard", "thunderbolt", "voltswitch", "substitute", "painsplit", "willowisp", "trick", "electroweb", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	rotomfan: {
		randomBattleMoves: ["airslash", "thunderbolt", "voltswitch", "painsplit", "willowisp", "defog"],
		randomDoubleBattleMoves: ["airslash", "thunderbolt", "voltswitch", "substitute", "painsplit", "hiddenpowerice", "willowisp", "electroweb", "discharge", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	rotommow: {
		randomBattleMoves: ["leafstorm", "thunderbolt", "voltswitch", "hiddenpowerfire", "hiddenpowerice", "trick"],
		randomDoubleBattleMoves: ["leafstorm", "thunderbolt", "voltswitch", "substitute", "painsplit", "hiddenpowerfire", "willowisp", "trick", "electroweb", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	uxie: {
		randomBattleMoves: ["stealthrock", "thunderwave", "psychic", "uturn", "healbell", "knockoff", "yawn"],
		randomDoubleBattleMoves: ["uturn", "psyshock", "yawn", "healbell", "stealthrock", "thunderbolt", "protect", "helpinghand", "thunderwave"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	mesprit: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "energyball", "signalbeam", "hiddenpowerfire", "icebeam", "healingwish", "stealthrock", "uturn"],
		randomDoubleBattleMoves: ["calmmind", "psychic", "thunderbolt", "icebeam", "substitute", "uturn", "trick", "protect", "knockoff", "helpinghand"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	azelf: {
		randomBattleMoves: ["nastyplot", "psyshock", "fireblast", "dazzlinggleam", "stealthrock", "knockoff", "taunt", "explosion"],
		randomDoubleBattleMoves: ["nastyplot", "psychic", "fireblast", "thunderbolt", "icepunch", "knockoff", "zenheadbutt", "uturn", "taunt", "protect", "dazzlinggleam"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	dialga: {
		randomBattleMoves: ["stealthrock", "toxic", "dracometeor", "fireblast", "flashcannon", "roar", "thunderbolt"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "protect", "thunderbolt", "flashcannon", "earthpower", "fireblast", "aurasphere"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	palkia: {
		randomBattleMoves: ["spacialrend", "dracometeor", "hydropump", "thunderwave", "dragontail", "fireblast"],
		randomDoubleBattleMoves: ["spacialrend", "dracometeor", "surf", "hydropump", "thunderbolt", "fireblast", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	heatran: {
		randomBattleMoves: ["magmastorm", "lavaplume", "stealthrock", "earthpower", "flashcannon", "protect", "toxic", "roar"],
		randomDoubleBattleMoves: ["heatwave", "substitute", "earthpower", "protect", "eruption", "willowisp"],
		tier: "OU",
		doublesTier: "DOU",
	},
	regigigas: {
		randomBattleMoves: ["thunderwave", "confuseray", "substitute", "return", "knockoff", "drainpunch"],
		randomDoubleBattleMoves: ["thunderwave", "substitute", "return", "icywind", "rockslide", "earthquake", "knockoff", "wideguard"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	giratina: {
		randomBattleMoves: ["rest", "sleeptalk", "dragontail", "roar", "willowisp", "shadowball", "dragonpulse"],
		randomDoubleBattleMoves: ["tailwind", "shadowsneak", "protect", "dragontail", "willowisp", "calmmind", "dragonpulse", "shadowball"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	giratinaorigin: {
		randomBattleMoves: ["dracometeor", "shadowsneak", "dragontail", "willowisp", "defog", "toxic", "shadowball", "earthquake"],
		randomDoubleBattleMoves: ["dracometeor", "shadowsneak", "tailwind", "hiddenpowerfire", "willowisp", "calmmind", "substitute", "dragonpulse", "shadowball", "aurasphere", "protect", "earthquake"],
	},
	cresselia: {
		randomBattleMoves: ["moonlight", "psychic", "icebeam", "thunderwave", "toxic", "substitute", "psyshock", "moonblast", "calmmind"],
		randomDoubleBattleMoves: ["psyshock", "icywind", "thunderwave", "trickroom", "moonblast", "moonlight", "skillswap", "reflect", "lightscreen", "icebeam", "protect", "helpinghand"],
		tier: "RU",
		doublesTier: "DOU",
	},
	phione: {
		randomBattleMoves: ["scald", "knockoff", "uturn", "icebeam", "toxic", "healbell"],
		randomDoubleBattleMoves: ["raindance", "scald", "uturn", "rest", "icebeam", "helpinghand", "icywind", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	manaphy: {
		randomBattleMoves: ["tailglow", "surf", "icebeam", "energyball", "psychic"],
		randomDoubleBattleMoves: ["tailglow", "surf", "icebeam", "energyball", "protect", "scald", "icywind", "helpinghand"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	darkrai: {
		randomBattleMoves: ["hypnosis", "darkpulse", "focusblast", "nastyplot", "substitute", "sludgebomb"],
		randomDoubleBattleMoves: ["darkpulse", "focusblast", "nastyplot", "substitute", "snarl", "icebeam", "protect"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	shaymin: {
		randomBattleMoves: ["seedflare", "earthpower", "airslash", "psychic", "rest", "substitute", "leechseed"],
		randomDoubleBattleMoves: ["seedflare", "earthpower", "airslash", "hiddenpowerfire", "rest", "substitute", "leechseed", "tailwind", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	shayminsky: {
		randomBattleMoves: ["seedflare", "airslash", "earthpower", "hiddenpowerice", "substitute", "leechseed"],
		randomDoubleBattleMoves: ["seedflare", "earthpower", "airslash", "rest", "substitute", "leechseed", "tailwind", "protect", "hiddenpowerice"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	arceus: {
		randomBattleMoves: ["swordsdance", "extremespeed", "shadowclaw", "earthquake", "recover"],
		randomDoubleBattleMoves: ["swordsdance", "extremespeed", "shadowclaw", "earthquake", "recover", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	arceusbug: {
		randomBattleMoves: ["swordsdance", "xscissor", "stoneedge", "recover", "earthquake", "ironhead"],
		randomDoubleBattleMoves: ["swordsdance", "xscissor", "stoneedge", "recover", "earthquake", "ironhead", "protect"],
	},
	arceusdark: {
		randomBattleMoves: ["calmmind", "judgment", "recover", "fireblast", "toxic"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "recover", "focusblast", "safeguard", "snarl", "willowisp", "protect"],
	},
	arceusdragon: {
		randomBattleMoves: ["swordsdance", "outrage", "extremespeed", "earthquake", "recover", "judgment", "fireblast", "willowisp", "defog"],
		randomDoubleBattleMoves: ["swordsdance", "dragonclaw", "extremespeed", "earthquake", "recover", "protect"],
	},
	arceuselectric: {
		randomBattleMoves: ["calmmind", "judgment", "recover", "icebeam", "earthpower"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "recover", "icebeam", "protect"],
	},
	arceusfairy: {
		randomBattleMoves: ["calmmind", "judgment", "recover", "willowisp", "defog", "earthpower", "toxic"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "recover", "willowisp", "protect", "earthpower", "thunderbolt"],
	},
	arceusfighting: {
		randomBattleMoves: ["calmmind", "judgment", "stoneedge", "shadowball", "recover", "roar", "icebeam"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "icebeam", "shadowball", "recover", "willowisp", "protect"],
	},
	arceusfire: {
		randomBattleMoves: ["calmmind", "fireblast", "roar", "thunderbolt", "icebeam", "recover"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "thunderbolt", "recover", "heatwave", "protect", "willowisp"],
	},
	arceusflying: {
		randomBattleMoves: ["calmmind", "judgment", "earthpower", "fireblast", "toxic", "recover"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "safeguard", "recover", "substitute", "tailwind", "protect"],
	},
	arceusghost: {
		randomBattleMoves: ["swordsdance", "shadowforce", "shadowclaw", "brickbreak", "extremespeed", "recover", "judgment", "toxic", "defog"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "focusblast", "recover", "swordsdance", "shadowforce", "brickbreak", "willowisp", "protect"],
	},
	arceusgrass: {
		randomBattleMoves: ["judgment", "recover", "calmmind", "icebeam", "fireblast"],
		randomDoubleBattleMoves: ["calmmind", "icebeam", "judgment", "earthpower", "recover", "safeguard", "thunderwave", "protect"],
	},
	arceusground: {
		randomBattleMoves: ["swordsdance", "earthquake", "stoneedge", "recover", "judgment", "icebeam", "toxic", "stealthrock"],
		randomDoubleBattleMoves: ["swordsdance", "earthquake", "stoneedge", "recover", "calmmind", "judgment", "icebeam", "rockslide", "protect"],
	},
	arceusice: {
		randomBattleMoves: ["calmmind", "judgment", "thunderbolt", "fireblast", "recover"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "thunderbolt", "focusblast", "recover", "protect", "icywind"],
	},
	arceuspoison: {
		randomBattleMoves: ["calmmind", "sludgebomb", "fireblast", "recover", "icebeam", "defog"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "sludgebomb", "heatwave", "recover", "willowisp", "protect", "earthpower"],
	},
	arceuspsychic: {
		randomBattleMoves: ["judgment", "calmmind", "fireblast", "recover", "icebeam", "toxic"],
		randomDoubleBattleMoves: ["calmmind", "psyshock", "focusblast", "recover", "willowisp", "judgment", "protect"],
	},
	arceusrock: {
		randomBattleMoves: ["swordsdance", "earthquake", "stoneedge", "recover", "judgment", "willowisp", "stealthrock"],
		randomDoubleBattleMoves: ["swordsdance", "stoneedge", "recover", "rockslide", "earthquake", "protect"],
	},
	arceussteel: {
		randomBattleMoves: ["judgment", "recover", "willowisp", "defog", "roar", "swordsdance", "ironhead", "earthquake", "stoneedge"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "recover", "protect", "willowisp"],
	},
	arceuswater: {
		randomBattleMoves: ["recover", "calmmind", "judgment", "icebeam", "toxic", "defog"],
		randomDoubleBattleMoves: ["recover", "calmmind", "judgment", "icebeam", "fireblast", "icywind", "surf", "protect"],
	},
	victini: {
		randomBattleMoves: ["vcreate", "boltstrike", "uturn", "zenheadbutt", "grassknot", "focusblast", "blueflare"],
		randomDoubleBattleMoves: ["vcreate", "boltstrike", "uturn", "psychic", "focusblast", "blueflare", "protect"],
		tier: "OU",
		doublesTier: "DOU",
	},
	snivy: {
		tier: "LC",
	},
	servine: {
		tier: "NFE",
	},
	serperior: {
		randomBattleMoves: ["leafstorm", "dragonpulse", "hiddenpowerfire", "substitute", "leechseed", "glare"],
		randomDoubleBattleMoves: ["leafstorm", "hiddenpowerfire", "substitute", "taunt", "dragonpulse", "protect"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	tepig: {
		tier: "LC",
	},
	pignite: {
		tier: "NFE",
	},
	emboar: {
		randomBattleMoves: ["flareblitz", "superpower", "wildcharge", "headsmash", "fireblast", "grassknot", "suckerpunch"],
		randomDoubleBattleMoves: ["flareblitz", "superpower", "flamecharge", "wildcharge", "headsmash", "protect", "heatwave", "rockslide"],
		tier: "NUBL",
		doublesTier: "(DUU)",
	},
	oshawott: {
		tier: "LC",
	},
	dewott: {
		tier: "NFE",
	},
	samurott: {
		randomBattleMoves: ["swordsdance", "liquidation", "aquajet", "megahorn", "sacredsword", "hydropump", "icebeam", "grassknot"],
		randomDoubleBattleMoves: ["hydropump", "aquajet", "icebeam", "scald", "hiddenpowergrass", "taunt", "helpinghand", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	patrat: {
		tier: "LC",
	},
	watchog: {
		randomBattleMoves: ["hypnosis", "substitute", "superfang", "swordsdance", "return", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "knockoff", "substitute", "hypnosis", "return", "superfang", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	lillipup: {
		tier: "LC",
	},
	herdier: {
		tier: "NFE",
	},
	stoutland: {
		randomBattleMoves: ["return", "crunch", "wildcharge", "superpower", "icefang"],
		randomDoubleBattleMoves: ["return", "wildcharge", "superpower", "crunch", "icefang", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	purrloin: {
		tier: "LC",
	},
	liepard: {
		randomBattleMoves: ["knockoff", "playrough", "uturn", "copycat", "encore", "thunderwave", "nastyplot", "darkpulse", "substitute"],
		randomDoubleBattleMoves: ["encore", "thunderwave", "substitute", "knockoff", "playrough", "uturn", "suckerpunch", "fakeout", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	pansage: {
		tier: "LC",
	},
	simisage: {
		randomBattleMoves: ["nastyplot", "gigadrain", "focusblast", "hiddenpowerice", "substitute", "leafstorm", "knockoff", "superpower"],
		randomDoubleBattleMoves: ["nastyplot", "leafstorm", "hiddenpowerfire", "hiddenpowerice", "gigadrain", "focusblast", "substitute", "taunt", "synthesis", "helpinghand", "spikyshield"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pansear: {
		tier: "LC",
	},
	simisear: {
		randomBattleMoves: ["substitute", "nastyplot", "fireblast", "focusblast", "grassknot", "hiddenpowerrock"],
		randomDoubleBattleMoves: ["nastyplot", "fireblast", "focusblast", "grassknot", "hiddenpowerground", "substitute", "heatwave", "taunt", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	panpour: {
		tier: "LC",
	},
	simipour: {
		randomBattleMoves: ["substitute", "nastyplot", "hydropump", "icebeam", "focusblast"],
		randomDoubleBattleMoves: ["nastyplot", "hydropump", "icebeam", "substitute", "surf", "taunt", "helpinghand", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	munna: {
		tier: "LC",
	},
	musharna: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "signalbeam", "moonlight", "healbell", "thunderwave"],
		randomDoubleBattleMoves: ["trickroom", "thunderwave", "moonlight", "psychic", "hiddenpowerfighting", "helpinghand", "psyshock", "hypnosis", "signalbeam", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	pidove: {
		tier: "LC",
	},
	tranquill: {
		tier: "NFE",
	},
	unfezant: {
		randomBattleMoves: ["return", "pluck", "hypnosis", "tailwind", "uturn", "roost", "nightslash"],
		randomDoubleBattleMoves: ["pluck", "uturn", "return", "protect", "tailwind", "taunt", "roost", "nightslash"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	blitzle: {
		tier: "LC",
	},
	zebstrika: {
		randomBattleMoves: ["voltswitch", "hiddenpowergrass", "overheat", "wildcharge", "thunderbolt"],
		randomDoubleBattleMoves: ["voltswitch", "hiddenpowergrass", "overheat", "wildcharge", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	roggenrola: {
		tier: "LC",
	},
	boldore: {
		tier: "NFE",
	},
	gigalith: {
		randomBattleMoves: ["stealthrock", "rockblast", "earthquake", "explosion", "stoneedge", "superpower"],
		randomDoubleBattleMoves: ["stealthrock", "rockslide", "earthquake", "explosion", "stoneedge", "autotomize", "superpower", "wideguard", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	woobat: {
		tier: "LC",
	},
	swoobat: {
		randomBattleMoves: ["substitute", "calmmind", "storedpower", "heatwave", "airslash", "roost"],
		randomDoubleBattleMoves: ["calmmind", "psychic", "airslash", "gigadrain", "protect", "heatwave", "tailwind"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	drilbur: {
		tier: "LC",
	},
	excadrill: {
		randomBattleMoves: ["swordsdance", "earthquake", "ironhead", "rockslide", "rapidspin"],
		randomDoubleBattleMoves: ["swordsdance", "drillrun", "earthquake", "rockslide", "ironhead", "substitute", "protect"],
		tier: "OU",
		doublesTier: "DOU",
	},
	audino: {
		randomBattleMoves: ["wish", "protect", "healbell", "toxic", "thunderwave", "reflect", "lightscreen", "doubleedge"],
		randomDoubleBattleMoves: ["healpulse", "protect", "healbell", "trickroom", "thunderwave", "reflect", "lightscreen", "doubleedge", "helpinghand", "hypervoice"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	audinomega: {
		randomBattleMoves: ["wish", "calmmind", "healbell", "dazzlinggleam", "protect", "fireblast"],
		randomDoubleBattleMoves: ["healpulse", "protect", "healbell", "trickroom", "thunderwave", "hypervoice", "helpinghand", "dazzlinggleam"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	timburr: {
		tier: "LC",
	},
	gurdurr: {
		tier: "PU",
		doublesTier: "NFE",
	},
	conkeldurr: {
		randomBattleMoves: ["bulkup", "drainpunch", "icepunch", "knockoff", "machpunch"],
		randomDoubleBattleMoves: ["wideguard", "machpunch", "drainpunch", "icepunch", "knockoff", "protect"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	tympole: {
		tier: "LC",
	},
	palpitoad: {
		tier: "NFE",
	},
	seismitoad: {
		randomBattleMoves: ["hydropump", "scald", "sludgewave", "earthquake", "knockoff", "stealthrock", "toxic", "raindance"],
		randomDoubleBattleMoves: ["hydropump", "muddywater", "sludgebomb", "earthquake", "hiddenpowerelectric", "icywind", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	throh: {
		randomBattleMoves: ["bulkup", "circlethrow", "icepunch", "stormthrow", "rest", "sleeptalk", "knockoff"],
		randomDoubleBattleMoves: ["helpinghand", "circlethrow", "icepunch", "stormthrow", "wideguard", "knockoff", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	sawk: {
		randomBattleMoves: ["closecombat", "earthquake", "icepunch", "poisonjab", "bulkup", "knockoff"],
		randomDoubleBattleMoves: ["closecombat", "knockoff", "icepunch", "rockslide", "protect"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	sewaddle: {
		tier: "LC",
	},
	swadloon: {
		tier: "NFE",
	},
	leavanny: {
		randomBattleMoves: ["stickyweb", "swordsdance", "leafblade", "xscissor", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "leafblade", "xscissor", "protect", "stickyweb", "poisonjab"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	venipede: {
		tier: "LC",
	},
	whirlipede: {
		tier: "NFE",
	},
	scolipede: {
		randomBattleMoves: ["protect", "spikes", "toxicspikes", "megahorn", "rockslide", "earthquake", "swordsdance", "poisonjab"],
		randomDoubleBattleMoves: ["substitute", "protect", "megahorn", "rockslide", "poisonjab", "swordsdance", "batonpass", "aquatail", "superpower"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	cottonee: {
		tier: "LC",
	},
	whimsicott: {
		randomBattleMoves: ["encore", "taunt", "leechseed", "uturn", "toxic", "stunspore", "memento", "tailwind", "moonblast", "defog"],
		randomDoubleBattleMoves: ["encore", "taunt", "substitute", "leechseed", "uturn", "helpinghand", "stunspore", "moonblast", "tailwind", "dazzlinggleam", "gigadrain", "protect", "defog"],
		tier: "NU",
		doublesTier: "DOU",
	},
	petilil: {
		tier: "LC",
	},
	lilligant: {
		randomBattleMoves: ["sleeppowder", "quiverdance", "petaldance", "gigadrain", "hiddenpowerfire", "hiddenpowerrock"],
		randomDoubleBattleMoves: ["quiverdance", "gigadrain", "sleeppowder", "hiddenpowerice", "hiddenpowerfire", "hiddenpowerrock", "petaldance", "helpinghand", "protect"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	basculin: {
		randomBattleMoves: ["liquidation", "aquajet", "superpower", "crunch", "headsmash"],
		randomDoubleBattleMoves: ["liquidation", "aquajet", "superpower", "crunch", "doubleedge", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	basculinbluestriped: {
		randomBattleMoves: ["liquidation", "aquajet", "superpower", "crunch", "headsmash"],
		randomDoubleBattleMoves: ["liquidation", "aquajet", "superpower", "crunch", "doubleedge", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	sandile: {
		tier: "LC",
	},
	krokorok: {
		tier: "NFE",
	},
	krookodile: {
		randomBattleMoves: ["earthquake", "stoneedge", "pursuit", "knockoff", "stealthrock", "superpower"],
		randomDoubleBattleMoves: ["earthquake", "stoneedge", "protect", "knockoff", "superpower"],
		tier: "UU",
		doublesTier: "DUU",
	},
	darumaka: {
		tier: "LC",
	},
	darmanitan: {
		randomBattleMoves: ["uturn", "flareblitz", "rockslide", "earthquake", "superpower"],
		randomDoubleBattleMoves: ["uturn", "flareblitz", "firepunch", "rockslide", "earthquake", "superpower", "protect"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	maractus: {
		randomBattleMoves: ["spikes", "gigadrain", "leechseed", "hiddenpowerfire", "toxic", "suckerpunch", "spikyshield"],
		randomDoubleBattleMoves: ["grassyterrain", "gigadrain", "leechseed", "hiddenpowerfire", "helpinghand", "suckerpunch", "spikyshield"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	dwebble: {
		tier: "LC",
	},
	crustle: {
		randomBattleMoves: ["stealthrock", "spikes", "shellsmash", "earthquake", "rockblast", "xscissor", "stoneedge"],
		randomDoubleBattleMoves: ["protect", "shellsmash", "earthquake", "rockslide", "xscissor", "stoneedge"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	scraggy: {
		tier: "LC",
	},
	scrafty: {
		randomBattleMoves: ["dragondance", "icepunch", "highjumpkick", "drainpunch", "rest", "bulkup", "knockoff"],
		randomDoubleBattleMoves: ["fakeout", "drainpunch", "knockoff", "icepunch", "stoneedge", "protect"],
		tier: "NU",
		doublesTier: "DOU",
	},
	sigilyph: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "heatwave", "roost", "airslash", "icebeam"],
		randomDoubleBattleMoves: ["psyshock", "heatwave", "icebeam", "airslash", "energyball", "shadowball", "tailwind", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	yamask: {
		tier: "LC",
	},
	cofagrigus: {
		randomBattleMoves: ["nastyplot", "trickroom", "shadowball", "hiddenpowerfighting", "willowisp", "haze", "painsplit", "toxicspikes"],
		randomDoubleBattleMoves: ["nastyplot", "trickroom", "shadowball", "hiddenpowerfighting", "willowisp", "protect", "painsplit"],
		tier: "NUBL",
		doublesTier: "DUU",
	},
	tirtouga: {
		tier: "LC",
	},
	carracosta: {
		randomBattleMoves: ["shellsmash", "aquajet", "liquidation", "stoneedge", "earthquake"],
		randomDoubleBattleMoves: ["shellsmash", "aquajet", "liquidation", "stoneedge", "earthquake", "protect", "wideguard", "rockslide"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	archen: {
		tier: "LC",
	},
	archeops: {
		randomBattleMoves: ["headsmash", "acrobatics", "stoneedge", "earthquake", "aquatail", "uturn", "endeavor"],
		randomDoubleBattleMoves: ["stoneedge", "rockslide", "earthquake", "uturn", "acrobatics", "tailwind", "taunt", "protect"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	trubbish: {
		tier: "LC",
	},
	garbodor: {
		randomBattleMoves: ["spikes", "toxicspikes", "gunkshot", "haze", "painsplit", "toxic", "drainpunch"],
		randomDoubleBattleMoves: ["protect", "painsplit", "gunkshot", "seedbomb", "drainpunch", "explosion", "rockblast"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	zorua: {
		tier: "LC",
	},
	zoroark: {
		randomBattleMoves: ["suckerpunch", "darkpulse", "focusblast", "flamethrower", "uturn", "nastyplot", "knockoff", "trick", "sludgebomb"],
		randomDoubleBattleMoves: ["suckerpunch", "darkpulse", "focusblast", "flamethrower", "uturn", "nastyplot", "knockoff", "protect"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	minccino: {
		tier: "LC",
	},
	cinccino: {
		randomBattleMoves: ["tailslap", "bulletseed", "rockblast", "knockoff", "uturn"],
		randomDoubleBattleMoves: ["tailslap", "aquatail", "uturn", "knockoff", "bulletseed", "rockblast", "protect"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	gothita: {
		tier: "LC Uber",
	},
	gothorita: {
		tier: "NFE",
	},
	gothitelle: {
		randomBattleMoves: ["confide", "charm", "taunt", "rest"],
		randomDoubleBattleMoves: ["psychic", "thunderbolt", "shadowball", "hiddenpowerfighting", "reflect", "lightscreen", "psyshock", "energyball", "trickroom", "taunt", "healpulse", "protect"],
		tier: "(PU)",
		doublesTier: "DOU",
	},
	solosis: {
		tier: "LC",
	},
	duosion: {
		tier: "NFE",
	},
	reuniclus: {
		randomBattleMoves: ["calmmind", "recover", "psychic", "focusblast", "shadowball", "trickroom", "psyshock"],
		randomDoubleBattleMoves: ["energyball", "helpinghand", "psychic", "focusblast", "shadowball", "trickroom", "psyshock", "hiddenpowerfire", "protect"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	ducklett: {
		tier: "LC",
	},
	swanna: {
		randomBattleMoves: ["bravebird", "roost", "hurricane", "icebeam", "raindance", "defog", "scald"],
		randomDoubleBattleMoves: ["airslash", "roost", "hurricane", "surf", "icebeam", "raindance", "tailwind", "scald", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	vanillite: {
		tier: "LC",
	},
	vanillish: {
		tier: "NFE",
	},
	vanilluxe: {
		randomBattleMoves: ["blizzard", "explosion", "hiddenpowerground", "flashcannon", "autotomize", "freezedry"],
		randomDoubleBattleMoves: ["blizzard", "taunt", "hiddenpowerground", "flashcannon", "autotomize", "protect", "freezedry"],
		tier: "NUBL",
		doublesTier: "(DUU)",
	},
	deerling: {
		tier: "LC",
	},
	sawsbuck: {
		randomBattleMoves: ["swordsdance", "hornleech", "jumpkick", "return", "substitute"],
		randomDoubleBattleMoves: ["swordsdance", "hornleech", "jumpkick", "return", "substitute", "synthesis", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	emolga: {
		randomBattleMoves: ["thunderbolt", "acrobatics", "encore", "uturn", "knockoff", "roost", "toxic"],
		randomDoubleBattleMoves: ["helpinghand", "tailwind", "encore", "substitute", "thunderbolt", "airslash", "roost", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	karrablast: {
		tier: "LC",
	},
	escavalier: {
		randomBattleMoves: ["megahorn", "pursuit", "ironhead", "knockoff", "swordsdance", "drillrun"],
		randomDoubleBattleMoves: ["megahorn", "protect", "ironhead", "knockoff", "swordsdance", "drillrun"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	foongus: {
		tier: "LC",
	},
	amoonguss: {
		randomBattleMoves: ["spore", "stunspore", "gigadrain", "clearsmog", "hiddenpowerfire", "synthesis", "sludgebomb", "foulplay"],
		randomDoubleBattleMoves: ["spore", "stunspore", "gigadrain", "ragepowder", "hiddenpowerfire", "synthesis", "sludgebomb", "protect"],
		tier: "UU",
		doublesTier: "DOU",
	},
	frillish: {
		tier: "LC",
	},
	jellicent: {
		randomBattleMoves: ["scald", "willowisp", "recover", "toxic", "shadowball", "icebeam", "taunt"],
		randomDoubleBattleMoves: ["scald", "willowisp", "recover", "trickroom", "shadowball", "icebeam", "waterspout", "icywind", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	alomomola: {
		randomBattleMoves: ["wish", "protect", "knockoff", "toxic", "scald"],
		randomDoubleBattleMoves: ["wish", "protect", "knockoff", "icywind", "scald", "helpinghand", "wideguard"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	joltik: {
		tier: "LC",
	},
	galvantula: {
		randomBattleMoves: ["thunder", "hiddenpowerice", "gigadrain", "bugbuzz", "voltswitch", "stickyweb"],
		randomDoubleBattleMoves: ["thunder", "hiddenpowerice", "gigadrain", "bugbuzz", "voltswitch", "stickyweb", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	ferroseed: {
		tier: "PU",
		doublesTier: "LC",
	},
	ferrothorn: {
		randomBattleMoves: ["spikes", "stealthrock", "leechseed", "powerwhip", "protect", "knockoff", "gyroball"],
		randomDoubleBattleMoves: ["gyroball", "stealthrock", "leechseed", "powerwhip", "knockoff", "protect"],
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
		randomBattleMoves: ["shiftgear", "return", "geargrind", "wildcharge", "substitute"],
		randomDoubleBattleMoves: ["shiftgear", "return", "geargrind", "wildcharge", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	tynamo: {
		tier: "LC",
	},
	eelektrik: {
		tier: "NFE",
	},
	eelektross: {
		randomBattleMoves: ["thunderbolt", "flamethrower", "uturn", "gigadrain", "knockoff", "superpower", "hiddenpowerice"],
		randomDoubleBattleMoves: ["thunderbolt", "flamethrower", "uturn", "voltswitch", "knockoff", "gigadrain", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	elgyem: {
		tier: "LC",
	},
	beheeyem: {
		randomBattleMoves: ["nastyplot", "psychic", "psyshock", "thunderbolt", "hiddenpowerfighting", "trick", "trickroom", "signalbeam"],
		randomDoubleBattleMoves: ["nastyplot", "psychic", "thunderbolt", "hiddenpowerfighting", "recover", "trick", "trickroom", "signalbeam", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	litwick: {
		tier: "LC",
	},
	lampent: {
		tier: "NFE",
	},
	chandelure: {
		randomBattleMoves: ["calmmind", "shadowball", "energyball", "fireblast", "hiddenpowerground", "trick", "substitute", "painsplit"],
		randomDoubleBattleMoves: ["shadowball", "energyball", "overheat", "heatwave", "hiddenpowerice", "trick", "protect"],
		tier: "UU",
		doublesTier: "DUU",
	},
	axew: {
		tier: "LC",
	},
	fraxure: {
		tier: "NFE",
	},
	haxorus: {
		randomBattleMoves: ["dragondance", "swordsdance", "outrage", "earthquake", "poisonjab", "taunt"],
		randomDoubleBattleMoves: ["dragondance", "swordsdance", "protect", "dragonclaw", "earthquake", "poisonjab", "taunt"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	cubchoo: {
		tier: "LC",
	},
	beartic: {
		randomBattleMoves: ["iciclecrash", "superpower", "nightslash", "stoneedge", "swordsdance", "aquajet"],
		randomDoubleBattleMoves: ["iciclecrash", "superpower", "nightslash", "stoneedge", "swordsdance", "aquajet", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	cryogonal: {
		randomBattleMoves: ["icebeam", "recover", "toxic", "rapidspin", "haze", "freezedry", "hiddenpowerground"],
		randomDoubleBattleMoves: ["icebeam", "recover", "icywind", "protect", "reflect", "freezedry", "hiddenpowerground"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	shelmet: {
		tier: "LC",
	},
	accelgor: {
		randomBattleMoves: ["spikes", "yawn", "bugbuzz", "focusblast", "energyball", "hiddenpowerrock", "encore", "toxicspikes"],
		randomDoubleBattleMoves: ["protect", "yawn", "bugbuzz", "focusblast", "gigadrain", "hiddenpowerrock", "encore", "sludgebomb"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	stunfisk: {
		randomBattleMoves: ["discharge", "earthpower", "scald", "toxic", "rest", "sleeptalk", "stealthrock"],
		randomDoubleBattleMoves: ["discharge", "earthpower", "scald", "electroweb", "protect", "stealthrock"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	mienfoo: {
		tier: "LC",
	},
	mienshao: {
		randomBattleMoves: ["uturn", "fakeout", "highjumpkick", "stoneedge", "poisonjab", "swordsdance", "knockoff"],
		randomDoubleBattleMoves: ["uturn", "fakeout", "highjumpkick", "stoneedge", "drainpunch", "swordsdance", "wideguard", "knockoff", "feint", "protect"],
		tier: "RUBL",
		doublesTier: "DUU",
	},
	druddigon: {
		randomBattleMoves: ["outrage", "earthquake", "suckerpunch", "dragontail", "taunt", "glare", "stealthrock", "gunkshot", "firepunch"],
		randomDoubleBattleMoves: ["superpower", "earthquake", "suckerpunch", "dragonclaw", "glare", "protect", "firepunch", "thunderpunch"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	golett: {
		tier: "LC",
	},
	golurk: {
		randomBattleMoves: ["earthquake", "shadowpunch", "dynamicpunch", "icepunch", "stealthrock", "rockpolish"],
		randomDoubleBattleMoves: ["earthquake", "shadowpunch", "dynamicpunch", "icepunch", "stoneedge", "protect", "rockpolish"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	pawniard: {
		tier: "LC",
	},
	bisharp: {
		randomBattleMoves: ["swordsdance", "knockoff", "ironhead", "suckerpunch", "lowkick"],
		randomDoubleBattleMoves: ["swordsdance", "substitute", "suckerpunch", "ironhead", "brickbreak", "knockoff", "protect"],
		tier: "UU",
		doublesTier: "DUU",
	},
	bouffalant: {
		randomBattleMoves: ["headcharge", "earthquake", "stoneedge", "megahorn", "swordsdance", "superpower"],
		randomDoubleBattleMoves: ["headcharge", "earthquake", "stoneedge", "megahorn", "swordsdance", "superpower", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	rufflet: {
		tier: "LC",
	},
	braviary: {
		randomBattleMoves: ["bravebird", "superpower", "return", "uturn", "substitute", "bulkup", "roost"],
		randomDoubleBattleMoves: ["bravebird", "superpower", "return", "uturn", "tailwind", "rockslide", "bulkup", "roost", "skydrop", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	vullaby: {
		tier: "LC",
	},
	mandibuzz: {
		randomBattleMoves: ["foulplay", "bravebird", "roost", "taunt", "toxic", "uturn", "defog"],
		randomDoubleBattleMoves: ["knockoff", "roost", "taunt", "tailwind", "snarl", "uturn", "bravebird", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	heatmor: {
		randomBattleMoves: ["fireblast", "suckerpunch", "focusblast", "gigadrain", "knockoff"],
		randomDoubleBattleMoves: ["fireblast", "suckerpunch", "focusblast", "gigadrain", "heatwave", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	durant: {
		randomBattleMoves: ["honeclaws", "ironhead", "xscissor", "rockslide", "superpower"],
		randomDoubleBattleMoves: ["honeclaws", "ironhead", "xscissor", "rockslide", "protect", "superpower"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	deino: {
		tier: "LC",
	},
	zweilous: {
		tier: "NFE",
	},
	hydreigon: {
		randomBattleMoves: ["uturn", "dracometeor", "dragonpulse", "earthpower", "fireblast", "darkpulse", "roost", "flashcannon", "superpower"],
		randomDoubleBattleMoves: ["uturn", "dracometeor", "dragonpulse", "earthpower", "fireblast", "darkpulse", "roost", "flashcannon", "superpower", "tailwind", "protect"],
		tier: "UU",
		doublesTier: "DUU",
	},
	larvesta: {
		tier: "LC",
	},
	volcarona: {
		randomBattleMoves: ["quiverdance", "fierydance", "fireblast", "bugbuzz", "roost", "gigadrain", "hiddenpowerice", "hiddenpowerground"],
		randomDoubleBattleMoves: ["quiverdance", "fierydance", "fireblast", "bugbuzz", "roost", "gigadrain", "hiddenpowerice", "heatwave", "willowisp", "ragepowder", "tailwind", "protect"],
		tier: "OU",
		doublesTier: "DOU",
	},
	cobalion: {
		randomBattleMoves: ["closecombat", "ironhead", "swordsdance", "substitute", "stoneedge", "voltswitch", "hiddenpowerice", "taunt", "stealthrock"],
		randomDoubleBattleMoves: ["closecombat", "ironhead", "swordsdance", "substitute", "stoneedge", "thunderwave", "protect"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	terrakion: {
		randomBattleMoves: ["swordsdance", "closecombat", "stoneedge", "earthquake", "stealthrock", "quickattack"],
		randomDoubleBattleMoves: ["stoneedge", "closecombat", "substitute", "rockslide", "earthquake", "taunt", "protect"],
		tier: "UU",
		doublesTier: "DOU",
	},
	virizion: {
		randomBattleMoves: ["swordsdance", "closecombat", "leafblade", "stoneedge", "calmmind", "focusblast", "gigadrain", "hiddenpowerice", "substitute"],
		randomDoubleBattleMoves: ["taunt", "closecombat", "stoneedge", "leafblade", "swordsdance", "synthesis", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	tornadus: {
		randomBattleMoves: ["hurricane", "heatwave", "superpower", "grassknot", "uturn", "defog", "tailwind"],
		randomDoubleBattleMoves: ["hurricane", "airslash", "uturn", "superpower", "focusblast", "taunt", "substitute", "heatwave", "tailwind", "protect", "skydrop"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	tornadustherian: {
		randomBattleMoves: ["hurricane", "heatwave", "knockoff", "superpower", "uturn", "taunt"],
		randomDoubleBattleMoves: ["hurricane", "airslash", "focusblast", "uturn", "heatwave", "skydrop", "tailwind", "taunt", "protect"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	thundurus: {
		randomBattleMoves: ["thunderwave", "nastyplot", "thunderbolt", "hiddenpowerice", "hiddenpowerflying", "focusblast", "substitute", "knockoff", "taunt"],
		randomDoubleBattleMoves: ["thunderwave", "nastyplot", "thunderbolt", "hiddenpowerice", "hiddenpowerflying", "focusblast", "substitute", "knockoff", "taunt", "protect"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	thundurustherian: {
		randomBattleMoves: ["nastyplot", "thunderbolt", "hiddenpowerflying", "hiddenpowerice", "focusblast", "voltswitch"],
		randomDoubleBattleMoves: ["nastyplot", "thunderbolt", "hiddenpowerflying", "hiddenpowerice", "focusblast", "voltswitch", "protect"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	reshiram: {
		randomBattleMoves: ["blueflare", "dracometeor", "dragonpulse", "toxic", "flamecharge", "stoneedge", "roost"],
		randomDoubleBattleMoves: ["blueflare", "dracometeor", "dragonpulse", "heatwave", "flamecharge", "roost", "protect", "tailwind"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	zekrom: {
		randomBattleMoves: ["boltstrike", "outrage", "dragonclaw", "dracometeor", "voltswitch", "honeclaws", "substitute", "roost"],
		randomDoubleBattleMoves: ["voltswitch", "protect", "dragonclaw", "boltstrike", "honeclaws", "substitute", "dracometeor", "fusionbolt", "roost", "tailwind"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	landorus: {
		randomBattleMoves: ["calmmind", "rockpolish", "earthpower", "focusblast", "psychic", "sludgewave", "stealthrock", "knockoff", "rockslide"],
		randomDoubleBattleMoves: ["earthpower", "focusblast", "hiddenpowerice", "psychic", "sludgebomb", "rockslide", "protect"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	landorustherian: {
		randomBattleMoves: ["swordsdance", "rockpolish", "earthquake", "stoneedge", "uturn", "superpower", "stealthrock", "fly"],
		randomDoubleBattleMoves: ["rockslide", "earthquake", "stoneedge", "uturn", "superpower", "knockoff", "protect"],
		tier: "OU",
		doublesTier: "DOU",
	},
	kyurem: {
		randomBattleMoves: ["dracometeor", "icebeam", "earthpower", "outrage", "substitute", "focusblast", "roost"],
		randomDoubleBattleMoves: ["substitute", "icebeam", "dracometeor", "dragonpulse", "focusblast", "glaciate", "earthpower", "roost", "protect"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	kyuremblack: {
		randomBattleMoves: ["outrage", "fusionbolt", "icebeam", "roost", "substitute", "earthpower", "dragonclaw"],
		randomDoubleBattleMoves: ["protect", "fusionbolt", "icebeam", "roost", "substitute", "honeclaws", "earthpower", "dragonclaw"],
		tier: "OU",
		doublesTier: "DOU",
	},
	kyuremwhite: {
		randomBattleMoves: ["dracometeor", "icebeam", "fusionflare", "earthpower", "focusblast", "dragonpulse", "substitute", "roost", "toxic"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "icebeam", "fusionflare", "earthpower", "focusblast", "roost", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	keldeo: {
		randomBattleMoves: ["hydropump", "secretsword", "calmmind", "hiddenpowerflying", "hiddenpowerelectric", "substitute", "scald", "icywind"],
		randomDoubleBattleMoves: ["hydropump", "secretsword", "protect", "hiddenpowerflying", "hiddenpowerelectric", "substitute", "surf", "icywind", "taunt"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	keldeoresolute: {
		tier: "OU",
		doublesTier: "(DUU)",
	},
	meloetta: {
		randomBattleMoves: ["uturn", "calmmind", "psyshock", "hypervoice", "shadowball", "focusblast"],
		randomDoubleBattleMoves: ["calmmind", "psyshock", "thunderbolt", "hypervoice", "shadowball", "focusblast", "protect"],
		tier: "RUBL",
		doublesTier: "(DUU)",
	},
	meloettapirouette: {
		randomBattleMoves: ["relicsong", "closecombat", "knockoff", "return"],
		randomDoubleBattleMoves: ["relicsong", "closecombat", "knockoff", "return", "protect"],
	},
	genesect: {
		randomBattleMoves: ["technoblast", "uturn", "icebeam", "flamethrower", "thunderbolt", "ironhead", "shiftgear", "extremespeed", "blazekick"],
		randomDoubleBattleMoves: ["uturn", "bugbuzz", "icebeam", "flamethrower", "thunderbolt", "ironhead", "shiftgear", "extremespeed", "blazekick", "protect"],
		tier: "Uber",
		doublesTier: "DOU",
	},
	genesectburn: {
		tier: "Uber",
		doublesTier: "(DOU)",
	},
	genesectchill: {
		tier: "Uber",
		doublesTier: "(DOU)",
	},
	genesectdouse: {
		tier: "Uber",
		doublesTier: "(DOU)",
	},
	genesectshock: {
		tier: "Uber",
		doublesTier: "(DOU)",
	},
	chespin: {
		tier: "LC",
	},
	quilladin: {
		tier: "NFE",
	},
	chesnaught: {
		randomBattleMoves: ["leechseed", "synthesis", "spikes", "drainpunch", "spikyshield", "woodhammer"],
		randomDoubleBattleMoves: ["leechseed", "synthesis", "hammerarm", "spikyshield", "stoneedge", "woodhammer", "rockslide"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	fennekin: {
		tier: "LC",
	},
	braixen: {
		tier: "NFE",
	},
	delphox: {
		randomBattleMoves: ["calmmind", "fireblast", "psyshock", "grassknot", "switcheroo", "shadowball"],
		randomDoubleBattleMoves: ["calmmind", "fireblast", "psyshock", "grassknot", "switcheroo", "shadowball", "heatwave", "dazzlinggleam", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	froakie: {
		tier: "LC",
	},
	frogadier: {
		tier: "NFE",
	},
	greninja: {
		randomBattleMoves: ["hydropump", "icebeam", "gunkshot", "uturn", "spikes", "toxicspikes", "taunt"],
		randomDoubleBattleMoves: ["hydropump", "uturn", "surf", "icebeam", "matblock", "taunt", "darkpulse", "protect"],
		tier: "OU",
		doublesTier: "DUU",
	},
	greninjaash: {
		randomBattleMoves: ["hydropump", "icebeam", "darkpulse", "watershuriken", "uturn"],
		tier: "OU",
		doublesTier: "DUU",
	},
	bunnelby: {
		tier: "LC",
	},
	diggersby: {
		randomBattleMoves: ["earthquake", "return", "wildcharge", "uturn", "swordsdance", "quickattack", "knockoff", "agility"],
		randomDoubleBattleMoves: ["earthquake", "uturn", "return", "wildcharge", "protect", "quickattack"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	fletchling: {
		tier: "LC",
	},
	fletchinder: {
		tier: "NFE",
	},
	talonflame: {
		randomBattleMoves: ["bravebird", "flareblitz", "roost", "swordsdance", "uturn", "willowisp", "overheat"],
		randomDoubleBattleMoves: ["bravebird", "flareblitz", "roost", "swordsdance", "uturn", "willowisp", "tailwind", "taunt", "protect"],
		tier: "RUBL",
		doublesTier: "DUU",
	},
	scatterbug: {
		tier: "LC",
	},
	spewpa: {
		tier: "NFE",
	},
	vivillon: {
		randomBattleMoves: ["sleeppowder", "quiverdance", "hurricane", "energyball", "substitute"],
		randomDoubleBattleMoves: ["sleeppowder", "quiverdance", "hurricane", "bugbuzz", "roost", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	vivillonfancy: {
		tier: "NU",
		doublesTier: "(DUU)",
	},
	vivillonpokeball: {
		tier: "NU",
		doublesTier: "(DUU)",
	},
	litleo: {
		tier: "LC",
	},
	pyroar: {
		randomBattleMoves: ["sunnyday", "fireblast", "hypervoice", "solarbeam", "willowisp", "darkpulse"],
		randomDoubleBattleMoves: ["hypervoice", "fireblast", "willowisp", "protect", "sunnyday", "solarbeam"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	flabebe: {
		tier: "LC",
	},
	floette: {
		tier: "NFE",
	},
	floetteeternal: {
		randomBattleMoves: ["lightofruin", "psychic", "hiddenpowerfire", "hiddenpowerground", "moonblast"],
		randomDoubleBattleMoves: ["lightofruin", "dazzlinggleam", "wish", "psychic", "aromatherapy", "protect", "calmmind"],
		isNonstandard: "Unobtainable",
		tier: "Illegal",
	},
	florges: {
		randomBattleMoves: ["calmmind", "moonblast", "synthesis", "aromatherapy", "wish", "toxic", "protect", "defog"],
		randomDoubleBattleMoves: ["moonblast", "dazzlinggleam", "wish", "psychic", "aromatherapy", "protect", "calmmind", "defog"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	skiddo: {
		tier: "LC",
	},
	gogoat: {
		randomBattleMoves: ["bulkup", "hornleech", "earthquake", "rockslide", "substitute", "leechseed", "milkdrink"],
		randomDoubleBattleMoves: ["hornleech", "earthquake", "brickbreak", "bulkup", "leechseed", "milkdrink", "rockslide", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pancham: {
		tier: "LC",
	},
	pangoro: {
		randomBattleMoves: ["knockoff", "superpower", "gunkshot", "icepunch", "partingshot", "drainpunch"],
		randomDoubleBattleMoves: ["partingshot", "hammerarm", "crunch", "circlethrow", "icepunch", "earthquake", "poisonjab", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	furfrou: {
		randomBattleMoves: ["return", "cottonguard", "thunderwave", "substitute", "toxic", "suckerpunch", "uturn", "rest"],
		randomDoubleBattleMoves: ["return", "cottonguard", "uturn", "thunderwave", "suckerpunch", "snarl", "wildcharge", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	espurr: {
		tier: "LC",
	},
	meowstic: {
		randomBattleMoves: ["toxic", "yawn", "thunderwave", "psychic", "reflect", "lightscreen", "healbell"],
		randomDoubleBattleMoves: ["fakeout", "thunderwave", "psychic", "reflect", "lightscreen", "safeguard", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	meowsticf: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "shadowball", "energyball", "thunderbolt"],
		randomDoubleBattleMoves: ["psyshock", "darkpulse", "fakeout", "energyball", "signalbeam", "thunderbolt", "protect", "helpinghand"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	honedge: {
		tier: "LC",
	},
	doublade: {
		randomBattleMoves: ["swordsdance", "shadowclaw", "shadowsneak", "ironhead", "sacredsword"],
		randomDoubleBattleMoves: ["swordsdance", "shadowclaw", "shadowsneak", "ironhead", "sacredsword", "rockslide", "protect"],
		tier: "UU",
		doublesTier: "NFE",
	},
	aegislash: {
		randomBattleMoves: ["kingsshield", "swordsdance", "shadowclaw", "sacredsword", "ironhead", "shadowsneak", "hiddenpowerice", "shadowball", "flashcannon"],
		randomDoubleBattleMoves: ["kingsshield", "swordsdance", "shadowclaw", "sacredsword", "ironhead", "shadowsneak", "wideguard", "hiddenpowerice", "shadowball", "flashcannon"],
		tier: "Uber",
		doublesTier: "DOU",
	},
	spritzee: {
		tier: "LC",
	},
	aromatisse: {
		randomBattleMoves: ["wish", "protect", "moonblast", "aromatherapy", "reflect", "lightscreen"],
		randomDoubleBattleMoves: ["moonblast", "aromatherapy", "wish", "trickroom", "thunderbolt", "protect", "healpulse"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	swirlix: {
		tier: "LC Uber",
	},
	slurpuff: {
		randomBattleMoves: ["bellydrum", "playrough", "return", "drainpunch"],
		randomDoubleBattleMoves: ["bellydrum", "playrough", "return", "drainpunch", "dazzlinggleam", "surf", "psychic", "flamethrower", "protect"],
		tier: "NUBL",
		doublesTier: "(DUU)",
	},
	inkay: {
		tier: "LC",
	},
	malamar: {
		randomBattleMoves: ["superpower", "knockoff", "psychocut", "rest", "sleeptalk", "happyhour"],
		randomDoubleBattleMoves: ["superpower", "psychocut", "rockslide", "trickroom", "knockoff", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	binacle: {
		tier: "LC",
	},
	barbaracle: {
		randomBattleMoves: ["shellsmash", "stoneedge", "liquidation", "earthquake", "crosschop", "stealthrock"],
		randomDoubleBattleMoves: ["shellsmash", "liquidation", "earthquake", "crosschop", "rockslide", "protect"],
		tier: "NUBL",
		doublesTier: "(DUU)",
	},
	skrelp: {
		tier: "LC",
	},
	dragalge: {
		randomBattleMoves: ["dracometeor", "sludgewave", "focusblast", "scald", "hiddenpowerfire", "toxicspikes", "dragonpulse"],
		randomDoubleBattleMoves: ["dracometeor", "sludgebomb", "focusblast", "scald", "hiddenpowerfire", "protect", "dragonpulse"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	clauncher: {
		tier: "LC",
	},
	clawitzer: {
		randomBattleMoves: ["scald", "waterpulse", "darkpulse", "aurasphere", "icebeam", "uturn"],
		randomDoubleBattleMoves: ["waterpulse", "icebeam", "uturn", "darkpulse", "aurasphere", "muddywater", "helpinghand", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	helioptile: {
		tier: "LC",
	},
	heliolisk: {
		randomBattleMoves: ["raindance", "hypervoice", "surf", "darkpulse", "hiddenpowerice", "voltswitch", "thunderbolt"],
		randomDoubleBattleMoves: ["surf", "voltswitch", "hiddenpowerice", "raindance", "thunder", "darkpulse", "thunderbolt", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	tyrunt: {
		tier: "LC",
	},
	tyrantrum: {
		randomBattleMoves: ["stealthrock", "dragondance", "dragonclaw", "earthquake", "superpower", "outrage", "headsmash"],
		randomDoubleBattleMoves: ["rockslide", "dragondance", "headsmash", "dragonclaw", "earthquake", "icefang", "firefang", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	amaura: {
		tier: "LC",
	},
	aurorus: {
		randomBattleMoves: ["ancientpower", "blizzard", "thunderwave", "earthpower", "freezedry", "hypervoice", "stealthrock"],
		randomDoubleBattleMoves: ["hypervoice", "ancientpower", "thunderwave", "flashcannon", "freezedry", "icywind", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	sylveon: {
		randomBattleMoves: ["hypervoice", "calmmind", "psyshock", "hiddenpowerfire", "wish", "protect"],
		randomDoubleBattleMoves: ["hypervoice", "calmmind", "wish", "protect", "psyshock", "helpinghand", "shadowball", "hiddenpowerground"],
		tier: "UU",
		doublesTier: "DUU",
	},
	hawlucha: {
		randomBattleMoves: ["substitute", "swordsdance", "highjumpkick", "acrobatics", "roost", "stoneedge"],
		randomDoubleBattleMoves: ["swordsdance", "highjumpkick", "uturn", "stoneedge", "skydrop", "encore", "protect"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	dedenne: {
		randomBattleMoves: ["substitute", "recycle", "thunderbolt", "nuzzle", "grassknot", "hiddenpowerice", "toxic"],
		randomDoubleBattleMoves: ["voltswitch", "thunderbolt", "nuzzle", "grassknot", "hiddenpowerice", "uturn", "helpinghand", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	carbink: {
		randomBattleMoves: ["stealthrock", "lightscreen", "reflect", "explosion", "powergem", "moonblast"],
		randomDoubleBattleMoves: ["trickroom", "lightscreen", "reflect", "explosion", "powergem", "moonblast", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	goomy: {
		tier: "LC",
	},
	sliggoo: {
		tier: "NFE",
	},
	goodra: {
		randomBattleMoves: ["dracometeor", "dragonpulse", "fireblast", "sludgebomb", "thunderbolt", "earthquake", "dragontail"],
		randomDoubleBattleMoves: ["thunderbolt", "icebeam", "dragonpulse", "fireblast", "muddywater", "dracometeor", "focusblast", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	klefki: {
		randomBattleMoves: ["reflect", "lightscreen", "spikes", "magnetrise", "playrough", "thunderwave", "foulplay", "toxic"],
		randomDoubleBattleMoves: ["reflect", "lightscreen", "safeguard", "playrough", "substitute", "thunderwave", "protect", "flashcannon", "dazzlinggleam"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	phantump: {
		tier: "LC",
	},
	trevenant: {
		randomBattleMoves: ["hornleech", "shadowclaw", "earthquake", "rockslide", "woodhammer", "trickroom"],
		randomDoubleBattleMoves: ["hornleech", "woodhammer", "leechseed", "shadowclaw", "willowisp", "trickroom", "earthquake", "rockslide", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	pumpkaboo: {
		tier: "LC",
	},
	pumpkaboosmall: {
		tier: "LC",
	},
	pumpkaboolarge: {
		tier: "LC",
	},
	pumpkaboosuper: {
		tier: "LC",
	},
	gourgeist: {
		randomBattleMoves: ["willowisp", "seedbomb", "leechseed", "shadowsneak", "substitute", "synthesis"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "painsplit", "seedbomb", "leechseed", "phantomforce", "explosion", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	gourgeistsmall: {
		randomBattleMoves: ["willowisp", "seedbomb", "leechseed", "shadowsneak", "substitute", "synthesis"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "painsplit", "seedbomb", "leechseed", "phantomforce", "explosion", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	gourgeistlarge: {
		randomBattleMoves: ["willowisp", "seedbomb", "leechseed", "shadowsneak", "substitute", "synthesis"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "painsplit", "seedbomb", "leechseed", "phantomforce", "explosion", "protect", "trickroom"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	gourgeistsuper: {
		randomBattleMoves: ["willowisp", "seedbomb", "leechseed", "shadowsneak", "substitute", "synthesis"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "painsplit", "seedbomb", "leechseed", "phantomforce", "explosion", "protect", "trickroom"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	bergmite: {
		tier: "LC",
	},
	avalugg: {
		randomBattleMoves: ["avalanche", "recover", "toxic", "rapidspin", "roar", "earthquake"],
		randomDoubleBattleMoves: ["avalanche", "recover", "earthquake", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	noibat: {
		tier: "LC",
	},
	noivern: {
		randomBattleMoves: ["dracometeor", "hurricane", "flamethrower", "boomburst", "switcheroo", "uturn", "roost", "taunt"],
		randomDoubleBattleMoves: ["airslash", "hurricane", "dragonpulse", "dracometeor", "focusblast", "flamethrower", "uturn", "roost", "boomburst", "switcheroo", "tailwind", "taunt", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	xerneas: {
		randomBattleMoves: ["geomancy", "moonblast", "focusblast", "thunderbolt", "hiddenpowerfire", "psyshock", "rockslide", "closecombat"],
		randomDoubleBattleMoves: ["geomancy", "dazzlinggleam", "thunder", "focusblast", "thunderbolt", "hiddenpowerfire", "psyshock", "rockslide", "closecombat", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	yveltal: {
		randomBattleMoves: ["darkpulse", "oblivionwing", "focusblast", "uturn", "foulplay", "suckerpunch", "toxic", "taunt", "roost"],
		randomDoubleBattleMoves: ["darkpulse", "oblivionwing", "taunt", "focusblast", "hurricane", "roost", "suckerpunch", "snarl", "skydrop", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	zygarde: {
		randomBattleMoves: ["dragondance", "thousandarrows", "outrage", "extremespeed", "irontail"],
		randomDoubleBattleMoves: ["dragondance", "thousandarrows", "extremespeed", "rockslide", "coil", "stoneedge", "glare", "protect"],
		tier: "Uber",
		doublesTier: "DOU",
	},
	zygarde10: {
		randomBattleMoves: ["dragondance", "thousandarrows", "outrage", "extremespeed", "irontail", "substitute"],
		randomDoubleBattleMoves: ["dragondance", "thousandarrows", "extremespeed", "irontail", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	zygardecomplete: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	diancie: {
		randomBattleMoves: ["reflect", "lightscreen", "stealthrock", "diamondstorm", "moonblast", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["diamondstorm", "moonblast", "reflect", "lightscreen", "safeguard", "substitute", "calmmind", "psychic", "dazzlinggleam", "protect"],
		tier: "RU",
		doublesTier: "DOU",
	},
	dianciemega: {
		randomBattleMoves: ["calmmind", "moonblast", "earthpower", "hiddenpowerfire", "diamondstorm"],
		randomDoubleBattleMoves: ["diamondstorm", "moonblast", "calmmind", "psyshock", "earthpower", "hiddenpowerfire", "dazzlinggleam", "protect"],
		tier: "OU",
		doublesTier: "DOU",
	},
	hoopa: {
		randomBattleMoves: ["nastyplot", "psyshock", "shadowball", "focusblast", "trick"],
		randomDoubleBattleMoves: ["hyperspacehole", "shadowball", "focusblast", "protect", "psychic", "trickroom"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	hoopaunbound: {
		randomBattleMoves: ["nastyplot", "substitute", "psychic", "darkpulse", "focusblast", "hyperspacefury", "zenheadbutt", "icepunch", "drainpunch", "gunkshot", "trick"],
		randomDoubleBattleMoves: ["psychic", "darkpulse", "focusblast", "protect", "hyperspacefury", "zenheadbutt", "icepunch", "drainpunch", "gunkshot"],
		tier: "UUBL",
		doublesTier: "DOU",
	},
	volcanion: {
		randomBattleMoves: ["substitute", "steameruption", "fireblast", "sludgebomb", "earthpower", "superpower"],
		randomDoubleBattleMoves: ["substitute", "steameruption", "heatwave", "sludgebomb", "rockslide", "earthquake", "protect"],
		tier: "UU",
		doublesTier: "DOU",
	},
	rowlet: {
		tier: "LC",
	},
	dartrix: {
		tier: "NFE",
	},
	decidueye: {
		randomBattleMoves: ["spiritshackle", "uturn", "leafblade", "roost", "swordsdance", "suckerpunch"],
		randomDoubleBattleMoves: ["spiritshackle", "leafblade", "bravebird", "protect", "suckerpunch"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	litten: {
		tier: "LC",
	},
	torracat: {
		tier: "NFE",
	},
	incineroar: {
		randomBattleMoves: ["fakeout", "darkestlariat", "flareblitz", "uturn", "earthquake", "knockoff"],
		randomDoubleBattleMoves: ["fakeout", "darkestlariat", "flareblitz", "crosschop", "willowisp", "taunt", "snarl"],
		tier: "NU",
		doublesTier: "DOU",
	},
	popplio: {
		tier: "LC",
	},
	brionne: {
		tier: "NFE",
	},
	primarina: {
		randomBattleMoves: ["hydropump", "moonblast", "scald", "psychic", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["hypervoice", "moonblast", "substitute", "protect", "icebeam"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	pikipek: {
		tier: "LC",
	},
	trumbeak: {
		tier: "NFE",
	},
	toucannon: {
		randomBattleMoves: ["boomburst", "beakblast", "roost", "brickbreak", "bulletseed"],
		randomDoubleBattleMoves: ["bulletseed", "rockblast", "bravebird", "tailwind", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	yungoos: {
		tier: "LC",
	},
	gumshoos: {
		randomBattleMoves: ["uturn", "return", "crunch", "earthquake", "firepunch"],
		randomDoubleBattleMoves: ["uturn", "return", "superfang", "protect", "crunch"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	gumshoostotem: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	grubbin: {
		tier: "LC",
	},
	charjabug: {
		tier: "NFE",
	},
	vikavolt: {
		randomBattleMoves: ["agility", "bugbuzz", "thunderbolt", "voltswitch", "energyball", "hiddenpowerice"],
		randomDoubleBattleMoves: ["thunderbolt", "bugbuzz", "stringshot", "protect", "voltswitch", "hiddenpowerice"],
		tier: "NU",
		doublesTier: "DUU",
	},
	vikavolttotem: {
		tier: "NU",
		doublesTier: "DUU",
	},
	crabrawler: {
		tier: "LC",
	},
	crabominable: {
		randomBattleMoves: ["icehammer", "closecombat", "earthquake", "stoneedge"],
		randomDoubleBattleMoves: ["icehammer", "closecombat", "stoneedge", "protect", "wideguard", "earthquake"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	oricorio: {
		randomBattleMoves: ["calmmind", "revelationdance", "hurricane", "toxic", "roost", "uturn"],
		randomDoubleBattleMoves: ["revelationdance", "airslash", "hurricane", "tailwind", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	oricoriopompom: {
		randomBattleMoves: ["calmmind", "revelationdance", "hurricane", "toxic", "roost", "uturn"],
		randomDoubleBattleMoves: ["revelationdance", "airslash", "hurricane", "tailwind", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	oricoriopau: {
		randomBattleMoves: ["calmmind", "revelationdance", "hurricane", "toxic", "roost", "uturn"],
		randomDoubleBattleMoves: ["revelationdance", "airslash", "hurricane", "tailwind", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	oricoriosensu: {
		randomBattleMoves: ["calmmind", "revelationdance", "hurricane", "toxic", "roost", "uturn"],
		randomDoubleBattleMoves: ["revelationdance", "airslash", "hurricane", "tailwind", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	cutiefly: {
		tier: "LC Uber",
	},
	ribombee: {
		randomBattleMoves: ["quiverdance", "bugbuzz", "moonblast", "hiddenpowerfire", "roost"],
		randomDoubleBattleMoves: ["quiverdance", "pollenpuff", "moonblast", "protect", "batonpass"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	ribombeetotem: {
		tier: "RU",
		doublesTier: "(DUU)",
	},
	rockruff: {
		tier: "LC",
	},
	rockruffdusk: {
		tier: "LC",
	},
	lycanroc: {
		randomBattleMoves: ["swordsdance", "accelerock", "stoneedge", "drillrun", "firefang"],
		randomDoubleBattleMoves: ["accelerock", "stoneedge", "crunch", "firefang", "protect", "taunt"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	lycanrocmidnight: {
		randomBattleMoves: ["stoneedge", "stealthrock", "suckerpunch", "swordsdance", "firepunch"],
		randomDoubleBattleMoves: ["stoneedge", "suckerpunch", "swordsdance", "protect", "taunt"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	lycanrocdusk: {
		randomBattleMoves: ["swordsdance", "accelerock", "stoneedge", "drillrun", "firefang", "return"],
		randomDoubleBattleMoves: ["accelerock", "stoneedge", "rockslide", "drillrun", "firefang", "protect"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	wishiwashi: {
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	wishiwashischool: {
		randomBattleMoves: ["scald", "hydropump", "icebeam", "hiddenpowergrass", "earthquake"],
		randomDoubleBattleMoves: ["hydropump", "icebeam", "endeavor", "protect", "hiddenpowergrass", "earthquake", "helpinghand"],
	},
	mareanie: {
		tier: "LC",
	},
	toxapex: {
		randomBattleMoves: ["toxicspikes", "banefulbunker", "recover", "scald", "haze"],
		randomDoubleBattleMoves: ["scald", "banefulbunker", "haze", "wideguard", "lightscreen"],
		tier: "OU",
		doublesTier: "(DUU)",
	},
	mudbray: {
		tier: "LC",
	},
	mudsdale: {
		randomBattleMoves: ["earthquake", "closecombat", "rockslide", "heavyslam", "stealthrock"],
		randomDoubleBattleMoves: ["highhorsepower", "heavyslam", "closecombat", "rockslide", "protect", "earthquake", "rocktomb"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	dewpider: {
		tier: "LC",
	},
	araquanid: {
		randomBattleMoves: ["liquidation", "lunge", "toxic", "mirrorcoat", "stickyweb"],
		randomDoubleBattleMoves: ["liquidation", "leechlife", "lunge", "poisonjab", "protect", "wideguard"],
		tier: "RU",
		doublesTier: "DUU",
	},
	araquanidtotem: {
		tier: "RU",
		doublesTier: "DUU",
	},
	fomantis: {
		tier: "LC",
	},
	lurantis: {
		randomBattleMoves: ["leafstorm", "hiddenpowerice", "superpower", "knockoff", "synthesis"],
		randomDoubleBattleMoves: ["leafstorm", "gigadrain", "hiddenpowerice", "hiddenpowerfire", "protect"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	lurantistotem: {
		tier: "PU",
		doublesTier: "(DUU)",
	},
	morelull: {
		tier: "LC",
	},
	shiinotic: {
		randomBattleMoves: ["spore", "strengthsap", "moonblast", "substitute", "leechseed"],
		randomDoubleBattleMoves: ["spore", "gigadrain", "moonblast", "sludgebomb", "protect"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	salandit: {
		tier: "LC",
	},
	salazzle: {
		randomBattleMoves: ["nastyplot", "fireblast", "sludgewave", "hiddenpowergrass"],
		randomDoubleBattleMoves: ["protect", "flamethrower", "sludgebomb", "hiddenpowerground", "hiddenpowerice", "fakeout", "encore", "willowisp", "taunt"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	salazzletotem: {
		tier: "RU",
		doublesTier: "(DUU)",
	},
	stufful: {
		tier: "LC",
	},
	bewear: {
		randomBattleMoves: ["hammerarm", "icepunch", "swordsdance", "return", "shadowclaw", "doubleedge"],
		randomDoubleBattleMoves: ["hammerarm", "icepunch", "doubleedge", "protect", "wideguard"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	bounsweet: {
		tier: "LC",
	},
	steenee: {
		tier: "NFE",
	},
	tsareena: {
		randomBattleMoves: ["powerwhip", "highjumpkick", "knockoff", "uturn", "rapidspin", "synthesis"],
		randomDoubleBattleMoves: ["highjumpkick", "playrough", "tropkick", "uturn", "feint", "protect"],
		tier: "RU",
		doublesTier: "DUU",
	},
	comfey: {
		randomBattleMoves: ["aromatherapy", "drainingkiss", "toxic", "synthesis", "uturn"],
		randomDoubleBattleMoves: ["floralhealing", "drainingkiss", "uturn", "lightscreen", "taunt"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	oranguru: {
		randomBattleMoves: ["nastyplot", "psyshock", "focusblast", "thunderbolt", "trickroom"],
		randomDoubleBattleMoves: ["trickroom", "foulplay", "instruct", "psychic", "protect", "lightscreen", "reflect"],
		tier: "(PU)",
		doublesTier: "DUU",
	},
	passimian: {
		randomBattleMoves: ["rockslide", "closecombat", "earthquake", "ironhead", "uturn", "knockoff"],
		randomDoubleBattleMoves: ["closecombat", "uturn", "rockslide", "protect", "ironhead", "taunt"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	wimpod: {
		tier: "LC",
	},
	golisopod: {
		randomBattleMoves: ["spikes", "firstimpression", "liquidation", "aquajet", "knockoff"],
		randomDoubleBattleMoves: ["firstimpression", "aquajet", "liquidation", "leechlife", "protect", "suckerpunch", "wideguard"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	sandygast: {
		tier: "LC",
	},
	palossand: {
		randomBattleMoves: ["shoreup", "earthpower", "shadowball", "protect", "toxic", "stealthrock"],
		randomDoubleBattleMoves: ["shoreup", "protect", "shadowball", "earthpower"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	pyukumuku: {
		randomBattleMoves: ["toxic", "recover", "counter", "reflect", "lightscreen"],
		randomDoubleBattleMoves: ["reflect", "lightscreen", "counter", "helpinghand", "safeguard", "memento"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	typenull: {
		randomBattleMoves: ["return", "uturn", "swordsdance", "rest", "sleeptalk"],
		tier: "(PU)",
		doublesTier: "NFE",
	},
	silvally: {
		randomBattleMoves: ["swordsdance", "return", "doubleedge", "crunch", "flamecharge", "flamethrower", "icebeam", "uturn", "ironhead"],
		randomDoubleBattleMoves: ["protect", "doubleedge", "uturn", "crunch", "icebeam", "partingshot", "flamecharge", "swordsdance", "explosion"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallybug: {
		randomBattleMoves: ["flamethrower", "icebeam", "thunderbolt", "uturn", "defog"],
		randomDoubleBattleMoves: ["protect", "uturn", "flamethrower", "icebeam", "thunderbolt", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallydark: {
		randomBattleMoves: ["multiattack", "swordsdance", "flamecharge", "ironhead"],
		randomDoubleBattleMoves: ["protect", "multiattack", "icebeam", "partingshot", "uturn", "snarl", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallydragon: {
		randomBattleMoves: ["multiattack", "ironhead", "flamecharge", "flamethrower", "icebeam", "dracometeor", "swordsdance", "uturn"],
		randomDoubleBattleMoves: ["protect", "dracometeor", "icebeam", "flamethrower", "partingshot", "uturn", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallyelectric: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "thunderbolt", "icebeam", "uturn", "partingshot", "snarl", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallyfairy: {
		randomBattleMoves: ["multiattack", "flamethrower", "rockslide", "thunderwave", "partingshot"],
		randomDoubleBattleMoves: ["protect", "multiattack", "uturn", "icebeam", "partingshot", "flamethrower", "thunderwave"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	silvallyfighting: {
		randomBattleMoves: ["swordsdance", "multiattack", "shadowclaw", "flamecharge", "ironhead"],
		randomDoubleBattleMoves: ["protect", "multiattack", "rockslide", "swordsdance", "flamecharge"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallyfire: {
		randomBattleMoves: ["multiattack", "icebeam", "thunderbolt", "uturn", "defog"],
		randomDoubleBattleMoves: ["protect", "flamethrower", "snarl", "uturn", "thunderbolt", "icebeam", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallyflying: {
		randomBattleMoves: ["multiattack", "flamethrower", "ironhead", "partingshot", "thunderwave"],
		randomDoubleBattleMoves: ["protect", "multiattack", "partingshot", "swordsdance", "flamecharge", "uturn", "ironhead", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallyghost: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "multiattack", "uturn", "icebeam", "partingshot"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	silvallygrass: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "flamethrower", "multiattack", "icebeam", "uturn", "partingshot", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallyground: {
		randomBattleMoves: ["multiattack", "swordsdance", "flamecharge", "rockslide"],
		randomDoubleBattleMoves: ["protect", "multiattack", "icebeam", "thunderbolt", "flamecharge", "rockslide", "swordsdance"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallyice: {
		randomBattleMoves: ["multiattack", "thunderbolt", "flamethrower", "uturn", "toxic"],
		randomDoubleBattleMoves: ["protect", "icebeam", "thunderbolt", "partingshot", "uturn", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallypoison: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "multiattack", "uturn", "partingshot", "flamethrower", "icebeam", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallypsychic: {
		randomBattleMoves: ["multiattack", "flamethrower", "rockslide", "partingshot", "thunderwave"],
		randomDoubleBattleMoves: ["protect", "multiattack", "partingshot", "uturn", "flamethrower", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallyrock: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "rockslide", "uturn", "icebeam", "flamethrower", "partingshot"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	silvallysteel: {
		randomBattleMoves: ["multiattack", "crunch", "flamethrower", "thunderbolt", "defog"],
		randomDoubleBattleMoves: ["protect", "multiattack", "swordsdance", "rockslide", "flamecharge", "uturn", "partingshot"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	silvallywater: {
		randomBattleMoves: ["multiattack", "icebeam", "thunderbolt", "partingshot", "defog"],
		randomDoubleBattleMoves: ["protect", "multiattack", "icebeam", "thunderbolt", "flamethrower", "partingshot", "uturn", "thunderwave"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	minior: {
		randomBattleMoves: ["shellsmash", "powergem", "acrobatics", "earthquake"],
		randomDoubleBattleMoves: ["shellsmash", "powergem", "acrobatics", "earthquake", "protect"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	komala: {
		randomBattleMoves: ["return", "suckerpunch", "woodhammer", "earthquake", "playrough", "uturn"],
		randomDoubleBattleMoves: ["protect", "return", "uturn", "suckerpunch", "woodhammer", "shadowclaw", "playrough", "swordsdance"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	turtonator: {
		randomBattleMoves: ["fireblast", "shellsmash", "earthquake", "dragontail", "explosion", "dragonpulse", "dracometeor"],
		randomDoubleBattleMoves: ["dragonpulse", "dracometeor", "fireblast", "shellsmash", "protect", "focusblast", "explosion"],
		tier: "(PU)",
		doublesTier: "(DUU)",
	},
	togedemaru: {
		randomBattleMoves: ["ironhead", "spikyshield", "zingzap", "nuzzle", "uturn", "wish"],
		randomDoubleBattleMoves: ["ironhead", "zingzap", "nuzzle", "spikyshield", "encore", "fakeout", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	togedemarutotem: {
		tier: "NU",
		doublesTier: "DUU",
	},
	mimikyu: {
		randomBattleMoves: ["swordsdance", "shadowsneak", "playrough", "taunt", "shadowclaw"],
		randomDoubleBattleMoves: ["trickroom", "shadowclaw", "playrough", "woodhammer", "willowisp", "shadowsneak", "swordsdance", "protect"],
		tier: "UU",
		doublesTier: "DUU",
	},
	mimikyutotem: {
		tier: "UU",
		doublesTier: "DUU",
	},
	mimikyubustedtotem: {},
	bruxish: {
		randomBattleMoves: ["psychicfangs", "crunch", "liquidation", "icefang", "aquajet", "swordsdance"],
		randomDoubleBattleMoves: ["psychicfangs", "crunch", "liquidation", "aquajet", "protect", "swordsdance"],
		tier: "NUBL",
		doublesTier: "DUU",
	},
	drampa: {
		randomBattleMoves: ["dracometeor", "dragonpulse", "hypervoice", "fireblast", "thunderbolt", "glare", "roost"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "hypervoice", "fireblast", "icebeam", "energyball", "thunderbolt", "protect", "roost"],
		tier: "PU",
		doublesTier: "(DUU)",
	},
	dhelmise: {
		randomBattleMoves: ["powerwhip", "anchorshot", "knockoff", "earthquake", "rapidspin", "synthesis"],
		randomDoubleBattleMoves: ["powerwhip", "shadowclaw", "anchorshot", "protect", "gyroball"],
		tier: "NU",
		doublesTier: "(DUU)",
	},
	jangmoo: {
		tier: "LC",
	},
	hakamoo: {
		tier: "NFE",
	},
	kommoo: {
		randomBattleMoves: ["dragondance", "outrage", "closecombat", "poisonjab", "clangingscales"],
		randomDoubleBattleMoves: ["clangingscales", "focusblast", "flashcannon", "substitute", "protect", "dracometeor"],
		tier: "OU",
		doublesTier: "DOU",
	},
	kommoototem: {
		tier: "OU",
		doublesTier: "DOU",
	},
	tapukoko: {
		randomBattleMoves: ["thunderbolt", "dazzlinggleam", "naturesmadness", "bravebird", "uturn", "defog"],
		randomDoubleBattleMoves: ["wildcharge", "voltswitch", "dazzlinggleam", "bravebird", "protect", "thunderbolt", "hiddenpowerice", "taunt", "skydrop", "naturesmadness", "uturn"],
		tier: "OU",
		doublesTier: "DOU",
	},
	tapulele: {
		randomBattleMoves: ["moonblast", "psychic", "psyshock", "calmmind", "focusblast", "hiddenpowerfire", "taunt"],
		randomDoubleBattleMoves: ["moonblast", "psychic", "dazzlinggleam", "focusblast", "protect", "taunt", "shadowball", "thunderbolt"],
		tier: "OU",
		doublesTier: "DOU",
	},
	tapubulu: {
		randomBattleMoves: ["woodhammer", "hornleech", "stoneedge", "superpower", "megahorn", "bulkup"],
		randomDoubleBattleMoves: ["woodhammer", "hornleech", "stoneedge", "superpower", "leechseed", "protect", "naturesmadness"],
		tier: "OU",
		doublesTier: "DOU",
	},
	tapufini: {
		randomBattleMoves: ["calmmind", "moonblast", "scald", "taunt", "icebeam", "hydropump"],
		randomDoubleBattleMoves: ["muddywater", "moonblast", "calmmind", "icebeam", "healpulse", "protect", "taunt", "swagger"],
		tier: "OU",
		doublesTier: "DOU",
	},
	cosmog: {
		tier: "LC",
	},
	cosmoem: {
		tier: "NFE",
	},
	solgaleo: {
		randomBattleMoves: ["sunsteelstrike", "zenheadbutt", "flareblitz", "morningsun", "stoneedge", "earthquake"],
		randomDoubleBattleMoves: ["wideguard", "protect", "sunsteelstrike", "morningsun", "zenheadbutt", "flareblitz"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	lunala: {
		randomBattleMoves: ["moongeistbeam", "psyshock", "calmmind", "focusblast", "roost"],
		randomDoubleBattleMoves: ["wideguard", "protect", "roost", "moongeistbeam", "psychic", "focusblast"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	nihilego: {
		randomBattleMoves: ["stealthrock", "toxicspikes", "sludgewave", "powergem", "thunderbolt", "grassknot"],
		randomDoubleBattleMoves: ["powergem", "sludgebomb", "grassknot", "protect", "thunderbolt", "hiddenpowerice"],
		tier: "UU",
		doublesTier: "(DUU)",
	},
	buzzwole: {
		randomBattleMoves: ["superpower", "drainpunch", "leechlife", "stoneedge", "poisonjab", "earthquake"],
		randomDoubleBattleMoves: ["drainpunch", "superpower", "leechlife", "icepunch", "poisonjab", "protect"],
		tier: "UUBL",
		doublesTier: "(DUU)",
	},
	pheromosa: {
		randomBattleMoves: ["highjumpkick", "uturn", "icebeam", "poisonjab", "bugbuzz"],
		randomDoubleBattleMoves: ["highjumpkick", "uturn", "icebeam", "poisonjab", "bugbuzz", "protect", "speedswap"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	xurkitree: {
		randomBattleMoves: ["thunderbolt", "voltswitch", "energyball", "dazzlinggleam", "hiddenpowerice", "electricterrain"],
		randomDoubleBattleMoves: ["thunderbolt", "hiddenpowerice", "tailglow", "protect", "energyball", "hypnosis"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	celesteela: {
		randomBattleMoves: ["autotomize", "heavyslam", "airslash", "fireblast", "earthquake", "leechseed", "protect"],
		randomDoubleBattleMoves: ["protect", "heavyslam", "fireblast", "earthquake", "wideguard", "leechseed", "flamethrower", "substitute"],
		tier: "OU",
		doublesTier: "DOU",
	},
	kartana: {
		randomBattleMoves: ["leafblade", "sacredsword", "smartstrike", "knockoff", "swordsdance"],
		randomDoubleBattleMoves: ["leafblade", "sacredsword", "smartstrike", "psychocut", "protect", "knockoff"],
		tier: "OU",
		doublesTier: "DOU",
	},
	guzzlord: {
		randomBattleMoves: ["dracometeor", "knockoff", "earthquake", "heavyslam", "fireblast"],
		randomDoubleBattleMoves: ["dracometeor", "crunch", "darkpulse", "wideguard", "fireblast", "protect"],
		tier: "PUBL",
		doublesTier: "(DUU)",
	},
	necrozma: {
		randomBattleMoves: ["calmmind", "photongeyser", "heatwave", "moonlight", "stealthrock"],
		randomDoubleBattleMoves: ["calmmind", "trickroom", "moonlight", "storedpower", "psyshock", "darkpulse"],
		tier: "RU",
		doublesTier: "(DUU)",
	},
	necrozmaduskmane: {
		randomBattleMoves: ["swordsdance", "sunsteelstrike", "photongeyser", "earthquake", "knockoff", "autotomize"],
		randomDoubleBattleMoves: ["swordsdance", "sunsteelstrike", "photongeyser", "earthquake", "knockoff", "rockslide"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	necrozmadawnwings: {
		randomBattleMoves: ["calmmind", "moongeistbeam", "photongeyser", "heatwave", "powergem", "trickroom"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	necrozmaultra: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	magearna: {
		randomBattleMoves: ["shiftgear", "ironhead", "calmmind", "fleurcannon", "flashcannon", "thunderbolt", "focusblast"],
		randomDoubleBattleMoves: ["dazzlinggleam", "flashcannon", "substitute", "protect", "trickroom", "fleurcannon", "aurasphere", "voltswitch"],
		tier: "OU",
		doublesTier: "DUber",
	},
	magearnaoriginal: {
		isNonstandard: "Unobtainable",
		tier: "Illegal",
	},
	marshadow: {
		randomBattleMoves: ["bulkup", "spectralthief", "closecombat", "rocktomb", "shadowsneak", "icepunch"],
		randomDoubleBattleMoves: ["spectralthief", "closecombat", "shadowsneak", "icepunch", "protect"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	poipole: {
		tier: "NFE",
	},
	naganadel: {
		randomBattleMoves: ["nastyplot", "dragonpulse", "sludgewave", "fireblast", "dracometeor", "uturn"],
		randomDoubleBattleMoves: ["tailwind", "dragonpulse", "sludgebomb", "fireblast", "dracometeor", "uturn", "protect"],
		tier: "Uber",
		doublesTier: "DUU",
	},
	stakataka: {
		randomBattleMoves: ["gyroball", "stoneedge", "trickroom", "earthquake", "superpower", "stealthrock"],
		randomDoubleBattleMoves: ["gyroball", "stoneedge", "trickroom", "earthquake", "superpower", "stealthrock", "rockslide"],
		tier: "RUBL",
		doublesTier: "DOU",
	},
	blacephalon: {
		randomBattleMoves: ["mindblown", "fireblast", "shadowball", "hiddenpowerice", "trick", "explosion", "calmmind"],
		randomDoubleBattleMoves: ["willowisp", "fireblast", "shadowball", "hiddenpowerice", "heatwave", "protect"],
		tier: "OU",
		doublesTier: "DUU",
	},
	zeraora: {
		randomBattleMoves: ["plasmafists", "closecombat", "voltswitch", "hiddenpowerice", "knockoff", "grassknot", "workup"],
		randomDoubleBattleMoves: ["plasmafists", "closecombat", "voltswitch", "hiddenpowerice", "knockoff", "grassknot", "fakeout", "protect"],
		tier: "UU",
		doublesTier: "DOU",
	},
	meltan: {
		isNonstandard: "LGPE",
		tier: "Illegal",
	},
	melmetal: {
		isNonstandard: "LGPE",
		tier: "Illegal",
	},
};

exports.BattleFormatsData = BattleFormatsData;
