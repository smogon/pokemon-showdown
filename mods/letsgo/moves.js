'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
let BattleMovedex = {
	"absorb": {
		inherit: true,
		basePower: 40,
		pp: 15,
	},
	"baddybad": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"bouncybubble": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"buzzybuzz": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"doubleironbash": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"floatyfall": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"freezyfrost": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"glitzyglow": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"megadrain": {
		inherit: true,
		basePower: 75,
		pp: 10,
	},
	"metronome": {
		inherit: true,
		onHit: function (target, source, effect) {
			let moves = [];
			for (let i in this.data.Movedex) {
				let move = this.getMove(i);
				let canMetronome = ['pound', 'karatechop', 'doubleslap', 'cometpunch', 'megapunch', 'payday', 'firepunch', 'icepunch', 'thunderpunch', 'scratch', 'vicegrip', 'guillotine', 'razorwind', 'swordsdance', 'cut', 'gust', 'wingattack', 'whirlwind', 'fly', 'bind', 'slam', 'vinewhip', 'stomp', 'doublekick', 'megakick', 'jumpkick', 'rollingkick', 'sandattack', 'headbutt', 'hornattack', 'furyattack', 'horndrill', 'tackle', 'bodyslam', 'wrap', 'takedown', 'thrash', 'doubleedge', 'tailwhip', 'poisonsting', 'twineedle', 'pinmissile', 'leer', 'bite', 'growl', 'roar', 'sing', 'supersonic', 'sonicboom', 'disable', 'acid', 'ember', 'flamethrower', 'mist', 'watergun', 'hydropump', 'surf', 'icebeam', 'blizzard', 'psybeam', 'bubblebeam', 'aurorabeam', 'hyperbeam', 'peck', 'drillpeck', 'submission', 'lowkick', 'counter', 'seismictoss', 'strength', 'absorb', 'megadrain', 'leechseed', 'growth', 'razorleaf', 'solarbeam', 'poisonpowder', 'stunspore', 'sleeppowder', 'petaldance', 'stringshot', 'dragonrage', 'firespin', 'thundershock', 'thunderbolt', 'thunderwave', 'thunder', 'rockthrow', 'earthquake', 'fissure', 'dig', 'toxic', 'confusion', 'psychic', 'hypnosis', 'meditate', 'agility', 'quickattack', 'rage', 'teleport', 'nightshade', 'mimic', 'screech', 'doubleteam', 'recover', 'harden', 'minimize', 'smokescreen', 'confuseray', 'withdraw', 'defensecurl', 'barrier', 'lightscreen', 'haze', 'reflect', 'focusenergy', 'bide', 'metronome', 'mirrormove', 'selfdestruct', 'eggbomb', 'lick', 'smog', 'sludge', 'boneclub', 'fireblast', 'waterfall', 'clamp', 'swift', 'skullbash', 'spikecannon', 'constrict', 'amnesia', 'kinesis', 'softboiled', 'highjumpkick', 'glare', 'dreameater', 'poisongas', 'barrage', 'leechlife', 'lovelykiss', 'skyattack', 'transform', 'bubble', 'dizzypunch', 'spore', 'flash', 'psywave', 'splash', 'acidarmor', 'crabhammer', 'explosion', 'furyswipes', 'bonemerang', 'rest', 'rockslide', 'hyperfang', 'sharpen', 'conversion', 'triattack', 'superfang', 'slash', 'substitute', 'protect', 'sludgebomb', 'outrage', 'megahorn', 'encore', 'irontail', 'crunch', 'mirrorcoat', 'shadowball', 'fakeout', 'heatwave', 'willowisp', 'facade', 'taunt', 'helpinghand', 'superpower', 'brickbreak', 'yawn', 'bulkup', 'calmmind', 'roost', 'feint', 'uturn', 'suckerpunch', 'flareblitz', 'poisonjab', 'darkpulse', 'airslash', 'xscissor', 'bugbuzz', 'dragonpulse', 'nastyplot', 'iceshard', 'flashcannon', 'powerwhip', 'stealthrock', 'aquajet', 'quiverdance', 'foulplay', 'clearsmog', 'scald', 'shellsmash', 'dragontail', 'drillrun', 'playrough', 'moonblast', 'dazzlinggleam', 'doubleironbash'];
				if (i !== move.id) continue;
				if (move.isZ || move.isNonstandard) continue;
				if (!canMetronome.includes(move.id)) continue;
				if (move.gen > this.gen) continue;
				moves.push(move);
			}
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			this.useMove(randomMove, target);
		},
	},
	"pikapapow": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"sappyseed": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"sizzlyslide": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"solarbeam": {
		inherit: true,
		basePower: 200,
	},
	"sparklyswirl": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"splishysplash": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"skyattack": {
		inherit: true,
		basePower: 200,
	},
	"teleport": {
		inherit: true,
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.",
		shortDesc: "User switches out.",
		priority: -6,
		selfSwitch: true,
		onTryHit: true,
	},
	"veeveevolley": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
	"zippyzap": {
		inherit: true,
		isNonstandard: false,
		isUnreleased: false,
	},
};

exports.BattleMovedex = BattleMovedex;
