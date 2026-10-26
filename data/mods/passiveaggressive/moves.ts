export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	stealthrock: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side, attacker) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				const calc = calculate(this, this.effectState.attacker, pokemon, 'stealthrock');
				if (pokemon.hasItem('heavydutyboots') || !calc) return;
				this.damage(calc * pokemon.maxhp / 8);
			},
		},
	},
	gmaxsteelsurge: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side, attacker) {
				this.add('-sidestart', side, 'move: G-Max Steelsurge');
			},
			onSwitchIn(pokemon) {
				const calc = calculate(this, this.effectState.attacker, pokemon, 'stealthrock');
				if (pokemon.hasItem('heavydutyboots') || !calc) return;
				this.damage(calc * pokemon.maxhp / 8);
			},
		},
	},
	spikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side, attacker) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side, attacker) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				const calc = calculate(this, this.effectState.attacker, pokemon, 'spikes');
				if (!calc || !pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(calc * damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
	},
	axekick: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			const calc = calculate(this, attacker, attacker, 'axekick');
			if (calc) this.damage(calc * attacker.baseMaxhp / 2, attacker, attacker, this.dex.conditions.get('High Jump Kick'));
		},
	},
	curse: {
		inherit: true,
		condition: {
			onStart(pokemon, attacker) {
				this.add('-start', pokemon, 'Curse', `[of] ${attacker}`);
			},
			onResidualOrder: 12,
			onResidual(pokemon) {
				const calc = calculate(this, this.effectState.attacker, pokemon, 'curse');
				if (calc) this.damage(calc * pokemon.baseMaxhp / 4);
			},
		},
	},
	firepledge: {
		inherit: true,
		condition: {
			duration: 4,
			onSideStart(targetSide, attacker) {
				this.add('-sidestart', targetSide, 'Fire Pledge');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(pokemon) {
				const calc = calculate(this, this.effectState.attacker, pokemon, 'firepledge');
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
		onHit(defender, attacker, move) {
			for (const ally of defender.adjacentAllies()) {
				const calc = calculate(this, attacker, ally, 'flameburst');
				if (calc) this.damage(calc * ally.baseMaxhp / 16, ally, attacker, this.dex.conditions.get('Flame Burst'));
			}
		},
		onAfterSubDamage(damage, defender, attacker, move) {
			for (const ally of defender.adjacentAllies()) {
				const calc = calculate(this, attacker, ally, 'flameburst');
				if (calc) this.damage(calc * ally.baseMaxhp / 16, ally, attacker, this.dex.conditions.get('Flame Burst'));
			}
		},
	},
	highjumpkick: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			const calc = calculate(this, attacker, attacker, 'highjumpkick');
			if (calc) this.damage(calc * attacker.baseMaxhp / 2, attacker, attacker, this.dex.conditions.get('High Jump Kick'));
		},
	},
	jumpkick: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			const calc = calculate(this, attacker, attacker, 'jumpkick');
			if (calc) this.damage(calc * attacker.baseMaxhp / 2, attacker, attacker, this.dex.conditions.get('Jump Kick'));
		},
	},
	leechseed: {
		inherit: true,
		condition: {
			onStart(defender, attacker) {
				this.add('-start', defender, 'move: Leech Seed');
			},
			onResidualOrder: 8,
			onResidual(pokemon) {
				const defender = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
				if (!defender || defender.fainted || defender.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				const calc = calculate(this, this.effectState.attacker, pokemon, 'leechseed');
				const damage = this.damage(calc * pokemon.baseMaxhp / 8, pokemon, defender);
				if (damage) {
					this.heal(damage, defender, pokemon);
				}
			},
		},
	},
	mindblown: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			if (move.multihit) return;
			const calc = calculate(this, attacker, attacker, 'mindblown');
			this.damage(Math.round(calc * attacker.maxhp / 2), attacker, attacker, this.dex.conditions.get('Mind Blown'));
		},
	},
	nightmare: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon, attacker) {
				if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
				this.effectState.attacker = attacker;
			},
			onResidualOrder: 11,
			onResidual(pokemon) {
				const calc = calculate(this, this.effectState.attacker, pokemon, 'nightmare');
				if (calc) this.damage(calc * pokemon.baseMaxhp / 4);
			},
		},
	},
	powder: {
		inherit: true,
		condition: {
			duration: 1,
			onStart(defender, attacker) {
				this.add('-singleturn', defender, 'Powder');
			},
			onTryMovePriority: -1,
			onTryMove(pokemon, defender, move) {
				if (move.type === 'Fire') {
					this.add('-activate', pokemon, 'move: Powder');
					const calc = calculate(this, this.effectState.attacker, pokemon, 'powder');
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
			onStart(pokemon, attacker) {
				this.add('-start', pokemon, 'Salt Cure');
				this.effectState.attacker = attacker;
			},
			onResidualOrder: 13,
			onResidual(pokemon) {
				const calc = calculate(this, this.effectState.attacker, pokemon, 'saltcure');
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
			onStart(defender) {
				this.add('-singleturn', defender, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', defender, 'move: Protect');
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				const calc = calculate(this, defender, attacker, 'spikyshield');
				if (this.checkMoveMakesContact(move, attacker, defender) && calc) {
					this.damage(calc * attacker.baseMaxhp / 8, attacker, defender);
				}
				return this.NOT_FAIL;
			},
			onHit(defender, attacker, move) {
				const calc = calculate(this, defender, attacker, 'spikyshield');
				if (calc && move.isZOrMaxPowered && this.checkMoveMakesContact(move, attacker, defender)) {
					this.damage(calc * attacker.baseMaxhp / 8, attacker, defender);
				}
			},
		},
	},
	steelbeam: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			if (move.multihit) return;
			const calc = calculate(this, attacker, attacker, 'steelbeam');
			this.damage(Math.round(calc * attacker.maxhp / 2), attacker, attacker, this.dex.conditions.get('Mind Blown'));
		},
	},
	supercellslam: {
		inherit: true,
		onMoveFail(defender, attacker, move) {
			const calc = calculate(this, attacker, attacker, 'supercellslam');
			if (calc) this.damage(calc * attacker.baseMaxhp / 2, attacker, attacker, this.dex.conditions.get('Supercell Slam'));
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
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots')) {
					// do nothing
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', this.effectState.attacker);
				} else {
					pokemon.trySetStatus('psn', this.effectState.attacker);
				}
			},
		},
	},
};

function calculate(battle: Battle, attacker: Pokemon, pokemon: Pokemon, moveid = 'tackle') {
	const move = battle.dex.getActiveMove(moveid);
	move.type = attacker.getTypes()[0];
	const typeMod = 2 ** battle.clampIntRange(pokemon.runEffectiveness(move), -6, 6);
	if (!pokemon.runImmunity(move)) return 0;
	return typeMod;
}
