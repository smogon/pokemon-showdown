exports.BattleScripts = {
	gen: 3,
	init: function() {
		for (var i in this.data.Learnsets) {
			this.modData('Learnsets', i);
			var learnset = this.data.Learnsets[i].learnset;
			for (var moveid in learnset) {
				if (typeof learnset[moveid] === 'string') learnset[moveid] = [learnset[moveid]];
				learnset[moveid] = learnset[moveid].filter(function(source) {
					return source[0] === '3';
				});
				if (!learnset[moveid].length) delete learnset[moveid];
			}
		}
		for (var i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['DW'];
		}
	},
	getCategory: function(move) {
		move = this.getMove(move);
		// overwrite categories
		var specialTypes = {Fire:1, Water:1, Grass:1, Ice:1, Electric:1, Dark:1, Psychic:1, Dragon:1};
		if (move.category === 'Status') return 'Status';
		return specialTypes[move.type]?'Special':'Physical';
	}
};
