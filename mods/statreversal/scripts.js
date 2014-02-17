exports.BattleScripts = {
	init: function() {
		for (var i in this.data.Pokedex) {
			this.modData('Pokedex', i).baseStats = {
				hp: this.data.Pokedex[i].baseStats.spe,
				atk: this.data.Pokedex[i].baseStats.def,
				def: this.data.Pokedex[i].baseStats.atk,
				spa: this.data.Pokedex[i].baseStats.spd,
				spd: this.data.Pokedex[i].baseStats.spa,
				spe: this.data.Pokedex[i].baseStats.hp
			};
		}
	}
};
