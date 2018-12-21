'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
let BattleMovedex = {
// Static
	pikapower: {
		accuracy: true,
		basePower: 170,
		category: "Special",
		desc: "Does not check accuracy. Raises the user's Speed by 1 stage if this move knocks out the target.",
		shortDesc: "Raises user's Speed by 1 if this KOes the target.",
		id: "pikapower",
		name: "Pika Power!",
		isNonstandard: true,
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, 'Charge', target);
			this.add('-anim', source, 'Electrify', target);
			this.add('-anim', source, 'Thunder', target);
		},
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({spe: 1}, pokemon, pokemon, move);
		},
		secondary: null,
		target: "normal",
		type: "Electric",
	},
// Erika
	evoimpact: {
		accuracy: true,
		category: "Status",
		desc: "The user transforms into a different Pokemon, and it uses a move dependent on the Pokemon: Vaporeon (Bouncy Bubble), Jolteon (Buzzy Buzz), Sizzly Slide (Flareon), Espeon (Glitzy Glow), Umbreon (Baddy Bad), Leafeon (Sappy Seed), Glaceon (Freezy Frost), and Sylveon (Sparkly Swirl). Reverts to an Eevee at the end of the turn.",
		shortDesc: " For turn: transforms, uses linked move.",
		id: "evoimpact",
		name: "Evo-Impact",
		isNonstandard: true,
		pp: 5,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onHit: function (target, source, move) {
			let baseForme = source.template.id;
			/** @type {{[forme: string]: string}} */
			let formes = {
				vaporeon: 'Bouncy Bubble',
				jolteon: 'Buzzy Buzz',
				flareon: 'Sizzly Slide',
				espeon: 'Glitzy Glow',
				umbreon: 'Baddy Bad',
				leafeon: 'Sappy Seed',
				glaceon: 'Freezy Frost',
				sylveon: 'Sparkly Swirl',
			};
			let forme = Object.keys(formes)[this.random(8)];
			source.formeChange(forme, this.getAbility('quickstart'), true);
			this.useMove(formes[forme], source, target);
			source.formeChange(baseForme, this.getAbility('quickstart'), true);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
// Aqua
	aquasphere: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 50% chance to lower the target's Special Attack by 2 stages.",
		shortDesc: "50% chance to lower the target's Sp. Atk by 2.",
		id: "aquasphere",
		name: "Aqua Sphere",
		isNonstandard: true,
		pp: 15,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, 'Surf', source);
			this.add('-anim', source, 'Liquidation', source);
			this.add('-anim', source, 'Aura Sphere', target);
		},
		secondary: {
			chance: 50,
			boosts: {
				spa: -2,
			},
		},
		target: "normal",
		type: "Water",
	},
// Mizzy
	prismrocket: {
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		desc: "This move is a special attack if the user's Special Attack stat is greater than its Attack stat; otherwise, it is a physical attack. 50% chance to lower the target's Speed.",
		shortDesc: "Special if user's Sp. Atk > Attack. Lowers Speed.",
		id: "prismrocket",
		name: "Prism Rocket",
		isNonstandard: true,
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = pokemon.types[0];
			if (pokemon.getStat('spa', false, true) > pokemon.getStat('atk', false, true)) move.category = 'Special';
		},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, 'Geomancy', source);
			this.add('-anim', source, 'Flash', source);
			this.add('-anim', source, 'Comet Punch', target);
		},
		secondary: {
			chance: 50,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Psychic",
	},
// Zena
	titanforce: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Fails unless the user is a Ground type. If this move is successful, the user's Ground type becomes typeless as long as it remains active. Has a 100% chance to lower the target's Attack by 2 stages.",
		shortDesc: "User's Ground type becomes typeless; Lowers Attack.",
		id: "titanforce",
		name: "Titan Force",
		isNonstandard: true,
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function (pokemon, target, move) {
			this.attrLastMove('[still]');
			if (pokemon.hasType('Ground')) return;
			this.add('-fail', pokemon, 'move: Titan Force');
			this.attrLastMove('[still]');
			return null;
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, 'Earthquake', target);
			this.add('-anim', source, 'Stomping Tantrum', target);
		},
		self: {
			onHit: function (pokemon) {
				pokemon.setType(pokemon.getTypes(true).map(type => type === "Ground" ? "???" : type));
				this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[from] move: Titan Force');
			},
		},
		secondary: {
			chance: 100,
			boosts: {
				atk: -2,
			},
		},
		target: "normal",
		type: "Ground",
	},
