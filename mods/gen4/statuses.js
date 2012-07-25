exports.BattleStatuses = {
	par: {
		inherit: true,
		onBeforeMove: function(pokemon) {
			if (this.random(4) === 0 && pokemon.ability !== 'magicguard') {
				this.add('cant', pokemon.id, 'par');
				return false;
			}
		}
	}
};