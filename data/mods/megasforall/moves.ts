export const Moves: {[moveid: string]: ModdedMoveData} = {
	electricterrain: {
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
				if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
					if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) {
						for (const active of this.getAllActive()) {
							if (active.hasAbility('downtoearth')) {
								return;
							}
						}
						this.add('-activate', target, 'move: Electric Terrain');
					}
					for (const active of this.getAllActive()) {
						if (active.hasAbility('downtoearth')) {
							this.add('-message', `${active.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					return false;
				}
			},
			onTryAddVolatile(status, target) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'yawn') {
					this.add('-activate', target, 'move: Electric Terrain');
					for (const active of this.getAllActive()) {
						if (active.hasAbility('downtoearth')) {
							this.add('-message', `${active.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					for (const active of this.getAllActive()) {
						if (active.hasAbility('downtoearth')) {
							this.add('-message', `${active.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					this.debug('electric terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onStart(battle, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Electric Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd() {
				this.add('-fieldend', 'move: Electric Terrain');
			},
		},
	},
	psychicterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (effect && (effect.priority <= 0.1 || effect.target === 'self')) {
					return;
				}
				if (target.isSemiInvulnerable() || target.side === source.side) return;
				if (!target.isGrounded()) {
					const baseMove = this.dex.getMove(effect.id);
					if (baseMove.priority > 0) {
						this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground.");
					}
					return;
				}
				for (const active of this.getAllActive()) {
					if (active.hasAbility('downtoearth')) {
						this.add('-message', `${active.name} suppresses the effects of the terrain!`);
						return;
					}
				}
				this.add('-activate', target, 'move: Psychic Terrain');
				return null;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					for (const active of this.getAllActive()) {
						if (active.hasAbility('downtoearth')) {
							this.add('-message', `${active.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					this.debug('psychic terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onStart(battle, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Psychic Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd() {
				this.add('-fieldend', 'move: Psychic Terrain');
			},
		},
	},
	grassyterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				if (source?.hasAbility('arenarock')) {
					return 0;
				}
				return 5;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
				if (weakenedMoves.includes(move.id)) {
					for (const target of this.getAllActive()) {
						if (target.hasAbility('downtoearth')) {
							this.add('-message', `${target.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if (move.type === 'Grass' && attacker.isGrounded()) {
					for (const target of this.getAllActive()) {
						if (target.hasAbility('downtoearth')) {
							this.add('-message', `${target.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					this.debug('grassy terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onStart(battle, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Grassy Terrain');
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 3,
			onResidual() {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.add('-message', `${target.name} suppresses the effects of the terrain!`);
						return;
					}
				}
				this.eachEvent('Terrain');
			},
			onTerrain(pokemon) {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
					this.debug('Pokemon is grounded, healing through Grassy Terrain.');
					this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon);
				}
			},
			onEnd() {
				if (!this.effectData.duration) this.eachEvent('Terrain');
				this.add('-fieldend', 'move: Grassy Terrain');
			},
		},
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
					for (const active of this.getAllActive()) {
						if (active.hasAbility('downtoearth')) {
							return;
						}
					}
					this.add('-activate', target, 'move: Misty Terrain');
				}
				for (const active of this.getAllActive()) {
					if (active.hasAbility('downtoearth')) {
						this.add('-message', `${active.name} suppresses the effects of the terrain!`);
						return;
					}
				}
				return false;
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'confusion') {
					for (const active of this.getAllActive()) {
						if (active.hasAbility('downtoearth')) {
							this.add('-message', `${active.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Misty Terrain');
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					for (const target of this.getAllActive()) {
						if (target.hasAbility('downtoearth')) {
							this.add('-message', `${target.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onStart(battle, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Misty Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd(side) {
				this.add('-fieldend', 'Misty Terrain');
			},
		},
	},
	gmaxsteelsurge: {
		inherit: true,
		condition: {
			onStart(side) {
				this.add('-sidestart', side, 'move: G-Max Steelsurge');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasAbility('trashcompactor') && !this.field.getPseudoWeather('stickyresidues')) {
					if (!pokemon.volatiles['stockpile']) {
						this.useMove('stockpile', pokemon);
					}
					this.add('-sideend', pokemon.side, 'move: G-Max Steelsurge', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('gmaxsteelsurge');
					return;
				}
				if (pokemon.hasAbility('trashcompactor') || pokemon.hasItem('heavydutyboots')) return;
				// Ice Face and Disguise correctly get typed damage from Stealth Rock
				// because Stealth Rock bypasses Substitute.
				// They don't get typed damage from Steelsurge because Steelsurge doesn't,
				// so we're going to test the damage of a Steel-type Stealth Rock instead.
				const steelHazard = this.dex.getActiveMove('Stealth Rock');
				steelHazard.type = 'Steel';
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
	},
	spikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers = 1;
			},
			onRestart(side) {
				if (this.effectData.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasAbility('trashcompactor') && !this.field.getPseudoWeather('stickyresidues')) {
					if (!pokemon.volatiles['stockpile']) {
						this.useMove('stockpile', pokemon);
					}
					this.add('-sideend', pokemon.side, 'move: Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('spikes');
					return;
				}
				if (pokemon.hasAbility('trashcompactor') || pokemon.hasItem('heavydutyboots')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectData.layers] * pokemon.maxhp / 24);
			},
		},
	},
	stealthrock: {
		inherit: true,
		condition: {
			// this is a side condition
			onStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasAbility('trashcompactor') && !this.field.getPseudoWeather('stickyresidues')) {
					if (!pokemon.volatiles['stockpile']) {
						this.useMove('stockpile', pokemon);
					}
					this.add('-sideend', pokemon.side, 'move: Stealth Rock', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('stealthrock');
					return;
				}
				if (pokemon.hasAbility('trashcompactor') || pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
	},
	stickyweb: {
		inherit: true,
		condition: {
			onStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasAbility('trashcompactor') && !this.field.getPseudoWeather('stickyresidues')) {
					if (!pokemon.volatiles['stockpile']) {
						this.useMove('stockpile', pokemon);
					}
					this.add('-sideend', pokemon.side, 'move: Sticky Web', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('stickyweb');
					return;
				}
				if (pokemon.hasAbility('trashcompactor') || pokemon.hasItem('heavydutyboots')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({spe: -1}, pokemon, this.effectData.source, this.dex.getActiveMove('stickyweb'));
			},
		},
	},
	toxicspikes: {
		inherit: true,
		condition: {
			// this is a side condition
			onStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers = 1;
			},
			onRestart(side) {
				if (this.effectData.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasAbility('trashcompactor') && !this.field.getPseudoWeather('stickyresidues')) {
					if (!pokemon.volatiles['stockpile']) {
						this.useMove('stockpile', pokemon);
					}
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
					return;
				}
				if (pokemon.hasType('Poison') && !this.field.getPseudoWeather('stickyresidues')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasType('Poison') ||
					pokemon.hasAbility('trashcompactor') || pokemon.hasItem('heavydutyboots')) {
					return;
				} else if (this.effectData.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
	},
	trickroom: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', effect);
					return 7;
				}
				if (source?.hasAbility('counterclockwisespiral')) {
					this.add('-activate', source, 'ability: Counter-Clockwise Spiral', effect);
					return 0;
				}
				return 5;
			},
			onStart(target, source) {
				this.add('-fieldstart', 'move: Trick Room', '[of] ' + source);
			},
			onRestart(target, source) {
				this.field.removePseudoWeather('trickroom');
			},
			// Speed modification is changed in Pokemon.getActionSpeed() in sim/pokemon.js
			onResidualOrder: 23,
			onEnd() {
				this.add('-fieldend', 'move: Trick Room');
			},
		},
	},
	charge: {
		inherit: true,
		condition: {
			duration: 2,
			durationCallback(source, effect) {
				if (source?.hasAbility('tempestuous')) {
					return 1;
				}
				return 2;
			},
			onRestart(pokemon) {
				this.effectData.duration = 2;
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('charge boost');
					return this.chainModify(2);
				}
			},
		},
	},
	healblock: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', effect);
					return 7;
				}
				for (const pokemon of this.getAllActive()) {
					if (pokemon.hasAbility('showdown')) {
						return 0;
					}
				}
				return 5;
			},
			onStart(pokemon, target, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-start', target, 'Heal Block', '[silent]');
				} else {
					this.add('-start', target, 'move: Heal Block');
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.getMove(moveSlot.id).flags['heal']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 17,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal(damage, target, source, effect) {
				if ((effect?.id === 'zpower') || this.effectData.isZ) return damage;
				return false;
			},
		},
	},
	camouflage: {
		inherit: true,
		onHit(target) {
			let newType = 'Normal';
			if (this.field.isTerrain('electricterrain')) {
				newType = 'Electric';
			} else if (this.field.isTerrain('grassyterrain')) {
				newType = 'Grass';
			} else if (this.field.isTerrain('mistyterrain')) {
				newType = 'Fairy';
			} else if (this.field.isTerrain('psychicterrain')) {
				newType = 'Psychic';
			} else if (this.field.isTerrain('acidicterrain')) {
				newType = 'Poison';
			}
			for (const active of this.getAllActive()) {
				if (active.hasAbility('downtoearth')) {
					this.add('-message', `${target.name} suppresses the effects of the terrain!`);
					newType = 'Normal';
				}
			}

			if (target.getTypes().join() === newType || !target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
		},
	},
	expandingforce: {
		inherit: true,
		onBasePower(basePower, source) {
			if (this.getAllActive().some(x => x.hasAbility('downtoearth'))) return;
			if (this.field.isTerrain('psychicterrain') && source.isGrounded()) {
				this.debug('terrain buff');
				return this.chainModify(1.5);
			}
		},
		onModifyMove(move, source, target) {
			if (this.getAllActive().some(x => x.hasAbility('downtoearth'))) return;
			if (this.field.isTerrain('psychicterrain') && source.isGrounded()) {
				move.target = 'allAdjacentFoes';
			}
		},
	},
	floralhealing: {
		inherit: true,
		onHit(target, source) {
			let success = false;
			if (this.field.isTerrain('grassyterrain')) {
				if (this.getAllActive().some(x => x.hasAbility('downtoearth'))) {
					this.add('-message', `${target.name} suppresses the effects of the terrain!`);
					return success;
				}
				success = !!this.heal(this.modify(target.baseMaxhp, 0.667));
			} else {
				success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
			}
			if (success && target.side !== source.side) {
				target.staleness = 'external';
			}
			return success;
		},
	},
	grassyglide: {
		inherit: true,
		onModifyPriority(priority, source, target, move) {
			if (this.getAllActive().some(x => x.hasAbility('downtoearth'))) return priority;
			if (this.field.isTerrain('grassyterrain') && source.isGrounded()) {
				return priority + 1;
			}
		},
	},
	mistyexplosion: {
		inherit: true,
		onBasePower(basePower, source) {
			if (this.getAllActive().some(x => x.hasAbility('downtoearth'))) return;
			if (this.field.isTerrain('mistyterrain') && source.isGrounded()) {
				this.debug('misty terrain boost');
				return this.chainModify(1.5);
			}
		},
	},
	naturepower: {
		inherit: true,
		onTryHit(target, pokemon) {
			let move = 'triattack';
			if (this.field.isTerrain('electricterrain')) {
				move = 'thunderbolt';
			} else if (this.field.isTerrain('grassyterrain')) {
				move = 'energyball';
			} else if (this.field.isTerrain('mistyterrain')) {
				move = 'moonblast';
			} else if (this.field.isTerrain('psychicterrain')) {
				move = 'psychic';
			} else if (this.field.isTerrain('acidicterrain')) {
				move = 'sludgebomb';
			}
			for (const active of this.getAllActive()) {
				if (active.hasAbility('downtoearth')) {
					this.add('-message', `${active.name} suppresses the effects of the terrain!`);
					move = 'triattack';
				}
			}
			this.useMove(move, pokemon, target);
			return null;
		},
	},
	risingvoltage: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			if (this.getAllActive().some(x => x.hasAbility('downtoearth'))) return;
			if (this.field.isTerrain('electricterrain') && target.isGrounded()) {
				this.debug('terrain buff');
				return this.chainModify(2);
			}
		},
	},
	secretpower: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (this.field.isTerrain('')) return;
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.add('-message', `${target.name} suppresses the effects of the terrain!`);
					return;
				}
			}
			move.secondaries = [];
			if (this.field.isTerrain('electricterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'par',
				});
			} else if (this.field.isTerrain('grassyterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'slp',
				});
			} else if (this.field.isTerrain('mistyterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spa: -1,
					},
				});
			} else if (this.field.isTerrain('psychicterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spe: -1,
					},
				});
			} else if (this.field.isTerrain('acidicterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'psn',
				});
			}
		},
	},
	steelroller: {
		inherit: true,
		onTryHit() {
			if (this.field.isTerrain('')) return false;
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.add('-message', `${target.name} suppresses the effects of the terrain!`);
					return false;
				}
			}
		},
		onHit() {
			if (this.field.isTerrain('grassyterrain') &&
				this.getAllActive().some(x => x.hasAbility('arenarock'))) return;
			this.field.clearTerrain();
		},
	},
	terrainpulse: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			if (this.getAllActive().some(x => x.hasAbility('downtoearth'))) return;
			switch (this.field.terrain) {
			case 'electricterrain':
				move.type = 'Electric';
				break;
			case 'grassyterrain':
				move.type = 'Grass';
				break;
			case 'mistyterrain':
				move.type = 'Fairy';
				break;
			case 'psychicterrain':
				move.type = 'Psychic';
				break;
			case 'acidicterrain':
				move.type = 'Poison';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			if (this.field.terrain && pokemon.isGrounded()) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.add('-message', `${target.name} suppresses the effects of the terrain!`);
						return;
					}
				}
				move.basePower *= 2;
			}
		},
	},
	defog: {
		inherit: true,
		onHit(target, source, move) {
			if (this.field.getPseudoWeather('stickyresidues')) {
				this.add('-message', `Sticky residues keep hazards stuck to the field!`);
			}
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({evasion: -1});
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.getEffect(targetCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (this.field.getPseudoWeather('stickyresidues')) continue;
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			if (this.field.isTerrain('grassyterrain') &&
				this.getAllActive().some(x => x.hasAbility('arenarock'))) return success;
			this.field.clearTerrain();
			return success;
		},
	},
	gmaxwindrage: {
		inherit: true,
		self: {
			onHit(source) {
				if (this.field.getPseudoWeather('stickyresidues')) {
					this.add('-message', `Sticky residues keep hazards stuck to the field!`);
				}
				let success = false;
				const removeTarget = [
					'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb',
				];
				const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const targetCondition of removeTarget) {
					if (source.side.foe.removeSideCondition(targetCondition)) {
						if (!removeAll.includes(targetCondition)) continue;
						this.add('-sideend', source.side.foe, this.dex.getEffect(targetCondition).name, '[from] move: G-Max Wind Rage', '[of] ' + source);
						success = true;
					}
				}
				for (const sideCondition of removeAll) {
					if (this.field.getPseudoWeather('stickyresidues')) continue;
					if (source.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: G-Max Wind Rage', '[of] ' + source);
						success = true;
					}
				}
				if (this.field.isTerrain('grassyterrain') &&
					this.getAllActive().some(x => x.hasAbility('arenarock'))) return success;
				this.field.clearTerrain();
				return success;
			},
		},
	},
	rapidspin: {
		inherit: true,
		onAfterHit(target, pokemon) {
			if (this.field.getPseudoWeather('stickyresidues')) {
				this.add('-message', `Sticky residues keep hazards stuck to the field!`);
			}
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (this.field.getPseudoWeather('stickyresidues') &&
					['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'].includes(condition)) continue;
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			if (this.field.getPseudoWeather('stickyresidues')) {
				this.add('-message', `Sticky residues keep hazards stuck to the field!`);
			}
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (this.field.getPseudoWeather('stickyresidues') &&
					['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'].includes(condition)) continue;
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.getEffect(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
	},
	courtchange: {
		inherit: true,
		onHitField(target, source) {
			if (this.field.getPseudoWeather('stickyresidues')) {
				this.add('-message', `Sticky residues keep hazards stuck to the field!`);
			}
			const sourceSide = source.side;
			const targetSide = source.side.foe;
			const sideConditions = [
				'mist', 'lightscreen', 'reflect', 'spikes', 'safeguard', 'tailwind', 'toxicspikes', 'stealthrock', 'waterpledge', 'firepledge', 'grasspledge', 'stickyweb', 'auroraveil', 'gmaxsteelsurge', 'gmaxcannonade', 'gmaxvinelash', 'gmaxwildfire',
			];
			let success = false;
			for (const id of sideConditions) {
				const effectName = this.dex.getEffect(id).name;
				if (this.field.getPseudoWeather('stickyresidues') &&
					['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'].includes(id)) continue;
				if (sourceSide.sideConditions[id] && targetSide.sideConditions[id]) {
					[sourceSide.sideConditions[id], targetSide.sideConditions[id]] = [
						targetSide.sideConditions[id], sourceSide.sideConditions[id],
					];
					this.add('-sideend', sourceSide, effectName, '[silent]');
					this.add('-sideend', targetSide, effectName, '[silent]');
				} else if (sourceSide.sideConditions[id] && !targetSide.sideConditions[id]) {
					targetSide.sideConditions[id] = sourceSide.sideConditions[id];
					delete sourceSide.sideConditions[id];
					this.add('-sideend', sourceSide, effectName, '[silent]');
				} else if (targetSide.sideConditions[id] && !sourceSide.sideConditions[id]) {
					sourceSide.sideConditions[id] = targetSide.sideConditions[id];
					delete targetSide.sideConditions[id];
					this.add('-sideend', targetSide, effectName, '[silent]');
				} else {
					continue;
				}
				let sourceLayers = sourceSide.sideConditions[id] ? (sourceSide.sideConditions[id].layers || 1) : 0;
				let targetLayers = targetSide.sideConditions[id] ? (targetSide.sideConditions[id].layers || 1) : 0;
				for (; sourceLayers > 0; sourceLayers--) {
					this.add('-sidestart', sourceSide, effectName, '[silent]');
				}
				for (; targetLayers > 0; targetLayers--) {
					this.add('-sidestart', targetSide, effectName, '[silent]');
				}
				success = true;
			}
			if (!success) return false;
			this.add('-activate', source, 'move: Court Change');
		},
	},
	splinteredstormshards: {
		inherit: true,
		onHit() {
			if (this.field.isTerrain('grassyterrain') &&
				this.getAllActive().some(x => x.hasAbility('arenarock'))) return;
			this.field.clearTerrain();
		},
	},
	knockoff: {
		inherit: true,
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					(target as any).lostItemForDelibird = item;
					this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
				}
			}
		},
	},
	bugbite: {
		inherit: true,
		onHit(target, source) {
			const item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Bug Bite', '[of] ' + source);
				if (this.singleEvent('Eat', item, null, source, null, null)) {
					this.runEvent('EatItem', source, null, null, item);
					if (item.id === 'leppaberry') target.staleness = 'external';
				}
				if (item.onEat) source.ateBerry = true;
				(target as any).lostItemForDelibird = item;
			}
		},
	},
	pluck: {
		inherit: true,
		onHit(target, source) {
			const item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Pluck', '[of] ' + source);
				if (this.singleEvent('Eat', item, null, source, null, null)) {
					this.runEvent('EatItem', source, null, null, item);
					if (item.id === 'leppaberry') target.staleness = 'external';
				}
				if (item.onEat) source.ateBerry = true;
				(target as any).lostItemForDelibird = item;
			}
		},
	},
	covet: {
		inherit: true,
		onAfterHit(target, source, move) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			const yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (
				!this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem) ||
				!source.setItem(yourItem)
			) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			(target as any).lostItemForDelibird = yourItem;
			this.add('-item', source, yourItem, '[from] move: Covet', '[of] ' + target);
		},
	},
	thief: {
		inherit: true,
		onAfterHit(target, source, move) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			const yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem) ||
				!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			(target as any).lostItemForDelibird = yourItem;
			this.add('-enditem', target, yourItem, '[silent]', '[from] move: Thief', '[of] ' + source);
			this.add('-item', source, yourItem, '[from] move: Thief', '[of] ' + target);
		},
	},
	incinerate: {
		inherit: true,
		onHit(pokemon, source) {
			const item = pokemon.getItem();
			if ((item.isBerry || item.isGem) && pokemon.takeItem(source)) {
				(pokemon as any).lostItemForDelibird = item;
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
		},
	},
	corrosivegas: {
		inherit: true,
		onHit(target, source) {
			const item = target.takeItem(source);
			if (item) {
				this.add('-enditem', target, item.name, '[from] move: Corrosive Gas', '[of] ' + source);
				(target as any).lostItemForDelibird = item;
			}
		},
	},
	trick: {
		inherit: true,
		onTryImmunity(target) {
			return !target.hasAbility('stickyhold');
		},
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemData, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem))
			) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', '[of] ' + target);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Trick');
			} else {
				this.add('-enditem', target, yourItem, '[silent]', '[from] move: Trick');
				(target as any).lostItemForDelibird = yourItem;
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Trick');
			} else {
				this.add('-enditem', source, myItem, '[silent]', '[from] move: Trick');
				(target as any).lostItemForDelibird = myItem;
			}
		},
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'desertgales':
			case 'hail':
			case 'diamonddust':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'desertgales':
			case 'hail':
			case 'diamonddust':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	shoreup: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			if (this.field.isWeather('sandstorm') || this.field.isWeather('desertgales')) {
				factor = 0.667;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	solarbeam: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			if (
				['raindance', 'primordialsea', 'sandstorm', 'desertgales', 'hail', 'diamonddust'].includes(pokemon.effectiveWeather())
			) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			if (
				['raindance', 'primordialsea', 'sandstorm', 'desertgales', 'hail', 'diamonddust'].includes(pokemon.effectiveWeather())
			) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'desertgales':
			case 'hail':
			case 'diamonddust':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'diamonddust':
				move.type = 'Ice';
				break;
			case 'desertgales':
				move.type = 'Ground';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'hail':
			case 'diamonddust':
				move.basePower *= 2;
				break;
			case 'desertgales':
				move.basePower *= 2;
				break;
			}
		},
	},
	curse: {
		inherit: true,
		condition: {
			onStart(pokemon, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-message', `${pokemon.name} was cursed!`);
					this.add('-start', pokemon, 'Curse', '[silent]');
				} else {
					this.add('-start', pokemon, 'Curse', '[of] ' + source);
				}
			},
			onResidualOrder: 10,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
		},
	},
	auroraveil: {
		num: 694,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Aurora Veil",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		sideCondition: 'auroraveil',
		onTryHitSide() {
			if (!this.field.isWeather('hail') && !this.field.isWeather('diamonddust')) return false;
		},
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && target.side === this.effectData.target) {
					if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
							(target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
						return;
					}
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Aurora Veil weaken');
						if (target.side.active.length > 1) return this.chainModify([2732, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onStart(side) {
				this.add('-sidestart', side, 'move: Aurora Veil');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 1,
			onEnd(side) {
				this.add('-sideend', side, 'move: Aurora Veil');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Ice",
		zMove: {boost: {spe: 1}},
		contestType: "Beautiful",
	},
	blizzard: {
		num: 59,
		accuracy: 70,
		basePower: 110,
		category: "Special",
		name: "Blizzard",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyMove(move) {
			if (this.field.isWeather('hail') || this.field.isWeather('diamonddust')) move.accuracy = true;
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	earthquake: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (source.volatiles['seismicscream']) {
				if (source.volatiles['specialsound']) {
					move.category = 'Special';
				}
				move.basePower = 60;
				delete source.volatiles['quakingboom'];
			}
		},
	},
	acidicterrain: {
		num: 100000,
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "5 turns. Grounded: +Poison power & hit Steel.",
		name: "Acidic Terrain",
		pp: 10,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'acidicterrain',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Poison' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					for (const target of this.getAllActive()) {
						if (target.hasAbility('downtoearth')) {
							this.add('-message', `${target.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					this.debug('acidic terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onModifyMovePriority: -5,
			onModifyMove(move, source, target) {
				if (move.type === 'Poison' && target?.isGrounded() && !target.isSemiInvulnerable() && target.hasType('Steel')) {
					for (const active of this.getAllActive()) {
						if (active.hasAbility('downtoearth')) {
							this.add('-message', `${active.name} suppresses the effects of the terrain!`);
							return;
						}
					}
					if (!move.ignoreImmunity) move.ignoreImmunity = {};
					if (move.ignoreImmunity !== true) {
						move.ignoreImmunity['Poison'] = true;
					}
				}
			},
			onStart(battle, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Acidic Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Acidic Terrain');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd() {
				this.add('-fieldend', 'move: Acidic Terrain');
			},
		},
		secondary: null,
		target: "all",
		type: "Poison",
	},
};
