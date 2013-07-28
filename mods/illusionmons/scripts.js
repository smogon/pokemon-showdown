exports.BattleScripts = {
  gen: 3,
	init: function() {
		for (var i in this.data.Pokedex) {
		delete this.data.Pokedex[i].abilities['DW'];
  		delete this.data.Pokedex[i].abilities['DW'];
  		delete this.data.Pokedex[i].abilities['DW'];
		this.modData('Pokedex').learnset.hurricane = ['5L100'];  		
		}
	},
};
