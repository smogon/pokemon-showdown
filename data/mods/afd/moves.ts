export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	banefulbunker: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', target, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('psn', target);
				}
				return this.NOT_FAIL;
			},
		},
	},
	burningbulwark: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', target, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('brn', target);
				}
				return this.NOT_FAIL;
			},
		},
	},
	kingsshield: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', target, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.boost({ atk: -1 }, source, target, this.dex.getActiveMove("King's Shield"));
				}
				return this.NOT_FAIL;
			},
		},
	},
	maxguard: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(target, source, move) {
				const bypassesMaxGuard = [
					'acupressure', 'afteryou', 'allyswitch', 'aromatherapy', 'aromaticmist', 'coaching', 'confide', 'copycat', 'curse', 'decorate', 'doomdesire', 'feint', 'futuresight', 'gmaxoneblow', 'gmaxrapidflow', 'healbell', 'holdhands', 'howl', 'junglehealing', 'lifedew', 'meanlook', 'perishsong', 'playnice', 'powertrick', 'roar', 'roleplay', 'tearfullook',
				];
				if (bypassesMaxGuard.includes(move.id)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', target, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
	},
	obstruct: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', target, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.boost({ def: -2 }, source, target, this.dex.getActiveMove("Obstruct"));
				}
				return this.NOT_FAIL;
			},
		},
	},
	protect: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', target, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
	},
	silktrap: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', target, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.boost({ spe: -1 }, source, target, this.dex.getActiveMove("Silk Trap"));
				}
				return this.NOT_FAIL;
			},
		},
	},
	spikyshield: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', target, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.damage(source.baseMaxhp / 8, source, target);
				}
				return this.NOT_FAIL;
			},
		},
	},
	stealthrock: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'Stealth Rock');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 5) return false;
				this.add('-sidestart', side, 'Stealth Rock');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if ( pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				const damageAmounts = [0, 1, 2, 3, 4, 5]; // 2 ** typeMod / 8
				this.damage((damageAmounts[this.effectState.layers] / 5) * pokemon.maxhp * ((2 ** typeMod) / 8));
			},
		},
	},
	suckerpunch: {
		inherit: true,
		onTry() { },
		onModifyPriority(priority, source, target, move) {
			if (!target) return priority - 1;
			const action = this.queue.willMove(target);
			const aMove = action?.choice === 'move' ? action.move : null;
			if (!aMove || (aMove.category === 'Status' && aMove.id !== 'mefirst') || target.volatiles['mustrecharge']) {
				return priority - 1;
			}
			return priority;
		},
	},
};
