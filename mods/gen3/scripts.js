exports.BattleScripts = {
	inherit: 'gen5',
	gen: 3,
	init: function() {
		for (var i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['H'];
		}
	},
	getCategory: function(move) {
		move = this.getMove(move);
		if (!(move.category in {'Special':1,'Physical':1})) return move.category;
		// overwrite categories
		var specialTypes = {Fire:1, Water:1, Grass:1, Ice:1, Electric:1, Dark:1, Psychic:1, Dragon:1};
		return specialTypes[move.type]? 'Special' : 'Physical';
	}
};
