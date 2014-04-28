exports.BattleFormats = {
	pokemon: {
		effectType: 'Banlist',
		validateSet: function (set, format) {
			var template = this.getTemplate(set.species);
			var problems = [];
			if (set.species === set.name) delete set.name;

			if (template.gen > this.gen) {
				problems.push(set.species + ' does not exist in gen ' + this.gen + '.');
			} else if (template.isNonstandard) {
				problems.push(set.species + ' is not a real Pokemon.');
			}
			if (set.moves) for (var i = 0; i < set.moves.length; i++) {
				var move = this.getMove(set.moves[i]);
				if (move.gen > this.gen) {
					problems.push(move.name + ' does not exist in gen ' + this.gen + '.');
				} else if (move.isNonstandard) {
					problems.push(move.name + ' is not a real move.');
				}
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name || set.species) + ' has more than four moves.');
			}

			// Let's manually delete items.
			set.item = '';

			// Automatically set ability to None
			set.ability = 'None';

			// In gen 1, there's no advantage on having subpar EVs and you could max all of them
			set.evs = {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255};

			// IVs worked different (DVs, 0 to 15, 2 points each) so we put all IVs to 30
			set.ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};

			// They also get a useless nature, since that didn't exist
			set.nature = 'Serious';

			// No shinies
			set.shiny = false;

			return problems;
		}
	}
};
