export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
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
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, minimize: 1 },
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
		onHit(target) {
			const moves = this.dex.moves.all().filter(move => (
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome'] && move.gen === 1
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			this.actions.useMove(randomMove, target);
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
		priority: -6,
		selfSwitch: true,
		onTry(source) {
			return !!this.canSwitch(source.side);
		},
	},
	zippyzap: {
		inherit: true,
		isNonstandard: null,
	},
};
