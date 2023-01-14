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
		"type": "Normal",
		"isNonstandard": null
	},
	"karatechop": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 25,
		"type": "Fighting",
		"isNonstandard": null
	},
	"doubleslap": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 10,
		"type": "Fairy",
		"isNonstandard": null
	},
	"cometpunch": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 18,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"poweruppunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 5,
		"type": "Fighting",
		"isNonstandard": null
	},
	"payday": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"firepunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fire",
		"isNonstandard": null
	},
	"icepunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Ice",
		"isNonstandard": null
	},
	"thunderpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Electric",
		"isNonstandard": null
	},
	"scratch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 35,
		"type": "Normal",
		"isNonstandard": null
	},
	"vicegrip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 55,
		"category": "Physical",
		"pp": 30,
		"type": "Normal",
		"isNonstandard": null
	},
	"guillotine": {
		"inherit": true,
		"accuracy": 30,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"razorwind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"swordsdance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Normal",
		"isNonstandard": null
	},
	"cut": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 30,
		"type": "Grass",
		"isNonstandard": null
	},
	"gust": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 35,
		"type": "Flying",
		"isNonstandard": null
	},
	"wingattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 35,
		"type": "Flying",
		"isNonstandard": null
	},
	"whirlwind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"fly": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Flying",
		"isNonstandard": null
	},
	"bind": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 15,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"slam": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 80,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"vinewhip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"isNonstandard": null
	},
	"stomp": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"doublekick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 30,
		"category": "Physical",
		"pp": 30,
		"type": "Fighting",
		"isNonstandard": null
	},
	"jumpkick": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 85,
		"category": "Physical",
		"pp": 25,
		"type": "Fighting",
		"isNonstandard": null
	},
	"rollingkick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"isNonstandard": null
	},
	"sandattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Ground",
		"isNonstandard": null
	},
	"headbutt": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"hornattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 25,
		"type": "Normal",
		"isNonstandard": null
	},
	"furyattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Flying",
		"isNonstandard": null
	},
	"horndrill": {
		"inherit": true,
		"accuracy": 30,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"tackle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 35,
		"type": "Normal",
		"isNonstandard": null
	},
	"bodyslam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"wrap": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 35,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
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
		],
		"isNonstandard": null
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
		],
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"tailwhip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"poisonsting": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 35,
		"type": "Poison",
		"isNonstandard": null
	},
	"twineedle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"isNonstandard": null
	},
	"pinmissile": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"isNonstandard": null
	},
	"leer": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"bite": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 25,
		"type": "Dark",
		"isNonstandard": null
	},
	"growl": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"roar": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"sing": {
		"inherit": true,
		"accuracy": 45,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Fairy",
		"isNonstandard": null
	},
	"supersonic": {
		"inherit": true,
		"accuracy": 50,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"sonicboom": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 1,
		"category": "Special",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"disable": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"acid": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 30,
		"type": "Poison",
		"isNonstandard": null
	},
	"ember": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 25,
		"type": "Fire",
		"isNonstandard": null
	},
	"flamethrower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Special",
		"pp": 15,
		"type": "Fire",
		"isNonstandard": null
	},
	"mist": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Ice",
		"isNonstandard": null
	},
	"watergun": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 25,
		"type": "Water",
		"isNonstandard": null
	},
	"hydropump": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"surf": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 95,
		"category": "Special",
		"pp": 15,
		"type": "Water",
		"isNonstandard": null
	},
	"icebeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Ice",
		"isNonstandard": null
	},
	"blizzard": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Ice",
		"isNonstandard": null
	},
	"psybeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Psychic",
		"isNonstandard": null
	},
	"bubblebeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 20,
		"type": "Water",
		"isNonstandard": null
	},
	"aurorabeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 20,
		"type": "Ice",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"peck": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Physical",
		"pp": 35,
		"type": "Flying",
		"isNonstandard": null
	},
	"drillpeck": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 20,
		"type": "Flying",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"lowkick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"isNonstandard": null
	},
	"counter": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"isNonstandard": null
	},
	"seismictoss": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"isNonstandard": null
	},
	"strength": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"isNonstandard": null
	},
	"drainingkiss": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 15,
		"type": "Fairy",
		"isNonstandard": null
	},
	"megadrain": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 15,
		"type": "Grass",
		"isNonstandard": null
	},
	"leechseed": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Grass",
		"isNonstandard": null
	},
	"growth": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"razorleaf": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 25,
		"type": "Grass",
		"isNonstandard": null
	},
	"solarbeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Grass",
		"isNonstandard": null
	},
	"poisonpowder": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 35,
		"type": "Poison",
		"isNonstandard": null
	},
	"stunspore": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Grass",
		"isNonstandard": null
	},
	"sleeppowder": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Grass",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"stringshot": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Bug",
		"isNonstandard": null
	},
	"dragonrage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"isNonstandard": null
	},
	"firespin": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 15,
		"type": "Fire",
		"isNonstandard": null
	},
	"thundershock": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 30,
		"type": "Electric",
		"isNonstandard": null
	},
	"thunderbolt": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 15,
		"type": "Electric",
		"isNonstandard": null
	},
	"thunderwave": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Electric",
		"isNonstandard": null
	},
	"thunder": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Electric",
		"isNonstandard": null
	},
	"rockthrow": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 15,
		"type": "Rock",
		"isNonstandard": null
	},
	"earthquake": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"isNonstandard": null
	},
	"fissure": {
		"inherit": true,
		"accuracy": 30,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Ground",
		"isNonstandard": null
	},
	"dig": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"isNonstandard": null
	},
	"toxic": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Poison",
		"isNonstandard": null
	},
	"confusion": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 25,
		"type": "Psychic",
		"isNonstandard": null
	},
	"psychic": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"hypnosis": {
		"inherit": true,
		"accuracy": 60,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Psychic",
		"isNonstandard": null
	},
	"meditate": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic",
		"isNonstandard": null
	},
	"agility": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Psychic",
		"isNonstandard": null
	},
	"quickattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Normal",
		"isNonstandard": null
	},
	"rage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 20,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"teleport": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Psychic",
		"isNonstandard": null
	},
	"nightshade": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 15,
		"type": "Ghost",
		"isNonstandard": null
	},
	"mimic": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"screech": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"doubleteam": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"recover": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"harden": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"minimize": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"smokescreen": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"confuseray": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Ghost",
		"isNonstandard": null
	},
	"withdraw": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Water",
		"isNonstandard": null
	},
	"defensecurl": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"barrier": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Psychic",
		"isNonstandard": null
	},
	"lightscreen": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"haze": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Ice",
		"isNonstandard": null
	},
	"reflect": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"focusenergy": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal",
		"isNonstandard": null
	},
	"bide": {
		"inherit": true,
		"accuracy": true,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"metronome": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"mirrormove": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Flying",
		"isNonstandard": null
	},
	"selfdestruct": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 200,
		"category": "Physical",
		"pp": 1,
		"type": "Normal",
		"isNonstandard": null
	},
	"eggbomb": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"lick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Physical",
		"pp": 30,
		"type": "Ghost",
		"isNonstandard": null
	},
	"smog": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 20,
		"type": "Poison",
		"isNonstandard": null
	},
	"sludge": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Special",
		"pp": 20,
		"type": "Poison",
		"isNonstandard": null
	},
	"boneclub": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Ground",
		"isNonstandard": null
	},
	"fireblast": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Fire",
		"isNonstandard": null
	},
	"waterfall": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Water",
		"isNonstandard": null
	},
	"clamp": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 35,
		"category": "Physical",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"swift": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Special",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"skullbash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Rock",
		"isNonstandard": null
	},
	"spikecannon": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"isNonstandard": null
	},
	"constrict": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 10,
		"category": "Physical",
		"pp": 35,
		"type": "Normal",
		"isNonstandard": null
	},
	"amnesia": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Psychic",
		"isNonstandard": null
	},
	"kinesis": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Psychic",
		"isNonstandard": null
	},
	"softboiled": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"highjumpkick": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"glare": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"dreameater": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Special",
		"pp": 15,
		"type": "Psychic",
		"isNonstandard": null
	},
	"poisongas": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Poison",
		"isNonstandard": null
	},
	"barrage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Psychic",
		"isNonstandard": null
	},
	"leechlife": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Bug",
		"isNonstandard": null
	},
	"lovelykiss": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"skyattack": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 105,
		"category": "Physical",
		"pp": 5,
		"type": "Flying",
		"isNonstandard": null
	},
	"transform": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"bubble": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 35,
		"category": "Special",
		"pp": 30,
		"type": "Water",
		"isNonstandard": null
	},
	"dizzypunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"spore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Grass",
		"isNonstandard": null
	},
	"flash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"psywave": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 1,
		"category": "Special",
		"pp": 15,
		"type": "Psychic",
		"isNonstandard": null
	},
	"splash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 40,
		"type": "Water",
		"isNonstandard": null
	},
	"acidarmor": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Poison",
		"isNonstandard": null
	},
	"crabhammer": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"explosion": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 250,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"furyswipes": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"bonemerang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 45,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"isNonstandard": null
	},
	"rest": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic",
		"isNonstandard": null
	},
	"rockslide": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Rock",
		"isNonstandard": null
	},
	"hyperfang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"isNonstandard": null
	},
	"sharpen": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"conversion": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal",
		"isNonstandard": null
	},
	"triattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"superfang": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"slash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"substitute": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"struggle": {
		"inherit": true,
		"accuracy": true,
		"basePower": 50,
		"category": "Physical",
		"pp": 1,
		"type": "Normal",
		"isNonstandard": null
	},
	"sketch": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 1,
		"type": "Normal",
		"isNonstandard": null
	},
	"triplekick": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 20,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"thief": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
	},
	"spiderweb": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Bug",
		"isNonstandard": null
	},
	"mindreader": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"nightmare": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Ghost",
		"isNonstandard": null
	},
	"flamewheel": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 25,
		"type": "Fire",
		"isNonstandard": null
	},
	"snore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"curse": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Ghost",
		"isNonstandard": null
	},
	"flail": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"conversion2": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal",
		"isNonstandard": null
	},
	"aeroblast": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 100,
		"category": "Special",
		"pp": 5,
		"type": "Flying",
		"isNonstandard": null
	},
	"cottonspore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Grass",
		"isNonstandard": null
	},
	"reversal": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"isNonstandard": null
	},
	"spite": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Ghost",
		"isNonstandard": null
	},
	"powdersnow": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 25,
		"type": "Ice",
		"isNonstandard": null
	},
	"protect": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"machpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Fighting",
		"isNonstandard": null
	},
	"scaryface": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"faintattack": {
		"inherit": true,
		"accuracy": true,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Dark",
		"isNonstandard": null
	},
	"sweetkiss": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 0,
		"category": "Status",
		"pp": 4,
		"type": "Normal",
		"isNonstandard": null
	},
	"bellydrum": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"sludgebomb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Poison",
		"isNonstandard": null
	},
	"mudslap": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 35,
		"category": "Special",
		"pp": 10,
		"type": "Ground",
		"isNonstandard": null
	},
	"octazooka": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"spikes": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Ground",
		"isNonstandard": null
	},
	"zapcannon": {
		"inherit": true,
		"accuracy": 60,
		"basePower": 110,
		"category": "Special",
		"pp": 5,
		"type": "Electric",
		"isNonstandard": null
	},
	"foresight": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Normal",
		"isNonstandard": null
	},
	"destinybond": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Ghost",
		"isNonstandard": null
	},
	"perishsong": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"icywind": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 55,
		"category": "Special",
		"pp": 15,
		"type": "Ice",
		"isNonstandard": null
	},
	"detect": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fighting",
		"isNonstandard": null
	},
	"bonerush": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 25,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"isNonstandard": null
	},
	"lockon": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"sandstorm": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Rock",
		"isNonstandard": null
	},
	"gigadrain": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Special",
		"pp": 10,
		"type": "Grass",
		"isNonstandard": null
	},
	"endure": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"charm": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fairy",
		"isNonstandard": null
	},
	"rollout": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 30,
		"category": "Physical",
		"pp": 20,
		"type": "Rock",
		"isNonstandard": null
	},
	"falseswipe": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 40,
		"type": "Normal",
		"isNonstandard": null
	},
	"swagger": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"milkdrink": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 4,
		"type": "Normal",
		"isNonstandard": null
	},
	"spark": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 20,
		"type": "Electric",
		"isNonstandard": null
	},
	"furycutter": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"isNonstandard": null
	},
	"steelwing": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 25,
		"type": "Steel",
		"isNonstandard": null
	},
	"meanlook": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"attract": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"sleeptalk": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"healbell": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"return": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"present": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 1,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"frustration": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"safeguard": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 25,
		"type": "Normal",
		"isNonstandard": null
	},
	"painsplit": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"sacredfire": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 100,
		"category": "Physical",
		"pp": 5,
		"type": "Fire",
		"isNonstandard": null
	},
	"magnitude": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 30,
		"type": "Ground",
		"isNonstandard": null
	},
	"dynamicpunch": {
		"inherit": true,
		"accuracy": 60,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"megahorn": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 105,
		"category": "Physical",
		"pp": 10,
		"type": "Bug",
		"isNonstandard": null
	},
	"dragonbreath": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Dragon",
		"isNonstandard": null
	},
	"batonpass": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Normal",
		"isNonstandard": null
	},
	"encore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"pursuit": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Dark",
		"isNonstandard": null
	},
	"rapidspin": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 40,
		"type": "Normal",
		"isNonstandard": null
	},
	"sweetscent": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"irontail": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"isNonstandard": null
	},
	"metalclaw": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 35,
		"type": "Steel",
		"isNonstandard": null
	},
	"vitalthrow": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"morningsun": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"synthesis": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Grass",
		"isNonstandard": null
	},
	"moonlight": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"hiddenpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 15,
		"type": "Normal",
		"isNonstandard": null
	},
	"crosschop": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 5,
		"type": "Fighting",
		"isNonstandard": null
	},
	"twister": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 20,
		"type": "Dragon",
		"isNonstandard": null
	},
	"raindance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"sunnyday": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Fire",
		"isNonstandard": null
	},
	"crunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Dark",
		"isNonstandard": null
	},
	"mirrorcoat": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 20,
		"type": "Psychic",
		"isNonstandard": null
	},
	"psychup": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"extremespeed": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"ancientpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 5,
		"type": "Rock",
		"isNonstandard": null
	},
	"shadowball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 15,
		"type": "Ghost",
		"isNonstandard": null
	},
	"futuresight": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 135,
		"category": "Special",
		"pp": 15,
		"type": "Psychic",
		"isNonstandard": null
	},
	"rocksmash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"isNonstandard": null
	},
	"whirlpool": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 15,
		"type": "Water",
		"isNonstandard": null
	},
	"beatup": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 10,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
	},
	"fakeout": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"uproar": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"stockpile": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"spitup": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"swallow": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"heatwave": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Fire",
		"isNonstandard": null
	},
	"hail": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Ice",
		"isNonstandard": null
	},
	"torment": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Dark",
		"isNonstandard": null
	},
	"flatter": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Dark",
		"isNonstandard": null
	},
	"willowisp": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Fire",
		"isNonstandard": null
	},
	"memento": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
	},
	"facade": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"focuspunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 150,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"isNonstandard": null
	},
	"highhorsepower": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"isNonstandard": null
	},
	"followme": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"naturepower": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"charge": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Electric",
		"isNonstandard": null
	},
	"taunt": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Dark",
		"isNonstandard": null
	},
	"helpinghand": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"trick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"roleplay": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"wish": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Normal",
		"isNonstandard": null
	},
	"assist": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"ingrain": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Grass",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"magiccoat": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Psychic",
		"isNonstandard": null
	},
	"recycle": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"revenge": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"brickbreak": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"isNonstandard": null
	},
	"yawn": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"knockoff": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Dark",
		"isNonstandard": null
	},
	"endeavor": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"eruption": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 150,
		"category": "Special",
		"pp": 5,
		"type": "Fire",
		"isNonstandard": null
	},
	"skillswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"imprison": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"refresh": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"grudge": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Ghost",
		"isNonstandard": null
	},
	"snatch": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
	},
	"secretpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"dive": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"armthrust": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"isNonstandard": null
	},
	"camouflage": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"tailglow": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Bug",
		"isNonstandard": null
	},
	"dazzlinggleam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Fairy",
		"isNonstandard": null
	},
	"moonblast": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 95,
		"category": "Special",
		"pp": 10,
		"type": "Fairy",
		"isNonstandard": null
	},
	"featherdance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Flying",
		"isNonstandard": null
	},
	"teeterdance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"blazekick": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 85,
		"category": "Physical",
		"pp": 10,
		"type": "Fire",
		"isNonstandard": null
	},
	"scorchingsands": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 10,
		"type": "Ground",
		"isNonstandard": null
	},
	"iceball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 30,
		"category": "Physical",
		"pp": 20,
		"type": "Ice",
		"isNonstandard": null
	},
	"needlearm": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"isNonstandard": null
	},
	"slackoff": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"hypervoice": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"poisonfang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Poison",
		"isNonstandard": null
	},
	"crushclaw": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
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
		],
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"meteormash": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 95,
		"category": "Physical",
		"pp": 10,
		"type": "Steel",
		"isNonstandard": null
	},
	"astonish": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 15,
		"type": "Ghost",
		"isNonstandard": null
	},
	"weatherball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"aromatherapy": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Grass",
		"isNonstandard": null
	},
	"faketears": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Dark",
		"isNonstandard": null
	},
	"aircutter": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 55,
		"category": "Special",
		"pp": 25,
		"type": "Flying",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"odorsleuth": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Normal",
		"isNonstandard": null
	},
	"rocktomb": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Rock",
		"isNonstandard": null
	},
	"silverwind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 5,
		"type": "Bug",
		"isNonstandard": null
	},
	"metalsound": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Steel",
		"isNonstandard": null
	},
	"grasswhistle": {
		"inherit": true,
		"accuracy": 45,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Grass",
		"isNonstandard": null
	},
	"tickle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"cosmicpower": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Psychic",
		"isNonstandard": null
	},
	"waterspout": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 150,
		"category": "Special",
		"pp": 5,
		"type": "Water",
		"isNonstandard": null
	},
	"signalbeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Special",
		"pp": 15,
		"type": "Bug",
		"isNonstandard": null
	},
	"shadowpunch": {
		"inherit": true,
		"accuracy": true,
		"basePower": 75,
		"category": "Physical",
		"pp": 20,
		"type": "Ghost",
		"isNonstandard": null
	},
	"extrasensory": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 30,
		"type": "Psychic",
		"isNonstandard": null
	},
	"skyuppercut": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"isNonstandard": null
	},
	"sandtomb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Physical",
		"pp": 15,
		"type": "Ground",
		"isNonstandard": null
	},
	"muddywater": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"bulletseed": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 30,
		"type": "Grass",
		"isNonstandard": null
	},
	"aerialace": {
		"inherit": true,
		"accuracy": true,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Flying",
		"isNonstandard": null
	},
	"iciclespear": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 30,
		"type": "Ice",
		"isNonstandard": null
	},
	"irondefense": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Steel",
		"isNonstandard": null
	},
	"block": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"howl": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"isNonstandard": null
	},
	"dragonclaw": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Dragon",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"bulkup": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fighting",
		"isNonstandard": null
	},
	"bounce": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Flying",
		"isNonstandard": null
	},
	"mudshot": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 55,
		"category": "Special",
		"pp": 15,
		"type": "Ground",
		"isNonstandard": null
	},
	"poisontail": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 25,
		"type": "Poison",
		"isNonstandard": null
	},
	"covet": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 40,
		"type": "Normal",
		"isNonstandard": null
	},
	"volttackle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Electric",
		"isNonstandard": null
	},
	"magicalleaf": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Special",
		"pp": 20,
		"type": "Grass",
		"isNonstandard": null
	},
	"scald": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"calmmind": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Psychic",
		"isNonstandard": null
	},
	"leafblade": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"isNonstandard": null
	},
	"dragondance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Dragon",
		"isNonstandard": null
	},
	"rockblast": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 25,
		"category": "Physical",
		"pp": 10,
		"type": "Rock",
		"isNonstandard": null
	},
	"shockwave": {
		"inherit": true,
		"accuracy": true,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Electric",
		"isNonstandard": null
	},
	"waterpulse": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Water",
		"isNonstandard": null
	},
	"doomdesire": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 135,
		"category": "Special",
		"pp": 10,
		"type": "Steel",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"roost": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Flying",
		"isNonstandard": null
	},
	"gravity": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic",
		"isNonstandard": null
	},
	"playrough": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Fairy",
		"isNonstandard": null
	},
	"hammerarm": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"gyroball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"isNonstandard": null
	},
	"healingwish": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"brine": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"voltswitch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 15,
		"type": "Electric",
		"isNonstandard": null
	},
	"feint": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"pluck": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Flying",
		"isNonstandard": null
	},
	"tailwind": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Flying",
		"isNonstandard": null
	},
	"acupressure": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"metalburst": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Steel",
		"isNonstandard": null
	},
	"uturn": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"isNonstandard": null
	},
	"closecombat": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"payback": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
	},
	"assurance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
	},
	"snarl": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 15,
		"type": "Dark",
		"isNonstandard": null
	},
	"fling": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
	},
	"psychoshift": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"trumpcard": {
		"inherit": true,
		"accuracy": true,
		"basePower": 1,
		"category": "Physical",
		"pp": 2,
		"type": "Normal",
		"isNonstandard": null
	},
	"healblock": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Psychic",
		"isNonstandard": null
	},
	"wringout": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"powertrick": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"gastroacid": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Poison",
		"isNonstandard": null
	},
	"luckychant": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal",
		"isNonstandard": null
	},
	"mefirst": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"copycat": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"isNonstandard": null
	},
	"powerswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"guardswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"punishment": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
	},
	"lastresort": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 120,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"worryseed": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Grass",
		"isNonstandard": null
	},
	"suckerpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
	},
	"toxicspikes": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Poison",
		"isNonstandard": null
	},
	"heartswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"aquaring": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Water",
		"isNonstandard": null
	},
	"magnetrise": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Electric",
		"isNonstandard": null
	},
	"flareblitz": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Fire",
		"isNonstandard": null
	},
	"forcepalm": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"aurasphere": {
		"inherit": true,
		"accuracy": true,
		"basePower": 85,
		"category": "Special",
		"pp": 20,
		"type": "Fighting",
		"isNonstandard": null
	},
	"rockpolish": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Rock",
		"isNonstandard": null
	},
	"poisonjab": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 20,
		"type": "Poison",
		"isNonstandard": null
	},
	"darkpulse": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 15,
		"type": "Dark",
		"isNonstandard": null
	},
	"nightslash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 15,
		"type": "Dark",
		"isNonstandard": null
	},
	"aquatail": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Water",
		"isNonstandard": null
	},
	"seedbomb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"isNonstandard": null
	},
	"airslash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 20,
		"type": "Flying",
		"isNonstandard": null
	},
	"xscissor": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Bug",
		"isNonstandard": null
	},
	"bugbuzz": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Bug",
		"isNonstandard": null
	},
	"dragonpulse": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"isNonstandard": null
	},
	"dragonrush": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Dragon",
		"isNonstandard": null
	},
	"powergem": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 20,
		"type": "Rock",
		"isNonstandard": null
	},
	"drainpunch": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"vacuumwave": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 30,
		"type": "Fighting",
		"isNonstandard": null
	},
	"focusblast": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Fighting",
		"isNonstandard": null
	},
	"energyball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Grass",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"earthpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Ground",
		"isNonstandard": null
	},
	"switcheroo": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Dark",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"nastyplot": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Dark",
		"isNonstandard": null
	},
	"bulletpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Steel",
		"isNonstandard": null
	},
	"avalanche": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Ice",
		"isNonstandard": null
	},
	"iceshard": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Ice",
		"isNonstandard": null
	},
	"shadowclaw": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Ghost",
		"isNonstandard": null
	},
	"thunderfang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Electric",
		"isNonstandard": null
	},
	"icefang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Ice",
		"isNonstandard": null
	},
	"firefang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fire",
		"isNonstandard": null
	},
	"shadowsneak": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Ghost",
		"isNonstandard": null
	},
	"mudbomb": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Ground",
		"isNonstandard": null
	},
	"psychocut": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Psychic",
		"isNonstandard": null
	},
	"zenheadbutt": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 95,
		"category": "Physical",
		"pp": 15,
		"type": "Psychic",
		"isNonstandard": null
	},
	"mirrorshot": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Steel",
		"isNonstandard": null
	},
	"flashcannon": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Steel",
		"isNonstandard": null
	},
	"rockclimb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 20,
		"type": "Rock",
		"isNonstandard": null
	},
	"defog": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Flying",
		"isNonstandard": null
	},
	"trickroom": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"discharge": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 15,
		"type": "Electric",
		"isNonstandard": null
	},
	"lavaplume": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Special",
		"pp": 15,
		"type": "Fire",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"powerwhip": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 110,
		"category": "Physical",
		"pp": 10,
		"type": "Grass",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"crosspoison": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 20,
		"type": "Poison",
		"isNonstandard": null
	},
	"gunkshot": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 110,
		"category": "Physical",
		"pp": 5,
		"type": "Poison",
		"isNonstandard": null
	},
	"ironhead": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"isNonstandard": null
	},
	"magnetbomb": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Steel",
		"isNonstandard": null
	},
	"stoneedge": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Rock",
		"isNonstandard": null
	},
	"captivate": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fairy",
		"isNonstandard": null
	},
	"grassknot": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Special",
		"pp": 20,
		"type": "Grass",
		"isNonstandard": null
	},
	"chatter": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Flying",
		"isNonstandard": null
	},
	"judgment": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
	},
	"bugbite": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"isNonstandard": null
	},
	"chargebeam": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 55,
		"category": "Special",
		"pp": 10,
		"type": "Electric",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"aquajet": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Water",
		"isNonstandard": null
	},
	"attackorder": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Bug",
		"isNonstandard": null
	},
	"defendorder": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Bug",
		"isNonstandard": null
	},
	"healorder": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Bug",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"doublehit": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 35,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"isNonstandard": null
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
		],
		"isNonstandard": null
	},
	"spacialrend": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"isNonstandard": null
	},
	"lunardance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"isNonstandard": null
	},
	"crushgrip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 1,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"isNonstandard": null
	},
	"magmastorm": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Fire",
		"isNonstandard": null
	},
	"darkvoid": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Dark",
		"isNonstandard": null
	},
	"seedflare": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 5,
		"type": "Grass",
		"isNonstandard": null
	},
	"ominouswind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 5,
		"type": "Ghost",
		"isNonstandard": null
	},
	"shadowforce": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 5,
		"type": "Ghost",
		"isNonstandard": null
	}
};
