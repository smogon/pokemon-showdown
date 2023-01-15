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
		"priority": 0,
		"target": "normal"
	},
	"karatechop": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 25,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"doubleslap": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 10,
		"type": "Fairy",
		"priority": 0,
		"target": "normal"
	},
	"cometpunch": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 18,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"poweruppunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 5,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"payday": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"firepunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"icepunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Ice",
		"priority": 0,
		"target": "normal"
	},
	"thunderpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"scratch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 35,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"vicegrip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 55,
		"category": "Physical",
		"pp": 30,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"guillotine": {
		"inherit": true,
		"accuracy": 30,
		"basePower": 0,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"razorwind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"swordsdance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"cut": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 30,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"gust": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 35,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"wingattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 35,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"whirlwind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": -6,
		"target": "normal"
	},
	"fly": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"bind": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 15,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"slam": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 80,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"vinewhip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"stomp": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"doublekick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 30,
		"category": "Physical",
		"pp": 30,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"jumpkick": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 85,
		"category": "Physical",
		"pp": 25,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"rollingkick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"sandattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"headbutt": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"hornattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 25,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"furyattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"horndrill": {
		"inherit": true,
		"accuracy": 30,
		"basePower": 0,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"tackle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 35,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"bodyslam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"wrap": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 35,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"takedown": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			4
		],
		"target": "normal"
	},
	"thrash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"doubleedge": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 105,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"tailwhip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"poisonsting": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 35,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"twineedle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"pinmissile": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"leer": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"bite": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 25,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"growl": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"roar": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": -6,
		"target": "normal"
	},
	"sing": {
		"inherit": true,
		"accuracy": 45,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Fairy",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"supersonic": {
		"inherit": true,
		"accuracy": 50,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"sonicboom": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Special",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"disable": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"acid": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 30,
		"type": "Poison",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"ember": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 25,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"flamethrower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Special",
		"pp": 15,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"mist": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Ice",
		"priority": 0,
		"target": "allySide"
	},
	"watergun": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 25,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"hydropump": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"surf": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 95,
		"category": "Special",
		"pp": 15,
		"type": "Water",
		"priority": 0,
		"target": "allAdjacent"
	},
	"icebeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Ice",
		"priority": 0,
		"target": "normal"
	},
	"blizzard": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Ice",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"psybeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"bubblebeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 20,
		"type": "Water",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"aurorabeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 20,
		"type": "Ice",
		"priority": 0,
		"target": "normal"
	},
	"hyperbeam": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"peck": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Physical",
		"pp": 35,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"drillpeck": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 20,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"submission": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 25,
		"type": "Fighting",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			4
		],
		"target": "normal"
	},
	"lowkick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"counter": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"priority": -5
	},
	"seismictoss": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"strength": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"drainingkiss": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 15,
		"type": "Fairy",
		"priority": 0,
		"target": "normal"
	},
	"megadrain": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 15,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"leechseed": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"growth": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"razorleaf": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 25,
		"type": "Grass",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"solarbeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"poisonpowder": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 35,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"stunspore": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"sleeppowder": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"petaldance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Special",
		"pp": 20,
		"type": "Grass",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"stringshot": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Bug",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"dragonrage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"priority": 0,
		"target": "normal"
	},
	"firespin": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 15,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"thundershock": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 30,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"thunderbolt": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 15,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"thunderwave": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"thunder": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"rockthrow": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 15,
		"type": "Rock",
		"priority": 0,
		"target": "normal"
	},
	"earthquake": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"priority": 0,
		"target": "allAdjacent"
	},
	"fissure": {
		"inherit": true,
		"accuracy": 30,
		"basePower": 0,
		"category": "Physical",
		"pp": 5,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"dig": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"toxic": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"confusion": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 25,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"psychic": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"hypnosis": {
		"inherit": true,
		"accuracy": 60,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"meditate": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"agility": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"quickattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Normal",
		"priority": 1,
		"target": "normal"
	},
	"rage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 20,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"teleport": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"nightshade": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Special",
		"pp": 15,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"mimic": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"screech": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"doubleteam": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"recover": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"harden": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"minimize": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"smokescreen": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"confuseray": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"withdraw": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Water",
		"priority": 0,
		"target": "self"
	},
	"defensecurl": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"barrier": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"lightscreen": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "allySide"
	},
	"haze": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Ice",
		"priority": 0,
		"target": "all"
	},
	"reflect": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "allySide"
	},
	"focusenergy": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"bide": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"priority": 1,
		"target": "self"
	},
	"metronome": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0
	},
	"mirrormove": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Flying",
		"priority": 0
	},
	"selfdestruct": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 200,
		"category": "Physical",
		"pp": 1,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacent"
	},
	"eggbomb": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"lick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Physical",
		"pp": 30,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"smog": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 20,
		"type": "Poison",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"sludge": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Special",
		"pp": 20,
		"type": "Poison",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"boneclub": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"fireblast": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"waterfall": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"clamp": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 35,
		"category": "Physical",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"swift": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Special",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"skullbash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Rock",
		"priority": 0,
		"target": "normal"
	},
	"spikecannon": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"constrict": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 10,
		"category": "Physical",
		"pp": 35,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"amnesia": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"kinesis": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"softboiled": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"highjumpkick": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"glare": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"dreameater": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Special",
		"pp": 15,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"poisongas": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Poison",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"barrage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"leechlife": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"lovelykiss": {
		"inherit": true,
		"accuracy": 75,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"skyattack": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 105,
		"category": "Physical",
		"pp": 5,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"transform": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"bubble": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 35,
		"category": "Special",
		"pp": 30,
		"type": "Water",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"dizzypunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"spore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"flash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"psywave": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 0,
		"category": "Special",
		"pp": 15,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"splash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 40,
		"type": "Water",
		"priority": 0,
		"target": "allAdjacent"
	},
	"acidarmor": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Poison",
		"priority": 0,
		"target": "self"
	},
	"crabhammer": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"explosion": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 250,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacent"
	},
	"furyswipes": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"bonemerang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 45,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"rest": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"rockslide": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Rock",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"hyperfang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"sharpen": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"conversion": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"triattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"superfang": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"slash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"substitute": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"struggle": {
		"inherit": true,
		"accuracy": true,
		"basePower": 50,
		"category": "Physical",
		"pp": 1,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"sketch": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 1,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"triplekick": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 20,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"thief": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"spiderweb": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"mindreader": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"nightmare": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Ghost",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"flamewheel": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 25,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"snore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"curse": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"flail": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"conversion2": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"aeroblast": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 100,
		"category": "Special",
		"pp": 5,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"cottonspore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"reversal": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"spite": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"powdersnow": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 25,
		"type": "Ice",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"protect": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 4,
		"target": "self"
	},
	"machpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Fighting",
		"priority": 1,
		"target": "normal"
	},
	"scaryface": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"faintattack": {
		"inherit": true,
		"accuracy": true,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"sweetkiss": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 0,
		"category": "Status",
		"pp": 4,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"bellydrum": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"sludgebomb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"mudslap": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 35,
		"category": "Special",
		"pp": 10,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"octazooka": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"spikes": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Ground",
		"priority": 0,
		"target": "foeSide"
	},
	"zapcannon": {
		"inherit": true,
		"accuracy": 60,
		"basePower": 110,
		"category": "Special",
		"pp": 5,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"foresight": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"destinybond": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Ghost",
		"priority": 0,
		"target": "self"
	},
	"perishsong": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "all"
	},
	"icywind": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 55,
		"category": "Special",
		"pp": 15,
		"type": "Ice",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"detect": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fighting",
		"priority": 3,
		"target": "self"
	},
	"bonerush": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 25,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"lockon": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"outrage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Dragon",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"sandstorm": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Rock",
		"priority": 0,
		"target": "all"
	},
	"gigadrain": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Special",
		"pp": 10,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"endure": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 3,
		"target": "self"
	},
	"charm": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fairy",
		"priority": 0,
		"target": "normal"
	},
	"rollout": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 30,
		"category": "Physical",
		"pp": 20,
		"type": "Rock",
		"priority": 0,
		"target": "normal"
	},
	"falseswipe": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 40,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"swagger": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"milkdrink": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 4,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"spark": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Physical",
		"pp": 20,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"furycutter": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"steelwing": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 25,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"meanlook": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"attract": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"sleeptalk": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0
	},
	"healbell": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "allySide"
	},
	"return": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"present": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Physical",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"frustration": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"safeguard": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 25,
		"type": "Normal",
		"priority": 0,
		"target": "allySide"
	},
	"painsplit": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"sacredfire": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 100,
		"category": "Physical",
		"pp": 5,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"magnitude": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 30,
		"type": "Ground",
		"priority": 0,
		"target": "allAdjacent"
	},
	"dynamicpunch": {
		"inherit": true,
		"accuracy": 60,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"megahorn": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 105,
		"category": "Physical",
		"pp": 10,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"dragonbreath": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Dragon",
		"priority": 0,
		"target": "normal"
	},
	"batonpass": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"encore": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"pursuit": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"rapidspin": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 40,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"sweetscent": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"irontail": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"metalclaw": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 35,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"vitalthrow": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": -1,
		"target": "normal"
	},
	"morningsun": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"synthesis": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Grass",
		"priority": 0,
		"target": "self"
	},
	"moonlight": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"hiddenpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 15,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"crosschop": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 5,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"twister": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 20,
		"type": "Dragon",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"raindance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "all"
	},
	"sunnyday": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Fire",
		"priority": 0,
		"target": "all"
	},
	"crunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"mirrorcoat": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Special",
		"pp": 20,
		"type": "Psychic",
		"priority": -5
	},
	"psychup": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"extremespeed": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"priority": 2,
		"target": "normal"
	},
	"ancientpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 5,
		"type": "Rock",
		"priority": 0,
		"target": "normal"
	},
	"shadowball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 15,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"futuresight": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 135,
		"category": "Special",
		"pp": 15,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"rocksmash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"whirlpool": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Special",
		"pp": 15,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"beatup": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 10,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"fakeout": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"priority": 3,
		"target": "normal"
	},
	"uproar": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacent"
	},
	"stockpile": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"spitup": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"swallow": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"heatwave": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Fire",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"hail": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Ice",
		"priority": 0,
		"weather": "snow",
		"target": "all"
	},
	"torment": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"flatter": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"willowisp": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"memento": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"facade": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"focuspunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 150,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"priority": -3,
		"target": "normal"
	},
	"highhorsepower": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"followme": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 2,
		"target": "self"
	},
	"naturepower": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0
	},
	"charge": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Electric",
		"priority": 0,
		"target": "self"
	},
	"taunt": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"helpinghand": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 5
	},
	"trick": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"roleplay": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"wish": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"assist": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0
	},
	"ingrain": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Grass",
		"priority": 0,
		"target": "self"
	},
	"superpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"magiccoat": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Psychic",
		"priority": 4
	},
	"recycle": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"revenge": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"brickbreak": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"yawn": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"knockoff": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"endeavor": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"eruption": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 150,
		"category": "Special",
		"pp": 5,
		"type": "Fire",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"skillswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"imprison": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"refresh": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"grudge": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Ghost",
		"priority": 0,
		"target": "self"
	},
	"snatch": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Dark",
		"priority": 4
	},
	"secretpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"dive": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"armthrust": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 20,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"camouflage": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"tailglow": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Bug",
		"priority": 0,
		"target": "self"
	},
	"dazzlinggleam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Fairy",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"moonblast": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 95,
		"category": "Special",
		"pp": 10,
		"type": "Fairy",
		"priority": 0,
		"target": "normal"
	},
	"featherdance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"teeterdance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacent"
	},
	"blazekick": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 85,
		"category": "Physical",
		"pp": 10,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"scorchingsands": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 10,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"iceball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 30,
		"category": "Physical",
		"pp": 20,
		"type": "Ice",
		"priority": 0,
		"target": "normal"
	},
	"needlearm": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"slackoff": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "self"
	},
	"hypervoice": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"poisonfang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"crushclaw": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"blastburn": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Fire",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"hydrocannon": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Water",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"meteormash": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 95,
		"category": "Physical",
		"pp": 10,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"astonish": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 15,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"weatherball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"aromatherapy": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Grass",
		"priority": 0,
		"target": "allySide"
	},
	"faketears": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"aircutter": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 55,
		"category": "Special",
		"pp": 25,
		"type": "Flying",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"overheat": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Fire",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"odorsleuth": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 40,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"rocktomb": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Rock",
		"priority": 0,
		"target": "normal"
	},
	"silverwind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 5,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"metalsound": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Steel",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"grasswhistle": {
		"inherit": true,
		"accuracy": 45,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Grass",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"tickle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"cosmicpower": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"waterspout": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 150,
		"category": "Special",
		"pp": 5,
		"type": "Water",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"signalbeam": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 75,
		"category": "Special",
		"pp": 15,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"shadowpunch": {
		"inherit": true,
		"accuracy": true,
		"basePower": 75,
		"category": "Physical",
		"pp": 20,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"extrasensory": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 30,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"skyuppercut": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"sandtomb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 45,
		"category": "Physical",
		"pp": 15,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"muddywater": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"bulletseed": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 30,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"aerialace": {
		"inherit": true,
		"accuracy": true,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"iciclespear": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"pp": 30,
		"type": "Ice",
		"priority": 0,
		"target": "normal"
	},
	"irondefense": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Steel",
		"priority": 0,
		"target": "self"
	},
	"block": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"howl": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Normal",
		"priority": 0,
		"target": "allySide"
	},
	"dragonclaw": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Dragon",
		"priority": 0,
		"target": "normal"
	},
	"frenzyplant": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Grass",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"bulkup": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fighting",
		"priority": 0,
		"target": "self"
	},
	"bounce": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"mudshot": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 55,
		"category": "Special",
		"pp": 15,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"poisontail": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 25,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"covet": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 40,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"volttackle": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"magicalleaf": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Special",
		"pp": 20,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"scald": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"calmmind": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"leafblade": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"dragondance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Dragon",
		"priority": 0,
		"target": "self"
	},
	"rockblast": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 25,
		"category": "Physical",
		"pp": 10,
		"type": "Rock",
		"priority": 0,
		"target": "normal"
	},
	"shockwave": {
		"inherit": true,
		"accuracy": true,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"waterpulse": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"doomdesire": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 135,
		"category": "Special",
		"pp": 10,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"psychoboost": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"roost": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Flying",
		"priority": 0,
		"target": "self"
	},
	"gravity": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic",
		"priority": 0,
		"target": "all"
	},
	"playrough": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Fairy",
		"priority": 0,
		"target": "normal"
	},
	"hammerarm": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"gyroball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"healingwish": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"brine": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"voltswitch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Special",
		"pp": 15,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"feint": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"priority": 2,
		"target": "normal"
	},
	"pluck": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"tailwind": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Flying",
		"priority": 0,
		"target": "allySide"
	},
	"acupressure": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Normal",
		"priority": 0
	},
	"metalburst": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 10,
		"type": "Steel",
		"priority": 0
	},
	"uturn": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"closecombat": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"payback": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"assurance": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 50,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"snarl": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 65,
		"category": "Special",
		"pp": 15,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"fling": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"psychoshift": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"trumpcard": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Physical",
		"pp": 2,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"healblock": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Psychic",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"wringout": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Special",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"powertrick": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"gastroacid": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"luckychant": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 30,
		"type": "Normal",
		"priority": 0,
		"target": "allySide"
	},
	"mefirst": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0
	},
	"copycat": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Normal",
		"priority": 0
	},
	"powerswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"guardswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"punishment": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"lastresort": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 120,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"worryseed": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"suckerpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 10,
		"type": "Dark",
		"priority": 1,
		"target": "normal"
	},
	"toxicspikes": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Poison",
		"priority": 0,
		"target": "foeSide"
	},
	"heartswap": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"aquaring": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Water",
		"priority": 0,
		"target": "self"
	},
	"magnetrise": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Electric",
		"priority": 0,
		"target": "self"
	},
	"flareblitz": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"forcepalm": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"aurasphere": {
		"inherit": true,
		"accuracy": true,
		"basePower": 85,
		"category": "Special",
		"pp": 20,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"rockpolish": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 20,
		"type": "Rock",
		"priority": 0,
		"target": "self"
	},
	"poisonjab": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 20,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"darkpulse": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 15,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"nightslash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 15,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"aquatail": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Water",
		"priority": 0,
		"target": "normal"
	},
	"seedbomb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"airslash": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 20,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"xscissor": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"bugbuzz": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"dragonpulse": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"priority": 0,
		"target": "normal"
	},
	"dragonrush": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Physical",
		"pp": 10,
		"type": "Dragon",
		"priority": 0,
		"target": "normal"
	},
	"powergem": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 20,
		"type": "Rock",
		"priority": 0,
		"target": "normal"
	},
	"drainpunch": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"vacuumwave": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Special",
		"pp": 30,
		"type": "Fighting",
		"priority": 1,
		"target": "normal"
	},
	"focusblast": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Fighting",
		"priority": 0,
		"target": "normal"
	},
	"energyball": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"bravebird": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Flying",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"earthpower": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"switcheroo": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Dark",
		"priority": 0,
		"target": "normal"
	},
	"gigaimpact": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"nastyplot": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 2,
		"type": "Dark",
		"priority": 0,
		"target": "self"
	},
	"bulletpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Steel",
		"priority": 1,
		"target": "normal"
	},
	"avalanche": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 10,
		"type": "Ice",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"iceshard": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Ice",
		"priority": 1,
		"target": "normal"
	},
	"shadowclaw": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Physical",
		"pp": 15,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"thunderfang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"icefang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Ice",
		"priority": 0,
		"target": "normal"
	},
	"firefang": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 75,
		"category": "Physical",
		"pp": 15,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"shadowsneak": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 30,
		"type": "Ghost",
		"priority": 1,
		"target": "normal"
	},
	"mudbomb": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Ground",
		"priority": 0,
		"target": "normal"
	},
	"psychocut": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"zenheadbutt": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 95,
		"category": "Physical",
		"pp": 15,
		"type": "Psychic",
		"priority": 0,
		"target": "normal"
	},
	"mirrorshot": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 65,
		"category": "Special",
		"pp": 10,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"flashcannon": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Special",
		"pp": 10,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"rockclimb": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 20,
		"type": "Rock",
		"priority": 0,
		"target": "normal"
	},
	"defog": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 15,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"trickroom": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 5,
		"type": "Psychic",
		"priority": -7,
		"target": "all"
	},
	"dracometeor": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"discharge": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 80,
		"category": "Special",
		"pp": 15,
		"type": "Electric",
		"priority": 0,
		"target": "allAdjacent"
	},
	"lavaplume": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Special",
		"pp": 15,
		"type": "Fire",
		"priority": 0,
		"target": "allAdjacent"
	},
	"leafstorm": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Grass",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"powerwhip": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 110,
		"category": "Physical",
		"pp": 10,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"rockwrecker": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Physical",
		"pp": 5,
		"type": "Rock",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"crosspoison": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 20,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"gunkshot": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 110,
		"category": "Physical",
		"pp": 5,
		"type": "Poison",
		"priority": 0,
		"target": "normal"
	},
	"ironhead": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 85,
		"category": "Physical",
		"pp": 15,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"magnetbomb": {
		"inherit": true,
		"accuracy": true,
		"basePower": 70,
		"category": "Physical",
		"pp": 20,
		"type": "Steel",
		"priority": 0,
		"target": "normal"
	},
	"stoneedge": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 90,
		"category": "Physical",
		"pp": 10,
		"type": "Rock",
		"priority": 0,
		"target": "normal"
	},
	"captivate": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Fairy",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"grassknot": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Special",
		"pp": 20,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"chatter": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 20,
		"type": "Flying",
		"priority": 0,
		"target": "normal"
	},
	"judgment": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Special",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"bugbite": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Physical",
		"pp": 20,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"chargebeam": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 55,
		"category": "Special",
		"pp": 10,
		"type": "Electric",
		"priority": 0,
		"target": "normal"
	},
	"woodhammer": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 15,
		"type": "Grass",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"aquajet": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 40,
		"category": "Physical",
		"pp": 20,
		"type": "Water",
		"priority": 1,
		"target": "normal"
	},
	"attackorder": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 90,
		"category": "Physical",
		"pp": 15,
		"type": "Bug",
		"priority": 0,
		"target": "normal"
	},
	"defendorder": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Bug",
		"priority": 0,
		"target": "self"
	},
	"healorder": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Bug",
		"priority": 0,
		"target": "self"
	},
	"headsmash": {
		"inherit": true,
		"accuracy": 80,
		"basePower": 120,
		"category": "Physical",
		"pp": 5,
		"type": "Rock",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			2
		],
		"target": "normal"
	},
	"doublehit": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 35,
		"category": "Physical",
		"pp": 10,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"roaroftime": {
		"inherit": true,
		"accuracy": 90,
		"basePower": 120,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"priority": 0,
		"self": {},
		"recoil": [
			1,
			3
		],
		"target": "normal"
	},
	"spacialrend": {
		"inherit": true,
		"accuracy": 95,
		"basePower": 110,
		"category": "Special",
		"pp": 10,
		"type": "Dragon",
		"priority": 0,
		"target": "normal"
	},
	"lunardance": {
		"inherit": true,
		"accuracy": true,
		"basePower": 0,
		"category": "Status",
		"pp": 10,
		"type": "Psychic",
		"priority": 0,
		"target": "self"
	},
	"crushgrip": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 0,
		"category": "Physical",
		"pp": 5,
		"type": "Normal",
		"priority": 0,
		"target": "normal"
	},
	"magmastorm": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 120,
		"category": "Special",
		"pp": 5,
		"type": "Fire",
		"priority": 0,
		"target": "normal"
	},
	"darkvoid": {
		"inherit": true,
		"accuracy": 70,
		"basePower": 0,
		"category": "Status",
		"pp": 3,
		"type": "Dark",
		"priority": 0,
		"target": "allAdjacentFoes"
	},
	"seedflare": {
		"inherit": true,
		"accuracy": 85,
		"basePower": 100,
		"category": "Special",
		"pp": 5,
		"type": "Grass",
		"priority": 0,
		"target": "normal"
	},
	"ominouswind": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 60,
		"category": "Special",
		"pp": 5,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	},
	"shadowforce": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 100,
		"category": "Physical",
		"pp": 5,
		"type": "Ghost",
		"priority": 0,
		"target": "normal"
	}
};
