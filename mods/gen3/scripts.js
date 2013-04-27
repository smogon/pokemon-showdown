exports.BattleScripts = {
	gen: 3,
	init: function() {
		for (var i in this.data.Pokedex) {
			this.modData('Pokedex', i);
			var template = this.getTemplate(i);
			if (template.gen > 3) template.isNonstandard = true;
			delete template.abilities['DW'];
		}
		for (var i in this.data.Movedex) {
			var move = this.getMove(i);
			if (move.gen > 3) {
				this.modData('Movedex', i).isNonstandard = true;
			}
		}
		for (var i in this.data.Abilities) {
			var ability = this.getAbility(i);
			if (ability.gen > 3) {
				this.modData('Abilities', i).isNonstandard = true;
			}
		}
		for (var i in this.data.Items) {
			var item = this.getItem(i);
			if (item.gen > 3) {
				this.modData('Items', i).isNonstandard = true;
			}
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
