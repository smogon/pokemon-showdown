export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	allyswitch: {
		inherit: true,
		priority: 1,
	},
	assist: {
		inherit: true,
		flags: { noassist: 1, failcopycat: 1, nosleeptalk: 1 },
	},
	copycat: {
		inherit: true,
		flags: { noassist: 1, failcopycat: 1, nosleeptalk: 1 },
	},
	darkvoid: {
		inherit: true,
		accuracy: 80,
		onTry() {},
	},
	destinybond: {
		inherit: true,
		onPrepareHit(pokemon) {
			pokemon.removeVolatile('destinybond');
		},
	},
	diamondstorm: {
		inherit: true,
		self: null,
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
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
	},
	leechlife: {
		inherit: true,
		basePower: 20,
		pp: 15,
	},
	mefirst: {
		inherit: true,
		flags: { protect: 1, bypasssub: 1, noassist: 1, failcopycat: 1, failmefirst: 1, nosleeptalk: 1 },
	},
	metronome: {
		inherit: true,
		flags: { noassist: 1, failcopycat: 1, nosleeptalk: 1 },
	},
	mistyterrain: {
		inherit: true,
		condition: {
			inherit: true,
			onTryAddVolatile() {},
		},
	},
	mysticalfire: {
		inherit: true,
		basePower: 65,
	},
	naturepower: {
		inherit: true,
		flags: { nosleeptalk: 1, noassist: 1, failcopycat: 1 },
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
		flags: { contact: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1, minimize: 1 },
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
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	shadowforce: {
		inherit: true,
		flags: { contact: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1, minimize: 1 },
	},
	sheercold: {
		inherit: true,
		ohko: true,
	},
	sleeptalk: {
		inherit: true,
		flags: { nosleeptalk: 1, noassist: 1, failcopycat: 1 },
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
			onTryHit(target, source, effect) {
				// Wide Guard blocks damaging spread moves
				if (
					effect &&
					(effect.category === 'Status' || (effect.target !== 'allAdjacent' && effect.target !== 'allAdjacentFoes'))
				) {
					return;
				}
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
