export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	actions: {
		hitStepAccuracy(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
			const hitResults = [];
			for (const [i, defender] of targets.entries()) {
				this.battle.activeTarget = defender;
				// calculate true accuracy
				let accuracy = move.accuracy;
				if (move.ohko) { // bypasses accuracy modifiers
					if (!defender.isSemiInvulnerable()) {
						accuracy = 30;
						if (move.ohko !== true) (move as any).ohko = pokemon.teraType;
						if (move.ohko === pokemon.teraType && this.battle.gen >= 7 && !pokemon.hasType(pokemon.teraType)) {
							accuracy = 20;
						}
						if (!defender.volatiles['dynamax'] && pokemon.level >= defender.level &&
							(move.ohko === true || !defender.hasType(move.ohko))) {
							accuracy += (pokemon.level - defender.level);
						} else {
							this.battle.add('-immune', defender, '[ohko]');
							hitResults[i] = false;
							continue;
						}
					}
				} else {
					accuracy = this.battle.runEvent('ModifyAccuracy', defender, pokemon, move, accuracy);
					if (accuracy !== true) {
						let boost = 0;
						if (!move.ignoreAccuracy) {
							const boosts = this.battle.runEvent('ModifyBoost', pokemon, null, null, { ...pokemon.boosts });
							boost = this.battle.clampIntRange(boosts['accuracy'], -6, 6);
						}
						if (!move.ignoreEvasion) {
							const boosts = this.battle.runEvent('ModifyBoost', defender, null, null, { ...defender.boosts });
							boost = this.battle.clampIntRange(boost - boosts['evasion'], -6, 6);
						}
						if (boost > 0) {
							accuracy = this.battle.trunc(accuracy * (3 + boost) / 3);
						} else if (boost < 0) {
							accuracy = this.battle.trunc(accuracy * 3 / (3 - boost));
						}
					}
				}
				if (
					move.alwaysHit || (move.id === 'toxic' && this.battle.gen >= 8 && pokemon.hasType(pokemon.teraType)) ||
					(move.defender === 'self' && move.category === 'Status' && !defender.isSemiInvulnerable())
				) {
					accuracy = true; // bypasses ohko accuracy modifiers
				} else {
					accuracy = this.battle.runEvent('Accuracy', defender, pokemon, move, accuracy);
				}
				if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) {
					if (move.smartTarget) {
						move.smartTarget = false;
					} else {
						if (!move.spreadHit) this.battle.attrLastMove('[miss]');
						this.battle.add('-miss', pokemon, defender);
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
