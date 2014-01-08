exports.BattleAbilities = {
	arenatrap: {
		inherit: true,
		onFoeModifyPokemon: function(pokemon) {
			if (!pokemon.hasType('Flying') && pokemon.runImmunity('Ground', false)) {
				pokemon.tryTrap();
			}
		},
		onFoeMaybeTrapPokemon: function(pokemon) {
			if (!pokemon.hasType('Flying') && pokemon.runImmunity('Ground', false)) {
				pokemon.maybeTrapped = true;
			}
		}
	}
};