// Kyle
	desertdrain: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "desertdrain",
		name: "Desert Drain",
		isNonstandard: true,
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Leech Life", target);
		},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Ground",
	},
// Serene Star
	snowdance: {
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		desc: "Has a 50% chance to raise the user's Attack by 1 stage.",
		shortDesc: "50% chance to raise the user's Attack by 1.",
		id: "snowdance",
		isNonstandard: true,
		name: "Snow Dance",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, dance: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Revelation Dance", source);
			this.add('-anim', source, "Mist", source);
			this.add('-anim', source, "Powder Snow", source);
			this.add('-anim', source, "Slam", target);
		},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Ice",
	},
// Goby	
	electroflash: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Has a 100% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "100% chance to raise the user's Special Attack by 1.",
		id: "electroflash",
		isNonstandard: true,
		name: "Electro Flash",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Charge", source);
			this.add('-anim', source, "Electrify", source);
			this.add('-anim', source, "Flash", target);
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Electric",
	},
// The Hound
	darkflare: {
		accuracy: 85,
		basePower: 130,
		category: "Special",
		desc: "Summons Sunny Day after doing damage and combines Fire in its type effectiveness against the target.",
		shortDesc: "Summons Sunny Day. Combines Fire in its type effectiveness.",
		id: "darkflare",
		isNonstandard: true,
		name: "Dark Flare",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Dark Pulse", target);
			this.add('-anim', source, "Overheat", target);
		},
		onAfterMoveSecondarySelf: function () {
			this.setWeather('sunnyday');
		},
		onEffectiveness: function (typeMod, type, move) {
			return typeMod + this.getEffectiveness('Fire', type);
		},
		secondary: null,
		target: "normal",
		type: "Dark",
	},
