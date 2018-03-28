'use strict';

exports.BattleMovedex = {
	"acidbubble": {
		accuracy: 90,
		basePower: 90,
		category: "Special",
		desc: "25% chance to flinch the target.",
		shortDesc: "25% chance to flinch the target.",
		id: "acidbubble",
		name: "Acid Bubble",
		pp: 45,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "pepperbreath",
		name: "Pepper Breath",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "ember", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Flame",
	},
	"nemesisivy": {
		accuracy: 100,
		basePower: 142,
		category: "Physical",
		desc: "User recovers 50% of the damage dealt. 1.3 HP if Big Root is held by the user.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "nemesisivy",
		name: "Nemesis Ivy",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Special",
		desc: "20% chance to paralyze the target.",
		shortDesc: "20% chance to paralyze the target.",
		id: "electricshock",
		name: "Electric Shock",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 120,
		category: "Special",
		desc: "100% chance to raise the user's Special Attack by 1.",
		shortDesc: "Raises the user's Sp.Atk by 1.",
		id: "spiraltwister",
		name: "Spiral Twister",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 157,
		category: "Physical",
		desc: "100% chance to lower the target's Special Defense by 1.",
		shortDesc: "Lowers the target's Sp.Def by 1.",
		id: "preciousflame",
		name: "Precious Flame",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 135,
		category: "Physical",
		desc: "User recovers 50% of the damage dealt to foes. 1.3 HP if Big Root is held by the user. Hits all adjacent foes.",
		shortDesc: "User recovers 50% of the damage dealt to foes.",
		id: "demidart",
		name: "Demi Dart",
		pp: 3,
		noPPBoosts: true,
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
		desc: "Poisons the target. Does not check accuracy.",
		shortDesc: "Poisons the target. Does not check accuracy.",
		id: "wormvenom",
		name: "Worm Venom",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 172,
		category: "Physical",
		desc: "50% chance to raise the user’s Defense by 2.",
		shortDesc: "50% chance to raise the user’s Def by 2.",
		id: "metalcannon",
		name: "Metal Cannon",
		pp: 2,
		noPPBoosts: true,
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
		basePower: 82,
		category: "Special",
		desc: "Hits 2 times in one turn.",
		shortDesc: "Hits 2 times in one turn.",
		id: "superthunderstrike",
		name: "Super Thunder Strike",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 157,
		category: "Physical",
		desc: "100% chance to lower the target’s Defense by 1.",
		shortDesc: "Lowers the target’s Def by 1.",
		id: "blueblaster",
		name: "Blue Blaster",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Physical",
		desc: "30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "goblinstrike",
		name: "Goblin Strike",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 60,
		category: "Physical",
		desc: "Hits adjacent foe(s) 2-3 times in one turn. Hits all adjacent foes.",
		shortDesc: "Hits adjacent foe(s) 2-3 times in one turn.",
		id: "marchingfishes",
		name: "Marching Fishes",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Physical",
		desc: "100% chance to raise the user’s Defense by 1.",
		shortDesc: "Raises the user’s Def by 1.",
		id: "rockfist",
		name: "Rock Fist",
		pp: 5,
		noPPBoosts: true,
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
		desc: "Paralyzes the target. Does not check accuracy.",
		shortDesc: "Paralyzes the target. Does not check accuracy.",
		id: "electricthread",
		name: "Electric Thread",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 142,
		category: "Special",
		desc: "75% chance to force the target to randomly switch. The target will fail to switch if they have fainted, have used Ingrain, have the Suction Cups ability or is using a substitute.",
		shortDesc: "75% chance to force the target to randomly switch.",
		id: "aquatower",
		name: "Aqua Tower",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "watergun", target);
		},
		flags: {protect: 1, mirror: 1},
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
		basePower: 60,
		category: "Physical",
		desc: "Hits 1-3 times in one turn.",
		shortDesc: "Hits 1-3 times in one turn.",
		id: "tropicalbeak",
		name: "Tropical Beak",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 120,
		category: "Special",
		desc: "20% chance to put the target to sleep.",
		shortDesc: "20% chance to put the target to sleep.",
		id: "lullabybubble",
		name: "Lullaby Bubble",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 157,
		category: "Physical",
		desc: "50% chance to poison the target. 1.3 HP if Big Root is held by the user.",
		shortDesc: "50% chance to poison the target.",
		id: "poisonivy",
		name: "Poison Ivy",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 120,
		category: "Special",
		desc: "50% chance to raise the user’s Speed by 2.",
		shortDesc: "50% chance to raise the user’s Speed by 2.",
		id: "boombubble",
		name: "Boom Bubble",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 37,
		category: "Physical",
		desc: "Hits 2-5 times in one turn.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "eternalslapping",
		name: "Eternal Slapping",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 157,
		category: "Physical",
		desc: "100% chance to lower the target’s Defense by 1.",
		shortDesc: "Lowers the target’s Def by 1.",
		id: "coloredsparkle",
		name: "Colored Sparkle",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 187,
		category: "Special",
		desc: "Ignores target’s stat changes. 50% paralyze chance, is a sound move.",
		shortDesc: "Ignores target’s stat changes. 50% paralyze chance.",
		id: "puppyhowl",
		name: "Puppy Howl",
		pp: 2,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Physical",
		desc: "30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "dancingbone",
		name: "Dancing Bone",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "littleblizzard",
		name: "Little Blizzard",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Physical",
		desc: "30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "snowgobbolt",
		name: "Snowgob Bolt",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "supershocker",
		name: "Super Shocker",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 157,
		category: "Physical",
		desc: "100% chance to lower the target's Special Defense by 1.",
		shortDesc: "Lowers the target's Sp.Def by 1.",
		id: "plasticblaze",
		name: "Plastic Blaze",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 120,
		category: "Special",
		desc: "50% chance to raise the user's Special Attack by 2.",
		shortDesc: "50% chance to raise the user's Sp.Atk by 2.",
		id: "evilspell",
		name: "Evil Spell",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Special",
		desc: "50% chance to raise Speed by 2. Hits all adjacent foes.",
		shortDesc: "50% chance to raise Speed by 2.",
		id: "spinningneedle",
		name: "Spinning Needle",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "aeroblast", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			if (this.random(100) < 50) this.boost({spe: 2}, pokemon, pokemon, move);
		},
		target: "allAdjacentFoes",
		type: "Air",
	},
	"scarredeye": {
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Causes the foe(s) to flinch. Hits all adjacent foes.",
		shortDesc: "Causes the foe(s) to flinch.",
		id: "scarredeye",
		name: "Scar-Red Eye",
		pp: 3,
		noPPBoosts: true,
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
			this.add('-message', target.name + ' is disrupted!');
		},
		target: "normal",
		type: "Flame",
	},
	"handoffate": {
		accuracy: 90,
		basePower: 157,
		category: "Physical",
		desc: "50% chance to raise the user’s Attack and Special Attack by 2.",
		shortDesc: "50% chance to raise the user’s Atk and Sp.Atk by 2.",
		id: "handoffate",
		name: "Hand Of fate",
		pp: 3,
		noPPBoosts: true,
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
		desc: "Does damage equal to 1/2 target’s current HP. 1.3 HP if Big Root is held by the user.",
		shortDesc: "Does damage equal to 1/2 target’s current HP.",
		id: "evilcharm",
		name: "Evil Charm",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Special",
		desc: "100% chance to raise the user's Speed by 1. Hits all adjacent foes.",
		shortDesc: "Raises the user's Speed by 1.",
		id: "meteorwing",
		name: "Meteor Wing",
		pp: 5,
		noPPBoosts: true,
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
		damage: 225,
		category: "Physical",
		desc: "Priority +1, always does 150 HP of damage. 80% flinch chance.",
		shortDesc: "Priority +1, always does 150 HP of damage. 80% flinch chance.",
		id: "darkpaw",
		name: "Dark Paw",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Special",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "solarray",
		name: "Solar Ray",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Physical",
		desc: "100% chance to lower the target's Special Defense by 1.",
		shortDesc: "Lowers the target's Sp.Def by 1.",
		id: "variabledarts",
		name: "Variable Darts",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 135,
		category: "Special",
		desc: "30% chance to confuse the target.",
		shortDesc: "30% chance to confuse the target.",
		id: "dreadfire",
		name: "Dread Fire",
		pp: 5,
		noPPBoosts: true,
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
	"deathhand": {
		accuracy: 95,
		basePower: 180,
		category: "Special",
		desc: "User recovers 50% of the damage dealt. 1.3 HP if Big Root is held by the user.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "deathhand",
		name: "Death Hand",
		pp: 2,
		noPPBoosts: true,
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
		basePower: 135,
		category: "Special",
		desc: "20% chance to put the target to sleep.",
		shortDesc: "20% chance to put the target to sleep.",
		id: "pulseblast",
		name: "Pulse Blast",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 180,
		category: "Physical",
		desc: "50% chance to raise the user's Attack by 2.",
		shortDesc: "50% chance to raise the user's Atk by 2.",
		id: "powermetal",
		name: "Power Metal",
		pp: 2,
		noPPBoosts: true,
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
		basePower: 135,
		category: "Physical",
		desc: "Ignores target’s stat changes.",
		shortDesc: "Ignores target’s stat changes.",
		id: "drillspin",
		name: "Drill Spin",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 135,
		category: "Special",
		desc: "100% chance to lower the target's Special Defense by 1.",
		shortDesc: "Lowers the target's Sp.Def by 1.",
		id: "blazebuster",
		name: "Blaze Buster",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 127,
		category: "Physical",
		desc: "80% chance to flinch the target.",
		shortDesc: "80% chance to flinch the target.",
		id: "subzeroicepunch",
		name: "Sub Zero Ice Punch",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "evilhurricane",
		name: "Evil Hurricane",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "roost", source);
			this.add('-anim', source, "megapunch", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Air",
	},
	"howlingblaster": {
		accuracy: 100,
		basePower: 157,
		category: "Special",
		desc: "50% chance to raise the user’s Speed by 2.",
		shortDesc: "50% chance to raise the user’s Speed by 2.",
		id: "howlingblaster",
		name: "Howling Blaster",
		pp: 3,
		noPPBoosts: true,
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
		damage: 225,
		category: "Physical",
		desc: "Always does 150 HP damage. 80% chance to confuse.",
		shortDesc: "Always does 150 HP damage. 80% chance to confuse.",
		id: "lightningpaw",
		name: "Lightning Paw",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 120,
		category: "Special",
		desc: "30% chance to put the target to sleep, is a sound move.",
		shortDesc: "30% chance to put the target to sleep.",
		id: "symphonycrusher",
		name: "Symphony Crusher",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 37,
		category: "Physical",
		desc: "30% chance to confuse or paralyze the target.",
		shortDesc: "30% chance to confuse or paralyze the target.",
		id: "hypersmell",
		name: "Hyper Smell",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nastyplot", source);
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
		basePower: 172,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "megaflame",
		name: "Mega Flame",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 135,
		category: "Physical",
		desc: "This move does not check accuracy. Hits all adjacent foes.",
		shortDesc: "This move does not check accuracy.",
		id: "guardianbarrage",
		name: "Guardian Barrage",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gearup", source);
			this.add('-anim', source, "twineedle", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Mech",
	},
	"chaosblaster": {
		accuracy: 100,
		basePower: 157,
		category: "Special",
		desc: "50% chance to raise the user’s Speed by 2.",
		shortDesc: "50% chance to raise the user’s Speed by 2.",
		id: "chaosblaster",
		name: "Chaos Blaster",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "snowpunch",
		name: "Snow Punch",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 180,
		category: "Physical",
		desc: "Ignores target’s stat changes.",
		shortDesc: "Ignores target’s stat changes.",
		id: "frozenclaw",
		name: "Frozen Claw",
		pp: 2,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Physical",
		desc: "100% chance to raise the user’s Defense by 1.",
		shortDesc: "Raises the user’s Def by 1.",
		id: "iceballbomb",
		name: "Iceball Bomb",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Physical",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "harpoontorpedo",
		name: "Harpoon Torpedo",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "shellsmash", source);
			this.add('-anim', source, "pinmissile", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "any",
		type: "Mech",
	},
	"junglebone": {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Hits 2 times in one turn.",
		shortDesc: "Hits 2 times in one turn.",
		id: "junglebone",
		name: "Jungle Bone",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 172,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "electroshocker",
		name: "Electro Shocker",
		pp: 3,
		noPPBoosts: true,
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
		desc: "Paralyzes the foe(s). Hits all adjacent foes.",
		shortDesc: "Paralyzes the foe(s).",
		id: "frozenfireshot",
		name: "Frozen Fire Shot",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Physcial",
		desc: "Ignores target’s stat changes.",
		shortDesc: "Ignores target’s stat changes.",
		id: "scissorclaw",
		name: "Scissor Claw",
		pp: 2,
		noPPBoosts: true,
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
		basePower: 180,
		category: "Physical",
		desc: "100% chance to raise the user's Attack by 1.",
		shortDesc: "Raises the user's Atk by 1.",
		id: "fistofthebeastking",
		name: "Fist of the Beast King",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 45,
		category: "Physical",
		desc: "Hits 2-5 times in one turn.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "xscratch",
		name: "X Scratch",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Physical",
		desc: "50% chance to raise the user's Attack by 2.",
		shortDesc: "50% chance to raise the user's Atk by 2.",
		id: "burningfist",
		name: "Burning Fist",
		pp: 3,
		noPPBoosts: true,
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
		damage: 225,
		category: "Physical",
		desc: "Always does 150 HP damage. 80% chance to poison.",
		shortDesc: "Always does 150 HP damage. 80% chance to poison.",
		id: "catclaw",
		name: "Cat Claw",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 67,
		category: "Physical",
		desc: "Hits 2 times in one turn.",
		shortDesc: "Hits 2 times in one turn.",
		id: "boneboomerang",
		name: "Bone Boomerang",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Physical",
		desc: "No additional effect. Hits all adjacent foes.",
		shortDesc: "No additional effect.",
		id: "volcanicstrike",
		name: "Volcanic Strike",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 120,
		category: "Special",
		desc: "20% chance to put the foe(s) to sleep. Hits all adjacent foes.",
		shortDesc: "20% chance to put the foe(s) to sleep.",
		id: "mindfog",
		name: "Mind Fog",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 127,
		category: "Special",
		desc: "80% chance to flinch the target.",
		shortDesc: "80% chance to flinch the target.",
		id: "mudball",
		name: "Mud Ball",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 112,
		category: "Physical",
		desc: "100% chance to lower the target's Defense by 2.",
		shortDesc: "Lowers the target's Def by 2.",
		id: "poopdunk",
		name: "Poop Dunk",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "acidarmor", source);
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
		basePower: 150,
		category: "Physical",
		desc: "50% chance to lower the target’s accuracy by 2.",
		shortDesc: "50% chance to lower the target’s accuracy by 2.",
		id: "dancingleaves",
		name: "Dancing Leaves",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 135,
		category: "Physical",
		desc: "Ignores target’s stat changes.",
		shortDesc: "Ignores target’s stat changes.",
		id: "fakedrillspin",
		name: "Fake Drill Spin",
		pp: 3,
		noPPBoosts: true,
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
		basePower: 105,
		category: "Physical",
		desc: "100% chance to lower the target's Attack by 2.",
		shortDesc: "Lowers the target's Atk by 2.",
		id: "numesludge",
		name: "Nume Sludge",
		pp: 5,
		noPPBoosts: true,
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
		basePower: 165,
		priority: 0,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "shadowpunch", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
	},
	"firefeather": {
		name: "Fire Feather",
		id: "firefeather",
		basePower: 165,
		priority: 0,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "50% chance of raising the user's Attack and Special Attack  by 2.",
		shortDesc: "50% chance of raising the user's Atk and Sp.Atk by 2",
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
		noPPBoosts: true,
	},
	"raremetalpoop": {
		name: "Rare Metal Poop",
		id: "raremetalpoop",
		basePower: 120,
		priority: 0,
		category: "Physical",
		type: "Filth",
		target: "normal",
		desc: "Forces the target to switch to a random ally.",
		shortDesc: "Forces the target to switch to a random ally.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "rockpolish", source);
			this.add('-anim', source, "acid", target);
		},
		flags: {protect: 1, mirror: 1},
		forceSwitch: true,
		accuracy: 95,
		pp: 5,
		noPPBoosts: true,
	},
	"chilipepperpummel": {
		name: "Chili Pepper Pummel",
		id: "chilipepperpummel",
		basePower: 105,
		priority: 0,
		category: "Special",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "50% chance to lower the foe(s) accuracy by 2. Hits all adjacent foes.",
		shortDesc: "50% chance to lower the foe(s) accuracy by 2.",
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
		noPPBoosts: true,
	},
	"antidigibeam": {
		name: "Anti-Digi Beam",
		id: "antidigibeam",
		basePower: 0,
		priority: 0,
		category: "Status",
		type: "Mech",
		target: "normal",
		desc: "Dots the Target.",
		shortDesc: "Dots the Target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "anchorshot", target);
		},
		flags: {protect: 1, mirror: 1},
		volatileStatus: "dot",
		accuracy: 90,
		pp: 2,
		noPPBoosts: true,
	},
	"nightroar": {
		name: "Night Roar",
		id: "nightroar",
		basePower: 150,
		priority: 0,
		category: "Physical",
		type: "Air",
		target: "allAdjacentFoes",
		desc: "Raises the user’s Speed by 1. Hits adjacent foes.",
		shortDesc: "Raises the user’s Speed by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "ominouswind", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		accuracy: 95,
		pp: 5,
		noPPBoosts: true,
		secondary: false,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			this.boost({spe: 1}, pokemon, pokemon, move);
		},
	},
	"stunray": {
		name: "Stun Ray",
		id: "stunray",
		basePower: 150,
		priority: 0,
		category: "Special",
		type: "Nature",
		target: "any",
		desc: "30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "bugbuzz", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
	},
	"iceblast": {
		name: "Ice Blast",
		id: "iceblast",
		basePower: 157,
		priority: 0,
		category: "Special",
		type: "Aqua",
		target: "any",
		desc: "100% chance to lower the target’s Speed by 1.",
		shortDesc: "Lowers the target’s Speed by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "watershuriken", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 100,
			boosts: {spe: -1},
		},
	},
	"hydropressure": {
		name: "Hydro Pressure",
		id: "hydropressure",
		basePower: 120,
		priority: 0,
		category: "Special",
		type: "Aqua",
		target: "allAdjacent",
		desc: "20% chance to force the foe(s) to randomly switch. Hits all adjacent foes.",
		shortDesc: "20% chance to force the foe(s) to randomly switch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hydropump", target);
		},
		secondary: {
			chance: 20,
			onHit: function (target, source, move) {
				move.forceSwitch = true;
			},
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
	},
	"lustershot": {
		name: "Luster Shot",
		id: "lustershot",
		basePower: 135,
		priority: 1,
		category: "Special",
		type: "Holy",
		target: "any",
		desc: "Priority +1, does not check accuracy.",
		shortDesc: "Priority +1, does not check accuracy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "moonblast", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: true,
		pp: 3,
		noPPBoosts: true,
	},
	"necromagic": {
		name: "Necro Magic",
		id: "necromagic",
		basePower: 0,
		priority: 0,
		category: "Special",
		type: "Evil",
		target: "normal",
		desc: "OHKOs the target. Fails if user is a lower level.",
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hex", target);
		},
		flags: {protect: 1, mirror: 1},
		ohko: true,
		accuracy: 30,
		pp: 3,
		noPPBoosts: true,
	},
	"poop": {
		name: "Poop",
		id: "poop",
		basePower: 105,
		priority: 0,
		category: "Physical",
		type: "Filth",
		target: "normal",
		desc: "100% chance to lower the target’s Speed by 2.",
		shortDesc: "Lowers the target’s Speed by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "acid", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 5,
		noPPBoosts: true,
		secondary: {
			chance: 100,
			boosts: {spe: -2},
		},
	},
	"hypercannon": {
		name: "Hyper Cannon",
		id: "hypercannon",
		priority: 0,
		basePower: 240,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "User cannot move next turn.",
		shortDesc: "User cannot move next turn.",
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
		noPPBoosts: true,
	},
	"needlespray": {
		name: "Needle Spray",
		id: "needlespray",
		basePower: 135,
		priority: 0,
		category: "Physical",
		type: "Nature",
		target: "allAdjacentFoes",
		desc: "30% chance to paralyze the foe(s). Hits all adjacent foes.",
		shortDesc: "30% chance to paralyze the foe(s).",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "seedflare", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 5,
		noPPBoosts: true,
		secondary: {
			chance: 30,
			status: 'par',
		},
	},
	"blazeblaster": {
		name: "Blaze Blaster",
		id: "blazeblaster",
		priority: 0,
		basePower: 150,
		category: "Physical",
		type: "Flame",
		target: "any",
		desc: "High critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "fireblast", target);
		},
		flags: {protect: 1, mirror: 1, defrost: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		critRatio: 2,
	},
	"aerialattack": {
		name: "Aerial Attack",
		id: "aerialattack",
		priority: 1,
		basePower: 135,
		category: "Special",
		type: "Holy",
		target: "any",
		desc: "Priority +1, high critical hit ratio.",
		shortDesc: "Priority +1, high critical hit ratio.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "moonblast", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
		critRatio: 2,
	},
	"sweetbreath": {
		name: "Sweet Breath",
		id: "sweetbreath",
		priority: 0,
		basePower: 105,
		category: "Special",
		type: "Nature",
		target: "allAdjacentFoes",
		desc: "100% chance to lower the foe(s) evasion by 2. Hits all adjacent foes.",
		shortDesc: "Lowers the foe(s) evasion by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "smog", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 95,
		pp: 5,
		noPPBoosts: true,
		secondary: {
			chance: 100,
			boosts: {evasion: -2},
		},
	},
	"deadlyweed": {
		name: "Deadly Weed",
		id: "deadlyweed",
		priority: 0,
		basePower: 105,
		category: "Special",
		type: "Nature",
		target: "normal",
		desc: "50% chance to lower the target’s Speed and accuracy by 2.",
		shortDesc: "50% chance to lower the target’s Speed and accuracy by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "grasspledge", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 5,
		noPPBoosts: true,
		secondary: {
			chance: 50,
			boosts: {spe: -2, accuracy: -2},
		},
	},
	"thunderray": {
		name: "Thunder Ray",
		id: "thunderray",
		priority: 0,
		basePower: 150,
		category: "Special",
		type: "Air",
		target: "normal",
		desc: "30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "thunderbolt", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 30,
			status: 'par',
		},
	},
	"spiralsword": {
		name: "Spiral Sword",
		id: "spiralsword",
		priority: 0,
		basePower: 165,
		category: "Special",
		type: "Mech",
		target: "any",
		desc: "High critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "charge", source);
			this.add('-anim', source, "secretsword", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
		critRatio: 2,
	},
	"celestialarrow": {
		name: "Celestial Arrow",
		id: "celestialarrow",
		priority: 0,
		basePower: 165,
		category: "Special",
		type: "Holy",
		target: "any",
		desc: "Ignores target’s stat changes. This move does not check accuracy.",
		shortDesc: "Ignores target’s stat changes. This move does not check accuracy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "extremeevoboost", source);
			this.add('-anim', source, "spikecannon", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 3,
		noPPBoosts: true,
		ignoreDefensive: true,
		ignoreEvasion: true,
	},
	"vampirewave": {
		name: "Vampire Wave",
		id: "vampirewave",
		priority: 0,
		basePower: 150,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "User gains 50% HP dealt. 50% chance to confuse. 1.3 HP if Big Root is held by the user.",
		shortDesc: "User gains 50% HP dealt. 50% chance to confuse.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "bite", target);
			this.add('-anim', source, "drainingkiss", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
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
		basePower: 172,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "100% chance to raise the user’s Speed by 2.",
		shortDesc: "Raises the user’s Speed by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "cosmicpower", source);
			this.add('-anim', source, "highjumpkick", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 2,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "100% chance to raise the user’s Attack by 2.",
		shortDesc: "Raises the user’s Atk by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hail", target);
			this.add('-anim', source, "firepunch", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		noPPBoosts: true,
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
		desc: "Halves target’s HP. 50% chance to sleep target.",
		shortDesc: "Halves target’s HP. 50% chance to sleep target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "topsyturvy", target);
			this.add('-anim', source, "darkvoid", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 50,
			status: 'slp',
		},
	},
	"metalmeteor": {
		name: "Metal Meteor",
		id: "metalmeteor",
		priority: 0,
		basePower: 195,
		category: "Physical",
		type: "Mech",
		target: "any",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "corkscrewcrash", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
	},
	"loveserenade": {
		name: "Love Serenade",
		id: "loveserenade",
		priority: 0,
		basePower: 157,
		category: "Special",
		type: "Filth",
		target: "allAdjacentFoes",
		desc: "Ignores foe(s) stat changes. 30% paralyze chance. Hits all adjacent foes.",
		shortDesc: "Ignores foe(s) stat changes. 30% paralyze chance.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spotlight", target);
			this.add('-anim', source, "snarl", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		accuracy: 95,
		pp: 2,
		noPPBoosts: true,
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
		basePower: 157,
		priority: 0,
		category: "Special",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "100% chance of raising the user’s Speed by 1. Hits all adjacent foes.",
		shortDesc: "Raises user’s Speed by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "sunsteelstrike", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 5,
		noPPBoosts: true,
		secondary: false,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			this.boost({spe: 1}, pokemon, pokemon, move);
		},
	},
	"energyshot": {
		name: "Energy Shot",
		id: "energyshot",
		priority: 0,
		basePower: 142,
		category: "Special",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Causes the foe(s) to be buggy. Hits all adjacent foes.",
		shortDesc: "Causes the foe(s) to be buggy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "clangingscales", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 100,
			volatileStatus: 'bug',
		},
	},
	"deadlybomb": {
		name: "Deadly Bomb",
		id: "deadlybomb",
		priority: 0,
		basePower: 300,
		category: "Physical",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Hits all adjacent foes. The user faints.",
		shortDesc: "Hits all adjacent foes. The user faints.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "explosion", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		noPPBoosts: true,
		selfdestruct: "always",
	},
	"fistofice": {
		name: "Fist of Ice",
		id: "fistofice",
		priority: 0,
		basePower: 180,
		category: "Physical",
		type: "Aqua",
		target: "normal",
		desc: "80% chance to flinch the target.",
		shortDesc: "80% chance to flinch the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hail", target);
			this.add('-anim', source, "icepunch", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1, punch: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 80,
			volatileStatus: 'flinch',
		},
	},
	"flowercannon": {
		name: "Flower Cannon",
		id: "flowercannon",
		priority: 1,
		basePower: 150,
		category: "Special",
		type: "Nature",
		target: "any",
		desc: "Priority +1.",
		shortDesc: "Priority +1",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "petalblizzard", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
	},
	"gateofdestiny": {
		name: "Gate of Destiny",
		id: "gateofdestiny",
		basePower: 150,
		priority: 0,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "25% chance to OHKO. Fails if user is lower level.",
		shortDesc: "25% chance to OHKO. Fails if user is lower level.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "swordsdance", source);
			this.add('-anim', source, "spacialrend", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		noPPBoosts: true,
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
	"darknesswave": {
		accuracy: 90,
		basePower: 90,
		category: "Special",
		desc: "Hits adjacent foe(s) 2 times in one turn. Hits all adjacent foes.",
		shortDesc: "Hits adjacent foe(s) 2 times in one turn.",
		id: "darknesswave",
		name: "Darkness Wave",
		target: "allAdjacentFoes",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "octazooka", target);
			this.add('-anim', source, "ominouswind", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		type: "Evil",
	},
	"smilebomber": {
		name: "Smile Bomber",
		id: "smilebomber",
		priority: 0,
		basePower: 142,
		category: "Physical",
		type: "Mech",
		target: "any",
		desc: "Does not check accuracy.",
		shortDesc: "Does not check accuracy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "dynamicpunch", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 5,
		noPPBoosts: true,
	},
	"genocideattack": {
		name: "Genocide Attack",
		id: "genocideattack",
		priority: 0,
		basePower: 165,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "High critical hit ratio.",
		shortDesc: "High critical hit ratio.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "darkpulse", target);
			this.add('-anim', source, "foulplay", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		critRatio: 2,
	},
	"hornbuster": {
		name: "Horn Buster",
		id: "hornbuster",
		priority: 0,
		basePower: 187,
		category: "Physical",
		type: "Air",
		target: "normal",
		desc: "Ignores target's stat changes.",
		shortDesc: "Ignores target's stat changes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "paraboliccharge", target);
			this.add('-anim', source, "voltswitch", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 2,
		noPPBoosts: true,
		ignoreDefensive: true,
		ignoreEvasion: true,
	},
	"lightningjavelin": {
		name: "Lightning Javelin",
		id: "lightningjavelin",
		priority: 0,
		basePower: 165,
		category: "Special",
		type: "Air",
		target: "any",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "thunder", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
	},
	"modestlystun": {
		name: "Modestly Stun",
		id: "modestlystun",
		priority: 0,
		basePower: "120",
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "80% chance to paralyze the target.",
		shortDesc: "80% chance to paralyze the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "crosschop", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		noPPBoosts: true,
		secondary: {
			chance: 80,
			status: 'par',
		},
	},
	"berserkthinking": {
		name: "Berserk Thinking",
		id: "berserkthinking",
		priority: 0,
		basePower: "60",
		category: "Physical",
		type: "Battle",
		target: "any",
		desc: "Hits 2-4 times in one turn.",
		shortDesc: "Hits 2-4 times in one turn.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "smartstrike", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
		multihit: [2, 4],
	},
	"gigadestroyer": {
		name: "Giga Destroyer",
		id: "gigadestroyer",
		priority: 0,
		basePower: 187,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "infernooverdrive", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
	},
	"revengeflame": {
		name: "Revenge Flame",
		id: "revengeflame",
		priority: -4, //same as Revenge
		basePower: 105,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "Power doubles if user is damaged by the target.",
		shortDesc: "Power doubles if user is damaged by the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "moongeistbeam", target);
		},
		flags: {protect: 1, mirror: 1, defrost: 1},
		accuracy: 100,
		pp: 5,
		noPPBoosts: true,
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
		basePower: 142,
		category: "Special",
		type: "Mech",
		target: "any",
		desc: "Does not check accuracy.",
		shortDesc: "Does not check accuracy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "magnetbomb", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 5,
		noPPBoosts: true,
	},
	"galacticflare": {
		name: "Galactic Flare",
		id: "galacticflare",
		priority: 0,
		basePower: 135,
		category: "Special",
		type: "Battle",
		target: "allAdjacentFoes",
		desc: "50% chance to raise Defense by 2. Hits all adjacent foes.",
		shortDesc: "50% chance to raise Defense by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "dragonascent", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 5,
		noPPBoosts: true,
		secondary: false,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			if (this.random(100) < 50) this.boost({def: 2}, pokemon, pokemon, move);
		},
	},
	"heartsattack": {
		name: "Hearts Attack",
		id: "heartsattack",
		priority: 0,
		basePower: 150,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "Ignores target’s stat changes. 50% confuse chance.",
		shortDesc: "Ignores target’s stat changes. 50% confuse chance.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "charm", target);
			this.add('-anim', source, "miracleeye", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		noPPBoosts: true,
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
		basePower: 150,
		category: "Special",
		type: "Evil",
		target: "allAdjacentFoes",
		desc: "User recovers 50% of the damage dealt to foes. Hits all adjacent foes. 1.3 HP if Big Root is held by the user.",
		shortDesc: "User recovers 50% of the damage dealt to foes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "octazooka", target);
			this.add('-anim', source, "drainingkiss", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		drain: [1, 2],
	},
	"pitbomb": {
		name: "Pit Bomb",
		id: "pitbomb",
		priority: 1,
		basePower: 150,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "Priority +1.",
		shortDesc: "Priority +1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "psychoboost", target);
		},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
	},
	"musicalfist": {
		name: "Musical Fist",
		id: "musicalfist",
		priority: 0,
		basePower: 150,
		category: "Special",
		type: "Battle",
		target: "allAdjacentFoes",
		desc: "30% chance to lower foe(s) Attack, Special Attack and Special Defense by 2. 10% chance of sleep. Hits all adjacent foes and is a sound move.",
		shortDesc: "30% chance to lower foe(s) Atk, Sp.Atk, Sp.Def by 2. 10% chance of sleep.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "boomburst", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, punch: 1, contact: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
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
		basePower: 195,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "100% chance to lower the target’s Defense by 2.",
		shortDesc: "Lowers the target’s Defense by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "clangoroussoulblaze", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		noPPBoosts: true,
		secondary: {
			chance: 100,
			boosts: {def: -2},
		},
	},
	"fragbomb": {
		name: "Frag Bomb",
		id: "fragbomb",
		priority: 0,
		basePower: 300,
		category: "Physical",
		type: "Evil",
		target: "allAdjacentFoes",
		desc: "Hits adjacent foes. The user faints. Hits all adjacent foes.",
		shortDesc: "Hits adjacent foes. The user faints.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "imprison", source);
			this.add('-anim', source, "explosion", target);
		},
		secondary: false,
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		noPPBoosts: true,
		selfdestruct: 'always',
	},
	"unidentifiedflyingkiss": {
		name: "Unidentified Flying Kiss",
		id: "unidentifiedflyingkiss",
		priority: 0,
		basePower: 142,
		category: "Physical",
		type: "Filth",
		target: "normal",
		desc: "50% chance to dot the target.",
		shortDesc: "50% chance to dot the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "lovelykiss", target);
			this.add('-anim', source, "dracometeor", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 50,
			volatileStatus: 'dot',
		},
	},
	"volcanicstrikes": {
		name: "Volcanic Strike S",
		id: "volcanicstrikes",
		priority: 0,
		basePower: 165,
		category: "Physical",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "No additional effect. Hits all adjacent foes.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "eruption", target);
		},
		secondary: false,
		flags: {protect: 1, mirror: 1, defrost: 1},
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
	},
	"heartbreakattack": {
		name: "Heartbreak Attack",
		id: "heartbreakattack",
		priority: 0,
		basePower: 150,
		category: "Special",
		type: "Evil",
		target: "normal",
		desc: "Ignores target’s stat changes. 50% confuse chance.",
		shortDesc: "Ignores target’s stat changes. 50% confuse chance.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "lovelykiss", target);
			this.add('-anim', source, "darkvoid", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Special",
		type: "Aqua",
		target: "any",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "grudge", source);
			this.add('-anim', source, "icebeam", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
	},
	"wolfclaw": {
		name: "Wolf Claw",
		id: "wolfclaw",
		priority: 0,
		basePower: 172,
		category: "Physical",
		type: "Battle",
		target: "any",
		desc: "100% chance to raise the user’s Speed by 2.",
		shortDesc: "Raises the user’s Speed by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "cosmicpower", source);
			this.add('-anim', source, "block", target);
		},
		flags: {protect: 1, mirror: 1, distance: 1, contact: 1},
		accuracy: 95,
		pp: 2,
		noPPBoosts: true,
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
		basePower: 157,
		category: "Special",
		type: "Aqua",
		target: "allAdjacent",
		desc: "No additional effect. Hits adjacent monsters.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "waterspout", target);
		},
		secondary: false,
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
	},
	"vulcanshammer": {
		name: "Vulcan's Hammer",
		id: "vulcanshammer",
		priority: 0,
		basePower: 195,
		category: "Physical",
		type: "Air",
		target: "normal",
		desc: "Ignores the target’s stat stage changes.",
		shortDesc: "Ignores the target’s stat stage changes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "plasmafists", target);
		},
		secondary: false,
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		noPPBoosts: true,
		ignoreDefensive: true,
		ignoreEvasion: true,
	},
	"bladeofthedragonking": {
		name: "Blade of the Dragon King",
		id: "bladeofthedragonking",
		priority: 0,
		basePower: 82,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "Hits 2-5 times in one turn.",
		shortDesc: "Hits 2-5 times in one turn.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "swordsdance", source);
			this.add('-anim', source, "sacredsword", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 85,
		pp: 2,
		noPPBoosts: true,
		multihit: [2, 5],
		secondary: false,
	},
	"garurutomahawk": {
		name: "Garuru Tomahawk",
		id: "garurutomahawk",
		priority: 0,
		basePower: 195,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "Does not check accuracy.",
		shortDesc: "Does not check accuracy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gearup", source);
			this.add('-anim', source, "mistball", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 3,
		noPPBoosts: true,
		secondary: false,
	},
	"blacktornado": {
		name: "Black Tornado",
		id: "blacktornado",
		priority: 0,
		basePower: 210,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "Ignores the target’s stat stage changes.",
		shortDesc: "Ignores the target’s stat stage changes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "tailwhip", target);
			this.add('-anim', source, "photongeyser", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		noPPBoosts: true,
		ignoreDefensive: true,
		ignoreEvasion: true,
		secondary: false,
	},
	"tomahawkstinger": {
		name: "Tomahawk Stinger",
		id: "tomahawkstinger",
		priority: 0,
		basePower: 165,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "30% chance to confuse the target.",
		shortDesc: "30% chance to confuse the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "tailwhip", target);
			this.add('-anim', source, "secretsword", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 5,
		noPPBoosts: true,
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
	},
	"lightningspear": {
		name: "Lightning Spear",
		id: "lightningspear",
		priority: 0,
		basePower: 195,
		category: "Physical",
		type: "Air",
		target: "normal",
		desc: "Ignores target’s stat changes. High critical hit ratio.",
		shortDesc: "Ignores target’s stat changes. High critical hit ratio.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "10000000voltthunderbolt", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		noPPBoosts: true,
		ignoreDefensive: true,
		ignoreEvasion: true,
		critRatio: 2,
		secondary: false,
	},
	"heavensjudgment": {
		name: "Heaven's Judgment",
		id: "heavensjudgment",
		priority: 0,
		basePower: 165,
		category: "Special",
		type: "Air",
		target: "allAdjacentFoes",
		desc: "High critical hit ratio. Hits all adjacent foes.",
		shortDesc: "High critical hit ratio.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gigavolthavoc", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
		critRatio: 2,
		secondary: false,
	},
	"blackdeathcloud": {
		name: "Black Death Cloud",
		id: "blackdeathcloud",
		priority: 0,
		basePower: 157,
		category: "Special",
		type: "Filth",
		target: "any",
		desc: "50% chance to put the target to sleep.",
		shortDesc: "50% chance to put the target to sleep.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "sludgewave", target);
			this.add('-anim', source, "darkvoid", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 50,
			status: 'slp',
		},
	},
	"bravemetal": {
		name: "Brave Metal",
		id: "bravemetal",
		priority: 0,
		basePower: 202,
		category: "Physical",
		type: "Evil",
		target: "any",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spectralthief", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 2,
		noPPBoosts: true,
		secondary: false,
	},
	"brainrupture": {
		name: "Brain Rupture",
		id: "brainrupture",
		priority: 0,
		basePower: 165,
		category: "Special",
		type: "Mech",
		target: "normal",
		desc: "50% chance to confuse the target.",
		shortDesc: "50% chance to confuse the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "prismaticlaser", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 50,
			volatileStatus: 'confusion',
		},
	},
	"gigablaster": {
		name: "Giga Blaster",
		id: "gigablaster",
		priority: 0,
		basePower: 195,
		category: "Special",
		type: "Air",
		target: "normal",
		desc: "Does not check accuracy",
		shortDesc: "Does not check accuracy",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "zapcannon", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		pp: 3,
		noPPBoosts: true,
		secondary: false,
	},
	"atomicray": {
		name: "Atomic Ray",
		id: "atomicray",
		priority: 0,
		basePower: 180,
		category: "Physical",
		type: "Mech",
		target: "any",
		desc: "80% chance to flinch the target.",
		shortDesc: "80% chance to flinch the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gearup", source);
			this.add('-anim', source, "zapcannon", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 80,
			volatileStatus: 'flinch',
		},
	},
	"phantompain": {
		name: "Phantom Pain",
		id: "phantompain",
		priority: 0,
		basePower: 187,
		category: "Special",
		type: "Evil",
		target: "normal",
		desc: "Ignores stat changes. User gains 50% HP dealt. 1.3 HP if Big Root is held by the user.",
		shortDesc: "Ignores stat changes. User gains 50% HP dealt.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "refresh", source);
			this.add('-anim', source, "neverendingnightmare", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1, contact: 1},
		accuracy: 95,
		pp: 2,
		noPPBoosts: true,
		ignoreDefensive: true,
		ignoreEvasion: true,
		drain: [1, 2],
		secondary: false,
	},
	"infinitycannon": {
		name: "Infinity Cannon",
		id: "infinitycannon",
		priority: 0,
		basePower: 187,
		category: "Special",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Hits adjacent foe(s) 1-2 times in one turn. Hits all adjacent foes.",
		shortDesc: "Hits adjacent foe(s) 1-2 times in one turn.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "coreenforcer", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 75,
		pp: 2,
		noPPBoosts: true,
		multihit: [1, 2],
		secondary: false,
	},
	"firetornado": {
		name: "Fire Tornado",
		id: "firetornado",
		priority: 0,
		basePower: 157,
		category: "Special",
		type: "Holy",
		target: "allAdjacentFoes",
		desc: "No additional effect. Hits all adjacent foes.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "skillswap", target);
			this.add('-anim', source, "firespin", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 5,
		noPPBoosts: true,
		secondary: false,
	},
	"oceanlove": {
		name: "Ocean Love",
		id: "oceanlove",
		priority: 0,
		basePower: 0,
		category: "Status",
		type: "Aqua",
		target: "allySide",
		desc: "Cures allies status. Heals allies by 50% max HP.",
		shortDesc: "Cures allies status. Heals allies by 50% max HP.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "aquaring", source);
			this.add('-anim', source, "attract", target);
		},
		flags: {heal: 1, snatch: 1},
		accuracy: true,
		pp: 5,
		noPPBoosts: true,
		secondary: false,
		onHitSide: function (side) {
			let didSomething = false;
			for (let pokemon of side.active) {
				if (pokemon && this.heal(pokemon.maxhp / 2, pokemon)) didSomething = true;
				if (pokemon && pokemon.cureStatus()) didSomething = true;
			}
			return didSomething;
		},
	},
	"darkrecital": {
		name: "Dark Recital",
		id: "darkrecital",
		priority: 0,
		basePower: 172,
		category: "Special",
		type: "Filth",
		target: "normal",
		desc: "100% chance to flinch the target, is a sound move.",
		shortDesc: "Flinches the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spotlight", target);
			this.add('-anim', source, "roaroftime", target);
		},
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		accuracy: 100,
		pp: 2,
		noPPBoosts: true,
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
	},
	"icewolfclaw": {
		name: "Ice Wolf Claw",
		id: "icewolfclaw",
		priority: 0,
		basePower: 90,
		category: "Physical",
		type: "Aqua",
		target: "allAdjacentFoes",
		desc: "80% chance to flinch the foe(s). Hits 2 times. Hits all adjacent foes.",
		shortDesc: "80% chance to flinch the foe(s). Hits 2 times.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "blizzard", target);
			this.add('-anim', source, "sheercold", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 90,
		pp: 2,
		noPPBoosts: true,
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
		basePower: 165,
		category: "Special",
		type: "Aqua",
		target: "any",
		desc: "100% chance to lower the target's Special Defense by 2.",
		shortDesc: "Lowers the target's Sp.Def by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "originpulse", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		secondary: {
			chance: 100,
			boosts: {spd: -2},
		},
	},
	"edensjavelin": {
		name: "Eden's Javelin",
		id: "edensjavelin",
		priority: 0,
		basePower: 180,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "100% chance to raise the user's Special Attack by 2.",
		shortDesc: "Raises the user's Sp.Atk by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "lightofruin", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 2,
		noPPBoosts: true,
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
		basePower: 157,
		category: "Special",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "Hits adjacent foes. Heals allies by 50% max HP. Hits all adjacent foes, 1.3 HP if Big Root is held by the user.",
		shortDesc: "Hits adjacent foes. Heals allies by 50% max HP.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "doomdesire", target);
			this.add('-anim', source, "moonlight", source);
		},
		flags: {protect: 1, mirror: 1, heal: 1, authentic: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		secondary: false,
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
		basePower: 165,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "Forces the target to switch to a random ally.",
		shortDesc: "Forces the target to switch to a random ally.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "pulverizingpancake", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
		forceSwitch: true,
		secondary: false,
	},
	"darknesszone": {
		name: "Darkness Zone",
		id: "darknesszone",
		priority: 0,
		basePower: 60,
		category: "Physical",
		type: "Evil",
		target: "allAdjacentFoes",
		desc: "Hits foe(s) 3 times. Lowers foe(s) Defense by 1. Hits all adjacent foes.",
		shortDesc: "Hits foe(s) 3 times. Lowers foe(s) Defense by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "sinisterarrowraid", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
		multihit: 3,
		secondary: false,
		onAfterMoveSecondary: function (target, source, move) {
			this.boost({def: -1});
		},
	},
	"knowledgestream": {
		name: "Knowledge Stream",
		id: "knowledgestream",
		priority: 0,
		basePower: 180,
		category: "Special",
		type: "Holy",
		target: "normal",
		desc: "20% chance to paralyze or sleep or panic the target.",
		shortDesc: "20% chance to paralyze or sleep or panic target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "moonlight", source);
			this.add('-anim', source, "hyperbeam", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
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
		basePower: 172,
		category: "Physical",
		type: "Nature",
		target: "normal",
		desc: "Priority +1, User gains 50% HP dealt. 50% chance to paralyze. 1.3 HP if Big Root is held by the user.",
		shortDesc: "Priority +1, User gains 50% HP dealt. 50% chance to paralyze.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "crosspoison", target);
			this.add('-anim', source, "paraboliccharge", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1, contact: 1},
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
		drain: [1, 2],
		secondary: {
			chance: 50,
			status: 'par',
		},
	},
	"howlingcrusher": {
		name: "Howling Crusher",
		id: "howlingcrusher",
		basePower: 90,
		priority: 0,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "Hits 2 times in one turn. High critical hit ratio, is a sound move.",
		shortDesc: "Hits 2 times in one turn. High critical hit ratio.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "honeclaws", source);
			this.add('-anim', source, "crushclaw", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		pp: 3,
		noPPBoosts: true,
		secondary: false,
		multihit: 2,
		critRatio: 2,
	},
	"strikeofthesevenstars": {
		name: "Strike of the Seven Stars",
		id: "strikeofthesevenstars",
		basePower: 30,
		priority: 0,
		category: "Special",
		type: "Holy",
		target: "allAdjacentFoes",
		desc: "Hits adjacent foe(s) 7 times in one turn. Hits all adjacent foes.",
		shortDesc: "Hits adjacent foe(s) 7 times in one turn.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "hiddenpower", target);
			this.add('-anim', source, "judgment", target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: false,
		accuracy: 90,
		pp: 3,
		noPPBoosts: true,
		multihit: 7,
	},
	"venominfusion": {
		name: "Venom Infusion",
		id: "venominfusion",
		basePower: 195,
		priority: 0,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "User gains 50% HP dealt. 100% chance to poison, 1.3 HP if Big Root is held by the user.",
		shortDesc: "User gains 50% HP dealt, poisons the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "grudge", source);
			this.add('-anim', source, "thousandwaves", target);
		},
		flags: {protect: 1, mirror: 1, heal: 1},
		accuracy: 95,
		pp: 2,
		noPPBoosts: true,
		drain: [1, 2],
		secondary: {
			chance: 100,
			status: 'psn',
		},
	},
	"arcticblizzard": {
		name: "Arctic Blizzard",
		id: "arcticblizzard",
		basePower: 195,
		priority: 0,
		category: "Physical",
		type: "Aqua",
		target: "normal",
		desc: "100% chance to flinch the target.",
		shortDesc: "Flinches the target.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "icehammer", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 90,
		pp: 2,
		noPPBoosts: true,
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
	},
	"terraforce": {
		name: "Terra Force",
		id: "terraforce",
		priority: 0,
		basePower: 187,
		category: "Physical",
		type: "Flame",
		target: "allAdjacentFoes",
		desc: "100% chance to raise Attack by 2. Hits all adjacent foes.",
		shortDesc: "100% chance to raise Atk by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "fusionflare", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 3,
		noPPBoosts: true,
		secondary: false,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			this.boost({atk: 2}, pokemon, pokemon, move);
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
		desc: "Raises the user’s attack by 2.",
		shortDesc: "Raises the user’s attack by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "tailglow", target);
		},
		flags: {defrost: 1, snatch: 1},
		accuracy: true,
		pp: 20,
		boosts: {atk: 2},
		secondary: false,
	},
	"heatbreath": {
		name: "Heat Breath",
		id: "heatbreath",
		priority: 1,
		basePower: 75,
		category: "Special",
		type: "Flame",
		target: "any",
		desc: "Priority +1.",
		shortDesc: "Priority +1",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "heatwave", target);
		},
		flags: {protect: 1, mirror: 1, defrost: 1},
		accuracy: 100,
		pp: 30,
		secondary: false,
	},
	"firetower": {
		name: "Fire Tower",
		id: "firetower",
		basePower: 90,
		category: "Physical",
		priority: 0,
		type: "Flame",
		target: "any",
		desc: "Ignores target's stat changes.",
		shortDesc: "Ignores target's stat changes.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "flamecharge", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		pp: 20,
		ignoreDefensive: true,
		ignoreEvasion: true,
		secondary: false,
	},
	"firewall": {
		name: "Firewall",
		id: "firewall",
		priority: 4,
		basePower: 0,
		category: "Status",
		type: "Flame",
		target: "allySide",
		desc: "Priority +4. Protects user and allies from moves. Contact: loses 1/8 max hp unless Fire/Flame type.",
		shortDesc: "Protects user and allies from moves. Contact: loses 1/8 max hp unless Fire/Flame type.",
		onPrepareHit: function (pokemon, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "firespin", source);
			this.add('-anim', source, "protect", source);
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		flags: {defrost: 1},
		accuracy: true,
		pp: 10,
		secondary: false,
		stallingMove: true,
		sideCondition: 'firewall',
		onHitSide: function (side, source) {
			side.addSideCondition('sidestall');
			this.add('-message', source.name + ' is hidden behind a firewall!');
		},
		effect: {
			duration: 1,
			//this is a side condition
			onStart: function (target, source) {
				this.add('-singleturn', source, 'move: Firewall');
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
		basePower: 112,
		category: "Special",
		type: "Flame",
		target: "any",
		desc: "20% chance to panic the target.",
		shortDesc: "20% chance to panic the target.",
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
		basePower: 142,
		category: "Physical",
		type: "Flame",
		target: "normal",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "vcreate", target);
		},
		flags: {protect: 1, mirror: 1},
		pp: 15,
		accuracy: 95,
		secondary: false,
	},
	"prominencebeam": {
		name: "Prominence Beam",
		id: "prominencebeam",
		priority: 0,
		basePower: 150,
		category: "Special",
		type: "Flame",
		target: "any",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "solarbeam", target);
		},
		flags: {protect: 1, mirror: 1},
		pp: 10,
		accuracy: 95,
		secondary: false,
	},
	"hailspear": {
		name: "Hail Spear",
		id: "hailspear",
		basePower: 67,
		priority: 1,
		category: "Physical",
		type: "Aqua",
		target: "normal",
		desc: "Priority +1, 20% chance to flinch the target.",
		shortDesc: "Priority +1, 20% chance to flinch the target.",
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
		basePower: 75,
		priority: 0,
		category: "Special",
		type: "Aqua",
		target: "allAdjacentFoes",
		desc: "100% chance to raise Speed by 2. Hits all adjacent foes.",
		shortDesc: "Raises Speed by 2.",
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
		basePower: 97,
		priority: 0,
		category: "Physical",
		type: "Aqua",
		target: "allAdjacentFoes",
		desc: "15% chance to flinch the foe(s). Hits all adjacent foes.",
		shortDesc: "15% chance to flinch the foe(s).",
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
		basePower: 105,
		priority: 0,
		category: "Special",
		type: "Aqua",
		pp: 20,
		target: "any",
		desc: "20% chance to dot the target.",
		shortDesc: "20% chance to dot the target.",
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
		basePower: 120,
		category: "Special",
		type: "Aqua",
		target: "allAdjacent",
		desc: "25% chance to lower adjacent monsters Speed by 1. Hits all adjacent monsters.",
		shortDesc: "25% chance to lower adjacent monsters Speed by 1.",
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
		basePower: 120,
		category: "Physical",
		type: "Aqua",
		target: "normal",
		desc: "35% chance to flinch the target.",
		shortDesc: "35% chance to flinch the target.",
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
		basePower: 135,
		category: "Special",
		type: "Aqua",
		target: "allAdjacentFoes",
		desc: "15% chance to dot the foe(s). Must recharge, hits all adjacent foes.",
		shortDesc: "15% chance to dot the foe(s). Must recharge.",
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
		desc: "Raises user's and allies speed by 1.",
		shortDesc: "Raises user's and allies speed by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "magnetrise", target);
		},
		secondary: false,
		flags: {},
		pp: 15,
		accuracy: true,
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
		basePower: 60,
		category: "Physical",
		type: "Air",
		target: "normal",
		desc: "Priority +1. 10% chance to flinch the target.",
		shortDesc: "Priority +1. 10% chance to flinch the target.",
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
		basePower: 75,
		category: "Special",
		type: "Air",
		target: "any",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		pp: 35,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "airslash", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		secondary: false,
	},
	"confusedstorm": {
		name: "Confused Storm",
		id: "confusedstorm",
		priority: 0,
		basePower: 97,
		category: "Special",
		type: "Air",
		target: "allAdjacent",
		desc: "10% chance to confuse adjacent monsters.",
		shortDesc: "10% chance to confuse adjacent monsters.",
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
		basePower: 120,
		category: "Special",
		type: "Air",
		target: "any",
		desc: "Priority -1. 25% chance to lower target’s Speed by 1.",
		shortDesc: "Priority -1, 25% chance to lower target’s Speed by 1.",
		pp: 15,
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
		basePower: 127,
		priority: 0,
		category: "Physical",
		type: "Air",
		target: "any",
		desc: "10% chance to flinch the target.",
		shortDesc: "10% chance to flinch the target.",
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
		basePower: 135,
		pp: 10,
		category: "Special",
		type: "Air",
		target: "any",
		desc: "Does not check accuracy.",
		shortDesc: "Does not check accuracy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "stokedsparksurfer", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		secondary: false,
	},
	"earthcoat": {
		name: "Earth Coat",
		id: "earthcoat",
		basePower: 0,
		priority: 0,
		category: "Status",
		type: "Nature",
		target: "allySide",
		desc: "Cures user and allies status. Raises user and allies Special Defense by 1.",
		shortDesc: "Cures user and allies status. Raises user and allies Sp.Def by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "mudsport", target);
		},
		flags: {snatch: 1},
		accuracy: true,
		pp: 10,
		secondary: false,
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
		desc: "Raises the user’s Defense by 2 and Attack by 1.",
		shortDesc: "Raises the user’s Def by 2 and Atk by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "coil", target);
		},
		secondary: false,
		flags: {snatch: 1},
		accuracy: true,
		boosts: {
			def: 2,
			atk: 1,
		},
	},
	"charmperfume": {
		name: "Charm Perfume",
		id: "charmperfume",
		flags: {protect: 1, mirror: 1},
		basePower: 67,
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
		desc: "2x Power if target is poisoned. 30% poison chance. Hits all adjacent foes.",
		shortDesc: "Power doubles if target is poisoned. 30% poison chance.",
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
		basePower: 97,
		pp: 10,
		priority: 0,
		category: "Physical",
		type: "Nature",
		target: "normal",
		desc: "25% chance to lower target’s Speed. Traps target.",
		shortDesc: "25% chance to lower target’s Speed. Traps target.",
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
		basePower: 105,
		priority: 0,
		category: "Physical",
		type: "Nature",
		target: "any",
		desc: "Causes the target to be buggy.",
		shortDesc: "Causes the target to be buggy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "leechseed", target);
			this.add('-anim', source, "forestscurse", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 75,
		volatileStatus: 'bug',
		secondary: false,
	},
	"rockfall": {
		name: "Rock Fall",
		id: "rockfall",
		basePower: 142,
		priority: 0,
		pp: 20,
		category: "Physical",
		type: "Nature",
		target: "any",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "rockslide", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 95,
		secondary: false,
	},
	"venomdisaster": {
		name: "Venom Disaster",
		id: "venomdisaster",
		basePower: 142,
		priority: 0,
		pp: 10,
		category: "Special",
		type: "Nature",
		target: "allAdjacent",
		desc: "20% chance to poison adjacent monsters.",
		shortDesc: "20% chance to poison adjacent monsters.",
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
		basePower: 82,
		pp: 20,
		priority: 0,
		category: "Special",
		type: "Evil",
		target: "any",
		desc: "Does not check accuracy.",
		shortDesc: "Does not check accuracy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "spiritshackle", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		secondary: false,
	},
	"blackout": {
		name: "Blackout",
		id: "blackout",
		basePower: 90,
		priority: 0,
		category: "Physical",
		type: "Evil",
		target: "allAdjacent",
		desc: "25% chance to lower adjacent monsters accuracy by 1. Hits all adjacent monsters.",
		shortDesc: "25% chance to lower adjacent monsters accuracy by 1.",
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
		basePower: 105,
		priority: 0,
		category: "Special",
		type: "Evil",
		target: "any",
		desc: "25% chance to lower the target’s Defense and Special Defense by 1.",
		shortDesc: "25% chance to lower the target’s Def and Sp.Def by 1.",
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
		basePower: 120,
		pp: 15,
		priority: -1,
		category: "Special",
		type: "Evil",
		target: "allAdjacent",
		desc: "Priority -1, 10% chance to panic adjacent monsters. Hits all adjacent monsters.",
		shortDesc: "Priority -1, 10% chance to panic adjacent monsters.",
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
		basePower: 135,
		priority: 0,
		pp: 5,
		category: "Physical",
		type: "Evil",
		target: "normal",
		desc: "Breaks protection",
		shortDesc: "Breaks protection",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "powertrip", target);
		},
		flags: {mirror: 1},
		accuracy: 95,
		breaksProtect: true,
		secondary: false,
	},
	"hideandseek": {
		name: "Hide and Seek",
		id: "hideandseek",
		basePower: 150,
		priority: 0,
		pp: 10,
		category: "Special",
		type: "Evil",
		target: "any",
		desc: "10% chance to dot the target.",
		shortDesc: "10% chance to dot the target.",
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
		basePower: 150,
		pp: 5,
		priority: 0,
		category: "Special",
		type: "Evil",
		target: "allAdjacent",
		desc: "25% chance to lower adjacent monsters Speed by 1. Hits all adjacent monsters.",
		shortDesc: "25% chance to lower adjacent monsters Speed by 1.",
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
		desc: "Heals 40% of allies max HP.",
		shortDesc: "Heals 40% of allies max HP.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "geomancy", target);
		},
		flags: {heal: 1},
		accuracy: true,
		secondary: false,
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
		secondary: false,
		desc: "Raises the user’s Special Defense and Speed by 1.",
		shortDesc: "Raises the user’s Sp.Def and Speed by 1.",
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
		priority: 4,
		pp: 10,
		category: "Status",
		type: "Holy",
		target: "allySide",
		desc: "Priority +4. Protects user’s and allies this turn.",
		shortDesc: "Protects user’s and allies this turn.",
		flags: {snatch: 1},
		accuracy: 100,
		secondary: false,
		stallingMove: true,
		sideCondition: 'saintshield',
		onPrepareHit: function (pokemon, source, move) {
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
		basePower: 82,
		pp: 30,
		priority: 1,
		category: "Special",
		type: "Holy",
		target: "allAdjacentFoes",
		desc: "Priority +1. 15% chance to raise Special Attack by 1. Hits all adjacent foes.",
		shortDesc: "15% chance to raise Sp.Atk by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "fairylock", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1},
		accuracy: 90,
		secondary: false,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			if (this.random(100) < 70) this.boost({spe: 1}, pokemon, pokemon, move);
		},
	},
	"saintray": {
		name: "Saint Ray",
		id: "saintray",
		basePower: 135,
		priority: 0,
		pp: 15,
		category: "Special",
		type: "Holy",
		target: "any",
		desc: "Does not check accuracy.",
		shortDesc: "Does not check accuracy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "naturesmadness", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		secondary: false,
	},
	"holyjudgment": {
		name: "Holy Judgment",
		id: "holyjudgment",
		basePower: 150,
		pp: 15,
		priority: 0,
		category: "Physical",
		type: "Holy",
		target: "any",
		desc: "User is hurt by 25% of its max HP if it misses.",
		shortDesc: "User is hurt by 25% of its max HP if it misses.",
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
		basePower: 150,
		priority: 0,
		pp: 10,
		category: "Special",
		type: "Holy",
		target: "allAdjacentFoes",
		desc: "75% chance to flinch the foe(s). Must recharge. Hits all adjacent foes.",
		shortDesc: "75% chance to flinch the foe(s). Must recharge.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "happyhour", source);
			this.add('-anim', source, "fleurcannon", target);
		},
		flags: {protect: 1, mirror: 1, authentic: 1, recharge: 1},
		accuracy: 100,
		secondary: false,
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
		desc: "Raises the user’s Attack and Speed by 1.",
		shortDesc: "Raises the user’s Atk and Speed by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "growth", target);
		},
		flags: {snatch: 1},
		accuracy: true,
		pp: 20,
		secondary: false,
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
		desc: "Lowers user’s Defense, Special Defense by 2; raises Attack, Special Attack by 2.",
		shortDesc: "Lowers user’s Def, SpD by 2; raises Atk, SpA by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nobleroar", target);
			this.add('-anim', source, "encore", target);
		},
		flags: {snatch: 1},
		secondary: false,
		accuracy: true,
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
		basePower: 97,
		priority: 1,
		pp: 30,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "Priority +1.",
		shortDesc: "priority +1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "machpunch", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		secondary: false,
	},
	"fightingaura": {
		name: "Fighting Aura",
		id: "fightingaura",
		basePower: 105,
		priority: 0,
		pp: 15,
		category: "Special",
		type: "Battle",
		target: "allAdjacentFoes",
		desc: "10% chance to raise Attack by 1. Hits all adjacent foes.",
		shortDesc: "10% chance to raise Attack by 1.",
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
		basePower: 142,
		priority: -3,
		pp: 20,
		category: "Physical",
		type: "Battle",
		target: "scripted",
		desc: "If hit by a physical or special attack aim for the attacker. 20% chance to confuse the target.",
		shortDesc: "Returns damage dealt. 20% confuse chance.",
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
		basePower: 150,
		priority: 0,
		pp: 10,
		category: "Physical",
		type: "Battle",
		target: "any",
		desc: "Charges turn 1. Hits turn 2. 75% chance of flinch.",
		shortDesc: "Charges turn 1. Hits turn 2. 75% chance of flinch.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "happyhour", source);
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
		basePower: 150,
		priority: 0,
		pp: 15,
		category: "Physical",
		type: "Battle",
		target: "normal",
		desc: "15% chance to flinch the target.",
		shortDesc: "15% chance to flinch the target.",
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
		basePower: 22,
		priority: 0,
		pp: 30,
		category: "Physical",
		type: "Mech",
		target: "normal",
		desc: "Hits 2-5 times in one turn.",
		shortDesc: "Hits 2-5 times in one turn.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gearup", source);
			this.add('-anim', source, "cut", target);
		},
		flags: {protect: 1, mirror: 1, contact: 1},
		accuracy: 95,
		multihit: [2, 5],
		secondary: false,
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
		desc: "Priority -1. Raises user’s Attack, Defense, Special Attack and Speed by 1.",
		shortDesc: "Priority -1. Raises user’s Atk, Def, SpA and Spe by 1.",
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
		secondary: false,
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
		desc: "Causes adjacent foes to be buggy. Hits all adjacent foes.",
		shortDesc: "Causes adjacent foes to be buggy.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gravity", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: true,
		volatileStatus: 'bug',
		secondary: false,
	},
	"antiattackfield": {
		name: "Anti-Attack Field",
		id: "antiattackfield",
		basePower: 105,
		priority: 0,
		pp: 10,
		category: "Special",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Raises allies Defense by 1. Hits all adjacent foes.",
		shortDesc: "Raises allies Defense by 1.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "storedpower", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		secondary: false,
		onAfterMoveSecondarySelf: function (source, target, move) {
			for (let pokemon of source.side.active) {
				if (pokemon) this.boost({def: 1}, pokemon, source);
			}
		},
	},
	"gigawattlaser": {
		name: "Gigawatt Laser",
		id: "gigawattlaser",
		basePower: 120,
		priority: 1,
		pp: 30,
		category: "Special",
		type: "Mech",
		target: "any",
		desc: "Priority +1, must recharge.",
		shortDesc: "priority +1, must recharge.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "mirrorshot", target);
		},
		flags: {protect: 1, mirror: 1, recharge: 1},
		accuracy: 90,
		secondary: false,
		self: {
			volatileStatus: 'mustrecharge',
		},
	},
	"deleteprogram": {
		name: "Delete Program",
		id: "deleteprogram",
		basePower: 135,
		priority: 0,
		pp: 10,
		category: "Physical",
		type: "Mech",
		target: "any",
		desc: "15% chance to dot the target.",
		shortDesc: "15% chance to dot the target.",
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
		basePower: 135,
		priority: -1,
		pp: 15,
		category: "Special",
		type: "Mech",
		target: "allAdjacentFoes",
		desc: "Priority -1. 10% chance to dot the foe(s). Hits all adjacent foes.",
		shortDesc: "Priority-1. 10% chance to dot.",
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
		basePower: 15,
		priority: 0,
		pp: 30,
		category: "Physical",
		type: "Filth",
		target: "normal",
		desc: "10% chance to poison the target. Hits 2-5 times.",
		shortDesc: "10% chance to poison the target. Hits 2-5 times.",
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
		basePower: 45,
		priority: 0,
		pp: 20,
		category: "Special",
		type: "Filth",
		target: "allAdjacentFoes",
		desc: "10% chance to flinch the foe(s). Hits all adjacent foes.",
		shortDesc: "10% chance to flinch the foe(s).",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "acidarmor", source);
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
		basePower: 52,
		category: "Physical",
		desc: "Next turn the target can't use status moves.",
		shortDesc: "Next turn the target can't use status moves.",
		id: "pooptoss",
		name: "Poop Toss",
		priority: 0,
		pp: 15,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nastyplot", source);
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
		basePower: 75,
		priority: 0,
		pp: 20,
		category: "Special",
		type: "Filth",
		target: "allAdjacent",
		desc: "Raises Def by 1. 15% chance of poisoning adjacent monsters. Hits all adjacent monsters.",
		shortDesc: "Raises Def by 1. 15% chance of poisoning adjacent monsters.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "gunkshot", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 80,
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			this.boost({def: 1}, pokemon, pokemon, move);
		},
		secondary: {
			chance: 15,
			status: 'psn',
		},
	},
	"poopfling": {
		name: "Poop Fling",
		id: "poopfling",
		basePower: 22,
		priority: 0,
		pp: 30,
		category: "Physical",
		type: "Filth",
		target: "any",
		desc: "5% chance to confuse the target. Hits 2-5 times.",
		shortDesc: "5% chance to confuse the target. Hits 2-5 times.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nastyplot", source);
			this.add('-anim', source, "sludgebomb", target);
		},
		flags: {protect: 1, mirror: 1},
		accuracy: 100,
		multihit: [2, 5],
		secondary: false,
		onAfterMoveSecondary: function (target, source, move) {
			if (this.random(100) < 5) target.addVolatile('confusion', source);
		},
	},
	"guerrillapoop": {
		name: "Guerrilla Poop",
		id: "guerrillapoop",
		basePower: 112,
		priority: 0,
		pp: 15,
		category: "Physical",
		type: "Filth",
		target: "any",
		desc: "30% chance to lower the target’s Speed by 2.",
		shortDesc: "30% chance to lower the target’s Speed by 2.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "banefulbunker", source);
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
		basePower: 127,
		priority: 0,
		pp: 5,
		category: "Special",
		type: "Filth",
		target: "allAdjacentFoes",
		desc: "20% lower foe(s) Speed by 1. 5% chance of flinch. 10% chance of poison. Hits all adjacent foes.",
		shortDesc: "20% chance -1 spe. 5% flinch. 10% psn.",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "nastyplot", source);
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
		basePower: 60,
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
		basePower: 60,
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
	//Pokemon x Digimon move altercations
	"watersport": {
		inherit: true,
		desc: "For 5 turns, all Fire-type and Flame-type attacks used by any active Pokemon have their power reduced to 0.33x. Fails if this move is already in effect.",
		shortDesc: "For 5 turns, Fire-type and Flame-type attacks have 1/3 power.",
		effect: {
			duration: 5,
			onStart: function (side, source) {
				this.add('-fieldstart', 'move: Water Sport', '[of] ' + source);
			},
			onBasePowerPriority: 1,
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Fire' || move.type === 'Flame') {
					this.debug('water sport weaken');
					return this.chainModify([0x548, 0x1000]);
				}
			},
			onResidualOrder: 21,
			onEnd: function () {
				this.add('-fieldend', 'move: Water Sport');
			},
		},
	},
	"mudsport": {
		inherit: true,
		desc: "For 5 turns, all Electric-type and Air-type attacks used by any active Pokemon have their power reduced to 0.33x. Fails if this move is already in effect.",
		shortDesc: "For 5 turns, Electric-type znd Air-type attacks have 1/3 power.",
		effect: {
			duration: 5,
			onStart: function (side, source) {
				this.add('-fieldstart', 'move: Mud Sport', '[of] ' + source);
			},
			onBasePowerPriority: 1,
			onBasePower: function (basePower, attacker, defender, move) {
				if (move.type === 'Electric' || move.type === 'Air') {
					this.debug('mud sport weaken');
					return this.chainModify([0x548, 0x1000]);
				}
			},
			onResidualOrder: 21,
			onEnd: function () {
				this.add('-fieldend', 'move: Mud Sport');
			},
		},
	},
	"electricterrain": {
		inherit: true,
		desc: "For 5 turns, the terrain becomes Electric Terrain. During the effect, the power of Electric-type and Air-type attacks made by grounded Pokemon is multiplied by 1.5 and grounded Pokemon cannot fall asleep; Pokemon already asleep do not wake up. Camouflage transforms the user into an Electric type, Nature Power becomes Thunderbolt, and Secret Power has a 30% chance to cause paralysis. Fails if the current terrain is Electric Terrain.",
		shortDesc: "5 turns. Grounded: +Electric power, +Air power, can't sleep.",
		effect: {
			duration: 5,
			durationCallback: function (source, effect) {
				if (source && source.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus: function (status, target, source, effect) {
				if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
					if (effect.effectType === 'Move' && !effect.secondaries) {
						this.add('-activate', target, 'move: Electric Terrain');
					}
					return false;
				}
			},
			onTryAddVolatile: function (status, target) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'yawn') {
					this.add('-activate', target, 'move: Electric Terrain');
					return null;
				}
			},
			onBasePower: function (basePower, attacker, defender, move) {
				if ((move.type === 'Electric' || move.type === 'Air') && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('electric terrain boost');
					return this.chainModify(1.5);
				}
			},
			onStart: function (battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Electric Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function () {
				this.add('-fieldend', 'move: Electric Terrain');
			},
		},
	},
	"rototiller": {
		inherit: true,
		desc: "Raises the Attack and Special Attack of all grounded Grass-type and Nature-type Pokemon on the field by 1 stage.",
		shortDesc: "Raises Atk, Sp. Atk of grounded Grass and Nature types by 1.",
		onHitField: function (target, source) {
			let targets = [];
			let anyAirborne = false;
			for (let sideSlot = 0; sideSlot < this.sides.length; sideSlot++) {
				let sideActive = this.sides[sideSlot].active;
				for (let activeSlot = 0; activeSlot < sideActive.length; activeSlot++) {
					if (!sideActive[activeSlot] || !sideActive[activeSlot].isActive) continue;
					if (!sideActive[activeSlot].runImmunity('Ground')) {
						this.add('-immune', sideActive[activeSlot], '[msg]');
						anyAirborne = true;
						continue;
					}
					if (sideActive[activeSlot].hasType('Grass') || sideActive[activeSlot].hasType('Nature')) {
						// This move affects every grounded Grass-type Pokemon in play.
						targets.push(sideActive[activeSlot]);
					}
				}
			}
			if (!targets.length && !anyAirborne) return false; // Fails when there are no grounded Grass types or airborne Pokemon
			for (let i = 0; i < targets.length; i++) this.boost({atk: 1, spa: 1}, targets[i], source);
		},
	},
	"grassyterrain": {
		inherit: true,
		desc: "For 5 turns, the terrain becomes Grassy Terrain. During the effect, the power of Grass-type and Nature-type attacks used by grounded Pokemon is multiplied by 1.5, the power of Bulldoze, Earthquake, and Magnitude used against grounded Pokemon is multiplied by 0.5, and grounded Pokemon have 1/16 of their maximum HP, rounded down, restored at the end of each turn, including the last turn. Camouflage transforms the user into a Grass type, Nature Power becomes Energy Ball, and Secret Power has a 30% chance to cause sleep. Fails if the current terrain is Grassy Terrain.",
		shortDesc: "5 turns. Grounded: +Grass power,+Nature Power,+1/16 max HP.",
		effect: {
			duration: 5,
			durationCallback: function (source, effect) {
				if (source && source.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBasePower: function (basePower, attacker, defender, move) {
				let weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
				if (weakenedMoves.includes(move.id)) {
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if ((move.type === 'Grass' || move.type === 'Nature') && attacker.isGrounded()) {
					this.debug('grassy terrain boost');
					return this.chainModify(1.5);
				}
			},
			onStart: function (battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Grassy Terrain');
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 3,
			onResidual: function () {
				this.eachEvent('Terrain');
			},
			onTerrain: function (pokemon) {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
					this.debug('Pokemon is grounded, healing through Grassy Terrain.');
					this.heal(pokemon.maxhp / 16, pokemon, pokemon);
				}
			},
			onEnd: function () {
				this.eachEvent('Terrain');
				this.add('-fieldend', 'move: Grassy Terrain');
			},
		},
	},
	"flowershield": {
		inherit: true,
		desc: "Raises the Defense of all Grass-type and Nature-type Pokemon on the field by 1 stage.",
		shortDesc: "Raises Defense by 1 of all active Grass and Nature types.",
		onHitField: function (target, source) {
			let targets = [];
			for (let sideSlot = 0; sideSlot < this.sides.length; sideSlot++) {
				let sideActive = this.sides[sideSlot].active;
				for (let activeSlot = 0; activeSlot < sideActive.length; activeSlot++) {
					if (sideActive[activeSlot] && sideActive[activeSlot].isActive && (sideActive[activeSlot].hasType('Grass') || sideActive[activeSlot].hasType('Nature'))) {
						// This move affects every Grass-type Pokemon in play.
						targets.push(sideActive[activeSlot]);
					}
				}
			}
			let success = false;
			for (const target of targets) {
				success = this.boost({def: 1}, target, source, this.getMove('Flower Shield')) || success;
			}
			return success;
		},
	},
	//Move description changes
	"raindance": {
		inherit: true,
		desc: "For 5 turns, the weather becomes Rain Dance. The damage of Water- and Aqua-type attacks is multiplied by 1.5 and the damage of Fire- and Flame-type attacks is multiplied by 0.5 during the effect. Lasts for 8 turns if the user is holding Damp Rock. Fails if the current weather is Rain Dance.",
		shortDesc: "For 5 turns, rain powers Water/Aqua moves.",
	},
	"sunnyday": {
		inherit: true,
		desc: "For 5 turns, the weather becomes Sunny Day. The damage of Fire- and Flame-type attacks is multiplied by 1.5 and the damage of Water- and Aqua-type attacks is multiplied by 0.5 during the effect. Lasts for 8 turns if the user is holding Heat Rock. Fails if the current weather is Sunny Day.",
		shortDesc: "For 5 turns, sunlight powers Fire/Flame moves.",
	},
};
