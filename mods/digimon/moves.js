'use strict';

exports.BattleMovedex = {
	"acidbubble": {
		accuracy: 90,
		basePower: 80,
		category: "Special",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "acidbubble",
		name: "Acid Bubble",
		pp: 45,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "bubble", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 25,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Aqua",
	},
	"pepperbreath": {
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		desc: "No additional effect.",
		id: "pepperbreath",
		name: "Pepper Breath",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "ember", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "flame",
	},
	"nemesisivy": {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "nemesisivy",
		name: "Nemesis Ivy",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hornleech", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: false,
		target: "normal",
		type: "Nature",
	},
	"electricshock": {
		accuracy: 95,
		basePower: 100,
		category: "Special",
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		id: "electricshock",
		name: "Electric Shock",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "chargebeam", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			status: 'par',
		},
		target: "any",
		type: "Air",
	},
	"spiraltwister": {
		accuracy: 90,
		basePower: 80,
		category: "Special",
		desc: "Raises the user's Special Attack by 1 stage.",
		shortDesc: "Raises the user's Sp. Atk by 1 stage.",
		id: "spiraltwister",
		name: "Spiral Twister",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "firespin", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {spa: 1},
			},
		},
		target: "any",
		type: "Flame",
	},
	"preciousflame": {
		accuracy: 90,
		basePower: 105,
		category: "Physical",
		desc: "Has a 100% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "Lowers the target's Sp. Def by 1.",
		id: "preciousflame",
		name: "Precious Flame",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "ember", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {spd: -1},
		},
		target: "normal",
		type: "Flame",
	},
	"demidart": {
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "demidart",
		name: "Demi Dart",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spikecannon", target);
			this.add('-anim', source, "mefirst", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1, contact: 1},
		secondary: false,
		drain: [1, 2],
		target: "allAdjacentFoes",
		type: "Evil",
	},
	"wormvenom": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Poisons the target.",
		shortDesc: "Poisons the target.",
		id: "wormvenom",
		name: "Worm Venom",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "toxic", target);
		},
		flags: {protect: 1, mirror: 1, reflectable: 1},
		status: 'psn',
		target: "normal",
		type: "Nature",
	},
	"metalcannon": {
		accuracy: 90,
		basePower: 115,
		category: "Physical",
		desc: "Has a 50% chance to raise the user's Defense by 2 stages.",
		shortDesc: "50% chance to raise the user's Def by 2.",
		id: "metalcannon",
		name: "Metal Cannon",
		pp: 2,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "fling", target);
		},
		flags: {protect: 1, mirror: 1, bullet: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {def: 2},
			},
		},
		target: "normal",
		type: "Mech",
	},
	"superthunderstrike": {
		accuracy: 95,
		basePower: 55,
		category: "Special",
		desc: "Hits two times in one turn.",
		id: "superthunderstrike",
		name: "Super Thunder Strike",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "chargebeam", target);
		},
		flags: {protect: 1, mirror: 1},
		multihit: 2,
		target: "any",
		type: "Air",
	},
	"blueblaster": {
		accuracy: 100,
		basePower: 105,
		category: "Physical",
		desc: "Has a 100% chance to lower the target's Defense by 1.",
		shortDesc: "Lowers the target's Defense by 1.",
		id: "blueblaster",
		name: "Blue Blaster",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "willowisp", target);
		},
		flags: {protect: 1, mirror: 1, bullet: 1},
		secondary: {
			chance: 100,
			boosts: {def: -1},
		},
		target: "any",
		type: "Flame",
	},
	"goblinstrike": {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "goblinstrike",
		name: "Goblin Strike",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "brickbreak", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Battle",
	},
	"marchingfishes": {
		accuracy: 90,
		basePower: 40,
		category: "Physical",
		desc: "Hits each target 2-3 times in one turn.",
		shortDesc: "Hits 2-3 times in one turn.",
		id: "marchingfishes",
		name: "Marching Fishes",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "razorshell", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		multihit: [2, 3],
		target: "allAdjacentFoes",
		type: "Aqua",
	},
	"rockfist": {
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "Raises the user's Defense by 1 stage.",
		shortDesc: "Raises the user's Def by 1.",
		id: "rockfist",
		name: "Rock Fist",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "smackdown", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1, punch: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {def: 1},
			},
		},
		target: "normal",
		type: "Nature",
	},
	"electricthread": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Paralyzes the target.",
		shortDesc: "Paralyzes the target.",
		id: "electricthread",
		name: "Electric Thread",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "electroweb", target);
		},
		flags: {protect: 1, mirror: 1},
		status: 'par',
		target: "normal",
		type: "Air",
	},
	"aquatower": {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 75% chance to force the target to switch to a random unfainted ally. The target will not switch out if either the user or target has fainted, the target used Ingrain previously, the target has the Ability Suction Cups, or the target had a substitute.",
		shortDesc: "75% chance to force the target to switch out.",
		id: "aquatower",
		name: "Aqua Tower",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "watergun", target);
		},
		flags: {protect: 1, mirror: 1},
		/*
		onModifyMove: function (move) {
		  if (this.random(4) >= 1} {
		    move.forceSwitch = true;
		 )
		},
		*/
		secondary: {
			chance: 75,
			onHit: function (target, source, move) {
				move.forceSwitch = true;
			},
		},
		target: "normal",
		type: "Aqua",
	},
	"tropicalbeak": {
		accuracy: 95,
		basePower: 40,
		category: "Physical",
		desc: "Hits 1-3 times in one turn.",
		id: "tropicalbeak",
		name: "Tropical Beak",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hornattack", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		multihit: [1, 3],
		target: "normal",
		type: "Battle",
	},
	"lullabybubble": {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to cause the target to fall asleep.",
		shortDesc: "20% chance to cause target to fall asleep.",
		id: "lullabybubble",
		name: "Lullaby Bubble",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "growl", target);
			this.add('-anim', source, "bubble", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1},
		secondary: {
			chance: 20,
			status: "slp",
		},
		target: "normal",
		type: "Aqua",
	},
	"poisonivy": {
		accuracy: 100,
		basePower: 105,
		category: "Physical",
		desc: "Has a 50% chance to poison the target.",
		shortDesc: "50% chance to poison the target.",
		id: "poisonivy",
		name: "Poison Ivy",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "poisonjab", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			status: 'psn',
		},
		target: "normal",
		type: "Nature",
	},
	"boombubble": {
		accuracy: 90,
		basePower: 80,
		category: "Special",
		desc: "Has a 50% chance to raise the user's Speed by 2 stages.",
		shortDesc: "50% chance to raise the user's Spe by 2.",
		id: "boombubble",
		name: "Boom Bubble",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "present", target);
		},
		flags: {protect: 1, mirror: 1, bullet: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {spe: 2},
			},
		},
		target: "any",
		type: "Air",
	},
	"eternalslapping": {
		accuracy: 95,
		basePower: 25,
		category: "Physical",
		desc: "Hits 2-5 times in one turn.",
		id: "eternalslapping",
		name: "Eternal Slapping",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "doubleslap", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		multihit: [2, 5],
		target: "normal",
		type: "Battle",
	},
	"coloredsparkle": {
		accuracy: 100,
		basePower: 105,
		category: "Physical",
		desc: "Has a 100% chance to lower the target's Defense by 1 stage.",
		shortDesc: "Lowers target's Def by 1.",
		id: "coloredsparkle",
		name: "Colored Sparkle",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "psybeam", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {def: -1},
		},
		target: "any",
		type: "Air",
	},
	"puppyhowl": {
		accuracy: 90,
		basePower: 125,
		category: "Special",
		desc: "Ignores the target's stat stage changes, including evasiveness. Has a 50% chance to paralyze the target.",
		shortDesc: "Ignores stat changes. 50% chance to paralyze.",
		id: "puppyhowl",
		name: "Puppy Howl",
		pp: 2,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "tailwind", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		secondary: {
			chance: 50,
			status: "par",
		},
		ignoreEvasion: true,
		ignoreDefensive: true,
		target: "any",
		type: "Holy",
	},
	"dancingbone": {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "dancingbone",
		name: "Dancing Bone",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "boneclub", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Evil",
	},
	"littleblizzard": {
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent foes.",
		id: "littleblizzard",
		name: "Little Blizzard",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "iceball", target);
		},
		flags: {protect: 1, mirror: 1},
		target: "normal",
		type: "Aqua",
	},
	"snowgobbolt": {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "snowgobbolt",
		name: "Snowgob Bolt",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "iceball", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Aqua",
	},
	"supershocker": {
		accuracy: 100,
		basePower: 110,
		category: "Special",
		desc: "No additional effect.",
		id: "supershocker",
		name: "Super Shocker",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "shockwave", target);
		},
		flags: {protect: 1, mirror: 1},
		target: "any",
		type: "Air",
	},
	"plasticblaze": {
		accuracy: 90,
		basePower: 105,
		category: "Physical",
		desc: "Has a 100% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "Lowers target's SpD by 1 stage.",
		id: "plasticblaze",
		name: "Plastic Blaze",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "dragonbreath", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {spd: -1},
		},
		target: "normal",
		type: "Mech",
	},
	"evilspell": {
		accuracy: 90,
		basePower: 80,
		category: "Special",
		desc: "Has a 50% chance to raise the user's Special Attack by 2 stages.",
		shortDesc: "50% chance to raise the user's Sp. Atk by 2.",
		id: "evilspell",
		name: "Evil Spell",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spite", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {spa: 2},
			},
		},
		target: "any",
		type: "Evil",
	},
	"spinningneedle": {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Has a 50% chance to raise the user's Special Attack by 2 stages.",
		shortDesc: "50% chance to raise the user's Sp. Atk by 2.",
		id: "spinningneedle",
		name: "Spinning Needle",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "aeroblast", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {//this scares me. it will roll for each target lol -math
			chance: 50,
			self: {
				boosts: {spd: 2},
			},
		},
		target: "allAdjacentFoes",
		type: "Air",
	},
	"scarredeye": {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to flinch.",
		shortDesc: "Flinches target.",
		id: "scarredeye",
		name: "Scar-Red Eye",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "glare", target);
		},
		flags: {protect: 1, mirror: 1, reflectable: 1, authentic: 1},
		volatileStatus: 'flinch',
		onTryHit: function (target, source, move) {
			//this is implemented solely to have a failure message. since flinch doesn't already have one
			if (!this.willMove(target)) return false;
		},
		target: "normal",
		type: "Flame",
	},
	"handoffate": {
		accuracy: 90,
		basePower: 105,
		category: "Physical",
		desc: "Has a 50% chance to raise the user's Attack and Special Attack by 2.",
		shortDesc: "50% chance to raise the user's Atk and SpA by 2.",
		id: "handoffate",
		name: "Hand Of fate",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "lusterpurge", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {atk: 2, spa: 2},
			},
		},
		target: "normal",
		type: "Holy",
	},
	"evilcharm": {
		accuracy: 90,
		basePower: 0,
		damageCallback: function (pokemon, target) {
			return this.clampIntRange(Math.floor(target.hp / 2), 1);
		},
		category: "Special",
		desc: "Does damage equal to half of the target's current HP.",
		id: "evilcharm",
		name: "Evil Charm",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nightshade", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		target: "normal",
		type: "Evil",
	},
	"meteorwing": {
		accuracy: 90,
		basePower: 100,
		category: "Special",
		desc: "Raises user's Spd by 1 stage.",
		id: "meteorwing",
		name: "Meteor Wing",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "flameburst", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			this.boost({spd: 1}, pokemon, pokemon, move);
		},
		target: "allAdjacentFoes",
		type: "Flame",
	},
	"darkpaw": {
		accuracy: 90,
		basePower: 0,
		damage: 150,
		category: "Physical",
		desc: "Does 150 HP of damage to the target. Has an 80% chance to cause the target to flinch.",
		shortDesc: "Fixed 150 damage. 80% chance of Flinch. Priority +1.",
		id: "darkpaw",
		name: "Dark Paw",
		pp: 3,
		priority: 1,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "lowkick", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: {
			chance: 80,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Battle",
	},
	"solarray": {
		accuracy: true,
		basePower: 110,
		category: "Special",
		desc: "This move does not check accuracy.",
		id: "solarray",
		name: "Solar Ray",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "dragonpulse", target);
		},
		flags: {protect: 1, mirror: 1},
		target: "any",
		type: "Mech",
	},
	"variabledarts": {
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		desc: "Has a 100% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "Lowers the target's Sp. Def by 1.",
		id: "variabledarts",
		name: "Variable Darts",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spikecannon", target);
			this.add('-anim', source, "spikecannon", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {spd: -1},
		},
		target: "any",
		type: "Aqua",
	},
	"dreadfire": {
		accuracy: 90,
		basePower: 90,
		category: "Special",
		desc: "Has a 30% chance to confuse the target.",
		shortDesc: "30% chance to confuse the target.",
		id: "dreadfire",
		name: "Dread Fire",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "blastburn", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Flame",
	},
	"deathclaw": {
		accuracy: 95,
		basePower: 120,
		category: "Physical",
		desc: "Drains 1/2 damage dealt.",
		id: "deathclaw",
		name: "Death Claw",
		pp: 2,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nightslash", target);
			this.add('-anim', source, "mefirst", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1, contact: 1},
		drain: [1, 2],
		target: "normal",
		type: "Evil",
	},
	"pulseblast": {
		accuracy: 95,
		basePower: 90,
		category: "Special",
		desc: "20% chance of Sleep",
		id: "pulseblast",
		name: "Pulse Blast",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "supersonic", target);
		},
		flags: {protect: 1, mirror: 1, pulse: 1},
		secondary: {
			chance: 20,
			status: "slp",
		},
		target: "any",
		type: "Aqua",
	},
	"powermetal": {
		accuracy: 90,
		basePower: 120,
		category: "Physical",
		desc: "50% chance of raising the user's Atk by 2 stages.",
		id: "powermetal",
		name: "Power Metal",
		pp: 2,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "powergem", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {atk: 2},
			},
		},
		target: "normal",
		type: "Mech",
	},
	"drillspin": {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Ignores stat changes.",
		id: "drillspin",
		name: "Drill Spin",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "geargrind", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		ignoreEvasion: true,
		ignoreDefensive: true,
		target: "normal",
		type: "Mech",
	},
	"blazebuster": {
		accuracy: 95,
		basePower: 90,
		category: "Special",
		desc: "Lowers the target's SpD 1 stage.",
		id: "blazebuster",
		name: "Blaze Buster",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "blueflare", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {spd: -1},
		},
		target: "normal",
		type: "Flame",
	},
	"subzeroicepunch": {
		accuracy: 80,
		basePower: 85,
		category: "Physical",
		desc: "80% chance of flinching the target.",
		id: "subzeroicepunch",
		name: "Sub Zero Ice Punch",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "icepunch", target);
		},
		flags: {protect: 1, mirror: 1, punch: 1, contact: 1},
		secondary: {
			chance: 80,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Aqua",
	},
	"evilhurricane": {
		accuracy: 95,
		basePower: 110,
		category: "Physical",
		desc: "No additional effects.",
		id: "evilhurricane",
		name: "Evil Hurricane",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "roost", target);
			this.add('-anim', source, "megapunch", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Air",
	},
	"howlingblaster": {
		accuracy: 100,
		basePower: 105,
		category: "Special",
		desc: "50% chance of raising the user's Special Defense by 2 stages.",
		shortDesc: "50% chance to raise user's SpD by 2 stages.",
		id: "howlingblaster",
		name: "Howling Blaster",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "sacredfire", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {spd: 2},
			},
		},
		target: "any",
		type: "Flame",
	},
	"lightningpaw": {
		accuracy: 90,
		basePower: 0,
		damage: 150,
		category: "Physical",
		desc: "80% chance of confusing the target.",
		id: "lightningpaw",
		name: "Lightning Paw",
		pp: 3,
		priority: 1,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "playrough", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: {
			chance: 80,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Battle",
	},
	"symphonycrusher": {
		accuracy: 90,
		basePower: 80,
		category: "Special",
		desc: "30% chance to make the target fall asleep.",
		id: "symphonycrusher",
		name: "Symphony Crusher",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "uproar", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		secondary: {
			chance: 30,
			status: 'slp',
		},
		target: "normal",
		type: "Battle",
	},
	"hypersmell": {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "30% chance of confusion or paralyzing the target.",
		id: "hypersmell",
		name: "Hyper Smell",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nastyplot", target);
			this.add('-anim', source, "smog", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			onHit: function (target, source) {
				if (this.random(2) === 0) {
					target.addVolatile('confusion', source);
				} else {
					target.trySetStatus('par', source);
				}
			},
		},
		target: "any",
		type: "Filth",
	},
	"megaflame": {
		accuracy: 100,
		basePower: 115,
		category: "Physical",
		desc: "No additional effects.",
		id: "megaflame",
		name: "Mega Flame",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "fireblast", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Flame",
	},
	"guardianbarrage": {
		accuracy: true,
		basePower: 90,
		category: "Physical",
		desc: "Never misses.",
		id: "guardianbarrage",
		name: "Guardian Barrage",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gearup", target);
			this.add('-anim', source, "twineedle", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Mech",
	},
	"chaosblaster": {
		accuracy: 100,
		basePower: 105,
		category: "Special",
		desc: "50% chance of raising the user's Special Defense by 2 stages.",
		id: "chaosblaster",
		name: "Chaos Blaster",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "dazzlinggleam", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {spd: 2},
			},
		},
		target: "any",
		type: "Air",
	},
	"snowpunch": {
		accuracy: 95,
		basePower: 110,
		category: "Physical",
		desc: "No additional effects.",
		id: "snowpunch",
		name: "Snow Punch",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "icepunch", target);
		},
		flags: {protect: 1, mirror: 1, punch: 1, contact: 1},
		secondary: false,
		target: "normal",
		type: "Aqua",
	},
	"frozenclaw": {
		accuracy: 95,
		basePower: 120,
		category: "Physical",
		desc: "Ignores the target's stat changes.",
		id: "frozenclaw",
		name: "Frozen Claw",
		pp: 2,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hail", target);
			this.add('-anim', source, "cut", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: false,
		ignoreEvasion: true,
		ignoreDefensive: true,
		target: "normal",
		type: "Aqua",
	},
	"iceballbomb": {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "Raises the user's defense by 1 stage.",
		shortDesc: "Raises user's Def by 1 stage.",
		id: "iceballbomb",
		name: "Iceball Bomb",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "iciclecrash", target);
		},
		flags: {protect: 1, mirror: 1, bullet: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {def: 1},
			},
		},
		target: "normal",
		type: "Aqua",
	},
	"harpoontorpedo": {
		accuracy: true,
		basePower: 110,
		category: "Physical",
		desc: "This move never misses.",
		id: "harpoontorpedo",
		name: "Harpoon Torpedo",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "shellsmash", target);
			this.add('-anim', source, "pinmissile", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "any",
		type: "Mech",
	},
	"junglebone": {
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Hits 2 times.",
		id: "junglebone",
		name: "Jungle Bone",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "shadowbone", target);
		},
		flags: {protect: 1, mirror: 1},
		multihit: 2,
		secondary: false,
		target: "normal",
		type: "Nature",
	},
	"electroshocker": {
		accuracy: 100,
		basePower: 115,
		category: "Special",
		desc: "No additional effects.",
		id: "electroshocker",
		name: "Electro Shocker",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "electroball", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Air",
	},
	"frozenfireshot": {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Inflicts Paralysis onto the targets.",
		id: "frozenfireshot",
		name: "Frozen Fire Shot",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "revelationdance", target);
		},
		flags: {protect: 1, mirror: 1},
		status: "par",
		secondary: false,
		target: "allAdjacentFoes",
		type: "Flame",
	},
	"scissorclaw": {
		accuracy: 90,
		basePower: 110,
		category: "Physcial",
		desc: "Ignores stat changes.",
		id: "scissorclaw",
		name: "Scissor Claw",
		pp: 2,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "crunch", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		ignoreEvasion: true,
		ignoreDefensive: true,
		secondary: false,
		target: "normal",
		type: "Nature",
	},
	"fistofthebeastking": {
		accuracy: 95,
		basePower: 120,
		category: "Physical",
		desc: "Raises user's Atk by 1 stage.",
		id: "fistofthebeastking",
		name: "Fist of the Beast King",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "megapunch", target);
		},
		flags: {protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {atk: 1},
			},
		},
		target: "normal",
		type: "Battle",
	},
	"xscratch": {
		accuracy: 90,
		basePower: 30,
		category: "Physical",
		desc: "Hits 2-5 times.",
		id: "xscratch",
		name: "X Scratch",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "furyswipes", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: false,
		multihit: [2, 5],
		target: "normal",
		type: "Battle",
	},
	"burningfist": {
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		desc: "50% chance of raising the user's Atk by 2 stages.",
		id: "burningfist",
		name: "Burning Fist",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "firepunch", target);
		},
		flags: {protect: 1, mirror: 1, defrost: 1, punch: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {atk: 2},
			},
		},
		target: "normal",
		type: "Flame",
	},
	"catclaw": {
		accuracy: 90,
		basePower: 0,
		damage: 150,
		category: "Physical",
		desc: "150 Damage. 80% of poison. Priority +1",
		id: "catclaw",
		name: "Cat Claw",
		pp: 3,
		priority: 1,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "cut", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: {
			chance: 80,
			status: 'psn',
		},
		target: "normal",
		type: "Battle",
	},
	"boneboomerang": {
		accuracy: 95,
		basePower: 45,
		category: "Physical",
		desc: "Hits two times.",
		id: "boneboomerang",
		name: "Bone Boomerang",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "bonemerang", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		multihit: 2,
		target: "normal",
		type: "Battle",
	},
	"volcanicstrike": {
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "No additional effects.",
		id: "volcanicstrike",
		name: "Volcanic Strike",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "lavaplume", target);
		},
		flags: {protect: 1, mirror: 1, defrost: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Flame",
	},
	"mindfog": {
		accuracy: 95,
		basePower: 80,
		category: "Special",
		desc: "20% chance of sleep",
		id: "mindfog",
		name: "Mind Fog",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "clearsmog", target);
			this.add('-anim', source, "poisongas", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		secondary: {
			chance: 20,
			status: 'slp',
		},
		target: "normal",
		type: "Nature",
	},
	"mudball": {
		accuracy: 85,
		basePower: 85,
		category: "Special",
		desc: "80% chance of flinch",
		id: "mudball",
		name: "Mud Ball",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "magnitude", target);
		},
		flags: {protect: 1, mirror: 1, bullet: 1},
		secondary: {
			chance: 80,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Nature",
	},
	"poopdunk": {
		accuracy: 90,
		basePower: 75,
		category: "Physical",
		desc: "Lowers the target's Def by 2 stages.",
		id: "poopdunk",
		name: "Poop Dunk",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "acidarmor", target);
			this.add('-anim', source, "bodyslam", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {def: -2},
		},
		target: "normal",
		type: "Filth",
	},
	"dancingleaves": {
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		desc: "50% chance of lowering accuracy by 2 stages.",
		id: "dancingleaves",
		name: "Dancing Leaves",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "leaftornado", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {accuracy: -2},
		},
		target: "normal",
		type: "Nature",
	},
	"fakedrillspin": {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Ignores stat changes.",
		id: "fakedrillspin",
		name: "Fake Drill Spin",
		pp: 3,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "geargrind", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		ignoreEvasion: true,
		ignoreDefensive: true,
		target: "normal",
		type: "Mech",
	},
	"numesludge": {
		accuracy: 95,
		basePower: 70,
		category: "Physical",
		desc: "Lowers the target's Atk by 2 Stages.",
		id: "numesludge",
		name: "Nume Sludge",
		pp: 5,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "sludgebomb", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			boosts: {atk: -2},
		},
		target: "normal",
		type: "Filth",
	},
	"pummelwhack": {
		name: "Pummel Whack",
		id: "pummelwhack",
		basePower: 110,
		priority: 0,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "No additional effects.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "shadowpunch", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
	},
	"firefeather": {
		name: "Fire Feather",
		id: "firefeather",
		basePower: 110,
		priority: 0,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "50% chance of raising user's Attack and Sp.Attack 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "roost", source);
			this.add('-anim', source, "flameburst", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {atk: 2, spa: 2},
			},
		},
		accuracy: 90,
		pp: 3,
	},
	"raremetalpoop": {
		name: "Rare Metal Poop",
		id: "raremetalpoop",
		basePower: 80,
		priority: 0,
		category: "Physical",
		type: "Filth",
		target: "normal",
		desc: "Force target to switch out.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "rockpolish", target);
			this.add('-anim', source, "acid", target);
		},
		flags: {protect: 1, mirror: 1},
		forceSwitch: true,
		accuracy: 95,
		pp: 5,
	},
	"chilipepperpummel": {
		name: "Chili Pepper Pummel",
		id: "chilipepperpummel",
		basePower: 70,
		priority: 0,
		category: "Special",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "50% chance of lowering Accuracy 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "smog", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			boosts: {accuracy: -2},
		},
		accuracy: 95,
		pp: 5,
	},
	"antidigibeam": {
		name: "Anti-Digi Beam",
		id: "antidigibeam",
		basePower: 0,
		priority: 0,
		category: "Status",
		type: "Mech",
		target: "normal",
		desc: "Inflicts Dot.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "anchorshot", target);
		},
		flags: {protect: 1, mirror: 1},
		volatileStatus: "dot",
		accuracy: 90,
		pp: 2,
	},
	"nightroar": {
		name: "Night Roar",
		id: "nightroar",
		basePower: 100,
		priority: 0,
		category: "Physical",
		type: "Air",
		target: "allAdjacentFoes",
		desc: "Raises user's Speed 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "ominouswind", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		accuracy: 95,
		pp: 5,
		secondary: {
			chance: 100,
			self: {
				boosts: {spe: 1},
			},
		},
	},
	"stunray": {
		name: "Stun Ray",
		id: "stunray",
		basePower: 100,
		priority: 0,
		category: "Special",
		type: "Nature",
		target: "any",
		desc: "30 chance of Flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "bugbuzz", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
	},
	"iceblast": {
		name: "Ice Blast",
		id: "iceblast",
		basePower: 105,
		priority: 0,
		category: "Special",
		type: "Aqua",
		target: "any",
		desc: "Lowers target's Speed 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "watershuriken", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		secondary: {
			chance: 100,
			boosts: {spe: -1},
		},
	},
	"hydropressure": {
		name: "Hydro Pressure",
		id: "hydropressure",
		basePower: 80,
		priority: 0,
		category: "Special",
		type: "Aqua",
		target: "allAdjacent",
		desc: "20% chance of forcing target to switch out.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hydropump", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
	},
	"lustershot": {
		name: "Luster Shot",
		id: "lustershot",
		basePower: 90,
		priority: 1,
		category: "Special",
		type: "Holy",
		target: "any",
		desc: "Priority +1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "moonblast", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: true,
		pp: 3,
	},
	"necromagic": {
		name: "Necro Magic",
		id: "necromagic",
		basePower: 0,
		priority: 0,
		category: "Special",
		type: "Evil",
		target: "normal",
		desc: "Instant KO.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hex", target);
		},
		flags: {protect: 1, mirror: 1},
		ohko: true,
		accuracy: 30,
		pp: 3,
	},
	"poop": {
		name: "Poop",
		id: "poop",
		basePower: 70,
		priority: 0,
		category: "Physical",
		type: "Filth",
		target: "normal",
		desc: "Lowers target's Speed 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "acid", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 5,
		secondary: {
			chance: 100,
			boosts: {spe: -2},
		},
	},
	"hypercannon": {
		name: "Hyper Cannon",
		id: "hypercannon",
		priority: 0,
		basePower: 160,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "1-turn recoil after use.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "dragonpulse", target);
		},
		flags: {protect: 1, mirror: 1, recharge: 1},
		self: {
			volatileStatus: 'mustrecharge',
		},
		accuracy: 90,
		pp: 2,
	},
	"needlespray": {
		name: "Needle Spray",
		id: "needlespray",
		basePower: 90,
		priority: 0,
		category: "Physical",
		type: "Nature",
		target: "allAdjacentFoes",
		desc: "30% chance of Paralyze.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "seedflare", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 5,
		secondary: {
			chance: 30,
			status: 'par',
		},
	},
	"blazeblaster": {
		name: "Blaze Blaster",
		id: "blazeblaster",
		priority: 0,
		basePower: 100,
		category: "Physical",
		type: "Flame",
		target: "any",
		desc: "High Critical hit Rate",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "fireblast", target);
		},
		flags: {protect: 1, mirror: 1, defrost: 1},
		accuracy: 100,
		pp: 3,
		critRatio: 2,
	},
	"aerialattack": {
		name: "Aerial Attack",
		id: "aerialattack",
		priority: 1,
		basePower: 90,
		category: "Special",
		type: "Holy",
		target: "any",
		desc: "Priority+1. High chance of critical hit.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "moonblast", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		critRatio: 2,
	},
	"sweetbreath": {
		name: "Sweet Breath",
		id: "sweetbreath",
		priority: 0,
		basePower: 70,
		category: "Special",
		type: "Nature",
		target: "allAdjacentFoes",
		desc: "Lowers target's Evasion 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "smog", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 95,
		pp: 5,
		secondary: {
			chance: 100,
			boosts: {evasion: -2},
		},
	},
	"deadlyweed": {
		name: "Deadly Weed",
		id: "deadlyweed",
		priority: 0,
		basePower: 70,
		category: "Special",
		type: "Nature",
		target: "normal",
		desc: "50% chance of lowering Speed and Accuracy 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "grasspledge", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 5,
		secondary: {
			chance: 50,
			boosts: {spe: -2, accuracy: -2},
		},
	},
	"thunderray": {
		name: "Thunder Ray",
		id: "thunderray",
		priority: 0,
		basePower: 100,
		category: "Special",
		type: "Air",
		target: "normal",
		desc: "30% chance of Paralyze.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "thunderbolt", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		secondary: {
			chance: 30,
			status: 'par',
		},
	},
	"spiralsword": {
		name: "Spiral Sword",
		id: "spiralsword",
		priority: 0,
		basePower: 110,
		category: "Special",
		type: "Mech",
		target: "any",
		desc: "High critical hit ratio.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "charge", target);
			this.add('-anim', source, "secretsword", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		critRatio: 2,
	},
	"celestialarrow": {
		name: "Celestial Arrow",
		id: "celestialarrow",
		priority: 0,
		basePower: 110,
		category: "Special",
		type: "Holy",
		target: "any",
		desc: "Ignores target's stat changes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "extremeevoboost", target);
			this.add('-anim', source, "spikecannon", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 3,
		ignoreDefensive: true,
		ignoreEvasion: true,
	},
	"vampirewave": {
		name: "Vampire Wave",
		id: "vampirewave",
		priority: 0,
		basePower: 100,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "Drains 1/2 damage dealt; 50% chance to confuse target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "bite", target);
			this.add('-anim', source, "drainingkiss", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1},
		accuracy: 100,
		pp: 3,
		drain: [1, 2],
		secondary: {
			chance: 50,
			volatileStatus: 'confusion',
		},
	},
	"fullmoonkick": {
		name: "Full Moon Kick",
		id: "fullmoonkick",
		priority: 0,
		basePower: 115,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "Raises the user's Speed 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "cosmicpower", target);
			this.add('-anim', source, "highjumpkick", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 2,
		secondary: {
			chance: 100,
			self: {
				boosts: {spe: 2},
			},
		},
	},
	"coldflame": {
		name: "Cold Flame",
		id: "coldflame",
		priority: 0,
		basePower: 100,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "Raises the user's Attack 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hail", target);
			this.add('-anim', source, "firepunch", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		secondary: {
			chance: 100,
			self: {
				boosts: {atk: 2},
			},
		},
	},
	"nightmaresyndrome": {
		name: "Nightmare Syndrome",
		id: "nightmaresyndrome",
		priority: 0,
		basePower: 0,
		damageCallback: function (pokemon, target) {
			return this.clampIntRange(Math.floor(target.hp / 2), 1);
		},
		category: "Physical",
		type: "Filth",
		target: "any",
		desc: "Does damage equal to 1/2 of the target's current HP. 50% chance to make target fall asleep.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "topsyturvy", target);
			this.add('-anim', source, "darkvoid", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		secondary: {
			chance: 50,
			status: 'slp',
		},
	},
	"metalmeteor": {
		name: "Metal Meteor",
		id: "metalmeteor",
		priority: 0,
		basePower: 130,
		category: "Physical",
		type: "Mech",
		target: "any",
		desc: "No additional effects.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "corkscrewcrash", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
	},
	"loveserenade": {
		name: "Love Serenade",
		id: "loveserenade",
		priority: 0,
		basePower: 105,
		category: "Special",
		type: "Filth",
		target: "allAdjacentFoes",
		desc: "Ignores target's stat changes. 30% chance to paralyze target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spotlight", target);
			this.add('-anim', source, "snarl", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		accuracy: 95,
		pp: 2,
		ignoreDefensive: true,
		ignoreEvasion: true,
		secondary: {
			chance: 30,
			status: 'par',
		},
	},
	"shadowwing": {
		name: "Shadow Wing",
		id: "shadowwing",
		basePower: 105,
		priority: 0,
		category: "Special",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "Raises the user's Speed 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "sunsteelstrike", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 5,
		secondary: {
			chance: 100,
			self: {
				boosts: {spe: 1},
			},
		},
	},
	"energyshot": {
		name: "Energy Shot",
		id: "energyshot",
		priority: 0,
		basePower: 95,
		category: "Special",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Inflicts Bug status.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "clangingscales", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		secondary: {
			chance: 100,
			volatileStatus: 'bug',
		},
	},
	"deadlybomb": {
		name: "Deadly Bomb",
		id: "deadlybomb",
		priority: 0,
		basePower: 200,
		category: "Physical",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Always instantly kills the user.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "explosion", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		selfdestruct: "always",
	},
	"fistofice": {
		name: "Fist of Ice",
		id: "fistofice",
		priority: 0,
		basePower: 120,
		category: "Physical",
		type: "Aqua",
		target: "normal",
		desc: "80% chance to flinch the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hail", target);
			this.add('-anim', source, "icepunch", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1, punch: 1},
		accuracy: 95,
		pp: 3,
		secondary: {
			chance: 80,
			volatileStatus: 'flinch',
		},
	},
	"darknesswave": {
		name: "Darkness Wave",
		id: "darknesswave",
		priority: 0,
		basePower: 60,
		category: "Special",
		type: "Evil",
		target: "allAdjacentFoes",
		desc: "Hits 2 times.",
		onPrepareHit: function (source, target, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "octazooka", target);
			this.add('-anim', source, "ominouswind", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		multihit: 2,
	},
	"flowercannon": {
		name: "Flower Cannon",
		id: "flowercannon",
		priority: 1,
		basePower: 100,
		category: "Special",
		type: "Nature",
		target: "any",
		desc: "No additional effects.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "petalblizzard", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
	},
	"gateofdestiny": {
		name: "Gate of Destiny",
		id: "gateofdestiny",
		basePower: 100,
		priority: 0,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "25 chance of instantly KOing target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "swordsdance", target);
			this.add('-anim', source, "spacialrend", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		secondary: {
			chance: 25,
			onHit: function (target, source, move) {
				//Preliminary implementation; probably won't interact perfectly with all mechanics
				if (target.level > source.level) return;
				this.add('-ohko');
				this.faint(target, source, move);
			},
		},
	},
	"smilebomber": {
		name: "Smile Bomber",
		id: "smilebomber",
		priority: 0,
		basePower: 95,
		category: "Physical",
		type: "Mech",
		target: "any",
		desc: "Never misses.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "dynamicpunch", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 5,
	},
	"genocideattack": {
		name: "Genocide Attack",
		id: "genocideattack",
		priority: 0,
		basePower: 110,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "High chance of critical hit.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "darkpulse", target);
			this.add('-anim', source, "foulplay", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 100,
		pp: 3,
		critRatio: 2,
	},
	"hornbuster": {
		name: "Horn Buster",
		id: "hornbuster",
		priority: 0,
		basePower: 125,
		category: "Physical",
		type: "Air",
		target: "normal",
		desc: "Ignore stat changes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "paraboliccharge", target);
			this.add('-anim', source, "voltswitch", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 2,
		ignoreDefensive: true,
		ignoreEvasion: true,
	},
	"lightningjavelin": {
		name: "Lightning Javelin",
		id: "lightningjavelin",
		priority: 0,
		basePower: 110,
		category: "Special",
		type: "Air",
		target: "any",
		desc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "thunder", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
	},
	"modestlystun": {
		name: "Modestly Stun",
		id: "modestlystun",
		priority: 0,
		basePower: "80",
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "80% chance of Paralyze.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "crosschop", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		secondary: {
			chance: 80,
			status: 'par',
		},
	},
	"berserkthinking": {
		name: "Berserk Thinking",
		id: "berserkthinking",
		priority: 0,
		basePower: "40",
		category: "Physical",
		type: "Battle",
		target: "any",
		desc: "Hits 2-4 times.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "smartstrike", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		multihit: [2, 4],
	},
	"gigadestroyer": {
		name: "Giga Destroyer",
		id: "gigadestroyer",
		priority: 0,
		basePower: 125,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "infernooverdrive", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
	},
	"revengeflame": {
		name: "Revenge Flame",
		id: "revengeflame",
		priority: -4, //same as Revenge
		basePower: 70,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "Doubles in power if damaged that turn. (Revenge desc)",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "moongeistbeam", target);
		},
		flags: {protect: 1, mirror: 1, defrost: 1},
		accuracy: 100,
		pp: 5,
		basePowerCallback: function (pokemon, target, move) {
			//copied from Revenge
			if (target.lastDamage > 0 && pokemon.lastAttackedBy && pokemon.lastAttackedBy.thisTurn && pokemon.lastAttackedBy.pokemon === target) {
				this.debug('Boosted for getting hit by ' + pokemon.lastAttackedBy.move);
				return move.basePower * 2;
			}
			return move.basePower;
		},
	},
	"energybomb": {
		name: "Energy Bomb",
		id: "energybomb",
		priority: 0,
		basePower: 95,
		category: "Special",
		type: "Mech",
		target: "any",
		desc: "Never misses.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "magnetbomb", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 5,
	},
	"galacticflare": {
		name: "Galactic Flare",
		id: "galacticflare",
		priority: 0,
		basePower: 90,
		category: "Special",
		type: "Battle",
		target: "allAdjacentFoes",
		desc: "50% chance of raising user's Defense 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "dragonascent", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 5,
		secondary: {
			chance: 50,
			self: {
				boosts: {def: 2},
			},
		},
	},
	"heartattack": {
		name: "Heart Attack",
		id: "heartattack",
		priority: 0,
		basePower: 100,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "Ignore stat changes. 50% chance of Confusion.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "charm", target);
			this.add('-anim', source, "miracleeye", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		ignoreDefensive: true,
		ignoreEvasion: true,
		secondary: {
			chance: 50,
			volatileStatus: 'confusion',
		},
	},
	"grislywing": {
		name: "Grisly Wing",
		id: "grislywing",
		priority: 0,
		basePower: 100,
		category: "Special",
		type: "Evil",
		target: "allAdjacentFoes",
		desc: "Absorbs 50% damage into HP.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "octazooka", target);
			this.add('-anim', source, "drainingkiss", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1},
		accuracy: 100,
		pp: 3,
		drain: [1, 2],
	},
	"pitbomb": {
		name: "Pit Bomb",
		id: "pitbomb",
		priority: 1,
		basePower: 100,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "Priority+1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "psychoboost", target);
		},
		accuracy: 95,
		pp: 3,
	},
	"musicalfist": {
		name: "Musical Fist",
		id: "musicalfist",
		priority: 0,
		basePower: 100,
		category: "Special",
		type: "Battle",
		target: "allAdjacentFoes",
		desc: "30% chance of lowering Attack, Sp.Attack, and Sp.Defense by 2 stages. 10 chance of Sleep.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "boomburst", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, punch: 1, contact: 1},
		accuracy: 95,
		pp: 3,
		secondaries: [
			{
				chance: 30,
				boosts: {
					atk: -2,
					spa: -2,
					spd: -2,
				},
			},
			{
				chance: 10,
				status: 'slp',
			},
		],
	},
	"oblivionbird": {
		name: "Oblivion Bird",
		id: "oblivionbird",
		priority: 0,
		basePower: 130,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "Lowers target Defense 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "clangoroussoulblaze", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		secondary: {
			chance: 100,
			boosts: {def: -1},
		},
	},
	"fragbomb": {
		name: "Frag Bomb",
		id: "fragbomb",
		priority: 0,
		basePower: 200,
		category: "Physical",
		type: "Evil",
		target: "allAdjacentFoes",
		desc: "KOs user. (Self Destruct)",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "imprison", target);
			this.add('-anim', source, "explosion", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		selfdestruct: 'always',
	},
	"unidentifiedflyingkiss": {
		name: "Unidentified Flying Kiss",
		id: "unidentifiedflyingkiss",
		priority: 0,
		basePower: 95,
		category: "Physical",
		type: "Filth",
		target: "normal",
		desc: "50% chance of Dot.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "lovelykiss", target);
			this.add('-anim', source, "dracometeor", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 100,
		pp: 3,
		secondary: {
			chance: 50,
			volatileStatus: 'dot',
		},
	},
	"volcanicstrikes": {
		name: "Volcanic Strike S",
		id: "volcanicstrikes",
		priority: 0,
		basePower: 110,
		category: "Physical",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "eruption", target);
		},
		flags: {protect: 1, mirror: 1, defrost: 1},
		accuracy: 90,
		pp: 3,
	},
	"heartbreakattack": {
		name: "Heartbreak Attack",
		id: "heartbreakattack",
		priority: 0,
		basePower: 100,
		category: "Special",
		type: "Evil",
		target: "normal",
		desc: "Ignore stat changes. 50% chance of Confusion.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "lovelykiss", target);
			this.add('-anim', source, "darkvoid", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		ignoreDefensive: true,
		ignoreEvasion: true,
		secondary: {
			chance: 50,
			volatileStatus: 'confusion',
		},
	},
	"evilicicle": {
		name: "Evil Icicle",
		id: "evilicicle",
		priority: 0,
		basePower: 110,
		category: "Special",
		type: "Aqua",
		target: "any",
		desc: "",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "grudge", target);
			this.add('-anim', source, "icebeam", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
	},
	"wolfclaw": {
		name: "Wolf Claw",
		id: "wolfclaw",
		priority: 0,
		basePower: 115,
		category: "Physical",
		type: "Battle",
		target: "any",
		desc: "Raises user's Speed 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "cosmicpower", target);
			this.add('-anim', source, "block", target);
		},
		flags: {protect: 1, mirror: 1, distance: 1, contact: 1},
		accuracy: 95,
		pp: 2,
		secondary: {
			chance: 100,
			self: {
				boosts: {spe: 2},
			},
		},
	},
	"tidalwave": {
		name: "Tidal Wave",
		id: "tidalwave",
		priority: 0,
		basePower: 105,
		category: "Special",
		type: "Aqua",
		target: "allAdjacent",
		desc: "No additional effects.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "waterspout", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
	},
	"vulcanshammer": {
		name: "Vulcan's Hammer",
		id: "vulcanshammer",
		priority: 0,
		basePower: 130,
		category: "Physical",
		type: "Air",
		target: "normal",
		desc: "Ignore stat changes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "plasmafists", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		ignoreDefensive: true,
		ignoreEvasion: true,
	},
	"bladeofthedragonking": {
		name: "Blade of the Dragon King",
		id: "bladeofthedragonking",
		priority: 0,
		basePower: 55,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "Hits 2-5 times.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "swordsdance", source);
			this.add('-anim', source, "sacredsword", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 85,
		pp: 2,
		multihit: [2, 5],
	},
	"garurutomahawk": {
		name: "Garuru Tomahawk",
		id: "garurutomahawk",
		priority: 0,
		basePower: 130,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "Never misses.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gearup", target);
			this.add('-anim', source, "mistball", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 3,
	},
	"blacktornado": {
		name: "Black Tornado",
		id: "blacktornado",
		priority: 0,
		basePower: 140,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "Ignore stat changes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "tailwhip", target);
			this.add('-anim', source, "photongeyser", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		ignoreDefensive: true,
		ignoreEvasion: true,
	},
	"tomahawkstinger": {
		name: "Tomahawk Stinger",
		id: "tomahawkstinger",
		priority: 0,
		basePower: 110,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "30% chance of Confusion.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "tailwhip", target);
			this.add('-anim', source, "secretsword", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 5,
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
	},
	"lightningspear": {
		name: "Lightning Spear",
		id: "lightningspear",
		priority: 0,
		basePower: 130,
		category: "Physical",
		type: "Air",
		target: "normal",
		desc: "Ignore stat changes. High chance of critical hit.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "10000000voltthunderbolt", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		ignoreDefensive: true,
		ignoreEvasion: true,
		critRatio: 2,
	},
	"heavensjudgment": {
		name: "Heaven's Judgment",
		id: "heavensjudgment",
		priority: 0,
		basePower: 110,
		category: "Special",
		type: "Air",
		target: "allAdjacentFoes",
		desc: "High chance of critical hit.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gigavolthavoc", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
		critRatio: 2,
	},
	"blackdeathcloud": {
		name: "Black Death Cloud",
		id: "blackdeathcloud",
		priority: 0,
		basePower: 105,
		category: "Special",
		type: "Filth",
		target: "any",
		desc: "50% chance of Sleep.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "sludgewave", target);
			this.add('-anim', source, "darkvoid", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 100,
		pp: 3,
		secondary: {
			chance: 50,
			status: 'slp',
		},
	},
	"bravemetal": {
		name: "Brave Metal",
		id: "bravemetal",
		priority: 0,
		basePower: 135,
		category: "Physical",
		type: "Evil",
		target: "any",
		desc: "No additional effects.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spectralthief", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 2,
	},
	"brainrupture": {
		name: "Brain Rupture",
		id: "brainrupture",
		priority: 0,
		basePower: 110,
		category: "Special",
		type: "Mech",
		target: "normal",
		desc: "50% chance to confuse the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "prismaticlaser", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		secondary: {
			chance: 50,
			volatileStatus: 'confusion',
		},
	},
	"gigablaster": {
		name: "Giga Blaster",
		id: "gigablaster",
		priority: 0,
		basePower: 130,
		category: "Special",
		type: "Air",
		target: "normal",
		desc: "Never misses.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "zapcannon", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 3,
	},
	"atomicray": {
		name: "Atomic Ray",
		id: "atomicray",
		priority: 0,
		basePower: 120,
		category: "Physical",
		type: "Mech",
		target: "any",
		desc: "80% chance to flinch the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gearup", target);
			this.add('-anim', source, "zapcannon", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		secondary: {
			chance: 80,
			volatileStatus: 'flinch',
		},
	},
	"phantompain": {
		name: "Phantom Pain",
		id: "phantompain",
		priority: 0,
		basePower: 125,
		category: "Special",
		type: "Evil",
		target: "normal",
		desc: "Ignores target's stat changes. Drains 1/2 damage dealt.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "refresh", target);
			this.add('-anim', source, "neverendingnightmare", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1, contact: 1},
		accuracy: 95,
		pp: 2,
		ignoreDefensive: true,
		ignoreEvasion: true,
		drain: [1, 2],
	},
	"infinitycannon": {
		name: "Infinity Cannon",
		id: "infinitycannon",
		priority: 0,
		basePower: 125,
		category: "Special",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Hits 1-2 times.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "coreenforcer", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 75,
		pp: 2,
		multihit: [1, 2],
	},
	"firetornado": {
		name: "Fire Tornado",
		id: "firetornado",
		priority: 0,
		basePower: 105,
		category: "Special",
		type: "Holy",
		target: "allAdjacentFoes",
		desc: "No aditional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "skillswap", target);
			this.add('-anim', source, "firespin", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 5,
	},
	"oceanlove": {
		name: "Ocean Love",
		id: "oceanlove",
		priority: 0,
		basePower: true,
		category: "Status",
		type: "Aqua",
		target: "allySide",
		desc: "Restore 50% HP and recover all status effects.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "aquaring", target);
			this.add('-anim', source, "attract", target);
		},
		flags: {heal: 1, snatch: 1},
		accuracy: true,
		pp: 5,
		onHitSide: function (side) {
			let didSomething = false;
			for (let pokemon of side.active) {
				if (pokemon.heal(pokemon.maxhp / 2)) didSomething = true;
				if (pokemon.cureStatus()) didSomething = true;
			}
			return didSomething;
		},
	},
	"darkrecital": {
		name: "Dark Recital",
		id: "darkrecital",
		priority: 0,
		basePower: 115,
		category: "Special",
		type: "Filth",
		target: "normal",
		desc: "Flinches the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spotlight", target);
			this.add('-anim', source, "roaroftime", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		accuracy: 100,
		pp: 2,
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
	},
	"icewolfclaw": {
		name: "Ice Wolf Claw",
		id: "icewolfclaw",
		priority: 0,
		basePower: 60,
		category: "Physical",
		type: "Aqua",
		target: "allAdjacentFoes",
		desc: "Hits 2 times. 80% chance to flinch the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "blizzard", target);
			this.add('-anim', source, "sheercold", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 90,
		pp: 2,
		multihit: 2,
		secondary: {
			chance: 80,
			volatileStatus: 'flinch',
		},
	},
	"riverofpower": {
		name: "River of Power",
		id: "riverofpower",
		priority: 0,
		basePower: 110,
		category: "Special",
		type: "Aqua",
		target: "any",
		desc: "Lowers the target's Sp. Defense by 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "originpulse", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		secondary: {
			chance: 100,
			boosts: {spd: -2},
		},
	},
	"edensjavelin": {
		name: "Eden's Javelin",
		id: "edensjavelin",
		priority: 0,
		basePower: 120,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "Raises the user's Sp. Attack by 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "lightofruin", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		secondary: {
			chance: 100,
			self: {
				boosts: {spa: 2},
			},
		},
	},
	"starlightexplosion": {
		name: "Starlight Explosion",
		id: "starlightexplosion",
		priority: 0,
		basePower: 105,
		category: "Special",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "Damage foes, then restore 50% HP to all allies.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "doomdesire", target);
			this.add('-anim', source, "moonlight", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1, authentic: 1},
		accuracy: 100,
		pp: 3,
		onAfterMoveSecondarySelf: function (pokemon, target, source, move) {
			for (let i = 0; i < target.side.active.length; i++) {
				let allyActive = target.side.foe.active[i];
				if (allyActive) this.heal(allyActive.maxhp / 2, allyActive);
			}
		},
	},
	"smilewarhead": {
		name: "Smile Warhead",
		id: "smilewarhead",
		priority: 0,
		basePower: 110,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "Force target to switch out.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "pulverizingpancake", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 3,
		forceSwitch: true,
	},
	"darknesszone": {
		name: "Darkness Zone",
		id: "darknesszone",
		priority: 0,
		basePower: 40,
		category: "Physical",
		type: "Evil",
		target: "allAdjacentFoes",
		desc: "Hits 3 times. Lowers the target's Defense by 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "sinisterarrowraid", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 95,
		pp: 3,
		multihit: 3,
		onAfterMoveSecondary: function (target, source, move) {
			this.boost({def: -1});
		},
	},
	"knowledgestream": {
		name: "Knowledge Stream",
		id: "knowledgestream",
		priority: 0,
		basePower: 40,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "20% chance of either paralyzing, putting to sleep, or panicing the target. Each ailment has a 6.67 chance of being inflicted.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "moonlight", target);
			this.add('-anim', source, "hyperbeam", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
		secondary: {
			chance: 20,
			onHit: function (target) {
				switch (this.random(3)) {
				case 0:
					target.trySetStatus('par');
					break;
				case 1:
					target.trySetStatus('slp');
					break;
				case 2:
					target.addVolatile('panic');
				}
			},
		},
	},
	"thornwhip": {
		name: "Thorn Whip",
		id: "thornwhip",
		priority: 1,
		basePower: 115,
		category: "Physical",
		type: "Nature",
		target: "normal",
		desc: "Priority+1. Absorbs 50% damage as HP. 50% chance of Paralyze.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "crosspoison", target);
			this.add('-anim', source, "paraboliccharge", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1, contact: 1},
		accuracy: 90,
		pp: 3,
		drain: [1, 2],
		secondary: {
			chance: 50,
			status: 'par',
		},
	},
	"howlingcrusher": {
		name: "Howling Crusher",
		id: "howlingcrusher",
		basePower: 60,
		priority: 0,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "Hits 2 times. High chance of critical hit.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "honeclaws", target);
			this.add('-anim', source, "crushclaw", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 3,
		multihit: 2,
		critRatio: 2,
	},
	"strikeofthesevenstars": {
		name: "Strike of the Seven Stars",
		id: "strikeofthesevenstars",
		basePower: 20,
		priority: 0,
		category: "Special",
		type: "Holy",
		target: "allAdjacentFoes",
		desc: "Hits 7 times.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hiddenpower", target);
			this.add('-anim', source, "judgment", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		multihit: 7,
	},
	"venominfusion": {
		name: "Venom Infusion",
		id: "venominfusion",
		basePower: 130,
		priority: 0,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "Absorbs 50 damage as HP. Inflicts Poison.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "grudge", target);
			this.add('-anim', source, "thousandwaves", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1},
		accuracy: 95,
		pp: 2,
		drain: [1, 2],
		secondary: {
			chance: 100,
			status: 'psn',
		},
	},
	"arcticblizzard": {
		name: "Arctic Blizzard",
		id: "arcticblizzard",
		basePower: 130,
		priority: 0,
		category: "Physical",
		type: "Aqua",
		target: "normal",
		desc: "Inflicts Flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "icehammer", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
	},
	"terraforce": {
		name: "Terra Force",
		id: "terraforce",
		priority: 0,
		basePower: 125,
		category: "Physical",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "Raises user's Attack 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "fusionflare", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		secondary: {
			chance: 100,
			self: {
				boosts: {atk: 2},
			},
		},
	},
	//Generic attacks start here
	"burningheart": {
		name: "Burning Heart",
		id: "burningheart",
		basePower: 0,
		category: "Status",
		type: "Flame",
		target: "self",
		desc: "Raises user's Attack 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "tailglow", target);
		},
		flags: {defrost: 1, snatch: 1},
		accuracy: 100,
		pp: 20,
		boosts: {atk: 2},
	},
	"heatbreath": {
		name: "Heat Breath",
		id: "heatbreath",
		priority: 1,
		basePower: 50,
		category: "Special",
		type: "Flame",
		target: "any",
		desc: "Priority +1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "heatwave", target);
		},
		flags: {protect: 1, mirror: 1, defrost: 1},
		accuracy: 100,
		pp: 30,
	},
	"firetower": {
		name: "Fire Tower",
		id: "firetower",
		basePower: 60,
		category: "Physical",
		priority: 0,
		type: "Flame",
		target: "any",
		desc: "Ignores stat changes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "flamecharge", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 20,
		ignoreDefensive: true,
		ignoreEvasion: true,
	},
	"firewall": {
		name: "Firewall",
		id: "firewall",
		priority: 4,
		basePower: 0,
		category: "Status",
		type: "Flame",
		target: "self",
		desc: "Priority +4. User is immune to moves for one turn. If opponent targets user this turn, the attacker receives 1/8 max HP damage. (Spiky Shield desc, but Flame and Fire type, and doesn't care about 'contact'.)",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "firespin", source);
			this.add('-anim', source, "protect", source);
		},
		flags: {protect: 1, mirror: 1, defrost: 1},
		accuracy: 100,
		pp: 10,
		//mostly copy-paste from Spiky Shield
		stallingMove: true,
		volatileStatus: 'firewall',
		onTryHit: function (target, source, move) {
			return !!this.willAct() && this.runEvent('StallMove', target);
		},
		onHit: function (pokemon, source) {
			pokemon.addVolatile('stall');
			this.add('-message', source.name + ' is hidden behind a firewall!');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'move: Firewall'); //this might not work if the client doesn't support it
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect']) {
					if (move.isZ) move.zBrokeProtect = true;
					return;
				}
				this.add('-activate', target, 'move: Firewall'); //ditto ^^^^^
				source.moveThisTurnResult = true;
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				this.damage(source.maxhp / 8, source, target);
				return null;
			},
		},
	},
	"meltdown": {
		name: "Meltdown",
		id: "meltdown",
		priority: 0,
		basePower: 75,
		category: "Special",
		type: "Flame",
		target: "any",
		desc: "20% chance of Panic.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "burnup", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 20,
		secondary: {
			chance: 20,
			volatileStatus: 'panic',
		},
	},
	"infinityburn": {
		name: "Infinity Burn",
		id: "infinityburn",
		priority: 0,
		basePower: 95,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "vcreate", target);
		},
		flags: {protect: 1, mirror: 1},
		pp: 15,
		accuracy: 95,
	},
	"prominencebeam": {
		name: "Prominence Beam",
		id: "prominencebeam",
		priority: 0,
		basePower: 100,
		category: "Special",
		type: "Flame",
		target: "any",
		desc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "solarbeam", target);
		},
		flags: {protect: 1, mirror: 1},
		pp: 10,
		accuracy: 95,
	},
	"hailspear": {
		name: "Hail Spear",
		id: "hailspear",
		basePower: 45,
		priority: 0,
		category: "Physical",
		type: "Aqua",
		target: "normal",
		desc: "20% chance of Flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "iceshard", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 30,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
	},
	"waterblitz": {
		name: "Water Blitz",
		id: "waterblitz",
		basePower: 50,
		priority: 0,
		category: "Special",
		type: "Aqua",
		target: "allAdjacentFoes",
		desc: "Raises user's Speed 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "dive", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 20,
		secondary: false,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			this.boost({spe: 1}, pokemon, pokemon, move);
		},
	},
	"winterblast": {
		name: "Winter Blast",
		id: "winterblast",
		basePower: 65,
		priority: 0,
		category: "Physical",
		type: "Aqua",
		target: "allAdjacentFoes",
		desc: "15% chance of Flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hail", target);
			this.add('-anim', source, "avalanche", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 20,
		secondary: {
			chance: 15,
			volatileStatus: 'flinch',
		},
	},
	"gigafreeze": {
		name: "Giga Freeze",
		id: "gigafreeze",
		basePower: 70,
		priority: 0,
		category: "Special",
		type: "Aqua",
		pp: 20,
		target: "any",
		desc: "20% chance of Dot.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "freezedry", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		secondary: {
			chance: 20,
			volatileStatus: 'dot',
		},
	},
	"oceanwave": {
		name: "Ocean Wave",
		id: "oceanwave",
		priority: 0,
		basePower: 80,
		category: "Special",
		type: "Aqua",
		target: "allAdjacent",
		desc: "25% chance of lowering target's Speed 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "surf", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 10,
		secondary: {
			chance: 25,
			boosts: {spe: -1},
		},
	},
	"icestatue": {
		name: "Ice Statue",
		id: "icestatue",
		priority: 0,
		basePower: 80,
		category: "Physical",
		type: "Aqua",
		target: "normal",
		desc: "35% chance of Flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "sheercold", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 85,
		pp: 15,
		secondary: {
			chance: 35,
			volatileStatus: 'flinch',
		},
	},
	"aurorafreeze": {
		name: "Aurora Freeze",
		id: "aurorafreeze",
		priority: 0,
		basePower: 90,
		category: "Special",
		type: "Aqua",
		target: "allAdjacentFoes",
		desc: "Takes a turn to charge. 15% chance of Dot.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "iceburn", target);
		},
		flags: {protect: 1, mirror: 1, recharge: 1},
		accuracy: 95,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			pokemon.addVolatile('mustrecharge');
		},
		pp: 10,
		secondary: {
			chance: 15,
			volatileStatus: 'dot',
		},
	},
	"wingshoes": {
		name: "Wing Shoes",
		id: "wingshoes",
		priority: 0,
		basePower: 0,
		category: "Status",
		type: "Air",
		target: "allySide",
		desc: "Raises target's Speed 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "magnetrise", target);
		},
		flags: {},
		pp: 15,
		accuracy: 100,
		onHitSide: function (side) {
			for (let pokemon of side.active) {
				if (pokemon) this.boost({spe: 1}, pokemon);
			}
		},
	},
	"staticelectricity": {
		name: "Static Electricity",
		id: "staticelectricity",
		priority: 1,
		basePower: 40,
		category: "Physical",
		type: "Air",
		target: "normal",
		desc: "Priority +1. 10% chance of Flinch.",
		pp: 30,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spark", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
	},
	"windcutter": {
		name: "Wind Cutter",
		id: "windcutter",
		priority: 0,
		basePower: 50,
		category: "Special",
		type: "Air",
		target: "any",
		desc: "No additional effect.",
		pp: 35,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "airslash", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
	},
	"confusedstorm": {
		name: "Confused Storm",
		id: "confusedstorm",
		priority: 0,
		basePower: 65,
		category: "Special",
		type: "Air",
		target: "allAdjacent",
		desc: "10 chance of Confusion.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "featherdance", target);
			this.add('-anim', source, "megapunch", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 20,
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
	},
	"electriccloud": {
		name: "Electric Cloud",
		id: "electriccloud",
		priority: -1,
		basePower: 80,
		category: "Special",
		type: "Air",
		target: "any",
		desc: "Priority -1. 25% chance of lowering target's Speed 1 stage.",
		pp: 16,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "discharge", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 100,
		secondary: {
			chance: 25,
			boosts: {spe: -1},
		},
	},
	"megalospark": {
		name: "Megalo Spark",
		id: "megalospark",
		basePower: 85,
		priority: 0,
		category: "Physical",
		type: "Air",
		target: "any",
		desc: "10% chance of Flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "boltstrike", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 10,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
	},
	"thunderjustice": {
		name: "Thunder Justice",
		id: "thunderjustice",
		priority: 0,
		basePower: 90,
		pp: 10,
		category: "Special",
		type: "Air",
		target: "any",
		desc: "Never misses.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "stokedsparksurfer", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
	},
	"earthcoat": {
		name: "Earth Coat",
		id: "earthcoat",
		basePower: 0,
		priority: 0,
		category: "Status",
		type: "Nature",
		target: "allySide",
		desc: "Raises target's Sp.Defense by 1 stage and restores status descs for active party members.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "mudsport", target);
		},
		flags: {snatch: 1},
		accuracy: 100,
		pp: 10,
		onHitSide: function (side) {
			for (let pokemon of side.active) {
				if (pokemon) {
					this.boost({spd: 1}, pokemon);
					pokemon.cureStatus();
				}
			}
		},
	},
	"massmorph": {
		name: "Mass Morph",
		id: "massmorph",
		basePower: 0,
		pp: 10,
		priority: 0,
		category: "Status",
		type: "Nature",
		target: "self",
		desc: "Raises user's Defense by 2 stages and Attack by 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "coil", target);
		},
		flags: {snatch: 1},
		accuracy: 100,
		boosts: {
			def: 2,
			atk: 1,
		},
	},
	"charmperfume": {
		name: "Charm Perfume",
		id: "charmperfume",
		flags: {protect: 1, mirror: 1},
		basePower: 45,
		basePowerCallback: function (pokemon, target, move) {
			if (target.status === 'psn' || target.status === 'tox') {
				return move.basePower * 2;
			}
			return move.basePower;
		},
		priority: 0,
		pp: 10,
		category: "Special",
		type: "Nature",
		target: "allAdjacentFoes",
		desc: "30% chance of Poison. Base Power doubles if target is Poisoned.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "grasswhistle", target);
		},
		accuracy: 100,
		secondary: {
			chance: 30,
			status: 'psn',
		},
	},
	"rootbind": {
		name: "Root Bind",
		id: "rootbind",
		basePower: 65,
		pp: 10,
		priority: 0,
		category: "Physical",
		type: "Nature",
		target: "normal",
		desc: "Target cannot switch out. 25% chance of lowering target's Speed by 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "grassknot", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		secondaries: [
			{
				chance: 100,
				onHit: function (target, source, move) {
					if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
				},
			},
			{
				chance: 25,
				boosts: {spe: -1},
			},
		],
	},
	"bug": {
		name: "Bug",
		id: "bug",
		pp: 20,
		basePower: 70,
		priority: 0,
		category: "Physical",
		type: "Nature",
		target: "any",
		desc: "Inflicts Bug, reversing Attribute Triangle.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "leechseed", target);
			this.add('-anim', source, "forestscurse", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 75,
		volatileStatus: 'bug',
	},
	"rockfall": {
		name: "Rock Fall",
		id: "rockfall",
		basePower: 95,
		priority: 0,
		pp: 20,
		category: "Physical",
		type: "Nature",
		target: "any",
		desc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "rockslide", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
	},
	"venomdisaster": {
		name: "Venom Disaster",
		id: "venomdisaster",
		basePower: 95,
		priority: 0,
		pp: 10,
		category: "Special",
		type: "Nature",
		target: "allAdjacent",
		desc: "20% chance of Poison.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "aciddownpour", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		secondary: {
			chance: 20,
			status: 'psn',
		},
	},
	"darkspirit": {
		name: "Dark Spirit",
		id: "darkspirit",
		basePower: 55,
		pp: 20,
		priority: 0,
		category: "Special",
		type: "Evil",
		target: "any",
		desc: "Never misses.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spiritshackle", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
	},
	"blackout": {
		name: "Blackout",
		id: "blackout",
		basePower: 60,
		priority: 0,
		category: "Physical",
		type: "Evil",
		target: "allAdjacent",
		desc: "25% chance of lowering target's accuracy 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "brutalswing", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 100,
		pp: 10,
		secondary: {
			chance: 25,
			boosts: {accuracy: -1},
		},
	},
	"evilfantasy": {
		name: "Evil Fantasy",
		id: "evilfantasy",
		basePower: 70,
		priority: 0,
		category: "Special",
		type: "Evil",
		target: "any",
		desc: "25% chance of lowering target's Defense/Sp.Defense 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "embargo", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		pp: 15,
		accuracy: 95,
		secondary: {
			chance: 25,
			boosts: {
				def: -1,
				spd: -1,
			},
		},
	},
	"chaoscloud": {
		name: "Chaos Cloud",
		id: "chaoscloud",
		basePower: 80,
		pp: 15,
		priority: -1,
		category: "Special",
		type: "Evil",
		target: "allAdjacent",
		desc: "Priority -1. 10% chance of Panic.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "trickortreat", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 90,
		secondary: {
			chance: 10,
			volatileStatus: 'panic',
		},
	},
	"shadowfall": {
		name: "Shadow Fall",
		id: "shadowfall",
		basePower: 90,
		priority: 0,
		pp: 5,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "Ignores Protect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "powertrip", target);
		},
		flags: {mirror: 1},
		accuracy: 95,
		breaksProtect: true,
	},
	"hideandseek": {
		name: "Hide and Seek",
		id: "hideandseek",
		basePower: 100,
		priority: 0,
		pp: 10,
		category: "Special",
		type: "Evil",
		target: "any",
		desc: "10% chance of Dot.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "darkvoid", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 85,
		secondary: {
			chance: 10,
			volatileStatus: 'dot',
		},
	},
	"evilsquall": {
		name: "Evil Squall",
		id: "evilsquall",
		basePower: 100,
		pp: 5,
		priority: 0,
		category: "Special",
		type: "Evil",
		target: "allAdjacent",
		desc: "25% chance of lowering target's Speed 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "blackholeeclipse", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		accuracy: 85,
		secondary: {
			chance: 25,
			boosts: {spe: -1},
		},
	},
	"saintheal": {
		name: "Saint Heal",
		id: "saintheal",
		pp: 10,
		basePower: 0,
		priority: 0,
		category: "Status",
		type: "Holy",
		target: "allySide",
		desc: "Heal 40% of max HP.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "geomancy", target);
		},
		flags: {heal: 1},
		accuracy: true,
		onHitSide: function (side) {
			let didSomething = false;
			for (let pokemon of side.active) {
				if (pokemon && this.heal(pokemon.maxhp * 4 / 10, pokemon)) didSomething = true;
			}
			return didSomething;
		},
	},
	"holybreath": {
		name: "Holy Breath",
		id: "holybreath",
		basePower: 0,
		pp: 20,
		priority: 0,
		category: "Status",
		type: "Holy",
		target: "self",
		desc: "Raises target's Speed and Sp.Defense 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "morningsun", target);
		},
		flags: {snatch: 1},
		accuracy: true,
		boosts: {
			spe: 1,
			spd: 1,
		},
	},
	"saintshield": {
		name: "Saint Shield",
		id: "saintshield",
		basePower: 0,
		priority: 3,
		pp: 10,
		category: "Status",
		type: "Holy",
		target: "allySide",
		desc: "Priority +3. User's party is Protected for one turn.",
		flags: {snatch: 1},
		accuracy: 100,
		stallingMove: true,
		sideCondition: 'saintshield',
		onPrepareHit: function (target, source, move, pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "moonlight", source);
			this.add('-anim', source, "protect", source);
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHitSide: function (side, source) {
			side.addSideCondition('sidestall');
			this.add('-message', source.name + ' has protected their side with a Saint Shield!');
		},
		effect: {
			duration: 1,
			//this is a side condition
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Saint Shield');
			},
			onTryHitPriority: 4,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect']) {
					if (move.isZ) move.zBrokeProtect = true;
					return;
				}
				this.add('-activate', target, 'move: Saint Shield');
				source.moveThisTurnResult = true;
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
	},
	"holyflash": {
		name: "Holy Flash",
		id: "holyflash",
		basePower: 55,
		pp: 30,
		priority: 1,
		category: "Special",
		type: "Holy",
		target: "allAdjacentFoes",
		desc: "Priority +1. 15% of raising user's Sp.Attack.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "fairylock", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 90,
		secondary: {
			chance: 70,
			self: {
				boosts: {spa: 1},
			},
		},
	},
	"saintray": {
		name: "Saint Ray",
		id: "saintray",
		basePower: 90,
		priority: 0,
		pp: 15,
		category: "Special",
		type: "Holy",
		target: "any",
		desc: "Never misses.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "naturesmadness", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
	},
	"holyjudgment": {
		name: "Holy Judgment",
		id: "holyjudgment",
		basePower: 100,
		pp: 15,
		priority: 0,
		category: "Physical",
		type: "Holy",
		target: "any",
		desc: "25% chance to raise user's Attack 1 stage. User takes 25% damage if this attack misses.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "supersonicskystrike", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 85,
		hasCustomRecoil: true,
		onMoveFail: function (target, source, move) {
			this.damage(source.maxhp / 4, source, source, move);
		},
		secondary: {
			chance: 25,
			self: {
				boosts: {atk: 1},
			},
		},
	},
	"shiningnova": {
		name: "Shining Nova",
		id: "shiningnova",
		basePower: 100,
		priority: 0,
		pp: 10,
		category: "Special",
		type: "Holy",
		target: "allAdjacentFoes",
		desc: "User cannot move next turn. Raises user's Defense 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "happyhour", target);
			this.add('-anim', source, "fleurcannon", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1, recharge: 1},
		accuracy: 100,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			this.boost({def: 1}, pokemon, pokemon, move);
			pokemon.addVolatile('mustrecharge');
		},
	},
	"musclecharge": {
		name: "Muscle Charge",
		id: "musclecharge",
		basePower: 0,
		priority: 0,
		category: "Status",
		type: "Battle",
		target: "self",
		desc: "Raises target's Attack and Speed 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "growth", target);
		},
		flags: {snatch: 1},
		accuracy: 100,
		pp: 20,
		boosts: {
			atk: 1,
			spe: 1,
		},
	},
	"warcry": {
		name: "War Cry",
		id: "warcry",
		basePower: 0,
		priority: 0,
		pp: 20,
		category: "Status",
		type: "Battle",
		target: "self",
		desc: "Raises target's Attack/Sp.Attack 2 stages, lowers Defense/Sp.Defense 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nobleroar", target);
			this.add('-anim', source, "encore", target);
		},
		flags: {snatch: 1},
		accuracy: 100,
		boosts: {
			atk: 2,
			spa: 2,
			def: -2,
			spd: -2,
		},
	},
	"sonicjab": {
		name: "Sonic Jab",
		id: "sonicjab",
		basePower: 65,
		priority: 1,
		pp: 30,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "Priority+1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "machpunch", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
	},
	"fightingaura": {
		name: "Fighting Aura",
		id: "fightingaura",
		basePower: 70,
		priority: 0,
		pp: 15,
		category: "Special",
		type: "Battle",
		target: "allAdjacentFoes",
		desc: "10% chance to raise user's Attack by 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "focusblast", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		secondary: {
			chance: 10,
			self: {
				boosts: {atk: 1},
			},
		},
	},
	"reboundstrike": {
		name: "Rebound Strike",
		id: "reboundstrike",
		basePower: 95,
		priority: -3,
		pp: 20,
		category: "Physical",
		type: "Battle",
		target: "scripted",
		desc: "This move targets the foe who last damaged the user. The move fails if the user was not attacked this turn. Has a 20% chance to confuse the target.",
		shortDesc: "Attacks the foe who last damaged it. 20% Cfs.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "frustration", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 100,
		beforeTurnCallback: function (pokemon) {
			pokemon.addVolatile('reboundstrike');
		},
		onTryHit: function (target, source, move) {
			if (!source.volatiles['reboundstrike']) return false;
			if (source.volatiles['reboundstrike'].position === null) return false;
		},
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		effect: {
			duration: 1,
			noCopy: true,
			onStart: function () {
				this.effectData.position = null;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget: function (target, source) {
				if (source !== this.effectData.target) return;
				return source.side.foe.active[this.effectData.position];
			},
			onDamagePriority: -101,
			onDamage: function (damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && source.side !== target.side) {
					this.effectData.position = source.position;
				}
			},
		},
	},
	"busterdrive": {
		name: "Buster Drive",
		id: "busterdrive",
		basePower: 100,
		priority: 0,
		pp: 10,
		category: "Physical",
		type: "Battle",
		target: "any",
		desc: "Takes 1 turn to charge up. 75% chance of Flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "happyhour", source);
			//this.add('-anim', source, "takedown", target);
		},
		flags: {protect: 1, mirror: 1, charge: 1},
		accuracy: 95,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				this.attrLastMove('[still]');
				this.add('-anim', attacker, "takedown", defender);
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			this.add('-message', attacker.name + ' is charging up for an attack!');
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				attacker.removeVolatile(move.id);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: {
			chance: 75,
			volatileStatus: 'flinch',
		},
	},
	"megatonpunch": {
		name: "Megaton Punch",
		id: "megatonpunch",
		basePower: 100,
		priority: 0,
		pp: 15,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "15% chance of Flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "focuspunch", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 90,
		secondary: {
			chance: 15,
			volatileStatus: 'flinch',
		},
	},
	"mechanicalclaw": {
		name: "Mechanical Claw",
		id: "mechanicalclaw",
		basePower: 15,
		priority: 0,
		pp: 30,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "Hits 2-5 times.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gearup", target);
			this.add('-anim', source, "cut", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		multihit: [2, 5],
	},
	"upgrade": {
		name: "Upgrade",
		id: "upgrade",
		basePower: 0,
		priority: -1,
		pp: 20,
		category: "Status",
		type: "Mech",
		target: "self",
		desc: "Priority-1. Raises target's Attack,Defense, Sp.Attack,Speed by 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gearup", target);
			this.add('-anim', source, "conversion", target);
		},
		flags: {},
		accuracy: true,
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spe: 1,
		},
	},
	"reverseprogram": {
		name: "Reverse Program",
		id: "reverseprogram",
		basePower: 0,
		priority: 0,
		pp: 35,
		category: "Status",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Inflicts Bug, reversing Attribute Triangle.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gravity", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		volatileStatus: 'bug',
	},
	"antiattackfield": {
		name: "Anti-Attack Field",
		id: "antiattackfield",
		basePower: 70,
		priority: 0,
		pp: 10,
		category: "Special",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Damages Foes. Raises all allies' Defense by 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "storedpower", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		onAfterMoveSecondarySelf: function (source, target, move) {
			for (let pokemon of source.side.active) {
				if (pokemon) this.boost({def: 1}, pokemon, source);
			}
		},
	},
	"gigawattlaser": {
		name: "Gigawatt Laser",
		id: "gigawattlaser",
		basePower: 80,
		priority: 1,
		pp: 30,
		category: "Special",
		type: "Mech",
		target: "any",
		desc: "Priority+1. User must skip next turn to cool down.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "mirrorshot", target);
		},
		flags: {protect: 1, mirror: 1, recharge: 1},
		accuracy: 90,
		self: {
			volatileStatus: 'mustrecharge',
		},
	},
	"deleteprogram": {
		name: "Delete Program",
		id: "deleteprogram",
		basePower: 90,
		priority: 0,
		pp: 10,
		category: "Physical",
		type: "Mech",
		target: "any",
		desc: "15% chance of Dot.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "endeavor", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		secondary: {
			chance: 15,
			volatileStatus: 'dot',
		},
	},
	"dgdimension": {
		name: "DG Dimension",
		id: "dgdimension",
		basePower: 90,
		priority: -1,
		pp: 15,
		category: "Special",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Priority-1. 10% chance of Dot.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "searingsunrazesmash", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		secondary: {
			chance: 10,
			volatileStatus: 'dot',
		},
	},
	"cootieskick": {
		name: "Cooties Kick",
		id: "cootieskick",
		basePower: 10,
		priority: 0,
		pp: 30,
		category: "Physical",
		type: "Filth",
		target: "normal",
		desc: "Hits 2-5 times. 10% chance of Poison.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "firstimpression", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 100,
		multihit: [2, 5],
		secondary: {
			chance: 10,
			status: 'psn',
		},
	},
	"superstinkyjet": {
		name: "Super Stinky Jet",
		id: "superstinkyjet",
		basePower: 30,
		priority: 0,
		pp: 20,
		category: "Special",
		type: "Filth",
		target: "allAdjacentFoes",
		desc: "10% chance of Flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "acidarmor", target);
			this.add('-anim', source, "smog", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
	},
	"pooptoss": {
		accuracy: 95,
		basePower: 35,
		category: "Physical",
		desc: "For 3 turns, the target can't use status moves.",
		id: "pooptoss",
		name: "Poop Toss",
		priority: 0,
		pp: 15,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nastyplot", target);
			this.add('-anim', source, "toxic", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			volatileStatus: 'taunt',
		},
		target: "any",
		type: "Filth",
	},
	"poopattackfield": {
		name: "Poop Attack Field",
		id: "poopattackfield",
		basePower: 50,
		priority: 0,
		pp: 20,
		category: "Special",
		type: "Filth",
		target: "allAdjacent",
		desc: "15% chance of Poison. Raises user's Defense by 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gunkshot", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 80,
		secondaries: [
			{
				chance: 15,
				status: 'psn',
			},
			{
				chance: 100,
				self: {
					boosts: {def: 1},
				},
			},
		],
	},
	"poopfling": {
		name: "Poop Fling",
		id: "poopfling",
		basePower: 15,
		priority: 0,
		pp: 30,
		category: "Physical",
		type: "Filth",
		target: "any",
		desc: "Hits 2-5 times. 5% chance of Confusion.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nastyplot", target);
			this.add('-anim', source, "sludgebomb", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		multihit: [2, 5],
		secondary: {
			chance: 5,
			volatileStatus: 'confusion',
		},
	},
	"guerillapoop": {
		name: "Guerilla Poop",
		id: "guerillapoop",
		basePower: 75,
		priority: 0,
		pp: 15,
		category: "Physical",
		type: "Filth",
		target: "any",
		desc: "30% chance to lower target's Speed 2 stages.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "banefulbunker", target);
			this.add('-anim', source, "sludgebomb", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		secondary: {
			chance: 30,
			boosts: {spe: -2},
		},
	},
	"extremepoopdeath": {
		name: "Extreme Poop Death",
		id: "extremepoopdeath",
		basePower: 85,
		priority: 0,
		pp: 5,
		category: "Special",
		type: "Filth",
		target: "allAdjacentFoes",
		desc: "10% chance of Poison. 5% chance of Flinch. 20% chance to lower target's Speed 1 stage.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nastyplot", target);
			this.add('-anim', source, "aciddownpour", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		secondaries: [
			{
				chance: 10,
				status: 'psn',
			},
			{
				chance: 5,
				volatileStatus: 'flinch',
			},
			{
				chance: 20,
				boosts: {spe: -1},
			},
		],
	},
	//Status Attacks
	"panicattack": {
		accuracy: true,
		basePower: 40,
		category: "Physical",
		desc: "No additional effects.",
		secondary: false,
		onModifyMove: function (move) {
			move.type = '???';
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-message', source.name + ' is in a panic!');
			this.add('-anim', source, "Tackle", target);
		},
		id: "panicattack",
		name: "Panic Attack",
		pp: 35,
		priority: 0,
		flags: {protect: 1},
		target: "randomNormal",
		type: "Battle",
	},
	"dotbeam": {
		accuracy: true,
		basePower: 40,
		category: "Physical",
		desc: "No additional effects.",
		shortDesc: "No additional effects.",
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "signalbeam", target);
		},
		onModifyMove: function (move) {
			move.type = '???';
		},
		id: "dotbeam",
		name: "Dot Beam",
		pp: 35,
		priority: 0,
		flags: {protect: 1},
		target: "normal",
		type: "Mech",
	},
};