// Felix	
	themagicbagoftricks: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the target to become confused and raises the user's Attack, Defense, Special Attack, Special Defense, Speed, Accuracy, and Evasion by 2 stages.",
		shortDesc: "Confuses adjacent Pokemon. Raises user's stats by 2.",
		id: "themagicbagoftricks",
		name: "The Magic Bag of Tricks",
		isNonstandard: true,
		pp: 1,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, 'Geomancy', source);
			this.add('-anim', source, 'Flash', source);
			this.add('-anim', source, 'Present', target);
			this.add('-anim', source, 'Teeter Dance', target);
		},
		onHit: function () {
			let messages = ["On with the show!",
				"YOU MESSED THEM ALL UP WITH CATS, POPEYES, DOUG, ANGELICA, AND LITTLE KIDDIE SHOWS!",
				"Your TROLLFACE!!!!",
				"Hello, immortal pineapple-and-banana-pepper-pizza!",
				"Holy spinach teeth?",
				"I’ve had all sorts of succotash",
				"Clone your fork",
				"Holy cheese and crackers!",
				"This is bananas: P-Q-L-E-F-E-T!",
				"This garbage attracts flies and huge roaches like crazy",
				"That's Nick's garbage!",
				"I WON'T OBEY A BUNCH OF CORN AND BEANS!",
				"Don't eat pigs, don't eat BATS, Don't eat beetles, flies or gnats.",
				"No Boogers In My Burgers!.",
				"Listen the moles, freckles, and warts thing is getting old...",
				"You can draw all the bubblegum and chocolate Pop Rocks you want.",
				"paper in your ear?",
				"*Creates blue zits, blackheads and abscesses*",
				"*poofs Pac-Man away*",
				"STOP SENDING YOUR WHITE KNIGHTS AFTER AKIRA!",
				"OH WOW A TWITTER THAT'S ALIVE!",
				"MEGA ROBOTS MOD!",
				"ALL OVER MY NEW SWEATER!",
				"*they get on my face* AHHH!",
				"EWWW!!! BOOGERS!!!",
				"I DON'T LIKE THE VOMIT THING, YOU DO!!!",
				"WHAT IS SO GREAT ABOUT WALMART ANYWAY!?",
				"I WOULDN'T EAT FACE MOLES!",
				"WHAT ARE SPINACH TEETH!?",
				"I HATE SUCCOTASH AND SPINACH! HERE!",
				"SUCCOTASH DOESN'T SCARE ME!",
				"Crackers don't scare me.",
				"I hate hamburgers.",
				"Wowsers indeed",
				"THERE'S A MACARONI ON MY HEAD!",
				"AAAAAAH! THEY'RE REAL!!!!",
				"LAND WITHOUT BRAINS IS MORE LIKE IT!!",
				"There's a car! There's a car! There's a car! There's a car!",
				"Bon appétit!",
				"AAAAAAAHHHH! FIRE!",
				"GOTTA SWEEP SWEEP SWEEP!",
				"TURN THE RECORD OVER!",
				"PASTAAAAAA!!!",
				"Donuts, Donuts, Donuts, Donuts!!",
				"AAEEOOO! KILLER TOFU!",
				"Garbage Attack!",
				"Holy cheesewhiskers!!",
				"Um, do you still like making dinosaurs out of cheese wax?",
				"People still say beeswax? How old are you again, five?",
				"Oh won't you have some waffles of mine!",
				"AHOY! SPINACH!",
				"Don't go I WILL KNOCK YOUR TEETH OUT!!!!",
				"Forks?! Come on! *Crowd is booing*",
				"Hide your bananas.",
				"OOH WAH AH AH AH!",
				"Stupid Storks and Sausages!",
				"Popcorn Shrimp?",
				"Bran Flakes?",
				"HOLY BANANAS!!!",
				"THATS ALL FOLKS!"][this.random(60)];

			this.add(`raw|<img src="https://i.ytimg.com/vi/_AkgzVe91Kc/hqdefault.jpg" height="360" width="480"><br><b>${messages}</b>`);
		},
		volatileStatus: 'confusion',
		self: {
			boosts: {
			atk: 2,
			def: 2,
			spa: 2,
			spd: 2,
			spe: 2,
			evasion: 2,
			accuracy: 2,
			},
		},
		secondary: null,
		isZ: "felixiumz",
		target: "allAdjacent",
		type: "Normal",
	},
// Chuck
	frenzydance: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		desc: "Has a 30% chance to lower the target's Defense by 2 stages.",
		shortDesc: "30% chance to lower the target's Defense by 2.",
		id: "frenzydance",
		isNonstandard: true,
		name: "Frenzy Dance",
		pp: 20,
		priority: 2,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Revelation Dance", source);
			this.add('-anim', source, "Dark Pulse", source);
			this.add('-anim', source, "Night Slash", target);
		},
		onHit: function () {
			this.add(`c|Chuck|Bamm-Bamm-Bamm\!`);
		},
		secondary: {
			chance: 30,
			boosts: {
				def: -2,
			},
		},
		target: "normal",
		type: "Dark",
	},
