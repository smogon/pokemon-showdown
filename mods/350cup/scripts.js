exports.BattleScripts = {
	init: function() {
		for (var i in this.data.Pokedex) {
			if (Object.values(this.data.Pokedex[i].baseStats).sum() <= 350) {
				this.modData('Pokedex', i).baseStats['hp'] = this.data.Pokedex[i].baseStats['hp'] * 2;
				this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 2;
				this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['def'] * 2;
				this.modData('Pokedex', i).baseStats['spa'] = this.data.Pokedex[i].baseStats['spa'] * 2;
				this.modData('Pokedex', i).baseStats['spd'] = this.data.Pokedex[i].baseStats['spd'] * 2;
				this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 2;
			}
		}
		this.modData('Pokedex', 'shedinja').baseStats['hp'] = 1;
	}
};
