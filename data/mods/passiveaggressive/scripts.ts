export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	actions: {
		hitStepMoveHitLoop(targets, pokemon, move) { // Temporary name
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
							const boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, {...pokemon.boosts});
							const boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
							if (boost > 0) {
								accuracy *= boostTable[boost];
							} else {
								accuracy /= boostTable[-boost];
							}
						}
						if (!move.ignoreEvasion) {
							const boosts = this.battle.runEvent('ModifyBoost', target, null, null, {...target.boosts});
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
					move.totalDamage += damage[i] as number;
				}
				if (move.mindBlownRecoil) {
					const hpBeforeRecoil = pokemon.hp;
					const calc = calculate(this.battle, pokemon, pokemon, move.id);
					this.battle.damage(Math.round(calc * pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get(move.id), true);
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
			if (move.multihit && typeof move.smartTarget !== 'boolean') {
				this.battle.add('-hitcount', targets[0], hit - 1);
			}

			if ((move.recoil || move.id === 'chloroblast') && move.totalDamage) {
				const hpBeforeRecoil = pokemon.hp;
				const recoilDamage = this.calcRecoilDamage(move.totalDamage, move, pokemon);
				if (recoilDamage !== 1.1) this.battle.damage(recoilDamage, pokemon, pokemon, 'recoil');
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
				this.battle.directDamage(recoilDamage, pokemon, pokemon, {id: 'strugglerecoil'} as Condition);
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

			this.afterMoveSecondaryEvent(targetsCopy.filter(val => !!val) as Pokemon[], pokemon, move);

			if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
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
		calcRecoilDamage(damageDealt, move, pokemon): number {
			const calc = calculate(this.battle, pokemon, pokemon, move.id);
			if (calc === 0) return 1.1;
			if (move.id === 'chloroblast') return Math.round(calc * pokemon.maxhp / 2);
			const recoil = Math.round(damageDealt * calc * move.recoil![0] / move.recoil![1]);
			return this.battle.clampIntRange(recoil, 1);
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
