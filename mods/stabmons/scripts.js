exports.BattleScripts = {
	init: function() {
		for (var i in this.data.Learnsets) {
			for (var n in this.data.Movedex) {
				if (this.data.Movedex[n].id !== 'sketch') {
					for (var t in this.data.Pokedex[i].types) {
						if (this.data.Movedex[n].type === this.data.Pokedex[i].types[t]) {
							this.data.Learnsets[i].learnset[this.data.Movedex[n].id] = ["5L1"];
						}
					}
				}
			}
		}
	}
};