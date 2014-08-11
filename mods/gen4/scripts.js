exports.BattleScripts = {
	inherit: 'gen5',
	gen: 4,
	init: function () {
		for (var i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['H'];
		}
	}
};
