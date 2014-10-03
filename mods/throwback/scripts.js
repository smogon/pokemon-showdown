exports.BattleScripts = {
	inherit: 'gen4',
	init: function () {
		for (var i in this.data.Pokedex) {
			var tier = '';
			var adjustment = 0;
			if (this.data.FormatsData[i]) tier = this.data.FormatsData[i].tier || this.data.FormatsData[toId(this.getTemplate(i).baseSpecies)].tier;
			switch (tier) {
			case 'BL':
			case 'UU':
				adjustment = 5;
				break;
			case 'BL2':
			case 'NU':
				adjustment = 10;
			}

			if (adjustment) {
				for (var j in this.data.Pokedex[i].baseStats) {
					this.modData('Pokedex', i).baseStats[j] = this.clampIntRange(this.data.Pokedex[i].baseStats[j] + adjustment, 1, 255);
				}
			}
		}
	}
};
