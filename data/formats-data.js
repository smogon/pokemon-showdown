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
		isUnreleased: true,
		tier: "Unreleased",
	},
	ivysaur: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	venusaur: {
		randomBattleMoves: ["sleeppowder", "leafstorm", "sludgebomb", "substitute", "leechseed"],
		randomDoubleBattleMoves: ["sleeppowder", "gigadrain", "hiddenpowerfire", "hiddenpowerice", "sludgebomb", "powerwhip", "protect"],
		eventPokemon: [
			{"generation": 6, "level": 100, "isHidden": true, "moves": ["solarbeam", "frenzyplant", "synthesis", "grasspledge"], "pokeball": "cherishball"},
		],
		isUnreleased: true,
		tier: "Unreleased",
	},
	venusaurmega: {
		randomBattleMoves: ["gigadrain", "sludgebomb", "hiddenpowerfire", "synthesis", "leechseed", "earthquake"],
		randomDoubleBattleMoves: ["sleeppowder", "gigadrain", "hiddenpowerfire", "hiddenpowerice", "sludgebomb", "powerwhip", "protect"],
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
		randomBattleMoves: ["holdhands", "fireblast", "airslash", "earthquake", "roost"],
		randomDoubleBattleMoves: ["heatwave", "fireblast", "airslash", "overheat", "dragonpulse", "roost", "tailwind", "protect"],
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
		tier: "New",
		doublesTier: "New",
	},
	charizardmegax: {
		randomBattleMoves: ["dragondance", "flareblitz", "dragonclaw", "earthquake", "roost", "willowisp"],
		randomDoubleBattleMoves: ["dragondance", "flareblitz", "dragonclaw", "earthquake", "rockslide", "roost", "substitute"],
		requiredItem: "Charizardite X",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	charizardmegay: {
		randomBattleMoves: ["fireblast", "airslash", "roost", "solarbeam", "focusblast", "dragonpulse"],
		randomDoubleBattleMoves: ["heatwave", "fireblast", "airslash", "roost", "solarbeam", "focusblast", "protect"],
		requiredItem: "Charizardite Y",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	charizardgigantamax: {
		tier: "New",
		doublesTier: "New",
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
		isUnreleased: true,
		tier: "Unreleased",
	},
	wartortle: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	blastoise: {
		randomBattleMoves: ["icebeam", "rapidspin", "scald", "toxic", "dragontail", "roar"],
		randomDoubleBattleMoves: ["muddywater", "icebeam", "hydropump", "fakeout", "scald", "followme", "icywind", "protect", "waterspout"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["protect", "raindance", "skullbash", "hydropump"], "pokeball": "pokeball"},
			{"generation": 6, "level": 100, "isHidden": true, "moves": ["hydropump", "hydrocannon", "irondefense", "waterpledge"], "pokeball": "cherishball"},
		],
		isUnreleased: true,
		tier: "Unreleased",
	},
	blastoisemega: {
		randomBattleMoves: ["icebeam", "hydropump", "rapidspin", "scald", "dragontail", "darkpulse", "aurasphere"],
		randomDoubleBattleMoves: ["muddywater", "icebeam", "hydropump", "fakeout", "scald", "darkpulse", "aurasphere", "followme", "icywind", "protect"],
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
		randomBattleMoves: ["sleeppowder", "quiverdance", "bugbuzz", "airslash", "energyball"],
		randomDoubleBattleMoves: ["quiverdance", "bugbuzz", "sleeppowder", "airslash", "shadowball", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 30, "moves": ["morningsun", "psychic", "sleeppowder", "aerialace"]},
		],
		encounters: [
			{"generation": 2, "level": 7},
			{"generation": 4, "level": 6},
			{"generation": 7, "level": 9},
		],
		isNonstandard: "Past",
		tier: "New",
		doublesTier: "New",
	},
	butterfreegigantamax: {
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["toxicspikes", "tailwind", "uturn", "endeavor", "poisonjab", "knockoff"],
		randomDoubleBattleMoves: ["xscissor", "uturn", "poisonjab", "drillrun", "brickbreak", "knockoff", "protect", "stringshot"],
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
		randomBattleMoves: ["xscissor", "swordsdance", "uturn", "poisonjab", "drillrun", "knockoff"],
		randomDoubleBattleMoves: ["xscissor", "uturn", "substitute", "poisonjab", "drillrun", "knockoff", "protect"],
		requiredItem: "Beedrillite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["roost", "bravebird", "heatwave", "return", "uturn", "defog"],
		randomDoubleBattleMoves: ["bravebird", "heatwave", "return", "doubleedge", "uturn", "tailwind", "protect"],
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
		randomBattleMoves: ["roost", "heatwave", "uturn", "hurricane", "defog"],
		randomDoubleBattleMoves: ["tailwind", "heatwave", "uturn", "hurricane", "protect"],
		requiredItem: "Pidgeotite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["protect", "facade", "stompingtantrum", "suckerpunch", "uturn", "swordsdance"],
		randomDoubleBattleMoves: ["facade", "stompingtantrum", "suckerpunch", "uturn", "crunch", "protect"],
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
		randomBattleMoves: ["swordsdance", "return", "suckerpunch", "knockoff", "doubleedge"],
		randomDoubleBattleMoves: ["doubleedge", "suckerpunch", "protect", "crunch", "uturn"],
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
		randomBattleMoves: ["return", "drillpeck", "doubleedge", "uturn", "pursuit", "drillrun"],
		randomDoubleBattleMoves: ["return", "drillpeck", "doubleedge", "uturn", "quickattack", "drillrun", "protect"],
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
		randomBattleMoves: ["coil", "gunkshot", "suckerpunch", "aquatail", "earthquake", "rest"],
		randomDoubleBattleMoves: ["gunkshot", "suckerpunch", "aquatail", "crunch", "earthquake", "rest", "rockslide", "protect"],
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
		tier: "Illegal",
		isNonstandard: 'Past',
	},
	pikachu: {
		randomBattleMoves: ["volttackle", "voltswitch", "grassknot", "hiddenpowerice", "knockoff", "irontail"],
		randomDoubleBattleMoves: ["fakeout", "thunderbolt", "volttackle", "voltswitch", "grassknot", "hiddenpowerice", "brickbreak", "extremespeed", "encore", "substitute", "knockoff", "protect", "discharge"],
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
		tier: "Illegal",
	},
	pikachurockstar: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "meteormash"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		tier: "Illegal",
	},
	pikachubelle: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "iciclecrash"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		tier: "Illegal",
	},
	pikachupopstar: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "drainingkiss"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		tier: "Illegal",
	},
	pikachuphd: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "electricterrain"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		tier: "Illegal",
	},
	pikachulibre: {
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "moves": ["quickattack", "electroball", "thunderwave", "flyingpress"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 6,
		tier: "Illegal",
	},
	pikachuoriginal: {
		eventPokemon: [
			{"generation": 7, "level": 1, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "thunder", "agility"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		tier: "New",
		doublesTier: "New",
	},
	pikachuhoenn: {
		eventPokemon: [
			{"generation": 7, "level": 6, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "thunder", "irontail"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		tier: "New",
		doublesTier: "New",
	},
	pikachusinnoh: {
		eventPokemon: [
			{"generation": 7, "level": 10, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "irontail", "volttackle"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		tier: "New",
		doublesTier: "New",
	},
	pikachuunova: {
		eventPokemon: [
			{"generation": 7, "level": 14, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "irontail", "volttackle"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		tier: "New",
		doublesTier: "New",
	},
	pikachukalos: {
		eventPokemon: [
			{"generation": 7, "level": 17, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "irontail", "electroball"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		tier: "New",
		doublesTier: "New",
	},
	pikachualola: {
		eventPokemon: [
			{"generation": 7, "level": 20, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "irontail", "electroball"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		tier: "New",
		doublesTier: "New",
	},
	pikachupartner: {
		eventPokemon: [
			{"generation": 7, "level": 21, "shiny": 1, "nature": "Hardy", "moves": ["thunderbolt", "quickattack", "thunder", "irontail"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		gen: 7,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pikachustarter: {
		eventPokemon: [
			{"generation": 7, "level": 5, "perfectIVs": 6, "moves": ["thundershock", "tailwhip", "growl"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		isNonstandard: "LGPE",
		tier: "Illegal",
	},
	pikachugigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	raichu: {
		randomBattleMoves: ["nastyplot", "encore", "thunderbolt", "grassknot", "hiddenpowerice", "focusblast", "voltswitch"],
		randomDoubleBattleMoves: ["fakeout", "encore", "thunderbolt", "grassknot", "hiddenpowerice", "focusblast", "voltswitch", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	raichualola: {
		randomBattleMoves: ["nastyplot", "thunderbolt", "psyshock", "focusblast", "voltswitch", "surf"],
		randomDoubleBattleMoves: ["thunderbolt", "fakeout", "encore", "psychic", "protect", "voltswitch"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["earthquake", "swordsdance", "rapidspin", "toxic", "stealthrock", "knockoff"],
		randomDoubleBattleMoves: ["earthquake", "rockslide", "stoneedge", "swordsdance", "xscissor", "knockoff", "protect"],
		encounters: [
			{"generation": 2, "level": 10},
			{"generation": 4, "level": 10},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sandslashalola: {
		randomBattleMoves: ["swordsdance", "iciclecrash", "ironhead", "earthquake", "rapidspin", "stealthrock", "knockoff"],
		randomDoubleBattleMoves: ["protect", "swordsdance", "iciclecrash", "ironhead", "earthquake", "rockslide"],
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
		randomBattleMoves: ["toxicspikes", "stealthrock", "fireblast", "icebeam", "earthpower", "sludgewave"],
		randomDoubleBattleMoves: ["protect", "fireblast", "icebeam", "earthpower", "sludgebomb", "thunderbolt"],
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
		randomBattleMoves: ["substitute", "fireblast", "icebeam", "earthpower", "sludgewave", "superpower"],
		randomDoubleBattleMoves: ["protect", "fireblast", "thunderbolt", "icebeam", "earthpower", "sludgebomb", "focusblast"],
		eventPokemon: [
			{"generation": 7, "level": 68, "isHidden": false, "abilities": ["poisonpoint"], "moves": ["earthquake", "poisonjab", "throatchop", "aquatail"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cleffa: {
		tier: "LC",
	},
	clefairy: {
		encounters: [
			{"generation": 1, "level": 8},
		],
		tier: "NFE",
	},
	clefable: {
		randomBattleMoves: ["calmmind", "softboiled", "fireblast", "moonblast", "stealthrock", "thunderwave"],
		randomDoubleBattleMoves: ["reflect", "thunderwave", "lightscreen", "safeguard", "fireblast", "followme", "protect", "moonblast", "dazzlinggleam", "softboiled"],
		tier: "New",
		doublesTier: "New",
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
		tier: "LC",
	},
	ninetales: {
		randomBattleMoves: ["fireblast", "willowisp", "solarbeam", "nastyplot", "substitute", "psyshock"],
		randomDoubleBattleMoves: ["heatwave", "fireblast", "willowisp", "solarbeam", "substitute", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "M", "nature": "Bold", "ivs": {"def": 31}, "isHidden": true, "moves": ["heatwave", "solarbeam", "psyshock", "willowisp"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	ninetalesalola: {
		randomBattleMoves: ["nastyplot", "blizzard", "moonblast", "substitute", "hiddenpowerfire", "freezedry", "auroraveil"],
		randomDoubleBattleMoves: ["blizzard", "moonblast", "protect", "hiddenpowerfire", "freezedry", "auroraveil", "encore"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["reflect", "lightscreen", "healbell", "stealthrock", "fireblast", "dazzlinggleam"],
		randomDoubleBattleMoves: ["thunderwave", "reflect", "lightscreen", "protect", "dazzlinggleam", "fireblast", "icebeam", "hypervoice"],
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
		randomBattleMoves: ["bravebird", "roost", "toxic", "taunt", "defog", "uturn", "superfang"],
		randomDoubleBattleMoves: ["bravebird", "taunt", "tailwind", "crosspoison", "uturn", "protect", "superfang"],
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
		randomBattleMoves: ["gigadrain", "sludgebomb", "sleeppowder", "hiddenpowerfire", "aromatherapy", "strengthsap"],
		randomDoubleBattleMoves: ["gigadrain", "sludgebomb", "sleeppowder", "stunspore", "protect", "hiddenpowerfire", "moonblast"],
		tier: "New",
		doublesTier: "New",
	},
	bellossom: {
		randomBattleMoves: ["gigadrain", "sleeppowder", "hiddenpowerfire", "hiddenpowerrock", "quiverdance", "moonblast"],
		randomDoubleBattleMoves: ["gigadrain", "sludgebomb", "sleeppowder", "stunspore", "protect", "hiddenpowerfire", "moonblast", "sunnyday", "solarbeam"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["spore", "substitute", "leechlife", "seedbomb", "leechseed", "knockoff"],
		randomDoubleBattleMoves: ["spore", "stunspore", "leechlife", "seedbomb", "ragepowder", "leechseed", "protect", "knockoff", "wideguard"],
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
		randomBattleMoves: ["sleeppowder", "quiverdance", "bugbuzz", "sludgebomb", "substitute"],
		randomDoubleBattleMoves: ["sleeppowder", "roost", "ragepowder", "quiverdance", "protect", "bugbuzz", "sludgebomb", "gigadrain", "substitute", "psychic"],
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
		tier: "LC",
	},
	dugtrio: {
		randomBattleMoves: ["earthquake", "stoneedge", "stealthrock", "suckerpunch", "reversal", "substitute", "memento"],
		randomDoubleBattleMoves: ["earthquake", "rockslide", "protect", "suckerpunch", "stoneedge"],
		eventPokemon: [
			{"generation": 3, "level": 40, "moves": ["charm", "earthquake", "sandstorm", "triattack"]},
		],
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 2, "level": 5},
			{"generation": 4, "level": 19},
		],
		tier: "New",
		doublesTier: "New",
	},
	dugtrioalola: {
		randomBattleMoves: ["earthquake", "ironhead", "substitute", "toxic", "stoneedge", "suckerpunch", "stealthrock"],
		randomDoubleBattleMoves: ["earthquake", "ironhead", "protect", "rockslide", "stoneedge", "suckerpunch"],
		tier: "New",
		doublesTier: "New",
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
		tier: "LC",
	},
	meowthgalar: {
		tier: "LC",
	},
	meowthgigantamax: {
		eventPokemon: [
			{"generation": 8, "level": 5, "shiny": false, "moves": ["fakeout", "growl", "slash", "payday"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	persian: {
		randomBattleMoves: ["fakeout", "uturn", "taunt", "return", "knockoff"],
		randomDoubleBattleMoves: ["fakeout", "uturn", "knockoff", "taunt", "return", "hypnosis", "feint", "protect"],
		encounters: [
			{"generation": 2, "level": 18},
			{"generation": 4, "level": 19},
		],
		tier: "New",
		doublesTier: "New",
	},
	persianalola: {
		randomBattleMoves: ["nastyplot", "darkpulse", "powergem", "hypnosis", "hiddenpowerfighting"],
		randomDoubleBattleMoves: ["fakeout", "foulplay", "darkpulse", "powergem", "snarl", "hiddenpowerfighting", "partingshot", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	perrserker: {
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["hydropump", "scald", "icebeam", "psyshock", "encore", "calmmind", "substitute"],
		randomDoubleBattleMoves: ["hydropump", "scald", "icebeam", "hiddenpowergrass", "focusblast", "encore", "psychic", "icywind", "protect"],
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
		randomBattleMoves: ["closecombat", "uturn", "icepunch", "stoneedge", "encore", "earthquake", "gunkshot"],
		randomDoubleBattleMoves: ["closecombat", "uturn", "icepunch", "rockslide", "punishment", "earthquake", "poisonjab", "protect", "taunt", "stoneedge"],
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
		randomBattleMoves: ["flareblitz", "wildcharge", "extremespeed", "closecombat", "morningsun", "willowisp", "toxic", "crunch", "roar"],
		randomDoubleBattleMoves: ["flareblitz", "wildcharge", "closecombat", "willowisp", "snarl", "protect", "extremespeed"],
		eventPokemon: [
			{"generation": 4, "level": 50, "abilities": ["intimidate"], "moves": ["flareblitz", "thunderfang", "crunch", "extremespeed"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "isHidden": false, "abilities": ["intimidate"], "moves": ["flareblitz", "extremespeed", "willowisp", "protect"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["hydropump", "focusblast", "icepunch", "rest", "sleeptalk", "scald", "circlethrow", "raindance"],
		randomDoubleBattleMoves: ["bellydrum", "encore", "waterfall", "protect", "icepunch", "earthquake", "brickbreak", "rockslide"],
		eventPokemon: [
			{"generation": 3, "level": 42, "moves": ["helpinghand", "hydropump", "raindance", "brickbreak"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	politoed: {
		randomBattleMoves: ["scald", "toxic", "encore", "perishsong", "protect", "hypnosis", "rest"],
		randomDoubleBattleMoves: ["scald", "hypnosis", "icywind", "encore", "helpinghand", "protect", "icebeam", "focusblast", "hydropump", "hiddenpowergrass"],
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
		randomBattleMoves: ["psyshock", "psychic", "focusblast", "shadowball", "hiddenpowerice", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["protect", "psychic", "psyshock", "focusblast", "shadowball", "encore", "substitute", "dazzlinggleam"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["futuresight", "calmmind", "psychic", "trick"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	alakazammega: {
		randomBattleMoves: ["calmmind", "psyshock", "focusblast", "shadowball", "encore", "substitute"],
		randomDoubleBattleMoves: ["protect", "psychic", "psyshock", "focusblast", "shadowball", "encore", "substitute", "dazzlinggleam"],
		requiredItem: "Alakazite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["dynamicpunch", "icepunch", "stoneedge", "bulletpunch", "knockoff", "substitute"],
		randomDoubleBattleMoves: ["dynamicpunch", "protect", "icepunch", "stoneedge", "rockslide", "bulletpunch", "knockoff", "wideguard"],
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
		tier: "New",
		doublesTier: "New",
	},
	machampgigantamax: {
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["sleeppowder", "sludgebomb", "gigadrain", "hiddenpowerfire", "suckerpunch", "swordsdance", "powerwhip", "knockoff"],
		randomDoubleBattleMoves: ["sleeppowder", "sunnyday", "growth", "solarbeam", "sludgebomb", "weatherball", "suckerpunch", "powerwhip", "knockoff", "protect"],
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
		randomBattleMoves: ["toxicspikes", "rapidspin", "scald", "sludgebomb", "acidspray", "knockoff"],
		randomDoubleBattleMoves: ["muddywater", "scald", "sludgebomb", "acidspray", "icebeam", "knockoff", "gigadrain", "protect", "dazzlinggleam"],
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
		randomBattleMoves: ["stealthrock", "earthquake", "explosion", "suckerpunch", "toxic", "rockblast"],
		randomDoubleBattleMoves: ["rockslide", "earthquake", "stoneedge", "suckerpunch", "hammerarm", "firepunch", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	golemalola: {
		randomBattleMoves: ["stealthrock", "stoneedge", "return", "thunderpunch", "earthquake", "toxic"],
		randomDoubleBattleMoves: ["doubleedge", "stoneedge", "rockslide", "earthquake", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	// TODO: Check Legality
	ponyta: {
		encounters: [
			{"generation": 1, "level": 28, "shiny": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ponytagalar: {
		tier: "LC",
	},
	// TODO: Check Legality
	rapidash: {
		randomBattleMoves: ["flareblitz", "wildcharge", "morningsun", "highhorsepower", "willowisp"],
		randomDoubleBattleMoves: ["flareblitz", "wildcharge", "protect", "hypnosis", "flamecharge", "megahorn", "drillrun", "willowisp"],
		eventPokemon: [
			{"generation": 3, "level": 40, "moves": ["batonpass", "solarbeam", "sunnyday", "flamethrower"]},
		],
		encounters: [
			{"generation": 2, "level": 14, "gender": "M", "shiny": false},
			{"generation": 3, "level": 37},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rapidashgalar: {
		tier: "New",
		doublesTier: "New",
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
		isNonstandard: "Past",
		tier: "Illegal",
	},
	slowbro: {
		randomBattleMoves: ["scald", "toxic", "thunderwave", "psyshock", "fireblast", "icebeam", "slackoff"],
		randomDoubleBattleMoves: ["scald", "fireblast", "icebeam", "psychic", "grassknot", "thunderwave", "slackoff", "trickroom", "protect", "psyshock"],
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
		randomBattleMoves: ["calmmind", "scald", "psyshock", "slackoff", "fireblast", "icebeam"],
		randomDoubleBattleMoves: ["scald", "fireblast", "icebeam", "psychic", "thunderwave", "slackoff", "trickroom", "protect", "psyshock"],
		requiredItem: "Slowbronite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	slowking: {
		randomBattleMoves: ["scald", "fireblast", "icebeam", "psychic", "grassknot", "thunderwave", "toxic", "slackoff", "trickroom", "nastyplot", "dragontail", "psyshock"],
		randomDoubleBattleMoves: ["scald", "fireblast", "icebeam", "psychic", "grassknot", "thunderwave", "slackoff", "trickroom", "protect", "psyshock"],
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
		randomBattleMoves: ["thunderbolt", "substitute", "flashcannon", "hiddenpowerfire", "voltswitch"],
		randomDoubleBattleMoves: ["thunderbolt", "substitute", "flashcannon", "hiddenpowerice", "voltswitch", "protect", "electroweb", "discharge", "hiddenpowerfire"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	// TODO: Check Legality
	farfetchd: {
		randomBattleMoves: ["bravebird", "swordsdance", "return", "leafblade", "roost", "knockoff"],
		randomDoubleBattleMoves: ["bravebird", "swordsdance", "return", "leafblade", "protect", "knockoff"],
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["yawn", "wish"], "pokeball": "pokeball"},
			{"generation": 3, "level": 36, "moves": ["batonpass", "slash", "swordsdance", "aerialace"]},
		],
		encounters: [
			{"generation": 1, "level": 3},
			{"generation": 3, "level": 3, "gender": "M", "nature": "Adamant", "ivs": {"hp": 20, "atk": 25, "def": 21, "spa": 24, "spd": 15, "spe": 20}, "abilities": ["keeneye"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	farfetchdgalar: {
		tier: "LC",
	},
	sirfetchd: {
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["bravebird", "return", "swordsdance", "roost", "quickattack", "knockoff", "jumpkick"],
		randomDoubleBattleMoves: ["bravebird", "return", "doubleedge", "quickattack", "knockoff", "protect"],
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
		randomBattleMoves: ["surf", "icebeam", "perishsong", "encore", "toxic", "protect"],
		randomDoubleBattleMoves: ["surf", "icebeam", "protect", "perishsong", "fakeout", "encore", "toxic"],
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
		randomBattleMoves: ["curse", "gunkshot", "poisonjab", "shadowsneak", "icepunch", "firepunch", "memento"],
		randomDoubleBattleMoves: ["gunkshot", "poisonjab", "shadowsneak", "protect", "icepunch", "firepunch", "brickbreak"],
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
		randomBattleMoves: ["curse", "gunkshot", "knockoff", "poisonjab", "shadowsneak", "pursuit", "icepunch", "firepunch"],
		randomDoubleBattleMoves: ["gunkshot", "knockoff", "stoneedge", "snarl", "protect", "poisonjab", "shadowsneak"],
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
		randomBattleMoves: ["shellsmash", "iciclespear", "hydropump", "rockblast", "iceshard", "spikes", "rapidspin"],
		randomDoubleBattleMoves: ["shellsmash", "hydropump", "liquidation", "rockblast", "iciclespear", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 30, "gender": "M", "nature": "Naughty", "isHidden": false, "abilities": ["skilllink"], "moves": ["iciclespear", "rockblast", "hiddenpower", "razorshell"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	gastly: {
		encounters: [
			{"generation": 1, "level": 18, "shiny": false},
		],
		tier: "LC",
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
		randomBattleMoves: ["shadowball", "sludgewave", "focusblast", "substitute", "disable", "painsplit", "willowisp"],
		randomDoubleBattleMoves: ["shadowball", "sludgebomb", "focusblast", "substitute", "disable", "taunt", "hypnosis", "willowisp", "dazzlinggleam", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 23, "gender": "F", "nature": "Hardy", "ivs": {"hp": 19, "atk": 14, "def": 0, "spa": 14, "spd": 17, "spe": 27}, "moves": ["spite", "curse", "nightshade", "confuseray"], "pokeball": "pokeball"},
			{"generation": 6, "level": 25, "nature": "Timid", "moves": ["psychic", "confuseray", "suckerpunch", "shadowpunch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 25, "moves": ["nightshade", "confuseray", "suckerpunch", "shadowpunch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "moves": ["shadowball", "sludgebomb", "willowisp", "destinybond"], "pokeball": "cherishball"},
			{"generation": 6, "level": 25, "shiny": true, "moves": ["shadowball", "sludgewave", "confuseray", "astonish"], "pokeball": "duskball"},
			{"generation": 6, "level": 50, "shiny": true, "gender": "M", "moves": ["meanlook", "hypnosis", "psychic", "hyperbeam"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["meanlook", "hypnosis", "psychic", "hyperbeam"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	gengarmega: {
		randomBattleMoves: ["shadowball", "sludgewave", "focusblast", "taunt", "destinybond", "disable", "perishsong", "protect"],
		randomDoubleBattleMoves: ["shadowball", "sludgebomb", "focusblast", "substitute", "disable", "taunt", "hypnosis", "willowisp", "dazzlinggleam", "protect"],
		requiredItem: "Gengarite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gengargigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	onix: {
		encounters: [
			{"generation": 1, "level": 13, "shiny": false},
		],
		tier: "LC",
	},
	steelix: {
		randomBattleMoves: ["stealthrock", "earthquake", "ironhead", "roar", "toxic", "rockslide"],
		randomDoubleBattleMoves: ["stealthrock", "earthquake", "ironhead", "rockslide", "protect", "explosion", "wideguard"],
		tier: "New",
		doublesTier: "New",
	},
	steelixmega: {
		randomBattleMoves: ["stealthrock", "earthquake", "heavyslam", "roar", "toxic", "dragontail"],
		randomDoubleBattleMoves: ["stealthrock", "earthquake", "heavyslam", "rockslide", "protect", "explosion"],
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
		randomBattleMoves: ["psychic", "seismictoss", "foulplay", "wish", "protect", "thunderwave", "toxic"],
		randomDoubleBattleMoves: ["psychic", "seismictoss", "thunderwave", "wish", "protect", "hypnosis", "trickroom", "dazzlinggleam", "foulplay"],
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
		randomBattleMoves: ["liquidation", "xscissor", "rockslide", "swordsdance", "agility", "superpower", "knockoff"],
		randomDoubleBattleMoves: ["liquidation", "xscissor", "rockslide", "substitute", "superpower", "knockoff", "protect", "wideguard"],
		encounters: [
			{"generation": 1, "level": 15},
			{"generation": 3, "level": 25},
			{"generation": 4, "level": 22},
		],
		tier: "New",
		doublesTier: "New",
	},
	kinglergigantamax: {
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["voltswitch", "thunderbolt", "taunt", "foulplay", "hiddenpowergrass", "signalbeam"],
		randomDoubleBattleMoves: ["voltswitch", "discharge", "taunt", "foulplay", "hiddenpowerice", "protect", "thunderwave"],
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
		randomBattleMoves: ["substitute", "leechseed", "gigadrain", "psychic", "sleeppowder", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["substitute", "leechseed", "gigadrain", "psychic", "sleeppowder", "hiddenpowerfire", "protect", "trickroom", "psyshock"],
		eventPokemon: [
			{"generation": 3, "level": 46, "moves": ["refresh", "psychic", "hypnosis", "ancientpower"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	exeggutoralola: {
		randomBattleMoves: ["dracometeor", "leafstorm", "flamethrower", "gigadrain", "trickroom"],
		randomDoubleBattleMoves: ["dracometeor", "leafstorm", "protect", "flamethrower", "trickroom", "woodhammer", "dragonhammer"],
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
		randomBattleMoves: ["bonemerang", "earthquake", "knockoff", "doubleedge", "stoneedge", "stealthrock", "substitute"],
		randomDoubleBattleMoves: ["substitute", "bonemerang", "doubleedge", "rockslide", "firepunch", "earthquake", "protect", "swordsdance"],
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
		randomBattleMoves: ["flamecharge", "shadowbone", "bonemerang", "willowisp", "stoneedge", "flareblitz", "substitute"],
		randomDoubleBattleMoves: ["shadowbone", "bonemerang", "willowisp", "stoneedge", "flareblitz", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	marowakalolatotem: {
		eventPokemon: [
			{"generation": 7, "level": 25, "perfectIVs": 3, "moves": ["leer", "hex", "bonemerang", "willowisp"], "pokeball": "pokeball"},
		],
		eventOnly: true,
	},
	tyrogue: {
		tier: "LC",
	},
	hitmonlee: {
		randomBattleMoves: ["highjumpkick", "knockoff", "stoneedge", "rapidspin", "machpunch", "poisonjab", "fakeout"],
		randomDoubleBattleMoves: ["knockoff", "rockslide", "machpunch", "fakeout", "highjumpkick", "earthquake", "blazekick", "wideguard", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 38, "abilities": ["limber"], "moves": ["refresh", "highjumpkick", "mindreader", "megakick"]},
		],
		encounters: [
			{"generation": 1, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	hitmonchan: {
		randomBattleMoves: ["bulkup", "drainpunch", "icepunch", "firepunch", "machpunch", "rapidspin"],
		randomDoubleBattleMoves: ["fakeout", "drainpunch", "icepunch", "firepunch", "machpunch", "earthquake", "rockslide", "protect", "thunderpunch"],
		eventPokemon: [
			{"generation": 3, "level": 38, "abilities": ["keeneye"], "moves": ["helpinghand", "skyuppercut", "mindreader", "megapunch"]},
		],
		encounters: [
			{"generation": 1, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	hitmontop: {
		randomBattleMoves: ["suckerpunch", "stoneedge", "rapidspin", "closecombat", "toxic"],
		randomDoubleBattleMoves: ["fakeout", "feint", "suckerpunch", "closecombat", "helpinghand", "machpunch", "wideguard"],
		eventPokemon: [
			{"generation": 5, "level": 55, "gender": "M", "nature": "Adamant", "isHidden": false, "abilities": ["intimidate"], "moves": ["fakeout", "closecombat", "suckerpunch", "helpinghand"]},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["wish", "protect", "bodyslam", "knockoff", "dragontail", "healbell", "swordsdance", "explosion", "earthquake", "powerwhip"],
		randomDoubleBattleMoves: ["wish", "protect", "dragontail", "knockoff", "bodyslam", "rockslide", "powerwhip", "earthquake", "explosion"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	koffing: {
		encounters: [
			{"generation": 1, "level": 30, "shiny": false},
		],
		tier: "LC",
	},
	// TODO: Check Legality
	weezing: {
		randomBattleMoves: ["painsplit", "sludgebomb", "willowisp", "fireblast", "protect", "toxicspikes"],
		randomDoubleBattleMoves: ["protect", "sludgebomb", "willowisp", "fireblast", "toxic", "painsplit", "thunderbolt", "explosion"],
		encounters: [
			{"generation": 2, "level": 16},
			{"generation": 3, "level": 32},
			{"generation": 4, "level": 15, "pokeball": "safariball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	weezinggalar: {
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["stoneedge", "earthquake", "icepunch", "megahorn", "stealthrock", "rockblast", "rockpolish", "dragontail"],
		randomDoubleBattleMoves: ["stoneedge", "earthquake", "hammerarm", "megahorn", "stealthrock", "rockslide", "icepunch", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	happiny: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	chansey: {
		randomBattleMoves: ["softboiled", "healbell", "stealthrock", "thunderwave", "toxic", "seismictoss", "wish"],
		randomDoubleBattleMoves: ["aromatherapy", "toxic", "thunderwave", "helpinghand", "softboiled", "lightscreen", "seismictoss", "protect", "wish"],
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
		randomBattleMoves: ["toxic", "flamethrower", "seismictoss", "softboiled", "healbell", "protect", "thunderwave", "stealthrock"],
		randomDoubleBattleMoves: ["wish", "softboiled", "protect", "toxic", "aromatherapy", "seismictoss", "helpinghand", "thunderwave", "flamethrower", "icebeam"],
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
		randomBattleMoves: ["gigadrain", "leafstorm", "knockoff", "earthquake", "hiddenpowerfire", "rockslide", "sleeppowder", "synthesis"],
		randomDoubleBattleMoves: ["gigadrain", "sleeppowder", "hiddenpowerice", "leechseed", "knockoff", "ragepowder", "focusblast", "protect", "powerwhip", "earthquake"],
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "M", "nature": "Brave", "moves": ["sunnyday", "morningsun", "ancientpower", "naturalgift"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kangaskhan: {
		randomBattleMoves: ["return", "suckerpunch", "earthquake", "drainpunch", "crunch", "fakeout"],
		randomDoubleBattleMoves: ["fakeout", "return", "suckerpunch", "earthquake", "doubleedge", "drainpunch", "crunch", "protect"],
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
		randomBattleMoves: ["fakeout", "seismictoss", "bodyslam", "suckerpunch", "crunch"],
		randomDoubleBattleMoves: ["fakeout", "return", "suckerpunch", "earthquake", "doubleedge", "poweruppunch", "drainpunch", "crunch", "protect"],
		requiredItem: "Kangaskhanite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["raindance", "hydropump", "dracometeor", "icebeam", "waterfall"],
		randomDoubleBattleMoves: ["hydropump", "icebeam", "raindance", "dracometeor", "dragonpulse", "muddywater", "protect"],
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
		tier: "LC",
	},
	seaking: {
		randomBattleMoves: ["waterfall", "megahorn", "knockoff", "drillrun", "scald", "icebeam"],
		randomDoubleBattleMoves: ["waterfall", "surf", "megahorn", "knockoff", "drillrun", "icebeam", "icywind", "protect"],
		encounters: [
			{"generation": 1, "level": 23},
			{"generation": 2, "level": 10},
			{"generation": 3, "level": 20},
			{"generation": 4, "level": 10},
			{"generation": 6, "level": 26, "maxEggMoves": 1},
			{"generation": 7, "level": 10},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["thunderbolt", "icebeam", "rapidspin", "recover", "psyshock", "scald", "hydropump"],
		randomDoubleBattleMoves: ["surf", "thunderbolt", "icebeam", "protect", "recover", "psychic", "psyshock", "scald", "hydropump"],
		eventPokemon: [
			{"generation": 3, "level": 41, "moves": ["refresh", "waterfall", "icebeam", "recover"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mimejr: {
		tier: "LC",
	},
	// TODO: Check Legality
	mrmime: {
		randomBattleMoves: ["nastyplot", "psyshock", "dazzlinggleam", "shadowball", "focusblast", "healingwish", "encore"],
		randomDoubleBattleMoves: ["fakeout", "thunderwave", "hiddenpowerfighting", "psychic", "thunderbolt", "encore", "icywind", "protect", "wideguard", "dazzlinggleam", "followme"],
		eventPokemon: [
			{"generation": 3, "level": 42, "abilities": ["soundproof"], "moves": ["followme", "psychic", "encore", "thunderpunch"]},
		],
		encounters: [
			{"generation": 1, "level": 6},
		],
		tier: "New",
		doublesTier: "New",
	},
	mrmimegalar: {
		tier: "NFE",
	},
	mrrime: {
		tier: "New",
		doublesTier: "New",
	},
	scyther: {
		randomBattleMoves: ["swordsdance", "roost", "bugbite", "quickattack", "brickbreak", "aerialace", "uturn", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "protect", "bugbite", "quickattack", "brickbreak", "aerialace", "feint", "uturn", "knockoff"],
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
		randomBattleMoves: ["swordsdance", "bulletpunch", "bugbite", "superpower", "uturn", "pursuit", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "roost", "bulletpunch", "bugbite", "superpower", "uturn", "protect", "feint", "knockoff"],
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
		randomBattleMoves: ["swordsdance", "roost", "bulletpunch", "bugbite", "superpower", "uturn", "defog", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "roost", "bulletpunch", "bugbite", "superpower", "uturn", "protect", "feint", "knockoff"],
		requiredItem: "Scizorite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	smoochum: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	jynx: {
		randomBattleMoves: ["icebeam", "psychic", "focusblast", "trick", "nastyplot", "lovelykiss", "substitute", "psyshock"],
		randomDoubleBattleMoves: ["icebeam", "psychic", "hiddenpowerfighting", "shadowball", "protect", "lovelykiss", "substitute", "psyshock"],
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
		randomBattleMoves: ["wildcharge", "crosschop", "icepunch", "flamethrower", "earthquake", "voltswitch"],
		randomDoubleBattleMoves: ["wildcharge", "crosschop", "icepunch", "substitute", "flamethrower", "earthquake", "protect", "followme"],
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
		randomBattleMoves: ["fireblast", "focusblast", "hiddenpowergrass", "hiddenpowerice", "thunderbolt", "earthquake", "substitute"],
		randomDoubleBattleMoves: ["fireblast", "taunt", "focusblast", "hiddenpowergrass", "hiddenpowerice", "thunderbolt", "heatwave", "willowisp", "protect", "followme"],
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "F", "nature": "Modest", "moves": ["flamethrower", "psychic", "hyperbeam", "solarbeam"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Hardy", "moves": ["confuseray", "firepunch", "lavaplume", "flamethrower"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pinsir: {
		randomBattleMoves: ["earthquake", "xscissor", "closecombat", "stoneedge", "stealthrock", "knockoff"],
		randomDoubleBattleMoves: ["protect", "swordsdance", "xscissor", "earthquake", "closecombat", "substitute", "rockslide"],
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
		randomBattleMoves: ["swordsdance", "earthquake", "closecombat", "quickattack", "return"],
		randomDoubleBattleMoves: ["feint", "protect", "swordsdance", "earthquake", "closecombat", "substitute", "quickattack", "return", "rockslide"],
		requiredItem: "Pinsirite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tauros: {
		randomBattleMoves: ["bodyslam", "earthquake", "zenheadbutt", "rockslide", "doubleedge"],
		randomDoubleBattleMoves: ["return", "earthquake", "zenheadbutt", "rockslide", "stoneedge", "protect", "doubleedge"],
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
		randomBattleMoves: ["dragondance", "waterfall", "earthquake", "bounce", "dragontail", "stoneedge", "substitute"],
		randomDoubleBattleMoves: ["dragondance", "waterfall", "earthquake", "bounce", "taunt", "protect", "thunderwave", "stoneedge", "substitute", "icefang"],
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
		tier: "New",
		doublesTier: "New",
	},
	gyaradosmega: {
		randomBattleMoves: ["dragondance", "waterfall", "earthquake", "substitute", "icefang", "crunch"],
		randomDoubleBattleMoves: ["dragondance", "waterfall", "earthquake", "bounce", "taunt", "protect", "thunderwave", "stoneedge", "substitute", "icefang", "crunch"],
		requiredItem: "Gyaradosite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lapras: {
		randomBattleMoves: ["icebeam", "thunderbolt", "healbell", "toxic", "hydropump", "substitute"],
		randomDoubleBattleMoves: ["icebeam", "thunderbolt", "hydropump", "surf", "substitute", "protect", "iceshard", "icywind"],
		eventPokemon: [
			{"generation": 3, "level": 44, "moves": ["hydropump", "raindance", "blizzard", "healbell"]},
		],
		encounters: [
			{"generation": 1, "level": 15},
		],
		tier: "New",
		doublesTier: "New",
	},
	laprasgigantamax: {
		tier: "New",
		doublesTier: "New",
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
		tier: "New",
		doublesTier: "New",
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
	eeveegigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	vaporeon: {
		randomBattleMoves: ["wish", "protect", "scald", "roar", "icebeam", "healbell"],
		randomDoubleBattleMoves: ["helpinghand", "wish", "protect", "scald", "muddywater", "icebeam", "toxic", "hydropump"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "watergun"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["scald", "icebeam", "raindance", "rest"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	jolteon: {
		randomBattleMoves: ["thunderbolt", "voltswitch", "hiddenpowerice", "shadowball", "signalbeam"],
		randomDoubleBattleMoves: ["thunderbolt", "voltswitch", "hiddenpowergrass", "hiddenpowerice", "helpinghand", "protect", "substitute", "signalbeam"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "thundershock"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": false, "moves": ["thunderbolt", "shadowball", "lightscreen", "voltswitch"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	flareon: {
		randomBattleMoves: ["flamecharge", "facade", "flareblitz", "superpower", "quickattack"],
		randomDoubleBattleMoves: ["flamecharge", "facade", "flareblitz", "superpower", "wish", "protect", "helpinghand"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "ember"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["flareblitz", "facade", "willowisp", "quickattack"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	espeon: {
		randomBattleMoves: ["psychic", "psyshock", "substitute", "shadowball", "calmmind", "morningsun", "dazzlinggleam"],
		randomDoubleBattleMoves: ["psychic", "psyshock", "substitute", "wish", "shadowball", "hiddenpowerfighting", "helpinghand", "protect", "dazzlinggleam"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["psybeam", "psychup", "psychic", "morningsun"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "confusion"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["psychic", "dazzlinggleam", "shadowball", "reflect"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	umbreon: {
		randomBattleMoves: ["wish", "protect", "healbell", "toxic", "foulplay"],
		randomDoubleBattleMoves: ["moonlight", "wish", "protect", "healbell", "snarl", "foulplay", "helpinghand"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["feintattack", "meanlook", "screech", "moonlight"], "pokeball": "pokeball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "pursuit"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": false, "moves": ["snarl", "toxic", "protect", "moonlight"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	leafeon: {
		randomBattleMoves: ["swordsdance", "leafblade", "healbell", "xscissor", "synthesis", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "leafblade", "substitute", "xscissor", "protect", "helpinghand", "knockoff"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "razorleaf"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["leafblade", "swordsdance", "sunnyday", "synthesis"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	glaceon: {
		randomBattleMoves: ["icebeam", "hiddenpowerground", "shadowball", "healbell", "wish", "protect", "toxic"],
		randomDoubleBattleMoves: ["icebeam", "hiddenpowerground", "shadowball", "wish", "protect", "healbell", "helpinghand"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["tailwhip", "tackle", "helpinghand", "sandattack"]},
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "tailwhip", "sandattack", "icywind"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": false, "moves": ["blizzard", "shadowball", "hail", "auroraveil"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	sylveon: {
		randomBattleMoves: ["hypervoice", "calmmind", "psyshock", "hiddenpowerfire", "wish", "protect"],
		randomDoubleBattleMoves: ["hypervoice", "calmmind", "wish", "protect", "psyshock", "helpinghand", "shadowball", "hiddenpowerground"],
		eventPokemon: [
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["celebrate", "helpinghand", "sandattack", "fairywind"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "gender": "F", "isHidden": false, "moves": ["disarmingvoice", "babydolleyes", "quickattack", "drainingkiss"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["hyperbeam", "drainingkiss", "psyshock", "calmmind"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["triattack", "icebeam", "discharge", "recover", "toxic"],
		randomDoubleBattleMoves: ["triattack", "icebeam", "discharge", "shadowball", "thunderbolt", "protect", "recover"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	porygonz: {
		randomBattleMoves: ["triattack", "shadowball", "icebeam", "thunderbolt", "trick", "nastyplot"],
		randomDoubleBattleMoves: ["protect", "triattack", "darkpulse", "hiddenpowerfighting", "icebeam", "thunderbolt", "agility", "trick", "nastyplot"],
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
		randomBattleMoves: ["shellsmash", "scald", "icebeam", "earthpower", "spikes", "stealthrock", "hydropump"],
		randomDoubleBattleMoves: ["shellsmash", "muddywater", "icebeam", "earthpower", "hiddenpowerelectric", "protect", "hydropump"],
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
		randomBattleMoves: ["aquajet", "stoneedge", "rapidspin", "swordsdance", "liquidation", "knockoff"],
		randomDoubleBattleMoves: ["aquajet", "stoneedge", "protect", "rockslide", "swordsdance", "liquidation", "superpower", "knockoff"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	aerodactyl: {
		randomBattleMoves: ["stealthrock", "taunt", "defog", "roost", "stoneedge", "earthquake", "doubleedge", "pursuit"],
		randomDoubleBattleMoves: ["wideguard", "taunt", "stoneedge", "rockslide", "earthquake", "aquatail", "protect", "icefang", "skydrop", "tailwind"],
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
		randomBattleMoves: ["honeclaws", "stoneedge", "aerialace", "aquatail", "earthquake", "firefang", "roost"],
		randomDoubleBattleMoves: ["wideguard", "taunt", "stoneedge", "rockslide", "earthquake", "ironhead", "aerialace", "protect", "icefang", "skydrop", "tailwind"],
		requiredItem: "Aerodactylite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["rest", "curse", "sleeptalk", "bodyslam", "earthquake", "return", "firepunch", "crunch", "pursuit", "whirlwind"],
		randomDoubleBattleMoves: ["curse", "protect", "bodyslam", "earthquake", "return", "firepunch", "icepunch", "crunch", "selfdestruct"],
		eventPokemon: [
			{"generation": 3, "level": 43, "moves": ["refresh", "fissure", "curse", "bodyslam"]},
			{"generation": 7, "level": 30, "isHidden": false, "abilities": ["thickfat"], "moves": ["sunnyday", "block", "bodyslam", "celebrate"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 1, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	snorlaxgigantamax: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	articuno: {
		randomBattleMoves: ["icebeam", "roost", "freezedry", "toxic", "substitute", "hurricane"],
		randomDoubleBattleMoves: ["freezedry", "roost", "protect", "substitute", "hurricane", "tailwind"],
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
		randomBattleMoves: ["thunderbolt", "heatwave", "hiddenpowerice", "roost", "toxic", "uturn", "defog"],
		randomDoubleBattleMoves: ["thunderbolt", "heatwave", "hiddenpowergrass", "hiddenpowerice", "tailwind", "protect", "discharge"],
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
		randomBattleMoves: ["fireblast", "roost", "substitute", "toxic", "willowisp", "hurricane"],
		randomDoubleBattleMoves: ["fireblast", "airslash", "roost", "substitute", "protect", "uturn", "willowisp", "hurricane", "heatwave", "tailwind"],
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
		randomBattleMoves: ["dragondance", "outrage", "fly", "firepunch", "extremespeed", "earthquake", "roost"],
		randomDoubleBattleMoves: ["dragondance", "firepunch", "extremespeed", "dragonclaw", "earthquake", "roost", "substitute", "superpower", "dracometeor", "protect", "skydrop"],
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
		randomBattleMoves: ["psystrike", "aurasphere", "fireblast", "icebeam", "calmmind", "recover"],
		randomDoubleBattleMoves: ["psystrike", "aurasphere", "fireblast", "icebeam", "calmmind", "substitute", "recover", "thunderbolt", "willowisp", "taunt", "protect"],
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
		isUnreleased: true,
		tier: "Unreleased",
	},
	mewtwomegax: {
		randomBattleMoves: ["bulkup", "drainpunch", "zenheadbutt", "stoneedge", "taunt", "icebeam"],
		randomDoubleBattleMoves: ["bulkup", "drainpunch", "earthquake", "taunt", "stoneedge", "zenheadbutt", "icebeam"],
		requiredItem: "Mewtwonite X",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mewtwomegay: {
		randomBattleMoves: ["psystrike", "aurasphere", "shadowball", "fireblast", "icebeam", "calmmind", "recover", "willowisp", "taunt"],
		randomDoubleBattleMoves: ["psystrike", "aurasphere", "shadowball", "fireblast", "icebeam", "calmmind", "recover", "willowisp", "taunt"],
		requiredItem: "Mewtwonite Y",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mew: {
		randomBattleMoves: ["defog", "roost", "willowisp", "knockoff", "taunt", "icebeam", "earthpower", "aurasphere", "stealthrock", "nastyplot", "psyshock"],
		randomDoubleBattleMoves: ["taunt", "willowisp", "transform", "roost", "psyshock", "nastyplot", "aurasphere", "fireblast", "icebeam", "thunderbolt", "protect", "fakeout", "helpinghand", "tailwind"],
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
			{"generation": 8, "level": 1, "perfectIVs": 6, "moves": ["pound"], "pokeball": "pokeball"},
		],
		eventOnly: true,
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["reflect", "lightscreen", "aromatherapy", "leechseed", "toxic", "gigadrain", "synthesis", "dragontail"],
		randomDoubleBattleMoves: ["reflect", "lightscreen", "leechseed", "leafstorm", "gigadrain", "synthesis", "dragontail", "healpulse", "toxic", "protect"],
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
		randomBattleMoves: ["eruption", "fireblast", "hiddenpowergrass", "extrasensory", "focusblast"],
		randomDoubleBattleMoves: ["eruption", "fireblast", "hiddenpowergrass", "extrasensory", "focusblast", "heatwave", "protect"],
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
		randomBattleMoves: ["aquajet", "liquidation", "crunch", "icepunch", "dragondance", "swordsdance", "earthquake"],
		randomDoubleBattleMoves: ["aquajet", "liquidation", "crunch", "icepunch", "dragondance", "swordsdance", "earthquake", "protect"],
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
		randomBattleMoves: ["uturn", "trick", "aquatail", "firepunch", "knockoff", "doubleedge"],
		randomDoubleBattleMoves: ["uturn", "suckerpunch", "icepunch", "firepunch", "knockoff", "doubleedge", "superfang", "followme", "helpinghand", "protect"],
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
		tier: "New",
	},
	noctowl: {
		randomBattleMoves: ["roost", "whirlwind", "nightshade", "toxic", "defog", "hurricane", "heatwave"],
		randomDoubleBattleMoves: ["roost", "tailwind", "airslash", "hypervoice", "heatwave", "protect", "hypnosis"],
		encounters: [
			{"generation": 2, "level": 7},
			{"generation": 4, "level": 5},
			{"generation": 7, "level": 19},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["roost", "lightscreen", "encore", "reflect", "knockoff", "toxic", "uturn"],
		randomDoubleBattleMoves: ["protect", "lightscreen", "encore", "reflect", "knockoff", "bugbuzz", "uturn", "tailwind"],
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
		randomBattleMoves: ["megahorn", "toxicspikes", "poisonjab", "suckerpunch", "stickyweb"],
		randomDoubleBattleMoves: ["protect", "megahorn", "stringshot", "poisonjab", "stickyweb", "ragepowder"],
		encounters: [
			{"generation": 2, "level": 7},
			{"generation": 4, "level": 5},
			{"generation": 6, "level": 19, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	chinchou: {
		tier: "LC",
	},
	lanturn: {
		randomBattleMoves: ["voltswitch", "hiddenpowergrass", "hydropump", "icebeam", "thunderwave", "scald", "thunderbolt", "healbell", "toxic"],
		randomDoubleBattleMoves: ["thunderbolt", "hiddenpowergrass", "hydropump", "icebeam", "thunderwave", "scald", "discharge", "protect", "surf"],
		encounters: [
			{"generation": 4, "level": 20},
			{"generation": 6, "level": 26, "maxEggMoves": 1},
			{"generation": 7, "level": 10},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["roost", "thunderwave", "nastyplot", "airslash", "aurasphere", "healbell", "defog"],
		randomDoubleBattleMoves: ["roost", "thunderwave", "nastyplot", "airslash", "followme", "dazzlinggleam", "tailwind", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["extremespeed", "aurasphere", "airslash", "present"]},
		],
		tier: "New",
		doublesTier: "New",
	},
	natu: {
		eventPokemon: [
			{"generation": 3, "level": 22, "moves": ["batonpass", "futuresight", "nightshade", "aerialace"]},
		],
		tier: "LC",
	},
	xatu: {
		randomBattleMoves: ["thunderwave", "toxic", "roost", "psychic", "uturn", "reflect", "calmmind", "heatwave"],
		randomDoubleBattleMoves: ["thunderwave", "tailwind", "roost", "psychic", "uturn", "reflect", "lightscreen", "grassknot", "heatwave", "protect"],
		encounters: [
			{"generation": 2, "level": 15, "shiny": false},
			{"generation": 4, "level": 16, "shiny": false, "gender": "M", "nature": "Modest", "ivs": {"hp": 15, "atk": 20, "def": 15, "spa": 20, "spd": 20, "spe": 20}, "abilities": ["synchronize"], "pokeball": "pokeball"},
			{"generation": 6, "level": 24, "maxEggMoves": 1},
			{"generation": 7, "level": 21},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["voltswitch", "reflect", "lightscreen", "focusblast", "thunderbolt", "toxic", "healbell", "hiddenpowerice"],
		randomDoubleBattleMoves: ["focusblast", "hiddenpowerice", "hiddenpowergrass", "thunderbolt", "discharge", "dragonpulse", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	ampharosmega: {
		randomBattleMoves: ["voltswitch", "focusblast", "agility", "thunderbolt", "healbell", "dragonpulse"],
		randomDoubleBattleMoves: ["focusblast", "hiddenpowerice", "hiddenpowergrass", "thunderbolt", "discharge", "dragonpulse", "protect"],
		requiredItem: "Ampharosite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["liquidation", "aquajet", "playrough", "superpower", "bellydrum", "knockoff"],
		randomDoubleBattleMoves: ["waterfall", "aquajet", "playrough", "superpower", "bellydrum", "knockoff", "protect"],
		encounters: [
			{"generation": 5, "level": 5, "isHidden": false},
			{"generation": 6, "level": 16, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	bonsly: {
		tier: "LC",
	},
	sudowoodo: {
		randomBattleMoves: ["headsmash", "earthquake", "suckerpunch", "woodhammer", "toxic", "stealthrock"],
		randomDoubleBattleMoves: ["headsmash", "earthquake", "suckerpunch", "woodhammer", "explosion", "stealthrock", "rockslide", "helpinghand", "protect"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["swordsdance", "sleeppowder", "uturn", "encore", "toxic", "acrobatics", "leechseed", "seedbomb", "substitute", "strengthsap"],
		randomDoubleBattleMoves: ["encore", "sleeppowder", "uturn", "helpinghand", "leechseed", "gigadrain", "ragepowder", "protect", "strengthsap"],
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
		randomBattleMoves: ["fakeout", "return", "knockoff", "uturn", "switcheroo", "seedbomb", "lowkick"],
		randomDoubleBattleMoves: ["fakeout", "return", "knockoff", "uturn", "doublehit", "icepunch", "lowkick", "protect"],
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
		randomBattleMoves: ["sunnyday", "gigadrain", "solarbeam", "hiddenpowerfire", "earthpower"],
		randomDoubleBattleMoves: ["sunnyday", "gigadrain", "solarbeam", "hiddenpowerfire", "hiddenpowerice", "earthpower", "protect", "encore"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	yanma: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	yanmega: {
		randomBattleMoves: ["bugbuzz", "airslash", "uturn", "protect", "gigadrain"],
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
		randomBattleMoves: ["recover", "earthquake", "scald", "toxic", "encore", "icebeam"],
		randomDoubleBattleMoves: ["icywind", "earthquake", "waterfall", "scald", "rockslide", "curse", "yawn", "icepunch", "protect"],
		encounters: [
			{"generation": 2, "level": 15},
			{"generation": 4, "level": 10},
		],
		tier: "New",
		doublesTier: "New",
	},
	murkrow: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["insomnia"], "moves": ["peck", "astonish"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	honchkrow: {
		randomBattleMoves: ["superpower", "suckerpunch", "bravebird", "roost", "heatwave", "pursuit"],
		randomDoubleBattleMoves: ["superpower", "suckerpunch", "bravebird", "roost", "heatwave", "protect"],
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
		randomBattleMoves: ["nastyplot", "substitute", "willowisp", "shadowball", "thunderbolt", "dazzlinggleam", "taunt", "painsplit", "destinybond"],
		randomDoubleBattleMoves: ["nastyplot", "substitute", "willowisp", "shadowball", "thunderbolt", "dazzlinggleam", "taunt", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	unown: {
		randomBattleMoves: ["hiddenpowerpsychic"],
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
		randomBattleMoves: ["counter", "mirrorcoat", "encore", "destinybond", "safeguard"],
		randomDoubleBattleMoves: ["counter", "mirrorcoat", "encore", "destinybond", "safeguard"],
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
		tier: "New",
		doublesTier: "New",
	},
	girafarig: {
		randomBattleMoves: ["psychic", "psyshock", "thunderbolt", "nastyplot", "substitute", "hypervoice"],
		randomDoubleBattleMoves: ["psychic", "psyshock", "thunderbolt", "nastyplot", "protect", "agility", "hypervoice"],
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
		randomBattleMoves: ["rapidspin", "toxic", "spikes", "voltswitch", "stealthrock", "gyroball"],
		randomDoubleBattleMoves: ["rockslide", "drillrun", "toxic", "voltswitch", "stealthrock", "gyroball", "protect"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dunsparce: {
		randomBattleMoves: ["bodyslam", "rockslide", "bite", "coil", "glare", "headbutt", "roost"],
		randomDoubleBattleMoves: ["coil", "rockslide", "bite", "headbutt", "glare", "bodyslam", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gligar: {
		randomBattleMoves: ["stealthrock", "toxic", "roost", "defog", "earthquake", "uturn", "knockoff"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["poisonsting", "sandattack"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gliscor: {
		randomBattleMoves: ["roost", "taunt", "earthquake", "protect", "toxic", "stealthrock", "knockoff", "uturn"],
		randomDoubleBattleMoves: ["tailwind", "substitute", "taunt", "earthquake", "protect", "stoneedge", "knockoff"],
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
		randomBattleMoves: ["thunderwave", "playrough", "crunch", "earthquake", "healbell"],
		randomDoubleBattleMoves: ["thunderwave", "playrough", "crunch", "earthquake", "snarl", "rockslide", "protect"],
		encounters: [
			{"generation": 2, "level": 15},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	qwilfish: {
		randomBattleMoves: ["toxicspikes", "liquidation", "spikes", "painsplit", "thunderwave", "taunt", "destinybond"],
		randomDoubleBattleMoves: ["poisonjab", "liquidation", "swordsdance", "protect", "thunderwave", "taunt", "destinybond"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "poisonsting", "harden", "minimize"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	shuckle: {
		randomBattleMoves: ["toxic", "encore", "stealthrock", "knockoff", "stickyweb", "infestation"],
		randomDoubleBattleMoves: ["encore", "stealthrock", "knockoff", "stickyweb", "guardsplit", "powersplit", "toxic", "helpinghand"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["sturdy"], "moves": ["constrict", "withdraw", "wrap"], "pokeball": "pokeball"},
			{"generation": 3, "level": 20, "abilities": ["sturdy"], "moves": ["substitute", "toxic", "sludgebomb", "encore"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	heracross: {
		randomBattleMoves: ["closecombat", "megahorn", "stoneedge", "swordsdance", "knockoff", "earthquake"],
		randomDoubleBattleMoves: ["closecombat", "megahorn", "stoneedge", "swordsdance", "knockoff", "earthquake", "protect"],
		eventPokemon: [
			{"generation": 6, "level": 50, "gender": "F", "nature": "Adamant", "isHidden": false, "moves": ["bulletseed", "pinmissile", "closecombat", "megahorn"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "nature": "Adamant", "isHidden": false, "abilities": ["guts"], "moves": ["pinmissile", "bulletseed", "earthquake", "rockblast"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	heracrossmega: {
		randomBattleMoves: ["closecombat", "pinmissile", "rockblast", "swordsdance", "bulletseed", "substitute"],
		randomDoubleBattleMoves: ["closecombat", "pinmissile", "rockblast", "swordsdance", "bulletseed", "knockoff", "earthquake", "protect"],
		requiredItem: "Heracronite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sneasel: {
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["scratch", "leer", "taunt", "quickattack"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	weavile: {
		randomBattleMoves: ["iceshard", "iciclecrash", "knockoff", "pursuit", "swordsdance", "lowkick"],
		randomDoubleBattleMoves: ["iceshard", "iciclecrash", "knockoff", "fakeout", "swordsdance", "lowkick", "taunt", "protect", "feint"],
		eventPokemon: [
			{"generation": 4, "level": 30, "gender": "M", "nature": "Jolly", "moves": ["fakeout", "iceshard", "nightslash", "brickbreak"], "pokeball": "cherishball"},
			{"generation": 6, "level": 48, "gender": "M", "perfectIVs": 2, "isHidden": false, "moves": ["nightslash", "icepunch", "brickbreak", "xscissor"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["swordsdance", "facade", "closecombat", "crunch", "protect"],
		randomDoubleBattleMoves: ["swordsdance", "facade", "closecombat", "earthquake", "crunch", "protect"],
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
		randomBattleMoves: ["recover", "lavaplume", "toxic", "hiddenpowergrass", "stealthrock", "fireblast", "earthpower", "shellsmash", "ancientpower"],
		randomDoubleBattleMoves: ["protect", "heatwave", "willowisp", "shellsmash", "hiddenpowergrass", "ancientpower", "stealthrock", "fireblast", "earthpower"],
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
		randomBattleMoves: ["iceshard", "earthquake", "endeavor", "iciclecrash", "stealthrock", "superpower", "knockoff"],
		randomDoubleBattleMoves: ["iceshard", "earthquake", "rockslide", "iciclecrash", "protect", "superpower", "knockoff"],
		eventPokemon: [
			{"generation": 5, "level": 34, "gender": "M", "isHidden": true, "moves": ["hail", "icefang", "takedown", "doublehit"]},
			{"generation": 6, "level": 50, "shiny": true, "gender": "M", "nature": "Adamant", "isHidden": true, "moves": ["iciclespear", "earthquake", "iciclecrash", "rockslide"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	// TODO: Check Legality
	corsola: {
		randomBattleMoves: ["recover", "toxic", "powergem", "scald", "stealthrock"],
		randomDoubleBattleMoves: ["protect", "icywind", "powergem", "scald", "stealthrock", "earthpower", "icebeam"],
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["tackle", "mudsport"], "pokeball": "pokeball"},
			{"generation": 7, "level": 50, "gender": "F", "nature": "Serious", "isHidden": false, "abilities": ["hustle"], "moves": ["tackle", "powergem"], "pokeball": "ultraball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	corsolagalar: {
		tier: "LC",
	},
	cursola: {
		tier: "New",
		doublesTier: "New",
	},
	remoraid: {
		tier: "LC",
	},
	octillery: {
		randomBattleMoves: ["hydropump", "fireblast", "icebeam", "energyball", "rockblast", "gunkshot", "scald"],
		randomDoubleBattleMoves: ["hydropump", "surf", "fireblast", "icebeam", "energyball", "chargebeam", "protect"],
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "F", "nature": "Serious", "abilities": ["suctioncups"], "moves": ["octazooka", "icebeam", "signalbeam", "hyperbeam"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 4, "level": 19},
			{"generation": 7, "level": 10},
		],
		tier: "New",
		doublesTier: "New",
	},
	delibird: {
		randomBattleMoves: ["spikes", "rapidspin", "icywind", "freezedry", "destinybond"],
		randomDoubleBattleMoves: ["fakeout", "iceshard", "icepunch", "aerialace", "brickbreak", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["present"], "pokeball": "pokeball"},
			{"generation": 6, "level": 10, "isHidden": false, "abilities": ["vitalspirit"], "moves": ["present", "happyhour"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	mantyke: {
		tier: "LC",
	},
	mantine: {
		randomBattleMoves: ["scald", "airslash", "roost", "toxic", "defog"],
		randomDoubleBattleMoves: ["raindance", "scald", "airslash", "icebeam", "tailwind", "wideguard", "helpinghand", "protect", "surf"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["tackle", "bubble", "supersonic"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	skarmory: {
		randomBattleMoves: ["whirlwind", "bravebird", "roost", "spikes", "stealthrock", "defog"],
		randomDoubleBattleMoves: ["skydrop", "bravebird", "tailwind", "taunt", "feint", "protect", "ironhead"],
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
		randomBattleMoves: ["nastyplot", "darkpulse", "suckerpunch", "fireblast", "hiddenpowergrass"],
		randomDoubleBattleMoves: ["nastyplot", "darkpulse", "suckerpunch", "heatwave", "hiddenpowerfighting", "protect"],
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
		randomBattleMoves: ["nastyplot", "darkpulse", "taunt", "fireblast", "hiddenpowergrass"],
		randomDoubleBattleMoves: ["nastyplot", "darkpulse", "taunt", "heatwave", "hiddenpowergrass", "protect"],
		requiredItem: "Houndoominite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	phanpy: {
		encounters: [
			{"generation": 2, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	donphan: {
		randomBattleMoves: ["stealthrock", "rapidspin", "iceshard", "earthquake", "knockoff", "stoneedge"],
		randomDoubleBattleMoves: ["stealthrock", "knockoff", "iceshard", "earthquake", "rockslide", "protect"],
		encounters: [
			{"generation": 6, "level": 24, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	stantler: {
		randomBattleMoves: ["doubleedge", "megahorn", "jumpkick", "earthquake", "suckerpunch"],
		randomDoubleBattleMoves: ["return", "megahorn", "jumpkick", "earthquake", "suckerpunch", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["intimidate"], "moves": ["tackle", "leer"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	smeargle: {
		randomBattleMoves: ["spore", "stealthrock", "destinybond", "whirlwind", "stickyweb"],
		randomDoubleBattleMoves: ["spore", "fakeout", "wideguard", "helpinghand", "followme", "tailwind", "kingsshield", "transform"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["owntempo"], "moves": ["sketch"], "pokeball": "pokeball"},
			{"generation": 5, "level": 50, "gender": "F", "nature": "Jolly", "ivs": {"atk": 31, "spe": 31}, "isHidden": false, "abilities": ["technician"], "moves": ["falseswipe", "spore", "odorsleuth", "meanlook"], "pokeball": "cherishball"},
			{"generation": 6, "level": 40, "gender": "M", "nature": "Jolly", "isHidden": false, "abilities": ["owntempo"], "moves": ["sketch", "furyswipes", "seismictoss", "flamethrower"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pokestarsmeargle: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 60, "gender": "M", "abilities": ["owntempo"], "moves": ["mindreader", "guillotine", "tailwhip", "gastroacid"]},
			{"generation": 5, "level": 30, "gender": "M", "abilities": ["owntempo"], "moves": ["outrage", "magiccoat"]},
			{"generation": 5, "level": 99, "gender": "M", "abilities": ["owntempo"], "moves": ["nastyplot", "sheercold", "attract", "shadowball"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	miltank: {
		randomBattleMoves: ["milkdrink", "stealthrock", "bodyslam", "healbell", "curse", "earthquake", "toxic"],
		randomDoubleBattleMoves: ["protect", "helpinghand", "bodyslam", "milkdrink", "curse", "earthquake", "thunderwave"],
		eventPokemon: [
			{"generation": 6, "level": 20, "perfectIVs": 3, "isHidden": false, "abilities": ["scrappy"], "moves": ["rollout", "attract", "stomp", "milkdrink"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	raikou: {
		randomBattleMoves: ["thunderbolt", "hiddenpowerice", "aurasphere", "calmmind", "substitute", "voltswitch", "extrasensory"],
		randomDoubleBattleMoves: ["thunderbolt", "hiddenpowerice", "extrasensory", "calmmind", "substitute", "snarl", "protect"],
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
		randomBattleMoves: ["extremespeed", "flareblitz", "stompingtantrum", "stoneedge", "sacredfire"],
		randomDoubleBattleMoves: ["extremespeed", "flareblitz", "ironhead", "bulldoze", "stoneedge", "sacredfire", "protect"],
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
		randomBattleMoves: ["hydropump", "icebeam", "scald", "hiddenpowergrass", "rest", "sleeptalk", "calmmind"],
		randomDoubleBattleMoves: ["hydropump", "icebeam", "scald", "hiddenpowergrass", "snarl", "tailwind", "protect", "calmmind"],
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
		randomBattleMoves: ["crunch", "stoneedge", "pursuit", "earthquake", "fireblast", "icebeam", "stealthrock"],
		randomDoubleBattleMoves: ["crunch", "stoneedge", "rockslide", "earthquake", "firepunch", "icepunch", "stealthrock", "protect"],
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
		tier: "New",
		doublesTier: "New",
	},
	tyranitarmega: {
		randomBattleMoves: ["crunch", "stoneedge", "earthquake", "icepunch", "dragondance"],
		randomDoubleBattleMoves: ["crunch", "stoneedge", "earthquake", "icepunch", "dragondance", "rockslide", "protect"],
		requiredItem: "Tyranitarite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lugia: {
		randomBattleMoves: ["toxic", "roost", "substitute", "whirlwind", "aeroblast", "earthquake"],
		randomDoubleBattleMoves: ["aeroblast", "roost", "substitute", "tailwind", "icebeam", "psychic", "calmmind", "skydrop", "protect"],
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
		randomBattleMoves: ["substitute", "sacredfire", "bravebird", "earthquake", "roost", "toxic", "flamecharge"],
		randomDoubleBattleMoves: ["substitute", "sacredfire", "bravebird", "earthquake", "roost", "toxic", "tailwind", "skydrop", "protect"],
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
		randomBattleMoves: ["nastyplot", "psychic", "gigadrain", "recover", "earthpower", "hiddenpowerfire", "leafstorm", "uturn", "thunderwave"],
		randomDoubleBattleMoves: ["protect", "psychic", "gigadrain", "leechseed", "recover", "earthpower", "hiddenpowerfire", "nastyplot", "leafstorm", "uturn", "thunderwave"],
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
		isUnreleased: true,
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
		randomBattleMoves: ["gigadrain", "leafstorm", "hiddenpowerice", "focusblast", "hiddenpowerflying"],
		randomDoubleBattleMoves: ["gigadrain", "leafstorm", "hiddenpowerice", "focusblast", "hiddenpowerfire", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["leafstorm", "dragonpulse", "focusblast", "rockslide"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sceptilemega: {
		randomBattleMoves: ["substitute", "gigadrain", "dragonpulse", "focusblast", "swordsdance", "outrage", "leafblade", "earthquake", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["substitute", "gigadrain", "leafstorm", "hiddenpowerice", "focusblast", "dragonpulse", "hiddenpowerfire", "protect"],
		requiredItem: "Sceptilite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["fireblast", "highjumpkick", "protect", "knockoff", "hiddenpowerice"],
		eventPokemon: [
			{"generation": 3, "level": 70, "moves": ["blazekick", "slash", "mirrormove", "skyuppercut"], "pokeball": "pokeball"},
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["flareblitz", "highjumpkick", "thunderpunch", "stoneedge"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	blazikenmega: {
		randomBattleMoves: ["flareblitz", "highjumpkick", "protect", "swordsdance", "stoneedge", "knockoff"],
		requiredItem: "Blazikenite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["stealthrock", "earthquake", "scald", "icebeam", "roar", "toxic", "protect"],
		randomDoubleBattleMoves: ["waterfall", "earthquake", "icebeam", "stealthrock", "wideguard", "scald", "rockslide", "muddywater", "protect", "icywind"],
		eventPokemon: [
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["earthquake", "icebeam", "hydropump", "hammerarm"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swampertmega: {
		randomBattleMoves: ["raindance", "waterfall", "earthquake", "icepunch", "superpower"],
		randomDoubleBattleMoves: ["waterfall", "earthquake", "raindance", "icepunch", "superpower", "protect"],
		requiredItem: "Swampertite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["crunch", "suckerpunch", "playrough", "firefang", "irontail"],
		randomDoubleBattleMoves: ["suckerpunch", "crunch", "playrough", "firefang", "taunt", "protect"],
		eventPokemon: [
			{"generation": 7, "level": 64, "gender": "M", "isHidden": false, "abilities": ["intimidate"], "moves": ["crunch", "firefang", "icefang", "thunderfang"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	// TODO: Check Legality
	zigzagoon: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": true, "abilities": ["pickup"], "moves": ["tackle", "growl", "tailwhip"], "pokeball": "pokeball"},
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["pickup"], "moves": ["tackle", "growl", "tailwhip", "extremespeed"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 3, "level": 2},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zigzagoongalar: {
		tier: "LC",
	},
	// TODO: Check Legality
	linoone: {
		randomBattleMoves: ["bellydrum", "extremespeed", "stompingtantrum", "shadowclaw"],
		randomDoubleBattleMoves: ["bellydrum", "extremespeed", "stompingtantrum", "protect", "shadowclaw"],
		eventPokemon: [
			{"generation": 6, "level": 50, "isHidden": false, "moves": ["extremespeed", "helpinghand", "babydolleyes", "protect"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 4, "level": 3},
			{"generation": 6, "level": 17, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	linoonegalar: {
		tier: "NFE",
	},
	obstagoon: {
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["quiverdance", "bugbuzz", "psychic", "energyball", "hiddenpowerfighting"],
		randomDoubleBattleMoves: ["quiverdance", "bugbuzz", "gigadrain", "hiddenpowerrock", "aircutter", "tailwind", "stringshot", "protect"],
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
		randomBattleMoves: ["roost", "defog", "bugbuzz", "sludgebomb", "quiverdance", "uturn"],
		randomDoubleBattleMoves: ["tailwind", "stringshot", "strugglebug", "bugbuzz", "protect", "sludgebomb", "quiverdance", "shadowball"],
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
		tier: "Lombre",
	},
	ludicolo: {
		randomBattleMoves: ["raindance", "hydropump", "scald", "gigadrain", "icebeam", "focusblast"],
		randomDoubleBattleMoves: ["raindance", "hydropump", "surf", "gigadrain", "icebeam", "fakeout", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "abilities": ["swiftswim"], "moves": ["fakeout", "hydropump", "icebeam", "gigadrain"], "pokeball": "cherishball"},
			{"generation": 5, "level": 30, "gender": "M", "nature": "Calm", "isHidden": false, "abilities": ["swiftswim"], "moves": ["scald", "gigadrain", "icebeam", "sunnyday"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["leafstorm", "swordsdance", "leafblade", "suckerpunch", "defog", "lowkick", "knockoff"],
		randomDoubleBattleMoves: ["leafstorm", "swordsdance", "leafblade", "suckerpunch", "knockoff", "lowkick", "fakeout", "protect"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["protect", "facade", "bravebird", "uturn", "quickattack"],
		randomDoubleBattleMoves: ["bravebird", "facade", "quickattack", "uturn", "protect"],
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
		tier: "LC",
	},
	pelipper: {
		randomBattleMoves: ["scald", "hurricane", "hydropump", "uturn", "roost", "defog", "knockoff"],
		randomDoubleBattleMoves: ["scald", "surf", "hurricane", "wideguard", "protect", "tailwind", "knockoff"],
		encounters: [
			{"generation": 4, "level": 15},
			{"generation": 6, "level": 18, "maxEggMoves": 1},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["psychic", "thunderbolt", "focusblast", "shadowball", "moonblast", "calmmind", "substitute", "willowisp"],
		randomDoubleBattleMoves: ["psyshock", "focusblast", "shadowball", "moonblast", "taunt", "willowisp", "thunderbolt", "trickroom", "helpinghand", "protect", "dazzlinggleam"],
		eventPokemon: [
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "abilities": ["trace"], "moves": ["hypnosis", "thunderbolt", "focusblast", "psychic"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": true, "gender": "F", "isHidden": false, "abilities": ["synchronize"], "moves": ["dazzlinggleam", "moonblast", "storedpower", "calmmind"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	gardevoirmega: {
		randomBattleMoves: ["calmmind", "hypervoice", "psyshock", "focusblast", "substitute", "taunt", "willowisp"],
		randomDoubleBattleMoves: ["psyshock", "focusblast", "shadowball", "calmmind", "thunderbolt", "hypervoice", "protect"],
		requiredItem: "Gardevoirite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gallade: {
		randomBattleMoves: ["bulkup", "drainpunch", "icepunch", "shadowsneak", "closecombat", "zenheadbutt", "knockoff", "trick"],
		randomDoubleBattleMoves: ["closecombat", "trick", "stoneedge", "shadowsneak", "drainpunch", "icepunch", "zenheadbutt", "knockoff", "trickroom", "protect", "helpinghand"],
		tier: "New",
		doublesTier: "New",
	},
	gallademega: {
		randomBattleMoves: ["swordsdance", "closecombat", "drainpunch", "knockoff", "zenheadbutt", "substitute"],
		randomDoubleBattleMoves: ["closecombat", "stoneedge", "drainpunch", "icepunch", "zenheadbutt", "swordsdance", "knockoff", "protect"],
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
		randomBattleMoves: ["quiverdance", "bugbuzz", "airslash", "hydropump", "stickyweb"],
		randomDoubleBattleMoves: ["hydropump", "bugbuzz", "airslash", "quiverdance", "tailwind", "roost", "strugglebug", "protect"],
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
		randomBattleMoves: ["spore", "machpunch", "bulletseed", "rocktomb", "swordsdance"],
		randomDoubleBattleMoves: ["spore", "helpinghand", "machpunch", "bulletseed", "rocktomb", "protect", "drainpunch"],
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
		randomBattleMoves: ["earthquake", "pursuit", "nightslash", "retaliate", "gigaimpact", "firepunch"],
		randomDoubleBattleMoves: ["earthquake", "nightslash", "doubleedge", "retaliate", "hammerarm", "rockslide"],
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
		randomBattleMoves: ["swordsdance", "aerialace", "nightslash", "dig", "leechlife", "uturn"],
		randomDoubleBattleMoves: ["batonpass", "swordsdance", "substitute", "protect", "leechlife", "aerialace"],
		tier: "New",
		doublesTier: "New",
	},
	shedinja: {
		randomBattleMoves: ["swordsdance", "willowisp", "xscissor", "shadowsneak", "shadowclaw"],
		randomDoubleBattleMoves: ["swordsdance", "willowisp", "xscissor", "shadowsneak", "shadowclaw", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 50, "moves": ["spite", "confuseray", "shadowball", "grudge"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["boomburst", "fireblast", "icebeam", "surf", "focusblast"],
		randomDoubleBattleMoves: ["boomburst", "fireblast", "icebeam", "surf", "focusblast", "protect", "hypervoice"],
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
		randomBattleMoves: ["bulletpunch", "closecombat", "icepunch", "stoneedge", "bulkup", "knockoff"],
		randomDoubleBattleMoves: ["bulletpunch", "closecombat", "icepunch", "stoneedge", "fakeout", "knockoff", "helpinghand", "wideguard", "protect"],
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
		randomBattleMoves: ["stealthrock", "thunderwave", "toxic", "flashcannon", "voltswitch", "earthpower"],
		randomDoubleBattleMoves: ["stealthrock", "thunderwave", "helpinghand", "earthpower", "powergem", "wideguard", "protect", "flashcannon"],
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
		randomBattleMoves: ["doubleedge", "suckerpunch", "wildcharge", "fakeout", "thunderwave", "healbell"],
		randomDoubleBattleMoves: ["doubleedge", "suckerpunch", "playrough", "wildcharge", "fakeout", "thunderwave", "protect", "helpinghand"],
		eventPokemon: [
			{"generation": 3, "level": 18, "abilities": ["cutecharm"], "moves": ["sweetkiss", "secretpower", "attract", "shockwave"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sableye: {
		randomBattleMoves: ["recover", "willowisp", "taunt", "toxic", "knockoff", "foulplay"],
		randomDoubleBattleMoves: ["recover", "willowisp", "taunt", "fakeout", "knockoff", "foulplay", "helpinghand", "snarl", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "abilities": ["keeneye"], "moves": ["leer", "scratch", "foresight", "nightshade"], "pokeball": "pokeball"},
			{"generation": 3, "level": 33, "abilities": ["keeneye"], "moves": ["helpinghand", "shadowball", "feintattack", "recover"]},
			{"generation": 5, "level": 50, "gender": "M", "isHidden": true, "moves": ["foulplay", "octazooka", "tickle", "trick"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "nature": "Relaxed", "ivs": {"hp": 31, "spa": 31}, "isHidden": true, "moves": ["calmmind", "willowisp", "recover", "shadowball"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "nature": "Bold", "isHidden": true, "moves": ["willowisp", "recover", "taunt", "shockwave"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	sableyemega: {
		randomBattleMoves: ["recover", "willowisp", "darkpulse", "calmmind", "shadowball"],
		randomDoubleBattleMoves: ["fakeout", "knockoff", "darkpulse", "shadowball", "willowisp", "protect"],
		requiredItem: "Sablenite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mawile: {
		randomBattleMoves: ["swordsdance", "ironhead", "stealthrock", "playrough", "suckerpunch", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "ironhead", "firefang", "substitute", "playrough", "suckerpunch", "knockoff", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["astonish", "faketears"], "pokeball": "pokeball"},
			{"generation": 3, "level": 22, "moves": ["sing", "falseswipe", "vicegrip", "irondefense"]},
			{"generation": 6, "level": 50, "isHidden": false, "abilities": ["intimidate"], "moves": ["ironhead", "playrough", "firefang", "suckerpunch"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "isHidden": false, "abilities": ["intimidate"], "moves": ["suckerpunch", "protect", "playrough", "ironhead"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	mawilemega: {
		randomBattleMoves: ["swordsdance", "ironhead", "firefang", "substitute", "playrough", "suckerpunch", "knockoff", "focuspunch"],
		randomDoubleBattleMoves: ["swordsdance", "ironhead", "firefang", "substitute", "playrough", "suckerpunch", "knockoff", "protect"],
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
		randomBattleMoves: ["autotomize", "headsmash", "earthquake", "lowkick", "heavyslam", "aquatail", "stealthrock"],
		randomDoubleBattleMoves: ["rockslide", "headsmash", "earthquake", "lowkick", "heavyslam", "aquatail", "stealthrock", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 100, "moves": ["irontail", "protect", "metalsound", "doubleedge"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["takedown", "irontail", "protect", "metalsound"], "pokeball": "pokeball"},
			{"generation": 6, "level": 50, "nature": "Brave", "isHidden": false, "abilities": ["rockhead"], "moves": ["ironhead", "earthquake", "headsmash", "rockslide"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	aggronmega: {
		randomBattleMoves: ["earthquake", "heavyslam", "rockslide", "stealthrock", "thunderwave", "roar", "toxic"],
		randomDoubleBattleMoves: ["rockslide", "earthquake", "lowkick", "heavyslam", "aquatail", "protect"],
		requiredItem: "Aggronite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["highjumpkick", "drainpunch", "zenheadbutt", "icepunch", "bulletpunch"],
		randomDoubleBattleMoves: ["highjumpkick", "drainpunch", "zenheadbutt", "icepunch", "bulletpunch", "protect", "fakeout"],
		encounters: [
			{"generation": 4, "level": 35},
			{"generation": 6, "level": 34, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	medichammega: {
		randomBattleMoves: ["highjumpkick", "zenheadbutt", "thunderpunch", "icepunch", "fakeout"],
		randomDoubleBattleMoves: ["highjumpkick", "drainpunch", "zenheadbutt", "icepunch", "bulletpunch", "protect", "fakeout"],
		requiredItem: "Medichamite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	electrike: {
		tier: "LC",
	},
	manectric: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "hiddenpowergrass", "overheat", "flamethrower"],
		randomDoubleBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "hiddenpowergrass", "overheat", "flamethrower", "snarl", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 44, "moves": ["refresh", "thunder", "raindance", "bite"]},
			{"generation": 6, "level": 50, "nature": "Timid", "isHidden": false, "abilities": ["lightningrod"], "moves": ["overheat", "thunderbolt", "voltswitch", "protect"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	manectricmega: {
		randomBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "hiddenpowergrass", "overheat"],
		randomDoubleBattleMoves: ["voltswitch", "thunderbolt", "hiddenpowerice", "hiddenpowergrass", "overheat", "flamethrower", "snarl", "protect"],
		requiredItem: "Manectite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	plusle: {
		randomBattleMoves: ["nastyplot", "thunderbolt", "substitute", "hiddenpowerice", "encore"],
		randomDoubleBattleMoves: ["nastyplot", "thunderbolt", "substitute", "protect", "hiddenpowerice", "encore", "helpinghand"],
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["growl", "thunderwave", "mudsport"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["growl", "thunderwave", "quickattack"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	minun: {
		randomBattleMoves: ["nastyplot", "thunderbolt", "substitute", "hiddenpowerice", "encore"],
		randomDoubleBattleMoves: ["nastyplot", "thunderbolt", "substitute", "protect", "hiddenpowerice", "encore", "helpinghand"],
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["growl", "thunderwave", "watersport"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["growl", "thunderwave", "quickattack"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	volbeat: {
		randomBattleMoves: ["uturn", "roost", "thunderwave", "encore", "tailwind", "defog"],
		randomDoubleBattleMoves: ["stringshot", "strugglebug", "helpinghand", "thunderwave", "encore", "tailwind", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	illumise: {
		randomBattleMoves: ["uturn", "roost", "bugbuzz", "thunderwave", "encore", "wish", "defog"],
		randomDoubleBattleMoves: ["protect", "helpinghand", "bugbuzz", "encore", "thunderbolt", "tailwind", "uturn"],
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
		randomBattleMoves: ["sludgebomb", "gigadrain", "sleeppowder", "leafstorm", "spikes", "toxicspikes", "synthesis", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["sludgebomb", "gigadrain", "sleeppowder", "leafstorm", "protect", "hiddenpowerfire"],
		tier: "New",
		doublesTier: "New",
	},
	gulpin: {
		eventPokemon: [
			{"generation": 3, "level": 17, "moves": ["sing", "shockwave", "sludge", "toxic"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swalot: {
		randomBattleMoves: ["sludgebomb", "icebeam", "toxic", "yawn", "encore", "painsplit", "earthquake"],
		randomDoubleBattleMoves: ["sludgebomb", "icebeam", "protect", "yawn", "encore", "gunkshot", "earthquake"],
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
		randomBattleMoves: ["protect", "icebeam", "crunch", "earthquake", "waterfall"],
		randomDoubleBattleMoves: ["protect", "icebeam", "crunch", "earthquake", "liquidation"],
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
		randomBattleMoves: ["protect", "crunch", "waterfall", "icefang", "psychicfangs", "destinybond"],
		randomDoubleBattleMoves: ["protect", "icefang", "crunch", "liquidation", "psychicfangs"],
		requiredItem: "Sharpedonite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wailmer: {
		tier: "LC",
	},
	wailord: {
		randomBattleMoves: ["waterspout", "hydropump", "icebeam", "hiddenpowergrass", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["waterspout", "hydropump", "icebeam", "hiddenpowergrass", "hiddenpowerfire", "protect"],
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
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["rockpolish", "fireblast", "earthpower", "lavaplume", "stealthrock", "hiddenpowergrass", "roar", "stoneedge"],
		randomDoubleBattleMoves: ["rockpolish", "fireblast", "earthpower", "heatwave", "eruption", "hiddenpowergrass", "protect"],
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
		randomBattleMoves: ["stealthrock", "fireblast", "earthpower", "ancientpower", "willowisp", "toxic"],
		randomDoubleBattleMoves: ["fireblast", "earthpower", "heatwave", "eruption", "rockslide", "protect"],
		requiredItem: "Cameruptite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	torkoal: {
		randomBattleMoves: ["shellsmash", "fireblast", "earthpower", "solarbeam", "stealthrock", "rapidspin", "yawn", "lavaplume"],
		randomDoubleBattleMoves: ["protect", "heatwave", "earthpower", "willowisp", "shellsmash", "fireblast", "solarbeam"],
		tier: "New",
		doublesTier: "New",
	},
	spoink: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "abilities": ["owntempo"], "moves": ["splash", "uproar"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	grumpig: {
		randomBattleMoves: ["psychic", "thunderwave", "healbell", "whirlwind", "toxic", "focusblast", "reflect", "lightscreen"],
		randomDoubleBattleMoves: ["psychic", "psyshock", "thunderwave", "trickroom", "taunt", "protect", "focusblast", "reflect", "lightscreen"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	spinda: {
		randomBattleMoves: ["return", "superpower", "rockslide", "encore"],
		randomDoubleBattleMoves: ["doubleedge", "return", "superpower", "suckerpunch", "trickroom", "fakeout", "protect"],
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
		randomBattleMoves: ["earthquake", "outrage", "uturn", "roost", "defog", "firepunch", "dragondance"],
		randomDoubleBattleMoves: ["earthquake", "protect", "dragonclaw", "uturn", "rockslide", "firepunch", "fireblast", "tailwind", "dragondance"],
		eventPokemon: [
			{"generation": 3, "level": 45, "moves": ["sandtomb", "crunch", "dragonbreath", "screech"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "gender": "M", "nature": "Naive", "moves": ["dracometeor", "uturn", "earthquake", "dragonclaw"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	cacnea: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["poisonsting", "leer", "absorb", "encore"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cacturne: {
		randomBattleMoves: ["swordsdance", "spikes", "suckerpunch", "seedbomb", "drainpunch", "substitute", "darkpulse", "focusblast", "gigadrain"],
		randomDoubleBattleMoves: ["swordsdance", "spikyshield", "suckerpunch", "seedbomb", "drainpunch", "substitute"],
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
		randomBattleMoves: ["dracometeor", "fireblast", "earthquake", "roost", "toxic", "defog"],
		randomDoubleBattleMoves: ["dragondance", "dracometeor", "protect", "dragonclaw", "earthquake", "fireblast", "tailwind"],
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
		randomBattleMoves: ["dragondance", "return", "hypervoice", "healbell", "earthquake", "roost", "fireblast"],
		randomDoubleBattleMoves: ["dragondance", "return", "doubleedge", "dragonclaw", "earthquake", "protect", "fireblast"],
		requiredItem: "Altarianite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zangoose: {
		randomBattleMoves: ["swordsdance", "closecombat", "knockoff", "quickattack", "facade"],
		randomDoubleBattleMoves: ["protect", "closecombat", "knockoff", "quickattack", "facade"],
		eventPokemon: [
			{"generation": 3, "level": 18, "moves": ["leer", "quickattack", "swordsdance", "furycutter"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["scratch", "leer", "quickattack", "swordsdance"], "pokeball": "pokeball"},
			{"generation": 3, "level": 28, "moves": ["refresh", "brickbreak", "counter", "crushclaw"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	seviper: {
		randomBattleMoves: ["flamethrower", "sludgewave", "gigadrain", "darkpulse", "switcheroo", "swordsdance", "earthquake", "poisonjab", "suckerpunch"],
		randomDoubleBattleMoves: ["flamethrower", "gigadrain", "earthquake", "suckerpunch", "aquatail", "protect", "glare", "poisonjab", "sludgebomb"],
		eventPokemon: [
			{"generation": 3, "level": 18, "moves": ["wrap", "lick", "bite", "poisontail"], "pokeball": "pokeball"},
			{"generation": 3, "level": 30, "moves": ["poisontail", "screech", "glare", "crunch"], "pokeball": "pokeball"},
			{"generation": 3, "level": 10, "gender": "M", "moves": ["wrap", "lick", "bite"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lunatone: {
		randomBattleMoves: ["psychic", "earthpower", "stealthrock", "rockpolish", "calmmind", "icebeam", "powergem", "moonlight", "toxic"],
		randomDoubleBattleMoves: ["psychic", "earthpower", "rockpolish", "calmmind", "helpinghand", "icebeam", "powergem", "moonlight", "trickroom", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 10, "moves": ["tackle", "harden", "confusion"], "pokeball": "pokeball"},
			{"generation": 3, "level": 25, "moves": ["batonpass", "psychic", "raindance", "rocktomb"]},
			{"generation": 7, "level": 30, "moves": ["cosmicpower", "hiddenpower", "moonblast", "powergem"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	solrock: {
		randomBattleMoves: ["stealthrock", "explosion", "rockslide", "reflect", "lightscreen", "willowisp", "morningsun"],
		randomDoubleBattleMoves: ["protect", "helpinghand", "stoneedge", "zenheadbutt", "willowisp", "trickroom", "rockslide"],
		eventPokemon: [
			{"generation": 3, "level": 10, "moves": ["tackle", "harden", "confusion"], "pokeball": "pokeball"},
			{"generation": 3, "level": 41, "moves": ["batonpass", "psychic", "sunnyday", "cosmicpower"]},
			{"generation": 7, "level": 30, "moves": ["cosmicpower", "hiddenpower", "solarbeam", "stoneedge"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	barboach: {
		tier: "LC",
	},
	whiscash: {
		randomBattleMoves: ["dragondance", "waterfall", "earthquake", "stoneedge", "zenheadbutt"],
		randomDoubleBattleMoves: ["dragondance", "waterfall", "earthquake", "stoneedge", "zenheadbutt", "protect"],
		eventPokemon: [
			{"generation": 4, "level": 51, "gender": "F", "nature": "Gentle", "abilities": ["oblivious"], "moves": ["earthquake", "aquatail", "zenheadbutt", "gigaimpact"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 4, "level": 10},
			{"generation": 7, "level": 10},
		],
		tier: "New",
		doublesTier: "New",
	},
	corphish: {
		eventPokemon: [
			{"generation": 3, "level": 5, "shiny": 1, "moves": ["bubble", "watersport"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	crawdaunt: {
		randomBattleMoves: ["dragondance", "crabhammer", "superpower", "swordsdance", "knockoff", "aquajet"],
		randomDoubleBattleMoves: ["dragondance", "liquidation", "crunch", "superpower", "swordsdance", "knockoff", "aquajet", "protect"],
		eventPokemon: [
			{"generation": 3, "level": 100, "moves": ["taunt", "crabhammer", "swordsdance", "guillotine"], "pokeball": "pokeball"},
			{"generation": 3, "level": 50, "moves": ["knockoff", "taunt", "crabhammer", "swordsdance"], "pokeball": "pokeball"},
		],
		encounters: [
			{"generation": 7, "level": 10},
		],
		tier: "New",
		doublesTier: "New",
	},
	baltoy: {
		eventPokemon: [
			{"generation": 3, "level": 17, "moves": ["refresh", "rocktomb", "mudslap", "psybeam"]},
		],
		tier: "LC",
	},
	claydol: {
		randomBattleMoves: ["stealthrock", "toxic", "psychic", "icebeam", "earthquake", "rapidspin"],
		randomDoubleBattleMoves: ["earthpower", "trickroom", "psychic", "icebeam", "earthquake", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	lileep: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "moves": ["recover", "rockslide", "constrict", "acid"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cradily: {
		randomBattleMoves: ["stealthrock", "recover", "gigadrain", "toxic", "seedbomb", "rockslide", "curse"],
		randomDoubleBattleMoves: ["protect", "recover", "seedbomb", "rockslide", "earthquake", "curse", "swordsdance"],
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
		randomBattleMoves: ["stealthrock", "stoneedge", "toxic", "xscissor", "knockoff", "rapidspin", "earthquake"],
		randomDoubleBattleMoves: ["rockslide", "stoneedge", "stringshot", "xscissor", "swordsdance", "knockoff", "protect"],
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
		randomBattleMoves: ["recover", "scald", "toxic", "icebeam", "dragontail", "rest", "sleeptalk"],
		randomDoubleBattleMoves: ["recover", "scald", "hydropump", "icebeam", "dragontail", "hypnosis", "protect", "hiddenpowergrass"],
		eventPokemon: [
			{"generation": 3, "level": 35, "moves": ["waterpulse", "twister", "recover", "raindance"], "pokeball": "pokeball"},
			{"generation": 4, "level": 50, "gender": "F", "nature": "Bold", "moves": ["recover", "raindance", "icebeam", "hydropump"], "pokeball": "cherishball"},
			{"generation": 4, "level": 50, "shiny": true, "gender": "M", "nature": "Timid", "moves": ["raindance", "recover", "hydropump", "icywind"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "shiny": 1, "isHidden": false, "moves": ["recover", "hydropump", "icebeam", "mirrorcoat"], "pokeball": "cherishball"},
			{"generation": 5, "level": 58, "gender": "M", "nature": "Lax", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": false, "moves": ["recover", "surf", "icebeam", "toxic"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	castform: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	castformsunny: {
		randomBattleMoves: ["sunnyday", "fireblast", "solarbeam", "icebeam"],
		requiredAbility: 'Forecast',
		battleOnly: true,
	},
	castformrainy: {
		randomBattleMoves: ["raindance", "hydropump", "thunder", "hurricane"],
		requiredAbility: 'Forecast',
		battleOnly: true,
	},
	castformsnowy: {
		randomBattleMoves: ["hail", "blizzard", "thunderbolt", "fireblast"],
		requiredAbility: 'Forecast',
		battleOnly: true,
	},
	kecleon: {
		randomBattleMoves: ["fakeout", "knockoff", "drainpunch", "suckerpunch", "shadowsneak", "stealthrock", "recover"],
		randomDoubleBattleMoves: ["knockoff", "fakeout", "trickroom", "recover", "drainpunch", "suckerpunch", "shadowsneak", "protect"],
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
		randomBattleMoves: ["destinybond", "taunt", "shadowclaw", "suckerpunch", "willowisp", "shadowsneak", "knockoff"],
		randomDoubleBattleMoves: ["shadowclaw", "suckerpunch", "willowisp", "shadowsneak", "knockoff", "protect"],
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
		randomBattleMoves: ["destinybond", "taunt", "shadowclaw", "suckerpunch", "willowisp", "knockoff"],
		randomDoubleBattleMoves: ["destinybond", "taunt", "shadowclaw", "suckerpunch", "willowisp", "knockoff", "protect"],
		requiredItem: "Banettite",
		isNonstandard: "Past",
		tier: "Illegal",
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
	},
	dusknoir: {
		randomBattleMoves: ["willowisp", "shadowsneak", "icepunch", "painsplit", "substitute", "earthquake", "focuspunch"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "icepunch", "painsplit", "protect", "earthquake", "helpinghand", "trickroom"],
		tier: "New",
		doublesTier: "New",
	},
	tropius: {
		randomBattleMoves: ["leechseed", "substitute", "airslash", "gigadrain", "toxic", "protect"],
		randomDoubleBattleMoves: ["leechseed", "protect", "airslash", "gigadrain", "earthquake", "hiddenpowerfire", "tailwind", "sunnyday", "roost"],
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
		randomBattleMoves: ["psychic", "yawn", "recover", "calmmind", "shadowball", "healingwish", "healbell", "taunt"],
		randomDoubleBattleMoves: ["protect", "psychic", "thunderwave", "recover", "shadowball", "dazzlinggleam", "trickroom", "helpinghand", "taunt"],
		eventPokemon: [
			{"generation": 3, "level": 10, "gender": "M", "moves": ["wrap", "growl", "astonish"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	absol: {
		randomBattleMoves: ["swordsdance", "suckerpunch", "knockoff", "superpower", "pursuit", "playrough"],
		randomDoubleBattleMoves: ["swordsdance", "suckerpunch", "knockoff", "fireblast", "superpower", "protect", "playrough"],
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
		randomBattleMoves: ["swordsdance", "suckerpunch", "knockoff", "fireblast", "superpower", "pursuit", "playrough", "icebeam"],
		randomDoubleBattleMoves: ["swordsdance", "suckerpunch", "knockoff", "fireblast", "superpower", "protect", "playrough"],
		requiredItem: "Absolite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	snorunt: {
		eventPokemon: [
			{"generation": 3, "level": 20, "abilities": ["innerfocus"], "moves": ["sing", "waterpulse", "bite", "icywind"]},
		],
		tier: "LC",
	},
	glalie: {
		randomBattleMoves: ["spikes", "icebeam", "iceshard", "taunt", "earthquake", "explosion", "superfang"],
		randomDoubleBattleMoves: ["icebeam", "iceshard", "taunt", "earthquake", "freezedry", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	glaliemega: {
		randomBattleMoves: ["freezedry", "iceshard", "earthquake", "explosion", "return", "spikes"],
		randomDoubleBattleMoves: ["crunch", "iceshard", "freezedry", "earthquake", "explosion", "protect", "return"],
		requiredItem: "Glalitite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	froslass: {
		randomBattleMoves: ["icebeam", "spikes", "destinybond", "shadowball", "taunt", "thunderwave"],
		randomDoubleBattleMoves: ["icebeam", "protect", "destinybond", "shadowball", "taunt", "thunderwave"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["superfang", "protect", "toxic", "surf", "icebeam", "roar"],
		randomDoubleBattleMoves: ["protect", "icywind", "surf", "icebeam", "superfang", "roar"],
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
		randomBattleMoves: ["shellsmash", "waterfall", "icebeam", "suckerpunch"],
		randomDoubleBattleMoves: ["shellsmash", "waterfall", "icefang", "batonpass", "suckerpunch", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gorebyss: {
		randomBattleMoves: ["shellsmash", "hydropump", "icebeam", "hiddenpowergrass", "substitute"],
		randomDoubleBattleMoves: ["shellsmash", "batonpass", "surf", "icebeam", "hiddenpowergrass", "substitute", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	relicanth: {
		randomBattleMoves: ["headsmash", "waterfall", "earthquake", "doubleedge", "stealthrock", "toxic"],
		randomDoubleBattleMoves: ["headsmash", "waterfall", "earthquake", "doubleedge", "rockslide", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	luvdisc: {
		randomBattleMoves: ["icebeam", "toxic", "sweetkiss", "protect", "scald"],
		randomDoubleBattleMoves: ["icebeam", "toxic", "sweetkiss", "protect", "scald", "icywind", "healpulse"],
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
		randomBattleMoves: ["outrage", "fireblast", "earthquake", "dracometeor", "dragondance", "fly", "roost"],
		randomDoubleBattleMoves: ["protect", "fireblast", "earthquake", "dracometeor", "tailwind", "dragondance", "dragonclaw", "hydropump", "rockslide"],
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
		randomBattleMoves: ["doubleedge", "return", "fireblast", "earthquake", "dracometeor", "roost", "dragondance"],
		randomDoubleBattleMoves: ["doubleedge", "return", "fireblast", "earthquake", "dracometeor", "protect", "dragondance", "dragonclaw"],
		requiredItem: "Salamencite",
		isNonstandard: "Past",
		tier: "Illegal",
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
		randomBattleMoves: ["meteormash", "earthquake", "agility", "stealthrock", "zenheadbutt", "bulletpunch", "thunderpunch", "explosion", "icepunch"],
		randomDoubleBattleMoves: ["meteormash", "earthquake", "protect", "zenheadbutt", "bulletpunch", "thunderpunch", "explosion", "icepunch", "hammerarm"],
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
		randomBattleMoves: ["meteormash", "earthquake", "agility", "zenheadbutt", "hammerarm", "icepunch"],
		randomDoubleBattleMoves: ["meteormash", "earthquake", "protect", "zenheadbutt", "thunderpunch", "icepunch"],
		requiredItem: "Metagrossite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	regirock: {
		randomBattleMoves: ["stealthrock", "thunderwave", "stoneedge", "drainpunch", "curse", "rest", "rockslide", "toxic"],
		randomDoubleBattleMoves: ["stealthrock", "thunderwave", "stoneedge", "drainpunch", "curse", "rockslide", "protect"],
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
		randomBattleMoves: ["thunderwave", "icebeam", "thunderbolt", "rest", "sleeptalk", "focusblast", "rockpolish"],
		randomDoubleBattleMoves: ["thunderwave", "icebeam", "thunderbolt", "icywind", "protect", "focusblast", "rockpolish"],
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
		randomBattleMoves: ["stealthrock", "toxic", "curse", "ironhead", "rest", "sleeptalk"],
		randomDoubleBattleMoves: ["stealthrock", "ironhead", "curse", "rest", "thunderwave", "protect", "seismictoss"],
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
		randomBattleMoves: ["dracometeor", "psyshock", "hiddenpowerfire", "roost", "thunderbolt", "healingwish", "defog"],
		randomDoubleBattleMoves: ["dragonpulse", "psychic", "tailwind", "helpinghand", "healpulse", "lightscreen", "reflect", "protect"],
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
		randomBattleMoves: ["calmmind", "dragonpulse", "surf", "dracometeor", "roost", "hiddenpowerfire", "substitute", "psyshock"],
		randomDoubleBattleMoves: ["dragonpulse", "psychic", "tailwind", "helpinghand", "healpulse", "lightscreen", "reflect", "protect"],
		requiredItem: "Latiasite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	latios: {
		randomBattleMoves: ["dracometeor", "hiddenpowerfire", "surf", "thunderbolt", "psyshock", "roost", "trick", "defog"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "surf", "thunderbolt", "psyshock", "substitute", "trick", "tailwind", "protect", "hiddenpowerfire"],
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
		randomBattleMoves: ["calmmind", "dracometeor", "hiddenpowerfire", "psyshock", "roost", "defog"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "surf", "thunderbolt", "psyshock", "substitute", "tailwind", "protect", "hiddenpowerfire"],
		requiredItem: "Latiosite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kyogre: {
		randomBattleMoves: ["waterspout", "originpulse", "scald", "thunder", "icebeam"],
		randomDoubleBattleMoves: ["waterspout", "muddywater", "originpulse", "thunder", "icebeam", "calmmind", "rest", "sleeptalk", "protect"],
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
		randomBattleMoves: ["calmmind", "originpulse", "scald", "thunder", "icebeam", "toxic", "rest", "sleeptalk"],
		randomDoubleBattleMoves: ["waterspout", "originpulse", "muddywater", "thunder", "icebeam", "calmmind", "rest", "sleeptalk", "protect"],
		requiredItem: "Blue Orb",
	},
	groudon: {
		randomBattleMoves: ["earthquake", "stealthrock", "lavaplume", "stoneedge", "roar", "toxic", "thunderwave", "dragonclaw", "firepunch"],
		randomDoubleBattleMoves: ["precipiceblades", "rockslide", "protect", "stoneedge", "swordsdance", "rockpolish", "dragonclaw", "firepunch"],
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
		randomBattleMoves: ["stealthrock", "precipiceblades", "lavaplume", "stoneedge", "dragontail", "rockpolish", "swordsdance", "firepunch"],
		randomDoubleBattleMoves: ["precipiceblades", "lavaplume", "rockslide", "stoneedge", "swordsdance", "overheat", "rockpolish", "firepunch", "protect"],
		requiredItem: "Red Orb",
	},
	rayquaza: {
		randomBattleMoves: ["outrage", "vcreate", "extremespeed", "dragondance", "earthquake", "dracometeor", "dragonclaw"],
		randomDoubleBattleMoves: ["tailwind", "vcreate", "extremespeed", "dragondance", "earthquake", "dracometeor", "dragonclaw", "protect"],
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
		// randomBattleMoves: ["vcreate", "extremespeed", "swordsdance", "earthquake", "dragonascent", "dragonclaw", "dragondance"],
		randomDoubleBattleMoves: ["vcreate", "extremespeed", "swordsdance", "earthquake", "dragonascent", "dragonclaw", "dragondance", "protect"],
		requiredMove: "Dragon Ascent",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	jirachi: {
		randomBattleMoves: ["ironhead", "uturn", "firepunch", "icepunch", "stealthrock", "bodyslam", "toxic", "wish", "substitute"],
		randomDoubleBattleMoves: ["bodyslam", "ironhead", "icywind", "thunderwave", "helpinghand", "trickroom", "uturn", "followme", "zenheadbutt", "protect"],
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
		isUnreleased: true,
		tier: "Unreleased",
	},
	deoxys: {
		randomBattleMoves: ["psychoboost", "stealthrock", "spikes", "firepunch", "superpower", "extremespeed", "knockoff", "taunt"],
		randomDoubleBattleMoves: ["psychoboost", "superpower", "extremespeed", "icebeam", "thunderbolt", "firepunch", "protect", "knockoff", "psyshock"],
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
		randomBattleMoves: ["psychoboost", "superpower", "icebeam", "knockoff", "extremespeed", "firepunch", "stealthrock"],
		randomDoubleBattleMoves: ["psychoboost", "superpower", "extremespeed", "icebeam", "thunderbolt", "firepunch", "protect", "knockoff"],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	deoxysdefense: {
		randomBattleMoves: ["spikes", "stealthrock", "recover", "taunt", "toxic", "seismictoss", "knockoff"],
		randomDoubleBattleMoves: ["protect", "stealthrock", "recover", "taunt", "reflect", "seismictoss", "lightscreen", "trickroom", "psychic"],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	deoxysspeed: {
		randomBattleMoves: ["spikes", "stealthrock", "superpower", "psychoboost", "taunt", "magiccoat", "knockoff"],
		randomDoubleBattleMoves: ["superpower", "icebeam", "psychoboost", "taunt", "lightscreen", "reflect", "protect", "knockoff"],
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
		randomBattleMoves: ["stealthrock", "earthquake", "woodhammer", "stoneedge", "synthesis", "rockpolish"],
		randomDoubleBattleMoves: ["protect", "earthquake", "woodhammer", "stoneedge", "rockslide", "wideguard", "rockpolish"],
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
		randomBattleMoves: ["stealthrock", "uturn", "closecombat", "flareblitz", "stoneedge", "machpunch", "nastyplot", "fireblast", "focusblast", "vacuumwave", "grassknot"],
		randomDoubleBattleMoves: ["fakeout", "heatwave", "closecombat", "uturn", "grassknot", "stoneedge", "machpunch", "feint", "taunt", "flareblitz", "thunderpunch", "protect"],
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
		randomBattleMoves: ["hydropump", "flashcannon", "grassknot", "defog", "icebeam", "scald", "toxic", "roar", "stealthrock"],
		randomDoubleBattleMoves: ["icywind", "scald", "surf", "icebeam", "hiddenpowerelectric", "protect", "grassknot", "flashcannon"],
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
		randomBattleMoves: ["bravebird", "closecombat", "uturn", "quickattack", "doubleedge"],
		randomDoubleBattleMoves: ["bravebird", "closecombat", "uturn", "quickattack", "doubleedge", "tailwind", "protect"],
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
		randomBattleMoves: ["return", "liquidation", "swordsdance", "quickattack", "aquajet"],
		randomDoubleBattleMoves: ["return", "liquidation", "curse", "aquajet", "quickattack", "protect", "rest"],
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
		randomBattleMoves: ["leechlife", "endeavor", "taunt", "toxic", "stickyweb", "knockoff"],
		randomDoubleBattleMoves: ["leechlife", "protect", "taunt", "stickyweb", "knockoff"],
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
		randomBattleMoves: ["wildcharge", "icefang", "voltswitch", "crunch", "superpower", "facade"],
		randomDoubleBattleMoves: ["wildcharge", "icefang", "voltswitch", "crunch", "superpower", "facade", "protect"],
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
		randomBattleMoves: ["headsmash", "earthquake", "rockpolish", "crunch", "rockslide", "firepunch"],
		randomDoubleBattleMoves: ["headsmash", "earthquake", "zenheadbutt", "rockslide", "crunch", "stoneedge", "protect"],
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
		randomBattleMoves: ["stealthrock", "rockblast", "metalburst", "protect", "toxic", "roar"],
		randomDoubleBattleMoves: ["stealthrock", "stoneedge", "metalburst", "protect", "wideguard", "guardsplit"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	burmy: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wormadam: {
		randomBattleMoves: ["gigadrain", "bugbuzz", "quiverdance", "hiddenpowerrock", "leafstorm"],
		randomDoubleBattleMoves: ["leafstorm", "gigadrain", "bugbuzz", "hiddenpowerice", "hiddenpowerrock", "stringshot", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wormadamsandy: {
		randomBattleMoves: ["earthquake", "toxic", "protect", "stealthrock"],
		randomDoubleBattleMoves: ["earthquake", "suckerpunch", "rockblast", "protect", "stringshot"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wormadamtrash: {
		randomBattleMoves: ["stealthrock", "toxic", "gyroball", "protect"],
		randomDoubleBattleMoves: ["strugglebug", "stringshot", "gyroball", "bugbuzz", "flashcannon", "suckerpunch", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mothim: {
		randomBattleMoves: ["quiverdance", "bugbuzz", "airslash", "energyball", "uturn"],
		randomDoubleBattleMoves: ["quiverdance", "bugbuzz", "airslash", "gigadrain", "roost", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	combee: {
		tier: "LC",
	},
	vespiquen: {
		randomBattleMoves: ["toxic", "protect", "roost", "infestation", "uturn"],
		randomDoubleBattleMoves: ["tailwind", "healorder", "stringshot", "attackorder", "strugglebug", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	pachirisu: {
		randomBattleMoves: ["nuzzle", "thunderbolt", "superfang", "toxic", "uturn"],
		randomDoubleBattleMoves: ["nuzzle", "thunderbolt", "superfang", "followme", "uturn", "helpinghand", "protect"],
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
		randomBattleMoves: ["bulkup", "liquidation", "icepunch", "substitute", "taunt", "aquajet", "brickbreak"],
		randomDoubleBattleMoves: ["liquidation", "aquajet", "switcheroo", "raindance", "protect", "icepunch", "crunch", "taunt"],
		encounters: [
			{"generation": 4, "level": 22},
			{"generation": 5, "level": 10, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cherubi: {
		tier: "LC",
	},
	cherrim: {
		randomBattleMoves: ["energyball", "dazzlinggleam", "hiddenpowerfire", "synthesis", "healingwish"],
		randomDoubleBattleMoves: ["sunnyday", "solarbeam", "weatherball", "gigadrain", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	cherrimsunshine: {
		randomBattleMoves: ["sunnyday", "solarbeam", "gigadrain", "weatherball", "hiddenpowerice"],
		randomDoubleBattleMoves: ["sunnyday", "solarbeam", "gigadrain", "weatherball", "protect"],
		requiredAbility: 'Flower Gift',
		battleOnly: true,
	},
	shellos: {
		tier: "LC",
	},
	gastrodon: {
		randomBattleMoves: ["earthquake", "icebeam", "scald", "toxic", "recover", "clearsmog"],
		randomDoubleBattleMoves: ["earthpower", "icebeam", "scald", "muddywater", "recover", "icywind", "protect"],
		encounters: [
			{"generation": 4, "level": 20},
		],
		tier: "New",
		doublesTier: "New",
	},
	drifloon: {
		tier: "LC",
	},
	drifblim: {
		randomBattleMoves: ["acrobatics", "willowisp", "substitute", "destinybond", "shadowball", "hex"],
		randomDoubleBattleMoves: ["shadowball", "substitute", "hypnosis", "hiddenpowerfighting", "thunderbolt", "destinybond", "willowisp", "protect"],
		encounters: [
			{"generation": 7, "level": 11, "isHidden": false, "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	buneary: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lopunny: {
		randomBattleMoves: ["return", "switcheroo", "highjumpkick", "icepunch", "healingwish"],
		randomDoubleBattleMoves: ["return", "switcheroo", "highjumpkick", "firepunch", "icepunch", "fakeout", "protect", "encore"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lopunnymega: {
		randomBattleMoves: ["return", "highjumpkick", "substitute", "fakeout", "icepunch"],
		randomDoubleBattleMoves: ["return", "highjumpkick", "protect", "fakeout", "icepunch", "encore"],
		requiredItem: "Lopunnite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	glameow: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	purugly: {
		randomBattleMoves: ["fakeout", "uturn", "suckerpunch", "quickattack", "return", "knockoff"],
		randomDoubleBattleMoves: ["fakeout", "uturn", "suckerpunch", "quickattack", "return", "knockoff", "protect"],
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
		randomBattleMoves: ["pursuit", "suckerpunch", "crunch", "fireblast", "taunt", "poisonjab", "defog"],
		randomDoubleBattleMoves: ["protect", "suckerpunch", "crunch", "fireblast", "taunt", "poisonjab", "playrough", "snarl"],
		encounters: [
			{"generation": 4, "level": 29},
		],
		tier: "New",
		doublesTier: "New",
	},
	bronzor: {
		tier: "LC",
	},
	bronzong: {
		randomBattleMoves: ["stealthrock", "earthquake", "toxic", "reflect", "lightscreen", "trickroom", "explosion", "gyroball"],
		randomDoubleBattleMoves: ["earthquake", "protect", "reflect", "lightscreen", "trickroom", "explosion", "gyroball"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	chatot: {
		randomBattleMoves: ["nastyplot", "boomburst", "heatwave", "hiddenpowerground", "substitute", "chatter", "uturn"],
		randomDoubleBattleMoves: ["nastyplot", "heatwave", "encore", "substitute", "chatter", "uturn", "protect", "hypervoice", "boomburst"],
		eventPokemon: [
			{"generation": 4, "level": 25, "gender": "M", "nature": "Jolly", "abilities": ["keeneye"], "moves": ["mirrormove", "furyattack", "chatter", "taunt"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	spiritomb: {
		randomBattleMoves: ["willowisp", "pursuit", "shadowsneak", "calmmind", "darkpulse", "rest", "sleeptalk", "psychic"],
		randomDoubleBattleMoves: ["shadowsneak", "icywind", "willowisp", "snarl", "darkpulse", "protect", "foulplay", "painsplit"],
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
		randomBattleMoves: ["outrage", "dragonclaw", "earthquake", "stoneedge", "fireblast", "swordsdance", "stealthrock", "firefang"],
		randomDoubleBattleMoves: ["substitute", "dragonclaw", "earthquake", "stoneedge", "rockslide", "swordsdance", "protect", "firefang"],
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
		randomBattleMoves: ["outrage", "dracometeor", "earthquake", "stoneedge", "fireblast", "swordsdance"],
		randomDoubleBattleMoves: ["substitute", "dragonclaw", "earthquake", "stoneedge", "rockslide", "swordsdance", "protect", "fireblast"],
		requiredItem: "Garchompite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	riolu: {
		eventPokemon: [
			{"generation": 4, "level": 30, "gender": "M", "nature": "Serious", "abilities": ["steadfast"], "moves": ["aurasphere", "shadowclaw", "bulletpunch", "drainpunch"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	lucario: {
		randomBattleMoves: ["swordsdance", "closecombat", "crunch", "extremespeed", "icepunch", "meteormash", "nastyplot", "aurasphere", "darkpulse", "vacuumwave", "flashcannon"],
		randomDoubleBattleMoves: ["followme", "closecombat", "crunch", "extremespeed", "icepunch", "bulletpunch", "aurasphere", "darkpulse", "vacuumwave", "flashcannon", "protect"],
		eventPokemon: [
			{"generation": 4, "level": 50, "gender": "M", "nature": "Modest", "abilities": ["steadfast"], "moves": ["aurasphere", "darkpulse", "dragonpulse", "waterpulse"], "pokeball": "cherishball"},
			{"generation": 4, "level": 30, "gender": "M", "nature": "Adamant", "abilities": ["innerfocus"], "moves": ["forcepalm", "bonerush", "sunnyday", "blazekick"], "pokeball": "cherishball"},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["detect", "metalclaw", "counter", "bulletpunch"]},
			{"generation": 5, "level": 50, "gender": "M", "nature": "Naughty", "ivs": {"atk": 31}, "isHidden": true, "moves": ["bulletpunch", "closecombat", "stoneedge", "shadowclaw"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "nature": "Jolly", "isHidden": false, "abilities": ["innerfocus"], "moves": ["closecombat", "aurasphere", "flashcannon", "quickattack"], "pokeball": "cherishball"},
			{"generation": 7, "level": 40, "gender": "M", "nature": "Serious", "isHidden": false, "abilities": ["steadfast"], "moves": ["aurasphere", "highjumpkick", "dragonpulse", "extremespeed"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	lucariomega: {
		randomBattleMoves: ["swordsdance", "closecombat", "crunch", "icepunch", "bulletpunch", "meteormash", "nastyplot", "aurasphere", "darkpulse", "flashcannon"],
		randomDoubleBattleMoves: ["followme", "closecombat", "crunch", "extremespeed", "icepunch", "bulletpunch", "meteormash", "aurasphere", "darkpulse", "vacuumwave", "flashcannon", "protect"],
		requiredItem: "Lucarionite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hippopotas: {
		tier: "LC",
	},
	hippowdon: {
		randomBattleMoves: ["earthquake", "slackoff", "whirlwind", "stealthrock", "toxic", "stoneedge"],
		randomDoubleBattleMoves: ["earthquake", "slackoff", "rockslide", "stealthrock", "protect", "stoneedge", "whirlwind"],
		tier: "New",
		doublesTier: "New",
	},
	skorupi: {
		tier: "LC",
	},
	drapion: {
		randomBattleMoves: ["knockoff", "taunt", "toxicspikes", "poisonjab", "whirlwind", "swordsdance", "aquatail", "earthquake"],
		randomDoubleBattleMoves: ["snarl", "taunt", "protect", "earthquake", "aquatail", "swordsdance", "poisonjab", "knockoff"],
		encounters: [
			{"generation": 4, "level": 22, "pokeball": "safariball"},
			{"generation": 6, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	croagunk: {
		eventPokemon: [
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["astonish", "mudslap", "poisonsting", "taunt"]},
			{"generation": 5, "level": 10, "gender": "M", "isHidden": true, "moves": ["mudslap", "poisonsting", "taunt", "poisonjab"]},
		],
		tier: "LC",
	},
	toxicroak: {
		randomBattleMoves: ["swordsdance", "gunkshot", "drainpunch", "suckerpunch", "icepunch", "substitute"],
		randomDoubleBattleMoves: ["suckerpunch", "drainpunch", "substitute", "swordsdance", "knockoff", "icepunch", "gunkshot", "fakeout", "protect"],
		encounters: [
			{"generation": 4, "level": 22, "pokeball": "safariball"},
			{"generation": 6, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	carnivine: {
		randomBattleMoves: ["swordsdance", "powerwhip", "return", "sleeppowder", "substitute", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "powerwhip", "return", "sleeppowder", "substitute", "leechseed", "knockoff", "ragepowder", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	finneon: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lumineon: {
		randomBattleMoves: ["scald", "icebeam", "uturn", "toxic", "defog"],
		randomDoubleBattleMoves: ["surf", "uturn", "icebeam", "toxic", "raindance", "tailwind", "scald", "protect"],
		encounters: [
			{"generation": 4, "level": 20},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	snover: {
		tier: "LC",
	},
	abomasnow: {
		randomBattleMoves: ["woodhammer", "iceshard", "blizzard", "gigadrain", "leechseed", "substitute", "focuspunch", "earthquake"],
		randomDoubleBattleMoves: ["blizzard", "iceshard", "gigadrain", "protect", "focusblast", "woodhammer", "earthquake"],
		encounters: [
			{"generation": 4, "level": 38},
		],
		tier: "New",
		doublesTier: "New",
	},
	abomasnowmega: {
		randomBattleMoves: ["blizzard", "gigadrain", "woodhammer", "earthquake", "iceshard", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["blizzard", "iceshard", "gigadrain", "protect", "focusblast", "woodhammer", "earthquake"],
		requiredItem: "Abomasite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rotom: {
		randomBattleMoves: ["thunderbolt", "voltswitch", "shadowball", "substitute", "painsplit", "hiddenpowerice", "trick", "willowisp"],
		randomDoubleBattleMoves: ["thunderbolt", "voltswitch", "shadowball", "substitute", "painsplit", "hiddenpowerice", "trick", "willowisp", "electroweb", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 10, "nature": "Naughty", "moves": ["uproar", "astonish", "trick", "thundershock"], "pokeball": "cherishball"},
			{"generation": 6, "level": 10, "nature": "Quirky", "moves": ["shockwave", "astonish", "trick", "thunderwave"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "moves": ["uproar", "confide", "disarmingvoice"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	rotomheat: {
		randomBattleMoves: ["overheat", "thunderbolt", "voltswitch", "hiddenpowerice", "painsplit", "willowisp"],
		randomDoubleBattleMoves: ["overheat", "thunderbolt", "voltswitch", "substitute", "painsplit", "hiddenpowerice", "willowisp", "electroweb", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	rotomwash: {
		randomBattleMoves: ["hydropump", "thunderbolt", "voltswitch", "painsplit", "defog", "willowisp", "trick"],
		randomDoubleBattleMoves: ["hydropump", "thunderbolt", "voltswitch", "substitute", "painsplit", "hiddenpowerice", "willowisp", "trick", "electroweb", "protect", "hiddenpowergrass"],
		tier: "New",
		doublesTier: "New",
	},
	rotomfrost: {
		randomBattleMoves: ["blizzard", "thunderbolt", "voltswitch", "painsplit", "willowisp", "trick"],
		randomDoubleBattleMoves: ["blizzard", "thunderbolt", "voltswitch", "substitute", "painsplit", "willowisp", "trick", "electroweb", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	rotomfan: {
		randomBattleMoves: ["airslash", "thunderbolt", "voltswitch", "painsplit", "willowisp", "defog"],
		randomDoubleBattleMoves: ["airslash", "thunderbolt", "voltswitch", "substitute", "painsplit", "hiddenpowerice", "willowisp", "electroweb", "discharge", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	rotommow: {
		randomBattleMoves: ["leafstorm", "thunderbolt", "voltswitch", "hiddenpowerfire", "hiddenpowerice", "trick"],
		randomDoubleBattleMoves: ["leafstorm", "thunderbolt", "voltswitch", "substitute", "painsplit", "hiddenpowerfire", "willowisp", "trick", "electroweb", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	uxie: {
		randomBattleMoves: ["stealthrock", "thunderwave", "psychic", "uturn", "healbell", "knockoff", "yawn"],
		randomDoubleBattleMoves: ["uturn", "psyshock", "yawn", "healbell", "stealthrock", "thunderbolt", "protect", "helpinghand", "thunderwave"],
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
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "energyball", "signalbeam", "hiddenpowerfire", "icebeam", "healingwish", "stealthrock", "uturn"],
		randomDoubleBattleMoves: ["calmmind", "psychic", "thunderbolt", "icebeam", "substitute", "uturn", "trick", "protect", "knockoff", "helpinghand"],
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
		randomBattleMoves: ["nastyplot", "psyshock", "fireblast", "dazzlinggleam", "stealthrock", "knockoff", "taunt", "explosion"],
		randomDoubleBattleMoves: ["nastyplot", "psychic", "fireblast", "thunderbolt", "icepunch", "knockoff", "zenheadbutt", "uturn", "taunt", "protect", "dazzlinggleam"],
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
		randomBattleMoves: ["stealthrock", "toxic", "dracometeor", "fireblast", "flashcannon", "roar", "thunderbolt"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "protect", "thunderbolt", "flashcannon", "earthpower", "fireblast", "aurasphere"],
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
		randomBattleMoves: ["spacialrend", "dracometeor", "hydropump", "thunderwave", "dragontail", "fireblast"],
		randomDoubleBattleMoves: ["spacialrend", "dracometeor", "surf", "hydropump", "thunderbolt", "fireblast", "protect"],
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
		randomBattleMoves: ["magmastorm", "lavaplume", "stealthrock", "earthpower", "flashcannon", "protect", "toxic", "roar"],
		randomDoubleBattleMoves: ["heatwave", "substitute", "earthpower", "protect", "eruption", "willowisp"],
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
		unreleasedHidden: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	regigigas: {
		randomBattleMoves: ["thunderwave", "confuseray", "substitute", "return", "knockoff", "drainpunch"],
		randomDoubleBattleMoves: ["thunderwave", "substitute", "return", "icywind", "rockslide", "earthquake", "knockoff", "wideguard"],
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
		randomBattleMoves: ["rest", "sleeptalk", "dragontail", "roar", "willowisp", "shadowball", "dragonpulse"],
		randomDoubleBattleMoves: ["tailwind", "shadowsneak", "protect", "dragontail", "willowisp", "calmmind", "dragonpulse", "shadowball"],
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
		randomBattleMoves: ["dracometeor", "shadowsneak", "dragontail", "willowisp", "defog", "toxic", "shadowball", "earthquake"],
		randomDoubleBattleMoves: ["dracometeor", "shadowsneak", "tailwind", "hiddenpowerfire", "willowisp", "calmmind", "substitute", "dragonpulse", "shadowball", "aurasphere", "protect", "earthquake"],
		eventOnly: true,
		requiredItem: "Griseous Orb",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cresselia: {
		randomBattleMoves: ["moonlight", "psychic", "icebeam", "thunderwave", "toxic", "substitute", "psyshock", "moonblast", "calmmind"],
		randomDoubleBattleMoves: ["psyshock", "icywind", "thunderwave", "trickroom", "moonblast", "moonlight", "skillswap", "reflect", "lightscreen", "icebeam", "protect", "helpinghand"],
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
		randomBattleMoves: ["scald", "knockoff", "uturn", "icebeam", "toxic", "healbell"],
		randomDoubleBattleMoves: ["raindance", "scald", "uturn", "rest", "icebeam", "helpinghand", "icywind", "protect"],
		eventPokemon: [
			{"generation": 4, "level": 50, "moves": ["grassknot", "raindance", "rest", "surf"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	manaphy: {
		randomBattleMoves: ["tailglow", "surf", "icebeam", "energyball", "psychic"],
		randomDoubleBattleMoves: ["tailglow", "surf", "icebeam", "energyball", "protect", "scald", "icywind", "helpinghand"],
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
		randomBattleMoves: ["hypnosis", "darkpulse", "focusblast", "nastyplot", "substitute", "sludgebomb"],
		randomDoubleBattleMoves: ["darkpulse", "focusblast", "nastyplot", "substitute", "snarl", "icebeam", "protect"],
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
		randomBattleMoves: ["seedflare", "earthpower", "airslash", "psychic", "rest", "substitute", "leechseed"],
		randomDoubleBattleMoves: ["seedflare", "earthpower", "airslash", "hiddenpowerfire", "rest", "substitute", "leechseed", "tailwind", "protect"],
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
		randomBattleMoves: ["seedflare", "airslash", "earthpower", "hiddenpowerice", "substitute", "leechseed"],
		randomDoubleBattleMoves: ["seedflare", "earthpower", "airslash", "rest", "substitute", "leechseed", "tailwind", "protect", "hiddenpowerice"],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	arceus: {
		randomBattleMoves: ["swordsdance", "extremespeed", "shadowclaw", "earthquake", "recover"],
		randomDoubleBattleMoves: ["swordsdance", "extremespeed", "shadowclaw", "earthquake", "recover", "protect"],
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
		randomBattleMoves: ["swordsdance", "xscissor", "stoneedge", "recover", "earthquake", "ironhead"],
		randomDoubleBattleMoves: ["swordsdance", "xscissor", "stoneedge", "recover", "earthquake", "ironhead", "protect"],
		eventOnly: true,
		requiredItems: ["Insect Plate", "Buginium Z"],
	},
	arceusdark: {
		randomBattleMoves: ["calmmind", "judgment", "recover", "fireblast", "toxic"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "recover", "focusblast", "safeguard", "snarl", "willowisp", "protect"],
		eventOnly: true,
		requiredItems: ["Dread Plate", "Darkinium Z"],
	},
	arceusdragon: {
		randomBattleMoves: ["swordsdance", "outrage", "extremespeed", "earthquake", "recover", "judgment", "fireblast", "willowisp", "defog"],
		randomDoubleBattleMoves: ["swordsdance", "dragonclaw", "extremespeed", "earthquake", "recover", "protect"],
		eventOnly: true,
		requiredItems: ["Draco Plate", "Dragonium Z"],
	},
	arceuselectric: {
		randomBattleMoves: ["calmmind", "judgment", "recover", "icebeam", "earthpower"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "recover", "icebeam", "protect"],
		eventOnly: true,
		requiredItems: ["Zap Plate", "Electrium Z"],
	},
	arceusfairy: {
		randomBattleMoves: ["calmmind", "judgment", "recover", "willowisp", "defog", "earthpower", "toxic"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "recover", "willowisp", "protect", "earthpower", "thunderbolt"],
		eventOnly: true,
		requiredItems: ["Pixie Plate", "Fairium Z"],
	},
	arceusfighting: {
		randomBattleMoves: ["calmmind", "judgment", "stoneedge", "shadowball", "recover", "roar", "icebeam"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "icebeam", "shadowball", "recover", "willowisp", "protect"],
		eventOnly: true,
		requiredItems: ["Fist Plate", "Fightinium Z"],
	},
	arceusfire: {
		randomBattleMoves: ["calmmind", "fireblast", "roar", "thunderbolt", "icebeam", "recover"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "thunderbolt", "recover", "heatwave", "protect", "willowisp"],
		eventOnly: true,
		requiredItems: ["Flame Plate", "Firium Z"],
	},
	arceusflying: {
		randomBattleMoves: ["calmmind", "judgment", "earthpower", "fireblast", "toxic", "recover"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "safeguard", "recover", "substitute", "tailwind", "protect"],
		eventOnly: true,
		requiredItems: ["Sky Plate", "Flyinium Z"],
	},
	arceusghost: {
		randomBattleMoves: ["swordsdance", "shadowforce", "shadowclaw", "brickbreak", "extremespeed", "recover", "judgment", "toxic", "defog"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "focusblast", "recover", "swordsdance", "shadowforce", "brickbreak", "willowisp", "protect"],
		eventOnly: true,
		requiredItems: ["Spooky Plate", "Ghostium Z"],
	},
	arceusgrass: {
		randomBattleMoves: ["judgment", "recover", "calmmind", "icebeam", "fireblast"],
		randomDoubleBattleMoves: ["calmmind", "icebeam", "judgment", "earthpower", "recover", "safeguard", "thunderwave", "protect"],
		eventOnly: true,
		requiredItems: ["Meadow Plate", "Grassium Z"],
	},
	arceusground: {
		randomBattleMoves: ["swordsdance", "earthquake", "stoneedge", "recover", "judgment", "icebeam", "toxic", "stealthrock"],
		randomDoubleBattleMoves: ["swordsdance", "earthquake", "stoneedge", "recover", "calmmind", "judgment", "icebeam", "rockslide", "protect"],
		eventOnly: true,
		requiredItems: ["Earth Plate", "Groundium Z"],
	},
	arceusice: {
		randomBattleMoves: ["calmmind", "judgment", "thunderbolt", "fireblast", "recover"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "thunderbolt", "focusblast", "recover", "protect", "icywind"],
		eventOnly: true,
		requiredItems: ["Icicle Plate", "Icium Z"],
	},
	arceuspoison: {
		randomBattleMoves: ["calmmind", "sludgebomb", "fireblast", "recover", "icebeam", "defog"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "sludgebomb", "heatwave", "recover", "willowisp", "protect", "earthpower"],
		eventOnly: true,
		requiredItems: ["Toxic Plate", "Poisonium Z"],
	},
	arceuspsychic: {
		randomBattleMoves: ["judgment", "calmmind", "fireblast", "recover", "icebeam", "toxic"],
		randomDoubleBattleMoves: ["calmmind", "psyshock", "focusblast", "recover", "willowisp", "judgment", "protect"],
		eventOnly: true,
		requiredItems: ["Mind Plate", "Psychium Z"],
	},
	arceusrock: {
		randomBattleMoves: ["swordsdance", "earthquake", "stoneedge", "recover", "judgment", "willowisp", "stealthrock"],
		randomDoubleBattleMoves: ["swordsdance", "stoneedge", "recover", "rockslide", "earthquake", "protect"],
		eventOnly: true,
		requiredItems: ["Stone Plate", "Rockium Z"],
	},
	arceussteel: {
		randomBattleMoves: ["judgment", "recover", "willowisp", "defog", "roar", "swordsdance", "ironhead", "earthquake", "stoneedge"],
		randomDoubleBattleMoves: ["calmmind", "judgment", "recover", "protect", "willowisp"],
		eventOnly: true,
		requiredItems: ["Iron Plate", "Steelium Z"],
	},
	arceuswater: {
		randomBattleMoves: ["recover", "calmmind", "judgment", "icebeam", "toxic", "defog"],
		randomDoubleBattleMoves: ["recover", "calmmind", "judgment", "icebeam", "fireblast", "icywind", "surf", "protect"],
		eventOnly: true,
		requiredItems: ["Splash Plate", "Waterium Z"],
	},
	victini: {
		randomBattleMoves: ["vcreate", "boltstrike", "uturn", "zenheadbutt", "grassknot", "focusblast", "blueflare"],
		randomDoubleBattleMoves: ["vcreate", "boltstrike", "uturn", "psychic", "focusblast", "blueflare", "protect"],
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
		randomBattleMoves: ["leafstorm", "dragonpulse", "hiddenpowerfire", "substitute", "leechseed", "glare"],
		randomDoubleBattleMoves: ["leafstorm", "hiddenpowerfire", "substitute", "taunt", "dragonpulse", "protect"],
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
		randomBattleMoves: ["flareblitz", "superpower", "wildcharge", "headsmash", "fireblast", "grassknot", "suckerpunch"],
		randomDoubleBattleMoves: ["flareblitz", "superpower", "flamecharge", "wildcharge", "headsmash", "protect", "heatwave", "rockslide"],
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
		randomBattleMoves: ["swordsdance", "liquidation", "aquajet", "megahorn", "sacredsword", "hydropump", "icebeam", "grassknot"],
		randomDoubleBattleMoves: ["hydropump", "aquajet", "icebeam", "scald", "hiddenpowergrass", "taunt", "helpinghand", "protect"],
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
		randomBattleMoves: ["hypnosis", "substitute", "superfang", "swordsdance", "return", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "knockoff", "substitute", "hypnosis", "return", "superfang", "protect"],
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
		randomBattleMoves: ["return", "crunch", "wildcharge", "superpower", "icefang"],
		randomDoubleBattleMoves: ["return", "wildcharge", "superpower", "crunch", "icefang", "protect"],
		encounters: [
			{"generation": 5, "level": 23, "isHidden": false},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	purrloin: {
		tier: "LC",
	},
	liepard: {
		randomBattleMoves: ["knockoff", "playrough", "uturn", "copycat", "encore", "thunderwave", "nastyplot", "darkpulse", "substitute"],
		randomDoubleBattleMoves: ["encore", "thunderwave", "substitute", "knockoff", "playrough", "uturn", "suckerpunch", "fakeout", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 20, "gender": "F", "nature": "Jolly", "isHidden": true, "moves": ["fakeout", "foulplay", "encore", "swagger"]},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["nastyplot", "gigadrain", "focusblast", "hiddenpowerice", "substitute", "leafstorm", "knockoff", "superpower"],
		randomDoubleBattleMoves: ["nastyplot", "leafstorm", "hiddenpowerfire", "hiddenpowerice", "gigadrain", "focusblast", "substitute", "taunt", "synthesis", "helpinghand", "spikyshield"],
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
		randomBattleMoves: ["substitute", "nastyplot", "fireblast", "focusblast", "grassknot", "hiddenpowerrock"],
		randomDoubleBattleMoves: ["nastyplot", "fireblast", "focusblast", "grassknot", "hiddenpowerground", "substitute", "heatwave", "taunt", "protect"],
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
		randomBattleMoves: ["substitute", "nastyplot", "hydropump", "icebeam", "focusblast"],
		randomDoubleBattleMoves: ["nastyplot", "hydropump", "icebeam", "substitute", "surf", "taunt", "helpinghand", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	munna: {
		tier: "LC",
	},
	musharna: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "signalbeam", "moonlight", "healbell", "thunderwave"],
		randomDoubleBattleMoves: ["trickroom", "thunderwave", "moonlight", "psychic", "hiddenpowerfighting", "helpinghand", "psyshock", "hypnosis", "signalbeam", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 50, "isHidden": true, "moves": ["defensecurl", "luckychant", "psybeam", "hypnosis"]},
		],
		tier: "New",
		doublesTier: "New",
	},
	pidove: {
		eventPokemon: [
			{"generation": 5, "level": 1, "shiny": 1, "gender": "F", "nature": "Hardy", "ivs": {"atk": 31}, "isHidden": false, "abilities": ["superluck"], "moves": ["gust", "quickattack", "aircutter"], "pokeball": "pokeball"},
		],
		tier: "LC",
	},
	tranquill: {
		tier: "NFE",
	},
	unfezant: {
		randomBattleMoves: ["return", "pluck", "hypnosis", "tailwind", "uturn", "roost", "nightslash"],
		randomDoubleBattleMoves: ["pluck", "uturn", "return", "protect", "tailwind", "taunt", "roost", "nightslash"],
		encounters: [
			{"generation": 5, "level": 22, "isHidden": false},
		],
		tier: "New",
		doublesTier: "New",
	},
	blitzle: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zebstrika: {
		randomBattleMoves: ["voltswitch", "hiddenpowergrass", "overheat", "wildcharge", "thunderbolt"],
		randomDoubleBattleMoves: ["voltswitch", "hiddenpowergrass", "overheat", "wildcharge", "protect"],
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
		randomBattleMoves: ["stealthrock", "rockblast", "earthquake", "explosion", "stoneedge", "superpower"],
		randomDoubleBattleMoves: ["stealthrock", "rockslide", "earthquake", "explosion", "stoneedge", "autotomize", "superpower", "wideguard", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	woobat: {
		tier: "LC",
	},
	swoobat: {
		randomBattleMoves: ["substitute", "calmmind", "storedpower", "heatwave", "airslash", "roost"],
		randomDoubleBattleMoves: ["calmmind", "psychic", "airslash", "gigadrain", "protect", "heatwave", "tailwind"],
		tier: "New",
		doublesTier: "New",
	},
	drilbur: {
		tier: "LC",
	},
	excadrill: {
		randomBattleMoves: ["swordsdance", "earthquake", "ironhead", "rockslide", "rapidspin"],
		randomDoubleBattleMoves: ["swordsdance", "drillrun", "earthquake", "rockslide", "ironhead", "substitute", "protect"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	audino: {
		randomBattleMoves: ["wish", "protect", "healbell", "toxic", "thunderwave", "reflect", "lightscreen", "doubleedge"],
		randomDoubleBattleMoves: ["healpulse", "protect", "healbell", "trickroom", "thunderwave", "reflect", "lightscreen", "doubleedge", "helpinghand", "hypervoice"],
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
		randomBattleMoves: ["wish", "calmmind", "healbell", "dazzlinggleam", "protect", "fireblast"],
		randomDoubleBattleMoves: ["healpulse", "protect", "healbell", "trickroom", "thunderwave", "hypervoice", "helpinghand", "dazzlinggleam"],
		requiredItem: "Audinite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	timburr: {
		tier: "LC",
	},
	gurdurr: {
		tier: "NFE",
	},
	conkeldurr: {
		randomBattleMoves: ["bulkup", "drainpunch", "icepunch", "knockoff", "machpunch"],
		randomDoubleBattleMoves: ["wideguard", "machpunch", "drainpunch", "icepunch", "knockoff", "protect"],
		tier: "New",
		doublesTier: "New",
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
		encounters: [
			{"generation": 5, "level": 15, "isHidden": false},
		],
		tier: "New",
		doublesTier: "New",
	},
	throh: {
		randomBattleMoves: ["bulkup", "circlethrow", "icepunch", "stormthrow", "rest", "sleeptalk", "knockoff"],
		randomDoubleBattleMoves: ["helpinghand", "circlethrow", "icepunch", "stormthrow", "wideguard", "knockoff", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	sawk: {
		randomBattleMoves: ["closecombat", "earthquake", "icepunch", "poisonjab", "bulkup", "knockoff"],
		randomDoubleBattleMoves: ["closecombat", "knockoff", "icepunch", "rockslide", "protect"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["stickyweb", "swordsdance", "leafblade", "xscissor", "knockoff"],
		randomDoubleBattleMoves: ["swordsdance", "leafblade", "xscissor", "protect", "stickyweb", "poisonjab"],
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
		randomBattleMoves: ["protect", "spikes", "toxicspikes", "megahorn", "rockslide", "earthquake", "swordsdance", "poisonjab"],
		randomDoubleBattleMoves: ["substitute", "protect", "megahorn", "rockslide", "poisonjab", "swordsdance", "batonpass", "aquatail", "superpower"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cottonee: {
		tier: "LC",
	},
	whimsicott: {
		randomBattleMoves: ["encore", "taunt", "leechseed", "uturn", "toxic", "stunspore", "memento", "tailwind", "moonblast", "defog"],
		randomDoubleBattleMoves: ["encore", "taunt", "substitute", "leechseed", "uturn", "helpinghand", "stunspore", "moonblast", "tailwind", "dazzlinggleam", "gigadrain", "protect", "defog"],
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "F", "nature": "Timid", "ivs": {"spe": 31}, "isHidden": false, "abilities": ["prankster"], "moves": ["swagger", "gigadrain", "beatup", "helpinghand"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	petilil: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lilligant: {
		randomBattleMoves: ["sleeppowder", "quiverdance", "petaldance", "gigadrain", "hiddenpowerfire", "hiddenpowerrock"],
		randomDoubleBattleMoves: ["quiverdance", "gigadrain", "sleeppowder", "hiddenpowerice", "hiddenpowerfire", "hiddenpowerrock", "petaldance", "helpinghand", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	basculin: {
		randomBattleMoves: ["liquidation", "aquajet", "superpower", "crunch", "headsmash"],
		randomDoubleBattleMoves: ["liquidation", "aquajet", "superpower", "crunch", "doubleedge", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	basculinbluestriped: {
		randomBattleMoves: ["liquidation", "aquajet", "superpower", "crunch", "headsmash"],
		randomDoubleBattleMoves: ["liquidation", "aquajet", "superpower", "crunch", "doubleedge", "protect"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["earthquake", "stoneedge", "pursuit", "knockoff", "stealthrock", "superpower"],
		randomDoubleBattleMoves: ["earthquake", "stoneedge", "protect", "knockoff", "superpower"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	// TODO: Check Legality
	darumaka: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	darumakagalar: {
		tier: "LC",
	},
	// TODO: Check Legality
	darmanitan: {
		randomBattleMoves: ["uturn", "flareblitz", "rockslide", "earthquake", "superpower"],
		randomDoubleBattleMoves: ["uturn", "flareblitz", "firepunch", "rockslide", "earthquake", "superpower", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 35, "isHidden": true, "moves": ["thrash", "bellydrum", "flareblitz", "hammerarm"]},
			{"generation": 6, "level": 35, "gender": "M", "nature": "Calm", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": true, "moves": ["thrash", "bellydrum", "flareblitz", "hammerarm"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 32, "maxEggMoves": 1},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	darmanitanzen: {
		requiredAbility: "Zen Mode",
		battleOnly: true,
	},
	darmanitangalar: {
		tier: "New",
		doublesTier: "New",
	},
	maractus: {
		randomBattleMoves: ["spikes", "gigadrain", "leechseed", "hiddenpowerfire", "toxic", "suckerpunch", "spikyshield"],
		randomDoubleBattleMoves: ["grassyterrain", "gigadrain", "leechseed", "hiddenpowerfire", "helpinghand", "suckerpunch", "spikyshield"],
		tier: "New",
		doublesTier: "New",
	},
	dwebble: {
		tier: "LC",
	},
	crustle: {
		randomBattleMoves: ["stealthrock", "spikes", "shellsmash", "earthquake", "rockblast", "xscissor", "stoneedge"],
		randomDoubleBattleMoves: ["protect", "shellsmash", "earthquake", "rockslide", "xscissor", "stoneedge"],
		encounters: [
			{"generation": 6, "level": 33, "maxEggMoves": 1},
		],
		tier: "New",
		doublesTier: "New",
	},
	scraggy: {
		eventPokemon: [
			{"generation": 5, "level": 1, "gender": "M", "nature": "Adamant", "isHidden": false, "abilities": ["moxie"], "moves": ["headbutt", "leer", "highjumpkick", "lowkick"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	scrafty: {
		randomBattleMoves: ["dragondance", "icepunch", "highjumpkick", "drainpunch", "rest", "bulkup", "knockoff"],
		randomDoubleBattleMoves: ["fakeout", "drainpunch", "knockoff", "icepunch", "stoneedge", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "M", "nature": "Brave", "isHidden": false, "abilities": ["moxie"], "moves": ["firepunch", "payback", "drainpunch", "substitute"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	sigilyph: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "heatwave", "roost", "airslash", "icebeam"],
		randomDoubleBattleMoves: ["psyshock", "heatwave", "icebeam", "airslash", "energyball", "shadowball", "tailwind", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	yamask: {
		tier: "LC",
	},
	yamaskgalar: {
		tier: "LC",
	},
	cofagrigus: {
		randomBattleMoves: ["nastyplot", "trickroom", "shadowball", "hiddenpowerfighting", "willowisp", "haze", "painsplit", "toxicspikes"],
		randomDoubleBattleMoves: ["nastyplot", "trickroom", "shadowball", "hiddenpowerfighting", "willowisp", "protect", "painsplit"],
		eventPokemon: [
			{"generation": 7, "level": 66, "gender": "M", "moves": ["willowisp", "shadowball", "powersplit", "darkpulse"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 32, "maxEggMoves": 1},
		],
		tier: "New",
		doublesTier: "New",
	},
	runerigus: {
		tier: "New",
		doublesTier: "New",
	},
	tirtouga: {
		eventPokemon: [
			{"generation": 5, "level": 15, "gender": "M", "isHidden": false, "abilities": ["sturdy"], "moves": ["bite", "protect", "aquajet", "bodyslam"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	carracosta: {
		randomBattleMoves: ["shellsmash", "aquajet", "liquidation", "stoneedge", "earthquake"],
		randomDoubleBattleMoves: ["shellsmash", "aquajet", "liquidation", "stoneedge", "earthquake", "protect", "wideguard", "rockslide"],
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
		randomBattleMoves: ["headsmash", "acrobatics", "stoneedge", "earthquake", "aquatail", "uturn", "endeavor"],
		randomDoubleBattleMoves: ["stoneedge", "rockslide", "earthquake", "uturn", "acrobatics", "tailwind", "taunt", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	trubbish: {
		tier: "LC",
	},
	garbodor: {
		randomBattleMoves: ["spikes", "toxicspikes", "gunkshot", "haze", "painsplit", "toxic", "drainpunch"],
		randomDoubleBattleMoves: ["protect", "painsplit", "gunkshot", "seedbomb", "drainpunch", "explosion", "rockblast"],
		encounters: [
			{"generation": 5, "level": 31, "isHidden": false},
			{"generation": 6, "level": 30},
			{"generation": 7, "level": 24},
		],
		tier: "New",
		doublesTier: "New",
	},
	garbodorgigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	zorua: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zoroark: {
		randomBattleMoves: ["suckerpunch", "darkpulse", "focusblast", "flamethrower", "uturn", "nastyplot", "knockoff", "trick", "sludgebomb"],
		randomDoubleBattleMoves: ["suckerpunch", "darkpulse", "focusblast", "flamethrower", "uturn", "nastyplot", "knockoff", "protect"],
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
		randomBattleMoves: ["tailslap", "bulletseed", "rockblast", "knockoff", "uturn"],
		randomDoubleBattleMoves: ["tailslap", "aquatail", "uturn", "knockoff", "bulletseed", "rockblast", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	gothita: {
		tier: "NFE",
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
		randomBattleMoves: ["confide", "charm", "taunt", "rest"],
		randomDoubleBattleMoves: ["psychic", "thunderbolt", "shadowball", "hiddenpowerfighting", "reflect", "lightscreen", "psyshock", "energyball", "trickroom", "taunt", "healpulse", "protect"],
		encounters: [
			{"generation": 5, "level": 34, "isHidden": false},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["calmmind", "recover", "psychic", "focusblast", "shadowball", "trickroom", "psyshock"],
		randomDoubleBattleMoves: ["energyball", "helpinghand", "psychic", "focusblast", "shadowball", "trickroom", "psyshock", "hiddenpowerfire", "protect"],
		encounters: [
			{"generation": 5, "level": 34, "isHidden": false},
		],
		tier: "New",
		doublesTier: "New",
	},
	ducklett: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	swanna: {
		randomBattleMoves: ["bravebird", "roost", "hurricane", "icebeam", "raindance", "defog", "scald"],
		randomDoubleBattleMoves: ["airslash", "roost", "hurricane", "surf", "icebeam", "raindance", "tailwind", "scald", "protect"],
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
		randomBattleMoves: ["blizzard", "explosion", "hiddenpowerground", "flashcannon", "autotomize", "freezedry"],
		randomDoubleBattleMoves: ["blizzard", "taunt", "hiddenpowerground", "flashcannon", "autotomize", "protect", "freezedry"],
		tier: "New",
		doublesTier: "New",
	},
	deerling: {
		eventPokemon: [
			{"generation": 5, "level": 30, "gender": "F", "isHidden": true, "moves": ["feintattack", "takedown", "jumpkick", "aromatherapy"]},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	sawsbuck: {
		randomBattleMoves: ["swordsdance", "hornleech", "jumpkick", "return", "substitute"],
		randomDoubleBattleMoves: ["swordsdance", "hornleech", "jumpkick", "return", "substitute", "synthesis", "protect"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	emolga: {
		randomBattleMoves: ["thunderbolt", "acrobatics", "encore", "uturn", "knockoff", "roost", "toxic"],
		randomDoubleBattleMoves: ["helpinghand", "tailwind", "encore", "substitute", "thunderbolt", "airslash", "roost", "protect"],
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
		randomBattleMoves: ["megahorn", "pursuit", "ironhead", "knockoff", "swordsdance", "drillrun"],
		randomDoubleBattleMoves: ["megahorn", "protect", "ironhead", "knockoff", "swordsdance", "drillrun"],
		tier: "New",
		doublesTier: "New",
	},
	foongus: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	amoonguss: {
		randomBattleMoves: ["spore", "stunspore", "gigadrain", "clearsmog", "hiddenpowerfire", "synthesis", "sludgebomb", "foulplay"],
		randomDoubleBattleMoves: ["spore", "stunspore", "gigadrain", "ragepowder", "hiddenpowerfire", "synthesis", "sludgebomb", "protect"],
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
		randomBattleMoves: ["scald", "willowisp", "recover", "toxic", "shadowball", "icebeam", "taunt"],
		randomDoubleBattleMoves: ["scald", "willowisp", "recover", "trickroom", "shadowball", "icebeam", "waterspout", "icywind", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 40, "isHidden": true, "moves": ["waterpulse", "ominouswind", "brine", "raindance"]},
		],
		encounters: [
			{"generation": 5, "level": 5, "isHidden": false},
		],
		tier: "New",
		doublesTier: "New",
	},
	alomomola: {
		randomBattleMoves: ["wish", "protect", "knockoff", "toxic", "scald"],
		randomDoubleBattleMoves: ["wish", "protect", "knockoff", "icywind", "scald", "helpinghand", "wideguard"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	joltik: {
		tier: "LC",
	},
	galvantula: {
		randomBattleMoves: ["thunder", "hiddenpowerice", "gigadrain", "bugbuzz", "voltswitch", "stickyweb"],
		randomDoubleBattleMoves: ["thunder", "hiddenpowerice", "gigadrain", "bugbuzz", "voltswitch", "stickyweb", "protect"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	ferroseed: {
		tier: "LC",
	},
	ferrothorn: {
		randomBattleMoves: ["spikes", "stealthrock", "leechseed", "powerwhip", "protect", "knockoff", "gyroball"],
		randomDoubleBattleMoves: ["gyroball", "stealthrock", "leechseed", "powerwhip", "knockoff", "protect"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["shiftgear", "return", "geargrind", "wildcharge", "substitute"],
		randomDoubleBattleMoves: ["shiftgear", "return", "geargrind", "wildcharge", "protect"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["thunderbolt", "flamethrower", "uturn", "gigadrain", "knockoff", "superpower", "hiddenpowerice"],
		randomDoubleBattleMoves: ["thunderbolt", "flamethrower", "uturn", "voltswitch", "knockoff", "gigadrain", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	elgyem: {
		tier: "LC",
	},
	beheeyem: {
		randomBattleMoves: ["nastyplot", "psychic", "psyshock", "thunderbolt", "hiddenpowerfighting", "trick", "trickroom", "signalbeam"],
		randomDoubleBattleMoves: ["nastyplot", "psychic", "thunderbolt", "hiddenpowerfighting", "recover", "trick", "trickroom", "signalbeam", "protect"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["calmmind", "shadowball", "energyball", "fireblast", "hiddenpowerground", "trick", "substitute", "painsplit"],
		randomDoubleBattleMoves: ["shadowball", "energyball", "overheat", "heatwave", "hiddenpowerice", "trick", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 50, "gender": "F", "nature": "Modest", "ivs": {"spa": 31}, "isHidden": false, "abilities": ["flashfire"], "moves": ["heatwave", "shadowball", "energyball", "psychic"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["dragondance", "swordsdance", "outrage", "earthquake", "poisonjab", "taunt"],
		randomDoubleBattleMoves: ["dragondance", "swordsdance", "protect", "dragonclaw", "earthquake", "poisonjab", "taunt"],
		eventPokemon: [
			{"generation": 5, "level": 59, "gender": "F", "nature": "Naive", "ivs": {"hp": 30, "atk": 30, "def": 30, "spa": 30, "spd": 30, "spe": 30}, "isHidden": false, "abilities": ["moldbreaker"], "moves": ["earthquake", "dualchop", "xscissor", "dragondance"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	cubchoo: {
		eventPokemon: [
			{"generation": 5, "level": 15, "isHidden": false, "moves": ["powdersnow", "growl", "bide", "icywind"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	beartic: {
		randomBattleMoves: ["iciclecrash", "superpower", "nightslash", "stoneedge", "swordsdance", "aquajet"],
		randomDoubleBattleMoves: ["iciclecrash", "superpower", "nightslash", "stoneedge", "swordsdance", "aquajet", "protect"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	cryogonal: {
		randomBattleMoves: ["icebeam", "recover", "toxic", "rapidspin", "haze", "freezedry", "hiddenpowerground"],
		randomDoubleBattleMoves: ["icebeam", "recover", "icywind", "protect", "reflect", "freezedry", "hiddenpowerground"],
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
		randomBattleMoves: ["spikes", "yawn", "bugbuzz", "focusblast", "energyball", "hiddenpowerrock", "encore", "toxicspikes"],
		randomDoubleBattleMoves: ["protect", "yawn", "bugbuzz", "focusblast", "gigadrain", "hiddenpowerrock", "encore", "sludgebomb"],
		tier: "New",
		doublesTier: "New",
	},
	// TODO: Check Legality
	stunfisk: {
		randomBattleMoves: ["discharge", "earthpower", "scald", "toxic", "rest", "sleeptalk", "stealthrock"],
		randomDoubleBattleMoves: ["discharge", "earthpower", "scald", "electroweb", "protect", "stealthrock"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	stunfiskgalar: {
		tier: "New",
		doublesTier: "New",
	},
	mienfoo: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	mienshao: {
		randomBattleMoves: ["uturn", "fakeout", "highjumpkick", "stoneedge", "poisonjab", "swordsdance", "knockoff"],
		randomDoubleBattleMoves: ["uturn", "fakeout", "highjumpkick", "stoneedge", "drainpunch", "swordsdance", "wideguard", "knockoff", "feint", "protect"],
		eventPokemon: [
			{"generation": 7, "level": 65, "gender": "M", "isHidden": false, "abilities": ["innerfocus"], "moves": ["fakeout", "dualchop", "highjumpkick", "uturn"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	druddigon: {
		randomBattleMoves: ["outrage", "earthquake", "suckerpunch", "dragontail", "taunt", "glare", "stealthrock", "gunkshot", "firepunch"],
		randomDoubleBattleMoves: ["superpower", "earthquake", "suckerpunch", "dragonclaw", "glare", "protect", "firepunch", "thunderpunch"],
		eventPokemon: [
			{"generation": 5, "level": 1, "shiny": true, "isHidden": false, "moves": ["leer", "scratch"], "pokeball": "pokeball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	golett: {
		tier: "LC",
	},
	golurk: {
		randomBattleMoves: ["earthquake", "shadowpunch", "dynamicpunch", "icepunch", "stealthrock", "rockpolish"],
		randomDoubleBattleMoves: ["earthquake", "shadowpunch", "dynamicpunch", "icepunch", "stoneedge", "protect", "rockpolish"],
		eventPokemon: [
			{"generation": 5, "level": 70, "shiny": true, "isHidden": false, "abilities": ["ironfist"], "moves": ["shadowpunch", "hyperbeam", "gyroball", "hammerarm"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	pawniard: {
		tier: "LC",
	},
	bisharp: {
		randomBattleMoves: ["swordsdance", "knockoff", "ironhead", "suckerpunch", "lowkick"],
		randomDoubleBattleMoves: ["swordsdance", "substitute", "suckerpunch", "ironhead", "brickbreak", "knockoff", "protect"],
		encounters: [
			{"generation": 7, "level": 33, "isHidden": false},
		],
		tier: "New",
		doublesTier: "New",
	},
	bouffalant: {
		randomBattleMoves: ["headcharge", "earthquake", "stoneedge", "megahorn", "swordsdance", "superpower"],
		randomDoubleBattleMoves: ["headcharge", "earthquake", "stoneedge", "megahorn", "swordsdance", "superpower", "protect"],
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
		randomBattleMoves: ["bravebird", "superpower", "return", "uturn", "substitute", "bulkup", "roost"],
		randomDoubleBattleMoves: ["bravebird", "superpower", "return", "uturn", "tailwind", "rockslide", "bulkup", "roost", "skydrop", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 25, "gender": "M", "isHidden": true, "moves": ["wingattack", "honeclaws", "scaryface", "aerialace"]},
		],
		encounters: [
			{"generation": 6, "level": 45, "isHidden": false},
		],
		tier: "New",
		doublesTier: "New",
	},
	vullaby: {
		tier: "LC",
	},
	mandibuzz: {
		randomBattleMoves: ["foulplay", "bravebird", "roost", "taunt", "toxic", "uturn", "defog"],
		randomDoubleBattleMoves: ["knockoff", "roost", "taunt", "tailwind", "snarl", "uturn", "bravebird", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 25, "gender": "F", "isHidden": true, "moves": ["pluck", "nastyplot", "flatter", "feintattack"]},
		],
		tier: "New",
		doublesTier: "New",
	},
	heatmor: {
		randomBattleMoves: ["fireblast", "suckerpunch", "focusblast", "gigadrain", "knockoff"],
		randomDoubleBattleMoves: ["fireblast", "suckerpunch", "focusblast", "gigadrain", "heatwave", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	durant: {
		randomBattleMoves: ["honeclaws", "ironhead", "xscissor", "rockslide", "superpower"],
		randomDoubleBattleMoves: ["honeclaws", "ironhead", "xscissor", "rockslide", "protect", "superpower"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["uturn", "dracometeor", "dragonpulse", "earthpower", "fireblast", "darkpulse", "roost", "flashcannon", "superpower"],
		randomDoubleBattleMoves: ["uturn", "dracometeor", "dragonpulse", "earthpower", "fireblast", "darkpulse", "roost", "flashcannon", "superpower", "tailwind", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 70, "shiny": true, "gender": "M", "moves": ["hypervoice", "dragonbreath", "flamethrower", "focusblast"], "pokeball": "cherishball"},
			{"generation": 6, "level": 52, "gender": "M", "perfectIVs": 2, "moves": ["dragonrush", "crunch", "rockslide", "frustration"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 6, "level": 59},
		],
		tier: "New",
		doublesTier: "New",
	},
	larvesta: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	volcarona: {
		randomBattleMoves: ["quiverdance", "fierydance", "fireblast", "bugbuzz", "roost", "gigadrain", "hiddenpowerice", "hiddenpowerground"],
		randomDoubleBattleMoves: ["quiverdance", "fierydance", "fireblast", "bugbuzz", "roost", "gigadrain", "hiddenpowerice", "heatwave", "willowisp", "ragepowder", "tailwind", "protect"],
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
		randomBattleMoves: ["closecombat", "ironhead", "swordsdance", "substitute", "stoneedge", "voltswitch", "hiddenpowerice", "taunt", "stealthrock"],
		randomDoubleBattleMoves: ["closecombat", "ironhead", "swordsdance", "substitute", "stoneedge", "thunderwave", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 42, "shiny": 1, "moves": ["helpinghand", "retaliate", "ironhead", "sacredsword"]},
			{"generation": 5, "level": 45, "shiny": 1, "moves": ["helpinghand", "retaliate", "ironhead", "sacredsword"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["sacredsword", "swordsdance", "quickguard", "workup"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["retaliate", "ironhead", "sacredsword", "swordsdance"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["sacredsword", "swordsdance", "quickattack", "ironhead"]},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	terrakion: {
		randomBattleMoves: ["swordsdance", "closecombat", "stoneedge", "earthquake", "stealthrock", "quickattack"],
		randomDoubleBattleMoves: ["stoneedge", "closecombat", "substitute", "rockslide", "earthquake", "taunt", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 42, "shiny": 1, "moves": ["helpinghand", "retaliate", "rockslide", "sacredsword"]},
			{"generation": 5, "level": 45, "shiny": 1, "moves": ["helpinghand", "retaliate", "rockslide", "sacredsword"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["sacredsword", "swordsdance", "quickguard", "workup"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["retaliate", "rockslide", "sacredsword", "swordsdance"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["sacredsword", "swordsdance", "rockslide", "stoneedge"]},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	virizion: {
		randomBattleMoves: ["swordsdance", "closecombat", "leafblade", "stoneedge", "calmmind", "focusblast", "gigadrain", "hiddenpowerice", "substitute"],
		randomDoubleBattleMoves: ["taunt", "closecombat", "stoneedge", "leafblade", "swordsdance", "synthesis", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 42, "shiny": 1, "moves": ["helpinghand", "retaliate", "gigadrain", "sacredsword"]},
			{"generation": 5, "level": 45, "shiny": 1, "moves": ["helpinghand", "retaliate", "gigadrain", "sacredsword"]},
			{"generation": 5, "level": 65, "shiny": 1, "moves": ["sacredsword", "swordsdance", "quickguard", "workup"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["retaliate", "gigadrain", "sacredsword", "swordsdance"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["sacredsword", "swordsdance", "gigadrain", "leafblade"]},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	tornadus: {
		randomBattleMoves: ["hurricane", "heatwave", "superpower", "grassknot", "uturn", "defog", "tailwind"],
		randomDoubleBattleMoves: ["hurricane", "airslash", "uturn", "superpower", "focusblast", "taunt", "substitute", "heatwave", "tailwind", "protect", "skydrop"],
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
		randomBattleMoves: ["hurricane", "heatwave", "knockoff", "superpower", "uturn", "taunt"],
		randomDoubleBattleMoves: ["hurricane", "airslash", "focusblast", "uturn", "heatwave", "skydrop", "tailwind", "taunt", "protect"],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	thundurus: {
		randomBattleMoves: ["thunderwave", "nastyplot", "thunderbolt", "hiddenpowerice", "hiddenpowerflying", "focusblast", "substitute", "knockoff", "taunt"],
		randomDoubleBattleMoves: ["thunderwave", "nastyplot", "thunderbolt", "hiddenpowerice", "hiddenpowerflying", "focusblast", "substitute", "knockoff", "taunt", "protect"],
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
		randomBattleMoves: ["nastyplot", "thunderbolt", "hiddenpowerflying", "hiddenpowerice", "focusblast", "voltswitch"],
		randomDoubleBattleMoves: ["nastyplot", "thunderbolt", "hiddenpowerflying", "hiddenpowerice", "focusblast", "voltswitch", "protect"],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	reshiram: {
		randomBattleMoves: ["blueflare", "dracometeor", "dragonpulse", "toxic", "flamecharge", "stoneedge", "roost"],
		randomDoubleBattleMoves: ["blueflare", "dracometeor", "dragonpulse", "heatwave", "flamecharge", "roost", "protect", "tailwind"],
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
		isUnreleased: true,
		tier: "Unreleased",
	},
	zekrom: {
		randomBattleMoves: ["boltstrike", "outrage", "dragonclaw", "dracometeor", "voltswitch", "honeclaws", "substitute", "roost"],
		randomDoubleBattleMoves: ["voltswitch", "protect", "dragonclaw", "boltstrike", "honeclaws", "substitute", "dracometeor", "fusionbolt", "roost", "tailwind"],
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
		isUnreleased: true,
		tier: "Unreleased",
	},
	landorus: {
		randomBattleMoves: ["calmmind", "rockpolish", "earthpower", "focusblast", "psychic", "sludgewave", "stealthrock", "knockoff", "rockslide"],
		randomDoubleBattleMoves: ["earthpower", "focusblast", "hiddenpowerice", "psychic", "sludgebomb", "rockslide", "protect"],
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
		randomBattleMoves: ["swordsdance", "rockpolish", "earthquake", "stoneedge", "uturn", "superpower", "stealthrock", "fly"],
		randomDoubleBattleMoves: ["rockslide", "earthquake", "stoneedge", "uturn", "superpower", "knockoff", "protect"],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kyurem: {
		randomBattleMoves: ["dracometeor", "icebeam", "earthpower", "outrage", "substitute", "focusblast", "roost"],
		randomDoubleBattleMoves: ["substitute", "icebeam", "dracometeor", "dragonpulse", "focusblast", "glaciate", "earthpower", "roost", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 75, "shiny": 1, "moves": ["glaciate", "dragonpulse", "imprison", "endeavor"]},
			{"generation": 5, "level": 70, "shiny": 1, "moves": ["scaryface", "glaciate", "dragonpulse", "imprison"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["dragonbreath", "slash", "scaryface", "glaciate"]},
			{"generation": 6, "level": 100, "moves": ["glaciate", "scaryface", "dracometeor", "ironhead"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["slash", "scaryface", "glaciate", "dragonpulse"]},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	kyuremblack: {
		randomBattleMoves: ["outrage", "fusionbolt", "icebeam", "roost", "substitute", "earthpower", "dragonclaw"],
		randomDoubleBattleMoves: ["protect", "fusionbolt", "icebeam", "roost", "substitute", "honeclaws", "earthpower", "dragonclaw"],
		eventPokemon: [
			{"generation": 5, "level": 75, "shiny": 1, "moves": ["freezeshock", "dragonpulse", "imprison", "endeavor"]},
			{"generation": 5, "level": 70, "shiny": 1, "moves": ["fusionbolt", "freezeshock", "dragonpulse", "imprison"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["dragonbreath", "slash", "fusionbolt", "freezeshock"]},
			{"generation": 6, "level": 100, "moves": ["freezeshock", "fusionbolt", "dracometeor", "ironhead"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["slash", "fusionbolt", "freezeshock", "dragonpulse"]},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	kyuremwhite: {
		randomBattleMoves: ["dracometeor", "icebeam", "fusionflare", "earthpower", "focusblast", "dragonpulse", "substitute", "roost", "toxic"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "icebeam", "fusionflare", "earthpower", "focusblast", "roost", "protect"],
		eventPokemon: [
			{"generation": 5, "level": 75, "shiny": 1, "moves": ["iceburn", "dragonpulse", "imprison", "endeavor"]},
			{"generation": 5, "level": 70, "shiny": 1, "moves": ["fusionflare", "iceburn", "dragonpulse", "imprison"]},
			{"generation": 6, "level": 50, "shiny": 1, "moves": ["dragonbreath", "slash", "fusionflare", "iceburn"]},
			{"generation": 6, "level": 100, "moves": ["iceburn", "fusionflare", "dracometeor", "ironhead"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["slash", "fusionflare", "iceburn", "dragonpulse"]},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	keldeo: {
		randomBattleMoves: ["hydropump", "secretsword", "calmmind", "hiddenpowerflying", "hiddenpowerelectric", "substitute", "scald", "icywind"],
		randomDoubleBattleMoves: ["hydropump", "secretsword", "protect", "hiddenpowerflying", "hiddenpowerelectric", "substitute", "surf", "icywind", "taunt"],
		eventPokemon: [
			{"generation": 5, "level": 15, "moves": ["aquajet", "leer", "doublekick", "bubblebeam"], "pokeball": "cherishball"},
			{"generation": 5, "level": 50, "moves": ["sacredsword", "hydropump", "aquajet", "swordsdance"], "pokeball": "cherishball"},
			{"generation": 6, "level": 15, "moves": ["aquajet", "leer", "doublekick", "hydropump"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "moves": ["aquajet", "leer", "doublekick", "bubblebeam"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	keldeoresolute: {
		eventOnly: true,
		requiredMove: "Secret Sword",
	},
	meloetta: {
		randomBattleMoves: ["uturn", "calmmind", "psyshock", "hypervoice", "shadowball", "focusblast"],
		randomDoubleBattleMoves: ["calmmind", "psyshock", "thunderbolt", "hypervoice", "shadowball", "focusblast", "protect"],
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
		randomBattleMoves: ["relicsong", "closecombat", "knockoff", "return"],
		randomDoubleBattleMoves: ["relicsong", "closecombat", "knockoff", "return", "protect"],
		requiredMove: "Relic Song",
		battleOnly: true,
	},
	genesect: {
		randomBattleMoves: ["technoblast", "uturn", "icebeam", "flamethrower", "thunderbolt", "ironhead", "shiftgear", "extremespeed", "blazekick"],
		randomDoubleBattleMoves: ["uturn", "bugbuzz", "icebeam", "flamethrower", "thunderbolt", "ironhead", "shiftgear", "extremespeed", "blazekick", "protect"],
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
	},
	genesectchill: {
		eventOnly: true,
		requiredItem: "Chill Drive",
	},
	genesectdouse: {
		eventOnly: true,
		requiredItem: "Douse Drive",
	},
	genesectshock: {
		eventOnly: true,
		requiredItem: "Shock Drive",
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
		randomBattleMoves: ["leechseed", "synthesis", "spikes", "drainpunch", "spikyshield", "woodhammer"],
		randomDoubleBattleMoves: ["leechseed", "synthesis", "hammerarm", "spikyshield", "stoneedge", "woodhammer", "rockslide"],
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
		randomBattleMoves: ["calmmind", "fireblast", "psyshock", "grassknot", "switcheroo", "shadowball"],
		randomDoubleBattleMoves: ["calmmind", "fireblast", "psyshock", "grassknot", "switcheroo", "shadowball", "heatwave", "dazzlinggleam", "protect"],
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
		randomBattleMoves: ["hydropump", "icebeam", "gunkshot", "uturn", "spikes", "toxicspikes", "taunt"],
		randomDoubleBattleMoves: ["hydropump", "uturn", "surf", "icebeam", "matblock", "taunt", "darkpulse", "protect"],
		eventPokemon: [
			{"generation": 6, "level": 36, "ivs": {"spe": 31}, "isHidden": true, "moves": ["watershuriken", "shadowsneak", "hydropump", "substitute"], "pokeball": "cherishball"},
			{"generation": 6, "level": 100, "isHidden": true, "moves": ["hydrocannon", "gunkshot", "matblock", "happyhour"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	greninjaash: {
		randomBattleMoves: ["hydropump", "icebeam", "darkpulse", "watershuriken", "uturn"],
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
		randomBattleMoves: ["earthquake", "return", "wildcharge", "uturn", "swordsdance", "quickattack", "knockoff", "agility"],
		randomDoubleBattleMoves: ["earthquake", "uturn", "return", "wildcharge", "protect", "quickattack"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["bravebird", "flareblitz", "roost", "swordsdance", "uturn", "willowisp", "overheat"],
		randomDoubleBattleMoves: ["bravebird", "flareblitz", "roost", "swordsdance", "uturn", "willowisp", "tailwind", "taunt", "protect"],
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
		randomBattleMoves: ["sleeppowder", "quiverdance", "hurricane", "energyball", "substitute"],
		randomDoubleBattleMoves: ["sleeppowder", "quiverdance", "hurricane", "bugbuzz", "roost", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	vivillonfancy: {
		eventPokemon: [
			{"generation": 6, "level": 12, "isHidden": false, "moves": ["gust", "lightscreen", "strugglebug", "holdhands"], "pokeball": "cherishball"},
		],
		eventOnly: true,
	},
	vivillonpokeball: {
		eventPokemon: [
			{"generation": 6, "level": 12, "isHidden": false, "moves": ["stunspore", "gust", "lightscreen", "strugglebug"], "pokeball": "pokeball"},
		],
		eventOnly: true,
	},
	litleo: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pyroar: {
		randomBattleMoves: ["sunnyday", "fireblast", "hypervoice", "solarbeam", "willowisp", "darkpulse"],
		randomDoubleBattleMoves: ["hypervoice", "fireblast", "willowisp", "protect", "sunnyday", "solarbeam"],
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
		randomBattleMoves: ["lightofruin", "psychic", "hiddenpowerfire", "hiddenpowerground", "moonblast"],
		randomDoubleBattleMoves: ["lightofruin", "dazzlinggleam", "wish", "psychic", "aromatherapy", "protect", "calmmind"],
		isUnreleased: true,
		tier: "Unreleased",
	},
	florges: {
		randomBattleMoves: ["calmmind", "moonblast", "synthesis", "aromatherapy", "wish", "toxic", "protect", "defog"],
		randomDoubleBattleMoves: ["moonblast", "dazzlinggleam", "wish", "psychic", "aromatherapy", "protect", "calmmind", "defog"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	skiddo: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	gogoat: {
		randomBattleMoves: ["bulkup", "hornleech", "earthquake", "rockslide", "substitute", "leechseed", "milkdrink"],
		randomDoubleBattleMoves: ["hornleech", "earthquake", "brickbreak", "bulkup", "leechseed", "milkdrink", "rockslide", "protect"],
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
		randomBattleMoves: ["knockoff", "superpower", "gunkshot", "icepunch", "partingshot", "drainpunch"],
		randomDoubleBattleMoves: ["partingshot", "hammerarm", "crunch", "circlethrow", "icepunch", "earthquake", "poisonjab", "protect"],
		encounters: [
			{"generation": 7, "level": 24},
		],
		tier: "New",
		doublesTier: "New",
	},
	furfrou: {
		randomBattleMoves: ["return", "cottonguard", "thunderwave", "substitute", "toxic", "suckerpunch", "uturn", "rest"],
		randomDoubleBattleMoves: ["return", "cottonguard", "uturn", "thunderwave", "suckerpunch", "snarl", "wildcharge", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	espurr: {
		tier: "LC",
	},
	meowstic: {
		randomBattleMoves: ["toxic", "yawn", "thunderwave", "psychic", "reflect", "lightscreen", "healbell"],
		randomDoubleBattleMoves: ["fakeout", "thunderwave", "psychic", "reflect", "lightscreen", "safeguard", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	meowsticf: {
		randomBattleMoves: ["calmmind", "psychic", "psyshock", "shadowball", "energyball", "thunderbolt"],
		randomDoubleBattleMoves: ["psyshock", "darkpulse", "fakeout", "energyball", "signalbeam", "thunderbolt", "protect", "helpinghand"],
		tier: "New",
		doublesTier: "New",
	},
	honedge: {
		tier: "LC",
	},
	doublade: {
		randomBattleMoves: ["swordsdance", "shadowclaw", "shadowsneak", "ironhead", "sacredsword"],
		randomDoubleBattleMoves: ["swordsdance", "shadowclaw", "shadowsneak", "ironhead", "sacredsword", "rockslide", "protect"],
		tier: "NFE",
	},
	aegislash: {
		randomBattleMoves: ["kingsshield", "swordsdance", "shadowclaw", "sacredsword", "ironhead", "shadowsneak", "hiddenpowerice", "shadowball", "flashcannon"],
		randomDoubleBattleMoves: ["kingsshield", "swordsdance", "shadowclaw", "sacredsword", "ironhead", "shadowsneak", "wideguard", "hiddenpowerice", "shadowball", "flashcannon"],
		eventPokemon: [
			{"generation": 6, "level": 50, "gender": "F", "nature": "Quiet", "moves": ["wideguard", "kingsshield", "shadowball", "flashcannon"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	aegislashblade: {
		requiredAbility: 'Stance Change',
		battleOnly: true,
	},
	spritzee: {
		tier: "LC",
	},
	aromatisse: {
		randomBattleMoves: ["wish", "protect", "moonblast", "aromatherapy", "reflect", "lightscreen"],
		randomDoubleBattleMoves: ["moonblast", "aromatherapy", "wish", "trickroom", "thunderbolt", "protect", "healpulse"],
		eventPokemon: [
			{"generation": 6, "level": 50, "nature": "Relaxed", "isHidden": true, "moves": ["trickroom", "healpulse", "disable", "moonblast"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	swirlix: {
		tier: "LC",
	},
	slurpuff: {
		randomBattleMoves: ["bellydrum", "playrough", "return", "drainpunch"],
		randomDoubleBattleMoves: ["bellydrum", "playrough", "return", "drainpunch", "dazzlinggleam", "surf", "psychic", "flamethrower", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	inkay: {
		eventPokemon: [
			{"generation": 6, "level": 10, "isHidden": false, "moves": ["happyhour", "foulplay", "hypnosis", "topsyturvy"], "pokeball": "cherishball"},
		],
		tier: "LC",
	},
	malamar: {
		randomBattleMoves: ["superpower", "knockoff", "psychocut", "rest", "sleeptalk", "happyhour"],
		randomDoubleBattleMoves: ["superpower", "psychocut", "rockslide", "trickroom", "knockoff", "protect"],
		eventPokemon: [
			{"generation": 6, "level": 50, "nature": "Adamant", "ivs": {"hp": 31, "atk": 31}, "isHidden": false, "abilities": ["contrary"], "moves": ["superpower", "knockoff", "facade", "rockslide"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	binacle: {
		tier: "LC",
	},
	barbaracle: {
		randomBattleMoves: ["shellsmash", "stoneedge", "liquidation", "earthquake", "crosschop", "stealthrock"],
		randomDoubleBattleMoves: ["shellsmash", "liquidation", "earthquake", "crosschop", "rockslide", "protect"],
		encounters: [
			{"generation": 6, "level": 30},
		],
		tier: "New",
		doublesTier: "New",
	},
	skrelp: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dragalge: {
		randomBattleMoves: ["dracometeor", "sludgewave", "focusblast", "scald", "hiddenpowerfire", "toxicspikes", "dragonpulse"],
		randomDoubleBattleMoves: ["dracometeor", "sludgebomb", "focusblast", "scald", "hiddenpowerfire", "protect", "dragonpulse"],
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
		randomBattleMoves: ["scald", "waterpulse", "darkpulse", "aurasphere", "icebeam", "uturn"],
		randomDoubleBattleMoves: ["waterpulse", "icebeam", "uturn", "darkpulse", "aurasphere", "muddywater", "helpinghand", "protect"],
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
		randomBattleMoves: ["raindance", "hypervoice", "surf", "darkpulse", "hiddenpowerice", "voltswitch", "thunderbolt"],
		randomDoubleBattleMoves: ["surf", "voltswitch", "hiddenpowerice", "raindance", "thunder", "darkpulse", "thunderbolt", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	tyrunt: {
		eventPokemon: [
			{"generation": 6, "level": 10, "isHidden": true, "moves": ["tailwhip", "tackle", "roar", "stomp"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tyrantrum: {
		randomBattleMoves: ["stealthrock", "dragondance", "dragonclaw", "earthquake", "superpower", "outrage", "headsmash"],
		randomDoubleBattleMoves: ["rockslide", "dragondance", "headsmash", "dragonclaw", "earthquake", "icefang", "firefang", "protect"],
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
		randomBattleMoves: ["ancientpower", "blizzard", "thunderwave", "earthpower", "freezedry", "hypervoice", "stealthrock"],
		randomDoubleBattleMoves: ["hypervoice", "ancientpower", "thunderwave", "flashcannon", "freezedry", "icywind", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hawlucha: {
		randomBattleMoves: ["substitute", "swordsdance", "highjumpkick", "acrobatics", "roost", "stoneedge"],
		randomDoubleBattleMoves: ["swordsdance", "highjumpkick", "uturn", "stoneedge", "skydrop", "encore", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	dedenne: {
		randomBattleMoves: ["substitute", "recycle", "thunderbolt", "nuzzle", "grassknot", "hiddenpowerice", "toxic"],
		randomDoubleBattleMoves: ["voltswitch", "thunderbolt", "nuzzle", "grassknot", "hiddenpowerice", "uturn", "helpinghand", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	carbink: {
		randomBattleMoves: ["stealthrock", "lightscreen", "reflect", "explosion", "powergem", "moonblast"],
		randomDoubleBattleMoves: ["trickroom", "lightscreen", "reflect", "explosion", "powergem", "moonblast", "protect"],
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
		randomBattleMoves: ["dracometeor", "dragonpulse", "fireblast", "sludgebomb", "thunderbolt", "earthquake", "dragontail"],
		randomDoubleBattleMoves: ["thunderbolt", "icebeam", "dragonpulse", "fireblast", "muddywater", "dracometeor", "focusblast", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	klefki: {
		randomBattleMoves: ["reflect", "lightscreen", "spikes", "magnetrise", "playrough", "thunderwave", "foulplay", "toxic"],
		randomDoubleBattleMoves: ["reflect", "lightscreen", "safeguard", "playrough", "substitute", "thunderwave", "protect", "flashcannon", "dazzlinggleam"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	phantump: {
		tier: "LC",
	},
	trevenant: {
		randomBattleMoves: ["hornleech", "shadowclaw", "earthquake", "rockslide", "woodhammer", "trickroom"],
		randomDoubleBattleMoves: ["hornleech", "woodhammer", "leechseed", "shadowclaw", "willowisp", "trickroom", "earthquake", "rockslide", "protect"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["willowisp", "seedbomb", "leechseed", "shadowsneak", "substitute", "synthesis"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "painsplit", "seedbomb", "leechseed", "phantomforce", "explosion", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	gourgeistsmall: {
		randomBattleMoves: ["willowisp", "seedbomb", "leechseed", "shadowsneak", "substitute", "synthesis"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "painsplit", "seedbomb", "leechseed", "phantomforce", "explosion", "protect"],
		unreleasedHidden: true,
		tier: "New",
		doublesTier: "New",
	},
	gourgeistlarge: {
		randomBattleMoves: ["willowisp", "seedbomb", "leechseed", "shadowsneak", "substitute", "synthesis"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "painsplit", "seedbomb", "leechseed", "phantomforce", "explosion", "protect", "trickroom"],
		unreleasedHidden: true,
		tier: "New",
		doublesTier: "New",
	},
	gourgeistsuper: {
		randomBattleMoves: ["willowisp", "seedbomb", "leechseed", "shadowsneak", "substitute", "synthesis"],
		randomDoubleBattleMoves: ["willowisp", "shadowsneak", "painsplit", "seedbomb", "leechseed", "phantomforce", "explosion", "protect", "trickroom"],
		tier: "New",
		doublesTier: "New",
	},
	bergmite: {
		tier: "LC",
	},
	avalugg: {
		randomBattleMoves: ["avalanche", "recover", "toxic", "rapidspin", "roar", "earthquake"],
		randomDoubleBattleMoves: ["avalanche", "recover", "earthquake", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	noibat: {
		tier: "LC",
	},
	noivern: {
		randomBattleMoves: ["dracometeor", "hurricane", "flamethrower", "boomburst", "switcheroo", "uturn", "roost", "taunt"],
		randomDoubleBattleMoves: ["airslash", "hurricane", "dragonpulse", "dracometeor", "focusblast", "flamethrower", "uturn", "roost", "boomburst", "switcheroo", "tailwind", "taunt", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	xerneas: {
		randomBattleMoves: ["geomancy", "moonblast", "focusblast", "thunderbolt", "hiddenpowerfire", "psyshock", "rockslide", "closecombat"],
		randomDoubleBattleMoves: ["geomancy", "dazzlinggleam", "thunder", "focusblast", "thunderbolt", "hiddenpowerfire", "psyshock", "rockslide", "closecombat", "protect"],
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
		randomBattleMoves: ["darkpulse", "oblivionwing", "focusblast", "uturn", "foulplay", "suckerpunch", "toxic", "taunt", "roost"],
		randomDoubleBattleMoves: ["darkpulse", "oblivionwing", "taunt", "focusblast", "hurricane", "roost", "suckerpunch", "snarl", "skydrop", "protect"],
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
		randomBattleMoves: ["dragondance", "thousandarrows", "outrage", "extremespeed", "irontail"],
		randomDoubleBattleMoves: ["dragondance", "thousandarrows", "extremespeed", "rockslide", "coil", "stoneedge", "glare", "protect"],
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
		randomBattleMoves: ["dragondance", "thousandarrows", "outrage", "extremespeed", "irontail", "substitute"],
		randomDoubleBattleMoves: ["dragondance", "thousandarrows", "extremespeed", "irontail", "protect"],
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
		randomBattleMoves: ["reflect", "lightscreen", "stealthrock", "diamondstorm", "moonblast", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["diamondstorm", "moonblast", "reflect", "lightscreen", "safeguard", "substitute", "calmmind", "psychic", "dazzlinggleam", "protect"],
		eventPokemon: [
			{"generation": 6, "level": 50, "perfectIVs": 0, "moves": ["diamondstorm", "reflect", "return", "moonblast"], "pokeball": "cherishball"},
			{"generation": 6, "level": 50, "shiny": true, "moves": ["diamondstorm", "moonblast", "reflect", "return"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	dianciemega: {
		randomBattleMoves: ["calmmind", "moonblast", "earthpower", "hiddenpowerfire", "diamondstorm"],
		randomDoubleBattleMoves: ["diamondstorm", "moonblast", "calmmind", "psyshock", "earthpower", "hiddenpowerfire", "dazzlinggleam", "protect"],
		requiredItem: "Diancite",
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hoopa: {
		randomBattleMoves: ["nastyplot", "psyshock", "shadowball", "focusblast", "trick"],
		randomDoubleBattleMoves: ["hyperspacehole", "shadowball", "focusblast", "protect", "psychic", "trickroom"],
		eventPokemon: [
			{"generation": 6, "level": 50, "moves": ["hyperspacehole", "nastyplot", "psychic", "astonish"], "pokeball": "cherishball"},
			{"generation": 7, "level": 15, "moves": ["shadowball", "nastyplot", "psychic", "hyperspacehole"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	hoopaunbound: {
		randomBattleMoves: ["nastyplot", "substitute", "psychic", "darkpulse", "focusblast", "hyperspacefury", "zenheadbutt", "icepunch", "drainpunch", "gunkshot", "trick"],
		randomDoubleBattleMoves: ["psychic", "darkpulse", "focusblast", "protect", "hyperspacefury", "zenheadbutt", "icepunch", "drainpunch", "gunkshot"],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	volcanion: {
		randomBattleMoves: ["substitute", "steameruption", "fireblast", "sludgebomb", "earthpower", "superpower"],
		randomDoubleBattleMoves: ["substitute", "steameruption", "heatwave", "sludgebomb", "rockslide", "earthquake", "protect"],
		eventPokemon: [
			{"generation": 6, "level": 70, "moves": ["steameruption", "overheat", "hydropump", "mist"], "pokeball": "cherishball"},
			{"generation": 6, "level": 70, "moves": ["steameruption", "flamethrower", "hydropump", "explosion"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	rowlet: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	dartrix: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	decidueye: {
		randomBattleMoves: ["spiritshackle", "uturn", "leafblade", "roost", "swordsdance", "suckerpunch"],
		randomDoubleBattleMoves: ["spiritshackle", "leafblade", "bravebird", "protect", "suckerpunch"],
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["leafblade", "phantomforce", "shadowsneak", "bravebird"], "pokeball": "pokeball"},
		],
		isUnreleased: true,
		tier: "Unreleased",
	},
	litten: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	torracat: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	incineroar: {
		randomBattleMoves: ["fakeout", "darkestlariat", "flareblitz", "uturn", "earthquake", "knockoff"],
		randomDoubleBattleMoves: ["fakeout", "darkestlariat", "flareblitz", "crosschop", "willowisp", "taunt", "snarl"],
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["fakeout", "uturn", "darkestlariat", "flareblitz"], "pokeball": "pokeball"},
		],
		isUnreleased: true,
		tier: "Unreleased",
	},
	popplio: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	brionne: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	primarina: {
		randomBattleMoves: ["hydropump", "moonblast", "scald", "psychic", "hiddenpowerfire"],
		randomDoubleBattleMoves: ["hypervoice", "moonblast", "substitute", "protect", "icebeam"],
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["hypervoice", "moonblast", "icywind", "perishsong"], "pokeball": "pokeball"},
		],
		isUnreleased: true,
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
		randomBattleMoves: ["boomburst", "beakblast", "roost", "brickbreak", "bulletseed"],
		randomDoubleBattleMoves: ["bulletseed", "rockblast", "bravebird", "tailwind", "protect"],
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
		randomBattleMoves: ["uturn", "return", "crunch", "earthquake", "firepunch"],
		randomDoubleBattleMoves: ["uturn", "return", "superfang", "protect", "crunch"],
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
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["icehammer", "closecombat", "earthquake", "stoneedge"],
		randomDoubleBattleMoves: ["icehammer", "closecombat", "stoneedge", "protect", "wideguard", "earthquake"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oricorio: {
		randomBattleMoves: ["calmmind", "revelationdance", "hurricane", "toxic", "roost", "uturn"],
		randomDoubleBattleMoves: ["revelationdance", "airslash", "hurricane", "tailwind", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oricoriopompom: {
		randomBattleMoves: ["calmmind", "revelationdance", "hurricane", "toxic", "roost", "uturn"],
		randomDoubleBattleMoves: ["revelationdance", "airslash", "hurricane", "tailwind", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oricoriopau: {
		randomBattleMoves: ["calmmind", "revelationdance", "hurricane", "toxic", "roost", "uturn"],
		randomDoubleBattleMoves: ["revelationdance", "airslash", "hurricane", "tailwind", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oricoriosensu: {
		randomBattleMoves: ["calmmind", "revelationdance", "hurricane", "toxic", "roost", "uturn"],
		randomDoubleBattleMoves: ["revelationdance", "airslash", "hurricane", "tailwind", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cutiefly: {
		tier: "LC",
	},
	ribombee: {
		randomBattleMoves: ["quiverdance", "bugbuzz", "moonblast", "hiddenpowerfire", "roost"],
		randomDoubleBattleMoves: ["quiverdance", "pollenpuff", "moonblast", "protect", "batonpass"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["swordsdance", "accelerock", "stoneedge", "drillrun", "firefang"],
		randomDoubleBattleMoves: ["accelerock", "stoneedge", "crunch", "firefang", "protect", "taunt"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lycanrocmidnight: {
		randomBattleMoves: ["stoneedge", "stealthrock", "suckerpunch", "swordsdance", "firepunch"],
		randomDoubleBattleMoves: ["stoneedge", "suckerpunch", "swordsdance", "protect", "taunt"],
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["stoneedge", "firefang", "suckerpunch", "swordsdance"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lycanrocdusk: {
		randomBattleMoves: ["swordsdance", "accelerock", "stoneedge", "drillrun", "firefang", "return"],
		randomDoubleBattleMoves: ["accelerock", "stoneedge", "rockslide", "drillrun", "firefang", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	wishiwashi: {
		randomBattleMoves: ["scald", "hydropump", "icebeam", "hiddenpowergrass", "earthquake"],
		randomDoubleBattleMoves: ["hydropump", "icebeam", "endeavor", "protect", "hiddenpowergrass", "earthquake", "helpinghand"],
		tier: "New",
		doublesTier: "New",
	},
	wishiwashischool: {
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
		randomBattleMoves: ["toxicspikes", "banefulbunker", "recover", "scald", "haze"],
		randomDoubleBattleMoves: ["scald", "banefulbunker", "haze", "wideguard", "lightscreen"],
		tier: "New",
		doublesTier: "New",
	},
	mudbray: {
		tier: "LC",
	},
	mudsdale: {
		randomBattleMoves: ["earthquake", "closecombat", "rockslide", "heavyslam", "stealthrock"],
		randomDoubleBattleMoves: ["highhorsepower", "heavyslam", "closecombat", "rockslide", "protect", "earthquake", "rocktomb"],
		encounters: [
			{"generation": 7, "level": 29},
		],
		tier: "New",
		doublesTier: "New",
	},
	dewpider: {
		tier: "LC",
	},
	araquanid: {
		randomBattleMoves: ["liquidation", "lunge", "toxic", "mirrorcoat", "stickyweb"],
		randomDoubleBattleMoves: ["liquidation", "leechlife", "lunge", "poisonjab", "protect", "wideguard"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["leafstorm", "hiddenpowerice", "superpower", "knockoff", "synthesis"],
		randomDoubleBattleMoves: ["leafstorm", "gigadrain", "hiddenpowerice", "hiddenpowerfire", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	lurantistotem: {
		eventPokemon: [
			{"generation": 7, "level": 30, "perfectIVs": 3, "moves": ["growth", "ingrain", "leafblade", "synthesis"], "pokeball": "pokeball"},
		],
		eventOnly: true,
	},
	morelull: {
		tier: "LC",
	},
	shiinotic: {
		randomBattleMoves: ["spore", "strengthsap", "moonblast", "substitute", "leechseed"],
		randomDoubleBattleMoves: ["spore", "gigadrain", "moonblast", "sludgebomb", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	salandit: {
		tier: "LC",
	},
	salazzle: {
		randomBattleMoves: ["nastyplot", "fireblast", "sludgewave", "hiddenpowergrass"],
		randomDoubleBattleMoves: ["protect", "flamethrower", "sludgebomb", "hiddenpowerground", "hiddenpowerice", "fakeout", "encore", "willowisp", "taunt"],
		eventPokemon: [
			{"generation": 7, "level": 50, "isHidden": false, "moves": ["fakeout", "toxic", "sludgebomb", "flamethrower"], "pokeball": "cherishball"},
		],
		encounters: [
			{"generation": 7, "level": 16},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["hammerarm", "icepunch", "swordsdance", "return", "shadowclaw", "doubleedge"],
		randomDoubleBattleMoves: ["hammerarm", "icepunch", "doubleedge", "protect", "wideguard"],
		eventPokemon: [
			{"generation": 7, "level": 50, "gender": "F", "isHidden": true, "moves": ["babydolleyes", "brutalswing", "superpower", "bind"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["powerwhip", "highjumpkick", "knockoff", "uturn", "rapidspin", "synthesis"],
		randomDoubleBattleMoves: ["highjumpkick", "playrough", "tropkick", "uturn", "feint", "protect"],
		tier: "New",
		doublesTier: "New",
	},
	comfey: {
		randomBattleMoves: ["aromatherapy", "drainingkiss", "toxic", "synthesis", "uturn"],
		randomDoubleBattleMoves: ["floralhealing", "drainingkiss", "uturn", "lightscreen", "taunt"],
		eventPokemon: [
			{"generation": 7, "level": 10, "nature": "Jolly", "isHidden": false, "moves": ["celebrate", "leechseed", "drainingkiss", "magicalleaf"], "pokeball": "cherishball"},
		],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	oranguru: {
		randomBattleMoves: ["nastyplot", "psyshock", "focusblast", "thunderbolt", "trickroom"],
		randomDoubleBattleMoves: ["trickroom", "foulplay", "instruct", "psychic", "protect", "lightscreen", "reflect"],
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "isHidden": false, "abilities": ["telepathy"], "moves": ["instruct", "psychic", "psychicterrain"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["instruct", "foulplay", "trickroom", "allyswitch"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	passimian: {
		randomBattleMoves: ["rockslide", "closecombat", "earthquake", "ironhead", "uturn", "knockoff"],
		randomDoubleBattleMoves: ["closecombat", "uturn", "rockslide", "protect", "ironhead", "taunt"],
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "isHidden": false, "moves": ["bestow", "fling", "feint"], "pokeball": "cherishball"},
			{"generation": 7, "level": 50, "isHidden": true, "moves": ["closecombat", "uturn", "knockoff", "gunkshot"], "pokeball": "pokeball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	wimpod: {
		tier: "LC",
	},
	golisopod: {
		randomBattleMoves: ["spikes", "firstimpression", "liquidation", "aquajet", "knockoff"],
		randomDoubleBattleMoves: ["firstimpression", "aquajet", "liquidation", "leechlife", "protect", "suckerpunch", "wideguard"],
		tier: "New",
		doublesTier: "New",
	},
	sandygast: {
		isNonstandard: "Past",
		tier: "Illegal",
	},
	palossand: {
		randomBattleMoves: ["shoreup", "earthpower", "shadowball", "protect", "toxic", "stealthrock"],
		randomDoubleBattleMoves: ["shoreup", "protect", "shadowball", "earthpower"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pyukumuku: {
		randomBattleMoves: ["toxic", "recover", "counter", "reflect", "lightscreen"],
		randomDoubleBattleMoves: ["reflect", "lightscreen", "counter", "helpinghand", "safeguard", "memento"],
		tier: "New",
		doublesTier: "New",
	},
	typenull: {
		randomBattleMoves: ["return", "uturn", "swordsdance", "rest", "sleeptalk"],
		eventPokemon: [
			{"generation": 7, "level": 40, "shiny": 1, "perfectIVs": 3, "moves": ["crushclaw", "scaryface", "xscissor", "takedown"]},
			{"generation": 7, "level": 60, "shiny": 1, "perfectIVs": 3, "moves": ["metalsound", "ironhead", "doublehit", "airslash"]},
		],
		eventOnly: true,
		tier: "NFE",
	},
	silvally: {
		randomBattleMoves: ["swordsdance", "return", "doubleedge", "crunch", "flamecharge", "flamethrower", "icebeam", "uturn", "ironhead"],
		randomDoubleBattleMoves: ["protect", "doubleedge", "uturn", "crunch", "icebeam", "partingshot", "flamecharge", "swordsdance", "explosion"],
		eventPokemon: [
			{"generation": 7, "level": 100, "shiny": true, "moves": ["multiattack", "partingshot", "punishment", "scaryface"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	silvallybug: {
		randomBattleMoves: ["flamethrower", "icebeam", "thunderbolt", "uturn", "defog"],
		randomDoubleBattleMoves: ["protect", "uturn", "flamethrower", "icebeam", "thunderbolt", "thunderwave"],
		requiredItem: "Bug Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallydark: {
		randomBattleMoves: ["multiattack", "swordsdance", "flamecharge", "ironhead"],
		randomDoubleBattleMoves: ["protect", "multiattack", "icebeam", "partingshot", "uturn", "snarl", "thunderwave"],
		requiredItem: "Dark Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallydragon: {
		randomBattleMoves: ["multiattack", "ironhead", "flamecharge", "flamethrower", "icebeam", "dracometeor", "swordsdance", "uturn"],
		randomDoubleBattleMoves: ["protect", "dracometeor", "icebeam", "flamethrower", "partingshot", "uturn", "thunderwave"],
		requiredItem: "Dragon Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallyelectric: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "thunderbolt", "icebeam", "uturn", "partingshot", "snarl", "thunderwave"],
		requiredItem: "Electric Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallyfairy: {
		randomBattleMoves: ["multiattack", "flamethrower", "rockslide", "thunderwave", "partingshot"],
		randomDoubleBattleMoves: ["protect", "multiattack", "uturn", "icebeam", "partingshot", "flamethrower", "thunderwave"],
		requiredItem: "Fairy Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallyfighting: {
		randomBattleMoves: ["swordsdance", "multiattack", "shadowclaw", "flamecharge", "ironhead"],
		randomDoubleBattleMoves: ["protect", "multiattack", "rockslide", "swordsdance", "flamecharge"],
		requiredItem: "Fighting Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallyfire: {
		randomBattleMoves: ["multiattack", "icebeam", "thunderbolt", "uturn", "defog"],
		randomDoubleBattleMoves: ["protect", "flamethrower", "snarl", "uturn", "thunderbolt", "icebeam", "thunderwave"],
		requiredItem: "Fire Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallyflying: {
		randomBattleMoves: ["multiattack", "flamethrower", "ironhead", "partingshot", "thunderwave"],
		randomDoubleBattleMoves: ["protect", "multiattack", "partingshot", "swordsdance", "flamecharge", "uturn", "ironhead", "thunderwave"],
		requiredItem: "Flying Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallyghost: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "multiattack", "uturn", "icebeam", "partingshot"],
		requiredItem: "Ghost Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallygrass: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "flamethrower", "multiattack", "icebeam", "uturn", "partingshot", "thunderwave"],
		requiredItem: "Grass Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallyground: {
		randomBattleMoves: ["multiattack", "swordsdance", "flamecharge", "rockslide"],
		randomDoubleBattleMoves: ["protect", "multiattack", "icebeam", "thunderbolt", "flamecharge", "rockslide", "swordsdance"],
		requiredItem: "Ground Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallyice: {
		randomBattleMoves: ["multiattack", "thunderbolt", "flamethrower", "uturn", "toxic"],
		randomDoubleBattleMoves: ["protect", "icebeam", "thunderbolt", "partingshot", "uturn", "thunderwave"],
		requiredItem: "Ice Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallypoison: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "multiattack", "uturn", "partingshot", "flamethrower", "icebeam", "thunderwave"],
		requiredItem: "Poison Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallypsychic: {
		randomBattleMoves: ["multiattack", "flamethrower", "rockslide", "partingshot", "thunderwave"],
		randomDoubleBattleMoves: ["protect", "multiattack", "partingshot", "uturn", "flamethrower", "thunderwave"],
		requiredItem: "Psychic Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallyrock: {
		randomBattleMoves: ["multiattack", "flamethrower", "icebeam", "partingshot", "toxic"],
		randomDoubleBattleMoves: ["protect", "rockslide", "uturn", "icebeam", "flamethrower", "partingshot"],
		requiredItem: "Rock Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallysteel: {
		randomBattleMoves: ["multiattack", "crunch", "flamethrower", "thunderbolt", "defog"],
		randomDoubleBattleMoves: ["protect", "multiattack", "swordsdance", "rockslide", "flamecharge", "uturn", "partingshot"],
		requiredItem: "Steel Memory",
		tier: "New",
		doublesTier: "New",
	},
	silvallywater: {
		randomBattleMoves: ["multiattack", "icebeam", "thunderbolt", "partingshot", "defog"],
		randomDoubleBattleMoves: ["protect", "multiattack", "icebeam", "thunderbolt", "flamethrower", "partingshot", "uturn", "thunderwave"],
		requiredItem: "Water Memory",
		tier: "New",
		doublesTier: "New",
	},
	minior: {
		randomBattleMoves: ["shellsmash", "powergem", "acrobatics", "earthquake"],
		randomDoubleBattleMoves: ["shellsmash", "powergem", "acrobatics", "earthquake", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	miniormeteor: {
		requiredAbility: 'Shields Down',
		battleOnly: true,
	},
	komala: {
		randomBattleMoves: ["return", "suckerpunch", "woodhammer", "earthquake", "playrough", "uturn"],
		randomDoubleBattleMoves: ["protect", "return", "uturn", "suckerpunch", "woodhammer", "shadowclaw", "playrough", "swordsdance"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	turtonator: {
		randomBattleMoves: ["fireblast", "shellsmash", "earthquake", "dragontail", "explosion", "dragonpulse", "dracometeor"],
		randomDoubleBattleMoves: ["dragonpulse", "dracometeor", "fireblast", "shellsmash", "protect", "focusblast", "explosion"],
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "moves": ["flamethrower", "bodyslam", "wideguard"], "pokeball": "cherishball"},
			{"generation": 7, "level": 30, "gender": "M", "nature": "Brave", "moves": ["flamethrower", "shelltrap", "dragontail"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	togedemaru: {
		randomBattleMoves: ["ironhead", "spikyshield", "zingzap", "nuzzle", "uturn", "wish"],
		randomDoubleBattleMoves: ["ironhead", "zingzap", "nuzzle", "spikyshield", "encore", "fakeout", "uturn"],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["swordsdance", "shadowsneak", "playrough", "taunt", "shadowclaw"],
		randomDoubleBattleMoves: ["trickroom", "shadowclaw", "playrough", "woodhammer", "willowisp", "shadowsneak", "swordsdance", "protect"],
		eventPokemon: [
			{"generation": 7, "level": 10, "moves": ["copycat", "babydolleyes", "splash", "astonish"], "pokeball": "cherishball"},
			{"generation": 7, "level": 10, "shiny": true, "moves": ["astonish", "playrough", "copycat", "substitute"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["psychicfangs", "crunch", "liquidation", "icefang", "aquajet", "swordsdance"],
		randomDoubleBattleMoves: ["psychicfangs", "crunch", "liquidation", "aquajet", "protect", "swordsdance"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	drampa: {
		randomBattleMoves: ["dracometeor", "dragonpulse", "hypervoice", "fireblast", "thunderbolt", "glare", "roost"],
		randomDoubleBattleMoves: ["dracometeor", "dragonpulse", "hypervoice", "fireblast", "icebeam", "energyball", "thunderbolt", "protect", "roost"],
		eventPokemon: [
			{"generation": 7, "level": 1, "shiny": 1, "isHidden": true, "moves": ["playnice", "echoedvoice", "hurricane"], "pokeball": "cherishball"},
		],
		tier: "New",
		doublesTier: "New",
	},
	dhelmise: {
		randomBattleMoves: ["powerwhip", "anchorshot", "knockoff", "earthquake", "rapidspin", "synthesis"],
		randomDoubleBattleMoves: ["powerwhip", "shadowclaw", "anchorshot", "protect", "gyroball"],
		tier: "New",
		doublesTier: "New",
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
		encounters: [
			{"generation": 7, "level": 41},
		],
		tier: "New",
		doublesTier: "New",
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
		randomBattleMoves: ["thunderbolt", "dazzlinggleam", "naturesmadness", "bravebird", "uturn", "defog"],
		randomDoubleBattleMoves: ["wildcharge", "voltswitch", "dazzlinggleam", "bravebird", "protect", "thunderbolt", "hiddenpowerice", "taunt", "skydrop", "naturesmadness", "uturn"],
		eventPokemon: [
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["naturesmadness", "discharge", "agility", "electroball"]},
			{"generation": 7, "level": 60, "shiny": true, "nature": "Timid", "isHidden": false, "moves": ["naturesmadness", "discharge", "agility", "electroball"], "pokeball": "cherishball"},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": false, "moves": ["thunderbolt", "dazzlinggleam", "voltswitch", "naturesmadness"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		unreleasedHidden: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tapulele: {
		randomBattleMoves: ["moonblast", "psychic", "psyshock", "calmmind", "focusblast", "hiddenpowerfire", "taunt"],
		randomDoubleBattleMoves: ["moonblast", "psychic", "dazzlinggleam", "focusblast", "protect", "taunt", "shadowball", "thunderbolt"],
		eventPokemon: [
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["naturesmadness", "extrasensory", "flatter", "moonblast"]},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": false, "moves": ["naturesmadness", "extrasensory", "flatter", "moonblast"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		unreleasedHidden: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tapubulu: {
		randomBattleMoves: ["woodhammer", "hornleech", "stoneedge", "superpower", "megahorn", "bulkup"],
		randomDoubleBattleMoves: ["woodhammer", "hornleech", "stoneedge", "superpower", "leechseed", "protect", "naturesmadness"],
		eventPokemon: [
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["naturesmadness", "zenheadbutt", "megahorn", "skullbash"]},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": false, "moves": ["naturesmadness", "zenheadbutt", "megahorn", "skullbash"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		unreleasedHidden: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	tapufini: {
		randomBattleMoves: ["calmmind", "moonblast", "scald", "taunt", "icebeam", "hydropump"],
		randomDoubleBattleMoves: ["muddywater", "moonblast", "calmmind", "icebeam", "healpulse", "protect", "taunt", "swagger"],
		eventPokemon: [
			{"generation": 7, "level": 60, "isHidden": false, "moves": ["naturesmadness", "muddywater", "aquaring", "hydropump"]},
			{"generation": 7, "level": 60, "shiny": true, "isHidden": false, "moves": ["naturesmadness", "muddywater", "aquaring", "hydropump"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		unreleasedHidden: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	cosmog: {
		eventPokemon: [
			{"generation": 7, "level": 5, "moves": ["splash"]},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	cosmoem: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	solgaleo: {
		randomBattleMoves: ["sunsteelstrike", "zenheadbutt", "flareblitz", "morningsun", "stoneedge", "earthquake"],
		randomDoubleBattleMoves: ["wideguard", "protect", "sunsteelstrike", "morningsun", "zenheadbutt", "flareblitz"],
		eventPokemon: [
			{"generation": 7, "level": 55, "moves": ["sunsteelstrike", "cosmicpower", "crunch", "zenheadbutt"]},
			{"generation": 7, "level": 60, "moves": ["sunsteelstrike", "cosmicpower", "crunch", "zenheadbutt"]},
			{"generation": 7, "level": 60, "shiny": true, "moves": ["sunsteelstrike", "zenheadbutt", "nobleroar", "morningsun"], "pokeball": "cherishball"},
		],
		isUnreleased: true,
		tier: "Unreleased",
	},
	lunala: {
		randomBattleMoves: ["moongeistbeam", "psyshock", "calmmind", "focusblast", "roost"],
		randomDoubleBattleMoves: ["wideguard", "protect", "roost", "moongeistbeam", "psychic", "focusblast"],
		eventPokemon: [
			{"generation": 7, "level": 55, "moves": ["moongeistbeam", "cosmicpower", "nightdaze", "shadowball"]},
			{"generation": 7, "level": 60, "moves": ["moongeistbeam", "cosmicpower", "nightdaze", "shadowball"]},
			{"generation": 7, "level": 60, "shiny": true, "moves": ["moongeistbeam", "psyshock", "moonblast", "moonlight"], "pokeball": "cherishball"},
		],
		isUnreleased: true,
		tier: "Unreleased",
	},
	nihilego: {
		randomBattleMoves: ["stealthrock", "toxicspikes", "sludgewave", "powergem", "thunderbolt", "grassknot"],
		randomDoubleBattleMoves: ["powergem", "sludgebomb", "grassknot", "protect", "thunderbolt", "hiddenpowerice"],
		eventPokemon: [
			{"generation": 7, "level": 55, "moves": ["powergem", "mirrorcoat", "acidspray", "venomdrench"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["powergem", "acidspray", "stealthrock", "mirrorcoat"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	buzzwole: {
		randomBattleMoves: ["superpower", "drainpunch", "leechlife", "stoneedge", "poisonjab", "earthquake"],
		randomDoubleBattleMoves: ["drainpunch", "superpower", "leechlife", "icepunch", "poisonjab", "protect"],
		eventPokemon: [
			{"generation": 7, "level": 65, "moves": ["counter", "hammerarm", "lunge", "dynamicpunch"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["counter", "hammerarm", "lunge", "dynamicpunch"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	pheromosa: {
		randomBattleMoves: ["highjumpkick", "uturn", "icebeam", "poisonjab", "bugbuzz"],
		randomDoubleBattleMoves: ["highjumpkick", "uturn", "icebeam", "poisonjab", "bugbuzz", "protect", "speedswap"],
		eventPokemon: [
			{"generation": 7, "level": 60, "moves": ["triplekick", "lunge", "bugbuzz", "mefirst"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["triplekick", "lunge", "bugbuzz", "mefirst"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	xurkitree: {
		randomBattleMoves: ["thunderbolt", "voltswitch", "energyball", "dazzlinggleam", "hiddenpowerice", "electricterrain"],
		randomDoubleBattleMoves: ["thunderbolt", "hiddenpowerice", "tailglow", "protect", "energyball", "hypnosis"],
		eventPokemon: [
			{"generation": 7, "level": 65, "moves": ["hypnosis", "discharge", "electricterrain", "powerwhip"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["hypnosis", "discharge", "electricterrain", "powerwhip"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	celesteela: {
		randomBattleMoves: ["autotomize", "heavyslam", "airslash", "fireblast", "earthquake", "leechseed", "protect"],
		randomDoubleBattleMoves: ["protect", "heavyslam", "fireblast", "earthquake", "wideguard", "leechseed", "flamethrower", "substitute"],
		eventPokemon: [
			{"generation": 7, "level": 65, "moves": ["autotomize", "seedbomb", "skullbash", "irondefense"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["autotomize", "seedbomb", "skullbash", "irondefense"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	kartana: {
		randomBattleMoves: ["leafblade", "sacredsword", "smartstrike", "knockoff", "swordsdance"],
		randomDoubleBattleMoves: ["leafblade", "sacredsword", "smartstrike", "psychocut", "protect", "knockoff"],
		eventPokemon: [
			{"generation": 7, "level": 60, "moves": ["leafblade", "xscissor", "detect", "airslash"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["leafblade", "xscissor", "detect", "airslash"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	guzzlord: {
		randomBattleMoves: ["dracometeor", "knockoff", "earthquake", "heavyslam", "fireblast"],
		randomDoubleBattleMoves: ["dracometeor", "crunch", "darkpulse", "wideguard", "fireblast", "protect"],
		eventPokemon: [
			{"generation": 7, "level": 70, "moves": ["thrash", "gastroacid", "heavyslam", "wringout"]},
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["hammerarm", "thrash", "gastroacid", "heavyslam"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	necrozma: {
		randomBattleMoves: ["calmmind", "photongeyser", "heatwave", "moonlight", "stealthrock"],
		randomDoubleBattleMoves: ["calmmind", "trickroom", "moonlight", "storedpower", "psyshock", "darkpulse"],
		eventPokemon: [
			{"generation": 7, "level": 75, "moves": ["stealthrock", "irondefense", "wringout", "prismaticlaser"]},
			{"generation": 7, "level": 65, "moves": ["photongeyser", "irondefense", "powergem", "nightslash"]},
			{"generation": 7, "level": 75, "shiny": true, "moves": ["lightscreen", "substitute", "moonlight"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	necrozmaduskmane: {
		randomBattleMoves: ["swordsdance", "sunsteelstrike", "photongeyser", "earthquake", "knockoff", "autotomize"],
		randomDoubleBattleMoves: ["swordsdance", "sunsteelstrike", "photongeyser", "earthquake", "knockoff", "rockslide"],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	necrozmadawnwings: {
		randomBattleMoves: ["calmmind", "moongeistbeam", "photongeyser", "heatwave", "powergem", "trickroom"],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	necrozmaultra: {
		requiredItem: "Ultranecrozium Z",
		battleOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magearna: {
		randomBattleMoves: ["shiftgear", "ironhead", "calmmind", "fleurcannon", "flashcannon", "thunderbolt", "focusblast"],
		randomDoubleBattleMoves: ["dazzlinggleam", "flashcannon", "substitute", "protect", "trickroom", "fleurcannon", "aurasphere", "voltswitch"],
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["fleurcannon", "flashcannon", "luckychant", "helpinghand"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	magearnaoriginal: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	marshadow: {
		randomBattleMoves: ["bulkup", "spectralthief", "closecombat", "rocktomb", "shadowsneak", "icepunch"],
		randomDoubleBattleMoves: ["spectralthief", "closecombat", "shadowsneak", "icepunch", "protect"],
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["spectralthief", "closecombat", "forcepalm", "shadowball"], "pokeball": "cherishball"},
		],
		eventOnly: true,
		isUnreleased: true,
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
		randomBattleMoves: ["nastyplot", "dragonpulse", "sludgewave", "fireblast", "dracometeor", "uturn"],
		randomDoubleBattleMoves: ["tailwind", "dragonpulse", "sludgebomb", "fireblast", "dracometeor", "uturn", "protect"],
		isNonstandard: "Past",
		tier: "Illegal",
	},
	stakataka: {
		randomBattleMoves: ["gyroball", "stoneedge", "trickroom", "earthquake", "superpower", "stealthrock"],
		randomDoubleBattleMoves: ["gyroball", "stoneedge", "trickroom", "earthquake", "superpower", "stealthrock", "rockslide"],
		eventPokemon: [
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["irondefense", "ironhead", "rockblast", "wideguard"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	blacephalon: {
		randomBattleMoves: ["mindblown", "fireblast", "shadowball", "hiddenpowerice", "trick", "explosion", "calmmind"],
		randomDoubleBattleMoves: ["willowisp", "fireblast", "shadowball", "hiddenpowerice", "heatwave", "protect"],
		eventPokemon: [
			{"generation": 7, "level": 60, "shiny": 1, "moves": ["fireblast", "shadowball", "trick", "mindblown"]},
		],
		eventOnly: true,
		isNonstandard: "Past",
		tier: "Illegal",
	},
	zeraora: {
		randomBattleMoves: ["plasmafists", "closecombat", "voltswitch", "hiddenpowerice", "knockoff", "grassknot", "workup"],
		randomDoubleBattleMoves: ["plasmafists", "closecombat", "voltswitch", "hiddenpowerice", "knockoff", "grassknot", "fakeout", "protect"],
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["plasmafists", "thunderpunch", "closecombat", "thunder"]},
		],
		eventOnly: true,
		isUnreleased: true,
		tier: "Unreleased",
	},
	meltan: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	melmetal: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	melmetalgigantamax: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	grookey: {
		tier: "LC",
	},
	thwackey: {
		tier: "NFE",
	},
	rillaboom: {
		tier: "New",
		doublesTier: "New",
	},
	scorbunny: {
		tier: "LC",
	},
	raboot: {
		tier: "NFE",
	},
	cinderace: {
		tier: "New",
		doublesTier: "New",
	},
	sobble: {
		tier: "LC",
	},
	drizzile: {
		tier: "NFE",
	},
	inteleon: {
		tier: "New",
		doublesTier: "New",
	},
	skwovet: {
		tier: "LC",
	},
	greedent: {
		tier: "New",
		doublesTier: "New",
	},
	rookidee: {
		tier: "LC",
	},
	corvisquire: {
		tier: "NFE",
	},
	corviknight: {
		tier: "New",
		doublesTier: "New",
	},
	corviknightgigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	blipbug: {
		tier: "LC",
	},
	dotter: {
		tier: "NFE",
	},
	orbeetle: {
		tier: "New",
		doublesTier: "New",
	},
	orbeetlegigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	nickit: {
		tier: "LC",
	},
	thievul: {
		tier: "New",
		doublesTier: "New",
	},
	gossifleur: {
		tier: "LC",
	},
	eldegoss: {
		tier: "New",
		doublesTier: "New",
	},
	wooloo: {
		tier: "LC",
	},
	dubwool: {
		tier: "New",
		doublesTier: "New",
	},
	chewtle: {
		tier: "LC",
	},
	drednaw: {
		tier: "New",
		doublesTier: "New",
	},
	drednawgigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	yamper: {
		tier: "LC",
	},
	boltund: {
		tier: "New",
		doublesTier: "New",
	},
	rolycoly: {
		tier: "LC",
	},
	carkol: {
		tier: "NFE",
	},
	coalossal: {
		tier: "New",
		doublesTier: "New",
	},
	coalossalgigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	applin: {
		tier: "LC",
	},
	flapple: {
		tier: "New",
		doublesTier: "New",
	},
	flapplegigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	appletun: {
		tier: "New",
		doublesTier: "New",
	},
	appletungigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	silicobra: {
		tier: "LC",
	},
	sandaconda: {
		tier: "New",
		doublesTier: "New",
	},
	sandacondagigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	cramorant: {
		tier: "New",
		doublesTier: "New",
	},
	cramorantgulping: {
		battleOnly: true,
		tier: "New",
		doublesTier: "New",
	},
	cramorantgorging: {
		battleOnly: true,
		tier: "New",
		doublesTier: "New",
	},
	arrokuda: {
		tier: "LC",
	},
	barraskewda: {
		tier: "New",
		doublesTier: "New",
	},
	toxel: {
		tier: "LC",
	},
	toxtricity: {
		tier: "New",
		doublesTier: "New",
	},
	toxtricityamped: {
		tier: "New",
		doublesTier: "New",
	},
	toxtricitygigantamax: {
		isUnreleased: true,
		tier: "Unreleased",
	},
	sizzlipede: {
		tier: "LC",
	},
	sentiskorch: {
		tier: "New",
		doublesTier: "New",
	},
	sentiskorchgigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	clobbopus: {
		tier: "LC",
	},
	grapploct: {
		tier: "New",
		doublesTier: "New",
	},
	sinistea: {
		tier: "LC",
	},
	polteageist: {
		tier: "New",
		doublesTier: "New",
	},
	hatenna: {
		tier: "LC",
	},
	hattrem: {
		tier: "NFE",
	},
	hatterene: {
		tier: "New",
		doublesTier: "New",
	},
	hatterenegigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	impidimp: {
		tier: "LC",
	},
	morgrem: {
		tier: "NFE",
	},
	grimmsnarl: {
		tier: "New",
		doublesTier: "New",
	},
	grimmsnarlgigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	milcery: {
		tier: "LC",
	},
	alcremie: {
		tier: "New",
		doublesTier: "New",
	},
	alcremiegigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	failinks: {
		tier: "New",
		doublesTier: "New",
	},
	pincurchin: {
		tier: "New",
		doublesTier: "New",
	},
	snom: {
		tier: "LC",
	},
	frosmoth: {
		tier: "New",
		doublesTier: "New",
	},
	stonjourner: {
		tier: "New",
		doublesTier: "New",
	},
	eiscue: {
		tier: "New",
		doublesTier: "New",
	},
	eiscuenoice: {
		battleOnly: true,
	},
	indeedee: {
		tier: "New",
		doublesTier: "New",
	},
	indeedeef: {
		tier: "New",
		doublesTier: "New",
	},
	morpeko: {
		tier: "New",
		doublesTier: "New",
	},
	morpekohangry: {
		battleOnly: true,
	},
	cufant: {
		tier: "LC",
	},
	copperajah: {
		tier: "New",
		doublesTier: "New",
	},
	copperajahgigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	dracozolt: {
		tier: "New",
		doublesTier: "New",
	},
	arctozolt: {
		tier: "New",
		doublesTier: "New",
	},
	dracovish: {
		tier: "New",
		doublesTier: "New",
	},
	arctovish: {
		tier: "New",
		doublesTier: "New",
	},
	duraludon: {
		tier: "New",
		doublesTier: "New",
	},
	duraludongigantamax: {
		tier: "New",
		doublesTier: "New",
	},
	dreepy: {
		tier: "LC",
	},
	drakloak: {
		tier: "NFE",
	},
	dragapult: {
		tier: "New",
		doublesTier: "New",
	},
	zacian: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	zaciancrownedsword: {
		tier: "Uber",
		doublesTier: "DUber",
		requiredItem: "Rusted Sword",
	},
	zamazenta: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	zamazentacrownedshield: {
		tier: "Uber",
		doublesTier: "DUber",
		requiredItem: "Rusted Shield",
	},
	eternatus: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	eternatuseternamax: {
		tier: "Uber",
		doublesTier: "DUber",
	},
	missingno: {
		randomBattleMoves: ["watergun", "skyattack", "doubleedge", "metronome"],
		isNonstandard: "Glitch",
		tier: "Illegal",
	},
	tomohawk: {
		randomBattleMoves: ["aurasphere", "roost", "stealthrock", "rapidspin", "hurricane", "airslash", "taunt", "substitute", "toxic", "naturepower", "earthpower"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	necturna: {
		randomBattleMoves: ["powerwhip", "hornleech", "willowisp", "shadowsneak", "stoneedge", "sacredfire", "boltstrike", "vcreate", "extremespeed", "closecombat", "shellsmash", "spore", "milkdrink", "stickyweb"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	mollux: {
		randomBattleMoves: ["fireblast", "thunderbolt", "sludgebomb", "thunderwave", "willowisp", "recover", "rapidspin", "trick", "stealthrock", "toxicspikes", "lavaplume"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	aurumoth: {
		randomBattleMoves: ["dragondance", "quiverdance", "closecombat", "bugbuzz", "hydropump", "megahorn", "psychic", "blizzard", "thunder", "focusblast", "zenheadbutt"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	malaconda: {
		randomBattleMoves: ["powerwhip", "glare", "toxic", "suckerpunch", "rest", "substitute", "uturn", "synthesis", "rapidspin", "knockoff"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	cawmodore: {
		randomBattleMoves: ["bellydrum", "bulletpunch", "drainpunch", "acrobatics", "drillpeck", "substitute", "ironhead", "quickattack"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	volkraken: {
		randomBattleMoves: ["scald", "powergem", "hydropump", "memento", "hiddenpowerice", "fireblast", "willowisp", "uturn", "substitute", "flashcannon", "surf"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	plasmanta: {
		randomBattleMoves: ["sludgebomb", "thunderbolt", "substitute", "hiddenpowerice", "psyshock", "dazzlinggleam", "flashcannon"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	naviathan: {
		randomBattleMoves: ["dragondance", "waterfall", "ironhead", "iciclecrash"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	crucibelle: {
		randomBattleMoves: ["headsmash", "gunkshot", "coil", "lowkick", "uturn", "stealthrock"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	crucibellemega: {
		randomBattleMoves: ["headsmash", "gunkshot", "coil", "woodhammer", "lowkick", "uturn"],
		requiredItem: "Crucibellite",
		isNonstandard: "CAP",
		tier: "CAP",
	},
	kerfluffle: {
		randomBattleMoves: ["aurasphere", "moonblast", "taunt", "partingshot", "gigadrain", "yawn"],
		isNonstandard: "CAP",
		eventPokemon: [
			{"generation": 6, "level": 16, "isHidden": false, "abilities": ["naturalcure"], "moves": ["celebrate", "holdhands", "fly", "metronome"], "pokeball": "cherishball"},
		],
		tier: "CAP",
	},
	pajantom: {
		randomBattleMoves: ["spiritshackle", "dragonclaw", "toxicspikes", "psychicfangs", "earthquake", "substitute", "leechlife"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	jumbao: {
		randomBattleMoves: ["moonblast", "flameburst", "focusblast", "synthesis", "solarbeam", "hiddenpowerground", "healingwish"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	caribolt: {
		randomBattleMoves: ["swordsdance", "quickattack", "powerwhip", "return", "voltswitch"],
		isNonstandard: "CAP",
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["celebrate", "hornleech", "wildcharge", "metronome"], "pokeball": "cherishball"},
		],
		tier: "CAP",
	},
	smokomodo: {
		randomBattleMoves: ["flareblitz", "earthquake", "hiddenpowerice", "toxic", "stealthrock"],
		isNonstandard: "CAP",
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["celebrate", "eruption", "magnitude", "camouflage"], "pokeball": "cherishball"},
		],
		tier: "CAP",
	},
	snaelstrom: {
		randomBattleMoves: ["stealthrock", "icebeam", "toxic", "spikyshield", "scald", "rapidspin"],
		isNonstandard: "CAP",
		eventPokemon: [
			{"generation": 7, "level": 50, "moves": ["celebrate", "liquidation", "leechlife", "metronome"], "pokeball": "cherishball"},
		],
		tier: "CAP",
	},
	equilibra: {
		randomBattleMoves: ["doomdesire", "earthpower", "trickroom", "rapidspin", "flashcannon", "healingwish", "aurasphere"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	syclant: {
		randomBattleMoves: ["bugbuzz", "icebeam", "blizzard", "earthpower", "spikes", "superpower", "tailglow", "uturn", "focusblast"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	revenankh: {
		randomBattleMoves: ["bulkup", "shadowsneak", "drainpunch", "rest", "moonlight", "icepunch", "glare"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	pyroak: {
		randomBattleMoves: ["leechseed", "lavaplume", "substitute", "protect", "gigadrain"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	fidgit: {
		randomBattleMoves: ["spikes", "stealthrock", "toxicspikes", "wish", "rapidspin", "encore", "uturn", "sludgebomb", "earthpower"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	stratagem: {
		randomBattleMoves: ["paleowave", "earthpower", "fireblast", "gigadrain", "calmmind", "substitute"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	arghonaut: {
		randomBattleMoves: ["recover", "bulkup", "waterfall", "drainpunch", "crosschop", "stoneedge", "thunderpunch", "aquajet", "machpunch"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	kitsunoh: {
		randomBattleMoves: ["shadowstrike", "earthquake", "superpower", "meteormash", "uturn", "icepunch", "trick", "willowisp"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	cyclohm: {
		randomBattleMoves: ["slackoff", "dracometeor", "dragonpulse", "fireblast", "thunderbolt", "hydropump", "discharge", "healbell"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	colossoil: {
		randomBattleMoves: ["earthquake", "crunch", "suckerpunch", "uturn", "rapidspin", "encore", "pursuit", "knockoff"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	krilowatt: {
		randomBattleMoves: ["surf", "thunderbolt", "icebeam", "earthpower"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	voodoom: {
		randomBattleMoves: ["aurasphere", "darkpulse", "taunt", "painsplit", "substitute", "hiddenpowerice", "vacuumwave", "flashcannon"],
		isNonstandard: "CAP",
		tier: "CAP",
	},
	syclar: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	embirch: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	flarelm: {
		isNonstandard: "CAP",
		tier: "CAP NFE",
	},
	breezi: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	scratchet: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	necturine: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	cupra: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	argalis: {
		isNonstandard: "CAP",
		tier: "CAP NFE",
	},
	brattler: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	cawdet: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	volkritter: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	snugglow: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	floatoy: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	caimanoe: {
		isNonstandard: "CAP",
		tier: "CAP NFE",
	},
	pluffle: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	rebble: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	tactite: {
		isNonstandard: "CAP",
		tier: "CAP NFE",
	},
	privatyke: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	voodoll: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	mumbao: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	fawnifer: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	electrelk: {
		isNonstandard: "CAP",
		tier: "CAP NFE",
	},
	smogecko: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	smoguana: {
		isNonstandard: "CAP",
		tier: "CAP NFE",
	},
	swirlpool: {
		isNonstandard: "CAP",
		tier: "CAP LC",
	},
	coribalis: {
		isNonstandard: "CAP",
		tier: "CAP NFE",
	},
	pokestarufo: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 38, "moves": ["bubblebeam", "counter", "recover", "signalbeam"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarufo2: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 47, "moves": ["darkpulse", "flamethrower", "hyperbeam", "icebeam"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarbrycenman: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 56, "moves": ["icebeam", "nightshade", "psychic", "uturn"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarmt: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 63, "moves": ["earthquake", "ironhead", "spark", "surf"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarmt2: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 72, "moves": ["dragonpulse", "flamethrower", "metalburst", "thunderbolt"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestartransport: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 20, "moves": ["clearsmog", "flameburst", "discharge"]},
			{"generation": 5, "level": 50, "moves": ["iciclecrash", "overheat", "signalbeam"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestargiant: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 99, "moves": ["crushgrip", "focuspunch", "growl", "rage"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestargiant2: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 99, "moves": ["crushgrip", "doubleslap", "teeterdance", "stomp"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarhumanoid: {
		isNonstandard: "Pokestar",
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
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 50, "moves": ["darkpulse", "confusion"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarf00: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 10, "moves": ["teeterdance", "growl", "flail", "chatter"]},
			{"generation": 5, "level": 58, "moves": ["needlearm", "headsmash", "headbutt", "defensecurl"]},
			{"generation": 5, "level": 60, "moves": ["hammerarm", "perishsong", "ironhead", "thrash"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarf002: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 52, "moves": ["flareblitz", "ironhead", "psychic", "wildcharge"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarspirit: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 99, "moves": ["crunch", "dualchop", "slackoff", "swordsdance"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarblackdoor: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 53, "moves": ["luckychant", "amnesia", "ingrain", "rest"]},
			{"generation": 5, "level": 70, "moves": ["batonpass", "counter", "flamecharge", "toxic"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarwhitedoor: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 7, "moves": ["batonpass", "inferno", "mirrorcoat", "toxic"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarblackbelt: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 30, "moves": ["focuspunch", "machpunch", "taunt"]},
			{"generation": 5, "level": 40, "moves": ["machpunch", "hammerarm", "jumpkick"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestargiantpropo2: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 99, "moves": ["crushgrip", "doubleslap", "teeterdance", "stomp"]},
		],
		gen: 5,
		tier: "Illegal",
	},
	pokestarufopropu2: {
		isNonstandard: "Pokestar",
		eventPokemon: [
			{"generation": 5, "level": 47, "moves": ["darkpulse", "flamethrower", "hyperbeam", "icebeam"]},
		],
		gen: 5,
		tier: "Illegal",
	},
};

exports.BattleFormatsData = BattleFormatsData;
