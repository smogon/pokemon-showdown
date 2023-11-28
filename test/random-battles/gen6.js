/**
 * Tests for Gen 6 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testNotBothMoves, testAlwaysHasMove, testHiddenPower, testSet} = require('./tools');

describe('[Gen 6] Random Battle', () => {
	const options = {format: 'gen6randombattle'};
	const dataJSON = require(`../../dist/data/mods/gen6/random-data.json`);
	const dex = Dex.forFormat(options.format);
	const generator = Teams.getGenerator(options.format);

	it('All moves on all sets should be obtainable (slow)', () => {
		const rounds = 500;
		for (const pokemon of Object.keys(dataJSON)) {
			const species = dex.species.get(pokemon);
			const data = dataJSON[pokemon];
			if (!data.moves || species.isNonstandard) continue;
			const remainingMoves = new Set(data.moves);
			for (let i = 0; i < rounds; i++) {
				// Test lead 1/6 of the time
				const set = generator.randomSet(species, {}, i % 6 === 0);
				for (const move of set.moves) remainingMoves.delete(move);
				if (!remainingMoves.size) break;
			}
			assert.false(remainingMoves.size,
				`The following moves on ${species.name} are unused: ${[...remainingMoves].join(', ')}`);
		}
	});

	it('should not give mega evolution abilities to base formes', () => {
		testSet('manectricmega', {rounds: 1, ...options}, set => {
			assert(set.ability !== 'Intimidate', 'Mega Manectric should not have Intimidate before it mega evolves');
		});
	});

	it('should not select Air Slash and Hurricane together', () => {
		testNotBothMoves('swanna', options, 'hurricane', 'airslash');
	});

	it('should enforce STAB properly', () => {
		testAlwaysHasMove('hariyama', options, 'closecombat');
		testAlwaysHasMove('rapidash', options, 'flareblitz');
	});

	it('should give Drifblim only one Ghost-type attack', () => {
		testSet('drifblim', options, set => {
			assert.equal(set.moves.filter(m => {
				const move = Dex.moves.get(m);
				return move.type === 'Ghost' && move.category !== 'Status';
			}).length, 1, `got ${JSON.stringify(set.moves)}`);
		});
	});

	it('should prevent double Hidden Power', () => testHiddenPower('thundurustherian', options));

	it('should always give Mega Glalie Return', () => testAlwaysHasMove('glaliemega', options, 'return'));

	it('should not give Ursaring Eviolite', () => {
		testSet('ursaring', options, set => assert.notEqual(set.item, 'Eviolite'));
	});

	it('should always give Quagsire Unaware', () => {
		testSet('quagsire', options, set => assert.equal(set.ability, 'Unaware'));
	});

	it('should always give Quagsire Recover', () => {
		testAlwaysHasMove('quagsire', options, 'recover');
	});

	it('should not give Raikou Volt Absorb', () => {
		testSet('raikou', options, set => assert.notEqual(set.ability, 'Volt Absorb'));
	});

	it('should not give Suicune Water Absorb', () => {
		testSet('suicune', options, set => assert.notEqual(set.ability, 'Water Absorb'));
	});

	it('should not give Entei Flash Fire', () => {
		testSet('entei', options, set => assert.notEqual(set.ability, 'Flash Fire'));
	});

	it('should only give Charizard one of Air Slash and Acrobatics', () => {
		testNotBothMoves('charizard', options, 'airslash', 'acrobatics');
	});
});
