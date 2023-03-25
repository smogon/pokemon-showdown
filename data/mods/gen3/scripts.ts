export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen4',
	gen: 3,
	init() {
		const specialTypes = ['Fire', 'Water', 'Grass', 'Ice', 'Electric', 'Dark', 'Psychic', 'Dragon'];
		let newCategory = '';
		for (const i in this.data.Moves) {
			if (!this.data.Moves[i]) console.log(i);
			if (this.data.Moves[i].category === 'Status') continue;
			newCategory = specialTypes.includes(this.data.Moves[i].type) ? 'Special' : 'Physical';
			if (newCategory !== this.data.Moves[i].category) {
				this.modData('Moves', i).category = newCategory;
			}
		}
	},
	pokemon: {
		inherit: true,
		getActionSpeed() {
			let speed = this.getStat('spe', false, false);
			if (this.battle.field.getPseudoWeather('trickroom')) {
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
			// RSE divides modifiers into several mathematically important stages
			// The modifiers run earlier than other generations are called with ModifyDamagePhase1 and ModifyDamagePhase2

			if (!move.type) move.type = '???';
			const type = move.type;

			// Burn
			if (pokemon.status === 'brn' && baseDamage && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
				baseDamage = this.battle.modify(baseDamage, 0.5);
			}

			// Other modifiers (Reflect/Light Screen/etc)
			baseDamage = this.battle.runEvent('ModifyDamagePhase1', pokemon, target, move, baseDamage);

			// Double battle multi-hit
			// In Generation 3, the spread move modifier is 0.5x instead of 0.75x. Moves that hit both foes
			// and the user's ally, like Earthquake and Explosion, don't get affected by spread modifiers
			if (move.spreadHit && move.target === 'allAdjacentFoes') {
				const spreadModifier = move.spreadModifier || 0.5;
				this.battle.debug('Spread modifier: ' + spreadModifier);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			}

			// Weather
			baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

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
			if (move.forceSTAB || type !== '???' && pokemon.hasType(type)) {
				// The "???" type never gets STAB
				// Not even if you Roost in Gen 4 and somehow manage to use
				// Struggle in the same turn.
				// (On second thought, it might be easier to get a MissingNo.)
				baseDamage = this.battle.modify(baseDamage, move.stab || 1.5);
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
		useMoveInner(moveOrMoveName, pokemon, target, sourceEffect, zMove) {
			if (!sourceEffect && this.battle.effect.id) sourceEffect = this.battle.effect;
			if (sourceEffect && sourceEffect.id === 'instruct') sourceEffect = null;

			let move = this.dex.getActiveMove(moveOrMoveName);
			pokemon.lastMoveUsed = move;

			if (this.battle.activeMove) {
				move.priority = this.battle.activeMove.priority;
			}
			const baseTarget = move.target;
			if (target === undefined) target = this.battle.getRandomTarget(pokemon, move);
			if (move.target === 'self' || move.target === 'allies') {
				target = pokemon;
			}
			if (sourceEffect) {
				move.sourceEffect = sourceEffect.id;
				move.ignoreAbility = false;
			}
			let moveResult = false;

			this.battle.setActiveMove(move, pokemon, target);

			this.battle.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
			if (baseTarget !== move.target) {
				// Target changed in ModifyMove, so we must adjust it here
				// Adjust before the next event so the correct target is passed to the
				// event
				target = this.battle.getRandomTarget(pokemon, move);
			}
			move = this.battle.runEvent('ModifyMove', pokemon, target, move, move);
			if (baseTarget !== move.target) {
				// Adjust again
				target = this.battle.getRandomTarget(pokemon, move);
			}
			if (!move || pokemon.fainted) {
				return false;
			}

			let attrs = '';

			let movename = move.name;
			if (move.id === 'hiddenpower') movename = 'Hidden Power';
			if (sourceEffect) attrs += `|[from]${this.dex.conditions.get(sourceEffect)}`;
			this.battle.addMove('move', pokemon, movename, target + attrs);

			if (!target) {
				this.battle.attrLastMove('[notarget]');
				this.battle.add('-notarget', pokemon);
				return false;
			}

			const {targets, pressureTargets} = pokemon.getMoveTargets(move, target);

			if (!sourceEffect || sourceEffect.id === 'pursuit') {
				let extraPP = 0;
				for (const source of pressureTargets) {
					const ppDrop = this.battle.runEvent('DeductPP', source, pokemon, move);
					if (ppDrop !== true) {
						extraPP += ppDrop || 0;
					}
				}
				if (extraPP > 0) {
					pokemon.deductPP(move, extraPP);
				}
			}

			if (!this.battle.singleEvent('TryMove', move, null, pokemon, target, move) ||
				!this.battle.runEvent('TryMove', pokemon, target, move)) {
				move.mindBlownRecoil = false;
				return false;
			}

			this.battle.singleEvent('UseMoveMessage', move, null, pokemon, target, move);

			if (move.ignoreImmunity === undefined) {
				move.ignoreImmunity = (move.category === 'Status');
			}

			if (move.selfdestruct === 'always') {
				this.battle.faint(pokemon, pokemon, move);
			}

			let damage: number | false | undefined | '' = false;
			if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
				damage = this.tryMoveHit(target, pokemon, move);
				if (damage === this.battle.NOT_FAIL) pokemon.moveThisTurnResult = null;
				if (damage || damage === 0 || damage === undefined) moveResult = true;
			} else if (move.target === 'allAdjacent' || move.target === 'allAdjacentFoes') {
				if (!targets.length) {
					this.battle.attrLastMove('[notarget]');
					this.battle.add('-notarget', pokemon);
					return false;
				}
				if (targets.length > 1) move.spreadHit = true;
				const hitSlots = [];
				for (const source of targets) {
					const hitResult = this.tryMoveHit(source, pokemon, move);
					if (hitResult || hitResult === 0 || hitResult === undefined) {
						moveResult = true;
						hitSlots.push(source.getSlot());
					}
					if (damage) {
						damage += hitResult || 0;
					} else {
						if (damage !== false || hitResult !== this.battle.NOT_FAIL) damage = hitResult;
					}
					if (damage === this.battle.NOT_FAIL) pokemon.moveThisTurnResult = null;
				}
				if (move.spreadHit) this.battle.attrLastMove('[spread] ' + hitSlots.join(','));
			} else {
				target = targets[0];
				let lacksTarget = !target || target.fainted;
				if (!lacksTarget) {
					if (['adjacentFoe', 'adjacentAlly', 'normal', 'randomNormal'].includes(move.target)) {
						lacksTarget = !target.isAdjacent(pokemon);
					}
				}
				if (lacksTarget && !move.flags['futuremove']) {
					this.battle.attrLastMove('[notarget]');
					this.battle.add('-notarget', pokemon);
					return false;
				}
				damage = this.tryMoveHit(target, pokemon, move);
				if (damage === this.battle.NOT_FAIL) pokemon.moveThisTurnResult = null;
				if (damage || damage === 0 || damage === undefined) moveResult = true;
			}
			if (move.selfBoost && moveResult) this.moveHit(pokemon, pokemon, move, move.selfBoost, false, true);
			if (!pokemon.hp) {
				this.battle.faint(pokemon, pokemon, move);
			}

			if (!moveResult) {
				this.battle.singleEvent('MoveFail', move, null, target, pokemon, move);
				return false;
			}

			if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
				this.battle.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
				this.battle.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
			}
			return true;
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

			if (
				(!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) &&
				!target.runImmunity(move.type)
			) {
				naturalImmunity = true;
			} else {
				hitResult = this.battle.singleEvent('TryImmunity', move, {}, target, pokemon, move);
				if (hitResult === false) {
					naturalImmunity = true;
				}
			}

			const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];

			// calculate true accuracy
			let accuracy = move.accuracy;
			let boosts: SparseBoostsTable = {};
			let boost: number;
			if (accuracy !== true) {
				if (!move.ignoreAccuracy) {
					boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, {...pokemon.boosts});
					boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
					if (boost > 0) {
						accuracy *= boostTable[boost];
					} else {
						accuracy /= boostTable[-boost];
					}
				}
				if (!move.ignoreEvasion) {
					boosts = this.battle.runEvent('ModifyBoost', target, null, null, {...target.boosts});
					boost = this.battle.clampIntRange(boosts['evasion'], -6, 6);
					if (boost > 0) {
						accuracy /= boostTable[boost];
					} else if (boost < 0) {
						accuracy *= boostTable[-boost];
					}
				}
			}
			if (move.ohko) { // bypasses accuracy modifiers
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
				accuracy = true; // bypasses ohko accuracy modifiers
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
					// yes, it's hardcoded... meh
					if (hits[0] === 2 && hits[1] === 5) {
						hits = this.battle.sample([2, 2, 2, 3, 3, 3, 4, 5]);
					} else {
						hits = this.battle.random(hits[0], hits[1] + 1);
					}
				}
				hits = Math.floor(hits);
				let nullDamage = true;
				let moveDamage: number | undefined | false;
				// There is no need to recursively check the ´sleepUsable´ flag as Sleep Talk can only be used while asleep.
				const isSleepUsable = move.sleepUsable || this.dex.moves.get(move.sourceEffect).sleepUsable;
				let i: number;
				for (i = 0; i < hits && target.hp && pokemon.hp; i++) {
					if (pokemon.status === 'slp' && !isSleepUsable) break;
					move.hit = i + 1;

					if (move.multiaccuracy && i > 0) {
						accuracy = move.accuracy;
						if (accuracy !== true) {
							if (!move.ignoreAccuracy) {
								boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, {...pokemon.boosts});
								boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
								if (boost > 0) {
									accuracy *= boostTable[boost];
								} else {
									accuracy /= boostTable[-boost];
								}
							}
							if (!move.ignoreEvasion) {
								boosts = this.battle.runEvent('ModifyBoost', target, null, null, {...target.boosts});
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
					// Damage from each hit is individually counted for the
					// purposes of Counter, Metal Burst, and Mirror Coat.
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
				this.battle.damage(this.calcRecoilDamage(move.totalDamage, move), pokemon, target, 'recoil');
			}

			if (target && pokemon !== target) target.gotAttacked(move, damage, pokemon);

			if (move.ohko && !target.hp) this.battle.add('-ohko');

			if (!damage && damage !== 0) return damage;

			this.battle.eachEvent('Update');

			if (target && !move.negateSecondary) {
				this.battle.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
				this.battle.runEvent('AfterMoveSecondary', target, pokemon, move);
			}

			return damage;
		},

		calcRecoilDamage(damageDealt, move) {
			return this.battle.clampIntRange(Math.floor(damageDealt * move.recoil![0] / move.recoil![1]), 1);
		},
	},
};
