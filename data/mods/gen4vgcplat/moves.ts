export const Moves: {[k: string]: ModdedMoveData} = {
	accelerock: {
		num: 709,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Accelerock",
		pp: 20,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Cool",
	},
	spiritbreak: {
		num: 789,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Spirit Break",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Fairy",
	},
	thunderouskick: {
		num: 823,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Thunderous Kick",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Fighting",
	},
	"pound": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 35,
		"type": "Normal"
	},
	"karatechop": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 25,
		"type": "Fighting"
	},
	"doubleslap": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 10,
		"type": "Fairy"
	},
	"cometpunch": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 18,
		"category": "Physical",
		"pp": 15,
		"type": "Normal"
	},
	"poweruppunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 5,
		"type": "Fighting"
	},
	"payday": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"firepunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fire"
	},
	"icepunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Ice"
	},
	"thunderpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Electric"
	},
	"scratch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 35,
		"type": "Normal"
	},
	"vicegrip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 55,
		"category": "Physical",
		"pp": 30,
		"type": "Normal"
	},
	"guillotine": {
		"inherit": true,
		"accuracy": 30,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Normal"
	},
	"razorwind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Normal"
	},
	"swordsdance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Normal"
	},
	"cut": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 30,
		"type": "Grass"
	},
	"gust": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 35,
		"type": "Flying"
	},
	"wingattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 35,
		"type": "Flying"
	},
	"whirlwind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"fly": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Flying"
	},
	"bind": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 15,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"slam": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 80,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"vinewhip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 15,
		"type": "Grass"
	},
	"stomp": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"doublekick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 30,
		"category": "Physical",
		"pp": 30,
		"type": "Fighting"
	},
	"jumpkick": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 85,
		"category": "Physical",
		"pp": 25,
		"type": "Fighting"
	},
	"rollingkick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting"
	},
	"sandattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Ground"
	},
	"headbutt": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 15,
		"type": "Normal"
	},
	"hornattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 25,
		"type": "Normal"
	},
	"furyattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Flying"
	},
	"horndrill": {
		"inherit": true,
		"accuracy": 30,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Normal"
	},
	"tackle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 35,
		"type": "Normal"
	},
	"bodyslam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Normal"
	},
	"wrap": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 35,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"takedown": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"self": {},
		"recoil": [
			1,
			4
		]
	},
	"thrash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"doubleedge": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 105,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"tailwhip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"poisonsting": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 35,
		"type": "Poison"
	},
	"twineedle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Bug"
	},
	"pinmissile": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Bug"
	},
	"leer": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"bite": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 25,
		"type": "Dark"
	},
	"growl": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"roar": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"sing": {
		"inherit": true,
		"accuracy": 45,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Fairy"
	},
	"supersonic": {
		"inherit": true,
		"accuracy": 50,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"sonicboom": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 1,
		"category": "Special",
		"pp": 20,
		"type": "Normal"
	},
	"disable": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"acid": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 30,
		"type": "Poison"
	},
	"ember": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 25,
		"type": "Fire"
	},
	"flamethrower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Special",
		"pp": 15,
		"type": "Fire"
	},
	"mist": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Ice"
	},
	"watergun": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 25,
		"type": "Water"
	},
	"hydropump": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Water"
	},
	"surf": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 95,
		"category": "Special",
		"pp": 15,
		"type": "Water"
	},
	"icebeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Ice"
	},
	"blizzard": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Ice"
	},
	"psybeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Psychic"
	},
	"bubblebeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 20,
		"type": "Water"
	},
	"aurorabeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 20,
		"type": "Ice"
	},
	"hyperbeam": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Normal",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"peck": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Physical",
		"pp": 35,
		"type": "Flying"
	},
	"drillpeck": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 20,
		"type": "Flying"
	},
	"submission": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 25,
		"type": "Fighting",
		"self": {},
		"recoil": [
			1,
			4
		]
	},
	"lowkick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting"
	},
	"counter": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting"
	},
	"seismictoss": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting"
	},
	"strength": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting"
	},
	"drainingkiss": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 15,
		"type": "Fairy"
	},
	"megadrain": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 15,
		"type": "Grass"
	},
	"leechseed": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Grass"
	},
	"growth": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"razorleaf": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 25,
		"type": "Grass"
	},
	"solarbeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Grass"
	},
	"poisonpowder": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 35,
		"type": "Poison"
	},
	"stunspore": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Grass"
	},
	"sleeppowder": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Grass"
	},
	"petaldance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Special",
		"pp": 20,
		"type": "Grass",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"stringshot": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Bug"
	},
	"dragonrage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 10,
		"type": "Dragon"
	},
	"firespin": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 15,
		"type": "Fire"
	},
	"thundershock": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 30,
		"type": "Electric"
	},
	"thunderbolt": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 15,
		"type": "Electric"
	},
	"thunderwave": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Electric"
	},
	"thunder": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Electric"
	},
	"rockthrow": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 15,
		"type": "Rock"
	},
	"earthquake": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Ground"
	},
	"fissure": {
		"inherit": true,
		"accuracy": 30,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Ground"
	},
	"dig": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Ground"
	},
	"toxic": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Poison"
	},
	"confusion": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 25,
		"type": "Psychic"
	},
	"psychic": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Psychic"
	},
	"hypnosis": {
		"inherit": true,
		"accuracy": 60,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Psychic"
	},
	"meditate": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic"
	},
	"agility": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Psychic"
	},
	"quickattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Normal"
	},
	"rage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 20,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"teleport": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Psychic"
	},
	"nightshade": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 15,
		"type": "Ghost"
	},
	"mimic": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"screech": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"doubleteam": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"recover": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"harden": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"minimize": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"smokescreen": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"confuseray": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Ghost"
	},
	"withdraw": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Water"
	},
	"defensecurl": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"barrier": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Psychic"
	},
	"lightscreen": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"haze": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Ice"
	},
	"reflect": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"focusenergy": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal"
	},
	"bide": {
		"inherit": true,
		"accuracy": true,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Normal"
	},
	"metronome": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"mirrormove": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Flying"
	},
	"selfdestruct": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 200,
		"category": "Physical",
		"pp": 1,
		"type": "Normal"
	},
	"eggbomb": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Psychic"
	},
	"lick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Physical",
		"pp": 30,
		"type": "Ghost"
	},
	"smog": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 20,
		"type": "Poison"
	},
	"sludge": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Special",
		"pp": 20,
		"type": "Poison"
	},
	"boneclub": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Ground"
	},
	"fireblast": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Fire"
	},
	"waterfall": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Water"
	},
	"clamp": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 35,
		"category": "Physical",
		"pp": 10,
		"type": "Water"
	},
	"swift": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Special",
		"pp": 20,
		"type": "Normal"
	},
	"skullbash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Rock"
	},
	"spikecannon": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 15,
		"type": "Steel"
	},
	"constrict": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 10,
		"category": "Physical",
		"pp": 35,
		"type": "Normal"
	},
	"amnesia": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Psychic"
	},
	"kinesis": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Psychic"
	},
	"softboiled": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"highjumpkick": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting"
	},
	"glare": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Normal"
	},
	"dreameater": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Special",
		"pp": 15,
		"type": "Psychic"
	},
	"poisongas": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Poison"
	},
	"barrage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Psychic"
	},
	"leechlife": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Bug"
	},
	"lovelykiss": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"skyattack": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 105,
		"category": "Physical",
		"pp": 5,
		"type": "Flying"
	},
	"transform": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"bubble": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 35,
		"category": "Special",
		"pp": 30,
		"type": "Water"
	},
	"dizzypunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 10,
		"type": "Normal"
	},
	"spore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Grass"
	},
	"flash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"psywave": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 1,
		"category": "Special",
		"pp": 15,
		"type": "Psychic"
	},
	"splash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 40,
		"type": "Water"
	},
	"acidarmor": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Poison"
	},
	"crabhammer": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Water"
	},
	"explosion": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 250,
		"category": "Physical",
		"pp": 5,
		"type": "Normal"
	},
	"furyswipes": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 15,
		"type": "Normal"
	},
	"bonemerang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 45,
		"category": "Physical",
		"pp": 10,
		"type": "Ground"
	},
	"rest": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic"
	},
	"rockslide": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Rock"
	},
	"hyperfang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Steel"
	},
	"sharpen": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"conversion": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal"
	},
	"triattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Normal"
	},
	"superfang": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Normal"
	},
	"slash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"substitute": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"struggle": {
		"inherit": true,
		"accuracy": true,
		"basePower": 50,
		"category": "Physical",
		"pp": 1,
		"type": "Normal"
	},
	"sketch": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 1,
		"type": "Normal"
	},
	"triplekick": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 20,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting"
	},
	"thief": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 10,
		"type": "Dark"
	},
	"spiderweb": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Bug"
	},
	"mindreader": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"nightmare": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Ghost"
	},
	"flamewheel": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 25,
		"type": "Fire"
	},
	"snore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 15,
		"type": "Normal"
	},
	"curse": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Ghost"
	},
	"flail": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 15,
		"type": "Normal"
	},
	"conversion2": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal"
	},
	"aeroblast": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 100,
		"category": "Special",
		"pp": 5,
		"type": "Flying"
	},
	"cottonspore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Grass"
	},
	"reversal": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting"
	},
	"spite": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Ghost"
	},
	"powdersnow": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 25,
		"type": "Ice"
	},
	"protect": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"machpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Fighting"
	},
	"scaryface": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"faintattack": {
		"inherit": true,
		"accuracy": true,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Dark"
	},
	"sweetkiss": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 0,
		"category": "Status",
		"pp": 4,
		"type": "Normal"
	},
	"bellydrum": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"sludgebomb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Poison"
	},
	"mudslap": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 35,
		"category": "Special",
		"pp": 10,
		"type": "Ground"
	},
	"octazooka": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Water"
	},
	"spikes": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Ground"
	},
	"zapcannon": {
		"inherit": true,
		"accuracy": 60,
		"basePower": 110,
		"category": "Special",
		"pp": 5,
		"type": "Electric"
	},
	"foresight": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Normal"
	},
	"destinybond": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Ghost"
	},
	"perishsong": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"icywind": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 55,
		"category": "Special",
		"pp": 15,
		"type": "Ice"
	},
	"detect": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fighting"
	},
	"bonerush": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 25,
		"category": "Physical",
		"pp": 10,
		"type": "Ground"
	},
	"lockon": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"outrage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Dragon",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"sandstorm": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Rock"
	},
	"gigadrain": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Special",
		"pp": 10,
		"type": "Grass"
	},
	"endure": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"charm": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fairy"
	},
	"rollout": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 30,
		"category": "Physical",
		"pp": 20,
		"type": "Rock"
	},
	"falseswipe": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 40,
		"type": "Normal"
	},
	"swagger": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Normal"
	},
	"milkdrink": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 4,
		"type": "Normal"
	},
	"spark": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 20,
		"type": "Electric"
	},
	"furycutter": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Bug"
	},
	"steelwing": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 25,
		"type": "Steel"
	},
	"meanlook": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"attract": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Normal"
	},
	"sleeptalk": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"healbell": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"return": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"present": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 1,
		"category": "Physical",
		"pp": 15,
		"type": "Normal"
	},
	"frustration": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"safeguard": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 25,
		"type": "Normal"
	},
	"painsplit": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"sacredfire": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 100,
		"category": "Physical",
		"pp": 5,
		"type": "Fire"
	},
	"magnitude": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 30,
		"type": "Ground"
	},
	"dynamicpunch": {
		"inherit": true,
		"accuracy": 60,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting"
	},
	"megahorn": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 105,
		"category": "Physical",
		"pp": 10,
		"type": "Bug"
	},
	"dragonbreath": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Dragon"
	},
	"batonpass": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Normal"
	},
	"encore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"pursuit": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Dark"
	},
	"rapidspin": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 40,
		"type": "Normal"
	},
	"sweetscent": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"irontail": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Steel"
	},
	"metalclaw": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 35,
		"type": "Steel"
	},
	"vitalthrow": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting"
	},
	"morningsun": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"synthesis": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Grass"
	},
	"moonlight": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"hiddenpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 15,
		"type": "Normal"
	},
	"crosschop": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 5,
		"type": "Fighting"
	},
	"twister": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 20,
		"type": "Dragon"
	},
	"raindance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Water"
	},
	"sunnyday": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Fire"
	},
	"crunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Dark"
	},
	"mirrorcoat": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 20,
		"type": "Psychic"
	},
	"psychup": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"extremespeed": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 5,
		"type": "Normal"
	},
	"ancientpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 5,
		"type": "Rock"
	},
	"shadowball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 15,
		"type": "Ghost"
	},
	"futuresight": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 135,
		"category": "Special",
		"pp": 15,
		"type": "Psychic"
	},
	"rocksmash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting"
	},
	"whirlpool": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 15,
		"type": "Water"
	},
	"beatup": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 10,
		"category": "Physical",
		"pp": 10,
		"type": "Dark"
	},
	"fakeout": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 10,
		"type": "Normal"
	},
	"uproar": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 10,
		"type": "Normal"
	},
	"stockpile": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"spitup": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 10,
		"type": "Normal"
	},
	"swallow": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"heatwave": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Fire"
	},
	"hail": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Ice"
	},
	"torment": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Dark"
	},
	"flatter": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Dark"
	},
	"willowisp": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Fire"
	},
	"memento": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Dark"
	},
	"facade": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"focuspunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 150,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting"
	},
	"earthsqueeze": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Ground"
	},
	"followme": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"naturepower": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"charge": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Electric"
	},
	"taunt": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Dark"
	},
	"helpinghand": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"trick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"roleplay": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"wish": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Normal"
	},
	"assist": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"ingrain": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Grass"
	},
	"superpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"magiccoat": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Psychic"
	},
	"recycle": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"revenge": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting"
	},
	"brickbreak": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting"
	},
	"yawn": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"knockoff": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Dark"
	},
	"endeavor": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Normal"
	},
	"eruption": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 150,
		"category": "Special",
		"pp": 5,
		"type": "Fire"
	},
	"skillswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"imprison": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"refresh": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"grudge": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Ghost"
	},
	"snatch": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Dark"
	},
	"secretpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal"
	},
	"dive": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Water"
	},
	"armthrust": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting"
	},
	"camouflage": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"tailglow": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Bug"
	},
	"dazzlinggleam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Fairy"
	},
	"moonblast": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 95,
		"category": "Special",
		"pp": 10,
		"type": "Fairy"
	},
	"featherdance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Flying"
	},
	"teeterdance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"blazekick": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 85,
		"category": "Physical",
		"pp": 10,
		"type": "Fire"
	},
	"moltenmud": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 10,
		"type": "Ground"
	},
	"iceball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 30,
		"category": "Physical",
		"pp": 20,
		"type": "Ice"
	},
	"needlearm": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 15,
		"type": "Grass"
	},
	"slackoff": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"hypervoice": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Normal"
	},
	"poisonfang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Poison"
	},
	"crushclaw": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Normal"
	},
	"blastburn": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Fire",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"hydrocannon": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Water",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"meteormash": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 95,
		"category": "Physical",
		"pp": 10,
		"type": "Steel"
	},
	"astonish": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 15,
		"type": "Ghost"
	},
	"weatherball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 10,
		"type": "Normal"
	},
	"aromatherapy": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Grass"
	},
	"faketears": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Dark"
	},
	"aircutter": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 55,
		"category": "Special",
		"pp": 25,
		"type": "Flying"
	},
	"overheat": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Fire",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"odorsleuth": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Normal"
	},
	"rocktomb": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Rock"
	},
	"silverwind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 5,
		"type": "Bug"
	},
	"metalsound": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Steel"
	},
	"grasswhistle": {
		"inherit": true,
		"accuracy": 45,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Grass"
	},
	"tickle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"cosmicpower": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Psychic"
	},
	"waterspout": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 150,
		"category": "Special",
		"pp": 5,
		"type": "Water"
	},
	"signalbeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Special",
		"pp": 15,
		"type": "Bug"
	},
	"shadowpunch": {
		"inherit": true,
		"accuracy": true,
		"basePower": 75,
		"category": "Physical",
		"pp": 20,
		"type": "Ghost"
	},
	"extrasensory": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 30,
		"type": "Psychic"
	},
	"skyuppercut": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting"
	},
	"sandtomb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Physical",
		"pp": 15,
		"type": "Ground"
	},
	"frigidfinale": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Ice"
	},
	"muddywater": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Water"
	},
	"bulletseed": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 30,
		"type": "Grass"
	},
	"aerialace": {
		"inherit": true,
		"accuracy": true,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Flying"
	},
	"iciclespear": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 30,
		"type": "Ice"
	},
	"irondefense": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Steel"
	},
	"block": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal"
	},
	"howl": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal"
	},
	"dragonclaw": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Dragon"
	},
	"frenzyplant": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Grass",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"bulkup": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fighting"
	},
	"bounce": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Flying"
	},
	"mudshot": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 55,
		"category": "Special",
		"pp": 15,
		"type": "Ground"
	},
	"poisontail": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 25,
		"type": "Poison"
	},
	"covet": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 40,
		"type": "Normal"
	},
	"volttackle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Electric"
	},
	"magicalleaf": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Special",
		"pp": 20,
		"type": "Grass"
	},
	"scald": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Water"
	},
	"calmmind": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Psychic"
	},
	"leafblade": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Grass"
	},
	"dragondance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Dragon"
	},
	"rockblast": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 25,
		"category": "Physical",
		"pp": 10,
		"type": "Rock"
	},
	"shockwave": {
		"inherit": true,
		"accuracy": true,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Electric"
	},
	"waterpulse": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Water"
	},
	"doomdesire": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 135,
		"category": "Special",
		"pp": 10,
		"type": "Steel"
	},
	"psychoboost": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Psychic",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"roost": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Flying"
	},
	"gravity": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic"
	},
	"playrough": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Fairy"
	},
	"hammerarm": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting"
	},
	"gyroball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 15,
		"type": "Steel"
	},
	"healingwish": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"brine": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Water"
	},
	"voltswitch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 15,
		"type": "Electric"
	},
	"feint": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Normal"
	},
	"pluck": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Flying"
	},
	"tailwind": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Flying"
	},
	"acupressure": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal"
	},
	"metalburst": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Steel"
	},
	"uturn": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Bug"
	},
	"closecombat": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting"
	},
	"payback": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Dark"
	},
	"assurance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Dark"
	},
	"taxation": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 15,
		"type": "Dark"
	},
	"fling": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Dark"
	},
	"psychoshift": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"trumpcard": {
		"inherit": true,
		"accuracy": true,
		"basePower": 1,
		"category": "Physical",
		"pp": 2,
		"type": "Normal"
	},
	"healblock": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Psychic"
	},
	"wringout": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 5,
		"type": "Normal"
	},
	"powertrick": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"gastroacid": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Poison"
	},
	"luckychant": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal"
	},
	"mefirst": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"copycat": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal"
	},
	"powerswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"guardswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"punishment": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Dark"
	},
	"lastresort": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 120,
		"category": "Physical",
		"pp": 5,
		"type": "Normal"
	},
	"worryseed": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Grass"
	},
	"suckerpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Dark"
	},
	"toxicspikes": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Poison"
	},
	"heartswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"aquaring": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Water"
	},
	"magnetrise": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Electric"
	},
	"flareblitz": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Fire"
	},
	"forcepalm": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting"
	},
	"aurasphere": {
		"inherit": true,
		"accuracy": true,
		"basePower": 85,
		"category": "Special",
		"pp": 20,
		"type": "Fighting"
	},
	"rockpolish": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Rock"
	},
	"poisonjab": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 20,
		"type": "Poison"
	},
	"darkpulse": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 15,
		"type": "Dark"
	},
	"nightslash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 15,
		"type": "Dark"
	},
	"aquatail": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Water"
	},
	"seedbomb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Grass"
	},
	"airslash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 20,
		"type": "Flying"
	},
	"xscissor": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Bug"
	},
	"bugbuzz": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Bug"
	},
	"dragonpulse": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Dragon"
	},
	"dragonrush": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Dragon"
	},
	"powergem": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 20,
		"type": "Rock"
	},
	"drainpunch": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting"
	},
	"vacuumwave": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 30,
		"type": "Fighting"
	},
	"focusblast": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Fighting"
	},
	"energyball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Grass"
	},
	"bravebird": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Flying",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"earthpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Ground"
	},
	"switcheroo": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Dark"
	},
	"gigaimpact": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"nastyplot": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Dark"
	},
	"bulletpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Steel"
	},
	"avalanche": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Ice"
	},
	"iceshard": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Ice"
	},
	"shadowclaw": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Ghost"
	},
	"thunderfang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Electric"
	},
	"icefang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Ice"
	},
	"firefang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fire"
	},
	"shadowsneak": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Ghost"
	},
	"mudbomb": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Ground"
	},
	"psychocut": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Psychic"
	},
	"zenheadbutt": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 95,
		"category": "Physical",
		"pp": 15,
		"type": "Psychic"
	},
	"mirrorshot": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Steel"
	},
	"flashcannon": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Steel"
	},
	"rockclimb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 20,
		"type": "Rock"
	},
	"defog": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Flying"
	},
	"trickroom": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic"
	},
	"dracometeor": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"discharge": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 15,
		"type": "Electric"
	},
	"lavaplume": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Special",
		"pp": 15,
		"type": "Fire"
	},
	"leafstorm": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Grass",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"powerwhip": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 110,
		"category": "Physical",
		"pp": 10,
		"type": "Grass"
	},
	"rockwrecker": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Physical",
		"pp": 5,
		"type": "Rock",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"crosspoison": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 20,
		"type": "Poison"
	},
	"gunkshot": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 110,
		"category": "Physical",
		"pp": 5,
		"type": "Poison"
	},
	"ironhead": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Steel"
	},
	"magnetbomb": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Steel"
	},
	"stoneedge": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Rock"
	},
	"captivate": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fairy"
	},
	"grassknot": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 20,
		"type": "Grass"
	},
	"chatter": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Flying"
	},
	"judgment": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Normal"
	},
	"bugbite": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Bug"
	},
	"chargebeam": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 55,
		"category": "Special",
		"pp": 10,
		"type": "Electric"
	},
	"woodhammer": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"aquajet": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Water"
	},
	"attackorder": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Bug"
	},
	"defendorder": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Bug"
	},
	"healorder": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Bug"
	},
	"headsmash": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 120,
		"category": "Physical",
		"pp": 5,
		"type": "Rock",
		"self": {},
		"recoil": [
			1,
			2
		]
	},
	"doublehit": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 35,
		"category": "Physical",
		"pp": 10,
		"type": "Normal"
	},
	"roaroftime": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"self": {},
		"recoil": [
			1,
			3
		]
	},
	"spacialrend": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Dragon"
	},
	"lunardance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic"
	},
	"crushgrip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Normal"
	},
	"magmastorm": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Fire"
	},
	"darkvoid": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Dark"
	},
	"seedflare": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 5,
		"type": "Grass"
	},
	"ominouswind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 5,
		"type": "Ghost"
	},
	"shadowforce": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 5,
		"type": "Ghost"
	}
};
