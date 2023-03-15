export const Moves: {[k: string]: ModdedMoveData} = {
	allyswitch: {
		inherit: true,
		priority: 1,
	},
	assist: {
		inherit: true,
		flags: {noassist: 1, failcopycat: 1, nosleeptalk: 1},
	},
	copycat: {
		inherit: true,
		flags: {noassist: 1, failcopycat: 1, nosleeptalk: 1},
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
	encore: {
		inherit: true,
		condition: {
			duration: 3,
			onStart(target) {
				const moveIndex = target.lastMove ? target.moves.indexOf(target.lastMove.id) : -1;
				if (
					!target.lastMove || target.lastMove.flags['failencore'] ||
					!target.moveSlots[moveIndex] || target.moveSlots[moveIndex].pp <= 0
				) {
					// it failed
					return false;
				}
				this.effectState.move = target.lastMove.id;
				this.add('-start', target, 'Encore');
				if (!this.queue.willMove(target)) {
					this.effectState.duration++;
				}
			},
			onOverrideAction(pokemon, target, move) {
				if (move.id !== this.effectState.move) return this.effectState.move;
			},
			onResidualOrder: 16,
			onResidual(target) {
				const lockedMoveIndex = target.moves.indexOf(this.effectState.move);
				if (lockedMoveIndex >= 0 && target.moveSlots[lockedMoveIndex].pp <= 0) {
					// Encore ends early if you run out of PP
					target.removeVolatile('encore');
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove(pokemon) {
				if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	fellstinger: {
		inherit: true,
		basePower: 30,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({atk: 2}, pokemon, pokemon, move);
		},
	},
	flyingpress: {
		inherit: true,
		basePower: 80,
	},
	leechlife: {
		inherit: true,
		basePower: 20,
		pp: 15,
	},
	mefirst: {
		inherit: true,
		flags: {protect: 1, bypasssub: 1, noassist: 1, failcopycat: 1, failmefirst: 1, nosleeptalk: 1},
	},
	minimize: {
		inherit: true,
		condition: {
			noCopy: true,
			onSourceModifyDamage(damage, source, target, move) {
				const boostedMoves = [
					'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'phantomforce', 'heatcrash', 'shadowforce',
				];
				if (boostedMoves.includes(move.id)) {
					return this.chainModify(2);
				}
			},
			onAccuracy(accuracy, target, source, move) {
				const boostedMoves = [
					'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'phantomforce', 'heatcrash', 'shadowforce',
				];
				if (boostedMoves.includes(move.id)) {
					return true;
				}
				return accuracy;
			},
		},
	},
	metronome: {
		inherit: true,
		flags: {noassist: 1, failcopycat: 1, nosleeptalk: 1},
	},
	mistyterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (effect && ((effect as Move).status || effect.id === 'yawn')) {
					this.add('-activate', target, 'move: Misty Terrain');
				}
				return false;
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Misty Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'Misty Terrain');
			},
		},
	},
	mysticalfire: {
		inherit: true,
		basePower: 65,
	},
	naturepower: {
		inherit: true,
		flags: {nosleeptalk: 1, noassist: 1, failcopycat: 1},
	},
	paraboliccharge: {
		inherit: true,
		basePower: 50,
	},
	partingshot: {
		inherit: true,
		onHit(target, source) {
			this.boost({atk: -1, spa: -1}, target, source);
		},
	},
	powder: {
		inherit: true,
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Powder');
			},
			onTryMovePriority: 1,
			onTryMove(pokemon, target, move) {
				if (move.type === 'Fire') {
					this.add('-activate', pokemon, 'move: Powder');
					this.damage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1));
					this.attrLastMove('[still]');
					return false;
				}
			},
		},
	},
	rockblast: {
		inherit: true,
		flags: {protect: 1, mirror: 1},
	},
	sheercold: {
		inherit: true,
		ohko: true,
	},
	sleeptalk: {
		inherit: true,
		flags: {nosleeptalk: 1, noassist: 1, failcopycat: 1},
	},
	stockpile: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(target) {
				this.effectState.layers = 1;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				this.boost({def: 1, spd: 1}, target, target);
			},
			onRestart(target) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				this.boost({def: 1, spd: 1}, target, target);
			},
			onEnd(target) {
				const layers = this.effectState.layers * -1;
				this.effectState.layers = 0;
				this.boost({def: layers, spd: layers}, target, target);
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
			duration: 1,
			onSideStart(target, source) {
				this.add('-singleturn', source, 'Wide Guard');
			},
			onTryHitPriority: 4,
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
