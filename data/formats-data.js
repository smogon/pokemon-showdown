'use strict';

/**@type {{[k: string]: TemplateFormatsData}} */
let BattleFormatsData = {
	bulbasaur: {
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["sweetscent", "growth", "solarbeam", "synthesis"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "growl", "leechseed", "vinewhip"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tackle", "growl", "leechseed", "vinewhip"]},
			{"generation": 5, "level": 1, "shiny": 1, "ivs": {"def": 31}, "isHidden": false, "moves": ["falseswipe", "block", "frenzyplant", "weatherball"], "pokeball": "pokeball"},
			{"generation": 6, "level": 5, "isHidden": false, "moves": ["growl", "leechseed", "vinewhip", "poisonpowder"], "pokeball": "cherishball"},
			{"generation": 6, "level": 5, "isHidden": true, "moves": ["tackle", "growl", "celebrate"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 5},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	ivysaur: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	venusaur: {
		randomBattleMoves: ["gigadrain", "leechseed", "sleeppowder", "sludgebomb", "substitute"],
		eventPokemon: [
			{"generation": 6, "level": 100, "isHidden": true, "moves": ["solarbeam", "frenzyplant", "synthesis", "grasspledge"], "pokeball": "cherishball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	venusaurmega: {
		requiredItem: "Venusaurite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	charmander: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["scratch", "growl", "ember"], "pokeball": "pokeball"},
			{"generation": 4, "level": 40, "gender": "M", "nature": "Mild", "moves": ["return", "hiddenpower", "quickattack", "howl"], "pokeball": "cherishball"},
			{"generation": 4, "level": 40, "gender": "M", "nature": "Naive", "moves": ["return", "hiddenpower", "quickattack", "howl"], "pokeball": "cherishball"},
			{"generation": 4, "level": 40, "gender": "M", "nature": "Naughty", "moves": ["return", "hiddenpower", "quickattack", "howl"], "pokeball": "cherishball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["scratch", "growl", "ember", "smokescreen"]},
			{"generation": 4, "level": 40, "gender": "M", "nature": "Hardy", "moves": ["return", "hiddenpower", "quickattack", "howl"], "pokeball": "cherishball"},
			{"generation": 5, "level": 1, "shiny": 1, "ivs": {"spe": 31}, "isHidden": false, "moves": ["falseswipe", "block", "blastburn", "acrobatics"], "pokeball": "pokeball"},
			{"generation": 6, "level": 5, "isHidden": false, "moves": ["growl", "ember", "smokescreen", "dragonrage"], "pokeball": "cherishball"},
			{"generation": 6, "level": 5, "isHidden": true, "moves": ["scratch", "growl", "celebrate"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 5},
		],
		tier: "LC",
	},
	charmeleon: {
		tier: "NFE",
	},
	charizard: {
		randomBattleMoves: ["airslash", "earthquake", "fireblast", "focusblast", "workup"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["wingattack", "slash", "dragonrage", "firespin"], "pokeball": "pokeball"},
			{"generation": 6, "level": 36, "gender": "M", "isHidden": false, "moves": ["firefang", "flameburst", "airslash", "inferno"], "pokeball": "cherishball"},
			{"generation": 6, "level": 36, "gender": "M", "isHidden": false, "moves": ["firefang", "airslash", "dragonclaw", "dragonrage"], "pokeball": "cherishball"},
			{"generation": 6, "level": 36, "shiny": true, "gender": "M", "isHidden": false, "moves": ["overheat", "solarbeam", "focusblast", "holdhands"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "isHidden": true, "moves": ["flareblitz", "blastburn", "scaryface", "firepledge"], "pokeball": "cherishball"},
			{"generation": 6, "level": 36, "gender": "M", "nature": "Serious", "isHidden": false, "moves": ["flamethrower", "ember", "firespin", "flameburst"], "pokeball": "cherishball"},
			{"generation": 7, "level": 40, "gender": "M", "nature": "Jolly", "isHidden": false, "moves": ["flareblitz", "dragonclaw", "fly", "dragonrage"], "pokeball": "cherishball"},
			{"generation": 7, "level": 40, "gender": "M", "nature": "Adamant", "isHidden": false, "moves": ["flamethrower", "dragonrage", "slash", "seismictoss"], "pokeball": "pokeball"},
			{"generation": 7, "level": 50, "isHidden": false, "moves": ["dragondance", "flareblitz", "fly", "earthquake"], "pokeball": "cherishball"},
		],
		tier: "RU",
		doublesTier: "DOU",
	},
	charizardmegax: {
		requiredItem: "Charizardite X",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	charizardmegay: {
		requiredItem: "Charizardite Y",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	charizardgmax: {
		isGigantamax: "G-Max Wildfire",
		tier: "Uber",
		doublesTier: "DOU",
	},
	squirtle: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "tailwhip", "bubble", "withdraw"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tackle", "tailwhip", "bubble", "withdraw"]},
			{"generation": 5, "level": 1, "shiny": 1, "ivs": {"hp": 31}, "isHidden": false, "moves": ["falseswipe", "block", "hydrocannon", "followme"], "pokeball": "pokeball"},
			{"generation": 6, "level": 5, "isHidden": false, "moves": ["tailwhip", "watergun", "withdraw", "bubble"], "pokeball": "cherishball"},
			{"generation": 6, "level": 5, "isHidden": true, "moves": ["tackle", "tailwhip", "celebrate"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 5},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	wartortle: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	blastoise: {
		randomBattleMoves: ["earthquake", "hydropump", "icebeam", "rapidspin", "scald", "shellsmash"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["protect", "raindance", "skullbash", "hydropump"], "pokeball": "pokeball"},
			{"generation": 6, "level": 100, "isHidden": true, "moves": ["hydropump", "hydrocannon", "irondefense", "waterpledge"], "pokeball": "cherishball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	blastoisemega: {
		requiredItem: "Blastoisinite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	caterpie: {
		encounters: [
			{"generation": 1, "level": 3, "shiny": false},
			{"generation": 2, "level": 3},
			{"generation": 3, "level": 3},
		],
		tier: "LC",
	},
	metapod: {
		encounters: [
			{"generation": 1, "level": 4, "shiny": false},
			{"generation": 2, "level": 4},
			{"generation": 3, "level": 4},
			{"generation": 4, "level": 3},
			{"generation": 6, "level": 4},
			{"generation": 7, "level": 3},
		],
		tier: "NFE",
	},
	butterfree: {
		randomBattleMoves: ["energyball", "hurricane", "quiverdance", "sleeppowder"],
		eventPokemon: [
			{"generation": 3, "level": 30, "moves": ["morningsun", "psychic", "sleeppowder", "aerialace"]},
		],
		encounters: [
			{"generation": 2, "level": 7},
			{"generation": 4, "level": 6},
			{"generation": 7, "level": 9},
		],
		tier: "NU",
		doublesTier: "DOU",
	},
	butterfreegmax: {
		randomBattleMoves: ["airslash", "bugbuzz", "quiverdance", "sleeppowder"],
		isGigantamax: "G-Max Befuddle",
		tier: "Uber",
		doublesTier: "DUU",
	},
	weedle: {
		encounters: [
			{"generation": 1, "level": 3, "shiny": false},
			{"generation": 2, "level": 3},
			{"generation": 3, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kakuna: {
		encounters: [
			{"generation": 1, "level": 4, "shiny": false},
			{"generation": 2, "level": 4},
			{"generation": 3, "level": 4},
			{"generation": 4, "level": 3},
			{"generation": 6, "level": 4},
			{"generation": 7, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	beedrill: {
		eventPokemon: [
			{"generation": 3, "level": 30, "moves": ["batonpass", "sludgebomb", "twineedle", "swordsdance"]},
		],
		encounters: [
			{"generation": 2, "level": 7},
			{"generation": 4, "level": 6},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	beedrillmega: {
		requiredItem: "Beedrillite",
		isNonstandard: "Past",
	},
	pidgey: {
		encounters: [
			{"generation": 1, "level": 2, "shiny": false},
			{"generation": 2, "level": 2},
			{"generation": 3, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pidgeotto: {
		eventPokemon: [
			{"generation": 3, "level": 30, "abilities": ["keeneye"], "moves": ["refresh", "wingattack", "steelwing", "featherdance"]},
		],
		encounters: [
			{"generation": 1, "level": 9, "shiny": false},
			{"generation": 2, "level": 7},
			{"generation": 3, "level": 7},
			{"generation": 4, "level": 7},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pidgeot: {
		eventPokemon: [
			{"generation": 5, "level": 61, "gender": "M", "nature": "Naughty", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": false, "abilities": ["keeneye"], "moves": ["whirlwind", "wingattack", "skyattack", "mirrormove"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 7, "level": 29, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pidgeotmega: {
		requiredItem: "Pidgeotite",
		isNonstandard: "Past",
	},
	rattata: {
		encounters: [
			{"generation": 1, "level": 2, "shiny": false},
			{"generation": 2, "level": 2},
			{"generation": 3, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rattataalola: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	raticate: {
		eventPokemon: [
			{"generation": 3, "level": 34, "moves": ["refresh", "superfang", "scaryface", "hyperfang"]},
		],
		encounters: [
			{"generation": 1, "level": 15, "shiny": false},
			{"generation": 2, "level": 6},
			{"generation": 4, "level": 13},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	raticatealola: {
		encounters: [
			{"generation": 7, "level": 17},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	raticatealolatotem: {
		eventPokemon: [
			{"generation": 7, "level": 20, "perfectIVs": 3, "moves": ["bite", "pursuit", "hyperfang", "assurance"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
	},
	spearow: {
		eventPokemon: [
			{"generation": 3, "level": 22, "moves": ["batonpass", "falseswipe", "leer", "aerialace"]},
		],
		encounters: [
			{"generation": 1, "level": 3, "shiny": false},
			{"generation": 2, "level": 2},
			{"generation": 3, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	fearow: {
		encounters: [
			{"generation": 1, "level": 19, "shiny": false},
			{"generation": 2, "level": 7},
			{"generation": 4, "level": 7},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ekans: {
		eventPokemon: [
			{"generation": 3, "level": 14, "gender": "F", "nature": "Docile", "ivs": {"hp": 26, "atk": 28, "def": 6, "spa": 14, "spd": 30, "spe": 11}, "abilities": ["shedskin"], "moves": ["leer", "wrap", "poisonsting", "bite"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["wrap", "leer", "poisonsting"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 6, "shiny": false},
			{"generation": 2, "level": 4},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	arbok: {
		eventPokemon: [
			{"generation": 3, "level": 33, "moves": ["refresh", "sludgebomb", "glare", "bite"]},
		],
		encounters: [
			{"generation": 2, "level": 10},
			{"generation": 4, "level": 10},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pichu: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["thundershock", "charm", "surf"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["thundershock", "charm", "wish"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["thundershock", "charm", "teeterdance"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["thundershock", "charm", "followme"], "pokeball": "pokeball"},
			{"generation": 4, "level": 1, "moves": ["volttackle", "thunderbolt", "grassknot", "return"], "pokeball": "pokeball"},
			{"generation": 4, "level": 30, "shiny": true, "gender": "M", "nature": "Jolly", "moves": ["charge", "volttackle", "endeavor", "endure"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	pichuspikyeared: {
		eventPokemon: [
			{"generation": 4, "level": 30, "gender": "F", "nature": "Naughty", "moves": ["helpinghand", "volttackle", "swagger", "painsplit"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 4,
		isNonstandard: 'Past',
		tier: "Illegal",
	},
	pikachu: {
		randomBattleMoves: ["grassknot", "irontail", "surf", "voltswitch", "volttackle"],
		eventPokemon: [
			{"generation": 3, "level": 50, "moves": ["thunderbolt", "agility", "thunder", "lightscreen"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "moves": ["thundershock", "growl", "tailwhip", "thunderwave"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "moves": ["fly", "tailwhip", "growl", "thunderwave"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "moves": ["surf", "growl", "tailwhip", "thunderwave"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "moves": ["fly", "growl", "tailwhip", "thunderwave"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "moves": ["thundershock", "growl", "thunderwave", "surf"], "pokeball": "pokeball"},
			{"generation": 3, "level": 70, "moves": ["thunderbolt", "thunder", "lightscreen", "fly"], "pokeball": "pokeball"},
			{"generation": 3, "level": 70, "moves": ["thunderbolt", "thunder", "lightscreen", "surf"], "pokeball": "pokeball"},
			{"generation": 3, "level": 70, "moves": ["thunderbolt", "thunder", "lightscreen", "agility"], "pokeball": "pokeball"},
			{"generation": 4, "level": 10, "gender": "F", "nature": "Hardy", "moves": ["surf", "volttackle", "tailwhip", "thunderwave"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["thundershock", "growl", "tailwhip", "thunderwave"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Hardy", "moves": ["surf", "thunderbolt", "lightscreen", "quickattack"], "pokeball": "cherishball"},
			{"generation": 4, "level": 20, "gender": "F", "nature": "Bashful", "moves": ["present", "quickattack", "thundershock", "tailwhip"], "pokeball": "cherishball"},
			{"generation": 4, "level": 20, "gender": "M", "nature": "Jolly", "moves": ["grassknot", "thunderbolt", "flash", "doubleteam"], "pokeball": "pokeball"},
			{"generation": 4, "level": 40, "gender": "M", "nature": "Modest", "moves": ["surf", "thunder", "protect"], "pokeball": "cherishball"},
			{"generation": 4, "level": 20, "gender": "F", "nature": "Bashful", "moves": ["quickattack", "thundershock", "tailwhip", "present"], "pokeball": "cherishball"},
			{"generation": 4, "level": 40, "gender": "M", "nature": "Mild", "moves": ["surf", "thunder", "protect"], "pokeball": "cherishball"},
			{"generation": 4, "level": 20, "gender": "F", "nature": "Bashful", "moves": ["present", "quickattack", "thunderwave", "tailwhip"], "pokeball": "cherishball"},
			{"generation": 4, "level": 30, "gender": "M", "nature": "Naughty", "moves": ["lastresort", "present", "thunderbolt", "quickattack"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Relaxed", "moves": ["rest", "sleeptalk", "yawn", "snore"], "pokeball": "cherishball"},
			{"generation": 4, "level": 20, "gender": "M", "nature": "Docile", "moves": ["present", "quickattack", "thundershock", "tailwhip"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Naughty", "moves": ["volttackle", "irontail", "quickattack", "thunderbolt"], "pokeball": "cherishball"},
			{"generation": 4, "level": 20, "gender": "M", "nature": "Bashful", "moves": ["present", "quickattack", "thundershock", "tailwhip"], "pokeball": "cherishball"},
			{"generation": 5, "level": 30, "gender": "F", "isHidden": true, "moves": ["sing", "teeterdance", "encore", "electroball"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "isHidden": false, "moves": ["fly", "irontail", "electroball", "quickattack"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "shiny": 1, "gender": "F", "isHidden": false, "moves": ["thunder", "volttackle", "grassknot", "quickattack"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "shiny": 1, "gender": "F", "isHidden": false, "moves": ["extremespeed", "thunderbolt", "grassknot", "brickbreak"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "gender": "F", "nature": "Timid", "isHidden": true, "moves": ["fly", "thunderbolt", "grassknot", "protect"], "pokeball": "cherishball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["thundershock", "tailwhip", "thunderwave", "headbutt"]},
			{"generation": 5, "level": 100, "gender": "M", "isHidden": true, "moves": ["volttackle", "quickattack", "feint", "voltswitch"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "gender": "M", "nature": "Brave", "isHidden": false, "moves": ["thunderbolt", "quickattack", "irontail", "electroball"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "growl", "playnice", "quickattack"], "pokeball": "cherishball"},
			{"generation": 6, "level": 22, "isHidden": false, "moves": ["quickattack", "electroball", "doubleteam", "megakick"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["thunderbolt", "quickattack", "surf", "holdhands"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "gender": "F", "isHidden": false, "moves": ["thunderbolt", "quickattack", "heartstamp", "holdhands"], "pokeball": "healball"},
			{"generation": 6, "level": 36, "shiny": true, "isHidden": true, "moves": ["thunder", "substitute", "playnice", "holdhands"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "gender": "F", "isHidden": false, "moves": ["playnice", "charm", "nuzzle", "sweetkiss"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "gender": "M", "nature": "Naughty", "isHidden": false, "moves": ["thunderbolt", "quickattack", "irontail", "electroball"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "shiny": true, "isHidden": false, "moves": ["teeterdance", "playnice", "tailwhip", "nuzzle"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "perfectIVs": 2, "isHidden": true, "moves": ["fakeout", "encore", "volttackle", "endeavor"], "pokeball": "cherishball"},
			{"generation": 6, "level": 99, "isHidden": false, "moves": ["happyhour", "playnice", "holdhands", "flash"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["fly", "surf", "agility", "celebrate"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["bestow", "holdhands", "return", "playnice"], "pokeball": "healball"},
			{"generation": 7, "level": 10, "nature": "Jolly", "isHidden": false, "moves": ["celebrate", "growl", "playnice", "quickattack"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "isHidden": false, "moves": ["bestow", "holdhands", "return", "playnice"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "isHidden": false, "moves": ["holdhands", "playnice", "teeterdance", "happyhour"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "isHidden": false, "moves": ["growl", "quickattack", "thundershock", "happyhour"], "pokeball": "cherishball"},
			{"generation": 7, "level": 40, "shiny": 1, "perfectIVs": 3, "isHidden": false, "moves": ["nuzzle", "discharge", "slam", "surf"], "pokeball": "pokeball"},
			{"generation": 7, "level": 5, "isHidden": false, "moves": ["celebrate", "sweetscent", "counter", "refresh"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "isHidden": false, "moves": ["fly", "surf", "thunderbolt", "quickattack"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 3, "shiny": false},
			{"generation": 2, "level": 4},
			{"generation": 3, "level": 3},
		],
		tier: "NFE",
	},
	pikachucosplay: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "thundershock"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pikachurockstar: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "meteormash"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pikachubelle: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "iciclecrash"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pikachupopstar: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "drainingkiss"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pikachuphd: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "electricterrain"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pikachulibre: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "flyingpress"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pikachuoriginal: {
		eventPokemon: [
			{"generation": 7, "level": 1, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "thunder", "agility"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	pikachuhoenn: {
		eventPokemon: [
			{"generation": 7, "level": 6, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "thunder", "irontail"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	pikachusinnoh: {
		eventPokemon: [
			{"generation": 7, "level": 10, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "irontail", "volttackle"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	pikachuunova: {
		eventPokemon: [
			{"generation": 7, "level": 14, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "irontail", "volttackle"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	pikachukalos: {
		eventPokemon: [
			{"generation": 7, "level": 17, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "irontail", "electroball"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	pikachualola: {
		eventPokemon: [
			{"generation": 7, "level": 20, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "irontail", "electroball"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	pikachupartner: {
		eventPokemon: [
			{"generation": 7, "level": 21, "shiny": 1, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "thunder", "irontail"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	pikachustarter: {
		eventPokemon: [
			{"generation": 7, "level": 5, "perfectIVs": 6, "moves": ["thundershock", "tailwhip", "growl"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "LGPE",
		tier: "Illegal",
	},
	pikachugmax: {
		eventPokemon: [
			{"generation": 8, "level": 10, "isHidden": false, "moves": ["growl", "quickattack", "thunderwave", "doubleteam"]},
		],
		eventOnly: true,
		unreleasedHidden: true,
		isGigantamax: "G-Max Volt Crash",
		tier: "Uber",
		doublesTier: "DUU",
	},
	raichu: {
		randomBattleMoves: ["encore", "focusblast", "grassknot", "nastyplot", "thunderbolt", "voltswitch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	raichualola: {
		randomBattleMoves: ["focusblast", "nastyplot", "psychic", "surf", "thunderbolt", "voltswitch"],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	sandshrew: {
		eventPokemon: [
			{"generation": 3, "level": 12, "gender": "M", "nature": "Docile", "ivs": {"hp": 4, "atk": 23, "def": 8, "spa": 31, "spd": 1, "spe": 25}, "moves": ["scratch", "defensecurl", "sandattack", "poisonsting"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 6, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sandshrewalola: {
		eventPokemon: [
			{"generation": 7, "level": 10, "isHidden": false, "moves": ["rapidspin", "iceball", "powdersnow", "bide"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sandslash: {
		encounters: [
			{"generation": 2, "level": 10},
			{"generation": 4, "level": 10},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sandslashalola: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	nidoranf: {
		encounters: [
			{"generation": 1, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	nidorina: {
		encounters: [
			{"generation": 4, "level": 15, "pokeball": "safariball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	nidoqueen: {
		eventPokemon: [
			{"generation": 6, "level": 41, "perfectIVs": 2, "isHidden": false, "abilities": ["poisonpoint"], "moves": ["tailwhip", "doublekick", "poisonsting", "bodyslam"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	nidoranm: {
		encounters: [
			{"generation": 1, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	nidorino: {
		encounters: [
			{"generation": 4, "level": 15, "pokeball": "safariball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	nidoking: {
		eventPokemon: [
			{"generation": 7, "level": 68, "isHidden": false, "abilities": ["poisonpoint"], "moves": ["earthquake", "poisonjab", "throatchop", "aquatail"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cleffa: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	clefairy: {
		encounters: [
			{"generation": 1, "level": 8},
		],
		unreleasedHidden: "Past",
		tier: "NFE",
	},
	clefable: {
		randomBattleMoves: ["calmmind", "fireblast", "moonblast", "moonlight", "stealthrock", "thunderwave"],
		unreleasedHidden: "Past",
		tier: "OU",
		doublesTier: "DUU",
	},
	vulpix: {
		eventPokemon: [
			{"generation": 3, "level": 18, "gender": "F", "nature": "Quirky", "ivs": {"hp": 15, "atk": 6, "def": 3, "spa": 25, "spd": 13, "spe": 22}, "moves": ["tailwhip", "roar", "quickattack", "willowisp"], "pokeball": "pokeball"},
			{"generation": 3, "level": 18, "moves": ["charm", "heatwave", "ember", "dig"]},
		],
		encounters: [
			{"generation": 1, "level": 18},
		],
		tier: "LC",
	},
	vulpixalola: {
		eventPokemon: [
			{"generation": 7, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "babydolleyes", "iceshard"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "gender": "F", "nature": "Modest", "isHidden": false, "moves": ["powdersnow"], "pokeball": "cherishball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	ninetales: {
		randomBattleMoves: ["fireblast", "nastyplot", "solarbeam", "substitute", "willowisp"],
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "M", "nature": "Bold", "ivs": {"def": 31}, "isHidden": true, "moves": ["heatwave", "solarbeam", "psyshock", "willowisp"], "pokeball": "cherishball"},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	ninetalesalola: {
		randomBattleMoves: ["auroraveil", "blizzard", "freezedry", "moonblast", "nastyplot", "substitute"],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	igglybuff: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["cutecharm"], "moves": ["sing", "charm", "defensecurl", "tickle"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	jigglypuff: {
		encounters: [
			{"generation": 1, "level": 3, "shiny": false},
			{"generation": 2, "level": 3},
			{"generation": 3, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wigglytuff: {
		encounters: [
			{"generation": 1, "level": 22},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zubat: {
		encounters: [
			{"generation": 1, "level": 6, "shiny": false},
			{"generation": 2, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	golbat: {
		encounters: [
			{"generation": 2, "level": 13},
			{"generation": 3, "level": 5},
			{"generation": 4, "level": 10},
			{"generation": 6, "level": 19, "maxEggMoves": 1},
			{"generation": 7, "level": 20},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	crobat: {
		eventPokemon: [
			{"generation": 4, "level": 30, "gender": "M", "nature": "Timid", "moves": ["heatwave", "airslash", "sludgebomb", "superfang"], "pokeball": "cherishball"},
			{"generation": 7, "level": 64, "gender": "M", "isHidden": false, "moves": ["airslash", "toxic", "darkpulse", "sludgebomb"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oddish: {
		eventPokemon: [
			{"generation": 3, "level": 26, "gender": "M", "nature": "Quirky", "ivs": {"hp": 23, "atk": 24, "def": 20, "spa": 21, "spd": 9, "spe": 16}, "moves": ["poisonpowder", "stunspore", "sleeppowder", "acid"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["absorb", "leechseed"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 12, "shiny": false},
		],
		tier: "LC",
	},
	gloom: {
		eventPokemon: [
			{"generation": 3, "level": 50, "moves": ["sleeppowder", "acid", "moonlight", "petaldance"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 2, "level": 14},
			{"generation": 4, "level": 14},
			{"generation": 6, "level": 18, "maxEggMoves": 1},
		],
		tier: "NFE",
	},
	vileplume: {
		randomBattleMoves: ["aromatherapy", "gigadrain", "sleeppowder", "sludgebomb", "strengthsap"],
		tier: "RU",
		doublesTier: "DUU",
	},
	bellossom: {
		randomBattleMoves: ["gigadrain", "moonblast", "quiverdance", "sleeppowder", "strengthsap"],
		tier: "NU",
		doublesTier: "DUU",
	},
	paras: {
		eventPokemon: [
			{"generation": 3, "level": 28, "abilities": ["effectspore"], "moves": ["refresh", "spore", "slash", "falseswipe"]},
		],
		encounters: [
			{"generation": 1, "level": 8, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	parasect: {
		encounters: [
			{"generation": 1, "level": 13},
			{"generation": 2, "level": 5},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	venonat: {
		encounters: [
			{"generation": 1, "level": 13, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	venomoth: {
		eventPokemon: [
			{"generation": 3, "level": 32, "abilities": ["shielddust"], "moves": ["refresh", "silverwind", "substitute", "psychic"]},
		],
		encounters: [
			{"generation": 1, "level": 30, "shiny": false},
			{"generation": 2, "level": 10},
			{"generation": 4, "level": 8},
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	diglett: {
		encounters: [
			{"generation": 1, "level": 15, "shiny": false},
			{"generation": 2, "level": 2},
		],
		tier: "LC",
	},
	diglettalola: {
		eventPokemon: [
			{"generation": 7, "level": 10, "isHidden": false, "abilities": ["tanglinghair"], "moves": ["mudslap", "astonish", "growl", "metalclaw"], "pokeball": "cherishball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	dugtrio: {
		randomBattleMoves: ["earthquake", "memento", "reversal", "stealthrock", "stoneedge", "substitute"],
		eventPokemon: [
			{"generation": 3, "level": 40, "moves": ["charm", "earthquake", "sandstorm", "triattack"]},
		],
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 2, "level": 5},
			{"generation": 4, "level": 19},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	dugtrioalola: {
		randomBattleMoves: ["earthquake", "ironhead", "memento", "stoneedge", "suckerpunch"],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	meowth: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["scratch", "growl", "petaldance"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "moves": ["scratch", "growl"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["scratch", "growl", "bite"], "pokeball": "pokeball"},
			{"generation": 3, "level": 22, "moves": ["sing", "slash", "payday", "bite"]},
			{"generation": 4, "level": 21, "gender": "F", "nature": "Jolly", "abilities": ["pickup"], "moves": ["bite", "fakeout", "furyswipes", "screech"], "pokeball": "cherishball"},
			{"generation": 4, "level": 10, "gender": "M", "nature": "Jolly", "abilities": ["pickup"], "moves": ["fakeout", "payday", "assist", "scratch"], "pokeball": "cherishball"},
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "abilities": ["pickup"], "moves": ["furyswipes", "sing", "nastyplot", "snatch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 20, "isHidden": false, "abilities": ["pickup"], "moves": ["happyhour", "screech", "bite", "fakeout"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 10},
			{"generation": 3, "level": 3, "shiny": false, "gender": "M", "nature": "Naive", "ivs": {"hp": 4, "atk": 5, "def": 4, "spa": 5, "spd": 4, "spe": 4}, "abilities": ["pickup"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	meowthalola: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	meowthgalar: {
		tier: "LC",
	},
	meowthgmax: {
		eventPokemon: [
			{"generation": 8, "level": 5, "isHidden": false, "moves": ["fakeout", "growl", "slash", "payday"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		unreleasedHidden: true,
		isGigantamax: "G-Max Gold Rush",
		tier: "Uber",
		doublesTier: "DUU",
	},
	persian: {
		randomBattleMoves: ["hypervoice", "icywind", "nastyplot", "taunt", "thunderbolt"],
		encounters: [
			{"generation": 2, "level": 18},
			{"generation": 4, "level": 19},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	persianalola: {
		randomBattleMoves: ["darkpulse", "hypnosis", "nastyplot", "powergem", "thunderbolt"],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	perrserker: {
		randomBattleMoves: ["closecombat", "crunch", "fakeout", "ironhead", "swordsdance", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	psyduck: {
		eventPokemon: [
			{"generation": 3, "level": 27, "gender": "M", "nature": "Lax", "ivs": {"hp": 31, "atk": 16, "def": 12, "spa": 29, "spd": 31, "spe": 14}, "abilities": ["damp"], "moves": ["tailwhip", "confusion", "disable", "screech"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["watersport", "scratch", "tailwhip", "mudsport"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 15},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	golduck: {
		eventPokemon: [
			{"generation": 3, "level": 33, "moves": ["charm", "waterfall", "psychup", "brickbreak"]},
			{"generation": 7, "level": 50, "gender": "M", "nature": "Timid", "ivs": {"hp": 31, "atk": 30, "def": 31, "spa": 31, "spd": 31, "spe": 31}, "isHidden": true, "moves": ["hydropump", "scald", "encore", "protect"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 15, "shiny": false},
			{"generation": 2, "level": 10},
			{"generation": 3, "level": 25, "pokeball": "safariball"},
			{"generation": 4, "level": 10},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mankey: {
		encounters: [
			{"generation": 1, "level": 3, "shiny": false},
			{"generation": 3, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	primeape: {
		eventPokemon: [
			{"generation": 3, "level": 34, "abilities": ["vitalspirit"], "moves": ["helpinghand", "crosschop", "focusenergy", "reversal"]},
		],
		encounters: [
			{"generation": 2, "level": 15},
			{"generation": 4, "level": 15},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	growlithe: {
		eventPokemon: [
			{"generation": 3, "level": 32, "gender": "F", "nature": "Quiet", "ivs": {"hp": 11, "atk": 24, "def": 28, "spa": 1, "spd": 20, "spe": 2}, "abilities": ["intimidate"], "moves": ["leer", "odorsleuth", "takedown", "flamewheel"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["bite", "roar", "ember"], "pokeball": "pokeball"},
			{"generation": 3, "level": 28, "moves": ["charm", "flamethrower", "bite", "takedown"]},
		],
		encounters: [
			{"generation": 1, "level": 15, "shiny": false},
		],
		tier: "LC",
	},
	arcanine: {
		randomBattleMoves: ["closecombat", "crunch", "extremespeed", "flareblitz", "morningsun", "roar", "wildcharge", "willowisp"],
		eventPokemon: [
			{"generation": 4, "level": 50, "abilities": ["intimidate"], "moves": ["flareblitz", "thunderfang", "crunch", "extremespeed"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "isHidden": false, "abilities": ["intimidate"], "moves": ["flareblitz", "extremespeed", "willowisp", "protect"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	poliwag: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["bubble", "sweetkiss"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 5},
			{"generation": 2, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	poliwhirl: {
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 2, "level": 10},
			{"generation": 3, "level": 20},
			{"generation": 4, "level": 10},
			{"generation": 7, "level": 24},
			{"generation": 7, "level": 22, "isHidden": false, "gender": "F", "nature": "Naughty", "abilities": ["damp"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	poliwrath: {
		eventPokemon: [
			{"generation": 3, "level": 42, "moves": ["helpinghand", "hydropump", "raindance", "brickbreak"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	politoed: {
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "M", "nature": "Calm", "ivs": {"hp": 31, "atk": 13, "def": 31, "spa": 5, "spd": 31, "spe": 5}, "isHidden": true, "moves": ["scald", "icebeam", "perishsong", "protect"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	abra: {
		encounters: [
			{"generation": 1, "level": 6},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kadabra: {
		encounters: [
			{"generation": 2, "level": 15},
			{"generation": 4, "level": 15},
			{"generation": 7, "level": 11, "isHidden": false, "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	alakazam: {
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["futuresight", "calmmind", "psychic", "trick"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	alakazammega: {
		requiredItem: "Alakazite",
		isNonstandard: "Past",
	},
	machop: {
		encounters: [
			{"generation": 1, "level": 15, "shiny": false},
		],
		tier: "LC",
	},
	machoke: {
		eventPokemon: [
			{"generation": 5, "level": 30, "isHidden": false, "moves": ["lowsweep", "foresight", "seismictoss", "revenge"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 2, "level": 14},
			{"generation": 4, "level": 14},
		],
		tier: "NFE",
	},
	machamp: {
		randomBattleMoves: ["bulletpunch", "closecombat", "dynamicpunch", "facade", "knockoff", "stoneedge"],
		eventPokemon: [
			{"generation": 3, "level": 38, "gender": "M", "nature": "Quiet", "ivs": {"hp": 9, "atk": 23, "def": 25, "spa": 20, "spd": 15, "spe": 10}, "abilities": ["guts"], "moves": ["seismictoss", "foresight", "revenge", "vitalthrow"], "pokeball": "pokeball"},
			{"generation": 6, "level": 50, "shiny": true, "gender": "M", "nature": "Adamant", "ivs": {"hp": 31, "atk": 31, "def": 31, "spa": 31, "spd": 31, "spe": 31}, "isHidden": false, "abilities": ["noguard"], "moves": ["dynamicpunch", "stoneedge", "wideguard", "knockoff"], "pokeball": "cherishball"},
			{"generation": 6, "level": 39, "gender": "M", "nature": "Hardy", "isHidden": false, "abilities": ["noguard"], "moves": ["seismictoss", "dynamicpunch", "dig", "focusenergy"], "pokeball": "cherishball"},
			{"generation": 7, "level": 34, "gender": "F", "nature": "Brave", "ivs": {"atk": 31}, "isHidden": false, "abilities": ["guts"], "moves": ["strength", "bulkup", "quickguard", "doubleedge"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 16},
			{"generation": 2, "level": 5},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	machampgmax: {
		isGigantamax: "G-Max Chi Strike",
		tier: "Uber",
		doublesTier: "DUU",
	},
	bellsprout: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["vinewhip", "teeterdance"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["vinewhip", "growth"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 12, "shiny": false},
			{"generation": 2, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	weepinbell: {
		eventPokemon: [
			{"generation": 3, "level": 32, "moves": ["morningsun", "magicalleaf", "sludgebomb", "sweetscent"]},
		],
		encounters: [
			{"generation": 2, "level": 12},
			{"generation": 4, "level": 10},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	victreebel: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tentacool: {
		encounters: [
			{"generation": 1, "level": 5},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tentacruel: {
		encounters: [
			{"generation": 1, "level": 20},
			{"generation": 2, "level": 20},
			{"generation": 3, "level": 20},
			{"generation": 4, "level": 15},
			{"generation": 6, "level": 21, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	geodude: {
		encounters: [
			{"generation": 1, "level": 7, "shiny": false},
			{"generation": 2, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	geodudealola: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	graveler: {
		encounters: [
			{"generation": 2, "level": 23},
			{"generation": 4, "level": 16, "pokeball": "safariball"},
			{"generation": 6, "level": 24, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	graveleralola: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	golem: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	golemalola: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ponyta: {
		encounters: [
			{"generation": 1, "level": 28, "shiny": false},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	ponytagalar: {
		tier: "LC",
	},
	rapidash: {
		randomBattleMoves: ["flareblitz", "highhorsepower", "morningsun", "swordsdance", "wildcharge", "willowisp"],
		eventPokemon: [
			{"generation": 3, "level": 40, "moves": ["batonpass", "solarbeam", "sunnyday", "flamethrower"]},
		],
		encounters: [
			{"generation": 2, "level": 14, "gender": "M", "shiny": false},
			{"generation": 3, "level": 37},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	rapidashgalar: {
		randomBattleMoves: ["highhorsepower", "morningsun", "playrough", "swordsdance", "zenheadbutt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	slowpoke: {
		eventPokemon: [
			{"generation": 3, "level": 31, "gender": "F", "nature": "Naive", "ivs": {"hp": 17, "atk": 11, "def": 19, "spa": 20, "spd": 5, "spe": 10}, "abilities": ["oblivious"], "moves": ["watergun", "confusion", "disable", "headbutt"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["curse", "yawn", "tackle", "growl"], "pokeball": "pokeball"},
			{"generation": 5, "level": 30, "isHidden": false, "moves": ["confusion", "disable", "headbutt", "waterpulse"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 15},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	slowpokegalar: {
		unreleasedHidden: true,
		tier: "UU",
		doublesTier: "DUU",
	},
	slowbro: {
		eventPokemon: [
			{"generation": 6, "level": 100, "nature": "Quiet", "isHidden": false, "abilities": ["oblivious"], "moves": ["scald", "trickroom", "slackoff", "irontail"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 15, "shiny": false},
			{"generation": 1, "level": 23},
			{"generation": 2, "level": 20},
			{"generation": 3, "level": 32},
			{"generation": 4, "level": 15},
			{"generation": 5, "level": 35, "isHidden": false},
			{"generation": 7, "level": 15},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	slowbromega: {
		requiredItem: "Slowbronite",
		isNonstandard: "Past",
	},
	slowking: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magnemite: {
		encounters: [
			{"generation": 1, "level": 16, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magneton: {
		eventPokemon: [
			{"generation": 3, "level": 30, "moves": ["refresh", "doubleedge", "raindance", "thunder"]},
		],
		encounters: [
			{"generation": 2, "level": 5, "shiny": false},
			{"generation": 3, "level": 26},
			{"generation": 4, "level": 17, "pokeball": "safariball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magnezone: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	farfetchd: {
		randomBattleMoves: ["bravebird", "closecombat", "knockoff", "leafblade", "roost", "slash", "swordsdance"],
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["yawn", "wish"], "pokeball": "pokeball"},
			{"generation": 3, "level": 36, "moves": ["batonpass", "slash", "swordsdance", "aerialace"]},
		],
		encounters: [
			{"generation": 1, "level": 3},
			{"generation": 3, "level": 3, "gender": "M", "nature": "Adamant", "ivs": {"hp": 20, "atk": 25, "def": 21, "spa": 24, "spd": 15, "spe": 20}, "abilities": ["keeneye"], "pokeball": "pokeball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	farfetchdgalar: {
		tier: "LC",
	},
	sirfetchd: {
		randomBattleMoves: ["bravebird", "closecombat", "firstimpression", "knockoff", "swordsdance"],
		tier: "UU",
		doublesTier: "DUU",
	},
	doduo: {
		encounters: [
			{"generation": 1, "level": 18, "shiny": false},
			{"generation": 2, "level": 4},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dodrio: {
		eventPokemon: [
			{"generation": 3, "level": 34, "moves": ["batonpass", "drillpeck", "agility", "triattack"]},
		],
		encounters: [
			{"generation": 1, "level": 29, "shiny": false},
			{"generation": 2, "level": 10, "gender": "F", "shiny": false},
			{"generation": 2, "level": 30},
			{"generation": 3, "level": 29, "pokeball": "safariball"},
			{"generation": 4, "level": 15, "gender": "F", "shiny": false, "nature": "Impish", "ivs": {"hp": 20, "atk": 20, "def": 20, "spa": 15, "spd": 15, "spe": 15}, "abilities": ["runaway"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	seel: {
		eventPokemon: [
			{"generation": 3, "level": 23, "abilities": ["thickfat"], "moves": ["helpinghand", "surf", "safeguard", "icebeam"]},
		],
		encounters: [
			{"generation": 1, "level": 22, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dewgong: {
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 2, "level": 5},
			{"generation": 3, "level": 32},
			{"generation": 5, "level": 30, "isHidden": false},
			{"generation": 6, "level": 30, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	grimer: {
		eventPokemon: [
			{"generation": 3, "level": 23, "moves": ["helpinghand", "sludgebomb", "shadowpunch", "minimize"]},
		],
		encounters: [
			{"generation": 1, "level": 23, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	grimeralola: {
		eventPokemon: [
			{"generation": 7, "level": 10, "isHidden": false, "abilities": ["poisontouch"], "moves": ["bite", "harden", "poisongas", "pound"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	muk: {
		encounters: [
			{"generation": 1, "level": 25},
			{"generation": 2, "level": 5},
			{"generation": 3, "level": 32},
			{"generation": 4, "level": 15},
			{"generation": 5, "level": 5, "isHidden": false},
			{"generation": 5, "level": 35, "isHidden": true},
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mukalola: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	shellder: {
		eventPokemon: [
			{"generation": 3, "level": 24, "gender": "F", "nature": "Brave", "ivs": {"hp": 5, "atk": 19, "def": 18, "spa": 5, "spd": 11, "spe": 13}, "abilities": ["shellarmor"], "moves": ["withdraw", "iciclespear", "supersonic", "aurorabeam"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["shellarmor"], "moves": ["tackle", "withdraw", "iciclespear"], "pokeball": "pokeball"},
			{"generation": 3, "level": 29, "abilities": ["shellarmor"], "moves": ["refresh", "takedown", "surf", "aurorabeam"]},
		],
		encounters: [
			{"generation": 1, "level": 10},
		],
		tier: "LC",
	},
	cloyster: {
		randomBattleMoves: ["explosion", "hydropump", "iciclespear", "rockblast", "shellsmash"],
		eventPokemon: [
			{"generation": 5, "level": 30, "gender": "M", "nature": "Naughty", "isHidden": false, "abilities": ["skilllink"], "moves": ["iciclespear", "rockblast", "hiddenpower", "razorshell"], "pokeball": "pokeball"},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	gastly: {
		encounters: [
			{"generation": 1, "level": 18, "shiny": false},
		],
		tier: "LC Uber",
	},
	haunter: {
		eventPokemon: [
			{"generation": 5, "level": 30, "moves": ["confuseray", "suckerpunch", "shadowpunch", "payback"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 20, "shiny": false},
			{"generation": 2, "level": 15},
			{"generation": 3, "level": 20},
			{"generation": 4, "level": 16},
		],
		tier: "NFE",
	},
	gengar: {
		eventPokemon: [
			{"generation": 3, "level": 23, "gender": "F", "nature": "Hardy", "ivs": {"hp": 19, "atk": 14, "def": 0, "spa": 14, "spd": 17, "spe": 27}, "moves": ["spite", "curse", "nightshade", "confuseray"], "pokeball": "pokeball"},
			{"generation": 6, "level": 25, "nature": "Timid", "moves": ["psychic", "confuseray", "suckerpunch", "shadowpunch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 25, "moves": ["nightshade", "confuseray", "suckerpunch", "shadowpunch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "moves": ["shadowball", "sludgebomb", "willowisp", "destinybond"], "pokeball": "cherishball"},
			{"generation": 6, "level": 25, "shiny": true, "moves": ["shadowball", "sludgewave", "confuseray", "astonish"], "pokeball": "duskball"},
			{"generation": 6, "level": 50, "shiny": true, "gender": "M", "moves": ["meanlook", "hypnosis", "psychic", "hyperbeam"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["meanlook", "hypnosis", "psychic", "hyperbeam"], "pokeball": "cherishball"},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	gengarmega: {
		requiredItem: "Gengarite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gengargmax: {
		randomBattleMoves: ["focusblast", "nastyplot", "shadowball", "sludgewave", "trick"],
		isGigantamax: "G-Max Terror",
		tier: "Uber",
		doublesTier: "DUU",
	},
	onix: {
		encounters: [
			{"generation": 1, "level": 13, "shiny": false},
		],
		tier: "LC",
	},
	steelix: {
		randomBattleMoves: ["dragondance", "earthquake", "headsmash", "heavyslam", "stealthrock"],
		tier: "RU",
		doublesTier: "DUU",
	},
	steelixmega: {
		requiredItem: "Steelixite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	drowzee: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["insomnia"], "moves": ["bellydrum", "wish"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 9, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hypno: {
		eventPokemon: [
			{"generation": 3, "level": 34, "abilities": ["insomnia"], "moves": ["batonpass", "psychic", "meditate", "shadowball"]},
		],
		encounters: [
			{"generation": 2, "level": 16},
			{"generation": 4, "level": 16},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	krabby: {
		encounters: [
			{"generation": 1, "level": 10},
		],
		tier: "LC",
	},
	kingler: {
		randomBattleMoves: ["agility", "liquidation", "rockslide", "superpower", "swordsdance", "xscissor"],
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 3, "level": 25},
			{"generation": 4, "level": 22},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	kinglergmax: {
		isGigantamax: "G-Max Foam Burst",
		tier: "Uber",
		doublesTier: "DUU",
	},
	voltorb: {
		eventPokemon: [
			{"generation": 3, "level": 19, "moves": ["refresh", "mirrorcoat", "spark", "swift"]},
		],
		encounters: [
			{"generation": 1, "level": 14, "shiny": false},
			{"generation": 1, "level": 40},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	electrode: {
		encounters: [
			{"generation": 1, "level": 3},
			{"generation": 2, "level": 23},
			{"generation": 3, "level": 3, "shiny": false, "nature": "Hasty", "ivs": {"hp": 19, "atk": 16, "def": 18, "spa": 25, "spd": 25, "spe": 19}, "abilities": ["static"], "pokeball": "pokeball"},
			{"generation": 4, "level": 23},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	exeggcute: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["sweetscent", "wish"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 20, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	exeggutor: {
		eventPokemon: [
			{"generation": 3, "level": 46, "moves": ["refresh", "psychic", "hypnosis", "ancientpower"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	exeggutoralola: {
		eventPokemon: [
			{"generation": 7, "level": 50, "gender": "M", "nature": "Modest", "isHidden": true, "moves": ["powerswap", "celebrate", "leafstorm", "dracometeor"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cubone: {
		encounters: [
			{"generation": 1, "level": 16, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	marowak: {
		eventPokemon: [
			{"generation": 3, "level": 44, "moves": ["sing", "earthquake", "swordsdance", "rockslide"]},
		],
		encounters: [
			{"generation": 1, "level": 24, "shiny": false},
			{"generation": 2, "level": 12},
			{"generation": 4, "level": 14},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	marowakalola: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	marowakalolatotem: {
		eventPokemon: [
			{"generation": 7, "level": 25, "perfectIVs": 3, "moves": ["leer", "hex", "bonemerang", "willowisp"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
	},
	tyrogue: {
		tier: "LC",
	},
	hitmonlee: {
		randomBattleMoves: ["fakeout", "highjumpkick", "machpunch", "poisonjab", "rapidspin", "stoneedge", "throatchop"],
		eventPokemon: [
			{"generation": 3, "level": 38, "abilities": ["limber"], "moves": ["refresh", "highjumpkick", "mindreader", "megakick"]},
		],
		encounters: [
			{"generation": 1, "level": 30},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	hitmonchan: {
		randomBattleMoves: ["bulkup", "drainpunch", "firepunch", "icepunch", "machpunch", "rapidspin"],
		eventPokemon: [
			{"generation": 3, "level": 38, "abilities": ["keeneye"], "moves": ["helpinghand", "skyuppercut", "mindreader", "megapunch"]},
		],
		encounters: [
			{"generation": 1, "level": 30},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	hitmontop: {
		randomBattleMoves: ["closecombat", "machpunch", "rapidspin", "stoneedge", "suckerpunch"],
		eventPokemon: [
			{"generation": 5, "level": 55, "gender": "M", "nature": "Adamant", "isHidden": false, "abilities": ["intimidate"], "moves": ["fakeout", "closecombat", "suckerpunch", "helpinghand"]},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	lickitung: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["healbell", "wish"], "pokeball": "pokeball"},
			{"generation": 3, "level": 38, "moves": ["helpinghand", "doubleedge", "defensecurl", "rollout"]},
		],
		encounters: [
			{"generation": 1, "level": 15},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lickilicky: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	koffing: {
		encounters: [
			{"generation": 1, "level": 30, "shiny": false},
		],
		tier: "LC",
	},
	weezing: {
		randomBattleMoves: ["fireblast", "painsplit", "sludgebomb", "toxicspikes", "willowisp"],
		encounters: [
			{"generation": 2, "level": 16},
			{"generation": 3, "level": 32},
			{"generation": 4, "level": 15, "pokeball": "safariball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	weezinggalar: {
		randomBattleMoves: ["defog", "fireblast", "painsplit", "sludgebomb", "strangesteam", "toxicspikes", "willowisp"],
		tier: "UU",
		doublesTier: "DUU",
	},
	rhyhorn: {
		encounters: [
			{"generation": 1, "level": 20},
		],
		tier: "LC",
	},
	rhydon: {
		eventPokemon: [
			{"generation": 3, "level": 46, "moves": ["helpinghand", "megahorn", "scaryface", "earthquake"]},
		],
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 2, "level": 10},
			{"generation": 4, "level": 41},
			{"generation": 6, "level": 30},
		],
		tier: "NFE",
	},
	rhyperior: {
		randomBattleMoves: ["earthquake", "firepunch", "megahorn", "rockblast", "rockpolish", "stealthrock", "stoneedge"],
		tier: "UU",
		doublesTier: "DOU",
	},
	happiny: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	chansey: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["sweetscent", "wish"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "moves": ["pound", "growl", "tailwhip", "refresh"], "pokeball": "pokeball"},
			{"generation": 3, "level": 39, "moves": ["sweetkiss", "thunderbolt", "softboiled", "skillswap"]},
		],
		encounters: [
			{"generation": 1, "level": 7, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	blissey: {
		eventPokemon: [
			{"generation": 5, "level": 10, "isHidden": true, "moves": ["pound", "growl", "tailwhip", "refresh"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tangela: {
		eventPokemon: [
			{"generation": 3, "level": 30, "abilities": ["chlorophyll"], "moves": ["morningsun", "solarbeam", "sunnyday", "ingrain"]},
		],
		encounters: [
			{"generation": 1, "level": 13},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tangrowth: {
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "M", "nature": "Brave", "moves": ["sunnyday", "morningsun", "ancientpower", "naturalgift"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kangaskhan: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["earlybird"], "moves": ["yawn", "wish"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "abilities": ["earlybird"], "moves": ["cometpunch", "leer", "bite"], "pokeball": "pokeball"},
			{"generation": 3, "level": 35, "abilities": ["earlybird"], "moves": ["sing", "earthquake", "tailwhip", "dizzypunch"]},
			{"generation": 6, "level": 50, "isHidden": false, "abilities": ["scrappy"], "moves": ["fakeout", "return", "earthquake", "suckerpunch"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 25, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kangaskhanmega: {
		requiredItem: "Kangaskhanite",
		isNonstandard: "Past",
	},
	horsea: {
		eventPokemon: [
			{"generation": 5, "level": 1, "shiny": true, "isHidden": false, "moves": ["bubble"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 5},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	seadra: {
		eventPokemon: [
			{"generation": 3, "level": 45, "abilities": ["poisonpoint"], "moves": ["leer", "watergun", "twister", "agility"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 20},
			{"generation": 2, "level": 20},
			{"generation": 3, "level": 25},
			{"generation": 4, "level": 15},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kingdra: {
		eventPokemon: [
			{"generation": 3, "level": 50, "abilities": ["swiftswim"], "moves": ["leer", "watergun", "twister", "agility"], "pokeball": "pokeball"},
			{"generation": 5, "level": 50, "gender": "M", "nature": "Timid", "ivs": {"hp": 31, "atk": 17, "def": 8, "spa": 31, "spd": 11, "spe": 31}, "isHidden": false, "abilities": ["swiftswim"], "moves": ["dracometeor", "muddywater", "dragonpulse", "protect"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	goldeen: {
		encounters: [
			{"generation": 1, "level": 5},
		],
		unreleasedHidden: "Past",
		tier: "LC",
	},
	seaking: {
		randomBattleMoves: ["drillrun", "megahorn", "swordsdance", "throatchop", "waterfall"],
		encounters: [
			{"generation": 1, "level": 23},
			{"generation": 2, "level": 10},
			{"generation": 3, "level": 20},
			{"generation": 4, "level": 10},
			{"generation": 6, "level": 26, "maxEggMoves": 1},
			{"generation": 7, "level": 10},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	staryu: {
		eventPokemon: [
			{"generation": 3, "level": 50, "moves": ["minimize", "lightscreen", "cosmicpower", "hydropump"], "pokeball": "pokeball"},
			{"generation": 3, "level": 18, "nature": "Timid", "ivs": {"hp": 10, "atk": 3, "def": 22, "spa": 24, "spd": 3, "spe": 18}, "abilities": ["illuminate"], "moves": ["harden", "watergun", "rapidspin", "recover"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 1, "level": 5},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	starmie: {
		eventPokemon: [
			{"generation": 3, "level": 41, "moves": ["refresh", "waterfall", "icebeam", "recover"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mimejr: {
		tier: "LC",
	},
	mrmime: {
		randomBattleMoves: ["dazzlinggleam", "focusblast", "healingwish", "nastyplot", "psychic", "shadowball"],
		eventPokemon: [
			{"generation": 3, "level": 42, "abilities": ["soundproof"], "moves": ["followme", "psychic", "encore", "thunderpunch"]},
		],
		encounters: [
			{"generation": 1, "level": 6},
		],
		tier: "NU",
	},
	mrmimegalar: {
		randomBattleMoves: ["focusblast", "freezedry", "nastyplot", "psychic", "rapidspin"],
		tier: "NFE",
	},
	mrrime: {
		randomBattleMoves: ["focusblast", "freezedry", "psychic", "rapidspin", "slackoff", "trick"],
		tier: "RU",
		doublesTier: "DUU",
	},
	scyther: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["swarm"], "moves": ["quickattack", "leer", "focusenergy"], "pokeball": "pokeball"},
			{"generation": 3, "level": 40, "abilities": ["swarm"], "moves": ["morningsun", "razorwind", "silverwind", "slash"]},
			{"generation": 5, "level": 30, "isHidden": false, "moves": ["agility", "wingattack", "furycutter", "slash"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 15, "shiny": false},
			{"generation": 1, "level": 25},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	scizor: {
		eventPokemon: [
			{"generation": 3, "level": 50, "gender": "M", "abilities": ["swarm"], "moves": ["furycutter", "metalclaw", "swordsdance", "slash"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Adamant", "abilities": ["swarm"], "moves": ["xscissor", "swordsdance", "irondefense", "agility"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "gender": "M", "isHidden": false, "abilities": ["technician"], "moves": ["bulletpunch", "bugbite", "roost", "swordsdance"], "pokeball": "cherishball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["leer", "focusenergy", "pursuit", "steelwing"]},
			{"generation": 6, "level": 50, "gender": "M", "isHidden": false, "moves": ["xscissor", "nightslash", "doublehit", "ironhead"], "pokeball": "cherishball"},
			{"generation": 6, "level": 25, "nature": "Adamant", "isHidden": false, "abilities": ["technician"], "moves": ["aerialace", "falseswipe", "agility", "furycutter"], "pokeball": "cherishball"},
			{"generation": 6, "level": 25, "isHidden": false, "moves": ["metalclaw", "falseswipe", "agility", "furycutter"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "isHidden": false, "abilities": ["technician"], "moves": ["bulletpunch", "swordsdance", "roost", "uturn"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	scizormega: {
		requiredItem: "Scizorite",
		isNonstandard: "Past",
	},
	smoochum: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	jynx: {
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 2, "level": 10},
			{"generation": 3, "level": 20, "nature": "Mild", "ivs": {"hp": 18, "atk": 17, "def": 18, "spa": 22, "spd": 25, "spe": 21}, "abilities": ["oblivious"], "pokeball": "pokeball"},
			{"generation": 4, "level": 22},
			{"generation": 7, "level": 9},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	elekid: {
		eventPokemon: [
			{"generation": 3, "level": 20, "moves": ["icepunch", "firepunch", "thunderpunch", "crosschop"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	electabuzz: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["quickattack", "leer", "thunderpunch"], "pokeball": "pokeball"},
			{"generation": 3, "level": 43, "moves": ["followme", "crosschop", "thunderwave", "thunderbolt"]},
			{"generation": 4, "level": 30, "gender": "M", "nature": "Naughty", "moves": ["lowkick", "shockwave", "lightscreen", "thunderpunch"], "pokeball": "pokeball"},
			{"generation": 5, "level": 30, "isHidden": false, "moves": ["lowkick", "swift", "shockwave", "lightscreen"], "pokeball": "cherishball"},
			{"generation": 6, "level": 30, "gender": "M", "isHidden": true, "moves": ["lowkick", "shockwave", "lightscreen", "thunderpunch"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 33, "shiny": false},
			{"generation": 2, "level": 15},
			{"generation": 4, "level": 15},
			{"generation": 7, "level": 25},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	electivire: {
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "M", "nature": "Adamant", "moves": ["thunderpunch", "icepunch", "crosschop", "earthquake"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Serious", "moves": ["lightscreen", "thunderpunch", "discharge", "thunderbolt"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magby: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magmar: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["leer", "smog", "firepunch", "ember"], "pokeball": "pokeball"},
			{"generation": 3, "level": 36, "moves": ["followme", "fireblast", "crosschop", "thunderpunch"]},
			{"generation": 4, "level": 30, "gender": "M", "nature": "Quiet", "moves": ["smokescreen", "firespin", "confuseray", "firepunch"], "pokeball": "pokeball"},
			{"generation": 5, "level": 30, "isHidden": false, "moves": ["smokescreen", "feintattack", "firespin", "confuseray"], "pokeball": "cherishball"},
			{"generation": 6, "level": 30, "gender": "M", "isHidden": true, "moves": ["smokescreen", "firespin", "confuseray", "firepunch"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 34, "shiny": false},
			{"generation": 2, "level": 14},
			{"generation": 4, "level": 14},
			{"generation": 7, "level": 16},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magmortar: {
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "F", "nature": "Modest", "moves": ["flamethrower", "psychic", "hyperbeam", "solarbeam"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Hardy", "moves": ["confuseray", "firepunch", "lavaplume", "flamethrower"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pinsir: {
		eventPokemon: [
			{"generation": 3, "level": 35, "abilities": ["hypercutter"], "moves": ["helpinghand", "guillotine", "falseswipe", "submission"]},
			{"generation": 6, "level": 50, "gender": "F", "nature": "Adamant", "isHidden": false, "moves": ["xscissor", "earthquake", "stoneedge", "return"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "nature": "Jolly", "isHidden": true, "moves": ["earthquake", "swordsdance", "feint", "quickattack"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 15, "shiny": false},
			{"generation": 1, "level": 20},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pinsirmega: {
		requiredItem: "Pinsirite",
		isNonstandard: "Past",
	},
	tauros: {
		eventPokemon: [
			{"generation": 3, "level": 25, "nature": "Docile", "ivs": {"hp": 14, "atk": 19, "def": 12, "spa": 17, "spd": 5, "spe": 26}, "abilities": ["intimidate"], "moves": ["rage", "hornattack", "scaryface", "pursuit"], "pokeball": "safariball"},
			{"generation": 3, "level": 10, "abilities": ["intimidate"], "moves": ["tackle", "tailwhip", "rage", "hornattack"], "pokeball": "pokeball"},
			{"generation": 3, "level": 46, "abilities": ["intimidate"], "moves": ["refresh", "earthquake", "tailwhip", "bodyslam"]},
		],
		encounters: [
			{"generation": 1, "level": 21, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magikarp: {
		eventPokemon: [
			{"generation": 4, "level": 5, "gender": "M", "nature": "Relaxed", "moves": ["splash"], "pokeball": "pokeball"},
			{"generation": 4, "level": 6, "gender": "F", "nature": "Rash", "moves": ["splash"], "pokeball": "pokeball"},
			{"generation": 4, "level": 7, "gender": "F", "nature": "Hardy", "moves": ["splash"], "pokeball": "pokeball"},
			{"generation": 4, "level": 5, "gender": "F", "nature": "Lonely", "moves": ["splash"], "pokeball": "pokeball"},
			{"generation": 4, "level": 4, "gender": "M", "nature": "Modest", "moves": ["splash"], "pokeball": "pokeball"},
			{"generation": 5, "level": 99, "shiny": true, "gender": "M", "isHidden": false, "moves": ["flail", "hydropump", "bounce", "splash"], "pokeball": "cherishball"},
			{"generation": 6, "level": 1, "shiny": 1, "isHidden": false, "moves": ["splash", "celebrate", "happyhour"], "pokeball": "cherishball"},
			{"generation": 7, "level": 19, "shiny": true, "isHidden": false, "moves": ["splash", "bounce"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 5},
		],
		tier: "LC",
	},
	gyarados: {
		randomBattleMoves: ["bounce", "dragondance", "earthquake", "powerwhip", "waterfall"],
		eventPokemon: [
			{"generation": 6, "level": 50, "isHidden": false, "moves": ["waterfall", "earthquake", "icefang", "dragondance"], "pokeball": "cherishball"},
			{"generation": 6, "level": 20, "shiny": true, "isHidden": false, "moves": ["waterfall", "bite", "icefang", "ironhead"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 2, "level": 15},
			{"generation": 3, "level": 5},
			{"generation": 4, "level": 10},
			{"generation": 5, "level": 1, "isHidden": false},
			{"generation": 7, "level": 10},
		],
		tier: "OU",
		doublesTier: "DOU",
	},
	gyaradosmega: {
		requiredItem: "Gyaradosite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lapras: {
		eventPokemon: [
			{"generation": 3, "level": 44, "moves": ["hydropump", "raindance", "blizzard", "healbell"]},
		],
		encounters: [
			{"generation": 1, "level": 15},
		],
		tier: "NU",
		doublesTier: "DOU",
	},
	laprasgmax: {
		randomBattleMoves: ["freezedry", "icebeam", "sparklingaria", "substitute", "thunderbolt"],
		isGigantamax: "G-Max Resonance",
		tier: "Uber",
		doublesTier: "DOU",
	},
	ditto: {
		randomBattleMoves: ["transform"],
		eventPokemon: [
			{"generation": 7, "level": 10, "isHidden": false, "moves": ["transform"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 12},
			{"generation": 2, "level": 10},
			{"generation": 3, "level": 23},
			{"generation": 4, "level": 10},
			{"generation": 5, "level": 45},
			{"generation": 6, "level": 30},
			{"generation": 7, "level": 25},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	eevee: {
		eventPokemon: [
			{"generation": 4, "level": 10, "gender": "F", "nature": "Lonely", "abilities": ["adaptability"], "moves": ["covet", "bite", "helpinghand", "attract"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "shiny": true, "gender": "M", "nature": "Hardy", "abilities": ["adaptability"], "moves": ["irontail", "trumpcard", "flail", "quickattack"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "gender": "F", "nature": "Hardy", "isHidden": false, "abilities": ["adaptability"], "moves": ["sing", "return", "echoedvoice", "attract"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "sandattack", "babydolleyes", "swift"], "pokeball": "cherishball"},
			{"generation": 6, "level": 15, "shiny": true, "isHidden": true, "moves": ["swift", "quickattack", "babydolleyes", "helpinghand"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "nature": "Jolly", "isHidden": false, "moves": ["celebrate", "sandattack", "babydolleyes"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 25},
		],
		tier: "LC",
	},
	eeveestarter: {
		eventPokemon: [
			{"generation": 7, "level": 5, "perfectIVs": 6, "moves": ["tackle", "tailwhip", "growl"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "LGPE",
		tier: "Illegal",
	},
	eeveegmax: {
		eventPokemon: [
			{"generation": 8, "level": 10, "isHidden": false, "abilities": ["runaway"], "moves": ["growl", "tailwhip", "sandattack", "quickattack"]},
		],
		eventOnly: true,
		unreleasedHidden: true,
		isGigantamax: "G-Max Cuddle",
		tier: "Uber",
		doublesTier: "DUU",
	},
	vaporeon: {
		randomBattleMoves: ["haze", "icebeam", "protect", "scald", "wish", "yawn"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "watergun"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["scald", "icebeam", "raindance", "rest"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	jolteon: {
		randomBattleMoves: ["shadowball", "thunderbolt", "voltswitch", "yawn"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "thundershock"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": false, "moves": ["thunderbolt", "shadowball", "lightscreen", "voltswitch"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	flareon: {
		randomBattleMoves: ["facade", "flareblitz", "quickattack", "superpower"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "ember"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["flareblitz", "facade", "willowisp", "quickattack"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	espeon: {
		randomBattleMoves: ["calmmind", "dazzlinggleam", "morningsun", "psychic", "shadowball"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["psybeam", "psychup", "psychic", "morningsun"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "confusion"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["psychic", "dazzlinggleam", "shadowball", "reflect"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	umbreon: {
		randomBattleMoves: ["foulplay", "protect", "wish", "yawn"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["feintattack", "meanlook", "screech", "moonlight"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "pursuit"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": false, "moves": ["snarl", "toxic", "protect", "moonlight"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	leafeon: {
		randomBattleMoves: ["doubleedge", "leafblade", "swordsdance", "synthesis", "xscissor"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "razorleaf"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["leafblade", "swordsdance", "sunnyday", "synthesis"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	glaceon: {
		randomBattleMoves: ["freezedry", "icebeam", "protect", "shadowball", "wish"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "icywind"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": false, "moves": ["blizzard", "shadowball", "hail", "auroraveil"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	sylveon: {
		randomBattleMoves: ["hypervoice", "mysticalfire", "protect", "psyshock", "shadowball", "wish"],
		eventPokemon: [
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "helpinghand", "sandattack", "fairywind"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "gender": "F", "isHidden": false, "moves": ["disarmingvoice", "babydolleyes", "quickattack", "drainingkiss"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["hyperbeam", "drainingkiss", "psyshock", "calmmind"], "pokeball": "cherishball"},
		],
		tier: "OU",
		doublesTier: "DOU",
	},
	porygon: {
		eventPokemon: [
			{"generation": 5, "level": 10, "isHidden": true, "moves": ["tackle", "conversion", "sharpen", "psybeam"]},
		],
		encounters: [
			{"generation": 1, "level": 18},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	porygon2: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	porygonz: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	omanyte: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "abilities": ["swiftswim"], "moves": ["bubblebeam", "supersonic", "withdraw", "bite"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	omastar: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kabuto: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "abilities": ["battlearmor"], "moves": ["confuseray", "dig", "scratch", "harden"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kabutops: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	aerodactyl: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "abilities": ["pressure"], "moves": ["steelwing", "icefang", "firefang", "thunderfang"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["ancientpower", "rockpolish", "wideguard", "celebrate"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	aerodactylmega: {
		requiredItem: "Aerodactylite",
		isNonstandard: "Past",
	},
	munchlax: {
		eventPokemon: [
			{"generation": 4, "level": 5, "moves": ["metronome", "tackle", "defensecurl", "selfdestruct"]},
			{"generation": 4, "level": 5, "gender": "F", "nature": "Relaxed", "abilities": ["thickfat"], "moves": ["metronome", "odorsleuth", "tackle", "curse"], "pokeball": "cherishball"},
			{"generation": 7, "level": 5, "isHidden": false, "abilities": ["thickfat"], "moves": ["tackle", "metronome", "holdback", "happyhour"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	snorlax: {
		eventPokemon: [
			{"generation": 3, "level": 43, "moves": ["refresh", "fissure", "curse", "bodyslam"]},
			{"generation": 7, "level": 30, "isHidden": false, "abilities": ["thickfat"], "moves": ["sunnyday", "block", "bodyslam", "celebrate"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 30},
		],
		tier: "RU",
		doublesTier: "DOU",
	},
	snorlaxgmax: {
		randomBattleMoves: ["bodyslam", "curse", "darkestlariat", "earthquake", "firepunch", "rest"],
		isGigantamax: "G-Max Replenish",
		tier: "Uber",
		doublesTier: "DOU",
	},
	articuno: {
		eventPokemon: [
			{"generation": 3, "level": 50, "shiny": 1, "moves": ["mist", "agility", "mindreader", "icebeam"]},
			{"generation": 3, "level": 70, "moves": ["agility", "mindreader", "icebeam", "reflect"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["icebeam", "healbell", "extrasensory", "haze"]},
			{"generation": 4, "level": 60, "shiny": 1, "moves": ["agility", "icebeam", "reflect", "roost"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["mist", "agility", "mindreader", "icebeam"]},
			{"generation": 6, "level": 70, "isHidden": false, "moves": ["icebeam", "reflect", "hail", "tailwind"]},
			{"generation": 6, "level": 70, "isHidden": true, "moves": ["freezedry", "icebeam", "hail", "reflect"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["ancientpower", "freezedry", "reflect", "hail"]},
		],
		encounters: [
			{"generation": 1, "level": 50},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zapdos: {
		eventPokemon: [
			{"generation": 3, "level": 50, "shiny": 1, "moves": ["thunderwave", "agility", "detect", "drillpeck"]},
			{"generation": 3, "level": 70, "moves": ["agility", "detect", "drillpeck", "charge"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["thunderbolt", "extrasensory", "batonpass", "metalsound"]},
			{"generation": 4, "level": 60, "shiny": 1, "moves": ["charge", "agility", "discharge", "roost"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["thunderwave", "agility", "detect", "drillpeck"]},
			{"generation": 6, "level": 70, "isHidden": false, "moves": ["agility", "discharge", "raindance", "lightscreen"]},
			{"generation": 6, "level": 70, "isHidden": true, "moves": ["discharge", "thundershock", "raindance", "agility"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["ancientpower", "discharge", "pluck", "raindance"]},
		],
		encounters: [
			{"generation": 1, "level": 50},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	moltres: {
		eventPokemon: [
			{"generation": 3, "level": 50, "shiny": 1, "moves": ["firespin", "agility", "endure", "flamethrower"]},
			{"generation": 3, "level": 70, "moves": ["agility", "endure", "flamethrower", "safeguard"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["extrasensory", "morningsun", "willowisp", "flamethrower"]},
			{"generation": 4, "level": 60, "shiny": 1, "moves": ["flamethrower", "safeguard", "airslash", "roost"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["firespin", "agility", "endure", "flamethrower"]},
			{"generation": 6, "level": 70, "isHidden": false, "moves": ["safeguard", "airslash", "sunnyday", "heatwave"]},
			{"generation": 6, "level": 70, "isHidden": true, "moves": ["skyattack", "heatwave", "sunnyday", "safeguard"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["ancientpower", "flamethrower", "airslash", "sunnyday"]},
		],
		encounters: [
			{"generation": 1, "level": 50},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dratini: {
		encounters: [
			{"generation": 1, "level": 10},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dragonair: {
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 2, "level": 10},
			{"generation": 3, "level": 25, "pokeball": "safariball"},
			{"generation": 4, "level": 15},
			{"generation": 7, "level": 10},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dragonite: {
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["agility", "safeguard", "wingattack", "outrage"], "pokeball": "pokeball"},
			{"generation": 3, "level": 55, "moves": ["healbell", "hyperbeam", "dragondance", "earthquake"]},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Mild", "moves": ["dracometeor", "thunderbolt", "outrage", "dragondance"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "gender": "M", "isHidden": true, "moves": ["extremespeed", "firepunch", "dragondance", "outrage"], "pokeball": "cherishball"},
			{"generation": 5, "level": 55, "gender": "M", "isHidden": true, "moves": ["dragonrush", "safeguard", "wingattack", "thunderpunch"]},
			{"generation": 5, "level": 55, "gender": "M", "isHidden": true, "moves": ["dragonrush", "safeguard", "wingattack", "extremespeed"]},
			{"generation": 5, "level": 50, "gender": "M", "nature": "Brave", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": false, "moves": ["fireblast", "safeguard", "outrage", "hyperbeam"], "pokeball": "cherishball"},
			{"generation": 6, "level": 55, "gender": "M", "isHidden": true, "moves": ["dragondance", "outrage", "hurricane", "extremespeed"], "pokeball": "cherishball"},
			{"generation": 6, "level": 62, "gender": "M", "ivs": {"hp": 31, "def": 31, "spa": 31, "spd": 31}, "isHidden": false, "moves": ["agility", "slam", "barrier", "hyperbeam"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 5, "level": 50, "isHidden": false},
			{"generation": 7, "level": 10},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mewtwo: {
		randomBattleMoves: ["aurasphere", "icebeam", "nastyplot", "psystrike", "recover"],
		eventPokemon: [
			{"generation": 3, "level": 70, "shiny": 1, "moves": ["swift", "recover", "safeguard", "psychic"]},
			{"generation": 4, "level": 70, "shiny": 1, "moves": ["psychocut", "amnesia", "powerswap", "guardswap"]},
			{"generation": 5, "level": 70, "isHidden": false, "moves": ["psystrike", "shadowball", "aurasphere", "electroball"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "nature": "Timid", "ivs": {"spa": 31, "spe": 31}, "isHidden": true, "moves": ["psystrike", "icebeam", "healpulse", "hurricane"], "pokeball": "cherishball"},
			{"generation": 6, "level": 70, "isHidden": false, "moves": ["recover", "psychic", "barrier", "aurasphere"]},
			{"generation": 6, "level": 100, "shiny": true, "isHidden": true, "moves": ["psystrike", "psychic", "recover", "aurasphere"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["psychic", "recover", "swift", "psychocut"]},
		],
		encounters: [
			{"generation": 1, "level": 70},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	mewtwomegax: {
		requiredItem: "Mewtwonite X",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mewtwomegay: {
		requiredItem: "Mewtwonite Y",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mew: {
		randomBattleMoves: ["bravebird", "closecombat", "powerwhip", "psychicfangs", "swordsdance", "uturn"],
		eventPokemon: [
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["pound", "transform", "megapunch", "metronome"]},
			{"generation": 3, "level": 10, "moves": ["pound", "transform"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["fakeout"]},
			{"generation": 3, "level": 10, "moves": ["fakeout"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["feintattack"]},
			{"generation": 3, "level": 10, "moves": ["feintattack"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["hypnosis"]},
			{"generation": 3, "level": 10, "moves": ["hypnosis"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["nightshade"]},
			{"generation": 3, "level": 10, "moves": ["nightshade"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["roleplay"]},
			{"generation": 3, "level": 10, "moves": ["roleplay"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["zapcannon"]},
			{"generation": 3, "level": 10, "moves": ["zapcannon"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "moves": ["ancientpower", "metronome", "teleport", "aurasphere"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "moves": ["barrier", "metronome", "teleport", "aurasphere"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "moves": ["megapunch", "metronome", "teleport", "aurasphere"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "moves": ["amnesia", "metronome", "teleport", "aurasphere"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "moves": ["transform", "metronome", "teleport", "aurasphere"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "moves": ["psychic", "metronome", "teleport", "aurasphere"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "moves": ["synthesis", "return", "hypnosis", "teleport"], "pokeball": "cherishball"},
			{"generation": 4, "level": 5, "moves": ["pound"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["pound"], "pokeball": "cherishball"},
			{"generation": 7, "level": 5, "perfectIVs": 5, "moves": ["pound"], "pokeball": "pokeball"},
			{"generation": 7, "level": 50, "moves": ["psychic", "barrier", "metronome", "transform"], "pokeball": "cherishball"},
			{"generation": 8, "level": 1, "moves": ["pound"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		tier: "OU",
		doublesTier: "DOU",
	},
	chikorita: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "growl", "razorleaf"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "moves": ["tackle", "growl", "ancientpower", "frenzyplant"], "pokeball": "pokeball"},
			{"generation": 6, "level": 5, "isHidden": false, "moves": ["tackle", "growl"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	bayleef: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	meganium: {
		eventPokemon: [
			{"generation": 6, "level": 50, "isHidden": true, "moves": ["solarbeam", "sunnyday", "synthesis", "bodyslam"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cyndaquil: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "leer", "smokescreen"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "moves": ["tackle", "leer", "reversal", "blastburn"], "pokeball": "pokeball"},
			{"generation": 6, "level": 5, "isHidden": false, "moves": ["tackle", "leer"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	quilava: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	typhlosion: {
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["quickattack", "flamewheel", "swift", "flamethrower"], "pokeball": "pokeball"},
			{"generation": 6, "level": 50, "isHidden": true, "moves": ["overheat", "flamewheel", "flamecharge", "swift"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	totodile: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["scratch", "leer", "rage"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "moves": ["scratch", "leer", "crunch", "hydrocannon"], "pokeball": "pokeball"},
			{"generation": 6, "level": 5, "isHidden": false, "moves": ["scratch", "leer"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	croconaw: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	feraligatr: {
		eventPokemon: [
			{"generation": 6, "level": 50, "isHidden": true, "moves": ["icepunch", "crunch", "waterfall", "screech"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sentret: {
		encounters: [
			{"generation": 2, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	furret: {
		encounters: [
			{"generation": 2, "level": 6},
			{"generation": 4, "level": 6},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hoothoot: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "growl", "foresight"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 2, "level": 2},
		],
		unreleasedHidden: "Past",
		tier: "LC",
	},
	noctowl: {
		randomBattleMoves: ["airslash", "defog", "heatwave", "nastyplot", "roost", "whirlwind"],
		encounters: [
			{"generation": 2, "level": 7},
			{"generation": 4, "level": 5},
			{"generation": 7, "level": 19},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	ledyba: {
		eventPokemon: [
			{"generation": 3, "level": 10, "moves": ["refresh", "psybeam", "aerialace", "supersonic"]},
		],
		encounters: [
			{"generation": 2, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ledian: {
		encounters: [
			{"generation": 2, "level": 7},
			{"generation": 4, "level": 5},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	spinarak: {
		eventPokemon: [
			{"generation": 3, "level": 14, "moves": ["refresh", "dig", "signalbeam", "nightshade"]},
		],
		encounters: [
			{"generation": 2, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ariados: {
		encounters: [
			{"generation": 2, "level": 7},
			{"generation": 4, "level": 5},
			{"generation": 6, "level": 19, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	chinchou: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	lanturn: {
		randomBattleMoves: ["hydropump", "icebeam", "scald", "thunderbolt", "thunderwave", "voltswitch"],
		encounters: [
			{"generation": 4, "level": 20},
			{"generation": 6, "level": 26, "maxEggMoves": 1},
			{"generation": 7, "level": 10},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	togepi: {
		eventPokemon: [
			{"generation": 3, "level": 20, "gender": "F", "abilities": ["serenegrace"], "moves": ["metronome", "charm", "sweetkiss", "yawn"], "pokeball": "pokeball"},
			{"generation": 3, "level": 25, "moves": ["triattack", "followme", "ancientpower", "helpinghand"]},
		],
		tier: "LC",
	},
	togetic: {
		tier: "NFE",
	},
	togekiss: {
		randomBattleMoves: ["airslash", "aurasphere", "morningsun", "nastyplot", "thunderwave"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["extremespeed", "aurasphere", "airslash", "present"]},
		],
		tier: "OU",
		doublesTier: "DOU",
	},
	natu: {
		eventPokemon: [
			{"generation": 3, "level": 22, "moves": ["batonpass", "futuresight", "nightshade", "aerialace"]},
		],
		tier: "LC",
	},
	xatu: {
		randomBattleMoves: ["heatwave", "lightscreen", "psychic", "reflect", "roost", "thunderwave", "uturn"],
		encounters: [
			{"generation": 2, "level": 15, "shiny": false},
			{"generation": 4, "level": 16, "shiny": false, "gender": "M", "nature": "Modest", "ivs": {"hp": 15, "atk": 20, "def": 15, "spa": 20, "spd": 20, "spe": 20}, "abilities": ["synchronize"], "pokeball": "pokeball"},
			{"generation": 6, "level": 24, "maxEggMoves": 1},
			{"generation": 7, "level": 21},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	mareep: {
		eventPokemon: [
			{"generation": 3, "level": 37, "gender": "F", "moves": ["thunder", "thundershock", "thunderwave", "cottonspore"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "growl", "thundershock"], "pokeball": "pokeball"},
			{"generation": 3, "level": 17, "moves": ["healbell", "thundershock", "thunderwave", "bodyslam"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["holdback", "tackle", "thunderwave", "thundershock"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	flaaffy: {
		encounters: [
			{"generation": 7, "level": 11, "isHidden": false, "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ampharos: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ampharosmega: {
		requiredItem: "Ampharosite",
		isNonstandard: "Past",
	},
	azurill: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	marill: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	azumarill: {
		encounters: [
			{"generation": 5, "level": 5, "isHidden": false},
			{"generation": 6, "level": 16, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	bonsly: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	sudowoodo: {
		randomBattleMoves: ["earthquake", "headsmash", "stealthrock", "suckerpunch", "woodhammer"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	hoppip: {
		encounters: [
			{"generation": 2, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	skiploom: {
		encounters: [
			{"generation": 4, "level": 12},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	jumpluff: {
		eventPokemon: [
			{"generation": 5, "level": 27, "gender": "M", "isHidden": true, "moves": ["falseswipe", "sleeppowder", "bulletseed", "leechseed"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	aipom: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["scratch", "tailwhip", "sandattack"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ambipom: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sunkern: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["chlorophyll"], "moves": ["absorb", "growth"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sunflora: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	yanma: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	yanmega: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wooper: {
		encounters: [
			{"generation": 2, "level": 4},
		],
		tier: "LC",
	},
	quagsire: {
		randomBattleMoves: ["earthquake", "encore", "icebeam", "recover", "scald", "toxic"],
		encounters: [
			{"generation": 2, "level": 15},
			{"generation": 4, "level": 10},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	murkrow: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["insomnia"], "moves": ["peck", "astonish"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	honchkrow: {
		eventPokemon: [
			{"generation": 7, "level": 65, "gender": "M", "isHidden": false, "abilities": ["superluck"], "moves": ["nightslash", "skyattack", "heatwave", "icywind"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	misdreavus: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["growl", "psywave", "spite"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mismagius: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	unown: {
		encounters: [
			{"generation": 2, "level": 5},
			{"generation": 3, "level": 25},
			{"generation": 4, "level": 5},
			{"generation": 6, "level": 32},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wynaut: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["splash", "charm", "encore", "tickle"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	wobbuffet: {
		randomBattleMoves: ["counter", "destinybond", "encore", "mirrorcoat"],
		eventPokemon: [
			{"generation": 3, "level": 5, "moves": ["counter", "mirrorcoat", "safeguard", "destinybond"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["counter", "mirrorcoat", "safeguard", "destinybond"], "pokeball": "pokeball"},
			{"generation": 6, "level": 10, "gender": "M", "isHidden": false, "moves": ["counter"], "pokeball": "cherishball"},
			{"generation": 6, "level": 15, "gender": "M", "isHidden": false, "moves": ["counter", "mirrorcoat"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 2, "level": 5},
			{"generation": 4, "level": 3},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	girafarig: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pineco: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "protect", "selfdestruct"], "pokeball": "pokeball"},
			{"generation": 3, "level": 20, "moves": ["refresh", "pinmissile", "spikes", "counter"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	forretress: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dunsparce: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gligar: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["poisonsting", "sandattack"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gliscor: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	snubbull: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "scaryface", "tailwhip", "charm"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	granbull: {
		encounters: [
			{"generation": 2, "level": 15},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	qwilfish: {
		randomBattleMoves: ["destinybond", "liquidation", "spikes", "taunt", "thunderwave", "toxic", "toxicspikes"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "poisonsting", "harden", "minimize"], "pokeball": "pokeball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	shuckle: {
		randomBattleMoves: ["encore", "infestation", "knockoff", "stealthrock", "stickyweb", "toxic"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["sturdy"], "moves": ["constrict", "withdraw", "wrap"], "pokeball": "pokeball"},
			{"generation": 3, "level": 20, "abilities": ["sturdy"], "moves": ["substitute", "toxic", "sludgebomb", "encore"], "pokeball": "pokeball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	heracross: {
		eventPokemon: [
			{"generation": 6, "level": 50, "gender": "F", "nature": "Adamant", "isHidden": false, "moves": ["bulletseed", "pinmissile", "closecombat", "megahorn"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "nature": "Adamant", "isHidden": false, "abilities": ["guts"], "moves": ["pinmissile", "bulletseed", "earthquake", "rockblast"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	heracrossmega: {
		requiredItem: "Heracronite",
		isNonstandard: "Past",
	},
	sneasel: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["scratch", "leer", "taunt", "quickattack"], "pokeball": "pokeball"},
		],
		tier: "LC Uber",
	},
	weavile: {
		randomBattleMoves: ["iceshard", "iciclecrash", "lowkick", "swordsdance", "throatchop"],
		eventPokemon: [
			{"generation": 4, "level": 30, "gender": "M", "nature": "Jolly", "moves": ["fakeout", "iceshard", "nightslash", "brickbreak"], "pokeball": "cherishball"},
			{"generation": 6, "level": 48, "gender": "M", "perfectIVs": 2, "isHidden": false, "moves": ["nightslash", "icepunch", "brickbreak", "xscissor"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	teddiursa: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["pickup"], "moves": ["scratch", "leer", "lick"], "pokeball": "pokeball"},
			{"generation": 3, "level": 11, "abilities": ["pickup"], "moves": ["refresh", "metalclaw", "lick", "return"]},
		],
		encounters: [
			{"generation": 2, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ursaring: {
		encounters: [
			{"generation": 2, "level": 25},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	slugma: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magcargo: {
		eventPokemon: [
			{"generation": 3, "level": 38, "moves": ["refresh", "heatwave", "earthquake", "flamethrower"]},
		],
		encounters: [
			{"generation": 3, "level": 25},
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swinub: {
		eventPokemon: [
			{"generation": 3, "level": 22, "abilities": ["oblivious"], "moves": ["charm", "ancientpower", "mist", "mudshot"]},
		],
		tier: "LC",
	},
	piloswine: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "NFE",
	},
	mamoswine: {
		randomBattleMoves: ["earthquake", "iceshard", "iciclecrash", "stealthrock", "superpower"],
		eventPokemon: [
			{"generation": 5, "level": 34, "gender": "M", "isHidden": true, "moves": ["hail", "icefang", "takedown", "doublehit"]},
			{"generation": 6, "level": 50, "shiny": true, "gender": "M", "nature": "Adamant", "isHidden": true, "moves": ["iciclespear", "earthquake", "iciclecrash", "rockslide"], "pokeball": "pokeball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	corsola: {
		randomBattleMoves: ["lightscreen", "reflect", "recover", "scald", "stealthrock"],
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["tackle", "mudsport"], "pokeball": "pokeball"},
			{"generation": 7, "level": 50, "gender": "F", "nature": "Serious", "isHidden": false, "abilities": ["hustle"], "moves": ["tackle", "powergem"], "pokeball": "ultraball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	corsolagalar: {
		randomBattleMoves: ["nightshade", "stealthrock", "strengthsap", "willowisp"],
		tier: "UU",
		doublesTier: "LC Uber",
	},
	cursola: {
		randomBattleMoves: ["earthpower", "hex", "hydropump", "icebeam", "shadowball", "stealthrock", "strengthsap", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	remoraid: {
		tier: "LC",
	},
	octillery: {
		randomBattleMoves: ["energyball", "fireblast", "gunkshot", "icebeam", "protect", "surf"],
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "F", "nature": "Serious", "abilities": ["suctioncups"], "moves": ["octazooka", "icebeam", "signalbeam", "hyperbeam"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 4, "level": 19},
			{"generation": 7, "level": 10},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	delibird: {
		randomBattleMoves: ["freezedry", "memento", "rapidspin", "spikes"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["present"], "pokeball": "pokeball"},
			{"generation": 6, "level": 10, "isHidden": false, "abilities": ["vitalspirit"], "moves": ["present", "happyhour"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	mantyke: {
		tier: "LC",
	},
	mantine: {
		randomBattleMoves: ["haze", "hurricane", "icebeam", "roost", "scald"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "bubble", "supersonic"], "pokeball": "pokeball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	skarmory: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	houndour: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["leer", "ember", "howl"], "pokeball": "pokeball"},
			{"generation": 3, "level": 17, "moves": ["charm", "feintattack", "ember", "roar"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	houndoom: {
		eventPokemon: [
			{"generation": 6, "level": 50, "nature": "Timid", "isHidden": false, "abilities": ["flashfire"], "moves": ["flamethrower", "darkpulse", "solarbeam", "sludgebomb"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 4, "level": 20},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	houndoommega: {
		requiredItem: "Houndoominite",
		isNonstandard: "Past",
	},
	phanpy: {
		encounters: [
			{"generation": 2, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	donphan: {
		encounters: [
			{"generation": 6, "level": 24, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	stantler: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["intimidate"], "moves": ["tackle", "leer"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	smeargle: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["owntempo"], "moves": ["sketch"], "pokeball": "pokeball"},
			{"generation": 5, "level": 50, "gender": "F", "nature": "Jolly", "ivs": {"atk": 31, "spe": 31}, "isHidden": false, "abilities": ["technician"], "moves": ["falseswipe", "spore", "odorsleuth", "meanlook"], "pokeball": "cherishball"},
			{"generation": 6, "level": 40, "gender": "M", "nature": "Jolly", "isHidden": false, "abilities": ["owntempo"], "moves": ["sketch", "furyswipes", "seismictoss", "flamethrower"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	miltank: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "isHidden": false, "abilities": ["scrappy"], "moves": ["rollout", "attract", "stomp", "milkdrink"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	raikou: {
		eventPokemon: [
			{"generation": 3, "level": 50, "shiny": 1, "moves": ["thundershock", "roar", "quickattack", "spark"]},
			{"generation": 3, "level": 70, "moves": ["quickattack", "spark", "reflect", "crunch"], "pokeball": "pokeball"},
			{"generation": 4, "level": 40, "shiny": 1, "moves": ["roar", "quickattack", "spark", "reflect"]},
			{"generation": 4, "level": 30, "shiny": true, "nature": "Rash", "moves": ["zapcannon", "aurasphere", "extremespeed", "weatherball"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["spark", "reflect", "crunch", "thunderfang"]},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["reflect", "crunch", "thunderfang", "discharge"]},
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["reflect", "crunch", "thunderfang", "discharge"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["thunderbolt", "voltswitch", "extrasensory", "calmmind"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 2, "level": 40},
			{"generation": 3, "level": 40},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	entei: {
		eventPokemon: [
			{"generation": 3, "level": 50, "shiny": 1, "moves": ["ember", "roar", "firespin", "stomp"]},
			{"generation": 3, "level": 70, "moves": ["firespin", "stomp", "flamethrower", "swagger"], "pokeball": "pokeball"},
			{"generation": 4, "level": 40, "shiny": 1, "moves": ["roar", "firespin", "stomp", "flamethrower"]},
			{"generation": 4, "level": 30, "shiny": true, "nature": "Adamant", "moves": ["flareblitz", "howl", "extremespeed", "crushclaw"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["stomp", "flamethrower", "swagger", "firefang"]},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["stomp", "bite", "swagger", "lavaplume"]},
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["stomp", "bite", "swagger", "lavaplume"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["sacredfire", "stoneedge", "ironhead", "flamecharge"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 2, "level": 40},
			{"generation": 3, "level": 40},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	suicune: {
		eventPokemon: [
			{"generation": 3, "level": 50, "shiny": 1, "moves": ["bubblebeam", "raindance", "gust", "aurorabeam"]},
			{"generation": 3, "level": 70, "moves": ["gust", "aurorabeam", "mist", "mirrorcoat"], "pokeball": "pokeball"},
			{"generation": 4, "level": 40, "shiny": 1, "moves": ["raindance", "gust", "aurorabeam", "mist"]},
			{"generation": 4, "level": 30, "shiny": true, "nature": "Relaxed", "moves": ["sheercold", "airslash", "extremespeed", "aquaring"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["aurorabeam", "mist", "mirrorcoat", "icefang"]},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["bubblebeam", "aurorabeam", "mist", "raindance"]},
		],
		encounters: [
			{"generation": 2, "level": 40},
			{"generation": 3, "level": 40},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	larvitar: {
		eventPokemon: [
			{"generation": 3, "level": 20, "moves": ["sandstorm", "dragondance", "bite", "outrage"], "pokeball": "pokeball"},
			{"generation": 5, "level": 5, "shiny": true, "gender": "M", "isHidden": false, "moves": ["bite", "leer", "sandstorm", "superpower"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	pupitar: {
		tier: "NFE",
	},
	tyranitar: {
		randomBattleMoves: ["crunch", "dragondance", "earthquake", "firepunch", "stealthrock", "stoneedge"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["thrash", "scaryface", "crunch", "earthquake"], "pokeball": "pokeball"},
			{"generation": 5, "level": 100, "gender": "M", "isHidden": false, "moves": ["fireblast", "icebeam", "stoneedge", "crunch"], "pokeball": "cherishball"},
			{"generation": 5, "level": 55, "gender": "M", "isHidden": true, "moves": ["payback", "crunch", "earthquake", "seismictoss"]},
			{"generation": 6, "level": 50, "isHidden": false, "moves": ["stoneedge", "crunch", "earthquake", "icepunch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "nature": "Jolly", "isHidden": false, "moves": ["rockslide", "earthquake", "crunch", "stoneedge"], "pokeball": "cherishball"},
			{"generation": 6, "level": 55, "shiny": true, "nature": "Adamant", "ivs": {"hp": 31, "atk": 31, "def": 31, "spa": 14, "spd": 31, "spe": 0}, "isHidden": false, "moves": ["crunch", "rockslide", "lowkick", "protect"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "isHidden": false, "moves": ["rockslide", "crunch", "icepunch", "lowkick"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 5, "level": 50, "isHidden": false},
		],
		tier: "OU",
		doublesTier: "DOU",
	},
	tyranitarmega: {
		requiredItem: "Tyranitarite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lugia: {
		eventPokemon: [
			{"generation": 3, "level": 70, "shiny": 1, "moves": ["recover", "hydropump", "raindance", "swift"]},
			{"generation": 3, "level": 50, "moves": ["psychoboost", "earthquake", "hydropump", "featherdance"]},
			{"generation": 4, "level": 45, "shiny": 1, "moves": ["extrasensory", "raindance", "hydropump", "aeroblast"]},
			{"generation": 4, "level": 70, "shiny": 1, "moves": ["aeroblast", "punishment", "ancientpower", "safeguard"]},
			{"generation": 5, "level": 5, "isHidden": true, "moves": ["whirlwind", "weatherball"], "pokeball": "dreamball"},
			{"generation": 6, "level": 50, "shiny": 1, "isHidden": false, "moves": ["raindance", "hydropump", "aeroblast", "punishment"]},
			{"generation": 6, "level": 50, "nature": "Timid", "isHidden": false, "moves": ["aeroblast", "hydropump", "dragonrush", "icebeam"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["skillswap", "aeroblast", "extrasensory", "ancientpower"]},
			{"generation": 7, "level": 100, "isHidden": true, "moves": ["aeroblast", "hurricane", "defog", "tailwind"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["skillswap", "aeroblast", "extrasensory", "ancientpower"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["aeroblast", "earthpower", "psychic", "tailwind"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 2, "level": 40},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hooh: {
		eventPokemon: [
			{"generation": 3, "level": 70, "shiny": 1, "moves": ["recover", "fireblast", "sunnyday", "swift"]},
			{"generation": 4, "level": 45, "shiny": 1, "moves": ["extrasensory", "sunnyday", "fireblast", "sacredfire"]},
			{"generation": 4, "level": 70, "shiny": 1, "moves": ["sacredfire", "punishment", "ancientpower", "safeguard"]},
			{"generation": 5, "level": 5, "isHidden": true, "moves": ["whirlwind", "weatherball"], "pokeball": "dreamball"},
			{"generation": 6, "level": 50, "shiny": 1, "isHidden": false, "moves": ["sunnyday", "fireblast", "sacredfire", "punishment"]},
			{"generation": 6, "level": 50, "shiny": true, "isHidden": false, "moves": ["sacredfire", "bravebird", "recover", "celebrate"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["sacredfire", "bravebird", "recover", "safeguard"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["burnup", "sacredfire", "extrasensory", "ancientpower"]},
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["burnup", "sacredfire", "extrasensory", "ancientpower"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["sacredfire", "bravebird", "earthquake", "tailwind"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 2, "level": 40},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	celebi: {
		randomBattleMoves: ["aurasphere", "gigadrain", "leafstorm", "nastyplot", "psychic", "recover", "stealthrock"],
		eventPokemon: [
			{"generation": 3, "level": 10, "moves": ["confusion", "recover", "healbell", "safeguard"], "pokeball": "pokeball"},
			{"generation": 3, "level": 70, "moves": ["ancientpower", "futuresight", "batonpass", "perishsong"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "moves": ["leechseed", "recover", "healbell", "safeguard"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "moves": ["healbell", "safeguard", "ancientpower", "futuresight"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "moves": ["leafstorm", "recover", "nastyplot", "healingwish"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "moves": ["recover", "healbell", "safeguard", "holdback"], "pokeball": "luxuryball"},
			{"generation": 6, "level": 100, "moves": ["confusion", "recover", "healbell", "safeguard"], "pokeball": "cherishball"},
			{"generation": 7, "level": 30, "moves": ["healbell", "safeguard", "ancientpower", "futuresight"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 2, "level": 30},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	treecko: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["pound", "leer", "absorb"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["pound", "leer", "absorb"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	grovyle: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sceptile: {
		eventPokemon: [
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["leafstorm", "dragonpulse", "focusblast", "rockslide"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sceptilemega: {
		requiredItem: "Sceptilite",
		isNonstandard: "Past",
	},
	torchic: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["scratch", "growl", "focusenergy", "ember"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["scratch", "growl", "focusenergy", "ember"]},
			{"generation": 6, "level": 10, "gender": "M", "isHidden": true, "moves": ["scratch", "growl", "focusenergy", "ember"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	combusken: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	blaziken: {
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["blazekick", "slash", "mirrormove", "skyuppercut"], "pokeball": "pokeball"},
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["flareblitz", "highjumpkick", "thunderpunch", "stoneedge"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	blazikenmega: {
		requiredItem: "Blazikenite",
		isNonstandard: "Past",
	},
	mudkip: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "growl", "mudslap", "watergun"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tackle", "growl", "mudslap", "watergun"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	marshtomp: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swampert: {
		eventPokemon: [
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["earthquake", "icebeam", "hydropump", "hammerarm"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swampertmega: {
		requiredItem: "Swampertite",
		isNonstandard: "Past",
	},
	poochyena: {
		eventPokemon: [
			{"generation": 3, "level": 10, "abilities": ["runaway"], "moves": ["healbell", "dig", "poisonfang", "howl"]},
		],
		encounters: [
			{"generation": 3, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mightyena: {
		eventPokemon: [
			{"generation": 7, "level": 64, "gender": "M", "isHidden": false, "abilities": ["intimidate"], "moves": ["crunch", "firefang", "icefang", "thunderfang"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zigzagoon: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": true, "abilities": ["pickup"], "moves": ["tackle", "growl", "tailwhip"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["pickup"], "moves": ["tackle", "growl", "tailwhip", "extremespeed"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 3, "level": 2},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	zigzagoongalar: {
		tier: "LC",
	},
	linoone: {
		randomBattleMoves: ["bellydrum", "extremespeed", "stompingtantrum", "throatchop"],
		eventPokemon: [
			{"generation": 6, "level": 50, "isHidden": false, "moves": ["extremespeed", "helpinghand", "babydolleyes", "protect"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 4, "level": 3},
			{"generation": 6, "level": 17, "maxEggMoves": 1},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	linoonegalar: {
		tier: "NFE",
	},
	obstagoon: {
		randomBattleMoves: ["bulkup", "closecombat", "facade", "gunkshot", "knockoff", "obstruct"],
		tier: "OU",
		doublesTier: "DUU",
	},
	wurmple: {
		encounters: [
			{"generation": 3, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	silcoon: {
		isNonstandard: "Past",
		tier: "Illegal",
		encounters: [
			{"generation": 3, "level": 5},
			{"generation": 4, "level": 5},
			{"generation": 6, "level": 2, "maxEggMoves": 1},
		],
	},
	beautifly: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cascoon: {
		encounters: [
			{"generation": 3, "level": 5},
			{"generation": 4, "level": 5},
			{"generation": 6, "level": 2, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dustox: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lotad: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["astonish", "growl", "absorb"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 3, "level": 3},
		],
		tier: "LC",
	},
	lombre: {
		encounters: [
			{"generation": 6, "level": 13, "maxEggMoves": 1},
		],
		tier: "NFE",
	},
	ludicolo: {
		randomBattleMoves: ["gigadrain", "hydropump", "icebeam", "raindance", "scald"],
		eventPokemon: [
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "abilities": ["swiftswim"], "moves": ["fakeout", "hydropump", "icebeam", "gigadrain"], "pokeball": "cherishball"},
			{"generation": 5, "level": 30, "gender": "M", "nature": "Calm", "isHidden": false, "abilities": ["swiftswim"], "moves": ["scald", "gigadrain", "icebeam", "sunnyday"], "pokeball": "pokeball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	seedot: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["bide", "harden", "growth"], "pokeball": "pokeball"},
			{"generation": 3, "level": 17, "moves": ["refresh", "gigadrain", "bulletseed", "secretpower"]},
		],
		encounters: [
			{"generation": 3, "level": 3},
		],
		tier: "LC",
	},
	nuzleaf: {
		encounters: [
			{"generation": 6, "level": 13, "maxEggMoves": 1},
		],
		tier: "NFE",
	},
	shiftry: {
		randomBattleMoves: ["darkpulse", "defog", "heatwave", "leafstorm", "nastyplot", "suckerpunch"],
		tier: "RU",
		doublesTier: "DUU",
	},
	taillow: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["peck", "growl", "focusenergy", "featherdance"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 3, "level": 4},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swellow: {
		eventPokemon: [
			{"generation": 3, "level": 43, "moves": ["batonpass", "skyattack", "agility", "facade"]},
		],
		encounters: [
			{"generation": 4, "level": 20},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wingull: {
		encounters: [
			{"generation": 3, "level": 2},
		],
		unreleasedHidden: "Past",
		tier: "LC",
	},
	pelipper: {
		randomBattleMoves: ["hurricane", "hydropump", "knockoff", "roost", "scald", "uturn"],
		encounters: [
			{"generation": 4, "level": 15},
			{"generation": 6, "level": 18, "maxEggMoves": 1},
		],
		unreleasedHidden: "Past",
		tier: "OU",
		doublesTier: "DOU",
	},
	ralts: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["growl", "wish"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["growl", "charm"], "pokeball": "pokeball"},
			{"generation": 3, "level": 20, "moves": ["sing", "shockwave", "reflect", "confusion"]},
			{"generation": 6, "level": 1, "isHidden": true, "moves": ["growl", "encore"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 3, "level": 4},
		],
		tier: "LC",
	},
	kirlia: {
		encounters: [
			{"generation": 4, "level": 6},
		],
		tier: "NFE",
	},
	gardevoir: {
		randomBattleMoves: ["calmmind", "focusblast", "moonblast", "psychic", "substitute", "trick", "willowisp"],
		eventPokemon: [
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "abilities": ["trace"], "moves": ["hypnosis", "thunderbolt", "focusblast", "psychic"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": true, "gender": "F", "isHidden": false, "abilities": ["synchronize"], "moves": ["dazzlinggleam", "moonblast", "storedpower", "calmmind"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	gardevoirmega: {
		requiredItem: "Gardevoirite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gallade: {
		randomBattleMoves: ["closecombat", "knockoff", "shadowsneak", "swordsdance", "trick", "zenheadbutt"],
		tier: "RU",
		doublesTier: "DUU",
	},
	gallademega: {
		requiredItem: "Galladite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	surskit: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["bubble", "mudsport"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["bubble", "quickattack"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 3, "level": 3},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	masquerain: {
		encounters: [
			{"generation": 6, "level": 21, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	shroomish: {
		eventPokemon: [
			{"generation": 3, "level": 15, "abilities": ["effectspore"], "moves": ["refresh", "falseswipe", "megadrain", "stunspore"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	breloom: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	slakoth: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	vigoroth: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	slaking: {
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "M", "nature": "Adamant", "moves": ["gigaimpact", "return", "shadowclaw", "aerialace"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	nincada: {
		tier: "LC",
	},
	ninjask: {
		randomBattleMoves: ["acrobatics", "leechlife", "nightslash", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	shedinja: {
		randomBattleMoves: ["shadowclaw", "shadowsneak", "willowisp", "xscissor"],
		eventPokemon: [
			{"generation": 3, "level": 50, "moves": ["spite", "confuseray", "shadowball", "grudge"], "pokeball": "pokeball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	whismur: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["pound", "uproar", "teeterdance"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	loudred: {
		encounters: [
			{"generation": 6, "level": 16, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	exploud: {
		eventPokemon: [
			{"generation": 3, "level": 100, "moves": ["roar", "rest", "sleeptalk", "hypervoice"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["stomp", "screech", "hyperbeam", "roar"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	makuhita: {
		eventPokemon: [
			{"generation": 3, "level": 18, "moves": ["refresh", "brickbreak", "armthrust", "rocktomb"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hariyama: {
		encounters: [
			{"generation": 6, "level": 22, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	nosepass: {
		eventPokemon: [
			{"generation": 3, "level": 26, "moves": ["helpinghand", "thunderbolt", "thunderwave", "rockslide"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	probopass: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	skitty: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["cutecharm"], "moves": ["tackle", "growl", "tailwhip", "payday"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["cutecharm"], "moves": ["growl", "tackle", "tailwhip", "rollout"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["cutecharm"], "moves": ["growl", "tackle", "tailwhip", "attract"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 3, "level": 3, "shiny": false, "gender": "F", "ivs": {"hp": 5, "atk": 4, "def": 4, "spa": 5, "spd": 4, "spe": 4}, "abilities": ["cutecharm"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	delcatty: {
		eventPokemon: [
			{"generation": 3, "level": 18, "abilities": ["cutecharm"], "moves": ["sweetkiss", "secretpower", "attract", "shockwave"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sableye: {
		randomBattleMoves: ["encore", "foulplay", "knockoff", "recover", "taunt", "willowisp"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["keeneye"], "moves": ["leer", "scratch", "foresight", "nightshade"], "pokeball": "pokeball"},
			{"generation": 3, "level": 33, "abilities": ["keeneye"], "moves": ["helpinghand", "shadowball", "feintattack", "recover"]},
			{"generation": 5, "level": 50, "gender": "M", "isHidden": true, "moves": ["foulplay", "octazooka", "tickle", "trick"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "nature": "Relaxed", "ivs": {"hp": 31, "spa": 31}, "isHidden": true, "moves": ["calmmind", "willowisp", "recover", "shadowball"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "nature": "Bold", "isHidden": true, "moves": ["willowisp", "recover", "taunt", "shockwave"], "pokeball": "cherishball"},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	sableyemega: {
		requiredItem: "Sablenite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mawile: {
		randomBattleMoves: ["ironhead", "playrough", "suckerpunch", "stealthrock", "swordsdance"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["astonish", "faketears"], "pokeball": "pokeball"},
			{"generation": 3, "level": 22, "moves": ["sing", "falseswipe", "visegrip", "irondefense"]},
			{"generation": 6, "level": 50, "isHidden": false, "abilities": ["intimidate"], "moves": ["ironhead", "playrough", "firefang", "suckerpunch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "isHidden": false, "abilities": ["intimidate"], "moves": ["suckerpunch", "protect", "playrough", "ironhead"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	mawilemega: {
		requiredItem: "Mawilite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	aron: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lairon: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	aggron: {
		eventPokemon: [
			{"generation": 3, "level": 100, "moves": ["irontail", "protect", "metalsound", "doubleedge"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["takedown", "irontail", "protect", "metalsound"], "pokeball": "pokeball"},
			{"generation": 6, "level": 50, "nature": "Brave", "isHidden": false, "abilities": ["rockhead"], "moves": ["ironhead", "earthquake", "headsmash", "rockslide"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	aggronmega: {
		requiredItem: "Aggronite",
		isNonstandard: "Past",
	},
	meditite: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["bide", "meditate", "confusion"], "pokeball": "pokeball"},
			{"generation": 3, "level": 20, "moves": ["dynamicpunch", "confusion", "shadowball", "detect"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	medicham: {
		encounters: [
			{"generation": 4, "level": 35},
			{"generation": 6, "level": 34, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	medichammega: {
		requiredItem: "Medichamite",
		isNonstandard: "Past",
	},
	electrike: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	manectric: {
		randomBattleMoves: ["flamethrower", "overheat", "switcheroo", "thunderbolt", "voltswitch"],
		eventPokemon: [
			{"generation": 3, "level": 44, "moves": ["refresh", "thunder", "raindance", "bite"]},
			{"generation": 6, "level": 50, "nature": "Timid", "isHidden": false, "abilities": ["lightningrod"], "moves": ["overheat", "thunderbolt", "voltswitch", "protect"], "pokeball": "cherishball"},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	manectricmega: {
		requiredItem: "Manectite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	plusle: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["growl", "thunderwave", "mudsport"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["growl", "thunderwave", "quickattack"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	minun: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["growl", "thunderwave", "watersport"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["growl", "thunderwave", "quickattack"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	volbeat: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	illumise: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	budew: {
		tier: "LC",
	},
	roselia: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["absorb", "growth", "poisonsting"], "pokeball": "pokeball"},
			{"generation": 3, "level": 22, "moves": ["sweetkiss", "magicalleaf", "leechseed", "grasswhistle"]},
		],
		tier: "NFE",
	},
	roserade: {
		randomBattleMoves: ["leafstorm", "sleeppowder", "sludgebomb", "spikes", "synthesis", "toxicspikes"],
		tier: "UU",
		doublesTier: "DUU",
	},
	gulpin: {
		eventPokemon: [
			{"generation": 3, "level": 17, "moves": ["sing", "shockwave", "sludge", "toxic"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swalot: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	carvanha: {
		eventPokemon: [
			{"generation": 3, "level": 15, "moves": ["refresh", "waterpulse", "bite", "scaryface"]},
			{"generation": 6, "level": 1, "isHidden": true, "moves": ["leer", "bite", "hydropump"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sharpedo: {
		eventPokemon: [
			{"generation": 6, "level": 50, "nature": "Adamant", "isHidden": true, "moves": ["aquajet", "crunch", "icefang", "destinybond"], "pokeball": "cherishball"},
			{"generation": 6, "level": 43, "gender": "M", "perfectIVs": 2, "isHidden": false, "moves": ["scaryface", "slash", "poisonfang", "crunch"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 7, "level": 10},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sharpedomega: {
		requiredItem: "Sharpedonite",
		isNonstandard: "Past",
	},
	wailmer: {
		tier: "LC",
	},
	wailord: {
		randomBattleMoves: ["hydropump", "hypervoice", "icebeam", "waterspout"],
		eventPokemon: [
			{"generation": 3, "level": 100, "moves": ["rest", "waterspout", "amnesia", "hydropump"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["waterpulse", "mist", "rest", "waterspout"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 3, "level": 25},
			{"generation": 4, "level": 35},
			{"generation": 5, "level": 30, "isHidden": false},
			{"generation": 7, "level": 10},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	numel: {
		eventPokemon: [
			{"generation": 3, "level": 14, "abilities": ["oblivious"], "moves": ["charm", "takedown", "dig", "ember"]},
			{"generation": 6, "level": 1, "isHidden": false, "moves": ["growl", "tackle", "ironhead"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	camerupt: {
		eventPokemon: [
			{"generation": 6, "level": 43, "gender": "M", "perfectIVs": 2, "isHidden": false, "abilities": ["solidrock"], "moves": ["curse", "takedown", "rockslide", "yawn"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cameruptmega: {
		requiredItem: "Cameruptite",
		isNonstandard: "Past",
	},
	torkoal: {
		randomBattleMoves: ["earthquake", "lavaplume", "rapidspin", "solarbeam", "stealthrock"],
		tier: "RU",
		doublesTier: "DOU",
	},
	spoink: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["owntempo"], "moves": ["splash", "uproar"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	grumpig: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	spinda: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["tackle", "uproar", "sing"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	trapinch: {
		eventPokemon: [
			{"generation": 5, "level": 1, "shiny": true, "isHidden": false, "moves": ["bite"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	vibrava: {
		tier: "NFE",
	},
	flygon: {
		randomBattleMoves: ["dragondance", "earthquake", "firepunch", "outrage", "uturn"],
		eventPokemon: [
			{"generation": 3, "level": 45, "moves": ["sandtomb", "crunch", "dragonbreath", "screech"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Naive", "moves": ["dracometeor", "uturn", "earthquake", "dragonclaw"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	cacnea: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["poisonsting", "leer", "absorb", "encore"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cacturne: {
		eventPokemon: [
			{"generation": 3, "level": 45, "moves": ["ingrain", "feintattack", "spikes", "needlearm"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swablu: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["peck", "growl", "falseswipe"], "pokeball": "pokeball"},
			{"generation": 5, "level": 1, "shiny": true, "isHidden": false, "moves": ["peck", "growl"], "pokeball": "pokeball"},
			{"generation": 6, "level": 1, "isHidden": true, "moves": ["peck", "growl", "hypervoice"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	altaria: {
		eventPokemon: [
			{"generation": 3, "level": 45, "moves": ["takedown", "dragonbreath", "dragondance", "refresh"], "pokeball": "pokeball"},
			{"generation": 3, "level": 36, "moves": ["healbell", "dragonbreath", "solarbeam", "aerialace"]},
			{"generation": 5, "level": 35, "gender": "M", "isHidden": true, "moves": ["takedown", "naturalgift", "dragonbreath", "falseswipe"]},
			{"generation": 6, "level": 100, "nature": "Modest", "isHidden": true, "moves": ["hypervoice", "fireblast", "protect", "agility"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	altariamega: {
		requiredItem: "Altarianite",
		isNonstandard: "Past",
	},
	zangoose: {
		eventPokemon: [
			{"generation": 3, "level": 18, "moves": ["leer", "quickattack", "swordsdance", "furycutter"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["scratch", "leer", "quickattack", "swordsdance"], "pokeball": "pokeball"},
			{"generation": 3, "level": 28, "moves": ["refresh", "brickbreak", "counter", "crushclaw"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	seviper: {
		eventPokemon: [
			{"generation": 3, "level": 18, "moves": ["wrap", "lick", "bite", "poisontail"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "moves": ["poisontail", "screech", "glare", "crunch"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["wrap", "lick", "bite"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lunatone: {
		randomBattleMoves: ["earthpower", "icebeam", "nastyplot", "powergem", "psychic", "rockpolish", "stealthrock"],
		eventPokemon: [
			{"generation": 3, "level": 10, "moves": ["tackle", "harden", "confusion"], "pokeball": "pokeball"},
			{"generation": 3, "level": 25, "moves": ["batonpass", "psychic", "raindance", "rocktomb"]},
			{"generation": 7, "level": 30, "moves": ["cosmicpower", "hiddenpower", "moonblast", "powergem"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	solrock: {
		randomBattleMoves: ["earthquake", "explosion", "morningsun", "rockslide", "stealthrock", "swordsdance", "willowisp", "zenheadbutt"],
		eventPokemon: [
			{"generation": 3, "level": 10, "moves": ["tackle", "harden", "confusion"], "pokeball": "pokeball"},
			{"generation": 3, "level": 41, "moves": ["batonpass", "psychic", "sunnyday", "cosmicpower"]},
			{"generation": 7, "level": 30, "moves": ["cosmicpower", "hiddenpower", "solarbeam", "stoneedge"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	barboach: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	whiscash: {
		randomBattleMoves: ["dragondance", "earthquake", "liquidation", "stoneedge", "zenheadbutt"],
		eventPokemon: [
			{"generation": 4, "level": 51, "gender": "F", "nature": "Gentle", "abilities": ["oblivious"], "moves": ["earthquake", "aquatail", "zenheadbutt", "gigaimpact"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 4, "level": 10},
			{"generation": 7, "level": 10},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	corphish: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["bubble", "watersport"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	crawdaunt: {
		randomBattleMoves: ["aquajet", "closecombat", "crabhammer", "dragondance", "knockoff", "swordsdance"],
		eventPokemon: [
			{"generation": 3, "level": 100, "moves": ["taunt", "crabhammer", "swordsdance", "guillotine"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["knockoff", "taunt", "crabhammer", "swordsdance"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 7, "level": 10},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	baltoy: {
		eventPokemon: [
			{"generation": 3, "level": 17, "moves": ["refresh", "rocktomb", "mudslap", "psybeam"]},
		],
		tier: "LC",
	},
	claydol: {
		randomBattleMoves: ["earthquake", "icebeam", "psychic", "rapidspin", "stealthrock"],
		tier: "UU",
		doublesTier: "DUU",
	},
	lileep: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "moves": ["recover", "rockslide", "constrict", "acid"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cradily: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	anorith: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "moves": ["harden", "mudsport", "watergun", "crosspoison"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	armaldo: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	feebas: {
		eventPokemon: [
			{"generation": 4, "level": 5, "gender": "F", "nature": "Calm", "moves": ["splash", "mirrorcoat"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	milotic: {
		randomBattleMoves: ["dragontail", "icebeam", "recover", "rest", "scald", "sleeptalk"],
		eventPokemon: [
			{"generation": 3, "level": 35, "moves": ["waterpulse", "twister", "recover", "raindance"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "gender": "F", "nature": "Bold", "moves": ["recover", "raindance", "icebeam", "hydropump"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "shiny": true, "gender": "M", "nature": "Timid", "moves": ["raindance", "recover", "hydropump", "icywind"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["recover", "hydropump", "icebeam", "mirrorcoat"], "pokeball": "cherishball"},
			{"generation": 5, "level": 58, "gender": "M", "nature": "Lax", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": false, "moves": ["recover", "surf", "icebeam", "toxic"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	castform: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	castformsunny: {
		requiredAbility: 'Forecast',
		battleOnly: true,
		isNonstandard: "Past",
	},
	castformrainy: {
		requiredAbility: 'Forecast',
		battleOnly: true,
		isNonstandard: "Past",
	},
	castformsnowy: {
		requiredAbility: 'Forecast',
		battleOnly: true,
		isNonstandard: "Past",
	},
	kecleon: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	shuppet: {
		eventPokemon: [
			{"generation": 3, "level": 45, "abilities": ["insomnia"], "moves": ["spite", "willowisp", "feintattack", "shadowball"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	banette: {
		eventPokemon: [
			{"generation": 3, "level": 37, "abilities": ["insomnia"], "moves": ["helpinghand", "feintattack", "shadowball", "curse"]},
			{"generation": 5, "level": 37, "gender": "F", "isHidden": true, "moves": ["feintattack", "hex", "shadowball", "cottonguard"]},
		],
		encounters: [
			{"generation": 5, "level": 32, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	banettemega: {
		requiredItem: "Banettite",
		isNonstandard: "Past",
	},
	duskull: {
		eventPokemon: [
			{"generation": 3, "level": 45, "moves": ["pursuit", "curse", "willowisp", "meanlook"], "pokeball": "pokeball"},
			{"generation": 3, "level": 19, "moves": ["helpinghand", "shadowball", "astonish", "confuseray"]},
		],
		tier: "LC",
	},
	dusclops: {
		encounters: [
			{"generation": 4, "level": 16},
			{"generation": 6, "level": 30},
		],
		tier: "NFE",
		doublesTier: "DOU",
	},
	dusknoir: {
		randomBattleMoves: ["earthquake", "icepunch", "painsplit", "shadowsneak", "substitute", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	tropius: {
		eventPokemon: [
			{"generation": 4, "level": 53, "gender": "F", "nature": "Jolly", "abilities": ["chlorophyll"], "moves": ["airslash", "synthesis", "sunnyday", "solarbeam"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	chingling: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	chimecho: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["wrap", "growl", "astonish"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	absol: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["pressure"], "moves": ["scratch", "leer", "wish"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["pressure"], "moves": ["scratch", "leer", "spite"], "pokeball": "pokeball"},
			{"generation": 3, "level": 35, "abilities": ["pressure"], "moves": ["razorwind", "bite", "swordsdance", "spite"], "pokeball": "pokeball"},
			{"generation": 3, "level": 70, "abilities": ["pressure"], "moves": ["doubleteam", "slash", "futuresight", "perishsong"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	absolmega: {
		requiredItem: "Absolite",
		isNonstandard: "Past",
	},
	snorunt: {
		eventPokemon: [
			{"generation": 3, "level": 20, "abilities": ["innerfocus"], "moves": ["sing", "waterpulse", "bite", "icywind"]},
		],
		tier: "LC",
	},
	glalie: {
		randomBattleMoves: ["disable", "earthquake", "freezedry", "protect", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	glaliemega: {
		requiredItem: "Glalitite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	froslass: {
		randomBattleMoves: ["destinybond", "icebeam", "shadowball", "spikes", "taunt", "thunderwave"],
		tier: "RU",
		doublesTier: "DUU",
	},
	spheal: {
		eventPokemon: [
			{"generation": 3, "level": 17, "abilities": ["thickfat"], "moves": ["charm", "aurorabeam", "watergun", "mudslap"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sealeo: {
		encounters: [
			{"generation": 4, "level": 25, "isHidden": false},
			{"generation": 6, "level": 28, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	walrein: {
		eventPokemon: [
			{"generation": 5, "level": 50, "isHidden": false, "abilities": ["thickfat"], "moves": ["icebeam", "brine", "hail", "sheercold"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 5, "level": 30, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	clamperl: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	huntail: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gorebyss: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	relicanth: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	luvdisc: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	bagon: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["rage", "bite", "wish"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["rage", "bite", "irondefense"], "pokeball": "pokeball"},
			{"generation": 5, "level": 1, "shiny": true, "isHidden": false, "moves": ["rage"], "pokeball": "pokeball"},
			{"generation": 6, "level": 1, "isHidden": false, "moves": ["rage", "thrash"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	shelgon: {
		encounters: [
			{"generation": 7, "level": 15},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	salamence: {
		eventPokemon: [
			{"generation": 3, "level": 50, "moves": ["protect", "dragonbreath", "scaryface", "fly"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["refresh", "dragonclaw", "dragondance", "aerialace"]},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Naughty", "moves": ["hydropump", "stoneedge", "fireblast", "dragonclaw"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["dragondance", "dragonclaw", "outrage", "aerialace"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 7, "level": 9},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	salamencemega: {
		requiredItem: "Salamencite",
		isNonstandard: "Past",
	},
	beldum: {
		eventPokemon: [
			{"generation": 6, "level": 5, "shiny": true, "isHidden": false, "moves": ["holdback", "ironhead", "zenheadbutt", "irondefense"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	metang: {
		eventPokemon: [
			{"generation": 3, "level": 30, "moves": ["takedown", "confusion", "metalclaw", "refresh"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	metagross: {
		eventPokemon: [
			{"generation": 4, "level": 62, "nature": "Brave", "moves": ["bulletpunch", "meteormash", "hammerarm", "zenheadbutt"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["meteormash", "earthquake", "bulletpunch", "hammerarm"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "isHidden": false, "moves": ["bulletpunch", "zenheadbutt", "hammerarm", "icepunch"], "pokeball": "cherishball"},
			{"generation": 5, "level": 45, "shiny": true, "isHidden": false, "moves": ["meteormash", "zenheadbutt", "earthquake", "protect"], "pokeball": "pokeball"},
			{"generation": 5, "level": 45, "isHidden": true, "moves": ["irondefense", "agility", "hammerarm", "doubleedge"]},
			{"generation": 5, "level": 45, "isHidden": true, "moves": ["psychic", "meteormash", "hammerarm", "doubleedge"]},
			{"generation": 5, "level": 58, "nature": "Serious", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": false, "moves": ["earthquake", "hyperbeam", "psychic", "meteormash"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "nature": "Jolly", "ivs": {"hp": 31, "atk": 31, "def": 31, "spa": 31, "spd": 31, "spe": 31}, "isHidden": false, "moves": ["ironhead", "icepunch", "bulletpunch", "stompingtantrum"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	metagrossmega: {
		requiredItem: "Metagrossite",
		isNonstandard: "Past",
	},
	regirock: {
		eventPokemon: [
			{"generation": 3, "level": 40, "shiny": 1, "moves": ["rockthrow", "curse", "superpower", "ancientpower"]},
			{"generation": 3, "level": 40, "moves": ["curse", "superpower", "ancientpower", "hyperbeam"], "pokeball": "pokeball"},
			{"generation": 4, "level": 30, "shiny": 1, "moves": ["stomp", "rockthrow", "curse", "superpower"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["irondefense", "chargebeam", "lockon", "zapcannon"]},
			{"generation": 6, "level": 40, "shiny": 1, "isHidden": false, "moves": ["bulldoze", "curse", "ancientpower", "irondefense"]},
			{"generation": 6, "level": 50, "isHidden": true, "moves": ["explosion", "icepunch", "stoneedge", "hammerarm"], "pokeball": "pokeball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["stoneedge", "hammerarm", "lockon", "zapcannon"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	regice: {
		eventPokemon: [
			{"generation": 3, "level": 40, "shiny": 1, "moves": ["icywind", "curse", "superpower", "ancientpower"]},
			{"generation": 3, "level": 40, "moves": ["curse", "superpower", "ancientpower", "hyperbeam"], "pokeball": "pokeball"},
			{"generation": 4, "level": 30, "shiny": 1, "moves": ["stomp", "icywind", "curse", "superpower"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["amnesia", "chargebeam", "lockon", "zapcannon"]},
			{"generation": 6, "level": 40, "shiny": 1, "isHidden": false, "moves": ["bulldoze", "curse", "ancientpower", "amnesia"]},
			{"generation": 6, "level": 50, "isHidden": true, "moves": ["thunderbolt", "amnesia", "icebeam", "hail"], "pokeball": "pokeball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["icebeam", "hammerarm", "lockon", "zapcannon"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	registeel: {
		eventPokemon: [
			{"generation": 3, "level": 40, "shiny": 1, "moves": ["metalclaw", "curse", "superpower", "ancientpower"]},
			{"generation": 3, "level": 40, "moves": ["curse", "superpower", "ancientpower", "hyperbeam"], "pokeball": "pokeball"},
			{"generation": 4, "level": 30, "shiny": 1, "moves": ["stomp", "metalclaw", "curse", "superpower"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["amnesia", "chargebeam", "lockon", "zapcannon"]},
			{"generation": 6, "level": 40, "shiny": 1, "isHidden": false, "moves": ["curse", "ancientpower", "irondefense", "amnesia"]},
			{"generation": 6, "level": 50, "isHidden": true, "moves": ["ironhead", "rockslide", "gravity", "irondefense"], "pokeball": "pokeball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["flashcannon", "hammerarm", "lockon", "zapcannon"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	latias: {
		eventPokemon: [
			{"generation": 3, "level": 40, "shiny": 1, "moves": ["watersport", "refresh", "mistball", "psychic"]},
			{"generation": 3, "level": 50, "shiny": 1, "moves": ["mistball", "psychic", "recover", "charm"]},
			{"generation": 3, "level": 70, "moves": ["mistball", "psychic", "recover", "charm"], "pokeball": "pokeball"},
			{"generation": 4, "level": 35, "shiny": 1, "moves": ["dragonbreath", "watersport", "refresh", "mistball"]},
			{"generation": 4, "level": 40, "shiny": 1, "moves": ["watersport", "refresh", "mistball", "zenheadbutt"]},
			{"generation": 5, "level": 68, "shiny": 1, "moves": ["psychoshift", "charm", "psychic", "healpulse"]},
			{"generation": 6, "level": 30, "shiny": 1, "moves": ["healpulse", "dragonbreath", "mistball", "psychoshift"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["mistball", "dragonpulse", "psychoshift", "wish"]},
			{"generation": 7, "level": 60, "moves": ["mistball", "dragonpulse", "psychoshift", "wish"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["mistball", "psychic", "dracometeor", "tailwind"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	latiasmega: {
		requiredItem: "Latiasite",
		isNonstandard: "Past",
	},
	latios: {
		eventPokemon: [
			{"generation": 3, "level": 40, "shiny": 1, "moves": ["protect", "refresh", "lusterpurge", "psychic"]},
			{"generation": 3, "level": 50, "shiny": 1, "moves": ["lusterpurge", "psychic", "recover", "dragondance"]},
			{"generation": 3, "level": 70, "moves": ["lusterpurge", "psychic", "recover", "dragondance"], "pokeball": "pokeball"},
			{"generation": 4, "level": 35, "shiny": 1, "moves": ["dragonbreath", "protect", "refresh", "lusterpurge"]},
			{"generation": 4, "level": 40, "shiny": 1, "moves": ["protect", "refresh", "lusterpurge", "zenheadbutt"]},
			{"generation": 5, "level": 68, "shiny": 1, "moves": ["psychoshift", "dragondance", "psychic", "healpulse"]},
			{"generation": 6, "level": 30, "shiny": 1, "moves": ["healpulse", "dragonbreath", "lusterpurge", "psychoshift"]},
			{"generation": 6, "level": 50, "nature": "Modest", "moves": ["dragonpulse", "lusterpurge", "psychic", "healpulse"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["lusterpurge", "dragonpulse", "psychoshift", "dragonbreath"]},
			{"generation": 7, "level": 60, "moves": ["lusterpurge", "dragonpulse", "psychoshift", "dragonbreath"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["lusterpurge", "psychic", "dracometeor", "tailwind"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	latiosmega: {
		requiredItem: "Latiosite",
		isNonstandard: "Past",
	},
	kyogre: {
		eventPokemon: [
			{"generation": 3, "level": 45, "shiny": 1, "moves": ["bodyslam", "calmmind", "icebeam", "hydropump"]},
			{"generation": 3, "level": 70, "shiny": 1, "moves": ["hydropump", "rest", "sheercold", "doubleedge"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["aquaring", "icebeam", "ancientpower", "waterspout"]},
			{"generation": 5, "level": 80, "shiny": 1, "moves": ["icebeam", "ancientpower", "waterspout", "thunder"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "moves": ["waterspout", "thunder", "icebeam", "sheercold"], "pokeball": "cherishball"},
			{"generation": 6, "level": 45, "moves": ["bodyslam", "aquaring", "icebeam", "originpulse"]},
			{"generation": 6, "level": 100, "nature": "Timid", "moves": ["waterspout", "thunder", "sheercold", "icebeam"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["icebeam", "originpulse", "calmmind", "muddywater"]},
			{"generation": 7, "level": 60, "shiny": true, "moves": ["icebeam", "originpulse", "calmmind", "muddywater"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "moves": ["icebeam", "originpulse", "calmmind", "muddywater"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["originpulse", "icebeam", "waterspout", "calmmind"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kyogreprimal: {
		requiredItem: "Blue Orb",
		isNonstandard: "Past",
	},
	groudon: {
		eventPokemon: [
			{"generation": 3, "level": 45, "shiny": 1, "moves": ["slash", "bulkup", "earthquake", "fireblast"]},
			{"generation": 3, "level": 70, "shiny": 1, "moves": ["fireblast", "rest", "fissure", "solarbeam"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["rest", "earthquake", "ancientpower", "eruption"]},
			{"generation": 5, "level": 80, "shiny": 1, "moves": ["earthquake", "ancientpower", "eruption", "solarbeam"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "moves": ["eruption", "hammerarm", "earthpower", "solarbeam"], "pokeball": "cherishball"},
			{"generation": 6, "level": 45, "moves": ["lavaplume", "rest", "earthquake", "precipiceblades"]},
			{"generation": 6, "level": 100, "nature": "Adamant", "moves": ["firepunch", "solarbeam", "hammerarm", "rockslide"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["earthquake", "precipiceblades", "bulkup", "solarbeam"]},
			{"generation": 7, "level": 60, "shiny": true, "moves": ["earthquake", "precipiceblades", "bulkup", "solarbeam"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "moves": ["earthquake", "precipiceblades", "bulkup", "solarbeam"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["precipiceblades", "earthpower", "firepunch", "swordsdance"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	groudonprimal: {
		requiredItem: "Red Orb",
		isNonstandard: "Past",
	},
	rayquaza: {
		eventPokemon: [
			{"generation": 3, "level": 70, "shiny": 1, "moves": ["fly", "rest", "extremespeed", "outrage"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["rest", "airslash", "ancientpower", "outrage"]},
			{"generation": 5, "level": 70, "shiny": true, "moves": ["dragonpulse", "ancientpower", "outrage", "dragondance"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "moves": ["extremespeed", "hyperbeam", "dragonpulse", "vcreate"], "pokeball": "cherishball"},
			{"generation": 6, "level": 70, "moves": ["extremespeed", "dragonpulse", "dragondance", "dragonascent"]},
			{"generation": 6, "level": 70, "shiny": true, "moves": ["dragonpulse", "thunder", "twister", "extremespeed"], "pokeball": "cherishball"},
			{"generation": 6, "level": 70, "shiny": true, "moves": ["dragonascent", "dragonclaw", "extremespeed", "dragondance"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "shiny": true, "moves": ["dragonascent", "dracometeor", "fly", "celebrate"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["rest", "extremespeed", "dragonpulse", "dragondance"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rayquazamega: {
		requiredMove: "Dragon Ascent",
		isNonstandard: "Past",
	},
	jirachi: {
		randomBattleMoves: ["bodyslam", "firepunch", "ironhead", "stealthrock", "uturn", "wish"],
		eventPokemon: [
			{"generation": 3, "level": 5, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": true, "nature": "Bashful", "ivs": {"hp": 24, "atk": 3, "def": 30, "spa": 12, "spd": 16, "spe": 11}, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": true, "nature": "Careful", "ivs": {"hp": 10, "atk": 0, "def": 10, "spa": 10, "spd": 26, "spe": 12}, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": true, "nature": "Docile", "ivs": {"hp": 19, "atk": 7, "def": 10, "spa": 19, "spd": 10, "spe": 16}, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": true, "nature": "Hasty", "ivs": {"hp": 3, "atk": 12, "def": 12, "spa": 7, "spd": 11, "spe": 9}, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": true, "nature": "Jolly", "ivs": {"hp": 11, "atk": 8, "def": 6, "spa": 14, "spd": 5, "spe": 20}, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": true, "nature": "Lonely", "ivs": {"hp": 31, "atk": 23, "def": 26, "spa": 29, "spd": 18, "spe": 5}, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": true, "nature": "Naughty", "ivs": {"hp": 21, "atk": 31, "def": 31, "spa": 18, "spd": 24, "spe": 19}, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": true, "nature": "Serious", "ivs": {"hp": 29, "atk": 10, "def": 31, "spa": 25, "spd": 23, "spe": 21}, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": true, "nature": "Timid", "ivs": {"hp": 15, "atk": 28, "def": 29, "spa": 3, "spd": 0, "spe": 7}, "moves": ["wish", "confusion", "rest"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "moves": ["helpinghand", "psychic", "refresh", "rest"], "pokeball": "pokeball"},
			{"generation": 4, "level": 5, "moves": ["wish", "confusion", "rest"], "pokeball": "cherishball"},
			{"generation": 4, "level": 5, "moves": ["wish", "confusion", "rest", "dracometeor"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "moves": ["healingwish", "psychic", "swift", "meteormash"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "moves": ["dracometeor", "meteormash", "wish", "followme"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "moves": ["wish", "healingwish", "cosmicpower", "meteormash"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "moves": ["wish", "healingwish", "swift", "return"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "shiny": true, "moves": ["wish", "swift", "healingwish", "moonblast"], "pokeball": "cherishball"},
			{"generation": 6, "level": 15, "shiny": true, "moves": ["wish", "confusion", "helpinghand", "return"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["heartstamp", "playrough", "wish", "cosmicpower"], "pokeball": "cherishball"},
			{"generation": 6, "level": 25, "shiny": true, "moves": ["wish", "confusion", "swift", "happyhour"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["wish", "confusion", "rest"], "pokeball": "cherishball"},
			{"generation": 7, "level": 15, "moves": ["swift", "wish", "healingwish", "rest"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	deoxys: {
		eventPokemon: [
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["taunt", "pursuit", "psychic", "superpower"]},
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["knockoff", "spikes", "psychic", "snatch"]},
			{"generation": 3, "level": 30, "shiny": 1, "moves": ["knockoff", "pursuit", "psychic", "swift"]},
			{"generation": 3, "level": 70, "moves": ["cosmicpower", "recover", "psychoboost", "hyperbeam"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "moves": ["psychoboost", "zapcannon", "irondefense", "extremespeed"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "moves": ["psychoboost", "swift", "doubleteam", "extremespeed"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "moves": ["psychoboost", "detect", "counter", "mirrorcoat"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "moves": ["psychoboost", "meteormash", "superpower", "hyperbeam"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "moves": ["psychoboost", "leer", "wrap", "nightshade"], "pokeball": "pokeball"},
			{"generation": 5, "level": 100, "moves": ["nastyplot", "darkpulse", "recover", "psychoboost"], "pokeball": "duskball"},
			{"generation": 6, "level": 80, "moves": ["cosmicpower", "recover", "psychoboost", "hyperbeam"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	deoxysattack: {
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	deoxysdefense: {
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	deoxysspeed: {
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	turtwig: {
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tackle", "withdraw", "absorb"]},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tackle", "withdraw", "absorb", "stockpile"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	grotle: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	torterra: {
		eventPokemon: [
			{"generation": 5, "level": 100, "gender": "M", "isHidden": false, "moves": ["woodhammer", "earthquake", "outrage", "stoneedge"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	chimchar: {
		eventPokemon: [
			{"generation": 4, "level": 40, "gender": "M", "nature": "Mild", "moves": ["flamethrower", "thunderpunch", "grassknot", "helpinghand"], "pokeball": "cherishball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["scratch", "leer", "ember", "taunt"]},
			{"generation": 4, "level": 40, "gender": "M", "nature": "Hardy", "moves": ["flamethrower", "thunderpunch", "grassknot", "helpinghand"], "pokeball": "cherishball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["leer", "ember", "taunt", "fakeout"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	monferno: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	infernape: {
		eventPokemon: [
			{"generation": 5, "level": 100, "gender": "M", "isHidden": false, "moves": ["fireblast", "closecombat", "uturn", "grassknot"], "pokeball": "cherishball"},
			{"generation": 6, "level": 88, "isHidden": true, "moves": ["fireblast", "closecombat", "firepunch", "focuspunch"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	piplup: {
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["pound", "growl", "bubble"]},
			{"generation": 5, "level": 15, "shiny": 1, "isHidden": false, "moves": ["hydropump", "featherdance", "watersport", "peck"], "pokeball": "cherishball"},
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "moves": ["sing", "round", "featherdance", "peck"], "pokeball": "cherishball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["pound", "growl", "bubble", "featherdance"]},
			{"generation": 6, "level": 7, "isHidden": false, "moves": ["pound", "growl", "return"], "pokeball": "cherishball"},
			{"generation": 7, "level": 30, "gender": "M", "nature": "Hardy", "isHidden": false, "moves": ["hydropump", "bubblebeam", "whirlpool", "drillpeck"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	prinplup: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	empoleon: {
		eventPokemon: [
			{"generation": 5, "level": 100, "gender": "M", "isHidden": false, "moves": ["hydropump", "icebeam", "aquajet", "grassknot"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	starly: {
		eventPokemon: [
			{"generation": 4, "level": 1, "gender": "M", "nature": "Mild", "moves": ["tackle", "growl"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	staravia: {
		encounters: [
			{"generation": 4, "level": 4},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	staraptor: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	bidoof: {
		eventPokemon: [
			{"generation": 4, "level": 1, "gender": "M", "nature": "Lonely", "abilities": ["simple"], "moves": ["tackle"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	bibarel: {
		encounters: [
			{"generation": 4, "level": 4},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kricketot: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kricketune: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	shinx: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	luxio: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	luxray: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cranidos: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "moves": ["pursuit", "takedown", "crunch", "headbutt"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rampardos: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	shieldon: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "moves": ["metalsound", "takedown", "bodyslam", "protect"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	bastiodon: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	burmy: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wormadam: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wormadamsandy: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wormadamtrash: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mothim: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	combee: {
		tier: "LC",
	},
	vespiquen: {
		randomBattleMoves: ["airslash", "bugbuzz", "powergem", "sludgebomb", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pachirisu: {
		eventPokemon: [
			{"generation": 6, "level": 50, "nature": "Impish", "ivs": {"hp": 31, "atk": 31, "def": 31, "spa": 14, "spd": 31, "spe": 31}, "isHidden": true, "moves": ["nuzzle", "superfang", "followme", "protect"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	buizel: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	floatzel: {
		encounters: [
			{"generation": 4, "level": 22},
			{"generation": 5, "level": 10, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cherubi: {
		tier: "LC Uber",
	},
	cherrim: {
		randomBattleMoves: ["dazzlinggleam", "energyball", "healingwish", "leechseed", "substitute"],
		tier: "NU",
		doublesTier: "DUU",
	},
	cherrimsunshine: {
		randomBattleMoves: ["playrough", "solarblade", "sunnyday", "weatherball"],
		requiredAbility: 'Flower Gift',
		battleOnly: true,
	},
	shellos: {
		tier: "LC",
	},
	gastrodon: {
		randomBattleMoves: ["clearsmog", "earthquake", "icebeam", "recover", "scald"],
		encounters: [
			{"generation": 4, "level": 20},
		],
		tier: "RU",
		doublesTier: "DOU",
	},
	drifloon: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	drifblim: {
		randomBattleMoves: ["acrobatics", "destinybond", "shadowball", "strengthsap", "substitute"],
		encounters: [
			{"generation": 7, "level": 11, "isHidden": false, "pokeball": "pokeball"},
		],
		unreleasedHidden: "Past",
		tier: "RU",
		doublesTier: "DUU",
	},
	buneary: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lopunny: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lopunnymega: {
		requiredItem: "Lopunnite",
		isNonstandard: "Past",
	},
	glameow: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	purugly: {
		encounters: [
			{"generation": 6, "level": 32, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	stunky: {
		tier: "LC",
	},
	skuntank: {
		randomBattleMoves: ["crunch", "fireblast", "poisonjab", "suckerpunch", "taunt", "toxic"],
		encounters: [
			{"generation": 4, "level": 29},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	bronzor: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	bronzong: {
		randomBattleMoves: ["earthquake", "gyroball", "lightscreen", "psychic", "reflect", "stealthrock"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		unreleasedHidden: "Past",
		tier: "UU",
		doublesTier: "DUU",
	},
	chatot: {
		eventPokemon: [
			{"generation": 4, "level": 25, "gender": "M", "nature": "Jolly", "abilities": ["keeneye"], "moves": ["mirrormove", "furyattack", "chatter", "taunt"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	spiritomb: {
		eventPokemon: [
			{"generation": 5, "level": 61, "gender": "F", "nature": "Quiet", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": false, "moves": ["darkpulse", "psychic", "silverwind", "embargo"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gible: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gabite: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	garchomp: {
		eventPokemon: [
			{"generation": 5, "level": 100, "gender": "M", "isHidden": false, "moves": ["outrage", "earthquake", "swordsdance", "stoneedge"], "pokeball": "cherishball"},
			{"generation": 5, "level": 48, "gender": "M", "isHidden": true, "moves": ["dragonclaw", "dig", "crunch", "outrage"]},
			{"generation": 6, "level": 48, "gender": "M", "isHidden": false, "moves": ["dracometeor", "dragonclaw", "dig", "crunch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "gender": "M", "isHidden": false, "moves": ["slash", "dragonclaw", "dig", "crunch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 66, "gender": "F", "perfectIVs": 3, "isHidden": false, "moves": ["dragonrush", "earthquake", "brickbreak", "gigaimpact"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	garchompmega: {
		requiredItem: "Garchompite",
		isNonstandard: "Past",
	},
	riolu: {
		eventPokemon: [
			{"generation": 4, "level": 30, "gender": "M", "nature": "Serious", "abilities": ["steadfast"], "moves": ["aurasphere", "shadowclaw", "bulletpunch", "drainpunch"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	lucario: {
		randomBattleMoves: ["closecombat", "extremespeed", "icepunch", "meteormash", "swordsdance"],
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "M", "nature": "Modest", "abilities": ["steadfast"], "moves": ["aurasphere", "darkpulse", "dragonpulse", "waterpulse"], "pokeball": "cherishball"},
			{"generation": 4, "level": 30, "gender": "M", "nature": "Adamant", "abilities": ["innerfocus"], "moves": ["forcepalm", "bonerush", "sunnyday", "blazekick"], "pokeball": "cherishball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["detect", "metalclaw", "counter", "bulletpunch"]},
			{"generation": 5, "level": 50, "gender": "M", "nature": "Naughty", "ivs": {"atk": 31}, "isHidden": true, "moves": ["bulletpunch", "closecombat", "stoneedge", "shadowclaw"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "nature": "Jolly", "isHidden": false, "abilities": ["innerfocus"], "moves": ["closecombat", "aurasphere", "flashcannon", "quickattack"], "pokeball": "cherishball"},
			{"generation": 7, "level": 40, "gender": "M", "nature": "Serious", "isHidden": false, "abilities": ["steadfast"], "moves": ["aurasphere", "highjumpkick", "dragonpulse", "extremespeed"], "pokeball": "pokeball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	lucariomega: {
		requiredItem: "Lucarionite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hippopotas: {
		tier: "LC",
	},
	hippowdon: {
		randomBattleMoves: ["earthquake", "slackoff", "stealthrock", "stoneedge", "whirlwind", "yawn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	skorupi: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	drapion: {
		randomBattleMoves: ["earthquake", "knockoff", "poisonjab", "swordsdance", "taunt", "toxicspikes"],
		encounters: [
			{"generation": 4, "level": 22, "pokeball": "safariball"},
			{"generation": 6, "level": 30},
		],
		unreleasedHidden: "Past",
		tier: "UU",
		doublesTier: "DUU",
	},
	croagunk: {
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["astonish", "mudslap", "poisonsting", "taunt"]},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["mudslap", "poisonsting", "taunt", "poisonjab"]},
		],
		unreleasedHidden: "Past",
		tier: "LC",
	},
	toxicroak: {
		randomBattleMoves: ["drainpunch", "gunkshot", "icepunch", "substitute", "suckerpunch", "swordsdance"],
		encounters: [
			{"generation": 4, "level": 22, "pokeball": "safariball"},
			{"generation": 6, "level": 30},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	carnivine: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	finneon: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lumineon: {
		encounters: [
			{"generation": 4, "level": 20},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	snover: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	abomasnow: {
		randomBattleMoves: ["auroraveil", "blizzard", "earthquake", "iceshard", "woodhammer"],
		encounters: [
			{"generation": 4, "level": 38},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	abomasnowmega: {
		requiredItem: "Abomasite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rotom: {
		randomBattleMoves: ["nastyplot", "shadowball", "thunderbolt", "voltswitch", "willowisp"],
		eventPokemon: [
			{"generation": 5, "level": 10, "nature": "Naughty", "moves": ["uproar", "astonish", "trick", "thundershock"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "nature": "Quirky", "moves": ["shockwave", "astonish", "trick", "thunderwave"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "moves": ["uproar", "confide", "disarmingvoice"], "pokeball": "cherishball"},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	rotomheat: {
		randomBattleMoves: ["overheat", "thunderbolt", "trick", "voltswitch", "willowisp"],
		tier: "OU",
		doublesTier: "DUU",
	},
	rotomwash: {
		randomBattleMoves: ["hydropump", "thunderbolt", "trick", "voltswitch", "willowisp"],
		tier: "OU",
		doublesTier: "DOU",
	},
	rotomfrost: {
		randomBattleMoves: ["blizzard", "thunderbolt", "trick", "voltswitch", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	rotomfan: {
		randomBattleMoves: ["airslash", "thunderbolt", "trick", "voltswitch", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	rotommow: {
		randomBattleMoves: ["leafstorm", "thunderbolt", "trick", "voltswitch", "willowisp"],
		tier: "OU",
		doublesTier: "DUU",
	},
	uxie: {
		eventPokemon: [
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["confusion", "yawn", "futuresight", "amnesia"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["swift", "yawn", "futuresight", "amnesia"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["futuresight", "amnesia", "extrasensory", "flail"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["yawn", "futuresight", "amnesia", "extrasensory"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["extrasensory", "yawn", "amnesia", "swift"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mesprit: {
		eventPokemon: [
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["confusion", "luckychant", "futuresight", "charm"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["swift", "luckychant", "futuresight", "charm"]},
			{"generation": 5, "level": 50, "shiny": 1, "moves": ["futuresight", "charm", "extrasensory", "copycat"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["luckychant", "futuresight", "charm", "extrasensory"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["extrasensory", "charm", "futuresight", "swift"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	azelf: {
		eventPokemon: [
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["confusion", "uproar", "futuresight", "nastyplot"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["swift", "uproar", "futuresight", "nastyplot"]},
			{"generation": 5, "level": 50, "shiny": 1, "moves": ["futuresight", "nastyplot", "extrasensory", "lastresort"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["uproar", "futuresight", "nastyplot", "extrasensory"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["extrasensory", "nastyplot", "uproar", "swift"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dialga: {
		eventPokemon: [
			{"generation": 4, "level": 47, "shiny": 1, "moves": ["metalclaw", "ancientpower", "dragonclaw", "roaroftime"]},
			{"generation": 4, "level": 70, "shiny": 1, "moves": ["roaroftime", "healblock", "earthpower", "slash"]},
			{"generation": 4, "level": 1, "shiny": 1, "moves": ["dragonbreath", "scaryface"]},
			{"generation": 5, "level": 5, "isHidden": true, "moves": ["dragonbreath", "scaryface"], "pokeball": "dreamball"},
			{"generation": 5, "level": 100, "shiny": true, "isHidden": false, "moves": ["dragonpulse", "dracometeor", "aurasphere", "roaroftime"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "isHidden": false, "moves": ["aurasphere", "irontail", "roaroftime", "flashcannon"]},
			{"generation": 6, "level": 100, "nature": "Modest", "isHidden": true, "moves": ["metalburst", "overheat", "roaroftime", "flashcannon"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["aurasphere", "irontail", "roaroftime", "flashcannon"]},
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["aurasphere", "irontail", "roaroftime", "flashcannon"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["roaroftime", "aurasphere", "dracometeor", "flashcannon"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "isHidden": false, "moves": ["flashcannon", "dracometeor", "roaroftime", "aurasphere"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	palkia: {
		eventPokemon: [
			{"generation": 4, "level": 47, "shiny": 1, "moves": ["waterpulse", "ancientpower", "dragonclaw", "spacialrend"]},
			{"generation": 4, "level": 70, "shiny": 1, "moves": ["spacialrend", "healblock", "earthpower", "slash"]},
			{"generation": 4, "level": 1, "shiny": 1, "moves": ["dragonbreath", "scaryface"]},
			{"generation": 5, "level": 5, "isHidden": true, "moves": ["dragonbreath", "scaryface"], "pokeball": "dreamball"},
			{"generation": 5, "level": 100, "shiny": true, "isHidden": false, "moves": ["hydropump", "dracometeor", "spacialrend", "aurasphere"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "isHidden": false, "moves": ["earthpower", "aurasphere", "spacialrend", "hydropump"]},
			{"generation": 6, "level": 100, "nature": "Timid", "isHidden": true, "moves": ["earthpower", "aurasphere", "spacialrend", "hydropump"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["aurasphere", "aquatail", "spacialrend", "hydropump"]},
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["aurasphere", "aquatail", "spacialrend", "hydropump"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["spacialrend", "aurasphere", "dracometeor", "hydropump"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "isHidden": false, "moves": ["hydropump", "dracometeor", "spacialrend", "aurasphere"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	heatran: {
		eventPokemon: [
			{"generation": 4, "level": 70, "shiny": 1, "moves": ["scaryface", "lavaplume", "firespin", "ironhead"]},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["metalsound", "crunch", "scaryface", "lavaplume"]},
			{"generation": 4, "level": 50, "nature": "Quiet", "moves": ["eruption", "magmastorm", "earthpower", "ancientpower"], "pokeball": "pokeball"},
			{"generation": 5, "level": 68, "shiny": 1, "isHidden": false, "moves": ["scaryface", "lavaplume", "firespin", "ironhead"]},
			{"generation": 6, "level": 50, "shiny": 1, "isHidden": false, "moves": ["metalsound", "crunch", "scaryface", "lavaplume"]},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["crunch", "scaryface", "lavaplume", "firespin"]},
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["crunch", "scaryface", "lavaplume", "firespin"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["magmastorm", "heatwave", "earthpower", "flashcannon"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	regigigas: {
		eventPokemon: [
			{"generation": 4, "level": 70, "shiny": 1, "moves": ["confuseray", "stomp", "superpower", "zenheadbutt"]},
			{"generation": 4, "level": 1, "shiny": 1, "moves": ["dizzypunch", "knockoff", "foresight", "confuseray"]},
			{"generation": 4, "level": 100, "moves": ["ironhead", "rockslide", "icywind", "crushgrip"], "pokeball": "cherishball"},
			{"generation": 5, "level": 68, "shiny": 1, "moves": ["revenge", "wideguard", "zenheadbutt", "payback"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["foresight", "revenge", "wideguard", "zenheadbutt"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["zenheadbutt", "revenge", "dizzypunch", "confuseray"]},
			{"generation": 7, "level": 60, "moves": ["zenheadbutt", "revenge", "dizzypunch", "confuseray"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["crushgrip", "drainpunch", "zenheadbutt", "heavyslam"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	giratina: {
		eventPokemon: [
			{"generation": 4, "level": 70, "shiny": 1, "moves": ["shadowforce", "healblock", "earthpower", "slash"]},
			{"generation": 4, "level": 47, "shiny": 1, "moves": ["ominouswind", "ancientpower", "dragonclaw", "shadowforce"]},
			{"generation": 4, "level": 1, "shiny": 1, "moves": ["dragonbreath", "scaryface"]},
			{"generation": 5, "level": 5, "isHidden": true, "moves": ["dragonbreath", "scaryface"], "pokeball": "dreamball"},
			{"generation": 5, "level": 100, "shiny": true, "isHidden": false, "moves": ["dragonpulse", "dragonclaw", "aurasphere", "shadowforce"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "isHidden": false, "moves": ["aurasphere", "shadowclaw", "shadowforce", "hex"]},
			{"generation": 6, "level": 100, "nature": "Brave", "isHidden": true, "moves": ["aurasphere", "dracometeor", "shadowforce", "ironhead"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["shadowforce", "aurasphere", "earthpower", "dragonclaw"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	giratinaorigin: {
		eventOnly: true,
		requiredItem: "Griseous Orb",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cresselia: {
		eventPokemon: [
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["mist", "aurorabeam", "futuresight", "slash"]},
			{"generation": 5, "level": 68, "shiny": 1, "moves": ["futuresight", "slash", "moonlight", "psychocut"]},
			{"generation": 5, "level": 68, "nature": "Modest", "moves": ["icebeam", "psyshock", "energyball", "hiddenpower"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["mist", "aurorabeam", "futuresight", "slash"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["aurorabeam", "futuresight", "slash", "moonlight"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	phione: {
		eventPokemon: [
			{"generation": 4, "level": 50, "moves": ["grassknot", "raindance", "rest", "surf"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	manaphy: {
		eventPokemon: [
			{"generation": 4, "level": 5, "moves": ["tailglow", "bubble", "watersport"]},
			{"generation": 4, "level": 1, "shiny": 1, "moves": ["tailglow", "bubble", "watersport"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "moves": ["heartswap", "waterpulse", "whirlpool", "acidarmor"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "nature": "Impish", "moves": ["aquaring", "waterpulse", "watersport", "heartswap"], "pokeball": "cherishball"},
			{"generation": 6, "level": 1, "moves": ["tailglow", "bubble", "watersport", "heartswap"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["tailglow", "bubble", "watersport"], "pokeball": "cherishball"},
			{"generation": 7, "level": 15, "moves": ["tailglow", "waterpulse", "aquaring", "heartswap"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	darkrai: {
		eventPokemon: [
			{"generation": 4, "level": 40, "shiny": 1, "moves": ["quickattack", "hypnosis", "pursuit", "nightmare"]},
			{"generation": 4, "level": 50, "moves": ["roaroftime", "spacialrend", "nightmare", "hypnosis"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "moves": ["darkvoid", "darkpulse", "shadowball", "doubleteam"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "shiny": 1, "moves": ["hypnosis", "feintattack", "nightmare", "doubleteam"]},
			{"generation": 5, "level": 50, "moves": ["darkvoid", "ominouswind", "feintattack", "nightmare"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "moves": ["darkvoid", "darkpulse", "phantomforce", "dreameater"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["darkvoid", "ominouswind", "nightmare", "feintattack"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "moves": ["darkvoid", "feintattack", "nightmare", "ominouswind"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	shaymin: {
		eventPokemon: [
			{"generation": 4, "level": 50, "moves": ["seedflare", "aromatherapy", "substitute", "energyball"], "pokeball": "cherishball"},
			{"generation": 4, "level": 30, "shiny": 1, "moves": ["growth", "magicalleaf", "leechseed", "synthesis"], "pokeball": "pokeball"},
			{"generation": 5, "level": 50, "moves": ["seedflare", "leechseed", "synthesis", "sweetscent"], "pokeball": "cherishball"},
			{"generation": 6, "level": 15, "moves": ["growth", "magicalleaf", "seedflare", "airslash"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["seedflare", "aromatherapy", "substitute", "energyball"], "pokeball": "cherishball"},
			{"generation": 7, "level": 20, "moves": ["return", "growth", "seedflare", "celebrate"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	shayminsky: {
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	arceus: {
		eventPokemon: [
			{"generation": 4, "level": 100, "moves": ["judgment", "roaroftime", "spacialrend", "shadowforce"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "moves": ["recover", "hyperbeam", "perishsong", "judgment"]},
			{"generation": 6, "level": 100, "shiny": 1, "moves": ["judgment", "blastburn", "hydrocannon", "earthpower"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["judgment", "perishsong", "hyperbeam", "recover"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["judgment", "extremespeed", "recover", "hyperbeam"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	arceusbug: {
		eventOnly: true,
		requiredItems: ["Insect Plate", "Buginium Z"],
		isNonstandard: "Past",
	},
	arceusdark: {
		eventOnly: true,
		requiredItems: ["Dread Plate", "Darkinium Z"],
		isNonstandard: "Past",
	},
	arceusdragon: {
		eventOnly: true,
		requiredItems: ["Draco Plate", "Dragonium Z"],
		isNonstandard: "Past",
	},
	arceuselectric: {
		eventOnly: true,
		requiredItems: ["Zap Plate", "Electrium Z"],
		isNonstandard: "Past",
	},
	arceusfairy: {
		eventOnly: true,
		requiredItems: ["Pixie Plate", "Fairium Z"],
		isNonstandard: "Past",
	},
	arceusfighting: {
		eventOnly: true,
		requiredItems: ["Fist Plate", "Fightinium Z"],
		isNonstandard: "Past",
	},
	arceusfire: {
		eventOnly: true,
		requiredItems: ["Flame Plate", "Firium Z"],
		isNonstandard: "Past",
	},
	arceusflying: {
		eventOnly: true,
		requiredItems: ["Sky Plate", "Flyinium Z"],
		isNonstandard: "Past",
	},
	arceusghost: {
		eventOnly: true,
		requiredItems: ["Spooky Plate", "Ghostium Z"],
		isNonstandard: "Past",
	},
	arceusgrass: {
		eventOnly: true,
		requiredItems: ["Meadow Plate", "Grassium Z"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	arceusground: {
		eventOnly: true,
		requiredItems: ["Earth Plate", "Groundium Z"],
		isNonstandard: "Past",
	},
	arceusice: {
		eventOnly: true,
		requiredItems: ["Icicle Plate", "Icium Z"],
		isNonstandard: "Past",
	},
	arceuspoison: {
		eventOnly: true,
		requiredItems: ["Toxic Plate", "Poisonium Z"],
		isNonstandard: "Past",
	},
	arceuspsychic: {
		eventOnly: true,
		requiredItems: ["Mind Plate", "Psychium Z"],
		isNonstandard: "Past",
	},
	arceusrock: {
		eventOnly: true,
		requiredItems: ["Stone Plate", "Rockium Z"],
		isNonstandard: "Past",
	},
	arceussteel: {
		eventOnly: true,
		requiredItems: ["Iron Plate", "Steelium Z"],
		isNonstandard: "Past",
	},
	arceuswater: {
		eventOnly: true,
		requiredItems: ["Splash Plate", "Waterium Z"],
		isNonstandard: "Past",
	},
	victini: {
		eventPokemon: [
			{"generation": 5, "level": 15, "moves": ["quickattack", "incinerate", "confusion", "endure"]},
			{"generation": 5, "level": 50, "moves": ["vcreate", "fusionflare", "fusionbolt", "searingshot"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "moves": ["vcreate", "blueflare", "boltstrike", "glaciate"], "pokeball": "cherishball"},
			{"generation": 6, "level": 15, "moves": ["confusion", "quickattack", "vcreate", "searingshot"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["incinerate", "quickattack", "endure", "confusion"], "pokeball": "cherishball"},
			{"generation": 6, "level": 15, "moves": ["quickattack", "swagger", "vcreate"], "pokeball": "cherishball"},
			{"generation": 7, "level": 15, "moves": ["vcreate", "reversal", "storedpower", "celebrate"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	snivy: {
		eventPokemon: [
			{"generation": 5, "level": 5, "gender": "M", "nature": "Hardy", "isHidden": false, "moves": ["growth", "synthesis", "energyball", "aromatherapy"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	servine: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	serperior: {
		eventPokemon: [
			{"generation": 5, "level": 100, "gender": "M", "isHidden": false, "moves": ["leafstorm", "substitute", "gigadrain", "leechseed"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "isHidden": true, "moves": ["leafstorm", "holdback", "wringout", "gigadrain"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tepig: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pignite: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	emboar: {
		eventPokemon: [
			{"generation": 5, "level": 100, "gender": "M", "isHidden": false, "moves": ["flareblitz", "hammerarm", "wildcharge", "headsmash"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "isHidden": true, "moves": ["flareblitz", "holdback", "headsmash", "takedown"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oshawott: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dewott: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	samurott: {
		eventPokemon: [
			{"generation": 5, "level": 100, "gender": "M", "isHidden": false, "moves": ["hydropump", "icebeam", "megahorn", "superpower"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "isHidden": true, "moves": ["razorshell", "holdback", "confide", "hydropump"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	patrat: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	watchog: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lillipup: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	herdier: {
		encounters: [
			{"generation": 5, "level": 20, "isHidden": true},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	stoutland: {
		encounters: [
			{"generation": 5, "level": 23, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	purrloin: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	liepard: {
		randomBattleMoves: ["copycat", "darkpulse", "encore", "nastyplot", "playrough", "substitute", "thunderwave", "uturn"],
		eventPokemon: [
			{"generation": 5, "level": 20, "gender": "F", "nature": "Jolly", "isHidden": true, "moves": ["fakeout", "foulplay", "encore", "swagger"]},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	pansage: {
		eventPokemon: [
			{"generation": 5, "level": 1, "shiny": 1, "gender": "M", "nature": "Brave", "ivs": {"spa": 31}, "isHidden": false, "moves": ["bulletseed", "bite", "solarbeam", "dig"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["leer", "lick", "vinewhip", "leafstorm"]},
			{"generation": 5, "level": 30, "gender": "M", "nature": "Serious", "isHidden": false, "moves": ["seedbomb", "solarbeam", "rocktomb", "dig"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	simisage: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pansear: {
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["leer", "lick", "incinerate", "heatwave"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	simisear: {
		eventPokemon: [
			{"generation": 6, "level": 5, "perfectIVs": 2, "isHidden": false, "moves": ["workup", "honeclaws", "poweruppunch", "gigaimpact"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	panpour: {
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["leer", "lick", "watergun", "hydropump"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	simipour: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	munna: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	musharna: {
		randomBattleMoves: ["calmmind", "moonblast", "moonlight", "psychic", "shadowball", "thunderwave"],
		eventPokemon: [
			{"generation": 5, "level": 50, "isHidden": true, "moves": ["defensecurl", "luckychant", "psybeam", "hypnosis"]},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	pidove: {
		eventPokemon: [
			{"generation": 5, "level": 1, "shiny": 1, "gender": "F", "nature": "Hardy", "ivs": {"atk": 31}, "isHidden": false, "abilities": ["superluck"], "moves": ["gust", "quickattack", "aircutter"], "pokeball": "pokeball"},
		],
		unreleasedHidden: "Past",
		tier: "LC",
	},
	tranquill: {
		unreleasedHidden: "Past",
		tier: "NFE",
	},
	unfezant: {
		randomBattleMoves: ["bravebird", "defog", "nightslash", "roost", "uturn"],
		encounters: [
			{"generation": 5, "level": 22, "isHidden": false},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	blitzle: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zebstrika: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	roggenrola: {
		tier: "LC",
	},
	boldore: {
		encounters: [
			{"generation": 5, "level": 24, "isHidden": false},
		],
		tier: "NFE",
	},
	gigalith: {
		randomBattleMoves: ["earthquake", "explosion", "rockblast", "stealthrock", "stoneedge", "superpower"],
		tier: "RU",
		doublesTier: "DUU",
	},
	woobat: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	swoobat: {
		randomBattleMoves: ["airslash", "calmmind", "heatwave", "roost", "storedpower"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	drilbur: {
		tier: "LC",
	},
	excadrill: {
		randomBattleMoves: ["earthquake", "ironhead", "rapidspin", "rockslide", "swordsdance"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "OU",
		doublesTier: "DOU",
	},
	audino: {
		eventPokemon: [
			{"generation": 5, "level": 30, "gender": "F", "nature": "Calm", "isHidden": false, "abilities": ["healer"], "moves": ["healpulse", "helpinghand", "refresh", "doubleslap"], "pokeball": "cherishball"},
			{"generation": 5, "level": 30, "gender": "F", "nature": "Serious", "isHidden": false, "abilities": ["healer"], "moves": ["healpulse", "helpinghand", "refresh", "present"], "pokeball": "cherishball"},
			{"generation": 5, "level": 30, "gender": "F", "nature": "Jolly", "isHidden": false, "abilities": ["healer"], "moves": ["healpulse", "helpinghand", "refresh", "present"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "nature": "Relaxed", "isHidden": false, "abilities": ["regenerator"], "moves": ["trickroom", "healpulse", "simplebeam", "thunderbolt"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	audinomega: {
		requiredItem: "Audinite",
		isNonstandard: "Past",
	},
	timburr: {
		tier: "LC",
	},
	gurdurr: {
		tier: "RU",
	},
	conkeldurr: {
		randomBattleMoves: ["bulkup", "drainpunch", "earthquake", "facade", "icepunch", "machpunch"],
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
		randomBattleMoves: ["earthquake", "liquidation", "raindance", "sludgebomb", "stealthrock"],
		encounters: [
			{"generation": 5, "level": 15, "isHidden": false},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	throh: {
		randomBattleMoves: ["bulkup", "circlethrow", "icepunch", "payback", "rest", "sleeptalk", "stormthrow"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	sawk: {
		randomBattleMoves: ["bulkup", "closecombat", "poisonjab", "stoneedge", "throatchop"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	sewaddle: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swadloon: {
		encounters: [
			{"generation": 5, "level": 19, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	leavanny: {
		encounters: [
			{"generation": 5, "level": 20, "isHidden": true},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	venipede: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	whirlipede: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	scolipede: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cottonee: {
		tier: "LC",
	},
	whimsicott: {
		randomBattleMoves: ["encore", "energyball", "leechseed", "moonblast", "stunspore", "uturn"],
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "F", "nature": "Timid", "ivs": {"spe": 31}, "isHidden": false, "abilities": ["prankster"], "moves": ["swagger", "gigadrain", "beatup", "helpinghand"], "pokeball": "cherishball"},
		],
		tier: "RU",
		doublesTier: "DOU",
	},
	petilil: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lilligant: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	basculin: {
		randomBattleMoves: ["aquajet", "crunch", "headsmash", "liquidation", "psychicfangs"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	basculinbluestriped: {
		randomBattleMoves: ["aquajet", "crunch", "headsmash", "liquidation", "psychicfangs"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	sandile: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	krokorok: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	krookodile: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	darumaka: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	darumakagalar: {
		tier: "LC",
	},
	darmanitan: {
		randomBattleMoves: ["earthquake", "flareblitz", "rockslide", "superpower", "uturn"],
		eventPokemon: [
			{"generation": 5, "level": 35, "isHidden": true, "moves": ["thrash", "bellydrum", "flareblitz", "hammerarm"]},
			{"generation": 6, "level": 35, "gender": "M", "nature": "Calm", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": true, "moves": ["thrash", "bellydrum", "flareblitz", "hammerarm"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 32, "maxEggMoves": 1},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	darmanitanzen: {
		requiredAbility: "Zen Mode",
		battleOnly: true,
	},
	darmanitangalar: {
		randomBattleMoves: ["earthquake", "flareblitz", "iciclecrash", "superpower", "uturn"],
		tier: "Uber",
		doublesTier: "DOU",
	},
	darmanitangalarzen: {
		requiredAbility: "Zen Mode",
		battleOnly: true,
	},
	maractus: {
		randomBattleMoves: ["drainpunch", "energyball", "leechseed", "spikes", "spikyshield"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	dwebble: {
		tier: "LC",
	},
	crustle: {
		randomBattleMoves: ["earthquake", "shellsmash", "spikes", "stealthrock", "stoneedge", "xscissor"],
		encounters: [
			{"generation": 6, "level": 33, "maxEggMoves": 1},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	scraggy: {
		eventPokemon: [
			{"generation": 5, "level": 1, "gender": "M", "nature": "Adamant", "isHidden": false, "abilities": ["moxie"], "moves": ["headbutt", "leer", "highjumpkick", "lowkick"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	scrafty: {
		randomBattleMoves: ["closecombat", "crunch", "dragondance", "icepunch", "poisonjab"],
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "M", "nature": "Brave", "isHidden": false, "abilities": ["moxie"], "moves": ["firepunch", "payback", "drainpunch", "substitute"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	sigilyph: {
		randomBattleMoves: ["airslash", "energyball", "heatwave", "icebeam", "psychic"],
		tier: "RU",
		doublesTier: "DUU",
	},
	yamask: {
		tier: "LC",
	},
	yamaskgalar: {
		tier: "LC",
	},
	cofagrigus: {
		randomBattleMoves: ["bodypress", "memento", "shadowball", "toxicspikes", "willowisp"],
		eventPokemon: [
			{"generation": 7, "level": 66, "gender": "M", "moves": ["willowisp", "shadowball", "powersplit", "darkpulse"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 32, "maxEggMoves": 1},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	runerigus: {
		randomBattleMoves: ["bodypress", "earthquake", "haze", "stealthrock", "toxicspikes", "willowisp"],
		tier: "RU",
		doublesTier: "DUU",
	},
	tirtouga: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "abilities": ["sturdy"], "moves": ["bite", "protect", "aquajet", "bodyslam"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	carracosta: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	archen: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "moves": ["headsmash", "wingattack", "doubleteam", "scaryface"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	archeops: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	trubbish: {
		tier: "LC",
	},
	garbodor: {
		encounters: [
			{"generation": 5, "level": 31, "isHidden": false},
			{"generation": 6, "level": 30},
			{"generation": 7, "level": 24},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	garbodorgmax: {
		randomBattleMoves: ["drainpunch", "explosion", "gunkshot", "painsplit", "spikes", "toxicspikes"],
		isGigantamax: "G-Max Malodor",
		tier: "Uber",
		doublesTier: "DUU",
	},
	zorua: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zoroark: {
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "M", "nature": "Quirky", "moves": ["agility", "embargo", "punishment", "snarl"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "moves": ["sludgebomb", "darkpulse", "flamethrower", "suckerpunch"], "pokeball": "ultraball"},
			{"generation": 6, "level": 45, "gender": "M", "nature": "Naughty", "moves": ["scaryface", "furyswipes", "nastyplot", "punishment"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 5, "level": 25, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	minccino: {
		tier: "LC",
	},
	cinccino: {
		randomBattleMoves: ["bulletseed", "knockoff", "rockblast", "tailslap", "uturn"],
		tier: "RU",
		doublesTier: "DUU",
	},
	gothita: {
		tier: "LC Uber",
	},
	gothorita: {
		eventPokemon: [
			{"generation": 5, "level": 32, "gender": "M", "isHidden": true, "moves": ["psyshock", "flatter", "futuresight", "mirrorcoat"]},
			{"generation": 5, "level": 32, "gender": "M", "isHidden": true, "moves": ["psyshock", "flatter", "futuresight", "imprison"]},
		],
		encounters: [
			{"generation": 5, "level": 31, "isHidden": false},
		],
		tier: "NFE",
	},
	gothitelle: {
		randomBattleMoves: ["charm", "psychic", "rest", "taunt"],
		encounters: [
			{"generation": 5, "level": 34, "isHidden": false},
		],
		tier: "NU",
		doublesTier: "DOU",
	},
	solosis: {
		tier: "LC",
	},
	duosion: {
		encounters: [
			{"generation": 5, "level": 31, "isHidden": false},
		],
		tier: "NFE",
	},
	reuniclus: {
		randomBattleMoves: ["calmmind", "focusblast", "psychic", "recover", "shadowball", "trickroom"],
		encounters: [
			{"generation": 5, "level": 34, "isHidden": false},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	ducklett: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swanna: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	vanillite: {
		tier: "LC",
	},
	vanillish: {
		tier: "NFE",
	},
	vanilluxe: {
		randomBattleMoves: ["auroraveil", "blizzard", "explosion", "flashcannon", "freezedry"],
		tier: "RU",
		doublesTier: "DUU",
	},
	deerling: {
		eventPokemon: [
			{"generation": 5, "level": 30, "gender": "F", "isHidden": true, "moves": ["feintattack", "takedown", "jumpkick", "aromatherapy"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sawsbuck: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	emolga: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	karrablast: {
		eventPokemon: [
			{"generation": 5, "level": 30, "isHidden": false, "moves": ["furyattack", "headbutt", "falseswipe", "bugbuzz"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "isHidden": false, "moves": ["megahorn", "takedown", "xscissor", "flail"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	escavalier: {
		randomBattleMoves: ["closecombat", "drillrun", "ironhead", "knockoff", "megahorn", "swordsdance"],
		tier: "RU",
		doublesTier: "DUU",
	},
	foongus: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	amoonguss: {
		encounters: [
			{"generation": 5, "level": 37, "isHidden": false},
			{"generation": 5, "level": 35, "isHidden": true},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	frillish: {
		tier: "LC",
	},
	jellicent: {
		randomBattleMoves: ["icebeam", "recover", "scald", "shadowball", "willowisp"],
		eventPokemon: [
			{"generation": 5, "level": 40, "isHidden": true, "moves": ["waterpulse", "ominouswind", "brine", "raindance"]},
		],
		encounters: [
			{"generation": 5, "level": 5, "isHidden": false},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	alomomola: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	joltik: {
		tier: "LC",
	},
	galvantula: {
		randomBattleMoves: ["bugbuzz", "gigadrain", "stickyweb", "thunder", "voltswitch"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	ferroseed: {
		tier: "LC",
	},
	ferrothorn: {
		randomBattleMoves: ["leechseed", "gyroball", "powerwhip", "protect", "spikes", "stealthrock"],
		tier: "OU",
		doublesTier: "DOU",
	},
	klink: {
		tier: "LC",
	},
	klang: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "NFE",
	},
	klinklang: {
		randomBattleMoves: ["geargrind", "shiftgear", "substitute", "wildcharge"],
		tier: "NU",
		doublesTier: "DUU",
	},
	tynamo: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	eelektrik: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	eelektross: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	elgyem: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	beheeyem: {
		randomBattleMoves: ["nastyplot", "psychic", "shadowball", "thunderbolt", "trick", "trickroom"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	litwick: {
		tier: "LC",
	},
	lampent: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "NFE",
	},
	chandelure: {
		randomBattleMoves: ["calmmind", "energyball", "fireblast", "shadowball", "substitute", "trick"],
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "F", "nature": "Modest", "ivs": {"spa": 31}, "isHidden": false, "abilities": ["flashfire"], "moves": ["heatwave", "shadowball", "energyball", "psychic"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	axew: {
		eventPokemon: [
			{"generation": 5, "level": 1, "shiny": 1, "gender": "M", "nature": "Naive", "ivs": {"spe": 31}, "isHidden": false, "abilities": ["moldbreaker"], "moves": ["scratch", "dragonrage"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "F", "isHidden": false, "abilities": ["moldbreaker"], "moves": ["dragonrage", "return", "endure", "dragonclaw"], "pokeball": "cherishball"},
			{"generation": 5, "level": 30, "gender": "M", "nature": "Naive", "isHidden": false, "abilities": ["rivalry"], "moves": ["dragonrage", "scratch", "outrage", "gigaimpact"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	fraxure: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "NFE",
	},
	haxorus: {
		randomBattleMoves: ["closecombat", "dragondance", "earthquake", "outrage", "poisonjab", "taunt"],
		eventPokemon: [
			{"generation": 5, "level": 59, "gender": "F", "nature": "Naive", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": false, "abilities": ["moldbreaker"], "moves": ["earthquake", "dualchop", "xscissor", "dragondance"], "pokeball": "cherishball"},
		],
		tier: "UU",
		doublesTier: "DUU",
	},
	cubchoo: {
		eventPokemon: [
			{"generation": 5, "level": 15, "isHidden": false, "moves": ["powdersnow", "growl", "bide", "icywind"], "pokeball": "cherishball"},
		],
		unreleasedHidden: "Past",
		tier: "LC",
	},
	beartic: {
		randomBattleMoves: ["iciclecrash", "liquidation", "raindance", "superpower", "throatchop"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	cryogonal: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	shelmet: {
		eventPokemon: [
			{"generation": 5, "level": 30, "isHidden": false, "moves": ["strugglebug", "megadrain", "yawn", "protect"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "isHidden": false, "moves": ["encore", "gigadrain", "bodyslam", "bugbuzz"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	accelgor: {
		randomBattleMoves: ["bugbuzz", "encore", "energyball", "focusblast", "spikes", "toxic"],
		tier: "RU",
		doublesTier: "DUU",
	},
	stunfisk: {
		randomBattleMoves: ["discharge", "earthpower", "foulplay", "scald", "stealthrock"],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	stunfiskgalar: {
		randomBattleMoves: ["curse", "earthquake", "painsplit", "rockslide", "stealthrock"],
		tier: "NU",
		doublesTier: "DUU",
	},
	mienfoo: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mienshao: {
		eventPokemon: [
			{"generation": 7, "level": 65, "gender": "M", "isHidden": false, "abilities": ["innerfocus"], "moves": ["fakeout", "dualchop", "highjumpkick", "uturn"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	druddigon: {
		eventPokemon: [
			{"generation": 5, "level": 1, "shiny": true, "isHidden": false, "moves": ["leer", "scratch"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	golett: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	golurk: {
		randomBattleMoves: ["drainpunch", "earthquake", "icepunch", "shadowpunch", "substitute"],
		eventPokemon: [
			{"generation": 5, "level": 70, "shiny": true, "isHidden": false, "abilities": ["ironfist"], "moves": ["shadowpunch", "hyperbeam", "gyroball", "hammerarm"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 30},
		],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	pawniard: {
		tier: "LC",
	},
	bisharp: {
		randomBattleMoves: ["ironhead", "substitute", "suckerpunch", "swordsdance", "throatchop"],
		encounters: [
			{"generation": 7, "level": 33, "isHidden": false},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	bouffalant: {
		eventPokemon: [
			{"generation": 6, "level": 50, "nature": "Adamant", "ivs": {"hp": 31, "atk": 31}, "isHidden": true, "moves": ["headcharge", "facade", "earthquake", "rockslide"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rufflet: {
		tier: "LC",
	},
	braviary: {
		randomBattleMoves: ["bravebird", "bulkup", "closecombat", "crushclaw", "defog", "rockslide"],
		eventPokemon: [
			{"generation": 5, "level": 25, "gender": "M", "isHidden": true, "moves": ["wingattack", "honeclaws", "scaryface", "aerialace"]},
		],
		encounters: [
			{"generation": 6, "level": 45, "isHidden": false},
		],
		tier: "UU",
		doublesTier: "DOU",
	},
	vullaby: {
		tier: "LC",
	},
	mandibuzz: {
		randomBattleMoves: ["defog", "foulplay", "roost", "taunt", "toxic", "uturn"],
		eventPokemon: [
			{"generation": 5, "level": 25, "gender": "F", "isHidden": true, "moves": ["pluck", "nastyplot", "flatter", "feintattack"]},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	heatmor: {
		randomBattleMoves: ["firelash", "gigadrain", "substitute", "suckerpunch", "superpower"],
		tier: "NU",
		doublesTier: "DUU",
	},
	durant: {
		randomBattleMoves: ["firstimpression", "ironhead", "rockslide", "superpower"],
		tier: "UU",
		doublesTier: "DUU",
	},
	deino: {
		eventPokemon: [
			{"generation": 5, "level": 1, "shiny": true, "moves": ["tackle", "dragonrage"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	zweilous: {
		encounters: [
			{"generation": 5, "level": 49},
		],
		tier: "NFE",
	},
	hydreigon: {
		randomBattleMoves: ["darkpulse", "dracometeor", "fireblast", "flashcannon", "nastyplot", "uturn"],
		eventPokemon: [
			{"generation": 5, "level": 70, "shiny": true, "gender": "M", "moves": ["hypervoice", "dragonbreath", "flamethrower", "focusblast"], "pokeball": "cherishball"},
			{"generation": 6, "level": 52, "gender": "M", "perfectIVs": 2, "moves": ["dragonrush", "crunch", "rockslide", "frustration"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 59},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	larvesta: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	volcarona: {
		eventPokemon: [
			{"generation": 5, "level": 35, "isHidden": false, "moves": ["stringshot", "leechlife", "gust", "firespin"]},
			{"generation": 5, "level": 77, "gender": "M", "nature": "Calm", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": false, "moves": ["bugbuzz", "overheat", "hyperbeam", "quiverdance"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 7, "level": 41},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cobalion: {
		randomBattleMoves: ["closecombat", "ironhead", "stealthrock", "stoneedge", "swordsdance", "voltswitch"],
		eventPokemon: [
			{"generation": 5, "level": 42, "shiny": 1, "moves": ["helpinghand", "retaliate", "ironhead", "sacredsword"]},
			{"generation": 5, "level": 45, "shiny": 1, "moves": ["helpinghand", "retaliate", "ironhead", "sacredsword"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["sacredsword", "swordsdance", "quickguard", "workup"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["retaliate", "ironhead", "sacredsword", "swordsdance"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["sacredsword", "swordsdance", "quickattack", "ironhead"]},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	terrakion: {
		randomBattleMoves: ["closecombat", "earthquake", "quickattack", "stoneedge", "swordsdance"],
		eventPokemon: [
			{"generation": 5, "level": 42, "shiny": 1, "moves": ["helpinghand", "retaliate", "rockslide", "sacredsword"]},
			{"generation": 5, "level": 45, "shiny": 1, "moves": ["helpinghand", "retaliate", "rockslide", "sacredsword"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["sacredsword", "swordsdance", "quickguard", "workup"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["retaliate", "rockslide", "sacredsword", "swordsdance"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["sacredsword", "swordsdance", "rockslide", "stoneedge"]},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	virizion: {
		randomBattleMoves: ["closecombat", "leafblade", "stoneedge", "substitute", "swordsdance"],
		eventPokemon: [
			{"generation": 5, "level": 42, "shiny": 1, "moves": ["helpinghand", "retaliate", "gigadrain", "sacredsword"]},
			{"generation": 5, "level": 45, "shiny": 1, "moves": ["helpinghand", "retaliate", "gigadrain", "sacredsword"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["sacredsword", "swordsdance", "quickguard", "workup"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["retaliate", "gigadrain", "sacredsword", "swordsdance"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["sacredsword", "swordsdance", "gigadrain", "leafblade"]},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	tornadus: {
		eventPokemon: [
			{"generation": 5, "level": 40, "shiny": 1, "isHidden": false, "moves": ["revenge", "aircutter", "extrasensory", "agility"]},
			{"generation": 5, "level": 5, "isHidden": true, "moves": ["uproar", "astonish", "gust"], "pokeball": "dreamball"},
			{"generation": 5, "level": 70, "isHidden": false, "moves": ["hurricane", "hammerarm", "airslash", "hiddenpower"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "isHidden": false, "moves": ["extrasensory", "agility", "airslash", "crunch"]},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["airslash", "crunch", "tailwind", "raindance"]},
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["airslash", "crunch", "tailwind", "raindance"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["hurricane", "heatwave", "grassknot", "tailwind"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tornadustherian: {
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	thundurus: {
		eventPokemon: [
			{"generation": 5, "level": 40, "shiny": 1, "isHidden": false, "moves": ["revenge", "shockwave", "healblock", "agility"]},
			{"generation": 5, "level": 5, "isHidden": true, "moves": ["uproar", "astonish", "thundershock"], "pokeball": "dreamball"},
			{"generation": 5, "level": 70, "isHidden": false, "moves": ["thunder", "hammerarm", "focusblast", "wildcharge"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "isHidden": false, "moves": ["healblock", "agility", "discharge", "crunch"]},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["discharge", "crunch", "charge", "nastyplot"]},
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["discharge", "crunch", "charge", "nastyplot"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "isHidden": false, "moves": ["thunderbolt", "focusblast", "grassknot", "nastyplot"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	thundurustherian: {
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	reshiram: {
		randomBattleMoves: ["blueflare", "dracometeor", "earthpower", "stoneedge", "willowisp"],
		eventPokemon: [
			{"generation": 5, "level": 50, "moves": ["dragonbreath", "slash", "extrasensory", "fusionflare"]},
			{"generation": 5, "level": 70, "moves": ["extrasensory", "fusionflare", "dragonpulse", "imprison"]},
			{"generation": 5, "level": 100, "moves": ["blueflare", "fusionflare", "mist", "dracometeor"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["dragonbreath", "slash", "extrasensory", "fusionflare"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["slash", "extrasensory", "fusionflare", "dragonpulse"]},
			{"generation": 7, "level": 60, "moves": ["slash", "extrasensory", "fusionflare", "dragonpulse"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["fusionflare", "blueflare", "dracometeor", "earthpower"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	zekrom: {
		randomBattleMoves: ["boltstrike", "dragondance", "outrage", "substitute"],
		eventPokemon: [
			{"generation": 5, "level": 50, "moves": ["dragonbreath", "slash", "zenheadbutt", "fusionbolt"]},
			{"generation": 5, "level": 70, "moves": ["zenheadbutt", "fusionbolt", "dragonclaw", "imprison"]},
			{"generation": 5, "level": 100, "moves": ["boltstrike", "fusionbolt", "haze", "outrage"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["dragonbreath", "slash", "zenheadbutt", "fusionbolt"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["slash", "zenheadbutt", "fusionbolt", "dragonclaw"]},
			{"generation": 7, "level": 60, "moves": ["slash", "zenheadbutt", "fusionbolt", "dragonclaw"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["fusionbolt", "boltstrike", "outrage", "stoneedge"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	landorus: {
		eventPokemon: [
			{"generation": 5, "level": 70, "shiny": 1, "isHidden": false, "moves": ["rockslide", "earthquake", "sandstorm", "fissure"]},
			{"generation": 5, "level": 5, "isHidden": true, "moves": ["block", "mudshot", "rocktomb"], "pokeball": "dreamball"},
			{"generation": 6, "level": 65, "shiny": 1, "isHidden": false, "moves": ["extrasensory", "swordsdance", "earthpower", "rockslide"]},
			{"generation": 6, "level": 50, "nature": "Adamant", "ivs": {"hp": 31, "atk": 31, "def": 31, "spa": 1, "spd": 31, "spe": 24}, "isHidden": false, "moves": ["earthquake", "knockoff", "uturn", "rocktomb"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "isHidden": false, "moves": ["earthpower", "rockslide", "earthquake", "sandstorm"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	landorustherian: {
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kyurem: {
		randomBattleMoves: ["dracometeor", "earthpower", "focusblast", "freezedry", "icebeam", "outrage"],
		eventPokemon: [
			{"generation": 5, "level": 75, "shiny": 1, "moves": ["glaciate", "dragonpulse", "imprison", "endeavor"]},
			{"generation": 5, "level": 70, "shiny": 1, "moves": ["scaryface", "glaciate", "dragonpulse", "imprison"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["dragonbreath", "slash", "scaryface", "glaciate"]},
			{"generation": 6, "level": 100, "moves": ["glaciate", "scaryface", "dracometeor", "ironhead"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["slash", "scaryface", "glaciate", "dragonpulse"]},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	kyuremblack: {
		randomBattleMoves: ["dragondance", "fusionbolt", "iciclespear", "outrage"],
		eventPokemon: [
			{"generation": 5, "level": 75, "shiny": 1, "moves": ["freezeshock", "dragonpulse", "imprison", "endeavor"]},
			{"generation": 5, "level": 70, "shiny": 1, "moves": ["fusionbolt", "freezeshock", "dragonpulse", "imprison"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["dragonbreath", "slash", "fusionbolt", "freezeshock"]},
			{"generation": 6, "level": 100, "moves": ["freezeshock", "fusionbolt", "dracometeor", "ironhead"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["slash", "fusionbolt", "freezeshock", "dragonpulse"]},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	kyuremwhite: {
		randomBattleMoves: ["dracometeor", "earthpower", "freezedry", "fusionflare", "icebeam"],
		eventPokemon: [
			{"generation": 5, "level": 75, "shiny": 1, "moves": ["iceburn", "dragonpulse", "imprison", "endeavor"]},
			{"generation": 5, "level": 70, "shiny": 1, "moves": ["fusionflare", "iceburn", "dragonpulse", "imprison"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["dragonbreath", "slash", "fusionflare", "iceburn"]},
			{"generation": 6, "level": 100, "moves": ["iceburn", "fusionflare", "dracometeor", "ironhead"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["slash", "fusionflare", "iceburn", "dragonpulse"]},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	keldeo: {
		randomBattleMoves: ["airslash", "calmmind", "hydropump", "icywind", "scald", "secretsword", "substitute"],
		eventPokemon: [
			{"generation": 5, "level": 15, "moves": ["aquajet", "leer", "doublekick", "bubblebeam"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "moves": ["sacredsword", "hydropump", "aquajet", "swordsdance"], "pokeball": "cherishball"},
			{"generation": 6, "level": 15, "moves": ["aquajet", "leer", "doublekick", "hydropump"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["aquajet", "leer", "doublekick", "bubblebeam"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	keldeoresolute: {
		eventOnly: true,
		requiredMove: "Secret Sword",
		isUnreleased: "Past",
	},
	meloetta: {
		eventPokemon: [
			{"generation": 5, "level": 15, "moves": ["quickattack", "confusion", "round"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "moves": ["round", "teeterdance", "psychic", "closecombat"], "pokeball": "cherishball"},
			{"generation": 7, "level": 15, "moves": ["sing", "psychic", "closecombat"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "moves": ["sing", "celebrate", "round", "relicsong"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	meloettapirouette: {
		requiredMove: "Relic Song",
		battleOnly: true,
		isNonstandard: "Past",
	},
	genesect: {
		eventPokemon: [
			{"generation": 5, "level": 50, "moves": ["technoblast", "magnetbomb", "solarbeam", "signalbeam"], "pokeball": "cherishball"},
			{"generation": 5, "level": 15, "moves": ["technoblast", "magnetbomb", "solarbeam", "signalbeam"], "pokeball": "cherishball"},
			{"generation": 5, "level": 100, "shiny": true, "nature": "Hasty", "ivs": {"atk": 31, "spe": 31}, "moves": ["extremespeed", "technoblast", "blazekick", "shiftgear"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["technoblast", "magnetbomb", "solarbeam", "signalbeam"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	genesectburn: {
		eventOnly: true,
		requiredItem: "Burn Drive",
		isNonstandard: "Past",
	},
	genesectchill: {
		eventOnly: true,
		requiredItem: "Chill Drive",
		isNonstandard: "Past",
	},
	genesectdouse: {
		eventOnly: true,
		requiredItem: "Douse Drive",
		isNonstandard: "Past",
	},
	genesectshock: {
		eventOnly: true,
		requiredItem: "Shock Drive",
		isNonstandard: "Past",
	},
	chespin: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	quilladin: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	chesnaught: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	fennekin: {
		eventPokemon: [
			{"generation": 6, "level": 15, "gender": "F", "nature": "Hardy", "isHidden": false, "moves": ["scratch", "flamethrower", "hiddenpower"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	braixen: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	delphox: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	froakie: {
		eventPokemon: [
			{"generation": 6, "level": 7, "isHidden": false, "moves": ["pound", "growl", "bubble", "return"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	frogadier: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	greninja: {
		eventPokemon: [
			{"generation": 6, "level": 36, "ivs": {"spe": 31}, "isHidden": true, "moves": ["watershuriken", "shadowsneak", "hydropump", "substitute"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "isHidden": true, "moves": ["hydrocannon", "gunkshot", "matblock", "happyhour"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	greninjaash: {
		eventPokemon: [
			{"generation": 7, "level": 36, "ivs": {"hp": 20, "atk": 31, "def": 20, "spa": 31, "spd": 20, "spe": 31}, "moves": ["watershuriken", "aerialace", "doubleteam", "nightslash"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		requiredAbility: "Battle Bond",
		battleOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	bunnelby: {
		tier: "LC",
	},
	diggersby: {
		randomBattleMoves: ["bodyslam", "earthquake", "firepunch", "quickattack", "swordsdance", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	fletchling: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	fletchinder: {
		encounters: [
			{"generation": 7, "level": 16},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	talonflame: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	scatterbug: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	spewpa: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	vivillon: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	vivillonfancy: {
		eventPokemon: [
			{"generation": 6, "level": 12, "isHidden": false, "moves": ["gust", "lightscreen", "strugglebug", "holdhands"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
	},
	vivillonpokeball: {
		eventPokemon: [
			{"generation": 6, "level": 12, "isHidden": false, "moves": ["stunspore", "gust", "lightscreen", "strugglebug"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
	},
	litleo: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pyroar: {
		eventPokemon: [
			{"generation": 6, "level": 49, "gender": "M", "perfectIVs": 2, "isHidden": false, "abilities": ["unnerve"], "moves": ["hypervoice", "fireblast", "darkpulse"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	flabebe: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	floette: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	floetteeternal: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	florges: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	skiddo: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gogoat: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pancham: {
		eventPokemon: [
			{"generation": 6, "level": 30, "gender": "M", "nature": "Adamant", "isHidden": false, "abilities": ["moldbreaker"], "moves": ["armthrust", "stoneedge", "darkpulse"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	pangoro: {
		randomBattleMoves: ["closecombat", "darkestlariat", "drainpunch", "gunkshot", "icepunch", "partingshot"],
		encounters: [
			{"generation": 7, "level": 24},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	furfrou: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	espurr: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	meowstic: {
		randomBattleMoves: ["lightscreen", "psychic", "reflect", "thunderwave", "yawn"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	meowsticf: {
		randomBattleMoves: ["energyball", "nastyplot", "psychic", "shadowball", "thunderbolt"],
		unreleasedHidden: "Past",
		tier: "NU",
		doublesTier: "DUU",
	},
	honedge: {
		tier: "LC",
	},
	doublade: {
		randomBattleMoves: ["ironhead", "sacredsword", "shadowclaw", "shadowsneak", "swordsdance"],
		tier: "UU",
		doublesTier: "NFE",
	},
	aegislash: {
		randomBattleMoves: ["closecombat", "ironhead", "kingsshield", "shadowball", "shadowsneak", "swordsdance"],
		eventPokemon: [
			{"generation": 6, "level": 50, "gender": "F", "nature": "Quiet", "moves": ["wideguard", "kingsshield", "shadowball", "flashcannon"], "pokeball": "cherishball"},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	aegislashblade: {
		requiredAbility: 'Stance Change',
		battleOnly: true,
	},
	spritzee: {
		tier: "LC",
	},
	aromatisse: {
		randomBattleMoves: ["aromatherapy", "lightscreen", "moonblast", "nastyplot", "reflect", "thunderbolt", "trickroom"],
		eventPokemon: [
			{"generation": 6, "level": 50, "nature": "Relaxed", "isHidden": true, "moves": ["trickroom", "healpulse", "disable", "moonblast"], "pokeball": "cherishball"},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	swirlix: {
		tier: "LC Uber",
	},
	slurpuff: {
		randomBattleMoves: ["calmmind", "dazzlinggleam", "energyball", "flamethrower"],
		tier: "NU",
		doublesTier: "DUU",
	},
	inkay: {
		eventPokemon: [
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["happyhour", "foulplay", "hypnosis", "topsyturvy"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	malamar: {
		randomBattleMoves: ["psychocut", "rest", "sleeptalk", "substitute", "superpower", "throatchop"],
		eventPokemon: [
			{"generation": 6, "level": 50, "nature": "Adamant", "ivs": {"hp": 31, "atk": 31}, "isHidden": false, "abilities": ["contrary"], "moves": ["superpower", "knockoff", "facade", "rockslide"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	binacle: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	barbaracle: {
		randomBattleMoves: ["crosschop", "earthquake", "liquidation", "shellsmash", "stoneedge"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		unreleasedHidden: "Past",
		tier: "RU",
		doublesTier: "DUU",
	},
	skrelp: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dragalge: {
		encounters: [
			{"generation": 6, "level": 35, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	clauncher: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	clawitzer: {
		encounters: [
			{"generation": 6, "level": 35, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	helioptile: {
		tier: "LC",
	},
	heliolisk: {
		randomBattleMoves: ["darkpulse", "grassknot", "hypervoice", "surf", "thunderbolt", "voltswitch"],
		tier: "UU",
		doublesTier: "DUU",
	},
	tyrunt: {
		eventPokemon: [
			{"generation": 6, "level": 10, "isHidden": true, "moves": ["tailwhip", "tackle", "roar", "stomp"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tyrantrum: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	amaura: {
		eventPokemon: [
			{"generation": 6, "level": 10, "isHidden": true, "moves": ["growl", "powdersnow", "thunderwave", "rockthrow"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	aurorus: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hawlucha: {
		randomBattleMoves: ["bravebird", "closecombat", "roost", "stoneedge", "swordsdance", "throatchop"],
		tier: "UUBL",
		doublesTier: "DUU",
	},
	dedenne: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	carbink: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	goomy: {
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "isHidden": true, "moves": ["bodyslam", "dragonpulse", "counter"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	sliggoo: {
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "NFE",
	},
	goodra: {
		randomBattleMoves: ["dracometeor", "earthquake", "fireblast", "powerwhip", "sludgebomb", "thunderbolt"],
		tier: "RU",
		doublesTier: "DUU",
	},
	klefki: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	phantump: {
		tier: "LC",
	},
	trevenant: {
		randomBattleMoves: ["earthquake", "hornleech", "rockslide", "shadowclaw", "trickroom", "woodhammer"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pumpkaboo: {
		tier: "LC",
	},
	pumpkaboosmall: {
		unreleasedHidden: true,
		tier: "LC",
	},
	pumpkaboolarge: {
		unreleasedHidden: true,
		tier: "LC",
	},
	pumpkaboosuper: {
		eventPokemon: [
			{"generation": 6, "level": 50, "moves": ["trickortreat", "astonish", "scaryface", "shadowsneak"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	gourgeist: {
		randomBattleMoves: ["leechseed", "powerwhip", "shadowsneak", "substitute", "willowisp"],
		tier: "NU",
		doublesTier: "DUU",
	},
	gourgeistsmall: {
		randomBattleMoves: ["leechseed", "powerwhip", "shadowsneak", "substitute", "willowisp"],
		unreleasedHidden: true,
		tier: "NU",
		doublesTier: "DUU",
	},
	gourgeistlarge: {
		randomBattleMoves: ["leechseed", "powerwhip", "shadowsneak", "substitute", "willowisp"],
		unreleasedHidden: true,
		tier: "NU",
		doublesTier: "DUU",
	},
	gourgeistsuper: {
		randomBattleMoves: ["explosion", "foulplay", "powerwhip", "rockslide", "shadowsneak", "trick"],
		tier: "NU",
		doublesTier: "DUU",
	},
	bergmite: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	avalugg: {
		randomBattleMoves: ["avalanche", "bodypress", "curse", "rapidspin", "recover"],
		unreleasedHidden: "Past",
		tier: "UU",
		doublesTier: "DUU",
	},
	noibat: {
		unreleasedHidden: "Past",
		tier: "LC",
	},
	noivern: {
		randomBattleMoves: ["boomburst", "dracometeor", "flamethrower", "hurricane", "roost", "uturn"],
		unreleasedHidden: "Past",
		tier: "UU",
		doublesTier: "DUU",
	},
	xerneas: {
		eventPokemon: [
			{"generation": 6, "level": 50, "moves": ["gravity", "geomancy", "moonblast", "megahorn"]},
			{"generation": 6, "level": 100, "shiny": true, "moves": ["geomancy", "moonblast", "aromatherapy", "focusblast"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["geomancy", "hornleech", "nightslash", "moonblast"]},
			{"generation": 7, "level": 60, "moves": ["geomancy", "hornleech", "nightslash", "moonblast"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["geomancy", "focusblast", "grassknot", "moonblast"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	yveltal: {
		eventPokemon: [
			{"generation": 6, "level": 50, "moves": ["snarl", "oblivionwing", "disable", "darkpulse"]},
			{"generation": 6, "level": 100, "shiny": true, "moves": ["oblivionwing", "suckerpunch", "darkpulse", "foulplay"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["oblivionwing", "darkpulse", "phantomforce", "psychic"]},
			{"generation": 7, "level": 60, "moves": ["oblivionwing", "darkpulse", "phantomforce", "psychic"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "moves": ["oblivionwing", "darkpulse", "heatwave", "tailwind"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zygarde: {
		eventPokemon: [
			{"generation": 6, "level": 70, "moves": ["crunch", "earthquake", "camouflage", "dragonpulse"]},
			{"generation": 6, "level": 100, "moves": ["landswrath", "extremespeed", "glare", "outrage"], "pokeball": "cherishball"},
			{"generation": 7, "level": 30, "moves": ["safeguard", "dig", "bind", "landswrath"]},
			{"generation": 7, "level": 50, "moves": ["bind", "landswrath", "sandstorm", "haze"]},
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["bind", "landswrath", "sandstorm", "haze"]},
			{"generation": 7, "level": 60, "shiny": true, "moves": ["landswrath", "glare", "safeguard", "dragonbreath"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": true, "moves": ["landswrath", "glare", "safeguard", "dragonbreath"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "shiny": true, "moves": ["thousandarrows", "outrage", "extremespeed", "dragondance"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "shiny": true, "isHidden": true, "moves": ["thousandarrows", "outrage", "extremespeed", "dragondance"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zygarde10: {
		eventPokemon: [
			{"generation": 7, "level": 30, "moves": ["safeguard", "dig", "bind", "landswrath"]},
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["safeguard", "dig", "bind", "landswrath"]},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": true, "moves": ["landswrath", "glare", "safeguard", "dragonbreath"], "pokeball": "cherishball"},
			{"generation": 7, "level": 100, "shiny": true, "isHidden": true, "moves": ["thousandarrows", "outrage", "extremespeed", "dragondance"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		gen: 7,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zygardecomplete: {
		gen: 7,
		requiredAbility: "Power Construct",
		battleOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	diancie: {
		eventPokemon: [
			{"generation": 6, "level": 50, "perfectIVs": 0, "moves": ["diamondstorm", "reflect", "return", "moonblast"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": true, "moves": ["diamondstorm", "moonblast", "reflect", "return"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dianciemega: {
		requiredItem: "Diancite",
		isNonstandard: "Past",
	},
	hoopa: {
		eventPokemon: [
			{"generation": 6, "level": 50, "moves": ["hyperspacehole", "nastyplot", "psychic", "astonish"], "pokeball": "cherishball"},
			{"generation": 7, "level": 15, "moves": ["shadowball", "nastyplot", "psychic", "hyperspacehole"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hoopaunbound: {
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	volcanion: {
		eventPokemon: [
			{"generation": 6, "level": 70, "moves": ["steameruption", "overheat", "hydropump", "mist"], "pokeball": "cherishball"},
			{"generation": 6, "level": 70, "moves": ["steameruption", "flamethrower", "hydropump", "explosion"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rowlet: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	dartrix: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	decidueye: {
		randomBattleMoves: ["leafblade", "shadowsneak", "spiritshackle", "swordsdance", "uturn"],
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["leafblade", "phantomforce", "shadowsneak", "bravebird"], "pokeball": "pokeball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	litten: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	torracat: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	incineroar: {
		randomBattleMoves: ["darkestlariat", "earthquake", "fakeout", "flareblitz", "partingshot", "uturn"],
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["fakeout", "uturn", "darkestlariat", "flareblitz"], "pokeball": "pokeball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	popplio: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	brionne: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	primarina: {
		randomBattleMoves: ["hydropump", "moonblast", "psychic", "sparklingaria", "energyball"],
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["hypervoice", "moonblast", "icywind", "perishsong"], "pokeball": "pokeball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	pikipek: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	trumbeak: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	toucannon: {
		encounters: [
			{"generation": 7, "level": 26},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	yungoos: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gumshoos: {
		encounters: [
			{"generation": 7, "level": 17},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gumshoostotem: {
		eventPokemon: [
			{"generation": 7, "level": 20, "perfectIVs": 3, "moves": ["sandattack", "odorsleuth", "bide", "bite"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
	},
	grubbin: {
		tier: "LC",
	},
	charjabug: {
		tier: "NFE",
	},
	vikavolt: {
		randomBattleMoves: ["agility", "bugbuzz", "energyball", "stickyweb", "thunderbolt", "voltswitch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	vikavolttotem: {
		eventPokemon: [
			{"generation": 7, "level": 35, "perfectIVs": 3, "moves": ["spark", "acrobatics", "guillotine", "bugbuzz"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	crabrawler: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	crabominable: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oricorio: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oricoriopompom: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oricoriopau: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oricoriosensu: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cutiefly: {
		tier: "LC",
	},
	ribombee: {
		randomBattleMoves: ["bugbuzz", "moonblast", "stickyweb", "stunspore", "uturn"],
		tier: "UU",
		doublesTier: "DUU",
	},
	ribombeetotem: {
		eventPokemon: [
			{"generation": 7, "level": 50, "perfectIVs": 3, "moves": ["bugbuzz", "dazzlinggleam", "aromatherapy", "quiverdance"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rockruff: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rockruffdusk: {
		eventPokemon: [
			{"generation": 7, "level": 10, "moves": ["tackle", "bite", "firefang", "happyhour"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "moves": ["tackle", "bite", "thunderfang", "happyhour"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lycanroc: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lycanrocmidnight: {
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["stoneedge", "firefang", "suckerpunch", "swordsdance"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lycanrocdusk: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wishiwashi: {
		tier: "NU",
		doublesTier: "DUU",
	},
	wishiwashischool: {
		randomBattleMoves: ["earthquake", "hydropump", "icebeam", "scald", "uturn"],
		requiredAbility: 'Schooling',
		battleOnly: true,
	},
	mareanie: {
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "isHidden": true, "moves": ["toxic", "stockpile", "swallow"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	toxapex: {
		randomBattleMoves: ["banefulbunker", "haze", "recover", "scald", "toxic", "toxicspikes"],
		tier: "OU",
		doublesTier: "DUU",
	},
	mudbray: {
		tier: "LC",
	},
	mudsdale: {
		randomBattleMoves: ["bodypress", "earthquake", "heavyslam", "rockslide", "stealthrock"],
		encounters: [
			{"generation": 7, "level": 29},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	dewpider: {
		tier: "LC",
	},
	araquanid: {
		randomBattleMoves: ["liquidation", "leechlife", "mirrorcoat", "reflect", "stickyweb"],
		tier: "UU",
		doublesTier: "DUU",
	},
	araquanidtotem: {
		eventPokemon: [
			{"generation": 7, "level": 25, "perfectIVs": 3, "moves": ["spiderweb", "bugbite", "bubblebeam", "bite"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	fomantis: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lurantis: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lurantistotem: {
		eventPokemon: [
			{"generation": 7, "level": 30, "perfectIVs": 3, "moves": ["growth", "ingrain", "leafblade", "synthesis"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
	},
	morelull: {
		tier: "LC",
	},
	shiinotic: {
		randomBattleMoves: ["energyball", "leechseed", "moonblast", "spore", "strengthsap"],
		tier: "NU",
		doublesTier: "DUU",
	},
	salandit: {
		tier: "LC",
	},
	salazzle: {
		randomBattleMoves: ["flamethrower", "protect", "substitute", "toxic"],
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": false, "moves": ["fakeout", "toxic", "sludgebomb", "flamethrower"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 7, "level": 16},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	salazzletotem: {
		eventPokemon: [
			{"generation": 7, "level": 30, "perfectIVs": 3, "moves": ["smog", "doubleslap", "flameburst", "toxic"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	stufful: {
		tier: "LC",
	},
	bewear: {
		randomBattleMoves: ["closecombat", "darkestlariat", "doubleedge", "icepunch", "swordsdance"],
		eventPokemon: [
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["babydolleyes", "brutalswing", "superpower", "bind"], "pokeball": "cherishball"},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	bounsweet: {
		tier: "LC",
	},
	steenee: {
		eventPokemon: [
			{"generation": 7, "level": 20, "nature": "Naive", "isHidden": false, "abilities": ["leafguard"], "moves": ["magicalleaf", "doubleslap", "sweetscent"], "pokeball": "cherishball"},
		],
		tier: "NFE",
	},
	tsareena: {
		randomBattleMoves: ["highjumpkick", "playrough", "powerwhip", "rapidspin", "synthesis", "uturn", "zenheadbutt"],
		tier: "UU",
		doublesTier: "DUU",
	},
	comfey: {
		eventPokemon: [
			{"generation": 7, "level": 10, "nature": "Jolly", "isHidden": false, "moves": ["celebrate", "leechseed", "drainingkiss", "magicalleaf"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oranguru: {
		randomBattleMoves: ["nastyplot", "focusblast", "psychic", "thunderbolt", "trickroom"],
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "isHidden": false, "abilities": ["telepathy"], "moves": ["instruct", "psychic", "psychicterrain"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["instruct", "foulplay", "trickroom", "allyswitch"], "pokeball": "pokeball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	passimian: {
		randomBattleMoves: ["closecombat", "earthquake", "gunkshot", "knockoff", "rockslide", "uturn"],
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "isHidden": false, "moves": ["bestow", "fling", "feint"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["closecombat", "uturn", "knockoff", "gunkshot"], "pokeball": "pokeball"},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	wimpod: {
		tier: "LC",
	},
	golisopod: {
		randomBattleMoves: ["aquajet", "closecombat", "firstimpression", "liquidation", "spikes"],
		tier: "UU",
		doublesTier: "DUU",
	},
	sandygast: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	palossand: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pyukumuku: {
		randomBattleMoves: ["counter", "mirrorcoat", "recover", "toxic"],
		tier: "NU",
		doublesTier: "DUU",
	},
	typenull: {
		randomBattleMoves: ["crushclaw", "payback", "rest", "sleeptalk", "swordsdance"],
		eventPokemon: [
			{"generation": 7, "level": 40, "shiny": 1, "perfectIVs": 3, "moves": ["crushclaw", "scaryface", "xscissor", "takedown"]},
			{"generation": 7, "level": 60, "shiny": 1, "perfectIVs": 3, "moves": ["metalsound", "ironhead", "doublehit", "airslash"]},
			{"generation": 8, "level": 50, "shiny": 1, "perfectIVs": 3, "moves": ["triattack", "xscissor", "ironhead", "takedown"]},
		],
		eventOnly: true,
		tier: "NFE",
	},
	silvally: {
		randomBattleMoves: ["crunch", "explosion", "flamethrower", "multiattack", "swordsdance", "uturn"],
		eventPokemon: [
			{"generation": 7, "level": 100, "shiny": true, "moves": ["multiattack", "partingshot", "punishment", "scaryface"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallybug: {
		randomBattleMoves: ["flamethrower", "multiattack", "psychicfangs", "rockslide", "swordsdance", "thunderbolt", "uturn"],
		requiredItem: "Bug Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallydark: {
		randomBattleMoves: ["ironhead", "multiattack", "psychicfangs", "swordsdance", "uturn"],
		requiredItem: "Dark Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallydragon: {
		randomBattleMoves: ["firefang", "ironhead", "multiattack", "partingshot", "swordsdance"],
		requiredItem: "Dragon Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallyelectric: {
		randomBattleMoves: ["flamethrower", "icebeam", "multiattack", "uturn"],
		requiredItem: "Electric Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallyfairy: {
		randomBattleMoves: ["flamethrower", "multiattack", "partingshot", "psychicfangs", "thunderwave"],
		requiredItem: "Fairy Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallyfighting: {
		randomBattleMoves: ["crunch", "ironhead", "multiattack", "rockslide", "swordsdance", "uturn"],
		requiredItem: "Fighting Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallyfire: {
		randomBattleMoves: ["icebeam", "multiattack", "partingshot", "surf", "thunderbolt"],
		requiredItem: "Fire Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallyflying: {
		randomBattleMoves: ["flamethrower", "ironhead", "multiattack", "partingshot", "rockslide", "swordsdance"],
		requiredItem: "Flying Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallyghost: {
		randomBattleMoves: ["multiattack", "swordsdance", "thunderwave", "xscissor"],
		requiredItem: "Ghost Memory",
		tier: "RU",
		doublesTier: "DUU",
	},
	silvallygrass: {
		randomBattleMoves: ["flamethrower", "icebeam", "multiattack", "surf", "uturn"],
		requiredItem: "Grass Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallyground: {
		randomBattleMoves: ["multiattack", "partingshot", "rockslide", "swordsdance", "xscissor"],
		requiredItem: "Ground Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallyice: {
		randomBattleMoves: ["flamethrower", "multiattack", "thunderbolt", "uturn"],
		requiredItem: "Ice Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallypoison: {
		randomBattleMoves: ["flamethrower", "multiattack", "partingshot", "psychicfangs", "surf", "thunderwave"],
		requiredItem: "Poison Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallypsychic: {
		randomBattleMoves: ["crunch", "flamethrower", "multiattack", "swordsdance", "uturn", "xscissor"],
		requiredItem: "Psychic Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallyrock: {
		randomBattleMoves: ["flamethrower", "multiattack", "partingshot", "psychicfangs", "surf", "thunderwave"],
		requiredItem: "Rock Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	silvallysteel: {
		randomBattleMoves: ["flamethrower", "multiattack", "partingshot", "thunderbolt", "thunderwave"],
		requiredItem: "Steel Memory",
		tier: "RU",
		doublesTier: "DUU",
	},
	silvallywater: {
		randomBattleMoves: ["icebeam", "multiattack", "partingshot", "thunderbolt", "thunderwave"],
		requiredItem: "Water Memory",
		tier: "NU",
		doublesTier: "DUU",
	},
	minior: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	miniormeteor: {
		requiredAbility: 'Shields Down',
		battleOnly: true,
		isNonstandard: "Past",
	},
	komala: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	turtonator: {
		randomBattleMoves: ["dracometeor", "dragonpulse", "earthquake", "fireblast", "rapidspin", "shellsmash"],
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "moves": ["flamethrower", "bodyslam", "wideguard"], "pokeball": "cherishball"},
			{"generation": 7, "level": 30, "gender": "M", "nature": "Brave", "moves": ["flamethrower", "shelltrap", "dragontail"], "pokeball": "cherishball"},
		],
		tier: "RU",
		doublesTier: "DUU",
	},
	togedemaru: {
		randomBattleMoves: ["ironhead", "nuzzle", "spikyshield", "uturn", "wish", "zingzap"],
		tier: "NU",
		doublesTier: "DUU",
	},
	togedemarutotem: {
		eventPokemon: [
			{"generation": 7, "level": 30, "perfectIVs": 3, "moves": ["nuzzle", "magnetrise", "discharge", "zingzap"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mimikyu: {
		randomBattleMoves: ["playrough", "shadowclaw", "shadowsneak", "swordsdance", "taunt"],
		eventPokemon: [
			{"generation": 7, "level": 10, "moves": ["copycat", "babydolleyes", "splash", "astonish"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "shiny": true, "moves": ["astonish", "playrough", "copycat", "substitute"], "pokeball": "cherishball"},
		],
		tier: "OU",
		doublesTier: "DOU",
	},
	mimikyubusted: {
		requiredAbility: 'Disguise',
		battleOnly: true,
	},
	mimikyutotem: {
		eventPokemon: [
			{"generation": 7, "level": 40, "perfectIVs": 3, "moves": ["feintattack", "charm", "slash", "shadowclaw"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mimikyubustedtotem: {
		requiredAbility: 'Disguise',
		battleOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	bruxish: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	drampa: {
		randomBattleMoves: ["dracometeor", "fireblast", "focusblast", "glare", "hypervoice", "thunderbolt"],
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "isHidden": true, "moves": ["playnice", "echoedvoice", "hurricane"], "pokeball": "cherishball"},
		],
		tier: "NU",
		doublesTier: "DUU",
	},
	dhelmise: {
		randomBattleMoves: ["anchorshot", "earthquake", "powerwhip", "rapidspin", "shadowclaw", "swordsdance"],
		tier: "RU",
		doublesTier: "DUU",
	},
	jangmoo: {
		tier: "LC",
	},
	hakamoo: {
		tier: "NFE",
	},
	kommoo: {
		randomBattleMoves: ["aurasphere", "clangoroussoul", "clangingscales", "closecombat", "poisonjab", "stealthrock"],
		encounters: [
			{"generation": 7, "level": 41},
		],
		tier: "OU",
		doublesTier: "DUU",
	},
	kommoototem: {
		eventPokemon: [
			{"generation": 7, "level": 50, "perfectIVs": 3, "moves": ["workup", "screech", "irondefense", "dragonclaw"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tapukoko: {
		eventPokemon: [
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["naturesmadness", "discharge", "agility", "electroball"]},
			{"generation": 7, "level": 60, "shiny": true, "nature": "Timid", "isHidden": false, "moves": ["naturesmadness", "discharge", "agility", "electroball"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": false, "moves": ["thunderbolt", "dazzlinggleam", "voltswitch", "naturesmadness"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tapulele: {
		eventPokemon: [
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["naturesmadness", "extrasensory", "flatter", "moonblast"]},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": false, "moves": ["naturesmadness", "extrasensory", "flatter", "moonblast"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tapubulu: {
		eventPokemon: [
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["naturesmadness", "zenheadbutt", "megahorn", "skullbash"]},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": false, "moves": ["naturesmadness", "zenheadbutt", "megahorn", "skullbash"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tapufini: {
		eventPokemon: [
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["naturesmadness", "muddywater", "aquaring", "hydropump"]},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": false, "moves": ["naturesmadness", "muddywater", "aquaring", "hydropump"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cosmog: {
		eventPokemon: [
			{"generation": 7, "level": 5, "moves": ["splash"]},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	cosmoem: {
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	solgaleo: {
		randomBattleMoves: ["flareblitz", "morningsun", "psychicfangs", "stoneedge", "sunsteelstrike"],
		eventPokemon: [
			{"generation": 7, "level": 55, "moves": ["sunsteelstrike", "cosmicpower", "crunch", "zenheadbutt"]},
			{"generation": 7, "level": 60, "moves": ["sunsteelstrike", "cosmicpower", "crunch", "zenheadbutt"]},
			{"generation": 7, "level": 60, "shiny": true, "moves": ["sunsteelstrike", "zenheadbutt", "nobleroar", "morningsun"], "pokeball": "cherishball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	lunala: {
		randomBattleMoves: ["calmmind", "focusblast", "moongeistbeam", "moonlight", "psychic"],
		eventPokemon: [
			{"generation": 7, "level": 55, "moves": ["moongeistbeam", "cosmicpower", "nightdaze", "shadowball"]},
			{"generation": 7, "level": 60, "moves": ["moongeistbeam", "cosmicpower", "nightdaze", "shadowball"]},
			{"generation": 7, "level": 60, "shiny": true, "moves": ["moongeistbeam", "psyshock", "moonblast", "moonlight"], "pokeball": "cherishball"},
		],
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	nihilego: {
		eventPokemon: [
			{"generation": 7, "level": 55, "moves": ["powergem", "mirrorcoat", "acidspray", "venomdrench"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["powergem", "acidspray", "stealthrock", "mirrorcoat"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	buzzwole: {
		eventPokemon: [
			{"generation": 7, "level": 65, "moves": ["counter", "hammerarm", "lunge", "dynamicpunch"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["counter", "hammerarm", "lunge", "dynamicpunch"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pheromosa: {
		eventPokemon: [
			{"generation": 7, "level": 60, "moves": ["triplekick", "lunge", "bugbuzz", "mefirst"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["triplekick", "lunge", "bugbuzz", "mefirst"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	xurkitree: {
		eventPokemon: [
			{"generation": 7, "level": 65, "moves": ["hypnosis", "discharge", "electricterrain", "powerwhip"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["hypnosis", "discharge", "electricterrain", "powerwhip"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	celesteela: {
		eventPokemon: [
			{"generation": 7, "level": 65, "moves": ["autotomize", "seedbomb", "skullbash", "irondefense"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["autotomize", "seedbomb", "skullbash", "irondefense"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kartana: {
		eventPokemon: [
			{"generation": 7, "level": 60, "moves": ["leafblade", "xscissor", "detect", "airslash"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["leafblade", "xscissor", "detect", "airslash"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	guzzlord: {
		eventPokemon: [
			{"generation": 7, "level": 70, "moves": ["thrash", "gastroacid", "heavyslam", "wringout"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["hammerarm", "thrash", "gastroacid", "heavyslam"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	necrozma: {
		randomBattleMoves: ["calmmind", "heatwave", "moonlight", "photongeyser", "stealthrock"],
		eventPokemon: [
			{"generation": 7, "level": 75, "moves": ["stealthrock", "irondefense", "wringout", "prismaticlaser"]},
			{"generation": 7, "level": 65, "moves": ["photongeyser", "irondefense", "powergem", "nightslash"]},
			{"generation": 7, "level": 75, "shiny": true, "moves": ["lightscreen", "substitute", "moonlight"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	necrozmaduskmane: {
		randomBattleMoves: ["dragondance", "earthquake", "photongeyser", "stealthrock", "sunsteelstrike"],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	necrozmadawnwings: {
		randomBattleMoves: ["autotomize", "calmmind", "heatwave", "moongeistbeam", "photongeyser"],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	necrozmaultra: {
		requiredItem: "Ultranecrozium Z",
		battleOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magearna: {
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["fleurcannon", "flashcannon", "luckychant", "helpinghand"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magearnaoriginal: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	marshadow: {
		randomBattleMoves: ["bulkup", "closecombat", "icepunch", "rocktomb", "shadowsneak", "spectralthief"],
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["spectralthief", "closecombat", "forcepalm", "shadowball"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	poipole: {
		eventPokemon: [
			{"generation": 7, "level": 40, "shiny": 1, "perfectIVs": 3, "moves": ["charm", "venomdrench", "nastyplot", "poisonjab"], "pokeball": "pokeball"},
			{"generation": 7, "level": 40, "shiny": true, "nature": "Modest", "perfectIVs": 3, "moves": ["venomdrench", "nastyplot", "poisonjab", "dragonpulse"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	naganadel: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	stakataka: {
		eventPokemon: [
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["irondefense", "ironhead", "rockblast", "wideguard"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	blacephalon: {
		eventPokemon: [
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["fireblast", "shadowball", "trick", "mindblown"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zeraora: {
		randomBattleMoves: ["bulkup", "closecombat", "grassknot", "plasmafists", "playrough", "voltswitch"],
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["plasmafists", "thunderpunch", "closecombat", "thunder"]},
		],
		eventOnly: true,
		isUnreleased: "Past",
		tier: "Unreleased",
	},
	meltan: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	melmetal: {
		randomBattleMoves: ["doubleironbash", "highhorsepower", "icepunch", "thunderpunch", "thunderwave"],
		isUnreleased: true,
		tier: "Unreleased",
	},
	melmetalgmax: {
		isGigantamax: "G-Max Meltdown",
		isUnreleased: true,
		tier: "Unreleased",
	},
	grookey: {
		unreleasedHidden: true,
		tier: "LC",
	},
	thwackey: {
		unreleasedHidden: true,
		tier: "NFE",
	},
	rillaboom: {
		randomBattleMoves: ["bulkup", "drumbeating", "highhorsepower", "substitute", "superpower", "uturn"],
		unreleasedHidden: true,
		tier: "RU",
		doublesTier: "DUU",
	},
	scorbunny: {
		unreleasedHidden: true,
		tier: "LC",
	},
	raboot: {
		unreleasedHidden: true,
		tier: "NFE",
	},
	cinderace: {
		randomBattleMoves: ["courtchange", "gunkshot", "highjumpkick", "pyroball", "uturn", "zenheadbutt"],
		unreleasedHidden: true,
		tier: "OU",
		doublesTier: "DUU",
	},
	sobble: {
		unreleasedHidden: true,
		tier: "LC",
	},
	drizzile: {
		unreleasedHidden: true,
		tier: "NFE",
	},
	inteleon: {
		randomBattleMoves: ["airslash", "darkpulse", "hydropump", "icebeam", "scald", "snipeshot", "uturn"],
		unreleasedHidden: true,
		tier: "UU",
		doublesTier: "DUU",
	},
	skwovet: {
		unreleasedHidden: true,
		tier: "LC",
	},
	greedent: {
		randomBattleMoves: ["bodyslam", "earthquake", "gyroball", "payback", "swordsdance"],
		unreleasedHidden: true,
		tier: "NU",
		doublesTier: "DUU",
	},
	rookidee: {
		tier: "LC",
	},
	corvisquire: {
		tier: "NFE",
	},
	corviknight: {
		randomBattleMoves: ["bodypress", "bravebird", "bulkup", "roost"],
		tier: "OU",
		doublesTier: "DOU",
	},
	corviknightgmax: {
		randomBattleMoves: ["bodypress", "bravebird", "defog", "roost", "uturn"],
		isGigantamax: "G-Max Wind Rage",
		tier: "Uber",
		doublesTier: "DOU",
	},
	blipbug: {
		tier: "LC",
	},
	dottler: {
		tier: "NFE",
	},
	orbeetle: {
		randomBattleMoves: ["bodypress", "hypnosis", "psychic", "recover", "stickyweb", "uturn"],
		tier: "NU",
		doublesTier: "DUU",
	},
	orbeetlegmax: {
		isGigantamax: "G-Max Gravitas",
		tier: "Uber",
		doublesTier: "DUU",
	},
	nickit: {
		unreleasedHidden: true,
		tier: "LC",
	},
	thievul: {
		randomBattleMoves: ["darkpulse", "foulplay", "grassknot", "nastyplot", "partingshot", "psychic"],
		unreleasedHidden: true,
		tier: "NU",
		doublesTier: "DUU",
	},
	gossifleur: {
		tier: "LC",
	},
	eldegoss: {
		randomBattleMoves: ["aromatherapy", "charm", "energyball", "pollenpuff", "rapidspin", "sleeppowder", "synthesis"],
		tier: "RU",
		doublesTier: "DUU",
	},
	wooloo: {
		unreleasedHidden: true,
		tier: "LC",
	},
	dubwool: {
		randomBattleMoves: ["bodypress", "cottonguard", "rest", "sleeptalk"],
		unreleasedHidden: true,
		tier: "NU",
		doublesTier: "DUU",
	},
	chewtle: {
		tier: "LC",
	},
	drednaw: {
		randomBattleMoves: ["liquidation", "stealthrock", "stoneedge", "superpower", "swordsdance"],
		tier: "NU",
		doublesTier: "DUU",
	},
	drednawgmax: {
		isGigantamax: "G-Max Stonesurge",
		tier: "Uber",
		doublesTier: "DUU",
	},
	yamper: {
		unreleasedHidden: true,
		tier: "LC",
	},
	boltund: {
		randomBattleMoves: ["bulkup", "crunch", "firefang", "playrough", "psychicfangs", "thunderfang", "voltswitch"],
		unreleasedHidden: true,
		tier: "RU",
		doublesTier: "DUU",
	},
	rolycoly: {
		tier: "LC",
	},
	carkol: {
		tier: "NFE",
	},
	coalossal: {
		randomBattleMoves: ["overheat", "rapidspin", "spikes", "stealthrock", "stoneedge", "willowisp"],
		tier: "UU",
		doublesTier: "DUU",
	},
	coalossalgmax: {
		isGigantamax: "G-Max Volcalith",
		tier: "Uber",
		doublesTier: "DUU",
	},
	applin: {
		tier: "LC",
	},
	flapple: {
		randomBattleMoves: ["dragondance", "gravapple", "outrage", "suckerpunch", "uturn"],
		tier: "RU",
		doublesTier: "DUU",
	},
	flapplegmax: {
		isGigantamax: "G-Max Tartness",
		tier: "Uber",
		doublesTier: "DUU",
	},
	appletun: {
		tier: "NU",
		doublesTier: "DUU",
	},
	appletungmax: {
		randomBattleMoves: ["appleacid", "dracometeor", "dragonpulse", "leechseed", "recover"],
		isGigantamax: "G-Max Sweetness",
		tier: "Uber",
		doublesTier: "DUU",
	},
	silicobra: {
		tier: "LC",
	},
	sandaconda: {
		randomBattleMoves: ["bodypress", "coil", "earthquake", "glare", "stealthrock", "stoneedge", "rest"],
		tier: "NU",
		doublesTier: "DUU",
	},
	sandacondagmax: {
		isGigantamax: "G-Max Sandblast",
		tier: "Uber",
		doublesTier: "DUU",
	},
	cramorant: {
		randomBattleMoves: ["defog", "hurricane", "roost", "superpower", "surf"],
		tier: "UU",
		doublesTier: "DUU",
	},
	cramorantgulping: {
		requiredAbility: "Gulp Missile",
		battleOnly: true,
	},
	cramorantgorging: {
		requiredAbility: "Gulp Missile",
		battleOnly: true,
	},
	arrokuda: {
		tier: "LC",
	},
	barraskewda: {
		randomBattleMoves: ["closecombat", "crunch", "drillrun", "liquidation", "poisonjab"],
		tier: "UU",
		doublesTier: "DUU",
	},
	toxel: {
		tier: "LC",
	},
	toxtricity: {
		randomBattleMoves: ["boomburst", "overdrive", "shiftgear", "sludgewave", "voltswitch"],
		tier: "OU",
		doublesTier: "DOU",
	},
	toxtricitylowkey: {
		randomBattleMoves: ["boomburst", "overdrive", "sludgewave", "voltswitch"],
	},
	toxtricitygmax: {
		isGigantamax: "G-Max Stun Shock",
		isUnreleased: true,
		tier: "Unreleased",
	},
	sizzlipede: {
		tier: "LC",
	},
	centiskorch: {
		randomBattleMoves: ["coil", "firelash", "knockoff", "leechlife", "powerwhip"],
		tier: "UU",
		doublesTier: "DUU",
	},
	centiskorchgmax: {
		isGigantamax: "G-Max Centiferno",
		tier: "Uber",
		doublesTier: "DUU",
	},
	clobbopus: {
		tier: "LC",
	},
	grapploct: {
		randomBattleMoves: ["brutalswing", "circlethrow", "drainpunch", "icepunch", "suckerpunch"],
		tier: "NU",
		doublesTier: "DUU",
	},
	sinistea: {
		tier: "LC",
	},
	polteageist: {
		randomBattleMoves: ["gigadrain", "shadowball", "shellsmash", "storedpower", "strengthsap"],
		tier: "UU",
		doublesTier: "DUU",
	},
	hatenna: {
		tier: "LC",
	},
	hattrem: {
		tier: "NFE",
	},
	hatterene: {
		tier: "OU",
		doublesTier: "DOU",
	},
	hatterenegmax: {
		randomBattleMoves: ["calmmind", "darkpulse", "dazzlinggleam", "mysticalfire", "psychic", "trickroom"],
		isGigantamax: "G-Max Smite",
		tier: "Uber",
		doublesTier: "DOU",
	},
	impidimp: {
		tier: "LC",
	},
	morgrem: {
		tier: "NFE",
	},
	grimmsnarl: {
		randomBattleMoves: ["lightscreen", "reflect", "spiritbreak", "taunt", "thunderwave"],
		tier: "OU",
		doublesTier: "DOU",
	},
	grimmsnarlgmax: {
		randomBattleMoves: ["bulkup", "darkestlariat", "playrough", "substitute", "suckerpunch", "trick"],
		isGigantamax: "G-Max Snooze",
		tier: "Uber",
		doublesTier: "DOU",
	},
	milcery: {
		tier: "LC",
	},
	alcremie: {
		tier: "RU",
		doublesTier: "DUU",
	},
	alcremiegmax: {
		randomBattleMoves: ["calmmind", "dazzlinggleam", "mysticalfire", "psychic", "recover"],
		isGigantamax: "G-Max Finale",
		tier: "Uber",
		doublesTier: "DUU",
	},
	falinks: {
		randomBattleMoves: ["closecombat", "noretreat", "poisonjab", "rockslide", "throatchop"],
		tier: "NU",
		doublesTier: "DUU",
	},
	pincurchin: {
		randomBattleMoves: ["discharge", "recover", "selfdestruct", "spikes", "suckerpunch", "toxicspikes"],
		tier: "NU",
		doublesTier: "DUU",
	},
	snom: {
		tier: "LC",
	},
	frosmoth: {
		randomBattleMoves: ["bugbuzz", "gigadrain", "hurricane", "icebeam", "quiverdance"],
		tier: "UU",
		doublesTier: "DUU",
	},
	stonjourner: {
		randomBattleMoves: ["earthquake", "heatcrash", "rockpolish", "stealthrock", "stoneedge"],
		tier: "NU",
		doublesTier: "DUU",
	},
	eiscue: {
		randomBattleMoves: ["bellydrum", "iciclecrash", "liquidation", "substitute", "zenheadbutt"],
		tier: "NU",
		doublesTier: "DUU",
	},
	eiscuenoice: {
		requiredAbility: "Ice Face",
		battleOnly: true,
	},
	indeedee: {
		randomBattleMoves: ["calmmind", "hypervoice", "mysticalfire", "psychic", "trick"],
		tier: "UU",
		doublesTier: "DUU",
	},
	indeedeef: {
		randomBattleMoves: ["aromatherapy", "calmmind", "hypervoice", "mysticalfire", "psychic"],
		tier: "RU",
		doublesTier: "DOU",
	},
	morpeko: {
		randomBattleMoves: ["aurawheel", "foulplay", "partingshot", "protect", "psychicfangs", "rapidspin"],
		tier: "UU",
		doublesTier: "DUU",
	},
	morpekohangry: {
		requiredAbility: "Hunger Switch",
		battleOnly: true,
	},
	cufant: {
		tier: "LC",
	},
	copperajah: {
		randomBattleMoves: ["earthquake", "ironhead", "playrough", "rockslide", "stealthrock"],
		tier: "UU",
		doublesTier: "DUU",
	},
	copperajahgmax: {
		randomBattleMoves: ["earthquake", "heatcrash", "heavyslam", "powerwhip", "stoneedge"],
		isGigantamax: "G-Max Steelsurge",
		tier: "Uber",
		doublesTier: "DUU",
	},
	dracozolt: {
		randomBattleMoves: ["aerialace", "boltbeak", "earthquake", "lowkick", "outrage"],
		unreleasedHidden: true,
		tier: "UU",
		doublesTier: "DUU",
	},
	arctozolt: {
		randomBattleMoves: ["bodyslam", "boltbeak", "freezedry", "iciclecrash", "lowkick"],
		unreleasedHidden: true,
		tier: "NU",
		doublesTier: "DUU",
	},
	dracovish: {
		randomBattleMoves: ["crunch", "fishiousrend", "icefang", "lowkick", "psychicfangs"],
		unreleasedHidden: true,
		tier: "OU",
		doublesTier: "DOU",
	},
	arctovish: {
		randomBattleMoves: ["bodyslam", "fishiousrend", "freezedry", "iciclecrash", "psychicfangs"],
		unreleasedHidden: true,
		tier: "NU",
		doublesTier: "DUU",
	},
	duraludon: {
		randomBattleMoves: ["bodypress", "dracometeor", "flashcannon", "stealthrock", "thunderbolt"],
		tier: "UU",
		doublesTier: "DOU",
	},
	duraludongmax: {
		isGigantamax: "G-Max Depletion",
		tier: "Uber",
		doublesTier: "DOU",
	},
	dreepy: {
		tier: "LC",
	},
	drakloak: {
		tier: "NFE",
	},
	dragapult: {
		randomBattleMoves: ["dracometeor", "fireblast", "shadowball", "thunderbolt", "uturn"],
		tier: "OU",
		doublesTier: "DOU",
	},
	zacian: {
		randomBattleMoves: ["closecombat", "crunch", "playrough", "psychicfangs", "swordsdance"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	zaciancrowned: {
		randomBattleMoves: ["behemothblade", "closecombat", "crunch", "playrough", "psychicfangs", "swordsdance"],
		tier: "Uber",
		doublesTier: "DUber",
		requiredItem: "Rusted Sword",
	},
	zamazenta: {
		randomBattleMoves: ["closecombat", "crunch", "psychicfangs", "wildcharge"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	zamazentacrowned: {
		randomBattleMoves: ["behemothbash", "closecombat", "crunch", "psychicfangs"],
		tier: "Uber",
		doublesTier: "DUber",
		requiredItem: "Rusted Shield",
	},
	eternatus: {
		randomBattleMoves: ["dynamaxcannon", "flamethrower", "recover", "sludgewave", "toxic"],
		tier: "Uber",
		doublesTier: "DUber",
	},
	eternatuseternamax: {
		isNonstandard: "Unobtainable",
		tier: "Illegal",
	},
	missingno: {
		isNonstandard: "Custom",
		tier: "Illegal",
	},
	syclar: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP LC",
	},
	syclant: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	revenankh: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	embirch: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP LC",
	},
	flarelm: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP NFE",
	},
	pyroak: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	breezi: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP LC",
	},
	fidgit: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	rebble: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP LC",
	},
	tactite: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP NFE",
	},
	stratagem: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	privatyke: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP LC",
	},
	arghonaut: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	kitsunoh: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	cyclohm: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	colossoil: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	krilowatt: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	voodoll: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP LC",
	},
	voodoom: {
		isNonstandard: "CAP",
		gen: 4,
		tier: "CAP",
	},
	scratchet: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP LC",
	},
	tomohawk: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP",
	},
	necturine: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP LC",
	},
	necturna: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP",
	},
	mollux: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP",
	},
	cupra: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP LC",
	},
	argalis: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP NFE",
	},
	aurumoth: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP",
	},
	brattler: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP LC",
	},
	malaconda: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP",
	},
	cawdet: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP LC",
	},
	cawmodore: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP",
	},
	volkritter: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP LC",
	},
	volkraken: {
		isNonstandard: "CAP",
		gen: 5,
		tier: "CAP",
	},
	snugglow: {
		isNonstandard: "CAP",
		gen: 6,
		tier: "CAP LC",
	},
	plasmanta: {
		isNonstandard: "CAP",
		gen: 6,
		tier: "CAP",
	},
	floatoy: {
		isNonstandard: "CAP",
		gen: 6,
		tier: "CAP LC",
	},
	caimanoe: {
		isNonstandard: "CAP",
		gen: 6,
		tier: "CAP NFE",
	},
	naviathan: {
		isNonstandard: "CAP",
		gen: 6,
		tier: "CAP",
	},
	crucibelle: {
		isNonstandard: "CAP",
		gen: 6,
		tier: "CAP",
	},
	crucibellemega: {
		requiredItem: "Crucibellite",
		isNonstandard: "CAP",
		gen: 6,
		tier: "CAP",
	},
	pluffle: {
		isNonstandard: "CAP",
		gen: 6,
		tier: "CAP LC",
	},
	kerfluffle: {
		isNonstandard: "CAP",
		eventPokemon: [
			{"generation": 6, "level": 16, "isHidden": false, "abilities": ["naturalcure"], "moves": ["celebrate", "holdhands", "fly", "metronome"], "pokeball": "cherishball"},
		],
		gen: 6,
		tier: "CAP",
	},
	pajantom: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP",
	},
	mumbao: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP LC",
	},
	jumbao: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP",
	},
	fawnifer: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP LC",
	},
	electrelk: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP NFE",
	},
	caribolt: {
		isNonstandard: "CAP",
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["celebrate", "hornleech", "wildcharge", "metronome"], "pokeball": "cherishball"},
		],
		gen: 7,
		tier: "CAP",
	},
	smogecko: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP LC",
	},
	smoguana: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP NFE",
	},
	smokomodo: {
		isNonstandard: "CAP",
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["celebrate", "eruption", "magnitude", "camouflage"], "pokeball": "cherishball"},
		],
		gen: 7,
		tier: "CAP",
	},
	swirlpool: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP LC",
	},
	coribalis: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP NFE",
	},
	snaelstrom: {
		isNonstandard: "CAP",
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["celebrate", "liquidation", "leechlife", "metronome"], "pokeball": "cherishball"},
		],
		gen: 7,
		tier: "CAP",
	},
	equilibra: {
		isNonstandard: "CAP",
		gen: 7,
		tier: "CAP",
	},
	pokestarsmeargle: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 60, "gender": "M", "abilities": ["owntempo"], "moves": ["mindreader", "guillotine", "tailwhip", "gastroacid"]},
			{"generation": 5, "level": 30, "gender": "M", "abilities": ["owntempo"], "moves": ["outrage", "magiccoat"]},
			{"generation": 5, "level": 99, "gender": "M", "abilities": ["owntempo"], "moves": ["nastyplot", "sheercold", "attract", "shadowball"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarufo: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 38, "moves": ["bubblebeam", "counter", "recover", "signalbeam"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarufo2: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 47, "moves": ["darkpulse", "flamethrower", "hyperbeam", "icebeam"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarbrycenman: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 56, "moves": ["icebeam", "nightshade", "psychic", "uturn"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarmt: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 63, "moves": ["earthquake", "ironhead", "spark", "surf"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarmt2: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 72, "moves": ["dragonpulse", "flamethrower", "metalburst", "thunderbolt"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestartransport: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 20, "moves": ["clearsmog", "flameburst", "discharge"]},
			{"generation": 5, "level": 50, "moves": ["iciclecrash", "overheat", "signalbeam"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestargiant: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 99, "moves": ["crushgrip", "focuspunch", "growl", "rage"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestargiant2: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 99, "moves": ["crushgrip", "doubleslap", "teeterdance", "stomp"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarhumanoid: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 20, "gender": "M", "moves": ["scratch", "shadowclaw", "acid"]},
			{"generation": 5, "level": 30, "gender": "M", "moves": ["darkpulse", "shadowclaw", "slash"]},
			{"generation": 5, "level": 20, "gender": "F", "moves": ["acid", "nightslash"]},
			{"generation": 5, "level": 20, "gender": "M", "moves": ["acid", "doubleedge"]},
			{"generation": 5, "level": 20, "gender": "F", "moves": ["acid", "rockslide"]},
			{"generation": 5, "level": 20, "gender": "M", "moves": ["acid", "thudnerpunch"]},
			{"generation": 5, "level": 20, "gender": "F", "moves": ["acid", "icepunch"]},
			{"generation": 5, "level": 40, "gender": "F", "moves": ["explosion", "selfdestruct"]},
			{"generation": 5, "level": 40, "gender": "F", "moves": ["shadowclaw", "scratch"]},
			{"generation": 5, "level": 40, "gender": "M", "moves": ["nightslash", "scratch"]},
			{"generation": 5, "level": 40, "gender": "M", "moves": ["doubleedge", "scratch"]},
			{"generation": 5, "level": 40, "gender": "F", "moves": ["rockslide", "scratch"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarmonster: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 50, "moves": ["darkpulse", "confusion"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarf00: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 10, "moves": ["teeterdance", "growl", "flail", "chatter"]},
			{"generation": 5, "level": 58, "moves": ["needlearm", "headsmash", "headbutt", "defensecurl"]},
			{"generation": 5, "level": 60, "moves": ["hammerarm", "perishsong", "ironhead", "thrash"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarf002: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 52, "moves": ["flareblitz", "ironhead", "psychic", "wildcharge"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarspirit: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 99, "moves": ["crunch", "dualchop", "slackoff", "swordsdance"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarblackdoor: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 53, "moves": ["luckychant", "amnesia", "ingrain", "rest"]},
			{"generation": 5, "level": 70, "moves": ["batonpass", "counter", "flamecharge", "toxic"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarwhitedoor: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 7, "moves": ["batonpass", "inferno", "mirrorcoat", "toxic"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarblackbelt: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 30, "moves": ["focuspunch", "machpunch", "taunt"]},
			{"generation": 5, "level": 40, "moves": ["machpunch", "hammerarm", "jumpkick"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestargiantpropo2: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 99, "moves": ["crushgrip", "doubleslap", "teeterdance", "stomp"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarufopropu2: {
		isNonstandard: "Custom",
		eventPokemon: [
			{"generation": 5, "level": 47, "moves": ["darkpulse", "flamethrower", "hyperbeam", "icebeam"]},
		],
		gen: 5,
		tier: "Illegal",
	},
};

exports.BattleFormatsData = BattleFormatsData;
