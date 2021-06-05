/**
 * Tests for Gen 6 randomized formats
 */
'use strict';

const {testNotBothMoves, testAlwaysHasMove, testHiddenPower} = require('./tools');

describe('[Gen 6] Random Battle', () => {
	const options = {format: 'gen6randombattle'};

	it('should not select Air Slash and Hurricane together', () => {
		testNotBothMoves('swanna', options, 'hurricane', 'airslash');
	});

	it('should enforce STAB properly', () => {
		testAlwaysHasMove('hariyama', options, 'closecombat');
		testAlwaysHasMove('rapidash', options, 'flareblitz');
	});

	it('should prevent double Hidden Power', () => testHiddenPower('thundurustherian', options));
});
