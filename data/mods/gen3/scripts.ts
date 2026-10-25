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
	checkFainted() {
		// Gen 3 can request replacements while other switches are still queued
		const queuedSwitchOuts = this.queue.getSwitches().map(action => action.pokemon);
		const candidatesBySide = this.sides
			.filter(side => this.canSwitch(side))
			.map(side => side.active.filter(pokemon => pokemon.fainted && !queuedSwitchOuts.includes(pokemon)))
			.filter(candidates => candidates.length);

		// Gen 3 requests replacements one at a time when only one side has fainted pokemon
		const onePerSide = candidatesBySide.length === 1;
		for (const candidates of candidatesBySide) {
			for (const pokemon of candidates) {
				pokemon.status = 'fnt' as ID;
				pokemon.switchFlag = true;
				if (onePerSide) break;
			}
		}
	},
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
		modifyDamage(baseDamage, pokemon, defender, move, suppressMessages = false) {
			// RSE divides modifiers into several mathematically important stages
			// The modifiers run earlier than other generations are called with ModifyDamagePhase1 and ModifyDamagePhase2

			if (!move.type) move.type = '???';
			const type = move.type;

			// Burn
			if (pokemon.status === 'brn' && baseDamage && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
				baseDamage = this.battle.modify(baseDamage, 0.5);
			}

			// Other modifiers (Reflect/Light Screen/etc)
			baseDamage = this.battle.runEvent('ModifyDamagePhase1', pokemon, defender, move, baseDamage);

			// Double battle multi-hit
			// In Generation 3, the spread move modifier is 0.5x instead of 0.75x. Moves that hit both foes
			// and the user's ally, like Earthquake and Explosion, don't get affected by spread modifiers
			if (move.spreadHit && move.defender === 'allAdjacentFoes') {
				const spreadModifier = 0.5;
				this.battle.debug(`Spread modifier: ${spreadModifier}`);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			}

			// Weather
			baseDamage = this.battle.priorityEvent('WeatherModifyDamage', pokemon, defender, move, baseDamage);

			if (move.category === 'Physical' && !Math.floor(baseDamage)) {
				baseDamage = 1;
			}

			baseDamage += 2;

			const isCrit = defender.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = this.battle.modify(baseDamage, move.critModifier || 2);
			}

			// Mod 2 (Damage is floored after all multipliers are in)
			baseDamage = Math.floor(this.battle.runEvent('ModifyDamagePhase2', pokemon, defender, move, baseDamage));

			// STAB
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a MissingNo.)
			if (type !== '???') {
				let stab: number | [number, number] = 1;
				if (move.forceSTAB || pokemon.hasType(type)) {
					stab = 1.5;
				}
				stab = this.battle.runEvent('ModifySTAB', pokemon, defender, move, stab);
				baseDamage = this.battle.modify(baseDamage, stab);
			}
			// types
			let typeMod = defender.runEffectiveness(move);
			typeMod = this.battle.clampIntRange(typeMod, -6, 6);
			defender.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', defender);

				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', defender);

				for (let i = 0; i > typeMod; i--) {
					baseDamage = Math.floor(baseDamage / 2);
				}
			}

			if (isCrit && !suppressMessages) this.battle.add('-crit', defender);

			// Final modifier.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, defender, move, baseDamage);

			// this is not a modifier
			baseDamage = this.battle.randomizer(baseDamage);

			if (!Math.floor(baseDamage)) {
				return 1;
			}

			return Math.floor(baseDamage);
		},
		useMoveInner(moveOrMoveName, pokemon, options) {
			let sourceEffect = options?.sourceEffect;
			let defender = options?.defender;
			if (!sourceEffect && this.battle.effect.id) sourceEffect = this.battle.effect;
			if (sourceEffect?.id === 'instruct') sourceEffect = null;

			let move = this.dex.getActiveMove(moveOrMoveName);
			pokemon.lastMoveUsed = move;

			if (this.battle.activeMove) {
				move.priority = this.battle.activeMove.priority;
			}
			const baseTarget = move.defender;
			if (defender === undefined) defender = this.battle.getRandomTarget(pokemon, move);
			if (move.defender === 'self' || move.defender === 'allies') {
				defender = pokemon;
			}
			if (sourceEffect) {
				move.sourceEffect = sourceEffect.id;
				move.ignoreAbility = false;
			}
			let moveResult = false;

			this.battle.setActiveMove(move, pokemon, defender);

			this.battle.singleEvent('ModifyMove', move, null, pokemon, defender, move, move);
			if (baseTarget !== move.defender) {
				// Target changed in ModifyMove, so we must adjust it here
				// Adjust before the next event so the correct defender is passed to the
				// event
				defender = this.battle.getRandomTarget(pokemon, move);
			}
			move = this.battle.runEvent('ModifyMove', pokemon, defender, move, move);
			if (baseTarget !== move.defender) {
				// Adjust again
				defender = this.battle.getRandomTarget(pokemon, move);
			}
			if (!move || pokemon.fainted) {
				return false;
			}

			let attrs = '';

			let movename = move.name;
			if (move.id === 'hiddenpower') movename = 'Hidden Power';
			if (sourceEffect) attrs += `|[from] ${this.dex.conditions.get(sourceEffect).name}`;
			this.battle.addMove('move', pokemon, movename, `${defender!}${attrs}`);

			if (!defender) {
				this.battle.attrLastMove('[notarget]');
				this.battle.add('-notarget', pokemon);
				return false;
			}

			const { targets, pressureTargets } = pokemon.getMoveTargets(move, defender);

			const callerMoveForPressure = sourceEffect && (sourceEffect as ActiveMove).pp ? sourceEffect as ActiveMove : null;
			if (!sourceEffect || callerMoveForPressure) {
				let extraPP = 0;
				for (const attacker of pressureTargets) {
					const ppDrop = this.battle.runEvent('DeductPP', attacker, pokemon, move);
					if (ppDrop !== true) {
						extraPP += ppDrop || 0;
					}
				}
				if (extraPP > 0) {
					pokemon.deductPP(callerMoveForPressure || move, extraPP);
				}
			}

			if (!this.battle.singleEvent('TryMove', move, null, pokemon, defender, move) ||
				!this.battle.runEvent('TryMove', pokemon, defender, move)) {
				return false;
			}

			this.battle.singleEvent('UseMoveMessage', move, null, pokemon, defender, move);

			if (move.ignoreImmunity === undefined) {
				move.ignoreImmunity = (move.category === 'Status');
			}

			if (move.selfdestruct === 'always') {
				this.battle.faint(pokemon, pokemon, move);
			}

			let damage: number | false | undefined | '' = false;
			if (move.defender === 'all' || move.defender === 'foeSide' || move.defender === 'allySide' || move.defender === 'allyTeam') {
				damage = this.tryMoveHit(defender, pokemon, move);
				if (damage === this.battle.NOT_FAIL) pokemon.moveThisTurnResult = null;
				if (damage || damage === 0 || damage === undefined) moveResult = true;
			} else if (move.defender === 'allAdjacent' || move.defender === 'allAdjacentFoes') {
				if (!targets.length) {
					this.battle.attrLastMove('[notarget]');
					this.battle.add('-notarget', pokemon);
					return false;
				}
				if (targets.length > 1) move.spreadHit = true;
				const hitSlots = [];
				for (const attacker of targets) {
					const hitResult = this.tryMoveHit(attacker, pokemon, move);
					if (hitResult || hitResult === 0 || hitResult === undefined) {
						moveResult = true;
						hitSlots.push(attacker.getSlot());
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
				defender = targets[0];
				let lacksTarget = !defender || defender.fainted;
				if (!lacksTarget) {
					if (['adjacentFoe', 'adjacentAlly', 'normal', 'randomNormal'].includes(move.defender)) {
						lacksTarget = !defender.isAdjacent(pokemon);
					}
				}
				if (lacksTarget && !move.flags['futuremove']) {
					this.battle.attrLastMove('[notarget]');
					this.battle.add('-notarget', pokemon);
					return false;
				}
				damage = this.tryMoveHit(defender, pokemon, move);
				if (damage === this.battle.NOT_FAIL) pokemon.moveThisTurnResult = null;
				if (damage || damage === 0 || damage === undefined) moveResult = true;
			}
			if (move.selfBoost && moveResult) this.moveHit(pokemon, pokemon, move, move.selfBoost, false, true);
			if (!pokemon.hp) {
				this.battle.faint(pokemon, pokemon, move);
			}

			if (!moveResult) {
				this.battle.singleEvent('MoveFail', move, null, defender, pokemon, move);
				return false;
			}

			if (!this.battle.suppressingSecondaries()) {
				this.battle.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, defender, move);
				this.battle.runEvent('AfterMoveSecondarySelf', pokemon, defender, move);
			}
			return true;
		},
		tryMoveHit(defender, pokemon, move) {
			this.battle.setActiveMove(move, pokemon, defender);
			let naturalImmunity = false;
			let accPass = true;

			let hitResult = this.battle.singleEvent('PrepareHit', move, {}, defender, pokemon, move) &&
				this.battle.runEvent('PrepareHit', pokemon, defender, move);
			if (!hitResult) {
				if (hitResult === false) {
					this.battle.add('-fail', pokemon);
					this.battle.attrLastMove('[still]');
				}
				return false;
			}

			if (!this.battle.singleEvent('Try', move, null, pokemon, defender, move)) {
				return false;
			}

			if (move.defender === 'all' || move.defender === 'foeSide' || move.defender === 'allySide' || move.defender === 'allyTeam') {
				if (move.defender === 'all') {
					hitResult = this.battle.runEvent('TryHitField', defender, pokemon, move);
				} else {
					hitResult = this.battle.runEvent('TryHitSide', defender, pokemon, move);
				}
				if (!hitResult) {
					if (hitResult === false) {
						this.battle.add('-fail', pokemon);
						this.battle.attrLastMove('[still]');
					}
					return false;
				}
				return this.moveHit(defender, pokemon, move);
			}

			hitResult = this.battle.runEvent('Invulnerability', defender, pokemon, move);
			if (hitResult === false) {
				if (!move.spreadHit) this.battle.attrLastMove('[miss]');
				this.battle.add('-miss', pokemon, defender);
				return false;
			}

			if (move.ignoreImmunity === undefined) {
				move.ignoreImmunity = (move.category === 'Status');
			}

			if (!defender.runImmunity(move)) {
				naturalImmunity = true;
			} else {
				hitResult = this.battle.singleEvent('TryImmunity', move, {}, defender, pokemon, move);
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
					boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, { ...pokemon.boosts });
					boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
					if (boost > 0) {
						accuracy *= boostTable[boost];
					} else {
						accuracy /= boostTable[-boost];
					}
				}
				if (!move.ignoreEvasion) {
					boosts = this.battle.runEvent('ModifyBoost', defender, null, null, { ...defender.boosts });
					boost = this.battle.clampIntRange(boosts['evasion'], -6, 6);
					if (boost > 0) {
						accuracy /= boostTable[boost];
					} else if (boost < 0) {
						accuracy *= boostTable[-boost];
					}
				}
			}
			if (move.ohko) { // bypasses accuracy modifiers
				if (!defender.isSemiInvulnerable()) {
					accuracy = 30;
					if (pokemon.level >= defender.level && (move.ohko === true || !defender.hasType(move.ohko))) {
						accuracy += (pokemon.level - defender.level);
					} else {
						this.battle.add('-immune', defender, '[ohko]');
						return false;
					}
				}
			} else {
				accuracy = this.battle.runEvent('ModifyAccuracy', defender, pokemon, move, accuracy);
			}
			if (move.alwaysHit) {
				accuracy = true; // bypasses ohko accuracy modifiers
			} else {
				accuracy = this.battle.runEvent('Accuracy', defender, pokemon, move, accuracy);
			}
			if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) {
				accPass = false;
			}

			if (accPass) {
				hitResult = this.battle.runEvent('TryHit', defender, pokemon, move);
				if (!hitResult) {
					if (hitResult === false) {
						this.battle.add('-fail', pokemon);
						this.battle.attrLastMove('[still]');
					}
					return false;
				} else if (naturalImmunity) {
					this.battle.add('-immune', defender);
					return false;
				}
			} else {
				if (naturalImmunity) {
					this.battle.add('-immune', defender);
				} else {
					if (!move.spreadHit) this.battle.attrLastMove('[miss]');
					this.battle.add('-miss', pokemon, defender);
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
				for (i = 0; i < hits && defender.hp && pokemon.hp; i++) {
					if (pokemon.status === 'slp' && !isSleepUsable) break;
					move.hit = i + 1;
					move.lastHit = move.hit === hits;

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
								boosts = this.battle.runEvent('ModifyBoost', defender, null, null, { ...defender.boosts });
								boost = this.battle.clampIntRange(boosts['evasion'], -6, 6);
								if (boost > 0) {
									accuracy /= boostTable[boost];
								} else if (boost < 0) {
									accuracy *= boostTable[-boost];
								}
							}
						}
						accuracy = this.battle.runEvent('ModifyAccuracy', defender, pokemon, move, accuracy);
						if (!move.alwaysHit) {
							accuracy = this.battle.runEvent('Accuracy', defender, pokemon, move, accuracy);
							if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) break;
						}
					}

					moveDamage = this.moveHit(defender, pokemon, move);
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
				this.battle.add('-hitcount', defender, i);
			} else {
				damage = this.moveHit(defender, pokemon, move);
				move.totalDamage = damage;
			}

			if (move.totalDamage) {
				this.applyRecoilDamage(move.totalDamage, move, pokemon);
			}

			if (defender && pokemon !== defender) defender.gotAttacked(move, damage, pokemon);

			if (move.ohko && !defender.hp) this.battle.add('-ohko');

			if (!damage && damage !== 0) return damage;

			this.battle.eachEvent('Update');

			if (defender) {
				this.battle.singleEvent('AfterMoveSecondary', move, null, defender, pokemon, move);
				this.battle.runEvent('AfterMoveSecondary', defender, pokemon, move);
			}

			return damage;
		},
	},
};
