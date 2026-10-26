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
		onAfterMoveSecondarySelf(pokemon, defender, move) {
			if (!defender || defender.fainted || defender.hp <= 0) this.boost({ atk: 2 }, pokemon, pokemon, move);
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
			onTryAddVolatile: undefined, // no inherit
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
		onHit(defender, attacker) {
			this.boost({ atk: -1, spa: -1 }, defender, attacker);
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
			onStart(defender) {
				this.effectState.layers = 1;
				this.add('-start', defender, 'stockpile' + this.effectState.layers);
				this.boost({ def: 1, spd: 1 }, defender, defender);
			},
			onRestart(defender) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				this.add('-start', defender, 'stockpile' + this.effectState.layers);
				this.boost({ def: 1, spd: 1 }, defender, defender);
			},
			onEnd(defender) {
				const layers = this.effectState.layers * -1;
				this.effectState.layers = 0;
				this.boost({ def: layers, spd: layers }, defender, defender);
				this.add('-end', defender, 'Stockpile');
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
			onTryHit(defender, attacker, move) {
				// Wide Guard blocks damaging spread moves
				if (move.category === 'Status' || (move?.defender !== 'allAdjacent' && move.defender !== 'allAdjacentFoes')) {
					return;
				}
				if (this.checkMoveBypassesProtect(move, attacker, defender, false)) return;
				this.add('-activate', defender, 'move: Wide Guard');
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
	},
};
