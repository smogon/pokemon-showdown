export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	actions: {
		inherit: true,
		canUltraBurst(pokemon: Pokemon) {
			if (['Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane'].includes(pokemon.baseSpecies.name) &&
				pokemon.getItem().id === 'ultranecroziumz') {
				return "Necrozma-Ultra";
			// Asriel Ultra Burst
			} else if (pokemon.baseSpecies.name === 'Asriel' && pokemon.getItem().id === 'soulcollective') {
				return "Asriel-Hyperdeath";
			}
			return null;
		},
		modifyDamage(
			baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages = false
		) {
			const tr = this.battle.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;

			baseDamage += 2;

			if (move.spreadHit) {
			// multi-target modifier (doubles only)
				const spreadModifier = move.spreadModifier || (this.battle.gameType === 'freeforall' ? 0.5 : 0.75);
				this.battle.debug(`Spread modifier: ${spreadModifier}`);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			} else if (move.multihitType === 'parentalbond' && move.hit > 1) {
			// Parental Bond modifier
				const bondModifier = this.battle.gen > 6 ? 0.25 : 0.5;
				this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
				baseDamage = this.battle.modify(baseDamage, bondModifier);
			// Reverberate modifier
			// @ts-expect-error custom
			} else if (move.multihitType === 'reverberate' && move.hit > 1) {
				this.battle.debug('Reverberate Modifier: 0.5');
				baseDamage = this.battle.modify(baseDamage, 0.5);
			}
			// weather modifier
			baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

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
				if (!suppressMessages) this.battle.add('-supereffective', target);

				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target);

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

			if (move.isZOrMaxPowered && target.getMoveHitData(move).bypassProtect) {
				baseDamage = this.battle.modify(baseDamage, 0.25);
				this.battle.add('-zbroken', target);
			}

			// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
			if (this.battle.gen !== 5 && !baseDamage) return 1;

			// ...but 16-bit truncation happens even later, and can truncate to 0
			return tr(baseDamage, 16);
		},
		hitStepAccuracy(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
			const hitResults = [];
			for (const [i, target] of targets.entries()) {
				this.battle.activeTarget = target;
				// calculate true accuracy
				let accuracy = move.accuracy;
				if (move.ohko && move.id !== 'blackknife') { // bypasses accuracy modifiers
					if (!target.isSemiInvulnerable()) {
						accuracy = 30;
						if (move.ohko === 'Ice' && this.battle.gen >= 7 && !pokemon.hasType('Ice')) {
							accuracy = 20;
						}
						if (!target.volatiles['dynamax'] && pokemon.level >= target.level &&
							(move.ohko === true || !target.hasType(move.ohko))) {
							accuracy += (pokemon.level - target.level);
						} else {
							this.battle.add('-immune', target, '[ohko]');
							hitResults[i] = false;
							continue;
						}
					}
				} else {
					accuracy = this.battle.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
					if (accuracy !== true) {
						let boost = 0;
						if (!move.ignoreAccuracy) {
							const boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, { ...pokemon.boosts });
							boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
						}
						if (!move.ignoreEvasion) {
							const boosts = this.battle.runEvent('ModifyBoost', target, null, null, { ...target.boosts });
							boost = this.battle.clampIntRange(boost - boosts['evasion'], -6, 6);
						}
						if (boost > 0) {
							accuracy = this.battle.trunc(accuracy * (3 + boost) / 3);
						} else if (boost < 0) {
							accuracy = this.battle.trunc(accuracy * 3 / (3 - boost));
						}
					}
				}
				if (move.alwaysHit || (move.id === 'toxic' && this.battle.gen >= 8 && pokemon.hasType('Poison')) ||
					(move.target === 'self' && move.category === 'Status' && !target.isSemiInvulnerable())) {
					accuracy = true; // bypasses ohko accuracy modifiers
				} else {
					accuracy = this.battle.runEvent('Accuracy', target, pokemon, move, accuracy);
				}
				if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) {
					if (move.smartTarget) {
						move.smartTarget = false;
					} else {
						if (!move.spreadHit) this.battle.attrLastMove('[miss]');
						this.battle.add('-miss', pokemon, target);
					}
					if (!move.ohko && pokemon.hasItem('blunderpolicy') && pokemon.useItem()) {
						this.battle.boost({ spe: 2 }, pokemon);
					}
					hitResults[i] = false;
					continue;
				}
				hitResults[i] = true;
			}
			return hitResults;
		},
	},
};
