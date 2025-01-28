export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	stealthrock: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side, source) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				const calc = calculate(this, this.effectState.source, pokemon, 'stealthrock');
				if (pokemon.hasItem('heavydutyboots') || !calc) return;
				this.damage(calc * pokemon.maxhp / 8);
			},
		},
	},
	gmaxsteelsurge: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side, source) {
				this.add('-sidestart', side, 'move: G-Max Steelsurge');
			},
			onSwitchIn(pokemon) {
				const calc = calculate(this, this.effectState.source, pokemon, 'stealthrock');
				if (pokemon.hasItem('heavydutyboots') || !calc) return;
				this.damage(calc * pokemon.maxhp / 8);
			},
		},
	},
	spikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side, source) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side, source) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				const calc = calculate(this, this.effectState.source, pokemon, 'spikes');
				if (!calc || !pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(calc * damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
	},
	axekick: {
		inherit: true,
		onMoveFail(target, source, move) {
			const calc = calculate(this, source, source, 'axekick');
			if (calc) this.damage(calc * source.baseMaxhp / 2, source, source, this.dex.conditions.get('High Jump Kick'));
		},
	},
	curse: {
		inherit: true,
		condition: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'Curse', '[of] ' + source);
			},
			onResidualOrder: 12,
			onResidual(pokemon) {
				const calc = calculate(this, this.effectState.source, pokemon, 'curse');
				if (calc) this.damage(calc * pokemon.baseMaxhp / 4);
			},
		},
	},
	firepledge: {
		inherit: true,
		condition: {
			duration: 4,
			onSideStart(targetSide, source) {
				this.add('-sidestart', targetSide, 'Fire Pledge');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(pokemon) {
				const calc = calculate(this, this.effectState.source, pokemon, 'firepledge');
				if (!pokemon.hasType('Fire') && calc) this.damage(calc * pokemon.baseMaxhp / 8, pokemon);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 8,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'Fire Pledge');
			},
		},
	},
	flameburst: {
		inherit: true,
		onHit(target, source, move) {
			for (const ally of target.adjacentAllies()) {
				const calc = calculate(this, source, ally, 'flameburst');
				if (calc) this.damage(calc * ally.baseMaxhp / 16, ally, source, this.dex.conditions.get('Flame Burst'));
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			for (const ally of target.adjacentAllies()) {
				const calc = calculate(this, source, ally, 'flameburst');
				if (calc) this.damage(calc * ally.baseMaxhp / 16, ally, source, this.dex.conditions.get('Flame Burst'));
			}
		},
	},
	highjumpkick: {
		inherit: true,
		onMoveFail(target, source, move) {
			const calc = calculate(this, source, source, 'highjumpkick');
			if (calc) this.damage(calc * source.baseMaxhp / 2, source, source, this.dex.conditions.get('High Jump Kick'));
		},
	},
	jumpkick: {
		inherit: true,
		onMoveFail(target, source, move) {
			const calc = calculate(this, source, source, 'jumpkick');
			if (calc) this.damage(calc * source.baseMaxhp / 2, source, source, this.dex.conditions.get('Jump Kick'));
		},
	},
	leechseed: {
		inherit: true,
		condition: {
			onStart(target, source) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onResidualOrder: 8,
			onResidual(pokemon) {
				const target = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				const calc = calculate(this, this.effectState.source, pokemon, 'leechseed');
				const damage = this.damage(calc * pokemon.baseMaxhp / 8, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			},
		},
	},
	mindblown: {
		inherit: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				const hpBeforeRecoil = pokemon.hp;
				const calc = calculate(this, pokemon, pokemon, 'mindblown');
				this.damage(Math.round(calc * pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Mind Blown'), true);
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
					this.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}
		},
	},
	nightmare: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon, source) {
				if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
				this.effectState.source = source;
			},
			onResidualOrder: 11,
			onResidual(pokemon) {
				const calc = calculate(this, this.effectState.source, pokemon, 'nightmare');
				if (calc) this.damage(calc * pokemon.baseMaxhp / 4);
			},
		},
	},
	powder: {
		inherit: true,
		condition: {
			duration: 1,
			onStart(target, source) {
				this.add('-singleturn', target, 'Powder');
			},
			onTryMovePriority: -1,
			onTryMove(pokemon, target, move) {
				if (move.type === 'Fire') {
					this.add('-activate', pokemon, 'move: Powder');
					const calc = calculate(this, this.effectState.source, pokemon, 'powder');
					if (calc) this.damage(this.clampIntRange(Math.round(calc * pokemon.maxhp / 4), 1));
					this.attrLastMove('[still]');
					return false;
				}
			},
		},
	},
	saltcure: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'Salt Cure');
				this.effectState.source = source;
			},
			onResidualOrder: 13,
			onResidual(pokemon) {
				const calc = calculate(this, this.effectState.source, pokemon, 'saltcure');
				if (calc) this.damage(calc * pokemon.baseMaxhp / (pokemon.hasType(['Water', 'Steel']) ? 4 : 8));
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Salt Cure');
			},
		},
	},
	spikyshield: {
		inherit: true,
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				const calc = calculate(this, target, source, 'spikyshield');
				if (this.checkMoveMakesContact(move, source, target) && calc) {
					this.damage(calc * source.baseMaxhp / 8, source, target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				const calc = calculate(this, target, source, 'spikyshield');
				if (calc && move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					this.damage(calc * source.baseMaxhp / 8, source, target);
				}
			},
		},
	},
	steelbeam: {
		inherit: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				const hpBeforeRecoil = pokemon.hp;
				const calc = calculate(this, pokemon, pokemon, 'steelbeam');
				this.damage(Math.round(calc * pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Steel Beam'), true);
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
					this.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}
		},
	},
	supercellslam: {
		inherit: true,
		onMoveFail(target, source, move) {
			const calc = calculate(this, source, source, 'supercellslam');
			if (calc) this.damage(calc * source.baseMaxhp / 2, source, source, this.dex.conditions.get('Supercell Slam'));
		},
	},
	toxicspikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots')) {
					return;
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', this.effectState.source);
				} else {
					pokemon.trySetStatus('psn', this.effectState.source);
				}
			},
		},
	},
};

function calculate(battle: Battle, source: Pokemon, pokemon: Pokemon, moveid = 'tackle') {
	const move = battle.dex.getActiveMove(moveid);
	move.type = source.getTypes()[0];
	const typeMod = Math.pow(2, battle.clampIntRange(pokemon.runEffectiveness(move), -6, 6));
	if (!pokemon.runImmunity(move.type)) return 0;
	return typeMod;
}
