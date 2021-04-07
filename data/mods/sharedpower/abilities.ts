export const Abilities: {[k: string]: ModdedAbilityData} = {
	mirrorarmor: {
		inherit: true,
		onBoost(boost, target, source, effect) {
			// Don't bounce self stat changes, or boosts that have already bounced
			if (target === source || !boost || effect.id === 'mirrorarmor' || effect.id === 'ability:mirrorarmor') return;
			let b: BoostID;
			for (b in boost) {
				if (boost[b]! < 0) {
					if (target.boosts[b] === -6) continue;
					const negativeBoost: SparseBoostsTable = {};
					negativeBoost[b] = boost[b];
					delete boost[b];
					this.add('-ability', target, 'Mirror Armor');
					this.boost(negativeBoost, source, target, null, true);
				}
			}
		},
	},
	trace: {
		inherit: true,
		onUpdate(pokemon) {
			if (!pokemon.isStarted || this.effectData.gaveUp) return;
			const isAbility = pokemon.ability === 'trace';

			const additionalBannedAbilities = [
				// Zen Mode included here for compatability with Gen 5-6
				'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'zenmode',
			];
			const possibleTargets = pokemon.adjacentFoes().filter(target => (
				!target.getAbility().isPermanent && !additionalBannedAbilities.includes(target.ability)
			));
			if (!possibleTargets.length) return;

			const target = this.sample(possibleTargets);
			const ability = target.getAbility();
			this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile('ability:trace');
				pokemon.addVolatile('ability:' + ability.id, pokemon);
			}
		},
	},
};
