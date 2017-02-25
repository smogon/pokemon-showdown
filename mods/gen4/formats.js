exports.BattleFormats = {
	pokemon: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;
			// Arceus
			if (template.num == 493) {
				if (set.ability === 'Multitype' && item.onPlate) {
					set.species = 'Arceus-'+item.onPlate;
				} else {
					set.species = 'Arceus';
				}
				for (var i in set.evs) {
					if (set.evs[i] > 100) {
						problems.push('Arceus can only have a max of 100 EV on each stat and its current ' + i + ' has ' + set.evs[i] + '.');
					}
				}
			}
			if (template.num == 487) { // Giratina
				if (item.id === 'griseousorb') {
					set.species = 'Giratina-Origin';
					if (format.banlistTable && format.banlistTable['illegal']) set.ability = 'Levitate';
				} else {
					set.species = 'Giratina';
					if (format.banlistTable && format.banlistTable['illegal']) set.ability = 'Pressure';
				}
			}
			if (template.num == 351) { // Castform
				set.species = 'Castform';
			}
			if (template.num == 421) { // Cherrim
				set.species = 'Cherrim';
			}
			if (template.isNonstandard) {
				problems.push(set.species+' is not a real Pokemon.');
			}
			if (set.ability) {
				var ability = this.getAbility(set.ability);
				if (ability.isNonstandard) {
					problems.push(ability.name+' is not a real ability.');
				}
			}
			if (set.moves) for (var i=0; i<set.moves.length; i++) {
				var move = this.getMove(set.moves[i]);
				if (move.isNonstandard) {
					problems.push(move.name+' is not a real move.');
				}
			}
			if (item && item.isNonstandard) problems.push(item.name+' is not a real item.');
			
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name||set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name||set.species) + ' is higher than level 100.');
			}
			return problems;
		}
	}
};
