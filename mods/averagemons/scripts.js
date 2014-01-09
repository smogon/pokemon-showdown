exports.BattleScripts = {
	init: function() {
		for (var i in this.data.Pokedex) {
			this.modData('Pokedex', i).baseStats = {hp:100, atk:100, def:100, spa:100, spd:100, spe:100};
		}
	}
};
