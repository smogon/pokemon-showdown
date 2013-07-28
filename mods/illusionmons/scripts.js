exports.BattleScripts = {
/** MAKE EVERY POKEMON HAVE ILLUSION **/	
	init: function() {
		for (var i in this.data.Pokedex) {
		this.modData('Pokedex').abilities['DW'] = 'Illusion';
		this.modData('Pokedex').abilities['0'] = 'Illusion';
		this.modData('Pokedex').abilities['1'] = 'Illusion';		
		}
	},
};
