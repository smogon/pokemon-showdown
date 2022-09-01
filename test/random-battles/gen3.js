/**
 * Tests for Gen 3 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testSet, testAlwaysHasMove, testHiddenPower, testNotBothMoves, testTeam} = require('./tools');

describe('[Gen 3] Random Battle', () => {
	const options = {format: 'gen3randombattle'};

	it('should enforce STAB', () => {
		testSet('beautifly', options, set => assert(
			set.moves.some(m => m.startsWith('hiddenpower')),
			`bad Beautifly set: ${JSON.stringify(set.moves)} has no STAB`
		));

		testSet('lickitung', options, set => assert(
			set.moves.includes('return') || set.moves.includes('seismictoss'),
			`bad Lickitung set: ${JSON.stringify(set.moves)} has no STAB`
		));

		testAlwaysHasMove('delcatty', options, 'doubleedge');
	});

	it('should prevent double Hidden Power', () => {
		testHiddenPower('kingler', options);
		testHiddenPower('moltres', options);
	});

	it('should not give Magneton Sleep Talk without Rest', () => {
		testSet('magneton', options, set => {
			if (set.moves.includes('sleeptalk')) {
				assert(set.moves.includes('rest'), `bad Magneton set: ${JSON.stringify(set.moves)}`);
			}
		});
	});

	it('should give Blissey Soft-Boiled', () => {
		testSet('blissey', options, set => {
			assert(set.moves.includes('softboiled'), `bad Blissey set: ${JSON.stringify(set.moves)}`);
		});
	});

	it('should not give Registeel Sleep Talk and Protect', () => {
		testSet('registeel', options, set => {
			if (set.moves.includes('sleeptalk')) {
				assert(!set.moves.includes('protect'), `Registeel with Sleep Talk + Protect (${set.moves})`);
			}
		});
	});

	it('should not give Skarmory Roar + Sleep Talk', () => {
		testNotBothMoves('skarmory', options, 'roar', 'sleeptalk');
	});
});


describe('[Gen 3] Challenge Cup', () => {
	const options = {format: 'gen3challengecup', rounds: 500};
	const dex = Dex.forFormat(options.format);

	it('should not include any Fairy types', () => {
		testTeam(options, team => {
			for (const pkmn of team) {
				const types = dex.species.get(pkmn.species).types;
				assert(!types.includes('Fairy'), `Fairy type in Challenge Cup: ${pkmn.name}`);
			}
		});
	});

	it('should not include any new moves', () => {
		testTeam(options, team => {
			for (const pkmn of team) {
				for (const moveName of pkmn.moves) {
					const move = dex.moves.get(moveName);
					assert(move.gen <= 3, `New move in Challenge Cup: ${move.name}`);
				}
			}
		});
	});

	it('should not include any CAP Pokémon', () => {
		testTeam(options, team => {
			for (const pkmn of team) {
				const number = dex.species.get(pkmn.species).num;
				assert(number > 0, `CAP Pokémon in Challenge Cup: ${pkmn.name}`);
			}
		});
	});
});
