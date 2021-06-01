/**
 * Tests for Gen 6 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testNotBothMoves, testAlwaysHasMove, testSet} = require('./tools');

describe('[Gen 6] Random Battle', () => {
	const options = {format: 'gen6randombattle'};

	it('should not select Air Slash and Hurricane together', () => {
		testNotBothMoves('swanna', options, 'hurricane', 'airslash');
	});

	it('should enforce STAB properly', () => {
		testAlwaysHasMove('hariyama', options, 'closecombat');
		testAlwaysHasMove('rapidash', options, 'flareblitz');
	});

	it('should not give Thundurus-Therian two Hidden Power Flyings', () => {
		testSet('thundurustherian', options, set => {
			if (!set.moves.includes('hiddenpowerflying')) return;
			assert.equal(set.moves.filter(m => m.startsWith('hiddenpower')).length, 1);
		});
	});
});
