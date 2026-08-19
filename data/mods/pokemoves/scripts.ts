export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	field: {
		suppressingWeather() {
			for (const pokemon of this.battle.getAllActive()) {
				const pokemove = pokemon.m.pokemove;
				if (pokemon && !pokemon.ignoringAbility() &&
					(pokemon.getAbility().suppressWeather ||
						(pokemove && pokemon.volatiles['ability:' + this.battle.toID(pokemove.abilities['0'])] &&
							this.battle.dex.abilities.get(pokemove.abilities['0']).suppressWeather))) {
					return true;
				}
			}
			return false;
		},
	},
	pokemon: {
		hasAbility(ability) {
			if (this.ignoringAbility()) return false;
			if (Array.isArray(ability)) return ability.some(abil => this.hasAbility(abil));
			const abilityid = this.battle.toID(ability);
			return this.ability === abilityid || !!this.volatiles['ability:' + abilityid];
		},
		ignoringAbility() {
			// Check if any active pokemon have the ability Neutralizing Gas
			let neutralizinggas = false;
			for (const pokemon of this.battle.getAllActive()) {
				// can't use hasAbility because it would lead to infinite recursion
				if (
					(pokemon.ability === ('neutralizinggas' as ID) || pokemon.volatiles['ability:neutralizinggas']) &&
					!pokemon.volatiles['gastroacid'] && !pokemon.abilityState.ending
				) {
					neutralizinggas = true;
					break;
				}
			}

			return !!(
				(this.battle.gen >= 5 && !this.isActive) ||
				((this.volatiles['gastroacid'] ||
					(neutralizinggas && (this.ability !== ('neutralizinggas' as ID) ||
						this.volatiles['ability:neutralizinggas'])
					)) && !this.getAbility().flags['cantsuppress']
				)
			);
		},
	},
};
