export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	allyswitch: {
		inherit: true,
		priority: 1,
	},
	assist: {
		inherit: true,
		flags: { inherit: true, failencore: 0 },
	},
	copycat: {
		inherit: true,
		flags: { inherit: true, failencore: 0 },
	},
	darkvoid: {
		inherit: true,
		accuracy: 80,
		onTry: undefined, // no inherit
	},
	destinybond: {
		inherit: true,
		onPrepareHit(pokemon) {
			pokemon.removeVolatile('destinybond');
		},
	},
	diamondstorm: {
		inherit: true,
		self: undefined, // no inherit
		secondary: {
			chance: 50,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
	},
	fellstinger: {
		inherit: true,
		basePower: 30,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({ atk: 2 }, pokemon, pokemon, move);
		},
	},
	flyingpress: {
		inherit: true,
		basePower: 80,
	},
	heavyslam: {
		inherit: true,
		flags: { inherit: true, minimize: 0 },
	},
	leechlife: {
		inherit: true,
		basePower: 20,
		pp: 15,
	},
	mefirst: {
		inherit: true,
		flags: { inherit: true, failencore: 0 },
	},
	metronome: {
		inherit: true,
		flags: { inherit: true, failencore: 0 },
	},
	mistyterrain: {
		inherit: true,
		condition: {
			inherit: true,
			onTryAddVolatile: undefined, // no inherit
		},
	},
	mysticalfire: {
		inherit: true,
		basePower: 65,
	},
	naturepower: {
		inherit: true,
		flags: { inherit: true, failencore: 0 },
	},
	paraboliccharge: {
		inherit: true,
		basePower: 50,
	},
	partingshot: {
		inherit: true,
		onHit(target, source) {
			this.boost({ atk: -1, spa: -1 }, target, source);
		},
	},
	phantomforce: {
		inherit: true,
		flags: { inherit: true, minimize: 1 },
	},
	powder: {
		inherit: true,
		condition: {
			inherit: true,
			onTryMovePriority: 1,
		},
	},
	rockblast: {
		inherit: true,
		flags: { inherit: true, bullet: 0 },
	},
	shadowforce: {
		inherit: true,
		flags: { inherit: true, minimize: 1 },
	},
	sheercold: {
		inherit: true,
		ohko: true,
	},
	sleeptalk: {
		inherit: true,
		flags: { inherit: true, failencore: 0 },
	},
	stockpile: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(target) {
				this.effectState.layers = 1;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				this.boost({ def: 1, spd: 1 }, target, target);
			},
			onRestart(target) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				this.boost({ def: 1, spd: 1 }, target, target);
			},
			onEnd(target) {
				const layers = this.effectState.layers * -1;
				this.effectState.layers = 0;
				this.boost({ def: layers, spd: layers }, target, target);
				this.add('-end', target, 'Stockpile');
			},
		},
	},
	suckerpunch: {
		inherit: true,
		basePower: 80,
	},
	swagger: {
		inherit: true,
		accuracy: 90,
	},
	tackle: {
		inherit: true,
		basePower: 50,
	},
	thousandarrows: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	thousandwaves: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	thunderwave: {
		inherit: true,
		accuracy: 100,
	},
	watershuriken: {
		inherit: true,
		category: "Physical",
	},
	wideguard: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(target, source, move) {
				// Wide Guard blocks damaging spread moves
				if (move.category === 'Status' || (move?.target !== 'allAdjacent' && move.target !== 'allAdjacentFoes')) {
					return;
				}
				if (this.checkMoveBypassesProtect(move, source, target, false)) return;
				this.add('-activate', target, 'move: Wide Guard');
				const lockedmove = source.getVolatile('lockedmove');
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
};
