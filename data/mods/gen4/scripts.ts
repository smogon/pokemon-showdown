export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen5',
	gen: 4,
	pokemon: {
		inherit: true,
		getActionSpeed() {
			let speed = this.getStat('spe', false, false);
			const trickRoomCheck = this.battle.ruleTable.has('twisteddimensionmod') ?
				!this.battle.field.getPseudoWeather('trickroom') : this.battle.field.getPseudoWeather('trickroom');
			if (trickRoomCheck) {
				speed = -speed;
			}
			return speed;
		},
	},
	checkFainted() {
		// Gen 4 requests replacements simultaneously for each side's fainted pokemon, one at a time
		for (const side of this.sides) {
			if (!this.canSwitch(side)) continue;
			for (const pokemon of side.active) {
				if (pokemon.fainted) {
					pokemon.status = 'fnt' as ID;
					pokemon.switchFlag = true;
					break;
				}
			}
		}
	},
	actions: {
		inherit: true,
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
			baseDamage = this.battle.priorityEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

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
		spreadMoveHitSteps(targets, pokemon, move, moveSteps) {
			// in Gen 4, moves hit and apply effects one target at a time in speed order
			const targetsCopy = targets.slice();
			this.battle.speedSort(targetsCopy);
			const hits = Array(targetsCopy.length).fill(true);
			// accumulate total damage separately since it is used internally
			let totalDamage = move.totalDamage;

			let atLeastOneFailure = false;
			for (const [i, target] of targetsCopy.entries()) {
				if (move.spreadHit) {
					/**
					 * Spread moves hit for 100% of the damage if:
					 * - the move hits all foes, but there is only one foe alive
					 * - the move hits all adjacent Pokemon, but there is only one Pokemon alive on the field,
					 *   including the attacker and not including the current target
					 */
					const spreadModifierTargets = move.target === 'allAdjacent' ?
						this.battle.getAllActive().filter(t => t && t !== target && t.hp) :
						pokemon.foes().filter(t => t && t.hp);
					if (spreadModifierTargets.length <= 1) move.spreadModifier = 1;
				}
				move.totalDamage = undefined;
				for (const step of moveSteps) {
					const hitResults: (number | boolean | "" | undefined)[] | undefined = step.call(this, [target], pokemon, move);
					if (!hitResults) continue;
					if (hitResults.length !== 1) {
						throw new Error(`Expected single target for step ${step.name} in spread move ${move.name}`);
					}
					atLeastOneFailure = atLeastOneFailure || hitResults[0] === false;
					if (move.smartTarget && atLeastOneFailure) move.smartTarget = false;
					if (!(hitResults[0] || hitResults[0] === 0)) {
						hits[i] = false;
						break;
					}
				}
				if (typeof move.totalDamage === 'number') totalDamage = (totalDamage || 0) + (move.totalDamage as number);
			}
			targets = targetsCopy.filter((_, i) => hits[i]);
			move.totalDamage = totalDamage;

			move.hitTargets = targets;
			const moveResult = !!targets.length;
			if (!moveResult && !atLeastOneFailure) pokemon.moveThisTurnResult = null;
			const hitSlot = targets.map(p => p.getSlot());
			if (move.spreadHit) this.battle.attrLastMove('[spread] ' + hitSlot.join(','));
			return moveResult;
		},
		applyRecoilDamage(damageDealt: number, move: Move, pokemon: Pokemon): number | null {
			let recoilDamage = 0;
			if (move.struggleRecoil) recoilDamage = this.battle.clampIntRange(Math.floor(pokemon.baseMaxhp / 4), 1);
			else if (move.mindBlownRecoil || move.chloroblastRecoil) recoilDamage = Math.round(pokemon.maxhp / 2);
			else if (move.recoil) {
				recoilDamage = this.battle.clampIntRange(Math.floor(damageDealt * move.recoil[0] / move.recoil[1]), 1);
			} else return null;

			if (move.struggleRecoil) {
				this.battle.directDamage(recoilDamage, pokemon, pokemon, { id: 'strugglerecoil' } as Condition);
			} else {
				const effect = move.mindBlownRecoil ? this.dex.conditions.get(move.name) : 'recoil';
				this.battle.damage(recoilDamage, pokemon, pokemon, effect);
			}
			return recoilDamage;
		},
	},
};
