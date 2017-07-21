'use strict';

exports.BattleMovedex = {
	"bubble": {
		id: "bubble",
		name: "Bubble",
		basePower: 6,
		category: "Special",
		secondary: false,
		priority: 0,
		target: "any",
		pp: 40,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Bubble');
		},
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bubble", target);
		},
		accuracy: 100,
		type: "Ice",
	},
	"firetower": {
		id: "firetower",
		name: "Fire Tower",
		basePower: 155,
		category: "Physical",
		secondary: {
			chance: 25,
			volatileStatus: "flinch",
		},
		priority: 0,
		target: "any",
		pp: 20,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Inferno", target);
			this.add('-anim', source, "Precipice Blades", target);
		},
		accuracy: 100,
		type: "Fire",
	},
	"prominencebeam": {
		id: "prominencebeam",
		name: "Prominence Beam",
		basePower: 444,
		category: "Special",
		secondary: {
			self: {
				chance: 20,
				boosts: {
					spa: -2,
					atk: -2,
				},
			},
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flamethrower", target);
		},
		priority: 0,
		target: "any",
		pp: 5,
		flags: {protect: 1, distance: 1},
		accuracy: 100,
		type: "Fire",
	},
	"spitfire": {
		id: "spitfire",
		name: "Spit Fire",
		basePower: 66,
		category: "Special",
		secondary: false,
		priority: 0,
		target: "any",
		pp: 25,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flamethrower", target);
		},
		accuracy: 100,
		type: "Fire",
	},
	"redinferno": {
		id: "redinferno",
		name: "Red Inferno",
		basePower: 210,
		category: "Special",
		secondary: false,
		priority: 0,
		target: "allAdjacentFoes",
		pp: 15,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fire Blast", target);
		},
		accuracy: 100,
		type: "Fire",
	},
	"magmabomb": {
		id: "magmabomb",
		name: "Magma Bomb",
		basePower: 279,
		category: "Physical",
		secondary: {
			chance: 25,
			volatileStatus: "confusion",
		},
		priority: 0,
		target: "any",
		pp: 15,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Egg Bomb", target);
			this.add('-anim', source, "Sunny Day", target);
		},
		accuracy: 100,
		type: "Fire",
	},
	"heatlaser": {
		id: "heatlaser",
		name: "Heat Laser",
		basePower: 84,
		category: "Special",
		secondary: {
			chance: 50,
			boosts: {
				spa: -3,
				atk: -3,
			},
		},
		priority: 0,
		target: "allAdjacent",
		pp: 30,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Roar", target);
			this.add('-anim', source, "Sunny Day", target);
		},
		accuracy: 100,
		type: "Fire",
	},
	"infinityburn": {
		id: "infinityburn",
		name: "Infinity Burn",
		basePower: 488,
		accuracy: 100,
		pp: 5,
		target: "any",
		priority: 0,
		secondary: {
			chance: 5,
			volatileStatus: "flinch",
		},
		category: "Physical",
		flags: {protect: 1, mirror: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Inferno", target);
			this.add('-anim', source, "Precipice Blades", target);
		},
		type: "Fire",
	},
	"meltdown": {
		id: "meltdown",
		name: "Meltdown",
		basePower: 400,
		accuracy: 100,
		pp: 5,
		target: "allAdjacent",
		priority: 0,
		secondary: {
			chance: 10,
			volatileStatus: "flinch",
		},
		category: "Special",
		flags: {protect: 1, mirror: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sunny Day", target);
			this.add('-anim', source, "Lava Plume", target);
		},
		type: "Fire",
	},
	"tremar": {
		id: "tremar",
		name: "Tremar",
		basePower: 178,
		accuracy: 85,
		pp: 20,
		target: "allAdjacent",
		priority: 0,
		secondary: false,
		category: "Physical",
		flags: {protect: 1, mirror: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ancient Power", target);
		},
		type: "Battle",
	},
	"musclecharge": {
		id: "musclecharge",
		name: "Muscle Charge",
		basePower: 0,
		accuracy: 100,
		pp: 25,
		boosts: {
			atk: 2,
			spa: 2,
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Charge", target);
		},
		target: "self",
		priority: 0,
		secondary: false,
		category: "Status",
		flags: {snatch: 1},
		type: "Battle",
	},
	"warcry": {
		id: "warcry",
		name: "War Cry",
		basePower: 0,
		secondary: false,
		category: "Status",
		pp: 30,
		accuracy: 100,
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
			spe: 1,
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dragon Dance", source);
		},
		priority: 0,
		flags: {snatch: 1},
		target: "self",
		type: "Battle",
	},
	"sonicjab": {
		id: "sonicjab",
		name: "Sonic Jab",
		basePower: 52,
		category: "Physical",
		accuracy: 100,
		secondary: false,
		priority: 0,
		flags: {protect: 1, contact: 1, punch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dizzy Punch", target);
		},
		pp: 40,
		target: "normal",
		type: "Battle",
	},
	"dynamitekick": {
		id: "dynamitekick",
		name: "Dynamite Kick",
		basePower: 193,
		accuracy: 100,
		pp: 5,
		category: "Special",
		secondary: {
			chance: 20,
			volatileStatus: "flinch",
		},
		priority: 0,
		flags: {protect: 1, contact: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Mega Kick", target);
		},
		target: "normal",
		type: "Battle",
	},
	"counter": {
		id: "counter",
		name: "Counter",
		basePower: 285,
		secondary: {
			chance: 30,
			volatileStatus: "confusion",
		},
		damageCallback: function (pokemon) {
			if (!pokemon.volatiles['counter']) return 0;
			return pokemon.volatiles['counter'].damage || 1;
		},
		category: "Physical",
		pp: 20,
		priority: -5,
		flags: {protect: 1, contact: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Headbutt", target);
		},
		beforeTurnCallback: function (pokemon) {
			pokemon.addVolatile('counter');
		},
		onTryHit: function (target, source, move) {
			if (!source.volatiles['counter']) return false;
			if (source.volatiles['counter'].position === null) return false;
		},
		effect: {
			duration: 1,
			noCopy: true,
			onStart: function (target, source, source2, move) {
				this.effectData.position = null;
				this.effectData.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget: function (target, source, source2) {
				if (source !== this.effectData.target) return;
				return source.side.foe.active[this.effectData.position];
			},
			onDamagePriority: -101,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && source.side !== target.side && this.getCategory(effect) === 'Physical') {
					this.effectData.position = source.position;
					this.effectData.damage = 2 * damage;
				}
			},
		},
		target: "normal",
		type: "Battle",
	},
	"megatonpunch": {
		id: "megatonpunch",
		name: "Megaton Punch",
		basePower: 320,
		category: "Physical",
		accuracy: 100,
		pp: 10,
		secondary: {
			chance: 15,
			volatileStatus: "flinch",
		},
		flags: {protect: 1, contact: 1, punch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dizzy Punch", target);
		},
		priority: 0,
		target: "normal",
		type: "Battle",
	},
	"busterdrive": {
		id: "busterdrive",
		name: "Buster Drive",
		basePower: 500,
		secondary: {
			chance: 5,
			volatileStatus: "confusion",
		},
		category: "Physical",
		pp: 5,
		accuracy: 100,
		flags: {protect: 1, contact: 1, distance: 1, punch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fire Punch", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"thunderjustice": {
		id: "thunderjustice",
		name: "Thunder Justice",
		basePower: 586,
		accuracy: true,
		pp: 5,
		category: "Special",
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Thunder", target);
		},
		secondary: {
			chance: 5,
			volatileStatus: "flinch",
		},
		type: "Air",
		target: "any",
	},
	"spinningshot": {
		id: "spinningshot",
		name: "Spinning Shot",
		basePower: 389,
		pp: 10,
		accuracy: 100,
		secondary: false,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Air Cutter", target);
		},
		category: "Special",
		type: "Air",
		target: "allAdjacent",
	},
	"electriccloud": {
		id: "electriccloud",
		name: "Electric Cloud",
		basePower: 120,
		category: "Special",
		secondary: {
			chance: 40,
			volatileStatus: "flinch",
		},
		accuracy: true,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Thundershock", target);
		},
		priority: 0,
		pp: 20,
		type: "Air",
		target: "any",
	},
	"megalospark": {
		id: "megalospark",
		name: "Megalo Spark",
		basePower: 382,
		secondary: {
			chance: 15,
			volatileStatus: "flinch",
		},
		accuracy: 100,
		pp: 15,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Shock Wave", target);
		},
		category: "Physical",
		target: "any",
		type: "Air",
	},
	"staticelect": {
		id: "staticelect",
		name: "Static Elect",
		basePower: 85,
		accuracy: 100,
		pp: 40,
		secondary: {
			chance: 50,
			volatileStatus: "flinch",
		},
		priority: 0,
		flags: {protect: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Thunder Punch", target);
		},
		category: "Physical",
		target: "normal",
		type: "Air",
	},
	"windcutter": {
		id: "windcutter",
		name: "Wind Cutter",
		basePower: 178,
		accuracy: 100,
		category: "Special",
		secondary: false,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Gust", target);
		},
		pp: 15,
		target: "any",
		type: "Air",
	},
	"confusedstorm": {
		id: "confusedstorm",
		name: "Confused Storm",
		basePower: 225,
		secondary: {
			self: {
				volatileStatus: "confusion",
			},
			chance: 20,
			volatileStatus: "confusion",
		},
		accuracy: 100,
		category: "Special",
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Prismatic Laser", target);
		},
		pp: 10,
		target: "allAdjacent",
		type: "Air",
	},
	"hurricane": {
		id: "hurricane",
		name: "Hurricane",
		basePower: 366,
		secondary: {
			chance: 15,
			volatileStatus: "confusion",
		},
		category: "Special",
		pp: 10,
		accuracy: 100,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hurricane", target);
		},
		target: "allAdjacent",
		type: "Air",
	},
	"poisonpowder": {
		id: "poisonpowder",
		name: "Poison Powder",
		basePower: 117,
		pp: 15,
		category: "Special",
		secondary: {
			chance: 50,
			status: "psn",
		},
		accuracy: 100,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Powder", target);
		},
		target: "allAdjacent",
		type: "Earth",
	},
	"bug": {
		id: "bug",
		name: "Bug",
		basePower: 500,
		accuracy: 100,
		secondary: {
			chance: 5,
			boosts: {
				atk: -3,
				spa: -3,
			},
		},
		category: "Physical",
		pp: 5,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Magnet Bomb", target);
		},
		target: "any",
		type: "Earth",
	},
	"massmorph": {
		id: "massmorph",
		name: "Mass Morph",
		basePower: 0,
		category: "Status",
		boosts: {
			atk: 1,
			def: 2,
			spa: 1,
			spd: 1,
			spe: 1,
			accuracy: 1,
		},
		accuracy: 100,
		pp: 40,
		priority: 0,
		secondary: false,
		flags: {snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Cotton Guard", source);
		},
		target: "self",
		type: "Earth",
	},
	"insectplague": {
		id: "insectplague",
		name: "Insect Plague",
		basePower: 180,
		accuracy: 100,
		category: "Special",
		pp: 10,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Toxic", target);
		},
		secondary: {
			chance: 40,
			status: "psn",
		},
		target: "any",
		type: "Earth",
	},
	"charmperfume": {
		id: "charmperfume",
		name: "Charm Perfume",
		basePower: 180,
		secondary: {
			chance: 40,
			status: "psn",
		},
		category: "Special",
		pp: 15,
		accuracy: 100,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Gas", target);
		},
		target: "allAdjacent",
		type: "Earth",
	},
	"poisonclaw": {
		id: "poisonclaw",
		name: "Poison Claw",
		basePower: 62,
		category: "Physical",
		secondary: {
			chance: 50,
			status: "psn",
		},
		pp: 40,
		accuracy: 100,
		priority: 0,
		flags: {protect: 1, contact: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Jab", target);
		},
		target: "normal",
		type: "Earth",
	},
	"dangersting": {
		id: "dangersting",
		name: "Danger Sting",
		basePower: 157,
		accuracy: 100,
		category: "Physical",
		pp: 15,
		secondary: {
			chance: 35,
			boosts: {
				atk: -3,
				spa: -3,
			},
		},
		priority: 0,
		flags: {protect: 1, contact: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Sting", target);
		},
		target: "normal",
		type: "Earth",
	},
	"greentrap": {
		id: "greentrap",
		name: "Green Trap",
		basePower: 310,
		accuracy: 100,
		pp: 10,
		secondary: {
			chance: 15,
			volatileStatus: "flinch",
		},
		category: "Physical",
		flags: {protect: 1, contact: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Grass Knot", target);
		},
		priority: 0,
		target: "any",
		type: "Earth",
	},
	"gigafreeze": {
		id: "gigafreeze",
		name: "Giga Freeze",
		basePower: 264,
		category: "Physical",
		pp: 10,
		secondary: {
			chance: 20,
			volatileStatus: "flinch",
		},
		accuracy: 100,
		flags: {protect: 1, contact: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Frost Breath", target);
		},
		priority: 0,
		target: "allAdjacentFoes",
		type: "Ice",
	},
	"icestatue": {
		id: "icestatue",
		name: "Ice Statue",
		basePower: 424,
		accuracy: 100,
		pp: 10,
		secondary: {
			chance: 10,
			volatileStatus: "flinch",
		},
		category: "Physical",
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Avalanche", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"winterblast": {
		id: "winterblast",
		name: "Winter Blast",
		basePower: 120,
		accuracy: 100,
		secondary: {
			chance: 30,
			volatileStatus: "flinch",
		},
		category: "Special",
		pp: 10,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Blizzard", target);
		},
		target: "allAdjacent",
		type: "Ice",
	},
	"iceneedle": {
		id: "iceneedle",
		name: "Ice Needle",
		accuracy: 100,
		basePower: 126,
		secondary: {
			chance: 35,
			volatileStatus: "flinch",
		},
		category: "Physical",
		pp: 20,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ice Shard", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"waterblit": {
		id: "waterblit",
		name: "Water Blit",
		basePower: 211,
		accuracy: 100,
		category: "Special",
		pp: 20,
		secondary: false,
		priority: 0,
		flags: {protect: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aqua Ring", target);
		},
		target: "normal",
		type: "Ice",
	},
	"aquamagic": {
		id: "aquamagic",
		name: "Aqua Magic",
		basePower: 0,
		accuracy: 100,
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
			spe: 1,
			accuracy: 1,
		},
		pp: 20,
		secondary: false,
		priority: 0,
		flags: {snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bubble", source);
		},
		target: "self",
		type: "Ice",
	},
	"aurorafreeze": {
		id: "aurorafreeze",
		name: "Aurora Freeze",
		basePower: 430,
		accuracy: 100,
		category: "Special",
		secondary: {
			chance: 10,
			boosts: {
				atk: -3,
				spa: -3,
			},
		},
		pp: 10,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		priority: 0,
		flags: {protect: 1, charge: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Moonlight", target);
			this.add('-anim', source, "Power Gem", target);
		},
		target: "allAdjacent",
		type: "Ice",
	},
	"teardrop": {
		id: "teardrop",
		name: "Tear Drop",
		basePower: 60,
		accuracy: 90,
		secondary: {
			chance: 50,
			boosts: {
				atk: -3,
				spa: -3,
			},
		},
		pp: 40,
		category: "Special",
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Water Pulse", target);
		},
		target: "any",
		type: "Ice",
	},
	"powercrane": {
		id: "powercrane",
		name: "Power Crane",
		basePower: 226,
		accuracy: 100,
		secondary: false,
		category: "Physical",
		pp: 15,
		priority: 0,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Metal Claw", target);
		},
		target: "any",
		type: "Mech",
	},
	"allrangebeam": {
		id: "allrangebeam",
		name: "All-Range Beam",
		basePower: 573,
		pp: 5,
		accuracy: 100,
		category: "Special",
		priority: 0,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Gear Up", target);
			this.add('-anim', source, "Hyper Beam", target);
		},
		target: "allAdjacent",
		type: "Mech",
	},
	"metalsprinter": {
		id: "metalsprinter",
		name: "Metal Sprinter",
		basePower: 150,
		accuracy: 100,
		category: "Physical",
		secondary: false,
		pp: 10,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Metal Burst", target);
		},
		priority: 0,
		target: "allAdjacent",
		type: "Mech",
	},
	"pulselazer": {
		id: "pulselazer",
		name: "Pulse Lazer",
		basePower: 389,
		accuracy: 100,
		category: "Special",
		pp: 10,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flash Cannon", target);
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
	"deleteprogram": {
		id: "deleteprogram",
		name: "Delete Program",
		basePower: 430,
		accuracy: 100,
		category: "Special",
		pp: 10,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Flash Cannon", target);
		},
		secondary: {
			chance: 10,
			boosts: {
				atk: -3,
				spa: -3,
			},
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
	"dgdimension": {
		id: "dgdimension",
		name: "DG Dimension",
		basePower: 722,
		category: "Special",
		pp: 5,
		accuracy: 100,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Moonlight", target);
			this.add('-anim', source, "Sonic Boom", target);
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
	"fullpotential": {
		id: "fullpotential",
		name: "Full Potential",
		basePower: 0,
		accuracy: 100,
		category: "Status",
		pp: 20,
		boosts: {
			atk: 2,
			def: 2,
			spa: 2,
			spd: 2,
			spe: 2,
		},
		secondary: false,
		flags: {snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Gear Grind", target);
		},
		priority: 0,
		target: "self",
		type: "Mech",
	},
	"reverseprogram": {
		id: "reverseprogram",
		name: "Reverse Program",
		basePower: 256,
		accuracy: 100,
		category: "Special",
		pp: 5,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Lock-On", target);
			this.add('-anim', source, "Wake-Up Slap", target);
		},
		secondary: {
			chance: 20,
			boosts: {
				atk: -3,
				spa: -3,
			},
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
	"orderspray": {
		id: "orderspray",
		name: "Order Spray",
		basePower: 88,
		category: "Special",
		pp: 40,
		secondary: {
			chance: 50,
			volatileStatus: "flinch",
		},
		accuracy: 100,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Gas", target);
		},
		priority: 0,
		target: "any",
		type: "Filth",
	},
	"poopspdtoss": {
		id: "poopspdtoss",
		name: "Poop Spd Toss",
		basePower: 122,
		category: "Physical",
		pp: 20,
		secondary: {
			chance: 30,
			status: "psn",
		},
		accuracy: 100,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Throw", target);
		},
		priority: 0,
		target: "any",
		type: "Filth",
	},
	"bigpooptoss": {
		id: "bigpooptoss",
		name: "Big Poop Toss",
		basePower: 211,
		category: "Physical",
		pp: 15,
		secondary: {
			chance: 30,
			volatileStatus: "confusion",
		},
		accuracy: 100,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Wrecker", target);
		},
		priority: 0,
		target: "any",
		type: "Filth",
	},
	"bigrndtoss": {
		id: "bigrndtoss",
		name: "Big Rnd Toss",
		basePower: 211,
		category: "Physical",
		pp: 5,
		secondary: {
			chance: 30,
			volatileStatus: "confusion",
		},
		accuracy: 100,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Tomb", target);
		},
		priority: 0,
		target: "allAdjacentFoes",
		type: "Filth",
	},
	"pooprndtoss": {
		id: "pooprndtoss",
		name: "Poop RND Toss",
		basePower: 75,
		category: "Physical",
		pp: 15,
		secondary: {
			chance: 40,
			status: "psn",
		},
		accuracy: 100,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Slide", target);
		},
		priority: 0,
		target: "allAdjacent",
		type: "Filth",
	},
	"rndspdtoss": {
		id: "rndspdtoss",
		name: "Rnd Spd Toss",
		basePower: 122,
		category: "Physical",
		pp: 10,
		secondary: {
			chance: 30,
			status: "psn",
		},
		accuracy: 100,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rock Blast", target);
		},
		priority: 0,
		target: "allAdjacent",
		type: "Filth",
	},
	"horizontalkick": {
		id: "horizontalkick",
		name: "Horizontal Kick",
		basePower: 53,
		category: "Special",
		pp: 5,
		accuracy: 100,
		secondary: false,
		flags: {protect: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Gas", target);
		},
		priority: 0,
		target: "normal",
		type: "Filth",
	},
	"ultpoophell": {
		id: "ultpoophell",
		name: "Ult Poop Hell",
		basePower: 333,
		category: "Physical",
		pp: 5,
		accuracy: 100,
		flags: {protect: 1, distance: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Stone Edge", target);
		},
		secondary: {
			chance: 10,
			boosts: {
				atk: -3,
				spa: -3,
			},
		},
		priority: 0,
		target: "allAdjacent",
		type: "Filth",
	},
	//Health Items

	//Small Recovery
	smallrecovery: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "smallrecovery",
		isNonstandard: true,
		name: "Small Recovery",
		pp: 0.625,
		priority: 0,
		flags: {heal: 1, snatch: 1, distance: 1},
		secondary: false,
		heal: [1, 4],
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Medium Recovery
	mediumrecovery: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "mediumrecovery",
		isNonstandard: true,
		name: "Medium Recovery",
		pp: 0.625,
		priority: 0,
		flags: {heal: 1, snatch: 1, distance: 1},
		secondary: false,
		heal: [1, 3],
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Large Recovery
	largerecovery: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "largerecovery",
		isNonstandard: true,
		name: "Large Recovery",
		pp: 0.625,
		priority: 0,
		flags: {heal: 1, snatch: 1, distance: 1},
		secondary: false,
		heal: [1, 2],
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Super Recovery Floppy
	superrecoveryfloppy: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "superrecoveryfloppy",
		isNonstandard: true,
		name: "Super Recovery Floppy",
		pp: 0.625,
		priority: 0,
		flags: {heal: 1, snatch: 1, distance: 1},
		secondary: false,
		heal: [1, 1],
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Various
	various: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "various",
		isNonstandard: true,
		name: "Various",
		pp: 0.625,
		priority: 0,
		flags: {snatch: 1, distance: 1},
		onPrepareHit: function (pokemon, source) {
			this.add('-activate', source, 'move: Various');
			let side = pokemon.side;
			for (let i = 0; i < side.pokemon.length; i++) {
				side.pokemon[i].cureStatus();
			}
		},
		onTryHit: function (pokemon, target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
		secondary: false,
		target: "adjacentAllyOrSelf",
	},
	//Protection
	protection: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user and its party members cannot have major status conditions or confusion inflicted on them by other Pokemon. It is removed from the user's side if the user or an ally is successfully hit by Defog.",
		shortDesc: "For 5 turns, protects user's party from status.",
		pp: 0.625,
		priority: 0,
		flags: {snatch: 1},
		//safeguard effects = same effect for the Protection "item" in Digimon
		sideCondition: 'safeguard',
		effect: {
			duration: 5,
			durationCallback: function (target, source, effect) {
				if (source && source.hasAbility('persistent')) {
					return 7;
				}
				return 5;
			},
			onSetStatus: function (status, target, source, effect) {
				if (source && target !== source && effect && (!effect.infiltrates || target.side === source.side)) {
					this.debug('interrupting setStatus');
					if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Protection');
					}
					return null;
				}
			},
			onTryAddVolatile: function (status, target, source, effect) {
				if ((status.id === 'confusion' || status.id === 'yawn') && source && target !== source && effect && (!effect.infiltrates || target.side === source.side)) {
					if (!effect.secondaries) this.add('-activate', target, 'move: Protection');
					return null;
				}
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Protection');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function (side) {
				this.add('-sideend', side, 'Protection');
			},
		},
		secondary: false,
		target: "adjacentAllyOrSelf",
		type: "Battle",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Safeguard", source);
		},
	},
	//Omnipotent
	omnipotent: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "omnipotent",
		isNonstandard: true,
		name: "Omnipotent",
		pp: 0.625,
		priority: 0,
		flags: {heal: 1, snatch: 1, distance: 1},
		onPrepareHit: function (pokemon, source) {
			pokemon.cureStatus();
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
		secondary: false,
		heal: [1, 1],
		target: "adjacentAllyOrSelf",
	},
	//Restore Floppy
	restorefloppy: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "restorefloppy",
		isNonstandard: true,
		name: "Restore Floppy",
		pp: 0.625,
		priority: 0,
		flags: {heal: 1, snatch: 1, distance: 1},
		secondary: false,
		heal: [1, 2],
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Super Restore Floppy
	superrestorefloppy: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "superrestorefloppy",
		isNonstandard: true,
		name: "Super Restore Floppy",
		pp: 0.625,
		priority: 0,
		flags: {heal: 1, snatch: 1, distance: 1},
		secondary: false,
		heal: [1, 1],
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Stat Boosting Items
	//Offense Disk
	offensedisk: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "offensedisk",
		isNonstandard: true,
		name: "Offense Disk",
		pp: 0.625,
		priority: 0,
		flags: {snatch: 1, distance: 1},
		boosts: {
			atk: 1,
			spa: 1,
		},
		secondary: false,
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Defense Disk
	defensedisk: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "defensedisk",
		isNonstandard: true,
		name: "Defense Disk",
		pp: 0.625,
		priority: 0,
		flags: {snatch: 1, distance: 1},
		boosts: {
			spd: 1,
			def: 1,
		},
		secondary: false,
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Hi Speed Disk
	hispeeddisk: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "hispeeddisk",
		isNonstandard: true,
		name: "Hi Speed Disk",
		pp: 0.625,
		priority: 0,
		flags: {snatch: 1, distance: 1},
		boosts: {
			spe: 1,
		},
		secondary: false,
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Super Defense Disk
	superdefensedisk: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "superdefensedisk",
		isNonstandard: true,
		name: "Super Defense Disk",
		pp: 0.625,
		priority: 0,
		boosts: {
			def: 2,
			spd: 2,
		},
		flags: {snatch: 1, distance: 1},
		secondary: false,
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Super Offense Disk
	superoffensedisk: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "superoffensedisk",
		isNonstandard: true,
		name: "Super Offense Disk",
		pp: 0.625,
		priority: 0,
		flags: {snatch: 1, distance: 1},
		boosts: {
			spa: 2,
			atk: 2,
		},
		secondary: false,
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Super Speed Disk
	superspeeddisk: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "superspeeddisk",
		isNonstandard: true,
		name: "Super Speed Disk",
		pp: 0.625,
		priority: 0,
		flags: {snatch: 1, distance: 1},
		boosts: {
			spe: 2,
		},
		secondary: false,
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//Omnipotent Disk
	omnipotentdisk: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		id: "omnipotentdisk",
		isNonstandard: true,
		name: "Omnipotent Disk",
		pp: 0.625,
		priority: 0,
		flags: {snatch: 1, distance: 1},
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
		},
		secondary: false,
		target: "adjacentAllyOrSelf",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Recover", source);
		},
	},
	//End of items
	//Finishers
	"pepperbreath": {
		id: "pepperbreath",
		name: "Pepper Breath",
		basePower: 89,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Pepper Breath');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Inferno Overdrive", target);
		},
		priority: 0,
		target: "any",
		type: "Fire",
	},
	"blueblaster": {
		id: "blueblaster",
		name: "Blue Blaster",
		basePower: 90,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Blue Blaster');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Blue Flare", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"boombubble": {
		id: "boombubble",
		name: "Boom Bubble",
		basePower: 85,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Boom Bubble');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Aeroblast", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"superthunderstrike": {
		id: "superthunderstrike",
		name: "Super Thunder Strike",
		basePower: 100,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Super Thunder Strike');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Gigavolt Havoc", target);
		},
		priority: 0,
		target: "any",
		type: "Air",
	},
	"spiraltwister": {
		id: "spiraltwister",
		name: "Spiral Twister",
		basePower: 91,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Spiral Twister');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fire Spin", target);
		},
		priority: 0,
		target: "any",
		type: "Air",
	},
	"electricthread": {
		id: "electricthread",
		name: "Electric Thread",
		basePower: 94,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Electric Thread');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Electroweb", target);
		},
		priority: 0,
		target: "any",
		type: "Air",
	},
	"poisonivy": {
		id: "poisonivy",
		name: "Poison Ivy",
		basePower: 101,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Poison Ivy');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Toxic", target);
		},
		priority: 0,
		target: "any",
		type: "Earth",
	},
	"electricshock": {
		id: "electricshock",
		name: "Electric Shock",
		basePower: 92,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Electric Shock');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Thunderbolt", target);
		},
		priority: 0,
		target: "any",
		type: "Air",
	},
	"superslap": {
		id: "superslap",
		name: "Super Slap",
		basePower: 91,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1, contact: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Super Slap');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ice Punch", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	// Champions
	"megaflame": {
		id: "megaflame",
		name: "Mega Flame",
		basePower: 196,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Mega Flame');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Overheat", target);
		},
		priority: 0,
		target: "any",
		type: "Fire",
	},
	"volcanicstrike": {
		id: "volcanicstrike",
		name: "Volcanic Strike",
		basePower: 160,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Volcanic Strike');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Eruption", target);
		},
		priority: 0,
		target: "any",
		type: "Fire",
	},
	"pummelwhack": {
		id: "pummelwhack",
		name: "Pummel Whack",
		basePower: 170,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Pummel Whack');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Wood Hammer", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"spinningneedle": {
		id: "spinningneedle",
		name: "Spinning Needle",
		basePower: 152,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Spinning Needle');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Whirlwind", target);
			this.add('-anim', source, "Ice Shard", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"scissorclaw": {
		id: "scissorclaw",
		name: "Scissor Claw",
		basePower: 172,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Scissor Claw');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Smart Strike", target);
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
	"blastingspout": {
		id: "blastingspout",
		name: "Blasting Spout",
		basePower: 150,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Blastin Spout');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Water Spout", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"subzeroicepunch": {
		id: "subzeroicepunch",
		name: "Sub Zero Ice Punch",
		basePower: 157,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Sub Zero Ice Punch');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Ice Punch", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"partytime": {
		id: "partytime",
		name: "Party Time",
		basePower: 100,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Party Time');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Continental Crush", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"fireball": {
		id: "fireball",
		name: "Fireball",
		basePower: 155,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Fireball');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", source);
			this.add('-anim', source, "Fire Punch", target);
		},
		priority: 0,
		target: "any",
		type: "Fire",
	},
	"drillspin": {
		id: "drillspin",
		name: "Drill Spin",
		basePower: 150,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Drill Spin');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Drill Run", target);
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
	"fistofthebeastking": {
		id: "fistofthebeastking",
		name: "Fist Of The Beast King",
		basePower: 170,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Fist Of The Beast King');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Roar", target);
			this.add('-anim', source, "Fire Punch", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"frozenfireshot": {
		id: "frozenfireshot",
		name: "Frozen Fire Shot",
		basePower: 159,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1, defrost: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Frozen Fire Shot');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Frost Breath", target);
			this.add('-anim', source, "Stone Edge", target);
		},
		priority: 0,
		target: "any",
		type: "Fire",
	},
	"sweetbreath": {
		id: "sweetbreath",
		name: "Sweet Breath",
		basePower: 130,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Sweet Breath');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sweet Kiss", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"hydropressure": {
		id: "hydropressure",
		name: "Hydro Pressure",
		basePower: 155,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Hydro Pressure');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hydro Pump", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"boneboomerang": {
		id: "boneboomerang",
		name: "Bone Boomerang",
		basePower: 148,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Bone Boomerang');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bonemerang", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"meteorwing": {
		id: "meteorwing",
		name: "Meteor Wing",
		basePower: 158,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Meteor Wing');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Heat Wave", target);
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
	"blazeblast": {
		id: "blazeblast",
		name: "Blaze Blast",
		basePower: 174,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Blaze Blast');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Overheat", target);
		},
		priority: 0,
		target: "any",
		type: "Fire",
	},
	"handoffate": {
		id: "handoffate",
		name: "Hand Of Fate",
		basePower: 166,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Hand Of Fate');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Zap Cannon", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"aerialattack": {
		id: "aerialattack",
		name: "Aerial Attack",
		basePower: 153,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Aerial Attack');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Supersonic Skystrike", target);
		},
		priority: 0,
		target: "any",
		type: "Air",
	},
	"igaschoolthrowingknife": {
		id: "igaschoolthrowingknife",
		name: "Iga School Throwing Knife",
		basePower: 150,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Iga School Throwing Knife');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Power Gem", target);
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
	"variabledarts": {
		id: "variabledarts",
		name: "Variable Darts",
		basePower: 153,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Variable Darts');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ice Hammer", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"solarray": {
		id: "solarray",
		name: "Solar Ray",
		basePower: 167,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Solar Ray');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Charge", target);
			this.add('-anim', source, "Electro Ball", target);
		},
		priority: 0,
		target: "any",
		type: "Earth",
	},
	"deathclaw": {
		id: "deathclaw",
		name: "Death Claw",
		basePower: 180,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Death Claw');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hone Claws", target);
			this.add('-anim', source, "Night Slash", target);
		},
		priority: 0,
		target: "any",
		type: "Filth",
	},
	"darkclaw": {
		id: "darkclaw",
		name: "Dark Claw",
		basePower: 143,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Dark Claw');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hone Claws", target);
			this.add('-anim', source, "Shadow Claw", target);
		},
		priority: 0,
		target: "any",
		type: "Filth",
	},
	"electroshocker": {
		id: "electroshocker",
		name: "Electro Shocker",
		basePower: 170,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Electro Shocker');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Charge", target);
			this.add('-anim', source, "Discharge", target);
		},
		priority: 0,
		target: "any",
		type: "Air",
	},
	"iceblast": {
		id: "iceblast",
		name: "Ice Blast",
		basePower: 162,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Ice Blast');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Subzero Slammer", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"howlingblaster": {
		id: "howlingblaster",
		name: "Howling Blaster",
		basePower: 183,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		flags: {protect: 1, distance: 1},
		secondary: false,
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Howling Blaster');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sacred Fire", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	//Ultimates
	"gigablaster": {
		id: "gigablaster",
		name: "Giga Blaster",
		basePower: 215,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Giga Blaster');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sunsteel Strike", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"darkshot": {
		id: "darkshot",
		name: "Dark Shot",
		basePower: 200,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Dark Shot');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Flare Blitz", target);
		},
		priority: 0,
		target: "any",
		type: "Filth",
	},
	"deadlybomb": {
		id: "deadlybomb",
		name: "Deadly Bomb",
		basePower: 260,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Deadly Bomb');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Egg Bomb", target);
		},
		priority: 0,
		target: "any",
		type: "Filth",
	},
	"highelectricshocker": {
		id: "highelectricshocker",
		name: "High Electric Shocker",
		basePower: 218,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: High Electric Shocker');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Charge", target);
			this.add('-anim', source, "Discharge", target);
		},
		priority: 0,
		target: "any",
		type: "Air",
	},
	"smileybomb": {
		id: "smileybomb",
		name: "Smiley Bomb",
		basePower: 255,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Smiley Bomb');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Inferno Overdrive", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"mailstorm": {
		id: "mailstorm",
		name: "Mail Storm",
		basePower: 211,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Mail Storm');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Subzero Slammer", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"abductionbeam": {
		id: "abductionbeam",
		name: "Abduction Beam",
		basePower: 222,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Abduction Beam');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Signal Beam", target);
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
	"darknetwork": {
		id: "darknetwork",
		name: "Dark Network",
		basePower: 202,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Dark Network');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Sing", target);
			this.add('-anim', source, "Nightmare", target);
		},
		priority: 0,
		target: "any",
		type: "Filth",
	},
	"spiralsword": {
		id: "spiralsword",
		name: "Spiral Sword",
		basePower: 210,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Spiral Sword');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Smart Strike", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"genocideattack": {
		id: "genocideattack",
		name: "Genocide Attack",
		basePower: 215,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Genocide Attack');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Never-Ending Nightmare", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"crimsonflare": {
		id: "crimsonflare",
		name: "Crimson Flare",
		basePower: 213,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Crimson Flare');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Roar", target);
			this.add('-anim', source, "Fire Blast", target);
		},
		priority: 0,
		target: "any",
		type: "Fire",
	},
	"bitbomb": {
		id: "bitbomb",
		name: "Bit Bomb",
		basePower: 232,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Bit Bomb');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Charge", target);
			this.add('-anim', source, "Nightmare", target);
		},
		priority: 0,
		target: "any",
		type: "Battle",
	},
	"energybomb": {
		id: "energybomb",
		name: "Energy Bomb",
		basePower: 214,
		accuracy: 100,
		category: "Physical",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Energy Bomb');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Autotomize", target);
			this.add('-anim', source, "Mach Punch", target);
		},
		priority: 0,
		target: "any",
		type: "Earth",
	},
	"lovelyattack": {
		id: "lovelyattack",
		name: "Lovely Attack",
		basePower: 230,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Lovely Attack');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Lovely Kiss", target);
		},
		priority: 0,
		target: "any",
		type: "Ice",
	},
	"nightmaresyndrome": {
		id: "nightmaresyndrome",
		name: "Nightmare Syndrome",
		basePower: 222,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Nightmare Syndrome');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Black Hole Eclipse", target);
		},
		priority: 0,
		target: "any",
		type: "Filth",
	},
	//mega digimon
	"infinitycannon": {
		id: "infinitycannon",
		name: "Infinity Cannon",
		basePower: 777,
		accuracy: 100,
		category: "Special",
		pp: 0.625,
		secondary: false,
		flags: {protect: 1, distance: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Infinity Cannon');
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fleur Cannon", target);
		},
		priority: 0,
		target: "any",
		type: "Mech",
	},
};