// Abby	
	mermaidwhirl: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Summons Rain Dance after doing damage. If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target is under the effect of Ingrain, has the Suction Cups Ability, or this move hit a substitute. ",
		shortDesc: "Forces the target to switch to a random ally. Summons Rain Dance.",
		id: "mermaidwhirl",
		isNonstandard: true,
		name: "Mermaid Whirl",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		forceSwitch: true,
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Surf", source);
			this.add('-anim', source, "Whirlwind", target);
		},
		onAfterMoveSecondarySelf: function () {
			this.setWeather('raindance');
		},
		secondary: null,
		target: "normal",
		type: "Water",
	},
 // Nappa
	herossword: {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Ignores the target's stat stage changes, including evasiveness. This move's type effectiveness against Ghost is changed to be super effective no matter what this move's type is.",
		shortDesc: "Super effective on Ghost. Ignores stat stage changes.",
		id: "herossword",
		name: "Hero's Sword",
		isNonstandard: true,
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		ignoreEvasion: true,
		ignoreDefensive: true,
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Sacred Sword`", target);
		},
		ignoreImmunity: {'Fighting': true},
		onEffectiveness: function (typeMod, type) {
			if (type === 'Ghost') return 1;
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
// Gidget
	gidgetblast: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "This move's type changes to match the user's primary type. Has a 30% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "Shares user's type. 30% chance to lower the target's Sp. Def by 1.",
		id: "gidgetblast",
		isNonstandard: true,
		name: "Gidget Blast",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove: function (move, pokemon) {
			let type = pokemon.types[0];
			if (type === "Bird") type = "???";
			move.type = type;
		},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source, move) {
			this.add('-anim', source, 'Geomancy', source);
			switch (move.type) {
			case 'Fire':
				this.add('-anim', source, 'Fire Blast', target);
				break;
			case 'Water':
				this.add('-anim', source, 'Hydro Pump', target);
				break;
			case 'Grass':
				this.add('-anim', source, 'Leaf Storm', target);
				break;
			}
		},
		secondary: {
			chance: 30,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Normal",
	},
// Sedna
	skydance: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack, Special Attack, and Speed by 1 stage.",
		shortDesc: "Raises the user's Attack, Special Attack, and Speed by 1.",
		id: "skydance",
		name: "Sky Dance",
		isNonstandard: true,
		pp: 25,
		priority: 0,
		flags: {snatch: 1, dance: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Wrap`", source);
			this.add('-anim', source, "Revelation Dance`", source);
			this.add('-anim', source, "Wing Attack`", source);
		},
		boosts: {
			atk: 1,
			spa: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Flying",
	},
