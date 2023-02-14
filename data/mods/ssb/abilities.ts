export const Abilities: {[k: string]: ModdedAbilityData} = {
	/*
	// Example
	abilityid: {
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.ts
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// Aeonic
	changetempo: {
		desc: "Summons Trick Room on switch-in.",
		name: "Change Tempo",
		onStart(target) {
			if (!this.field.getPseudoWeather('trickroom')) {
				this.add('-ability', target, 'Change Tempo');
				this.field.addPseudoWeather('trickroom', target, target.getAbility());
			}
		},
		onChargeMove(pokemon, target, move) {
			this.attrLastMove('[still]');
			this.addMove('-anim', pokemon, move.name, target);
			return false;
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['mustrecharge']) pokemon.removeVolatile('mustrecharge');
		},
	},
};
