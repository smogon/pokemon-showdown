export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen5',
	gen: 4,

	actions: {
		inherit: true,
		runSwitch(pokemon) {
			this.battle.runEvent('EntryHazard', pokemon);

			this.battle.runEvent('SwitchIn', pokemon);

			if (this.battle.gen <= 2) {
				// pokemon.lastMove is reset for all Pokemon on the field after a switch. This affects Mirror Move.
				for (const poke of this.battle.getAllActive()) poke.lastMove = null;
				if (!pokemon.side.faintedThisTurn && pokemon.draggedIn !== this.battle.turn) {
					this.battle.runEvent('AfterSwitchInSelf', pokemon);
				}
			}
			if (!pokemon.hp) return false;
			pokemon.isStarted = true;
			if (!pokemon.fainted) {
				this.battle.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
				this.battle.singleEvent('Start', pokemon.getItem(), pokemon.itemState, pokemon);
			}
			if (this.battle.gen === 4) {
				for (const foeActive of pokemon.foes()) {
					foeActive.removeVolatile('substitutebroken');
				}
			}
			pokemon.draggedIn = null;
			return true;
		},
		modifyDamage(baseDamage, pokemon, target, move, suppressMessages = false) {
			// DPP divides modifiers into several mathematically important stages
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
			if (move.spreadHit) {
				const spreadModifier = move.spreadModifier || (this.battle.gameType === 'freeforall' ? 0.5 : 0.75);
				this.battle.debug(`Spread modifier: ${spreadModifier}`);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			}

			// Weather
			baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

			baseDamage += 2;

			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = this.battle.modify(baseDamage, move.critModifier || 2);
			}

			// Mod 2 (Damage is floored after all multipliers are in)
			baseDamage = Math.floor(this.battle.runEvent('ModifyDamagePhase2', pokemon, target, move, baseDamage));

			// this is not a modifier
			baseDamage = this.battle.randomizer(baseDamage);

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

			if (!Math.floor(baseDamage)) {
				return 1;
			}

			return Math.floor(baseDamage);
		},
		hitStepInvulnerabilityEvent(targets, pokemon, move) {
			const hitResults = this.battle.runEvent('Invulnerability', targets, pokemon, move);
			for (const [i, target] of targets.entries()) {
				if (hitResults[i] === false) {
					if (!move.spreadHit) this.battle.attrLastMove('[miss]');
					this.battle.add('-miss', pokemon, target);
				}
			}
			return hitResults;
		},
		hitStepAccuracy(targets, pokemon, move) {
			const hitResults = [];
			for (const [i, target] of targets.entries()) {
				this.battle.activeTarget = target;
				// calculate true accuracy
				let accuracy = move.accuracy;
				if (move.ohko) { // bypasses accuracy modifiers
					if (!target.isSemiInvulnerable()) {
						if (pokemon.level < target.level) {
							this.battle.add('-immune', target, '[ohko]');
							hitResults[i] = false;
							continue;
						}
						accuracy = 30 + pokemon.level - target.level;
					}
				} else {
					const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];

					let boosts;
					let boost!: number;
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
				}
				if (move.alwaysHit) {
					accuracy = true; // bypasses ohko accuracy modifiers
				} else {
					accuracy = this.battle.runEvent('Accuracy', target, pokemon, move, accuracy);
				}
				if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) {
					if (!move.spreadHit) this.battle.attrLastMove('[miss]');
					this.battle.add('-miss', pokemon, target);
					hitResults[i] = false;
					continue;
				}
				hitResults[i] = true;
			}
			return hitResults;
		},
		spreadMoveHit(targets, pokemon, move, hitEffect, isSecondary, isSelf) {
			// https://www.smogon.com/forums/threads/past-gens-research-thread.3506992/page-11#post-9880360
			if (this.battle.gen < 4) {
				return this.spreadMoveHitInner(targets, pokemon, move, hitEffect, isSecondary, isSelf);
			}
			const targetsEntries = Array.from(targets.slice(0).entries());
			this.battle.speedSort(targetsEntries as [number, Pokemon][], (a, b) => this.battle.comparePriority(a[1], b[1]));
			const spreadMoveDamage: SpreadMoveDamage = [];
			const spreadMoveTarget: SpreadMoveTargets = [];
			// moves hit and apply effects one target at a time in speed order
			for (const [_, target] of targetsEntries) {
				// spread moves hit for 100% of the damage if there is only one target left and all the other targets have fainted
				// if the move hits all adjacent Pokemon, the threshold is 2 targets counting the user
				if (move.spreadHit && (
					(move.target === 'allAdjacentFoes' && targets.filter(t => t && !t.fainted).length <= 1) ||
					(move.target === 'allAdjacent' && targets.concat(pokemon).filter(t => t && !t.fainted).length <= 2)
				)) {
					move.spreadModifier = 1;
				}
				const [d, t] = this.spreadMoveHitInner([target], pokemon, move, hitEffect, isSecondary, isSelf);
				spreadMoveDamage.push(d[0]);
				spreadMoveTarget.push(t[0]);
				this.battle.faintMessages(false, false, !pokemon.hp);
				// There are no spread moves with recoil
				if (move.recoil && d[0]) {
					this.battle.damage(this.calcRecoilDamage(d[0] as number, move, pokemon), pokemon, target as Pokemon, 'recoil');
				}
				this.battle.faintMessages();
			}
			// Sort the targets back to the original order
			for (const [i, [j, _]] of targetsEntries.entries()) {
				const auxDamage = spreadMoveDamage[i];
				spreadMoveDamage[i] = spreadMoveDamage[j];
				spreadMoveDamage[j] = auxDamage;
				const auxTarget = spreadMoveTarget[i];
				spreadMoveTarget[i] = spreadMoveTarget[j];
				spreadMoveTarget[j] = auxTarget;
			}
			return [spreadMoveDamage, spreadMoveTarget];
		},
		calcRecoilDamage(damageDealt, move) {
			return this.battle.clampIntRange(Math.floor(damageDealt * move.recoil![0] / move.recoil![1]), 1);
		},
	},
};