// Skyla
	lugiassong: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Lowers the user's Speed by 1 stage. Raises the user's Defense and Special Defense by 2 stages.",
		shortDesc: "Lowers Spe by 1; raises SpD, Def by 2.",
		id: "lugiassong",
		isViable: true,
		name: "Lugia's Song",
		pp: 40,
		priority: 0,
		flags: {snatch: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Sing`", source);
			this.add(`c|Skyla|You always love me more, miles away`);
			this.add(`c|Skyla|I hear it in your voice, we're miles away`);
			this.add(`c|Skyla|You're not afraid to tell me, miles away`);
			this.add(`c|Skyla|I guess we're at our best when we're miles away`);
		},
		boosts: {
			def: 2,
			spd: 2,
			spe: -1,
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	// Kris
	psychoflash: {
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "Has a 10% chance to summon Psychic Terrain.",
		shortDesc: "10% chance to summon Psychic Terrain.",
		id: "psychoflash",
		name: "Psycho Flash",
		isNonstandard: true,
		pp: 5,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Psych Up", source);
			this.add('-anim', source, "Psychic", source);
			this.add('-anim', source, "Flash", target);
		},
		secondary: {
			chance: 30,
			self: {
				onHit: function () {
					this.setTerrain('psychicterrain');
				},
			},
		},
		target: "normal",
		type: "Psychic",
	},
	// Sheka
	analyzingcolors: {
		accuracy: true,
		category: "Status",
		desc: "If the user is a Silvally or an Arceus, its item becomes a random Memory whose type matches one of the target's weaknesses, it changes forme, and it uses Judgment. This move and its effects ignore the Abilities of other Pokemon. Fails if the target has no weaknesses.",
		shortDesc: "Changes user/move type to a weakness of target.",
		id: "analyzingcolors",
		isNonstandard: true,
		name: "Analyzing Colors",
		pp: 5,
		priority: 0,
		flags: {authentic: 1, protect: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Flash", source);
			this.add('-anim', source, "Geomancy", source);
			this.add('-anim', source, "Conversion", source);
		},
		onHit: function (target, source) {
			let targetTypes = target.getTypes(true).filter(type => type !== '???');
			if (!targetTypes.length) {
				if (target.addedType) {
					targetTypes = ['Normal'];
				} else {
					return false;
				}
			}
			let weaknesses = [];
			for (let type in this.data.TypeChart) {
				let typeMod = this.getEffectiveness(type, targetTypes);
				if (typeMod > 0 && this.getImmunity(type, target)) weaknesses.push(type);
			}
			if (!weaknesses.length) {
				return false;
			}
			let randomType = this.sample(weaknesses);
			source.setItem(randomType + 'memory');
			this.add('-item', source, source.getItem(), '[from] move: Analyzing Colors');
      if (source.template.speciesid === 'silvally') {
			let template = this.getTemplate('Silvally-' + randomType);
			source.formeChange(template, this.getAbility('rkssystem'), true);
			}
      if (source.template.speciesid === 'arceus') {
			let template = this.getTemplate('Arceus-' + randomType);
			source.formeChange(template, this.getAbility('multitype'), true);
			}
			let move = this.getActiveMove('judgment');
			move.basePower = 140;
			this.useMove(move, source, target);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMoveEffect: 'heal',
	},
	// Leonas
	turnover: {
		accuracy: 100,
		basePower: 50,
		basePowerCallback: function (pokemon, target, move) {
			return move.basePower + 50 * pokemon.positiveBoosts();
		},
		category: "Special",
		desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. Power is equal to 50+(X*50), where X is the user's total stat stage changes that are greater than 0. This move and its effects ignore the Abilities of other Pokemon.",
		shortDesc: " Physical if Atk > Sp. Atk. Ignores Abilities. + 50 power for stat boosts.",
		id: "turnover",
		name: "Turn Over",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Agility", source);
			this.add('-anim', source, "Hidden Power [Psychic]", source);
		},
		ignoreAbility: true,
    isNonstandard: true,
		secondary: null,
		target: "normal",
		type: "???",
	},
	// Anabelle
	fairypulse: {
		accuracy: 100,
		basePower: 85,
		category: "Special",
		desc: "Has a 40% chance to raise the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "40% chance to raise all stats by 1 (not acc/eva).",
		id: "fairypulse",
		name: "Fairy Pulse",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Aromatic Mist", source);
			this.add('-anim', source, "Hyper Voice", source);
		},
		secondary: {
			chance: 40,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1,
				},
			},
		},
		isNonstandard: true,
		target: "normal",
		type: "Fairy",
	},
	// Crystal
	crystalboom: {
		accuracy: 90,
		basePower: 110,
		category: "Special",
		desc: "Freezes the target and has a 40% chance to raise the user's Special Attack by 3 stages. If the target already has a status ailment, it is replaced with a freeze. Fails if the target is an Ice-type or if the user is not an Ice-type.",
		shortDesc: "40% chance to raise Sp. Atk. by 3.; replace status w/freeze",
		id: "crystalboom",
		name: "Crystal Boom",
		isNonstandard: true,
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMovePriority: 100,
		onTryMove: function (pokemon, target, move) {
			this.attrLastMove('[still]');
			if (!pokemon.hasType('Ice') || target.hasType('Ice')) {
				this.add('-fail', pokemon, 'move: Crystal Boom');
				return null;
			}
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Mist", target);
			this.add('-anim', source, "Glaciate", target);
		},
		onHit: function (target, source) {
			target.setStatus('frz', source, null, true);
			// Cringy message
			if (this.random(5) === 1) this.add(`c|Crystal|This is what you get! XD`);
		},
		secondary: {
			chance: 40,
			self: {
				boosts: {
					spa: 3,
				},
			},
		},
		target: "normal",
		type: "Ice",
	},
		// Speedy
	chargespin: {
		accuracy: 100,
		basePower: 110,
		category: "Physical",
		desc: "Nearly always goes first. If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field. Has a 30% chance to paralyze the foe.",
		shortDesc: "Strike first. Free from hazds./trap/seed. 30% chance to par foe.",
		id: "chargespin",
		name: "Charge Spin",
		isNonstandard: true,
		pp: 10,
		priority: 2,
		flags: {mirror: 1, protect: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Charge", source);
			this.add('-anim', source, "Rapid Spin", target);
		},
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Charge Spin', '[of] ' + pokemon);
				}
				let sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.getEffect(condition).name, '[from] move: Charge Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
	},
	// Gold Ho-Oh
	goldenpassion: {
		accuracy: true,
		basePower: 170,
		category: "Physical",
		desc: "Fully restores the user's HP if this move knocks out the target. Causes the target to become a Fire type when hit. Fails if the target is an Arceus or a Silvally.",
		shortDesc: "Restore if it KOs foe; changes foe's type to Fire.",
		id: "goldenpassion",
		name: "Golden Passion",
		isNonstandard: true,
		pp: 1,
		priority: 0,
		flags: {},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Charge", source);
			this.add('-anim', source, "Eruption", source);
			this.add('-anim', source, "v-Create", target);
		},
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.heal(pokemon.maxhp, pokemon, pokemon, move);
		},
		onHit: function (target) {
			if (!target.setType('Fire')) {
				this.add('-fail', target);
				return null;
			}
			this.add('-start', target, 'typechange', 'Fire');
		},
		isZ: "goldhoohniumz",
		secondary: null,
		target: "normal",
		type: "Fire",
	},
