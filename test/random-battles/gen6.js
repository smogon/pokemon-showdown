/**
 * Tests for Gen 6 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testNotBothMoves, testAlwaysHasMove, testHiddenPower, testSet} = require('./tools');

describe('[Gen 6] Random Battle', () => {
	const options = {format: 'gen6randombattle'};

	it('should not select Air Slash and Hurricane together', () => {
		testNotBothMoves('swanna', options, 'hurricane', 'airslash');
	});

	it('should enforce STAB properly', () => {
		testAlwaysHasMove('hariyama', options, 'closecombat');
		testAlwaysHasMove('rapidash', options, 'flareblitz');
	});

	it('should only give Drifblim only one Ghost-type attack', () => {
		testSet('drifblim', options, set => {
			assert.equal(set.moves.filter(m => {
				const move = Dex.moves.get(m);
				return move.type === 'Ghost' && move.category !== 'Status';
			}).length, 1, `got ${JSON.stringify(set.moves)}`);
		});
	});

	it('should prevent double Hidden Power', () => testHiddenPower('thundurustherian', options));

	it('should always give Mega Glalie Return', () => testAlwaysHasMove('glaliemega', options, 'return'));
});
