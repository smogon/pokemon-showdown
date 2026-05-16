export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	init() {
		for (const i in this.data.Moves) {
			if (this.data.Moves[i].pp > 20) {
				this.modData('Moves', i).pp = 20;
			}
		}
	},
	statModify(baseStats, set, statName) {
		const tr = this.trunc;
		let stat = baseStats[statName];
		const evs = set.evs[statName];
		if (statName === 'hp') {
			return stat + evs + 75;
		}
		stat = stat + evs + 20;
		const nature = this.dex.natures.get(set.nature);
		// Natures are calculated with 16-bit truncation.
		// This only affects Eternatus-Eternamax in Pure Hackmons.
		if (nature.plus === statName) {
			stat = this.ruleTable.has('overflowstatmod') ? Math.min(stat, 595) : stat;
			stat = tr(tr(stat * 110, 16) / 100);
		} else if (nature.minus === statName) {
			stat = this.ruleTable.has('overflowstatmod') ? Math.min(stat, 728) : stat;
			stat = tr(tr(stat * 90, 16) / 100);
		}
		return stat;
	},
	calculatePP(move, ppUps) {
		return move.noPPBoosts ? move.pp : (move.pp / 5 + 1) * 4;
	},
	pokemon: {
		// Remove Trick Room underflow
		getActionSpeed() {
			let speed = this.getStat('spe', false, false);
			const trickRoomCheck = this.battle.ruleTable.has('twisteddimensionmod') ?
				!this.battle.field.getPseudoWeather('trickroom') : this.battle.field.getPseudoWeather('trickroom');
			if (trickRoomCheck) {
				speed = -speed;
			}
			return speed;
		},
		// Don't revert Mega Evolutions after fainting
		// TODO: confirm interaction with Revival Blessing
		formeChange(speciesId, source, isPermanent, abilitySlot = '0', message) {
			const rawSpecies = this.battle.dex.species.get(speciesId);

			const species = this.setSpecies(rawSpecies, source);
			if (!species) return false;

			if (this.battle.gen <= 2) return true;

			// The species the opponent sees
			const apparentSpecies =
				this.illusion ? this.illusion.species.name : species.baseSpecies;
			if (isPermanent) {
				this.baseSpecies = rawSpecies;
				this.details = this.getUpdatedDetails();
				let details = (this.illusion || this).details;
				if (this.terastallized) details += `, tera:${this.terastallized}`;
				this.battle.add('detailschange', this, details);
				this.updateMaxHp();
				if (!source) {
					// Tera forme
					// Ogerpon/Terapagos text goes here
					this.formeRegression = true;
				} else if (source.effectType === 'Item') {
					this.canTerastallize = null; // National Dex behavior
					if (source.zMove) {
						this.battle.add('-burst', this, apparentSpecies, species.requiredItem);
						this.moveThisTurnResult = true; // Ultra Burst counts as an action for Truant
					} else if (source.isPrimalOrb) {
						if (this.illusion) {
							this.ability = '';
							this.battle.add('-primal', this.illusion, species.requiredItem);
						} else {
							this.battle.add('-primal', this, species.requiredItem);
						}
					} else {
						this.battle.add('-mega', this, apparentSpecies, species.requiredItem);
						this.moveThisTurnResult = true; // Mega Evolution counts as an action for Truant
					}
				} else if (source.effectType === 'Status') {
					// Shaymin-Sky -> Shaymin
					this.battle.add('-formechange', this, species.name, message);
				}
			} else {
				if (source?.effectType === 'Ability') {
					this.battle.add('-formechange', this, species.name, message, `[from] ability: ${source.name}`);
				} else {
					this.battle.add('-formechange', this, this.illusion ? this.illusion.species.name : species.name, message);
				}
			}
			if (isPermanent && (!source || !['disguise', 'iceface'].includes(source.id))) {
				if (this.illusion && source) {
					// Tera forme by Ogerpon or Terapagos breaks the Illusion
					this.ability = ''; // Don't allow Illusion to wear off
				}
				const ability = species.abilities[abilitySlot] || species.abilities['0'];
				// Ogerpon's forme change doesn't override permanent abilities
				if (source || !this.getAbility().flags['cantsuppress']) this.setAbility(ability, null, null, true);
				// However, its ability does reset upon switching out
				this.baseAbility = this.battle.toID(ability);
			}
			if (this.terastallized) {
				this.knownType = true;
				this.apparentType = this.terastallized;
			}
			return true;
		},
	},
	actions: {
		canTerastallize(pokemon) {
			return null;
		},
		canMegaEvo(pokemon: Pokemon) {
			const species = pokemon.baseSpecies;
			const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
			const item = pokemon.getItem();
			// Mega Rayquaza
			if ((this.battle.gen <= 7 || this.battle.ruleTable.has('+pokemontag:past') ||
				this.battle.ruleTable.has('+pokemontag:future')) &&
				altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(toID(altForme.requiredMove)) && !item.zMove) {
				return altForme.name;
			}
			return item.megaStone?.[species.name] || null;
		},
		// Announce 4x and 0.25x effectiveness
		modifyDamage(baseDamage, pokemon, target, move, suppressMessages) {
			const tr = this.battle.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;

			baseDamage += 2;

			if (move.spreadHit) {
				// multi-target modifier (doubles only)
				const spreadModifier = this.battle.gameType === 'freeforall' ? 0.5 : 0.75;
				this.battle.debug(`Spread modifier: ${spreadModifier}`);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			} else if (move.multihitType === 'parentalbond' && move.hit > 1) {
				// Parental Bond modifier
				const bondModifier = this.battle.gen > 6 ? 0.25 : 0.5;
				this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
				baseDamage = this.battle.modify(baseDamage, bondModifier);
			}

			// weather modifier
			baseDamage = this.battle.priorityEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

			// crit - not a modifier
			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
			}

			// random factor - also not a modifier
			baseDamage = this.battle.randomizer(baseDamage);

			// STAB
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a MissingNo.)
			if (type !== '???') {
				let stab: number | [number, number] = 1;

				const isSTAB = move.forceSTAB || pokemon.hasType(type) || pokemon.getTypes(false, true).includes(type);
				if (isSTAB) {
					stab = 1.5;
				}

				// The Stellar tera type makes this incredibly confusing
				// If the move's type does not match one of the user's base types,
				// the Stellar tera type applies a one-time 1.2x damage boost for that type.
				//
				// If the move's type does match one of the user's base types,
				// then the Stellar tera type applies a one-time 2x STAB boost for that type,
				// and then goes back to using the regular 1.5x STAB boost for those types.
				if (pokemon.terastallized === 'Stellar') {
					if (!pokemon.stellarBoostedTypes.includes(type) || move.stellarBoosted) {
						stab = isSTAB ? 2 : [4915, 4096];
						move.stellarBoosted = true;
						if (pokemon.species.name !== 'Terapagos-Stellar') {
							pokemon.stellarBoostedTypes.push(type);
						}
					}
				} else {
					if (pokemon.terastallized === type && pokemon.getTypes(false, true).includes(type)) {
						stab = 2;
					}
					stab = this.battle.runEvent('ModifySTAB', pokemon, target, move, stab);
				}

				baseDamage = this.battle.modify(baseDamage, stab);
			}

			// types
			let typeMod = target.runEffectiveness(move);
			typeMod = this.battle.clampIntRange(typeMod, -6, 6);
			target.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target, Math.min(typeMod, 2));

				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target, Math.min(-typeMod, 2));

				for (let i = 0; i > typeMod; i--) {
					baseDamage = tr(baseDamage / 2);
				}
			}

			if (isCrit && !suppressMessages) this.battle.add('-crit', target);

			if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
				if (this.battle.gen < 6 || move.id !== 'facade') {
					baseDamage = this.battle.modify(baseDamage, 0.5);
				}
			}

			// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
			if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;

			// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

			const bypassProtect = target.getMoveHitData(move).bypassProtect;
			if (bypassProtect) {
				baseDamage = this.battle.modify(baseDamage, 0.25);
				if (bypassProtect !== true && bypassProtect.effectType === 'Ability') {
					this.battle.add('-ability', pokemon, bypassProtect.name);
				}
				this.battle.add('-zbroken', target);
			}

			// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
			if (this.battle.gen !== 5 && !baseDamage) return 1;

			// ...but 16-bit truncation happens even later, and can truncate to 0
			return tr(baseDamage, 16);
		},
		// Run `AfterHit` events even if the source fainted
		spreadMoveHit(targets, pokemon, moveOrMoveName, hitEffect?, isSecondary?, isSelf?) {
			// Hardcoded for single-target purposes
			// (no spread moves have any kind of onTryHit handler)
			const target = targets[0];
			let damage: (number | boolean | undefined)[] = [];
			for (const i of targets.keys()) {
				damage[i] = true;
			}
			const move = this.dex.getActiveMove(moveOrMoveName);
			let hitResult: boolean | number | null = true;
			let moveData = hitEffect!;
			if (!moveData) moveData = move;
			if (!moveData.flags) moveData.flags = {};
			if (move.target === 'all' && !isSelf) {
				hitResult = this.battle.singleEvent('TryHitField', moveData, {}, target || null, pokemon, move);
			} else if ((move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') && !isSelf) {
				hitResult = this.battle.singleEvent('TryHitSide', moveData, {}, target || null, pokemon, move);
			} else if (target) {
				hitResult = this.battle.singleEvent('TryHit', moveData, {}, target, pokemon, move);
			}
			if (!hitResult) {
				if (hitResult === false) {
					this.battle.add('-fail', pokemon);
					this.battle.attrLastMove('[still]');
				}
				return [[false], targets]; // single-target only
			}

			// 0. check for substitute
			if (!isSecondary && !isSelf) {
				if (move.target !== 'all' && move.target !== 'allyTeam' && move.target !== 'allySide' && move.target !== 'foeSide') {
					damage = this.tryPrimaryHitEvent(damage, targets, pokemon, move, moveData, isSecondary);
				}
			}

			for (const i of targets.keys()) {
				if (damage[i] === this.battle.HIT_SUBSTITUTE) {
					damage[i] = true;
					targets[i] = null;
				}
				if (targets[i] && isSecondary && !moveData.self) {
					damage[i] = true;
				}
				if (!damage[i]) targets[i] = false;
			}
			// 1. call to this.battle.getDamage
			damage = this.getSpreadDamage(damage, targets, pokemon, move, moveData, isSecondary, isSelf);

			for (const i of targets.keys()) {
				if (damage[i] === false) targets[i] = false;
			}

			// 2. call to this.battle.spreadDamage
			damage = this.battle.spreadDamage(damage, targets, pokemon, move);

			for (const i of targets.keys()) {
				if (damage[i] === false) targets[i] = false;
			}

			// 3. onHit event happens here
			damage = this.runMoveEffects(damage, targets, pokemon, move, moveData, isSecondary, isSelf);

			for (const i of targets.keys()) {
				if (!damage[i] && damage[i] !== 0) targets[i] = false;
			}

			// steps 4 and 5 can mess with this.battle.activeTarget, which needs to be preserved for Dancer
			const activeTarget = this.battle.activeTarget;

			// 4. self drops (start checking for targets[i] === false here)
			if (moveData.self && !move.selfDropped) this.selfDrops(targets, pokemon, move, moveData, isSecondary);

			// 5. secondary effects
			if (moveData.secondaries) this.secondaries(targets, pokemon, move, moveData, isSelf);

			this.battle.activeTarget = activeTarget;

			// 6. force switch
			if (moveData.forceSwitch) damage = this.forceSwitch(damage, targets, pokemon, move);

			for (const i of targets.keys()) {
				if (!damage[i] && damage[i] !== 0) targets[i] = false;
			}

			const damagedTargets: Pokemon[] = [];
			const damagedDamage = [];
			for (const [i, t] of targets.entries()) {
				if (typeof damage[i] === 'number' && t) {
					damagedTargets.push(t);
					damagedDamage.push(damage[i]);
				}
			}
			const pokemonOriginalHP = pokemon.hp;
			if (damagedDamage.length && !isSecondary && !isSelf) {
				if (this.battle.gen >= 5) {
					this.battle.runEvent('DamagingHit', damagedTargets, pokemon, move, damagedDamage);
				}
				if (moveData.onAfterHit) {
					for (const t of damagedTargets) {
						this.battle.singleEvent('AfterHit', moveData, {}, t, pokemon, move);
					}
				}
				if (this.battle.gen < 5) {
					this.battle.runEvent('DamagingHit', damagedTargets, pokemon, move, damagedDamage);
				}
				if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && pokemonOriginalHP > pokemon.maxhp / 2) {
					this.battle.runEvent('EmergencyExit', pokemon);
				}
			}

			return [damage, targets];
		},
		// Parental Bond shouldn't announce hit count if it only hits once
		hitStepMoveHitLoop(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) { // Temporary name
			let damage: (number | boolean | undefined)[] = [];
			for (const i of targets.keys()) {
				damage[i] = 0;
			}
			move.totalDamage = 0;
			pokemon.lastDamage = 0;
			let targetHits = move.multihit || 1;
			if (Array.isArray(targetHits)) {
				// yes, it's hardcoded... meh
				if (targetHits[0] === 2 && targetHits[1] === 5) {
					if (this.battle.gen >= 5) {
						// 35-35-15-15 out of 100 for 2-3-4-5 hits
						targetHits = this.battle.sample([2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5]);
						if (targetHits < 4 && pokemon.hasItem('loadeddice')) {
							targetHits = 5 - this.battle.random(2);
						}
					} else {
						targetHits = this.battle.sample([2, 2, 2, 3, 3, 3, 4, 5]);
					}
				} else {
					targetHits = this.battle.random(targetHits[0], targetHits[1] + 1);
				}
			}
			if (targetHits === 10 && pokemon.hasItem('loadeddice')) targetHits -= this.battle.random(7);
			targetHits = Math.floor(targetHits);
			let nullDamage = true;
			let moveDamage: (number | boolean | undefined)[] = [];
			// There is no need to recursively check the ´sleepUsable´ flag as Sleep Talk can only be used while asleep.
			const isSleepUsable = move.sleepUsable || this.dex.moves.get(move.sourceEffect).sleepUsable;

			let targetsCopy: (Pokemon | false | null)[] = targets.slice(0);
			let hit: number;
			for (hit = 1; hit <= targetHits; hit++) {
				if (damage.includes(false)) break;
				if (hit > 1 && pokemon.status === 'slp' && (!isSleepUsable || this.battle.gen === 4)) break;
				if (targets.every(target => !target?.hp)) break;
				move.hit = hit;
				move.lastHit = move.hit === targetHits;
				if (move.smartTarget && targets.length > 1) {
					targetsCopy = [targets[hit - 1]];
					damage = [damage[hit - 1]];
				} else {
					targetsCopy = targets.slice(0);
				}
				const target = targetsCopy[0]; // some relevant-to-single-target-moves-only things are hardcoded
				if (target && typeof move.smartTarget === 'boolean') {
					if (hit > 1) {
						this.battle.addMove('-anim', pokemon, move.name, target);
					} else {
						this.battle.retargetLastMove(target);
					}
				}

				// like this (Triple Kick)
				if (target && move.multiaccuracy && hit > 1) {
					let accuracy = move.accuracy;
					const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];
					if (accuracy !== true) {
						if (!move.ignoreAccuracy) {
							const boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, { ...pokemon.boosts });
							const boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
							if (boost > 0) {
								accuracy *= boostTable[boost];
							} else {
								accuracy /= boostTable[-boost];
							}
						}
						if (!move.ignoreEvasion) {
							const boosts = this.battle.runEvent('ModifyBoost', target, null, null, { ...target.boosts });
							const boost = this.battle.clampIntRange(boosts['evasion'], -6, 6);
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

				const moveData = move;
				if (!moveData.flags) moveData.flags = {};

				let moveDamageThisHit;
				// Modifies targetsCopy (which is why it's a copy)
				[moveDamageThisHit, targetsCopy] = this.spreadMoveHit(targetsCopy, pokemon, move, moveData);
				// When Dragon Darts targets two different pokemon, targetsCopy is a length 1 array each hit
				// so spreadMoveHit returns a length 1 damage array
				if (move.smartTarget) {
					moveDamage.push(...moveDamageThisHit);
				} else {
					moveDamage = moveDamageThisHit;
				}

				if (!moveDamage.some(val => val !== false)) break;
				nullDamage = false;

				for (const [i, md] of moveDamage.entries()) {
					if (move.smartTarget && i !== hit - 1) continue;
					// Damage from each hit is individually counted for the
					// purposes of Counter, Metal Burst, and Mirror Coat.
					damage[i] = md === true || !md ? 0 : md;
					// Total damage dealt is accumulated for the purposes of recoil (Parental Bond).
					move.totalDamage += damage[i];
				}
				if (move.mindBlownRecoil) {
					const hpBeforeRecoil = pokemon.hp;
					this.battle.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get(move.id), true);
					move.mindBlownRecoil = false;
					if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
						this.battle.runEvent('EmergencyExit', pokemon, pokemon);
					}
				}
				this.battle.eachEvent('Update');
				if (!pokemon.hp && targets.length === 1) {
					hit++; // report the correct number of hits for multihit moves
					break;
				}
			}
			// hit is 1 higher than the actual hit count
			if (hit === 1) return damage.fill(false);
			if (nullDamage) damage.fill(false);
			this.battle.faintMessages(false, false, !pokemon.hp);
			if (move.multihit && typeof move.smartTarget !== 'boolean' &&
				!(move.hit === 1 && move.multihitType === 'parentalbond')) {
				this.battle.add('-hitcount', targets[0], hit - 1);
			}

			if ((move.recoil || move.id === 'chloroblast') && move.totalDamage) {
				const hpBeforeRecoil = pokemon.hp;
				this.battle.damage(this.calcRecoilDamage(move.totalDamage, move, pokemon), pokemon, pokemon, 'recoil');
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
					this.battle.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}

			if (move.struggleRecoil) {
				const hpBeforeRecoil = pokemon.hp;
				let recoilDamage;
				if (this.dex.gen >= 5) {
					recoilDamage = this.battle.clampIntRange(Math.round(pokemon.baseMaxhp / 4), 1);
				} else {
					recoilDamage = this.battle.clampIntRange(this.battle.trunc(pokemon.maxhp / 4), 1);
				}
				this.battle.directDamage(recoilDamage, pokemon, pokemon, { id: 'strugglerecoil' } as Condition);
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
					this.battle.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}

			// smartTarget messes up targetsCopy, but smartTarget should in theory ensure that targets will never fail, anyway
			if (move.smartTarget) {
				targetsCopy = targets.slice(0);
			}

			for (const [i, target] of targetsCopy.entries()) {
				if (target && pokemon !== target) {
					target.gotAttacked(move, moveDamage[i] as number | false | undefined, pokemon);
					if (typeof moveDamage[i] === 'number') {
						target.timesAttacked += move.smartTarget ? 1 : hit - 1;
					}
				}
			}

			if (move.ohko && !targets[0].hp) this.battle.add('-ohko');

			if (!damage.some(val => !!val || val === 0)) return damage;

			this.battle.eachEvent('Update');

			this.afterMoveSecondaryEvent(targetsCopy.filter(val => !!val), pokemon, move);

			if (!(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
				for (const [i, d] of damage.entries()) {
					// There are no multihit spread moves, so it's safe to use move.totalDamage for multihit moves
					// The previous check was for `move.multihit`, but that fails for Dragon Darts
					const curDamage = targets.length === 1 ? move.totalDamage : d;
					if (typeof curDamage === 'number' && targets[i].hp) {
						const targetHPBeforeDamage = (targets[i].hurtThisTurn || 0) + curDamage;
						if (targets[i].hp <= targets[i].maxhp / 2 && targetHPBeforeDamage > targets[i].maxhp / 2) {
							this.battle.runEvent('EmergencyExit', targets[i], pokemon);
						}
					}
				}
			}

			return damage;
		},
	},
};