// AJ The Keldeo
	oblivionsword: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Has a 30% chance to cause the target to flinch. If this move is successful and the user is a Keldeo, it changes to Resolute Forme if it is currently in Ordinary Forme, or changes to Ordinary Forme if it is currently in Resolute Forme. This forme change does not happen if the Keldeo has the Sheer Force Ability. The Resolute Forme reverts to Ordinary Forme when Keldeo is not active. Fighting-type attacks can hit if the target is a Ghost-type and the target loses its type-based immunity to Normal and Fighting.",
		shortDesc: "30% chance to flinch. Keldeo transforms. Hits Ghosts.",
		id: "oblivionsword",
		isNonstandard: true,
		name: "Oblivion Sword",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, 'Judgment', source);
			this.add('-anim', source, 'Secret Sword', target);
		},
		onEffectiveness: function (typeMod, type, move) {
			if (move.type !== 'Fighting') return;
			let target = this.activeTarget;
			if (!target) return; // avoid crashing when called from a chat plugin
			if (!target.runImmunity('Fighting')) {
				if (target.hasType('Ghost')) return 0;
			}
		},
		volatileStatus: 'foresight',
		effect: {
			noCopy: true,
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Oblivion Sword');
			},
			onNegateImmunity: function (pokemon, type) {
				if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type)) return false;
			},
		},
		ignoreImmunity: true,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		onHit: function (target, pokemon, move) {
			if (pokemon.baseTemplate.baseSpecies === 'Keldeo' && !pokemon.transformed) {
				move.willChangeForme = true;
			}
		},
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			if (move.willChangeForme) {
				pokemon.formeChange(pokemon.template.speciesid === 'keldeoresolute' ? 'Keldeo' : 'Keldeo-Resolute', this.effect, false, '[msg]');
			}
		},
		target: "normal",
		type: "Fighting",
	},
