export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen3',
	gen: 3,
	// [Gen 3] PSS is "Gen 3 plus the physical/special split": inherit Gen 3's actual move
	// data (base powers, secondaries, accuracy, flags), base stats, learnsets, abilities and
	// items, and change ONLY each move's category to its Gen 4 per-move value (via moves.ts).
	// Base Gen 3's init() re-derives every move's category from its TYPE (special types ->
	// Special, else Physical), which would clobber the split back to type-based — so override
	// it to a no-op here. Nothing else has to be overridden for the split to survive: Gen 3's
	// useMoveInner does not re-derive category at runtime, and the two moves that retype
	// mid-battle carry their own onModifyMove — Hidden Power's is re-stated in this mod's
	// moves.ts so it sets type without touching category, and Weather Ball sets both by hand.
	// (surfnWOB)
	init() {},
	pokemon: {
		inherit: true,
		getActionSpeed() {
			let speed = this.getStat('spe', false, false);
			const trickRoomCheck = this.battle.ruleTable.has('twisteddimensionmod') ?
				!this.battle.field.getPseudoWeather('trickroom') : this.battle.field.getPseudoWeather('trickroom');
			if (trickRoomCheck) {
				speed = -speed;
			}
			if (this.battle.quickClawRoll && this.hasItem('quickclaw')) {
				speed = 65535;
			}
			return speed;
		},
	},
	actions: {
		inherit: true,
		modifyDamage(baseDamage, pokemon, target, move, suppressMessages = false) {
			if (!move.type) move.type = '???';
			const type = move.type;

			// Burn
			if (pokemon.status === 'brn' && baseDamage && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
				baseDamage = this.battle.modify(baseDamage, 0.5);
			}

			// Other modifiers (Reflect/Light Screen/etc)
			baseDamage = this.battle.runEvent('ModifyDamagePhase1', pokemon, target, move, baseDamage);

			// Double battle multi-hit
			if (move.spreadHit && move.target === 'allAdjacentFoes') {
				const spreadModifier = 0.5;
				this.battle.debug(`Spread modifier: ${spreadModifier}`);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			}

			// Weather
			baseDamage = this.battle.priorityEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

			if (move.category === 'Physical' && !Math.floor(baseDamage)) {
				baseDamage = 1;
			}

			baseDamage += 2;

			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = this.battle.modify(baseDamage, move.critModifier || 2);
			}

			// Mod 2 (Damage is floored after all multipliers are in)
			baseDamage = Math.floor(this.battle.runEvent('ModifyDamagePhase2', pokemon, target, move, baseDamage));

			// STAB
			if (type !== '???') {
				let stab: number | [number, number] = 1;
				if (move.forceSTAB || pokemon.hasType(type)) {
					stab = 1.5;
				}
				stab = this.battle.runEvent('ModifySTAB', pokemon, target, move, stab);
				baseDamage = this.battle.modify(baseDamage, stab);
			}
			// types
			let typeMod = target.runEffectiveness(move);
			typeMod = this.battle.clampIntRange(typeMod, -6, 6);
			target.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target);

				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target);

				for (let i = 0; i > typeMod; i--) {
					baseDamage = Math.floor(baseDamage / 2);
				}
			}

			if (isCrit && !suppressMessages) this.battle.add('-crit', target);

			// Final modifier.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

			// this is not a modifier
			baseDamage = this.battle.randomizer(baseDamage);

			if (!Math.floor(baseDamage)) {
				return 1;
			}

			return Math.floor(baseDamage);
		},
		tryMoveHit(target, pokemon, move) {
			this.battle.setActiveMove(move, pokemon, target);
			let naturalImmunity = false;
			let accPass = true;

			let hitResult = this.battle.singleEvent('PrepareHit', move, {}, target, pokemon, move) &&
				this.battle.runEvent('PrepareHit', pokemon, target, move);
			if (!hitResult) {
				if (hitResult === false) {
					this.battle.add('-fail', pokemon);
					this.battle.attrLastMove('[still]');
				}
				return false;
			}

			if (!this.battle.singleEvent('Try', move, null, pokemon, target, move)) {
				return false;
			}

			if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
				if (move.target === 'all') {
					hitResult = this.battle.runEvent('TryHitField', target, pokemon, move);
				} else {
					hitResult = this.battle.runEvent('TryHitSide', target, pokemon, move);
				}
				if (!hitResult) {
					if (hitResult === false) {
						this.battle.add('-fail', pokemon);
						this.battle.attrLastMove('[still]');
					}
					return false;
				}
				return this.moveHit(target, pokemon, move);
			}

			hitResult = this.battle.runEvent('Invulnerability', target, pokemon, move);
			if (hitResult === false) {
				if (!move.spreadHit) this.battle.attrLastMove('[miss]');
				this.battle.add('-miss', pokemon, target);
				return false;
			}

			if (move.ignoreImmunity === undefined) {
				move.ignoreImmunity = (move.category === 'Status');
			}

			if (!target.runImmunity(move)) {
				naturalImmunity = true;
			} else {
				hitResult = this.battle.singleEvent('TryImmunity', move, {}, target, pokemon, move);
				if (hitResult === false) {
					naturalImmunity = true;
				}
			}

			const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];

			let accuracy = move.accuracy;
			let boosts: SparseBoostsTable = {};
			let boost: number;
			if (accuracy !== true) {
				if (!move.ignoreAccuracy) {
					boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, { ...pokemon.boosts });
					boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
					if (boost > 0) {
						accuracy *= boostTable[boost];
					} else {
						accuracy /= boostTable[-boost];
					}
				}
				if (!move.ignoreEvasion) {
					boosts = this.battle.runEvent('ModifyBoost', target, null, null, { ...target.boosts });
					boost = this.battle.clampIntRange(boosts['evasion'], -6, 6);
					if (boost > 0) {
						accuracy /= boostTable[boost];
					} else if (boost < 0) {
						accuracy *= boostTable[-boost];
					}
				}
			}
			if (move.ohko) {
				if (!target.isSemiInvulnerable()) {
					accuracy = 30;
					if (pokemon.level >= target.level && (move.ohko === true || !target.hasType(move.ohko))) {
						accuracy += (pokemon.level - target.level);
					} else {
						this.battle.add('-immune', target, '[ohko]');
						return false;
					}
				}
			} else {
				accuracy = this.battle.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
			}
			if (move.alwaysHit) {
				accuracy = true;
			} else {
				accuracy = this.battle.runEvent('Accuracy', target, pokemon, move, accuracy);
			}
			if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) {
				accPass = false;
			}

			if (accPass) {
				hitResult = this.battle.runEvent('TryHit', target, pokemon, move);
				if (!hitResult) {
					if (hitResult === false) {
						this.battle.add('-fail', pokemon);
						this.battle.attrLastMove('[still]');
					}
					return false;
				} else if (naturalImmunity) {
					this.battle.add('-immune', target);
					return false;
				}
			} else {
				if (naturalImmunity) {
					this.battle.add('-immune', target);
				} else {
					if (!move.spreadHit) this.battle.attrLastMove('[miss]');
					this.battle.add('-miss', pokemon, target);
				}
				return false;
			}

			move.totalDamage = 0;
			let damage: number | undefined | false = 0;
			pokemon.lastDamage = 0;
			if (move.multihit) {
				let hits = move.multihit;
				if (Array.isArray(hits)) {
					if (hits[0] === 2 && hits[1] === 5) {
						hits = this.battle.sample([2, 2, 2, 3, 3, 3, 4, 5]);
					} else {
						hits = this.battle.random(hits[0], hits[1] + 1);
					}
				}
				hits = Math.floor(hits);
				let nullDamage = true;
				let moveDamage: number | undefined | false;
				const isSleepUsable = move.sleepUsable || this.dex.moves.get(move.sourceEffect).sleepUsable;
				let i: number;
				for (i = 0; i < hits && target.hp && pokemon.hp; i++) {
					if (pokemon.status === 'slp' && !isSleepUsable) break;
					move.hit = i + 1;

					if (move.multiaccuracy && i > 0) {
						accuracy = move.accuracy;
						if (accuracy !== true) {
							if (!move.ignoreAccuracy) {
								boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, { ...pokemon.boosts });
								boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
								if (boost > 0) {
									accuracy *= boostTable[boost];
								} else {
									accuracy /= boostTable[-boost];
								}
							}
							if (!move.ignoreEvasion) {
								boosts = this.battle.runEvent('ModifyBoost', target, null, null, { ...target.boosts });
								boost = this.battle.clampIntRange(boosts['evasion'], -6, 6);
								if (boost > 0) {
									accuracy /= boostTable[boost];
								} else if (boost < 0) {
									accuracy *= boostTable[-boost];
								}
							}
						}
						accuracy = this.battle.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
						if (!move.alwaysHit) {
							accuracy = this.battle.runEvent('Accuracy', target, pokemon, move, accuracy);
							if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) break;
						}
					}

					moveDamage = this.moveHit(target, pokemon, move);
					if (moveDamage === false) break;
					if (nullDamage && (moveDamage || moveDamage === 0 || moveDamage === undefined)) nullDamage = false;
					damage = (moveDamage || 0);
					move.totalDamage += damage;
					this.battle.eachEvent('Update');
				}
				if (i === 0) return false;
				if (nullDamage) damage = false;
				this.battle.add('-hitcount', target, i);
			} else {
				damage = this.moveHit(target, pokemon, move);
				move.totalDamage = damage;
			}

			if (move.recoil && move.totalDamage) {
				const recoilDamage = this.battle.clampIntRange(Math.floor(move.totalDamage * move.recoil[0] / move.recoil[1]), 1);
				this.battle.damage(recoilDamage, pokemon, target, 'recoil');
			}

			if (target && pokemon !== target) target.gotAttacked(move, damage, pokemon);

			if (move.ohko && !target.hp) this.battle.add('-ohko');

			if (!damage && damage !== 0) return damage;

			this.battle.eachEvent('Update');

			if (target) {
				this.battle.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
				this.battle.runEvent('AfterMoveSecondary', target, pokemon, move);
			}

			return damage;
		},
	},
};
