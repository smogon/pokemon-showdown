var assert = require('assert');

function _generatePossibleSets(set, moves, result) {
	if (set.moves.length === moves.length) {
		var setClone = Object.create(set);
		setClone.moves = moves;
		result.push(setClone);
		return;
	}
	var permutationMoves = set.moves[moves.length];
	for (var i = 0; i < permutationMoves.length; i++) {
		var move = permutationMoves[i];
		var movesClone = moves.slice();
		movesClone.push(move);
		_generatePossibleSets(set, movesClone, result);
	}
}

function generatePossibleSets(set) {
	var result = [];
	_generatePossibleSets(set, [], result);
	return result;
}

describe('TeamValidator', function () {
	describe('validateTeamSync', function () {
		var factorySets = require('./../../data/factory-sets.json');
		for (var format in factorySets) {
			var formatSets = factorySets[format];
			var formatId = format.toLowerCase();
			if (formatId === 'uber') {
				formatId = 'ubers';
			}
			for (var specie in formatSets) {
				var baseSets = formatSets[specie].sets;
				for (var i = 0; i < baseSets.length; i++) {
					var sets = generatePossibleSets(baseSets[i]);
					for (var j = 0; j < sets.length; j++) {
						var set = sets[j];
						var message = "handles Battle Factory's " + format + " " + set.species + " set " + i + ", permutation " + j;
						it(message, function (set, formatId) {
							// This fixes Xerneas' validation message, as no
							// IVs are replaced with 31 in BattlePokemon constructor.
							var stats = ['hp', 'atk', 'def', 'spe', 'spa', 'spd'];
							for (var i = 0; i < stats.length; i++) {
								var stat = stats[i];
								if (!set.ivs) {
									set.ivs = {};
								}
								if (set.ivs[stat] === undefined) {
									set.ivs[stat] = 31;
								}
							}
							var validation = TeamValidator.validateTeamSync(formatId, [set]);
							assert.strictEqual(validation, false);
						}.bind(undefined, set, formatId));
					}
				}
			}
		}

		it('handles simple illegal sets', function () {
			var legitTeam = [
				{
					species: 'Magikarp',
					gender: '',
					item: 'Leftovers',
					ability: 'Prankster',
					evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
					nature: 'Adamant',
					moves: ['Dark Void']
				}
			];
			var validation = TeamValidator.validateTeamSync('ou', legitTeam);
			assert.deepEqual(validation, [
				"Magikarp can't have Prankster.",
				"Magikarp can't learn Dark Void."
			]);
		});
	});
});
