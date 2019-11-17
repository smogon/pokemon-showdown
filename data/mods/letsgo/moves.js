'use strict';

/**@type {{[k: string]: ModdedMoveData}} */
let BattleMovedex = {
	absorb: {
		inherit: true,
		basePower: 40,
		pp: 15,
	},
	baddybad: {
		inherit: true,
		isNonstandard: null,
	},
	bouncybubble: {
		inherit: true,
		isNonstandard: null,
	},
	buzzybuzz: {
		inherit: true,
		isNonstandard: null,
	},
	doubleironbash: {
		inherit: true,
		isNonstandard: null,
	},
	floatyfall: {
		inherit: true,
		isNonstandard: null,
	},
	freezyfrost: {
		inherit: true,
		isNonstandard: null,
	},
	glitzyglow: {
		inherit: true,
		isNonstandard: null,
	},
	megadrain: {
		inherit: true,
		basePower: 75,
		pp: 10,
	},
	metronome: {
		inherit: true,
		onHit(target, source, effect) {
			let moves = [];
			for (let i in exports.BattleMovedex) {
				let move = this.dex.getMove(i);
				if (i !== move.id) continue;
				if (move.gen !== 1) continue;
				// @ts-ignore
				if (effect.noMetronome.includes(move.id)) continue;
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
	sappyseed: {
		inherit: true,
		isNonstandard: null,
	},
	sizzlyslide: {
		inherit: true,
		isNonstandard: null,
	},
	solarbeam: {
		inherit: true,
		basePower: 200,
	},
	sparklyswirl: {
		inherit: true,
		isNonstandard: null,
	},
	splishysplash: {
		inherit: true,
		isNonstandard: null,
	},
	skyattack: {
		inherit: true,
		basePower: 200,
	},
	teleport: {
		inherit: true,
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.",
		shortDesc: "User switches out.",
		priority: -6,
		selfSwitch: true,
		onTryHit: true,
	},
	zippyzap: {
		inherit: true,
		isNonstandard: null,
	},
};

exports.BattleMovedex = BattleMovedex;
