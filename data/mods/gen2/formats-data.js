'use strict';

/**@type {{[k: string]: ModdedTemplateFormatsData}} */
let BattleFormatsData = {
	bulbasaur: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "growl", "ancientpower"]},
		],
		tier: "LC",
	},
	ivysaur: {
		tier: "NFE",
	},
	venusaur: {
		randomSet1: { // Leech Seed
			chance: 4,
			item: ["leftovers"],
			baseMove1: "leechseed", baseMove2: "synthesis",
			fillerMoves1: ["razorleaf", "razorleaf", "hiddenpowerice"],
			fillerMoves2: ["sleeppowder", "sleeppowder", "sleeppowder", "reflect", "lightscreen"],
		},
		randomSet2: { // Defensive
			chance: 8,
			item: ["leftovers"],
			fillerMoves1: ["razorleaf", "gigadrain", "gigadrain"],
			fillerMoves2: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerfire", "bodyslam"],
			fillerMoves3: ["sleeppowder", "synthesis", "leechseed", "reflect", "lightscreen"],
			fillerMoves4: ["sleeppowder", "synthesis", "leechseed"],
		},
		randomSet3: { // Swords Dance
			chance: 13,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "gigadrain",
			fillerMoves1: ["bodyslam", "bodyslam", "return"],
			fillerMoves2: ["sleeppowder", "sleeppowder", "synthesis", "ancientpower"],
		},
		randomSet4: { // Growth
			chance: 16,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "gigadrain",
			fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerice", "hiddenpowerfire", "hiddenpowerwater"],
			fillerMoves2: ["sleeppowder", "sleeppowder", "synthesis"],
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["poisonpowder", "sleeppowder", "razorleaf", "sweetscent"]},
		],
		tier: "UUBL",
	},
	charmander: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["scratch", "growl", "crunch"]},
		],
		tier: "LC",
	},
	charmeleon: {
		tier: "NFE",
	},
	charizard: {
		randomSet1: { // Physical setup
			chance: 8,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "fireblast", baseMove2: "earthquake", baseMove3: "rockslide",
			fillerMoves1: ["bellydrum", "bellydrum", "swordsdance", "swordsdance"],
		},
		randomSet2: { // Sunny Day
			chance: 14,
			item: ["leftovers", "leftovers", "charcoal"],
			baseMove1: "fireblast", baseMove2: "earthquake", baseMove3: "sunnyday",
			fillerMoves1: ["hiddenpowergrass", "hiddenpowergrass", "hiddenpowerice", "rockslide", "crunch", "counter"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "earthquake", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["rage", "scaryface", "flamethrower", "wingattack"]},
		],
		tier: "UUBL",
	},
	squirtle: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "tailwhip", "zapcannon"]},
		],
		tier: "LC",
	},
	wartortle: {
		tier: "NFE",
	},
	blastoise: {
		randomSet1: { // RestTalk
			chance: 6,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "surf",
			fillerMoves1: ["icebeam", "icebeam", "toxic", "zapcannon"],
		},
		randomSet2: { // Toxic
			chance: 10,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "toxic", baseMove3: "rest",
			fillerMoves1: ["icebeam", "haze", "rapidspin", "mirrorcoat", "mirrorcoat"],
		},
		randomSet3: { // Defensive
			chance: 13,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "icebeam", baseMove3: "rest",
			fillerMoves1: ["mirrorcoat", "haze", "rapidspin"],
		},
		randomSet4: { // Attacker
			chance: 16,
			item: ["leftovers", "leftovers", "leftovers", "mintberry"],
			baseMove1: "icebeam", baseMove2: "rest",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["earthquake", "zapcannon"],
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["watergun", "bite", "rapidspin", "protect"]},
		],
		tier: "UU",
	},
	caterpie: {
		tier: "LC",
	},
	metapod: {
		tier: "NFE",
	},
	butterfree: {
		randomSet1: { // Double status
			chance: 16,
			item: ["leftovers"],
			baseMove1: "sleeppowder",
			fillerMoves1: ["stunspore", "stunspore", "toxic"],
			fillerMoves2: ["psychic", "psychic", "psychic", "psywave"],
			fillerMoves3: ["gigadrain", "gigadrain", "psywave", "reflect", "reflect", "safeguard", "hiddenpowerbug", "nightmare"],
		},
		tier: "NU",
	},
	weedle: {
		tier: "LC",
	},
	kakuna: {
		tier: "NFE",
	},
	beedrill: {
		randomSet1: { // Agility + SD
			chance: 10,
			item: ["leftovers", "leftovers", "miracleberry", "miracleberry", "poisonbarb"],
			baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "sludgebomb", baseMove4: "hiddenpowerground",
		},
		randomSet2: { // Other SD
			chance: 16,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "sludgebomb", baseMove3: "hiddenpowerground",
			fillerMoves1: ["substitute", "substitute", "return", "reflect"],
		},
		tier: "NU",
	},
	pidgey: {
		tier: "LC",
	},
	pidgeotto: {
		tier: "NFE",
	},
	pidgeot: {
		randomSet1: { // Attacker
			chance: 6,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "wingattack",
			fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "steelwing", "hiddenpowergrass"],
			fillerMoves2: ["toxic", "rest", "steelwing", "doubleedge", "substitute", "reflect"],
		},
		randomSet2: { // Thief
			chance: 9,
			item: [""],
			baseMove1: "return", baseMove2: "thief",
			fillerMoves1: ["wingattack", "hiddenpowerflying", "hiddenpowerground"],
			fillerMoves2: ["toxic", "reflect", "hiddenpowerground"],
		},
		randomSet3: { // Thief + Rest
			chance: 11,
			item: ["miracleberry", "mintberry"],
			baseMove1: "return", baseMove2: "thief", baseMove3: "rest",
			fillerMoves1: ["wingattack", "wingattack", "hiddenpowerground"],
		},
		randomSet4: { // Curse
			chance: 12,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "curse",
			fillerMoves1: ["rest", "hiddenpowerground", "hiddenpowerground"],
			fillerMoves2: ["rest", "wingattack", "wingattack"],
		},
		randomSet5: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["return", "return", "doubleedge"],
			fillerMoves2: ["wingattack", "hiddenpowerflying", "hiddenpowerground"],
		},
		tier: "NU",
	},
	rattata: {
		tier: "LC",
	},
	raticate: {
		randomSet1: { // Attacker
			chance: 10,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "superfang", baseMove2: "return",
			fillerMoves1: ["irontail", "irontail", "icebeam", "thunder"],
			fillerMoves2: ["irontail", "irontail", "shadowball"],
		},
		randomSet2: { // Thief
			chance: 13,
			item: [""],
			baseMove1: "superfang", baseMove2: "return", baseMove3: "thief",
			fillerMoves1: ["irontail", "irontail", "irontail", "shadowball", "hiddenpowerground"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "superfang", baseMove2: "return", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		tier: "NU",
	},
	spearow: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["peck", "growl", "sonicboom"]},
		],
		tier: "LC",
	},
	fearow: {
		randomSet1: { // Attacker
			chance: 3,
			item: ["leftovers", "leftovers", "miracleberry", "miracleberry", "miracleberry"],
			baseMove1: "return", baseMove2: "drillpeck",
			fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "steelwing"],
			fillerMoves2: ["steelwing", "doubleedge", "hyperbeam"],
		},
		randomSet2: { // Sub attacker
			chance: 8,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "drillpeck", baseMove3: "substitute",
			fillerMoves1: ["hiddenpowerground", "steelwing"],
		},
		randomSet3: { // Thief
			chance: 11,
			item: [""],
			baseMove1: "return", baseMove2: "drillpeck", baseMove3: "thief",
			fillerMoves1: ["hiddenpowerground", "steelwing"],
		},
		randomSet4: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "drillpeck",
			fillerMoves1: ["return", "return", "doubleedge"],
		},
		eventPokemon: [
			{"generation": 1, "level": 20, "moves": ["growl", "leer", "furyattack", "payday"]},
		],
		tier: "NU",
	},
	ekans: {
		tier: "LC",
	},
	arbok: {
		randomSet1: { // Attacker
			chance: 10,
			item: ["leftovers"],
			baseMove1: "sludgebomb", baseMove2: "earthquake", baseMove3: "glare",
			fillerMoves1: ["rockslide", "rockslide", "rockslide", "gigadrain", "screech", "substitute", "curse"],
		},
		randomSet2: { // RestTalk
			chance: 6,
			item: ["leftovers"],
			baseMove1: "sludgebomb", baseMove2: "earthquake", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		tier: "NU",
	},
	pichu: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["thundershock", "charm", "dizzypunch"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["thundershock", "charm", "petaldance"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["thundershock", "charm", "scaryface"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["thundershock", "charm", "sing"]},
		],
		tier: "LC",
	},
	pikachu: {
		eventPokemon: [
			{"generation": 1, "level": 5, "moves": ["surf"]},
			{"generation": 1, "level": 5, "moves": ["fly"]},
			{"generation": 1, "level": 5, "moves": ["thundershock", "growl", "surf"]},
		],
		tier: "UU",
	},
	raichu: {
		randomSet1: { // Attacker
			chance: 13,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "thunderbolt", baseMove2: "surf", baseMove3: "hiddenpowerice",
			fillerMoves1: ["thunderwave", "thunderwave", "sing"],
		},
		randomSet2: { // Defensive
			chance: 16,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "surf", baseMove3: "thunderwave",
			fillerMoves1: ["reflect", "lightscreen"],
		},
		tier: "NUBL",
	},
	sandshrew: {
		tier: "LC",
	},
	sandslash: {
		randomSet1: {
			chance: 16, // Swords Dance
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "earthquake", baseMove3: "rockslide",
			fillerMoves1: ["hiddenpowerbug", "hiddenpowerbug", "hiddenpowerbug", "hiddenpowerbug", "bodyslam", "counter", "substitute"],
		},
		tier: "UU",
	},
	nidoranf: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["growl", "tackle", "lovelykiss"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["growl", "tackle", "moonlight"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["growl", "tackle", "sweetkiss"]},
		],
		tier: "LC",
	},
	nidorina: {
		tier: "NFE",
	},
	nidoqueen: {
		randomSet1: {
			chance: 9, // Mixed attacker
			item: ["leftovers"],
			baseMove1: "earthquake",
			fillerMoves1: ["thunderbolt", "thunderbolt", "thunder", "thunder", "icebeam"],
			fillerMoves2: ["icebeam", "icebeam", "rockslide", "fireblast"],
			fillerMoves3: ["lovelykiss", "lovelykiss", "lovelykiss", "counter", "icebeam"],
		},
		randomSet2: {
			chance: 14, // Defensive
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "moonlight",
			fillerMoves1: ["icebeam", "icebeam", "icebeam", "thunderbolt", "thunderbolt", "thunder"],
			fillerMoves2: ["reflect", "reflect", "icebeam", "icebeam", "toxic", "roar"],
		},
		randomSet3: {
			chance: 16, // RestTalk
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves2: ["icebeam", "icebeam", "icebeam", "thunderbolt", "thunder"],
		},
		tier: "UU",
	},
	nidoranm: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["leer", "tackle", "lovelykiss"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["leer", "tackle", "morningsun"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["leer", "tackle", "sweetkiss"]},
		],
		tier: "LC",
	},
	nidorino: {
		tier: "NFE",
	},
	nidoking: {
		randomSet1: {
			chance: 16, // Mixed attacker
			item: ["leftovers"],
			baseMove1: "earthquake",
			fillerMoves1: ["thunderbolt", "thunder", "thunder", "icebeam"],
			fillerMoves2: ["icebeam", "icebeam", "rockslide", "rockslide", "fireblast"],
			fillerMoves3: ["lovelykiss", "lovelykiss", "lovelykiss", "lovelykiss", "morningsun", "morningsun", "counter"],
		},
		tier: "OU",
	},
	cleffa: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["pound", "charm", "encore", "petaldance"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["pound", "charm", "encore", "scaryface"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["pound", "charm", "encore", "swift"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["pound", "charm", "encore", "dizzypunch"]},
		],
		tier: "LC",
	},
	clefairy: {
		tier: "NFE",
	},
	clefable: {
		randomSet1: {
			chance: 4, // Belly Drum
			item: ["leftovers"],
			baseMove1: "bellydrum", baseMove2: "return", baseMove3: "moonlight",
			fillerMoves1: ["icebeam", "icebeam", "hiddenpowerground", "hiddenpowerground", "fireblast", "sing", "encore"],
		},
		randomSet2: {
			chance: 10, // Mixed attacker
			item: ["leftovers"],
			baseMove1: "icebeam",
			fillerMoves1: ["return", "bodyslam", "doubleedge"],
			fillerMoves2: ["thunderbolt", "thunderbolt", "fireblast", "moonlight"],
			fillerMoves3: ["moonlight", "moonlight", "moonlight", "counter", "sing"],
		},
		randomSet3: {
			chance: 13, // Ice Beam support
			item: ["leftovers"],
			baseMove1: "moonlight", baseMove2: "icebeam",
			fillerMoves1: ["return", "return", "thunderbolt", "thunderbolt", "fireblast", "thunderwave"],
			fillerMoves2: ["reflect", "lightscreen", "lightscreen", "thunderwave", "thunderwave", "thunderwave"],
		},
		randomSet4: {
			chance: 16, // Body Slam support
			item: ["leftovers"],
			baseMove1: "moonlight", baseMove2: "bodyslam",
			fillerMoves1: ["icebeam", "fireblast"],
			fillerMoves2: ["reflect", "lightscreen"],
		},
		tier: "UUBL",
	},
	vulpix: {
		tier: "LC",
	},
	ninetales: {
		randomSet1: { // Attacker
			chance: 13,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry", "charcoal"],
			baseMove1: "fireblast", baseMove2: "hiddenpowergrass",
			fillerMoves1: ["hypnosis", "hypnosis", "hypnosis", "sunnyday"],
			fillerMoves2: ["sunnyday", "sunnyday", "confuseray", "return"],
		},
		randomSet2: { // Annoyer
			chance: 16,
			item: ["leftovers"],
			baseMove1: "confuseray", baseMove2: "toxic", baseMove3: "substitute",
			fillerMoves1: ["flamethrower", "fireblast"],
		},
		tier: "NU",
	},
	igglybuff: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["sing", "charm", "defensecurl", "mimic"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["sing", "charm", "defensecurl", "petaldance"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["sing", "charm", "defensecurl", "scaryface"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["sing", "charm", "defensecurl", "dizzypunch"]},
		],
		tier: "LC",
	},
	jigglypuff: {
		tier: "NFE",
	},
	wigglytuff: {
		randomSet1: { // Thunder Wave attacker
			chance: 5,
			item: ["leftovers"],
			baseMove1: "doubleedge", baseMove2: "icebeam", baseMove3: "thunderwave",
			fillerMoves1: ["thunderbolt", "thunderbolt", "fireblast"],
		},
		randomSet2: { // Sing/Counter attacker
			chance: 10,
			item: ["leftovers"],
			baseMove1: "icebeam",
			fillerMoves1: ["doubleedge", "bodyslam"],
			fillerMoves2: ["thunderbolt", "thunderbolt", "fireblast"],
			fillerMoves3: ["sing", "counter"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["doubleedge", "doubleedge", "bodyslam"],
			fillerMoves2: ["curse", "curse", "curse", "icebeam", "fireblast"],
		},
		tier: "NU",
	},
	zubat: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["leechlife", "flail"]},
		],
		tier: "LC",
	},
	golbat: {
		tier: "NFE",
	},
	crobat: {
		randomSet1: { // Attacker
			chance: 8,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "wingattack", baseMove2: "hiddenpowerground",
			fillerMoves1: ["return", "doubleedge", "confuseray"],
			fillerMoves2: ["confuseray", "confuseray", "screech", "toxic"],
		},
		randomSet2: { // Curse
			chance: 10,
			item: ["leftovers"],
			baseMove1: "wingattack", baseMove2: "hiddenpowerground", baseMove3: "curse",
			fillerMoves1: ["return", "doubleedge", "doubleedge", "whirlwind"],
		},
		randomSet3: { // Thief
			chance: 12,
			item: [""],
			baseMove1: "wingattack", baseMove2: "hiddenpowerground", baseMove3: "thief",
			fillerMoves1: ["return", "doubleedge", "confuseray", "confuseray"],
		},
		randomSet4: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "hiddenpowerground",
			fillerMoves1: ["return", "doubleedge", "wingattack", "wingattack", "wingattack"],
		},
		tier: "UU",
	},
	oddish: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["absorb", "leechseed"]},
		],
		tier: "LC",
	},
	gloom: {
		tier: "NFE",
	},
	vileplume: {
		randomSet1: { // Swords Dance
			chance: 6,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "sludgebomb", baseMove3: "gigadrain",
			fillerMoves1: ["sleeppowder", "sleeppowder", "bodyslam", "hiddenpowerground", "moonlight", "moonlight"],
		},
		randomSet2: { // Defensive
			chance: 16,
			item: ["leftovers"],
			baseMove1: "leechseed", baseMove2: "sludgebomb",
			fillerMoves1: ["gigadrain", "moonlight"],
			fillerMoves2: ["sleeppowder", "sleeppowder", "moonlight", "reflect", "stunspore"],
		},
		tier: "UU",
	},
	bellossom: {
		randomSet1: { // Leech Seed
			chance: 8,
			item: ["leftovers"],
			baseMove1: "leechseed", baseMove2: "moonlight", baseMove3: "sludgebomb",
			fillerMoves1: ["gigadrain", "sleeppowder", "stunspore", "reflect"],
		},
		randomSet2: { // Defensive
			chance: 12,
			item: ["leftovers"],
			baseMove1: "razorleaf", baseMove2: "moonlight",
			fillerMoves1: ["sleeppowder", "stunspore", "stunspore", "toxic", "reflect"],
			fillerMoves2: ["sleeppowder", "reflect"],
		},
		randomSet3: { // Two attacks
			chance: 16,
			item: ["leftovers"],
			baseMove1: "gigadrain",
			fillerMoves1: ["sludgebomb", "hiddenpowerice"],
			fillerMoves2: ["sleeppowder", "stunspore"],
			fillerMoves3: ["moonlight", "leechseed", "sleeppowder"],
		},
		tier: "UU",
	},
	paras: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["scratch", "synthesis"]},
		],
		tier: "LC",
	},
	parasect: {
		randomSet1: {
			chance: 5, // SD + HP Rock
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "hiddenpowerrock",
			fillerMoves1: ["bodyslam", "bodyslam", "return"],
			fillerMoves2: ["spore", "gigadrain"],
		},
		randomSet2: {
			chance: 10, // SD + HP Bug
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "hiddenpowerbug", baseMove3: "bodyslam",
			fillerMoves2: ["spore", "gigadrain"],
		},
		randomSet3: {
			chance: 13, // Double powder
			item: ["leftovers"],
			baseMove1: "spore", baseMove2: "stunspore", baseMove3: "return",
			fillerMoves1: ["gigadrain", "hiddenpowerbug", "hiddenpowerrock"],
		},
		randomSet4: {
			chance: 16, // Defensive
			item: ["leftovers"],
			baseMove1: "spore", baseMove2: "synthesis", baseMove3: "bodyslam",
			fillerMoves1: ["gigadrain", "hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock"],
		},
		tier: "NU",
	},
	venonat: {
		tier: "LC",
	},
	venomoth: {
		randomSet1: {
			chance: 6, // Curse + status
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "sludgebomb",
			fillerMoves1: ["hiddenpowerground", "psychic"],
			fillerMoves2: ["sleeppowder", "sleeppowder", "stunspore"],
		},
		randomSet2: {
			chance: 8, // Curse + 3 attacks
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "sludgebomb", baseMove3: "gigadrain",
			fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "return"],
		},
		randomSet3: {
			chance: 16, // Special based
			item: ["leftovers"],
			baseMove1: "sludgebomb", baseMove2: "psychic",
			fillerMoves1: ["sleeppowder", "sleeppowder", "sleeppowder", "stunspore"],
			fillerMoves2: ["stunspore", "reflect", "gigadrain", "gigadrain"],
		},
		tier: "NU",
	},
	diglett: {
		tier: "LC",
	},
	dugtrio: {
		randomSet1: { // Attacker
			chance: 16,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "earthquake", baseMove2: "rockslide", baseMove3: "sludgebomb",
			fillerMoves1: ["substitute", "screech", "curse"],
		},
		tier: "NU",
	},
	meowth: {
		tier: "LC",
	},
	persian: {
		randomSet1: { // Attacker
			chance: 11,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "icebeam", baseMove2: "hypnosis",
			fillerMoves1: ["return", "return", "return", "bodyslam", "doubleedge"],
			fillerMoves2: ["irontail", "swagger", "hiddenpowerground"],
		},
		randomSet2: { // Substitute attacker
			chance: 13,
			item: ["leftovers"],
			baseMove1: "substitute", baseMove2: "swagger",
			fillerMoves1: ["return", "return", "bodyslam", "doubleedge"],
			fillerMoves2: ["irontail", "shadowball", "hiddenpowerground"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["return", "return", "bodyslam", "doubleedge"],
			fillerMoves2: ["substitute", "substitute", "irontail"],
		},
		tier: "NU",
	},
	psyduck: {
		eventPokemon: [
			{"generation": 1, "level": 15, "moves": ["scratch", "amnesia"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["scratch", "tailwhip", "petaldance"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["scratch", "tailwhip", "triattack"]},
		],
		tier: "LC",
	},
	golduck: {
		randomSet1: { // Attacker
			chance: 16,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "icebeam", baseMove2: "crosschop",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["hypnosis", "hypnosis", "hypnosis", "hiddenpowerelectric", "psychic"],
		},
		tier: "NUBL",
	},
	mankey: {
		tier: "LC",
	},
	primeape: {
		randomSet1: { // Attacker
			chance: 11,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "crosschop", baseMove2: "rockslide",
			fillerMoves1: ["hiddenpowerbug", "hiddenpowerghost", "doubleedge"],
			fillerMoves2: ["meditate", "meditate", "counter", "curse"],
		},
		randomSet2: { // RestTalk
			chance: 14,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "crosschop", baseMove4: "rockslide",
		},
		randomSet3: { // Reversal
			chance: 16,
			item: ["miracleberry"],
			baseMove1: "endure", baseMove2: "reversal",
			fillerMoves1: ["crosschop", "meditate"],
			fillerMoves2: ["rockslide", "hiddenpowerghost"],
		},
		tier: "NU",
	},
	growlithe: {
		tier: "LC",
	},
	arcanine: {
		randomSet1: { // Attacker
			chance: 9,
			item: ["leftovers"],
			baseMove1: "fireblast",
			fillerMoves1: ["irontail", "crunch", "hiddenpowergrass"],
			fillerMoves2: ["bodyslam", "bodyslam", "extremespeed", "doubleedge"],
			fillerMoves3: ["sunnyday", "sunnyday", "rest", "crunch"],
		},
		randomSet2: { // Defensive
			chance: 11,
			item: ["leftovers"],
			baseMove1: "bodyslam", baseMove2: "rest", baseMove3: "reflect",
			fillerMoves1: ["flamethrower", "fireblast"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["crunch", "crunch", "bodyslam", "bodyslam", "doubleedge"],
		},
		tier: "UU",
	},
	poliwag: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["bubble", "growth"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["bubble", "lovelykiss"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["bubble", "sweetkiss"]},
		],
		tier: "LC",
	},
	poliwhirl: {
		tier: "NFE",
	},
	poliwrath: {
		randomSet1: { // LK + BD
			chance: 6,
			item: ["leftovers"],
			baseMove1: "bellydrum", baseMove2: "lovelykiss", baseMove3: "bodyslam", baseMove4: "earthquake",
		},
		randomSet2: { // Other BD
			chance: 9,
			item: ["leftovers"],
			baseMove1: "bellydrum", baseMove2: "bodyslam", baseMove3: "earthquake",
			fillerMoves1: ["surf", "surf", "hiddenpowerbug", "hiddenpowerrock"],
		},
		randomSet3: { // Mixed attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "earthquake",
			fillerMoves1: ["surf", "hydropump"],
			fillerMoves2: ["icebeam", "icebeam", "bodyslam"],
			fillerMoves3: ["lovelykiss", "lovelykiss", "lovelykiss", "lovelykiss", "dynamicpunch", "bodyslam", "counter"],
		},
		tier: "NUBL",
	},
	politoed: {
		randomSet1: { // Belly Drum
			chance: 4,
			item: ["leftovers"],
			baseMove1: "bellydrum", baseMove2: "lovelykiss", baseMove3: "bodyslam",
			fillerMoves1: ["earthquake", "surf"],
		},
		randomSet2: { // Growth
			chance: 10,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "icebeam",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["hiddenpowerelectric", "rest"],
		},
		randomSet3: { // RestTalk
			chance: 14,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["icebeam", "growth"],
		},
		randomSet4: { // Attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "icebeam",
			fillerMoves1: ["surf", "hydropump"],
			fillerMoves2: ["hiddenpowerelectric", "earthquake", "bodyslam", "rest", "lovelykiss"],
			fillerMoves3: ["rest", "lovelykiss"],
		},
		tier: "UU",
	},
	abra: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["teleport", "foresight"]},
		],
		tier: "LC",
	},
	kadabra: {
		tier: "UU",
	},
	alakazam: {
		randomSet1: { // Attacker
			chance: 8,
			item: ["leftovers", "miracleberry"],
			baseMove1: "psychic", baseMove2: "thunderpunch",
			fillerMoves1: ["firepunch", "icepunch"],
			fillerMoves2: ["recover", "thunderwave", "counter"],
		},
		randomSet2: { // Support
			chance: 16,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "recover",
			fillerMoves1: ["reflect", "reflect", "lightscreen", "thunderwave"],
			fillerMoves2: ["thunderwave", "thunderwave", "thunderpunch", "icepunch", "firepunch", "encore"],
		},
		tier: "UUBL",
	},
	machop: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["lowkick", "leer", "falseswipe"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["lowkick", "leer", "thrash"]},
		],
		tier: "LC",
	},
	machoke: {
		tier: "NFE",
	},
	machamp: {
		randomSet1: { // Curse
			chance: 5,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "crosschop", baseMove3: "earthquake", baseMove4: "rockslide",
		},
		randomSet2: { // Attacker
			chance: 11,
			item: ["leftovers"],
			baseMove1: "crosschop", baseMove2: "earthquake", baseMove3: "rockslide",
			fillerMoves1: ["fireblast", "fireblast", "hiddenpowerbug", "hiddenpowerbug", "bodyslam", "lightscreen", "counter"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "crosschop",
			fillerMoves1: ["curse", "curse", "rockslide"],
		},
		tier: "OU",
	},
	bellsprout: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["vinewhip", "lovelykiss"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["vinewhip", "sweetkiss"]},
		],
		tier: "LC",
	},
	weepinbell: {
		tier: "NFE",
	},
	victreebel: {
		randomSet1: { // Swords Dance
			chance: 16,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "sludgebomb",
			fillerMoves1: ["gigadrain", "gigadrain", "hiddenpowerground"],
			fillerMoves2: ["sleeppowder", "sleeppowder", "hiddenpowerground", "return", "synthesis"],
		},
		tier: "UU",
	},
	tentacool: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["poisonsting", "confuseray"]},
		],
		tier: "LC",
	},
	tentacruel: {
		randomSet1: { // Swords Dance
			chance: 10,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "sludgebomb",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["substitute", "substitute", "icebeam"],
		},
		randomSet2: { // Swords Dance + Rest
			chance: 13,
			item: ["leftovers", "mintberry"],
			baseMove1: "swordsdance", baseMove2: "sludgebomb", baseMove3: "rest",
			fillerMoves1: ["surf", "surf", "hydropump"],
		},
		randomSet3: { // Mixed attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "sludgebomb", baseMove2: "icebeam",
			fillerMoves1: ["hydropump", "surf"],
			fillerMoves2: ["mirrorcoat", "rapidspin", "haze"],
		},
		tier: "UUBL",
	},
	geodude: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "rapidspin"]},
		],
		tier: "LC",
	},
	graveler: {
		tier: "NFE",
	},
	golem: {
		randomSet1: { // Attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "rockslide", baseMove3: "explosion",
			fillerMoves1: ["curse", "hiddenpowerbug", "fireblast", "rapidspin", "roar"],
		},
		tier: "OU",
	},
	ponyta: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "growl", "lowkick"]},
		],
		tier: "LC",
	},
	rapidash: {
		randomSet1: { // Attacker
			chance: 10,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "fireblast", baseMove2: "irontail",
			fillerMoves1: ["return", "doubleedge", "bodyslam", "bodyslam"],
			fillerMoves2: ["hypnosis", "hypnosis", "hypnosis", "hiddenpowerelectric"],
		},
		randomSet2: { // Sunny Day
			chance: 13,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry", "charcoal"],
			baseMove1: "fireblast", baseMove2: "sunnyday", baseMove3: "hiddenpowergrass",
			fillerMoves1: ["bodyslam", "return"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "fireblast", baseMove4: "bodyslam",
		},
		eventPokemon: [
			{"generation": 1, "level": 40, "moves": ["ember", "firespin", "stomp", "payday"]},
		],
		tier: "NU",
	},
	slowpoke: {
		tier: "LC",
	},
	slowbro: {
		randomSet1: { // Special attacker
			chance: 7,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "psychic", baseMove3: "icebeam", baseMove4: "thunderwave",
		},
		randomSet2: { // Defensive
			chance: 13,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "rest",
			fillerMoves1: ["thunderwave", "thunderwave", "thunderwave", "reflect"],
			fillerMoves2: ["psychic", "psychic", "icebeam", "reflect"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "surf",
			fillerMoves1: ["psychic", "psychic", "thunderwave"],
		},
		tier: "UU",
	},
	slowking: {
		randomSet1: { // Special attacker
			chance: 7,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "psychic", baseMove3: "icebeam", baseMove4: "thunderwave",
		},
		randomSet2: { // Defensive
			chance: 13,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "rest",
			fillerMoves1: ["thunderwave", "thunderwave", "reflect"],
			fillerMoves2: ["psychic", "psychic", "icebeam", "reflect", "thunderwave"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "surf",
			fillerMoves1: ["psychic", "psychic", "thunderwave"],
		},
		tier: "UU",
	},
	magnemite: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "agility"]},
		],
		tier: "LC",
	},
	magneton: {
		randomSet1: { // RestTalk
			chance: 8,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		randomSet2: { // Attacker
			chance: 14,
			item: ["leftovers", "leftovers", "leftovers", "magnet"],
			baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "thunderwave",
			fillerMoves1: ["reflect", "substitute", "substitute"],
		},
		randomSet3: { // Thunder attacker
			chance: 16,
			item: ["leftovers", "magnet"],
			baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "thunderwave", baseMove4: "thunder",
		},
		tier: "UU",
	},
	farfetchd: {
		randomSet1: { // SD + Agility pass
			chance: 7,
			item: ["leftovers", "miracleberry", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "return", baseMove4: "batonpass",
		},
		randomSet2: { // SD + Sub pass
			chance: 10,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "substitute", baseMove3: "return", baseMove4: "batonpass",
		},
		randomSet3: { // Attacker
			chance: 14,
			item: ["stick"],
			baseMove1: "swordsdance", baseMove2: "return",
			fillerMoves1: ["agility", "hiddenpowerflying"],
			fillerMoves2: ["irontail", "hiddenpowerground"],
		},
		randomSet4: { // Flail
			chance: 16,
			item: ["miracleberry"],
			baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "endure", baseMove4: "flail",
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "moves": ["batonpass", "swordsdance", "agility", "slash"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["peck", "furycutter"]},
		],
		tier: "NU",
	},
	doduo: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["peck", "growl", "lowkick"]},
		],
		tier: "LC",
	},
	dodrio: {
		randomSet1: { // Attacker
			chance: 3,
			item: ["leftovers", "miracleberry", "miracleberry"],
			baseMove1: "drillpeck",
			fillerMoves1: ["bodyslam", "return", "doubleedge"],
			fillerMoves2: ["hiddenpowerground", "steelwing"],
			fillerMoves3: ["bodyslam", "return", "doubleedge"],
		},
		randomSet2: { // Sub attacker
			chance: 8,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "drillpeck", baseMove3: "substitute",
			fillerMoves1: ["hiddenpowerground", "steelwing"],
		},
		randomSet3: { // Thief
			chance: 11,
			item: [""],
			baseMove1: "return", baseMove2: "drillpeck", baseMove3: "thief",
			fillerMoves1: ["hiddenpowerground", "steelwing"],
		},
		randomSet4: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "drillpeck",
			fillerMoves1: ["return", "return", "doubleedge"],
		},
		tier: "UU",
	},
	seel: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["headbutt", "growl", "flail"]},
		],
		tier: "LC",
	},
	dewgong: {
		randomSet1: { // RestTalk
			chance: 9,
			item: ["leftovers"],
			baseMove1: "icebeam", baseMove2: "surf", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		randomSet2: { // Defensive
			chance: 13,
			item: ["leftovers", "leftovers", "leftovers", "mintberry"],
			baseMove1: "icebeam", baseMove2: "surf", baseMove3: "rest",
			fillerMoves1: ["encore", "safeguard", "toxic", "toxic"],
		},
		randomSet3: { // Trapper
			chance: 16,
			item: ["leftovers"],
			baseMove1: "whirlpool", baseMove2: "perishsong", baseMove3: "protect", baseMove4: "icebeam",
		},
		tier: "NU",
	},
	grimer: {
		tier: "LC",
	},
	muk: {
		randomSet1: { // Curse
			chance: 8,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "sludgebomb",
			fillerMoves1: ["dynamicpunch", "hiddenpowerground", "hiddenpowerground"],
			fillerMoves2: ["explosion", "explosion", "explosion", "dynamicpunch", "fireblast", "bodyslam"],
		},
		randomSet2: { // Attacker
			chance: 13,
			item: ["leftovers"],
			baseMove1: "sludgebomb", baseMove2: "explosion",
			fillerMoves1: ["dynamicpunch", "hiddenpowerground"],
			fillerMoves2: ["dynamicpunch", "bodyslam", "fireblast", "gigadrain"],
		},
		randomSet3: { // CurseTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "sludgebomb", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		tier: "UUBL",
	},
	shellder: {
		tier: "LC",
	},
	cloyster: {
		randomSet1: { // Spikes
			chance: 16,
			item: ["leftovers"],
			baseMove1: "spikes", baseMove2: "icebeam",
			fillerMoves1: ["surf", "surf", "toxic", "reflect"],
			fillerMoves2: ["explosion", "explosion", "explosion", "rapidspin"],
		},
		tier: "OU",
	},
	gastly: {
		tier: "LC",
	},
	haunter: {
		tier: "UU",
	},
	gengar: {
		randomSet1: { // Attacker
			chance: 12,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "thunderbolt", baseMove2: "icepunch",
			fillerMoves1: ["explosion", "explosion", "destinybond", "hypnosis"],
			fillerMoves2: ["hypnosis", "hypnosis", "firepunch", "psychic", "shadowball", "counter"],
		},
		randomSet2: { // Non-Ice Punch attacker
			chance: 14,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "thunderbolt", baseMove2: "firepunch", baseMove3: "gigadrain",
			fillerMoves1: ["explosion", "explosion", "destinybond", "hypnosis"],
		},
		randomSet3: { // Perish trapper
			chance: 16,
			item: ["leftovers"],
			baseMove1: "meanlook", baseMove2: "perishsong", baseMove3: "protect",
			fillerMoves1: ["thunderbolt", "thunderbolt", "confuseray", "destinybond"],
		},
		tier: "OU",
	},
	onix: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "screech", "sharpen"]},
		],
		tier: "LC",
	},
	steelix: {
		randomSet1: { // Curse
			chance: 6,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "earthquake", baseMove3: "explosion",
			fillerMoves1: ["irontail", "rockslide", "bodyslam"],
		},
		randomSet2: { // Rest defensive
			chance: 10,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "toxic", baseMove3: "rest",
			fillerMoves1: ["rockslide", "irontail", "roar"],
		},
		randomSet3: { // Explosion defensive
			chance: 16,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "roar", baseMove3: "explosion",
			fillerMoves1: ["bodyslam", "rockslide", "irontail"],
		},
		tier: "OU",
	},
	drowzee: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["pound", "hypnosis", "amnesia"]},
		],
		tier: "LC",
	},
	hypno: {
		randomSet1: { // Defensive
			chance: 7,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "thunderwave", baseMove3: "rest",
			fillerMoves1: ["reflect", "lightscreen"],
		},
		randomSet2: { // Attacker
			chance: 12,
			item: ["leftovers"],
			baseMove1: "psychic",
			fillerMoves1: ["thunderpunch", "hypnosis", "hypnosis"],
			fillerMoves2: ["thunderpunch", "icepunch", "firepunch", "shadowball"],
			fillerMoves3: ["thunderwave", "thunderwave", "counter", "reflect"],
		},
		randomSet3: { // RestTalk
			chance: 14,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "psychic",
			fillerMoves1: ["seismictoss", "seismictoss", "thunderwave"],
		},
		randomSet4: { // Curse
			chance: 16,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "bodyslam", baseMove3: "psychic",
			fillerMoves1: ["rest", "rest", "shadowball"],
		},
		tier: "UU",
	},
	krabby: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["bubble", "leer", "metalclaw"]},
		],
		tier: "LC",
	},
	kingler: {
		randomSet1: { // Swords Dance
			chance: 16,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "return", baseMove3: "surf",
			fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "hiddenpowerrock", "hiddenpowerrock", "hiddenpowerflying", "hiddenpowerbug"],
		},
		tier: "NU",
	},
	voltorb: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "agility"]},
		],
		tier: "LC",
	},
	electrode: {
		randomSet1: { // Attacker
			chance: 10,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "explosion",
			fillerMoves1: ["reflect", "lightscreen", "thunderwave", "thunderwave"],
		},
		randomSet2: { // Defensive
			chance: 15,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "hiddenpowerice",
			fillerMoves1: ["reflect", "lightscreen"],
			fillerMoves2: ["explosion", "thunderwave"],
		},
		randomSet3: { // Mirror Coat
			chance: 16,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "mirrorcoat",
			fillerMoves1: ["reflect", "explosion"],
		},
		tier: "UU",
	},
	exeggcute: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["barrage", "hypnosis", "sweetscent"]},
		],
		tier: "LC",
	},
	exeggutor: {
		randomSet1: { // Defensive
			chance: 4,
			item: ["leftovers"],
			baseMove1: "psychic",
			fillerMoves1: ["moonlight", "synthesis"],
			fillerMoves2: ["leechseed", "gigadrain", "gigadrain"],
			fillerMoves3: ["sleeppowder", "sleeppowder", "stunspore", "reflect"],
		},
		randomSet2: { // Special attacker
			chance: 6,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "gigadrain", baseMove3: "hiddenpowerfire",
			fillerMoves1: ["explosion", "explosion", "sleeppowder"],
		},
		randomSet3: { // Leech Seed
			chance: 8,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "leechseed",
			fillerMoves1: ["stunspore", "stunspore", "toxic"],
			fillerMoves2: ["substitute", "substitute", "sleeppowder"],
		},
		randomSet4: { // Attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "gigadrain", baseMove3: "explosion",
			fillerMoves1: ["sleeppowder", "sleeppowder", "stunspore"],
		},
		tier: "OU",
	},
	cubone: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["growl", "tailwhip", "furyattack"]},
		],
		tier: "LC",
	},
	marowak: {
		randomSet1: { // Swords Dance
			chance: 16,
			item: ["thickclub"],
			baseMove1: "swordsdance",
			fillerMoves1: ["earthquake", "earthquake", "bonemerang"],
			fillerMoves2: ["rockslide", "rockslide", "ancientpower"],
			fillerMoves3: ["bodyslam", "hiddenpowerbug"],
		},
		tier: "OU",
	},
	tyrogue: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "rage"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "dizzypunch"]},
		],
		tier: "LC",
	},
	hitmonlee: {
		randomSet1: { // Attacker
			chance: 12,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "hijumpkick",
			fillerMoves1: ["bodyslam", "return"],
			fillerMoves2: ["hiddenpowerbug", "hiddenpowerghost", "hiddenpowerrock"],
			fillerMoves3: ["meditate", "counter", "curse"],
		},
		randomSet2: { // RestTalk
			chance: 14,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "hijumpkick",
			fillerMoves1: ["curse", "bodyslam"],
		},
		randomSet3: { // Reversal
			chance: 16,
			item: ["miracleberry"],
			baseMove1: "endure", baseMove2: "meditate", baseMove3: "reversal", baseMove4: "hiddenpowerghost",
		},
		tier: "NU",
	},
	hitmonchan: {
		randomSet1: { // Attacker
			chance: 10,
			item: ["leftovers"],
			baseMove1: "hijumpkick", baseMove2: "bodyslam",
			fillerMoves1: ["hiddenpowerbug", "hiddenpowerghost", "hiddenpowerrock"],
			fillerMoves2: ["counter", "curse", "curse", "machpunch"],
		},
		randomSet2: { // Thief
			chance: 12,
			item: [""],
			baseMove1: "hijumpkick", baseMove2: "bodyslam", baseMove3: "thief",
			fillerMoves1: ["hiddenpowerbug", "hiddenpowerghost", "hiddenpowerrock"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "hijumpkick", baseMove4: "bodyslam",
		},
		tier: "NU",
	},
	hitmontop: {
		randomSet1: { // Attacker
			chance: 13,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "hijumpkick", baseMove2: "return",
			fillerMoves2: ["hiddenpowerbug", "hiddenpowerghost", "hiddenpowerrock"],
			fillerMoves3: ["counter", "curse", "curse", "machpunch", "rapidspin"],
		},
		randomSet2: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "hijumpkick",
			fillerMoves1: ["curse", "return"],
		},
		tier: "NU",
	},
	lickitung: {
		randomSet1: { // Swords Dance
			chance: 5,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "bodyslam", baseMove3: "earthquake",
			fillerMoves1: ["thunderbolt", "shadowball", "fireblast", "megakick", "doubleedge", "counter"],
		},
		randomSet2: { // Swords Dance + Rest
			chance: 9,
			item: ["leftovers", "mintberry"],
			baseMove1: "swordsdance", baseMove2: "bodyslam", baseMove3: "earthquake", baseMove4: "rest",
		},
		randomSet3: { // RestTalk
			chance: 11,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["bodyslam", "icebeam"],
			fillerMoves2: ["bodyslam", "seismictoss"],
		},
		randomSet4: { // Curse + RestTalk
			chance: 13,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "bodyslam", baseMove4: "curse",
		},
		randomSet5: { // Mixed attacker
			chance: 16,
			item: ["leftovers"],
			fillerMoves1: ["bodyslam", "bodyslam", "doubleedge"],
			fillerMoves2: ["thunder", "thunderbolt", "thunderbolt", "fireblast"],
			fillerMoves3: ["icebeam", "icebeam", "icebeam", "earthquake"],
			fillerMoves4: ["fireblast", "earthquake", "counter", "rest"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["lick", "doubleslap"]},
		],
		tier: "NU",
	},
	koffing: {
		tier: "LC",
	},
	weezing: {
		randomSet1: { // Mixed attacker
			chance: 13,
			item: ["leftovers"],
			baseMove1: "sludgebomb", baseMove2: "thunderbolt", baseMove3: "fireblast",
			fillerMoves1: ["explosion", "explosion", "explosion", "explosion", "destinybond", "painsplit"],
		},
		randomSet2: { // Curse
			chance: 16,
			item: ["leftovers"],
			baseMove1: "sludgebomb", baseMove2: "curse", baseMove3: "explosion",
			fillerMoves1: ["thunderbolt", "fireblast"],
		},
		tier: "NU",
	},
	rhyhorn: {
		tier: "LC",
	},
	rhydon: {
		randomSet1: { // Attacker
			chance: 14,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "rockslide",
			fillerMoves1: ["curse", "hiddenpowerbug", "roar"],
			fillerMoves2: ["rest", "hiddenpowerbug", "roar"],
		},
		randomSet2: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "rockslide", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		tier: "OU",
	},
	chansey: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["pound", "sweetscent"]},
		],
		tier: "UU",
	},
	blissey: { // Heal Bell + Toxic
		randomSet1: {
			chance: 5,
			item: ["leftovers"],
			baseMove1: "healbell", baseMove2: "softboiled", baseMove3: "toxic",
			fillerMoves2: ["icebeam", "icebeam", "flamethrower", "lightscreen"],
		},
		randomSet2: { // Heal Bell + Light Screen
			chance: 10,
			item: ["leftovers"],
			baseMove1: "healbell", baseMove2: "softboiled", baseMove3: "lightscreen",
			fillerMoves1: ["toxic", "icebeam"],
		},
		randomSet3: { // Heal Bell + Sing/Counter
			chance: 13,
			item: ["leftovers"],
			baseMove1: "healbell", baseMove2: "softboiled", baseMove3: "icebeam",
			fillerMoves1: ["sing", "counter"],
		},
		randomSet4: { // Reflect
			chance: 16,
			item: ["leftovers"],
			baseMove1: "reflect", baseMove2: "softboiled", baseMove3: "thunderwave",
			fillerMoves1: ["seismictoss", "icebeam", "icebeam"],
		},
		tier: "OU",
	},
	tangela: {
		randomSet1: { // Growth
			chance: 7,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "gigadrain",
			fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerwater"],
			fillerMoves2: ["sleeppowder", "sleeppowder", "synthesis"],
		},
		randomSet2: { // Defensive
			chance: 14,
			item: ["leftovers"],
			baseMove1: "sleeppowder", baseMove2: "gigadrain",
			fillerMoves1: ["reflect", "reflect", "synthesis"],
			fillerMoves2: ["stunspore", "stunspore", "synthesis"],
		},
		randomSet3: { // Swords Dance
			chance: 16,
			item: ["leftovers"],
			baseMove1: "sleeppowder", baseMove2: "swordsdance", baseMove3: "gigadrain", baseMove4: "bodyslam",
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["constrict", "sleeppowder", "synthesis"]},
		],
		tier: "NU",
	},
	kangaskhan: {
		randomSet1: { // Curse
			chance: 6,
			item: ["leftovers", "leftovers", "mintberry"],
			baseMove1: "curse", baseMove2: "earthquake", baseMove3: "rest",
			fillerMoves1: ["bodyslam", "bodyslam", "return"],
		},
		randomSet2: { // RestTalk
			chance: 11,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["bodyslam", "bodyslam", "return"],
			fillerMoves2: ["earthquake", "curse"],
		},
		randomSet3: { // Attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "bodyslam", baseMove2: "earthquake",
			fillerMoves1: ["rockslide", "rockslide", "shadowball"],
			fillerMoves2: ["shadowball", "counter", "dynamicpunch", "doubleedge", "substitute"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["cometpunch", "feintattack"]},
		],
		tier: "UUBL",
	},
	horsea: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["bubble", "haze"]},
		],
		tier: "LC",
	},
	seadra: {
		tier: "NFE",
	},
	kingdra: {
		randomSet1: { // RestTalk
			chance: 8,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["icebeam", "dragonbreath"],
		},
		randomSet2: { // Defensive
			chance: 11,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "haze", baseMove3: "rest",
			fillerMoves1: ["dragonbreath", "toxic", "icebeam"],
		},
		randomSet3: { // Curse + Rest
			chance: 14,
			item: ["leftovers", "leftovers", "mintberry"],
			baseMove1: "curse", baseMove2: "return", baseMove3: "surf", baseMove4: "rest",
		},
		randomSet4: { // Curse
			chance: 16,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "return", baseMove3: "surf",
			fillerMoves1: ["hiddenpowerrock", "hiddenpowerbug"],
		},
		tier: "UUBL",
	},
	goldeen: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["peck", "tailwhip", "swordsdance"]},
		],
		tier: "LC",
	},
	seaking: {
		randomSet1: { // Swords Dance
			chance: 11,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "return", baseMove3: "surf",
			fillerMoves1: ["hiddenpowerground", "hiddenpowerrock", "hiddenpowerrock", "hiddenpowerflying", "hiddenpowerbug"],
		},
		randomSet2: { // Swords Dance + Agility
			chance: 14,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "return",
			fillerMoves1: ["hiddenpowerground", "hiddenpowerground", "surf", "surf", "hiddenpowerrock", "hiddenpowerflying", "hiddenpowerbug"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["return", "icebeam"],
		},
		tier: "NU",
	},
	staryu: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "harden", "twister"]},
		],
		tier: "LC",
	},
	starmie: {
		randomSet1: { // Special attacker
			chance: 8,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry", "miracleberry"],
			baseMove1: "recover",
			fillerMoves1: ["hydropump", "surf"],
			fillerMoves2: ["thunderbolt", "thunderbolt", "thunderbolt", "psychic"],
			fillerMoves3: ["icebeam", "icebeam", "icebeam", "psychic"],
		},
		randomSet2: { // Balanced
			chance: 11,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "recover",
			fillerMoves1: ["thunderwave", "thunderwave", "thunderwave", "lightscreen", "lightscreen", "reflect"],
			fillerMoves2: ["thunderbolt", "icebeam", "psychic"],
		},
		randomSet3: { // Defensive
			chance: 15,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "recover",
			fillerMoves1: ["thunderwave", "thunderwave", "rapidspin"],
			fillerMoves2: ["lightscreen", "lightscreen", "reflect", "rapidspin"],
		},
		randomSet4: { // Parafusion
			chance: 16,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "recover", baseMove3: "thunderwave", baseMove4: "confuseray",
		},
		tier: "OU",
	},
	mrmime: {
		randomSet1: { // Defensive
			chance: 9,
			item: ["leftovers"],
			baseMove1: "psychic",
			fillerMoves1: ["thunderbolt", "thunderbolt", "hypnosis", "encore"],
			fillerMoves2: ["thunderwave", "thunderwave", "encore"],
			fillerMoves3: ["reflect", "lightscreen"],
		},
		randomSet2: { // Attacker
			chance: 14,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "psychic", baseMove2: "thunderbolt",
			fillerMoves1: ["icepunch", "firepunch", "thunderwave", "counter", "encore"],
			fillerMoves2: ["hypnosis", "hypnosis", "thunderwave", "counter"],
		},
		randomSet3: { // Sub attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "thunderbolt", baseMove3: "substitute",
			fillerMoves1: ["icepunch", "firepunch", "hypnosis", "thunderwave", "encore"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["barrier", "mindreader"]},
		],
		tier: "UU",
	},
	scyther: {
		randomSet1: { // SD + 3 attacks
			chance: 7,
			item: ["leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "wingattack",
			fillerMoves1: ["return", "return", "doubleedge"],
			fillerMoves2: ["hiddenpowerground", "hiddenpowerground", "hiddenpowerrock", "hiddenpowerbug"],
		},
		randomSet2: { // SD + 3 attacks w/ SW
			chance: 9,
			item: ["leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "steelwing",
			fillerMoves1: ["hiddenpowerground", "hiddenpowerbug", "hiddenpowerbug"],
			fillerMoves2: ["return", "wingattack"],
		},
		randomSet3: { // Sub + Baton Pass
			chance: 11,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "substitute", baseMove3: "batonpass",
			fillerMoves1: ["wingattack", "hiddenpowerbug", "hiddenpowerground", "return"],
		},
		randomSet4: { // Other Baton Pass
			chance: 14,
			item: ["leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "batonpass",
			fillerMoves1: ["wingattack", "return", "hiddenpowerbug", "hiddenpowerground"],
			fillerMoves2: ["agility", "hiddenpowerbug", "hiddenpowerground"],
		},
		randomSet5: { // Endure + Reversal
			chance: 16,
			item: ["miracleberry"],
			baseMove1: "swordsdance", baseMove2: "endure", baseMove3: "reversal",
			fillerMoves1: ["wingattack", "hiddenpowerrock", "hiddenpowerrock"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["quickattack", "leer", "sonicboom"]},
		],
		tier: "UU",
	},
	scizor: {
		randomSet1: { // SD + 3 attacks
			chance: 7,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "steelwing",
			fillerMoves1: ["return", "doubleedge"],
			fillerMoves2: ["hiddenpowerground", "hiddenpowerbug", "hiddenpowerrock"],
		},
		randomSet2: { // SD + Agility
			chance: 9,
			item: ["leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "agility",
			fillerMoves1: ["steelwing", "steelwing", "steelwing", "return"],
			fillerMoves2: ["hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock", "hiddenpowerground"],
		},
		randomSet3: { // Baton Pass
			chance: 13,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "agility", baseMove3: "batonpass",
			fillerMoves1: ["hiddenpowersteel", "hiddenpowersteel", "hiddenpowerbug", "hiddenpowerground", "return"],
		},
		randomSet4: { // 2 attacks + Baton Pass
			chance: 15,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "batonpass",
			fillerMoves1: ["steelwing", "steelwing", "steelwing", "return"],
			fillerMoves2: ["hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock", "hiddenpowerground"],
		},
		randomSet5: { // Sub + Baton Pass
			chance: 16,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "substitute", baseMove3: "batonpass",
			fillerMoves1: ["hiddenpowersteel", "hiddenpowersteel", "hiddenpowerbug", "hiddenpowerground", "return"],
		},
		tier: "UUBL",
	},
	smoochum: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["pound", "lick", "metronome"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["pound", "lick", "petaldance"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["pound", "lick", "dizzypunch"]},
		],
		tier: "LC",
	},
	jynx: {
		randomSet1: { // Substitute
			chance: 6,
			item: ["leftovers"],
			baseMove1: "icebeam", baseMove2: "psychic", baseMove3: "lovelykiss", baseMove4: "substitute",
		},
		randomSet2: { // Other standard
			chance: 10,
			item: ["leftovers", "miracleberry"],
			baseMove1: "icebeam", baseMove2: "psychic", baseMove3: "lovelykiss",
			fillerMoves1: ["counter", "counter", "reflect", "reflect", "toxic"],
		},
		randomSet3: { // Thief
			chance: 12,
			item: [""],
			baseMove1: "icebeam", baseMove2: "psychic", baseMove3: "lovelykiss", baseMove4: "thief",
		},
		randomSet4: { // Perish trapper
			chance: 16,
			item: ["leftovers"],
			baseMove1: "meanlook", baseMove2: "perishsong", baseMove3: "protect",
			fillerMoves1: ["icebeam", "icebeam", "substitute"],
		},
		tier: "OU",
	},
	elekid: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["quickattack", "leer", "dizzypunch"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["quickattack", "leer", "pursuit"]},
		],
		tier: "LC",
	},
	electabuzz: {
		randomSet1: { // Standard attacker
			chance: 9,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "thunderbolt", baseMove2: "icepunch",
			fillerMoves1: ["psychic", "psychic", "firepunch"],
			fillerMoves2: ["crosschop", "crosschop", "thunderwave", "thunderwave", "counter"],
		},
		randomSet2: { // Attacker with support
			chance: 14,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "thunderbolt", baseMove2: "icepunch",
			fillerMoves1: ["psychic", "psychic", "firepunch", "lightscreen"],
			fillerMoves2: ["crosschop", "thunderwave"],
		},
		randomSet3: { // Substitute attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "icepunch", baseMove3: "substitute",
			fillerMoves1: ["psychic", "crosschop", "thunderwave", "thunderwave"],
		},
		tier: "UU",
	},
	magby: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["ember", "feintattack"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["ember", "dizzypunch"]},
		],
		tier: "LC",
	},
	magmar: {
		randomSet1: { // Standard attacker
			chance: 12,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "fireblast", baseMove2: "crosschop",
			fillerMoves1: ["thunderpunch", "thunderpunch", "hiddenpowergrass"],
			fillerMoves2: ["hiddenpowerice", "hiddenpowergrass", "hiddenpowergrass", "confuseray", "confuseray"],
		},
		randomSet2: { // Sunny Day attacker
			chance: 16,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "fireblast", baseMove2: "sunnyday",
			fillerMoves1: ["thunderpunch", "thunderpunch", "hiddenpowergrass"],
			fillerMoves2: ["crosschop", "hiddenpowerice"],
		},
		tier: "NU",
	},
	pinsir: {
		randomSet1: { // Swords Dance + 3 attacks
			chance: 12,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "submission",
			fillerMoves1: ["bodyslam", "return"],
			fillerMoves2: ["hiddenpowerbug", "hiddenpowerrock"],
		},
		randomSet2: { // Swords Dance + Substitute
			chance: 14,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "substitute",
			fillerMoves1: ["bodyslam", "return"],
			fillerMoves2: ["hiddenpowerbug", "hiddenpowerrock", "hiddenpowerground"],
		},
		randomSet3: { // Swords Dance + Rest
			chance: 16,
			item: ["mintberry"],
			baseMove1: "swordsdance", baseMove2: "rest",
			fillerMoves1: ["bodyslam", "return"],
			fillerMoves2: ["hiddenpowerbug", "hiddenpowerrock", "hiddenpowerground"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["visegrip", "rockthrow"]},
		],
		tier: "UU",
	},
	tauros: {
		randomSet1: { // RestTalk
			chance: 11,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "earthquake",
			fillerMoves1: ["bodyslam", "return", "doubleedge", "doubleedge"],
		},
		randomSet2: { // Curse 1
			chance: 12,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "bodyslam", baseMove3: "earthquake", baseMove4: "doubleedge",
		},
		randomSet3: { // Curse 2
			chance: 15,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "earthquake",
			fillerMoves1: ["bodyslam", "return"],
			fillerMoves2: ["quickattack", "quickattack", "rest", "irontail"],
		},
		randomSet4: { // Berserk gene
			chance: 16,
			item: ["berserkgene"],
			baseMove1: "return", baseMove2: "earthquake", baseMove3: "hyperbeam",
			fillerMoves1: ["hiddenpowerbug", "irontail", "quickattack"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "tailwhip", "quickattack"]},
		],
		tier: "UUBL",
	},
	magikarp: {
		eventPokemon: [
			{"generation": 1, "level": 5, "moves": ["dragonrage"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["splash", "bubble"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["splash", "reversal"]},
		],
		tier: "LC",
	},
	gyarados: {
		randomSet1: { // Mixed attacker 1
			chance: 7,
			item: ["leftovers"],
			fillerMoves1: ["doubleedge", "doubleedge", "return"],
			fillerMoves2: ["hydropump", "surf"],
			fillerMoves3: ["thunder", "zapcannon"],
			fillerMoves4: ["hiddenpowerbug", "hiddenpowerground", "hiddenpowerrock", "hiddenpowerflying", "hiddenpowerflying", "hiddenpowerflying"],
		},
		randomSet2: { // Mixed attacker 2
			chance: 10,
			item: ["leftovers"],
			fillerMoves1: ["doubleedge", "bodyslam"],
			fillerMoves2: ["hydropump", "surf"],
			fillerMoves3: ["icebeam", "fireblast", "rest"],
			fillerMoves4: ["hiddenpowerflying", "hiddenpowerground", "hiddenpowerrock"],
		},
		randomSet3: { // Curse 1
			chance: 12,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "hiddenpowerflying",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["bodyslam", "doubleedge"],
		},
		randomSet4: { // Curse 2
			chance: 14,
			item: ["leftovers"],
			baseMove1: "curse",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["return", "return", "bodyslam"],
			fillerMoves3: ["hiddenpowerbug", "hiddenpowerground", "hiddenpowerground", "hiddenpowerrock", "hiddenpowerrock"],
		},
		randomSet5: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "hydropump", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["bodyslam", "doubleedge"],
		},
		tier: "UU",
	},
	lapras: {
		randomSet1: { // RestTalk
			chance: 8,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "icebeam",
			fillerMoves1: ["thunder", "thunderbolt"],
		},
		randomSet2: { // Attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "icebeam",
			fillerMoves1: ["thunderbolt", "thunderbolt", "thunder"],
			fillerMoves2: ["hydropump", "surf"],
			fillerMoves3: ["rest", "sing", "confuseray", "reflect"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["watergun", "growl", "sing", "bite"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["watergun", "growl", "sing", "futuresight"]},
		],
		tier: "UUBL",
	},
	ditto: {
		randomSet1: { // Transform
			chance: 16,
			item: ["metalpowder"],
			baseMove1: "transform",
		},
		tier: "NU",
	},
	eevee: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "tailwhip", "growth"]},
		],
		tier: "LC",
	},
	vaporeon: {
		randomSet1: { // RestTalk
			chance: 6,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["growth", "growth", "growth", "growth", "icebeam", "icebeam", "toxic"],
		},
		randomSet2: { // Rest Growth
			chance: 10,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "rest",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["icebeam", "icebeam", "icebeam", "icebeam", "acidarmor"],
		},
		randomSet3: { // Non-Rest Growth
			chance: 12,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "icebeam",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["hiddenpowerelectric", "hiddenpowerelectric", "hiddenpowergrass", "acidarmor"],
		},
		randomSet4: { // Defensive
			chance: 15,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "rest",
			fillerMoves1: ["toxic", "icebeam", "haze"],
			fillerMoves2: ["haze", "reflect"],
		},
		randomSet5: { // Baton Pass
			chance: 16,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "batonpass", baseMove3: "growth",
			fillerMoves1: ["acidarmor", "substitute"],
		},
		tier: "OU",
	},
	jolteon: {
		randomSet1: { // Growth Substitute attacker
			chance: 3,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "substitute", baseMove3: "thunderbolt", baseMove4: "hiddenpowerice",
		},
		randomSet2: { // Other Growth attacker
			chance: 10,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "growth", baseMove2: "thunderbolt", baseMove3: "hiddenpowerice",
			fillerMoves1: ["batonpass", "batonpass", "batonpass", "thunderwave", "thunderwave", "reflect"],
		},
		randomSet3: { // Substitute Baton Pass
			chance: 13,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "thunderbolt", baseMove3: "substitute", baseMove4: "batonpass",
		},
		randomSet4: { // Agility Baton Pass
			chance: 16,
			item: ["leftovers", "miracleberry"],
			baseMove1: "growth", baseMove2: "thunderbolt", baseMove3: "agility", baseMove4: "batonpass",
		},
		tier: "UUBL",
	},
	flareon: {
		randomSet1: { // Mixed Attacker
			chance: 9,
			item: ["leftovers"],
			baseMove1: "fireblast",
			fillerMoves1: ["bodyslam", "bodyslam", "return"],
			fillerMoves2: ["shadowball", "shadowball", "irontail"],
			fillerMoves3: ["hiddenpowerground", "hiddenpowerrock", "irontail", "sunnyday"],
		},
		randomSet2: { // Mixed Attacker w/ Zap Cannon
			chance: 12,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "zapcannon",
			fillerMoves1: ["return", "return", "doubleedge"],
			fillerMoves2: ["shadowball", "shadowball", "shadowball", "irontail", "irontail"],
		},
		randomSet3: { // Growth Pass
			chance: 14,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "growth", baseMove3: "batonpass",
			fillerMoves1: ["return", "zapcannon"],
		},
		randomSet4: { // Growth attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "growth", baseMove3: "return",
			fillerMoves1: ["hiddenpowergrass", "zapcannon"],
		},
		tier: "NU",
	},
	espeon: {
		randomSet1: { // Growth attacker w/o Sub
			chance: 8,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "growth", baseMove2: "psychic",
			fillerMoves1: ["bite", "hiddenpowerdark"],
			fillerMoves2: ["morningsun", "morningsun", "morningsun", "hiddenpowerwater", "hiddenpowerwater", "zapcannon"],
		},
		randomSet2: { // Growth attacker w/ Sub
			chance: 11,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "psychic", baseMove3: "substitute",
			fillerMoves1: ["bite", "hiddenpowerdark"],
		},
		randomSet3: { // Growth attacker w/ Reflect
			chance: 13,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "psychic", baseMove3: "reflect", baseMove4: "morningsun",
		},
		randomSet4: { // Growth Pass
			chance: 16,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "psychic", baseMove3: "substitute", baseMove4: "batonpass",
		},
		tier: "UUBL",
	},
	umbreon: {
		randomSet1: { // Annoyer
			chance: 5,
			item: ["leftovers"],
			baseMove1: "toxic", baseMove2: "confuseray",
			fillerMoves1: ["rest", "moonlight"],
			fillerMoves2: ["meanlook", "hiddenpowerdark"],
		},
		randomSet2: { // ML + BP
			chance: 9,
			item: ["leftovers"],
			baseMove1: "meanlook", baseMove2: "batonpass",
			fillerMoves1: ["rest", "rest", "moonlight"],
			fillerMoves2: ["curse", "curse", "charm", "sandattack"],
		},
		randomSet3: { // Support
			chance: 13,
			item: ["leftovers"],
			baseMove1: "toxic", baseMove2: "reflect",
			fillerMoves1: ["hiddenpowerdark", "hiddenpowerdark", "pursuit"],
			fillerMoves2: ["rest", "moonlight"],
		},
		randomSet4: { // Curse BP
			chance: 15,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "batonpass", baseMove3: "bodyslam", baseMove4: "moonlight",
		},
		randomSet5: { // Growth BP
			chance: 16,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "batonpass", baseMove3: "hiddenpowerdark", baseMove4: "moonlight",
		},
		tier: "OU",
	},
	porygon: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "conversion", "barrier"]},
		],
		tier: "LC",
	},
	porygon2: {
		randomSet1: { // Curse
			chance: 10,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "recover", baseMove3: "icebeam",
			fillerMoves1: ["return", "return", "doubleedge"],
		},
		randomSet2: { // Mixed attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "recover", baseMove2: "icebeam",
			fillerMoves1: ["return", "return", "doubleedge"],
			fillerMoves2: ["thunderbolt", "thunderbolt", "thunder", "thunderwave", "thunderwave"],
		},
		tier: "UUBL",
	},
	omanyte: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["constrict", "withdraw", "rockthrow"]},
		],
		tier: "LC",
	},
	omastar: {
		randomSet1: { // Defensive
			chance: 10,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "rest",
			fillerMoves1: ["icebeam", "icebeam", "reflect", "haze", "toxic"],
			fillerMoves2: ["icebeam", "reflect", "haze", "toxic"],
		},
		randomSet2: { // RestTalk
			chance: 14,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "icebeam",
			fillerMoves1: ["surf", "surf", "hydropump"],
		},
		randomSet3: { // Attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "icebeam",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["hiddenpowerelectric", "hiddenpowerelectric", "hiddenpowergrass"],
			fillerMoves3: ["reflect", "toxic", "rest", "hydropump"],
		},
		tier: "UU",
	},
	kabuto: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["scratch", "harden", "rockthrow"]},
		],
		tier: "LC",
	},
	kabutops: {
		randomSet1: { // Swords Dance
			chance: 16,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "swordsdance", baseMove2: "ancientpower", baseMove3: "surf",
			fillerMoves1: ["hiddenpowerground", "hiddenpowerflying", "hiddenpowerbug", "doubleedge"],
		},
		tier: "UU",
	},
	aerodactyl: {
		randomSet1: { // Attacker
			chance: 4,
			item: ["leftovers", "miracleberry"],
			baseMove1: "hiddenpowerflying", baseMove2: "ancientpower", baseMove3: "earthquake", baseMove4: "fireblast",
		},
		randomSet2: { // Sub Attacker
			chance: 8,
			item: ["leftovers"],
			baseMove1: "hiddenpowerflying", baseMove2: "ancientpower", baseMove3: "earthquake", baseMove4: "substitute",
		},
		randomSet3: { // Defensive
			chance: 12,
			item: ["leftovers"],
			baseMove1: "reflect", baseMove2: "whirlwind",
			fillerMoves1: ["rest", "rest", "toxic"],
			fillerMoves2: ["hiddenpowerrock", "hiddenpowerrock", "hiddenpowerflying", "wingattack"],
		},
		randomSet4: { // Curse
			chance: 16,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "earthquake", baseMove3: "ancientpower",
			fillerMoves1: ["hiddenpowerflying", "whirlwind"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["wingattack", "rockthrow"]},
		],
		tier: "UUBL",
	},
	snorlax: {
		randomSet1: { // Curse + EQ
			chance: 5,
			item: ["leftovers", "leftovers", "mintberry"],
			baseMove1: "curse", baseMove2: "rest", baseMove3: "earthquake",
			fillerMoves1: ["bodyslam", "bodyslam", "return", "doubleedge"],
		},
		randomSet2: { // RestTalk
			chance: 10,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["bodyslam", "doubleedge"],
			fillerMoves2: ["curse", "curse", "earthquake"],
		},
		randomSet3: { // Mixed attacker
			chance: 14,
			item: ["leftovers"],
			baseMove1: "earthquake",
			fillerMoves1: ["bodyslam", "doubleedge", "return"],
			fillerMoves2: ["lovelykiss", "lovelykiss", "rockslide", "rockslide", "fireblast", "surf", "counter"],
			fillerMoves3: ["selfdestruct", "selfdestruct", "rest"],
		},
		randomSet4: { // Belly Drum
			chance: 16,
			item: ["leftovers"],
			baseMove1: "bellydrum", baseMove2: "return", baseMove3: "earthquake", baseMove4: "lovelykiss",
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "lovelykiss"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "splash"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "sweetkiss"]},
		],
		tier: "OU",
	},
	articuno: { // Defensive
		randomSet1: {
			chance: 11,
			item: ["leftovers"],
			baseMove1: "icebeam", baseMove2: "rest",
			fillerMoves1: ["toxic", "reflect", "whirlwind"],
			fillerMoves2: ["toxic", "reflect", "whirlwind"],
		},
		randomSet2: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "icebeam", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["toxic", "toxic", "toxic", "hiddenpowerelectric", "hiddenpowerflying", "return"],
		},
		eventPokemon: [
			{"generation": 2, "level": 50, "shiny": true, "moves": ["mist", "agility", "mindreader", "icebeam"]},
		],
		tier: "UUBL",
	},
	zapdos: {
		randomSet1: { // RestTalk
			chance: 7,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["thunderbolt", "thunderbolt", "thunder"],
			fillerMoves2: ["hiddenpowerice", "hiddenpowerice", "drillpeck"],
		},
		randomSet2: { // Defensive 1
			chance: 9,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "rest",
			fillerMoves1: ["thunderwave", "thunderwave", "toxic", "toxic", "whirlwind"],
			fillerMoves2: ["lightscreen", "lightscreen", "reflect", "reflect", "whirlwind"],
		},
		randomSet3: { // Defensive 2
			chance: 11,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "hiddenpowerice",
			fillerMoves1: ["thunderwave", "thunderwave", "toxic", "rest"],
			fillerMoves2: ["reflect", "lightscreen", "lightscreen", "whirlwind", "rest"],
		},
		randomSet4: { // Defensive 3
			chance: 13,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "drillpeck",
			fillerMoves1: ["thunderwave", "thunderwave", "toxic", "toxic", "rest"],
			fillerMoves2: ["reflect", "lightscreen", "whirlwind", "rest"],
		},
		randomSet5: { // 3 attacks
			chance: 16,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "thunderbolt", baseMove2: "drillpeck",
			fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerwater", "hiddenpowerwater", "hiddenpowerwater"],
			fillerMoves2: ["thunderwave", "thunderwave", "thunderwave", "toxic", "lightscreen", "reflect"],
		},
		eventPokemon: [
			{"generation": 2, "level": 50, "shiny": true, "moves": ["thunderwave", "agility", "detect", "drillpeck"]},
		],
		tier: "OU",
	},
	moltres: {
		randomSet1: { // Attacker
			chance: 10,
			item: ["leftovers", "leftovers", "leftovers", "charcoal", "miracleberry"],
			baseMove1: "fireblast", baseMove2: "sunnyday", baseMove3: "hiddenpowergrass",
			fillerMoves1: ["reflect", "reflect", "flamethrower"],
		},
		randomSet2: { // Sub Attacker
			chance: 13,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "sunnyday", baseMove3: "hiddenpowergrass", baseMove4: "substitute",
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["hiddenpowergrass", "hiddenpowergrass", "return"],
		},
		eventPokemon: [
			{"generation": 2, "level": 50, "shiny": true, "moves": ["firespin", "agility", "endure", "flamethrower"]},
		],
		tier: "UUBL",
	},
	dratini: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["wrap", "leer", "hydropump"]},
			{"generation": 2, "level": 15, "shiny": 1, "moves": ["wrap", "thunderwave", "twister", "extremespeed"]},
		],
		tier: "LC",
	},
	dragonair: {
		tier: "NFE",
	},
	dragonite: { // Mixed attacker
		randomSet1: {
			chance: 11,
			item: ["leftovers"],
			baseMove1: "icebeam",
			fillerMoves1: ["bodyslam", "return", "doubleedge", "extremespeed"],
			fillerMoves2: ["thunderbolt", "thunderbolt", "thunder"],
			fillerMoves3: ["thunderwave", "wingattack", "fireblast", "dynamicpunch"],
		},
		randomSet2: { // Defensive 1
			chance: 14,
			item: ["leftovers"],
			baseMove1: "thunderwave",
			fillerMoves1: ["reflect", "lightscreen"],
			fillerMoves2: ["icebeam", "icebeam", "rest"],
			fillerMoves3: ["return", "return", "icebeam"],
		},
		randomSet3: { // Defensive 2
			chance: 16,
			item: ["leftovers"],
			baseMove1: "bodyslam", baseMove2: "haze",
			fillerMoves1: ["reflect", "lightscreen"],
			fillerMoves2: ["rest", "rest", "icebeam"],
		},
		tier: "UUBL",
	},
	mewtwo: {
		randomSet1: { // Attacker
			chance: 8,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "icebeam", baseMove3: "thunderbolt",
			fillerMoves1: ["recover", "recover", "recover", "recover", "selfdestruct"],
		},
		randomSet2: { // Attacker 2
			chance: 13,
			item: ["leftovers"],
			baseMove1: "psychic",
			fillerMoves1: ["icebeam", "icebeam", "icebeam", "thunderbolt", "thunderbolt", "fireblast"],
			fillerMoves2: ["fireblast", "fireblast", "fireblast", "shadowball", "shadowball", "counter"],
			fillerMoves3: ["recover", "recover", "recover", "recover", "selfdestruct"],
		},
		randomSet3: { // Defensive
			chance: 16,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "recover",
			fillerMoves1: ["thunderwave", "thunderwave", "reflect"],
			fillerMoves2: ["reflect", "reflect", "icebeam", "thunderbolt", "fireblast"],
		},
		eventPokemon: [
			{"generation": 2, "level": 70, "shiny": true, "moves": ["psychup", "futuresight", "mist", "psychic"]},
		],
		tier: "Uber",
	},
	mew: {
		randomSet1: { // Swords Dance
			chance: 7,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "earthquake",
			fillerMoves1: ["rockslide", "rockslide", "rockslide", "rockslide", "shadowball", "bodyslam", "sludgebomb"],
			fillerMoves2: ["explosion", "explosion", "explosion", "softboiled", "softboiled"],
		},
		randomSet2: { // Mixed attacker
			chance: 12,
			item: ["leftovers"],
			baseMove1: "psychic",
			fillerMoves1: ["earthquake", "earthquake", "earthquake", "thunderbolt", "fireblast", "shadowball"],
			fillerMoves2: ["icebeam", "icebeam", "icebeam", "thunderbolt", "thunderbolt", "fireblast"],
			fillerMoves3: ["softboiled", "explosion"],
		},
		randomSet3: { // Defensive
			chance: 16,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "softboiled",
			fillerMoves1: ["thunderwave", "thunderwave", "thunderwave", "reflect"],
			fillerMoves2: ["reflect", "reflect", "reflect", "reflect", "earthquake", "icebeam", "thunderbolt", "fireblast"],
		},
		eventPokemon: [
			{"generation": 1, "level": 5, "moves": ["pound"]},
			{"generation": 2, "level": 5, "moves": ["pound"]},
		],
		eventOnly: true,
		tier: "Uber",
	},
	chikorita: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "growl", "petaldance"]},
		],
		tier: "LC",
	},
	bayleef: {
		tier: "NFE",
	},
	meganium: {
		randomSet1: { // Swords Dance
			chance: 6,
			item: ["leftovers"],
			baseMove1: "swordsdance", baseMove2: "earthquake",
			fillerMoves1: ["gigadrain", "gigadrain", "gigadrain", "bodyslam"],
			fillerMoves2: ["synthesis", "synthesis", "synthesis", "bodyslam", "ancientpower"],
		},
		randomSet2: { // Defensive
			chance: 11,
			item: ["leftovers"],
			baseMove1: "synthesis", baseMove2: "leechseed",
			fillerMoves1: ["reflect", "lightscreen", "lightscreen"],
			fillerMoves2: ["razorleaf", "razorleaf", "razorleaf", "hiddenpowerice", "bodyslam"],
		},
		randomSet3: { // 2 attacks
			chance: 16,
			item: ["leftovers"],
			fillerMoves1: ["gigadrain", "gigadrain", "razorleaf"],
			fillerMoves2: ["earthquake", "bodyslam", "bodyslam"],
			fillerMoves3: ["leechseed", "reflect", "lightscreen", "lightscreen"],
			fillerMoves4: ["synthesis", "synthesis", "synthesis", "leechseed", "leechseed"],
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["reflect", "poisonpowder", "synthesis", "bodyslam"]},
		],
		tier: "UUBL",
	},
	cyndaquil: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "leer", "doubleedge"]},
		],
		tier: "LC",
	},
	quilava: {
		tier: "NFE",
	},
	typhlosion: {
		randomSet1: {
			chance: 11,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "fireblast", baseMove2: "earthquake", baseMove3: "thunderpunch",
			fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerice"],
		},
		randomSet2: {
			chance: 14,
			item: ["leftovers", "leftovers", "charcoal", "miracleberry"],
			baseMove1: "fireblast", baseMove2: "sunnyday", baseMove3: "thunderpunch", baseMove4: "earthquake",
		},
		randomSet3: { // Sleep Talk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["earthquake", "thunderpunch"],
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["smokescreen", "ember", "quickattack", "flamewheel"]},
		],
		tier: "UUBL",
	},
	totodile: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["scratch", "leer", "submission"]},
		],
		tier: "LC",
	},
	croconaw: {
		tier: "NFE",
	},
	feraligatr: {
		randomSet1: { // Curse
			chance: 8,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "earthquake",
			fillerMoves1: ["surf", "surf", "hydropump"],
			fillerMoves2: ["rockslide", "rockslide", "ancientpower"],
		},
		randomSet2: { // Mixed attacker
			chance: 12,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "icebeam",
			fillerMoves1: ["hydropump", "surf"],
			fillerMoves2: ["rockslide", "crunch", "hiddenpowerbug"],
		},
		randomSet3: { // Mixed attacker + Rest
			chance: 14,
			item: ["leftovers", "mintberry"],
			baseMove1: "earthquake", baseMove2: "icebeam", baseMove3: "rest",
			fillerMoves1: ["hydropump", "surf"],
		},
		randomSet4: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["hydropump", "surf", "surf"],
			fillerMoves2: ["earthquake", "icebeam"],
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["watergun", "bite", "scaryface", "slash"]},
		],
		tier: "NUBL",
	},
	sentret: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "defensecurl", "dizzypunch"]},
		],
		tier: "LC",
	},
	furret: {
		randomSet1: { // Curse + Rest
			chance: 6,
			item: ["leftovers", "mintberry"],
			baseMove1: "curse", baseMove2: "rest",
			fillerMoves1: ["return", "return", "doubleedge"],
			fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
		},
		randomSet2: { // Curse + 3 attacks
			chance: 9,
			item: ["leftovers"],
			baseMove1: "curse",
			fillerMoves1: ["return", "return", "doubleedge"],
			fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
			fillerMoves3: ["hiddenpowerground", "shadowball", "irontail", "quickattack", "surf"],
		},
		randomSet3: { // Curse + Amnesia
			chance: 10,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "amnesia", baseMove3: "return", baseMove4: "rest",
		},
		randomSet4: { // Curse + RestTalk
			chance: 14,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["return", "doubleedge"],
		},
		randomSet5: { // Thief attacker
			chance: 16,
			item: [""],
			baseMove1: "thief",
			fillerMoves1: ["return", "doubleedge"],
			fillerMoves2: ["hiddenpowerground", "shadowball", "irontail", "surf", "dynamicpunch"],
			fillerMoves3: ["hiddenpowerground", "shadowball", "irontail"],
		},
		tier: "NU",
	},
	hoothoot: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "growl", "nightshade"]},
		],
		tier: "LC",
	},
	noctowl: {
		randomSet1: { // Defensive
			chance: 10,
			item: ["leftovers"],
			baseMove1: "reflect",
			fillerMoves1: ["hiddenpowerflying", "hiddenpowerflying", "return", "nightshade", "nightshade"],
			fillerMoves2: ["rest", "hypnosis", "toxic"],
			fillerMoves3: ["whirlwind", "whirlwind", "whirlwind", "nightshade", "toxic", "rest"],
		},
		randomSet2: { // Curse
			chance: 14,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "hypnosis",
			fillerMoves1: ["hiddenpowerflying", "return"],
			fillerMoves2: ["steelwing", "nightshade"],
		},
		randomSet3: { // Thief
			chance: 16,
			item: [""],
			baseMove1: "thief", baseMove2: "hypnosis", baseMove3: "nightshade",
			fillerMoves1: ["hiddenpowerflying", "return"],
		},
		tier: "NU",
	},
	ledyba: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "barrier"]},
		],
		tier: "LC",
	},
	ledian: {
		randomSet1: { // Agility + Baton Pass
			chance: 6,
			item: ["leftovers"],
			baseMove1: "agility", baseMove2: "toxic", baseMove3: "batonpass",
			fillerMoves1: ["reflect", "lightscreen", "barrier"],
		},
		randomSet2: { // Curse + Baton Pass
			chance: 10,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "hiddenpowerbug", baseMove3: "batonpass",
			fillerMoves1: ["agility", "lightscreen"],
		},
		randomSet3: { // Support
			chance: 14,
			item: ["leftovers"],
			fillerMoves1: ["reflect", "lightscreen", "safeguard"],
			fillerMoves2: ["reflect", "lightscreen", "safeguard"],
			fillerMoves3: ["toxic", "hiddenpowerbug", "rest"],
			fillerMoves4: ["toxic", "rest"],
		},
		randomSet4: { // Support + Thief
			chance: 16,
			item: [""],
			baseMove1: "thief",
			fillerMoves1: ["reflect", "lightscreen", "safeguard"],
			fillerMoves2: ["reflect", "lightscreen", "safeguard"],
			fillerMoves3: ["toxic", "hiddenpowerbug"],
		},
		tier: "NU",
	},
	spinarak: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["poisonsting", "stringshot", "growth"]},
		],
		tier: "LC",
	},
	ariados: {
		randomSet1: {
			chance: 9, // Curse + 3 attacks
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "sludgebomb",
			fillerMoves1: ["return", "return", "gigadrain"],
			fillerMoves2: ["hiddenpowerground", "hiddenpowerbug"],
		},
		randomSet2: { // Baton Pass
			chance: 13,
			item: ["leftovers"],
			baseMove1: "sludgebomb", baseMove2: "batonpass",
			fillerMoves1: ["curse", "agility"],
			fillerMoves2: ["return", "hiddenpowerground", "hiddenpowerbug", "nightshade", "nightshade"],
		},
		randomSet3: { // Spider Web + BP
			chance: 16,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "spiderweb", baseMove3: "sludgebomb", baseMove4: "batonpass",
		},
		tier: "NU",
	},
	chinchou: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["bubble", "thunderwave", "supersonic", "lightscreen"]},
		],
		tier: "LC",
	},
	lanturn: {
		randomSet1: { // Attacker
			chance: 10,
			item: ["leftovers"],
			baseMove1: "thunderwave", baseMove2: "thunderbolt",
			fillerMoves1: ["surf", "icebeam"],
			fillerMoves2: ["surf", "surf", "icebeam", "icebeam", "confuseray", "lightscreen"],
		},
		randomSet2: { // RestTalk
			chance: 15,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk",
			fillerMoves1: ["thunderbolt", "thunder"],
			fillerMoves2: ["surf", "icebeam"],
		},
		randomSet3: { // Rain Dance
			chance: 16,
			item: ["leftovers"],
			baseMove1: "raindance", baseMove2: "surf", baseMove3: "thunder", baseMove4: "icebeam",
		},
		tier: "UU",
	},
	togepi: {
		tier: "LC",
	},
	togetic: {
		randomSet1: { // 2 attacks
			chance: 9,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "toxic",
			fillerMoves1: ["doubleedge", "return", "psychic"],
			fillerMoves2: ["safeguard", "encore"],
		},
		randomSet2: { // Curse
			chance: 13,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "fireblast",
			fillerMoves1: ["return", "doubleedge"],
			fillerMoves2: ["steelwing", "hiddenpowersteel"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "fireblast",
			fillerMoves1: ["return", "doubleedge", "doubleedge"],
		},
		tier: "NU",
	},
	natu: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["peck", "leer", "safeguard"]},
		],
		tier: "LC",
	},
	xatu: {
		randomSet1: { // Attacker
			chance: 12,
			item: ["leftovers", "leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "psychic", baseMove2: "drillpeck",
			fillerMoves1: ["hiddenpowerbug", "hiddenpowerbug", "hiddenpowerfire"],
			fillerMoves2: ["nightshade", "nightshade", "gigadrain", "confuseray"],
		},
		randomSet2: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "psychic", baseMove2: "drillpeck", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		tier: "NU",
	},
	mareep: {
		tier: "LC",
	},
	flaaffy: {
		tier: "NFE",
	},
	ampharos: {
		randomSet1: { // Attacker
			chance: 8,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "hiddenpowerice",
			fillerMoves1: ["firepunch", "firepunch", "firepunch", "dynamicpunch"],
			fillerMoves2: ["thunderwave", "thunderwave", "thunderwave", "thunderwave", "dynamicpunch"],
		},
		randomSet2: { // Defensive
			chance: 12,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "hiddenpowerice", baseMove3: "thunderwave",
			fillerMoves1: ["reflect", "lightscreen"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "hiddenpowerice",
			fillerMoves1: ["thunderbolt", "thunderbolt", "thunder"],
		},
		tier: "UU",
	},
	marill: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "defensecurl", "dizzypunch"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "defensecurl", "hydropump"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "defensecurl", "scaryface"]},
		],
		tier: "LC",
	},
	azumarill: {
		randomSet1: { // Belly Drum + Rest
			chance: 5,
			item: ["mintberry"],
			baseMove1: "bellydrum", baseMove2: "surf", baseMove3: "rest",
			fillerMoves1: ["doubleedge", "return"],
		},
		randomSet2: { // Belly Drum + HP
			chance: 8,
			item: ["leftovers"],
			baseMove1: "bellydrum", baseMove2: "surf", baseMove3: "hiddenpowerground",
			fillerMoves1: ["doubleedge", "return"],
		},
		randomSet3: { // RestTalk
			chance: 12,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["icebeam", "icebeam", "icebeam", "toxic", "toxic"],
		},
		randomSet4: { // Defensive
			chance: 16,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "toxic", baseMove3: "lightscreen", baseMove4: "rest",
		},
		tier: "NU",
	},
	sudowoodo: {
		randomSet1: { // Attacker
			chance: 14,
			item: ["leftovers"],
			baseMove1: "rockslide", baseMove2: "earthquake", baseMove3: "selfdestruct",
			fillerMoves1: ["curse", "hiddenpowerbug"],
		},
		randomSet2: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rockslide", baseMove2: "earthquake", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["rockthrow", "mimic", "substitute"]},
		],
		tier: "NU",
	},
	hoppip: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["splash", "synthesis", "tailwhip", "agility"]},
		],
		tier: "LC",
	},
	skiploom: {
		tier: "NFE",
	},
	jumpluff: {
		randomSet1: { // Status 1
			chance: 10,
			item: ["leftovers"],
			baseMove1: "sleeppowder", baseMove2: "stunspore", baseMove3: "leechseed",
			fillerMoves1: ["encore", "gigadrain", "hiddenpowerflying", "hiddenpowerflying"],
		},
		randomSet2: { // Status 2
			chance: 16,
			item: ["leftovers"],
			baseMove1: "sleeppowder", baseMove2: "toxic",
			fillerMoves1: ["leechseed", "leechseed", "synthesis", "reflect"],
			fillerMoves2: ["reflect", "reflect", "synthesis", "encore", "gigadrain"],
		},
		tier: "UU",
	},
	aipom: {
		randomSet1: { // Baton Pass
			chance: 8,
			item: ["leftovers"],
			baseMove1: "batonpass", baseMove2: "return",
			fillerMoves1: ["curse", "curse", "agility", "counter"],
			fillerMoves2: ["curse", "curse", "agility", "counter"],
		},
		randomSet2: { // Curse + 3 attacks
			chance: 12,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "return",
			fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
			fillerMoves3: ["hiddenpowerground", "shadowball", "irontail", "counter"],
		},
		randomSet3: { // Thief
			chance: 14,
			item: [""],
			baseMove1: "thief", baseMove2: "return",
			fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
			fillerMoves3: ["hiddenpowerground", "shadowball", "irontail", "counter", "thunderbolt", "thunder"],
		},
		randomSet4: { // Attacker
			chance: 16,
			item: ["leftovers", "miracleberry"],
			baseMove1: "return", baseMove2: "counter",
			fillerMoves2: ["hiddenpowerground", "shadowball", "irontail"],
			fillerMoves3: ["hiddenpowerground", "shadowball", "irontail", "thunderbolt", "thunder"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["scratch", "tailwhip", "mimic"]},
		],
		tier: "NU",
	},
	sunkern: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["absorb", "growth", "splash"]},
		],
		tier: "LC",
	},
	sunflora: {
		randomSet1: { // Growth
			chance: 16,
			item: ["leftovers"],
			baseMove1: "growth", baseMove2: "gigadrain", baseMove3: "synthesis",
			fillerMoves1: ["hiddenpowerice", "hiddenpowerice", "hiddenpowerfire", "hiddenpowerwater"],
		},
		tier: "NU",
	},
	yanma: {
		randomSet1: { // Curse
			chance: 8,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "gigadrain",
			fillerMoves1: ["hiddenpowerbug", "hiddenpowerrock"],
			fillerMoves2: ["return", "wingattack"],
		},
		randomSet2: { // Thief
			chance: 12,
			item: [""],
			baseMove1: "thief", baseMove2: "toxic",
			fillerMoves1: ["gigadrain", "hiddenpowerice"],
			fillerMoves2: ["return", "hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock"],
		},
		randomSet3: { // Other
			chance: 16,
			item: [""],
			baseMove1: "toxic",
			fillerMoves1: ["gigadrain", "hiddenpowerice"],
			fillerMoves2: ["return", "hiddenpowerbug", "hiddenpowerbug", "hiddenpowerrock"],
			fillerMoves3: ["whirlwind", "whirlwind", "sweetkiss"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "foresight", "steelwing"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "foresight", "sweetkiss"]},
		],
		tier: "NU",
	},
	wooper: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["watergun", "tailwhip", "bellydrum"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["watergun", "tailwhip", "scaryface"]},
		],
		tier: "LC",
	},
	quagsire: {
		randomSet1: { // Curse
			chance: 8,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "earthquake",
			fillerMoves1: ["rest", "rest", "surf", "surf", "ancientpower", "ancientpower", "hiddenpowerrock"],
			fillerMoves2: ["sludgebomb", "bodyslam"],
		},
		randomSet2: { // Belly Drum
			chance: 12,
			item: ["leftovers"],
			baseMove1: "bellydrum", baseMove2: "earthquake", baseMove3: "sludgebomb",
			fillerMoves1: ["ancientpower", "hiddenpowerrock"],
		},
		randomSet3: { // Defensive
			chance: 16,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "rest",
			fillerMoves1: ["surf", "surf", "surf", "bodyslam", "sludgebomb", "icebeam"],
			fillerMoves2: ["haze", "sleeptalk"],
		},
		tier: "UU",
	},
	murkrow: {
		randomSet1: { // Attacker
			chance: 12,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "drillpeck", baseMove2: "faintattack",
			fillerMoves1: ["hiddenpowerice", "hiddenpowerground"],
			fillerMoves2: ["pursuit", "pursuit", "nightshade"],
		},
		randomSet2: { // Thief
			chance: 16,
			item: ["", "", "miracleberry"],
			baseMove1: "drillpeck", baseMove2: "hiddenpowerdark", baseMove3: "thief",
			fillerMoves2: ["pursuit", "nightshade"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["peck", "beatup"]},
		],
		tier: "NU",
	},
	misdreavus: {
		randomSet1: { // Perish trapper
			chance: 11,
			item: ["leftovers"],
			baseMove1: "meanlook", baseMove2: "perishsong", baseMove3: "protect",
			fillerMoves1: ["thunderbolt", "confuseray", "confuseray", "confuseray", "destinybond"],
		},
		randomSet2: { // Other
			chance: 16,
			item: ["leftovers"],
			fillerMoves1: ["thunderbolt", "thunder"],
			fillerMoves2: ["shadowball", "shadowball", "psychic", "hiddenpowerice"],
			fillerMoves3: ["hypnosis", "hypnosis", "toxic"],
			fillerMoves4: ["destinybond", "rest", "painsplit", "painsplit"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["growl", "hypnosis"]},
		],
		tier: "OU",
	},
	unown: {
		randomSet1: { // Psychic
			chance: 10,
			item: ["twistedspoon"],
			baseMove1: "hiddenpowerpsychic",
		},
		randomSet2: { // Ice
			chance: 12,
			item: ["nevermeltice"],
			baseMove1: "hiddenpowerice",
		},
		randomSet3: { // Rock
			chance: 14,
			item: ["hardstone"],
			baseMove1: "hiddenpowerrock",
		},
		randomSet4: { // Dark
			chance: 16,
			item: ["blackglasses"],
			baseMove1: "hiddenpowerdark",
		},
		tier: "NU",
	},
	wobbuffet: {
		randomSet1: { // Standard
			chance: 12,
			item: ["leftovers"],
			baseMove1: "counter", baseMove2: "mirrorcoat",
			fillerMoves1: ["mimic", "mimic", "safeguard", "safeguard", "destinybond"],
			fillerMoves2: ["mimic", "mimic", "safeguard", "safeguard", "destinybond"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["mirrorcoat", "safeguard", "destinybond", "mimic"]},
		],
		tier: "NU",
	},
	girafarig: {
		randomSet1: { // Attacker
			chance: 8,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "earthquake", baseMove3: "psychic", baseMove4: "thunderbolt",
		},
		randomSet2: { // Agility + BP
			chance: 10,
			item: ["leftovers"],
			baseMove1: "batonpass", baseMove2: "agility", baseMove3: "psychic",
			fillerMoves1: ["return", "crunch", "return", "earthquake", "thunderbolt"],
		},
		randomSet3: { // Curse + BP
			chance: 14,
			item: ["leftovers"],
			baseMove1: "batonpass", baseMove2: "curse", baseMove3: "return",
			fillerMoves1: ["psychic", "earthquake", "amnesia"],
		},
		randomSet4: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "return", baseMove4: "psychic",
		},
		tier: "UU",
	},
	pineco: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "protect", "substitute"]},
		],
		tier: "LC",
	},
	forretress: { // Spikes
		randomSet1: {
			chance: 16,
			item: ["leftovers"],
			baseMove1: "spikes", baseMove2: "explosion",
			fillerMoves1: ["rapidspin", "rapidspin", "rapidspin", "reflect", "toxic"],
			fillerMoves2: ["hiddenpowerbug", "hiddenpowersteel", "toxic"],
		},
		tier: "OU",
	},
	dunsparce: {
		randomSet1: { // Curse
			chance: 7,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "return",
			fillerMoves1: ["rockslide", "irontail", "irontail"],
			fillerMoves2: ["glare", "rest"],
		},
		randomSet2: { // Mixed attacker
			chance: 9,
			item: ["leftovers"],
			baseMove1: "return",
			fillerMoves1: ["thunderbolt", "thunder"],
			fillerMoves2: ["flamethrower", "flamethrower", "rockslide", "rest"],
			fillerMoves3: ["irontail", "hiddenpowerice", "rest", "rest"],
		},
		randomSet3: { // Mixed attacker + Glare
			chance: 13,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "glare",
			fillerMoves1: ["thunderbolt", "thunder"],
			fillerMoves2: ["flamethrower", "rockslide", "irontail"],
		},
		randomSet4: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "return",
			fillerMoves1: ["thunderbolt", "thunder", "curse", "curse", "flamethrower", "irontail"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["rage", "defensecurl", "furyattack"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["rage", "defensecurl", "horndrill"]},
		],
		tier: "NU",
	},
	gligar: {
		randomSet1: { // Attacker
			chance: 13,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "wingattack", baseMove3: "hiddenpowerrock",
			fillerMoves1: ["curse", "curse", "curse", "counter", "counter", "screech"],
		},
		randomSet2: { // Thief
			chance: 16,
			item: [""],
			baseMove1: "earthquake", baseMove2: "wingattack", baseMove3: "hiddenpowerrock", baseMove4: "thief",
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "moves": ["earthquake", "poisonsting", "counter", "wingattack"]},
		],
		tier: "UU",
	},
	snubbull: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "scaryface", "tailwhip", "lovelykiss"]},
		],
		tier: "LC",
	},
	granbull: {
		randomSet1: { // Curse
			chance: 8,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "return",
			fillerMoves1: ["healbell", "healbell", "healbell", "healbell", "rest", "roar"],
			fillerMoves2: ["shadowball", "hiddenpowerground"],
		},
		randomSet2: { // Support
			chance: 10,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "healbell", baseMove3: "reflect",
			fillerMoves1: ["rest", "rest", "roar"],
		},
		randomSet3: { // Attacker
			chance: 14,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "healbell", baseMove3: "shadowball",
			fillerMoves1: ["roar", "zapcannon", "dynamicpunch", "icepunch", "firepunch", "hiddenpowerground", "hiddenpowerground"],
		},
		randomSet4: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "return",
			fillerMoves1: ["shadowball", "hiddenpowerground"],
		},
		tier: "UU",
	},
	qwilfish: {
		randomSet1: { // Standard
			chance: 16,
			item: ["leftovers"],
			baseMove1: "spikes", baseMove2: "sludgebomb",
			fillerMoves1: ["surf", "hydropump"],
			fillerMoves2: ["curse", "curse", "curse", "haze"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "poisonsting", "doubleedge"]},
		],
		tier: "UU",
	},
	shuckle: {
		randomSet1: { // Standard
			chance: 11,
			item: ["leftovers"],
			baseMove1: "toxic", baseMove2: "wrap", baseMove3: "rest",
			fillerMoves1: ["encore", "protect", "swagger"],
		},
		randomSet2: { // Curse
			chance: 16,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "earthquake", baseMove3: "hiddenpowerrock", baseMove4: "rest",
		},
		tier: "NU",
	},
	heracross: {
		randomSet1: { // Curse
			chance: 10,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "megahorn", baseMove3: "earthquake",
			fillerMoves1: ["hiddenpowerrock", "hiddenpowerrock", "hiddenpowerrock", "counter"],
		},
		randomSet2: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "megahorn",
			fillerMoves1: ["earthquake", "earthquake", "curse"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "leer", "seismictoss"]},
		],
		tier: "OU",
	},
	sneasel: {
		randomSet1: { // Attacker
			chance: 16,
			item: ["leftovers", "leftovers", "leftovers", "miracleberry"],
			baseMove1: "icebeam", baseMove2: "return", baseMove3: "shadowball",
			fillerMoves1: ["irontail", "irontail", "dynamicpunch", "dynamicpunch", "counter", "curse"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["scratch", "leer", "moonlight"]},
		],
		tier: "NU",
	},
	teddiursa: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["scratch", "leer", "sweetscent"]},
		],
		tier: "LC",
	},
	ursaring: {
		randomSet1: { // Curse + EQ + Rest
			chance: 6,
			item: ["leftovers", "leftovers", "mintberry"],
			baseMove1: "return", baseMove2: "earthquake", baseMove3: "curse", baseMove4: "rest",
		},
		randomSet2: { // Curse + EQ w/o Rest
			chance: 9,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "earthquake", baseMove3: "curse",
			fillerMoves1: ["roar", "roar", "roar", "zapcannon", "firepunch", "counter"],
		},
		randomSet3: { // Rest attacker
			chance: 11,
			item: ["leftovers", "leftovers", "leftovers", "mintberry"],
			baseMove1: "return", baseMove2: "earthquake", baseMove3: "rest",
			fillerMoves1: ["roar", "zapcannon", "firepunch", "counter"],
		},
		randomSet4: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rest", baseMove2: "sleeptalk", baseMove3: "return",
			fillerMoves2: ["curse", "earthquake"],
		},
		tier: "UUBL",
	},
	slugma: {
		tier: "LC",
	},
	magcargo: {
		randomSet1: { // Curse
			chance: 6,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "fireblast", baseMove3: "earthquake", baseMove4: "rockslide",
		},
		randomSet2: { // Other
			chance: 12,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "rockslide", baseMove3: "toxic",
			fillerMoves1: ["sunnyday", "hiddenpowergrass"],
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["earthquake", "rockslide", "rockslide"],
		},
		tier: "NU",
	},
	swinub: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "whirlwind"]},
		],
		tier: "LC",
	},
	piloswine: {
		randomSet1: { // Curse
			chance: 6,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "icebeam", baseMove3: "earthquake",
			fillerMoves1: ["bodyslam", "bodyslam", "rockslide", "rockslide", "rockslide", "ancientpower"],
		},
		randomSet2: { // Curse + Rest
			chance: 10,
			item: ["leftovers", "leftovers", "leftovers", "mintberry"],
			baseMove1: "curse", baseMove2: "icebeam", baseMove3: "earthquake", baseMove4: "rest",
		},
		randomSet3: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "icebeam", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		tier: "UU",
	},
	corsola: {
		randomSet1: { // Curse
			chance: 9,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "surf", baseMove3: "rockslide", baseMove4: "recover",
		},
		randomSet2: { // Defensive
			chance: 16,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "recover", baseMove3: "toxic",
			fillerMoves1: ["mirrorcoat", "icebeam"],
		},
		tier: "NU",
	},
	remoraid: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["watergun", "amnesia"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["watergun", "mist"]},
		],
		tier: "LC",
	},
	octillery: {
		randomSet3: { // Attacker
			chance: 11,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "flamethrower", baseMove3: "icebeam",
			fillerMoves1: ["return", "return", "hiddenpowergrass", "hiddenpowerelectric", "rest"],
		},
		randomSet2: { // Curse
			chance: 16,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "return", baseMove3: "surf", baseMove4: "icebeam",
		},
		tier: "NU",
	},
	delibird: {
		randomSet1: { // Thief
			chance: 12,
			item: ["", "", "miracleberry"],
			baseMove1: "icebeam", baseMove2: "spikes", baseMove3: "thief", baseMove4: "toxic",
		},
		randomSet2: { // Other
			chance: 16,
			item: ["", "", "miracleberry"],
			baseMove1: "icebeam", baseMove2: "spikes", baseMove3: "toxic",
			fillerMoves1: ["hiddenpowerelectric", "hiddenpowergrass", "hiddenpowerflying", "present", "sleeptalk"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["present", "payday"]},
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["present", "spikes"]},
		],
		tier: "NU",
	},
	mantine: {
		randomSet1: { // Defensive
			chance: 9,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "haze", baseMove3: "toxic",
			fillerMoves1: ["icebeam", "icebeam", "icebeam", "rest", "rest", "confuseray"],
		},
		randomSet2: { // Special attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "icebeam",
			fillerMoves1: ["hydropump", "hydropump", "surf"],
			fillerMoves2: ["hiddenpowerelectric", "hiddenpowergrass"],
			fillerMoves3: ["confuseray", "haze", "rest", "toxic"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "bubble", "gust"]},
		],
		tier: "NU",
	},
	skarmory: {
		randomSet1: { // Standard
			chance: 12,
			item: ["leftovers"],
			baseMove1: "drillpeck", baseMove2: "whirlwind", baseMove3: "rest",
			fillerMoves1: ["toxic", "toxic", "curse"],
		},
		randomSet2: { // Thief
			chance: 16,
			item: ["", "", "mintberry"],
			baseMove1: "drillpeck", baseMove2: "whirlwind", baseMove3: "rest", baseMove4: "thief",
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["leer", "peck", "furycutter"]},
		],
		tier: "OU",
	},
	houndour: {
		tier: "LC",
	},
	houndoom: {
		randomSet1: { // SunnyBeam
			chance: 8,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "sunnyday", baseMove2: "fireblast", baseMove3: "solarbeam",
			fillerMoves1: ["crunch", "crunch", "crunch", "pursuit", "counter"],
		},
		randomSet2: { // Pursuit
			chance: 13,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "fireblast", baseMove2: "crunch", baseMove3: "pursuit",
			fillerMoves1: ["counter", "hiddenpowergrass"],
		},
		randomSet3: { // Substitute
			chance: 14,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "crunch", baseMove3: "substitute",
			fillerMoves1: ["counter", "pursuit", "pursuit", "hiddenpowergrass"],
		},
		randomSet4: { // Thief
			chance: 16,
			item: ["", "", "miracleberry"],
			baseMove1: "fireblast", baseMove2: "crunch", baseMove3: "thief",
			fillerMoves1: ["counter", "pursuit", "pursuit", "hiddenpowergrass"],
		},
		tier: "UUBL",
	},
	phanpy: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "growl", "absorb"]},
			{"generation": 2, "level": 5, "moves": ["tackle", "growl", "encore"]},
		],
		tier: "LC",
	},
	donphan: {
		randomSet1: { // Curse
			chance: 8,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "earthquake", baseMove3: "ancientpower",
			fillerMoves1: ["bodyslam", "hiddenpowerbug", "roar", "rest"],
		},
		randomSet2: { // Defensive
			chance: 14,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "roar", baseMove3: "rest",
			fillerMoves1: ["rapidspin", "bodyslam"],
		},
		randomSet3: { // Attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "earthquake", baseMove2: "ancientpower",
			fillerMoves1: ["bodyslam", "bodyslam", "hiddenpowerbug"],
			fillerMoves2: ["rapidspin", "roar", "roar", "hiddenpowerbug"],
		},
		tier: "UUBL",
	},
	stantler: {
		randomSet1: { // Attacker
			chance: 5,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "earthquake", baseMove3: "hypnosis",
			fillerMoves1: ["confuseray", "rest", "reflect", "lightscreen"],
		},
		randomSet2: { // Curse
			chance: 10,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "earthquake", baseMove3: "curse",
			fillerMoves1: ["hypnosis", "hypnosis", "rest", "lightscreen"],
		},
		randomSet3: { // Defensive
			chance: 13,
			item: ["leftovers", "leftovers", "leftovers", "mintberry"],
			baseMove1: "return", baseMove2: "earthquake", baseMove3: "rest",
			fillerMoves1: ["reflect", "lightscreen"],
		},
		randomSet4: { // RestTalk
			chance: 16,
			item: ["leftovers"],
			baseMove1: "return", baseMove2: "earthquake", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "safeguard"]},
		],
		tier: "NU",
	},
	smeargle: {
		randomSet1: { // Utility
			chance: 8,
			item: ["leftovers", "leftovers", "miracleberry"],
			baseMove1: "spikes", baseMove2: "healbell",
			fillerMoves1: ["counter", "mirrorcoat", "destinybond"],
			fillerMoves2: ["superfang", "superfang", "destinybond", "destinybond", "spore", "spore", "rapidspin", "encore", "recover"],
		},
		randomSet2: { // Belly Drum Pass
			chance: 12,
			item: ["leftovers"],
			baseMove1: "bellydrum", baseMove2: "spore", baseMove3: "batonpass",
			fillerMoves1: ["agility", "agility", "agility", "substitute", "substitute", "return", "extremespeed"],
		},
		randomSet3: { // Trap Pass
			chance: 16,
			item: ["leftovers"],
			baseMove1: "spiderweb", baseMove2: "batonpass",
			fillerMoves1: ["counter", "mirrorcoat", "destinybond", "recover", "encore", "disable"],
			fillerMoves2: ["destinybond", "spikes", "substitute", "recover", "encore", "disable", "healbell"],
		},
		tier: "UUBL",
	},
	miltank: {
		randomSet3: { // Standard
			chance: 12,
			item: ["leftovers"],
			baseMove1: "bodyslam", baseMove2: "healbell", baseMove3: "milkdrink",
			fillerMoves1: ["earthquake", "earthquake", "curse", "toxic"],
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["tackle", "growl", "megakick"]},
		],
		tier: "OU",
	},
	raikou: {
		randomSet1: { // RestTalk
			chance: 8,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["crunch", "hiddenpowerice", "hiddenpowerice"],
		},
		randomSet2: { // Reflect
			chance: 13,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "reflect", baseMove3: "rest",
			fillerMoves1: ["crunch", "hiddenpowerice", "hiddenpowerice"],
		},
		randomSet3: { // Special attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "thunderbolt", baseMove2: "crunch", baseMove3: "hiddenpowerice",
			fillerMoves1: ["rest", "roar", "reflect", "toxic"],
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["leer", "thundershock", "roar", "quickattack"]},
		],
		tier: "OU",
	},
	entei: {
		randomSet1: { // RestTalk
			chance: 7,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "return", baseMove3: "rest", baseMove4: "sleeptalk",
		},
		randomSet2: { // Curse
			chance: 13,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "return", baseMove3: "irontail", baseMove4: "curse",
		},
		randomSet3: { // SunnyBeam
			chance: 16,
			item: ["leftovers"],
			baseMove1: "fireblast", baseMove2: "return", baseMove3: "sunnyday", baseMove4: "solarbeam",
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["leer", "ember", "roar", "firespin"]},
		],
		tier: "UUBL",
	},
	suicune: {
		randomSet1: { // RestTalk
			chance: 7,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "rest", baseMove3: "sleeptalk",
			fillerMoves1: ["icebeam", "toxic"],
		},
		randomSet2: { // Defensive
			chance: 16,
			item: ["leftovers"],
			baseMove1: "surf", baseMove2: "rest",
			fillerMoves1: ["icebeam", "toxic", "toxic"],
			fillerMoves2: ["roar", "roar", "mirrorcoat"],
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["leer", "watergun", "roar", "gust"]},
		],
		tier: "OU",
	},
	larvitar: {
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["bite", "leer", "rage"]},
		],
		tier: "LC",
	},
	pupitar: {
		tier: "NFE",
	},
	tyranitar: {
		randomSet1: { // Mixed attacker
			chance: 7,
			item: ["leftovers"],
			baseMove1: "rockslide", baseMove2: "earthquake", baseMove3: "thunderbolt",
			fillerMoves1: ["fireblast", "icebeam", "crunch", "dynamicpunch"],
		},
		randomSet2: { // Curse
			chance: 11,
			item: ["leftovers"],
			baseMove1: "rockslide", baseMove2: "earthquake", baseMove3: "curse",
			fillerMoves1: ["roar", "roar", "roar", "crunch", "icebeam", "fireblast"],
		},
		randomSet3: { // Pursuit/Roar
			chance: 16,
			item: ["leftovers"],
			baseMove1: "rockslide", baseMove2: "earthquake",
			fillerMoves1: ["pursuit", "pursuit", "roar"],
			fillerMoves2: ["thunderbolt", "fireblast", "icebeam", "crunch"],
		},
		tier: "OU",
	},
	lugia: {
		randomSet1: { // Curse
			chance: 11,
			item: ["leftovers"],
			baseMove1: "curse", baseMove2: "aeroblast",
			fillerMoves1: ["earthquake", "earthquake", "earthquake", "whirlwind"],
			fillerMoves2: ["recover", "recover", "rest"],
		},
		randomSet2: { // Mixed attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "aeroblast",
			fillerMoves1: ["psychic", "icebeam", "hydropump", "earthquake", "earthquake"],
			fillerMoves2: ["thunderbolt", "thunder", "whirlwind", "whirlwind", "whirlwind"],
			fillerMoves3: ["recover", "recover", "rest"],
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["aeroblast", "safeguard", "gust", "recover"]},
		],
		tier: "Uber",
	},
	hooh: {
		randomSet1: { // Mixed attacker
			chance: 16,
			item: ["leftovers"],
			baseMove1: "recover", baseMove2: "earthquake",
			fillerMoves1: ["sacredfire", "sacredfire", "fireblast"],
			fillerMoves2: ["thunderbolt", "thunder"],
		},
		eventPokemon: [
			{"generation": 2, "level": 40, "shiny": true, "moves": ["sacredfire", "safeguard", "gust", "recover"]},
		],
		tier: "Uber",
	},
	celebi: {
		randomSet1: { // Heal Bell
			chance: 14,
			item: ["leftovers"],
			baseMove1: "healbell", baseMove2: "recover", baseMove3: "psychic",
			fillerMoves1: ["leechseed", "leechseed", "leechseed", "leechseed", "gigadrain", "perishsong"],
		},
		randomSet2: { // Curse + BP
			chance: 16,
			item: ["leftovers"],
			baseMove1: "healbell", baseMove2: "recover", baseMove3: "curse", baseMove4: "batonpass",
		},
		eventPokemon: [
			{"generation": 2, "level": 5, "shiny": 1, "moves": ["leechseed", "confusion", "healbell", "recover"]},
		],
		eventOnly: true,
		tier: "Uber",
	},
};

exports.BattleFormatsData = BattleFormatsData;
