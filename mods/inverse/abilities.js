exports.BattleAbilities = {
	arenatrap: {
		inherit: true,
		onFoeModifyPokemon: function(pokemon) {
			// The pokémon is trapped if it is not flying type nor levitating or is either of the previous but
			// it's holding an Iron Ball, there's Gravity on the field, or it's Ingrained
			if ((!pokemon.hasType('Flying') || (pokemon.item === 'ironball' || pokemon.battle.pseudoWeather.gravity
			|| pokemon.volatiles['ingrain'])) && pokemon.runImmunity('Ground', false)) {
				pokemon.tryTrap();
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon) {
			if ((!pokemon.hasType('Flying') || (pokemon.item === 'ironball' || pokemon.battle.pseudoWeather.gravity
			|| pokemon.volatiles['ingrain'])) && pokemon.runImmunity('Ground', false)) {
				pokemon.maybeTrapped = true;
			}
		}
	}
};
