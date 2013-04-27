exports.BattleScripts = {
	gen: 4,
	init: function() {
		for (var i in this.data.Learnsets) {
			this.modData('Learnsets', i);
			var learnset = this.data.Learnsets[i].learnset;
			for (var moveid in learnset) {
				if (typeof learnset[moveid] === 'string') learnset[moveid] = [learnset[moveid]];
				learnset[moveid] = learnset[moveid].filter(function(source) {
					return source[0] !== '5';
				});
				if (!learnset[moveid].length) delete learnset[moveid];
			}
		}
		for (var i in this.data.Pokedex) {
			this.modData('Pokedex', i);
			var template = this.getTemplate(i);
			if (template.gen > 4) template.isNonstandard = true;
			delete template.abilities['DW'];
		}
		for (var i in this.data.Movedex) {
			var move = this.getMove(i);
			if (move.gen > 4) {
				this.modData('Movedex', i).isNonstandard = true;
			}
		}
		for (var i in this.data.Abilities) {
			var ability = this.getAbility(i);
			if (ability.gen > 4) {
				this.modData('Abilities', i).isNonstandard = true;
			}
		}
		for (var i in this.data.Items) {
			var item = this.getItem(i);
			if (item.gen > 4) {
				this.modData('Items', i).isNonstandard = true;
			}
		}
	}
}
