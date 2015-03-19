exports.BattleScripts = {
	init: function () {
		for (var i in this.data.Pokedex) {
			var tier = null;
			var adjustment = 0;

			if (this.data.FormatsData[i]) tier = this.data.FormatsData[i].tier;
			if (!tier && this.data.Pokedex[i].baseSpecies) tier = this.data.FormatsData[toId(this.data.Pokedex[i].baseSpecies)].tier;

			switch (tier) {
			case 'UU':
			case 'BL2':
				adjustment = 5;
				break;
			case 'RU':
			case 'BL3':
				adjustment = 10;
				break;
			case 'NU':
			case 'BL4':
			case 'PU':
			case 'NFE':
			case 'LC Uber':
			case 'LC':
				adjustment = 15;
			}

			if (adjustment) {
				for (var j in this.data.Pokedex[i].baseStats) {
					this.modData('Pokedex', i).baseStats[j] = this.clampIntRange(this.data.Pokedex[i].baseStats[j] + adjustment, 1, 255);
				}
			}
		}
	}
};
