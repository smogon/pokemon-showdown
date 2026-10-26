export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	trace: {
		inherit: true,
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;
			const isAbility = pokemon.ability === 'trace';

			const possibleTargets = pokemon.adjacentFoes().filter(
				defender => !defender.getAbility().flags['notrace'] && defender.ability !== 'noability'
			);
			if (!possibleTargets.length) return;

			const defender = this.sample(possibleTargets);
			const ability = defender.getAbility();

			if (isAbility) {
				if (pokemon.setAbility(ability)) {
					this.add('-ability', pokemon, ability, '[from] ability: Trace', `[of] ${defender}`);
				}
			} else {
				pokemon.removeVolatile('ability:trace');
				pokemon.addVolatile('ability:' + ability.id, pokemon);
				this.add('-ability', pokemon, ability, '[from] ability: Trace', `[of] ${defender}`);
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
			for (const defender of this.getAllActive()) {
				if (defender.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), defender.abilityState, defender, pokemon, 'neutralizinggas');
				}
				if (defender.volatiles['slowstart']) {
					delete defender.volatiles['slowstart'];
					this.add('-end', defender, 'Slow Start', '[silent]');
				}
				if (defender.m.pokemove && !this.dex.abilities.get(defender.m.pokemove.abilities['0']).flags['cantsuppress']) {
					defender.removeVolatile('ability:' + this.toID(defender.m.pokemove.abilities['0']));
				}
			}
		},
		onEnd(attacker) {
			this.add('-end', attacker, 'ability: Neutralizing Gas');

			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If you're tackling this, do note extreme weathers have the same issue)

			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			if (attacker.abilityState.ending) return;
			attacker.abilityState.ending = true;
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) {
				if (pokemon !== attacker) {
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
