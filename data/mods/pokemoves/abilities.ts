export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	trace: {
		inherit: true,
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;
			const isAbility = pokemon.ability === 'trace';

			const possibleTargets = pokemon.adjacentFoes().filter(
				target => !target.getAbility().flags['notrace'] && target.ability !== 'noability'
			);
			if (!possibleTargets.length) return;

			const target = this.sample(possibleTargets);
			const ability = target.getAbility();

			if (isAbility) {
				if (pokemon.setAbility(ability)) {
					this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
				}
			} else {
				pokemon.removeVolatile('ability:trace');
				pokemon.addVolatile('ability:' + ability.id, pokemon);
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
			}
		},
	},
	neutralizinggas: {
		inherit: true,
		// Ability suppression implemented in sim/pokemon.ts:Pokemon#ignoringAbility
		onSwitchIn(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			// Remove setter's innates before the ability starts
			for (const target of this.getAllActive()) {
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (target.m.pokemove && !this.dex.abilities.get(target.m.pokemove.abilities['0']).flags['cantsuppress']) {
					target.removeVolatile('ability:' + this.toID(target.m.pokemove.abilities['0']));
				}
			}
		},
		onEnd(source) {
			this.add('-end', source, 'ability: Neutralizing Gas');

			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If you're tackling this, do note extreme weathers have the same issue)

			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			if (source.abilityState.ending) return;
			source.abilityState.ending = true;
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) {
				if (pokemon !== source) {
					// Will be suppressed by Pokemon#ignoringAbility if needed
					this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
				}
				if (pokemon.m.pokemove && !pokemon.volatiles['ability:' + this.toID(pokemon.m.pokemove.abilities['0'])]) {
					pokemon.addVolatile('ability:' + this.toID(pokemon.m.pokemove.abilities['0']), pokemon);
				}
			}
		},
	},
};