// Zatch
  zboom: {
		accuracy: true,
		basePower: 170,
		category: "Special",
		desc: "This move and its effects ignore the Type Immunities and Abilities of other Pokemon. If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
		shortDesc: "Ignores the Abilities and immunties. Breaks protection.",
		id: "zboom",
		isNonstandard: true,
		name: "Z-Boom",
		pp: 5,
		priority: 0,
		flags: {authentic: 1},
		breaksProtect: true,
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, 'Searing Sunraze Smash', source);
			this.add('-anim', source, 'Prismatic Laser', target);
		},
		ignoreImmunity: true,
		ignoreAbility: true,
		secondary: null,
    target: "normal",
		type: "???",
	},
	znextlevel: {
		accuracy: true,
		category: "Status",
		desc: "The user gains 10 levels when using this move, which persist upon switching out.",
		shortDesc: "User gains 10 levels.",
		id: "znextlevel",
		name: "Z-Next Level",
		isNonstandard: true,
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Amnesia", target);
		},
		onHit: function (pokemon) {
			const template = pokemon.template;
			pokemon.level += 10;
			pokemon.set.level = pokemon.level;
			pokemon.formeChange(template);

			pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('detailschange', pokemon, pokemon.details);

			const newHP = Math.floor(Math.floor(2 * template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');

			this.add('-message', `${pokemon.name} advanced 10 levels! It is now level ${pokemon.level}!`);
		},
		secondary: null,
		target: "self",
		type: "???",

	},
		zexpo: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Confuses and badly poisons the target and subjects it to the effects of Taunt, Torment, Heal Block, Embargo, and Leech Seed. 50% chance to win on the user's side.",
		shortDesc: "May dominate the opponent.",
		id: "zexpo",
		name: "Z-Expo",
		isNonstandard: true,
		pp: 15,
		priority: 0,
		flags: {authentic: 1},
		breaksProtect: true,
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Charge", source);
			this.add('-anim', source, "Flash", source);
			this.add('-anim', source, "Teeter Dance", target);
		},
		onHit: function (target, source) {
			target.addVolatile('taunt', source);
			target.addVolatile('embargo', source);
			target.addVolatile('torment', source);
			target.addVolatile('confusion', source);
			target.addVolatile('healblock', source);
			target.addVolatile('leechseed', source);
			this.add(`c|Zatch|Take that\!`);
			if (this.random(100) === 50) {
				// 50% chance to forcibly give the user's trainer the win
				this.add(`c|Zatch|Team ${source.side.name} should be mine now\!`);
				this.win(source.side);
			}
		},
		secondary: {
			chance: 100,
			status: 'tox',
		},
		ignoreImmunity: true,
		ignoreAbility: true,
		target: "normal",
		type: "???",
	},
		zshield: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most attacks made by other Pokemon for 5 turns.",
		shortDesc: "Prevents moves from affecting the user for 5 turns.",
		id: "zshield",
		name: "Z-Shield",
		isNonstandard: true,
		pp: 5,
		priority: 5,
		flags: {},
		volatileStatus: 'zshield',
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Barrier", source);
			this.add('-anim', source, "Protect", source);
		},
		effect: {
			duration: 3,
			onStart: function (target) {
				this.add('-start', target, 'Z-Shield', '[silent]');
				this.add('-message', `${target.name} is protected with Z-Shield.`);
				this.add(`c|Zatch|Now you can't hit me\!`);
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				this.add('-activate', target, 'move: Z-Shield');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
			onEnd: function (target) {
				this.add('-end', target, 'Z-Shield', '[silent]');
				this.add('-message', `${target.name}'s Z-Shield has ended.`);
				this.add(`c|Zatch|I was now have to use Z-Shield again\!`);
			},
		},
		secondary: null,
		target: "self",
		type: "???",
	},
		zspin: {
		accuracy: 100,
		basePower: 170,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field. Has a 50% chance to freeze the target. Summons Delta Stream afterwards.",
		shortDesc: "Free from hazds./trap/seed. 30% chance to par foe. Summons Delta Stream.",
		id: "zspin",
		name: "Z-Spin",
		isNonstandard: true,
		pp: 10,
		priority: 0,
		flags: {authentic: 1},
		breaksProtect: true,
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Rapid Spin", target);
		},
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Z-Spin', '[of] ' + pokemon);
				}
				let sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.getEffect(condition).name, '[from] move: Z-Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
		onAfterMoveSecondarySelf: function () {
			this.setWeather('deltastream');
           this.add(`c|Zatch|Take that\!`);
		},
		secondary: {
			chance: 50,
			status: 'frz',
		},
		ignoreImmunity: true,
		ignoreAbility: true,
		target: "normal",
		type: "???",
	},
		zspin: {
		accuracy: 100,
		basePower: 170,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field. Has a 50% chance to freeze the target. Summons Delta Stream afterwards.",
		shortDesc: "Free from hazds./trap/seed. 30% chance to frz foe. Summons winds.",
		id: "zspin",
		name: "Z-Spin",
		isNonstandard: true,
		pp: 10,
		priority: 0,
		flags: {authentic: 1},
		breaksProtect: true,
		onTryMovePriority: 100,
		onTryMove: function () {
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, "Rapid Spin", target);
		},
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Charge Spin', '[of] ' + pokemon);
				}
				let sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.getEffect(condition).name, '[from] move: Charge Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
		onAfterMoveSecondarySelf: function () {
			this.setWeather('deltastream');
		},
		secondary: {
			chance: 50,
			status: 'frz',
		},
		ignoreImmunity: true,
		ignoreAbility: true,
		target: "normal",
		type: "???",
	},
};

exports.BattleMovedex = BattleMovedex;
