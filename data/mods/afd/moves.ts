export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	banefulbunker: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', defender, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, attacker, defender)) {
					attacker.trySetStatus('psn', defender);
				}
				return this.NOT_FAIL;
			},
		},
	},
	burningbulwark: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender, false)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', defender, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, attacker, defender)) {
					attacker.trySetStatus('brn', defender);
				}
				return this.NOT_FAIL;
			},
		},
	},
	kingsshield: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender, false)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', defender, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, attacker, defender)) {
					this.boost({ atk: -1 }, attacker, defender, this.dex.getActiveMove("King's Shield"));
				}
				return this.NOT_FAIL;
			},
		},
	},
	maxguard: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				const bypassesMaxGuard = [
					'acupressure', 'afteryou', 'allyswitch', 'aromatherapy', 'aromaticmist', 'coaching', 'confide', 'copycat', 'curse', 'decorate', 'doomdesire', 'feint', 'futuresight', 'gmaxoneblow', 'gmaxrapidflow', 'healbell', 'holdhands', 'howl', 'junglehealing', 'lifedew', 'meanlook', 'perishsong', 'playnice', 'powertrick', 'roar', 'roleplay', 'tearfullook',
				];
				if (bypassesMaxGuard.includes(move.id)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', defender, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
	},
	meteorbeam: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({ spa: 1 }, attacker, attacker, move);
			if (['sandstorm'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
	},
	obstruct: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender, false)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', defender, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, attacker, defender)) {
					this.boost({ def: -2 }, attacker, defender, this.dex.getActiveMove("Obstruct"));
				}
				return this.NOT_FAIL;
			},
		},
	},
	protect: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', defender, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
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
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender, false)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', defender, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, attacker, defender)) {
					this.boost({ spe: -1 }, attacker, defender, this.dex.getActiveMove("Silk Trap"));
				}
				return this.NOT_FAIL;
			},
		},
	},
	spikyshield: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (this.checkMoveBypassesProtect(move, attacker, defender)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					if (!this.randomChance(2, 10)) {
						this.add('-activate', defender, 'move: Protect');
						if (move.basePower >= 100) {
							this.add('message', '**BWUAHAAUAAAANGGGGGG**');
						}
					} else {
						return;
					}
				}
				const lockedmove = attacker.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (attacker.volatiles['lockedmove'].duration === 2) {
						delete attacker.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, attacker, defender)) {
					this.damage(attacker.baseMaxhp / 8, attacker, defender);
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
				if (pokemon.hasItem(['heavydutyboots', 'hoots'])) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				const damageAmounts = [0, 1, 2, 3, 4, 5]; // 2 ** typeMod / 8
				this.damage((damageAmounts[this.effectState.layers] / 5) * pokemon.maxhp * ((2 ** typeMod) / 8));
			},
		},
	},
	gmaxsteelsurge: {
		inherit: true,
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'G-Max Steelsurge');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 5) return false;
				this.add('-sidestart', side, 'G-Max Steelsurge');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem(['heavydutyboots', 'hoots'])) return;
				const steelHazard = this.dex.getActiveMove('Stealth Rock');
				steelHazard.type = 'Steel';
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
				const damageAmounts = [0, 1, 2, 3, 4, 5]; // 2 ** typeMod / 8
				this.damage((damageAmounts[this.effectState.layers] / 5) * pokemon.maxhp * ((2 ** typeMod) / 8));
			},
		},
	},
	spikes: {
		inherit: true,
		condition: {
			inherit: true,
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem(['heavydutyboots', 'hoots'])) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
	},
	stickyweb: {
		inherit: true,
		condition: {
			inherit: true,
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem(['heavydutyboots', 'hoots'])) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	toxicspikes: {
		inherit: true,
		condition: {
			inherit: true,
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem(['heavydutyboots', 'hoots'])) {
					// do nothing
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	suckerpunch: {
		inherit: true,
		onTry() { },
		onModifyPriority(priority, attacker, defender, move) {
			if (!defender) return priority - 1;
			const action = this.queue.willMove(defender);
			const aMove = action?.choice === 'move' ? action.move : null;
			if (!aMove || (aMove.category === 'Status' && aMove.id !== 'mefirst') || defender.volatiles['mustrecharge']) {
				return priority - 1;
			}
			return priority;
		},
	},
	thousandarrows: {
		inherit: true,
		basePower: 120,
	},
	healpulse: {
		inherit: true,
		onHit(defender, attacker) {
			let success = false;
			if (attacker.hasAbility('supermegalauncher')) {
				success = !!this.heal(this.modify(defender.baseMaxhp, 2));
			} else if (attacker.hasAbility('megalauncher')) {
				success = !!this.heal(this.modify(defender.baseMaxhp, 0.75));
			} else {
				success = !!this.heal(Math.ceil(defender.baseMaxhp * 0.5));
			}
			if (success && !defender.isAlly(attacker)) {
				defender.staleness = 'external';
			}
			if (!success) {
				this.add('-fail', defender, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	headsmash: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, heal: 1 },
		secondary: {
			chance: 100,
			onHit(defender, attacker, move) {
				if (!this.heal(this.modify(defender.baseMaxhp, 0.25))) {
					return this.NOT_FAIL;
				}
			},
		},
	},
	knockoff: {
		inherit: true,
		accuracy: 90,
	},
	shitpulse: {
		num: -400,
		gen: 9,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Shit Pulse",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -2,
			},
		},
		target: "any",
		type: "Poison",
		shortDesc: "30% chance to lower foe's accuracy by 2.",
	},
	solarflare: {
		num: -4324534,
		gen: 9,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Solar Flare",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 50,
			onHit(defender, attacker, move) {
				if (!['sunnyday', 'desolateland'].includes(defender.effectiveWeather())) return;
				defender.trySetStatus('brn', attacker, move);
			},
		},
		target: "normal",
		type: "Fire",
		shortDesc: "Sun active: 50% chance to burn.",
	},
	onslaught: {
		num: -3023,
		gen: 9,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Onslaught",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				atk: -1,
				def: -1,
			},
		},
		target: "normal",
		type: "Dark",
	},
	scald: {
		inherit: true,
		onEffectiveness(typeMod, defender, type) {
			if (type === 'Steel') return 1;
		},
		secondary: undefined,
		secondaries: [{
			chance: 30,
			status: 'brn',
		}, {
			chance: 100,
			onHit(defender, attacker, move) {
				if (defender.hasType(['Normal', 'Fairy'])) {
					defender.trySetStatus('brn', attacker, move);
				}
			},
		}],
	},
	explosion: {
		inherit: true,
		onAfterMove(pokemon, defender, move) {
			if (defender && defender.hp <= 0) {
				delete move.selfdestruct;
				return;
			}
		},
	},
	selfdestruct: {
		inherit: true,
		onAfterMove(pokemon, defender, move) {
			if (defender && defender.hp <= 0) {
				delete move.selfdestruct;
				return;
			}
		},
	},
	mistyexplosion: {
		inherit: true,
		onAfterMove(pokemon, defender, move) {
			if (defender && defender.hp <= 0) {
				delete move.selfdestruct;
				return;
			}
		},
	},
	moonblast: {
		inherit: true,
		basePower: 90,
		accuracy: 90,
		secondary: {
			chance: 10,
			boosts: {
				atk: -1,
			},
		},
		category: "Physical",
	},
	noretreat: {
		name: "No Retreat",
		// @ts-expect-error
		exists: false,
	},
	blastiodon: {
		num: -306345534534523,
		gen: 9,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, defender) {
			const targetDef = defender.getStat('def', false, true);
			const pokemonDef = pokemon.getStat('def', false, true);
			let bp;
			if (pokemonDef >= targetDef * 5) {
				bp = 150;
			} else if (pokemonDef >= targetDef * 4) {
				bp = 125;
			} else if (pokemonDef >= targetDef * 3) {
				bp = 100;
			} else if (pokemonDef >= targetDef * 2) {
				bp = 75;
			} else {
				bp = 50;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Blastiodon",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		overrideOffensiveStat: 'def',
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Rock",
		shortDesc: "Higher user Def than defender Def = higher BP.",
	},
	focusblast: {
		inherit: true,
		accuracy: 100,
		recoil: [1, 4],
		category: "Physical",
	},
	darkvoid: {
		inherit: true,
		onModifyMove(move, pokemon, defender) {
			if (pokemon.species.baseSpecies === 'Calyrex') {
				move.accuracy = 80;
			}
		},
		onTry(attacker, defender, move) {
			if (attacker.species.baseSpecies === 'Darkrai' || attacker.species.baseSpecies === 'Calyrex' || move.hasBounced) {
				return;
			}
			this.add('-fail', attacker, 'move: Dark Void');
			this.hint("Only a Pokemon whose form is Darkrai can use this move.");
			return null;
		},
	},
	rapidspin: {
		inherit: true,
		type: "Dark",
	},
};
