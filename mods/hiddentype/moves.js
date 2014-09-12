exports.BattleMovedex = {
	relicsong: {
		inherit: true,
		effect: {
			duration: 1,
			onAfterMoveSecondarySelf: function (pokemon, target, move) {
				if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
					this.add('-formechange', pokemon, 'Meloetta');
				} else if (pokemon.formeChange('Meloetta-Pirouette')) {
					this.add('-formechange', pokemon, 'Meloetta-Pirouette');
				}

				var type = pokemon.hpType || 'Dark';
				if (!pokemon.hasType(type)) pokemon.addType(type);

				pokemon.removeVolatile('relicsong');
			}
		}
	}
};
