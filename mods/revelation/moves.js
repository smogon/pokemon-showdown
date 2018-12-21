'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
let BattleMovedex = {
		freezeframe: {
        accuracy: 100,
		basePower: 70,
		category: "Special",
		desc: "Nearly always goes first. Has a 100% chance to freeze the foe.",
		shortDesc: "Always goes first. 100% chance to freeze the foe.",
		id: "freezeframe",
		isNonstandard: true,
		name: "Freeze Frame",
		pp: 15,
		priority: 2,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Wrap", target);
			this.add('-anim', source, "Blizzard", target);
		},
		secondary: {
			chance: 100,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Cool",
	},
	fairyflare: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "Has a 100% chance to lower the target's Special Defense by 2 stages.",
		shortDesc: "100% chance to lower the target's Special Defense by 2.",
		id: "fairyflare",
		isNonstandard: true,
		name: "Fairy Flare",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Aromatic Mist", target);
			this.add('-anim', source, "Disarming Voice", target);
		},
		secondary: {
			chance: 100,
			boosts: {
				spd: -2,
			},
		},
		target: "normal",
		type: "Fairy",
		zMovePower: 230,
		contestType: "Beautiful",
	},
	magicglitter: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Has a 30% chance to raise the user's Attack, Defense, Special Attack, Special Defense, and Speed by 2 stages.",
		shortDesc: "30% chance to raise all stats by 2 (not acc/eva).",
		id: "magicglitter",
		isNonstandard: true,
		name: "Magic Glitter",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Geomancy", target);
			this.add('-anim', source, "Dazzling Gleam", target);
		},
		secondary: {
			chance: 30,
			self: {
				boosts: {
					atk: 2,
					def: 2,
					spa: 2,
					spd: 2,
					spe: 2,
				},
			},
		},
		target: "normal",
		type: "Fairy",
		zMovePower: 250,
		contestType: "Beautiful",
	},
	badmockery: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "This move causes Taunt on the foe.",
		shortDesc: "Causes Taunt.",
		id: "badmockery",
		isNonstandard: true,
		name: "Bad Mockery",
		pp: 5,
		priority: 0,
		volatileStatus: 'taunt',
		flags: {protect: 1, reflectable: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Chatter", target);
			this.add('-anim', source, "Brutal Swing", target);
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMovePower: 250,
		contestType: "Clever",
	},
	liberation: {
		accuracy: 100,
		basePower: 255,
		category: "Physical",
		desc: "If this move is successful, it has a 100% chance to both confuse and paralyze the target, maximizes all stats and the user's type becomes typeless as long as it remains active, the user must recharge on the following turn and cannot select a move, and it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. The user steals the foe's boosts. The user gains the effects of Aqua Ring, Magic Coat, Aurora Veil, Light Screen, Reflect, Mist and Safeguard.",
		shortDesc: "Does many things turn 1. Can't move turn 2.",
		id: "liberation",
		isNonstandard: true,
		name: "Liberation",
		pp: 5,
		priority: 2,
		flags: {authentic: 1, protect: 1, recharge: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Geomancy", target);
			this.add('-anim', source, "Focus Energy", target);
			this.add('-anim', source, "Photon Geyser", target);
			this.add('-anim', source, "Giga Impact", target);
		},
		ignoreEvasion: true,
		ignoreDefensive: true,
        breaksProtect: true,
		self: {
			onHit: function (pokemon) {
				pokemon.setType('???');
				this.add('-start', pokemon, 'typechange', '???');
                this.boost({atk: 12}, pokemon);
                this.boost({spa: 12}, pokemon);
                this.boost({def: 12}, pokemon);
                this.boost({spd: 12}, pokemon);
                this.boost({spe: 12}, pokemon);
                this.boost({evasion: 12}, pokemon);
                this.boost({accuracy: 12}, pokemon);
                pokemon.addVolatile('aquaring');
                pokemon.addVolatile('magiccoat');
			    pokemon.side.addSideCondition('safeguard');
			    pokemon.side.addSideCondition('mist');
			    pokemon.side.addSideCondition('reflect');
			    pokemon.side.addSideCondition('lightscreen');
			    pokemon.side.addSideCondition('auroraveil');
			},
			volatileStatus: 'mustrecharge',
		},
		ignoreAbility: true,
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
            status: 'par',
		},
		stealsBoosts: true,
		target: "normal",
		type: "???",
		zMovePower: 350,
		contestType: "Clever",
	},
	varishot: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "This move's type depends on the user's primary type. If the user's primary type is typeless, this move's type is the user's secondary type if it has one, otherwise the added type from Forest's Curse or Trick-or-Treat. This move is typeless if the user's type is typeless alone.",
		shortDesc: "Type varies based on the user's primary type.",
		id: "varishot",
		isNonstandard: true,
		name: "Vari-Shot",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Geomancy", target);
			this.add('-anim', source, "Hyper Beam", target);
		},
		onModifyMove: function (move, pokemon) {
			let type = pokemon.types[0];
			if (type === "Bird") type = "???";
			move.type = type;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMovePower: 230,
		contestType: "Cool",
	},
	dragonfist: {
		accuracy: 100,
		basePower: 170,
		basePowerCallback: function (pokemon, target, move) {
			return move.basePower * pokemon.hp / pokemon.maxhp;
		},
		category: "Physical",
		desc: "Power is equal to (user's current HP * 170 / user's maximum HP), rounded down, but not less than 1.",
		shortDesc: "Less power as user's HP decreases.",
		id: "dragonfist",
		isNonstandard: true,
		name: "Dragon Fist",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Dragon Ascent", target);
			this.add('-anim', source, "Dragon Dance", target);
			this.add('-anim', source, "Mega Punch", target);
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
		zMovePower: 250,
		contestType: "Cool",
	},
	glowingblitz: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		shortDesc: "Resets all of the target's stat stages to 0.",
		id: "glowingblitz",
		isNonstandard: true,
		name: "Glowing Blitz",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Tail Glow", target);
			this.add('-anim', source, "Glitzy Glow", target);
		},
		onHit: function (target) {
			target.clearBoosts();
			this.add('-clearboost', target);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMovePower: 160,
		contestType: "Beautiful",
	},
	chillclaw: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Has a 30% chance to freeze the target.",
		id: "chillclaw",
		isNonstandard: true,
		name: "Chill Claw",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Slash", target);
			this.add('-anim', source, "Glaciate", target);
		},
		secondary: {
			chance: 30,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		zMovePower: 140,
		contestType: "Clever",
	},
	thunderclaw: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Has a 30% chance to paralyze the target.",
		id: "thunderclaw",
		isNonstandard: true,
		name: "Thunder Claw",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Slash", target);
			this.add('-anim', source, "Thunder", target);
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		zMovePower: 140,
		contestType: "Clever",
	},
	flameclaw: {
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		shortDesc: "Has a 30% chance to burn the target.",
		id: "flameclaw",
		isNonstandard: true,
		name: "Flame Claw",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Slash", target);
			this.add('-anim', source, "Overheat", target);
		},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		zMovePower: 140,
		contestType: "Clever",
	},
	heat: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to become a Fire type. Fails if the target is an Arceus or a Silvally.",
		shortDesc: "Changes the target's type to Fire.",
		id: "heat",
		name: "Heat",
		isNonstandard: true,
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, mystery: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Tail Glow", target);
			this.add('-anim', source, "Will-O-Wisp", target);
		},
		onHit: function (target) {
			if (!target.setType('Fire')) {
				this.add('-fail', target);
				return null;
			}
			this.add('-start', target, 'typechange', 'Fire');
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		zMoveBoost: {spa: 1},
		contestType: "Cute",
	},
	lusterpunch: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's accuracy by 2 stages.",
		shortDesc: "50% chance to lower the target's accuracy by 2.",
		id: "lusterpunch",
		isNonstandard: true,
		name: "Luster Punch",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Tail Glow", target);
			this.add('-anim', source, "Flash", target);
			this.add('-anim', source, "Mega Punch", target);
		},
		secondary: {
			chance: 50,
			boosts: {
				accuracy: -2,
			},
		},
		target: "normal",
		type: "Light",
		zMovePower: 150,
		contestType: "Tough",
	},
};

exports.BattleMovedex = BattleMovedex;
